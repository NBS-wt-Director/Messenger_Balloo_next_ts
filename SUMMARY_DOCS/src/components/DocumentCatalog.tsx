'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DocumentEntry {
  id: string;
  title: string;
  path: string;
  category: string;
  status: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function DocumentCatalog() {
  const [docs, setDocs] = useState<DocumentEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/catalog');
        const json = await res.json();
        if (json.success) {
          setDocs(json.documents);
          setCategories(json.categories);
        } else {
          setError(json.message || 'Failed to load catalog');
        }
      } catch (e: any) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const filteredDocs = selectedCategory === 'all'
    ? docs
    : docs.filter(doc => doc.category === selectedCategory);

  if (loading) return <div className="p-6 text-center">Loading catalog...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Document Catalog</h1>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          className={`px-4 py-2 rounded text-sm ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({docs.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded text-sm ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name} ({docs.filter(d => d.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Document List */}
      <div className="grid gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{doc.path}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {doc.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    doc.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                  {doc.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/docs/${doc.path.replace('SUMMARY_DOCS/', '')}`}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
