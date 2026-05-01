import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { getUserById, updateUser } from '@/lib/prisma';

/**
 * GET /api/users/[id]
 * Получение информации о пользователе
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = getUserById(id);

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
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        isOnline: user.isOnline === 1,
        online: user.online === 1,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isAdmin: user.adminRoles?.includes('admin') || false,
        userNumber: user.userNumber || null,
        // points НЕ возвращаем другим пользователям!
      }
    });
  } catch (error) {
    console.error('[User GET] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении данных пользователя' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Обновление профиля пользователя
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { displayName, fullName, phone, status, avatar } = body;

    // Валидация
    if (!displayName && !fullName && !phone && !status && !avatar) {
      return NextResponse.json(
        { error: 'Нет данных для обновления' },
        { status: 400 }
      );
    }

    // Проверка существования
    const existingUser = getUserById(id);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Обновление
    const updateData: any = {};
    if (displayName) updateData.displayName = displayName;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (status !== undefined) updateData.status = status;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = updateUser(id, updateData);

    return NextResponse.json({
      success: true,
      user: {
        id: user!.id,
        email: user!.email,
        displayName: user!.displayName,
        fullName: user!.fullName,
        phone: user!.phone,
        avatar: user!.avatar,
        status: user!.status,
        isOnline: user!.isOnline === 1,
        online: user!.online === 1,
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt,
      }
    });
  } catch (error) {
    console.error('[User PUT] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении профиля' },
      { status: 500 }
    );
  }
}
