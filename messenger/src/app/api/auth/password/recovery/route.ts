import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';
import crypto from 'crypto';
import { hash } from 'bcryptjs';

/**
 * POST /api/auth/password/recovery - Запрос на восстановление пароля
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Необходимо указать email' },
        { status: 400 }
      );
    }

    const user = db.prepare('SELECT * FROM User WHERE email = ?').get(email.toLowerCase());

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Если email существует, код восстановления будет отправлен'
      });
    }

    // Генерируем токен сброса пароля
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 час

    // Сохраняем токен в settings
    const settings = JSON.parse(user.settings || '{}');
    settings.passwordResetToken = resetTokenHash;
    settings.passwordResetExpiry = resetTokenExpiry;
    
    db.prepare('UPDATE User SET settings = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(settings), new Date().toISOString(), user.id);

    // TODO: Отправка email с ссылкой сброса
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    logger.info(`[Password Recovery] Reset URL for ${user.email}: ${resetUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Если email существует, код восстановления будет отправлен'
    });

  } catch (error: any) {
    logger.error('[API] Error sending recovery email:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при отправке письма' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/password/reset - Сброс пароля по токену
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Необходимо указать token и newPassword' },
        { status: 400 }
      );
    }

    // Проверка сложности пароля
    const passwordRequirements = [
      newPassword.length >= 8,
      /\d/.test(newPassword),
      /[a-z]/.test(newPassword),
      /[A-Z]/.test(newPassword),
    ];

    if (!passwordRequirements.every(Boolean)) {
      return NextResponse.json(
        { 
          error: 'Пароль должен содержать минимум 8 символов, цифры, строчные и заглавные буквы'
        },
        { status: 400 }
      );
    }

    // Хешируем новый пароль
    const newPasswordHash = await hash(newPassword, 10);

    // Генерируем хеш токена
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = db.prepare('SELECT * FROM User WHERE settings LIKE ?').get(`%"passwordResetToken":"${resetTokenHash}"%`);

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный или истёкший токен сброса' },
        { status: 400 }
      );
    }

    // Проверяем срок действия токена
    const settings = JSON.parse(user.settings || '{}');
    if (!settings.passwordResetExpiry || Date.now() > settings.passwordResetExpiry) {
      return NextResponse.json(
        { error: 'Токен сброса истёк' },
        { status: 400 }
      );
    }

    // Обновляем пароль и очищаем токен
    settings.passwordResetToken = undefined;
    settings.passwordResetExpiry = undefined;
    
    db.prepare('UPDATE User SET passwordHash = ?, settings = ?, updatedAt = ? WHERE id = ?')
      .run(newPasswordHash, JSON.stringify(settings), new Date().toISOString(), user.id);

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменён'
    });

  } catch (error: any) {
    logger.error('[API] Error resetting password:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при сбросе пароля' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/password/reset/validate - Проверить валидность токена
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Токен не указан' },
        { status: 400 }
      );
    }

    // Генерируем хеш токена
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = db.prepare('SELECT settings FROM User WHERE settings LIKE ?').get(`%"passwordResetToken":"${resetTokenHash}"%`);

    if (user) {
      const settings = JSON.parse(user.settings || '{}');
      const valid = settings.passwordResetExpiry && Date.now() < settings.passwordResetExpiry;
      return NextResponse.json({ valid });
    }

    return NextResponse.json({ valid: false });

  } catch (error: any) {
    logger.error('[API] Error validating token:', error);
    return NextResponse.json(
      { valid: false, error: 'Ошибка проверки токена' },
      { status: 500 }
    );
  }
}
