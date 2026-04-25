/**
 * Shared Types - Used across all platforms
 */

// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  fullName?: string;
  birthDate?: number;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  adminRoles?: string[];
  adminSince?: number;
  publicKey?: string;
  createdAt: number;
  lastSeen?: number;
  isOnline?: boolean;
  status?: string;
  updatedAt: number;
}

// Chat Types
export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  participants: string[];
  members: Record<string, ChatMember>;
  adminIds: string[];
  createdBy: string;
  description?: string;
  isFavorite?: Record<string, boolean>;
  pinned?: Record<string, boolean>;
  unreadCount?: Record<string, number>;
  lastMessage?: MessageSummary;
  createdAt: number;
  updatedAt: number;
  isSystemChat?: boolean;
}

export interface ChatMember {
  role: 'owner' | 'admin' | 'member';
  joinedAt: number;
  lastReadMessageId?: string;
}

// Message Types
export interface Message {
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
  replyToMessage?: Message;
  reactions?: Record<string, Reaction>;
  readBy: string[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  edited: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MessageSummary {
  id: string;
  content: string;
  type: string;
  senderId: string;
  createdAt: number;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}

// Invitation Types
export interface Invitation {
  id: string;
  code: string;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  isPermanent: boolean;
  maxUses?: number;
  usedCount: number;
  usedBy: string[];
  groupIds: string[];
  pointsReward: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  timestamp: number;
  isRead: boolean;
}

// Feature Types
export interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'ui' | 'security' | 'performance';
  status: 'pending' | 'planned' | 'in-progress' | 'completed' | 'rejected';
  votes: number;
  votedBy: string[];
  createdBy: string;
  createdByName: string;
  adminNote?: string;
  plannedAt?: number;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
}

// Page Types
export interface Page {
  id: string;
  title: string;
  content: string;
  sections?: PageSection[];
  metadata?: Record<string, any>;
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface PageSection {
  id: string;
  type: 'payment' | 'qr' | 'text' | 'person' | 'features';
  title?: string;
  content?: string;
  data?: Record<string, any>;
}

// Report Types
export interface Report {
  id: string;
  targetType: 'user' | 'chat' | 'message' | 'contact';
  targetId: string;
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

// Auth Types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Platform Types
export type Platform = 'web' | 'mobile' | 'desktop' | 'android-service';
export type OS = 'windows' | 'macos' | 'linux' | 'android' | 'ios';

// Config Types
export interface AppConfig {
  name: string;
  version: string;
  platform: Platform;
  os?: OS;
  apiUrl: string;
  pushEnabled: boolean;
}
