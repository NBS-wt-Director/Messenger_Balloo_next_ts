/**
 * Конфигурация приложения из config.json
 * Заменяет .env переменные
 */

import config from '@/../config.json';

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
 * Получение конфигурации
 */
export function getConfig(): AppConfig {
  return config;
}

/**
 * Получение JWT секрета
 */
export function getJwtSecret(): string {
  return config.auth.jwtSecret;
}

/**
 * Получение VAPID ключей
 */
export function getVapidKeys() {
  return {
    publicKey: config.push.vapidPublicKey,
    privateKey: config.push.vapidPrivateKey,
    subject: config.push.vapidSubject,
  };
}

/**
 * Получение тестовых пользователей
 */
export function getTestUsers() {
  return config.testUsers;
}

/**
 * Проверка, является ли пользователь супер-админом
 */
export function isSuperAdminEmail(email: string): boolean {
  return email === config.admin.superAdminEmail;
}
