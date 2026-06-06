/**
 * SMS Retry Service
 * Автоматические повторы отправки SMS с экспоненциальной задержкой
 */

const logger = require('../config/logger');
const { redis, hSet, hGet, hGetAll } = require('../config/redis');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  MAX_RETRIES: 3,                    // Максимум попыток
  INITIAL_DELAY_MS: 5000,           // Начальная задержка (5 сек)
  MAX_DELAY_MS: 60000,              // Максимальная задержка (1 мин)
  DELAY_MULTIPLIER: 2,              // Множитель задержки
  retryPrefix: 'sms:retry:'
};

// ============================================
// RETRY MANAGEMENT
// ============================================

/**
 * Запланировать повторную отправку SMS
 */
async function scheduleRetry(messageId, phone, code, type, attempt = 1) {
  try {
    if (attempt > CONFIG.MAX_RETRIES) {
      logger.error(`SMS ${messageId} failed after ${CONFIG.MAX_RETRIES} attempts`);
      return { success: false, error: 'Max retries exceeded' };
    }

    const delay = Math.min(
      CONFIG.INITIAL_DELAY_MS * Math.pow(CONFIG.DELAY_MULTIPLIER, attempt - 1),
      CONFIG.MAX_DELAY_MS
    );

    const retryData = {
      messageId,
      phone,
      code,
      type,
      attempt,
      scheduledAt: Date.now(),
      executeAt: Date.now() + delay
    };

    const key = `${CONFIG.retryPrefix}${messageId}`;
    await hSet(key, 'retry', retryData);

    // Добавить в очередь отложенных задач
    const executeKey = `sms:execute:${Math.floor((Date.now() + delay) / 1000)}:${messageId}`;
    await redis.set(executeKey, JSON.stringify(retryData), 'EX', delay + 60);

    logger.info(`SMS ${messageId} retry ${attempt} scheduled in ${delay}ms`);

    return {
      success: true,
      attempt,
      delay,
      executeAt: retryData.executeAt
    };
  } catch (error) {
    logger.error('Failed to schedule SMS retry:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Выполнить отложенную отправку SMS
 */
async function executeDelayedSMS() {
  try {
    const now = Math.floor(Date.now() / 1000);
    const keys = await redis.keys(`sms:execute:${now}:*`);

    for (const key of keys) {
      const data = await redis.get(key);
      if (!data) continue;

      const retryData = JSON.parse(data);
      await processRetry(retryData);

      // Удалить ключ
      await redis.del(key);
    }
  } catch (error) {
    logger.error('Failed to execute delayed SMS:', error);
  }
}

/**
 * Обработать повторную отправку
 */
async function processRetry(retryData) {
  try {
    const smsService = require('./sms.service');
    const result = await smsService.sendVerificationCode(
      retryData.phone,
      retryData.code,
      retryData.type
    );

    if (result.success) {
      logger.info(`SMS retry ${retryData.attempt} successful for ${retryData.phone}`);
      await deleteRetryData(retryData.messageId);
      return { success: true };
    } else {
      // Планируем следующую попытку
      return await scheduleRetry(
        retryData.messageId,
        retryData.phone,
        retryData.code,
        retryData.type,
        retryData.attempt + 1
      );
    }
  } catch (error) {
    logger.error('SMS retry processing failed:', error);
    return await scheduleRetry(
      retryData.messageId,
      retryData.phone,
      retryData.code,
      retryData.type,
      retryData.attempt + 1
    );
  }
}

/**
 * Удалить данные о повторе
 */
async function deleteRetryData(messageId) {
  try {
    const key = `${CONFIG.retryPrefix}${messageId}`;
    await redis.del(key);
    logger.info(`SMS ${messageId} retry data deleted`);
  } catch (error) {
    logger.error('Failed to delete retry data:', error);
  }
}

/**
 * Получить статус повторов для сообщения
 */
async function getRetryStatus(messageId) {
  try {
    const key = `${CONFIG.retryPrefix}${messageId}`;
    const data = await hGet(key, 'retry');
    return data || null;
  } catch (error) {
    logger.error('Failed to get retry status:', error);
    return null;
  }
}

/**
 * Отменить повтор
 */
async function cancelRetry(messageId) {
  try {
    await deleteRetryData(messageId);
    
    // Найти и удалить все отложенные задачи
    const keys = await redis.keys(`sms:execute:*:${messageId}`);
    for (const key of keys) {
      await redis.del(key);
    }
    
    logger.info(`SMS ${messageId} retry cancelled`);
    return { success: true };
  } catch (error) {
    logger.error('Failed to cancel retry:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить статистику повторов
 */
async function getRetryStats() {
  try {
    const keys = await redis.keys(`${CONFIG.retryPrefix}*`);
    const stats = {
      total: keys.length,
      byAttempt: { 1: 0, 2: 0, 3: 0 }
    };

    for (const key of keys) {
      const data = await hGet(key, 'retry');
      if (data && data.attempt) {
        stats.byAttempt[data.attempt] = (stats.byAttempt[data.attempt] || 0) + 1;
      }
    }

    return stats;
  } catch (error) {
    logger.error('Failed to get retry stats:', error);
    return null;
  }
}

// ============================================
// PERIODIC EXECUTION
// ============================================

// Выполнение отложенных SMS каждую минуту
setInterval(executeDelayedSMS, 60000);

// ============================================
// EXPORTS
// ============================================

module.exports = {
  scheduleRetry,
  executeDelayedSMS,
  cancelRetry,
  getRetryStatus,
  getRetryStats,
  CONFIG
};
