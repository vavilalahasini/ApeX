import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendContactNotificationEmails } from "@/lib/resend";
import { getTrustedClientIp } from "@/lib/rate-limiter";
import { captchaMiddleware, extractCaptchaToken } from "@/lib/captcha";
import { contactFormSchema } from "@/lib/validation/contact";
import type { ContactFormPayload } from "@/types";

// Simple in-memory rate limiter for contact form
const contactRateLimitStore = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS_PER_HOUR = 10;
const WINDOW_SECONDS = 60 * 60; // 1 hour

function checkContactRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = contactRateLimitStore.get(ip);

  if (!entry || entry.expiresAt <= now) {
    // No existing entry or window expired, allow request
    contactRateLimitStore.set(ip, { count: 1, expiresAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1, resetTime: now + WINDOW_SECONDS * 1000 };
  }

  if (entry.count >= MAX_REQUESTS_PER_HOUR) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: entry.expiresAt };
  }

  // Increment counter and allow request
  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - entry.count, resetTime: entry.expiresAt };
}

export async function POST(request: Request) {
  // Apply rate limiting using simple in-memory store
  const ip = getTrustedClientIp(request);
  const rateLimitResult = checkContactRateLimit(ip);

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later.", retryAfter },
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString(),
        },
      }
    );
  }

  const body = await request.json();

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Invalid form submission." },
      { status: 400 }
    );
  }

  const payload = parsed.data as ContactFormPayload;

  const captchaEnabled = process.env.CAPTCHA_ENABLED === "true";
  if (captchaEnabled) {
    const captchaToken = extractCaptchaToken(body, "captchaToken");
    const captchaConfig = {
      enabled: true,
      provider: (process.env.CAPTCHA_PROVIDER as "recaptcha" | "hcaptcha" | "turnstile") || "recaptcha",
      secretKey: process.env.CAPTCHA_SECRET_KEY,
      minScore: process.env.CAPTCHA_MIN_SCORE ? parseFloat(process.env.CAPTCHA_MIN_SCORE) : undefined,
    };

    const captchaResult = await captchaMiddleware(captchaToken, captchaConfig);
    if (!captchaResult.valid && captchaResult.response) {
      return captchaResult.response;
    }
  }

  const tableName = process.env.SUPABASE_CONTACT_TABLE || "contact_requests";

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const { error } = await supabaseAdmin.from(tableName).insert([
    {
      name: `${payload.firstName.trim()} ${payload.lastName.trim()}`,
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      message: payload.message.trim(),
    },
  ]);

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save contact request." },
      { status: 500 }
    );
  }

  try {
    await sendContactNotificationEmails(payload);
  } catch (sendError: unknown) {
    const message = sendError instanceof Error ? sendError.message : String(sendError);
    console.error('Contact notification email failed:', sendError);
    return NextResponse.json(
      { error: `Contact request saved, but email delivery failed: ${message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
