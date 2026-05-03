/**
 * Logger для приложения Balloo
 * Заменяет console.log в production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebug = process.env.DEBUG === 'true';

function formatMessage(level: LogLevel, message: string, ...args: any[]): string {
  const timestamp = new Date().toISOString();
  const argsStr = args.length > 0 ? args.map(a => 
    typeof a === 'object' ? JSON.stringify(a) : String(a)
  ).join(' ') : '';
  
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${argsStr}`.trim();
}

// File logger для production
let fileLogger: any = null;
if (!isDevelopment) {
  try {
    const { createFileLogger } = require('./file-logger');
    fileLogger = createFileLogger();
  } catch (e) {
    // File logger не доступен
  }
}

export const logger: Logger = {
  debug: (...args: any[]) => {
    if (isDevelopment || isDebug) {
      console.log(formatMessage('debug', args[0], ...args.slice(1)));
    }
    fileLogger?.debug?.(args[0], args.slice(1));
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(formatMessage('info', args[0], ...args.slice(1)));
    }
    fileLogger?.info?.(args[0], args.slice(1));
  },
  
  warn: (...args: any[]) => {
    console.warn(formatMessage('warn', args[0], ...args.slice(1)));
    fileLogger?.warn?.(args[0], args.slice(1));
  },
  
  error: (...args: any[]) => {
    console.error(formatMessage('error', args[0], ...args.slice(1)));
    fileLogger?.error?.(args[0], args.slice(1));
  },
};

// Экспорт для использования в API routes
export function createLogger(prefix: string) {
  return {
    debug: (...args: any[]) => logger.debug(`[${prefix}]`, ...args),
    info: (...args: any[]) => logger.info(`[${prefix}]`, ...args),
    warn: (...args: any[]) => logger.warn(`[${prefix}]`, ...args),
    error: (...args: any[]) => logger.error(`[${prefix}]`, ...args),
  };
}
