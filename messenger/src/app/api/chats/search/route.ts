import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/chats/search?q=...&userId=...&limit=20
 * Поиск по чатам пользователя
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
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

    // Получаем все чаты пользователя
    const userChatMemberships = await prisma.chatMember.findMany({
      where: { userId },
      select: { chatId: true }
    });

    const userChatIds = userChatMemberships.map(m => m.chatId);

    if (userChatIds.length === 0) {
      return NextResponse.json({
        success: true,
        chats: [],
        total: 0
      });
    }

    // Поиск по чатам
    const chats = await prisma.chat.findMany({
      where: {
        id: { in: userChatIds },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatar: true,
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                displayName: true,
              }
            }
          }
        }
      },
      take: limit,
    });

    // Форматирование результатов
    const formattedChats = chats.map(chat => {
      const lastMessage = chat.messages[0];
      
      let chatName = chat.name;
      if (chat.type === 'private' && !chatName) {
        const otherMember = chat.members.find(m => m.userId !== userId);
        chatName = otherMember?.user.displayName || 'Пользователь';
      }

      return {
        id: chat.id,
        type: chat.type,
        name: chatName,
        avatar: chat.avatar,
        description: chat.description,
        participants: chat.members.map(m => m.userId),
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          type: lastMessage.type,
          createdAt: lastMessage.createdAt.getTime(),
          senderId: lastMessage.senderId,
          senderName: lastMessage.sender.displayName,
        } : null,
      };
    });

    const total = await prisma.chat.count({
      where: {
        id: { in: userChatIds },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ]
      }
    });

    return NextResponse.json({
      success: true,
      chats: formattedChats,
      total,
      hasMore: formattedChats.length === limit
    });
  } catch (error) {
    console.error('[Chats Search] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске чатов' },
      { status: 500 }
    );
  }
}
