'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpen, ArrowLeft, Edit3, AlertCircle } from 'lucide-react';

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

  if (loading) return (
    <div className="p-8 text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-gray-600">Loading documentation...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-8 text-center text-red-600">
      <AlertCircle size={48} className="mx-auto mb-4" />
      <p className="font-semibold">Error loading documentation</p>
      <p className="text-sm mt-2">{error}</p>
    </div>
  );
  
  if (!data) return (
    <div className="p-8 text-center">
      <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
      <p className="text-gray-600">No documentation available</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{appId}</h1>
        <p className="text-sm text-gray-600">
          Node: {nodeId} | Version: {data.version}
        </p>
      </div>

      {/* Counters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="px-4 py-2 bg-blue-100 rounded-lg">
          <span className="text-sm font-semibold text-blue-800">Screens: {data.counters.screens}</span>
        </div>
        <div className="px-4 py-2 bg-green-100 rounded-lg">
          <span className="text-sm font-semibold text-green-800">Transitions: {data.counters.transitions}</span>
        </div>
        <div className="px-4 py-2 bg-purple-100 rounded-lg">
          <span className="text-sm font-semibold text-purple-800">Scenarios: {data.counters.scenarios}</span>
        </div>
        <div className="px-4 py-2 bg-orange-100 rounded-lg">
          <span className="text-sm font-semibold text-orange-800">Integrations: {data.counters.integrations}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'screen', 'transition', 'scenario', 'integration'].map(t => (
          <button
            key={t}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === t 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => { setSelectedType(t); setSelectedObject(null); }}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Object List */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredObjects.map((obj: any) => {
              const id = obj.screenId || obj.transitionId || obj.scenarioId || obj.integrationId;
              const title = obj.title || 'Untitled';
              const status = obj.status || 'unknown';
              const type = obj.objectType || 'unknown';
              return (
                <div
                  key={id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedObject?.screenId === id || selectedObject?.transitionId === id || 
                    selectedObject?.scenarioId === id || selectedObject?.integrationId === id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                  onClick={() => { setSelectedObject(obj); setSelectedType(type); }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-sm">{title}</div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      status === 'active' ? 'bg-green-100 text-green-800' :
                      status === 'deprecated' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{id}</div>
                </div>
              );
            })}
          </div>

          {filteredObjects.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No objects found for this type.</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedObject && (
          <div className="w-96 shrink-0">
            <div className="border rounded-lg p-4 sticky top-24" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-lg">{selectedObject.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedObject.screenId || selectedObject.transitionId || selectedObject.scenarioId || selectedObject.integrationId}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  selectedObject.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedObject.status === 'deprecated' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedObject.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {selectedObject.purpose && (
                  <div>
                    <div className="font-medium text-gray-700">Purpose</div>
                    <div className="text-gray-600 mt-1">{selectedObject.purpose}</div>
                  </div>
                )}
                {selectedObject.description && (
                  <div>
                    <div className="font-medium text-gray-700">Description</div>
                    <div className="text-gray-600 mt-1">{selectedObject.description}</div>
                  </div>
                )}
                {selectedObject.goal && (
                  <div>
                    <div className="font-medium text-gray-700">Goal</div>
                    <div className="text-gray-600 mt-1">{selectedObject.goal}</div>
                  </div>
                )}
                {selectedObject.trigger && (
                  <div>
                    <div className="font-medium text-gray-700">Trigger</div>
                    <div className="text-gray-600 mt-1">{selectedObject.trigger}</div>
                  </div>
                )}
                {selectedObject.direction && (
                  <div>
                    <div className="font-medium text-gray-700">Direction</div>
                    <div className="text-gray-600 mt-1">{selectedObject.direction}</div>
                  </div>
                )}
                {selectedObject.targetType && (
                  <div>
                    <div className="font-medium text-gray-700">Target</div>
                    <div className="text-gray-600 mt-1">{selectedObject.targetType} ({selectedObject.targetId})</div>
                  </div>
                )}
                {selectedObject.actor && (
                  <div>
                    <div className="font-medium text-gray-700">Actor</div>
                    <div className="text-gray-600 mt-1">{selectedObject.actor}</div>
                  </div>
                )}
                {selectedObject.sourceScreenId && (
                  <div>
                    <div className="font-medium text-gray-700">Source</div>
                    <div className="text-gray-600 mt-1">{selectedObject.sourceScreenId}</div>
                  </div>
                )}
                {selectedObject.targetScreenId && (
                  <div>
                    <div className="font-medium text-gray-700">Target</div>
                    <div className="text-gray-600 mt-1">{selectedObject.targetScreenId}</div>
                  </div>
                )}
                {selectedObject.path && (
                  <div>
                    <div className="font-medium text-gray-700">Path</div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">{selectedObject.path}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

