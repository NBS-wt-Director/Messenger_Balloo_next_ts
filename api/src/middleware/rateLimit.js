/**
 * Rate Limiting Middleware
 * Ограничение частоты запросов для защиты от abuse
 * С Redis persistence
 */

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { redis } = require('../config/redis');
const logger = require('../config/logger');

// ============================================
// GLOBAL RATE LIMITER
// ============================================

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов за окно
  store: new RedisStore({
    sendCommand: (...args) => redis.sendCommand(...args),
    prefix: 'ratelimit:global:'
  }),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Слишком много запросов. Попробуйте позже.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Слишком много запросов. Попробуйте через 15 минут.'
      }
    });
  }
});

// ============================================
// STRICT RATE LIMITER (для auth endpoints)
// ============================================

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 20, // максимум 20 запросов в час
  store: new RedisStore({
    sendCommand: (...args) => redis.sendCommand(...args),
    prefix: 'ratelimit:auth:'
  }),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Слишком много попыток авторизации. Попробуйте позже.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for ${req.ip}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Слишком много попыток авторизации. Попробуйте через час.'
      }
    });
  }
});

// ============================================
// SMS RATE LIMITER
// ============================================

const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 10, // максимум 10 SMS в час
  store: new RedisStore({
    sendCommand: (...args) => redis.sendCommand(...args),
    prefix: 'ratelimit:sms:'
  }),
  message: {
    success: false,
    error: {
      code: 'SMS_RATE_LIMIT_EXCEEDED',
      message: 'Слишком много SMS. Попробуйте позже.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`SMS rate limit exceeded for user ${req.user?.id || req.ip}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'SMS_RATE_LIMIT_EXCEEDED',
        message: 'Слишком много запросов на отправку SMS. Попробуйте через час.'
      }
    });
  }
});

// ============================================
// UPLOAD RATE LIMITER
// ============================================

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 50, // максимум 50 загрузок в час
  store: new RedisStore({
    sendCommand: (...args) => redis.sendCommand(...args),
    prefix: 'ratelimit:upload:'
  }),
  message: {
    success: false,
    error: {
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      message: 'Слишком много загрузок файлов. Попробуйте позже.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ============================================
// WEBSOCKET RATE LIMITER (Redis persistence)
// ============================================

const WEBSOCKET_WINDOW_MS = 3000; // 3 секунды
const WEBSOCKET_MAX_MESSAGES = 10; // 10 сообщений за 3 секунды

async function checkWebSocketRateLimit(userId) {
  try {
    const key = `ws:ratelimit:${userId}`;
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, Math.ceil(WEBSOCKET_WINDOW_MS / 1000));
    }
    
    return count <= WEBSOCKET_MAX_MESSAGES;
  } catch (error) {
    logger.error('WebSocket rate limit check error:', error);
    return true; // Fail open
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  globalLimiter,
  authLimiter,
  smsLimiter,
  uploadLimiter,
  checkWebSocketRateLimit
};
