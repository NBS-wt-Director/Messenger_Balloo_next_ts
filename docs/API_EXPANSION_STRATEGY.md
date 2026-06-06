# 🔄 Стратегия расширения API без поломки функционала

## 📊 Сравнение функционала

### Что есть в api/ (Express.js)
✅ Auth (login, register, refresh, etc.)  
✅ Users CRUD  
✅ Chats CRUD  
✅ Messages CRUD  
✅ Admin panel (40 endpoints)  
✅ Support система  
✅ Internal Chat (NBS w-t)  
✅ Версии приложений  
✅ E2E ключи  
✅ WebSocket (базовый)  

### Чего нет в api/ (есть в messenger)
❌ Yandex Disk интеграция  
❌ Уведомления (Push, email)  
❌ Пригласительные (invitations)  
❌ Статусы/истории (stories)  
❌ Глобальный поиск  
❌ Контакты (block, favorite)  
❌ Записи звонков (хранение)  
❌ Страницы (pages - about, privacy, terms)  
❌ Голосования за фичи (features)  
❌ Блокировки (bans)  
❌ Бэкапы/восстановление  
❌ Инсталлер (config, test-accounts)  
❌ Баланс/баллы пользователей  

---

## 🎯 Стратегия: Расширение без поломки

### Принцип: "Расширяй, не заменяй"

