 
 /**
 * RxDB Database Setup
 * РЕАЛЬНАЯ инициализация базы данных с IndexedDB
 * Главный файл для работы с БД
 */

import { RxDatabase, RxCollection, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

// ===== СХЕМЫ =====
const usersSchema = {
  title: 'User Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    email: { type: 'string', format: 'email' },
    passwordHash: { type: 'string' },
    displayName: { type: 'string' },
    avatar: { type: 'string' },
    fullName: { type: 'string' },
    birthDate: { type: 'number' },
    familyRelations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          relatedUserId: { type: 'string' },
          type: { type: 'string' },
          createdAt: { type: 'number' }
        },
        required: ['id', 'userId', 'relatedUserId', 'type', 'createdAt']
      }
    },
    isAdmin: { type: 'boolean' },
    isSuperAdmin: { type: 'boolean' },
    adminRoles: { type: 'array', items: { type: 'string' } },
    adminSince: { type: 'number' },
    publicKey: { type: 'string' },
    createdAt: { type: 'number' },
    lastSeen: { type: 'number' },
    isOnline: { type: 'boolean' },
    status: { type: 'string' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'email', 'displayName', 'createdAt'],
  indexes: ['email', 'createdAt']
};

const chatsSchema = {
  title: 'Chat Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    type: { type: 'string', enum: ['private', 'group'] },
    name: { type: 'string' },
    avatar: { type: 'string' },
    participants: {
      type: 'array',
      items: { type: 'string' }
    },
    members: {
      type: 'object',
      patternProperties: {
        '.*': {
          type: 'object',
          properties: {
            role: { type: 'string' },
            joinedAt: { type: 'number' },
            lastReadMessageId: { type: 'string' }
          },
          required: ['role', 'joinedAt']
        }
      }
    },
    adminIds: {
      type: 'array',
      items: { type: 'string' }
    },
    createdBy: { type: 'string' },
    description: { type: 'string' },
    isFavorite: {
      type: 'object',
      patternProperties: {
        '.*': { type: 'boolean' }
      }
    },
    pinned: {
      type: 'object',
      patternProperties: {
        '.*': { type: 'boolean' }
      }
    },
    unreadCount: {
      type: 'object',
      patternProperties: {
        '.*': { type: 'number' }
      }
    },
    lastMessage: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'string' },
        content: { type: 'string' },
        type: { type: 'string' },
        senderId: { type: 'string' },
        createdAt: { type: 'number' }
      }
    },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' },
    isSystemChat: { type: 'boolean' }
  },
  required: ['id', 'type', 'participants', 'members', 'createdBy', 'createdAt', 'updatedAt'],
  indexes: ['participants', 'createdAt', 'updatedAt']
};

const messagesSchema = {
  title: 'Message Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    chatId: { type: 'string' },
    senderId: { type: 'string' },
    type: { type: 'string', enum: ['text', 'image', 'video', 'file', 'audio'] },
    content: { type: 'string' },
    mediaUrl: { type: 'string' },
    thumbnailUrl: { type: 'string' },
    fileName: { type: 'string' },
    fileSize: { type: 'number' },
    mimeType: { type: 'string' },
    replyToId: { type: 'string' },
    replyToMessage: { type: ['object', 'null'] },
    reactions: {
      type: 'object',
      patternProperties: {
        '.*': {
          type: 'object',
          properties: {
            emoji: { type: 'string' },
            userIds: { type: 'array', items: { type: 'string' } },
            count: { type: 'number' }
          }
        }
      }
    },
    readBy: {
      type: 'array',
      items: { type: 'string' }
    },
    status: { type: 'string', enum: ['sending', 'sent', 'delivered', 'read'] },
    edited: { type: 'boolean' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'chatId', 'senderId', 'type', 'content', 'createdAt', 'updatedAt'],
  indexes: ['chatId', 'senderId', 'createdAt']
};

