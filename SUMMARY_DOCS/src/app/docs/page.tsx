'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DocFile {
  path: string;
  name: string;
  size: number;
}

export default function AllDocumentsPage() {
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch('/api/docs');
        const json = await res.json();
        if (json.success) {
          setDocs(json.files);
        } else {
          setError(json.message || 'Failed to load documents');
        }
      } catch (e: any) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }

    loadDocs();
  }, []);

  const filteredDocs = docs.filter(doc =>
    doc.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center">Loading documents...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">All Documents</h1>
      <p className="text-gray-600 mb-6">Browse all canonical documentation files</p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by file name or path..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Document List */}
      <div className="grid gap-2">
        {filteredDocs.map((doc, idx) => {
          const pathParts = doc.path.split('/');
          const appId = pathParts[pathParts.length - 3];
          const nodeId = pathParts[pathParts.length - 4];
          const type = pathParts[pathParts.length - 2];

          return (
            <Link
              key={idx}
              href={`/docs/app-canonical/${nodeId}/${appId}`}
              className="block border rounded p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm text-gray-900">{doc.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {nodeId} / {appId} / {type}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {(doc.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No documents found matching your search.
        </div>
      )}
    </div>
  );
}
