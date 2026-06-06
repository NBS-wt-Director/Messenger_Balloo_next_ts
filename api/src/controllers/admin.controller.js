/**
 * Admin Controller
 * Администрирование пользователями и системой
 */

const { db } = require('../config/database');
const callRecordingService = require('../services/call-recording.service');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Получить список пользователей (админ)
exports.getUsers = async (req, res) => {
  try {
    const { limit = 100, offset = 0, search, isAdmin } = req.query;

    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (displayName LIKE ? OR email LIKE ?)';
      const pattern = `%${search}%`;
      params.push(pattern, pattern);
    }

    if (isAdmin !== undefined) {
      query += ' AND isAdmin = ?';
      params.push(isAdmin === 'true' ? 1 : 0);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = db.prepare(query).all(...params);

    const total = db.prepare('SELECT COUNT(*) as count FROM users WHERE 1=1').get().count;

    res.json({
      success: true,
      data: {
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          displayName: u.displayName,
          fullName: u.fullName,
          avatar: u.avatar,
          provider: u.provider,
          isAdmin: !!u.isAdmin,
          isSuperAdmin: !!u.isSuperAdmin,
          adminRoles: JSON.parse(u.adminRoles || '[]'),
          createdAt: u.createdAt,
          lastSeen: u.lastSeen
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    console.error('GetUsers error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении пользователей' }
    });
  }
};

// Получить информацию о пользователе
exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        fullName: user.fullName,
        avatar: user.avatar,
        provider: user.provider,
        yandexId: user.yandexId,
        settings: JSON.parse(user.settings || '{}'),
        familyRelations: JSON.parse(user.familyRelations || '[]'),
        isAdmin: !!user.isAdmin,
        isSuperAdmin: !!user.isSuperAdmin,
        adminRoles: JSON.parse(user.adminRoles || '[]'),
        adminSince: user.adminSince,
        pushTokens: JSON.parse(user.pushTokens || '[]'),
        createdAt: user.createdAt,
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    console.error('GetUser error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении пользователя' }
    });
  }
};

// Изменить роль пользователя
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin, isSuperAdmin, adminRoles } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    const updates = [];
    const values = [];

    if (isAdmin !== undefined) {
      updates.push('isAdmin = ?');
      values.push(isAdmin ? 1 : 0);
      if (isAdmin && !user.isAdmin) {
        updates.push('adminSince = ?');
        values.push(Date.now());
      }
    }

    if (isSuperAdmin !== undefined) {
      // Проверка - только супер-админ может назначать супер-админов
      if (!req.user.isSuperAdmin && isSuperAdmin) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Только супер-админ может назначать супер-админов' }
        });
      }
      updates.push('isSuperAdmin = ?');
      values.push(isSuperAdmin ? 1 : 0);
    }

    if (adminRoles !== undefined) {
      updates.push('adminRoles = ?');
      values.push(JSON.stringify(adminRoles));
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(userId);

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateUserRole error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при изменении роли' }
    });
  }
};

// Заблокировать/удалить пользователя
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    if (user.isSuperAdmin && !req.user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нельзя блокировать супер-админов' }
      });
    }

    // TODO: Реализовать блокировку (удаление сессий, пометка как заблокированного)
    // Пока просто удаляем сессии
    db.prepare('DELETE FROM sessions WHERE userId = ?').run(userId);

    res.json({ success: true });
  } catch (error) {
    console.error('BlockUser error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при блокировке пользователя' }
    });
  }
};

