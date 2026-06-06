/**
 * Redis Client
 * Кэширование, сессии, persistence для real-time данных
 */

const Redis = require('ioredis');
const logger = require('./logger');

// Конфигурация
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || null,
  db: parseInt(process.env.REDIS_DB) || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    logger.warn(`Redis connection attempt ${times}, retrying in ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  lazyConnect: true
};

// Создание клиента
const redis = new Redis(redisConfig);

// Обработчики событий
redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Кэшировать данные
 */
async function set(key, value, ttl = 3600) {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis set error:', error);
    return false;
  }
}

/**
 * Получить данные из кэша
 */
async function get(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
}

/**
 * Удалить данные из кэша
 */
async function del(key) {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    logger.error('Redis del error:', error);
    return false;
  }
}

/**
 * Увеличить TTL ключа
 */
async function expire(key, ttl) {
  try {
    await redis.expire(key, ttl);
    return true;
  } catch (error) {
    logger.error('Redis expire error:', error);
    return false;
  }
}

/**
 * Проверить существование ключа
 */
async function exists(key) {
  try {
    const result = await redis.exists(key);
    return result === 1;
  } catch (error) {
    logger.error('Redis exists error:', error);
    return false;
  }
}

/**
 * Set operation
 */
async function sAdd(key, ...values) {
  try {
    await redis.sadd(key, values);
    return true;
  } catch (error) {
    logger.error('Redis sAdd error:', error);
    return false;
  }
}

/**
 * Set members
 */
async function sMembers(key) {
  try {
    const members = await redis.smembers(key);
    return members;
  } catch (error) {
    logger.error('Redis sMembers error:', error);
    return [];
  }
}

/**
 * Set remove
 */
async function sRem(key, ...values) {
  try {
    await redis.srem(key, values);
    return true;
  } catch (error) {
    logger.error('Redis sRem error:', error);
    return false;
  }
}

/**
 * List push
 */
async function lPush(key, ...values) {
  try {
    await redis.lpush(key, values);
    return true;
  } catch (error) {
    logger.error('Redis lPush error:', error);
    return false;
  }
}

/**
 * List range
 */
async function lRange(key, start, stop) {
  try {
    const items = await redis.lrange(key, start, stop);
    return items.map(item => JSON.parse(item));
  } catch (error) {
    logger.error('Redis lRange error:', error);
    return [];
  }
}

/**
 * Increment counter
 */
async function incr(key) {
  try {
    const result = await redis.incr(key);
    return result;
  } catch (error) {
    logger.error('Redis incr error:', error);
    return 0;
  }
}

/**
 * Decrement counter
 */
async function decr(key) {
  try {
    const result = await redis.decr(key);
    return result;
  } catch (error) {
    logger.error('Redis decr error:', error);
    return 0;
  }
}

/**
 * Hash set
 */
async function hSet(key, field, value) {
  try {
    await redis.hset(key, field, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis hSet error:', error);
    return false;
  }
}

/**
 * Hash get
 */
async function hGet(key, field) {
  try {
    const data = await redis.hget(key, field);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis hGet error:', error);
    return null;
  }
}

/**
 * Hash get all
 */
async function hGetAll(key) {
  try {
    const data = await redis.hgetall(key);
    const result = {};
    for (const [field, value] of Object.entries(data)) {
      result[field] = JSON.parse(value);
    }
    return result;
  } catch (error) {
    logger.error('Redis hGetAll error:', error);
    return {};
  }
}

/**
 * Pub/Sub publish
 */
async function publish(channel, message) {
  try {
    await redis.publish(channel, JSON.stringify(message));
    return true;
  } catch (error) {
    logger.error('Redis publish error:', error);
    return false;
  }
}

/**
 * Pub/Sub subscribe
 */
function subscribe(channel, callback) {
  const subscriber = redis.duplicate();
  subscriber.subscribe(channel, (err) => {
    if (err) {
      logger.error('Redis subscribe error:', err);
      return;
    }
    logger.info(`Subscribed to channel: ${channel}`);
  });

  subscriber.on('message', (ch, message) => {
    if (ch === channel && callback) {
      try {
        callback(JSON.parse(message));
      } catch (error) {
        logger.error('Redis message parse error:', error);
      }
    }
  });

  return subscriber;
}

/**
 * Pub/Sub unsubscribe
 */
function unsubscribe(subscriber, channel) {
  if (subscriber) {
    subscriber.unsubscribe(channel);
    subscriber.quit();
  }
}

// ============================================
// CONNECTION CHECK
// ============================================

async function checkConnection() {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    logger.error('Redis connection check failed:', error);
    return false;
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  redis,
  set,
  get,
  del,
  expire,
  exists,
  sAdd,
  sMembers,
  sRem,
  lPush,
  lRange,
  incr,
  decr,
  hSet,
  hGet,
  hGetAll,
  publish,
  subscribe,
  unsubscribe,
  checkConnection
};
