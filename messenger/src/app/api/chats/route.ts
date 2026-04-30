import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/chats?userId=xxx
 * Получение списка чатов пользователя через Prisma
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const favorite = searchParams.get('favorite') === 'true';

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
      
      let chatName = chat.name;
      if (chat.type === 'private' && !chatName) {
        // Для частного чата - проверить это "Мои заметки"
        const isNotesChat = chat.isSystemChat && chat.members.length === 1 && chat.members[0].userId === userId;
        if (isNotesChat) {
          chatName = 'Мои заметки';
        } else {
          const otherMember = chat.members.find(m => m.userId !== userId);
          chatName = otherMember?.user.displayName || 'Пользователь';
        }
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
        createdAt: Number(chat.createdAt),
        updatedAt: Number(chat.updatedAt),
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          type: lastMessage.type,
          createdAt: Number(lastMessage.createdAt),
          senderId: lastMessage.senderId,
          senderName: lastMessage.sender.displayName,
        } : null,
        isFavorite: false,
        pinned: false,
        unreadCount: 0,
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
 * POST /api/chats
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

    // Для частного чата - автоматически добавить участников в контакты друг друга
    if (type === 'private' && participants.length === 2) {
      const [user1, user2] = participants;
      
      // Добавляем user2 в контакты user1
      await prisma.contact.upsert({
        where: {
          userId_contactId: {
            userId: user1,
            contactId: user2
          }
        },
        update: {},
        create: {
          userId: user1,
          contactId: user2,
          name: user2 === 'support' ? 'Техподдержка' : `User ${user2}`
        }
      });

      // Добавляем user1 в контакты user2 (зеркально)
      await prisma.contact.upsert({
        where: {
          userId_contactId: {
            userId: user2,
            contactId: user1
          }
        },
        update: {},
        create: {
          userId: user2,
          contactId: user1,
          name: user1 === 'support' ? 'Техподдержка' : `User ${user1}`
        }
      });

      // Создаем семейные связи (если не существуют)
      await prisma.familyRelation.upsert({
        where: {
          userId_relatedUserId: {
            userId: user1,
            relatedUserId: user2
          }
        },
        update: {},
        create: {
          userId: user1,
          relatedUserId: user2,
          type: 'friend'
        }
      });

      await prisma.familyRelation.upsert({
        where: {
          userId_relatedUserId: {
            userId: user2,
            relatedUserId: user1
          }
        },
        update: {},
        create: {
          userId: user2,
          relatedUserId: user1,
          type: 'friend'
        }
      });
    }

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

