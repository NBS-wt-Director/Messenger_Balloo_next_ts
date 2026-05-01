import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * POST /api/users/[id]/online
 * Обновление статуса онлайн пользователя
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isOnline } = body;

    if (isOnline === undefined) {
      return NextResponse.json(
        { error: 'isOnline обязателен' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const onlineInt = isOnline ? 1 : 0;

    db.prepare('UPDATE User SET isOnline = ?, online = ?, updatedAt = ? WHERE id = ?')
      .run(onlineInt, onlineInt, now, id);

    return NextResponse.json({
      success: true,
      user: {
        id,
        isOnline,
        online: isOnline,
        lastSeen: now
      }
    });
  } catch (error) {
    console.error('[User Online] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении статуса' },
      { status: 500 }
    );
  }
}
