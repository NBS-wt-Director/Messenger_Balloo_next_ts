/**
 * Middleware аутентификации
 * Проверка JWT токена
 */

const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

/**
 * Middleware для проверки JWT токена
 */
function authenticate(req, res, next) {
  try {
    // Получаем токен из заголовка
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Отсутствует токен авторизации'
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Находим пользователя
    const user = db.prepare('SELECT id, email, displayName, avatar, isAdmin, isSuperAdmin, adminRoles FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Пользователь не найден'
        }
      });
    }
    
    // Добавляем пользователя к запросу
    req.user = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      isAdmin: !!user.isAdmin,
      isSuperAdmin: !!user.isSuperAdmin,
      adminRoles: JSON.parse(user.adminRoles || '[]')
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Токен истёк'
        }
      });
    }
    
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Неверный токен'
      }
    });
  }
}

/**
 * Middleware для проверки прав администратора
 */
function requireAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Треуются права администратора'
      }
    });
  }
  next();
}

/**
 * Middleware для проверки прав супер-администратора
 */
function requireSuperAdmin(req, res, next) {
  if (!req.user.isSuperAdmin) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Треуются права супер-администратора'
      }
    });
  }
  next();
}

/**
 * Опциональная аутентификация (не требует токен)
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.userId };
    }
    
    next();
  } catch (error) {
    next();
  }
}

module.exports = {
  authenticate,
  requireAdmin,
  requireSuperAdmin,
  optionalAuth
};
