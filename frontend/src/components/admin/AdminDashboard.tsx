'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  created_at: string;
}

interface AdminDashboardProps {
  initialSubmissions: Submission[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
  stats: {
    total: number;
    today: number;
    week: number;
  };
}

export default function AdminDashboard({ 
  initialSubmissions, 
  initialNextCursor, 
  initialHasMore,
  stats 
}: AdminDashboardProps) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set(initialSubmissions.map(s => s.id)));

  const handleLoadMore = async () => {
    if (loadingMore || !nextCursor || !hasMore) return;

    setLoadingMore(true);
    setError('');

    try {
      const url = new URL('/api/admin/contact', window.location.origin);
      url.searchParams.set('limit', '20');
      if (nextCursor) url.searchParams.set('cursor', nextCursor);

      const response = await fetch(url.toString());
      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || 'Failed to load more submissions');
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to load more submissions');
      }

      const { submissions: newSubmissions, nextCursor: newCursor, hasMore: newHasMore } = result.data;

      // Filter out any duplicates based on ID
      const uniqueSubmissions = newSubmissions.filter((s: Submission) => !loadedIds.has(s.id));

      if (uniqueSubmissions.length === 0) {
        setHasMore(false);
        setNextCursor(null);
        return;
      }

      // Update loaded IDs to include new submissions
      setLoadedIds(prev => new Set([...prev, ...uniqueSubmissions.map((s: Submission) => s.id)]));

      // Append new submissions to existing ones
      setSubmissions(prev => [...prev, ...uniqueSubmissions]);
      setNextCursor(newCursor);
      setHasMore(newHasMore);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to load more submissions');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sign out.');
      }

      router.push('/admin/login');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/contact/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || 'Failed to delete submission');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete submission');
      }

      setSubmissions(submissions.filter(s => s.id !== id));
      setSelectedSubmission(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to delete submission');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (id: string, filenamePrefix = 'apex-submission') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/pdf/${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate PDF');
      }

      // API returns base64 PDF in JSON: { pdf: '<base64>', filename }
      const json = await res.json();
      if (!json || !json.pdf) throw new Error(json?.error || 'Invalid PDF response');

      const binary = atob(json.pdf);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `${filenamePrefix}-${id}-${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'PDF download failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="bg-bg-elevated border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-text-muted">ApeX Digital Studio</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-bg-elevated border border-white/10 rounded-lg p-6">
            <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
            <p className="text-text-muted">Total Submissions</p>
          </div>
          <div className="bg-bg-elevated border border-white/10 rounded-lg p-6">
            <h3 className="text-3xl font-bold text-white">{stats.today}</h3>
            <p className="text-text-muted">Today</p>
          </div>
          <div className="bg-bg-elevated border border-white/10 rounded-lg p-6">
            <h3 className="text-3xl font-bold text-white">{stats.week}</h3>
            <p className="text-text-muted">This Week</p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-bg-elevated border border-white/10 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Contact Submissions</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text-muted">No submissions yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-deep">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{submission.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text-muted">{submission.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text-muted">{submission.phone || "Not provided"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text-muted">{submission.company || "Not provided"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text-muted">{formatDate(submission.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-accent hover:text-accent/80 mr-4"
                          >
                            View
                          </button>
                          <button
                            onClick={() => downloadPdf(submission.id)}
                            className="text-white/90 hover:text-white/70 mr-4"
                          >
                            Download PDF
                          </button>
                          <button
                            onClick={() => handleDelete(submission.id)}
                            disabled={loading}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Load More Button */}
              {hasMore && (
                <div className="p-4 border-t border-white/10 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal for viewing submission details */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-elevated border border-white/10 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-text-muted hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
                <p className="text-white">{selectedSubmission.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                <p className="text-white">{selectedSubmission.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Phone Number</label>
                <p className="text-white">{selectedSubmission.phone || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Company / Brand</label>
                <p className="text-white">{selectedSubmission.company || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Message</label>
                <p className="text-white whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Submitted</label>
                <p className="text-white">{formatDate(selectedSubmission.created_at)}</p>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
              <a
                href={`mailto:${selectedSubmission.email}`}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Reply via Email
              </a>
              <button
                onClick={() => downloadPdf(selectedSubmission.id, 'apex-submission')}
                className="px-4 py-2 bg-accent/80 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Download PDF
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
