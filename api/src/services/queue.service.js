/**
 * Job Queue System
 * Очередь фоновых задач с Bull + Redis
 */

const Bull = require('bull');
const logger = require('../config/logger');
const { checkConnection } = require('../config/redis');

// Конфигурация
const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || null
};

// ============================================
// QUEUES
// ============================================

// Очередь отправки SMS
const smsQueue = new Bull('sms-queue', { redis: REDIS_CONFIG });

// Очередь отправки email
const emailQueue = new Bull('email-queue', { redis: REDIS_CONFIG });

// Очередь обработки файлов
const fileQueue = new Bull('file-queue', { redis: REDIS_CONFIG });

// Очередь уведомлений
const notificationQueue = new Bull('notification-queue', { redis: REDIS_CONFIG });

// Очередь очистки данных
const cleanupQueue = new Bull('cleanup-queue', { redis: REDIS_CONFIG });

// ============================================
// SMS QUEUE JOBS
// ============================================

smsQueue.process('send-sms', async (job) => {
  const { phone, code, type } = job.data;
  logger.info(`Processing SMS job ${job.id}: ${phone}`);
  
  try {
    const smsService = require('./sms.service');
    const result = await smsService.sendVerificationCode(phone, code, type);
    
    if (!result.success) {
      throw new Error(result.error || 'SMS send failed');
    }
    
    return result;
  } catch (error) {
    logger.error(`SMS job ${job.id} failed:`, error);
    throw error;
  }
});

smsQueue.on('failed', (job, err) => {
  logger.error(`SMS job ${job.id} failed permanently:`, err);
});

smsQueue.on('completed', (job, result) => {
  logger.info(`SMS job ${job.id} completed`);
});

// ============================================
// EMAIL QUEUE JOBS
// ============================================

emailQueue.process('send-email', async (job) => {
  const { to, subject, html, type } = job.data;
  logger.info(`Processing email job ${job.id}: ${to}`);
  
  try {
    const emailService = require('./email.service');
    const result = await emailService.send(to, subject, html, type);
    
    if (!result.success) {
      throw new Error(result.error || 'Email send failed');
    }
    
    return result;
  } catch (error) {
    logger.error(`Email job ${job.id} failed:`, error);
    throw error;
  }
});

emailQueue.on('failed', (job, err) => {
  logger.error(`Email job ${job.id} failed permanently:`, err);
});

emailQueue.on('completed', (job, result) => {
  logger.info(`Email job ${job.id} completed`);
});

// ============================================
// FILE QUEUE JOBS
// ============================================

fileQueue.process('upload-file', async (job) => {
  const { userId, filePath, fileName, type } = job.data;
  logger.info(`Processing file upload job ${job.id}`);
  
  try {
    const yandexService = require('./yandex-disk.service');
    const result = await yandexService.uploadFile(filePath, fileName, userId);
    
    return result;
  } catch (error) {
    logger.error(`File upload job ${job.id} failed:`, error);
    throw error;
  }
});

fileQueue.process('delete-file', async (job) => {
  const { fileId } = job.data;
  logger.info(`Processing file delete job ${job.id}`);
  
  try {
    const yandexService = require('./yandex-disk.service');
    const result = await yandexService.deleteFile(fileId);
    
    return result;
  } catch (error) {
    logger.error(`File delete job ${job.id} failed:`, error);
    throw error;
  }
});

// ============================================
// NOTIFICATION QUEUE JOBS
// ============================================

notificationQueue.process('send-push', async (job) => {
  const { userId, title, body, data } = job.data;
  logger.info(`Processing push notification job ${job.id}`);
  
  try {
    const { sendToUser } = require('../websocket/manager');
    const result = await sendToUser(userId, {
      type: 'push_notification',
      title,
      body,
      data
    });
    
    return result;
  } catch (error) {
    logger.error(`Push notification job ${job.id} failed:`, error);
    throw error;
  }
});

// ============================================
// CLEANUP QUEUE JOBS
// ============================================

