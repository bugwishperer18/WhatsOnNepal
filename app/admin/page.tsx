'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES, NEPAL_CITIES, AdminScrapeRun } from '@/lib/types';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'create' | 'import' | 'debug'>('create');

  const router = useRouter();
  const supabase = createClient();

  // Create event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    venue_name: '',
    city: 'Kathmandu',
    address: '',
    category: 'other',
    organizer: '',
    image_url: '',
  });
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Import form state
  const [importMode, setImportMode] = useState<'ai' | 'scrape'>('ai');
  const [importCount, setImportCount] = useState(10);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Debug state
  const [lastRun, setLastRun] = useState<AdminScrapeRun | null>(null);
  const [debugLoading, setDebugLoading] = useState(false);

  // Auth diagnostics
  const [authDiagnostics, setAuthDiagnostics] = useState<any>(null);
  const [testingAuth, setTestingAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUser(user);

    const { data, error } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (error || !data) {
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    setLoading(false);
    fetchLastRun();
  };

  const fetchLastRun = async () => {
    setDebugLoading(true);
    const { data } = await supabase
      .from('admin_scrape_runs')
      .select('*')
      .order('ran_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLastRun(data);
    }
    setDebugLoading(false);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateSuccess(false);

    const { error } = await supabase.from('events').insert({
      ...eventForm,
      created_by: user.id,
    });

    setCreating(false);

    if (!error) {
      setCreateSuccess(true);
      setEventForm({
        title: '',
        description: '',
        start_at: '',
        end_at: '',
        venue_name: '',
        city: 'Kathmandu',
        address: '',
        category: 'other',
        organizer: '',
        image_url: '',
      });
      setTimeout(() => setCreateSuccess(false), 3000);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setImportResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setImportResult({
          ok: false,
          code: 'NO_SESSION',
          message: 'No active session. Please sign in again.',
        });
        setImporting(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/scrape-events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            mode: importMode,
            count: importCount,
          }),
        }
      );

      const result = await response.json();
      setImportResult(result);

      // Refresh last run
      await fetchLastRun();
    } catch (error: any) {
      setImportResult({
        ok: false,
        code: 'NETWORK_ERROR',
        message: error.message || 'Failed to call Edge Function',
      });
    }

    setImporting(false);
  };

  const testFunctionAuth = async () => {
    setTestingAuth(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setAuthDiagnostics({
          error: 'No session found',
          user_id: null,
          token: null,
        });
        setTestingAuth(false);
        return;
      }

      const tokenData = session.access_token
        ? JSON.parse(atob(session.access_token.split('.')[1]))
        : null;

      setAuthDiagnostics({
        user_id: user.id,
        token_issued_at: tokenData?.iat ? new Date(tokenData.iat * 1000).toISOString() : null,
        token_expires_at: tokenData?.exp ? new Date(tokenData.exp * 1000).toISOString() : null,
      });

      // Test function call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/scrape-events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            mode: 'ai',
            count: 1,
          }),
        }
      );

      const result = await response.json();

      setAuthDiagnostics((prev: any) => ({
        ...prev,
        test_result: {
          status: response.status,
          ok: response.ok,
          data: result,
        },
      }));
    } catch (error: any) {
      setAuthDiagnostics((prev: any) => ({
        ...prev,
        test_error: error.message,
      }));
    }

    setTestingAuth(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-nepal-blue text-nepal-blue'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Create Event
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'import'
              ? 'border-nepal-blue text-nepal-blue'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Import Events
        </button>
        <button
          onClick={() => setActiveTab('debug')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'debug'
              ? 'border-nepal-blue text-nepal-blue'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Debug Panel
        </button>
      </div>

      {/* Create Event Tab */}
      {activeTab === 'create' && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

          {createSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Event created successfully!
            </div>
          )}

          <form onSubmit={handleCreateEvent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Title *</label>
                <input
                  type="text"
                  className="input"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea
                  className="input"
                  rows={4}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={eventForm.start_at}
                  onChange={(e) => setEventForm({ ...eventForm, start_at: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">End Date & Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={eventForm.end_at}
                  onChange={(e) => setEventForm({ ...eventForm, end_at: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  className="input"
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">City *</label>
                <select
                  className="input"
                  value={eventForm.city}
                  onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                  required
                >
                  {NEPAL_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Venue Name</label>
                <input
                  type="text"
                  className="input"
                  value={eventForm.venue_name}
                  onChange={(e) => setEventForm({ ...eventForm, venue_name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Organizer</label>
                <input
                  type="text"
                  className="input"
                  value={eventForm.organizer}
                  onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Address</label>
                <input
                  type="text"
                  className="input"
                  value={eventForm.address}
                  onChange={(e) => setEventForm({ ...eventForm, address: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Image URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://example.com/image.jpg"
                  value={eventForm.image_url}
                  onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-6" disabled={creating}>
              {creating ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      {/* Import Events Tab */}
      {activeTab === 'import' && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Import Events</h2>

          <div className="mb-6">
            <label className="label">Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="ai"
                  checked={importMode === 'ai'}
                  onChange={(e) => setImportMode(e.target.value as 'ai' | 'scrape')}
                  className="mr-2"
                />
                AI Generated (Fictional Events)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="scrape"
                  checked={importMode === 'scrape'}
                  onChange={(e) => setImportMode(e.target.value as 'ai' | 'scrape')}
                  className="mr-2"
                />
                Web Scrape (Real Events)
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="label">Number of Events (1-100)</label>
            <input
              type="number"
              min="1"
              max="100"
              className="input"
              value={importCount}
              onChange={(e) => setImportCount(parseInt(e.target.value))}
            />
          </div>

          <button
            onClick={handleImport}
            className="btn btn-primary"
            disabled={importing}
          >
            {importing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </span>
            ) : (
              'Import Events'
            )}
          </button>

          {importResult && (
            <div className={`mt-6 p-4 rounded ${importResult.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className="font-bold mb-2">
                {importResult.ok ? '✅ Success' : '❌ Failed'}
              </h3>
              {importResult.ok ? (
                <>
                  <p className="mb-2">Inserted {importResult.inserted_count} events</p>
                  {importResult.warnings && importResult.warnings.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold">Warnings:</p>
                      <ul className="list-disc list-inside">
                        {importResult.warnings.map((warning: string, i: number) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="mb-1"><strong>Code:</strong> {importResult.code}</p>
                  <p className="mb-1"><strong>Message:</strong> {importResult.message}</p>
                  {importResult.details && (
                    <p className="mt-2 text-sm"><strong>Details:</strong> {JSON.stringify(importResult.details)}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Debug Panel Tab */}
      {activeTab === 'debug' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Last Scrape Result</h2>
              <button onClick={fetchLastRun} className="btn btn-secondary" disabled={debugLoading}>
                {debugLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {lastRun ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Run Time</p>
                    <p className="font-medium">{new Date(lastRun.ran_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-medium ${lastRun.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {lastRun.status.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mode</p>
                    <p className="font-medium capitalize">{lastRun.mode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">HTTP Status</p>
                    <p className="font-medium">{lastRun.http_status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requested Count</p>
                    <p className="font-medium">{lastRun.requested_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Inserted Count</p>
                    <p className="font-medium">{lastRun.inserted_count}</p>
                  </div>
                </div>

                {lastRun.error_message && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">Error Message</p>
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm font-mono">
                      {lastRun.error_message}
                    </div>
                  </div>
                )}

                {lastRun.warnings && Array.isArray(lastRun.warnings) && lastRun.warnings.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">Warnings</p>
                    <ul className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm list-disc list-inside">
                      {lastRun.warnings.map((warning: string, i: number) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No scrape runs yet.</p>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">Auth Diagnostics</h2>

            <button
              onClick={testFunctionAuth}
              className="btn btn-primary mb-4"
              disabled={testingAuth}
            >
              {testingAuth ? 'Testing...' : 'Test Function Auth'}
            </button>

            {authDiagnostics && (
              <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                <pre>{JSON.stringify(authDiagnostics, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
