import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Выход (обновление статуса на offline)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId требуется' },
        { status: 400 }
      );
    }

    // Обновление статуса на offline
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'offline',
        lastSeen: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Выход выполнен успешно'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error logging out:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось выполнить выход' },
      { status: 500 }
    );
  }
}

// Получение текущего пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId требуется' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        fullName: user.fullName,
        avatar: user.avatar,
        birthDate: user.birthDate?.getTime(),
        status: user.status,
        bio: user.bio,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        settings: user.settings as any,
        createdAt: user.createdAt.getTime(),
        lastSeen: user.lastSeen?.getTime()
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching user:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить данные пользователя' },
      { status: 500 }
    );
  }
}

// Обновление профиля
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'userId и updates обязательны' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Разрешенные поля для обновления
    const allowedUpdates = [
      'displayName',
      'fullName',
      'avatar',
      'bio',
      'phone'
    ];

    const updateData: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        updateData[key] = updates[key];
      }
    }

    updateData.updatedAt = new Date();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        fullName: updatedUser.fullName,
        avatar: updatedUser.avatar,
        status: updatedUser.status,
        bio: updatedUser.bio,
        phone: updatedUser.phone
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error updating profile:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось обновить профиль' },
      { status: 500 }
    );
  }
}
