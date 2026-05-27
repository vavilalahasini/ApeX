import { supabaseAdmin } from "./supabase-server";

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  error?: string;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 5, // 5 requests per window
  windowMs: 60 * 60 * 1000, // 1 hour window
};

/**
 * Extract client IP address from request headers
 */
function getClientIp(request: Request): string {
  // Try various headers in order of reliability
  const headers = request.headers;
  
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }
  
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  // Fallback - this should rarely happen in production
  return "unknown";
}

/**
 * Clean up old rate limit records
 */
async function cleanupOldRateLimits(): Promise<void> {
  if (!supabaseAdmin) return;
  
  try {
    const { error } = await supabaseAdmin
      .from("rate_limits")
      .delete()
      .lt("window_start", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()); // 2 hours ago
    
    if (error) {
      console.error("Rate limit cleanup failed:", error);
    }
  } catch (error) {
    console.error("Rate limit cleanup error:", error);
  }
}

/**
 * Check if a request should be rate limited
 */
export async function checkRateLimit(
  request: Request,
  config: Partial<RateLimitConfig> = {}
): Promise<RateLimitResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const clientIp = getClientIp(request);
  
  if (!supabaseAdmin) {
    // If Supabase is not configured, allow the request but log a warning
    console.warn("Supabase not configured for rate limiting, allowing request");
    return {
      allowed: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests,
      resetTime: new Date(Date.now() + finalConfig.windowMs),
    };
  }

  try {
    // Periodically clean up old records (10% chance to avoid excessive cleanup calls)
    if (Math.random() < 0.1) {
      await cleanupOldRateLimits();
    }

    const now = new Date();
    const windowStart = new Date(Date.now() - finalConfig.windowMs);

    // Check existing rate limit record for this IP
    const { data: existingRecord, error: fetchError } = await supabaseAdmin
      .from("rate_limits")
      .select("*")
      .eq("ip_address", clientIp)
      .gte("window_start", windowStart.toISOString())
      .order("window_start", { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found", which is expected
      console.error("Rate limit check failed:", fetchError);
      return {
        allowed: true, // Fail open on database errors
        limit: finalConfig.maxRequests,
        remaining: finalConfig.maxRequests,
        resetTime: new Date(Date.now() + finalConfig.windowMs),
        error: "Rate limit check failed",
      };
    }

    if (!existingRecord) {
      // No existing record, create a new one
      const { error: insertError } = await supabaseAdmin.from("rate_limits").insert([
        {
          ip_address: clientIp,
          request_count: 1,
          window_start: now.toISOString(),
          last_request: now.toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Failed to create rate limit record:", insertError);
      }

      return {
        allowed: true,
        limit: finalConfig.maxRequests,
        remaining: finalConfig.maxRequests - 1,
        resetTime: new Date(now.getTime() + finalConfig.windowMs),
      };
    }

    // Check if the window has expired
    const recordWindowStart = new Date(existingRecord.window_start);
    const windowExpired = recordWindowStart.getTime() < windowStart.getTime();

    if (windowExpired) {
      // Window expired, reset the counter
      const { error: updateError } = await supabaseAdmin
        .from("rate_limits")
        .update({
          request_count: 1,
          window_start: now.toISOString(),
          last_request: now.toISOString(),
        })
        .eq("id", existingRecord.id);

      if (updateError) {
        console.error("Failed to reset rate limit counter:", updateError);
      }

      return {
        allowed: true,
        limit: finalConfig.maxRequests,
        remaining: finalConfig.maxRequests - 1,
        resetTime: new Date(now.getTime() + finalConfig.windowMs),
      };
    }

    // Check if limit exceeded
    if (existingRecord.request_count >= finalConfig.maxRequests) {
      return {
        allowed: false,
        limit: finalConfig.maxRequests,
        remaining: 0,
        resetTime: new Date(recordWindowStart.getTime() + finalConfig.windowMs),
      };
    }

    // Increment the counter
    const { error: incrementError } = await supabaseAdmin
      .from("rate_limits")
      .update({
        request_count: existingRecord.request_count + 1,
        last_request: now.toISOString(),
      })
      .eq("id", existingRecord.id);

    if (incrementError) {
      console.error("Failed to increment rate limit counter:", incrementError);
    }

    return {
      allowed: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests - existingRecord.request_count - 1,
      resetTime: new Date(recordWindowStart.getTime() + finalConfig.windowMs),
    };
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Fail open on unexpected errors
    return {
      allowed: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests,
      resetTime: new Date(Date.now() + finalConfig.windowMs),
      error: "Rate limiting error",
    };
  }
}

/**
 * Middleware function to check rate limits and return error response if exceeded
 */
export async function rateLimitMiddleware(
  request: Request,
  config?: Partial<RateLimitConfig>
): Promise<{ allowed: boolean; response?: Response }> {
  const result = await checkRateLimit(request, config);

  if (!result.allowed) {
    const response = new Response(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((result.resetTime.getTime() - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.resetTime.toUTCString(),
          "Retry-After": Math.ceil((result.resetTime.getTime() - Date.now()) / 1000).toString(),
        },
      }
    );

    return { allowed: false, response };
  }

  return { allowed: true };
}
