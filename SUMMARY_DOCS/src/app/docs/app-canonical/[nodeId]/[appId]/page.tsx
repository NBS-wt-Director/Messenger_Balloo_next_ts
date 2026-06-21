'use client';

import AppDocsViewer from '@/app/appdocs/components/AppDocsViewer';

interface AppDocPageProps {
  params: { nodeId: string; appId: string };
}

export default function AppDocPage({ params }: AppDocPageProps) {
  const { nodeId, appId } = params;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ 
        background: 'var(--card)',
        borderColor: 'var(--border)'
      }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
          Canonical App Docs
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Node: {nodeId} / App: {appId}
        </p>
      </div>

      {/* Viewer */}
      <main className="flex-1">
        <AppDocsViewer nodeId={nodeId} appId={appId} />
      </main>
    </div>
  );
}
