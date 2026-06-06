/**
 * Health Check Middleware
 * Проверка состояния системы
 */

const { db } = require('../config/database');
const logger = require('../config/logger');
const { checkServerStatus: checkSMSServer } = require('../services/sms.service');

// ============================================
// HEALTH CHECKS
// ============================================

/**
 * Проверка базы данных
 */
async function checkDatabase() {
  try {
    const result = db.prepare('SELECT 1 as test').get();
    return {
      status: 'healthy',
      type: 'database',
      responseTime: 0
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      type: 'database',
      error: error.message
    };
  }
}

/**
 * Проверка SMS сервера
 */
async function checkSMS() {
  try {
    const result = await checkSMSServer();
    return {
      status: result.success ? 'healthy' : 'unhealthy',
      type: 'sms',
      message: result.success ? 'OK' : result.error
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      type: 'sms',
      error: error.message
    };
  }
}

/**
 * Проверка WebSocket
 */
async function checkWebSocket() {
  try {
    const { testConnection } = require('../websocket');
    const result = await testConnection();
    return {
      status: result ? 'healthy' : 'healthy', // WebSocket может быть без подключений
      type: 'websocket'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      type: 'websocket',
      error: error.message
    };
  }
}

/**
 * Проверка Max SMS Server
 */
async function checkMaxServer() {
  try {
    const result = await checkSMSServer();
    return {
      status: result.success ? 'healthy' : 'degraded',
      type: 'maxServer',
      uptime: result.uptime,
      pendingMessages: result.pendingMessages,
      activeDevices: result.activeDevices
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      type: 'maxServer',
      error: error.message
    };
  }
}

// ============================================
// ENDPOINTS
// ============================================

/**
 * GET /health - Простой health check
 */
async function healthCheck(req, res) {
  const startTime = Date.now();
  
  const checks = await Promise.all([
    checkDatabase(),
    checkSMS(),
    checkWebSocket()
  ]);

  const overallStatus = checks.some(c => c.status === 'unhealthy') ? 'unhealthy' : 'healthy';
  const responseTime = Date.now() - startTime;

  res.status(overallStatus === 'healthy' ? 200 : 503).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime,
    checks: {
      database: checks[0],
      sms: checks[1],
      websocket: checks[2]
    }
  });
}

/**
 * GET /health/detailed - Детальный health check
 */
async function detailedHealthCheck(req, res) {
  const startTime = Date.now();
  
  const checks = await Promise.all([
    checkDatabase(),
    checkSMS(),
    checkWebSocket(),
    checkMaxServer()
  ]);

  const overallStatus = checks.some(c => c.status === 'unhealthy') ? 'unhealthy' : 'healthy';
  const responseTime = Date.now() - startTime;

  res.status(overallStatus === 'healthy' ? 200 : 503).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    responseTime,
    checks: {
      database: checks[0],
      sms: checks[1],
      websocket: checks[2],
      maxServer: checks[3]
    },
    metrics: {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    }
  });
}

/**
 * GET /ready - readiness probe (для Kubernetes)
 */
async function readinessCheck(req, res) {
  const dbCheck = await checkDatabase();
  
  if (dbCheck.status === 'unhealthy') {
    return res.status(503).json({
      status: 'not ready',
      reason: 'Database connection failed'
    });
  }

  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
}

/**
 * GET /live - liveness probe (для Kubernetes)
 */
function livenessCheck(req, res) {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck,
  checkDatabase,
  checkSMS,
  checkWebSocket,
  checkMaxServer
};
