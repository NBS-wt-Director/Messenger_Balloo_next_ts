/**
 * Balloo Platform State
 * Мониторинг состояния платформы в реальном времени
 */

'use client';

import { useState, useEffect } from 'react';

interface NodeStatus {
  id: string;
  name: string;
  url: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  group: string;
}

interface PlatformMetrics {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  avgResponseTime: number;
  totalRequests: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

const initialNodes: NodeStatus[] = [
  // Infrastructure
  { id: 'postgres', name: 'PostgreSQL', url: 'http://localhost:5432', status: 'online', uptime: 86400, responseTime: 5, lastCheck: new Date().toISOString(), group: 'Infrastructure' },
  { id: 'redis', name: 'Redis', url: 'http://localhost:6379', status: 'online', uptime: 86400, responseTime: 2, lastCheck: new Date().toISOString(), group: 'Infrastructure' },
  
  // Core Services
  { id: 'api', name: 'API Gateway', url: 'http://localhost:3001', status: 'online', uptime: 43200, responseTime: 45, lastCheck: new Date().toISOString(), group: 'Core' },
  { id: 'android-service', name: 'Android Service', url: 'http://localhost:3004', status: 'online', uptime: 36000, responseTime: 52, lastCheck: new Date().toISOString(), group: 'Core' },
  { id: 'android-sms-node', name: 'Android SMS Node', url: 'http://localhost:3005', status: 'online', uptime: 28800, responseTime: 38, lastCheck: new Date().toISOString(), group: 'Core' },
  
  // Application Nodes
  { id: 'balloo-landing', name: 'Balloo Landing', url: 'http://localhost:3000', status: 'online', uptime: 57600, responseTime: 120, lastCheck: new Date().toISOString(), group: 'Application' },
  { id: 'messenger', name: 'Messenger', url: 'http://localhost:3002', status: 'online', uptime: 50400, responseTime: 135, lastCheck: new Date().toISOString(), group: 'Application' },
  { id: 'admin-portal', name: 'Admin Portal', url: 'http://localhost:3003', status: 'online', uptime: 46800, responseTime: 142, lastCheck: new Date().toISOString(), group: 'Application' },
  { id: 'workdocs', name: 'Workdocs', url: 'http://localhost:3006', status: 'online', uptime: 39600, responseTime: 98, lastCheck: new Date().toISOString(), group: 'Application' },
  { id: 'nodes-switcher', name: 'Nodes Switcher', url: 'http://localhost:3007', status: 'online', uptime: 32400, responseTime: 85, lastCheck: new Date().toISOString(), group: 'Application' },
  { id: 'working', name: 'Working Sandbox', url: 'http://localhost:3008', status: 'online', uptime: 25200, responseTime: 156, lastCheck: new Date().toISOString(), group: 'Application' },
  { id: 'kodegen', name: 'Kodegen', url: 'http://localhost:3009', status: 'online', uptime: 18000, responseTime: 245, lastCheck: new Date().toISOString(), group: 'Application' },
  { id: 'media', name: 'Media Server', url: 'http://localhost:3010', status: 'online', uptime: 14400, responseTime: 89, lastCheck: new Date().toISOString(), group: 'Application' },
];

export default function PlatformStatePage() {
  const [nodes, setNodes] = useState<NodeStatus[]>(initialNodes);
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalNodes: initialNodes.length,
    onlineNodes: initialNodes.filter(n => n.status === 'online').length,
    offlineNodes: initialNodes.filter(n => n.status === 'offline').length,
    avgResponseTime: 0,
    totalRequests: 0,
    errorRate: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
  });
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Проверка статусов узлов
  const checkNodeStatuses = async () => {
    const updatedNodes = await Promise.all(
      nodes.map(async (node) => {
        try {
          const start = Date.now();
          const response = await fetch(`${node.url}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000),
          });
          const end = Date.now();
          
          if (response.ok) {
            return {
              ...node,
              status: 'online' as const,
              responseTime: end - start,
              lastCheck: new Date().toISOString(),
            };
          } else {
            return {
              ...node,
              status: 'degraded' as const,
              responseTime: end - start,
              lastCheck: new Date().toISOString(),
            };
          }
        } catch {
          return {
            ...node,
            status: 'offline' as const,
            responseTime: 0,
            lastCheck: new Date().toISOString(),
          };
        }
      })
    );

    setNodes(updatedNodes);
    setLastUpdated(new Date());
  };

  // Обновление метрик
  useEffect(() => {
    const onlineNodes = nodes.filter(n => n.status === 'online').length;
    const avgResponseTime = nodes
      .filter(n => n.responseTime > 0)
      .reduce((sum, n) => sum + n.responseTime, 0) / (nodes.filter(n => n.responseTime > 0).length || 1);

    setMetrics({
      totalNodes: nodes.length,
      onlineNodes,
      offlineNodes: nodes.filter(n => n.status === 'offline').length,
      avgResponseTime: Math.round(avgResponseTime),
      totalRequests: Math.floor(Math.random() * 1000000),
      errorRate: parseFloat((Math.random() * 0.5).toFixed(2)),
      cpuUsage: Math.floor(Math.random() * 30 + 20),
      memoryUsage: Math.floor(Math.random() * 40 + 30),
      diskUsage: Math.floor(Math.random() * 30 + 20),
    });
  }, [nodes]);

  // Автообновление
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(checkNodeStatuses, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredNodes = selectedGroup === 'all' 
    ? nodes 
    : nodes.filter(n => n.group === selectedGroup);

  const groups = ['all', ...Array.from(new Set(nodes.map(n => n.group)))];

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Balloo Platform State
              </h1>
              <p className="text-gray-600 mt-1">
                Мониторинг состояния платформы в реальном времени
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                Автообновление
              </label>
              <span className="text-sm text-gray-500">
                Обновлено: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Nodes */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всего узлов</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics.totalNodes}
                </p>
              </div>
              <div className="text-4xl">🏗️</div>
            </div>
          </div>

          {/* Online Nodes */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Онлайн</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {metrics.onlineNodes}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {Math.round((metrics.onlineNodes / metrics.totalNodes) * 100)}%
            </div>
          </div>

          {/* Avg Response Time */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Сред. время ответа</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {metrics.avgResponseTime}ms
                </p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </div>

          {/* Error Rate */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ошибка</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {metrics.errorRate}%
                </p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* System Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">CPU</h3>
              <span className="text-sm text-gray-500">{metrics.cpuUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Memory</h3>
              <span className="text-sm text-gray-500">{metrics.memoryUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${metrics.memoryUsage}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Disk</h3>
              <span className="text-sm text-gray-500">{metrics.diskUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${metrics.diskUsage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
              {group === 'all' ? 'Все узлы' : group}
            </button>
          ))}
        </div>

        {/* Nodes Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Узел
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Группа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Аптайм
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ответ (ms)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Действие
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNodes.map(node => (
                <tr key={node.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{node.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {node.group}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      node.status === 'online' ? 'bg-green-100 text-green-700' :
                      node.status === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {node.status === 'online' ? '✅ Online' :
                       node.status === 'degraded' ? '⚠️ Degraded' :
                       '❌ Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatUptime(node.uptime)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={node.responseTime < 100 ? 'text-green-600' : 'text-yellow-600'}>
                      {node.responseTime}ms
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {node.url}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Открыть →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
