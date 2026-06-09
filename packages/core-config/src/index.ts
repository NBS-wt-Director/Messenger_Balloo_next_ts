// Core Config - Stub
// Future migration from: settings/src/config.ts

export interface PlatformConfig {
  env: 'development' | 'production' | 'test';
  platform: string;
  
  app: {
    appName: string;
    appVersion: string;
    appUrl: string;
  };
  
  api: {
    baseUrl: string;
    timeout: number;
  };
  
  features: {
    pushNotifications: boolean;
    e2eEncryption: boolean;
    adminPanel: boolean;
  };
}

// Migration plan:
// 1. Copy types from settings/src/types.ts
// 2. Copy config logic from settings/src/config.ts
// 3. Keep backward compatibility with @app-balloo/settings