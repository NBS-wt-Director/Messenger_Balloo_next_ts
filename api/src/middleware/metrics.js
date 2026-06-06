/**
 * Prometheus Metrics Endpoint
 * Метрики для мониторинга системы
 */

const logger = require('../config/logger');

// Metrics storage
const metrics = {
  httpRequests: {
    total: 0,
    byEndpoint: new Map(),
    byStatus: new Map()
  },
  websocketConnections: {
    total: 0,
    active: 0,
    errors: 0
  },
  database: {
    queries: 0,
    errors: 0,
    avgResponseTime: 0
  },
  errors: {
    total: 0,
    byType: new Map()
  },
  startTime: Date.now()
};

// ============================================
// METRICS ENDPOINT
// ============================================

function getMetrics() {
  const uptime = Date.now() - metrics.startTime;
  
  return {
    // System
    uptime,
    uptimeFormatted: formatDuration(uptime),
    timestamp: Date.now(),
    
    // HTTP
    http: {
      requests: {
        total: metrics.httpRequests.total,
        byEndpoint: Object.fromEntries(metrics.httpRequests.byEndpoint),
        byStatus: Object.fromEntries(metrics.httpRequests.byStatus)
      }
    },
    
    // WebSocket
    websocket: {
      connections: {
        total: metrics.websocketConnections.total,
        active: metrics.websocketConnections.active,
        errors: metrics.websocketConnections.errors
      }
    },
    
    // Database
    database: {
      queries: metrics.database.queries,
      errors: metrics.database.errors,
      avgResponseTime: metrics.database.avgResponseTime
    },
    
    // Errors
    errors: {
      total: metrics.errors.total,
      byType: Object.fromEntries(metrics.errors.byType)
    },
    
    // Process
    process: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      nodeVersion: process.version,
      platform: process.platform
    }
  };
}

// ============================================
// METRICS TRACKERS
// ============================================

function trackHttpRequest(method, path, statusCode, duration) {
  metrics.httpRequests.total++;
  
  const endpoint = `${method}:${path}`;
  metrics.httpRequests.byEndpoint.set(
    endpoint,
    (metrics.httpRequests.byEndpoint.get(endpoint) || 0) + 1
  );
  
  const statusGroup = `${Math.floor(statusCode / 100)}xx`;
  metrics.httpRequests.byStatus.set(
    statusGroup,
    (metrics.httpRequests.byStatus.get(statusGroup) || 0) + 1
  );
}

function trackWebSocketConnection() {
  metrics.websocketConnections.total++;
  metrics.websocketConnections.active++;
}

function trackWebSocketDisconnection() {
  metrics.websocketConnections.active = Math.max(0, metrics.websocketConnections.active - 1);
}

function trackWebSocketError() {
  metrics.websocketConnections.errors++;
}

function trackDatabaseQuery(duration) {
  metrics.database.queries++;
  // Running average
  metrics.database.avgResponseTime = 
    (metrics.database.avgResponseTime * (metrics.database.queries - 1) + duration) / 
    metrics.database.queries;
}

function trackDatabaseError() {
  metrics.database.errors++;
}

function trackError(type, message) {
  metrics.errors.total++;
  metrics.errors.byType.set(
    type,
    (metrics.errors.byType.get(type) || 0) + 1
  );
  logger.error(`Error tracked: ${type} - ${message}`);
}

// ============================================
// MIDDLEWARE
// ============================================

function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    trackHttpRequest(req.method, req.path, res.statusCode, duration);
  });
  
  next();
}

// ============================================
// PROMETHEUS FORMAT
// ============================================

function getPrometheusMetrics() {
  const m = metrics;
  let output = '';
  
  // HTTP requests
  output += `# HELP http_requests_total Total HTTP requests\n`;
  output += `# TYPE http_requests_total counter\n`;
  output += `http_requests_total ${m.httpRequests.total}\n`;
  
  // HTTP by status
  output += `\n# HELP http_requests_by_status HTTP requests by status code\n`;
  output += `# TYPE http_requests_by_status counter\n`;
  for (const [status, count] of m.httpRequests.byStatus) {
    output += `http_requests_by_status{status="${status}"} ${count}\n`;
  }
  
  // WebSocket connections
  output += `\n# HELP websocket_connections_active Active WebSocket connections\n`;
  output += `# TYPE websocket_connections_active gauge\n`;
  output += `websocket_connections_active ${m.websocketConnections.active}\n`;
  
  output += `\n# HELP websocket_connections_total Total WebSocket connections\n`;
  output += `# TYPE websocket_connections_total counter\n`;
  output += `websocket_connections_total ${m.websocketConnections.total}\n`;
  
  // Database queries
  output += `\n# HELP database_queries_total Total database queries\n`;
  output += `# TYPE database_queries_total counter\n`;
  output += `database_queries_total ${m.database.queries}\n`;
  
  output += `\n# HELP database_errors_total Total database errors\n`;
  output += `# TYPE database_errors_total counter\n`;
  output += `database_errors_total ${m.database.errors}\n`;
  
  // Errors
  output += `\n# HELP errors_total Total errors\n`;
  output += `# TYPE errors_total counter\n`;
  output += `errors_total ${m.errors.total}\n`;
  
  // Uptime
  output += `\n# HELP process_uptime_seconds Process uptime in seconds\n`;
  output += `# TYPE process_uptime_seconds counter\n`;
  output += `process_uptime_seconds ${Math.floor(Date.now() - m.startTime)}\n`;
  
  // Memory
  output += `\n# HELP process_memory_bytes Process memory usage\n`;
  output += `# TYPE process_memory_bytes gauge\n`;
  output += `process_memory_bytes ${process.memoryUsage().heapUsed}\n`;
  
  return output;
}

// ============================================
// UTILS
// ============================================

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Get metrics
  getMetrics,
  getPrometheusMetrics,
  
  // Trackers
  trackHttpRequest,
  trackWebSocketConnection,
  trackWebSocketDisconnection,
  trackWebSocketError,
  trackDatabaseQuery,
  trackDatabaseError,
  trackError,
  
  // Middleware
  metricsMiddleware
};
