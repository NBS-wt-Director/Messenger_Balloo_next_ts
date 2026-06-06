/**
 * Notification Controller
 * Управление уведомлениями
 */

const notificationService = require('../services/notification.service');

// Подписаться на push-уведомления
exports.subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Недостаточно данных подписки' }
      });
    }

    const subscriptionId = await notificationService.subscribe(req.user.id, subscription);

    res.json({
      success: true,
      data: { subscriptionId }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при подписке' }
    });
  }
};

// Получить VAPID публичный ключ
exports.getVapidKey = async (req, res) => {
  try {
    const publicKey = notificationService.getVapidPublicKey();

    if (!publicKey) {
      return res.status(500).json({
        success: false,
        error: { code: 'NOT_CONFIGURED', message: 'VAPID ключи не настроены' }
      });
    }

    res.json({
      success: true,
      data: { publicKey }
    });
  } catch (error) {
    console.error('GetVapidKey error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении ключа' }
    });
  }
};

// Получить список уведомлений
exports.getNotifications = async (req, res) => {
  try {
    const { limit = 50, offset = 0, read } = req.query;

    let query = 'SELECT * FROM notifications WHERE userId = ?';
    const params = [req.user.id];

    if (read !== undefined) {
      query += ' AND read = ?';
      params.push(read === 'true' ? 1 : 0);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const notifications = db.prepare(query).all(...params);

    const total = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE userId = ?').get(req.user.id).count;

    res.json({
      success: true,
      data: {
        notifications: notifications.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          data: JSON.parse(n.data || '{}'),
          read: !!n.read,
          readAt: n.readAt,
          createdAt: n.createdAt,
          expiresAt: n.expiresAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
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

// Отметить уведомление как прочитанное
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = db.prepare('SELECT id FROM notifications WHERE id = ? AND userId = ?').get(notificationId, req.user.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Уведомление не найдено' }
      });
    }

    db.prepare('UPDATE notifications SET read = 1, readAt = ? WHERE id = ?').run(Date.now(), notificationId);

    res.json({ success: true });
  } catch (error) {
    console.error('MarkAsRead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении уведомления' }
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
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении уведомлений' }
    });
  }
};

// Удалить уведомление
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = db.prepare('SELECT id FROM notifications WHERE id = ? AND userId = ?').get(notificationId, req.user.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Уведомление не найдено' }
      });
    }

    db.prepare('DELETE FROM notifications WHERE id = ?').run(notificationId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteNotification error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении уведомления' }
    });
  }
};

// Отправить уведомление (админ)
exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'userId, title и body обязательны' }
      });
    }

    const result = await notificationService.notify(userId, type || 'custom', title, body, data || {});

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('SendNotification error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отправке уведомления' }
    });
  }
};

// Отправить email (админ)
exports.sendEmail = async (req, res) => {
  try {
    const { userId, subject, html, text } = req.body;

    if (!userId || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'userId, subject и html обязательны' }
      });
    }

    const result = await notificationService.notifyEmail(userId, subject, html, text);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('SendEmail error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отправке email' }
    });
  }
};