// Получить список чатов
exports.getChats = async (req, res) => {
  try {
    const { limit = 100, offset = 0, type } = req.query;

    let query = 'SELECT * FROM chats';
    const params = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const chats = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: {
        chats: chats.map(c => ({
          id: c.id,
          type: c.type,
          name: c.name,
          participants: JSON.parse(c.participants),
          adminIds: JSON.parse(c.adminIds || '[]'),
          createdBy: c.createdBy,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('GetChats error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении чатов' }
    });
  }
};

// Получить аналитику
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalChats = db.prepare('SELECT COUNT(*) as count FROM chats').get().count;
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get().count;
    const totalAdmins = db.prepare('SELECT COUNT(*) as count FROM users WHERE isAdmin = 1').get().count;

    // Активные пользователи за сегодня
    const today = Date.now() - (24 * 60 * 60 * 1000);
    const activeToday = db.prepare('SELECT COUNT(*) as count FROM users WHERE lastSeen > ?').get(today).count;

    // Новые пользователи за сегодня
    const newToday = db.prepare('SELECT COUNT(*) as count FROM users WHERE createdAt > ?').get(today).count;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers: activeToday,
        totalChats,
        totalMessages,
        totalAdmins,
        dailyActiveUsers: activeToday,
        newUsersToday: newToday
      }
    });
  } catch (error) {
    console.error('GetAnalytics error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении аналитики' }
    });
  }
};

// Получить список версий
exports.getVersions = async (req, res) => {
  try {
    const versions = db.prepare('SELECT * FROM versions ORDER BY createdAt DESC').all();

    res.json({
      success: true,
      data: {
        versions: versions.map(v => ({
          id: v.id,
          platform: v.platform,
          version: v.version,
          minVersion: v.minVersion,
          updateUrl: v.updateUrl,
          releaseNotes: v.releaseNotes,
          isForceUpdate: !!v.isForceUpdate,
          createdAt: v.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetVersions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении версий' }
    });
  }
};

// Добавить версию
exports.addVersion = async (req, res) => {
  try {
    const { platform, version, minVersion, updateUrl, releaseNotes, isForceUpdate } = req.body;

    if (!platform || !version) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Платформа и версия обязательны' }
      });
    }

    const id = require('uuid').v4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO versions (id, platform, version, minVersion, updateUrl, releaseNotes, isForceUpdate, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, platform, version, minVersion || null, updateUrl || null, releaseNotes || null, isForceUpdate ? 1 : 0, now);

    res.status(201).json({
      success: true,
      data: { id, platform, version, createdAt: now }
    });
  } catch (error) {
    console.error('AddVersion error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при добавлении версии' }
    });
  }
};

// Очистка старых записей звонков
exports.cleanupRecordings = async (req, res) => {
  try {
    const { days = 30 } = req.body;

    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Должно быть от 1 до 365 дней' }
      });
    }

    const recordingsBefore = callRecordingService.getAllRecordings();
    const initialCount = recordingsBefore.length;

    // Запустить очистку
    callRecordingService.cleanupOldRecordings(days);

    const recordingsAfter = callRecordingService.getAllRecordings();
    const deletedCount = initialCount - recordingsAfter.length;

    logger.info(`Admin cleanup: deleted ${deletedCount} recordings older than ${days} days`);

    res.json({
      success: true,
      data: {
        deletedCount,
        remainingCount: recordingsAfter.length,
        cleanedOlderThan: days
      }
    });
  } catch (error) {
    console.error('CleanupRecordings error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при очистке записей' }
    });
  }
};

// Получить информацию о записях звонков
exports.getRecordingsInfo = async (req, res) => {
  try {
    const recordings = callRecordingService.getAllRecordings();

    const totalSize = recordings.reduce((sum, r) => sum + r.size, 0);

    res.json({
      success: true,
      data: {
        totalRecordings: recordings.length,
        totalSizeBytes: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        recordings: recordings.map(r => ({
          filename: r.filename,
          size: r.size,
          sizeMB: (r.size / (1024 * 1024)).toFixed(2),
          createdAt: r.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetRecordingsInfo error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении информации о записях' }
    });
  }
};

// ============================================
// Управление сессиями пользователя
// ============================================

// Получить сессии пользователя
exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = db.prepare(`
      SELECT id, userId, refreshToken, platform, deviceId, pushToken, lastActive, expiresAt
      FROM sessions WHERE userId = ?
      ORDER BY lastActive DESC
    `).all(userId);

    res.json({
      success: true,
      data: {
        userId,
        sessions: sessions.map(s => ({
          id: s.id,
          platform: s.platform,
          deviceId: s.deviceId,
          pushToken: s.pushToken,
          lastActive: s.lastActive,
          expiresAt: s.expiresAt
        }))
      }
    });
  } catch (error) {
    console.error('GetUserSessions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении сессий' }
    });
  }
};

