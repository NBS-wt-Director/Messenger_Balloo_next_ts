'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, Trash2, Play, Pause } from 'lucide-react';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface LogViewerProps {
  logs: LogEntry[];
  maxEntries?: number;
  autoScroll?: boolean;
  showFilters?: boolean;
  onClear?: () => void;
  onExport?: (logs: LogEntry[]) => void;
  className?: string;
}

const levelColors: Record<LogLevel, string> = {
  debug: '#6B7280',
  info: '#0066FF',
  warn: '#F59E0B',
  error: '#EF4444',
};

const levelLabels: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
};

export function LogViewer({
  logs,
  maxEntries = 1000,
  autoScroll = true,
  showFilters = true,
  onClear,
  onExport,
  className = ''
}: LogViewerProps) {
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const levelMatch = filterLevel === 'all' || log.level === filterLevel;
    const searchMatch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchQuery.toLowerCase());
    return levelMatch && searchMatch;
  });

  // Limit entries
  const displayedLogs = filteredLogs.slice(-maxEntries);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && !isPaused && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLogs, autoScroll, isPaused]);

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  const handleExport = () => {
    if (onExport) {
      onExport(displayedLogs);
    } else {
      // Default export to JSON
      const blob = new Blob([JSON.stringify(displayedLogs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`log-viewer ${className}`}>
      {/* Toolbar */}
      {showFilters && (
        <div className="log-toolbar">
          <div className="log-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Поиск в логах..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="log-filters">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'all')}
              className="log-level-filter"
            >
              <option value="all">Все уровни</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>

            <button
              className="log-action-btn"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>

            {onClear && (
              <button className="log-action-btn" onClick={onClear} title="Clear">
                <Trash2 size={16} />
              </button>
            )}

            <button className="log-action-btn" onClick={handleExport} title="Export">
              <Download size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Log entries */}
      <div className="log-container">
        {displayedLogs.length === 0 ? (
          <div className="log-empty">Нет логов для отображения</div>
        ) : (
          displayedLogs.map((log) => (
            <div key={log.id} className={`log-entry ${log.level}`}>
              <div className="log-timestamp">
                {formatTimestamp(log.timestamp)}
              </div>
              <div 
                className="log-level" 
                style={{ color: levelColors[log.level] }}
              >
                {levelLabels[log.level]}
              </div>
              {log.source && (
                <div className="log-source">[{log.source}]</div>
              )}
              <div className="log-message">{log.message}</div>
              {log.metadata && (
                <pre className="log-metadata">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Footer stats */}
      <div className="log-footer">
        <span>
          Показано: {displayedLogs.length} из {logs.length}
        </span>
        {isPaused && <span className="log-paused">⏸ На паузе</span>}
      </div>
    </div>
  );
}
