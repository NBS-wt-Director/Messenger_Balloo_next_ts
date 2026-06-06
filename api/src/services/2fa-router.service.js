/**
 * 2FA Router Service
 * Умная маршрутизация 2FA кодов с автоматическим отключением проблемных методов
 * Redis persistence
 */

const { db } = require('../config/database');
const smsService = require('./sms.service');
const logger = require('../config/logger');
const { 
  redis,
  hSet, 
  hGet, 
  hGetAll,
  publish,
  subscribe,
  checkConnection
} = require('../config/redis');

// Конфигурация
const CONFIG = {
  MAX_FAILURES: 10,                    // Максимум неудач перед отключением
  FAILURE_WINDOW_MS: 60 * 60 * 1000,   // Окно для подсчёта (1 час)
  RECOVERY_TIME_MS: 30 * 60 * 1000,    // Время до попытки восстановления (30 мин)
  METHODS: ['sms', 'bot', 'totp'],     // Приоритет методов
  prefix: '2fa:'
};

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

async function init() {
  // Проверка Redis подключения
  const connected = await checkConnection();
  if (!connected) {
    logger.warn('Redis not connected, 2FA Router will use fallback mode');
  }

  // Загрузка статуса методов из БД
  try {
    const methods = db.prepare('SELECT * FROM auth_methods').all();
    for (const m of methods) {
      await hSet(`${CONFIG.prefix}methods`, m.name, {
        enabled: m.enabled === 1,
        failures: [],
        lastFailure: m.lastFailure,
        disabledAt: m.disabledAt
      });
    }
  } catch (error) {
    logger.error('Failed to load 2FA methods from DB:', error);
  }

  module.exports.initialized = true;
  logger.info('2FA Router initialized with Redis persistence');
}

// ============================================
// ПОЛУЧЕНИЕ МЕТОДА ОТПРАВКИ
// ============================================

/**
 * Получить доступный метод для отправки 2FA кода
 * @param {string} userId - ID пользователя
 * @returns {Promise<{method: string, phone?: string, deviceIds?: string[]}>}
 */
async function getDeliveryMethod(userId) {
  const user = db.prepare(`
    SELECT phone, twoFAEnabled, sms2FAEnabled FROM users WHERE id = ?
  `).get(userId);

  // 1. Проверяем SMS (приоритет 1)
  if (await isMethodEnabled('sms') && user.phone && user.sms2FAEnabled) {
    const smsOk = await checkMethodHealth('sms');
    if (smsOk) {
      return { method: 'sms', phone: user.phone };
    }
  }

  // 2. Проверяем внутреннего бота (приоритет 2)
  const onlineDevices = getOnlineDevices(userId);
  if (await isMethodEnabled('bot') && onlineDevices.length > 0) {
    const botOk = await checkMethodHealth('bot');
    if (botOk) {
      return { method: 'bot', deviceIds: onlineDevices.map(d => d.id) };
    }
  }

  // 3. Fallback на TOTP (приоритет 3)
  if (await isMethodEnabled('totp') && user.twoFAEnabled) {
    return { method: 'totp' };
  }

  // Нет доступных методов
  throw new Error('Нет доступных методов 2FA');
}

// ============================================
// ОТПРАВКА КОДА
// ============================================

/**
 * Отправить 2FA код выбранным методом
 */
async function sendCode(userId, code, method, extraData = {}) {
  switch (method) {
    case 'sms':
      return sendSMSCode(userId, code, extraData.phone);
    case 'bot':
      return sendBotCode(userId, code, extraData.deviceIds);
    case 'totp':
      return storeTOTPCode(userId, code);
    default:
      throw new Error(`Неизвестный метод: ${method}`);
  }
}

/**
 * Отправить SMS код
 */
async function sendSMSCode(userId, code, phone) {
  try {
    const result = await smsService.sendVerificationCode(phone, code, 'sms_2fa');
    
    if (result.success) {
      await recordSuccess('sms');
      return { success: true, method: 'sms' };
    } else {
      await recordFailure('sms', result.error);
      return { success: false, error: result.error, method: 'sms' };
    }
  } catch (error) {
    await recordFailure('sms', error.message);
    return { success: false, error: error.message, method: 'sms' };
  }
}

/**
 * Отправить код через внутреннего бота (WebSocket)
 */
async function sendBotCode(userId, code, deviceIds) {
  try {
    // Отправляем через WebSocket всем онлайн-устройствам
    const { sendToDevices } = require('../websocket/manager');
    
    const notification = {
      type: '2fa_code',
      code,
      timestamp: Date.now(),
      ttl: 300 // 5 минут
    };

    const result = await sendToDevices(deviceIds, notification);
    
    if (result.success) {
      await recordSuccess('bot');
      return { success: true, method: 'bot', deliveredTo: result.deviceIds };
    } else {
      await recordFailure('bot', result.error);
      return { success: false, error: result.error, method: 'bot' };
    }
  } catch (error) {
    await recordFailure('bot', error.message);
    return { success: false, error: error.message, method: 'bot' };
  }
}

/**
 * Сохранить TOTP код (для проверки)
 */
function storeTOTPCode(userId, code) {
  const codeHash = require('../config/encryption').hash(code);
  const expiresAt = Date.now() + (5 * 60 * 1000);

  db.prepare(`
    INSERT OR REPLACE INTO verification_codes (email, code_hash, type, expires_at, created_at)
    VALUES (?, ?, 'totp_2fa', ?, ?)
  `).run(userId, codeHash, expiresAt, Date.now());

  recordSuccess('totp');
  return { success: true, method: 'totp' };
}