// Завершить сессию пользователя
exports.terminateSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    const session = db.prepare('SELECT id FROM sessions WHERE id = ? AND userId = ?').get(sessionId, userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Сессия не найдена' }
      });
    }

    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);

    res.json({ success: true });
  } catch (error) {
    console.error('TerminateSession error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при завершении сессии' }
    });
  }
};

// Завершить все сессии пользователя
exports.terminateAllSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    db.prepare('DELETE FROM sessions WHERE userId = ?').run(userId);

    res.json({ success: true });
  } catch (error) {
    console.error('TerminateAllSessions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при завершении сессий' }
    });
  }
};

// ============================================
// Управление устройствами пользователя
// ============================================

// Получить устройства пользователя
exports.getUserDevices = async (req, res) => {
  try {
    const { userId } = req.params;

    const devices = db.prepare(`
      SELECT id, userId, platform, deviceId, pushToken, deviceName, lastActive, createdAt
      FROM devices WHERE userId = ?
      ORDER BY lastActive DESC
    `).all(userId);

    res.json({
      success: true,
      data: {
        userId,
        devices: devices.map(d => ({
          id: d.id,
          platform: d.platform,
          deviceId: d.deviceId,
          deviceName: d.deviceName,
          pushToken: d.pushToken,
          lastActive: d.lastActive,
          createdAt: d.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetUserDevices error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении устройств' }
    });
  }
};

// Удалить устройство пользователя
exports.deleteUserDevice = async (req, res) => {
  try {
    const { userId, deviceId } = req.params;

    const device = db.prepare('SELECT id FROM devices WHERE id = ? AND userId = ?').get(deviceId, userId);
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Устройство не найдено' }
      });
    }

    db.prepare('DELETE FROM devices WHERE id = ?').run(deviceId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteUserDevice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении устройства' }
    });
  }
};

// ============================================
// Управление E2E ключами
// ============================================

// Получить E2E ключи пользователя
exports.getUserE2EKeys = async (req, res) => {
  try {
    const { userId } = req.params;

    const keys = db.prepare(`
      SELECT id, userId, deviceId, publicKey, createdAt, expiresAt
      FROM e2e_keys
      WHERE userId = ? AND expiresAt > ?
      ORDER BY createdAt DESC
    `).all(userId, Date.now());

    res.json({
      success: true,
      data: {
        userId,
        keys: keys.map(k => ({
          id: k.id,
          deviceId: k.deviceId,
          publicKey: k.publicKey,
          createdAt: k.createdAt,
          expiresAt: k.expiresAt
        }))
      }
    });
  } catch (error) {
    console.error('GetUserE2EKeys error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении ключей' }
    });
  }
};

// Удалить E2E ключ пользователя
exports.deleteUserE2EKey = async (req, res) => {
  try {
    const { userId, keyId } = req.params;

    const key = db.prepare('SELECT id FROM e2e_keys WHERE id = ? AND userId = ?').get(keyId, userId);
    if (!key) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Ключ не найден' }
      });
    }

    db.prepare('DELETE FROM e2e_keys WHERE id = ?').run(keyId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteUserE2EKey error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении ключа' }
    });
  }
};

// ============================================
// Управление сообщениями
// ============================================

