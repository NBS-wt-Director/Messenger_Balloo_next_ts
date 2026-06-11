import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import winston from 'winston';
import http from 'http';

// Инициализация базы данных
import { initDatabase } from './config/database';
import { validateConfig } from './config/yandex';

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
import { globalLimiter } from './middleware/rateLimit';
app.use(globalLimiter);

// Логирование запросов
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Root route
app.get('/', (_req: Request, res: Response) => {
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
import apiRoutes from './routes';
app.use('/api/v1', apiRoutes);

// API v1 root
app.get('/api/v1', (_req: Request, res: Response) => {
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
import { createWebSocketServer } from './websocket';
createWebSocketServer(server);

// Инициализация 2FA Router
import smart2faRouter from './services/2fa-router.service';
smart2faRouter.init();

// Metrics middleware
import { metricsMiddleware } from './middleware/metrics';
app.use(metricsMiddleware);

// Error handling middleware
app.use((err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {
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
app.use((req: Request, res: Response) => {
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

export { app, server, logger };
