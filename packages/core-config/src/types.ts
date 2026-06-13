/**
 * Core Config - Type Definitions
 * 
 * Extraction from: settings/src/types.ts
 */

// ============================================================================
// Environment Types
// ============================================================================

export type Environment = 'development' | 'production' | 'test';

export type Platform = 
  | 'web' 
  | 'mobile' 
  | 'desktop' 
  | 'android-service' 
  | 'api' 
  | 'messenger' 
  | 'admin-portal';

// ============================================================================
// App Settings
// ============================================================================

export interface AppSettings {
  appName: string;
  appVersion: string;
  appUrl: string;
  description: string;
}

// ============================================================================
// Security Settings
// ============================================================================

export interface SecuritySettings {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  encryptionKey: string;
}

// ============================================================================
// Database Settings
// ============================================================================

export interface DatabaseSettings {
  path: string;
  name: string;
  multiInstance: boolean;
}

// ============================================================================
// Push Settings
// ============================================================================

export interface PushSettings {
  vapidPublicKey: string;
  vapidPrivateKey: string;
  subject: string;
}

// ============================================================================
// Yandex Settings
// ============================================================================

export interface YandexSettings {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  diskBaseUrl: string;
  diskFolder: string;
}

// ============================================================================
// Email Settings
// ============================================================================

export interface EmailSettings {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

// ============================================================================
// Feature Flags
// ============================================================================

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

// ============================================================================
// Admin Settings
// ============================================================================

export interface AdminSettings {
  superAdminEmail: string;
  defaultAdminPassword: string;
  maxFileSize: number;
}

// ============================================================================
// Test Users
// ============================================================================

export interface TestUsers {
  email: string;
  password: string;
  displayName: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

// ============================================================================
// Rate Limit Settings
// ============================================================================

export interface RateLimitSettings {
  windowMs: number;
  maxRequests: number;
}

// ============================================================================
// Upload Settings
// ============================================================================

export interface UploadSettings {
  maxFileSize: number;
  uploadDir: string;
  recordingsDir: string;
}

// ============================================================================
// API Settings
// ============================================================================

export interface ApiSettings {
  baseUrl: string;
  wsUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
}

// ============================================================================
// Messenger Settings
// ============================================================================

export interface MessengerSettings {
  frontendUrl: string;
  port: number;
  useNewApi: boolean;
  legacyApiUrl: string;
}

// ============================================================================
// Admin Portal Settings
// ============================================================================

export interface AdminPortalSettings {
  frontendUrl: string;
  port: number;
}

// ============================================================================
// Main Config Type
// ============================================================================

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
  
  api?: ApiSettings;
  messenger?: MessengerSettings;
  adminPortal?: AdminPortalSettings;
  
  testUsers: TestUsers[];
}
