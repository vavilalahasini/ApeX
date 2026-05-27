import { createSupabaseServerClient } from '@/lib/supabase-server-auth';

// Check if user is authenticated
export async function getUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Check if user is admin by querying the `public.admins` table in Supabase.
// For backward compatibility, if the admins table is empty, fall back to the
// env-based allowlist (`SUPABASE_ADMIN_EMAILS` or `NEXT_PUBLIC_ADMIN_EMAILS`).
export async function isAdmin(user?: { id?: string; email?: string } | null) {
  const currentUser = user ?? (await getUser());
  if (!currentUser || (!currentUser.id && !currentUser.email)) return false;

  try {
    const supabase = await createSupabaseServerClient();

    // If we have a user id, check admins by user_id first
    if (currentUser.id) {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', currentUser.id)
        .limit(1)
        .maybeSingle();

      if (!error && data) return true;
    }

    // Check by email in admins table if the user has an email but wasn't matched by user_id
    if (currentUser.email) {
      const { data: byEmail, error: byEmailErr } = await supabase
        .from('admins')
        .select('id')
        .eq('email', currentUser.email.toLowerCase())
        .limit(1)
        .maybeSingle();

      if (!byEmailErr && byEmail) return true;
    }

    return false;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
}

// Protect admin routes - redirect if not authenticated or not admin
export async function protectAdminRoute() {
  const user = await getUser();
  if (!user) {
    return { authorized: false, redirect: '/admin/login' };
  }

  const admin = await isAdmin(user);
  if (!admin) {
    return { authorized: false, redirect: '/admin/unauthorized' };
  }

  return { authorized: true, user };
}

// Sign out
export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
