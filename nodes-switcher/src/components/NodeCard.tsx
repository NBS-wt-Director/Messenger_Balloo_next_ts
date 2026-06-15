/**
 * NodeCard Component
 * Карточка узла платформы
 */

'use client';

import { Node } from '@/utils/nodes';

interface NodeCardProps {
  node: Node;
  online: boolean;
}

export function NodeCard({ node, online }: NodeCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600',
    slate: 'from-slate-500 to-slate-600',
    amber: 'from-amber-500 to-amber-600',
    teal: 'from-teal-500 to-teal-600',
    red: 'from-red-500 to-red-600',
    gray: 'from-gray-500 to-gray-600',
    violet: 'from-violet-500 to-violet-600',
    yellow: 'from-yellow-500 to-yellow-600',
    emerald: 'from-emerald-500 to-emerald-600',
    sky: 'from-sky-500 to-sky-600',
  };

  const gradient = colorClasses[node.color] || colorClasses.blue;

  return (
    <a
      href={node.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Header with gradient */}
        <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{node.icon}</div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              online
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {online ? '● Online' : '● Offline'}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {node.name}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            {node.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Group {node.group}
            </span>
            <span className="text-xs text-gray-400">
              #{node.priority}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 truncate max-w-[200px]">
              {node.url}
            </span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
