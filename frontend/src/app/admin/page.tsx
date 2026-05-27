import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { protectAdminRoute } from '@/lib/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Protect the route using secure cookie/session auth
  const auth = await protectAdminRoute();

  if (!auth.authorized) {
    redirect(auth.redirect || '/admin/login');
  }

  // Fetch dashboard data through a protected API route for admin operations.
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const origin = host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const response = await fetch(`${origin}/api/admin/contact?includeStats=true&limit=20`, {
    cache: 'no-store',
    headers: {
      cookie: headersList.get('cookie') ?? '',
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success || !result.data) {
    console.error('Error fetching admin dashboard data:', result.error || response.statusText);
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep px-4">
        <div className="max-w-xl w-full rounded-3xl bg-bg-elevated border border-white/10 p-10 text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Admin Dashboard</h1>
          <p className="text-text-muted mb-6">
            There was a problem loading contact submissions. Please check the server logs or your Supabase configuration.
          </p>
          <p className="text-sm text-text-muted">{result.error || 'Unknown error occurred.'}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      initialSubmissions={result.data.submissions}
      initialNextCursor={result.data.pagination?.nextCursor || null}
      initialHasMore={result.data.pagination?.hasMore || false}
      stats={result.data.stats}
    />
  );
}
