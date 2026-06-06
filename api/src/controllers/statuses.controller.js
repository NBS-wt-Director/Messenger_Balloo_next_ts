/**
 * Statuses Controller (Stories)
 * Статусы/Сторис пользователей
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024
  }
});

// Получить статусы контактов
exports.getStatuses = async (req, res) => {
  try {
    // Получить список контактов пользователя
    const contacts = db.prepare('SELECT contactUserId FROM contacts WHERE userId = ?').all(req.user.id);
    const contactIds = contacts.map(c => c.contactUserId);

    if (contactIds.length === 0) {
      return res.json({
        success: true,
        data: { statuses: [] }
      });
    }

    const now = Date.now();
    const statuses = db.prepare(`
      SELECT s.*, u.displayName, u.avatar
      FROM statuses s
      JOIN users u ON s.userId = u.id
      WHERE s.userId IN (${contactIds.map(() => '?').join(',')})
      AND s.expiresAt > ?
      ORDER BY s.createdAt DESC
    `).all(...contactIds, now);

    res.json({
      success: true,
      data: {
        statuses: statuses.map(s => ({
          id: s.id,
          userId: s.userId,
          displayName: s.displayName,
          avatar: s.avatar,
          type: s.type,
          attachmentId: s.attachmentId,
          views: JSON.parse(s.views || '[]'),
          viewCount: JSON.parse(s.views || '[]').length,
          isViewed: JSON.parse(s.views || '[]').includes(req.user.id),
          createdAt: s.createdAt,
          expiresAt: s.expiresAt
        }))
      }
    });
  } catch (error) {
    console.error('GetStatuses error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении статусов' }
    });
  }
};

// Создать статус
exports.createStatus = async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Файл не загружен' }
      });
    }

    const validTypes = ['image', 'video'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверный тип статуса' }
      });
    }

    const attachmentId = uuidv4();
    const statusId = uuidv4();
    const now = Date.now();
    const expiresAt = now + (24 * 60 * 60 * 1000); // 24 часа

    // Загрузка на Яндекс.Диск
    let yandexDiskPath = null;
    let publicUrl = null;
    
    try {
      const yandexService = require('../services/yandex-disk.service');
      const yandexToken = db.prepare('SELECT accessToken FROM yandex_tokens WHERE userId = ?').get(req.user.id);
      
      if (yandexToken) {
        const diskPath = `/statuses/${req.user.id}/${attachmentId}_${req.file.originalname}`;
        const uploadResult = await yandexService.uploadFile(req.file.buffer, diskPath, yandexToken.accessToken);
        
        if (uploadResult && uploadResult.path) {
          yandexDiskPath = diskPath;
          // Получаем публичную ссылку
          const shareResult = await yandexService.getPublicUrl(diskPath, yandexToken.accessToken);
          if (shareResult && shareResult.publicUrl) {
            publicUrl = shareResult.publicUrl;
          }
        }
      }
    } catch (yandexError) {
      console.error('[Status] Yandex upload error:', yandexError.message);
      // Продолжаем без Яндекс.Диска (локальное хранение)
    }

    // Сохранить вложения
    db.prepare(`
      INSERT INTO attachments (id, messageId, chatId, uploaderId, fileName, mimeType, fileSize, yandexDiskPath, publicUrl, status, createdAt, updatedAt)
      VALUES (?, '', '', ?, ?, ?, ?, ?, ?, 'ready', ?, ?)
    `).run(
      attachmentId,
      req.user.id,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      yandexDiskPath,
      publicUrl,
      now,
      now
    );

    // Сохранить статус
    db.prepare(`
      INSERT INTO statuses (id, userId, type, attachmentId, views, createdAt, expiresAt)
      VALUES (?, ?, ?, ?, '[]', ?, ?)
    `).run(statusId, req.user.id, type, attachmentId, now, expiresAt);

    res.status(201).json({
      success: true,
      data: {
        id: statusId,
        type,
        attachmentId,
        yandexDiskPath,
        publicUrl,
        createdAt: now,
        expiresAt
      }
    });
  } catch (error) {
    console.error('CreateStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании статуса' }
    });
  }
};

// Отметить просмотр
exports.viewStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = db.prepare('SELECT * FROM statuses WHERE id = ?').get(statusId);
    if (!status) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Статус не найден' }
      });
    }

    if (status.expiresAt < Date.now()) {
      return res.status(410).json({
        success: false,
        error: { code: 'STATUS_EXPIRED', message: 'Статус устарел' }
      });
    }

    const views = JSON.parse(status.views || '[]');
    if (!views.includes(req.user.id)) {
      views.push(req.user.id);
      db.prepare('UPDATE statuses SET views = ? WHERE id = ?').run(JSON.stringify(views), statusId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('ViewStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отметке просмотра' }
    });
  }
};

// Получить информацию о статусе
exports.getStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = db.prepare(`
      SELECT s.*, u.displayName, u.avatar
      FROM statuses s
      JOIN users u ON s.userId = u.id
      WHERE s.id = ?
    `).get(statusId);

    if (!status) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Статус не найден' }
      });
    }

    if (status.expiresAt < Date.now()) {
      return res.status(410).json({
        success: false,
        error: { code: 'STATUS_EXPIRED', message: 'Статус устарел' }
      });
    }

    res.json({
      success: true,
      data: {
        id: status.id,
        userId: status.userId,
        displayName: status.displayName,
        avatar: status.avatar,
        type: status.type,
        attachmentId: status.attachmentId,
        views: JSON.parse(status.views || '[]'),
        viewCount: JSON.parse(status.views || '[]').length,
        createdAt: status.createdAt,
        expiresAt: status.expiresAt
      }
    });
  } catch (error) {
    console.error('GetStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении статуса' }
    });
  }
};

// Удалить статус
exports.deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = db.prepare('SELECT * FROM statuses WHERE id = ?').get(statusId);
    if (!status) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Статус не найден' }
      });
    }

    if (status.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Можно удалять только свои статусы' }
      });
    }

    db.prepare('DELETE FROM statuses WHERE id = ?').run(statusId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении статуса' }
    });
  }
};

module.exports.upload = upload;
