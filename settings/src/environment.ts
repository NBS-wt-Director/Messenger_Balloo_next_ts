/**
 * Environment detection and loading
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export type Environment = keyof typeof ENV | string;

/**
 * Get current environment
 */
export function getEnv(): Environment {
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
 * Check if test
 */
export function isTest(): boolean {
  return getEnv() === ENV.TEST;
}

/**
 * Load environment file
 */
export function loadEnvFile(platform: string): void {
  const envPath = getEnvFilePath(platform);
  
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[Settings] Loaded environment from: ${envPath}`);
  } else {
    console.warn(`[Settings] Environment file not found: ${envPath}`);
  }
}

/**
 * Get environment file path
 */
export function getEnvFilePath(platform: string): string {
  const env = getEnv();
  const filename = env === ENV.DEVELOPMENT 
    ? '.env.local' 
    : `.env.${env}`;
  
  // Try project root first, then platform-specific
  const paths = [
    path.join(process.cwd(), filename),
    path.join(process.cwd(), platform, filename),
    path.join(__dirname, '../../', filename),
  ];
  
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return paths[0];
}
