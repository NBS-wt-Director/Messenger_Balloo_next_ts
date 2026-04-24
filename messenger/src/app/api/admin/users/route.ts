import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/database';
import bcrypt from 'bcryptjs';

// Получение списка пользователей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role'); // 'admin', 'superadmin', 'all'

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    // Проверка прав администратора
    const usersCollection = await getUsersCollection();
    const admin = await usersCollection.findOne(adminId).exec();

    if (!admin || (!admin.toJSON().isAdmin && !admin.toJSON().isSuperAdmin)) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const allUsers = await usersCollection.find().exec();
    
    let filteredUsers = allUsers.filter(u => {
      const data = u.toJSON();
      
      // Фильтрация по роли
      if (role === 'admin') {
        return data.isAdmin || data.isSuperAdmin;
      } else if (role === 'superadmin') {
        return data.isSuperAdmin;
      }
      
      return true;
    });

    // Пагинация
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      users: paginatedUsers.map(u => {
        const data = u.toJSON();
        return {
          id: data.id,
          email: data.email,
          displayName: data.displayName,
          fullName: data.fullName,
          avatar: data.avatar,
          status: data.status,
          isAdmin: data.isAdmin,
          isSuperAdmin: data.isSuperAdmin,
          createdAt: data.createdAt,
          lastSeen: data.lastSeen
        };
      }),
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching users:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить список пользователей' },
      { status: 500 }
    );
  }
}

// Блокировка пользователя
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, targetUserId, action } = body; // action: 'ban', 'unban', 'makeAdmin', 'removeAdmin'

    if (!adminId || !targetUserId || !action) {
      return NextResponse.json(
        { error: 'adminId, targetUserId и action обязательны' },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const admin = await usersCollection.findOne(adminId).exec();

    if (!admin) {
      return NextResponse.json(
        { error: 'Администратор не найден' },
        { status: 404 }
      );
    }

    const adminData = admin.toJSON();
    
    // Проверка прав
    if (action === 'makeAdmin' || action === 'removeAdmin') {
      if (!adminData.isSuperAdmin) {
        return NextResponse.json(
          { error: 'Только супер-администраторы могут управлять правами' },
          { status: 403 }
        );
      }
    }

    const targetUser = await usersCollection.findOne(targetUserId).exec();
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const targetData = targetUser.toJSON();
    let updateData: Record<string, any> = {};

    switch (action) {
      case 'ban':
        updateData = {
          status: 'banned',
          updatedAt: Date.now()
        };
        break;
      case 'unban':
        updateData = {
          status: 'offline',
          updatedAt: Date.now()
        };
        break;
      case 'makeAdmin':
        updateData = {
          isAdmin: true,
          updatedAt: Date.now()
        };
        break;
      case 'removeAdmin':
        updateData = {
          isAdmin: false,
          isSuperAdmin: false,
          adminRoles: [],
          updatedAt: Date.now()
        };
        break;
      default:
        return NextResponse.json(
          { error: 'Недопустимое действие' },
          { status: 400 }
        );
    }

    const userDoc = await usersCollection.findOne({ selector: { id: targetUserId } }).exec();
    if (userDoc) {
      await userDoc.patch(updateData);
    }

    return NextResponse.json({
      success: true,
      message: `Пользователь ${action} успешно`
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error updating user:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось обновить пользователя' },
      { status: 500 }
    );
  }
}
