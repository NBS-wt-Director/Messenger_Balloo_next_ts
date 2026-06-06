/**
 * Yandex Auth Controller
 * Яндекс.Авторизация через OAuth
 */

const axios = require('axios').default || require('axios');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { encrypt, decrypt, generateRandomString } = require('../config/encryption');
const { YANDEX_OAUTH } = require('../config/yandex');

// Получить URL для авторизации
exports.getAuthUrl = async (req, res) => {
  try {
    const state = generateRandomString(16);
    
    const url = `${YANDEX_OAUTH.authorizeUrl}?` +
      `response_type=code&` +
      `client_id=${YANDEX_OAUTH.clientId}&` +
      `redirect_uri=${YANDEX_OAUTH.redirectUri}&` +
      `scope=${encodeURIComponent(YANDEX_OAUTH.scope)}&` +
      `state=${state}`;

    res.json({
      success: true,
      data: {
        authorizeUrl: url,
        state
      }
    });
  } catch (error) {
    console.error('GetAuthUrl error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении URL авторизации' }
    });
  }
};

// Callback от Яндекса
exports.callback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Код авторизации отсутствует' }
      });
    }

    // Обмен кода на токен
    const tokenResponse = await axios.post(YANDEX_OAUTH.tokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: YANDEX_OAUTH.clientId,
        client_secret: YANDEX_OAUTH.clientSecret,
        code,
        redirect_uri: YANDEX_OAUTH.redirectUri
      }
    });

    const { access_token, refresh_token, token_type, expires_in } = tokenResponse.data;

    // Получить информацию о пользователе Яндекса
    const userInfoResponse = await axios.get('https://login.yandex.ru/info', {
      headers: {
        Authorization: `OAuth ${access_token}`
      }
    });

    const yandexUser = userInfoResponse.data;

    // Проверить/создать пользователя в нашей БД
    let user = db.prepare('SELECT * FROM users WHERE yandexId = ?').get(yandexUser.id);

    if (!user) {
      // Новый пользователь - создаём
      const userId = uuidv4();
      const now = Date.now();

      // Пытаемся найти по email
      const existingByEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(yandexUser.default_email);
      
      if (existingByEmail) {
        // Привязываем Яндекс к существующему пользователю
        db.prepare(`
          UPDATE users 
          SET yandexId = ?, yandexToken = ?, yandexRefreshToken = ?, provider = 'yandex', updatedAt = ?
          WHERE id = ?
        `).run(
          yandexUser.id,
          encrypt(access_token),
          refresh_token ? encrypt(refresh_token) : null,
          now,
          existingByEmail.id
        );
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(existingByEmail.id);
      } else {
        // Создаём нового пользователя
        const displayName = yandexUser.display_name || yandexUser.login;
        const avatar = yandexUser.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${yandexUser.default_avatar_id}/islands-retina-200` : null;

        db.prepare(`
          INSERT INTO users (id, email, displayName, avatar, yandexId, yandexToken, yandexRefreshToken, provider, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'yandex', ?, ?)
        `).run(
          userId,
          yandexUser.default_email,
          displayName,
          avatar,
          yandexUser.id,
          encrypt(access_token),
          refresh_token ? encrypt(refresh_token) : null,
          now,
          now
        );

        user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      }
    } else {
      // Обновляем токен существующего пользователя
      db.prepare(`
        UPDATE users 
        SET yandexToken = ?, yandexRefreshToken = ?, updatedAt = ?
        WHERE id = ?
      `).run(encrypt(access_token), refresh_token ? encrypt(refresh_token) : null, Date.now(), user.id);
    }

    // Генерация JWT токенов
    const accessToken = require('jsonwebtoken').sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    const refreshToken = require('jsonwebtoken').sign({ userId: user.id, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });

    // Сохранение сессии
    const sessionId = uuidv4();
    const now = Date.now();
    db.prepare(`
      INSERT INTO sessions (id, userId, refreshToken, platform, lastActive, expiresAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, user.id, refreshToken, 'web', now, now + (30 * 24 * 60 * 60 * 1000));

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          provider: user.provider,
          yandexId: user.yandexId
        },
        accessToken,
        refreshToken,
        isNewUser: !db.prepare('SELECT 1 FROM sessions WHERE userId = ? AND id != ?').get(user.id, sessionId)
      }
    });
  } catch (error) {
    console.error('YandexCallback error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'YANDEX_API_ERROR', message: 'Ошибка Яндекс API: ' + error.message }
    });
  }
};

// Привязать Яндекс аккаунт к существующему
exports.linkAccount = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Код авторизации обязателен' }
      });
    }

    // Обмен кода на токен
    const tokenResponse = await axios.post(YANDEX_OAUTH.tokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: YANDEX_OAUTH.clientId,
        client_secret: YANDEX_OAUTH.clientSecret,
        code,
        redirect_uri: YANDEX_OAUTH.redirectUri
      }
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Получить информацию о пользователе
    const userInfoResponse = await axios.get('https://login.yandex.ru/info', {
      headers: { Authorization: `OAuth ${access_token}` }
    });

    const yandexUser = userInfoResponse.data;

    // Проверить не занят ли Яндекс аккаунт
    const existing = db.prepare('SELECT id FROM users WHERE yandexId = ?').get(yandexUser.id);
    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({
        success: false,
        error: { code: 'YANDEX_ACCOUNT_ALREADY_LINKED', message: 'Этот Яндекс аккаунт уже привязан' }
      });
    }

    // Привязать
    db.prepare(`
      UPDATE users 
      SET yandexId = ?, yandexToken = ?, yandexRefreshToken = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      yandexUser.id,
      encrypt(access_token),
      refresh_token ? encrypt(refresh_token) : null,
      Date.now(),
      req.user.id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('LinkAccount error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'YANDEX_API_ERROR', message: 'Ошибка Яндекс API' }
    });
  }
};

// Отвязать Яндекс аккаунт
exports.unlinkAccount = async (req, res) => {
  try {
    db.prepare(`
      UPDATE users 
      SET yandexId = NULL, yandexToken = NULL, yandexRefreshToken = NULL, updatedAt = ?
      WHERE id = ?
    `).run(Date.now(), req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('UnlinkAccount error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отвязке аккаунта' }
    });
  }
};

// Проверить статус подключения
exports.getStatus = async (req, res) => {
  try {
    const user = db.prepare('SELECT yandexId, yandexToken FROM users WHERE id = ?').get(req.user.id);

    if (!user.yandexId) {
      return res.json({
        success: true,
        data: { isConnected: false }
      });
    }

    // Проверить валидность токена
    let isValid = false;
    try {
      const token = decrypt(user.yandexToken);
      await axios.get('https://login.yandex.ru/info', {
        headers: { Authorization: `OAuth ${token}` }
      });
      isValid = true;
    } catch (e) {
      // Токен невалиден
    }

    res.json({
      success: true,
      data: {
        isConnected: true,
        yandexId: user.yandexId,
        tokenValid: isValid
      }
    });
  } catch (error) {
    console.error('GetStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при проверке статуса' }
    });
  }
};
