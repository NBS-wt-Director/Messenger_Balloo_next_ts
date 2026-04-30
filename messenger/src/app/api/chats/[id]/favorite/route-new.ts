import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    const currentFavorite = chat.isFavorite as Record<string, boolean> || {};

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        isFavorite: {
          ...currentFavorite,
          [userId]: favorite
        },
        updatedAt: new Date()
      }
    });

    logger.info(`[API] Чат ${favorite ? 'добавлен в избранное' : 'убран из избранного'}: ${chatId}`);

    return NextResponse.json({ 
      success: true,
      favorite,
      chat: updatedChat
    });
  } catch (error: any) {
    logger.error('[API] Error favoriting chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при добавлении в избранное' },
      { status: 500 }
    );
  }
}
