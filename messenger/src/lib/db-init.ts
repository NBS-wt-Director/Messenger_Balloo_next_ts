/**
 * Инициализация базы данных при старте приложения
 */

import { getDatabase } from '@/lib/database';

let dbInitialized = false;

/**
 * Инициализировать базу данных (вызывается один раз при старте)
 */
export async function ensureDBInitialized(): Promise<void> {
  if (dbInitialized) {
    return;
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB] 🔄 Инициализация базы данных...');
    }
    await getDatabase();
    dbInitialized = true;
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB] ✅ База данных успешно инициализирована');
    }
  } catch (error) {
    console.error('[DB] ❌ Ошибка инициализации базы данных:', error);
    throw error;
  }
}

/**
 * Проверить, инициализирована ли база данных
 */
export function isDBInitialized(): boolean {
  return dbInitialized;
}
