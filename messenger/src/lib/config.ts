/**
 * Конфигурация приложения из переменных окружения
 * Использует общие настройки из @app-balloo/settings
 */

import { getSettings, isDev, isProd } from '@app-balloo/settings';

// Инициализация настроек (для web платформы)
const settings = getSettings('web');

export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    url: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
  };
  push: {
    vapidPublicKey: string;
    vapidPrivateKey: string;
    vapidSubject: string;
  };
  yandexDisk: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  database: {
    name: string;
    password: string;
    multiInstance: boolean;
    ignoreDuplicate: boolean;
  };
  features: {
    maxPinnedChats: number;
    maxPushTokensPerUser: number;
    pushTokenExpiresDays: number;
    invitationDefaultMaxUses: number;
    invitationDefaultExpiresDays: number;
  };
  admin: {
    superAdminEmail: string;
    defaultAdminPassword: string;
  };
  testUsers: Array<{
    email: string;
    password: string;
    displayName: string;
    isAdmin: boolean;
    isSuperAdmin?: boolean;
  }>;
}

/**
 * Получение конфигурации из общих настроек
 */
export function getConfig(): AppConfig {
  return {
    app: {
      name: settings.app.appName,
      version: settings.app.appVersion,
      description: settings.app.description,
      url: settings.app.appUrl,
    },
    auth: {
      jwtSecret: settings.security.jwtSecret,
      jwtExpiresIn: settings.security.jwtExpiresIn,
      bcryptRounds: settings.security.bcryptRounds,
    },
    push: {
      vapidPublicKey: settings.push.vapidPublicKey,
      vapidPrivateKey: settings.push.vapidPrivateKey,
      vapidSubject: settings.push.subject,
    },
    yandexDisk: {
      clientId: settings.yandex.clientId,
      clientSecret: settings.yandex.clientSecret,
      redirectUri: settings.yandex.redirectUri,
    },
    database: {
      name: settings.database.name,
      password: settings.database.path.includes(':') ? '' : '',
      multiInstance: settings.database.multiInstance,
      ignoreDuplicate: true,
    },
    features: {
      maxPinnedChats: 15,
      maxPushTokensPerUser: 5,
      pushTokenExpiresDays: 30,
      invitationDefaultMaxUses: 10,
      invitationDefaultExpiresDays: 7,
    },
    admin: {
      superAdminEmail: settings.admin.superAdminEmail,
      defaultAdminPassword: settings.admin.defaultAdminPassword,
    },
    testUsers: settings.testUsers.map((u: any) => ({
      email: u.email,
      password: u.password,
      displayName: u.displayName,
      isAdmin: u.isAdmin,
      isSuperAdmin: u.isSuperAdmin,
    })),
  };
}

/**
 * Получение JWT секрета
 */
export function getJwtSecret(): string {
  return settings.security.jwtSecret;
}

/**
 * Получение VAPID ключей
 */
export function getVapidKeys() {
  return {
    publicKey: settings.push.vapidPublicKey,
    privateKey: settings.push.vapidPrivateKey,
    subject: settings.push.subject,
  };
}

/**
 * Получение тестовых пользователей
 */
export function getTestUsers() {
  return getConfig().testUsers;
}

/**
 * Проверка, является ли пользователь супер-админом
 */
export function isSuperAdminEmail(email: string): boolean {
  return email === settings.admin.superAdminEmail;
}

/**
 * Проверка, включена ли регистрация
 */
export function isRegistrationEnabled(): boolean {
  return settings.features.registrationEnabled;
}

/**
 * Проверка, включен ли режим обслуживания
 */
export function isMaintenanceMode(): boolean {
  return settings.features.maintenanceMode;
}

/**
 * API URL для текущего окружения
 */
export function getApiBaseUrl(): string {
  if (isDev()) {
    return 'http://localhost:3000/api';
  }
  // В production API на том же домене
  return `${settings.app.appUrl}/api`;
}
