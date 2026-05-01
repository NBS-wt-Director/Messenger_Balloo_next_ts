import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { verifyCode } from '@/lib/verification-code';

/**
 * POST /api/auth/verification/verify
 * Проверка кода верификации
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'userId и код обязательны' },
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

    // Получаем последний код для пользователя
    const verificationRecord = db.prepare(`
      SELECT * FROM VerificationCode 
      WHERE userId = ? AND used = 0 
      ORDER BY createdAt DESC 
      LIMIT 1
    `).get(userId);

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Код верификации не найден или истёк' },
        { status: 404 }
      );
    }

    // Проверка времени жизни кода (15 минут)
    const createdAt = new Date(verificationRecord.createdAt);
    const expiresAt = new Date(verificationRecord.expiresAt);
    const now = new Date();

    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Код верификации истёк. Запросите новый код' },
        { status: 410 }
      );
    }

    // Проверка кода
    const isValid = verifyCode(code, verificationRecord.code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный код верификации' },
        { status: 400 }
      );
    }

    // Помечаем код как использованный
    db.prepare('UPDATE VerificationCode SET used = 1, usedAt = ? WHERE id = ?')
      .run(now.toISOString(), verificationRecord.id);

    // Обновляем статус пользователя
    db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?')
      .run('online', now.toISOString(), userId);

    return NextResponse.json({
      success: true,
      message: 'Email успешно подтверждён',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isVerified: true
      }
    });

  } catch (error) {
    console.error('[Verification Verify] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке кода' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/verification/status
 * Проверка статуса верификации
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    // Проверяем есть ли активный код
    const activeCode = db.prepare(`
      SELECT * FROM VerificationCode 
      WHERE userId = ? AND used = 0 AND expiresAt > ?
    `).get(userId, new Date().toISOString());

    return NextResponse.json({
      success: true,
      hasActiveCode: !!activeCode,
      needsVerification: !user.email || !activeCode
    });

  } catch (error) {
    console.error('[Verification Status] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке статуса' },
      { status: 500 }
    );
  }
}
