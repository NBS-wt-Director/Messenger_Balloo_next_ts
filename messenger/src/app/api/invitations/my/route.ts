import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId требуется' }, { status: 400 });
    }

    const now = Date.now();
    const invitations = db.prepare(`
      SELECT * FROM Invitation 
      WHERE fromUserId = ? 
      ORDER BY createdAt DESC
    `).all(userId) as any[];

    const invitationsWithChat = invitations.map(inv => {
      const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(inv.chatId) as any;
      const expiresAt = inv.expiresAt ? new Date(inv.expiresAt).getTime() : null;
      
      return {
        ...inv,
        chatName: chat?.name || 'Личный чат',
        chatAvatar: chat?.avatar,
        chatType: chat?.type || 'private',
        isExpired: expiresAt ? expiresAt < now : false,
        isActive: inv.isActive && (!expiresAt || expiresAt > now),
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${inv.code}`
      };
    });

    return NextResponse.json({
      success: true,
      invitations: invitationsWithChat,
      count: invitationsWithChat.length
    });
  } catch (error: any) {
    console.error('[API] Error fetching invitations:', error);
    return NextResponse.json({ error: 'Не удалось получить приглашения' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, invitedBy, message, maxUses = 0, expiresAt, isOneTime = false } = body;

    if (!chatId || !invitedBy) {
      return NextResponse.json({ error: 'chatId и invitedBy обязательны' }, { status: 400 });
    }

    const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(chatId) as any;
    if (!chat) {
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    const code = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const expiresAtIso = expiresAt ? new Date(expiresAt).toISOString() : new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString();
    const invitationId = `invitation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    db.prepare(`
      INSERT INTO Invitation (id, code, chatId, fromUserId, status, createdAt, expiresAt, maxUses, usedCount, isActive, isOneTime)
      VALUES (?, ?, ?, ?, 'active', ?, ?, ?, 0, 1, ?)
    `).run(invitationId, code, chatId, invitedBy, now, expiresAtIso, maxUses, isOneTime);

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${code}`;

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitationId,
        code,
        chatId,
        invitedBy,
        chatName: chat.name || 'Личный чат',
        chatType: chat.type,
        message: message || '',
        maxUses,
        usedCount: 0,
        expiresAt: expiresAtIso,
        isActive: true,
        isOneTime,
        createdAt: now,
        inviteUrl
      },
      message: 'Приглашение создано'
    });
  } catch (error: any) {
    console.error('[API] Error creating invitation:', error);
    return NextResponse.json({ error: 'Не удалось создать приглашение' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json({ error: 'invitationId требуется' }, { status: 400 });
    }

    const invitation = db.prepare('SELECT * FROM Invitation WHERE id = ?').get(invitationId) as any;

    if (!invitation) {
      return NextResponse.json({ error: 'Приглашение не найдено' }, { status: 404 });
    }

    db.prepare('UPDATE Invitation SET isActive = 0, updatedAt = ? WHERE id = ?')
      .run(new Date().toISOString(), invitationId);

    return NextResponse.json({ success: true, message: 'Приглашение деактивировано' });
  } catch (error: any) {
    console.error('[API] Error deleting invitation:', error);
    return NextResponse.json({ error: 'Не удалось удалить приглашение' }, { status: 500 });
  }
}
