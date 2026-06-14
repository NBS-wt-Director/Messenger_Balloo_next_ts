'use client';

import React from 'react';
import { ExternalLink, Shield, Box, Layers, Code, FileText, Settings, MessageSquare, Globe, Server } from 'lucide-react';

export interface NodeInfo {
  id: string;
  name: string;
  hostname: string;
  group: 'A' | 'B' | 'D' | 'E';
  description: string;
  status: 'online' | 'offline' | 'degraded';
  icon?: React.ReactNode;
}

export interface NodeSwitcherProps {
  nodes: NodeInfo[];
  currentNodeId?: string;
  onNodeSelect: (nodeId: string) => void;
  className?: string;
}

const groupLabels: Record<string, string> = {
  A: 'Privileged',
  B: 'Company',
  D: 'Sandbox',
  E: 'Production',
};

const groupColors: Record<string, string> = {
  A: '#EF4444', // Red
  B: '#0039A6', // Blue
  D: '#F59E0B', // Amber
  E: '#10B981', // Green
};

const defaultNodeIcons: Record<string, React.ReactNode> = {
  'balloo.su': <Globe size={20} />,
  'messenger.balloo.su': <MessageSquare size={20} />,
  'admin.balloo.su': <Settings size={20} />,
  'working.balloo.su': <Box size={20} />,
  'kodegen.working.balloo.su': <Code size={20} />,
  'workdocs.working.balloo.su': <FileText size={20} />,
  'nodes-switcher.working.balloo.su': <Layers size={20} />,
  'api.working.balloo.su': <Server size={20} />,
};

export function NodeSwitcher({
  nodes,
  currentNodeId,
  onNodeSelect,
  className = ''
}: NodeSwitcherProps) {
  // Group nodes by group
  const groupedNodes = nodes.reduce((acc, node) => {
    if (!acc[node.group]) {
      acc[node.group] = [];
    }
    acc[node.group].push(node);
    return acc;
  }, {} as Record<string, NodeInfo[]>);

  return (
    <div className={`node-switcher ${className}`}>
      <div className="node-switcher-header">
        <h3 className="node-switcher-title">
          <Layers size={20} />
          Переключение узлов
        </h3>
        <p className="node-switcher-subtitle">
          Выберите узел для перехода
        </p>
      </div>

      {Object.entries(groupedNodes).map(([group, groupNodes]) => (
        <div key={group} className="node-group">
          <div className="node-group-header">
            <div 
              className="node-group-badge"
              style={{ backgroundColor: groupColors[group] }}
            >
              Group {group}
            </div>
            <span className="node-group-label">{groupLabels[group]}</span>
          </div>

          <div className="node-list">
            {groupNodes.map((node) => {
              const isCurrent = node.id === currentNodeId;
              const icon = node.icon || defaultNodeIcons[node.hostname] || <Server size={20} />;

              return (
                <button
                  key={node.id}
                  className={`node-item ${isCurrent ? 'current' : ''} ${node.status}`}
                  onClick={() => onNodeSelect(node.id)}
                >
                  <div className="node-icon">{icon}</div>
                  
                  <div className="node-info">
                    <div className="node-name">{node.name}</div>
                    <div className="node-hostname">{node.hostname}</div>
                    <div className="node-description">{node.description}</div>
                  </div>

                  <div className="node-status-indicator">
                    <div className={`status-dot ${node.status}`}></div>
                    {isCurrent && <span className="current-label">Текущий</span>}
                  </div>

                  <ExternalLink size={16} className="node-external-icon" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="node-switcher-legend">
        <div className="legend-item">
          <div className="legend-dot online"></div>
          <span>Онлайн</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot degraded"></div>
          <span>Деградация</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot offline"></div>
          <span>Офлайн</span>
        </div>
      </div>
    </div>
  );
}
