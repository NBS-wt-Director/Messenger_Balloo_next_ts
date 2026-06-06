/**
 * Users Controller
 * Управление пользователями, профилями, поиском
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Получить данные пользователя по ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = db.prepare(`
      SELECT id, displayName, fullName, avatar, publicKey, 
             settings, familyRelations, createdAt, lastSeen
      FROM users WHERE id = ?
    `).get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    // Проверка статуса
    const isOnline = false; // TODO: Проверять через WebSocket подключения
    const lastSeen = user.lastSeen || user.createdAt;

    res.json({
      success: true,
      data: {
        id: user.id,
        displayName: user.displayName,
        fullName: user.fullName,
        avatar: user.avatar,
        publicKey: user.publicKey,
        status: isOnline ? 'online' : 'offline',
        lastSeen,
        familyRelations: JSON.parse(user.familyRelations || '[]')
      }
    });
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении данных пользователя' }
    });
  }
};

// Поиск пользователей
exports.searchUsers = async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Поисковый запрос должен быть минимум 2 символа' }
      });
    }

    const searchPattern = `%${q}%`;
    const users = db.prepare(`
      SELECT id, displayName, fullName, avatar, createdAt
      FROM users 
      WHERE displayName LIKE ? OR fullName LIKE ? OR email LIKE ?
      LIMIT ? OFFSET ?
    `).all(searchPattern, searchPattern, searchPattern, parseInt(limit), parseInt(offset));

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM users 
      WHERE displayName LIKE ? OR fullName LIKE ? OR email LIKE ?
    `).get(searchPattern, searchPattern, searchPattern).count;

    res.json({
      success: true,
      data: {
        users: users.map(u => ({
          id: u.id,
          displayName: u.displayName,
          fullName: u.fullName,
          avatar: u.avatar,
          createdAt: u.createdAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    console.error('SearchUsers error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при поиске пользователей' }
    });
  }
};

// Обновление текущего пользователя
exports.updateMe = async (req, res) => {
  try {
    const { displayName, fullName, bio, birthDate, phone, familyRelations, settings } = req.body;

    const updates = [];
    const values = [];

    if (displayName !== undefined) {
      updates.push('displayName = ?');
      values.push(displayName);
    }
    if (fullName !== undefined) {
      updates.push('fullName = ?');
      values.push(fullName);
    }
    if (bio !== undefined) {
      updates.push('settings = json_set(settings, "$.bio", ?)');
      values.push(bio);
    }
    if (birthDate !== undefined) {
      updates.push('birthDate = ?');
      values.push(birthDate);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (familyRelations !== undefined) {
      updates.push('familyRelations = ?');
      values.push(JSON.stringify(familyRelations));
    }
    if (settings !== undefined) {
      updates.push('settings = ?');
      values.push(JSON.stringify(settings));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Нет данных для обновления' }
      });
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(req.user.id);

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        fullName: user.fullName,
        avatar: user.avatar,
        settings: JSON.parse(user.settings || '{}')
      }
    });
  } catch (error) {
    console.error('UpdateMe error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении профиля' }
    });
  }
};

// Загрузка аватара
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Файл не загружен' }
      });
    }

    // TODO: Сохранить файл и получить URL
    // Для демо - используем путь
    const avatarUrl = `/uploads/${req.file.filename}`;

    db.prepare('UPDATE users SET avatar = ?, updatedAt = ? WHERE id = ?')
      .run(avatarUrl, Date.now(), req.user.id);

    res.json({
      success: true,
      data: { avatar: avatarUrl }
    });
  } catch (error) {
    console.error('UpdateAvatar error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при загрузке аватара' }
    });
  }
};

// Обновление статуса
exports.updateStatus = async (req, res) => {
  try {
    const { status, customStatus } = req.body;

    const validStatuses = ['online', 'offline', 'away', 'busy'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверный статус' }
      });
    }

    // TODO: Обновить статус и рассылать через WebSocket
    db.prepare('UPDATE users SET lastSeen = ? WHERE id = ?').run(Date.now(), req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении статуса' }
    });
  }
};

// Список контактов пользователя
exports.getContacts = async (req, res) => {
  try {
    const contacts = db.prepare(`
      SELECT c.*, u.displayName, u.avatar, u.lastSeen, u.publicKey
      FROM contacts c
      LEFT JOIN users u ON c.contactUserId = u.id
      WHERE c.userId = ? AND c.isBlocked = 0
      ORDER BY c.createdAt DESC
    `).all(req.user.id);

    res.json({
      success: true,
      data: {
        contacts: contacts.map(c => ({
          id: c.id,
          contactUserId: c.contactUserId,
          displayName: c.displayName || c.displayName,
          avatar: c.avatar,
          lastSeen: c.lastSeen,
          publicKey: c.publicKey,
          isFavorite: !!c.isFavorite,
          createdAt: c.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetContacts error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении контактов' }
    });
  }
};

// Список устройств
exports.getDevices = async (req, res) => {
  try {
    const devices = db.prepare(`
      SELECT id, platform, deviceId, deviceName, pushToken, lastActive, createdAt
      FROM devices WHERE userId = ?
      ORDER BY lastActive DESC
    `).all(req.user.id);

    res.json({
      success: true,
      data: {
        devices: devices.map(d => ({
          id: d.id,
          platform: d.platform,
          deviceId: d.deviceId,
          deviceName: d.deviceName,
          lastActive: d.lastActive,
          createdAt: d.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetDevices error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении устройств' }
    });
  }
};

// Обновление устройства
exports.updateDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { pushToken, platform, deviceName } = req.body;

    const updates = [];
    const values = [];

    if (pushToken !== undefined) {
      updates.push('pushToken = ?');
      values.push(pushToken);
    }
    if (platform !== undefined) {
      updates.push('platform = ?');
      values.push(platform);
    }
    if (deviceName !== undefined) {
      updates.push('deviceName = ?');
      values.push(deviceName);
    }

    updates.push('lastActive = ?');
    values.push(Date.now());
    values.push(deviceId);
    values.push(req.user.id);

    db.prepare(`UPDATE devices SET ${updates.join(', ')} WHERE id = ? AND userId = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateDevice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении устройства' }
    });
  }
};

// Удаление устройства
exports.deleteDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    db.prepare('DELETE FROM devices WHERE id = ? AND userId = ?').run(deviceId, req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteDevice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении устройства' }
    });
  }
};

// Удаление аккаунта
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Пароль обязателен' }
      });
    }

    // Проверка пароля
    const user = db.prepare('SELECT passwordHash FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    const bcrypt = require('bcryptjs');
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Неверный пароль' }
      });
    }

    // Удалить все связанные данные
    const userId = req.user.id;

    // Удалить сессии
    db.prepare('DELETE FROM sessions WHERE userId = ?').run(userId);

    // Удалить устройства
    db.prepare('DELETE FROM devices WHERE userId = ?').run(userId);

    // Удалить контакты
    db.prepare('DELETE FROM contacts WHERE userId = ?').run(userId);
    db.prepare('DELETE FROM contacts WHERE contactUserId = ?').run(userId);

    // Удалить чаты, где пользователь единственный участник
    const chats = db.prepare('SELECT id FROM chats WHERE participants = ?').all(JSON.stringify([userId]));
    chats.forEach(chat => {
      db.prepare('DELETE FROM messages WHERE chatId = ?').run(chat.id);
      db.prepare('DELETE FROM chats WHERE id = ?').run(chat.id);
    });

    // Удалить сообщения пользователя
    db.prepare('DELETE FROM messages WHERE senderId = ?').run(userId);

    // Удалить уведомления
    db.prepare('DELETE FROM notifications WHERE userId = ?').run(userId);

    // Удалить звонки
    db.prepare('DELETE FROM calls WHERE fromUserId = ? OR toUserId = ?').run(userId, userId);

    // Удалить E2E ключи
    db.prepare('DELETE FROM e2e_keys WHERE userId = ?').run(userId);

    // Удалить запросы в друзья
    db.prepare('DELETE FROM contact_requests WHERE fromUserId = ? OR toUserId = ?').run(userId, userId);

    // Удалить токены Yandex
    db.prepare('DELETE FROM yandex_tokens WHERE userId = ?').run(userId);

    // Удалить подписки push
    db.prepare('DELETE FROM push_subscriptions WHERE userId = ?').run(userId);

    // Удалить пользователя
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    res.json({
      success: true,
      message: 'Аккаунт успешно удалён'
    });
  } catch (error) {
    console.error('DeleteAccount error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении аккаунта' }
    });
  }
};
