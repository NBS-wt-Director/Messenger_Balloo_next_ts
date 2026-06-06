/**
 * Auth Controller
 * Регистрация, вход, JWT токены
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { generateCode, hash } = require('../config/encryption');
const emailService = require('../services/email.service');
const logger = require('../config/logger');

// Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { email, password, displayName, fullName, birthDate, phone, publicKey } = req.body;

    // Валидация
    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email, пароль и displayName обязательны' }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Пароль должен быть минимум 8 символов' }
      });
    }

    // Проверка существования пользователя
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_ALREADY_EXISTS', message: 'Пользователь с таким email уже существует' }
      });
    }

    // Хэширование пароля
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Создание пользователя
    const userId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO users (id, email, passwordHash, displayName, fullName, birthDate, phone, publicKey, provider, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'email', ?, ?)
    `).run(userId, email.toLowerCase(), passwordHash, displayName, fullName || null, birthDate || null, phone || null, publicKey || null, now, now);

    // Генерация токенов
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    const refreshToken = jwt.sign({ userId, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });

    // Сохранение refresh токена
    const sessionId = uuidv4();
    db.prepare(`
      INSERT INTO sessions (id, userId, refreshToken, platform, lastActive, expiresAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, userId, refreshToken, 'web', now, now + (30 * 24 * 60 * 60 * 1000));

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          displayName,
          fullName,
          avatar: null,
          publicKey,
          createdAt: now,
          provider: 'email'
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при регистрации' }
    });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { email, password, deviceInfo } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email и пароль обязательны' }
      });
    }

    // Поиск пользователя
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Неверные учётные данные' }
      });
    }

    // Проверка пароля
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Неверные учётные данные' }
      });
    }

    // Генерация токенов
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    const refreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });

    // Сохранение сессии
    const sessionId = uuidv4();
    const now = Date.now();
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 дней

    db.prepare(`
      INSERT INTO sessions (id, userId, refreshToken, platform, deviceId, pushToken, lastActive, expiresAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sessionId, user.id, refreshToken,
      deviceInfo?.platform || 'web',
      deviceInfo?.deviceId || null,
      deviceInfo?.pushToken || null,
      now,
      expiresAt
    );

    // Обновление lastSeen
    db.prepare('UPDATE users SET lastSeen = ? WHERE id = ?').run(now, user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          fullName: user.fullName,
          avatar: user.avatar,
          publicKey: user.publicKey,
          createdAt: user.createdAt,
          provider: user.provider
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при входе' }
    });
  }
};

// Выход
exports.logout = async (req, res) => {
  try {
    const { allDevices } = req.query;
    
    if (allDevices === 'true') {
      // Удалить все сессии пользователя
      db.prepare('DELETE FROM sessions WHERE userId = ?').run(req.user.id);
    } else {
      // Удалить текущую сессию (токен из заголовка)
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          db.prepare('DELETE FROM sessions WHERE userId = ? AND refreshToken = ?').run(req.user.id, token);
        } catch (e) {
          // Токен невалиден, но выход всё равно успешен
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при выходе' }
    });
  }
};

// Обновление токена
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Refresh token обязателен' }
      });
    }

    // Проверка refresh токена
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Неверный тип токена' }
      });
    }

    // Проверка сессии
    const session = db.prepare('SELECT * FROM sessions WHERE refreshToken = ? AND userId = ?').get(refreshToken, decoded.userId);
    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Сессия не найдена' }
      });
    }

    // Генерация новых токенов
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    const newRefreshToken = jwt.sign({ userId: decoded.userId, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });

    // Обновление сессии
    db.prepare('UPDATE sessions SET refreshToken = ?, lastActive = ? WHERE id = ?').run(newRefreshToken, Date.now(), session.id);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Refresh token истёк' }
      });
    }
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении токена' }
    });
  }
};

// Получить данные текущего пользователя
exports.getMe = async (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, displayName, fullName, avatar, publicKey, provider, 
             yandexId, settings, familyRelations, isAdmin, isSuperAdmin, adminRoles,
             createdAt, lastSeen
      FROM users WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    res.json({
      success: true,
      data: {
        ...user,
        settings: JSON.parse(user.settings || '{}'),
        familyRelations: JSON.parse(user.familyRelations || '[]'),
        adminRoles: JSON.parse(user.adminRoles || '[]')
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении данных' }
    });
  }
};

// Смена пароля
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Старый и новый пароль обязательны' }
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Новый пароль должен быть минимум 8 символов' }
      });
    }

    const user = db.prepare('SELECT passwordHash FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Неверный старый пароль' }
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    db.prepare('UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?').run(newPasswordHash, Date.now(), req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при смене пароля' }
    });
  }
};

// Запрос на восстановление пароля
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email обязателен' }
      });
    }

    const user = db.prepare('SELECT id, displayName FROM users WHERE email = ?').get(email.toLowerCase());
    
    // Всегда возвращаем успех для безопасности (не раскрываем существование пользователя)
    res.json({ 
      success: true,
      message: 'Если пользователь существует, код восстановления отправлен на email'
    });

    if (user) {
      // Генерация кода
      const code = require('../config/encryption').generateCode(6);
      const codeHash = require('../config/encryption').hash(code);
      
      // Сохранить код в БД (временно, на 10 минут)
      const expiresAt = Date.now() + (10 * 60 * 1000);
      db.prepare(`
        INSERT OR REPLACE INTO verification_codes (email, code_hash, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `).run(email.toLowerCase(), codeHash, expiresAt, Date.now());
      
      // Отправить email
      const emailService = require('../services/email.service');
      const result = await emailService.sendPasswordResetCode(email, code);
      
      if (!result.success) {
        logger.warn(`Failed to send email to ${email}: ${result.error}`);
      }
    }
  } catch (error) {
    console.error('ForgotPassword error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при запросе восстановления' }
    });
  }
};

// Подтверждение кода восстановления
exports.verifyCode = async (req, res) => {
  try {
    const { email, code, type } = req.body;

    if (!email || !code || !type) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email, код и тип обязательны' }
      });
    }

    // Проверить код в БД
    const codeHash = hash(code);
    const verification = db.prepare('SELECT * FROM verification_codes WHERE email = ? AND code_hash = ? AND expires_at > ?')
      .get(email.toLowerCase(), codeHash, Date.now());

    if (!verification) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный или истёкший код' }
      });
    }

    // Удалить использованный код
    db.prepare('DELETE FROM verification_codes WHERE id = ?').run(verification.id);

    res.json({ success: true });
  } catch (error) {
    console.error('VerifyCode error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при проверке кода' }
    });
  }
};

// Сброс пароля
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Все поля обязательны' }
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Пароль должен быть минимум 8 символов' }
      });
    }

    // TODO: Проверить код
    
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' }
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?').run(newPasswordHash, user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('ResetPassword error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при сбросе пароля' }
    });
  }
};

// Список сессий
exports.getSessions = async (req, res) => {
  try {
    const sessions = db.prepare(`
      SELECT id, platform, deviceId, lastActive, expiresAt,
             CASE WHEN refreshToken = ? THEN 1 ELSE 0 END as isCurrent
      FROM sessions WHERE userId = ? ORDER BY lastActive DESC
    `).all(req.user.id, req.user.id);

    res.json({
      success: true,
      data: {
        sessions: sessions.map(s => ({
          id: s.id,
          platform: s.platform,
          deviceId: s.deviceId,
          lastActive: s.lastActive,
          expiresAt: s.expiresAt,
          isCurrent: !!s.isCurrent
        }))
      }
    });
  } catch (error) {
    console.error('GetSessions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении сессий' }
    });
  }
};

// Завершить сессию
exports.terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Проверка, что сессия принадлежит пользователю
    const session = db.prepare('SELECT id FROM sessions WHERE id = ? AND userId = ?').get(sessionId, req.user.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Сессия не найдена' }
      });
    }
    
    db.prepare('DELETE FROM sessions WHERE id = ? AND userId = ?').run(sessionId, req.user.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('TerminateSession error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при завершении сессии' }
    });
  }
};

// Завершить все сессии (выход из всех устройств)
exports.terminateAllSessions = async (req, res) => {
  try {
    const result = db.prepare('DELETE FROM sessions WHERE userId = ?').run(req.user.id);
    
    res.json({ 
      success: true,
      message: `Завершено сессий: ${result.changes}`
    });
  } catch (error) {
    console.error('TerminateAllSessions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при завершении всех сессий' }
    });
  }
};

// Включить 2FA
exports.enable2FA = async (req, res) => {
  try {
    // Генерация секретного ключа для TOTP
    const speakeasy = require('speakeasy');
    const secret = speakeasy.generateSecret({
      name: `Balloo (${req.user.email})`
    });

    // Сохранить секрет временно (до подтверждения)
    const tempSecret = {
      secret: secret.base32,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 минут
    };

    db.prepare(`
      UPDATE users 
      SET temp2faSecret = ?, 
          updatedAt = ? 
      WHERE id = ?
    `).run(JSON.stringify(tempSecret), Date.now(), req.user.id);

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCodeUrl: secret.otpauth_url,
        message: 'Сканируйте QR-код или введите секрет вручную'
      }
    });
  } catch (error) {
    console.error('Enable2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при включении 2FA' }
    });
  }
};

// Подтвердить 2FA
exports.confirm2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const speakeasy = require('speakeasy');

    const user = db.prepare('SELECT temp2faSecret FROM users WHERE id = ?').get(req.user.id);
    if (!user || !user.temp2faSecret) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'Нет временного секрета 2FA' }
      });
    }

    const tempSecret = JSON.parse(user.temp2faSecret);

    // Проверка истечения времени
    if (Date.now() > tempSecret.expiresAt) {
      db.prepare('UPDATE users SET temp2faSecret = NULL WHERE id = ?').run(req.user.id);
      return res.status(400).json({
        success: false,
        error: { code: 'EXPIRED', message: 'Время истекло, попробуйте снова' }
      });
    }

    // Проверка кода
    const verified = speakeasy.totp.verify({
      secret: tempSecret.secret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный код' }
      });
    }

    // Сохранить секрет и включить 2FA
    db.prepare(`
      UPDATE users 
      SET twoFASecret = ?, 
          twoFAEnabled = 1,
          temp2faSecret = NULL,
          updatedAt = ? 
      WHERE id = ?
    `).run(tempSecret.secret, Date.now(), req.user.id);

    res.json({
      success: true,
      message: '2FA успешно включён'
    });
  } catch (error) {
    console.error('Confirm2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при подтверждении 2FA' }
    });
  }
};

// Отключить 2FA
exports.disable2FA = async (req, res) => {
  try {
    const { code, password } = req.body;

    // Проверка пароля
    const user = db.prepare('SELECT passwordHash, twoFASecret FROM users WHERE id = ?').get(req.user.id);
    if (!user || !user.twoFASecret) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: '2FA не включён' }
      });
    }

    const validPassword = await require('bcryptjs').compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Неверный пароль' }
      });
    }

    // Проверка 2FA кода
    const speakeasy = require('speakeasy');
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный код' }
      });
    }

    // Отключить 2FA
    db.prepare(`
      UPDATE users 
      SET twoFASecret = NULL,
          twoFAEnabled = 0,
          updatedAt = ? 
      WHERE id = ?
    `).run(Date.now(), req.user.id);

    res.json({
      success: true,
      message: '2FA успешно отключён'
    });
  } catch (error) {
    console.error('Disable2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отключении 2FA' }
    });
  }
};

// Проверить 2FA (для входа)
exports.verify2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const speakeasy = require('speakeasy');

    const user = db.prepare('SELECT twoFASecret, twoFAEnabled FROM users WHERE id = ?').get(req.user.id);
    if (!user || !user.twoFAEnabled) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: '2FA не включён' }
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный код' }
      });
    }

    res.json({
      success: true,
      message: '2FA подтверждён'
    });
  } catch (error) {
    console.error('Verify2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при проверке 2FA' }
    });
  }
};

// Включить SMS 2FA
exports.enableSMS2FA = async (req, res) => {
  try {
    const user = db.prepare('SELECT phone FROM users WHERE id = ?').get(req.user.id);
    if (!user || !user.phone) {
      return res.status(400).json({
        success: false,
        error: { code: 'PHONE_NOT_SET', message: 'Номер телефона не указан' }
      });
    }

    // Генерация 3-значного кода
    const code = Math.floor(100 + Math.random() * 900).toString();
    const codeHash = require('../config/encryption').hash(code);
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 минут

    // Сохранение кода
    db.prepare(`
      INSERT OR REPLACE INTO verification_codes (email, code_hash, type, expires_at, created_at)
      VALUES (?, ?, 'sms_2fa_enable', ?, ?)
    `).run(user.phone, codeHash, expiresAt, Date.now());

    // Отправка SMS
    const smsService = require('../services/sms.service');
    const result = await smsService.sendVerificationCode(user.phone, code, 'sms_2fa_enable');

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: { code: 'SMS_ERROR', message: result.error || 'Ошибка отправки SMS' }
      });
    }

    res.json({
      success: true,
      message: 'Код отправлен на ваш номер телефона'
    });
  } catch (error) {
    console.error('EnableSMS2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при включении SMS 2FA' }
    });
  }
};

// Подтвердить SMS 2FA
exports.confirmSMS2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = db.prepare('SELECT phone FROM users WHERE id = ?').get(req.user.id);
    if (!user || !user.phone) {
      return res.status(400).json({
        success: false,
        error: { code: 'PHONE_NOT_SET', message: 'Номер телефона не указан' }
      });
    }

    // Проверка кода
    const codeHash = require('../config/encryption').hash(code);
    const verification = db.prepare(`
      SELECT * FROM verification_codes 
      WHERE email = ? AND code_hash = ? AND type = 'sms_2fa_enable' AND expires_at > ?
    `).get(user.phone, codeHash, Date.now());

    if (!verification) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный или истёкший код' }
      });
    }

    // Удалить использованный код
    db.prepare('DELETE FROM verification_codes WHERE id = ?').run(verification.id);

    // Включить SMS 2FA
    db.prepare(`
      UPDATE users 
      SET sms2FAEnabled = 1,
          sms2FAEnabledAt = ?,
          updatedAt = ? 
      WHERE id = ?
    `).run(Date.now(), Date.now(), req.user.id);

    res.json({
      success: true,
      message: 'SMS 2FA успешно включён'
    });
  } catch (error) {
    console.error('ConfirmSMS2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при подтверждении SMS 2FA' }
    });
  }
};

// Отключить SMS 2FA
exports.disableSMS2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = db.prepare('SELECT phone, sms2FAEnabled FROM users WHERE id = ?').get(req.user.id);
    
    if (!user || !user.sms2FAEnabled) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'SMS 2FA не включён' }
      });
    }

    // Отправить код подтверждения (3 цифры)
    const verificationCode = Math.floor(100 + Math.random() * 900).toString();
    const codeHash = require('../config/encryption').hash(verificationCode);
    const expiresAt = Date.now() + (5 * 60 * 1000);

    db.prepare(`
      INSERT OR REPLACE INTO verification_codes (email, code_hash, type, expires_at, created_at)
      VALUES (?, ?, 'sms_2fa_disable', ?, ?)
    `).run(user.phone, codeHash, expiresAt, Date.now());

    const smsService = require('../services/sms.service');
    await smsService.sendVerificationCode(user.phone, verificationCode, 'sms_2fa_disable');

    res.json({
      success: true,
      message: 'Код для отключения отправлен на ваш номер'
    });
  } catch (error) {
    console.error('DisableSMS2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отключении SMS 2FA' }
    });
  }
};

// Подтвердить отключение SMS 2FA
exports.confirmDisableSMS2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = db.prepare('SELECT phone FROM users WHERE id = ?').get(req.user.id);
    if (!user || !user.phone) {
      return res.status(400).json({
        success: false,
        error: { code: 'PHONE_NOT_SET', message: 'Номер телефона не указан' }
      });
    }

    // Проверка кода
    const codeHash = require('../config/encryption').hash(code);
    const verification = db.prepare(`
      SELECT * FROM verification_codes 
      WHERE email = ? AND code_hash = ? AND type = 'sms_2fa_disable' AND expires_at > ?
    `).get(user.phone, codeHash, Date.now());

    if (!verification) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный или истёкший код' }
      });
    }

    // Удалить использованный код
    db.prepare('DELETE FROM verification_codes WHERE id = ?').run(verification.id);

    // Отключить SMS 2FA
    db.prepare(`
      UPDATE users 
      SET sms2FAEnabled = 0,
          sms2FAEnabledAt = NULL,
          updatedAt = ? 
      WHERE id = ?
    `).run(Date.now(), req.user.id);

    res.json({
      success: true,
      message: 'SMS 2FA успешно отключён'
    });
  } catch (error) {
    console.error('ConfirmDisableSMS2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отключении SMS 2FA' }
    });
  }
};

// Проверить SMS код (для входа)
exports.verifySMS2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = db.prepare('SELECT phone, sms2FAEnabled FROM users WHERE id = ?').get(req.user.id);
    
    if (!user || !user.sms2FAEnabled) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'SMS 2FA не включён' }
      });
    }

    // Проверка кода
    const codeHash = require('../config/encryption').hash(code);
    const verification = db.prepare(`
      SELECT * FROM verification_codes 
      WHERE email = ? AND code_hash = ? AND type = 'sms_login' AND expires_at > ?
    `).get(user.phone, codeHash, Date.now());

    if (!verification) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный или истёкший код' }
      });
    }

    // Удалить использованный код
    db.prepare('DELETE FROM verification_codes WHERE id = ?').run(verification.id);

    res.json({
      success: true,
      message: 'SMS 2FA подтверждён'
    });
  } catch (error) {
    console.error('VerifySMS2FA error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при проверке SMS 2FA' }
    });
  }
};

// Отправить SMS код для входа
exports.sendLoginSMSCode = async (req, res) => {
  try {
    const user = db.prepare('SELECT phone FROM users WHERE id = ?').get(req.user.id);
    if (!user || !user.phone) {
      return res.status(400).json({
        success: false,
        error: { code: 'PHONE_NOT_SET', message: 'Номер телефона не указан' }
      });
    }

    // Генерация 3-значного кода
    const code = Math.floor(100 + Math.random() * 900).toString();
    const codeHash = require('../config/encryption').hash(code);
    const expiresAt = Date.now() + (5 * 60 * 1000);

    // Сохранение
    db.prepare(`
      INSERT OR REPLACE INTO verification_codes (email, code_hash, type, expires_at, created_at)
      VALUES (?, ?, 'sms_login', ?, ?)
    `).run(user.phone, codeHash, expiresAt, Date.now());

    // Отправка
    const smsService = require('../services/sms.service');
    const result = await smsService.sendVerificationCode(user.phone, code, 'sms_login');

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: { code: 'SMS_ERROR', message: result.error || 'Ошибка отправки SMS' }
      });
    }

    res.json({
      success: true,
      message: 'Код отправлен на ваш номер телефона'
    });
  } catch (error) {
    console.error('SendLoginSMSCode error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отправке SMS кода' }
    });
  }
};

// ============================================
// SMART 2FA ROUTER (ТОЛЬКО Max SMS + Внутренний бот)
// ============================================

// Отправить 2FA код (умный выбор: SMS -> Bot)
exports.sendSmart2FACode = async (req, res) => {
  try {
    // Инициализация роутера
    const smart2faRouter = require('../services/2fa-router.service');
    smart2faRouter.init();

    // Генерация 3-значного кода
    const code = Math.floor(100 + Math.random() * 900).toString();
    
    // Сохранение кода
    const codeHash = require('../config/encryption').hash(code);
    const expiresAt = Date.now() + (5 * 60 * 1000);
    db.prepare(`
      INSERT OR REPLACE INTO verification_codes (email, code_hash, type, expires_at, created_at)
      VALUES (?, ?, '2fa', ?, ?)
    `).run(req.user.id, codeHash, expiresAt, Date.now());

    // Получить доступный метод
    const { method, phone, deviceIds } = await smart2faRouter.getDeliveryMethod(req.user.id);

    // Отправить
    const result = await smart2faRouter.sendCode(req.user.id, code, method, { phone, deviceIds });

    if (result.success) {
      res.json({
        success: true,
        method,
        message: `Код отправлен через ${method === 'sms' ? 'Max SMS' : 'внутренний бот'}`
      });
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'DELIVERY_ERROR', message: result.error }
      });
    }
  } catch (error) {
    console.error('SendSmart2FACode error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отправке 2FA кода' }
    });
  }
};

// Проверить 2FA код (общий для всех методов)
exports.verifySmart2FACode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code || code.length !== 3) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Код должен быть 3 цифр' }
      });
    }

    const codeHash = require('../config/encryption').hash(code);
    const verification = db.prepare(`
      SELECT * FROM verification_codes 
      WHERE email = ? AND code_hash = ? AND type = '2fa' AND expires_at > ?
    `).get(req.user.id, codeHash, Date.now());

    if (!verification) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CODE', message: 'Неверный или истёкший код' }
      });
    }

    // Удалить использованный код
    db.prepare('DELETE FROM verification_codes WHERE id = ?').run(verification.id);

    res.json({
      success: true,
      message: '2FA подтверждён'
    });
  } catch (error) {
    console.error('VerifySmart2FACode error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при проверке 2FA' }
    });
  }
};

// Получить статус методов
exports.get2FAMethodStatus = async (req, res) => {
  try {
    const smart2faRouter = require('../services/2fa-router.service');
    const statuses = smart2faRouter.getMethodStatuses();

    res.json({
      success: true,
      data: {
        methods: statuses,
        config: smart2faRouter.CONFIG
      }
    });
  } catch (error) {
    console.error('Get2FAMethodStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении статуса' }
    });
  }
};
