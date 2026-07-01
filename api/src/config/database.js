/**
 * Конфигурация базы данных
 * PostgreSQL с Connection Pooling (PgBouncer)
 */

const { query, transaction, getPoolStats, checkHealth, closePool } = require('./database-pg');

module.exports = {
  // PostgreSQL pool functions
  query,
  transaction,
  getPoolStats,
  checkHealth,
  closePool,
  
  // SQLite-compatible wrapper for existing code
  db: {
    prepare(sql) {
      const self = this;
      return {
        get: function(...args) {
          return query(sql, args).then(r => r.rows[0] || null);
        },
        run: function(...args) {
          return query(sql, args).then(r => ({ changes: r.rowCount || 0 }));
        },
        all: function(...args) {
          return query(sql, args).then(r => r.rows || []);
        }
      };
    }
  },
  
  // Async versions for controllers that need await
  dbAsync: {
    prepare(sql) {
      return {
        get: async function(...args) {
          const result = await query(sql, args);
          return result.rows[0] || null;
        },
        run: async function(...args) {
          const result = await query(sql, args);
          return { changes: result.rowCount || 0 };
        },
        all: async function(...args) {
          const result = await query(sql, args);
          return result.rows || [];
        }
      };
    }
  }
};
