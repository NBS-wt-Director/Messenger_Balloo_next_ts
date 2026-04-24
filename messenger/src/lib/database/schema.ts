/**
 * RxDB Schema для Balloo Messenger
 * Все схемы базы данных
 */

export const userSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    email: { type: 'string', unique: true },
    passwordHash: { type: 'string' },
    displayName: { type: 'string' },
    fullName: { type: 'string' },
    avatar: { type: 'string' },
    birthDate: { type: 'number' },
    status: { type: 'string', default: 'offline' },
    bio: { type: 'string' },
    phone: { type: 'string' },
    isAdmin: { type: 'boolean', default: false },
    isSuperAdmin: { type: 'boolean', default: false },
    adminRoles: { type: 'array', items: { type: 'string' } },
    pushTokens: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          platform: { type: 'string' },
          createdAt: { type: 'number' },
          expiresAt: { type: 'number' },
          lastUsedAt: { type: 'number' }
        },
        required: ['token', 'platform', 'createdAt']
      },
      default: []
    },
    settings: {
      type: 'object',
      properties: {
        theme: { type: 'string', default: 'dark' },
        language: { type: 'string', default: 'ru' },
        notificationsEnabled: { type: 'boolean', default: true },
        soundEnabled: { type: 'boolean', default: true },
        vibrateEnabled: { type: 'boolean', default: true }
      }
    },
    familyRelations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          relation: { type: 'string' }, // parent, sibling, child, spouse, other
          name: { type: 'string' }
        }
      }
    },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' },
    lastSeen: { type: 'number' }
  },
  required: ['id', 'email', 'passwordHash', 'displayName', 'createdAt', 'updatedAt']
};

export const chatSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    type: { type: 'string', enum: ['private', 'group'] },
    name: { type: 'string' }, // Для групп
    avatar: { type: 'string' },
    participants: { type: 'array', items: { type: 'string' } }, // user IDs
    members: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          role: { type: 'string', enum: ['creator', 'moderator', 'author', 'reader'] },
          joinedAt: { type: 'number' },
          lastReadMessageId: { type: 'string' }
        }
      }
    },
    adminIds: { type: 'array', items: { type: 'string' } },
    createdBy: { type: 'string' },
    description: { type: 'string' },
    isFavorite: {
      type: 'object',
      additionalProperties: { type: 'boolean' }
    },
    pinned: {
      type: 'object',
      additionalProperties: { type: 'boolean' }
    },
    unreadCount: {
      type: 'object',
      additionalProperties: { type: 'integer' }
    },
    lastMessage: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        content: { type: 'string' },
        type: { type: 'string' },
        createdAt: { type: 'number' },
        senderId: { type: 'string' }
      }
    },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'type', 'participants', 'createdBy', 'createdAt', 'updatedAt']
};

export const messageSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    chatId: { type: 'string' },
    senderId: { type: 'string' },
    type: { type: 'string', enum: ['text', 'image', 'video', 'audio', 'document', 'system'] },
    content: { type: 'string' },
    mediaUrl: { type: 'string' },
    thumbnailUrl: { type: 'string' },
    fileName: { type: 'string' },
    fileSize: { type: 'integer' },
    mimeType: { type: 'string' },
    replyToId: { type: 'string' },
    replyToMessage: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        content: { type: 'string' },
        type: { type: 'string' },
        senderId: { type: 'string' },
        senderName: { type: 'string' }
      }
    },
    reactions: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          emoji: { type: 'string' },
          userIds: { type: 'array', items: { type: 'string' } },
          count: { type: 'integer' }
        }
      }
    },
    readBy: { type: 'array', items: { type: 'string' } },
    status: { type: 'string', enum: ['sending', 'sent', 'delivered', 'read', 'failed'] },
    edited: { type: 'boolean', default: false },
    editedAt: { type: 'number' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'chatId', 'senderId', 'type', 'content', 'createdAt', 'updatedAt']
};

export const invitationSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    code: { type: 'string', unique: true },
    chatId: { type: 'string' },
    invitedBy: { type: 'string' },
    invitedByEmail: { type: 'string' },
    chatName: { type: 'string' },
    chatAvatar: { type: 'string' },
    chatType: { type: 'string', enum: ['private', 'group'] },
    message: { type: 'string' },
    maxUses: { type: 'integer' },
    currentUses: { type: 'integer', default: 0 },
    expiresAt: { type: 'number' },
    isActive: { type: 'boolean', default: true },
    isOneTime: { type: 'boolean', default: false },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'code', 'chatId', 'invitedBy', 'chatType', 'createdAt', 'updatedAt']
};

export const attachmentSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    messageId: { type: 'string' },
    chatId: { type: 'string' },
    uploaderId: { type: 'string' },
    fileName: { type: 'string' },
    originalName: { type: 'string' },
    mimeType: { type: 'string' },
    fileSize: { type: 'integer' },
    url: { type: 'string' },
    thumbnailUrl: { type: 'string' },
    width: { type: 'integer' },
    height: { type: 'integer' },
    duration: { type: 'integer' }, // для аудио/видео
    status: { type: 'string', enum: ['uploading', 'ready', 'failed'] },
    yandexDiskId: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'messageId', 'chatId', 'uploaderId', 'fileName', 'mimeType', 'fileSize', 'url', 'createdAt', 'updatedAt']
};

export const contactSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    userId: { type: 'string' },
    contactUserId: { type: 'string' },
    displayName: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    avatar: { type: 'string' },
    isFavorite: { type: 'boolean', default: false },
    isBlocked: { type: 'boolean', default: false },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'userId', 'contactUserId', 'createdAt', 'updatedAt']
};

export const notificationSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    userId: { type: 'string' },
    type: { type: 'string', enum: ['message', 'system', 'friend', 'invite', 'admin'] },
    title: { type: 'string' },
    body: { type: 'string' },
    icon: { type: 'string' },
    url: { type: 'string' },
    data: { type: 'object' },
    read: { type: 'boolean', default: false },
    readAt: { type: 'number' },
    createdAt: { type: 'number' },
    expiresAt: { type: 'number' }
  },
  required: ['id', 'userId', 'type', 'title', 'body', 'createdAt']
};

export const reportSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    targetType: { type: 'string', enum: ['chat', 'user', 'contact', 'invitation'] },
    targetId: { type: 'string' },
    reportedBy: { type: 'string' },
    reason: { type: 'string', enum: ['spam', 'harassment', 'inappropriate', 'fake', 'other'] },
    description: { type: 'string' },
    status: { type: 'string', enum: ['pending', 'reviewing', 'resolved', 'rejected'], default: 'pending' },
    reviewedBy: { type: 'string' },
    reviewedAt: { type: 'number' },
    resolution: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'targetType', 'targetId', 'reportedBy', 'reason', 'createdAt', 'updatedAt']
};

// Экспорт всех схем
export const schemas = {
  users: userSchema,
  chats: chatSchema,
  messages: messageSchema,
  invitations: invitationSchema,
  attachments: attachmentSchema,
  contacts: contactSchema,
  notifications: notificationSchema,
  reports: reportSchema
};

// Для CommonJS совместимости
module.exports = { schemas };
