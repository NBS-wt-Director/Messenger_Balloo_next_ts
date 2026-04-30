import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/global-search?q=...&type=users|groups|communities|all&limit=20&userId=...
 * Глобальный поиск по пользователям и чатам
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // 'users', 'groups', 'communities', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');

    const result = {
      users: [] as any[],
      groups: [] as any[], // Группы (малые чаты)
      communities: [] as any[], // Сообщества (большие чаты/каналы)
      totalGroups: 0,
      totalCommunities: 0,
    };

    // Если запрос пустой или меньше 2 символов - возвращаем всё (если чатов < 200)
    if (!query || query.length < 2) {
      // Получаем все группы и сообщества
      const allChats = await prisma.chat.findMany({
        where: {
          type: { in: ['group', 'channel'] }
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
        take: 200,
      });

      // Разделяем на группы и сообщества
      result.groups = allChats.filter(c => c.type === 'group');
      result.communities = allChats.filter(c => c.type === 'channel');
      result.totalGroups = result.groups.length;
      result.totalCommunities = result.communities.length;

      // Если пользователей не ищем - возвращаем чаты
      if (type !== 'users' && type !== 'all') {
        return NextResponse.json({
          success: true,
          ...result,
          query: query || '(все)'
        });
      }

      // Получаем пользователей
      if (type === 'users' || type === 'all') {
        const users = await prisma.user.findMany({
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

      return NextResponse.json({
        success: true,
        ...result,
        query: query || '(все)'
      });
    }

    // Поиск по пользователям
    if (type === 'users' || type === 'all') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { displayName: { contains: query } },
            { fullName: { contains: query } },
            { email: { contains: query } },
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

    // Поиск по группам (малые чаты)
    if (type === 'groups' || type === 'all') {
      const groups = await prisma.chat.findMany({
        where: {
          type: 'group',
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
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

      result.groups = groups;
      result.totalGroups = groups.length;
    }

    // Поиск по сообществам (каналы/большие чаты)
    if (type === 'communities' || type === 'all') {
      const communities = await prisma.chat.findMany({
        where: {
          type: 'channel',
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
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
