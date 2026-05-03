import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

function getUserById(id: string): any {
  return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as any || null;
}

function updateUser(id: string, data: any): any {
  const updates: string[] = [];
  const params: any[] = [];
  
  for (const key of ['displayName', 'fullName', 'phone', 'status', 'avatar']) {
    if (data[key] !== undefined) {
      updates.push(`${key} = ?`);
      params.push(data[key]);
    }
  }
  
  if (updates.length === 0) return getUserById(id);
  
  updates.push('updatedAt = ?');
  params.push(new Date().toISOString(), id);
  
  db.prepare(`UPDATE User SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  return getUserById(id);
}

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
    db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?').run('offline', new Date().toISOString(), userId);

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

    const user = getUserById(userId);

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
        avatarHistory: JSON.parse(user.avatarHistory || '[]'),
        birthDate: null,
        status: user.status,
        bio: user.bio,
        phone: user.phone,
        isAdmin: user.adminRoles?.includes('admin') || false,
        isSuperAdmin: user.adminRoles?.includes('superadmin') || false,
        settings: JSON.parse(user.settings || '{}'),
        createdAt: user.createdAt,
        lastSeen: null,
        userNumber: user.userNumber || null,
        points: user.points || -55,
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

    const user = getUserById(userId);

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

    const updatedUser = updateUser(userId, updateData);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser!.id,
        email: updatedUser!.email,
        displayName: updatedUser!.displayName,
        fullName: updatedUser!.fullName,
        avatar: updatedUser!.avatar,
        status: updatedUser!.status,
        bio: updatedUser!.bio,
        phone: updatedUser!.phone
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
