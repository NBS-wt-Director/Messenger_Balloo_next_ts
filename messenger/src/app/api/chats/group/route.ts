import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * POST /api/chats/group - Создание группового чата
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      creatorId, 
      participantIds,
      avatar 
    } = body;

    if (!name || !creatorId || !participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'Необходимо указать name, creatorId и participantIds' },
        { status: 400 }
      );
    }

    // SQLite db уже доступен
    const chatsCollection = db.chats;

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

    // Добавляем остальных участников как readers
    participantIds.forEach((id: string) => {
      if (id !== creatorId) {
        members[id] = {
          role: 'reader',
          joinedAt: now,
          lastReadMessageId: null
        };
      }
    });

    await chatsCollection.insert({
      id: chatId,
      type: 'group',
      name,
      description: description || '',
      avatar: avatar || null,
      participants: [creatorId, ...participantIds],
      members,
      adminIds: [creatorId],
      createdBy: creatorId,
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

/**
 * PUT /api/chats/group - Обновление группового чата
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, name, description, avatar } = body;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId' },
        { status: 400 }
      );
    }

    // SQLite db уже доступен
    const chatsCollection = db.chats;

    const chat = await chatsCollection.findOne({
      selector: { id: chatId }
    }).exec();

    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    await chat.atomicUpdate(() => ({
      ...chat.toJSON(),
      name: name || chat.name,
      description: description !== undefined ? description : chat.description,
      avatar: avatar !== undefined ? avatar : chat.avatar,
      updatedAt: Date.now()
    }));

    return NextResponse.json({
      success: true,
      message: 'Чат успешно обновлён'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error updating group chat:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при обновлении группы' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chats/group - Удаление группового чата
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId } = body;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId' },
        { status: 400 }
      );
    }

    // SQLite db уже доступен
    const chatsCollection = db.chats;

    const chat = await chatsCollection.findOne({
      selector: { id: chatId }
    }).exec();

    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    await chat.remove();

    return NextResponse.json({
      success: true,
      message: 'Чат успешно удалён'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting group chat:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении группы' },
      { status: 500 }
    );
  }
}
