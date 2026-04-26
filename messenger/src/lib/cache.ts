/**
 * Утилита для кэширования ответов API
 * 
 * Использование:
 * ```typescript
 * const cached = await cacheResponse(
 *   'user:123:profile',
 *   async () => await fetchFromDB(),
 *   3600 // TTL в секундах
 * );
 * ```
 */

// В памяти кэш (для production использовать Redis)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

interface CacheOptions {
  ttl: number; // Время жизни в секундах
  tags?: string[]; // Теги для инвалидации
}

const defaultOptions: CacheOptions = {
  ttl: 3600, // 1 час по умолчанию
  tags: [],
};

/**
 * Получить данные из кэша или выполнить функцию
 */
export async function cacheResponse<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: Partial<CacheOptions> = {}
): Promise<T> {
  const { ttl, tags } = { ...defaultOptions, ...options };
  const now = Date.now();
  const cacheKey = `cache:${key}`;
  
  // Проверка кэша
  const cached = cache.get(cacheKey);
  if (cached && now < cached.timestamp + cached.ttl * 1000) {
    return cached.data as T;
  }
  
  // Выполнение функции и сохранение в кэш
  const data = await fetchFn();
  cache.set(cacheKey, {
    data,
    timestamp: now,
    ttl: ttl * 1000,
  });
  
  return data;
}

/**
 * Удалить данные из кэша
 */
export function invalidateCache(key: string): void {
  const cacheKey = `cache:${key}`;
  cache.delete(cacheKey);
}

/**
 * Удалить данные по тегу
 */
export function invalidateCacheByTag(tag: string): void {
  // В production использовать Redis с тегами
  // Здесь упрощённая реализация
  for (const [key, value] of cache.entries()) {
    if (key.includes(`tag:${tag}`)) {
      cache.delete(key);
    }
  }
}

/**
 * Очистить весь кэш
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Получить статистику кэша
 */
export function getCacheStats(): { size: number; entries: number } {
  const now = Date.now();
  let validEntries = 0;
  
  for (const [, value] of cache.entries()) {
    if (now < value.timestamp + value.ttl) {
      validEntries++;
    }
  }
  
  return {
    size: cache.size,
    entries: validEntries,
  };
}

// Автоматическая очистка старых записей
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.timestamp + value.ttl) {
      cache.delete(key);
    }
  }
}, 60000); // Раз в минуту
