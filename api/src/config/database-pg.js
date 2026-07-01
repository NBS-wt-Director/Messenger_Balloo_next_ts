/**
 * Database Configuration
 * PostgreSQL с Connection Pooling
 */

const { Pool } = require('pg');
const logger = require('./logger');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  connectionString: process.env.DATABASE_URL || 'postgresql://balloo:password@localhost:5432/balloo_production',
  max: parseInt(process.env.DB_POOL_SIZE) || 20,           // Максимум соединений в пуле
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,  // Таймаут простоя
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000, // Таймаут подключения
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT) || 30000 // Таймаут запроса
};

// ============================================
// POOL INITIALIZATION
// ============================================

const pool = new Pool(CONFIG);

// Обработчики событий пула
pool.on('connect', (client) => {
  logger.info('New client connected to PostgreSQL');
});

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
});

pool.on('remove', (client) => {
  logger.info('Client removed from pool');
});

// ============================================
// QUERY HELPER
// ============================================

async function query(text, params) {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug(`Query executed in ${duration}ms`, { text, duration });
    
    return result;
  } catch (error) {
    logger.error('Database query error:', { error: error.message, text });
    throw error;
  }
}

// ============================================
// TRANSACTION HELPER
// ============================================

async function transaction(callback) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// ============================================
// POOL STATS
// ============================================

function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    max: CONFIG.max
  };
}

// ============================================
// HEALTH CHECK
// ============================================

async function checkHealth() {
  try {
    const result = await pool.query('SELECT 1');
    return {
      status: 'healthy',
      type: 'database',
      pool: getPoolStats()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      type: 'database',
      error: error.message
    };
  }
}

// ============================================
// CLOSE POOL
// ============================================

async function closePool() {
  logger.info('Closing database pool...');
  await pool.end();
  logger.info('Database pool closed');
}

// ============================================
// INIT DATABASE (compatibility wrapper)
// ============================================

async function initDatabase() {
  try {
    const result = await pool.query('SELECT 1');
    console.log('PostgreSQL connected successfully');
    return { status: 'connected' };
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    throw error;
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  pool,
  query,
  transaction,
  getPoolStats,
  checkHealth,
  closePool,
  initDatabase
};
