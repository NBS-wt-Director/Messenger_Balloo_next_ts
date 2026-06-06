import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database.js';
import { logger } from '@/lib/logger';

function getUserById(id: string): any {
  return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as any || null;
}

/**
 * POST /api/users/[id]/block - Заблокировать пользователя
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await request.json();
    const blockedUserId = id;

    if (!userId || !blockedUserId) {
      return NextResponse.json(
        { error: 'userId и blockedUserId обязательны' }, 
        { status: 400 }
      );
    }

    if (userId === blockedUserId) {
      return NextResponse.json(
        { error: 'Нельзя заблокировать самого себя' }, 
        { status: 400 }
      );
    }

    const user = getUserById(userId);

    if (!user) {
      logger.warn(`[API] Пользователь не найден: ${userId}`);
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const blockedList = JSON.parse(user.blockedUsers || '[]');
    
    if (!blockedList.includes(blockedUserId)) {
      blockedList.push(blockedUserId);
    }

    db.prepare('UPDATE User SET blockedUsers = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(blockedList), new Date().toISOString(), userId);

    logger.info(`[API] Пользователь заблокирован: ${blockedUserId} (заблокировал: ${userId})`);

    return NextResponse.json({ 
      success: true,
      blockedUsers: blockedList
    });
  } catch (error: any) {
    logger.error('[API] Error blocking user:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при блокировке пользователя' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]/block - Разблокировать пользователя
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await request.json();
    const unblockedUserId = id;

    if (!userId || !unblockedUserId) {
      return NextResponse.json(
        { error: 'userId и unblockedUserId обязательны' }, 
        { status: 400 }
      );
    }

    const user = getUserById(userId);

    if (!user) {
      logger.warn(`[API] Пользователь не найден: ${userId}`);
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const blockedList = JSON.parse(user.blockedUsers || '[]')
      .filter((b: string) => b !== unblockedUserId);

    db.prepare('UPDATE User SET blockedUsers = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(blockedList), new Date().toISOString(), userId);

    logger.info(`[API] Пользователь разблокирован: ${unblockedUserId}`);

    return NextResponse.json({ 
      success: true,
      blockedUsers: blockedList
    });
  } catch (error: any) {
    logger.error('[API] Error unblocking user:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при разблокировке пользователя' },
      { status: 500 }
    );
  }
}

