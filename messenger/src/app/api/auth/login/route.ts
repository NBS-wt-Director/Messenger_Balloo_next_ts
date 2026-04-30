import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    logger.debug('[API Login] Поиск пользователя:', email);

    // Поиск пользователя через Prisma
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

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
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'online',
        lastSeen: new Date()
      }
    });

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
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
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
