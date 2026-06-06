/**
 * App Balloo - Shared Configuration
 * Централизованные настройки для всех платформ
 */

import { loadEnvFile, getEnv, isDev, isProd } from './environment';
import {
  SettingsConfig,
  Environment,
  Platform,
  TestUsers,
} from './types';

let config: SettingsConfig | null = null;

// Платформы
const PLATFORMS = {
  API: 'api',
  MESSENGER: 'messenger',
  ADMIN: 'admin-portal',
  WEB: 'web',
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
} as const;

type PlatformType = typeof PLATFORMS[keyof typeof PLATFORMS];

/**
 * Инициализация настроек
 */
export function initSettings(platform: Platform | PlatformType): SettingsConfig {
  loadEnvFile(platform);
  
  config = {
    env: getEnv() as Environment,
    platform,
    
    app: {
      appName: process.env.NEXT_PUBLIC_APP_NAME || process.env.APP_NAME || 'Balloo Messenger',
      appVersion: '1.0.0',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000',
      description: 'Безопасный мессенджер с шифрованием',
    },
    
    // ============================================
    // API SERVER CONFIGURATION
    // ============================================
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001/api/v1',
      wsUrl: process.env.NEXT_PUBLIC_WS_URL || process.env.WS_URL || 'ws://localhost:3001',
      timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
      retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000', 10),
      enableLogging: process.env.API_LOGGING_ENABLED === 'true',
    },
    
    // ============================================
    // MESSENGER CONFIGURATION
    // ============================================
    messenger: {
      frontendUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
      port: parseInt(process.env.PORT || '3000', 10),
      useNewApi: process.env.USE_NEW_API === 'true',
      legacyApiUrl: process.env.LEGACY_API_URL || 'http://localhost:3000/api',
    },
    
    // ============================================
    // ADMIN PORTAL CONFIGURATION
    // ============================================
    adminPortal: {
      frontendUrl: process.env.NEXT_PUBLIC_ADMIN_URL || process.env.ADMIN_URL || 'http://localhost:3002',
      port: parseInt(process.env.ADMIN_PORT || '3002', 10),
    },
    
    security: {
      jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || process.env.BCRYPT_ROUNDS || '10', 10),
      encryptionKey: process.env.ENCRYPTION_KEY || '32-character-encryption-key-here',
    },
    
    database: {
      path: process.env.DB_PATH || process.env.DATABASE_URL || './data/database.sqlite',
      name: 'balloo',
      multiInstance: true,
    },
    
    push: {
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
      subject: process.env.VAPID_SUBJECT || '',
    },
    
    yandex: {
      clientId: process.env.YANDEX_CLIENT_ID || process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID || '',
      clientSecret: process.env.YANDEX_CLIENT_SECRET || '',
      redirectUri: process.env.YANDEX_REDIRECT_URI || '',
      diskBaseUrl: 'https://cloud-api.yandex.net/v1/disk',
      diskFolder: process.env.YANDEX_DISK_FOLDER || 'balloo-uploads',
    },
    
    email: {
      host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.yandex.ru',
      port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10),
      user: process.env.EMAIL_USER || process.env.SMTP_USER || '',
      password: process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || '',
      from: process.env.EMAIL_FROM || process.env.VAPID_EMAIL || 'noreply@balloo.ru',
    },
    
    features: {
      pushNotifications: true,
      e2eEncryption: true,
      videoCalls: true,
      screenShare: true,
      fileUpload: true,
      invitationSystem: true,
      adminPanel: true,
      multiAccount: true,
      registrationEnabled: isDev(),
      maintenanceMode: false,
      yandexDisk: true,
      featureVoting: true,
      staticPages: true,
    },
    
    admin: {
      superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@balloo.ru',
      defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'BallooAdmin2024!',
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10),
    },
    
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || process.env.RATE_LIMIT_MAX || '100', 10),
    },
    
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10),
      uploadDir: process.env.UPLOAD_DIR || './uploads',
      recordingsDir: process.env.RECORDINGS_DIR || './recordings',
    },
    
    testUsers: getTestUsers(),
  };
  
  return config;
}

