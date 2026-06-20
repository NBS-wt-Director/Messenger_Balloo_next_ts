'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface NodeDoc {
  name: string;
  path: string;
  size?: number;
}

interface Node {
  id: string;
  title: string;
  docs: NodeDoc[];
  docCount: number;
}

export default function NodeDocsPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNodes(data.nodes);
        } else {
          setError(data.message || 'Failed to load nodes');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const loadDocContent = async (nodeId: string, docPath: string) => {
    try {
      const response = await fetch(`/api/docs/raw?path=SUMMARY_DOCS/project/nodes/${docPath}`);
      if (response.ok) {
        const text = await response.text();
        setContent(text);
        setSelectedDoc(docPath);
      } else {
        setContent('# Document not found\n\nThis document could not be loaded.');
      }
    } catch (err: any) {
      setContent(`# Error\n\nFailed to load document: ${err.message}`);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
    setSelectedDoc(null);
    setContent('');
  };

  const handleDocClick = (doc: NodeDoc) => {
    loadDocContent(selectedNode!, doc.path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">Loading Nodes...</div>
            <div className="mt-2 text-sm text-gray-600">Fetching node documentation...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">Error</div>
            <div className="mt-2 text-sm text-gray-600">{error}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Node Documentation</h1>
        <p className="mt-2 text-sm text-gray-600">
          Browse and read documentation for all Balloo nodes
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nodes List */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-md shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Nodes</h3>
                <div className="mt-1 text-xs text-gray-600">{nodes.length} nodes found</div>
              </div>
              <div className="divide-y">
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                      selectedNode === node.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{node.title}</div>
                    <div className="mt-1 text-xs text-gray-600">{node.docCount} documents</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-md shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedNode ? `Documents: ${selectedNode}` : 'Select a node'}
                </h3>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {selectedNode ? (
                  nodes
                    .find(n => n.id === selectedNode)
                    ?.docs.map((doc) => (
                      <button
                        key={doc.name}
                        onClick={() => handleDocClick(doc)}
                        className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                          selectedDoc === doc.path ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="mt-1 text-xs text-gray-600">
                          {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : ''}
                        </div>
                      </button>
                    ))
                ) : (
                  <div className="p-4 text-sm text-gray-600 text-center">
                    Click a node to view documents
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-md shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDoc ? selectedDoc.split('/').pop() : 'Document Content'}
                </h3>
              </div>
              <div className="p-4 max-h-[600px] overflow-y-auto">
                {content ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-sm text-gray-900">
                      {content}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 text-center py-8">
                    Select a document to view content
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