cleanupQueue.process('cleanup-expired-codes', async (job) => {
  logger.info(`Processing cleanup expired codes job ${job.id}`);
  
  try {
    const { db } = require('../config/database');
    const result = db.prepare(`
      DELETE FROM verification_codes WHERE expires_at < ?
    `).run(Date.now());
    
    logger.info(`Cleaned up ${result.changes} expired verification codes`);
    return { cleaned: result.changes };
  } catch (error) {
    logger.error(`Cleanup job ${job.id} failed:`, error);
    throw error;
  }
});

cleanupQueue.process('cleanup-old-messages', async (job) => {
  logger.info(`Processing cleanup old messages job ${job.id}`);
  
  try {
    const { db } = require('../config/database');
    const retentionDays = parseInt(process.env.MESSAGE_RETENTION_DAYS) || 90;
    const cutoffDate = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    
    const result = db.prepare(`
      DELETE FROM messages WHERE created_at < ?
    `).run(cutoffDate);
    
    logger.info(`Cleaned up ${result.changes} old messages`);
    return { cleaned: result.changes };
  } catch (error) {
    logger.error(`Cleanup job ${job.id} failed:`, error);
    throw error;
  }
});

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  // Проверка Redis подключения
  const connected = await checkConnection();
  if (!connected) {
    logger.error('Redis not connected, job queue cannot start');
    return false;
  }

  // Настройка повторных попыток
  smsQueue.options({
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: 100,
      removeOnFail: 1000
    }
  });

  emailQueue.options({
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: 100,
      removeOnFail: 1000
    }
  });

  // Настройка периодических задач
  await setupScheduledJobs();

  logger.info('Job Queue initialized successfully');
  return true;
}

// ============================================
// SCHEDULED JOBS
// ============================================

async function setupScheduledJobs() {
  // Очистка expired кодов каждые 6 часов
  await cleanupQueue.add(
    { type: 'cleanup-expired-codes' },
    {
      repeat: { cron: '0 */6 * * *' },
      jobId: 'cleanup-expired-codes'
    }
  );

  // Очистка старых сообщений раз в сутки
  await cleanupQueue.add(
    { type: 'cleanup-old-messages' },
    {
      repeat: { cron: '0 0 * * *' },
      jobId: 'cleanup-old-messages'
    }
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Отправить SMS в очередь
 */
async function sendSMS(phone, code, type = 'verification') {
  const job = await smsQueue.add('send-sms', { phone, code, type });
  return job;
}

/**
 * Отправить email в очередь
 */
async function sendEmail(to, subject, html, type = 'default') {
  const job = await emailQueue.add('send-email', { to, subject, html, type });
  return job;
}

/**
 * Загрузить файл в очередь
 */
async function uploadFile(userId, filePath, fileName, type = 'attachment') {
  const job = await fileQueue.add('upload-file', { userId, filePath, fileName, type });
  return job;
}

/**
 * Удалить файл в очереди
 */
async function deleteFile(fileId) {
  const job = await fileQueue.add('delete-file', { fileId });
  return job;
}

/**
 * Отправить push уведомление
 */
async function sendPush(userId, title, body, data = {}) {
  const job = await notificationQueue.add('send-push', { userId, title, body, data });
  return job;
}

/**
 * Получить статистику очередей
 */
async function getQueueStats() {
  const queues = [smsQueue, emailQueue, fileQueue, notificationQueue, cleanupQueue];
  const stats = {};

  for (const queue of queues) {
    const counts = await queue.getJobCounts();
    stats[queue.name] = {
      waiting: counts.waiting,
      active: counts.active,
      completed: counts.completed,
      failed: counts.failed,
      delayed: counts.delayed
    };
  }

  return stats;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  init,
  sendSMS,
  sendEmail,
  uploadFile,
  deleteFile,
  sendPush,
  getQueueStats,
  smsQueue,
  emailQueue,
  fileQueue,
  notificationQueue,
  cleanupQueue
};
