import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

function getUserById(id: string): any {
  return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as any || null;
}

const CHANGE_ID_COST = 4444;

/**
 * POST /api/user-id/change
 * Смена user ID за 4444 балла
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newId } = body;

    if (!userId || !newId) {
      return NextResponse.json(
        { error: 'userId и newId обязательны' },
        { status: 400 }
      );
    }

    // Валидация нового ID
    const idRegex = /^[a-zA-Z0-9_-]{3,32}$/;
    if (!idRegex.test(newId)) {
      return NextResponse.json(
        { error: 'ID должен содержать 3-32 символа (латиница, цифры, _,-)' },
        { status: 400 }
      );
    }

    const user = getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверка текущего ID
    if (user.id === newId) {
      return NextResponse.json(
        { error: 'Новый ID совпадает с текущим' },
        { status: 400 }
      );
    }

    // Проверка баланса
    const currentPoints = user.points || -55;
    if (currentPoints < CHANGE_ID_COST) {
      return NextResponse.json(
        { 
          error: `Недостаточно баллов. Требуется ${CHANGE_ID_COST} баллов.`,
          currentPoints,
          required: CHANGE_ID_COST,
          deficit: CHANGE_ID_COST - currentPoints
        },
        { status: 402 }
      );
    }

    // Проверка уникальности нового ID
    const existing = db.prepare('SELECT id FROM User WHERE id = ?').get(newId);
    if (existing) {
      return NextResponse.json(
        { error: 'Этот ID уже занят' },
        { status: 409 }
      );
    }

    // Списываем баллы и обновляем ID
    const newPoints = currentPoints - CHANGE_ID_COST;

    // Обновляем user ID во всех таблицах где используется userId
    const tx = db.transaction(() => {
      // Обновляем User
      db.prepare('UPDATE User SET id = ?, points = ?, updatedAt = ? WHERE id = ?')
        .run(newId, newPoints, new Date().toISOString(), userId);

      // Обновляем ChatMember
      db.prepare('UPDATE ChatMember SET userId = ? WHERE userId = ?')
        .run(newId, userId);

      // Обновляем Message
      db.prepare('UPDATE Message SET userId = ? WHERE userId = ?')
        .run(newId, userId);

      // Обновляем Notification
      db.prepare('UPDATE Notification SET userId = ? WHERE userId = ?')
        .run(newId, userId);

      // Обновляем Contact
      db.prepare('UPDATE Contact SET userId = ? WHERE userId = ?')
        .run(newId, userId);

      // Обновляем FamilyRelation
      db.prepare('UPDATE FamilyRelation SET userId1 = ? WHERE userId1 = ?')
        .run(newId, userId);
      db.prepare('UPDATE FamilyRelation SET userId2 = ? WHERE userId2 = ?')
        .run(newId, userId);
    });

    tx();

    return NextResponse.json({
      success: true,
      message: 'ID успешно изменён',
      oldId: userId,
      newId,
      previousPoints: currentPoints,
      newPoints,
      cost: CHANGE_ID_COST,
      warning: 'Пожалуйста, перезагрузите страницу для применения изменений'
    });
  } catch (error) {
    console.error('[User ID Change] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при смене ID' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user-id/change
 * Проверка возможности смены ID
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

    const user = getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const currentPoints = user.points || -55;
    const canChange = currentPoints >= CHANGE_ID_COST;

    return NextResponse.json({
      success: true,
      canChange,
      currentId: user.id,
      currentPoints,
      cost: CHANGE_ID_COST,
      deficit: canChange ? 0 : CHANGE_ID_COST - currentPoints,
      message: canChange 
        ? 'Вы можете сменить ID' 
        : `Недостаточно баллов. Не хватает ${CHANGE_ID_COST - currentPoints} баллов`,
      rules: {
        minLength: 3,
        maxLength: 32,
        allowedChars: 'Латинские буквы, цифры, _, -'
      }
    });
  } catch (error) {
    console.error('[User ID Check] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке' },
      { status: 500 }
    );
  }
}
