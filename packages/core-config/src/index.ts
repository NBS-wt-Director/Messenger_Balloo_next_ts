/**
 * Core Config - Platform-wide configuration
 * 
 * Extraction from: settings/src/
 * 
 * Migration Status:
 * - Phase 4: Core config extracted from settings/
 * - Backward compatibility maintained in settings/
 * - Legacy apps still use @app-balloo/settings
 */

// ============================================================================
// Types
// ============================================================================

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
} from './types';

// ============================================================================
// Implementation
// ============================================================================

export {
  initSettings,
  getSettings,
  getEnvironment,
  isDevelopment,
  isProduction,
  getApiUrl,
  getWsUrl,
  getApiBaseUrl,
  getMaxFileSize,
  isRegistrationEnabled,
  isMaintenanceMode,
} from './config';