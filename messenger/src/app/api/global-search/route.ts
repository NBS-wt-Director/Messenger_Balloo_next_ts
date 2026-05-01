import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * GET /api/global-search?q=...&type=users|groups|communities|all&limit=20&userId=...
 * Глобальный поиск по пользователям и чатам
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = {
      users: [] as any[],
      groups: [] as any[],
      communities: [] as any[],
      totalGroups: 0,
      totalCommunities: 0,
    };

    // Если запрос пустой или меньше 2 символов - возвращаем всё
    if (!query || query.length < 2) {
      const allChats = db.prepare(`
        SELECT * FROM Chat WHERE type IN ('group', 'channel') LIMIT 200
      `).all() as any[];

      result.groups = allChats.filter((c: any) => c.type === 'group');
      result.communities = allChats.filter((c: any) => c.type === 'channel');
      result.totalGroups = result.groups.length;
      result.totalCommunities = result.communities.length;

      if (type !== 'users' && type !== 'all') {
        return NextResponse.json({
          success: true,
          ...result,
          query: query || '(все)'
        });
      }

      if (type === 'users' || type === 'all') {
        const users = db.prepare(`
          SELECT id, displayName, fullName, avatar, status, bio FROM User LIMIT ?
        `).all(limit) as any[];
        result.users = users;
      }

      return NextResponse.json({
        success: true,
        ...result,
        query: query || '(все)'
      });
    }

    // Поиск по пользователям
    if (type === 'users' || type === 'all') {
      const users = db.prepare(`
        SELECT id, displayName, fullName, avatar, status, bio FROM User
        WHERE displayName LIKE ? OR fullName LIKE ? OR email LIKE ?
        LIMIT ?
      `).all(`%${query}%`, `%${query}%`, `%${query}%`, limit) as any[];
      result.users = users;
    }

    // Поиск по группам
    if (type === 'groups' || type === 'all') {
      const groups = db.prepare(`
        SELECT * FROM Chat WHERE type = 'group' AND (name LIKE ? OR description LIKE ?) LIMIT ?
      `).all(`%${query}%`, `%${query}%`, limit) as any[];
      result.groups = groups;
      result.totalGroups = groups.length;
    }

    // Поиск по сообществам
    if (type === 'communities' || type === 'all') {
      const communities = db.prepare(`
        SELECT * FROM Chat WHERE type = 'channel' AND (name LIKE ? OR description LIKE ?) LIMIT ?
      `).all(`%${query}%`, `%${query}%`, limit) as any[];
      result.communities = communities;
      result.totalCommunities = communities.length;
    }

    return NextResponse.json({
      success: true,
      ...result,
      query
    });
  } catch (error) {
    console.error('[Global Search] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске' },
      { status: 500 }
    );
  }
}
