/**
 * Audio Controller
 * Загрузка и управление голосовыми сообщениями
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const yandexDiskService = require('../services/yandex-disk.service');
const path = require('path');

// Загрузить голосовое сообщение
exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Файл не загружен' }
      });
    }

    const { chatId, messageId } = req.body;
    const file = req.file;

    // Проверка параметров
    if (!chatId || !messageId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'chatId и messageId обязательны' }
      });
    }

    // Проверка типа файла
    const validTypes = ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm'];
    if (!validTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверный формат аудио' }
      });
    }

    // Загрузка на Яндекс.Диск
    const yandexPath = `/Balloo/Audio/${req.user.id}/${uuidv4()}.mp3`;
    const uploadResult = await yandexDiskService.uploadFile(
      req.user.id,
      file.buffer,
      yandexPath,
      file.mimetype
    );

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        error: { code: 'UPLOAD_ERROR', message: 'Ошибка загрузки на Яндекс.Диск' }
      });
    }

    // Получить публичный URL
    const publicUrlResult = await yandexDiskService.getPublicUrl(req.user.id, uploadResult.data.id);
    const publicUrl = publicUrlResult.success ? publicUrlResult.data.publicUrl : null;

    // Создать запись в БД
    const audioId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO audio_messages (
        id, messageId, chatId, uploaderId, fileName, mimeType, fileSize,
        duration, yandexDiskId, publicUrl, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      audioId,
      messageId,
      chatId,
      req.user.id,
      file.originalname,
      file.mimetype,
      file.size,
      req.body.duration || 0,
      uploadResult.data.id,
      publicUrl,
      now
    );

    res.status(201).json({
      success: true,
      data: {
        id: audioId,
        messageId,
        chatId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        duration: req.body.duration || 0,
        publicUrl,
        createdAt: now
      }
    });
  } catch (error) {
    console.error('UploadAudio error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при загрузке аудио' }
    });
  }
};

// Получить URL для воспроизведения
exports.getAudioUrl = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audio = db.prepare(`
      SELECT * FROM audio_messages WHERE id = ?
    `).get(audioId);

    if (!audio) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Аудио не найдено' }
      });
    }

    // Проверка доступа (участник чата)
    const chat = db.prepare('SELECT participants FROM chats WHERE id = ?').get(audio.chatId);
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
        error: { code: 'FORBIDDEN', message: 'Нет доступа к этому чату' }
      });
    }

    res.json({
      success: true,
      data: {
        url: audio.publicUrl,
        duration: audio.duration,
        fileName: audio.fileName
      }
    });
  } catch (error) {
    console.error('GetAudioUrl error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении URL аудио' }
    });
  }
};

// Получить информацию об аудио
exports.getAudioInfo = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audio = db.prepare(`
      SELECT am.*, u.displayName as uploaderName, u.avatar as uploaderAvatar
      FROM audio_messages am
      LEFT JOIN users u ON am.uploaderId = u.id
      WHERE am.id = ?
    `).get(audioId);

    if (!audio) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Аудио не найдено' }
      });
    }

    res.json({
      success: true,
      data: {
        id: audio.id,
        messageId: audio.messageId,
        chatId: audio.chatId,
        fileName: audio.fileName,
        mimeType: audio.mimeType,
        fileSize: audio.fileSize,
        duration: audio.duration,
        publicUrl: audio.publicUrl,
        uploaderName: audio.uploaderName,
        uploaderAvatar: audio.uploaderAvatar,
        createdAt: audio.createdAt
      }
    });
  } catch (error) {
    console.error('GetAudioInfo error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении информации об аудио' }
    });
  }
};

// Удалить голосовое сообщение
exports.deleteAudio = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audio = db.prepare('SELECT * FROM audio_messages WHERE id = ?').get(audioId);
    if (!audio) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Аудио не найдено' }
      });
    }

    // Проверка прав (владелец или админ чата)
    const chat = db.prepare('SELECT members, adminIds FROM chats WHERE id = ?').get(audio.chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const members = JSON.parse(chat.members);
    const adminIds = JSON.parse(chat.adminIds);
    const isMember = members[audio.uploaderId]?.role !== undefined;
    const isAdmin = adminIds.includes(req.user.id);

    if (!isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нет прав на удаление' }
      });
    }

    // Удалить с Яндекс.Диска
    if (audio.yandexDiskId) {
      await yandexDiskService.deleteFile(req.user.id, audio.yandexDiskId);
    }

    // Удалить из БД
    db.prepare('DELETE FROM audio_messages WHERE id = ?').run(audioId);

    res.json({
      success: true,
      message: 'Аудио успешно удалено'
    });
  } catch (error) {
    console.error('DeleteAudio error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении аудио' }
    });
  }
};

// Получить все аудио в чате
exports.getChatAudios = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Проверка доступа
    const chat = db.prepare('SELECT participants FROM chats WHERE id = ?').get(chatId);
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
        error: { code: 'FORBIDDEN', message: 'Нет доступа к этому чату' }
      });
    }

    const audios = db.prepare(`
      SELECT am.*, u.displayName as uploaderName, u.avatar as uploaderAvatar
      FROM audio_messages am
      LEFT JOIN users u ON am.uploaderId = u.id
      WHERE am.chatId = ?
      ORDER BY am.createdAt DESC
      LIMIT 50
    `).all(chatId);

    res.json({
      success: true,
      data: {
        audios: audios.map(a => ({
          id: a.id,
          messageId: a.messageId,
          fileName: a.fileName,
          mimeType: a.mimeType,
          fileSize: a.fileSize,
          duration: a.duration,
          publicUrl: a.publicUrl,
          uploaderName: a.uploaderName,
          uploaderAvatar: a.uploaderAvatar,
          createdAt: a.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetChatAudios error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении аудио' }
    });
  }
};
