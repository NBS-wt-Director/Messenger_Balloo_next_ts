/**
 * Notification Service
 * Push-уведомления и Email
 */

const webpush = require('web-push');
const nodemailer = require('nodemailer');
const { db } = require('../config/database');

// Инициализация Web Push
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:' + process.env.EMAIL_FROM,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

// Инициализация Email транспортера
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Сохранить push подписку пользователя
 */
exports.subscribe = async (userId, subscription) => {
  const id = require('uuid').v4();
  const now = Date.now();

  const existing = db.prepare('SELECT id FROM push_subscriptions WHERE userId = ?').get(userId);
  
  if (existing) {
    db.prepare(`
      UPDATE push_subscriptions 
      SET endpoint = ?, p256dh = ?, auth = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      subscription.endpoint,
      subscription.keys.p256dh,
      subscription.keys.auth,
      now,
      existing.id
    );
    return existing.id;
  } else {
    db.prepare(`
      INSERT INTO push_subscriptions (id, userId, endpoint, p256dh, auth, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, userId, subscription.endpoint,
      subscription.keys.p256dh, subscription.keys.auth,
      now, now
    );
    return id;
  }
};

/**
 * Отправить push-уведомление
 */
exports.sendPush = async (userId, title, body, data = {}) => {
  const subscription = db.prepare('SELECT * FROM push_subscriptions WHERE userId = ?').get(userId);
  
  if (!subscription) {
    return { success: false, reason: 'No subscription' };
  }

  try {
    const payload = JSON.stringify({ title, body, data });
    
    await webpush.sendNotification({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    }, payload);

    return { success: true };
  } catch (error) {
    console.error('Push notification error:', error.message);
    
    // Если ошибка 410 - подписка устарела
    if (error.statusCode === 410) {
      db.prepare('DELETE FROM push_subscriptions WHERE id = ?').run(subscription.id);
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Отправить email
 */
exports.sendEmail = async (to, subject, html, text = null) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html
    });

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Сохранить уведомление в БД
 */
exports.saveNotification = async (userId, type, title, body, data = {}) => {
  const id = require('uuid').v4();
  const now = Date.now();

  db.prepare(`
    INSERT INTO notifications (id, userId, type, title, body, data, createdAt, expiresAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, userId, type, title, body, JSON.stringify(data),
    now,
    data.expiresAt || null
  );

  return id;
};

/**
 * Отправить уведомление пользователю (push + сохранение в БД)
 */
exports.notify = async (userId, type, title, body, data = {}) => {
  // Сохранить в БД
  const notificationId = await this.saveNotification(userId, type, title, body, data);

  // Отправить push
  const pushResult = await this.sendPush(userId, title, body, data);

  return {
    success: true,
    notificationId,
    pushSent: pushResult.success
  };
};

/**
 * Отправить email-уведомление
 */
exports.notifyEmail = async (userId, subject, html, text = null) => {
  const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
  
  if (!user) {
    return { success: false, reason: 'User not found' };
  }

  return await this.sendEmail(user.email, subject, html, text);
};

/**
 * Получить VAPID публичный ключ
 */
exports.getVapidPublicKey = () => {
  return VAPID_PUBLIC_KEY;
};

/**
 * Очистить устаревшие подписки
 */
exports.cleanupExpiredSubscriptions = async () => {
  const result = db.prepare(`
    DELETE FROM push_subscriptions 
    WHERE updatedAt < ?
  `).run(Date.now() - (30 * 24 * 60 * 60 * 1000)); // 30 дней

  return { deletedCount: result.changes };
};
