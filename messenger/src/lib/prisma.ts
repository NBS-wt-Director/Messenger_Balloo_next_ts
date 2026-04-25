/**
 * Prisma Client - Server-side Database Wrapper
 * Replaces client-side IndexedDB for server operations
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ===== TYPE EXPORTS =====
import type { Prisma } from '@prisma/client';

export type User = Omit<Prisma.UserGetPayload<{ include: { familyRelations: true } }>, 'passwordHash'>;
export type Chat = Prisma.ChatGetPayload<{ include: { members: { include: { user: true } } } }>;
export type Message = Prisma.MessageGetPayload<{ include: { sender: true, reactions: true } }>;
export type Invitation = Prisma.InvitationGetPayload<{}>;
export type InvitationUse = Prisma.InvitationUseGetPayload<{}>;
export type Contact = Prisma.ContactGetPayload<{}>;
export type Notification = Prisma.NotificationGetPayload<{}>;
export type Report = Prisma.ReportGetPayload<{}>;
export type Feature = Prisma.FeatureGetPayload<{ include: { featureVotes: true } }>;
export type Page = Prisma.PageGetPayload<{}>;
export type FeatureVote = Prisma.FeatureVoteGetPayload<{}>;

// ===== USER OPERATIONS =====
export async function createUser(data: {
  email: string;
  passwordHash: string;
  displayName: string;
  avatar?: string;
  fullName?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}): Promise<User> {
  return prisma.user.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      adminRoles: [],
      isOnline: false,
    },
    include: { familyRelations: false },
  }) as unknown as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { familyRelations: true },
  });
  return user as unknown as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { familyRelations: true },
  });
  return user as unknown as User;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  // Удаляем adminRoles из данных, если оно есть, чтобы избежать проблем с типами
  const { adminRoles, ...updateData } = data as any;
  const user = await prisma.user.update({
    where: { id },
    data: { ...updateData, updatedAt: new Date() },
    include: { familyRelations: true },
  });
  return user as unknown as User;
}

export async function getUsers(limit: number = 100, offset: number = 0): Promise<User[]> {
  const users = await prisma.user.findMany({
    take: limit,
    skip: offset,
    include: { familyRelations: false },
    orderBy: { createdAt: 'desc' },
  });
  return users as unknown as User[];
}

// ===== CHAT OPERATIONS =====
export async function createChat(data: {
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  description?: string;
  createdBy: string;
  participantIds: string[];
}): Promise<Chat> {
  return prisma.chat.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      isSystemChat: false,
      members: {
        create: data.participantIds.map(userId => ({
          userId,
          role: userId === data.createdBy ? 'owner' : 'member',
          joinedAt: new Date(),
        })),
      },
    },
    include: { members: { include: { user: true } } },
  }) as unknown as Chat;
}

export async function getChatById(id: string): Promise<Chat | null> {
  const chat = await prisma.chat.findUnique({
    where: { id },
    include: { members: { include: { user: true } } },
  });
  return chat as unknown as Chat;
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const chats = await prisma.chat.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: { include: { user: true } },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
  return chats as unknown as Chat[];
}

// ===== MESSAGE OPERATIONS =====
export async function createMessage(data: {
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
}): Promise<Message> {
  return prisma.message.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sending',
      edited: false,
      readBy: [],
    },
    include: { sender: true, reactions: true },
  }) as unknown as Message;
}

export async function getMessages(chatId: string, limit: number = 50, before?: string): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    where: { chatId },
    include: { sender: true, reactions: true },
    take: limit,
    ...(before && {
      cursor: { id: before },
      skip: 1,
    }),
    orderBy: { createdAt: 'desc' },
  });
  return messages as unknown as Message[];
}

export async function updateMessage(id: string, data: Partial<Message>): Promise<Message | null> {
  // Удаляем chatId из данных, так как оно не должно обновляться
  const { chatId, ...updateData } = data as any;
  const message = await prisma.message.update({
    where: { id },
    data: { ...updateData, updatedAt: new Date() },
    include: { sender: true, reactions: true },
  });
  return message as unknown as Message;
}

// ===== INVITATION OPERATIONS =====
export async function createInvitation(data: {
  code: string;
  chatId?: string;
  createdBy: string;
  expiresAt: number;
  isPermanent?: boolean;
  maxUses?: number;
  pointsReward?: number;
}): Promise<Invitation> {
  return prisma.invitation.create({
    data: {
      ...data,
      createdAt: new Date(),
      expiresAt: new Date(data.expiresAt),
      usedCount: 0,
      isPermanent: data.isPermanent ?? false,
      maxUses: data.maxUses ?? null,
      pointsReward: data.pointsReward ?? 0,
    },
  }) as unknown as Invitation;
}

export async function getInvitationByCode(code: string): Promise<Invitation | null> {
  return prisma.invitation.findUnique({
    where: { code },
  }) as unknown as Invitation;
}

export async function useInvitation(invitationId: string, userId: string): Promise<InvitationUse> {
  return prisma.invitationUse.create({
    data: {
      invitationId,
      userId,
      usedAt: new Date(),
    },
  });
}

// ===== NOTIFICATION OPERATIONS =====
export async function createNotification(data: {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}): Promise<Notification> {
  return prisma.notification.create({
    data: {
      ...data,
      timestamp: new Date(),
      isRead: false,
    },
  }) as unknown as Notification;
}

export async function getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
  return prisma.notification.findMany({
    where: { userId },
    take: limit,
    orderBy: { timestamp: 'desc' },
  }) as unknown as Notification[];
}

// ===== FEATURE OPERATIONS =====
export async function createFeature(data: {
  title: string;
  description: string;
  category: string;
  createdBy: string;
}): Promise<Feature> {
  return prisma.feature.create({
    data: {
      ...data,
      status: 'pending',
      votes: 0,
      adminNote: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: { featureVotes: false },
  }) as unknown as Feature;
}

export async function getFeatures(status?: string, category?: string, limit: number = 50): Promise<Feature[]> {
  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const features = await prisma.feature.findMany({
    where,
    include: { featureVotes: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
  return features as unknown as Feature[];
}

export async function voteFeature(featureId: string, userId: string): Promise<FeatureVote> {
  return prisma.featureVote.create({
    data: {
      featureId,
      userId,
      createdAt: new Date(),
    },
  });
}

// ===== PAGE OPERATIONS =====
export async function createPage(data: {
  id: string; // slug
  title: string;
  content: string;
  sections?: any;
  metadata?: any;
  createdBy: string;
}): Promise<Page> {
  return prisma.page.create({
    data: {
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }) as unknown as Page;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return prisma.page.findFirst({
    where: { id: slug, isActive: true },
  }) as unknown as Page;
}

export async function getActivePages(): Promise<Page[]> {
  return prisma.page.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  }) as unknown as Page[];
}

// ===== REPORT OPERATIONS =====
export async function createReport(data: {
  targetType: string;
  targetId: string;
  reportedBy: string;
  reason: string;
  description?: string;
}): Promise<Report> {
  return prisma.report.create({
    data: {
      ...data,
      status: 'pending',
      createdAt: new Date(),
    },
  }) as unknown as Report;
}

export async function getReports(status?: string, limit: number = 50): Promise<Report[]> {
  const where: any = {};
  if (status) where.status = status;

  return prisma.report.findMany({
    where,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { reporter: true, reviewer: true },
  }) as unknown as Report[];
}

// ===== UTILITIES =====
export async function disconnect() {
  await prisma.$disconnect();
}

export async function connect() {
  await prisma.$connect();
}
