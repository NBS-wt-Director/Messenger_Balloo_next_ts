/**
 * Contacts Controller
 * Управление контактами
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Получить список контактов
exports.getContacts = async (req, res) => {
  try {
    const { search, isFavorite, limit = 100, offset = 0 } = req.query;

    let query = `
      SELECT c.*, u.displayName, u.avatar, u.lastSeen, u.publicKey, u.isOnline
      FROM contacts c
      LEFT JOIN users u ON c.contactUserId = u.id
      WHERE c.userId = ? AND c.isBlocked = 0
    `;

    const params = [req.user.id];

    if (search) {
      query += ' AND (u.displayName LIKE ? OR u.email LIKE ?)';
      const pattern = `%${search}%`;
      params.push(pattern, pattern);
    }

    if (isFavorite !== undefined) {
      query += ' AND c.isFavorite = ?';
      params.push(isFavorite === 'true' ? 1 : 0);
    }

    query += ' ORDER BY c.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const contacts = db.prepare(query).all(...params);

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM contacts c
      WHERE c.userId = ? AND c.isBlocked = 0
    `).get(req.user.id).count;

    res.json({
      success: true,
      data: {
        contacts: contacts.map(c => ({
          id: c.id,
          contactUserId: c.contactUserId,
          displayName: c.displayName || c.displayName,
          email: c.email,
          avatar: c.avatar,
          lastSeen: c.lastSeen,
          publicKey: c.publicKey,
          isFavorite: !!c.isFavorite,
          createdAt: c.createdAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
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

// Добавить контакт
exports.addContact = async (req, res) => {
  try {
    const { userId, displayName } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID пользователя обязателен' }
      });
    }

    // Проверить существует ли пользователь
    const user = db.prepare('SELECT id, displayName, avatar FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Нельзя добавить себя в контакты' }
      });
    }

    // Проверить не добавлен ли уже
    const existing = db.prepare('SELECT id FROM contacts WHERE userId = ? AND contactUserId = ?').get(req.user.id, userId);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONTACT_ALREADY_EXISTS', message: 'Контакт уже добавлен' }
      });
    }

    const contactId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO contacts (id, userId, contactUserId, displayName, avatar, email, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      contactId,
      req.user.id,
      userId,
      displayName || user.displayName,
      user.avatar,
      user.email,
      now,
      now
    );

    res.status(201).json({
      success: true,
      data: {
        id: contactId,
        contactUserId: userId,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: now
      }
    });
  } catch (error) {
    console.error('AddContact error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при добавлении контакта' }
    });
  }
};

// Удалить контакт
exports.removeContact = async (req, res) => {
  try {
    const { userId } = req.params;

    const contact = db.prepare('SELECT id FROM contacts WHERE userId = ? AND contactUserId = ?').get(req.user.id, userId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Контакт не найден' }
      });
    }

    db.prepare('DELETE FROM contacts WHERE id = ?').run(contact.id);

    res.json({ success: true });
  } catch (error) {
    console.error('RemoveContact error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении контакта' }
    });
  }
};

// Добавить/удалить из избранного
exports.toggleFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isFavorite } = req.body;

    const contact = db.prepare('SELECT id FROM contacts WHERE userId = ? AND contactUserId = ?').get(req.user.id, userId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Контакт не найден' }
      });
    }

    db.prepare('UPDATE contacts SET isFavorite = ?, updatedAt = ? WHERE id = ?')
      .run(isFavorite ? 1 : 0, Date.now(), contact.id);

    res.json({ success: true });
  } catch (error) {
    console.error('ToggleFavorite error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении избранного' }
    });
  }
};

// Заблокировать/разблокировать
exports.toggleBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const contact = db.prepare('SELECT id FROM contacts WHERE userId = ? AND contactUserId = ?').get(req.user.id, userId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Контакт не найден' }
      });
    }

    db.prepare('UPDATE contacts SET isBlocked = ?, updatedAt = ? WHERE id = ?')
      .run(isBlocked ? 1 : 0, Date.now(), contact.id);

    res.json({ success: true });
  } catch (error) {
    console.error('ToggleBlock error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при блокировке контакта' }
    });
  }
};

// Получить запросы в друзья
exports.getRequests = async (req, res) => {
  try {
    const { type } = req.query; // 'received' | 'sent'

    let query = `
      SELECT cr.*, u.displayName, u.avatar
      FROM contact_requests cr
      LEFT JOIN users u ON cr.fromUserId = u.id
      WHERE 
    `;

    const params = [];

    if (type === 'received') {
      query += 'cr.toUserId = ?';
      params.push(req.user.id);
    } else if (type === 'sent') {
      query += 'cr.fromUserId = ?';
      params.push(req.user.id);
    } else {
      // Получить все
      query += '1=1';
    }

    query += ' AND cr.status = "pending" ORDER BY cr.createdAt DESC';

    const requests = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: {
        requests: requests.map(r => ({
          id: r.id,
          fromUserId: r.fromUserId,
          fromUser: {
            id: r.fromUserId,
            displayName: r.displayName,
            avatar: r.avatar
          },
          toUserId: r.toUserId,
          message: r.message,
          status: r.status,
          createdAt: r.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetRequests error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении запросов' }
    });
  }
};

// Отправить запрос в друзья
exports.sendRequest = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID пользователя обязателен' }
      });
    }

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Нельзя отправить запрос себе' }
      });
    }

    // Проверить существует ли пользователь
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    // Проверить не отправлен ли уже запрос
    const existing = db.prepare('SELECT id FROM contact_requests WHERE fromUserId = ? AND toUserId = ?').get(req.user.id, userId);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'REQUEST_ALREADY_SENT', message: 'Запрос уже отправлен' }
      });
    }

    const requestId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO contact_requests (id, fromUserId, toUserId, message, status, createdAt)
      VALUES (?, ?, ?, ?, 'pending', ?)
    `).run(requestId, req.user.id, userId, message || '', now);

    res.status(201).json({
      success: true,
      data: {
        id: requestId,
        fromUserId: req.user.id,
        toUserId: userId,
        message,
        status: 'pending',
        createdAt: now
      }
    });
  } catch (error) {
    console.error('SendRequest error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отправке запроса' }
    });
  }
};

// Обработать запрос
exports.handleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accept' | 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверное действие' }
      });
    }

    const request = db.prepare('SELECT * FROM contact_requests WHERE id = ?').get(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Запрос не найден' }
      });
    }

    // Проверить что запрос адресован текущему пользователю
    if (request.toUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Не ваш запрос' }
      });
    }

    // Проверить что запрос ещё не обработан
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: { code: 'REQUEST_ALREADY_PROCESSED', message: 'Запрос уже обработан' }
      });
    }

    const now = Date.now();

    if (action === 'accept') {
      // Добавить в контакты
      const contactId = uuidv4();
      db.prepare(`
        INSERT INTO contacts (id, userId, contactUserId, displayName, avatar, email, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        contactId,
        req.user.id,
        request.fromUserId,
        null, null, null,
        now, now
      );

      // Добавить взаимный запрос
      const mutualRequestId = uuidv4();
      db.prepare(`
        INSERT INTO contact_requests (id, fromUserId, toUserId, message, status, createdAt, processedAt)
        VALUES (?, ?, ?, ?, 'accepted', ?, ?)
      `).run(mutualRequestId, request.fromUserId, req.user.id, '', now, now);
    }

    // Обновить статус текущего запроса
    db.prepare(`
      UPDATE contact_requests 
      SET status = ?, processedAt = ?
      WHERE id = ?
    `).run(action === 'accept' ? 'accepted' : 'rejected', now, requestId);

    res.json({ 
      success: true,
      data: {
        requestId,
        action,
        status: action === 'accept' ? 'accepted' : 'rejected'
      }
    });
  } catch (error) {
    console.error('HandleRequest error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обработке запроса' }
    });
  }
};
