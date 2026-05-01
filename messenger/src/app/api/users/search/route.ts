import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * GET /api/users/search
 * Поиск пользователей по email или displayName
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!query || query.length < 1) {
      return NextResponse.json({
        success: true,
        users: []
      });
    }

    const users = db.prepare(`
      SELECT id, email, displayName, avatar, userNumber, status
      FROM User
      WHERE displayName LIKE ? OR email LIKE ?
      ORDER BY userNumber ASC
      LIMIT ?
    `).all(`%${query}%`, `%${query}%`, limit) as any[];

    return NextResponse.json({
      success: true,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        avatar: u.avatar,
        userNumber: u.userNumber,
        status: u.status
      }))
    });
  } catch (error) {
    console.error('[Users Search] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске пользователей' },
      { status: 500 }
    );
  }
}
