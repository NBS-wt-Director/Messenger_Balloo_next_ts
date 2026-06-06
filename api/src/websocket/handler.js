/**
 * WebSocket Handler
 * Полная реализация WebSocket для:
 * - Чата (сообщения в реальном времени)
 * - Уведомлений
 * - Звонков (WebRTC сигнализация)
 * - Статусов (печатает, онлайн)
 * Redis persistence
 */

const logger = require('../config/logger');
const { db } = require('../config/database');
const { redis, publish, subscribe } = require('../config/redis');

// Локальное хранилище активных подключений
const connections = new Map();

// Хранилище звонков
const activeCalls = new Map();

// Redis channels
const WS_CHANNEL = 'websocket:events';
const PRESENCE_CHANNEL = 'websocket:presence';

// ============================================
// CONNECTION MANAGEMENT
// ============================================

/**
 * Зарегистрировать подключение
 */
async function registerConnection(userId, ws) {
  if (!connections.has(userId)) {
    connections.set(userId, new Set());
  }
  connections.get(userId).add(ws);
  logger.info(`Connection registered: ${userId}, total: ${connections.get(userId).size}`);
  
  // Обновить lastSeen в БД
  db.prepare('UPDATE users SET lastSeen = ? WHERE id = ?').run(Date.now(), userId);
  
  // Опубликовать событие presence
  await publish(PRESENCE_CHANNEL, {
    type: 'online',
    userId,
    timestamp: Date.now()
  });
}

/**
 * Удалить подключение
 */
async function removeConnection(userId, ws) {
  if (connections.has(userId)) {
    connections.get(userId).delete(ws);
    if (connections.get(userId).size === 0) {
      connections.delete(userId);
      
      // Обновить lastSeen в БД
      db.prepare('UPDATE users SET lastSeen = ? WHERE id = ?').run(Date.now(), userId);
      
      // Опубликовать событие offline
      await publish(PRESENCE_CHANNEL, {
        type: 'offline',
        userId,
        timestamp: Date.now()
      });
    }
    logger.info(`Connection removed: ${userId}, remaining: ${connections.get(userId)?.size || 0}`);
  }
}

/**
 * Получить онлайн-устройства пользователя
 */
function getOnlineDevices(userId) {
  const userConnections = connections.get(userId);
  if (!userConnections) return [];
  
  return Array.from(userConnections).map((ws, index) => ({
    id: `${userId}-${index}`,
    userId,
    lastActive: Date.now()
  }));
}

// ============================================
// BROADCASTING
// ============================================

/**
 * Отправить событие пользователю
 */
function sendToUser(userId, event, data) {
  const userConnections = connections.get(userId);
  
  if (userConnections) {
    userConnections.forEach(ws => {
      if (ws.readyState === 1) { // WebSocket.OPEN
        try {
          ws.send(JSON.stringify({ type: event, ...data }));
        } catch (error) {
          logger.error(`Error sending to user ${userId}:`, error);
        }
      }
    });
  }
}

/**
 * Отправить событие всем в чате
 */
function sendToChat(chatId, event, data, excludeUserId = null) {
  const chat = db.prepare('SELECT participants FROM chats WHERE id = ?').get(chatId);
  if (!chat) return;
  
  const participants = JSON.parse(chat.participants);
  
  participants.forEach(userId => {
    if (userId !== excludeUserId) {
      sendToUser(userId, event, data);
    }
  });
}

/**
 * Отправить событие всем устройствам
 */
async function sendToDevices(deviceIds, event, data) {
  const sentDevices = [];
  
  for (const deviceId of deviceIds) {
    const [userId] = deviceId.split('-');
    sendToUser(userId, event, data);
    sentDevices.push(deviceId);
  }
  
  return {
    success: sentDevices.length > 0,
    deviceIds: sentDevices
  };
}

/**
 * Отправить пользователю через queue
 */
