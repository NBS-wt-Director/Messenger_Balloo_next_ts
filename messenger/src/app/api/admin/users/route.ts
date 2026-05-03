import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import bcrypt from 'bcryptjs';

function getUserById(id: string): any {
  return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as any || null;
}

function getUsers(limit: number = 100, offset: number = 0): any[] {
  return db.prepare('SELECT * FROM User LIMIT ? OFFSET ?').all(limit, offset) as any[];
}

// Получение списка пользователей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role');

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    // Проверка прав администратора
    const admin = getUserById(adminId);

    if (!admin || !(admin.adminRoles?.includes('admin') || admin.adminRoles?.includes('superadmin'))) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const allUsers = getUsers(1000, 0);
    
    let filteredUsers = allUsers.filter(u => {
      const hasAdminRole = u.adminRoles?.includes('admin') || u.adminRoles?.includes('superadmin');
      const isSuperAdmin = u.adminRoles?.includes('superadmin');
      
      if (role === 'admin') {
        return hasAdminRole;
      } else if (role === 'superadmin') {
        return isSuperAdmin;
      }
      
      return true;
    });

    // Пагинация
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      users: paginatedUsers.map(u => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        fullName: u.fullName,
        avatar: u.avatar,
        status: u.status,
        isAdmin: u.adminRoles?.includes('admin') || false,
        isSuperAdmin: u.adminRoles?.includes('superadmin') || false,
        createdAt: u.createdAt,
        lastSeen: null
      })),
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
    const { adminId, targetUserId, action } = body;

    if (!adminId || !targetUserId || !action) {
      return NextResponse.json(
        { error: 'adminId, targetUserId и action обязательны' },
        { status: 400 }
      );
    }

    const admin = getUserById(adminId);

    if (!admin) {
      return NextResponse.json(
        { error: 'Администратор не найден' },
        { status: 404 }
      );
    }

    const adminRoles = admin.adminRoles || [];
    
    // Проверка прав
    if (action === 'makeAdmin' || action === 'removeAdmin') {
      if (!adminRoles.includes('superadmin')) {
        return NextResponse.json(
          { error: 'Только супер-администраторы могут управлять правами' },
          { status: 403 }
        );
      }
    }

    const targetUser = getUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    let updateData: Record<string, any> = {};
    const now = new Date().toISOString();

    switch (action) {
      case 'ban':
        updateData = { status: 'banned' };
        db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?').run('banned', now, targetUserId);
        break;
      case 'unban':
        db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?').run('offline', now, targetUserId);
        break;
      case 'makeAdmin':
        db.prepare('UPDATE User SET adminRoles = ?, updatedAt = ? WHERE id = ?')
          .run(JSON.stringify(['admin']), now, targetUserId);
        break;
      case 'removeAdmin':
        db.prepare('UPDATE User SET adminRoles = ?, updatedAt = ? WHERE id = ?')
          .run(JSON.stringify([]), now, targetUserId);
        break;
      default:
        return NextResponse.json(
          { error: 'Недопустимое действие' },
          { status: 400 }
        );
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