// Поиск сообщений
exports.searchMessages = async (req, res) => {
  try {
    const { search, userId, chatId, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT m.*, 
             u.displayName as senderName, u.avatar as senderAvatar,
             c.name as chatName, c.type as chatType
      FROM messages m
      LEFT JOIN users u ON m.senderId = u.id
      LEFT JOIN chats c ON m.chatId = c.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ' AND m.content LIKE ?';
      params.push(`%${search}%`);
    }

    if (userId) {
      query += ' AND m.senderId = ?';
      params.push(userId);
    }

    if (chatId) {
      query += ' AND m.chatId = ?';
      params.push(chatId);
    }

    query += ' ORDER BY m.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const messages = db.prepare(query).all(...params);

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM messages
      WHERE 1=1
    `).get().count;

    res.json({
      success: true,
      data: {
        messages: messages.map(m => ({
          id: m.id,
          chatId: m.chatId,
          chat: {
            id: m.chatId,
            name: m.chatName,
            type: m.chatType
          },
          senderId: m.senderId,
          sender: {
            id: m.senderId,
            displayName: m.senderName,
            avatar: m.senderAvatar
          },
          type: m.type,
          content: m.content,
          attachmentId: m.attachmentId,
          readBy: JSON.parse(m.readBy || '[]'),
          reactions: JSON.parse(m.reactions || '{}'),
          status: m.status,
          isEdited: !!m.edited,
          editedAt: m.editedAt,
          createdAt: m.createdAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    console.error('SearchMessages error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при поиске сообщений' }
    });
  }
};

// Удалить сообщение
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Сообщение не найдено' }
      });
    }

    // Полное удаление
    db.prepare('DELETE FROM messages WHERE id = ?').run(messageId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteMessage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении сообщения' }
    });
  }
};

// ============================================
// Управление чатом
// ============================================

// Получить информацию о чате (расширенная)
exports.getChatDetails = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    const members = JSON.parse(chat.members || '{}');
    const participantsWithInfo = participants.map(id => {
      const user = db.prepare('SELECT id, displayName, avatar, lastSeen FROM users WHERE id = ?').get(id);
      return {
        id,
        displayName: user?.displayName,
        avatar: user?.avatar,
        lastSeen: user?.lastSeen,
        role: members[id]?.role || 'reader',
        joinedAt: members[id]?.joinedAt || 0
      };
    });

    const messageCount = db.prepare('SELECT COUNT(*) as count FROM messages WHERE chatId = ?').get(chatId).count;

    res.json({
      success: true,
      data: {
        id: chat.id,
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
        description: chat.description,
        participants: participantsWithInfo,
        adminIds: JSON.parse(chat.adminIds || '[]'),
        createdBy: chat.createdBy,
        lastMessage: chat.lastMessage ? JSON.parse(chat.lastMessage) : null,
        messageCount,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error('GetChatDetails error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении деталей чата' }
    });
  }
};

// Удалить чат
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Чат не найден' }
      });
    }

    // Удалить все сообщения чата
    db.prepare('DELETE FROM messages WHERE chatId = ?').run(chatId);

    // Удалить чат
    db.prepare('DELETE FROM chats WHERE id = ?').run(chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteChat error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении чата' }
    });
  }
};

// Удалить чат (админ) - с защитой от удаления корпоративных групп
exports.deleteChatAdmin = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Чат не найден' }
      });
    }

    // Защита от удаления корпоративных групп
    if (chat.type === 'internal_group') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Корпоративные группы неудаляемы' }
      });
    }

    // Удалить все сообщения чата
    db.prepare('DELETE FROM messages WHERE chatId = ?').run(chatId);

    // Удалить чат
    db.prepare('DELETE FROM chats WHERE id = ?').run(chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteChatAdmin error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении чата' }
    });
  }
};

// ============================================
// Системная информация
// ============================================

// Получить системную информацию
exports.getSystemInfo = async (req, res) => {
  try {
    const nodeVersion = process.version;
    const platform = process.platform;
    const arch = process.arch;
    const uptime = process.uptime();

    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalChats = db.prepare('SELECT COUNT(*) as count FROM chats').get().count;
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get().count;
    const totalAdmins = db.prepare('SELECT COUNT(*) as count FROM users WHERE isAdmin = 1').get().count;

    const today = Date.now() - (24 * 60 * 60 * 1000);
    const activeToday = db.prepare('SELECT COUNT(*) as count FROM users WHERE lastSeen > ?').get(today).count;
    const newToday = db.prepare('SELECT COUNT(*) as count FROM users WHERE createdAt > ?').get(today).count;

    const totalRecordings = callRecordingService.getAllRecordings().length;

    res.json({
      success: true,
      data: {
        server: {
          nodeVersion,
          platform,
          arch,
          uptime: Math.floor(uptime),
          uptimeFormatted: formatUptime(uptime)
        },
        database: {
          totalUsers,
          totalChats,
          totalMessages,
          totalAdmins,
          activeUsersToday: activeToday,
          newUsersToday: newToday
        },
        recordings: {
          totalRecordings
        },
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('GetSystemInfo error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении системной информации' }
    });
  }
};

// ============================================
// Управление версиями (дополнительные функции)
// ============================================

// Редактировать версию
exports.updateVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    const { platform, version, minVersion, updateUrl, releaseNotes, isForceUpdate } = req.body;

    const existing = db.prepare('SELECT * FROM versions WHERE id = ?').get(versionId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Версия не найдена' }
      });
    }

    const updates = [];
    const values = [];

    if (platform !== undefined) {
      updates.push('platform = ?');
      values.push(platform);
    }
    if (version !== undefined) {
      updates.push('version = ?');
      values.push(version);
    }
    if (minVersion !== undefined) {
      updates.push('minVersion = ?');
      values.push(minVersion);
    }
    if (updateUrl !== undefined) {
      updates.push('updateUrl = ?');
      values.push(updateUrl);
    }
    if (releaseNotes !== undefined) {
      updates.push('releaseNotes = ?');
      values.push(releaseNotes);
    }
    if (isForceUpdate !== undefined) {
      updates.push('isForceUpdate = ?');
      values.push(isForceUpdate ? 1 : 0);
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(versionId);

    db.prepare(`UPDATE versions SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateVersion error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении версии' }
    });
  }
};

