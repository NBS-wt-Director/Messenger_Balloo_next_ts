/**
 * Database Utilities - Better-SQLite3 Wrapper
 * Replaces Prisma Client for server operations
 */

import db from './database';

// ===== TYPE DEFINITIONS =====

export type User = {
  id: string;
  email: string;
  displayName: string;
  passwordHash?: string;
  authProvider?: string;
  fullName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  avatarHistory?: string;
  adminRoles: string[];
  online: number;
  isOnline: number;
  status: string;
  settings: string;
  points: number;
  userNumber: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Chat = {
  id: string;
  name?: string;
  description?: string;
  type: string;
  createdBy?: string;
  isSystemChat: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  chatId: string;
  userId: string;
  text?: string;
  type?: string;
  replyToId?: string;
  attachmentId?: string;
  createdAt: string;
};

// ===== USER OPERATIONS =====

export function createUser(data: {
  email: string;
  passwordHash: string;
  displayName: string;
  avatar?: string;
  fullName?: string;
  bio?: string;
  settings?: any;
  userNumber?: number;
  points?: number;
}): Promise<User> {
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO User (id, email, displayName, passwordHash, fullName, phone, bio, avatar, adminRoles, online, isOnline, status, settings, userNumber, points, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]', 0, 0, 'offline', '{}', ?, ?, ?, ?)
  `).run(userId, data.email, data.displayName, data.passwordHash, data.fullName || null, data.phone || null, data.bio || null, data.avatar || null, data.userNumber || null, data.points || -55, now, now);
  
  return getUserById(userId) as unknown as Promise<User>;
}

export function getUserById(id: string): User | null {
  return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as User | null;
}

export function getUserByEmail(email: string): User | null {
  return db.prepare('SELECT * FROM User WHERE email = ?').get(email) as User | null;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const updates: string[] = [];
  const params: any[] = [];
  
  for (const key of ['displayName', 'fullName', 'phone', 'bio', 'avatar', 'avatarHistory', 'status', 'settings', 'userNumber', 'points']) {
    if (data[key as keyof User] !== undefined) {
      updates.push(`${key} = ?`);
      params.push(data[key as keyof User]);
    }
  }
  
  if (updates.length === 0) return getUserById(id);
  
  updates.push('updatedAt = ?');
  params.push(new Date().toISOString(), id);
  
  db.prepare(`UPDATE User SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  return getUserById(id);
}

export function getUsers(limit: number = 100, offset: number = 0): User[] {
  return db.prepare('SELECT * FROM User LIMIT ? OFFSET ?').all(limit, offset) as User[];
}

// ===== CHAT OPERATIONS =====

export function createChat(data: {
  type: string;
  name?: string;
  avatar?: string;
  description?: string;
  createdBy: string;
  participantIds: string[];
}): Chat {
  const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, avatar, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
  `).run(chatId, data.type, data.name || null, data.description || null, data.createdBy, data.avatar || null, now, now);
  
  data.participantIds.forEach((userId, index) => {
    db.prepare(`
      INSERT INTO ChatMember (chatId, userId, role, joinedAt)
      VALUES (?, ?, ?, ?)
    `).run(chatId, userId, index === 0 ? 'creator' : 'reader', now);
  });
  
  return getChatById(chatId) as Chat;
}

export function getChatById(id: string): Chat | null {
  return db.prepare('SELECT * FROM Chat WHERE id = ?').get(id) as Chat | null;
}

export function getUserChats(userId: string): Chat[] {
  return db.prepare(`
    SELECT c.* FROM Chat c
    JOIN ChatMember cm ON c.id = cm.chatId
    WHERE cm.userId = ?
    ORDER BY c.updatedAt DESC
  `).all(userId) as Chat[];
}

// ===== MESSAGE OPERATIONS =====

export function createMessage(data: {
  chatId: string;
  senderId: string;
  type: string;
  content: string;
  mediaUrl?: string;
  replyToId?: string;
}): Message {
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO Message (id, chatId, userId, text, type, replyToId, attachmentId, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(messageId, data.chatId, data.senderId, data.content, data.type, data.replyToId || null, data.mediaUrl || null, now);
  
  // Update chat updatedAt
  db.prepare('UPDATE Chat SET updatedAt = ? WHERE id = ?').run(now, data.chatId);
  
  return db.prepare('SELECT * FROM Message WHERE id = ?').get(messageId) as Message;
}

export function getMessages(chatId: string, limit: number = 50, before?: string): Message[] {
  let query = 'SELECT * FROM Message WHERE chatId = ?';
  const params: any[] = [chatId];
  
  if (before) {
    query += ' AND createdAt < ?';
    params.push(before);
  }
  
  query += ' ORDER BY createdAt DESC LIMIT ?';
  params.push(limit);
  
  return db.prepare(query).all(...params) as Message[];
}

export function updateMessage(id: string, data: Partial<Message>): Message | null {
  const updates: string[] = [];
  const params: any[] = [];
  
  for (const key of ['text', 'type', 'replyToId', 'attachmentId']) {
    if (data[key as keyof Message] !== undefined) {
      updates.push(`${key} = ?`);
      params.push(data[key as keyof Message]);
    }
  }
  
  if (updates.length === 0) return getMessageById(id);
  
  updates.push('updatedAt = ?');
  params.push(new Date().toISOString(), id);
  
  db.prepare(`UPDATE Message SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  return getMessageById(id);
}

export function getMessageById(id: string): Message | null {
  return db.prepare('SELECT * FROM Message WHERE id = ?').get(id) as Message | null;
}

// ===== NOTIFICATION OPERATIONS =====

export function createNotification(data: {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}): any {
  const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO Notification (id, userId, type, title, body, data, read, createdAt)
    VALUES (?, ?, 'push', ?, ?, ?, 0, ?)
  `).run(notificationId, data.userId, data.title, data.body, JSON.stringify(data.data || {}), now);
  
  return { id: notificationId };
}

export function getUserNotifications(userId: string, limit: number = 50): any[] {
  return db.prepare(`
    SELECT * FROM Notification WHERE userId = ? ORDER BY createdAt DESC LIMIT ?
  `).all(userId, limit);
}

// ===== UTILITIES =====

export function disconnect() {
  db.close();
}

export function connect() {
  // Database is already connected on import
  return Promise.resolve();
}
