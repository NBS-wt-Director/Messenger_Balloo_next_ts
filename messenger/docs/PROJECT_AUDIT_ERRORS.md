# 🔍 Аудит Проекта Balloo Messenger

## Дата: 2024

---

## 📊 Общая Статистика

| Метрика | Значение |
|---------|----------|
| **API Endpoints** | 32 |
| **Схемы БД** | 8 |
| **Страниц** | ~20 |
| **Компонентов** | ~15 |
| **Хуков** | 1 |
| **Документов** | 11 |

---

## 🚨 Критические Ошибки

### 1. **Отсутствует зависимость `web-push` в package.json**

#### Проблема:
```typescript
// src/app/api/notifications/send/route.ts
import webpush from 'web-push';  // ❌ Нет в package.json
```

#### Решение:
```bash
npm install web-push
```

#### Файлы:
- `package.json`
- `src/app/api/notifications/send/route.ts`

---

### 2. **VAPID ключи не сгенерированы**

#### Проблема:
```typescript
// src/app/api/notifications/send/route.ts
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
  'BG5hT9Vqz_YvZ7k3X8jN2mR4wP6sQ1uL0oI9yH8gF7dC5bA3nM2kJ1hG0fE4dD6cC8bB9aA7zY6xW5vU4tS3rR2qP1';
// ❌ Дефолтный ключ не будет работать в production
```

#### Решение:
```bash
npx web-push generate-vapid-keys
```