1. **api/** остаётся единственным бэкендом
2. **Добавляем** недостающие модули в api/
3. **Удаляем** дублирующийся бэкенд из messenger ПОСЛЕ проверки
4. **Мессенджер** переключается на api/

---

## 📋 План расширения api/

### Этап 1: Добавление недостающих модулей (5-7 дней)

#### 1.1 Yandex Disk (1 день)

**Создать:**
```
api/src/services/yandex-disk.service.js
api/src/controllers/yandex-disk.controller.js
```

**Маршруты:**
```javascript
POST   /api/v1/disk/link          - Ссылка на авторизацию
GET    /api/v1/disk/callback      - Callback от Yandex
GET    /api/v1/disk/files         - Список файлов
POST   /api/v1/disk/upload        - Загрузка файла
GET    /api/v1/disk/files/:id     - Информация о файле
DELETE /api/v1/disk/files/:id     - Удаление файла
GET    /api/v1/disk/quota         - Квота
```

**Из messenger:** `messenger/src/lib/yandex-disk.ts`

#### 1.2 Уведомления (1-2 дня)

**Создать:**
```
api/src/services/notification.service.js
api/src/controllers/notification.controller.js
```

**Маршруты:**
```javascript
POST   /api/v1/notifications/subscribe  - Подписка на push
POST   /api/v1/notifications/send       - Отправить уведомление
GET    /api/v1/notifications            - Список уведомлений
PUT    /api/v1/notifications/:id/read   - Отметить как прочитанное
POST   /api/v1/notifications/register-token  - Push токен
```

**Из messenger:** `messenger/src/lib/notifications/`

**Зависимости:** `web-push`, `ioredis` (для очереди)

#### 1.3 Пригласительные (1 день)

**Создать:**
```
api/src/controllers/invitations.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/invitations              - Мои приглашения
POST   /api/v1/invitations              - Создать приглашение
DELETE /api/v1/invitations/:id          - Удалить приглашение
PUT    /api/v1/invitations/:id/revoke   - Отозвать
GET    /api/v1/invite/:code             - Информация о приглашении
POST   /api/v1/invite/:code/accept      - Принять приглашение
```

**Из messenger:** `messenger/src/app/api/invitations/`

#### 1.4 Контакты (1 день)

**Создать:**
```
api/src/controllers/contacts.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/contacts                 - Мои контакты
POST   /api/v1/contacts                 - Добавить контакт
DELETE /api/v1/contacts/:userId         - Удалить контакт
PUT    /api/v1/contacts/:userId/favorite    - Избранное
PUT    /api/v1/contacts/:userId/block       - Блокировка
GET    /api/v1/contacts/requests        - Запросы в друзья
POST   /api/v1/contacts/requests        - Отправить запрос
PUT    /api/v1/contacts/requests/:id    - Обработать запрос
GET    /api/v1/users/search             - Поиск пользователей
```

**Из messenger:** `messenger/src/app/api/contacts/`

#### 1.5 Статусы/Истории (1 день)

**Создать:**
```
api/src/controllers/statuses.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/statuses                 - Статусы контактов
POST   /api/v1/statuses                 - Загрузить статус
GET    /api/v1/statuses/:id             - Просмотр статуса
POST   /api/v1/statuses/:id/view        - Пометить просмотренным
DELETE /api/v1/statuses/:id             - Удалить статус
```

**Из messenger:** `messenger/src/app/api/statuses/`

#### 1.6 Страницы (1 день)

**Создать:**
```
api/src/controllers/pages.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/pages                    - Все активные страницы
GET    /api/v1/pages/:slug              - Страница по slug
POST   /api/v1/pages                    - Создать страницу (admin)
PUT    /api/v1/pages/:id                - Обновить страницу (admin)
DELETE /api/v1/pages/:id                - Удалить страницу (admin)
```

**Из messenger:** `messenger/src/app/api/pages/`

**База:** Таблица `pages` в SQLite

#### 1.7 Голосования за фичи (1 день)

**Создать:**
```
api/src/controllers/features.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/features                 - Все фичи
GET    /api/v1/features/:id             - Детали фичи
POST   /api/v1/features                 - Предложить фичу
POST   /api/v1/features/:id/vote        - Голосовать
DELETE /api/v1/features/:id/vote        - Убрать голос (admin)
PUT    /api/v1/features/:id/status      - Изменить статус (admin)
```

**Из messenger:** `messenger/src/app/api/features/`

**База:** Таблица `features` в SQLite

#### 1.8 Блокировки/Bans (1 день)

**Создать:**
```
api/src/controllers/bans.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/admin/bans               - Все баны (admin)
POST   /api/v1/admin/bans               - Забанить пользователя (admin)
DELETE /api/v1/admin/bans/:userId       - Разбанить (admin)
GET    /api/v1/user/bans                - Мои баны
```

**База:** Таблица `bans` в SQLite

#### 1.9 Глобальный поиск (1 день)

**Создать:**
```
api/src/controllers/search.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/global-search            - Поиск по всем сущностям
```

**Из messenger:** `messenger/src/app/api/global-search/`

#### 1.10 Бэкапы/Восстановление (1 день)

**Создать:**
```
api/src/controllers/backup.controller.js
```

**Маршруты:**
```javascript
GET    /api/v1/admin/backup             - Создать бэкап (admin)
POST   /api/v1/admin/backup/restore     - Восстановить (admin)
```

---

### Этап 2: Обновление базы данных (1-2 дня)

#### 2.1 Добавить недостающие таблицы

```javascript
// api/src/config/database.js

// Страницы
database.run(`
  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sections TEXT,
    metadata TEXT,
    isActive INTEGER DEFAULT 1,
    createdBy TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  )
`);

// Голосования за фичи
database.run(`
  CREATE TABLE IF NOT EXISTS features (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'pending',
    votes INTEGER DEFAULT 0,
    votedBy TEXT,
    createdBy TEXT,
    createdByName TEXT,
    adminNote TEXT,
    plannedAt INTEGER,
    completedAt INTEGER,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  )
`);

// Бан-лист
database.run(`
  CREATE TABLE IF NOT EXISTS bans (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    reason TEXT,
    bannedBy TEXT,
    expiresAt INTEGER,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (bannedBy) REFERENCES users(id)
  )
`);

// Индексы
database.run(`CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)`);
database.run(`CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(isActive)`);
database.run(`CREATE INDEX IF NOT EXISTS idx_features_status ON features(status)`);
database.run(`CREATE INDEX IF NOT EXISTS idx_bans_user ON bans(userId)`);
database.run(`CREATE INDEX IF NOT EXISTS idx_bans_expires ON bans(expiresAt)`);
```

---

### Этап 3: Тестирование новых модулей (2-3 дня)

#### 3.1 Unit тесты

```bash
cd api
npm test
```

#### 3.2 Интеграционные тесты

- Протестировать каждый новый endpoint
- Сравнить с messenger API (через Postman/Swagger)
- Проверить аутентификацию и права доступа

#### 3.3 Стек-тесты

- Регистрация + Yandex Disk
- Чат + Уведомления
- Пригласительные + Контакты
- Статусы + Поиск

---

### Этап 4: Переключение messenger (2-3 дня)

#### 4.1 Обновить .env в messenger

```env
# messenger/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

#### 4.2 Обновить API клиент в messenger

**Из:**
```typescript
// messenger/src/api/index.ts
const API_URL = '/api';  // Next.js API Routes
```

**В:**
```typescript
// messenger/src/api/index.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Добавляем токен
apiClient.interceptors.request.use(config => {
  const token = getToken(); // Из auth-store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 4.3 Постепенное отключение Next.js API Routes

**День 1:** Отключить неиспользуемые
```typescript
// messenger/src/middleware.ts
// Добавить проверку на /api/admin, /api/auth и вернуть 410 Gone
```

**День 2:** Перенести 50% функционала на api/

**День 3:** Полное отключение, удалить `src/app/api/`

#### 4.4 Удалить серверную часть из messenger

**Удалить:**
```
messenger/src/app/api/           # ВСЁ
messenger/src/lib/email.js
messenger/src/lib/verification-code.js
messenger/src/lib/auth.ts        # Серверная часть
messenger/src/lib/database.js    # Серверная SQLite
```

**Оставить:**
```
messenger/src/lib/database/      # Только RxDB (IndexedDB)
messenger/src/api/               # API клиент
```

---

### Этап 5: Очистка и оптимизация (1-2 дня)

#### 5.1 Удалить дублирующийся код

- Проверить, что в messenger нет серверных зависимостей
- Удалить `bcryptjs`, `nodemailer` из messenger/package.json
- Оставить только клиентские библиотеки

#### 5.2 Оптимизировать api/

- Добавить кэширование (Redis)
- Настроить rate limiting
- Добавить Swagger документацию

---

## 🛡️ Безопасность миграции

### Стратегия "Красная/Синяя"

| Красный (старый) | Синий (новый) |
|------------------|---------------|
| messenger с Next.js API | messenger с api/ |
| Работает параллельно | Тестируется |
| Не трогать до полного тестирования | Поэтапное переключение |

### Feature flags

```env
# messenger/.env.local
USE_NEW_API=false  # Сначала false, потом true
```

```typescript
// messenger/src/api/index.ts
const API_URL = process.env.USE_NEW_API === 'true'
  ? 'http://localhost:3001/api/v1'
  : '/api';
```

### Пошаговое переключение

```
День 1: 0%  (только тесты)
День 2: 25% (публичные endpoints: auth, users/search)
День 3: 50% (chats, messages)
День 4: 75% (admin, notifications)
День 5: 100% (удалить старый бэкенд)
```

---

## 📊 Оценка времени

| Этап | Время |
|------|-------|
| Yandex Disk | 1 день |
| Уведомления | 1-2 дня |
| Пригласительные | 1 день |
| Контакты | 1 день |
| Статусы | 1 день |
| Страницы | 1 день |
| Голосования | 1 день |
| Бан-лист | 1 день |
| Поиск | 1 день |
| Бэкапы | 1 день |
| База данных | 1-2 дня |
| Тестирование | 2-3 дня |
| Переключение messenger | 2-3 дня |
| Очистка | 1-2 дня |
| **Итого** | **16-22 дня** |

---

## ✅ Преимущества подхода

1. **Безопасно** - api/ расширяется, не заменяется
2. **Поэтапно** - можно откатить на любом этапе
3. **Тестируемо** - каждый модуль тестируется отдельно
4. **Прозрачно** - видно, что переносится
5. **Минимальные риски** - старый бэкенд работает параллельно

---

## 🚀 Итоговая структура после миграции

```
api/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js         ✅
│   │   ├── users.controller.js        ✅
│   │   ├── chats.controller.js        ✅
│   │   ├── messages.controller.js     ✅
│   │   ├── admin.controller.js        ✅
│   │   ├── support.controller.js      ✅
│   │   ├── yandex-disk.controller.js  ⬅️ НОВОЕ
│   │   ├── notification.controller.js ⬅️ НОВОЕ
│   │   ├── invitations.controller.js  ⬅️ НОВОЕ
│   │   ├── contacts.controller.js     ⬅️ НОВОЕ
│   │   ├── statuses.controller.js     ⬅️ НОВОЕ
│   │   ├── pages.controller.js        ⬅️ НОВОЕ
│   │   ├── features.controller.js     ⬅️ НОВОЕ
│   │   ├── bans.controller.js         ⬅️ НОВОЕ
│   │   └── search.controller.js       ⬅️ НОВОЕ
│   ├── services/
│   │   ├── yandex-disk.service.js     ⬅️ НОВОЕ
│   │   ├── notification.service.js    ⬅️ НОВОЕ
│   │   └── call-recording.service.js  ✅
│   ├── routes/
│   │   └── index.js                   # Все маршруты
│   ├── middleware/
│   │   └── auth.js                    ✅
│   ├── websocket/
│   │   └── index.js                   ✅
│   ├── config/
│   │   └── database.js                # + новые таблицы
│   └── index.js                       ✅
└── package.json

messenger/
├── src/
│   ├── app/               # Только фронтенд
│   ├── components/        # UI
│   ├── api/               # API клиент (axios)
│   ├── stores/            # Zustand
│   └── lib/
│       └── database/      # Только RxDB (IndexedDB)
└── package.json

admin-portal/              # Без изменений
settings/                  # Без изменений
```

---

## 🎯 Критерии успеха

- [ ] Все новые модули добавлены в api/
- [ ] Все тесты проходят
- [ ] messenger переключён на api/
- [ ] Next.js API Routes удалены из messenger
- [ ] Нет ошибок в консоли
- [ ] Все фичи работают как раньше
- [ ] admin-portal работает
- [ ] Internal Chat работает
- [ ] Support система работает

---

**Рекомендация:** Начинать с менее критичных модулей (pages, features), потом перейти к критичным (auth, chats, messages).
