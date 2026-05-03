/**
 * Инициализация базы данных при старте приложения
 */

import db from '@/lib/database';

let dbInitialized = false;

/**
 * Инициализировать базу данных (вызывается один раз при старте)
 */
export function ensureDBInitialized(): void {
  if (dbInitialized) {
    return;
  }

  try {
    // SQLite инициализируется автоматически при импорте
    // Проверяем что таблица User существует
    const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='User'").get();
    
    if (!table) {
      throw new Error('User table not found');
    }
    
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
