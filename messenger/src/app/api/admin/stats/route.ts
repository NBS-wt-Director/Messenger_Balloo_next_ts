import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection, getChatsCollection, getMessagesCollection } from '@/lib/database';

/**
 * API для получения статистики админ-панели
 * GET /api/admin/stats
 */

export async function GET(request: NextRequest) {
  try {
    const usersCollection = await getUsersCollection();
    const chatsCollection = await getChatsCollection();
    const messagesCollection = await getMessagesCollection();

    // Получение количества записей
    const usersCount = await usersCollection.count().exec();
    const chatsCount = await chatsCollection.count().exec();
    const messagesCount = await messagesCollection.count().exec();

    // Получение количества банов (из localStorage или базы)
    const bansCount = 0; // Заглушка, будет реализовано в bans API

    const stats = {
      users: usersCount,
      chats: chatsCount,
      messages: messagesCount,
      bans: bansCount
    };

    return NextResponse.json({
      success: true,
      stats,
      timestamp: Date.now()
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error loading admin stats:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось загрузить статистику: ' + error.message },
      { status: 500 }
    );
  }
}
