'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface NodeMetrics {
  nodeId: string;
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
}

export interface RealTimeStatsProps {
  nodeId: string;
  metrics: NodeMetrics;
  updateStream?: WebSocket;
  refreshInterval?: number; // ms
  showTrend?: boolean;
  className?: string;
}

interface TrendIndicatorProps {
  current: number;
  previous: number;
  suffix?: string;
}

function TrendIndicator({ current, previous, suffix = '' }: TrendIndicatorProps) {
  const diff = current - previous;
  const percent = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : '0';

  if (Math.abs(diff) < 0.1) {
    return (
      <span className="trend-indicator neutral">
        <Minus size={14} />
        <span>{current}{suffix}</span>
      </span>
    );
  }

  return (
    <span className={`trend-indicator ${diff > 0 ? 'up' : 'down'}`}>
      {diff > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span>{current}{suffix} ({percent > 0 ? '+' : ''}{percent}%)</span>
    </span>
  );
}

export function RealTimeStats({
  nodeId,
  metrics,
  updateStream,
  refreshInterval = 1000,
  showTrend = true,
  className = ''
}: RealTimeStatsProps) {
  const [history, setHistory] = useState<NodeMetrics[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!updateStream) return;

    wsRef.current = new WebSocket(updateStream);

    wsRef.current.onopen = () => {
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'metrics:update' && data.payload.nodeId === nodeId) {
          setHistory(prev => [...prev.slice(-59), data.payload.metrics]);
        }
      } catch (e) {
        console.error('Failed to parse metrics:', e);
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [updateStream, nodeId]);

  // Fallback to polling if no WebSocket
  useEffect(() => {
    if (updateStream || !refreshInterval) return;

    const timer = setInterval(() => {
      setHistory(prev => [...prev.slice(-59), metrics]);
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [updateStream, refreshInterval, metrics]);

  // Calculate averages
  const getAverage = (key: keyof NodeMetrics): number => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, m) => acc + (m[key] as number), 0);
    return sum / history.length;
  };

  const avgCPU = getAverage('cpuUsage');
  const avgMemory = getAverage('memoryUsage');
  const avgConnections = getAverage('activeConnections');
  const avgRPS = getAverage('requestsPerSecond');

  return (
    <div className={`realtime-stats ${className}`}>
      <div className="realtime-header">
        <h3 className="realtime-title">
          <Activity size={20} />
          Real-time Statistics
        </h3>
        <div className="realtime-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          {isConnected ? 'Live' : 'Polling'}
        </div>
      </div>

      <div className="realtime-grid">
        {/* CPU */}
        <div className="realtime-card">
          <div className="realtime-label">CPU Usage</div>
          {showTrend && history.length > 1 ? (
            <TrendIndicator 
              current={metrics.cpuUsage} 
              previous={avgCPU} 
              suffix="%" 
            />
          ) : (
            <div className="realtime-value">{metrics.cpuUsage.toFixed(1)}%</div>
          )}
        </div>

        {/* Memory */}
        <div className="realtime-card">
          <div className="realtime-label">Memory</div>
          {showTrend && history.length > 1 ? (
            <TrendIndicator 
              current={metrics.memoryUsage / 1024} 
              previous={avgMemory / 1024} 
              suffix=" GB" 
            />
          ) : (
            <div className="realtime-value">{(metrics.memoryUsage / 1024).toFixed(2)} GB</div>
          )}
        </div>

        {/* Connections */}
        <div className="realtime-card">
          <div className="realtime-label">Connections</div>
          {showTrend && history.length > 1 ? (
            <TrendIndicator 
              current={metrics.activeConnections} 
              previous={avgConnections} 
            />
          ) : (
            <div className="realtime-value">{metrics.activeConnections.toLocaleString()}</div>
          )}
        </div>

        {/* Requests/sec */}
        <div className="realtime-card">
          <div className="realtime-label">Requests/sec</div>
          {showTrend && history.length > 1 ? (
            <TrendIndicator 
              current={metrics.requestsPerSecond} 
              previous={avgRPS} 
            />
          ) : (
            <div className="realtime-value">{metrics.requestsPerSecond.toLocaleString()}</div>
          )}
        </div>
      </div>

      {/* Mini chart placeholder */}
      {history.length > 0 && (
        <div className="realtime-chart">
          <div className="chart-bars">
            {history.slice(-20).map((m, i) => (
              <div
                key={i}
                className="chart-bar"
                style={{
                  height: `${Math.min(m.cpuUsage, 100)}%`,
                  backgroundColor: m.cpuUsage > 70 ? '#F59E0B' : '#10B981',
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
