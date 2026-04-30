// Роли в группе
export type GroupRole = 'creator' | 'moderator' | 'author' | 'reader';

// Права ролей
export const RolePermissions: Record<GroupRole, {
  canWrite: boolean;
  canRead: boolean;
  canManageMembers: boolean;
  canManageRoles: boolean;
  canDelete: boolean;
  canEditGroup: boolean;
}> = {
  creator: {
    canWrite: true,
    canRead: true,
    canManageMembers: true,
    canManageRoles: true,
    canDelete: true,
    canEditGroup: true,
  },
  moderator: {
    canWrite: true,
    canRead: true,
    canManageMembers: true,
    canManageRoles: false,
    canDelete: false,
    canEditGroup: false,
  },
  author: {
    canWrite: true,
    canRead: true,
    canManageMembers: false,
    canManageRoles: false,
    canDelete: false,
    canEditGroup: false,
  },
  reader: {
    canWrite: false,
    canRead: true,
    canManageMembers: false,
    canManageRoles: false,
    canDelete: false,
    canEditGroup: false,
  },
};

// 16 реакций на сообщения
export type MessageReaction = 
  | '👍' | '👎' | '❤️' | '😍' | '🎉' | '🔥' 
  | '😂' | '😢' | '😮' | '👏' | '🤔' | '😎'
  | '😐' | '🤯' | '🥳' | '💯';

export const MESSAGE_REACTIONS: MessageReaction[] = [
  '👍', '👎', '❤️', '😍', '🎉', '🔥',
  '😂', '😢', '😮', '👏', '🤔', '😎',
  '😐', '🤯', '🥳', '💯'
];

// Семейные связи
export type FamilyRelationType = 
  | 'child_mother'    // Ребёнок-мать
  | 'child_father'    // Ребёнок-отец
  | 'sibling'         // Брат/сестра
  | 'spouse';         // Муж/жена

export interface FamilyRelation {
  id: string;
  userId: string;           // ID текущего пользователя
  relatedUserId: string;    // ID связанного пользователя
  type: FamilyRelationType; // Тип связи
  createdAt: number;
}

// Роли админа
export type AdminRole = 
  | 'superadmin'      // Супер-админ (полный доступ)
  | 'users'           // Управление пользователями
  | 'chats'           // Управление чатами
  | 'messages'        // Управление сообщениями
  | 'invites'         // Управление инвайтами
  | 'settings'        // Управление настройками
  | 'analytics'       // Просмотр аналитики
  | 'bans'            // Блокировка пользователей
  | 'content'         // Модерация контента;

// Расширенный профиль (дополнительные поля)
export interface ExtendedProfile {
  fullName?: string;         // ФИО (полное имя)
  birthDate?: number;        // Дата рождения (timestamp)
  familyRelations?: FamilyRelation[];
}

// Пользователь
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  publicKey?: string; // Для E2E шифрования
  createdAt: number;
  lastSeen?: number;
  isOnline?: boolean;
  yandexDiskConnected?: boolean;
  yandexDiskToken?: string;
  yandexDiskRefreshToken?: string;
  preferredLanguage?: 'ru' | 'hi' | 'zh' | 'tt';
  theme?: 'light' | 'dark';
  isTyping?: string[]; // chatId[]
  
  // Дополнительные поля профиля
  fullName?: string;         // ФИО
  birthDate?: number;        // Дата рождения
  familyRelations?: FamilyRelation[];
  
  // Админ-права
  isAdmin?: boolean;         // Является ли админом
  isSuperAdmin?: boolean;    // Супер-админ
  adminRoles?: AdminRole[];  // Роли админа
  adminSince?: number;       // Дата назначения админом
}

// Участник группы с ролью
export interface GroupMember {
  userId: string;
  role: GroupRole;
  joinedAt: number;
  invitedBy?: string;
}

