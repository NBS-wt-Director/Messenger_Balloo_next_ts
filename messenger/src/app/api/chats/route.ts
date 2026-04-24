import { NextRequest, NextResponse } from 'next/server';
import { getChatsCollection, getUsersCollection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'private', 'group', 'all'
    const favorite = searchParams.get('favorite') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const chatsCollection = await getChatsCollection();
    
    // Найти все чаты с этим пользователем
    let chats = await chatsCollection.find({
      selector: {
        participants: { $contains: userId }
      },
      sort: [{ updatedAt: 'desc' }]
    }).exec();

    // Фильтрация по типу
    if (type && type !== 'all') {
      chats = chats.filter(chat => chat.type === type);
    }

    // Фильтрация по избранному
    if (favorite) {
      chats = chats.filter(chat => chat.isFavorite?.[userId]);
    }

    // Преобразовать в JSON
    const chatsJSON = chats.map(c => c.toJSON());

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Найдено чатов для ${userId}:`, chatsJSON.length);
    }

    return NextResponse.json({
      success: true,
      chats: chatsJSON
    });
  } catch (error: any) {
    console.error('[API] Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, participants, name, description, createdBy, avatar } = body;

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

    const chatsCollection = await getChatsCollection();
    const usersCollection = await getUsersCollection();

    // Проверка участников
    for (const participantId of participants) {
      const user = await usersCollection.findOne({ selector: { id: participantId } }).exec();
      if (!user) {
        return NextResponse.json(
          { error: `User ${participantId} not found` },
          { status: 404 }
        );
      }
    }

    // Для private чата - проверить существующий
    if (type === 'private' && participants.length === 2) {
      const existingChats = await chatsCollection.find({
        selector: {
          type: 'private',
          participants: { $all: participants }
        }
      }).exec();

      if (existingChats.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[API] Чат уже существует:', existingChats[0].toJSON().id);
        }
        return NextResponse.json({
          success: true,
          chat: existingChats[0].toJSON(),
          chatId: existingChats[0].toJSON().id,
          exists: true
        });
      }
    }

    // Создание members объекта
    const members: Record<string, { role: string; joinedAt: number; lastReadMessageId?: string }> = {};
    participants.forEach((userId: string, index: number) => {
      members[userId] = {
        role: index === 0 ? 'creator' : 'author',
        joinedAt: Date.now(),
        lastReadMessageId: ''
      };
    });

    // Инициализация полей для каждого участника
    const isFavorite: Record<string, boolean> = {};
    const pinned: Record<string, boolean> = {};
    const unreadCount: Record<string, number> = {};
    participants.forEach((pid: string) => {
      isFavorite[pid] = false;
      pinned[pid] = false;
      unreadCount[pid] = 0;
    });

    // Создание чата
    const chatId = type === 'private' 
      ? `chat_${participants.sort().join('-')}`
      : `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const now = Date.now();

    await chatsCollection.insert({
      id: chatId,
      type,
      name: name || '',
      avatar: avatar || '',
      participants,
      members,
      adminIds: type === 'group' ? [createdBy] : [],
      createdBy,
      description: description || '',
      isFavorite,
      pinned,
      unreadCount,
      lastMessage: {},
      createdAt: now,
      updatedAt: now,
      isSystemChat: false
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Чат создан:', chatId);
    }

    return NextResponse.json({
      success: true,
      chat: { id: chatId, type, participants, name },
      chatId
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating chat:', error);
    }
    
    if (error.code === 'CONFLICT') {
      return NextResponse.json(
        { error: 'Чат уже существует' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create chat', details: error.message },
      { status: 500 }
    );
  }
}

