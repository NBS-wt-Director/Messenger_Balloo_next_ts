import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/database';

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

    const usersCollection = await getUsersCollection();

    // Обновление статуса на offline
    const userDoc = await usersCollection.findOne({ selector: { id: userId } }).exec();
    if (userDoc) {
      await userDoc.patch({
        status: 'offline',
        lastSeen: Date.now(),
        updatedAt: Date.now()
      });
    }

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

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ selector: { id: userId } }).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const userData = user.toJSON();

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        fullName: userData.fullName,
        avatar: userData.avatar,
        birthDate: userData.birthDate,
        status: userData.status,
        bio: userData.bio,
        phone: userData.phone,
        isAdmin: userData.isAdmin,
        isSuperAdmin: userData.isSuperAdmin,
        adminRoles: userData.adminRoles,
        settings: userData.settings,
        familyRelations: userData.familyRelations,
        createdAt: userData.createdAt,
        lastSeen: userData.lastSeen
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

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ selector: { id: userId } }).exec();

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
      'birthDate',
      'bio',
      'phone',
      'settings'
    ];

    const updateData: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        updateData[key] = updates[key];
      }
    }

    updateData.updatedAt = Date.now();

    await user.patch(updateData);

    const updatedUser = await usersCollection.findOne({ selector: { id: userId } }).exec();
    const userData = updatedUser?.toJSON();

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        fullName: userData.fullName,
        avatar: userData.avatar,
        birthDate: userData.birthDate,
        status: userData.status,
        bio: userData.bio,
        phone: userData.phone,
        settings: userData.settings
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
