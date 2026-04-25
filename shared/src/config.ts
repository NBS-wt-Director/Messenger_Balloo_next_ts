/**
 * Shared Configuration - Environment-specific configs
 */

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

export const PLATFORMS = {
  WEB: 'web',
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
  ANDROID_SERVICE: 'android-service',
} as const;

export const OS_TYPES = {
  WINDOWS: 'windows',
  MACOS: 'macos',
  LINUX: 'linux',
  ANDROID: 'android',
  IOS: 'ios',
} as const;

/**
 * Get current environment
 */
export function getEnv(): string {
  return process.env.NODE_ENV || ENV.DEVELOPMENT;
}

/**
 * Check if development
 */
export function isDev(): boolean {
  return getEnv() === ENV.DEVELOPMENT;
}

/**
 * Check if production
 */
export function isProd(): boolean {
  return getEnv() === ENV.PRODUCTION;
}

/**
 * API URLs per environment
 */
export const API_URLS = {
  [ENV.DEVELOPMENT]: 'http://localhost:3000/api',
  [ENV.TEST]: 'http://localhost:3000/api',
  [ENV.PRODUCTION]: process.env.API_URL || 'https://api.balloo.ru/api',
};

/**
 * Get API URL for current environment
 */
export function getApiUrl(): string {
  return API_URLS[getEnv() as keyof typeof API_URLS];
}

/**
 * Feature flags
 */
export const FEATURES = {
  PUSH_NOTIFICATIONS: true,
  E2E_ENCRYPTION: false,
  VIDEO_CALLS: false,
  SCREEN_SHARE: false,
  FILE_UPLOAD: true,
  INVITATION_SYSTEM: true,
  ADMIN_PANEL: true,
  MULTI_ACCOUNT: true,
};
