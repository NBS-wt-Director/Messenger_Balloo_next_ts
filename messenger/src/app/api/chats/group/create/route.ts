import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * POST /api/chats/group/create - Создание группы с настройками
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      creatorId, 
      participantIds,
      avatar,
      settings = {}
    } = body;

    if (!name || !creatorId) {
      return NextResponse.json(
        { error: 'Необходимо указать name и creatorId' },
        { status: 400 }
      );
    }

    // SQLite db уже доступен
    const chatsCollection = db.chats;
    const usersCollection = db.users;

    // Проверка существования создателя
    const creator = await usersCollection.findOne({
      selector: { id: creatorId }
    }).exec();

    if (!creator) {
      return NextResponse.json(
        { error: 'Создатель не найден' },
        { status: 404 }
      );
    }

    // Создаём групповой чат
    const chatId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    // Формируем участников с ролями
    const members: Record<string, any> = {
      [creatorId]: {
        role: 'creator',
        joinedAt: now,
        lastReadMessageId: null
      }
    };

    // Добавляем остальных участников
    const participants = participantIds?.filter((id: string) => id !== creatorId) || [];
    participants.forEach((id: string) => {
      members[id] = {
        role: settings.defaultRole || 'reader',
        joinedAt: now,
        lastReadMessageId: null
      };
    });

    // Создаём чат
    await chatsCollection.insert({
      id: chatId,
      type: 'group',
      name,
      description: description || '',
      avatar: avatar || null,
      participants: [creatorId, ...participants],
      members,
      adminIds: [creatorId],
      createdBy: creatorId,
      settings: {
        onlyAdminsCanPost: settings.onlyAdminsCanPost || false,
        editGroupInfo: settings.editGroupInfo || 'all', // 'all', 'admins', 'creator'
        ...settings
      },
      isFavorite: {},
      pinned: {},
      unreadCount: {},
      lastMessage: null,
      createdAt: now,
      updatedAt: now,
      isSystemChat: false
    });

    return NextResponse.json({
      success: true,
      chatId,
      chat: {
        id: chatId,
        type: 'group',
        name,
        description: description || '',
        avatar,
        createdBy: creatorId,
        members,
        createdAt: now
      },
      message: 'Групповой чат успешно создан'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating group chat:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при создании группы' },
      { status: 500 }
    );
  }
}
