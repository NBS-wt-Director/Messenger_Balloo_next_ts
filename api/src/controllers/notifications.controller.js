/**
 * Notifications Controller
 * Уведомления пользователя
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Получить уведомления
exports.getNotifications = async (req, res) => {
  try {
    const { type, read, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM notifications WHERE userId = ?';
    const params = [req.user.id];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (read !== undefined) {
      query += ' AND read = ?';
      params.push(read === 'true' ? 1 : 0);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const notifications = db.prepare(query).all(...params);

    const total = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND read = 0').get(req.user.id).count;

    res.json({
      success: true,
      data: {
        notifications: notifications.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          icon: n.icon,
          url: n.url,
          data: JSON.parse(n.data || '{}'),
          read: !!n.read,
          createdAt: n.createdAt,
          expiresAt: n.expiresAt
        })),
        unreadCount: total
      }
    });
  } catch (error) {
    console.error('GetNotifications error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении уведомлений' }
    });
  }
};

// Отметить как прочитанное
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    db.prepare('UPDATE notifications SET read = 1, readAt = ? WHERE id = ? AND userId = ?')
      .run(Date.now(), notificationId, req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('MarkAsRead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отметке прочтения' }
    });
  }
};

// Отметить все как прочитанные
exports.markAllAsRead = async (req, res) => {
  try {
    db.prepare('UPDATE notifications SET read = 1, readAt = ? WHERE userId = ? AND read = 0')
      .run(Date.now(), req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('MarkAllAsRead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отметке прочтения' }
    });
  }
};

// Удалить уведомление
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    db.prepare('DELETE FROM notifications WHERE id = ? AND userId = ?').run(notificationId, req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteNotification error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении уведомления' }
    });
  }
};

// Создать уведомление (внутренний метод)
exports.createNotification = async (userId, notificationData) => {
  const notificationId = uuidv4();
  const now = Date.now();

  db.prepare(`
    INSERT INTO notifications (id, userId, type, title, body, icon, url, data, read, createdAt, expiresAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
  `).run(
    notificationId,
    userId,
    notificationData.type,
    notificationData.title,
    notificationData.body,
    notificationData.icon || null,
    notificationData.url || null,
    JSON.stringify(notificationData.data || {}),
    now,
    notificationData.expiresAt || null
  );

  return notificationId;
};

// Зарегистрировать push токен
exports.registerPushToken = async (req, res) => {
  try {
    const { pushToken, platform } = req.body;

    if (!pushToken || !platform) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Push токен и платформа обязательны' }
      });
    }

    const user = db.prepare('SELECT pushTokens FROM users WHERE id = ?').get(req.user.id);
    const tokens = JSON.parse(user?.pushTokens || '[]');

    // Обновить существующий или добавить новый
    const existingIndex = tokens.findIndex(t => t.token === pushToken);
    const now = Date.now();

    if (existingIndex >= 0) {
      tokens[existingIndex].lastUsedAt = now;
    } else {
      tokens.push({
        token: pushToken,
        platform,
        createdAt: now,
        expiresAt: now + (30 * 24 * 60 * 60 * 1000), // 30 дней
        lastUsedAt: now
      });
    }

    db.prepare('UPDATE users SET pushTokens = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(tokens), now, req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('RegisterPushToken error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при регистрации токена' }
    });
  }
};
