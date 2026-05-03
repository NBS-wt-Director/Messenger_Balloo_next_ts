import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';

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

    // SQLite db уже доступен
    const chat = await db.chats.findOne(chatId).exec();

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    const data = chat.toJSON();

    await chat.patch({
      isFavorite: {
        ...data.isFavorite,
        [userId]: favorite
      },
      updatedAt: Date.now()
    });

    logger.info(`[API] Чат ${favorite ? 'добавлен в избранное' : 'убран из избранного'}: ${chatId}`);

    return NextResponse.json({ 
      success: true,
      favorite,
      chat: chat.toJSON()
    });
  } catch (error: any) {
    logger.error('[API] Error favoriting chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при добавлении в избранное' },
      { status: 500 }
    );
  }
}
