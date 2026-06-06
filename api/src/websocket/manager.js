/**
 * WebSocket Manager
 * Управление WebSocket соединениями для внутреннего бота 2FA
 */

const { Server } = require('socket.io');
const { db } = require('../config/database');
const logger = require('../config/logger');

// Хранение подключений
const userConnections = new Map(); // userId -> Set<socketId>
const socketUsers = new Map();     // socketId -> userId

let io = null;

/**
 * Инициализация WebSocket сервера
 */
function init(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    handleConnection(socket);
  });

  logger.info('WebSocket Manager initialized');
}

/**
 * Обработка подключения
 */
function handleConnection(socket) {
  const userId = socket.handshake.auth.userId;
  
  if (!userId) {
    socket.disconnect();
    return;
  }

  // Зарегистрировать соединение
  socketUsers.set(socket.id, userId);
  
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  userConnections.get(userId).add(socket.id);

  logger.info(`User ${userId} connected via WebSocket (${socket.id})`);

  // Отправить приветствие
  socket.emit('welcome', { userId, connectedAt: Date.now() });

  // Обработка отключения
  socket.on('disconnect', () => {
    handleDisconnect(socket.id, userId);
  });
}

/**
 * Обработка отключения
 */
function handleDisconnect(socketId, userId) {
  if (socketUsers.has(socketId)) {
    socketUsers.delete(socketId);
  }

  if (userConnections.has(userId)) {
    userConnections.get(userId).delete(socketId);
    
    if (userConnections.get(userId).size === 0) {
      userConnections.delete(userId);
    }
  }

  logger.info(`User ${userId} disconnected (${socketId})`);
}

/**
 * Отправить код 2FA устройствам пользователя
 */
async function sendToDevices(deviceIds, notification) {
  const results = [];
  const deliveredTo = [];

  for (const deviceId of deviceIds) {
    const connections = userConnections.get(deviceId);
    
    if (!connections || connections.size === 0) {
      results.push({ deviceId, success: false, error: 'Device offline' });
      continue;
    }

    let delivered = false;
    for (const socketId of connections) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        try {
          socket.emit('2fa_code', notification);
          delivered = true;
          deliveredTo.push(deviceId);
          break;
        } catch (error) {
          logger.error(`Failed to send to ${socketId}: ${error.message}`);
        }
      }
    }

    if (!delivered) {
      results.push({ deviceId, success: false, error: 'Delivery failed' });
    }
  }

  return {
    success: deliveredTo.length > 0,
    deliveredTo,
    error: deliveredTo.length === 0 ? 'No devices online' : null
  };
}

/**
 * Получить онлайн-устройства пользователя
 */
function getOnlineDevices(userId) {
  const connections = userConnections.get(userId);
  
  if (!connections || connections.size === 0) {
    return [];
  }

  const devices = [];
  for (const socketId of connections) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      devices.push({
        id: userId,
        socketId,
        connectedAt: socket.handshake.time
      });
    }
  }

  return devices;
}

/**
 * Проверить подключение WebSocket
 */
async function testConnection() {
  // Простая проверка - есть ли хотя бы одно подключение
  return userConnections.size > 0;
}

/**
 * Отправить уведомление всем устройствам пользователя
 */
function notifyUser(userId, type, data) {
  const connections = userConnections.get(userId);
  
  if (!connections || connections.size === 0) {
    return { success: false, error: 'User offline' };
  }

  const notification = { type, ...data, timestamp: Date.now() };
  
  let delivered = 0;
  for (const socketId of connections) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      try {
        socket.emit('notification', notification);
        delivered++;
      } catch (error) {
        logger.error(`Failed to notify ${socketId}: ${error.message}`);
      }
    }
  }

  return {
    success: delivered > 0,
    delivered
  };
}

module.exports = {
  init,
  sendToDevices,
  getOnlineDevices,
  testConnection,
  notifyUser
};