// ============================================
// МОНИТОРИНГ И ЗДОРОВЬЕ
// ============================================

/**
 * Проверить здоровье метода
 */
async function checkMethodHealth(method) {
  const stats = await getMethodStats(method);
  if (!stats) return true;

  if (!stats.enabled) {
    // Проверяем, пора ли восстанавливать
    if (stats.disabledAt && 
        Date.now() - stats.disabledAt > CONFIG.RECOVERY_TIME_MS) {
      await attemptRecovery(method);
    }
    return false;
  }

  // Подсчитываем неудачи за окно
  const windowStart = Date.now() - CONFIG.FAILURE_WINDOW_MS;
  const failures = stats.failures || [];
  const recentFailures = failures.filter(f => f.timestamp > windowStart);
  
  if (recentFailures.length >= CONFIG.MAX_FAILURES) {
    await disableMethod(method, `Превышено количество ошибок: ${recentFailures.length}`);
    return false;
  }

  return true;
}

/**
 * Получить статистику метода
 */
async function getMethodStats(method) {
  try {
    return await hGet(`${CONFIG.prefix}methods`, method);
  } catch (error) {
    logger.error('Failed to get method stats:', error);
    return null;
  }
}

/**
 * Записать успех
 */
async function recordSuccess(method) {
  const stats = await getMethodStats(method) || { failures: [], enabled: true };
  stats.failures = []; // Очищаем неудачи при успехе
  await hSet(`${CONFIG.prefix}methods`, method, stats);
}

/**
 * Записать неудачу
 */
async function recordFailure(method, error) {
  const stats = await getMethodStats(method) || { failures: [], enabled: true };
  
  stats.failures = stats.failures || [];
  stats.failures.push({
    timestamp: Date.now(),
    error
  });

  await hSet(`${CONFIG.prefix}methods`, method, stats);
}

/**
 * Отключить метод
 */
async function disableMethod(method, reason) {
  logger.warn(`Disabling 2FA method: ${method} - ${reason}`);
  
  const stats = await getMethodStats(method);
  if (stats) {
    stats.enabled = false;
    stats.disabledAt = Date.now();
    await hSet(`${CONFIG.prefix}methods`, method, stats);
  }

  // Публикация события
  await publish('2fa:method_disabled', { method, reason });

  db.prepare(`
    UPDATE auth_methods 
    SET enabled = 0, disabledAt = ?, lastFailure = ?, disableReason = ?
    WHERE name = ?
  `).run(Date.now(), Date.now(), reason, method);
}

/**
 * Попытка восстановления метода
 */
async function attemptRecovery(method) {
  logger.info(`Attempting recovery for 2FA method: ${method}`);
  
  // Пробуем отправить тестовое сообщение
  let success = false;
  
  if (method === 'sms') {
    // Проверка статуса SMS сервера
    const status = await smsService.checkServerStatus();
    success = status.success;
  } else if (method === 'bot') {
    // Проверка WebSocket соединения
    const { testConnection } = require('../websocket/manager');
    success = await testConnection();
  }

  if (success) {
    await enableMethod(method);
  }
}

/**
 * Включить метод
 */
async function enableMethod(method) {
  logger.info(`Enabling 2FA method: ${method}`);
  
  const stats = await getMethodStats(method);
  if (stats) {
    stats.enabled = true;
    stats.disabledAt = null;
    stats.failures = [];
    await hSet(`${CONFIG.prefix}methods`, method, stats);
  }

  db.prepare(`
    UPDATE auth_methods 
    SET enabled = 1, disabledAt = NULL, disableReason = NULL
    WHERE name = ?
  `).run(method);
}

/**
 * Получить статус методов
 */
async function getMethodStatuses() {
  const result = {};
  
  try {
    const allMethods = await hGetAll(`${CONFIG.prefix}methods`);
    const windowStart = Date.now() - CONFIG.FAILURE_WINDOW_MS;
    
    for (const [name, stats] of Object.entries(allMethods)) {
      const failures = stats.failures || [];
      const recentFailures = failures.filter(f => f.timestamp > windowStart).length;
      
      result[name] = {
        enabled: stats.enabled,
        recentFailures,
        lastFailure: stats.lastFailure,
        disabledAt: stats.disabledAt
      };
    }
  } catch (error) {
    logger.error('Failed to get method statuses:', error);
  }
  
  return result;
}

// ============================================
// УТИЛИТЫ
// ============================================

/**
 * Получить онлайн-устройства пользователя
 */
function getOnlineDevices(userId) {
  const { getOnlineDevices: getOnline } = require('../websocket/manager');
  return getOnline(userId);
}

/**
 * Проверяет, включён ли метод
 */
async function isMethodEnabled(method) {
  const stats = await getMethodStats(method);
  return stats ? stats.enabled : true;
}

// ============================================
// SUBSCRIPTION FOR REMOTE UPDATES
// ============================================

// Подписка на события отключения методов
function subscribeToEvents() {
  const subscriber = subscribe('2fa:method_disabled', (data) => {
    logger.info(`Received 2FA method disabled event:`, data);
    // Можно добавить дополнительную логику
  });
  
  return subscriber;
}

module.exports = {
  init,
  initialized: false,
  getDeliveryMethod,
  sendCode,
  getMethodStatuses,
  disableMethod,
  enableMethod,
  getMethodStats,
  CONFIG,
  subscribeToEvents
};
