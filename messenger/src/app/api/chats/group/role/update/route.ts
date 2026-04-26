import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { GroupRole } from '@/types';

/**
 * PUT /api/chats/group/role/update - Назначить роль участнику
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userId, role, operatedBy } = body;

    if (!chatId || !userId || !role || !operatedBy) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId, userId, role и operatedBy' },
        { status: 400 }
      );
    }

    const validRoles: GroupRole[] = ['creator', 'moderator', 'author', 'reader'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Недопустимая роль. Доступны: creator, moderator, author, reader' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const chatsCollection = db.chats;

    const chat = await chatsCollection.findOne({
      selector: { id: chatId }
    }).exec();

    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    const chatData = chat.toJSON();

    // Проверка прав оператора
    const operatorMember = chatData.members[operatedBy];
    if (!operatorMember) {
      return NextResponse.json(
        { error: 'Вы не являетесь участником этого чата' },
        { status: 403 }
      );
    }

    // Только creator может назначать роли
    if (operatorMember.role !== 'creator') {
      return NextResponse.json(
        { error: 'Только создатель группы может назначать роли' },
        { status: 403 }
      );
    }

    // Проверка, что пользователь является участником
    if (!chatData.members[userId]) {
      return NextResponse.json(
        { error: 'Пользователь не является участником чата' },
        { status: 400 }
      );
    }

    // Нельзя изменить роль создателя
    if (userId === chatData.createdBy && role !== 'creator') {
      return NextResponse.json(
        { error: 'Нельзя изменить роль создателя группы' },
        { status: 400 }
      );
    }

    // Обновляем роль
    const updatedMembers = {
      ...chatData.members,
      [userId]: {
        ...chatData.members[userId],
        role
      }
    };

    // Обновляем adminIds если нужно
    const adminIds = new Set(chatData.adminIds || []);
    if (role === 'creator' || role === 'moderator') {
      adminIds.add(userId);
    } else if (userId !== chatData.createdBy) {
      adminIds.delete(userId);
    }

    await chat.atomicUpdate(() => ({
      ...chatData,
      members: updatedMembers,
      adminIds: Array.from(adminIds),
      updatedAt: Date.now()
    }));

    return NextResponse.json({
      success: true,
      message: 'Роль успешно назначена',
      member: {
        userId,
        role
      }
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error setting role:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при назначении роли' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chats/group/role/list - Получить список ролей и прав
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    roles: {
      creator: {
        description: 'Создатель группы',
        permissions: [
          'canWrite',
          'canRead',
          'canManageMembers',
          'canManageRoles',
          'canDelete',
          'canEditGroup',
          'canDeleteMessages',
          'canPinMessages'
        ]
      },
      moderator: {
        description: 'Модератор',
        permissions: [
          'canWrite',
          'canRead',
          'canManageMembers',
          'canDeleteMessages'
        ]
      },
      author: {
        description: 'Автор (может писать сообщения)',
        permissions: [
          'canWrite',
          'canRead'
        ]
      },
      reader: {
        description: 'Читатель (только просмотр)',
        permissions: [
          'canRead'
        ]
      }
    }
  });
}
