/**
 * WebSocket Server
 * Real-time коммуникация для Balloo Messenger
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const logger = require('../config/logger');
const websocketHandler = require('./handler');

let io = null;

/**
 * Создание WebSocket сервера
 */
function createWebSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    handleConnection(socket);
  });

  logger.info('WebSocket server initialized');
}

/**
 * Обработка подключения
 */
function handleConnection(socket) {
  // Аутентификация по JWT токену
  const token = socket.handshake.query.token;
  
  if (!token) {
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;

    // Зарегистрировать соединение
    socket.join(`user:${socket.userId}`);

    logger.info(`User ${socket.userId} connected via WebSocket`);

    // Отправить приветствие
    socket.emit('welcome', { userId: socket.userId });

    // Обработка событий через handler
    websocketHandler.setupSocketHandlers(socket);

    // Обработка отключения
    socket.on('disconnect', () => {
      handleDisconnect(socket);
    });
  } catch (error) {
    logger.error('WebSocket authentication failed:', error);
    socket.disconnect();
  }
}

/**
 * Обработка отключения
 */
function handleDisconnect(socket) {
  logger.info(`User ${socket.userId} disconnected from WebSocket`);
}

/**
 * Получить онлайн-устройства пользователя
 */
function getOnlineDevices(userId) {
  const clients = io.sockets.adapter.room(`user:${userId}`);
  
  if (!clients) return [];
  
  return Array.from(clients).map(socketId => ({
    id: socketId,
    userId
  }));
}

/**
 * Проверить подключение
 */
async function testConnection() {
  return io && io.sockets.sockets.size > 0;
}

module.exports = {
  createWebSocketServer,
  getOnlineDevices,
  testConnection
};
