/**
 * Balloo Nodes Switcher
 * Главная страница — переключение между узлами платформы
 */

'use client';

import { useState, useEffect } from 'react';
import { NodeCard } from '@/components/NodeCard';
import { NodeGrid } from '@/components/NodeGrid';
import { StatusBadge } from '@/components/StatusBadge';
import { SearchBar } from '@/components/SearchBar';
import { nodes, Node } from '@/utils/nodes';

export default function NodesSwitcherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Проверка статусов узлов
  useEffect(() => {
    const checkNodeStatuses = async () => {
      const statuses: Record<string, boolean> = {};
      
      for (const node of nodes) {
        try {
          const response = await fetch(`${node.url}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(2000),
          });
          statuses[node.id] = response.ok;
        } catch {
          statuses[node.id] = false;
        }
      }
      
      setNodeStatuses(statuses);
      setLoading(false);
    };

    checkNodeStatuses();
    
    // Обновление каждые 30 секунд
    const interval = setInterval(checkNodeStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  // Фильтрация узлов
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || node.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Группы узлов
  const groups = ['all', ...Array.from(new Set(nodes.map(n => n.group)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎈 Balloo Platform
              </h1>
              <p className="text-gray-600 mt-1">
                Переключатель узлов платформы
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge 
                online={Object.values(nodeStatuses).filter(Boolean).length}
                total={nodes.length}
              />
              <div className="text-sm text-gray-500">
                v3.0.0
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск узлов..."
          />
          
          <div className="flex gap-2 overflow-x-auto">
            {groups.map(group => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedGroup === group
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {group === 'all' ? 'Все узлы' : group.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <NodeGrid>
            {filteredNodes.map(node => (
              <NodeCard
                key={node.id}
                node={node}
                online={nodeStatuses[node.id] ?? false}
              />
            ))}
          </NodeGrid>
        )}

        {filteredNodes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Узлы не найдены
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              © 2026 Balloo Platform. Все права защищены.
            </div>
            <div className="flex gap-4">
              <a href="/docs" className="hover:text-gray-700">
                Документация
              </a>
              <a href="/api" className="hover:text-gray-700">
                API
              </a>
              <a href="/status" className="hover:text-gray-700">
                Статус
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
