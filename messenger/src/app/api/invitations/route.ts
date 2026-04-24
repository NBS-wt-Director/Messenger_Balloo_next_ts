import { NextRequest, NextResponse } from 'next/server';
import { getInvitationsCollection, getChatsCollection, getUsersCollection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'code is required' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const invitation = await invitationsCollection.findOne({
      selector: { code },
      sort: [{ createdAt: 'desc' }]
    }).exec();

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const inviteData = invitation.toJSON();

    // Проверка срока действия
    if (inviteData.expiresAt && Date.now() > inviteData.expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'Invitation has expired',
        invitation: {
          ...inviteData,
          isExpired: true
        }
      });
    }

    // Проверка лимита использования
    if (inviteData.maxUses && inviteData.currentUses >= inviteData.maxUses) {
      return NextResponse.json({
        success: false,
        error: 'Invitation has reached its usage limit',
        invitation: {
          ...inviteData,
          isMaxedOut: true
        }
      });
    }

    if (!inviteData.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Invitation is no longer active',
        invitation: {
          ...inviteData,
          isInactive: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      invitation: inviteData
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching invitation:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, invitedBy, message, maxUses, expiresDays, isOneTime } = body;

    // Валидация
    if (!chatId || !invitedBy) {
      return NextResponse.json(
        { error: 'chatId и invitedBy являются обязательными' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const chatsCollection = await getChatsCollection();

    // Получение информации о чате
    const chat = await chatsCollection.findOne({ selector: { id: chatId } }).exec();
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Проверка прав на создание приглашения
    const member = chat.members[invitedBy];
    if (!member || (chat.type === 'group' && !chat.adminIds.includes(invitedBy))) {
      return NextResponse.json(
        { error: 'You do not have permission to create invitations for this chat' },
        { status: 403 }
      );
    }

    // Генерация уникального кода
    const code = `${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 8)}`;
    const now = Date.now();
    const expiresAt = expiresDays ? now + (expiresDays * 24 * 60 * 60 * 1000) : null;

    // Получение информации об отправителе
    const usersCollection = await getUsersCollection();
    const inviter = await usersCollection.findOne({ selector: { id: invitedBy } }).exec();

    // Создание приглашения
    const invitation = await invitationsCollection.insert({
      id: `inv_${code}`,
      code,
      chatId,
      invitedBy,
      invitedByEmail: inviter?.email || '',
      chatName: chat.type === 'group' ? chat.name : 'Private Chat',
      chatAvatar: chat.avatar,
      chatType: chat.type,
      message: message || `Приглашаю вас в чат "${chat.type === 'group' ? chat.name : 'Balloo'}"`,
      maxUses: maxUses || null,
      currentUses: 0,
      expiresAt,
      isActive: true,
      isOneTime: isOneTime || false,
      createdAt: now,
      updatedAt: now
    });

    return NextResponse.json({
      success: true,
      invitation: invitation.toJSON(),
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://balloo.app'}/invite/${code}`
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating invitation:', error);
    }
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId is required' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const invitation = await invitationsCollection.findOne({ selector: { id: invitationId } }).exec();

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Деактивация приглашения
    await invitation.patch({
      isActive: false,
      updatedAt: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation deactivated'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting invitation:', error);
    }
    return NextResponse.json(
      { error: 'Failed to delete invitation' },
      { status: 500 }
    );
  }
}

// Accept invitation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId } = body;

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'code и userId являются обязательными' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const chatsCollection = await getChatsCollection();

    const invitation = await invitationsCollection.findOne({
      selector: { code },
      sort: [{ createdAt: 'desc' }]
    }).exec();

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const inviteData = invitation.toJSON();

    // Проверка срока действия
    if (inviteData.expiresAt && Date.now() > inviteData.expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'Invitation has expired'
      });
    }

    // Проверка лимита использования
    if (inviteData.maxUses && inviteData.currentUses >= inviteData.maxUses) {
      return NextResponse.json({
        success: false,
        error: 'Invitation has reached its usage limit'
      });
    }

    if (!inviteData.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Invitation is no longer active'
      });
    }

    // Проверка, не состоит ли пользователь уже в чате
    const chat = await chatsCollection.findOne({ selector: { id: inviteData.chatId } }).exec();
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    if (chat.participants.includes(userId)) {
      return NextResponse.json({
        success: false,
        error: 'You are already a member of this chat'
      });
    }

    // Добавление пользователя в чат
    const chatDoc = await chatsCollection.findOne({ selector: { id: inviteData.chatId } }).exec();
    if (chatDoc) {
      const newParticipants = [...chatDoc.participants, userId];
      await chatDoc.patch({
        participants: newParticipants,
        members: {
          ...chatDoc.members,
          [userId]: {
            role: 'author',
            joinedAt: Date.now()
          }
        },
        updatedAt: Date.now()
      });
    }

    // Обновление счетчика использований
    const newCurrentUses = inviteData.currentUses + 1;
    const invDoc = await invitationsCollection.findOne({ selector: { id: invitation.id } }).exec();
    if (invDoc) {
      await invDoc.patch({
        currentUses: newCurrentUses,
        isActive: !inviteData.isOneTime && newCurrentUses < (inviteData.maxUses || Infinity),
        updatedAt: Date.now()
      });
    }

    return NextResponse.json({
      success: true,
      chatId: inviteData.chatId,
      message: 'Successfully joined the chat'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error accepting invitation:', error);
    }
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
