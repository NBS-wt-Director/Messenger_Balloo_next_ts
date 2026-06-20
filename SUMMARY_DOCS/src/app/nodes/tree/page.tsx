'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface NodeInfo {
  nodeId: string;
  canonicalName: string;
  branch: string;
  nodeType: string;
  domain: string | null;
  localDevIdentity: string | null;
  technical: boolean;
  codegenPriority: number;
  status: string;
  notes: string;
  summaryDoc?: string;
  contractDoc?: string;
}

interface NodeDoc {
  name: string;
  path: string;
  size?: number;
}

interface NodeWithDocs {
  info: NodeInfo;
  docs: NodeDoc[];
}

export default function NodesTreePage() {
  const [nodes, setNodes] = useState<NodeWithDocs[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branchFilter, setBranchFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/nodes/tree')
      .then(res => res.json())
      .then(async (data) => {
        if (data.success) {
          const nodesWithDocs: NodeWithDocs[] = [];
          
          for (const node of data.nodes) {
            let docs: NodeDoc[] = [];
            
            // Try to find docs in project/nodes
            const nodeDocPath = `SUMMARY_DOCS/project/nodes/${node.canonicalName.replace(/\./g, '_')}`;
            try {
              const docsRes = await fetch(`/api/docs/list?path=${encodeURIComponent(nodeDocPath)}`);
              if (docsRes.ok) {
                const docsData = await docsRes.json();
                if (docsData.success) {
                  docs = docsData.docs || [];
                }
              }
            } catch (e) {
              // Ignore
            }
            
            // Also check for summary and contract docs
            if (node.summaryDoc) {
              docs.push({
                name: 'Summary',
                path: node.summaryDoc,
              });
            }
            if (node.contractDoc) {
              docs.push({
                name: 'Contract',
                path: node.contractDoc,
              });
            }
            
            nodesWithDocs.push({ info: node, docs });
          }
          
          setNodes(nodesWithDocs);
        } else {
          setError(data.message || 'Failed to load nodes');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const loadDocContent = async (docPath: string) => {
    try {
      const response = await fetch(`/api/docs/raw?path=${encodeURIComponent(docPath)}`);
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

  const filteredNodes = branchFilter === 'all' 
    ? nodes 
    : nodes.filter(n => n.info.branch === branchFilter);

  const branches = ['all', 'production', 'alpha', 'working'];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">Loading Nodes...</div>
            <div className="mt-2 text-sm text-gray-600">Fetching node tree...</div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Node Tree</h1>
            <p className="mt-2 text-sm text-gray-600">
              Browse documentation for all {nodes.length} Balloo nodes across branches
            </p>
          </div>
          
          {/* Branch Filter */}
          <div className="flex gap-2">
            {branches.map(branch => (
              <button
                key={branch}
                onClick={() => setBranchFilter(branch)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  branchFilter === branch
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border text-gray-600 hover:bg-gray-50'
                }`}
              >
                {branch === 'all' ? 'All' : branch}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nodes List */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-md shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Nodes</h3>
                <div className="mt-1 text-xs text-gray-600">
                  {filteredNodes.length} of {nodes.length} nodes
                </div>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {filteredNodes.map((node) => (
                  <button
                    key={node.info.nodeId}
                    onClick={() => {
                      setSelectedNode(node.info.nodeId);
                      setSelectedDoc(null);
                      setContent('');
                    }}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                      selectedNode === node.info.nodeId ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {node.info.technical && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-1 rounded">TECH</span>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{node.info.canonicalName}</div>
                        <div className="mt-1 text-xs text-gray-600">
                          {node.info.nodeType} · {node.info.status}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Node Details */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-md shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedNode 
                    ? nodes.find(n => n.info.nodeId === selectedNode)?.info.canonicalName
                    : 'Select a node'
                  }
                </h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {selectedNode ? (
                  (() => {
                    const node = nodes.find(n => n.info.nodeId === selectedNode);
                    if (!node) return null;
                    
                    return (
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-gray-600">Type</div>
                          <div className="text-sm text-gray-900">{node.info.nodeType}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-600">Branch</div>
                          <div className="text-sm text-gray-900">{node.info.branch}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-600">Status</div>
                          <div className="text-sm text-gray-900">{node.info.status}</div>
                        </div>
                        {node.info.domain && (
                          <div>
                            <div className="text-xs font-medium text-gray-600">Domain</div>
                            <div className="text-sm text-gray-900">{node.info.domain}</div>
                          </div>
                        )}
                        {node.info.localDevIdentity && (
                          <div>
                            <div className="text-xs font-medium text-gray-600">Local Dev</div>
                            <div className="text-sm text-gray-900">{node.info.localDevIdentity}</div>
                          </div>
                        )}
                        {node.info.notes && (
                          <div>
                            <div className="text-xs font-medium text-gray-600">Notes</div>
                            <div className="text-sm text-gray-900">{node.info.notes}</div>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Documents</h4>
                          <div className="space-y-1">
                            {node.docs.map((doc, idx) => (
                              <button
                                key={idx}
                                onClick={() => loadDocContent(doc.path)}
                                className="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                {doc.name}
                              </button>
                            ))}
                            {node.docs.length === 0 && (
                              <div className="text-xs text-gray-600">No documents found</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-sm text-gray-600 text-center py-8">
                    Click a node to view details
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
                  <div className="whitespace-pre-wrap font-sans text-sm text-gray-900">
                    {content}
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