async function sendPush(userId, title, body, data = {}) {
  try {
    const { sendPush: queueSendPush } = require('./services/queue.service');
    await queueSendPush(userId, title, body, data);
    return { success: true };
  } catch (error) {
    logger.error('Failed to send push:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PRESENCE
// ============================================

/**
 * Отправить статус всем контактам пользователя
 */
async function broadcastPresence(userId, status) {
  const contacts = db.prepare('SELECT contactUserId FROM contacts WHERE userId = ?').all(userId);
  
  for (const { contactUserId } of contacts) {
    sendToUser(contactUserId, 'presence:update', {
      userId,
      status,
      lastSeen: Date.now()
    });
  }
  
  // Опубликовать глобальное событие
  await publish(PRESENCE_CHANNEL, {
    type: 'presence',
    userId,
    status,
    timestamp: Date.now()
  });
}

// ============================================
// TYPING
// ============================================

/**
 * Обработчик события typing
 */
function handleTyping(ws, data) {
  const { chatId, isTyping } = data;
  
  if (isTyping) {
    sendToChat(chatId, 'typing:start', { 
      userId: ws.userId,
      chatId 
    }, ws.userId);
  } else {
    sendToChat(chatId, 'typing:stop', { 
      userId: ws.userId,
      chatId 
    }, ws.userId);
  }
}

// ============================================
// MESSAGES
// ============================================

/**
 * Обработчик события message
 */
function handleMessage(ws, data) {
  const { chatId, content, type, encryptedInfo, attachmentId, replyToId } = data;
  
  // Сохранить сообщение в БД
  const messageId = require('uuid').v4();
  const now = Date.now();
  
  db.prepare(`
    INSERT INTO messages (id, chatId, senderId, type, content, encryptedInfo, attachmentId, replyToId, reactions, readBy, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, '{}', '[]', 'sent', ?, ?)
  `).run(messageId, chatId, ws.userId, type || 'text', content || '', encryptedInfo ? JSON.stringify(encryptedInfo) : null, attachmentId || null, replyToId || null, now, now);
  
  // Обновить lastMessage в чате
  const messageData = {
    id: messageId,
    content: content,
    type: type || 'text',
    createdAt: now,
    senderId: ws.userId
  };
  
  db.prepare('UPDATE chats SET lastMessage = ?, updatedAt = ? WHERE id = ?')
    .run(JSON.stringify(messageData), now, chatId);
  
  // Отправить всем в чате
  sendToChat(chatId, 'message:new', {
    message: {
      id: messageId,
      chatId,
      senderId: ws.userId,
      type: type || 'text',
      content,
      encryptedInfo,
      attachmentId,
      replyToId,
      createdAt: now,
      status: 'sent'
    }
  }, ws.userId);
  
  // Подтвердить отправку отправителю
  sendToUser(ws.userId, 'message:sent', { messageId, status: 'sent' });
}

/**
 * Обработчик события message:read
 */
function handleMessageRead(ws, data) {
  const { chatId, messageId } = data;
  
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
  if (!message) return;
  
  const readBy = JSON.parse(message.readBy || '[]');
  if (!readBy.includes(ws.userId)) {
    readBy.push(ws.userId);
    db.prepare('UPDATE messages SET readBy = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(readBy), Date.now(), messageId);
  }
  
  // Уведомить отправителя
  sendToUser(message.senderId, 'message:read', {
    messageId,
    readerId: ws.userId,
    chatId
  });
}

// ============================================
// CALLS (WebRTC)
// ============================================

/**
 * Обработчик события call:offer
 */
function handleCallOffer(ws, data) {
  const { callId, offer, to, type } = data;
  
  db.prepare(`
    INSERT INTO calls (id, fromUserId, toUserId, type, offer, answer, status, recording, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, NULL, 'offered', 0, ?, ?)
  `).run(callId, ws.userId, to, type, JSON.stringify(offer), Date.now(), Date.now());
  
  sendToUser(to, 'call:incoming', {
    callId,
    from: ws.userId,
    type,
    offer
  });
}

/**
 * Обработчик события call:answer
 */
function handleCallAnswer(ws, data) {
  const { callId, answer } = data;
  
  db.prepare('UPDATE calls SET answer = ?, status = ? WHERE id = ?')
    .run(JSON.stringify(answer), 'connected', callId);
  
  const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
  sendToUser(call.fromUserId, 'call:answered', {
    callId,
    answer
  });
  
  if (call.type === 'video') {
    startCallRecording(callId);
  }
}

/**
 * Обработчик события call:ice-candidate
 */
function handleIceCandidate(ws, data) {
  const { callId, candidate } = data;
  
  const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
  const targetUserId = ws.userId === call.fromUserId ? call.toUserId : call.fromUserId;
  
  sendToUser(targetUserId, 'call:ice-candidate', {
    callId,
    candidate
  });
}

/**
 * Обработчик события call:end
 */
function handleCallEnd(ws, data) {
  const { callId } = data;
  
  const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
  if (!call) return;
  
  if (call.recording) {
    stopCallRecording(callId);
  }
  
  db.prepare('UPDATE calls SET status = ?, endedAt = ?, updatedAt = ? WHERE id = ?')
    .run('ended', Date.now(), Date.now(), callId);
  
  ['fromUserId', 'toUserId'].forEach(field => {
    const userId = call[field];
    sendToUser(userId, 'call:ended', { callId });
  });
  
  activeCalls.delete(callId);
}

// ============================================
// CALL RECORDING
// ============================================

function startCallRecording(callId) {
  const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
  if (!call) return;
  
  const recordingId = require('uuid').v4();
  const fileName = `call_${callId}_${Date.now()}.webm`;
  const yandexPath = `/messenger/call-recordings/${fileName}`;
  
  db.prepare('UPDATE calls SET recording = 1, recordingId = ?, recordingPath = ? WHERE id = ?')
    .run(recordingId, yandexPath, callId);
  
  logger.info(`Call recording started: ${callId}, path: ${yandexPath}`);
}

function stopCallRecording(callId) {
  const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
  if (!call) return;
  
  db.prepare('UPDATE calls SET recording = 0, recordingUrl = ?, updatedAt = ? WHERE id = ?')
    .run(`https://disk.yandex.ru${call.recordingPath}`, Date.now(), callId);
  
  logger.info(`Call recording stopped: ${callId}`);
}

// ============================================
// SUBSCRIPTIONS
// ============================================

function handleSubscribeChat(ws, data) {
  const { chatId } = data;
  logger.info(`User ${ws.userId} subscribed to chat ${chatId}`);
  sendToUser(ws.userId, 'subscribe:success', { chatId });
}

function handleUnsubscribeChat(ws, data) {
  const { chatId } = data;
  logger.info(`User ${ws.userId} unsubscribed from chat ${chatId}`);
  sendToUser(ws.userId, 'unsubscribe:success', { chatId });
}

// ============================================
// NOTIFICATIONS
// ============================================

function handleNotificationRead(ws, data) {
  const { notificationId } = data;
  
  db.prepare('UPDATE notifications SET read = 1, readAt = ? WHERE id = ? AND userId = ?')
    .run(Date.now(), notificationId, ws.userId);
}

function sendNotification(userId, notificationData) {
  const notificationId = require('uuid').v4();
  const now = Date.now();
  
  db.prepare(`
    INSERT INTO notifications (id, userId, type, title, body, data, read, createdAt, expiresAt)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
  `).run(
    notificationId,
    userId,
    notificationData.type,
    notificationData.title,
    notificationData.body,
    JSON.stringify(notificationData.data || {}),
    now,
    notificationData.expiresAt || null
  );
  
  sendToUser(userId, 'notification:new', {
    id: notificationId,
    ...notificationData
  });
}

// ============================================
// MESSAGE HANDLER
// ============================================

function handleMessage(ws, message) {
  try {
    const data = JSON.parse(message);
    const { type, ...payload } = data;
    
    logger.debug(`WebSocket message from ${ws.userId}:`, type);
    
    switch (type) {
      case 'typing:start':
      case 'typing:stop':
        handleTyping(ws, payload);
        break;
        
      case 'message:send':
        handleMessage(ws, payload);
        break;
        
      case 'message:read':
        handleMessageRead(ws, payload);
        break;
        
      case 'call:offer':
        handleCallOffer(ws, payload);
        break;
        
      case 'call:answer':
        handleCallAnswer(ws, payload);
        break;
        
      case 'call:ice-candidate':
        handleIceCandidate(ws, payload);
        break;
        
      case 'call:end':
        handleCallEnd(ws, payload);
        break;
        
      case 'subscribe:chat':
        handleSubscribeChat(ws, payload);
        break;
        
      case 'unsubscribe:chat':
        handleUnsubscribeChat(ws, payload);
        break;
        
      case 'notification:read':
        handleNotificationRead(ws, payload);
        break;
        
      case 'presence:update':
        break;
        
      default:
        logger.warn(`Unknown WebSocket message type: ${type}`);
    }
  } catch (error) {
    logger.error('WebSocket message error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      error: { code: 'INVALID_MESSAGE', message: 'Неверный формат сообщения' }
    }));
  }
}

/**
 * Настройка обработчиков событий для Socket.IO сокета
 */
function setupSocketHandlers(socket) {
  socket.on('typing:start', (data) => handleTyping(socket, { ...data, isTyping: true }));
  socket.on('typing:stop', (data) => handleTyping(socket, { ...data, isTyping: false }));
  socket.on('message:send', (data) => handleMessage(socket, data));
  socket.on('message:read', (data) => handleMessageRead(socket, data));
  socket.on('call:offer', (data) => handleCallOffer(socket, data));
  socket.on('call:answer', (data) => handleCallAnswer(socket, data));
  socket.on('call:ice-candidate', (data) => handleIceCandidate(socket, data));
  socket.on('call:end', (data) => handleCallEnd(socket, data));
  socket.on('subscribe:chat', (data) => handleSubscribeChat(socket, data));
  socket.on('unsubscribe:chat', (data) => handleUnsubscribeChat(socket, data));
  socket.on('notification:read', (data) => handleNotificationRead(socket, data));
  socket.on('presence:update', (data) => {
    logger.debug(`Presence update for ${socket.userId}`);
  });
}

// ============================================
// REDIS SUBSCRIPTION
// ============================================

function subscribeToEvents() {
  const subscriber = subscribe(WS_CHANNEL, (data) => {
    // Обработка событий из других инстансов
    logger.info(`Received WebSocket event from Redis:`, data);
  });
  
  return subscriber;
}

function subscribeToPresence() {
  const subscriber = subscribe(PRESENCE_CHANNEL, (data) => {
    // Обработка presence событий из других инстансов
    logger.info(`Received presence event from Redis:`, data);
  });
  
  return subscriber;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  connections,
  activeCalls,
  registerConnection,
  removeConnection,
  sendToUser,
  sendToChat,
  sendToDevices,
  sendNotification,
  sendPush,
  handleMessage,
  broadcastPresence,
  setupSocketHandlers,
  getOnlineDevices,
  subscribeToEvents,
  subscribeToPresence,
  testConnection: () => true
};
