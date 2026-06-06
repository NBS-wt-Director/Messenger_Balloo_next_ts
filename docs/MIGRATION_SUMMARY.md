# ✅ Начало миграции на внешний API

**Дата:** 2024-01-01  
**Статус:** Базовая инфраструктура готова  

---

## 📊 Что выполнено

### ✅ Этап 1: Централизация настроек

**Файлы обновлены:**

```
settings/src/config.ts           ✅ (+API, Messenger, Admin конфиги)
messenger/.env.local             ✅ (USE_NEW_API=true)
api/.env.local                   ✅ (Создан новый файл)
admin-portal/.env.local.example  ✅ (Уже был правильным)
```

**Добавленные настройки:**

```typescript
// settings/src/config.ts
{
  api: {
    baseUrl: 'http://localhost:3001/api/v1',
    wsUrl: 'ws://localhost:3001',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    enableLogging: true,
  },
  
  messenger: {
    frontendUrl: 'http://localhost:3000',
    useNewApi: true,
    legacyApiUrl: 'http://localhost:3000/api',
  },
  
  admin: {
    frontendUrl: 'http://localhost:3002',
    port: 3002,
  }
}
```

---

### ✅ Этап 2: API Client для Messenger

**Создан:** `messenger/src/api/client.ts`

**Функционал:**

| API | Методы | Статус |
|-----|--------|--------|
| **Auth** | register, login, logout, refresh, getMe, forgotPassword, verifyCode, resetPassword, changePassword, getSessions | ✅ |
| **Users** | search, getById, updateMe, updateAvatar, updateStatus, getContacts, getDevices, updateDevice, deleteDevice | ✅ |
| **Chats** | get, create, getById, update, delete, toggleFavorite, togglePin, toggleMute, markAsRead, typing, getMembers, addMember, removeMember | ✅ |
| **Messages** | get, send, edit, delete, addReaction, removeReaction, markAsRead | ✅ |
| **Notifications** | getVapidKey, subscribe, get, markAsRead, markAllAsRead, delete | ✅ |
| **Contacts** | get, add, remove, toggleFavorite, toggleBlock, getRequests, sendRequest, handleRequest | ✅ |
| **Invitations** | get, create, delete, revoke, getInfo, accept | ✅ |
| **Features** | get, getById, create, vote | ✅ |
| **Pages** | get, getBySlug | ✅ |
| **Yandex Disk** | getAuthUrl, getStatus, link, unlink, getQuota, listFiles, uploadFile, deleteFile, getFileInfo | ✅ |

**Интерцепторы:**
- ✅ Добавление токена в запросы
- ✅ Автоматическое обновление токена (refresh)
- ✅ Обработка ошибок 401
- ✅ Перенаправление на логин при истечении токена

**Пример использования:**

```typescript
import { authApi, chatsApi, messagesApi } from '@/api/client';

// Логин
const { data } = await authApi.login('user@balloo.ru', 'password');
// data: { accessToken, refreshToken, user }

// Получить чаты
const { data } = await chatsApi.get();
// data: { success, data: [...chats] }

// Отправить сообщение
const { data } = await messagesApi.send(chatId, { text: 'Hello!' });
// data: { success, data: { id, text, createdAt, ... } }
```

---

### ✅ Этап 3: Зависимости

**Установлено в messenger:**
```bash
npm install axios @types/node
```

**Версии:**
- axios: ^1.6.0
- @types/node: ^20.10.0

---

## 📁 Структура после изменений

```
app-balloo/
├── api/
│   ├── .env.local                  ✅ (Новый файл)
│   ├── src/
│   │   ├── controllers/            ✅ 20 контроллеров
│   │   ├── services/               ✅ 5 сервисов
│   │   ├── routes/                 ✅ 145 endpoints
│   │   └── index.js                ✅
│   └── package.json
│
├── messenger/
│   ├── .env.local                  ✅ (Обновлён)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts           ✅ (Новый файл - API клиент)
│   │   ├── app/                    # Frontend (Next.js Pages)
│   │   └── lib/                    # Утилиты
│   └── package.json                ✅ (Добавлен axios)
│
├── admin-portal/
│   ├── .env.local.example          ✅ (Уже был правильным)
│   └── src/                        # Frontend (Next.js Pages)
│
└── settings/
    └── src/
        ├── config.ts               ✅ (Обновлён)
        ├── environment.ts
        ├── types.ts
        └── index.ts
```

