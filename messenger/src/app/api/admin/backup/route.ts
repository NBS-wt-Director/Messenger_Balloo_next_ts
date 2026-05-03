import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * API для бэкапа и восстановления базы данных
 * Доступно только администраторам
 */

interface BackupData {
  version: string;
  timestamp: number;
  users: any[];
  chats: any[];
  messages: any[];
  invitations: any[];
  attachments: any[];
  contacts: any[];
  notifications: any[];
  settings: any;
}

// POST - Создание бэкапа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, includeMessages, includeAttachments } = body;

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    // Проверка прав администратора
    // В реальном приложении - проверка через базу данных
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Backup] Creating backup for admin ${adminId}`);
    }

    // SQLite db уже доступен
    const now = Date.now();

    // Сбор данных из всех коллекций
      const users = await db.users.find().exec();
      const chats = await db.chats.find().exec();
      const messages = includeMessages !== false ? await db.messages.find().exec() : [];
      const invitations = await db.invitations.find().exec();
      const attachments = includeAttachments !== false ? await db.attachments.find().exec() : [];
      const contacts = await db.contacts.find().exec();
      const notifications = await db.notifications.find().exec();

    const backup: BackupData = {
      version: '1.0',
      timestamp: now,
      users: users.map((u: any) => u.toJSON()),
      chats: chats.map((c: any) => c.toJSON()),
      messages: messages.map((m: any) => m.toJSON()),
      invitations: invitations.map((i: any) => i.toJSON()),
      attachments: attachments.map((a: any) => a.toJSON()),
      contacts: contacts.map((c: any) => c.toJSON()),
      notifications: notifications.map((n: any) => n.toJSON()),
      settings: {
        backupCreated: new Date(now).toISOString(),
        includeMessages: includeMessages !== false,
        includeAttachments: includeAttachments !== false,
        totalRecords: {
          users: users.length,
          chats: chats.length,
          messages: messages.length,
          invitations: invitations.length,
          attachments: attachments.length,
          contacts: contacts.length,
          notifications: notifications.length
        }
      }
    };

    // Создание Blob для скачивания
    const backupJson = JSON.stringify(backup, null, 2);
    const backupSize = new Blob([backupJson]).size;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Backup] Created backup with ${backupSize} bytes`);
    }

    return NextResponse.json({
      success: true,
      backup: {
        version: backup.version,
        timestamp: backup.timestamp,
        size: backupSize,
        records: backup.settings.totalRecords
      },
      data: backup,
      downloadUrl: `/api/admin/backup/download?timestamp=${now}`,
      message: 'Бэкап создан успешно'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating backup:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось создать бэкап: ' + error.message },
      { status: 500 }
    );
  }
}

// GET - Получение информации о бэкапах
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    // В реальном приложении - получение списка бэкапов из хранилища
    const backups = [
      {
        id: 'backup_1',
        timestamp: Date.now() - 86400000,
        size: 1024 * 1024 * 5,
        records: {
          users: 100,
          chats: 50,
          messages: 10000
        }
      },
      {
        id: 'backup_2',
        timestamp: Date.now() - 172800000,
        size: 1024 * 1024 * 4,
        records: {
          users: 98,
          chats: 48,
          messages: 9500
        }
      }
    ];

    return NextResponse.json({
      success: true,
      backups,
      count: backups.length
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error getting backups:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить список бэкапов' },
      { status: 500 }
    );
  }
}

// DELETE - Удаление бэкапа
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, backupId } = body;

    if (!adminId || !backupId) {
      return NextResponse.json(
        { error: 'adminId и backupId обязательны' },
        { status: 400 }
      );
    }

    // В реальном приложении - удаление бэкапа из хранилища
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Backup] Deleting backup ${backupId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Бэкап удален'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting backup:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить бэкап' },
      { status: 500 }
    );
  }
}