// Удалить версию
exports.deleteVersion = async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = db.prepare('SELECT id FROM versions WHERE id = ?').get(versionId);
    if (!version) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Версия не найдена' }
      });
    }

    db.prepare('DELETE FROM versions WHERE id = ?').run(versionId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteVersion error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении версии' }
    });
  }
};

// ============================================
// Управление пользователями (дополнительные функции)
// ============================================

// Генерация случайного пароля
function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Вспомогательная функция форматирования uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// ============================================
// Управление пользователями (дополнительные функции)
// ============================================

// Сбросить пароль пользователя (админ)
exports.resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    if (user.provider !== 'email') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROVIDER', message: 'Пользователь использует OAuth, нельзя сбросить пароль' }
      });
    }

    if (newPassword && newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Пароль должен быть минимум 8 символов' }
      });
    }

    // Если новый пароль не указан, генерируем случайный
    const finalPassword = newPassword || generateRandomPassword();
    const passwordHash = await bcrypt.hash(finalPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    db.prepare('UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?')
      .run(passwordHash, Date.now(), userId);

    res.json({
      success: true,
      data: {
        newPassword: newPassword ? null : finalPassword // Показываем только сгенерированный пароль
      }
    });
  } catch (error) {
    console.error('ResetUserPassword error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при сбросе пароля' }
    });
  }
};

