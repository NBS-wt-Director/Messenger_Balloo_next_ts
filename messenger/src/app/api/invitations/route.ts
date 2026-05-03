import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

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

    const invitation = db.prepare('SELECT * FROM Invitation WHERE code = ?').get(code) as any;

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const now = Date.now();
    const expiresAt = invitation.expiresAt ? new Date(invitation.expiresAt).getTime() : null;

    // Проверка срока действия
    if (expiresAt && now > expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'Invitation has expired',
        invitation: { ...invitation, isExpired: true }
      });
    }

    // Проверка лимита использования
    if (invitation.maxUses && invitation.usedCount >= invitation.maxUses) {
      return NextResponse.json({
        success: false,
        error: 'Invitation has reached its usage limit',
        invitation: { ...invitation, isMaxedOut: true }
      });
    }

    if (!invitation.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Invitation is no longer active',
        invitation: { ...invitation, isInactive: true }
      });
    }

    return NextResponse.json({
      success: true,
      invitation
    });
  } catch (error) {
    console.error('[API] Error fetching invitation:', error);
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

    if (!chatId || !invitedBy) {
      return NextResponse.json(
        { error: 'chatId и invitedBy являются обязательными' },
        { status: 400 }
      );
    }

    const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(chatId) as any;
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    const member = db.prepare('SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?').get(chatId, invitedBy) as any;
    if (!member) {
      return NextResponse.json(
        { error: 'You do not have permission to create invitations for this chat' },
        { status: 403 }
      );
    }

    const code = `${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 8)}`;
    const now = new Date().toISOString();
    const expiresAt = expiresDays ? new Date(Date.now() + (expiresDays * 24 * 60 * 60 * 1000)).toISOString() : null;

    const inviter = db.prepare('SELECT email FROM User WHERE id = ?').get(invitedBy) as any;

    const invitationId = `inv_${code}`;
    db.prepare(`
      INSERT INTO Invitation (id, code, chatId, fromUserId, status, createdAt, expiresAt, maxUses, usedCount, isActive)
      VALUES (?, ?, ?, ?, 'active', ?, ?, ?, 0, 1)
    `).run(
      invitationId, code, chatId, invitedBy, now, expiresAt, maxUses || null
    );

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitationId,
        code,
        chatId,
        invitedBy,
        chatName: chat.type === 'group' ? chat.name : 'Private Chat',
        chatType: chat.type,
        message: message || `Приглашаю вас в чат`,
        maxUses: maxUses || null,
        usedCount: 0,
        expiresAt,
        isActive: true,
        createdAt: now
      },
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://balloo.app'}/invite/${code}`
    });
  } catch (error) {
    console.error('[API] Error creating invitation:', error);
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

    const invitation = db.prepare('SELECT * FROM Invitation WHERE id = ?').get(invitationId) as any;

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    db.prepare('UPDATE Invitation SET isActive = 0, updatedAt = ? WHERE id = ?').run(
      new Date().toISOString(), invitationId
    );

    return NextResponse.json({
      success: true,
      message: 'Invitation deactivated'
    });
  } catch (error) {
    console.error('[API] Error deleting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to delete invitation' },
      { status: 500 }
    );
  }
}

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

    const invitation = db.prepare('SELECT * FROM Invitation WHERE code = ?').get(code) as any;

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const now = Date.now();
    const expiresAt = invitation.expiresAt ? new Date(invitation.expiresAt).getTime() : null;

    if (expiresAt && now > expiresAt) {
      return NextResponse.json({ success: false, error: 'Invitation has expired' });
    }

    if (invitation.maxUses && invitation.usedCount >= invitation.maxUses) {
      return NextResponse.json({ success: false, error: 'Invitation has reached its usage limit' });
    }

    if (!invitation.isActive) {
      return NextResponse.json({ success: false, error: 'Invitation is no longer active' });
    }

    const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(invitation.chatId) as any;
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const member = db.prepare('SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?').get(invitation.chatId, userId) as any;
    if (member) {
      return NextResponse.json({ success: false, error: 'You are already a member of this chat' });
    }

    const nowIso = new Date().toISOString();
    db.prepare('INSERT INTO ChatMember (chatId, userId, role, joinedAt) VALUES (?, ?, ?, ?)')
      .run(invitation.chatId, userId, 'author', nowIso);

    const newUsedCount = invitation.usedCount + 1;
    const isOneTime = invitation.isOneTime === 1 || invitation.isOneTime === true;
    const shouldStayActive = !isOneTime && newUsedCount < (invitation.maxUses || Infinity);
    db.prepare('UPDATE Invitation SET usedCount = ?, isActive = ?, updatedAt = ? WHERE id = ?')
      .run(newUsedCount, shouldStayActive ? 1 : 0, nowIso, invitation.id);

    return NextResponse.json({
      success: true,
      chatId: invitation.chatId,
      message: 'Successfully joined the chat'
    });
  } catch (error) {
    console.error('[API] Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
