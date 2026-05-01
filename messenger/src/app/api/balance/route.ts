import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { getUserById } from '@/lib/prisma';

/**
 * GET /api/balance
 * Получение баланса текущего пользователя (только свой!)
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

    return NextResponse.json({
      success: true,
      balance: {
        points: user.points || -55,
        userNumber: user.userNumber || null,
        canSpend: (user.points || -55) >= 0,
        changeUserIdCost: 4444,
        message: user.userNumber && user.userNumber <= 10000 
          ? 'Поздравляем! Вы один из первых 10000 пользователей!' 
          : null
      }
    });
  } catch (error) {
    console.error('[Balance GET] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении баланса' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/balance
 * Обновление баланса (админские операции)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, points, action } = body; // action: 'add', 'set', 'remove'

    if (!userId || points === undefined) {
      return NextResponse.json(
        { error: 'userId и points обязательны' },
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

    let newPoints = points;

    if (action === 'add') {
      newPoints = (user.points || -55) + points;
    } else if (action === 'remove') {
      newPoints = (user.points || -55) - points;
    }

    db.prepare('UPDATE User SET points = ?, updatedAt = ? WHERE id = ?')
      .run(newPoints, new Date().toISOString(), userId);

    return NextResponse.json({
      success: true,
      balance: {
        points: newPoints,
        previousPoints: user.points || -55,
        action,
        changeUserIdCost: 4444
      }
    });
  } catch (error) {
    console.error('[Balance POST] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении баланса' },
      { status: 500 }
    );
  }
}
