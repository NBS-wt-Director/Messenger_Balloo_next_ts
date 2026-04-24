import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';
import { hashPassword, verifyPassword, isPasswordStrong } from '@/lib/password';

/**
 * POST /api/profile/password - Смена пароля пользователя
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Необходимо указать userId, currentPassword и newPassword' },
        { status: 400 }
      );
    }

    // Проверка сложности пароля
    const passwordCheck = isPasswordStrong(newPassword);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { 
          error: 'Слабый пароль',
          requirements: passwordCheck.errors
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.users;

    // Находим пользователя
    const user = await usersCollection.findOne({
      selector: { id: userId }
    }).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const userData = user.toJSON();

    // Проверяем текущий пароль с поддержкой миграции
    let isValidCurrentPassword = false;
    if (userData.passwordHash?.length === 64) {
      // Старый SHA256 хеш
      const crypto = require('crypto');
      const encoder = new TextEncoder();
      const passwordData = await crypto.subtle.digest('SHA-256', encoder.encode(currentPassword));
      const currentPasswordHash = Array.from(new Uint8Array(passwordData))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      isValidCurrentPassword = userData.passwordHash === currentPasswordHash;
    } else {
      // Новый bcrypt хеш
      isValidCurrentPassword = await verifyPassword(currentPassword, userData.passwordHash);
    }

    if (!isValidCurrentPassword) {
      return NextResponse.json(
        { error: 'Неверный текущий пароль' },
        { status: 401 }
      );
    }

    // Хешируем новый пароль с bcrypt
    const newPasswordHash = await hashPassword(newPassword);

    // Обновляем пароль
    await user.patch({
      passwordHash: newPasswordHash,
      updatedAt: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменён'
    });

  } catch (error: any) {
    logger.error('[API] Error changing password:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при смене пароля' },
      { status: 500 }
    );
  }
}
