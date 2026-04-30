import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/users/[id]/online
 * Обновление статуса онлайн пользователя
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isOnline } = body;

    if (isOnline === undefined) {
      return NextResponse.json(
        { error: 'isOnline обязателен' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        isOnline: isOnline,
        online: isOnline,
        lastSeen: new Date()
      },
      select: {
        id: true,
        isOnline: true,
        online: true,
        lastSeen: true
      }
    });

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[User Online] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении статуса' },
      { status: 500 }
    );
  }
}
