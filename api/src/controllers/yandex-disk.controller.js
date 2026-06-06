/**
 * Yandex Disk Controller
 * Работа с Яндекс.Диском для хранения файлов
 */

const axios = require('axios').default || require('axios');
const { db } = require('../config/database');
const { encrypt, decrypt } = require('../config/encryption');
const { YANDEX_DISK } = require('../config/yandex');

// Получить токен Яндекс для диска
function getYandexToken(userId) {
  const user = db.prepare('SELECT yandexToken, yandexRefreshToken FROM users WHERE id = ?').get(userId);
  
  if (!user || !user.yandexToken) {
    return null;
  }

  const token = decrypt(user.yandexToken);
  return token;
}

// Обновить токен Яндекс
async function refreshYandexToken(userId) {
  const user = db.prepare('SELECT yandexRefreshToken FROM users WHERE id = ?').get(userId);
  
  if (!user || !user.yandexRefreshToken) {
    return null;
  }

  const refreshToken = decrypt(user.yandexRefreshToken);
  
  try {
    const response = await axios.post(YANDEX_OAUTH.tokenUrl, null, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.YANDEX_CLIENT_ID,
        client_secret: process.env.YANDEX_CLIENT_SECRET,
        refresh_token: refreshToken
      }
    });

    const { access_token, refresh_token } = response.data;

    // Обновить токены в БД
    db.prepare(`
      UPDATE users 
      SET yandexToken = ?, yandexRefreshToken = ?, updatedAt = ?
      WHERE id = ?
    `).run(encrypt(access_token), refresh_token ? encrypt(refresh_token) : null, Date.now(), userId);

    return access_token;
  } catch (error) {
    console.error('RefreshYandexToken error:', error);
    return null;
  }
}

// Получить список файлов
exports.listFiles = async (req, res) => {
  try {
    const { path = '/' } = req.query;
    const token = getYandexToken(req.user.id);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'YANDEX_NOT_CONNECTED', message: 'Яндекс.Диск не подключён' }
      });
    }

    try {
      const response = await axios.get(YANDEX_DISK.listFiles(path), {
        headers: { Authorization: `OAuth ${token}` }
      });

      res.json({
        success: true,
        data: {
          items: response.data._embedded?.items || [],
          total: response.data._embedded?.total || 0
        }
      });
    } catch (error) {
      if (error.response?.status === 404) {
        // Папка не существует - создаём
        await createFolder(token, '/messenger');
        const retryResponse = await axios.get(YANDEX_DISK.listFiles('/messenger'), {
          headers: { Authorization: `OAuth ${token}` }
        });
        res.json({
          success: true,
          data: {
            items: retryResponse.data._embedded?.items || [],
            total: retryResponse.data._embedded?.total || 0
          }
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('ListFiles error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'YANDEX_API_ERROR', message: 'Ошибка Яндекс API' }
    });
  }
};

// Загрузить файл
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Файл не загружен' }
      });
    }

    const token = getYandexToken(req.user.id);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'YANDEX_NOT_CONNECTED', message: 'Яндекс.Диск не подключён' }
      });
    }

    const fileName = req.file.originalname;
    const filePath = `/messenger/uploads/${Date.now()}_${fileName}`;

    try {
      // 1. Получить URL для загрузки
      const uploadUrlResponse = await axios.get(
        `${YANDEX_DISK.baseUrl}/resources/upload?path=${encodeURIComponent(filePath)}&overwrite=true`,
        { headers: { Authorization: `OAuth ${token}` } }
      );

      const uploadUrl = uploadUrlResponse.data.href;

      // 2. Загрузить файл на Яндекс
      await axios.put(uploadUrl, req.file.buffer, {
        headers: {
          'Content-Type': req.file.mimetype,
          'Content-Length': req.file.size
        }
      });

      // 3. Сохранить информацию в БД
      const attachmentId = require('uuid').v4();
      const now = Date.now();

      db.prepare(`
        INSERT INTO attachments (id, messageId, chatId, uploaderId, fileName, mimeType, fileSize, yandexDiskPath, yandexDiskId, status, createdAt, updatedAt)
        VALUES (?, '', '', ?, ?, ?, ?, ?, '', 'ready', ?, ?)
      `).run(
        attachmentId,
        req.user.id,
        fileName,
        req.file.mimetype,
        req.file.size,
        filePath,
        '',
        now,
        now
      );

      res.status(201).json({
        success: true,
        data: {
          id: attachmentId,
          fileName,
          mimeType: req.file.mimetype,
          size: req.file.size,
          yandexDiskPath: filePath,
          status: 'ready',
          createdAt: now
        }
      });
    } catch (error) {
      console.error('Yandex upload error:', error.response?.data || error.message);
      throw error;
    }
  } catch (error) {
    console.error('UploadFile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FILE_UPLOAD_ERROR', message: 'Ошибка загрузки файла' }
    });
  }
};

