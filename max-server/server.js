/**
 * Max SMS Server
 * Сервер для управления SMS через Android приложение Max
 * Порт: 8080
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

const app = express();
const PORT = process.env.MAX_SERVER_PORT || 8080;
const API_KEY = process.env.MAX_SERVER_API_KEY || 'max-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (можно заменить на Redis/SQLite)
const pendingMessages = new Map(); // messageId -> { phone, code, createdAt, deviceToken }
const deviceTokens = new Set(); // Active Android devices

// ============================================
// API ENDPOINTS
// ============================================

/**
 * Регистрация Android устройства
 */
app.post('/device/register', (req, res) => {
  const { deviceName, deviceModel, androidVersion } = req.body;
  const deviceToken = uuidv4();
  
  deviceTokens.add(deviceToken);
  
  logger.info(`Device registered: ${deviceName} (${deviceModel})`);
  
  res.json({
    success: true,
    deviceToken,
    message: 'Устройство успешно зарегистрировано'
  });
});

/**
 * Отправить SMS через Max
 */
app.post('/send-sms', authenticate, (req, res) => {
  const { phone, code, message, priority = 'normal' } = req.body;
  
  // Валидация
  if (!phone || !code) {
    return res.status(400).json({
      success: false,
      error: 'phone и code обязательны'
    });
  }
  
  // Валидация номера (РФ формат)
  const phoneRegex = /^\+7\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      error: 'Неверный формат номера (требуется +7XXX)'
    });
  }
  
  // Валидация кода (3 цифры)
  const codeRegex = /^\d{3}$/;
  if (!codeRegex.test(code)) {
    return res.status(400).json({
      success: false,
      error: 'Код должен быть 3 цифр'
    });
  }
  
  const messageId = uuidv4();
  const smsMessage = message || `Balloo: Ваш код: ${code}`;
  
  // Сохраняем сообщение
  pendingMessages.set(messageId, {
    phone,
    code,
    message: smsMessage,
    priority,
    createdAt: Date.now(),
    status: 'pending'
  });
  
  // Отправляем push всем устройствам
  notifyDevices(messageId, {
    phone,
    code,
    message: smsMessage,
    priority
  });
  
  logger.info(`SMS queued: ${phone} -> ${messageId}`);
  
  res.json({
    success: true,
    messageId,
    status: 'queued',
    message: 'SMS поставлено в очередь'
  });
});

/**
 * Проверка статуса SMS
 */
app.get('/status/:messageId', authenticate, (req, res) => {
  const { messageId } = req.params;
  const message = pendingMessages.get(messageId);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Сообщение не найдено'
    });
  }
  
  res.json({
    success: true,
    data: {
      messageId,
      phone: message.phone,
      status: message.status,
      createdAt: message.createdAt
    }
  });
});

/**
 * Подтверждение отправки SMS (от Android приложения)
 */
app.post('/confirm-sent', authenticate, (req, res) => {
  const { messageId, deviceToken, success } = req.body;
  
  const message = pendingMessages.get(messageId);
  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Сообщение не найдено'
    });
  }
  
  message.status = success ? 'sent' : 'failed';
  message.sentAt = Date.now();
  message.deviceToken = deviceToken;
  
  logger.info(`SMS ${success ? 'sent' : 'failed'}: ${messageId}`);
  
  res.json({
    success: true,
    message: success ? 'SMS отправлена' : 'Ошибка отправки SMS'
  });
});

/**
 * Получить очередь сообщений для Android приложения
 */
app.get('/queue/:deviceToken', (req, res) => {
  const { deviceToken } = req.params;
  
  if (!deviceTokens.has(deviceToken)) {
    return res.status(403).json({
      success: false,
      error: 'Неверный токен устройства'
    });
  }
  
  // Получаем pending сообщения
  const queue = [];
  for (const [id, msg] of pendingMessages.entries()) {
    if (msg.status === 'pending') {
      queue.push({
        messageId: id,
        phone: msg.phone,
        code: msg.code,
        message: msg.message,
        priority: msg.priority,
        createdAt: msg.createdAt
      });
    }
  }
  
  // Сортируем по приоритету
  queue.sort((a, b) => {
    if (a.priority === 'high') return -1;
    if (b.priority === 'high') return 1;
    return 0;
  });
  
  res.json({
    success: true,
    queue,
    count: queue.length
  });
});

/**
 * Статус сервера
 */
app.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    uptime: process.uptime(),
    pendingMessages: pendingMessages.size,
    activeDevices: deviceTokens.size,
    timestamp: Date.now()
  });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Middleware аутентификации
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Отсутствует токен'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Неверный токен'
    });
  }
  
  next();
}

/**
 * Уведомить все устройства о новом сообщении
 */
function notifyDevices(messageId, data) {
  // В production можно использовать WebSocket или Firebase Cloud Messaging
  logger.info(`Notifying ${deviceTokens.size} devices about message ${messageId}`);
  
  // Здесь можно добавить реальный механизм уведомлений
  // Например: WebSocket broadcast или FCM push
}

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  logger.info(`Max SMS Server running on port ${PORT}`);
  logger.info(`API Key: ${API_KEY}`);
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

module.exports = { app };