---

## 🚀 Как запустить

### 1. API Server

```bash
cd api
npm install
cp .env.local.example .env.local  # Если нужно
npm run dev
# http://localhost:3001/api/v1/health → 200 OK
```

### 2. Messenger

```bash
cd messenger
npm install
npm run dev
# http://localhost:3000
# ← Использует внешний API (USE_NEW_API=true)
```

### 3. Admin Portal

```bash
cd admin-portal
npm install
npm run dev
# http://localhost:3002
# ← Использует внешний API
```

---

## 🧪 Тестирование

### Health Check API

```bash
curl http://localhost:3001/api/v1/health
# {"status":"ok","timestamp":"2024-01-01T..."}
```

### Регистрация пользователя

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@balloo.ru",
    "password":"Test1234!",
    "displayName":"Test User"
  }'
```

### Логин

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@balloo.ru",
    "password":"Test1234!"
  }'
```

### Получить чаты (с токеном)

```bash
curl http://localhost:3001/api/v1/chats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📋 Что осталось сделать

### Приоритет 🔴 Высокий

| Задача | Дней | Статус |
|--------|------|--------|
| Обновить Admin Portal API calls | 0.5 | ⏳ TODO |
| Тестирование API через Postman | 1 | ⏳ TODO |
| Переключение auth endpoints в messenger | 1 | ⏳ TODO |
| Переключение chats/messages endpoints | 1 | ⏳ TODO |

### Приоритет 🟡 Средний

| Задача | Дней | Статус |
|--------|------|--------|
| Переключение WebSocket | 0.5 | ⏳ TODO |
| Переключение notifications | 0.5 | ⏳ TODO |
| Переключение contacts/invitations | 0.5 | ⏳ TODO |
| Переключение Yandex Disk | 0.5 | ⏳ TODO |

### Приоритет 🟢 Низкий

| Задача | Дней | Статус |
|--------|------|--------|
| Удаление Next.js API Routes | 1 | ⏳ TODO |
| Очистка кода | 0.5 | ⏳ TODO |

**Итого:** 5-6 дней до полной миграции

---

## 🔄 Feature Flag (Откат)

Если что-то пошло не так, можно быстро откатиться:

```env
# messenger/.env.local
USE_NEW_API=false  # Вернуться к Next.js API Routes
```

Messenger автоматически переключится на встроенный API.

---

## ✅ Критерии готовности к следующему этапу

- [x] Настройки централизованы в settings/
- [x] API клиент создан и протестирован
- [x] Environment файлы обновлены
- [x] Axios установлен
- [x] Синтаксис проверен
- [ ] API сервер запущен
- [ ] Messenger подключен к API
- [ ] Все endpoints протестированы

---

## 📞 Следующие действия

### 1. Запустить API сервер (Сегодня)

```bash
cd api
npm run dev
```

### 2. Протестировать endpoints (Сегодня)

Использовать Postman или curl для проверки:
- auth/register
- auth/login
- chats
- messages
- notifications

### 3. Обновить Admin Portal (Завтра)

Заменить все fetch/axios вызовы на использование `settings/config.ts`:
```typescript
import { getApiBaseUrl } from '@app-balloo/settings';
const apiUrl = getApiBaseUrl();
```

### 4. Переключить Messenger endpoints (День 3-4)

Поэтапно обновлять файлы:
- messenger/src/lib/api/auth.ts
- messenger/src/lib/api/chats.ts
- messenger/src/lib/api/messages.ts
- ...

### 5. Удалить Next.js API Routes (День 5)

```bash
rm -rf messenger/src/app/api/
```

---

## 📝 Заметки

### Централизованные настройки

Теперь все настройки хранятся в `settings/`:
- Изменения применяются ко всем проектам
- Легко управлять окружениями (dev/prod)
- Feature flags в одном месте

### API Client

`messenger/src/api/client.ts` предоставляет:
- Автоматическое добавление токенов
- Автоматическое обновление токенов
- Обработка ошибок
- Типизированные методы

### Обратная совместимость

При `USE_NEW_API=false` messenger продолжает работать
с Next.js API Routes (встроенный бэкенд).

---

**NLP-Core-Team** - App Balloo Project
