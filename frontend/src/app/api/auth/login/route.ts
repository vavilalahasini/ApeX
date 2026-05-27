import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-auth';
import { isAdmin } from '@/lib/auth';

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
  const body = await request.json();
  if (!validatePayload(body)) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const { email, password } = body;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });

  if (error || !data?.session) {
    const message = error?.message || 'Authentication failed.';
    return NextResponse.json({ error: message }, { status: 401 });
  }

  // Check admin role in database (isAdmin will fall back to env allowlist if no admins exist yet)
  const userForCheck = data.user
    ? {
        id: data.user.id ?? undefined,
        email: data.user.email ?? undefined,
      }
    : null;
  const adminCheck = await isAdmin(userForCheck);
  if (!adminCheck) {
    return NextResponse.json({ error: 'Unauthorized admin user.' }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
