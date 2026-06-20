'use client';

import { useState } from 'react';
import AppDocsViewer from '@/app/appdocs/components/AppDocsViewer';
import PrivilegedEditor from '@/app/appdocs/components/PrivilegedEditor';

interface AppDocPageProps {
  params: { nodeId: string; appId: string };
}

export default function AppDocPage({ params }: AppDocPageProps) {
  const { nodeId, appId } = params;
  const [showEditor, setShowEditor] = useState(false);
  const [editingObject, setEditingObject] = useState<{
    type: string;
    id: string;
    data: Record<string, unknown>;
  } | null>(null);

  const handleSave = (updatedData: Record<string, unknown>) => {
    setEditingObject(null);
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h1 className="text-xl font-bold">Canonical App Docs</h1>
        <p className="text-sm text-gray-500">
          Node: {nodeId} / App: {appId}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            className="text-xs px-2 py-1 bg-blue-100 rounded"
            onClick={() => setShowEditor(true)}
          >
            Edit Mode (Superadmin)
          </button>
        </div>
      </div>

      {/* Viewer */}
      <main className="flex-1">
        <AppDocsViewer nodeId={nodeId} appId={appId} />
      </main>

      {/* Editor Modal */}
      {showEditor && editingObject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <PrivilegedEditor
              nodeId={nodeId}
              appId={appId}
              objectType={editingObject.type}
              objectId={editingObject.id}
              initialData={editingObject.data}
              onClose={() => { setShowEditor(false); setEditingObject(null); }}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
