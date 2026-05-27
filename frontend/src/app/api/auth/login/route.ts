import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-auth';
import { isAdmin } from '@/lib/auth';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

interface LoginRequest {
  email: string;
  password: string;
}

function validatePayload(data: unknown): data is LoginRequest {
  if (typeof data !== 'object' || data === null) return false;
  const payload = data as Record<string, unknown>;
  return (
    typeof payload.email === 'string' && payload.email.trim() !== '' &&
    typeof payload.password === 'string' && payload.password.trim() !== ''
  );
}

export async function POST(request: Request) {
  // 1. Rate limit by IP first
  const ipRateLimit = await rateLimitMiddleware(request, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  });
  if (!ipRateLimit.allowed && ipRateLimit.response) {
    return ipRateLimit.response;
  }

  const body = await request.json();
  if (!validatePayload(body)) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const { email, password } = body;
  const normalizedEmail = email.trim().toLowerCase();

  // 2. Rate limit by Email identifier to prevent distributed brute-forcing of a single account
  const emailRateLimit = await rateLimitMiddleware(
    request,
    {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    `login-email:${normalizedEmail}`
  );
  if (!emailRateLimit.allowed && emailRateLimit.response) {
    return emailRateLimit.response;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: password.trim(),
  });

  // Generic authentication error message to prevent account enumeration
  const genericAuthError = 'Invalid email or password.';

  if (error || !data?.session) {
    return NextResponse.json({ error: genericAuthError }, { status: 401 });
  }

  // Check admin role in database (isAdmin is database-only now)
  const userForCheck = data.user
    ? {
        id: data.user.id ?? undefined,
        email: data.user.email ?? undefined,
      }
    : null;
  const adminCheck = await isAdmin(userForCheck);
  if (!adminCheck) {
    // Return same generic 401 error to avoid revealing if the user exists but is not an admin
    return NextResponse.json({ error: genericAuthError }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
