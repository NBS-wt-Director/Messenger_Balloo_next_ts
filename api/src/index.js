require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const http = require('http');

// Инициализация базы данных
const { initDatabase } = require('./config/database');
const { validateConfig } = require('./config/yandex');

// Инициализация Express app
const app = express();
const server = http.createServer(app);

// Logging
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const { globalLimiter } = require('./middleware/rateLimit');
app.use(globalLimiter);

// Логирование запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'App Balloo API',
    version: '1.0.0',
    docs: '/api/docs',
    features: [
      'E2E Encryption Support',
      'Yandex OAuth',
      'Yandex Disk Integration',
      'SQLite Database',
      'WebSocket Real-time',
      'Audio/Video Calls',
      'Email Notifications'
    ]
  });
});

// API Routes
const apiRoutes = require('./routes');
app.use('/api/v1', apiRoutes);

// API v1 root
app.get('/api/v1', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      chats: '/api/v1/chats',
      messages: '/api/v1/messages',
      contacts: '/api/v1/contacts',
      notifications: '/api/v1/notifications',
      invitations: '/api/v1/invitations',
      groups: '/api/v1/groups',
      disk: '/api/v1/disk',
      calls: '/api/v1/calls',
      sync: '/api/v1/sync',
      admin: '/api/v1/admin'
    }
  });
});

// WebSocket сервер
const { createWebSocketServer } = require('./websocket');
createWebSocketServer(server);

// Инициализация 2FA Router
const smart2faRouter = require('./services/2fa-router.service');
smart2faRouter.init();

// Metrics middleware
const { metricsMiddleware } = require('./middleware/metrics');
app.use(metricsMiddleware);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Инициализация БД и запуск сервера
initDatabase();

// Проверка конфигурации
const configWarnings = validateConfig();
configWarnings.forEach(warning => logger.warn(warning));

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`WebSocket server ready at ws://localhost:${PORT}/ws?token=<jwt_token>`);
});

module.exports = { app, server };
