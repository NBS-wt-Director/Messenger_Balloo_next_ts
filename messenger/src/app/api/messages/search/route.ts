import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/messages/search?q=...&chatId=...&userId=...&limit=20
 * Поиск по сообщениям
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const chatId = searchParams.get('chatId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 1) {
      return NextResponse.json(
        { error: 'Поисковый запрос обязателен' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId обязателен' },
        { status: 400 }
      );
    }

    // Проверка участия пользователя в чате (если указан chatId)
    if (chatId) {
      const member = await prisma.chatMember.findFirst({
        where: {
          chatId,
          userId
        }
      });

      if (!member) {
        return NextResponse.json(
          { error: 'У вас нет доступа к этому чату' },
          { status: 403 }
        );
      }
    }

    // Поиск сообщений
    const where: any = {
      content: {
        contains: query,
        mode: 'insensitive'
      }
    };

    // Если указан chatId, ищем только в нём
    if (chatId) {
      where.chatId = chatId;
    } else {
      // Иначе ищем только в чатах где пользователь участник
      const userChatIds = await prisma.chatMember.findMany({
        where: { userId },
        select: { chatId: true }
      });
      
      where.chatId = {
        in: userChatIds.map(c => c.chatId)
      };
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        chat: {
          select: {
            id: true,
            type: true,
            name: true,
            avatar: true,
            members: {
              where: { userId },
              select: {
                userId: true,
                role: true,
              }
            }
          }
        },
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Получаем общее количество
    const total = await prisma.message.count({ where });

    return NextResponse.json({
      success: true,
      messages: messages.map(msg => ({
        id: msg.id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        sender: msg.sender,
        type: msg.type,
        content: msg.content,
        mediaUrl: msg.mediaUrl,
        createdAt: Number(msg.createdAt),
        chat: msg.chat,
      })),
      total,
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error('[Message Search] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске сообщений' },
      { status: 500 }
    );
  }
}
