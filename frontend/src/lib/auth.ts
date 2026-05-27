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

    // If no admins exist yet, allow env-based admin emails for backward compatibility
    const { data: adminsList, error: listError } = await supabase
      .from('admins')
      .select('id')
      .limit(1);

    if (listError) {
      console.error('Error checking admins table:', listError);
      return false;
    }

    if (!adminsList || (Array.isArray(adminsList) && adminsList.length === 0)) {
      const adminEmailsRaw = process.env.SUPABASE_ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
      const adminEmails = adminEmailsRaw
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (currentUser.email && adminEmails.includes(currentUser.email.toLowerCase())) {
        return true;
      }
    }

    // Finally, if user provided an email but was not found above, check by email in admins table
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
