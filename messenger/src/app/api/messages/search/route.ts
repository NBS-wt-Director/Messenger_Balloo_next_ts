import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * GET /api/messages/search - Поиск по сообщениям
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const chatId = searchParams.get('chatId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!query) {
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

    const db = await getDatabase();
    const messagesCollection = db.messages;

    // Базовый селектор
    const selector: any = {
      content: {
        $regex: new RegExp(query, 'i') // Регистронезависимый поиск
      }
    };

    // Если указан chatId, ищем только в нём
    if (chatId) {
      selector.chatId = chatId;
    }

    // Выполняем поиск
    const messages = await messagesCollection.find({
      selector,
      limit,
      skip: offset,
      sort: [{ createdAt: 'desc' }]
    }).exec();

    const messagesData = messages.map(m => m.toJSON());

    // Получаем общее количество результатов
    const total = await messagesCollection.count({
      selector
    }).exec();

    logger.info(`[Search] Найдено ${messagesData.length} сообщений по запросу "${query}"`);

    return NextResponse.json({
      success: true,
      messages: messagesData,
      total,
      hasMore: offset + messagesData.length < total
    });
  } catch (error: any) {
    logger.error('[API] Error searching messages:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при поиске сообщений' },
      { status: 500 }
    );
  }
}
