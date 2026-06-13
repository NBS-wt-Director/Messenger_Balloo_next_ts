/**
 * Core Config - Platform-wide configuration
 * 
 * Implementation extracted from settings/src/config.ts
 */

import type { Environment, Platform, SettingsConfig, TestUsers } from './types';

let config: SettingsConfig | null = null;

/**
 * Initialize settings for a platform
 */
export function initSettings(platform: Platform): SettingsConfig {
  config = {
    env: (process.env.NODE_ENV as Environment) || 'development',
    platform,
    
    app: {
      appName: process.env.NEXT_PUBLIC_APP_NAME || 'Balloo',
      appVersion: '1.0.0',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      description: 'Secure messenger with encryption',
    },
    
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
      timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
      retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000', 10),
      enableLogging: process.env.API_LOGGING_ENABLED === 'true',
    },
    
    messenger: {
      frontendUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      port: parseInt(process.env.PORT || '3000', 10),
      useNewApi: process.env.USE_NEW_API === 'true',
      legacyApiUrl: process.env.LEGACY_API_URL || 'http://localhost:3000/api',
    },
    
    adminPortal: {
      frontendUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3002',
      port: parseInt(process.env.ADMIN_PORT || '3002', 10),
    },
    
    security: {
      jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
      encryptionKey: process.env.ENCRYPTION_KEY || '32-character-encryption-key',
    },
    
    database: {
      path: process.env.DB_PATH || './data/database.sqlite',
      name: 'balloo',
      multiInstance: true,
    },
    
    push: {
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY || '',
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
      subject: process.env.VAPID_SUBJECT || '',
    },
    
    yandex: {
      clientId: process.env.YANDEX_CLIENT_ID || '',
      clientSecret: process.env.YANDEX_CLIENT_SECRET || '',
      redirectUri: process.env.YANDEX_REDIRECT_URI || '',
      diskBaseUrl: 'https://cloud-api.yandex.net/v1/disk',
      diskFolder: process.env.YANDEX_DISK_FOLDER || 'balloo-uploads',
    },
    
    email: {
      host: process.env.SMTP_HOST || 'smtp.yandex.ru',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASS || '',
      from: process.env.VAPID_EMAIL || 'noreply@balloo.ru',
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
      registrationEnabled: process.env.NODE_ENV !== 'production',
      maintenanceMode: false,
      yandexDisk: true,
      featureVoting: true,
      staticPages: true,
    },
    
    admin: {
      superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@balloo.ru',
      defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10),
    },
    
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
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
 * Get settings (initialize if not initialized)
 */
export function getSettings(platform?: Platform): SettingsConfig {
  if (!config && platform) {
    initSettings(platform);
  }
  
  if (!config) {
    return initSettings(platform || 'web');
  }
  
  return config;
}

/**
 * Get environment
 */
export function getEnvironment(): Environment {
  return config?.env || (process.env.NODE_ENV as Environment) || 'development';
}

/**
 * Check if development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get API URL
 */
export function getApiUrl(platform?: Platform): string {
  if (platform === 'api') {
    return process.env.API_URL || 'http://localhost:3001';
  }
  
  const useNewApi = process.env.USE_NEW_API === 'true';
  
  if (useNewApi) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

/**
 * Get WebSocket URL
 */
export function getWsUrl(): string {
  return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
}

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  const useNewApi = process.env.USE_NEW_API === 'true';
  
  if (useNewApi) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

/**
 * Get max file size
 */
export function getMaxFileSize(): number {
  return parseInt(process.env.MAX_FILE_SIZE || '52428800', 10);
}

/**
 * Check if registration enabled
 */
export function isRegistrationEnabled(): boolean {
  if (process.env.REGISTRATION_ENABLED) {
    return process.env.REGISTRATION_ENABLED === 'true';
  }
  return process.env.NODE_ENV !== 'production';
}

/**
 * Check if maintenance mode
 */
export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === 'true';
}

/**
 * Get test users
 */
function getTestUsers(): TestUsers[] {
  const users: TestUsers[] = [];
  
  if (process.env.TEST_USER_1_EMAIL) {
    users.push({
      email: process.env.TEST_USER_1_EMAIL,
      password: process.env.TEST_USER_1_PASSWORD || 'Test1234!',
      displayName: process.env.TEST_USER_1_NAME || 'Test User 1',
      isAdmin: process.env.TEST_USER_1_IS_ADMIN === 'true',
      isSuperAdmin: process.env.TEST_USER_1_IS_SUPER_ADMIN === 'true',
    });
  }
  
  if (users.length === 0) {
    users.push({
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@balloo.ru',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',
      displayName: 'Administrator',
      isAdmin: true,
      isSuperAdmin: true,
    });
  }
  
  return users;
}
