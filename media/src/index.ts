 /**
 * Balloo Media Server
 * Обработка медиафайлов (видео, аудио, изображения)
 * 
 * @version 1.0.0
 * @author NBS-wt
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { createServer } from 'http';
import { config } from './config';
import { logger } from './utils/logger';
import { transcodeVideo } from './services/transcode';
import { generateThumbnail } from './services/thumbnail';
import { compressImage } from './services/image';
import { uploadToYandexDisk } from './services/yandex-disk';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();
const httpServer = createServer(app);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov|avi|mp3|wav|ogg/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// ==================== MIDDLEWARE ====================

app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    contentType: req.headers['content-type'],
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
    service: 'media-server',
    version: '1.0.0',
  });
});

/**
 * POST /api/media/upload
 * Загрузка медиафайла
 */
app.post('/api/media/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'File is required' },
      });
    }

    logger.info('File uploaded', {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    res.json({
      success: true,
      data: {
        fileId: req.file.filename,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: `/api/media/files/${req.file.filename}`,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Upload failed', { error });
    res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_FAILED', message: 'Upload failed' },
    });
  }
});

/**
 * POST /api/media/transcode
 * Транскодирование видео
 */
app.post('/api/media/transcode', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'File is required' },
      });
    }

    const { format = 'mp4', quality = '720p' } = req.body;

    logger.info('Transcoding video', {
      filename: req.file.filename,
      format,
      quality,
    });

    const result = await transcodeVideo(req.file.path, { format, quality });

    res.json({
      success: true,
      data: {
        originalFile: req.file.filename,
        transcodedFile: result.outputPath,
        format,
        quality,
        duration: result.duration,
        size: result.size,
      },
    });
  } catch (error) {
    logger.error('Transcoding failed', { error });
    res.status(500).json({
      success: false,
      error: { code: 'TRANSCODE_FAILED', message: 'Transcoding failed' },
    });
  }
});

/**
 * POST /api/media/thumbnail
 * Генерация превью для видео
 */
app.post('/api/media/thumbnail', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'File is required' },
      });
    }

    const { time = 5 } = req.body; // seconds

    logger.info('Generating thumbnail', {
      filename: req.file.filename,
      time,
    });

    const thumbnailPath = await generateThumbnail(req.file.path, time);

    res.json({
      success: true,
      data: {
        videoFile: req.file.filename,
        thumbnailPath,
        time,
      },
    });
  } catch (error) {
    logger.error('Thumbnail generation failed', { error });
    res.status(500).json({
      success: false,
      error: { code: 'THUMBNAIL_FAILED', message: 'Thumbnail generation failed' },
    });
  }
});

/**
 * POST /api/media/compress
 * Сжатие изображения
 */
app.post('/api/media/compress', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'File is required' },
      });
    }

    const { quality = 80, maxWidth = 1920, maxHeight = 1080 } = req.body;

    logger.info('Compressing image', {
      filename: req.file.filename,
      quality,
      maxWidth,
      maxHeight,
    });

    const result = await compressImage(req.file.path, { quality, maxWidth, maxHeight });

    res.json({
      success: true,
      data: {
        originalFile: req.file.filename,
        originalSize: req.file.size,
        compressedFile: result.outputPath,
        compressedSize: result.size,
        compressionRatio: ((1 - result.size / req.file.size) * 100).toFixed(2) + '%',
      },
    });
  } catch (error) {
    logger.error('Image compression failed', { error });
    res.status(500).json({
      success: false,
      error: { code: 'COMPRESS_FAILED', message: 'Image compression failed' },
    });
  }
});

/**
 * POST /api/media/upload-to-disk
 * Загрузка на Яндекс.Диск
 */
app.post('/api/media/upload-to-disk', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'File is required' },
      });
    }

    const { path = '/' } = req.body;

    logger.info('Uploading to Yandex Disk', {
      filename: req.file.filename,
      path,
    });

    const diskUrl = await uploadToYandexDisk(req.file.path, path);

    res.json({
      success: true,
      data: {
        file: req.file.filename,
        diskUrl,
        path,
      },
    });
  } catch (error) {
    logger.error('Yandex Disk upload failed', { error });
    res.status(500).json({
      success: false,
      error: { code: 'DISK_UPLOAD_FAILED', message: 'Yandex Disk upload failed' },
    });
  }
});

/**
 * GET /api/media/files/:filename
 * Получение файла
 */
app.get('/api/media/files/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = `${config.uploadDir}/${filename}`;
  
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        error: { code: 'FILE_NOT_FOUND', message: 'File not found' },
      });
    }
  });
});

/**
 * DELETE /api/media/files/:filename
 * Удаление файла
 */
app.delete('/api/media/files/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const fs = await import('fs/promises');
    const filePath = `${config.uploadDir}/${filename}`;
    
    await fs.unlink(filePath);
    
    logger.info('File deleted', { filename });
    
    res.json({
      success: true,
      message: 'File deleted',
    });
  } catch (error) {
    logger.error('File deletion failed', { error });
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: 'File deletion failed' },
    });
  }
});

/**
 * GET /api/media/stats
 * Статистика медиа сервера
 */
app.get('/api/media/stats', async (req: Request, res: Response) => {
  try {
    const fs = await import('fs/promises');
    const files = await fs.readdir(config.uploadDir);
    
    let totalSize = 0;
    const stats = {
      images: 0,
      videos: 0,
      audio: 0,
      other: 0,
    };

    for (const file of files) {
      const stat = await fs.stat(`${config.uploadDir}/${file}`);
      totalSize += stat.size;
      
      const ext = file.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
        stats.images++;
      } else if (['mp4', 'webm', 'mov', 'avi'].includes(ext || '')) {
        stats.videos++;
      } else if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
        stats.audio++;
      } else {
        stats.other++;
      }
    }

    res.json({
      success: true,
      data: {
        totalFiles: files.length,
        totalSize,
        totalSizeFormatted: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
        stats,
      },
    });
  } catch (error) {
    logger.error('Stats retrieval failed', { error });
    res.status(500).json({
      success: false,
      error: { code: 'STATS_FAILED', message: 'Stats retrieval failed' },
    });
  }
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

// ==================== STARTUP ====================

async function bootstrap() {
  try {
    // Ensure upload directory exists
    const fs = await import('fs/promises');
    await fs.mkdir(config.uploadDir, { recursive: true });

    // Start server
    httpServer.listen(config.port, config.host, () => {
      logger.info(`🚀 Media Server started on http://${config.host}:${config.port}`);
      logger.info(`📁 Upload directory: ${config.uploadDir}`);
      logger.info(`📊 Max file size: ${config.maxFileSize / 1024 / 1024} MB`);
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
    logger.error('Failed to start Media Server', { error });
    process.exit(1);
  }
}

bootstrap();

export { app, httpServer };
