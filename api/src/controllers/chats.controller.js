/**
 * Chats Controller
 * Управление чатами
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Получить список чатов
exports.getChats = async (req, res) => {
  try {
    const { limit = 20, offset = 0, type, filter } = req.query;

    let query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM messages m WHERE m.chatId = c.id AND m.senderId != ? 
              AND m.id NOT IN (SELECT lastReadMessageId FROM json_each(c.members) WHERE json_each.value IS NOT NULL)) as unreadTotal
      FROM chats c
      WHERE ? IN (SELECT json_each.value FROM json_each(c.participants))
    `;

    const params = [req.user.id];

    if (type) {
      query += ' AND c.type = ?';
      params.push(type);
    }

    if (filter === 'favorite') {
      query += ` AND json_extract(c.isFavorite, '$."${req.user.id}"') = 1`;
    } else if (filter === 'pinned') {
      query += ` AND json_extract(c.pinned, '$."${req.user.id}"') = 1`;
    } else if (filter === 'unread') {
      query += ` AND (SELECT COUNT(*) FROM messages m WHERE m.chatId = c.id AND m.senderId != ? 
                AND m.id NOT IN (SELECT lastReadMessageId FROM json_each(c.members) WHERE json_each.value IS NOT NULL)) > 0`;
      params.push(req.user.id);
    }

    query += ' ORDER BY c.updatedAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const chats = db.prepare(query).all(...params);

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM chats 
      WHERE ? IN (SELECT json_each.value FROM json_each(participants))
    `).get(req.user.id).count;

    res.json({
      success: true,
      data: {
        chats: chats.map(chat => ({
          id: chat.id,
          type: chat.type,
          name: chat.name,
          avatar: chat.avatar,
          participants: JSON.parse(chat.participants),
          lastMessage: chat.lastMessage ? JSON.parse(chat.lastMessage) : null,
          unreadCount: JSON.parse(chat.unreadCount || '{}'),
          isFavorite: JSON.parse(chat.isFavorite || '{}')[req.user.id] || false,
          pinned: JSON.parse(chat.pinned || '{}')[req.user.id] || false,
          muted: JSON.parse(chat.muted || '{}')[req.user.id] || false,
          updatedAt: chat.updatedAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
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

// Получить информацию о чате
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    res.json({
      success: true,
      data: {
        id: chat.id,
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
        participants: participants,
        members: JSON.parse(chat.members || '{}'),
        adminIds: JSON.parse(chat.adminIds || '[]'),
        createdBy: chat.createdBy,
        description: chat.description,
        lastMessage: chat.lastMessage ? JSON.parse(chat.lastMessage) : null,
        unreadCount: JSON.parse(chat.unreadCount || '{}'),
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error('GetChatById error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении чата' }
    });
  }
};

// Создать чат
exports.createChat = async (req, res) => {
  try {
    const { type, participantIds, name, avatar, description, adminIds } = req.body;

    if (type === 'private') {
      if (!participantIds || participantIds.length !== 1) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Для приватного чата нужен один участник' }
        });
      }

      // Проверка существования чата между этими пользователями
      const existingChat = db.prepare(`
        SELECT id FROM chats 
        WHERE type = 'private' 
        AND json_length(participants) = 2
        AND ? IN (SELECT json_each.value FROM json_each(participants))
        AND ? IN (SELECT json_each.value FROM json_each(participants))
      `).get(req.user.id, participantIds[0]);

      if (existingChat) {
        return res.status(409).json({
          success: false,
          error: { code: 'CHAT_ALREADY_EXISTS', message: 'Чат с этим пользователем уже существует' }
        });
      }

      const allParticipants = JSON.stringify([req.user.id, participantIds[0]]);

      const chatId = uuidv4();
      const now = Date.now();

      db.prepare(`
        INSERT INTO chats (id, type, participants, createdBy, adminIds, createdAt, updatedAt)
        VALUES (?, 'private', ?, ?, ?, ?, ?)
      `).run(chatId, allParticipants, req.user.id, JSON.stringify([req.user.id]), now, now);

      res.status(201).json({
        success: true,
        data: {
          id: chatId,
          type: 'private',
          participants: [req.user.id, participantIds[0]],
          createdAt: now
        }
      });
    } else if (type === 'group') {
      if (!name) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Название группы обязательно' }
        });
      }

      const allParticipants = JSON.stringify([req.user.id, ...(participantIds || [])]);
      const allAdmins = JSON.stringify([req.user.id, ...(adminIds || [])]);
      const members = JSON.stringify({ [req.user.id]: { role: 'creator', joinedAt: Date.now() } });

      const chatId = uuidv4();
      const now = Date.now();

      db.prepare(`
        INSERT INTO chats (id, type, name, avatar, description, participants, members, adminIds, createdBy, createdAt, updatedAt)
        VALUES (?, 'group', ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(chatId, name, avatar || null, description || null, allParticipants, members, allAdmins, req.user.id, now, now);

      res.status(201).json({
        success: true,
        data: {
          id: chatId,
          type: 'group',
          name,
          participants: [req.user.id, ...(participantIds || [])],
          createdAt: now
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверный тип чата' }
      });
    }
  } catch (error) {
    console.error('CreateChat error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании чата' }
    });
  }
};

// Обновить чат
exports.updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name, avatar, description } = req.body;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const userRole = members[req.user.id]?.role;
    
    if (userRole !== 'creator' && userRole !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель или модератор могут обновлять чат' }
      });
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(chatId);

    db.prepare(`UPDATE chats SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateChat error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении чата' }
    });
  }
};

// Удалить/выйти из чата
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const userRole = members[req.user.id]?.role;

    if (chat.type === 'group' && userRole === 'creator') {
      // Создатель удаляет группу полностью
      db.prepare('DELETE FROM chats WHERE id = ?').run(chatId);
    } else {
      // Просто выход из чата
      const newParticipants = participants.filter(id => id !== req.user.id);
      db.prepare('UPDATE chats SET participants = ?, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(newParticipants), Date.now(), chatId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteChat error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении чата' }
    });
  }
};

// Добавить участника
exports.addMember = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId, role } = req.body;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const userRole = members[req.user.id]?.role;

    if (userRole !== 'creator' && userRole !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель или модератор могут добавлять участников' }
      });
    }

    if (!participants.includes(userId)) {
      participants.push(userId);
      db.prepare('UPDATE chats SET participants = ?, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(participants), Date.now(), chatId);
    }

    // Добавить в members с ролью
    members[userId] = {
      role: role || 'reader',
      joinedAt: Date.now()
    };

    db.prepare('UPDATE chats SET members = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(members), Date.now(), chatId);

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('AddMember error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при добавлении участника' }
    });
  }
};

// Удалить участника
exports.removeMember = async (req, res) => {
  try {
    const { chatId, userId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    const members = JSON.parse(chat.members || '{}');
    const requesterRole = members[req.user.id]?.role;

    if (requesterRole !== 'creator' && requesterRole !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель или модератор могут удалять участников' }
      });
    }

    const newParticipants = participants.filter(id => id !== userId);
    delete members[userId];

    db.prepare('UPDATE chats SET participants = ?, members = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(newParticipants), JSON.stringify(members), Date.now(), chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('RemoveMember error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении участника' }
    });
  }
};

// Изменить роль участника
exports.updateMemberRole = async (req, res) => {
  try {
    const { chatId, userId } = req.params;
    const { role } = req.body;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const requesterRole = members[req.user.id]?.role;

    if (requesterRole !== 'creator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель может менять роли' }
      });
    }

    if (!members[userId]) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Участник не найден в чате' }
      });
    }

    members[userId].role = role;

    db.prepare('UPDATE chats SET members = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(members), Date.now(), chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateMemberRole error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при изменении роли' }
    });
  }
};

// Получить список участников
exports.getMembers = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    const members = JSON.parse(chat.members || '{}');

    const memberList = participants.map(userId => {
      const user = db.prepare('SELECT id, displayName, avatar FROM users WHERE id = ?').get(userId);
      return {
        userId,
        role: members[userId]?.role || 'reader',
        joinedAt: members[userId]?.joinedAt || 0,
        displayName: user?.displayName,
        avatar: user?.avatar
      };
    });

    res.json({
      success: true,
      data: { members: memberList }
    });
  } catch (error) {
    console.error('GetMembers error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении участников' }
    });
  }
};

// Отметить чат как прочитанный
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { lastMessageId } = req.body;

    const chat = db.prepare('SELECT members FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    members[req.user.id] = {
      ...members[req.user.id],
      lastReadMessageId: lastMessageId || null,
      joinedAt: members[req.user.id]?.joinedAt || Date.now()
    };

    db.prepare('UPDATE chats SET members = ? WHERE id = ?').run(JSON.stringify(members), chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('MarkAsRead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отметке прочтения' }
    });
  }
};

// Добавить/удалить из избранного
exports.toggleFavorite = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { isFavorite } = req.body;

    const chat = db.prepare('SELECT isFavorite FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const favorites = JSON.parse(chat.isFavorite || '{}');
    favorites[req.user.id] = isFavorite;

    db.prepare('UPDATE chats SET isFavorite = ? WHERE id = ?').run(JSON.stringify(favorites), chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('ToggleFavorite error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении избранного' }
    });
  }
};

// Закрепить/открепить чат
exports.togglePin = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { pinned } = req.body;

    const chat = db.prepare('SELECT pinned FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const pins = JSON.parse(chat.pinned || '{}');
    pins[req.user.id] = pinned;

    db.prepare('UPDATE chats SET pinned = ? WHERE id = ?').run(JSON.stringify(pins), chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('TogglePin error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при закреплении чата' }
    });
  }
};

// Отключить/включить уведомления
exports.toggleMute = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { muted, muteUntil } = req.body;

    const chat = db.prepare('SELECT muted FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const mutes = JSON.parse(chat.muted || '{}');
    mutes[req.user.id] = muteUntil || muted;

    db.prepare('UPDATE chats SET muted = ? WHERE id = ?').run(JSON.stringify(mutes), chatId);

    res.json({ success: true });
  } catch (error) {
    console.error('ToggleMute error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при настройке уведомлений' }
    });
  }
};

// Отправить событие "печатает"
exports.typing = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { isTyping } = req.body;

    // TODO: Отправить WebSocket событие всем в чате
    console.log(`User ${req.user.id} is ${isTyping ? 'typing' : 'stopped typing'} in chat ${chatId}`);

    res.json({ success: true });
  } catch (error) {
    console.error('Typing error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отправке статуса печати' }
    });
  }
};

// Выйти из чата/группы
exports.leaveChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    const members = JSON.parse(chat.members || '{}');
    const adminIds = JSON.parse(chat.adminIds || '[]');

    // Проверка участника
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    // Если создатель группы - нельзя выйти, нужно передать права или удалить
    if (adminIds.includes(req.user.id) && members[req.user.id]?.role === 'creator') {
      return res.status(400).json({
        success: false,
        error: { code: 'CREATOR_CANNOT_LEAVE', message: 'Создатель не может выйти. Передайте права администратора или удалите группу.' }
      });
    }

    // Удалить участника из чата
    const newParticipants = participants.filter(id => id !== req.user.id);
    
    if (newParticipants.length === 0) {
      // Если чат пустой - удалить его
      db.prepare('DELETE FROM messages WHERE chatId = ?').run(chatId);
      db.prepare('DELETE FROM chats WHERE id = ?').run(chatId);
    } else {
      // Обновить участников
      db.prepare('UPDATE chats SET participants = ? WHERE id = ?').run(
        JSON.stringify(newParticipants),
        chatId
      );

      // Удалить из members
      const newMembers = { ...members };
      delete newMembers[req.user.id];
      db.prepare('UPDATE chats SET members = ? WHERE id = ?').run(
        JSON.stringify(newMembers),
        chatId
      );

      // Удалить настройки чата для пользователя
      const isFavorite = JSON.parse(chat.isFavorite || '{}');
      delete isFavorite[req.user.id];
      db.prepare('UPDATE chats SET isFavorite = ? WHERE id = ?').run(
        JSON.stringify(isFavorite),
        chatId
      );

      const pinned = JSON.parse(chat.pinned || '{}');
      delete pinned[req.user.id];
      db.prepare('UPDATE chats SET pinned = ? WHERE id = ?').run(
        JSON.stringify(pinned),
        chatId
      );

      const muted = JSON.parse(chat.muted || '{}');
      delete muted[req.user.id];
      db.prepare('UPDATE chats SET muted = ? WHERE id = ?').run(
        JSON.stringify(muted),
        chatId
      );
    }

    res.json({
      success: true,
      message: 'Вы вышли из чата'
    });
  } catch (error) {
    console.error('LeaveChat error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при выходе из чата' }
    });
  }
};