Затем добавить в `.env.local`:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_real_public_key
VAPID_PRIVATE_KEY=your_real_private_key
```

---

### 3. **Service Worker не зарегистрирован на клиенте**

#### Проблема:
Service Worker существует (`public/sw.js`), но нет кода для его регистрации.

#### Решение:
Создать файл `src/lib/service-worker.ts`:
```typescript
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('[SW] Registered:', registration);
      return registration;
    } catch (error) {
      console.error('[SW] Registration failed:', error);
    }
  }
  return null;
}
```

Вызвать в `src/app/layout.tsx`:
```typescript
useEffect(() => {
  registerServiceWorker();
}, []);
```

---

### 4. **Отсутствует manifest.json**

#### Проблема:
PWA требует `manifest.json` для установки.

#### Решение:
Создать `public/manifest.json`:
```json
{
  "name": "Balloo Messenger",
  "short_name": "Balloo",
  "description": "Мессенджер с шифрованием",
  "start_url": "/chats",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### 5. **RxDB использует in-memory storage**

#### Проблема:
```typescript
// src/lib/database/index.ts
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
// ❌ Данные теряются после перезагрузки
```

#### Решение:
Заменить на IndexedDB:
```bash
npm install rxdb/plugins/storage-indexeddb
```

```typescript
import { getRxStorageIndexedDB } from 'rxdb/plugins/storage-indexeddb';

const database = await createRxDatabase({
  name: 'balloo',
  storage: wrappedValidateAjvStorage({
    storage: getRxStorageIndexedDB()
  }),
  // ...
});
```

---

## ⚠️ Серьёзные Недоработки

### 6. **Нет авторизации в API endpoints**

#### Проблема:
Большинство API endpoints не проверяют JWT токен или сессию пользователя.

#### Пример:
```typescript
// src/app/api/chats/route.ts
export async function GET(request: NextRequest) {
  // ❌ Нет проверки авторизации
  const usersCollection = await getUsersCollection();
  // ...
}
```

#### Решение:
Добавить middleware или проверку токена:
```typescript
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization');
  const user = await verifyToken(token);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}
```

---

### 7. **Нет валидации входных данных**

#### Проблема:
API endpoints не валидируют входные данные достаточно строго.

#### Пример:
```typescript
const { userId, subscription } = await request.json();
// ❌ Нет проверки типа, формата, длины
```

#### Решение:
Использовать Zod для валидации:
```bash
npm install zod
```

```typescript
import { z } from 'zod';

const subscribeSchema = z.object({
  userId: z.string().min(1).max(100),
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string()
    })
  }),
  platform: z.enum(['web', 'android', 'ios']).optional()
});

const body = subscribeSchema.parse(await request.json());
```

---

### 8. **Нет обработки ошибок 410/404 для push токенов**

#### Проблема:
В `send/route.ts` ошибка 410 обрабатывается, но токены не удаляются автоматически.

#### Файл:
`src/app/api/notifications/send/route.ts`

#### Решение:
Токены уже удаляются (реализовано), но нужно добавить логирование:
```typescript
if (error.statusCode === 410) {
  console.log('[Push] Token expired, removing:', tokenData.token);
  expiredTokens.push(tokenData.token);
}
```

---

### 9. **Хук usePushNotifications не экспортируется**

#### Проблема:
Хук создан, но нет центрального экспорта.

#### Решение:
Создать `src/hooks/index.ts`:
```typescript
export { usePushNotifications } from './usePushNotifications';
```

---

### 10. **Нет ограничения на 15 закреплённых чатов**

#### Проблема:
В ChatsPage нет проверки на максимальное количество закреплённых чатов.

#### Файл:
`src/components/pages/ChatsPage.tsx`

#### Решение:
```typescript
case 'pin':
  const pinnedChats = chats.filter((c: any) => c.pinned?.[user.id]);
  if (!chat.pinned?.[user.id] && pinnedChats.length >= 15) {
    alert('Можно закрепить максимум 15 чатов');
    return;
  }
  // ...
```

---

## 📝 Мелкие Недоработки

### 11. **Нет иконок для PWA**

#### Проблема:
В manifest.json указаны иконки, но файлы могут отсутствовать.

#### Решение:
Создать папку `public/icons/` с файлами:
- `icon-192x192.png`
- `icon-512x512.png`
- `badge-72x72.png`

---

### 12. **Нет страницы /invite/[code]**

#### Проблема:
Ссылки на приглашения ведут на несуществующую страницу.

#### Решение:
Создать `src/app/invite/[code]/page.tsx`:
```typescript
export default function InvitePage({ params }: { params: { code: string } }) {
  // Загрузка информации о приглашении
  // Предпросмотр чата
  // Кнопка "Принять приглашение"
}
```

---

### 13. **Техподдержка не связана с админкой**

#### Проблема:
Чат с техподдержкой существует, но нет API для связи с админкой.

#### Решение:
Создать API endpoint:
```typescript
// src/app/api/support/messages/route.ts
// Для админов - получение сообщений из чатов поддержки
// Для пользователей - отправка сообщений в поддержку
```

---

### 14. **Нет разделения на production/development режимы**

#### Проблема:
VAPID ключи и другие настройки не разделены по окружениям.

#### Решение:
Создать `.env.example`:
```env
# Development
NEXT_PUBLIC_VAPID_PUBLIC_KEY=dev_public_key
VAPID_PRIVATE_KEY=dev_private_key

# Production
# NEXT_PUBLIC_VAPID_PUBLIC_KEY=prod_public_key
# VAPID_PRIVATE_KEY=prod_private_key
```

---

### 15. **Нет тестов**

#### Проблема:
Отсутствуют unit/integration тесты.

#### Решение:
Добавить Jest + React Testing Library:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

Создать `jest.config.js` и тесты для:
- API endpoints
- Компонентов
- Хуков

---

### 16. **Нет CI/CD конфигурации**

#### Проблема:
Нет GitHub Actions или другого CI/CD.

#### Решение:
Создать `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run lint
      - run: npm test
```

---

### 17. **Нет rate limiting для API**

#### Проблема:
API endpoints не защищены от злоупотреблений.

#### Решение:
Использовать `express-rate-limit` или аналог:
```typescript
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // 100 запросов
});
```

---

### 18. **Нет логирования ошибок**

#### Проблема:
Ошибки логируются в console.error, но не сохраняются.

#### Решение:
Использовать Winston или аналог:
```bash
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

### 19. **Нет проверки версии схемы БД**

#### Проблема:
Схемы RxDB имеют version: 0, но нет миграций.

#### Файл:
`src/lib/database/schema.ts`

#### Решение:
Добавить migration strategy:
```typescript
const userSchema = {
  version: 1, // Увеличить версию
  // ...
  migrationStrategies: {
    1: (oldDoc) => {
      // Миграция с версии 0 на 1
      return {
        ...oldDoc,
        newField: 'default'
      };
    }
  }
};
```

---

### 20. **Нет страницы админки для жалоб**

#### Проблема:
API для жалоб есть, но нет UI в админке.

#### Решение:
Создать `src/app/admin/reports/page.tsx`:
```typescript
// Список жалоб
// Фильтры по статусу
// Кнопки "Принять", "Отклонить"
// Просмотр деталей
```

---

## 📋 Список Исправлений по Приоритету

### 🔴 Критические (сделать немедленно):
1. ✅ Добавить `web-push` в зависимости
2. ✅ Сгенерировать VAPID ключи
3. ✅ Зарегистрировать Service Worker
4. ✅ Создать manifest.json
5. ✅ Заменить in-memory на IndexedDB

### 🟡 Серьёзные (сделать в ближайшем спринте):
6. Добавить авторизацию в API
7. Добавить валидацию с Zod
8. Экспортировать хуки
9. Ограничить закреплённые чаты
10. Добавить иконки PWA

### 🟢 Мелкие (улучшения):
11. Создать страницу приглашений
12. Связать поддержку с админкой
13. Разделить config по окружениям
14. Добавить тесты
15. Настроить CI/CD
16. Добавить rate limiting
17. Настроить логирование
18. Добавить миграции БД
19. Создать UI для жалоб в админке

---

## ✅ Статус Исправлений

| Ошибка | Статус | Приоритет |
|--------|--------|-----------|
| 1. web-push зависимость | ❌ Не исправлено | 🔴 |
| 2. VAPID ключи | ❌ Не исправлено | 🔴 |
| 3. Service Worker | ❌ Не исправлено | 🔴 |
| 4. manifest.json | ❌ Не исправлено | 🔴 |
| 5. IndexedDB storage | ❌ Не исправлено | 🔴 |
| 6. Авторизация API | ❌ Не исправлено | 🟡 |
| 7. Валидация Zod | ❌ Не исправлено | 🟡 |
| 8. Обработка 410 | ⚠️ Частично | 🟡 |
| 9. Экспорт хуков | ❌ Не исправлено | 🟢 |
| 10. Лимит закреплённых | ❌ Не исправлено | 🟢 |
| 11. Иконки PWA | ❌ Не исправлено | 🟢 |
| 12. Страница приглашений | ❌ Не исправлено | 🟢 |
| 13. Поддержка-админка | ❌ Не исправлено | 🟢 |
| 14. Окружения | ❌ Не исправлено | 🟢 |
| 15. Тесты | ❌ Не исправлено | 🟢 |
| 16. CI/CD | ❌ Не исправлено | 🟢 |
| 17. Rate limiting | ❌ Не исправлено | 🟢 |
| 18. Логирование | ❌ Не исправлено | 🟢 |
| 19. Миграции БД | ❌ Не исправлено | 🟢 |
| 20. UI жалоб | ❌ Не исправлено | 🟢 |

---

## 📈 Рекомендации

### Немедленные действия:
1. Установить `web-push`
2. Сгенерировать VAPID ключи
3. Добавить manifest.json
4. Зарегистрировать Service Worker
5. Переключиться на IndexedDB
6. сделай реальную возможность подписки на уведомления с ллюбого браузера.

### Краткосрочные (1-2 недели):
1. Добавить авторизацию во все API
2. Добавить валидацию Zod
3. Создать страницу приглашений
4. Создать UI для жалоб в админке

### Долгосрочные (1 месяц):
1. Написать тесты
2. Настроить CI/CD
3. Добавить rate limiting
4. Настроить логирование
5. Добавить миграции БД

---

**Аудит завершён!** 🔍