const invitationsSchema = {
  title: 'Invite Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    code: { type: 'string' },
    createdBy: { type: 'string' },
    createdAt: { type: 'number' },
    expiresAt: { type: 'number' },
    isPermanent: { type: 'boolean' },
    maxUses: { type: ['number', 'null'] },
    usedCount: { type: 'number' },
    usedBy: {
      type: 'array',
      items: { type: 'string' }
    },
    groupIds: {
      type: 'array',
      items: { type: 'string' }
    },
    pointsReward: { type: 'number' }
  },
  required: ['id', 'code', 'createdBy', 'createdAt', 'expiresAt', 'isPermanent', 'usedCount', 'usedBy', 'groupIds', 'pointsReward'],
  indexes: ['code', 'createdBy', 'expiresAt']
};

const contactsSchema = {
  title: 'Contact Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    userId: { type: 'string' },
    name: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    avatar: { type: 'string' },
    chatId: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'userId', 'name', 'phone', 'createdAt'],
  indexes: ['userId', 'phone', 'email']
};

const notificationsSchema = {
  title: 'Notification Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    userId: { type: 'string' },
    title: { type: 'string' },
    body: { type: 'string' },
    icon: { type: 'string' },
    badge: { type: 'string' },
    data: { type: 'object' },
    timestamp: { type: 'number' },
    isRead: { type: 'boolean' }
  },
  required: ['id', 'userId', 'title', 'body', 'timestamp', 'isRead'],
  indexes: ['userId', 'timestamp', 'isRead']
};

const reportsSchema = {
  title: 'Report Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    targetType: { type: 'string', enum: ['user', 'chat', 'message', 'contact'] },
    targetId: { type: 'string' },
    reportedBy: { type: 'string' },
    reason: { type: 'string', enum: ['spam', 'harassment', 'inappropriate', 'fake', 'other'] },
    description: { type: 'string' },
    status: { type: 'string', enum: ['pending', 'reviewed', 'resolved', 'rejected'] },
    createdAt: { type: 'number' },
    reviewedAt: { type: ['number', 'null'] },
    reviewedBy: { type: ['string', 'null'] }
  },
  required: ['id', 'targetType', 'targetId', 'reportedBy', 'reason', 'status', 'createdAt'],
  indexes: ['targetType', 'targetId', 'reportedBy', 'status', 'createdAt']
};

const pagesSchema = {
  title: 'Page Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 }, // slug: 'support', 'about-company', 'about-balloo'
    title: { type: 'string' },
    content: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' }, // 'payment', 'qr', 'text', 'person', 'features'
          title: { type: 'string' },
          content: { type: 'string' },
          data: { type: 'object' }
        }
      }
    },
    metadata: { type: 'object' },
    isActive: { type: 'boolean' },
    createdBy: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'title', 'createdAt', 'updatedAt'],
  indexes: ['isActive']
};

const featuresSchema = {
  title: 'Feature Schema',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    title: { type: 'string' },
    description: { type: 'string' },
    category: { type: 'string' }, // 'general', 'ui', 'security', 'performance'
    status: { type: 'string', enum: ['pending', 'planned', 'in-progress', 'completed', 'rejected'] },
    votes: { type: 'number' },
    votedBy: { type: 'array', items: { type: 'string' } }, // userIds
    createdBy: { type: 'string' }, // userId
    createdByName: { type: 'string' },
    adminNote: { type: 'string' },
    plannedAt: { type: ['number', 'null'] },
    completedAt: { type: ['number', 'null'] },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
  indexes: ['status', 'category', 'votes', 'createdAt']
};

// ===== БАЗА ДАННЫХ =====
let db: RxDatabase<BallooCollections> | null = null;
let dbInitializing: Promise<RxDatabase<BallooCollections>> | null = null;

export interface BallooCollections {
  users: RxCollection;
  chats: RxCollection;
  messages: RxCollection;
  invitations: RxCollection;
  attachments: RxCollection;
  contacts: RxCollection;
  notifications: RxCollection;
  reports: RxCollection;
  statuses: RxCollection;
  calls: RxCollection;
  pages: RxCollection;
  features: RxCollection;
}

