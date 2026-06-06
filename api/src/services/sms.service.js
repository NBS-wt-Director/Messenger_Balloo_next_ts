/**
 * SMS Service
 * Отправка SMS через Max Server (Samsung J3 Android)
 */

const axios = require('axios');
const logger = require('../config/logger');

// Конфигурация Max сервера
const SMS_CONFIG = {
  baseUrl: process.env.MAX_SERVER_URL || 'http://localhost:8080',
  apiKey: process.env.MAX_SERVER_API_KEY || 'max-secret-key-change-in-production',
  timeout: 10000
};

/**
 * Отправить SMS через Max Server
 * @param {string} phone - Номер телефона в формате +79991234567
 * @param {string} message - Текст сообщения
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendSMS(phone, message) {
  try {
    // Валидация номера
    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(phone)) {
      logger.error(`Invalid phone format: ${phone}`);
      return { success: false, error: 'Неверный формат номера телефона' };
    }

    // Генерация 3-значного кода из сообщения
    const codeMatch = message.match(/\b\d{3}\b/);
    const code = codeMatch ? codeMatch[0] : '';

    // Отправка через Max Server API
    const response = await axios.post(
      `${SMS_CONFIG.baseUrl}/send-sms`,
      {
        phone,
        code,
        message,
        priority: 'high'
      },
      {
        headers: {
          'Authorization': `Bearer ${SMS_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: SMS_CONFIG.timeout
      }
    );

    if (response.data.success) {
      logger.info(`SMS queued via Max: ${phone}, messageId: ${response.data.messageId}`);
      return {
        success: true,
        messageId: response.data.messageId
      };
    } else {
      logger.error(`Max SMS send failed: ${response.data.error}`);
      return {
        success: false,
        error: response.data.error || 'Ошибка отправки SMS'
      };
    }
  } catch (error) {
    logger.error(`Max SMS send error: ${error.message}`);
    return {
      success: false,
      error: error.message || 'Ошибка сети'
    };
  }
}

/**
 * Отправить код подтверждения (3 цифры)
 * @param {string} phone - Номер телефона
 * @param {string} code - 3-значный код
 * @param {string} type - Тип кода
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function sendVerificationCode(phone, code, type = 'sms') {
  // Валидация кода (3 цифры)
  const codeRegex = /^\d{3}$/;
  if (!codeRegex.test(code)) {
    logger.error(`Invalid code format: ${code} (must be 3 digits)`);
    return { success: false, error: 'Код должен быть 3 цифр' };
  }

  const message = `Balloo: Ваш код: ${code}`;
  return sendSMS(phone, message);
}

/**
 * Проверить статус Max сервера
 * @returns {Promise<{success: boolean, status?: string, error?: string}>}
 */
async function checkServerStatus() {
  try {
    const response = await axios.get(
      `${SMS_CONFIG.baseUrl}/status`,
      {
        timeout: SMS_CONFIG.timeout
      }
    );

    return {
      success: true,
      status: response.data.status,
      uptime: response.data.uptime,
      pendingMessages: response.data.pendingMessages,
      activeDevices: response.data.activeDevices
    };
  } catch (error) {
    logger.error(`Max server status check failed: ${error.message}`);
    return {
      success: false,
      error: error.message || 'Сервер недоступен'
    };
  }
}

module.exports = {
  sendSMS,
  sendVerificationCode,
  checkServerStatus,
  SMS_CONFIG
};
