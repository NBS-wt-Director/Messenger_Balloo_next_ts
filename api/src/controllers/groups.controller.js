/**
 * Groups Controller
 * Управление группами и ролями
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Создать группу
exports.createGroup = async (req, res) => {
  try {
    const { name, description, avatar, participantIds, adminIds, settings } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Название группы обязательно' }
      });
    }

    const chatId = uuidv4();
    const now = Date.now();

    const allParticipants = JSON.stringify([req.user.id, ...(participantIds || [])]);
    const allAdmins = JSON.stringify([req.user.id, ...(adminIds || [])]);
    const members = JSON.stringify({
      [req.user.id]: {
        role: 'creator',
        joinedAt: now
      }
    });

    db.prepare(`
      INSERT INTO chats (id, type, name, avatar, description, participants, members, adminIds, createdBy, createdAt, updatedAt)
      VALUES (?, 'group', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      chatId,
      name,
      avatar || null,
      description || null,
      allParticipants,
      members,
      allAdmins,
      req.user.id,
      now,
      now
    );

    // Добавить участников в чат
    if (participantIds) {
      for (const userId of participantIds) {
        if (userId !== req.user.id) {
          db.prepare('INSERT INTO contacts (id, userId, contactUserId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)')
            .run(uuidv4(), req.user.id, userId, now, now);
        }
      }
    }

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
  } catch (error) {
    console.error('CreateGroup error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании группы' }
    });
  }
};

// Получить информацию о группе
exports.getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ? AND type = \'group\'').get(groupId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'GROUP_NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этой группы' }
      });
    }

    const members = JSON.parse(chat.members || '{}');

    res.json({
      success: true,
      data: {
        id: chat.id,
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
        description: chat.description,
        participants,
        members: Object.entries(members).map(([userId, data]) => ({
          userId,
          role: data.role,
          joinedAt: data.joinedAt
        })),
        adminIds: JSON.parse(chat.adminIds || '[]'),
        createdBy: chat.createdBy,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error('GetGroup error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении информации о группе' }
    });
  }
};

// Обновить группу
exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, avatar, description } = req.body;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(groupId);
    if (!chat || chat.type !== 'group') {
      return res.status(404).json({
        success: false,
        error: { code: 'GROUP_NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const userRole = members[req.user.id]?.role;

    if (userRole !== 'creator' && userRole !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель или модератор могут обновлять группу' }
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
    values.push(groupId);

    db.prepare(`UPDATE chats SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateGroup error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении группы' }
    });
  }
};

// Удалить группу
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(groupId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'GROUP_NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const userRole = members[req.user.id]?.role;

    if (userRole !== 'creator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель может удалять группу' }
      });
    }

    db.prepare('DELETE FROM chats WHERE id = ?').run(groupId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteGroup error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении группы' }
    });
  }
};

// Обновить настройки группы
exports.updateSettings = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { onlyAdminsCanPost, onlyAdminsCanAddMembers, allowReadersToInvite } = req.body;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(groupId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'GROUP_NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const userRole = members[req.user.id]?.role;

    if (userRole !== 'creator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель может менять настройки' }
      });
    }

    const settings = JSON.parse(chat.settings || '{}');

    if (onlyAdminsCanPost !== undefined) {
      settings.onlyAdminsCanPost = onlyAdminsCanPost;
    }
    if (onlyAdminsCanAddMembers !== undefined) {
      settings.onlyAdminsCanAddMembers = onlyAdminsCanAddMembers;
    }
    if (allowReadersToInvite !== undefined) {
      settings.allowReadersToInvite = allowReadersToInvite;
    }

    db.prepare('UPDATE chats SET settings = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(settings), Date.now(), groupId);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateSettings error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении настроек' }
    });
  }
};

// Получить права участников
exports.getPermissions = async (req, res) => {
  try {
    const { groupId } = req.params;

    const chat = db.prepare('SELECT members FROM chats WHERE id = ?').get(groupId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'GROUP_NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const members = JSON.parse(chat.members || '{}');

    res.json({
      success: true,
      data: {
        members: Object.entries(members).map(([userId, data]) => ({
          userId,
          role: data.role,
          joinedAt: data.joinedAt
        }))
      }
    });
  } catch (error) {
    console.error('GetPermissions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении прав' }
    });
  }
};

// Изменить права участника
exports.updatePermissions = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { role } = req.body;

    const validRoles = ['creator', 'moderator', 'author', 'reader'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверная роль' }
      });
    }

    const chat = db.prepare('SELECT members FROM chats WHERE id = ?').get(groupId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'GROUP_NOT_FOUND', message: 'Группа не найдена' }
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
        error: { code: 'NOT_FOUND', message: 'Участник не найден' }
      });
    }

    members[userId].role = role;

    db.prepare('UPDATE chats SET members = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(members), Date.now(), groupId);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdatePermissions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при изменении прав' }
    });
  }
};

// Передать права создателя
exports.transferOwnership = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newOwnerId } = req.body;

    const chat = db.prepare('SELECT members FROM chats WHERE id = ?').get(groupId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'GROUP_NOT_FOUND', message: 'Группа не найдена' }
      });
    }

    const members = JSON.parse(chat.members || '{}');
    const requesterRole = members[req.user.id]?.role;

    if (requesterRole !== 'creator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только создатель может передавать права' }
      });
    }

    if (!members[newOwnerId]) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Новый владелец не найден в группе' }
      });
    }

    // Снять роль creator у текущего
    members[req.user.id].role = 'moderator';
    // Назначить creator новому
    members[newOwnerId].role = 'creator';

    db.prepare('UPDATE chats SET members = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(members), Date.now(), groupId);

    res.json({ success: true });
  } catch (error) {
    console.error('TransferOwnership error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при передаче прав' }
    });
  }
};
