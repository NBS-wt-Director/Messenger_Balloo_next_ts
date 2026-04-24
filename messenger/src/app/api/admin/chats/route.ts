import { NextRequest, NextResponse } from 'next/server';
import { getChatsCollection, getMessagesCollection } from '@/lib/database';

// Получение списка чатов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const type = searchParams.get('type'); // 'private', 'group', 'all'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    const chatsCollection = await getChatsCollection();
    const admin = await chatsCollection.findOne(adminId).exec();

    if (!admin) {
      return NextResponse.json(
        { error: 'Администратор не найден' },
        { status: 404 }
      );
    }

    let allChats = await chatsCollection.find().exec();
    
    // Фильтрация по типу
    if (type && type !== 'all') {
      allChats = allChats.filter(c => c.toJSON().type === type);
    }

    // Пагинация
    const startIndex = (page - 1) * limit;
    const paginatedChats = allChats.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      chats: paginatedChats.map(c => {
        const data = c.toJSON();
        return {
          id: data.id,
          type: data.type,
          name: data.name,
          participants: data.participants.length,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      }),
      pagination: {
        page,
        limit,
        total: allChats.length,
        totalPages: Math.ceil(allChats.length / limit)
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching chats:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить список чатов' },
      { status: 500 }
    );
  }
}

// Удаление чата
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, chatId } = body;

    if (!adminId || !chatId) {
      return NextResponse.json(
        { error: 'adminId и chatId обязательны' },
        { status: 400 }
      );
    }

    const chatsCollection = await getChatsCollection();
    const messagesCollection = await getMessagesCollection();

    const chat = await chatsCollection.findOne(chatId).exec();
    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    // Удаление всех сообщений в чате
    const messages = await messagesCollection.find({
      selector: { chatId }
    }).exec();

    for (const message of messages) {
      await message.remove();
    }

    // Удаление чата
    await chat.remove();

    return NextResponse.json({
      success: true,
      message: 'Чат и все сообщения удалены'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting chat:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить чат' },
      { status: 500 }
    );
  }
}
