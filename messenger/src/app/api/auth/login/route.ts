import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getUsersCollection } from '@/lib/database';
import { logger } from '@/lib/logger';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    logger.debug('[API Login] Поиск пользователя:', email);
    const usersCollection = await getUsersCollection();
    logger.debug('[API Login] Коллекция получена:', !!usersCollection);

    // Поиск пользователя
    const user = await usersCollection.findOne({
      selector: { email: email.toLowerCase() }
    }).exec();

    logger.debug('[API Login] Пользователь найден:', !!user);

    if (!user) {
      logger.warn('[API Login] Пользователь не найден');
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    const userData = user.toJSON();
    logger.debug('[API Login] Данные пользователя:', { id: userData.id, email: userData.email });

    // Проверка пароля с bcrypt
    let isValidPassword = false;
    
    // Поддержка старых хешей SHA256 для миграции
    if (userData.passwordHash?.length === 64) {
      // Старый SHA256 хеш
      const crypto = require('crypto');
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      isValidPassword = hashedPassword === userData.passwordHash;
    } else {
      // Новый bcrypt хеш
      isValidPassword = await verifyPassword(password, userData.passwordHash);
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
    await user.patch({
      status: 'online',
      lastSeen: Date.now(),
      updatedAt: Date.now()
    });

    // Генерация токена сессии
    const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    logger.info('[API Login] Успешный вход:', userData.id);

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        fullName: userData.fullName,
        avatar: userData.avatar,
        status: userData.status,
        isAdmin: userData.isAdmin,
        isSuperAdmin: userData.isSuperAdmin,
        settings: userData.settings
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

