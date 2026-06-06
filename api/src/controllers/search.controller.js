/**
 * Global Search Controller
 * Поиск по пользователям, чатам и сообщениям
 */

const { db } = require('../config/database');

// Глобальный поиск
exports.search = async (req, res) => {
  try {
    const { q, type = 'all', limit = 50 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Поисковый запрос должен быть минимум 2 символа' }
      });
    }

    const searchPattern = `%${q}%`;
    const results = {
      users: [],
      chats: [],
      messages: []
    };

    // Поиск пользователей
    if (type === 'all' || type === 'users') {
      const users = db.prepare(`
        SELECT id, displayName, fullName, avatar, email
        FROM users 
        WHERE displayName LIKE ? OR fullName LIKE ? OR email LIKE ?
        LIMIT ?
      `).all(searchPattern, searchPattern, searchPattern, parseInt(limit) / 3);

      results.users = users.map(u => ({
        id: u.id,
        displayName: u.displayName,
        fullName: u.fullName,
        avatar: u.avatar,
        email: u.email
      }));
    }

    // Поиск чатов
    if (type === 'all' || type === 'chats') {
      const chats = db.prepare(`
        SELECT c.id, c.type, c.name, c.avatar, c.createdBy
        FROM chats c
        WHERE c.type = 'group' AND (c.name LIKE ? OR c.description LIKE ?)
        AND ? IN (SELECT json_each.value FROM json_each(c.participants))
        LIMIT ?
      `).all(searchPattern, searchPattern, req.user.id, parseInt(limit) / 3);

      results.chats = chats.map(c => ({
        id: c.id,
        type: c.type,
        name: c.name,
        avatar: c.avatar,
        createdBy: c.createdBy
      }));
    }

    // Поиск сообщений
    if (type === 'all' || type === 'messages') {
      const messages = db.prepare(`
        SELECT m.id, m.chatId, m.senderId, m.content, m.type, m.createdAt,
               u.displayName as senderName
        FROM messages m
        JOIN users u ON m.senderId = u.id
        WHERE m.content LIKE ?
        AND m.chatId IN (SELECT id FROM chats WHERE ? IN (SELECT json_each.value FROM json_each(participants)))
        LIMIT ?
      `).all(searchPattern, req.user.id, parseInt(limit) / 3);

      results.messages = messages.map(m => ({
        id: m.id,
        chatId: m.chatId,
        senderId: m.senderId,
        senderName: m.senderName,
        content: m.content,
        type: m.type,
        createdAt: m.createdAt
      }));
    }

    const total = results.users.length + results.chats.length + results.messages.length;

    res.json({
      success: true,
      data: {
        ...results,
        total
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при поиске' }
    });
  }
};