/**
 * Получить настройки (инициализировать если не инициализированы)
 */
export function getSettings(platform?: Platform | PlatformType): SettingsConfig {
  if (!config && platform) {
    initSettings(platform);
  }
  
  if (!config) {
    // Возвращаем дефолтные настройки если не инициализированы
    console.warn('[Settings] Not initialized, returning defaults');
    return initSettings(platform || 'web');
  }
  
  return config;
}

/**
 * Получить только окружение
 */
export function getEnvironment(): Environment {
  return (config?.env || getEnv()) as Environment;
}

/**
 * Проверка, development ли
 */
export function isDevelopment(): boolean {
  return isDev();
}

/**
 * Проверка, production ли
 */
export function isProduction(): boolean {
  return isProd();
}

/**
 * Получить тестовых пользователей
 */
function getTestUsers(): TestUsers[] {
  const users: TestUsers[] = [];
  
  // Test user 1
  if (process.env.TEST_USER_1_EMAIL) {
    users.push({
      email: process.env.TEST_USER_1_EMAIL,
      password: process.env.TEST_USER_1_PASSWORD || 'Test1234!',
      displayName: process.env.TEST_USER_1_NAME || 'Тестовый пользователь 1',
      isAdmin: process.env.TEST_USER_1_IS_ADMIN === 'true',
      isSuperAdmin: process.env.TEST_USER_1_IS_SUPER_ADMIN === 'true',
    });
  }
  
  // Test user 2
  if (process.env.TEST_USER_2_EMAIL) {
    users.push({
      email: process.env.TEST_USER_2_EMAIL,
      password: process.env.TEST_USER_2_PASSWORD || 'Test1234!',
      displayName: process.env.TEST_USER_2_NAME || 'Тестовый пользователь 2',
      isAdmin: process.env.TEST_USER_2_IS_ADMIN === 'true',
      isSuperAdmin: process.env.TEST_USER_2_IS_SUPER_ADMIN === 'true',
    });
  }
  
  // Default test user if none specified
  if (users.length === 0) {
    users.push({
      email: 'admin@balloo.ru',
      password: 'Admin123!',
      displayName: 'Администратор',
      isAdmin: true,
      isSuperAdmin: true,
    });
  }
  
  return users;
}

/**
 * Получить API URL
 */
export function getApiUrl(platform: Platform | PlatformType): string {
  if (platform === 'api') {
    return process.env.API_URL || 'http://localhost:3001';
  }
  
  // Для messenger и admin-portal
  const useNewApi = process.env.USE_NEW_API === 'true';
  
  if (useNewApi) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  }
  
  // Legacy: встроенный API в messenger
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

/**
 * Получить WebSocket URL
 */
export function getWsUrl(): string {
  return process.env.NEXT_PUBLIC_WS_URL || process.env.WS_URL || 'ws://localhost:3001';
}

/**
 * Получить URL для использования (новый API или legacy)
 */
export function getApiBaseUrl(): string {
  const useNewApi = process.env.USE_NEW_API === 'true';
  
  if (useNewApi) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

/**
 * Получить CORS origin
 */
export function getCorsOrigin(): string {
  return process.env.CORS_ORIGIN || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Получить максимальный размер файла
 */
export function getMaxFileSize(): number {
  return parseInt(process.env.MAX_FILE_SIZE || '52428800', 10);
}

/**
 * Проверка, включена ли регистрация
 */
export function isRegistrationEnabled(): boolean {
  if (process.env.REGISTRATION_ENABLED) {
    return process.env.REGISTRATION_ENABLED === 'true';
  }
  return isDev();
}

/**
 * Проверка, включен ли режим обслуживания
 */
export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === 'true';
}

// Автоматическая инициализация при импорте (опционально, server-side only)
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
if (isNode) {
  // Server-side only
  const platform = process.env.PLATFORM || 'web';
  try {
    initSettings(platform as Platform);
  } catch (error) {
    console.warn('[Settings] Auto-initialization failed:', error);
  }
}
