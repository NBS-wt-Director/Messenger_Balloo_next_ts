import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/chats-new?userId=xxx
 * Получение списка чатов пользователя через Prisma
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Получаем все чаты где пользователь участник
    const chatMemberships = await prisma.chatMember.findMany({
      where: { userId },
      include: {
        chat: {
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
          }
        }
      }
    });

    // Преобразуем в формат чатов
    const chats = chatMemberships.map(member => {
      const chat = member.chat;
      const lastMessage = chat.messages[0];
      
      // Определяем имя чата для private чатов
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
        isSystemChat: chat.isSystemChat,
        participants: chat.members.map(m => m.userId),
        members: chat.members.reduce((acc, m) => {
          acc[m.userId] = m.role;
          return acc;
        }, {} as Record<string, string>),
        createdBy: chat.createdBy,
        createdAt: chat.createdAt.getTime(),
        updatedAt: chat.updatedAt.getTime(),
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          type: lastMessage.type,
          createdAt: lastMessage.createdAt.getTime(),
          senderId: lastMessage.senderId,
          senderName: lastMessage.sender.displayName,
        } : null,
        isFavorite: false, // Нужно добавить в отдельный запрос
        pinned: false, // Нужно добавить в отдельный запрос
        unreadCount: 0, // Нужно посчитать
      };
    });

    return NextResponse.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('[API Chats GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chats-new
 * Создание нового чата через Prisma
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, participants, name, createdBy } = body;

    // Валидация
    if (!type || !participants || !createdBy) {
      return NextResponse.json(
        { error: 'type, participants и createdBy являются обязательными' },
        { status: 400 }
      );
    }

    if (type === 'group' && !name) {
      return NextResponse.json(
        { error: 'name required for group chats' },
        { status: 400 }
      );
    }

    // Для private чата - проверить существующий
    if (type === 'private' && participants.length === 2) {
      const sortedParticipants = [...participants].sort();
      const existingChat = await prisma.chat.findFirst({
        where: {
          type: 'private',
          members: {
            every: {
              userId: { in: sortedParticipants }
            }
          }
        },
        include: {
          members: true
        }
      });

      if (existingChat) {
        return NextResponse.json({
          success: true,
          chat: { id: existingChat.id },
          exists: true
        });
      }
    }

    // Создание чата
    const chat = await prisma.chat.create({
      data: {
        type,
        name: name || null,
        createdBy,
        isSystemChat: false,
        members: {
          create: participants.map((userId: string, index: number) => ({
            userId,
            role: index === 0 ? 'creator' : 'reader',
            joinedAt: new Date()
          }))
        }
      },
      include: {
        members: true
      }
    });

    return NextResponse.json({
      success: true,
      chat: { id: chat.id },
      chatId: chat.id
    });
  } catch (error) {
    console.error('[API Chats POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}