/**
 * Инициализация РЕАЛЬНОЙ базы данных с IndexedDB
 */
export async function getDatabase(): Promise<RxDatabase<BallooCollections>> {
  if (db) {
    return db as unknown as RxDatabase<BallooCollections>;
  }

  if (dbInitializing) {
    return dbInitializing as unknown as Promise<RxDatabase<BallooCollections>>;
  }

  dbInitializing = (async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[DB] Инициализация базы данных...');
      }
      
      // Добавляем плагин dev-mode для отладки (только в development)
      if (process.env.NODE_ENV === 'development') {
        addRxPlugin(RxDBDevModePlugin);
      }
      
      // Удаляем старую базу данных если есть (для миграции)
      try {
        const existingDbs = await indexedDB.databases();
        if (existingDbs.some(db => db.name === 'balloo')) {
          console.log('[DB] Обнаружена старая база, очистка...');
          await indexedDB.deleteDatabase('balloo');
        }
      } catch (e) {
        // indexedDB.databases() может не поддерживаться в некоторых браузерах
        console.log('[DB] Проверка старых баз не доступна');
      }
      
      // Создаём базу данных с Dexie.js storage (IndexedDB)
      const database = await createRxDatabase<BallooCollections>({
        name: 'balloo',
        storage: wrappedValidateAjvStorage({
          storage: getRxStorageDexie()
        }),
        multiInstance: true,
        ignoreDuplicate: true
      });

      // Создаём все коллекции
      await database.addCollections({
        users: { schema: usersSchema as any },
        chats: { schema: chatsSchema as any },
        messages: { schema: messagesSchema as any },
        invitations: { schema: invitationsSchema as any },
        attachments: { schema: { title: 'Attachment', version: 0, primaryKey: 'id', type: 'object', properties: { id: { type: 'string' } } } as any },
        contacts: { schema: contactsSchema as any },
        notifications: { schema: notificationsSchema as any },
        reports: { schema: reportsSchema as any },
        statuses: { schema: { title: 'Status', version: 0, primaryKey: 'id', type: 'object', properties: { id: { type: 'string' } } } as any },
        calls: { schema: { title: 'Call', version: 0, primaryKey: 'id', type: 'object', properties: { id: { type: 'string' } } } as any },
        pages: { schema: pagesSchema as any },
        features: { schema: featuresSchema as any }
      });

      db = database;
      if (process.env.NODE_ENV === 'development') {
        console.log('[DB] ✅ БАЗА ДАННЫХ ИНИЦИАЛИЗИРОВАНА С INDEXEDDB');
        console.log('[DB] Коллекции:', Object.keys(database.collections).join(', '));
      }
      
      return database;
    } catch (error) {
      console.error('[DB] Ошибка инициализации:', error);
      dbInitializing = null;
      throw error;
    }
  })();

  return dbInitializing as unknown as Promise<RxDatabase<BallooCollections>>;
}

// ===== ГЕТТЕРЫ КОЛЛЕКЦИЙ =====

export async function getUsersCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.users;
}

export async function getChatsCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.chats;
}

export async function getMessagesCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.messages;
}

export async function getInvitationsCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.invitations;
}

export async function getAttachmentsCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.attachments;
}

export async function getContactsCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.contacts;
}

export async function getNotificationsCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.notifications;
}

export async function getReportsCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.reports;
}

export async function getPagesCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.pages;
}

export async function getFeaturesCollection(): Promise<RxCollection> {
  const db = await getDatabase();
  return db.features;
}

// ===== УТИЛИТЫ =====

export async function clearDatabase(): Promise<void> {
  if (db) {
    // Удаляем все коллекции
    await Promise.all(
      Object.values(db.collections).map(collection => collection.remove())
    );
    db = null;
    dbInitializing = null;
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB] База данных очищена');
    }
  }
}

export async function isDatabaseConnected(): Promise<boolean> {
  try {
    await getDatabase();
    return !!db;
  } catch (error) {
    console.error('[DB] Проверка не удалась:', error);
    return false;
  }
}
