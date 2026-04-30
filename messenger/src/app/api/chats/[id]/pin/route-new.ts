import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * POST /api/chats/[id]/pin - Закрепить/открепить чат
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId, pinned } = await request.json();
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

    // Проверка лимита на 15 закреплённых чатов
    if (pinned) {
      const pinnedCount = await prisma.chatPinned.count({
        where: { userId }
      });
      if (pinnedCount >= 15) {
        return NextResponse.json(
          { error: 'Можно закрепить максимум 15 чатов' },
          { status: 400 }
        );
      }
    }

    if (pinned) {
      await prisma.chatPinned.upsert({
        where: {
          chatId_userId: { chatId, userId }
        },
        update: {},
        create: { chatId, userId }
      });
    } else {
      await prisma.chatPinned.deleteMany({
        where: { chatId, userId }
      });
    }

    logger.info(`[API] Чат ${pinned ? 'закреплён' : 'откреплён'}: ${chatId}`);

    return NextResponse.json({ 
      success: true,
      pinned
    });
  } catch (error: any) {
    logger.error('[API] Error pinning chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при закреплении чата' },
      { status: 500 }
    );
  }
}