// Получить статистику пользователей по периодам
exports.getUserStatsByPeriod = async (req, res) => {
  try {
    const { period = 'week' } = req.query; // 'day', 'week', 'month'

    let daysAgo = 7;
    if (period === 'day') daysAgo = 1;
    if (period === 'month') daysAgo = 30;

    const cutoffDate = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

    // Новые пользователи по дням
    const newUsersByDay = db.prepare(`
      SELECT 
        date(createdAt / 1000, 'unixepoch') as date,
        COUNT(*) as count
      FROM users
      WHERE createdAt > ?
      GROUP BY date(createdAt / 1000, 'unixepoch')
      ORDER BY date ASC
    `).all(cutoffDate);

    // Активные пользователи по дням
    const activeUsersByDay = db.prepare(`
      SELECT 
        date(lastSeen / 1000, 'unixepoch') as date,
        COUNT(*) as count
      FROM users
      WHERE lastSeen > ?
      GROUP BY date(lastSeen / 1000, 'unixepoch')
      ORDER BY date ASC
    `).all(cutoffDate);

    res.json({
      success: true,
      data: {
        period,
        newUsersByDay: newUsersByDay.map(r => ({ date: r.date, count: r.count })),
        activeUsersByDay: activeUsersByDay.map(r => ({ date: r.date, count: r.count }))
      }
    });
  } catch (error) {
    console.error('GetUserStatsByPeriod error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении статистики' }
    });
  }
};

// ============================================
// Internal Chat (NBS w-t корпоративный чат)
// ============================================

// Получить список корпоративных групп (только для админов)
exports.getInternalChatGroups = async (req, res) => {
  try {
    const groups = db.prepare(`
      SELECT * FROM chats 
      WHERE type = 'internal_group' 
      ORDER BY createdAt DESC
    `).all();

    res.json({
      success: true,
      data: {
        groups: groups.map(g => ({
          id: g.id,
          name: g.name,
          description: g.description,
          participants: JSON.parse(g.participants),
          adminIds: JSON.parse(g.adminIds || '[]'),
          createdBy: g.createdBy,
          createdAt: g.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetInternalChatGroups error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении групп' }
    });
  }
};

// Создать корпоративную группу (только директор/super-admin)
exports.createInternalChatGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;

    if (!req.user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только супер-админ может создавать корпоративные группы' }
      });
    }

    if (!name || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Название и участники обязательны' }
      });
    }

    const id = require('uuid').v4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO chats (id, type, name, description, participants, adminIds, createdBy, createdAt, updatedAt)
      VALUES (?, 'internal_group', ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, description || '', JSON.stringify(memberIds), JSON.stringify([req.user.id]), req.user.id, now, now);

    res.status(201).json({
      success: true,
      data: { id, name, createdAt: now }
    });
  } catch (error) {
    console.error('CreateInternalChatGroup error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании группы' }
    });
  }
};

// Добавить участников в корпоративную группу
exports.addInternalChatMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body;

    if (!req.user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только супер-админ может добавлять участников' }
      });
    }

    const group = db.prepare('SELECT * FROM chats WHERE id = ? AND type = ?').get(groupId, 'internal_group');
    if (!group) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const participants = JSON.parse(group.participants);
    const newMembers = memberIds.filter(id => !participants.includes(id));
    
    if (newMembers.length > 0) {
      participants.push(...newMembers);
      db.prepare('UPDATE chats SET participants = ?, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(participants), Date.now(), groupId);
    }

    res.json({ success: true, data: { addedCount: newMembers.length } });
  } catch (error) {
    console.error('AddInternalChatMembers error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при добавлении участников' }
    });
  }
};

// Удалить участника из корпоративной группы
exports.removeInternalChatMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    if (!req.user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только супер-админ может удалять участников' }
      });
    }

    const group = db.prepare('SELECT * FROM chats WHERE id = ? AND type = ?').get(groupId, 'internal_group');
    if (!group) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const participants = JSON.parse(group.participants);
    const filtered = participants.filter(id => id !== userId);
    
    db.prepare('UPDATE chats SET participants = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(filtered), Date.now(), groupId);

    res.json({ success: true });
  } catch (error) {
    console.error('RemoveInternalChatMember error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении участника' }
    });
  }
};

// ============================================
// Support System (Техподдержка)
// ============================================

