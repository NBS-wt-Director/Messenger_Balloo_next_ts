/**
 * Типы для RxDB документов
 */

import type { RxDocument } from 'rxdb';

// ===== USER =====
export interface UserDocument {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  avatar?: string;
  fullName?: string;
  birthDate?: number;
  familyRelations?: Array<{
    id: string;
    userId: string;
    relatedUserId: string;
    type: string;
    createdAt: number;
  }>;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  adminRoles?: string[];
  adminSince?: number;
  publicKey?: string;
  createdAt: number;
  lastSeen?: number;
  isOnline?: boolean;
  status?: string;
  updatedAt?: number;
}

// ===== CHAT =====
export interface ChatDocument {
  id: string;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  participants: string[];
  members: Record<string, {
    role: string;
    joinedAt: number;
    lastReadMessageId?: string;
  }>;
  adminIds?: string[];
  createdBy: string;
  description?: string;
  isFavorite?: Record<string, boolean>;
  pinned?: Record<string, boolean>;
  unreadCount?: Record<string, number>;
  lastMessage?: {
    id: string;
    content: string;
    type: string;
    senderId: string;
    createdAt: number;
  } | null;
  createdAt: number;
  updatedAt: number;
  isSystemChat?: boolean;
}

// ===== MESSAGE =====
export interface MessageDocument {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'file' | 'audio';
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  replyToId?: string;
  replyToMessage?: any;
  reactions?: Record<string, {
    emoji: string;
    userIds: string[];
    count: number;
  }>;
  readBy?: string[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  edited?: boolean;
  createdAt: number;
  updatedAt: number;
}

// ===== INVITATION =====
export interface InvitationDocument {
  id: string;
  code: string;
  chatId?: string;
  invitedBy: string;
  invitedByEmail?: string;
  chatName?: string;
  chatAvatar?: string;
  chatType?: string;
  message?: string;
  maxUses: number | null;
  currentUses: number;
  expiresAt: number | null;
  isActive: boolean;
  isOneTime?: boolean;
  createdAt: number;
  updatedAt: number;
}

// ===== NOTIFICATION =====
export interface NotificationDocument {
  id: string;
  userId: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  timestamp: number;
  isRead: boolean;
}

// ===== REPORT =====
export interface ReportDocument {
  id: string;
  targetType: 'user' | 'chat' | 'message' | 'contact';
  targetId: string;
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: number;
  reviewedAt?: number | null;
  reviewedBy?: string | null;
}

// ===== CONTACT =====
export interface ContactDocument {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  chatId?: string;
  createdAt: number;
  updatedAt: number;
}

// Типы RxDB документов
export type RxUserDocument = RxDocument<UserDocument>;
export type RxChatDocument = RxDocument<ChatDocument>;
export type RxMessageDocument = RxDocument<MessageDocument>;
export type RxInvitationDocument = RxDocument<InvitationDocument>;
export type RxNotificationDocument = RxDocument<NotificationDocument>;
export type RxReportDocument = RxDocument<ReportDocument>;
export type RxContactDocument = RxDocument<ContactDocument>;
