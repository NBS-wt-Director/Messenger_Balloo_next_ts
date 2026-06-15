/**
 * Balloo Android Service
 * Backend сервис для мобильных приложений
 * 
 * @version 1.0.0
 * @author NBS-wt
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { pushRoutes } from './routes/push';
import { smsRoutes } from './routes/sms';
import { syncRoutes } from './routes/sync';
import { deviceRoutes } from './routes/devices';
import { connectDB } from './database';
import { initRedis } from './redis';

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigins,
    credentials: true,
  },
});

// ==================== MIDDLEWARE ====================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-ID', 'X-App-Version'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    deviceId: req.headers['x-device-id'],
    appVersion: req.headers['x-app-version'],
  });
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'android-service',
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/devices', deviceRoutes);

// API documentation
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'Balloo Android Service',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      push: '/api/push',
      sms: '/api/sms',
      sync: '/api/sync',
      devices: '/api/devices',
    },
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ==================== WEBSOCKET ====================

io.on('connection', (socket) => {
  logger.info('Android client connected', { socketId: socket.id });
  
  socket.on('register-device', (data) => {
    logger.info('Device registered', { socketId: socket.id, deviceId: data.deviceId });
    socket.join(`device:${data.deviceId}`);
  });

  socket.on('disconnect', () => {
    logger.info('Android client disconnected', { socketId: socket.id });
  });
});

// ==================== STARTUP ====================

async function bootstrap() {
  try {
    // Connect to database
    await connectDB();
    logger.info('Database connected');

    // Initialize Redis
    await initRedis();
    logger.info('Redis initialized');

    // Start server
    httpServer.listen(config.port, config.host, () => {
      logger.info(`🚀 Android Service started on http://${config.host}:${config.port}`);
      logger.info(`📡 WebSocket server ready`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start Android Service', { error });
    process.exit(1);
  }
}

bootstrap();

export { app, io, httpServer };
