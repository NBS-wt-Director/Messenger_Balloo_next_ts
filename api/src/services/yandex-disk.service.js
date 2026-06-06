/**
 * Yandex Disk Service
 * Интеграция с Яндекс Диском для хранения файлов
 */

const axios = require('axios');
const { db } = require('../config/database');

const YANDEX_CLIENT_ID = process.env.YANDEX_CLIENT_ID;
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET;
const YANDEX_REDIRECT_URI = process.env.YANDEX_REDIRECT_URI || 'http://localhost:3001/api/v1/disk/callback';

/**
 * Получить URL для авторизации
 */
exports.getAuthUrl = (userId) => {
  if (!YANDEX_CLIENT_ID) {
    throw new Error('YANDEX_CLIENT_ID not configured');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: YANDEX_CLIENT_ID,
    redirect_uri: YANDEX_REDIRECT_URI,
    state: userId
  });

  return `https://oauth.yandex.ru/authorize?${params.toString()}`;
};

/**
 * Обработать callback от Yandex
 */
exports.handleCallback = async (code, state) => {
  try {
    const tokenResponse = await axios.post(
      'https://oauth.yandex.ru/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: YANDEX_CLIENT_ID,
        client_secret: YANDEX_CLIENT_SECRET,
        redirect_uri: YANDEX_REDIRECT_URI
      })
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    const expiresAt = Date.now() + (expires_in * 1000);

    // Сохранить токен
    const existing = db.prepare('SELECT id FROM yandex_tokens WHERE userId = ?').get(state);
    
    if (existing) {
      db.prepare(`
        UPDATE yandex_tokens 
        SET accessToken = ?, refreshToken = ?, expiresAt = ?
        WHERE userId = ?
      `).run(access_token, refresh_token, expiresAt, state);
    } else {
      const id = require('uuid').v4();
      const now = Date.now();
      db.prepare(`
        INSERT INTO yandex_tokens (id, userId, accessToken, refreshToken, expiresAt, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, state, access_token, refresh_token, expiresAt, now);
    }

    return { success: true, userId: state };
  } catch (error) {
    console.error('Yandex callback error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Получить актуальный токен (с обновлением при необходимости)
 */
exports.getAccessToken = async (userId) => {
  const tokenData = db.prepare('SELECT * FROM yandex_tokens WHERE userId = ?').get(userId);
  
  if (!tokenData) {
    throw new Error('Yandex Disk not linked');
  }

  // Проверка, нужно ли обновлять токен
  if (tokenData.expiresAt - Date.now() < 3600000) { // Менее часа осталось
    await refreshToken(tokenData.refreshToken);
    const updatedToken = db.prepare('SELECT * FROM yandex_tokens WHERE userId = ?').get(userId);
    return updatedToken.accessToken;
  }

  return tokenData.accessToken;
};

/**
 * Обновить токен
 */
async function refreshToken(refreshToken) {
  try {
    const response = await axios.post(
      'https://oauth.yandex.ru/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: YANDEX_CLIENT_ID,
        client_secret: YANDEX_CLIENT_SECRET
      })
    );

    const { access_token, refresh_token, expires_in } = response.data;
    const expiresAt = Date.now() + (expires_in * 1000);

    db.prepare(`
      UPDATE yandex_tokens 
      SET accessToken = ?, refreshToken = ?, expiresAt = ?
      WHERE refreshToken = ?
    `).run(access_token, refresh_token, expiresAt, refreshToken);

    return { access_token, refresh_token, expiresAt };
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Загрузить файл на Яндекс Диск
 */
exports.uploadFile = async (userId, filePath, fileName, diskPath) => {
  if (!diskPath) diskPath = 'Balloo/';
  const accessToken = await this.getAccessToken(userId);
  
  // 1. Получить ссылку для загрузки
  const uploadUrlResponse = await axios.get(
    'https://cloud-api.yandex.net/v1/disk/upload',
    {
      headers: { Authorization: `OAuth ${accessToken}` },
      params: { path: diskPath + fileName, overwrite: true }
    }
  );

  const uploadUrl = uploadUrlResponse.data.href;

  // 2. Загрузить файл
  const fileBuffer = require('fs').readFileSync(filePath);
  await axios.put(uploadUrl, fileBuffer, {
    headers: { 'Content-Type': 'application/octet-stream' }
  });

  // 3. Получить информацию о файле
  const fileInfo = await axios.get(
    'https://cloud-api.yandex.net/v1/disk/resources',
    {
      headers: { Authorization: `OAuth ${accessToken}` },
      params: { path: diskPath + fileName }
    }
  );

  return {
    yandexDiskId: fileInfo.data.id,
    yandexDiskPath: fileInfo.data.path,
    publicUrl: fileInfo.data.file,
    fileName: fileInfo.data.name,
    size: fileInfo.data.size
  };
};

/**
 * Получить список файлов
 */
exports.listFiles = async (userId, path) => {
  if (!path) path = 'Balloo/';
  const accessToken = await this.getAccessToken(userId);

  const response = await axios.get(
    'https://cloud-api.yandex.net/v1/disk/resources',
    {
      headers: { Authorization: `OAuth ${accessToken}` },
      params: { path, limit: 1000 }
    }
  );

  return response.data._embedded?.items || [];
};

/**
 * Удалить файл
 */
exports.deleteFile = async (userId, diskPath) => {
  const accessToken = await this.getAccessToken(userId);

  await axios.delete(
    'https://cloud-api.yandex.net/v1/disk/resources',
    {
      headers: { Authorization: `OAuth ${accessToken}` },
      params: { path: diskPath }
    }
  );

  return { success: true };
};

/**
 * Получить информацию о файле
 */
exports.getFileInfo = async (userId, diskPath) => {
  const accessToken = await this.getAccessToken(userId);

  const response = await axios.get(
    'https://cloud-api.yandex.net/v1/disk/resources',
    {
      headers: { Authorization: `OAuth ${accessToken}` },
      params: { path: diskPath }
    }
  );

  return response.data;
};

/**
 * Получить квоту
 */
exports.getQuota = async (userId) => {
  const accessToken = await this.getAccessToken(userId);

  const response = await axios.get(
    'https://cloud-api.yandex.net/v1/disk/quota',
    {
      headers: { Authorization: `OAuth ${accessToken}` }
    }
  );

  return {
    total: response.data.total,
    used: response.data.used,
    trash: response.data.trash,
    available: response.data.total - response.data.used
  };
};

/**
 * Удалить связь с Яндекс Диском
 */
exports.unlinkAccount = async (userId) => {
  db.prepare('DELETE FROM yandex_tokens WHERE userId = ?').run(userId);
  return { success: true };
};
