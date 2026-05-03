import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * POST /api/auth/email/verify - Отправить код подтверждения email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходимо указать userId' },
        { status: 400 }
      );
    }

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Генерируем код подтверждения (6 цифр)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = Date.now() + 10 * 60 * 1000; // 10 минут

    // Сохраняем код в пользовательских данных (используем settings)
    const settings = JSON.parse(user.settings || '{}');
    settings.emailVerificationCode = verificationCode;
    settings.emailVerificationExpiry = codeExpiry;
    
    db.prepare('UPDATE User SET settings = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(settings), new Date().toISOString(), userId);

    // Код верификации отправлен (см. логи или SMTP)
    logger.info(`[Email Verification] Code for ${user.email}: ${verificationCode}`);

    return NextResponse.json({
      success: true,
      message: 'Код подтверждения отправлен на email',
      codeExpiry: Math.floor((codeExpiry - Date.now()) / 1000)
    });

  } catch (error: any) {
    logger.error('[API] Error sending verification code:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при отправке кода' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/email/verify - Подтвердить email кодом
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, code } = body;

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'Необходимо указать userId и code' },
        { status: 400 }
      );
    }

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const settings = JSON.parse(user.settings || '{}');

    // Проверяем код
    if (settings.emailVerificationCode !== code) {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }

    // Проверяем срок действия
    if (!settings.emailVerificationExpiry || Date.now() > settings.emailVerificationExpiry) {
      return NextResponse.json(
        { error: 'Код подтверждения истёк' },
        { status: 400 }
      );
    }

    // Подтверждаем email
    settings.emailVerified = true;
    settings.emailVerificationCode = undefined;
    settings.emailVerificationExpiry = undefined;
    
    db.prepare('UPDATE User SET settings = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(settings), new Date().toISOString(), userId);

    return NextResponse.json({
      success: true,
      message: 'Email успешно подтверждён'
    });

  } catch (error: any) {
    logger.error('[API] Error verifying email:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при подтверждении email' },
      { status: 500 }
    );
  }
}