// Скачать файл
exports.downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(fileId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Файл не найден' }
      });
    }

    const token = getYandexToken(req.user.id);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'YANDEX_NOT_CONNECTED', message: 'Яндекс.Диск не подключён' }
      });
    }

    try {
      // Получить ссылку для скачивания
      const downloadResponse = await axios.get(
        YANDEX_DISK.getDownloadUrl(attachment.yandexDiskPath),
        { headers: { Authorization: `OAuth ${token}` } }
      );

      const downloadUrl = downloadResponse.data.href;

      // Перенаправить на скачивание
      res.redirect(downloadUrl);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('DownloadFile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'YANDEX_API_ERROR', message: 'Ошибка при скачивании файла' }
    });
  }
};

// Удалить файл
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(fileId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Файл не найден' }
      });
    }

    if (attachment.uploaderId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Можно удалять только свои файлы' }
      });
    }

    const token = getYandexToken(req.user.id);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'YANDEX_NOT_CONNECTED', message: 'Яндекс.Диск не подключён' }
      });
    }

    try {
      // Удалить с Яндекс.Диска
      await axios.delete(
        YANDEX_DISK.deleteFile(attachment.yandexDiskPath),
        { headers: { Authorization: `OAuth ${token}` } }
      );

      // Удалить из БД
      db.prepare('DELETE FROM attachments WHERE id = ?').run(fileId);

      res.json({ success: true });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('DeleteFile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'YANDEX_API_ERROR', message: 'Ошибка при удалении файла' }
    });
  }
};

// Получить публичную ссылку
exports.getPublicUrl = async (req, res) => {
  try {
    const { fileId } = req.params;

    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(fileId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Файл не найден' }
      });
    }

    const token = getYandexToken(req.user.id);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'YANDEX_NOT_CONNECTED', message: 'Яндекс.Диск не подключён' }
      });
    }

    try {
      // Опубликовать файл
      const publishResponse = await axios.put(
        YANDEX_DISK.publishFile(attachment.yandexDiskPath),
        {},
        { headers: { Authorization: `OAuth ${token}` } }
      );

      const publicUrl = publishResponse.data.public_url;

      // Сохранить в БД
      db.prepare('UPDATE attachments SET publicUrl = ? WHERE id = ?').run(publicUrl, fileId);

      res.json({
        success: true,
        data: { publicUrl }
      });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('GetPublicUrl error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'YANDEX_API_ERROR', message: 'Ошибка при получении публичной ссылки' }
    });
  }
};

// Получить квоту
exports.getQuota = async (req, res) => {
  try {
    const token = getYandexToken(req.user.id);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'YANDEX_NOT_CONNECTED', message: 'Яндекс.Диск не подключён' }
      });
    }

    const response = await axios.get(YANDEX_DISK.getQuota(), {
      headers: { Authorization: `OAuth ${token}` }
    });

    res.json({
      success: true,
      data: {
        total: response.data.total,
        used: response.data.used,
        trashSize: response.data.trash_size,
        available: response.data.total - response.data.used
      }
    });
  } catch (error) {
    console.error('GetQuota error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'YANDEX_API_ERROR', message: 'Ошибка при получении квоты' }
    });
  }
};

// Вспомогательная функция для создания папки
async function createFolder(token, path) {
  try {
    await axios.put(
      YANDEX_DISK.createFolder(path),
      {},
      { headers: { Authorization: `OAuth ${token}` } }
    );
  } catch (error) {
    // Папка может уже существовать
    if (error.response?.status !== 409) {
      throw error;
    }
  }
}

// Вспомогательная функция для получения информации о файле
exports.getFileInfo = async (req, res) => {
  try {
    const { fileId } = req.params;

    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(fileId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Файл не найден' }
      });
    }

    res.json({
      success: true,
      data: {
        id: attachment.id,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        size: attachment.fileSize,
        yandexDiskPath: attachment.yandexDiskPath,
        publicUrl: attachment.publicUrl,
        createdAt: attachment.createdAt
      }
    });
  } catch (error) {
    console.error('GetFileInfo error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении информации о файле' }
    });
  }
};
