import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * API для получения статистики админ-панели
 * GET /api/admin/stats
 */

export async function GET(request: NextRequest) {
  try {
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM User').get() as any;
    const chatsCount = db.prepare('SELECT COUNT(*) as count FROM Chat').get() as any;
    const messagesCount = db.prepare('SELECT COUNT(*) as count FROM Message').get() as any;
    const bansCount = db.prepare('SELECT COUNT(*) as count FROM Ban').get() as any;

    const stats = {
      users: usersCount.count,
      chats: chatsCount.count,
      messages: messagesCount.count,
      bans: bansCount.count
    };

    return NextResponse.json({
      success: true,
      stats,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('[API] Error loading admin stats:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить статистику' },
      { status: 500 }
    );
  }
}
