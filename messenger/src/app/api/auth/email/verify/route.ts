import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

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

    // Генерируем код подтверждения (6 цифр)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = Date.now() + 10 * 60 * 1000; // 10 минут

    // Сохраняем код в пользовательских данных
    await user.patch({
      emailVerificationCode: verificationCode,
      emailVerificationExpiry: codeExpiry,
      updatedAt: Date.now()
    });

    // TODO: Отправка email с кодом
    // В production здесь будет отправка через SMTP/SendGrid/другой сервис
    logger.info(`[Email Verification] Code for ${userData.email}: ${verificationCode}`);

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

    // Проверяем код
    if (userData.emailVerificationCode !== code) {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }

    // Проверяем срок действия
    if (!userData.emailVerificationExpiry || Date.now() > userData.emailVerificationExpiry) {
      return NextResponse.json(
        { error: 'Код подтверждения истёк' },
        { status: 400 }
      );
    }

    // Подтверждаем email
    await user.patch({
      emailVerified: true,
      emailVerificationCode: undefined,
      emailVerificationExpiry: undefined,
      updatedAt: Date.now()
    });

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
