/**
 * Конфигурация приложения из переменных окружения
 * Все секреты берутся из .env файла
 */

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
 * Получение конфигурации из переменных окружения
 */
export function getConfig(): AppConfig {
  return {
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || 'Balloo Messenger',
      version: '1.0.0',
      description: 'Безопасный мессенджер с шифрованием',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
      bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
    },
    push: {
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY || '',
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
      vapidSubject: process.env.VAPID_SUBJECT || '',
    },
    yandexDisk: {
      clientId: process.env.YANDEX_CLIENT_ID || '',
      clientSecret: process.env.YANDEX_CLIENT_SECRET || '',
      redirectUri: process.env.YANDEX_REDIRECT_URI || '',
    },
    database: {
      name: 'balloo',
      password: '',
      multiInstance: true,
      ignoreDuplicate: true,
    },
    features: {
      maxPinnedChats: parseInt(process.env.MAX_PINNED_CHATS || '15', 10),
      maxPushTokensPerUser: parseInt(process.env.MAX_PUSH_TOKENS || '5', 10),
      pushTokenExpiresDays: parseInt(process.env.PUSH_TOKEN_EXPIRES_DAYS || '30', 10),
      invitationDefaultMaxUses: parseInt(process.env.INVITATION_DEFAULT_MAX_USES || '10', 10),
      invitationDefaultExpiresDays: parseInt(process.env.INVITATION_DEFAULT_EXPIRES_DAYS || '7', 10),
    },
    admin: {
      superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@balloo.ru',
      defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'BallooAdmin2024!',
    },
    testUsers: [
      {
        email: process.env.TEST_USER_1_EMAIL || 'admin@balloo.ru',
        password: process.env.TEST_USER_1_PASSWORD || 'Admin123!',
        displayName: 'Администратор',
        isAdmin: true,
        isSuperAdmin: true,
      },
      {
        email: process.env.TEST_USER_2_EMAIL || 'user1@balloo.ru',
        password: process.env.TEST_USER_2_PASSWORD || 'User123!',
        displayName: 'Тестовый пользователь',
        isAdmin: false,
      },
    ],
  };
}

/**
 * Получение JWT секрета
 */
export function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
}

/**
 * Получение VAPID ключей
 */
export function getVapidKeys() {
  return {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
    subject: process.env.VAPID_SUBJECT || '',
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
  return email === process.env.SUPER_ADMIN_EMAIL;
}
