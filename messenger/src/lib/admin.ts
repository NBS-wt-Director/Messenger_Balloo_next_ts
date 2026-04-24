import { useAuthStore } from '@/stores/auth-store';
import { AdminRole } from '@/types';

/**
 * Хелпер для проверки админ-прав
 */
export function useAdminCheck() {
  const { user, isAuthenticated } = useAuthStore();
  
  const isAdmin = user?.isAdmin || false;
  const isSuperAdmin = user?.isSuperAdmin || false;
  
  /**
   * Проверка на конкретную роль
   */
  const hasRole = (role: AdminRole): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true; // SuperAdmin имеет все роли
    return user.adminRoles?.includes(role) || false;
  };
  
  /**
   * Проверка на любую из ролей
   */
  const hasAnyRole = (roles: AdminRole[]): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return roles.some(role => user.adminRoles?.includes(role));
  };
  
  /**
   * Проверка на все роли
   */
  const hasAllRoles = (roles: AdminRole[]): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return roles.every(role => user.adminRoles?.includes(role));
  };
  
  /**
   * Проверка на доступ к разделу
   */
  const canAccess = (section: 'users' | 'chats' | 'messages' | 'invites' | 'settings' | 'analytics' | 'bans' | 'content'): boolean => {
    if (!isAuthenticated) return false;
    if (isSuperAdmin) return true;
    
    const roleMap: Record<string, AdminRole> = {
      users: 'users',
      chats: 'chats',
      messages: 'messages',
      invites: 'invites',
      settings: 'settings',
      analytics: 'analytics',
      bans: 'bans',
      content: 'content',
    };
    
    return hasRole(roleMap[section]);
  };
  
  return {
    isAdmin,
    isSuperAdmin,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
    adminRoles: user?.adminRoles || [],
    adminSince: user?.adminSince,
  };
}

/**
 * Проверка админ-прав без хука (для утилит)
 */
export function checkAdminAccess(user: any): {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canAccess: (section: string) => boolean;
} {
  const isAdmin = user?.isAdmin || false;
  const isSuperAdmin = user?.isSuperAdmin || false;
  
  return {
    isAdmin,
    isSuperAdmin,
    canAccess: (section: string) => {
      if (!user) return false;
      if (isSuperAdmin) return true;
      
      const roleMap: Record<string, AdminRole> = {
        users: 'users',
        chats: 'chats',
        messages: 'messages',
        invites: 'invites',
        settings: 'settings',
        analytics: 'analytics',
        bans: 'bans',
        content: 'content',
      };
      
      const role = roleMap[section];
      return role ? user.adminRoles?.includes(role) || false : false;
    },
  };
}

/**
 * Константы ролей
 */
export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: 'Супер-админ',
  users: 'Пользователи',
  chats: 'Чаты',
  messages: 'Сообщения',
  invites: 'Приглашения',
  settings: 'Настройки',
  analytics: 'Аналитика',
  bans: 'Блокировки',
  content: 'Модерация',
};

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  superadmin: 'Полный доступ ко всем функциям',
  users: 'Управление пользователями',
  chats: 'Управление чатами и группами',
  messages: 'Управление сообщениями',
  invites: 'Управление приглашениями',
  settings: 'Управление настройками системы',
  analytics: 'Просмотр статистики и аналитики',
  bans: 'Блокировка и разблокировка пользователей',
  content: 'Модерация контента',
};
