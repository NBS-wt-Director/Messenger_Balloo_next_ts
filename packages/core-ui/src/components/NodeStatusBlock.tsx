'use client';

import React from 'react';
import { Server, CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';

export type NodeStatus = 'online' | 'offline' | 'degraded';

export interface NodeStatusBlockProps {
  nodeId: string;
  hostname: string;
  status: NodeStatus;
  uptime?: number; // seconds
  cpuUsage?: number; // %
  memoryUsage?: number; // MB
  lastHeartbeat?: number; // timestamp
  onClick?: () => void;
  className?: string;
}

const statusConfig: Record<NodeStatus, { icon: any; color: string; label: string }> = {
  online: { icon: CheckCircle, color: '#10B981', label: 'Онлайн' },
  offline: { icon: XCircle, color: '#EF4444', label: 'Офлайн' },
  degraded: { icon: AlertTriangle, color: '#F59E0B', label: 'Деградация' },
};

export function NodeStatusBlock({
  nodeId,
  hostname,
  status,
  uptime = 0,
  cpuUsage = 0,
  memoryUsage = 0,
  lastHeartbeat,
  onClick,
  className = ''
}: NodeStatusBlockProps) {
  const Config = statusConfig[status];
  const Icon = Config.icon;

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  const formatLastHeartbeat = (timestamp?: number): string => {
    if (!timestamp) return 'Никогда';
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Только что';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}м назад`;
    return `${Math.floor(seconds / 3600)}ч назад`;
  };

  return (
    <div 
      className={`node-status-block ${className} ${status}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="node-header">
        <div className="node-icon">
          <Server size={24} />
        </div>
        <div className="node-info">
          <div className="node-id">{nodeId}</div>
          <div className="node-hostname">{hostname}</div>
        </div>
        <div className="node-status-indicator" style={{ color: Config.color }}>
          <Icon size={20} />
          <span className="node-status-label">{Config.label}</span>
        </div>
      </div>

      <div className="node-metrics">
        {uptime > 0 && (
          <div className="node-metric">
            <Activity size={14} />
            <span>Uptime: {formatUptime(uptime)}</span>
          </div>
        )}

        {cpuUsage > 0 && (
          <div className="node-metric">
            <Activity size={14} />
            <span>CPU: {cpuUsage.toFixed(1)}%</span>
          </div>
        )}

        {memoryUsage > 0 && (
          <div className="node-metric">
            <Activity size={14} />
            <span>RAM: {(memoryUsage / 1024).toFixed(2)} GB</span>
          </div>
        )}

        {lastHeartbeat && (
          <div className="node-metric">
            <Activity size={14} />
            <span>Heartbeat: {formatLastHeartbeat(lastHeartbeat)}</span>
          </div>
        )}
      </div>

      {/* Status-specific styling */}
      {status === 'online' && (
        <div className="node-status-bar online"></div>
      )}
      {status === 'degraded' && (
        <div className="node-status-bar degraded"></div>
      )}
      {status === 'offline' && (
        <div className="node-status-bar offline"></div>
      )}
    </div>
  );
}
