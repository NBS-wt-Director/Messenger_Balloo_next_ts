import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { generateVerificationCode } from '@/lib/verification-code';
import { sendVerificationEmail } from '@/lib/email';

/**
 * POST /api/auth/verification/send
 * Отправка кода верификации на email
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId обязателен' },
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

    if (!user.email) {
      return NextResponse.json(
        { error: 'У пользователя нет email' },
        { status: 400 }
      );
    }

    // Генерация кода
    const code = generateVerificationCode();
    const now = new Date().toISOString();

    // Сохранение кода в БД (временное хранение)
    db.prepare(`
      INSERT OR REPLACE INTO VerificationCode (userId, code, createdAt, expiresAt, used)
      VALUES (?, ?, ?, ?, 0)
    `).run(
      userId,
      code,
      now,
      new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 минут
    );

    // Отправка email
    const emailSent = await sendVerificationEmail(user.email, code);

    if (!emailSent) {
      console.error('[Verification] Failed to send email to:', user.email);
      // Не возвращаем ошибку, так как код всё равно сгенерирован
    }

    return NextResponse.json({
      success: true,
      message: 'Код верификации отправлен на email',
      email: user.email.replace(/(.{3}).+(@.+)/, '$1***$2'), // Маскируем email
      hint: code.split('-').slice(0, 3).join('-') + '...'
    });

  } catch (error) {
    console.error('[Verification Send] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке кода' },
      { status: 500 }
    );
  }
}
