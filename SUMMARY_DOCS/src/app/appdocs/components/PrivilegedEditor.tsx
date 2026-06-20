'use client';

import { useState, useEffect } from 'react';

interface PrivilegedEditorProps {
  nodeId: string;
  appId: string;
  objectType: string;
  objectId: string;
  initialData: Record<string, unknown>;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
}

export default function PrivilegedEditor({
  nodeId,
  appId,
  objectType,
  objectId,
  initialData,
  onClose,
  onSave,
}: PrivilegedEditorProps) {
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [editingData, setEditingData] = useState<Record<string, unknown>>({ ...initialData });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diff, setDiff] = useState<Record<string, { old: string; new: string }>>({});

  useEffect(() => {
    setEditingData({ ...initialData });
  }, [initialData]);

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/appdocs?action=verify-privilege', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generalPassword: password }),
      });
      const json = await res.json();
      if (json.success) {
        setSessionToken(json.sessionToken);
        setVerified(true);
      } else {
        setError(json.message || 'Invalid privilege verification');
      }
    } catch (e: any) {
      setError(e.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    // Compute diff
    const newDiff: Record<string, { old: string; new: string }> = {};
    for (const key of Object.keys(initialData)) {
      const oldVal = JSON.stringify(initialData[key]);
      const newVal = JSON.stringify(editingData[key]);
      if (oldVal !== newVal) {
        newDiff[key] = { old: oldVal, new: newVal };
      }
    }
    setDiff(newDiff);

    try {
      const res = await fetch('/api/appdocs?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          nodeId,
          appId,
          objectType,
          objectId,
          data: editingData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        onSave(editingData);
      } else {
        setError(json.message || json.errors?.join(', ') || 'Save failed');
      }
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setEditingData(prev => ({ ...prev, [key]: value }));
  };

  if (!verified) {
    return (
      <div className="p-6 space-y-4">
        <h3 className="font-bold text-lg">Privileged Edit Required</h3>
        <p className="text-sm text-gray-600">
          Enter the general password to enable editing for <code>{objectType}/{objectId}</code>.
        </p>
        <input
          type="password"
          className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="General password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            onClick={handleVerify}
            disabled={verifying || !password}
          >
            {verifying ? 'Verifying...' : 'Verify & Edit'}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">
          Edit {objectType}: <code>{objectId}</code>
        </h3>
        <button className="text-sm text-gray-500 hover:text-gray-700" onClick={onClose}>
          Close
        </button>
      </div>

      {/* Editable fields */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.entries(editingData)
          .filter(([k]) => !['objectType', 'sourceRefs'].includes(k))
          .map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{key}</label>
              {typeof value === 'string' && value.length > 100 ? (
                <textarea
                  className="border rounded px-2 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value as string}
                  onChange={e => handleChange(key, e.target.value)}
                  rows={4}
                />
              ) : typeof value === 'object' && value !== null ? (
                <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>
              ) : (
                <input
                  className="border rounded px-2 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={String(value || '')}
                  onChange={e => handleChange(key, e.target.value)}
                />
              )}
            </div>
          ))}
      </div>

      {/* Diff summary */}
      {Object.keys(diff).length > 0 && (
        <details className="border rounded p-3 bg-yellow-50">
          <summary className="text-sm cursor-pointer font-medium text-yellow-800">
            Diff Summary ({Object.keys(diff).length} changes)
          </summary>
          <div className="text-xs mt-2 space-y-2">
            {Object.entries(diff).map(([key, { old: o, new: n }]) => (
              <div key={key} className="border-b border-yellow-200 pb-2 last:border-0">
                <strong className="text-yellow-900">{key}:</strong>
                <div className="text-red-600 line-through mt-1">- {o}</div>
                <div className="text-green-600 mt-1">+ {n}</div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>

      {saved && <div className="text-green-600 text-sm font-medium">✓ Saved successfully</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
