'use client';

import { useState, useEffect } from 'react';
import AppDocsViewer from '@/app/appdocs/components/AppDocsViewer';

interface AppState {
  nodeId: string;
  appId: string;
  title?: string;
}

export default function LinkedViewPage() {
  const [selectedApp, setSelectedApp] = useState<{ nodeId: string; appId: string } | null>(null);
  const [apps, setApps] = useState<AppState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      try {
        const res = await fetch('/api/appdocs/apps');
        const json = await res.json();
        if (json.success) {
          setApps(json.apps);
          if (json.apps.length > 0) {
            setSelectedApp(json.apps[0]);
          }
        }
      } catch (e) {
        console.error('Failed to load apps', e);
      } finally {
        setLoading(false);
      }
    }

    loadApps();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Selector */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold mb-4">Linked View — All Applications</h1>
        <div className="flex gap-2 flex-wrap">
          {apps.map(app => (
            <button
              key={`${app.nodeId}/${app.appId}`}
              className={`px-4 py-2 rounded text-sm ${
                selectedApp?.nodeId === app.nodeId && selectedApp?.appId === app.appId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedApp(app)}
            >
              {app.nodeId}/{app.appId}
            </button>
          ))}
        </div>
      </div>

      {/* Viewer */}
      {selectedApp && (
        <div className="p-6">
          <AppDocsViewer nodeId={selectedApp.nodeId} appId={selectedApp.appId} />
        </div>
      )}

      {apps.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No applications found.
        </div>
      )}
    </div>
  );
}
