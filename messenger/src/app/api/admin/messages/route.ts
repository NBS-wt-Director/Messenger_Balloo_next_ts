import { NextRequest, NextResponse } from 'next/server';
import { getMessagesCollection } from '@/lib/database';

// Получение списка сообщений
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const chatId = searchParams.get('chatId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    const messagesCollection = await getMessagesCollection();
    
    let selector: any = {};
    
    if (chatId) {
      selector.chatId = chatId;
    }
    
    if (userId) {
      selector.senderId = userId;
    }

    let query = messagesCollection.find({
      selector,
      sort: [{ createdAt: 'desc' }]
    });

    const allMessages = await query.exec();
    
    // Пагинация
    const startIndex = (page - 1) * limit;
    const paginatedMessages = allMessages.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      messages: paginatedMessages.map(m => {
        const data = m.toJSON();
        return {
          id: data.id,
          chatId: data.chatId,
          senderId: data.senderId,
          type: data.type,
          content: data.content.substring(0, 200),
          createdAt: data.createdAt
        };
      }),
      pagination: {
        page,
        limit,
        total: allMessages.length,
        totalPages: Math.ceil(allMessages.length / limit)
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching messages:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить список сообщений' },
      { status: 500 }
    );
  }
}

// Удаление сообщения
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, messageId } = body;

    if (!adminId || !messageId) {
      return NextResponse.json(
        { error: 'adminId и messageId обязательны' },
        { status: 400 }
      );
    }

    const messagesCollection = await getMessagesCollection();
    const message = await messagesCollection.findOne(messageId).exec();

    if (!message) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      );
    }

    await message.remove();

    return NextResponse.json({
      success: true,
      message: 'Сообщение удалено'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting message:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить сообщение' },
      { status: 500 }
    );
  }
}
