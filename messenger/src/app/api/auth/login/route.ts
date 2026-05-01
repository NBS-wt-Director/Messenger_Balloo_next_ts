import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    logger.debug('[API Login] Поиск пользователя:', email);

    // Поиск пользователя
    const user = db.prepare('SELECT * FROM User WHERE email = ?').get(email.toLowerCase());

    logger.debug('[API Login] Пользователь найден:', !!user);

    if (!user) {
      logger.warn('[API Login] Пользователь не найден');
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    logger.debug('[API Login] Данные пользователя:', { id: user.id, email: user.email });

    // Проверка пароля с bcrypt
    let isValidPassword = false;
    
    // Поддержка старых хешей SHA256 для миграции
    if (user.passwordHash?.length === 64) {
      // Старый SHA256 хеш
      const crypto = await import('crypto');
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      isValidPassword = hashedPassword === user.passwordHash;
    } else {
      // Новый bcrypt хеш
      isValidPassword = await verifyPassword(password, user.passwordHash);
    }
    logger.debug('[API Login] Пароль верен:', isValidPassword);

    if (!isValidPassword) {
      logger.warn('[API Login] Неверный пароль');
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Обновление статуса
    db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?').run('online', new Date().toISOString(), user.id);

    // Генерация токена сессии
    const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    logger.info('[API Login] Успешный вход:', user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        fullName: user.fullName,
        avatar: user.avatar,
        status: user.status,
        isAdmin: user.adminRoles?.includes('admin') || false,
        isSuperAdmin: user.adminRoles?.includes('superadmin') || false,
      },
      token: sessionToken,
      message: 'Вход выполнен успешно'
    });
  } catch (error) {
    logger.error('[API] Error logging in:', error);
    return NextResponse.json(
      { error: 'Не удалось выполнить вход' },
      { status: 500 }
    );
  }
}
