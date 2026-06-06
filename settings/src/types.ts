/**
 * Types для настроек проекта
 */

export type Environment = 'development' | 'production' | 'test';

export type Platform = 'web' | 'mobile' | 'desktop' | 'android-service' | 'api' | 'messenger' | 'admin-portal';

export interface AppSettings {
  appName: string;
  appVersion: string;
  appUrl: string;
  description: string;
}

export interface SecuritySettings {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  encryptionKey: string;
}

export interface DatabaseSettings {
  path: string;
  name: string;
  multiInstance: boolean;
}

export interface PushSettings {
  vapidPublicKey: string;
  vapidPrivateKey: string;
  subject: string;
}

export interface YandexSettings {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  diskBaseUrl: string;
  diskFolder: string;
}

export interface EmailSettings {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface FeatureFlags {
  pushNotifications: boolean;
  e2eEncryption: boolean;
  videoCalls: boolean;
  screenShare: boolean;
  fileUpload: boolean;
  invitationSystem: boolean;
  adminPanel: boolean;
  multiAccount: boolean;
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  yandexDisk: boolean;
  featureVoting: boolean;
  staticPages: boolean;
}

export interface AdminSettings {
  superAdminEmail: string;
  defaultAdminPassword: string;
  maxFileSize: number;
}

export interface TestUsers {
  email: string;
  password: string;
  displayName: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

export interface RateLimitSettings {
  windowMs: number;
  maxRequests: number;
}

export interface UploadSettings {
  maxFileSize: number;
  uploadDir: string;
  recordingsDir: string;
}

export interface SettingsConfig {
  env: Environment;
  platform: Platform;
  
  app: AppSettings;
  security: SecuritySettings;
  database: DatabaseSettings;
  push: PushSettings;
  yandex: YandexSettings;
  email: EmailSettings;
  features: FeatureFlags;
  admin: AdminSettings;
  rateLimit: RateLimitSettings;
  upload: UploadSettings;
  
  api?: {
    baseUrl: string;
    wsUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    enableLogging: boolean;
  };
  
  messenger?: {
    frontendUrl: string;
    port: number;
    useNewApi: boolean;
    legacyApiUrl: string;
  };
  
  adminPortal?: {
    frontendUrl: string;
    port: number;
  };
  
  testUsers: TestUsers[];
}