// Чат
export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string; // Для групповых чатов
  avatarUrl?: string;
  participants: string[]; // ID пользователей
  members: Record<string, GroupRole>; // userId -> role (для групп)
  adminIds: string[]; // ID администраторов (устарело, использовать members)
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  lastMessage?: Message;
  unreadCount: Record<string, number>; // userId -> count
  isFavorite?: boolean; // Избранное
  pinned?: boolean; // Закреплённый чат
  muted?: Record<string, number>; // userId -> until timestamp
}

// Реакция на сообщение
export interface MessageReactionData {
  emoji: MessageReaction;
  userId: string;
  createdAt: number;
}

// История изменения сообщения
export interface MessageEdit {
  content: string;
  editedAt: number;
}

// Сообщение
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'file' | 'audio';
  content: string; // Зашифрованный текст или URL вложения
  decryptedContent?: string; // Расшифрованный текст (только локально)
  attachmentId?: string;
  replyToId?: string;
  forwardFromId?: string; // ID оригинального сообщения при пересылке
  forwardFromChatId?: string; // ID чата оригинального сообщения
  createdAt: number;
  editedAt?: number;
  editHistory?: MessageEdit[]; // История изменений
  readBy: string[]; // ID пользователей, прочитавших
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions: Record<string, MessageReactionData>; // userId -> reaction
  reactionsCount: Record<MessageReaction, number>; // emoji -> count
  isDeleted?: boolean;
}

// Вложение
export interface Attachment {
  id: string;
  ownerId: string;
  type: 'image' | 'video' | 'file' | 'audio' | 'avatar';
  yandexDiskPath: string; // Путь на Яндекс.Диске
  publicUrl?: string; // Публичная ссылка
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // Для видео/аудио
  thumbnailUrl?: string;
  fileName: string;
  createdAt: number;
}

// Статус (сторис)
export interface Status {
  id: string;
  userId: string;
  type: 'image' | 'video';
  attachmentId: string;
  views: string[]; // ID пользователей, просмотревших
  createdAt: number;
  expiresAt: number; // Через 24 часа
}

// Авторизация
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  avatar?: string; // Alias для обратной совместимости
  provider: 'email' | 'yandex';
  accessToken?: string;
  refreshToken?: string;
  
  // Дополнительные поля профиля
  fullName?: string;
  birthDate?: number;
  phone?: string;
  familyRelations?: FamilyRelation[];
  
  // Статус
  isOnline?: boolean;
  createdAt?: number;
  
  // Админ-права
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  adminRoles?: AdminRole[];
  adminSince?: number;
}

// Мультиаккаунты
export interface Account {
  id: string;
  userId: string;           // ID пользователя (AuthUser.id)
  email: string;
  displayName: string;
  avatarUrl?: string;
  provider: 'email' | 'yandex';
  isActive: boolean;        // Текущий активный аккаунт
  lastUsed: number;         // Последнее использование
}

export interface AccountsState {
  accounts: Account[];
  currentAccountId: string | null;
}

// API ответы
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Yandex OAuth
export interface YandexTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

// Инвайт (приглашение)
export interface Invite {
  id: string;
  code: string; // Уникальный код приглашения
  createdBy: string; // ID пользователя, создавшего приглашение
  createdAt: number;
  expiresAt: number; // Срок действия (timestamp)
  isPermanent: boolean; // Бессрочный инвайт
  maxUses: number | null; // Максимум использований (null = бесконечно)
  usedCount: number; // Сколько раз использован
  usedBy: string[]; // ID пользователей, которые использовали
  groupIds: string[]; // ID групп, в которые автоматически добавится приглашённый
  pointsReward: number; // Награда за приглашение (2 балла за обычный, 0 за бессрочный)
}

// Баллы пользователя
export interface UserPoints {
  userId: string;
  points: number; // Текущий баланс
  totalEarned: number; // Всего заработано
  totalSpent: number; // Всего потрачено
  inviteCount: number; // Количество приглашённых
  history: PointTransaction[]; // История транзакций
}

// Транзакция баллов
export interface PointTransaction {
  id: string;
  type: 'invite_bonus' | 'spent' | 'bonus';
  amount: number;
  description: string;
  createdAt: number;
  relatedInviteId?: string;
  relatedUserId?: string;
}
