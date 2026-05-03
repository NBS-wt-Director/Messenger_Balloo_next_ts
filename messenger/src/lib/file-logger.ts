/**
 * File Logger для приложения Balloo
 * Логирование в JSON файл с возможностью просмотра из админки
 */

import * as fs from 'fs';
import * as path from 'path';

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

// Конфигурация
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = process.env.LOG_FILE || path.join(LOG_DIR, 'app.json');
const MAX_LOG_SIZE = parseInt(process.env.MAX_LOG_SIZE || '10485760', 10); // 10MB
const MAX_LOG_ENTRIES = parseInt(process.env.MAX_LOG_ENTRIES || '10000', 10);

// Буфер для логов
let logBuffer: LogEntry[] = [];
let isInitialized = false;

// Инициализация
function init(): void {
  if (isInitialized) return;
  
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  
  // Проверка размера файла
  if (fs.existsSync(LOG_FILE)) {
    const stats = fs.statSync(LOG_FILE);
    if (stats.size > MAX_LOG_SIZE) {
      // Архивировать старый лог
      const archiveName = `${LOG_FILE}.${Date.now()}.bak`;
      fs.renameSync(LOG_FILE, archiveName);
      logBuffer = [];
    }
  }
  
  isInitialized = true;
}

// Запись лога
function writeLog(entry: LogEntry): void {
  init();
  
  logBuffer.push(entry);
  
  // Сброс буфера если достигнут лимит
  if (logBuffer.length >= MAX_LOG_ENTRIES) {
    flush();
  }
  
  // Асинхронная запись в файл
  setTimeout(() => flush(), 100);
}

// Сброс буфера в файл
export function flush(): void {
  if (logBuffer.length === 0) return;
  
  try {
    const content = logBuffer.map(entry => JSON.stringify(entry)).join('\n');
    fs.appendFileSync(LOG_FILE, content + '\n');
    logBuffer = [];
  } catch (error) {
    console.error('[FileLogger] Failed to write log:', error);
  }
}

// Получить логи (для админки)
export function getLogs(options?: {
  limit?: number;
  level?: LogLevel;
  since?: string;
  module?: string;
}): LogEntry[] {
  init();
  
  if (!fs.existsSync(LOG_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    let entries: LogEntry[] = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .reverse(); // Новые логи первыми
    
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
      entries = entries.slice(0, options.limit);
    }
    
    return entries;
  } catch (error) {
    console.error('[FileLogger] Failed to read logs:', error);
    return [];
  }
}

// Очистка старых логов
export function clearLogs(olderThanDays: number = 7): number {
  init();
  
  if (!fs.existsSync(LOG_FILE)) {
    return 0;
  }
  
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);
    
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    const entries = content.split('\n').filter(line => line.trim());
    const validEntries = entries.filter(line => {
      try {
        const entry = JSON.parse(line);
        return new Date(entry.timestamp) >= cutoff;
      } catch {
        return true;
      }
    });
    
    const removed = entries.length - validEntries.length;
    
    if (validEntries.length === 0) {
      fs.unlinkSync(LOG_FILE);
    } else {
      fs.writeFileSync(LOG_FILE, validEntries.join('\n') + '\n');
    }
    
    return removed;
  } catch (error) {
    console.error('[FileLogger] Failed to clear logs:', error);
    return 0;
  }
}

// Создание логгера
export function createFileLogger(module?: string): FileLogger {
  return {
    debug: (message: string, meta?: any) => {
      if (process.env.NODE_ENV === 'production' || process.env.LOG_LEVEL === 'debug') {
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
