/**
 * Bans Controller
 * Управление блокировками пользователей
 */

const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Получить все баны (admin)
exports.getBans = async (req, res) => {
  try {
    const { userId, active } = req.query;

    let query = `
      SELECT b.*, u.email as userEmail, u.displayName as userDisplayName,
             bannedUser.email as bannedByEmail, bannedUser.displayName as bannedByDisplayName
      FROM bans b
      LEFT JOIN users u ON b.userId = u.id
      LEFT JOIN users bannedUser ON b.bannedBy = bannedUser.id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ' AND b.userId = ?';
      params.push(userId);
    }
    if (active !== undefined) {
      if (active === 'true') {
        query += ' AND (b.expiresAt IS NULL OR b.expiresAt > ?)';
        params.push(Date.now());
      } else {
        query += ' AND (b.expiresAt IS NOT NULL AND b.expiresAt <= ?)';
        params.push(Date.now());
      }
    }

    query += ' ORDER BY b.createdAt DESC';

    const bans = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: {
        bans: bans.map(b => ({
          id: b.id,
          userId: b.userId,
          user: {
            id: b.userId,
            email: b.userEmail,
            displayName: b.userDisplayName
          },
          reason: b.reason,
          bannedBy: b.bannedBy,
          bannedByUser: {
            id: b.bannedBy,
            email: b.bannedByEmail,
            displayName: b.bannedByDisplayName
          },
          expiresAt: b.expiresAt,
          createdAt: b.createdAt,
          isActive: !b.expiresAt || b.expiresAt > Date.now()
        }))
      }
    });
  } catch (error) {
    console.error('GetBans error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении банов' }
    });
  }
};

// Получить свои баны
exports.getUserBans = async (req, res) => {
  try {
    const bans = db.prepare(`
      SELECT * FROM bans WHERE userId = ? AND (expiresAt IS NULL OR expiresAt > ?)
      ORDER BY createdAt DESC
    `).all(req.user.id, Date.now());

    res.json({
      success: true,
      data: {
        bans: bans.map(b => ({
          id: b.id,
          reason: b.reason,
          bannedBy: b.bannedBy,
          expiresAt: b.expiresAt,
          createdAt: b.createdAt,
          isPermanent: !b.expiresAt
        }))
      }
    });
  } catch (error) {
    console.error('GetUserBans error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении банов' }
    });
  }
};

// Забанить пользователя (admin)
exports.banUser = async (req, res) => {
  try {
    const { userId, reason, expiresAt } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'userId обязателен' }
      });
    }

    // Проверка, что пользователь существует
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    // Нельзя забанить супер-админа
    if (user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нельзя забанить супер-админа' }
      });
    }

    const id = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO bans (id, userId, reason, bannedBy, expiresAt, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, reason || '', req.user.id, expiresAt || null, now);

    res.status(201).json({
      success: true,
      data: { id, userId, reason, expiresAt, createdAt: now }
    });
  } catch (error) {
    console.error('BanUser error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при блокировке пользователя' }
    });
  }
};

// Разбанить пользователя (admin)
exports.unbanUser = async (req, res) => {
  try {
    const { banId } = req.params;

    const ban = db.prepare('SELECT id FROM bans WHERE id = ?').get(banId);
    if (!ban) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Бан не найден' }
      });
    }

    db.prepare('DELETE FROM bans WHERE id = ?').run(banId);

    res.json({ success: true });
  } catch (error) {
    console.error('UnbanUser error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при разблокировке' }
    });
  }
};

// Проверить, забанен ли пользователь
exports.checkBan = async (req, res) => {
  try {
    const { userId } = req.params;

    const ban = db.prepare(`
      SELECT * FROM bans WHERE userId = ? AND (expiresAt IS NULL OR expiresAt > ?)
    `).get(userId, Date.now());

    res.json({
      success: true,
      data: {
        isBanned: !!ban,
        ban: ban ? {
          id: ban.id,
          reason: ban.reason,
          expiresAt: ban.expiresAt,
          isPermanent: !ban.expiresAt
        } : null
      }
    });
  } catch (error) {
    console.error('CheckBan error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при проверке бана' }
    });
  }
};
