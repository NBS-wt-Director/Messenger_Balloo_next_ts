#!/data/data/com.termux/files/usr/bin/node
/**
 * Max SMS Android App
 * Запускается через Termux на Samsung J3
 * Получает команды с сервера и отправляет SMS
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Конфигурация
const CONFIG = {
  SERVER_URL: process.env.MAX_SERVER_URL || 'http://192.168.1.100:8080',
  DEVICE_TOKEN: process.env.DEVICE_TOKEN || '',
  POLL_INTERVAL: parseInt(process.env.POLL_INTERVAL) || 5000, // 5 секунд
  LOG_FILE: path.join(__dirname, 'max-sms.log')
};

// Storage для обработанных сообщений
const PROCESSED_FILE = path.join(__dirname, '.processed.json');

// ============================================
// LOGGING
// ============================================

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  
  console.log(logLine.trim());
  
  fs.appendFileSync(CONFIG.LOG_FILE, logLine);
}

// ============================================
// SMS SENDING (Termux:SMS plugin или Android API)
// ============================================

/**
 * Отправить SMS через Android (Termux:SMS)
 */
async function sendSMS(phone, message) {
  try {
    // Вариант 1: Через Termux:SMS plugin
    const { execSync } = require('child_process');
    
    // Команда для отправки SMS через Termux:SMS
    const command = `termux-sms-send -n "${phone}" -m "${message}"`;
    
    execSync(command, { timeout: 10000 });
    
    log(`SMS отправлена: ${phone}`);
    return { success: true };
  } catch (error) {
    log(`Ошибка отправки SMS: ${error.message}`, 'ERROR');
    return { success: false, error: error.message };
  }
}

// ============================================
// SERVER COMMUNICATION
// ============================================

/**
 * Зарегистрировать устройство на сервере
 */
async function registerDevice() {
  try {
    const response = await axios.post(`${CONFIG.SERVER_URL}/device/register`, {
      deviceName: 'Samsung J3',
      deviceModel: 'SM-J320F',
      androidVersion: '6.0.1'
    });
    
    if (response.data.success) {
      CONFIG.DEVICE_TOKEN = response.data.deviceToken;
      fs.writeFileSync('.device-token', CONFIG.DEVICE_TOKEN);
      log(`Устройство зарегистрировано: ${CONFIG.DEVICE_TOKEN}`);
      return true;
    }
  } catch (error) {
    log(`Ошибка регистрации: ${error.message}`, 'ERROR');
    return false;
  }
}

/**
 * Загрузить токен устройства из файла
 */
function loadDeviceToken() {
  try {
    if (fs.existsSync('.device-token')) {
      CONFIG.DEVICE_TOKEN = fs.readFileSync('.device-token', 'utf8').trim();
      log(`Токен загружен: ${CONFIG.DEVICE_TOKEN}`);
      return true;
    }
    return false;
  } catch (error) {
    log(`Ошибка загрузки токена: ${error.message}`, 'ERROR');
    return false;
  }
}

/**
 * Получить очередь сообщений с сервера
 */
async function getQueue() {
  try {
    const response = await axios.get(
      `${CONFIG.SERVER_URL}/queue/${CONFIG.DEVICE_TOKEN}`
    );
    
    return response.data;
  } catch (error) {
    log(`Ошибка получения очереди: ${error.message}`, 'ERROR');
    return { success: false, queue: [] };
  }
}

/**
 * Подтвердить отправку SMS на сервер
 */
async function confirmSent(messageId, success) {
  try {
    await axios.post(`${CONFIG.SERVER_URL}/confirm-sent`, {
      messageId,
      deviceToken: CONFIG.DEVICE_TOKEN,
      success
    });
  } catch (error) {
    log(`Ошибка подтверждения: ${error.message}`, 'ERROR');
  }
}

// ============================================
// MAIN LOOP
// ============================================

/**
 * Проверить и обработать очередь
 */
async function processQueue() {
  const result = await getQueue();
  
  if (!result.success) {
    return;
  }
  
  if (result.queue.length === 0) {
    return;
  }
  
  log(`Получено ${result.queue.length} сообщений в очереди`);
  
  for (const msg of result.queue) {
    // Проверка на дубликаты
    if (isProcessed(msg.messageId)) {
      log(`Сообщение уже обработано: ${msg.messageId}`);
      continue;
    }
    
    log(`Обработка сообщения: ${msg.messageId} -> ${msg.phone}`);
    
    // Отправка SMS
    const smsResult = await sendSMS(msg.phone, msg.message);
    
    // Подтверждение серверу
    await confirmSent(msg.messageId, smsResult.success);
    
    // Сохранение в обработанные
    markAsProcessed(msg.messageId);
    
    if (smsResult.success) {
      log(`SMS успешно отправлена: ${msg.phone} (код: ${msg.code})`);
    } else {
      log(`Ошибка отправки SMS: ${msg.phone} - ${smsResult.error}`, 'ERROR');
    }
    
    // Небольшая задержка между сообщениями
    await sleep(1000);
  }
}

// ============================================
// STORAGE
// ============================================

function isProcessed(messageId) {
  try {
    if (!fs.existsSync(PROCESSED_FILE)) {
      return false;
    }
    
    const processed = JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
    return processed.includes(messageId);
  } catch (error) {
    return false;
  }
}

function markAsProcessed(messageId) {
  try {
    let processed = [];
    
    if (fs.existsSync(PROCESSED_FILE)) {
      processed = JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
    }
    
    processed.push(messageId);
    
    // Храним только последние 1000 сообщений
    if (processed.length > 1000) {
      processed = processed.slice(-1000);
    }
    
    fs.writeFileSync(PROCESSED_FILE, JSON.stringify(processed, null, 2));
  } catch (error) {
    log(`Ошибка сохранения: ${error.message}`, 'ERROR');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  log('=== Max SMS Android App Starting ===');
  
  // Загрузка токена или регистрация
  if (!loadDeviceToken()) {
    log('Токен не найден, регистрация устройства...');
    const registered = await registerDevice();
    
    if (!registered) {
      log('Не удалось зарегистрировать устройство', 'ERROR');
      process.exit(1);
    }
  }
  
  log('Приложение готово к работе');
}

// ============================================
// MAIN
// ============================================

async function main() {
  await init();
  
  log(`Опрос сервера каждые ${CONFIG.POLL_INTERVAL}мс`);
  
  // Главный цикл
  while (true) {
    try {
      await processQueue();
      await sleep(CONFIG.POLL_INTERVAL);
    } catch (error) {
      log(`Ошибка в главном цикле: ${error.message}`, 'ERROR');
      await sleep(5000); // Пауза при ошибке
    }
  }
}

// Запуск
main().catch(error => {
  log(`Критическая ошибка: ${error.message}`, 'ERROR');
  process.exit(1);
});
