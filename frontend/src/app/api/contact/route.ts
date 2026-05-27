import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendContactNotificationEmails } from "@/lib/resend";
import { rateLimitMiddleware } from "@/lib/rate-limiter";
import { captchaMiddleware, extractCaptchaToken } from "@/lib/captcha";
import type { ContactFormPayload } from "@/types";

function validatePayload(data: unknown): data is ContactFormPayload {
  if (typeof data !== "object" || data === null) return false;
  const payload = data as Record<string, unknown>;

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "service",
    "message",
  ];

  for (const field of requiredFields) {
    if (typeof payload[field] !== "string" || payload[field].trim() === "") {
      return false;
    }
  }

  // Enhanced honeypot validation - check for hidden fields that bots might fill
  const honeypotFields = ["website", "phone2", "address", "fax"];
  for (const field of honeypotFields) {
    if (payload[field] && typeof payload[field] === "string" && payload[field].trim() !== "") {
      return false;
    }
  }

  // Check for suspicious HTML or BBCode spam patterns (not simple plain text URLs)
  const suspiciousPatterns = [
    /href\s*=/i,
    /<a\s+/i,
    /<script/i,
    /\[url\s*=/i,
    /\[link\s*=/i,
  ];

  const message = payload.message as string;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return false;
    }
  }

  // Count URLs to prevent link-bombing spam.
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const urls = message.match(urlRegex) || [];
  if (urls.length > 3) {
    return false; // Limit to max 3 URLs in a message
  }

  // Check for excessively long submissions (potential DoS)
  if (message.length > 5000) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  // Check rate limit before processing the request
  const rateLimitResult = await rateLimitMiddleware(request, {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  const body = await request.json();

  // Optional CAPTCHA validation (future-ready)
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

  if (!validatePayload(body)) {
    return NextResponse.json(
      { error: "Invalid form submission. Please fill in all required fields." },
      { status: 400 }
    );
  }

  const payload = body as ContactFormPayload;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(payload.email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const tableName = process.env.SUPABASE_CONTACT_TABLE || "contact_requests";

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY." },
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

  let emailSent = true;
  try {
    await sendContactNotificationEmails(payload);
  } catch (sendError: unknown) {
    console.error('Contact notification email failed:', sendError);
    emailSent = false;
  }

  if (!emailSent) {
    return NextResponse.json(
      { success: true, emailSent: false, queued: true },
      { status: 201 }
    );
  }

  return NextResponse.json({ success: true, emailSent: true }, { status: 201 });
}
