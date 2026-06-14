'use client';

import React, { useEffect, useState } from 'react';
import { CPU, Memory, Network, Database, HardDrive, Activity, AlertTriangle } from 'lucide-react';

export interface SystemMetrics {
  cpuUsage: number;        // % (0-100)
  memoryUsage: number;     // MB
  activeConnections: number;
  smsQueue: number;
  dbLoad: number;          // queries/s
  diskUsage: number;       // GB
  uptime: number;          // seconds
  errorRate: number;       // errors/minute
}

export interface StatsDashboardProps {
  metrics: SystemMetrics;
  refreshInterval?: number; // ms
  onRefresh?: () => void;
  className?: string;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
  color?: string;
}

function MetricCard({ icon, label, value, unit, status = 'normal', color = '#0066FF' }: MetricCardProps) {
  const statusColors = {
    normal: 'border-gray-200',
    warning: 'border-yellow-400',
    critical: 'border-red-500',
  };

  return (
    <div className={`stats-card metric-card ${statusColors[status]}`}>
      <div className="metric-icon" style={{ color }}>
        {icon}
      </div>
      <div className="metric-content">
        <div className="metric-label">{label}</div>
        <div className="metric-value">
          {value}
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

export function StatsDashboard({ 
  metrics, 
  refreshInterval = 5000, 
  onRefresh,
  className = '' 
}: StatsDashboardProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
      onRefresh?.();
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval, onRefresh]);

  const getCPUStatus = (usage: number): 'normal' | 'warning' | 'critical' => {
    if (usage > 90) return 'critical';
    if (usage > 70) return 'warning';
    return 'normal';
  };

  const getMemoryStatus = (usage: number): 'normal' | 'warning' | 'critical' => {
    if (usage > 8000) return 'critical'; // 8GB
    if (usage > 6000) return 'warning';  // 6GB
    return 'normal';
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  };

  return (
    <div className={`stats-dashboard ${className}`}>
      <div className="stats-header">
        <h2 className="stats-title">Системные метрики</h2>
        <div className="stats-last-update">
          Обновлено: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="stats-grid">
        {/* CPU Usage */}
        <MetricCard
          icon={<CPU size={24} />}
          label="CPU Usage"
          value={metrics.cpuUsage.toFixed(1)}
          unit="%"
          status={getCPUStatus(metrics.cpuUsage)}
          color={metrics.cpuUsage > 70 ? '#F59E0B' : '#10B981'}
        />

        {/* Memory Usage */}
        <MetricCard
          icon={<Memory size={24} />}
          label="Memory Usage"
          value={(metrics.memoryUsage / 1024).toFixed(2)}
          unit="GB"
          status={getMemoryStatus(metrics.memoryUsage)}
          color={metrics.memoryUsage > 6000 ? '#F59E0B' : '#10B981'}
        />

        {/* Active Connections */}
        <MetricCard
          icon={<Network size={24} />}
          label="Connections"
          value={metrics.activeConnections.toLocaleString()}
          color="#0066FF"
        />

        {/* Database Load */}
        <MetricCard
          icon={<Database size={24} />}
          label="DB Load"
          value={metrics.dbLoad}
          unit="q/s"
          color="#8B5CF6"
        />

        {/* Disk Usage */}
        <MetricCard
          icon={<HardDrive size={24} />}
          label="Disk Usage"
          value={metrics.diskUsage.toFixed(1)}
          unit="GB"
          color="#F97316"
        />

        {/* SMS Queue */}
        <MetricCard
          icon={<Activity size={24} />}
          label="SMS Queue"
          value={metrics.smsQueue}
          color={metrics.smsQueue > 10 ? '#F59E0B' : '#10B981'}
        />

        {/* Error Rate */}
        <MetricCard
          icon={<AlertTriangle size={24} />}
          label="Error Rate"
          value={metrics.errorRate.toFixed(2)}
          unit="/min"
          status={metrics.errorRate > 5 ? 'warning' : 'normal'}
          color={metrics.errorRate > 5 ? '#F59E0B' : '#10B981'}
        />

        {/* Uptime */}
        <MetricCard
          icon={<Activity size={24} />}
          label="Uptime"
          value={formatUptime(metrics.uptime)}
          color="#10B981"
        />
      </div>

      {/* Alert Section */}
      {(metrics.cpuUsage > 90 || metrics.memoryUsage > 8000 || metrics.errorRate > 20) && (
        <div className="stats-alerts">
          <div className="alert alert-critical">
            <AlertTriangle size={20} />
            <span>Критическая нагрузка на систему!</span>
          </div>
        </div>
      )}
    </div>
  );
}
