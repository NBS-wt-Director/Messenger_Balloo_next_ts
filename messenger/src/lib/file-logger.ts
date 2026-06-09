/**
 * File Logger для приложения Balloo
 * Client-side version - логи хранятся в localStorage
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: any;
  module?: string;
}

interface FileLogger {
  debug: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
  flush: () => void;
}

const LOG_STORAGE_KEY = 'balloo_logs';
const MAX_LOG_ENTRIES = 1000;

// Получить логи из localStorage
function getStoredLogs(): LogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const logs = localStorage.getItem(LOG_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
}
  
// Сохранить логи в localStorage
function setStoredLogs(logs: LogEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Ограничиваем количество записей
    const trimmedLogs = logs.slice(-MAX_LOG_ENTRIES);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('[FileLogger] Failed to save logs:', error);
  }
}

// Запись лога
function writeLog(entry: LogEntry): void {
  if (typeof window === 'undefined') return;
  
  const logs = getStoredLogs();
  logs.push(entry);
  setStoredLogs(logs);
}

// Сброс буфера в файл
export function flush(): void {
  // Client-side: ничего не делаем, логи уже в localStorage
}

// Получить логи (для админки)
export function getLogs(options?: {
  limit?: number;
  level?: LogLevel;
  since?: string;
  module?: string;
}): LogEntry[] {
  let entries = getStoredLogs();
  
  // Фильтрация
  if (options?.level) {
    entries = entries.filter(e => e.level === options.level);
  }
  
  if (options?.since) {
    entries = entries.filter(e => new Date(e.timestamp) >= new Date(options.since!));
  }
  
  if (options?.module) {
    entries = entries.filter(e => e.module === options.module);
  }
  
  // Лимит
  if (options?.limit) {
    entries = entries.slice(-options.limit);
  }
  
  return entries.reverse();
}

// Очистка логов
export function clearLogs(): number {
  if (typeof window === 'undefined') return 0;
  try {
    localStorage.removeItem(LOG_STORAGE_KEY);
    return getStoredLogs().length;
  } catch {
    return 0;
  }
}

// Создание логгера
export function createFileLogger(module?: string): FileLogger {
  return {
    debug: (message: string, meta?: any) => {
      if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
        writeLog({
          timestamp: new Date().toISOString(),
          level: 'debug',
          message,
          meta,
          module,
        });
      }
    },
    
    info: (message: string, meta?: any) => {
      writeLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        message,
        meta,
        module,
      });
    },
    
    warn: (message: string, meta?: any) => {
      writeLog({
        timestamp: new Date().toISOString(),
        level: 'warn',
        message,
        meta,
        module,
      });
    },
    
    error: (message: string, meta?: any) => {
      writeLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        message,
        meta,
        module,
      });
    },
    
    flush,
  };
}

// Глобальный логгер
export const fileLogger = createFileLogger();
