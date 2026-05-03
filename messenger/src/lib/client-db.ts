/**
 * Инициализация клиентской базы данных (RxDB / IndexedDB)
 * Этот файл используется ТОЛЬКО в браузере (клиентская часть)
 */

import { getDatabase } from './database';

let dbInitialized = false;

/**
 * Инициализировать клиентскую базу данных (вызывается один раз при старте)
 */
export async function ensureClientDBInitialized(): Promise<void> {
  if (dbInitialized) {
    return;
  }

  try {
    // Получаем клиентскую базу данных (RxDB / IndexedDB)
    const db = await getDatabase();
    
    if (!db) {
      throw new Error('Failed to get database');
    }
    
    // Проверяем что коллекция users существует
    const usersCollection = db.collections.users;
    if (!usersCollection) {
      throw new Error('Users collection not found');
    }
    
    dbInitialized = true;
    if (process.env.NODE_ENV === 'development') {
      console.log('[ClientDB] ✅ База данных успешно инициализирована');
    }
  } catch (error) {
    console.error('[ClientDB] ❌ Ошибка инициализации базы данных:', error);
    throw error;
  }
}

/**
 * Проверить, инициализирована ли база данных
 */
export function isClientDBInitialized(): boolean {
  return dbInitialized;
}