// Получить список тикетов поддержки
exports.getSupportTickets = async (req, res) => {
  try {
    const { status, priority, assignedTo, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM support_tickets WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (assignedTo) {
      query += ' AND assignedTo = ?';
      params.push(assignedTo);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const tickets = db.prepare(query).all(...params);

    const total = db.prepare('SELECT COUNT(*) as count FROM support_tickets WHERE 1=1').get().count;

    res.json({
      success: true,
      data: {
        tickets: tickets.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          userId: t.userId,
          assignedTo: t.assignedTo,
          resolution: t.resolution,
          createdAt: t.createdAt,
          processedAt: t.processedAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    console.error('GetSupportTickets error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении тикетов' }
    });
  }
};

// Получить тикет поддержки
exports.getSupportTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Тикет не найден' }
      });
    }

    // Получить сообщения тикета
    const messages = db.prepare('SELECT * FROM support_messages WHERE ticketId = ? ORDER BY createdAt ASC').all(ticketId);

    res.json({
      success: true,
      data: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        userId: ticket.userId,
        assignedTo: ticket.assignedTo,
        resolution: ticket.resolution,
        createdAt: ticket.createdAt,
        processedAt: ticket.processedAt,
        messages: messages.map(m => ({
          id: m.id,
          ticketId: m.ticketId,
          senderId: m.senderId,
          content: m.content,
          createdAt: m.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetSupportTicket error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении тикета' }
    });
  }
};

// Создать тикет поддержки
exports.createSupportTicket = async (req, res) => {
  try {
    const { title, description, priority = 'medium', userId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Заголовок и описание обязательны' }
      });
    }

    const id = require('uuid').v4();
    const now = Date.now();
    const requesterId = userId || req.user.id;

    db.prepare(`
      INSERT INTO support_tickets (id, title, description, status, priority, userId, assignedTo, createdAt, processedAt)
      VALUES (?, ?, ?, 'open', ?, ?, NULL, ?, ?)
    `).run(id, title, description, priority, requesterId, now, now);

    res.status(201).json({
      success: true,
      data: { id, title, status: 'open', createdAt: now }
    });
  } catch (error) {
    console.error('CreateSupportTicket error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании тикета' }
    });
  }
};

// Обновить тикет поддержки
exports.updateSupportTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, priority, assignedTo, resolution } = req.body;

    const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Тикет не найден' }
      });
    }

    const updates = [];
    const values = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
      if (status === 'resolved' || status === 'closed') {
        updates.push('processedAt = ?');
        values.push(Date.now());
      }
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    if (assignedTo !== undefined) {
      updates.push('assignedTo = ?');
      values.push(assignedTo);
    }
    if (resolution !== undefined) {
      updates.push('resolution = ?');
      values.push(resolution);
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(ticketId);

    db.prepare(`UPDATE support_tickets SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateSupportTicket error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении тикета' }
    });
  }
};

// Добавить сообщение в тикет
exports.addSupportMessage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Сообщение обязательно' }
      });
    }

    const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Тикет не найден' }
      });
    }

    const id = require('uuid').v4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO support_messages (id, ticketId, senderId, content, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, ticketId, req.user.id, content, now);

    res.status(201).json({
      success: true,
      data: { id, ticketId, senderId: req.user.id, content, createdAt: now }
    });
  } catch (error) {
    console.error('AddSupportMessage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при добавлении сообщения' }
    });
  }
};

// Получить сотрудников техподдержки
exports.getSupportStaff = async (req, res) => {
  try {
    const staff = db.prepare(`
      SELECT id, email, displayName, avatar, adminRoles 
      FROM users 
      WHERE isAdmin = 1 AND adminRoles LIKE '%support%'
      ORDER BY displayName ASC
    `).all();

    res.json({
      success: true,
      data: {
        staff: staff.map(s => ({
          id: s.id,
          email: s.email,
          displayName: s.displayName,
          avatar: s.avatar,
          adminRoles: JSON.parse(s.adminRoles || '[]')
        }))
      }
    });
  } catch (error) {
    console.error('GetSupportStaff error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении сотрудников' }
    });
  }
};
