'use client';

import { useState, useEffect, useCallback } from 'react';
import PrivilegedEditor from './PrivilegedEditor';

interface LinkedViewData {
  version: string;
  nodeId: string;
  appId: string;
  counters: {
    screens: number;
    transitions: number;
    scenarios: number;
    integrations: number;
  };
  screens: any[];
  transitions: any[];
  scenarios: any[];
  integrations: any[];
}

interface AppDocsViewerProps {
  nodeId: string;
  appId: string;
}

export default function AppDocsViewer({ nodeId, appId }: AppDocsViewerProps) {
  const [data, setData] = useState<LinkedViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingData, setEditingData] = useState<Record<string, unknown>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/appdocs?action=linked-view&nodeId=${nodeId}&appId=${appId}`);
      const json = await res.json();
      if (!json.success) {
        setError(json.message || 'Failed to load linked view');
      } else {
        setData(json.data);
        setSelectedObject(null);
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [nodeId, appId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedObject) {
      const id = selectedObject.screenId || selectedObject.transitionId || selectedObject.scenarioId || selectedObject.integrationId;
      const type = getObjectType(selectedObject);
      const res = fetch(`/api/appdocs?action=object&type=${type}&id=${id}&nodeId=${nodeId}&appId=${appId}`);
      res.then(r => r.json()).then(json => {
        if (json.success) {
          setEditingData(json.data);
        }
      });
    }
  }, [selectedObject, nodeId, appId]);

  const filteredObjects = data
    ? (selectedType === 'all'
      ? [...data.screens, ...data.transitions, ...data.scenarios, ...data.integrations]
      : data.screens.filter(o => o.screenId).concat(
          data.transitions.filter(o => o.transitionId),
          data.scenarios.filter(o => o.scenarioId),
          data.integrations.filter(o => o.integrationId)
        ).filter(o => {
          if (selectedType === 'screen') return o.screenId;
          if (selectedType === 'transition') return o.transitionId;
          if (selectedType === 'scenario') return o.scenarioId;
          if (selectedType === 'integration') return o.integrationId;
          return false;
        }))
    : [];

  const handleEdit = (obj: any) => {
    setSelectedObject(obj);
    setShowEditor(true);
  };

  const handleSave = (updatedData: Record<string, unknown>) => {
    loadData();
    setShowEditor(false);
    setSelectedObject(null);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-6 text-center">No data</div>;

  return (
    <div className="p-4 space-y-4">
      {/* Counters */}
      <div className="flex gap-4 text-sm flex-wrap">
        <div className="px-3 py-1 bg-blue-100 rounded">Screens: {data.counters.screens}</div>
        <div className="px-3 py-1 bg-green-100 rounded">Transitions: {data.counters.transitions}</div>
        <div className="px-3 py-1 bg-purple-100 rounded">Scenarios: {data.counters.scenarios}</div>
        <div className="px-3 py-1 bg-orange-100 rounded">Integrations: {data.counters.integrations}</div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'screen', 'transition', 'scenario', 'integration'].map(t => (
          <button
            key={t}
            className={`px-3 py-1 rounded text-sm ${selectedType === t ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => { setSelectedType(t); setSelectedObject(null); }}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Object List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredObjects.map((obj: any) => {
          const id = obj.screenId || obj.transitionId || obj.scenarioId || obj.integrationId;
          const title = obj.title || 'Untitled';
          const status = obj.status || 'unknown';
          return (
            <div
              key={id}
              className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                selectedObject?.screenId === id || selectedObject?.transitionId === id || selectedObject?.scenarioId === id || selectedObject?.integrationId === id
                  ? 'border-blue-500 bg-blue-50'
                  : ''
              }`}
              onClick={() => { setSelectedObject(obj); setSelectedType(getObjectType(obj)); }}
            >
              <div className="font-medium text-sm">{title}</div>
              <div className="text-xs text-gray-500">{id}</div>
              <div className="text-xs mt-1">
                <span className={`px-1 py-0.5 rounded ${
                  status === 'active' ? 'bg-green-100 text-green-800' :
                  status === 'deprecated' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selectedObject && (
        <div className="border rounded p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-bold">{selectedObject.title}</div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedObject.screenId || selectedObject.transitionId || selectedObject.scenarioId || selectedObject.integrationId}
              </div>
            </div>
            <button
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleEdit(selectedObject)}
            >
              Edit
            </button>
          </div>
          {selectedObject.purpose && <div className="text-sm mt-2">{selectedObject.purpose}</div>}
          {selectedObject.goal && <div className="text-sm mt-2"><strong>Goal:</strong> {selectedObject.goal}</div>}
          {selectedObject.trigger && <div className="text-sm mt-2"><strong>Trigger:</strong> {selectedObject.trigger}</div>}
          {selectedObject.direction && (
            <div className="text-sm mt-2">
              <strong>Direction:</strong> {selectedObject.direction} | <strong>Target:</strong> {selectedObject.targetType} ({selectedObject.targetId})
            </div>
          )}
          {(selectedObject.relatedTransitions || selectedObject.relatedScenarios || selectedObject.relatedIntegrations || selectedObject.involvedScreens || selectedObject.involvedTransitions) && (
            <div className="text-sm mt-2">
              <strong>Relations:</strong>
              <ul className="list-disc pl-4 mt-1">
                {(selectedObject.relatedTransitions || []).map((r: string) => <li key={r}>{r}</li>)}
                {(selectedObject.relatedScenarios || []).map((r: string) => <li key={r}>{r}</li>)}
                {(selectedObject.relatedIntegrations || []).map((r: string) => <li key={r}>{r}</li>)}
                {(selectedObject.involvedScreens || []).map((r: string) => <li key={r}>{r}</li>)}
                {(selectedObject.involvedTransitions || []).map((r: string) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && selectedObject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <PrivilegedEditor
              nodeId={nodeId}
              appId={appId}
              objectType={getObjectType(selectedObject)}
              objectId={selectedObject.screenId || selectedObject.transitionId || selectedObject.scenarioId || selectedObject.integrationId}
              initialData={editingData}
              onClose={() => { setShowEditor(false); setSelectedObject(null); }}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function getObjectType(obj: any): string {
  if (obj.screenId) return 'screen';
  if (obj.transitionId) return 'transition';
  if (obj.scenarioId) return 'scenario';
  if (obj.integrationId) return 'integration';
  return '';
}
