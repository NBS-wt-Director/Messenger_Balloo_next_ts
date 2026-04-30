import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/global-search?q=...&type=users|chats|all&limit=20
 * Глобальный поиск по пользователям и чатам
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // 'users', 'chats', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Запрос должен быть не менее 2 символов' },
        { status: 400 }
      );
    }

    const result = {
      users: [] as any[],
      chats: [] as any[],
    };

    // Поиск по пользователям
    if (type === 'users' || type === 'all') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { displayName: { contains: query, mode: 'insensitive' } },
            { fullName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ]
        },
        select: {
          id: true,
          displayName: true,
          fullName: true,
          avatar: true,
          status: true,
          bio: true,
        },
        take: limit,
      });

      result.users = users;
    }

    // Поиск по чатам (группы и каналы)
    if (type === 'chats' || type === 'all') {
      const chats = await prisma.chat.findMany({
        where: {
          type: { in: ['group', 'channel'] },
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ]
        },
        select: {
          id: true,
          type: true,
          name: true,
          description: true,
          avatar: true,
          createdBy: true,
          createdAt: true,
          members: {
            select: {
              userId: true,
              role: true,
            }
          }
        },
        take: limit,
      });

      result.chats = chats;
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
