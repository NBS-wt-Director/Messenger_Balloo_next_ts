/**
 * App Balloo - Shared Settings
 * Централизованные настройки для всех саб-репозиториев
 * 
 * BACKWARD COMPATIBILITY LAYER
 * ============================
 * This package re-exports from @balloo/core-config during migration (Phase 4).
 * Legacy applications continue to use @app-balloo/settings without changes.
 */

// Re-export types from core-config for backward compatibility
export type {
  Environment,
  Platform,
  AppSettings,
  SecuritySettings,
  DatabaseSettings,
  PushSettings,
  YandexSettings,
  EmailSettings,
  FeatureFlags,
  AdminSettings,
  TestUsers,
  RateLimitSettings,
  UploadSettings,
  ApiSettings,
  MessengerSettings,
  AdminPortalSettings,
  SettingsConfig,
} from '@balloo/core-config';

// Keep existing exports from environment.ts (not migrated yet)
export { getEnv, isDev, isProd, isTest, loadEnvFile, getEnvFilePath } from './environment';

// TODO: After full migration, remove this file and update all imports
