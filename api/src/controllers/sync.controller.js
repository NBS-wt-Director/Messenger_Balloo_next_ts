/**
 * Sync Controller
 * Синхронизация ключей E2E шифрования между устройствами
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Синхронизировать ключи
exports.syncKeys = async (req, res) => {
  try {
    const { userId, deviceId, publicKey, encryptedPrivateKey } = req.body;

    if (!userId || !deviceId || !publicKey) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'userId, deviceId и publicKey обязательны' }
      });
    }

    // Проверить что запрос от владельца ключей
    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Можно синхронизировать только свои ключи' }
      });
    }

    const now = Date.now();
    const keyId = uuidv4();

    // Проверить существует ли уже ключ для этого устройства
    const existingKey = db.prepare('SELECT id FROM e2e_keys WHERE userId = ? AND deviceId = ?').get(userId, deviceId);

    if (existingKey) {
      // Обновить существующий ключ
      db.prepare(`
        UPDATE e2e_keys 
        SET publicKey = ?, encryptedPrivateKey = ?, createdAt = ?, expiresAt = ?
        WHERE userId = ? AND deviceId = ?
      `).run(publicKey, encryptedPrivateKey || null, now, now + (365 * 24 * 60 * 60 * 1000), userId, deviceId);

      res.json({
        success: true,
        data: {
          keyId: existingKey.id,
          message: 'Ключ обновлён'
        }
      });
    } else {
      // Создать новый ключ
      db.prepare(`
        INSERT INTO e2e_keys (id, userId, deviceId, publicKey, encryptedPrivateKey, createdAt, expiresAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(keyId, userId, deviceId, publicKey, encryptedPrivateKey || null, now, now + (365 * 24 * 60 * 60 * 1000));

      res.status(201).json({
        success: true,
        data: {
          keyId,
          message: 'Ключ сохранён'
        }
      });
    }
  } catch (error) {
    console.error('SyncKeys error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при синхронизации ключей' }
    });
  }
};

// Получить ключи
exports.getKeys = async (req, res) => {
  try {
    const { userId, deviceId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'userId обязателен' }
      });
    }

    // Проверить что запрашиваем свои ключи или это публичные ключи
    let query = 'SELECT id, userId, deviceId, publicKey, createdAt, expiresAt FROM e2e_keys WHERE userId = ?';
    const params = [userId];

    if (deviceId) {
      query += ' AND deviceId = ?';
      params.push(deviceId);
    }

    // Если запрашиваем не свои ключи, возвращаем только публичные
    if (userId !== req.user.id) {
      // Для других пользователей возвращаем только публичные ключи
      query = 'SELECT id, userId, deviceId, publicKey, createdAt FROM e2e_keys WHERE userId = ? AND expiresAt > ?';
      params.push(deviceId || userId, Date.now());
    }

    const keys = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: {
        keys: keys.map(k => ({
          id: k.id,
          userId: k.userId,
          deviceId: k.deviceId,
          publicKey: k.publicKey,
          createdAt: k.createdAt,
          expiresAt: k.expiresAt
        }))
      }
    });
  } catch (error) {
    console.error('GetKeys error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении ключей' }
    });
  }
};

// Получить все ключи пользователя (для админки)
exports.getUserKeys = async (req, res) => {
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
    console.error('GetUserKeys error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении ключей пользователя' }
    });
  }
};
