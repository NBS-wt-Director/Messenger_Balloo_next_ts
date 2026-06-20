'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AppState {
  nodeId: string;
  appId: string;
  title?: string;
  status?: string;
  objectCount?: number;
}

export default function AppDocsIndex() {
  const [apps, setApps] = useState<AppState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadApps() {
      try {
        const res = await fetch('/api/appdocs/apps');
        const json = await res.json();
        if (json.success) {
          setApps(json.apps);
        } else {
          setError(json.message || 'Failed to load apps');
        }
      } catch (e: any) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }

    loadApps();
  }, []);

  const filteredApps = apps.filter(app =>
    app.appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.nodeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center">Loading apps...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Application Documentation</h1>
      <p className="text-gray-600 mb-6">Browse all canonical application documentation</p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by app or node ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Apps List */}
      <div className="grid gap-4">
        {filteredApps.map(app => (
          <Link
            key={`${app.nodeId}/${app.appId}`}
            href={`/docs/app-canonical/${app.nodeId}/${app.appId}`}
            className="block border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {app.nodeId} / {app.appId}
                </h3>
                {app.title && <p className="text-sm text-gray-600 mt-1">{app.title}</p>}
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {app.nodeId}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    app.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status || 'unknown'}
                  </span>
                </div>
              </div>
              <span className="text-sm text-blue-600 hover:text-blue-800">
                View docs →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No applications found matching your search.
        </div>
      )}
    </div>
  );
}
