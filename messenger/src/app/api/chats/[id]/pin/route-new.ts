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

    // Парсим текущий pinned из JSON
    const currentPinned = chat.pinned as Record<string, boolean> || {};
    
    // Проверка лимита на 15 закреплённых чатов
    if (pinned) {
      const pinnedCount = Object.values(currentPinned).filter(Boolean).length;
      if (pinnedCount >= 15) {
        return NextResponse.json(
          { error: 'Можно закрепить максимум 15 чатов' },
          { status: 400 }
        );
      }
    }

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        pinned: {
          ...currentPinned,
          [userId]: pinned
        },
        updatedAt: new Date()
      }
    });

    logger.info(`[API] Чат ${pinned ? 'закреплён' : 'откреплён'}: ${chatId}`);

    return NextResponse.json({ 
      success: true,
      pinned,
      chat: updatedChat
    });
  } catch (error: any) {
    logger.error('[API] Error pinning chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при закреплении чата' },
      { status: 500 }
    );
  }
}
