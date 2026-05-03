import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * API для восстановления из бэкапа
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, backupData, options } = body;

    if (!adminId || !backupData) {
      return NextResponse.json(
        { error: 'adminId и backupData обязательны' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Restore] Starting restore for admin ${adminId}`);
    }

    // SQLite db уже доступен
    const now = Date.now();
    const stats = {
      users: 0,
      chats: 0,
      messages: 0,
      invitations: 0,
      attachments: 0,
      contacts: 0,
      notifications: 0
    };

    // Восстановление пользователей
    if (backupData.users && options?.restoreUsers !== false) {
      for (const userData of backupData.users) {
        try {
          const existing = await db.users.findOne(userData.id).exec();
          if (existing) {
            await existing.update({ $set: { ...userData, updatedAt: now } });
          } else {
            await db.users.insert({ ...userData, createdAt: userData.createdAt || now });
          }
          stats.users++;
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error restoring user:', userData.id, e);
          }
        }
      }
    }

    // Восстановление чатов
    if (backupData.chats && options?.restoreChats !== false) {
      for (const chatData of backupData.chats) {
        try {
          const existing = await db.chats.findOne(chatData.id).exec();
          if (existing) {
            await existing.update({ $set: { ...chatData, updatedAt: now } });
          } else {
            await db.chats.insert({ ...chatData, createdAt: chatData.createdAt || now });
          }
          stats.chats++;
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error restoring chat:', chatData.id, e);
          }
        }
      }
    }

    // Восстановление сообщений
    if (backupData.messages && options?.restoreMessages !== false) {
      for (const messageData of backupData.messages) {
        try {
          const existing = await db.messages.findOne(messageData.id).exec();
          if (!existing) {
            await db.messages.insert({ ...messageData, createdAt: messageData.createdAt || now });
          }
          stats.messages++;
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error restoring message:', messageData.id, e);
          }
        }
      }
    }

    // Восстановление контактов
    if (backupData.contacts && options?.restoreContacts !== false) {
      for (const contactData of backupData.contacts) {
        try {
          const existing = await db.contacts.findOne(contactData.id).exec();
          if (existing) {
            await existing.update({ $set: { ...contactData, updatedAt: now } });
          } else {
            await db.contacts.insert({ ...contactData, createdAt: contactData.createdAt || now });
          }
          stats.contacts++;
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error restoring contact:', contactData.id, e);
          }
        }
      }
    }

    // Восстановление приглашений
    if (backupData.invitations && options?.restoreInvitations !== false) {
      for (const invitationData of backupData.invitations) {
        try {
          const existing = await db.invitations.findOne(invitationData.id).exec();
          if (existing) {
            await existing.update({ $set: { ...invitationData, updatedAt: now } });
          } else {
            await db.invitations.insert({ ...invitationData, createdAt: invitationData.createdAt || now });
          }
          stats.invitations++;
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error restoring invitation:', invitationData.id, e);
          }
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Restore] Completed restore:`, stats);
    }

    return NextResponse.json({
      success: true,
      stats,
      message: 'Восстановление завершено',
      restoredAt: now
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error restoring backup:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось восстановить бэкап: ' + error.message },
      { status: 500 }
    );
  }
}
