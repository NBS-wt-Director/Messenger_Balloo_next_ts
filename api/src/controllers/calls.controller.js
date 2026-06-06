/**
 * Calls Controller
 * Управление звонками (WebRTC) с записью на Яндекс.Диск
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const callRecordingService = require('../services/call-recording.service');
const logger = require('../config/logger');

// Создать звонок
exports.createCall = async (req, res) => {
  try {
    const { chatId, toUserId, type } = req.body;

    if (!type || !['audio', 'video'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Тип звонка обязателен (audio/video)' }
      });
    }

    if (!toUserId && !chatId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Нужен получатель или чат' }
      });
    }

    const callId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO calls (id, fromUserId, toUserId, chatId, type, status, recording, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'offered', 0, ?, ?)
    `).run(callId, req.user.id, toUserId || null, chatId || null, type, now, now);

    res.status(201).json({
      success: true,
      data: {
        id: callId,
        from: req.user.id,
        to: toUserId,
        chatId,
        type,
        status: 'offered',
        createdAt: now
      }
    });
  } catch (error) {
    console.error('CreateCall error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании звонка' }
    });
  }
};

// Получить информацию о звонке
exports.getCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Звонок не найден' }
      });
    }

    // Проверить что пользователь участник звонка
    if (call.fromUserId !== req.user.id && call.toUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого звонка' }
      });
    }

    res.json({
      success: true,
      data: {
        id: call.id,
        fromUserId: call.fromUserId,
        toUserId: call.toUserId,
        chatId: call.chatId,
        type: call.type,
        offer: call.offer ? JSON.parse(call.offer) : null,
        answer: call.answer ? JSON.parse(call.answer) : null,
        status: call.status,
        recording: !!call.recording,
        recordingId: call.recordingId,
        recordingPath: call.recordingPath,
        recordingUrl: call.recordingUrl,
        createdAt: call.createdAt,
        endedAt: call.endedAt,
        updatedAt: call.updatedAt
      }
    });
  } catch (error) {
    console.error('GetCall error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении звонка' }
    });
  }
};

// Получить историю звонков
exports.getCallHistory = async (req, res) => {
  try {
    const { limit = 50, offset = 0, type, status } = req.query;

    let query = `
      SELECT c.*, 
             u1.displayName as fromDisplayName, u1.avatar as fromAvatar,
             u2.displayName as toDisplayName, u2.avatar as toAvatar
      FROM calls c
      LEFT JOIN users u1 ON c.fromUserId = u1.id
      LEFT JOIN users u2 ON c.toUserId = u2.id
      WHERE c.fromUserId = ? OR c.toUserId = ?
    `;

    const params = [req.user.id, req.user.id];

    if (type) {
      query += ' AND c.type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const calls = db.prepare(query).all(...params);

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM calls 
      WHERE fromUserId = ? OR toUserId = ?
    `).get(req.user.id, req.user.id).count;

    res.json({
      success: true,
      data: {
        calls: calls.map(c => ({
          id: c.id,
          fromUserId: c.fromUserId,
          fromUser: {
            id: c.fromUserId,
            displayName: c.fromDisplayName,
            avatar: c.fromAvatar
          },
          toUserId: c.toUserId,
          toUser: {
            id: c.toUserId,
            displayName: c.toDisplayName,
            avatar: c.toAvatar
          },
          chatId: c.chatId,
          type: c.type,
          status: c.status,
          recording: !!c.recording,
          recordingUrl: c.recordingUrl,
          createdAt: c.createdAt,
          endedAt: c.endedAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    console.error('GetCallHistory error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении истории звонков' }
    });
  }
};

// Завершить звонок
exports.endCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const { duration, recording = false } = req.body;

    const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Звонок не найден' }
      });
    }

    if (call.fromUserId !== req.user.id && call.toUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого звонка' }
      });
    }

    let recordingUrl = call.recordingUrl;
    let recordingId = call.recordingId;
    let recordingPath = call.recordingPath;

    // Если запись включена и есть локальный файл
    if (recording) {
      const localRecordingPath = callRecordingService.getRecordingPath(callId);
      
      if (localRecordingPath) {
        try {
          // Получить пользователя и его токен Яндекс
          const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
          
          if (user && user.yandexToken) {
            // Загрузить на Яндекс.Диск
            const uploadResult = await callRecordingService.uploadToYandexDisk(
              localRecordingPath,
              req.user.id,
              user.yandexToken
            );

            if (uploadResult.success) {
              recordingId = uploadResult.yandexDiskId;
              recordingPath = uploadResult.diskPath;
              
              // Получить публичную ссылку
              recordingUrl = await callRecordingService.getPublicUrl(
                user.yandexToken,
                uploadResult.diskPath
              );

              // Удалить локальный файл после загрузки
              callRecordingService.deleteLocalFile(localRecordingPath);
            }
          }
        } catch (uploadError) {
          logger.error('Upload recording error:', uploadError);
          // Продолжаем даже если загрузка не удалась
        }
      }
    }

    db.prepare(`
      UPDATE calls 
      SET status = 'ended', 
          duration = ?, 
          recording = ?, 
          recordingId = ?, 
          recordingPath = ?,
          recordingUrl = ?,
          endedAt = ?, 
          updatedAt = ?
      WHERE id = ?
    `).run(
      duration || 0,
      recording ? 1 : 0,
      recordingId || null,
      recordingPath || null,
      recordingUrl || null,
      Date.now(),
      Date.now(),
      callId
    );

    res.json({
      success: true,
      data: {
        callId,
        duration,
        recording: !!recording,
        recordingUrl
      }
    });
  } catch (error) {
    console.error('EndCall error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при завершении звонка' }
    });
  }
};

// Получить запись звонка
exports.getCallRecording = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Звонок не найден' }
      });
    }

    // Проверить что пользователь участник звонка
    if (call.fromUserId !== req.user.id && call.toUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого звонка' }
      });
    }

    if (!call.recordingUrl) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Запись звонка не найдена' }
      });
    }

    res.json({
      success: true,
      data: {
        callId,
        recordingUrl: call.recordingUrl,
        recordingPath: call.recordingPath
      }
    });
  } catch (error) {
    console.error('GetCallRecording error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении записи звонка' }
    });
  }
};

// Обновить состояние звонка (WebRTC сигнализация)
exports.updateCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const { offer, answer, iceCandidate } = req.body;

    const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Звонок не найден' }
      });
    }

    const updates = [];
    const values = [];

    if (offer !== undefined) {
      updates.push('offer = ?');
      values.push(JSON.stringify(offer));
      values.push('offered');
    }

    if (answer !== undefined) {
      updates.push('answer = ?');
      values.push(JSON.stringify(answer));
      values.push('connected');
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Нет данных для обновления' }
      });
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(callId);

    db.prepare(`UPDATE calls SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateCall error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении звонка' }
    });
  }
};
