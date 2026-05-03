import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';

function getChatById(id: string): any {
  return db.prepare('SELECT * FROM Chat WHERE id = ?').get(id) as any || null;
}

/**
 * POST /api/chats/[id]/favorite - Добавить/убрать из избранного
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId, favorite } = await request.json();
    const chatId = id;

    if (!userId) {
      return NextResponse.json({ error: 'userId обязателен' }, { status: 400 });
    }

    const chat = getChatById(chatId);

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    if (favorite) {
      const existing = db.prepare('SELECT 1 FROM ChatFavorite WHERE chatId = ? AND userId = ?').get(chatId, userId);
      if (!existing) {
        db.prepare('INSERT INTO ChatFavorite (chatId, userId, createdAt) VALUES (?, ?, ?)').run(chatId, userId, new Date().toISOString());
      }
    } else {
      db.prepare('DELETE FROM ChatFavorite WHERE chatId = ? AND userId = ?').run(chatId, userId);
    }

    logger.info(`[API] Чат ${favorite ? 'добавлен в избранное' : 'убран из избранного'}: ${chatId}`);

    return NextResponse.json({ 
      success: true,
      favorite
    });
  } catch (error: any) {
    logger.error('[API] Error favoriting chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при добавлении в избранное' },
      { status: 500 }
    );
  }
}
