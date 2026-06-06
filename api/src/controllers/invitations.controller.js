/**
 * Invitations Controller
 * Пригласительные ссылки
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Получить список приглашений
exports.getInvitations = async (req, res) => {
  try {
    const { chatId, isActive } = req.query;

    let query = 'SELECT * FROM invitations WHERE invitedBy = ?';
    const params = [req.user.id];

    if (chatId) {
      query += ' AND chatId = ?';
      params.push(chatId);
    }

    if (isActive !== undefined) {
      query += ' AND isActive = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }

    query += ' ORDER BY createdAt DESC';

    const invitations = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: {
        invitations: invitations.map(inv => ({
          id: inv.id,
          code: inv.code,
          chatId: inv.chatId,
          maxUses: inv.maxUses,
          usedCount: inv.usedCount,
          expiresAt: inv.expiresAt,
          isPermanent: !!inv.isPermanent,
          isActive: !!inv.isActive,
          createdAt: inv.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetInvitations error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении приглашений' }
    });
  }
};

// Создать приглашение
exports.createInvitation = async (req, res) => {
  try {
    const { chatId, isPermanent, maxUses, expiresAt, message } = req.body;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID чата обязателен' }
      });
    }

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

    const invitationId = uuidv4();
    const code = generateInviteCode();
    const now = Date.now();

    db.prepare(`
      INSERT INTO invitations (id, code, chatId, invitedBy, maxUses, usedCount, expiresAt, isPermanent, isActive, createdAt)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, 1, ?)
    `).run(
      invitationId,
      code,
      chatId,
      req.user.id,
      isPermanent ? null : maxUses || 10,
      isPermanent ? null : expiresAt || null,
      isPermanent ? 1 : 0,
      now
    );

    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/${code}`;

    res.status(201).json({
      success: true,
      data: {
        id: invitationId,
        code,
        inviteUrl,
        chatId,
        maxUses: isPermanent ? null : maxUses,
        expiresAt: isPermanent ? null : expiresAt,
        isPermanent,
        usedCount: 0
      }
    });
  } catch (error) {
    console.error('CreateInvitation error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании приглашения' }
    });
  }
};

// Получить информацию о приглашении
exports.getInvitationInfo = async (req, res) => {
  try {
    const { code } = req.params;

    const invitation = db.prepare(`
      SELECT i.*, c.name as chatName, c.avatar as chatAvatar, c.type as chatType,
             u.displayName as invitedByName, u.avatar as invitedByAvatar
      FROM invitations i
      JOIN chats c ON i.chatId = c.id
      JOIN users u ON i.invitedBy = u.id
      WHERE i.code = ?
    `).get(code);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Приглашение не найдено' }
      });
    }

    if (!invitation.isActive || (!invitation.isPermanent && invitation.expiresAt < Date.now())) {
      return res.status(410).json({
        success: false,
        error: { code: 'INVITATION_EXPIRED', message: 'Приглашение истекло или отозвано' }
      });
    }

    if (invitation.maxUses && invitation.usedCount >= invitation.maxUses) {
      return res.status(410).json({
        success: false,
        error: { code: 'INVITATION_LIMIT_REACHED', message: 'Лимит использований достигнут' }
      });
    }

    res.json({
      success: true,
      data: {
        id: invitation.id,
        chatId: invitation.chatId,
        chatName: invitation.chatName,
        chatAvatar: invitation.chatAvatar,
        chatType: invitation.chatType,
        invitedByName: invitation.invitedByName,
        maxUses: invitation.maxUses,
        usedCount: invitation.usedCount,
        expiresAt: invitation.expiresAt,
        isPermanent: !!invitation.isPermanent
      }
    });
  } catch (error) {
    console.error('GetInvitationInfo error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении информации о приглашении' }
    });
  }
};

// Принять приглашение
exports.acceptInvitation = async (req, res) => {
  try {
    const { code } = req.params;

    const invitation = db.prepare('SELECT * FROM invitations WHERE code = ?').get(code);
    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Приглашение не найдено' }
      });
    }

    if (!invitation.isActive || (!invitation.isPermanent && invitation.expiresAt < Date.now())) {
      return res.status(410).json({
        success: false,
        error: { code: 'INVITATION_EXPIRED', message: 'Приглашение истекло' }
      });
    }

    if (invitation.maxUses && invitation.usedCount >= invitation.maxUses) {
      return res.status(410).json({
        success: false,
        error: { code: 'INVITATION_LIMIT_REACHED', message: 'Лимит использований достигнут' }
      });
    }

    const chat = db.prepare('SELECT participants FROM chats WHERE id = ?').get(invitation.chatId);
    const participants = JSON.parse(chat.participants);

    if (participants.includes(req.user.id)) {
      return res.status(409).json({
        success: false,
        error: { code: 'ALREADY_MEMBER', message: 'Вы уже участник этого чата' }
      });
    }

    // Добавить в чат
    participants.push(req.user.id);
    db.prepare('UPDATE chats SET participants = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(participants), Date.now(), invitation.chatId);

    // Обновить счётчик использований
    if (!invitation.isPermanent) {
      db.prepare('UPDATE invitations SET usedCount = usedCount + 1 WHERE id = ?').run(invitation.id);
    }

    res.status(201).json({
      success: true,
      data: {
        chatId: invitation.chatId,
        message: 'Вы присоединились к чату'
      }
    });
  } catch (error) {
    console.error('AcceptInvitation error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при принятии приглашения' }
    });
  }
};

// Отменить приглашение
exports.revokeInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;

    const invitation = db.prepare('SELECT * FROM invitations WHERE id = ?').get(invitationId);
    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Приглашение не найдено' }
      });
    }

    if (invitation.invitedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Можно отменять только свои приглашения' }
      });
    }

    db.prepare('UPDATE invitations SET isActive = 0 WHERE id = ?').run(invitationId);

    res.json({ success: true });
  } catch (error) {
    console.error('RevokeInvitation error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отмене приглашения' }
    });
  }
};

// Удалить приглашение
exports.deleteInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;

    const invitation = db.prepare('SELECT * FROM invitations WHERE id = ?').get(invitationId);
    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Приглашение не найдено' }
      });
    }

    if (invitation.invitedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Можно удалять только свои приглашения' }
      });
    }

    db.prepare('DELETE FROM invitations WHERE id = ?').run(invitationId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteInvitation error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении приглашения' }
    });
  }
};

// Генерация кода приглашения
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
