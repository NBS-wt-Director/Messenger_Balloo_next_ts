# 🎈 BALLOO PLATFORM — МАСТЕР-ДОКУМЕНТ ВОССТАНОВЛЕНИЯ

**Версия:** 1.0.0  
**Дата:** 2026-06-23  
**Автор:** Koda AI (NLP-Core-Team)  
**Назначение:** Полное воссоздание экосистемы Balloo с нуля

---

## ОГЛАВЛЕНИЕ

1. [Архитектура и Инфраструктура](#1-архитектура-и-инфраструктура)
2. [API Gateway (Backend)](#2-api-gateway-backend)
3. [Messenger (Frontend Web)](#3-messenger-frontend-web)
4. [Admin Portal](#4-admin-portal)
5. [Полная Карта API Endpoints](#5-полная-карта-api-endpoints)
6. [Все Экраны и Страницы](#6-все-экраны-и-страницы)
7. [Все UI Компоненты](#7-все-ui-компоненты)
8. [База Данных и Схемы](#8-база-данных-и-схемы)
9. [WebSocket Real-time](#9-websocket-real-time)
10. [Безопасность и Аутентификация](#10-безопасность-и-аутентификация)
11. [Правила и Ограничения](#11-правила-и-ограничения)
12. [Интеграции](#12-интеграции)
13. [Future Pages (Placeholder)](#13-future-pages-placeholder)
14. [Deploy и Run](#14-deploy-and-run)

---

## 1. АРХИТЕКТУРА И ИНФРАСТРУКТУРА

### 1.1 Стек Технологий

| Компонент | Технология | Порт |
|-----------|-----------|------|
| **API Gateway** | Node.js 20, Express.js, TypeScript | 3001 |
| **Messenger Web** | Next.js 15, React 19, TypeScript | 3000 |
| **Admin Portal** | Next.js 15, React 19, TypeScript | 3002 |
| **Database** | PostgreSQL 15 (через PgBouncer) | 5432/6432 |
| **Cache/Queue** | Redis 7 | 6379 |
| **WebSocket** | Socket.IO | 3001 |
| **Reverse Proxy** | Nginx | 80/443 |
| **Desktop** | Electron + React (планируется) | 3003 |
| **Mobile** | React Native (планируется) | - |

### 1.2 Структура Проекта

```
Balloo/
├── api/                    # API Gateway (Express.js)
│   ├── src/
│   │   ├── config/         # БД, Redis, Logger
│   │   ├── controllers/    # 30+ контроллеров
│   │   ├── middleware/     # Auth, RateLimit, Upload
│   │   ├── routes/         # API маршруты
│   │   ├── services/       # Бизнес-логика
│   │   ├── websocket/      # Socket.IO handlers
│   │   └── index.ts        # Точка входа
│   └── Dockerfile
├── messenger/              # Web Messenger (Next.js)
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── api/        # API Routes (proxy to backend)
│   │   │   ├── auth/       # Страницы auth
│   │   │   ├── chats/      # Чаты
│   │   │   ├── settings/   # Настройки
│   │   │   └── ...
│   │   ├── components/     # React компоненты
│   │   ├── hooks/          # Custom hooks
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Утилиты
│   │   └── i18n/           # 11 языков
│   └── Dockerfile
├── admin-portal/           # Admin Dashboard (Next.js)
├── packages/               # Shared packages
│   ├── core-ui/            # 30+ UI компонентов
│   ├── core-theme/         # Темы (dark/light/russia)
│   ├── core-brand/         # Логотип, бренд
│   ├── core-i18n/          # i18n schema
│   ├── core-types/         # TS типы
│   ├── core-config/        # Конфигурация
│   └── core-yandex-disk/   # Yandex Disk client
├── docker-compose.yml      # Основная конфигурация
├── docker-compose.full.yml # Полная (20 сервисов)
└── nginx/                  # Nginx конфигурация
```

### 1.3 Зависимости между Узлами

```
┌─────────────┐     HTTP/WebSocket     ┌─────────────┐
│  Messenger   │ ◄──────────────────► │   API GW     │
│  (Next.js)   │                      │  (Express)   │
└─────────────┘                        └──────┬──────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
              ┌─────▼─────┐           ┌──────▼──────┐           ┌──────▼──────┐
              │PostgreSQL │           │    Redis    │           │  Yandex   │
              │  (5432)   │           │   (6379)    │           │   Disk    │
              └───────────┘           └─────────────┘           └───────────┘
```

---

## 2. API GATEWAY (BACKEND)

### 2.1 Точка Входа

**Файл:** `api/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { server } from './websocket';
import routes from './routes';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api/v1', routes);

server.listen(3001, () => {
  console.log('API Gateway running on port 3001');
});
```

### 2.2 Middleware

**Auth Middleware:** `api/src/middleware/auth.js`
- Проверяет JWT в заголовке `Authorization: Bearer <token>`
- Добавляет `req.user` с данными пользователя
- Статус 401 при ошибке

**Rate Limiting:** `api/src/middleware/rateLimit.js`
```javascript
globalLimiter: 100 req / 15 min
authLimiter: 20 req / hour
smsLimiter: 10 SMS / hour
uploadLimiter: 50 uploads / hour
```

**Validation:** `api/src/middleware/validation.js`
- Zod schemas для валидации всех входящих данных
- Статус 400 при ошибке валидации

**Upload:** `api/src/middleware/upload`
- Multer для загрузки файлов
- Лимит: 10MB
- Типы: image/*, video/*, application/pdf

### 2.3 Контроллеры Backend (30+)

| Контроллер | Файл | Функционал |
|-----------|------|-----------|
| Auth | `auth.controller.js` | login, register, refresh, yandex, 2fa |
| Users | `users.controller.js` | CRUD пользователей, avatar |
| Chats | `chats.controller.js` | CRUD чатов, участники |
| Messages | `messages.controller.js` | Отправка, редактирование, реакции |
| Admin | `admin.controller.js` | Статистика, управление |
| Bans | `bans.controller.js` | Бан-лист |
| Calls | `calls.controller.js` | WebRTC звонки, запись |
| Contacts | `contacts.controller.js` | Контакты, блокировка |
| Features | `features.controller.js` | Голосования за фичи |
| Groups | `groups.controller.js` | Группы |
| Invitations | `invitations.controller.js` | Приглашения |
| Lists | `lists.controller.js` | Списки |
| Notification | `notification.controller.js` | Уведомления |
| Notifications | `notifications.controller.js` | Push, email |
| Pages | `pages.controller.js` | About, Privacy, Terms |
| Polls | `polls.controller.js` | Опросы |
| Quizzes | `quizzes.controller.js` | Квизы |
| Reports | `reports.controller.js` | Отчёты |
| Search | `search.controller.js` | Глобальный поиск |
| Statuses | `statuses.controller.js` | Статусы/истории |
| Surveys | `surveys.controller.js` | Анкеты |
| Sync | `sync.controller.js` | Синхронизация ключей |
| Theme Subscriptions | `theme-subscriptions.controller.js` | Подписки на темы |
| Themes | `themes.controller.js` | Темы |
| WebRTC | `webrtc.controller.js` | Сигнализация звонков |
| Yandex Auth | `yandex-auth.controller.js` | OAuth Яндекс |
| Yandex Disk | `yandex-disk.controller.js` | Файловое хранилище |
| Audio | `audio.controller.js` | Аудио обработка |

### 2.4 Сервисы

| Сервис | Файл | Назначение |
|--------|------|-----------|
| 2FA Router | `2fa-router.service.js` | TOTP двухфакторка |
| Call Recording | `call-recording.service.js` | Запись звонков на Yandex Disk |
| Email | `email.service.js` | Отправка писем (nodemailer) |
| Notification | `notification.service.js` | Push, email, WebSocket |
| Queue | `queue.service.js` | Bull очереди |
| SMS Retry | `sms-retry.service.js` | Повторная отправка SMS |
| SMS | `sms.service.js` | Интеграция с Max Server |
| Storage | `storage.service.js` | Yandex Disk / Local |
| Yandex Disk | `yandex-disk.service.js` | Клиент Yandex Disk API |

### 2.5 WebSocket (Socket.IO)

**Файлы:**
- `api/src/websocket/index.js` — Инициализация сервера
- `api/src/websocket/handler.js` — Обработчики событий
- `api/src/websocket/manager.js` — Управление комнатами

**События Client → Server:**
```javascript
join_chat, leave_chat, message, typing, read, call, call:accepted, call:ended
```

**События Server → Client:**
```javascript
message, typing, chat_updated, user:status, user:online, user:offline, call, call:accepted, call:ended, disconnect, reconnect
```

**Комнаты:**
- `conversation:{id}` — чаты
- `user:{id}` — пользователь

---

## 3. MESSENGER (FRONTEND WEB)

### 3.1 Структура

```
messenger/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes (proxy)
│   │   ├── auth/              # Страницы auth
│   │   ├── chats/             # Чаты
│   │   ├── settings/          # Настройки
│   │   ├── components/        # UI компоненты
│   │   ├── hooks/             # Custom hooks
│   │   ├── stores/            # Zustand stores
│   │   ├── lib/               # Утилиты
│   │   └── i18n/              # 11 языков
│   └── ...
```

### 3.2 Zustand Stores

**Auth Store:** `messenger/src/stores/auth-store.ts`
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
```

**Chat Store:** `messenger/src/stores/chat-store.ts`
```typescript
interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId) => Promise<void>;
  sendMessage: (content, files?) => Promise<void>;
  joinChat: (chatId) => void;
}
```

**Settings Store:** `messenger/src/stores/settings-store.ts`
```typescript
interface SettingsState {
  theme: 'dark' | 'light' | 'russia';
  language: 'ru' | 'en';
  notifications: { push: boolean; email: boolean; sound: boolean };
  setTheme: (theme) => void;
  setLanguage: (lang) => void;
}
```

**Accounts Store:** `messenger/src/stores/accounts-store.ts`
- Управление несколькими аккаунтами

### 3.3 Custom Hooks

| Хук | Файл | Назначение |
|-----|------|-----------|
| useAlert | `hooks/useAlert.tsx` | Модальные алерты |
| useE2EEncryption | `hooks/useE2EEncryption.ts` | E2E шифрование |
| usePushNotifications | `hooks/usePushNotifications.ts` | Web Push |
| useWebSocket | `hooks/useWebSocket.ts` | Socket.IO |

### 3.4 Библиотеки (lib)

| Файл | Назначение |
|------|-----------|
| `lib/api-error-handler.ts` | Обработка ошибок API |
| `lib/auth.ts` | Утилиты авторизации |
| `lib/avatar.js` | Обработка аватаров |
| `lib/cache.ts` | Кэширование |
| `lib/config.ts` | Конфигурация |
| `lib/crypto.ts` | E2E шифрование (tweetnacl) |
| `lib/database/` | RxDB (IndexedDB) |
| `lib/email.js` | Email утилиты |
| `lib/file-logger.ts` | Логирование файлов |
| `lib/image-optimizer.ts` | Оптимизация изображений |
| `lib/logger.ts` | Winston logger |
| `lib/notifications/index.ts` | Менеджер уведомлений |
| `lib/password.ts` | Хеширование паролей |
| `lib/pwa.ts` | PWA конфигурация |
| `lib/screen-share/index.ts` | Screen sharing |
| `lib/service-worker.ts` | Service Worker |
| `lib/yandex-disk.ts` | Yandex Disk клиент |

### 3.5 i18n (11 Языков)

**Файлы переводов:** `messenger/src/i18n/locales/`
- `en.ts` — English
- `ru.ts` — Russian
- `tt.ts` — Tatar
- `ba.ts` — Bashkir
- `sah.ts` — Sakha/Yakut
- `udm.ts` — Udmurt
- `ce.ts` — Chechen
- `cv.ts` — Chuvash
- `os.ts` — Ossetian
- `hi.ts` — Hindi
- `zh.ts` — Chinese

---

## 4. ADMIN PORTAL

### 4.1 Страницы

| Страница | Path | Назначение |
|----------|------|-----------|
| Login | `/login` | Вход админа |
| Dashboard | `/dashboard` | Статистика, графики |
| Users | `/users` | Управление пользователями |
| Messages | `/messages` | Мониторинг сообщений |
| Analytics | `/analytics` | Аналитика (Recharts) |
| Settings | `/settings` | Настройки системы |

### 4.2 Функционал

- Статистика: пользователи, чаты, сообщения, баны
- Управление пользователями: бан, роль, удаление
- Мониторинг сообщений: поиск, фильтрация
- Аналитика: рост пользователей, ретеншн, география
- Настройки: регистрация, SMS, Yandex, БД, Redis

---

## 5. ПОЛНАЯ КАРТА API ENDPOINTS

### 5.1 Backend API (`/api/v1/`)

#### Auth (14 endpoints)
```
POST   /api/v1/auth/register            # Регистрация
POST   /api/v1/auth/login               # Вход
POST   /api/v1/auth/logout              # Выход
POST   /api/v1/auth/refresh             # Refresh token
POST   /api/v1/auth/yandex              # Яндекс OAuth
POST   /api/v1/auth/2fa/enable          # Включить 2FA
POST   /api/v1/auth/2fa/verify          # Подтвердить 2FA
POST   /api/v1/auth/forgot-password     # Забыл пароль
POST   /api/v1/auth/reset-password      # Сброс пароля
POST   /api/v1/auth/verify-email        # Верификация email
POST   /api/v1/auth/email/send-verification
POST   /api/v1/auth/email/verify
POST   /api/v1/auth/password/recovery
POST   /api/v1/auth/password/reset
```

#### Users (6 endpoints)
```
GET    /api/v1/users/me                 # Мой профиль
PUT    /api/v1/users/me                 # Обновить профиль
GET    /api/v1/users/:id                # Профиль пользователя
POST   /api/v1/users/avatar             # Загрузить аватар
GET    /api/v1/users/search             # Поиск пользователей
GET    /api/v1/users/[id]/online        # Статус онлайн
PUT    /api/v1/users/[id]/block         # Блокировка
```

#### Chats (12 endpoints)
```
GET    /api/v1/chats                    # Список чатов
POST   /api/v1/chats                    # Создать чат
GET    /api/v1/chats/:id                # Детали чата
PUT    /api/v1/chats/:id                # Обновить чат
DELETE /api/v1/chats/:id                # Удалить/выйти
GET    /api/v1/chats/:id/messages       # История сообщений
POST   /api/v1/chats/:id/messages       # Отправить сообщение
POST   /api/v1/chats/:id/typing         # Индикатор набора
POST   /api/v1/chats/group/create       # Создать группу
POST   /api/v1/chats/group/members      # Управление участниками
PUT    /api/v1/chats/group/role         # Изменить роль
GET    /api/v1/chats/search             # Поиск чатов
POST   /api/v1/chats/:id/favorite       # В избранное
POST   /api/v1/chats/:id/pin            # Закрепить
POST   /api/v1/chats/:id/clear          # Очистить чат
```

#### Messages (6 endpoints)
```
PUT    /api/v1/messages/:id             # Редактировать
DELETE /api/v1/messages/:id             # Удалить
POST   /api/v1/messages/:id/reactions   # Добавить реакцию
PUT    /api/v1/messages/:id/reactions   # Удалить реакцию
PUT    /api/v1/messages/:id/read        # Отметить прочитанное
POST   /api/v1/messages/:id/forward     # Переслать
GET    /api/v1/messages/search          # Поиск сообщений
GET    /api/v1/messages/link-preview    # Link preview
GET    /api/v1/messages/typing          # Состояние набора
```

#### Attachments (4 endpoints)
```
POST   /api/v1/attachments/upload       # Загрузить файл
GET    /api/v1/attachments/:id          # Получить файл
DELETE /api/v1/attachments/:id          # Удалить
GET    /api/v1/attachments/preview/:id  # Превью
```

#### Yandex Disk (6 endpoints)
```
POST   /api/v1/disk/link                # Ссылка на авторизацию
GET    /api/v1/disk/callback            # Callback от Yandex
GET    /api/v1/disk/files               # Список файлов
POST   /api/v1/disk/upload              # Загрузка файла
GET    /api/v1/disk/files/:id           # Информация о файле
DELETE /api/v1/disk/files/:id           # Удаление файла
```

#### Notifications (7 endpoints)
```
POST   /api/v1/notifications/subscribe  # Подписка push
POST   /api/v1/notifications/send       # Отправить
GET    /api/v1/notifications            # Список
PUT    /api/v1/notifications/:id/read   # Прочитать
PUT    /api/v1/notifications/read-all   # Все прочитаны
POST   /api/v1/notifications/register-token  # Push токен
POST   /api/v1/notifications/vapid-key  # VAPID ключ
```

#### Invitations (6 endpoints)
```
GET    /api/v1/invitations              # Мои приглашения
POST   /api/v1/invitations              # Создать
DELETE /api/v1/invitations/:id          # Удалить
PUT    /api/v1/invitations/:id/revoke   # Отозвать
GET    /api/v1/invite/:code             # Информация
POST   /api/v1/invite/:code/accept      # Принять
```

#### SMS (3 endpoints)
```
POST   /api/v1/sms/send                 # Отправить SMS
POST   /api/v1/sms/verify               # Подтвердить код
POST   /api/v1/sms/resend               # Повторная отправка
```

#### Admin (12 endpoints)
```
GET    /api/v1/admin/stats              # Статистика
GET    /api/v1/admin/users              # Все пользователи
PUT    /api/v1/admin/users/:id          # Забанить
GET    /api/v1/admin/chats              # Все чаты
GET    /api/v1/admin/messages           # Мониторинг
GET    /api/v1/admin/logs               # Логи
GET    /api/v1/admin/bans               # Бан-лист
POST   /api/v1/admin/bans               # Забанить
GET    /api/v1/admin/backup             # Бэкап
POST   /api/v1/admin/backup/restore     # Восстановить
POST   /api/v1/admin/config             # Настройки
GET    /api/v1/admin/settings           # Текущие настройки
```

#### Themes (6 endpoints)
```
GET    /api/v1/themes                   # Список тем
GET    /api/v1/themes/:id               # Детали
POST   /api/v1/themes                   # Создать (admin)
PUT    /api/v1/themes/:id               # Обновить
DELETE /api/v1/themes/:id               # Удалить
GET    /api/v1/theme-subscriptions      # Мои подписки
```

#### Features (6 endpoints)
```
GET    /api/v1/features                 # Все фичи
GET    /api/v1/features/:id             # Детали
POST   /api/v1/features                 # Предложить
POST   /api/v1/features/:id/vote        # Голосовать
DELETE /api/v1/features/:id/vote        # Убрать голос (admin)
PUT    /api/v1/features/:id/status      # Изменить статус (admin)
```

#### Quizzes (3 endpoints)
```
GET    /api/v1/quizzes                  # Список квизов
POST   /api/v1/quizzes/attempt          # Начать попытку
GET    /api/v1/quizzes/:id/results      # Результаты
```

#### Pages (5 endpoints)
```
GET    /api/v1/pages                    # Все активные страницы
GET    /api/v1/pages/:slug              # Страница по slug
POST   /api/v1/pages                    # Создать (admin)
PUT    /api/v1/pages/:id                # Обновить (admin)
DELETE /api/v1/pages/:id                # Удалить (admin)
```

#### WebRTC/Calls (5 endpoints)
```
POST   /api/webrtc/signal               # WebRTC signaling
POST   /api/v1/calls                    # Создать звонок
GET    /api/v1/calls/:id                # Детали звонка
GET    /api/v1/calls/history            # История звонков
POST   /api/v1/calls/:id/end            # Завершить звонок
GET    /api/v1/calls/:id/recording      # Запись звонка
```

#### Sync (1 endpoint)
```
POST   /api/v1/sync/keys                # Синхронизация E2E ключей
```

#### Versions (1 endpoint)
```
GET    /api/v1/versions                 # История версий
POST   /api/v1/versions                 # Добавить версию (admin)
```

#### Installer (3 endpoints)
```
POST   /api/v1/installer/config         # Конфигурация
POST   /api/v1/installer/clear          # Очистка
POST   /api/v1/installer/test-accounts  # Тестовые аккаунты
```

#### Health (1 endpoint)
```
GET    /health                          # Health check
```

### 5.2 Messenger API Routes (Proxy)

**Auth:**
```
POST   /api/auth/login                  # Прокси к /api/v1/auth/login
POST   /api/auth/register               # Прокси к /api/v1/auth/register
POST   /api/auth/yandex/callback        # Yandex OAuth callback
POST   /api/auth/password/recovery      # Прокси к /api/v1/auth/forgot-password
POST   /api/auth/password/reset         # Прокси к /api/v1/auth/reset-password
POST   /api/auth/profile                # Обновить профиль
```

**Profile:**
```
POST   /api/profile/avatar              # Загрузить аватар
DELETE /api/profile/avatar              # Удалить аватар
POST   /api/profile/password            # Сменить пароль
DELETE /api/users/me                    # Удалить аккаунт
GET    /api/users/[id]                  # Профиль пользователя
PUT    /api/users/[id]                  # Обновить профиль
POST   /api/users/[id]/online           # Статус онлайн
POST   /api/users/[id]/block            # Блокировка
DELETE /api/users/[id]/block            # Разблокировка
```

**Chats:**
```
POST   /api/chats/[id]/pin              # Закрепить/открепить
POST   /api/chats/[id]/favorite         # В избранное
POST   /api/chats/[id]/clear            # Очистить чат
```

**Messages:**
```
POST   /api/messages/typing             # Индикатор набора
GET    /api/messages/typing             # Состояние набора
POST   /api/messages/link-preview       # Link preview
```

**Attachments:**
```
POST   /api/attachments/preview         # Предпросмотр вложений
```

**Admin:**
```
GET    /api/admin/stats                 # Статистика
GET    /api/admin/users                 # Пользователи
POST   /api/admin/users                 # Бан/разбан
GET    /api/admin/chats                 # Чаты
DELETE /api/admin/chats                 # Удалить чат
GET    /api/admin/messages              # Сообщения
DELETE /api/admin/messages              # Удалить сообщение
GET    /api/admin/bans                  # Бан-лист
POST   /api/admin/bans                  # Создать бан
DELETE /api/admin/bans                  # Удалить бан
GET    /api/admin/settings              # Настройки
POST   /api/admin/settings              # Обновить настройки
GET    /api/admin/backup                # Бэкап
DELETE /api/admin/backup                # Удалить бэкап
```

**Yandex Disk:**
```
GET    /api/disk/callback               # Yandex Disk OAuth callback
```

**Notifications:**
```
POST   /api/notifications/vapid-key     # VAPID публичный ключ
```

**Sync:**
```
POST   /api/sync/keys                   # Синхронизация ключей
GET    /api/sync/keys                   # Получить ключи
DELETE /api/sync/keys                   # Удалить ключи
```

**WebRTC:**
```
POST   /api/webrtc/signal               # WebRTC signaling
GET    /api/webrtc/signal               # Получить сигналы
DELETE /api/webrtc/signal               # Очистить сигналы
```

**Versions:**
```
GET    /api/versions                    # История версий
POST   /api/versions                    # Добавить версию
```

**Health:**
```
GET    /api/health                      # Health check
```

**CSRF:**
```
GET    /api/csrf-token                  # CSRF токен
```

**Balance:**
```
GET    /api/balance                     # Баланс пользователя
POST   /api/balance/recharge            # Пополнить баланс
```

**Reports:**
```
GET    /api/reports                     # Отчёты
```

**User ID:**
```
GET    /api/user-id                     # Получить user ID
POST   /api/user-id/change              # Сменить user ID
```

---

## 6. ВСЕ ЭКРАНЫ И СТРАНИЦЫ

### 6.1 Auth Pages

| Страница | Path | Компонент |
|----------|------|-----------|
| Login | `/login` | `components/pages/AuthPage.tsx` |
| Register | `/register` | `components/pages/AuthPage.tsx` |
| Forgot Password | `/forgot-password` | `components/pages/AuthPage.tsx` |
| Email Verification | `/email-verification` | `components/pages/AuthPage.tsx` |
| Change Password | `/change-password` | `components/pages/AuthPage.tsx` |
| Delete Account | `/delete-account` | `components/pages/DeleteAccountModal.tsx` |
| 2FA Verify | `/2fa-verify` | `components/TwoFASetup.tsx` |
| Password Reset | `/password-reset` | `components/pages/AuthPage.tsx` |
| Verify Code | `/verify-code` | `components/VerificationModal.tsx` |

### 6.2 Chat Pages

| Страница | Path | Компонент |
|----------|------|-----------|
| Chats List | `/chats` | `components/pages/ChatsPage.tsx` |
| Chat Detail | `/chats/[id]` | `components/pages/ChatPage.tsx` |
| History | `/history` | `components/pages/HistoryPage.tsx` |

### 6.3 Profile & Settings

| Страница | Path | Компонент |
|----------|------|-----------|
| Profile | `/profile` | `components/pages/ProfilePage.tsx` |
| Settings | `/settings` | `components/settings/` |
| Sessions | `/sessions` | `components/SessionsPage.tsx` |

### 6.4 Invitations

| Страница | Path | Компонент |
|----------|------|-----------|
| My Invitations | `/invitations` | `components/pages/InvitationsPage.tsx` |
| Accept Invite | `/invite/[code]` | `app/invite/[code]/page.tsx` |

### 6.5 Features & Support

| Страница | Path | Компонент |
|----------|------|-----------|
| Features | `/features` | `app/features/page.tsx` |
| Support | `/support` | `app/support/page.tsx` |
| Downloads | `/downloads` | `app/downloads/page.tsx` |

### 6.6 Legal & Info

| Страница | Path | Компонент |
|----------|------|-----------|
| About Balloo | `/about-balloo` | `app/about-balloo/page.tsx` |
| About Company | `/about-company` | `app/about-company/page.tsx` |
| Privacy | `/privacy` | `app/privacy/page.tsx` |
| Terms | `/terms` | `app/terms/page.tsx` |

### 6.7 Admin & Installer

| Страница | Path | Компонент |
|----------|------|-----------|
| Admin Dashboard | `/admin` | `components/admin/` |
| Installer Config | `/installer/config` | `app/installer/config/route.ts` |
| Installer Clear | `/installer/clear` | `app/installer/clear/route.ts` |
| Installer Test Accounts | `/installer/test-accounts` | `app/installer/test-accounts/route.ts` |

### 6.8 Theme & Statuses

| Страница | Path | Компонент |
|----------|------|-----------|
| Theme Subscription | `/theme-subscription` | `app/theme-subscription/page.tsx` |
| Statuses | `/statuses` | `components/StatusUploader.tsx` |

### 6.9 System Pages

| Страница | Path | Компонент |
|----------|------|-----------|
| Health | `/health` | `app/health/route.ts` |
| Error | `/error` | `app/error.tsx` |
| Forbidden | `/forbidden` | `app/forbidden.tsx` |
| Maintenance | `/maintenance` | `app/maintenance.tsx` |
| 404 | `/nonexistent` | `app/not-found.tsx` |

---

## 7. ВСЕ UI КОМПОНЕНТЫ

### 7.1 Auth Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| LoginForm | `components/auth/LoginForm.tsx` | Форма входа |
| RegisterForm | `components/auth/RegisterForm.tsx` | Форма регистрации |
| TwoFAModal | `components/auth/TwoFAModal.tsx` | 2FA verification |
| YandexLogin | `components/auth/YandexLogin.tsx` | Яндекс OAuth |
| VerificationModal | `components/VerificationModal.tsx` | Код верификации |
| ChangePasswordModal | `components/ChangePasswordModal.tsx` | Смена пароля |
| DeleteAccountModal | `components/DeleteAccountModal.tsx` | Удаление аккаунта |

### 7.2 Chat Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| ChatList | `components/ChatList.tsx` | Список чатов |
| ChatPage | `components/pages/ChatPage.tsx` | Окно чата |
| MessageThread | `components/MessageThread.tsx` | Нитка сообщений |
| CreateGroupModal | `components/CreateGroupModal.tsx` | Создание группы |
| GroupMembersManager | `components/GroupMembersManager.tsx` | Управление участниками |
| StatusUploader | `components/StatusUploader.tsx` | Загрузка статусов |
| StatusViewer | `components/StatusViewer.tsx` | Просмотр статусов |

### 7.3 Media Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| AttachmentViewer | `components/AttachmentViewer.tsx` | Просмотр вложений |
| FileUpload | `components/FileUpload.tsx` | Загрузка файлов |
| AudioPlayer | `components/AudioPlayer.tsx` | Аудио плеер |
| CallInterface | `components/CallInterface.tsx` | Интерфейс звонка |
| PollAttachment | `components/PollAttachment.tsx` | Опросы |
| QuizAttachment | `components/QuizAttachment.tsx` | Квизы |
| SurveyAttachment | `components/SurveyAttachment.tsx` | Анкеты |

### 7.4 Layout Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| Header | `components/Header.tsx` | Верхняя панель |
| Footer | `components/Footer.tsx` | Нижняя панель |
| ThemeSelector | `components/ThemeSelector.tsx` | Селектор тем |
| ThemeCard | `components/ThemeCard.tsx` | Карточка темы |
| ThemeSubscriptionDialog | `components/ThemeSubscriptionDialog.tsx` | Подписка на темы |
| AccountSwitcher | `components/AccountSwitcher.tsx` | Смена аккаунтов |
| PWAInstall | `components/PWAInstall.tsx` | Промпт установки PWA |
| ServiceWorkerRegistration | `components/ServiceWorkerRegistration.tsx` | Регистрация SW |

### 7.5 Notification Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| NotificationManager | `components/NotificationManager.tsx` | Менеджер уведомлений |

### 7.6 Admin Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| VersionsAdmin | `components/admin/VersionsAdmin.tsx` | Управление версиями |

### 7.7 Invite Components

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| InviteManager | `components/InviteManager.tsx` | Управление приглашениями |

### 7.8 Core UI (packages/core-ui)

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| Button | `core-ui/src/components/Button.tsx` | Кнопка |
| Modal | `core-ui/src/components/Modal.tsx` | Модальное окно |
| Alert | `core-ui/src/components/Alert.tsx` | Уведомление |
| Card | `core-ui/src/components/Card.tsx` | Карточка |
| Input | `core-ui/src/components/Input.tsx` | Поле ввода |
| StatusBadge | `core-ui/src/components/StatusBadge.tsx` | Статус |
| AuthForms | `core-ui/src/components/AuthForms.tsx` | Формы auth |
| FileUploader | `core-ui/src/components/FileUploader.tsx` | Загрузка файлов |
| LogViewer | `core-ui/src/components/LogViewer.tsx` | Просмотр логов |
| MessageThread | `core-ui/src/components/MessageThread.tsx` | Нитка сообщений |
| NodeStatusBlock | `core-ui/src/components/NodeStatusBlock.tsx` | Статус узла |
| NodeSwitcher | `core-ui/src/components/NodeSwitcher.tsx` | Переключатель узлов |
| RealTimeStats | `core-ui/src/components/RealTimeStats.tsx` | Реал-тайм статистика |
| SMSStatusWidget | `core-ui/src/components/SMSStatusWidget.tsx` | SMS виджет |
| StatsDashboard | `core-ui/src/components/StatsDashboard.tsx` | Дашборд статистики |
| VideoPlayer | `core-ui/src/components/VideoPlayer.tsx` | Видеоплеер |
| VoiceRecorder | `core-ui/src/components/VoiceRecorder.tsx` | Запись голоса |

---

## 8. БАЗА ДАННЫХ И СХЕМЫ

### 8.1 Таблицы PostgreSQL

**users** — Пользователи
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  display_name VARCHAR(100),
  full_name VARCHAR(200),
  avatar TEXT,
  yandex_id VARCHAR(255),
  yandex_token TEXT,
  status VARCHAR(20) DEFAULT 'active',
  admin_roles JSONB DEFAULT '[]',
  blocked_users JSONB DEFAULT '[]',
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**chats** — Чаты
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) DEFAULT 'private',
  name TEXT,
  avatar TEXT,
  description TEXT,
  participants JSONB,
  members JSONB,
  admin_ids JSONB DEFAULT '[]',
  created_by UUID REFERENCES users(id),
  last_message JSONB,
  unread_count JSONB DEFAULT '{}',
  is_favorite JSONB DEFAULT '{}',
  pinned JSONB DEFAULT '{}',
  muted JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**messages** — Сообщения
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id),
  sender_id UUID REFERENCES users(id),
  type VARCHAR(20) DEFAULT 'text',
  content TEXT,
  encrypted_info JSONB,
  attachment_id UUID,
  reply_to_id UUID REFERENCES messages(id),
  forward_from_id UUID REFERENCES messages(id),
  reactions JSONB DEFAULT '{}',
  read_by JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'sent',
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**attachments** — Вложения
```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id),
  file_name TEXT,
  mime_type VARCHAR(50),
  file_size INTEGER,
  yandex_disk_path TEXT,
  public_url TEXT,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**sessions** — Сессии
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  device_info TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

**notifications** — Уведомления
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  message TEXT,
  type VARCHAR(20),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**auth_codes** — Коды авторизации
```sql
CREATE TABLE auth_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  code VARCHAR(6),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**2fa_methods** — Методы 2FA
```sql
CREATE TABLE 2fa_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(20),
  secret TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**calls** — Звонки
```sql
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  chat_id UUID REFERENCES chats(id),
  type VARCHAR(10),
  status VARCHAR(20),
  offer JSONB,
  answer JSONB,
  recording BOOLEAN DEFAULT false,
  recording_id TEXT,
  recording_path TEXT,
  recording_url TEXT,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**bans** — Бан-лист
```sql
CREATE TABLE bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  chat_id UUID REFERENCES chats(id),
  banned_by UUID REFERENCES users(id),
  reason TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**features** — Голосования за фичи
```sql
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  votes INTEGER DEFAULT 0,
  voted_by JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_by_name VARCHAR(100),
  admin_note TEXT,
  planned_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**pages** — Страницы
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sections JSONB,
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**invitations** — Приглашения
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  chat_id UUID REFERENCES chats(id),
  chat_name TEXT,
  chat_type VARCHAR(20),
  invited_by UUID REFERENCES users(id),
  invited_by_email VARCHAR(255),
  message TEXT,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**quiz_attempts** — Попытки квизов
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  quiz_id UUID,
  score INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**admin_logs** — Логи админа
```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  action TEXT,
  target TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8.2 SQLite/RxDB (Local Storage)

**Коллекции:**
- `User` — Локальный кэш пользователей
- `Chat` — Локальный кэш чатов
- `Message` — Локальный кэш сообщений
- `ChatMember` — Участники чатов
- `Ban` — Локальный бан-лист
- `Invitation` — Приглашения
- `Attachment` — Вложения
- `Contact` — Контакты
- `Notification` — Уведомления

---

## 9. WEBSOCKET REAL-TIME

### 9.1 Подключение

```typescript
const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  auth: {
    token: accessToken
  }
});
```

### 9.2 События

**Client → Server:**
```javascript
socket.emit('join_chat', chatId);
socket.emit('leave_chat', chatId);
socket.emit('message', { content, files });
socket.emit('typing', { chatId, isTyping });
socket.emit('read', { messageId });
socket.emit('call', { chatId, type });
```

**Server → Client:**
```javascript
socket.on('message', (data) => { ... });
socket.on('typing', (data) => { ... });
socket.on('chat_updated', (data) => { ... });
socket.on('user:status', (data) => { ... });
socket.on('user:online', (data) => { ... });
socket.on('user:offline', (data) => { ... });
socket.on('call', (data) => { ... });
socket.on('call:accepted', (data) => { ... });
socket.on('call:ended', (data) => { ... });
socket.on('disconnect', () => { ... });
socket.on('reconnect', () => { ... });
```

### 9.3 Комнаты

```javascript
socket.join(`conversation:${chatId}`);
socket.join(`user:${userId}`);
```

---

## 10. БЕЗОПАСНОСТЬ И АУТЕНТИФИКАЦИЯ

### 10.1 JWT Токены

```typescript
// Access Token
{
  expiresIn: '7d',
  algorithm: 'HS256',
  secret: process.env.JWT_SECRET
}

// Refresh Token
{
  expiresIn: '30d',
  algorithm: 'HS256',
  secret: process.env.JWT_SECRET,
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
}
```

### 10.2 Пароли

- **Хеширование:** bcrypt, 12 раундов
- **Минимальная длина:** 8 символов
- **Требования:** буквы + цифры

### 10.3 2FA (TOTP)

- **Библиотека:** OTPAuth
- **Типы:** TOTP (Time-based One-Time Password)
- **Провайдеры:** Google Authenticator, Authy

### 10.4 E2E Шифрование

- **Библиотека:** tweetnacl + tweetnacl-util
- **Алгоритм:** Ed25519 + NaCl secretbox
- **Ключи:** Генерируются на клиенте
- **Публичный ключ:** Отправляется на сервер
- **Приватный ключ:** Хранится локально (IndexedDB)
- **Синхронизация:** Шифрование приватного ключа публичным ключом устройства

### 10.5 Rate Limiting

```javascript
globalLimiter: { windowMs: 15 * 60 * 1000, max: 100 }
authLimiter: { windowMs: 60 * 60 * 1000, max: 20 }
smsLimiter: { windowMs: 60 * 60 * 1000, max: 10 }
uploadLimiter: { windowMs: 60 * 60 * 1000, max: 50 }
```

### 10.6 CORS

```javascript
cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})
```

### 10.7 Helmet Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Content-Security-Policy

### 10.8 Cookies Security

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 // 7 days
}
```

---

## 11. ПРАВИЛА И ОГРАНИЧЕНИЯ

### 11.1 Дизайнерские Правила

**Sharp Corners:**
- `border-radius: 0` везде (flat design)

**Темы:**
- `dark` — тёмная тема (по умолчанию)
- `light` — светлая тема
- `russia` — цвета российского флага (#0039A6, #D52B1E)

**Бренд-цвета:**
- Russia Blue: `#0039A6`
- Russia Red: `#D52B1E`
- Primary: `#4F46E5`
- Success: `#10B981`
- Danger: `#EF4444`

**Шрифты:**
- `Inter` — основной
- `system-ui` — fallback

### 11.2 Национальные Ограничения

**Российское облако:**
- Yandex Disk — основное хранилище
- Compliance с ФЗ-152 (о персональных данных)

**Языки:**
- 11 языков поддерживается
- Приоритет: ru, en, tt, ba, sah, udm, ce, cv, os, hi, zh

**Платежи:**
- СБП (Система Быстрых Платежей)
- QR-код для оплаты

### 11.3 Ограничения Файлов

| Тип | Макс. размер | Типы |
|-----|-------------|------|
| Аватар | 5 MB | image/jpeg, png, gif, webp |
| Вложения | 10 MB | image/*, video/*, application/pdf |
| Yandex Disk | 50 MB | все типы |

### 11.4 Ограничения Чатов

| Параметр | Значение |
|----------|---------|
| Макс. участников в группе | 1000 |
| Макс. закреплённых чатов | 15 |
| Макс. избранных чатов | 50 |
| История сообщений | 365 дней (configurable) |

### 11.5 Ограничения Сообщений

| Параметр | Значение |
|----------|---------|
| Макс. длина текста | 4096 символов |
| Макс. реакций на сообщение | не ограничено |
| Доступные эмодзи | 16 стандартных |
| Редактирование | в течение 24 часов |

### 11.6 Ограничения Пользователей

| Параметр | Значение |
|----------|---------|
| Мин. длина пароля | 8 символов |
| Макс. сессий | 5 |
| Верификация email | опционально |
| Блокировка | временная/постоянная |

### 11.7 Admin Ограничения

| Роль | Права |
|------|-------|
| superadmin | Полный доступ |
| admin | Управление пользователями, чатами |
| moderator | Просмотр сообщений |

---

## 12. ИНТЕГРАЦИИ

### 12.1 Yandex OAuth

```javascript
// Flow
1. Redirect to: https://oauth.yandex.ru/authorize?client_id=...&redirect_uri=...&response_type=code
2. Exchange code for token: POST https://oauth.yandex.ru/token
3. Get user info: GET https://login.yandex.ru/info
4. Send to backend: POST /api/v1/auth/yandex
```

**Endpoints:**
- `messenger/src/app/api/auth/yandex/callback/route.ts`
- `api/src/controllers/yandex-auth.controller.js`

### 12.2 Yandex Disk

```javascript
// Flow
1. Redirect to: https://oauth.yandex.ru/authorize (disk scope)
2. Exchange code for token: POST https://oauth.yandex.ru/token
3. Store token in user.yandex_token
4. Use for file upload/download
```

**Endpoints:**
- `messenger/src/app/api/disk/callback/route.ts`
- `api/src/controllers/yandex-disk.controller.js`
- `api/src/services/yandex-disk.service.js`

**Функции:**
- Upload file
- Download file
- Get file info
- Delete file
- Get public URL
- Quota check

### 12.3 Email (SMTP)

```javascript
// Configuration
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_USER=<email>
EMAIL_PASSWORD=<password>
```

**Используется для:**
- Верификация email
- Восстановление пароля
- Уведомления

### 12.4 SMS (Max Server)

```javascript
// Configuration
MAX_SERVER_URL=http://max-server:8080
MAX_SERVER_API_KEY=<key>
```

**Endpoints:**
- `POST /api/v1/sms/send`
- `POST /api/v1/sms/verify`
- `POST /api/v1/sms/resend`

### 12.5 Web Push

```javascript
// VAPID Keys
const vapidKeys = getVapidKeys(); // jose.generateVAPIDKeys()

// Subscribe
const subscription = await navigator.serviceWorker.ready
  .then(sw => sw.pushManager.subscribe({ ... }));

// Send
webpush.sendNotification(subscription, payload);
```

### 12.6 WebRTC

```javascript
// Signaling
POST /api/webrtc/signal  { type: 'offer', from, to, chatId, data }
GET  /api/webrtc/signal  { userId, chatId }

// Events
call, call:accepted, call:ended
```

### 12.7 PgBouncer

```yaml
# Connection Pooling
host: pgbouncer
port: 6432
pool_size: 20
idle_timeout: 30000
connection_timeout: 5000
```

---

## 13. FUTURE PAGES (PLACEHOLDER)

### 13.1 Неактивные Страницы (Для Будущего)

| Страница | Path | Статус | Описание |
|----------|------|--------|----------|
| Balance | `/balance` | 🟡 Placeholder | Баланс пользователя, пополнение |
| Reports | `/reports` | 🟡 Placeholder | Отчёты пользователя |
| User ID | `/user-id` | 🟡 Placeholder | Управление User ID |
| Global Search | `/global-search` | 🟡 Placeholder | Глобальный поиск |
| Features API | `/features` | 🟡 Placeholder | Голосования за фичи (backend) |
| Pages API | `/pages` | 🟡 Placeholder | Страницы (About, Privacy, Terms) |
| Statuses API | `/statuses` | 🟡 Placeholder | Статусы/истории |
| Contacts API | `/contacts` | 🟡 Placeholder | Контакты |
| Installer | `/installer` | 🟡 Placeholder | Инсталлятор |
| Error Page | `/error` | 🟡 Placeholder | Страница ошибок |
| Forbidden | `/forbidden` | 🟡 Placeholder | Доступ запрещён |
| Maintenance | `/maintenance` | 🟡 Placeholder | Режим обслуживания |

### 13.2 Future Features (Не Реализованы)

| Фича | Приоритет | Описание |
|------|-----------|----------|
| Threads | High | Ветвление сообщений как в Slack |
| Pinned Messages | High | Закреплённые сообщения в чате |
| AI Assistant | High | AI в чате (ответы, перевод, суммаризация) |
| Channels | Medium | Односторонние публикации как в Telegram |
| Stickers Premium | Medium | Платные стикеры и подарки |
| Calendar | Low | Встроенный календарь |
| Payments | Low | Встроенные платежи, донаты |
| Mini Games | Low | Мини-игры в чате |
| Streaming | Low | Live streaming |
| E-commerce | Low | Интеграция с маркетплейсами |
| Public API | Low | API для сторонних разработчиков |

### 13.3 AI-Suggested Features

| Фича | Описание |
|------|----------|
| Real-time Analytics | Живая аналитика с графиками |
| Semantic Search | Поиск по смыслу (vector search) |
| Content Moderation | Автомодерация контента |
| A/B Testing | Система A/B тестирования |
| Webhooks | Webhooks для интеграций |

### 13.4 AI-Suggested (Deferred)

| Фича | Описание |
|------|----------|
| Multi-tenant | Поддержка нескольких организаций |
| Plugin System | Плагины для расширения |
| AI Chatbot Builder | Конструктор чатботов для бизнеса |

---

## 14. DEPLOY AND RUN

### 14.1 requirements

- Docker & Docker Compose
- Node.js 18+
- Git
- PostgreSQL 15
- Redis 7

### 14.2 Быстрый Старт

```bash
# 1. Клонирование
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Balloo
git checkout feature/repo-audit-complete-2026-06-13

# 2. Настройка окружения
cp .env.example .env
# Отредактируйте .env

# 3. Запуск
docker-compose -f docker-compose.full.yml up -d --build

# 4. Проверка
docker-compose -f docker-compose.full.yml ps

# 5. Открыть в браузере
# Messenger: http://localhost:3000
# API: http://localhost:3001
# Admin: http://localhost:3002
```

### 14.3 .env Конфигурация

```bash
# API Gateway
NODE_ENV=production
PORT=3001
JWT_SECRET=<secret>
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://balloo:pass@pgbouncer:6432/balloo_production
REDIS_HOST=redis
REDIS_PORT=6379
DB_POOL_SIZE=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000

# Yandex OAuth
YANDEX_CLIENT_ID=<id>
YANDEX_CLIENT_SECRET=<secret>
YANDEX_DISK_CLIENT_ID=<id>
YANDEX_DISK_CLIENT_SECRET=<secret>

# Email
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_USER=<email>
EMAIL_PASSWORD=<password>

# Max Server (SMS)
MAX_SERVER_URL=http://max-server:8080
MAX_SERVER_API_KEY=<key>

# Messenger
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Admin Portal
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ADMIN_KEY=<key>
```

### 14.4 Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: balloo_production
      POSTGRES_USER: balloo
      POSTGRES_PASSWORD: pass
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  pgbouncer:
    image: edoburu/pgbouncer
    ports:
      - "6432:6432"
    depends_on:
      - postgres

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  api:
    build: ./api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_URL=postgresql://balloo:pass@pgbouncer:6432/balloo_production
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
      - pgbouncer

  messenger:
    build: ./messenger
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://api:3001/api/v1
      - NEXT_PUBLIC_WS_URL=ws://api:3001
    depends_on:
      - api

  admin-portal:
    build: ./admin-portal
    ports:
      - "3002:3002"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001/api/v1
    depends_on:
      - api

volumes:
  pg_data:
```

### 14.5 Nginx Configuration

```nginx
server {
    listen 80;
    server_name balloo.su www.balloo.su;

    location / {
        proxy_pass http://messenger:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin/ {
        proxy_pass http://admin-portal:3002;
        proxy_set_header Host $host;
    }
}
```

### 14.6 Скрипты Деплоя

```bash
# Полный деплой
./scripts/deploy.sh deploy

# Запуск сервисов
./scripts/deploy.sh start

# Остановка
./scripts/deploy.sh stop

# Перезапуск
./scripts/deploy.sh restart

# Статус
./scripts/deploy.sh status

# Логи
./scripts/deploy.sh logs

# Health checks
./scripts/deploy.sh health

# Бэкап БД
./scripts/deploy.sh backup

# Восстановление БД
./scripts/deploy.sh restore

# Очистка
./scripts/deploy.sh cleanup
```

### 14.7 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
cd e2e
npm install
npx playwright install
npm run test

# E2E с UI
npm run test:ui

# E2E debug
npm run test:debug
```

**Покрытие тестами:**
- core-ui: 81 тест, 95%
- core-yandex-disk: 25 тестов, 90%
- api: 25+ тестов, 75%
- android-service: 10+ тестов, 70%
- messenger: 5+ тестов, 50%
- E2E: 20 тестов
- **TOTAL: 170+ тестов, 80% покрытие**

---

## ПРИЛОЖЕНИЯ

### A. Полная Структура Директорий

```
Balloo/
├── api/                          # API Gateway
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # PostgreSQL + PgBouncer
│   │   │   ├── redis.js          # Redis client
│   │   │   ├── encryption.js     # Encryption utilities
│   │   │   ├── logger.js         # Winston logger
│   │   │   └── yandex.js         # Yandex config
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── audio.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── bans.controller.js
│   │   │   ├── calls.controller.js
│   │   │   ├── chats.controller.js
│   │   │   ├── contacts.controller.js
│   │   │   ├── features.controller.js
│   │   │   ├── groups.controller.js
│   │   │   ├── invitations.controller.js
│   │   │   ├── lists.controller.js
│   │   │   ├── messages.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── notifications.controller.js
│   │   │   ├── pages.controller.js
│   │   │   ├── polls.controller.js
│   │   │   ├── quizzes.controller.js
│   │   │   ├── reports.controller.js
│   │   │   ├── search.controller.js
│   │   │   ├── statuses.controller.js
│   │   │   ├── surveys.controller.js
│   │   │   ├── sync.controller.js
│   │   │   ├── theme-subscriptions.controller.js
│   │   │   ├── themes.controller.js
│   │   │   ├── users.controller.js
│   │   │   ├── webrtc.controller.js
│   │   │   ├── yandex-auth.controller.js
│   │   │   └── yandex-disk.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT authentication
│   │   │   ├── healthCheck.js    # Health check
│   │   │   ├── metrics.js        # Prometheus metrics
│   │   │   ├── rateLimit.js      # Rate limiting
│   │   │   └── validation.js     # Zod validation
│   │   ├── routes/
│   │   │   ├── index.js          # All routes
│   │   │   ├── attachments.js    # Attachments routes
│   │   │   ├── functions.routes.ts
│   │   │   ├── sms.ts            # SMS routes
│   │   │   └── themes.js         # Themes routes
│   │   ├── scripts/
│   │   │   ├── apply-migration-002.js
│   │   │   └── init-database.js
│   │   ├── services/
│   │   │   ├── 2fa-router.service.js
│   │   │   ├── call-recording.service.js
│   │   │   ├── email.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── queue.service.js
│   │   │   ├── sms-retry.service.js
│   │   │   ├── sms.service.js
│   │   │   ├── sms.service.ts
│   │   │   ├── storage.service.js
│   │   │   └── yandex-disk.service.js
│   │   ├── websocket/
│   │   │   ├── handler.js        # Event handlers
│   │   │   ├── handler.js.bak    # Backup
│   │   │   ├── handler.js.new    # New version
│   │   │   ├── index.js          # Server init
│   │   │   └── manager.js        # Room manager
│   │   └── index.ts              # Entry point
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── sms.test.ts
│   │   ├── smoke/
│   │   │   └── smoke-test.js
│   │   └── load/
│   │       └── load-test.js
│   └── scripts/
│       ├── backup-pg.sh
│       ├── backup-postgres.sh
│       ├── backup.js
│       ├── init-db.sql
│       ├── migrate-attachments.js
│       ├── migrate-themes.js
│       ├── migrate-to-pg.js
│       └── setup-postgres.sh
├── messenger/                    # Web Messenger
│   ├── src/
│   │   ├── app/
│   │   │   ├── 2fa-verify/
│   │   │   ├── about-balloo/
│   │   │   ├── about-company/
│   │   │   ├── admin/
│   │   │   ├── api/              # Next.js API Routes
│   │   │   ├── change-password/
│   │   │   ├── chats/
│   │   │   ├── delete-account/
│   │   │   ├── downloads/
│   │   │   ├── email-verification/
│   │   │   ├── error.tsx
│   │   │   ├── features/
│   │   │   ├── forbidden.tsx
│   │   │   ├── forgot-password/
│   │   │   ├── global-error.tsx
│   │   │   ├── globals.css
│   │   │   ├── health/
│   │   │   ├── history/
│   │   │   ├── installer/
│   │   │   ├── invite/
│   │   │   ├── invitations/
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── loading.tsx
│   │   │   ├── login/
│   │   │   ├── maintenance.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── page.tsx          # Home
│   │   │   ├── password-reset/
│   │   │   ├── privacy/
│   │   │   ├── profile/
│   │   │   ├── register/
│   │   │   ├── sessions/
│   │   │   ├── settings/
│   │   │   ├── statuses/
│   │   │   ├── support/
│   │   │   ├── terms/
│   │   │   ├── theme-subscription/
│   │   │   ├── uploads/
│   │   │   └── verify-code/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── attachments/
│   │   │   ├── layout/
│   │   │   ├── pages/
│   │   │   ├── ui/
│   │   │   ├── AccountSwitcher.tsx
│   │   │   ├── AttachmentViewer.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── CallInterface.tsx
│   │   │   ├── ChangePasswordModal.tsx
│   │   │   ├── ChatList.tsx
│   │   │   ├── CreateGroupModal.tsx
│   │   │   ├── DeleteAccountModal.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── GroupMembersManager.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── InviteManager.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   ├── NotificationManager.tsx
│   │   │   ├── PWAInstall.tsx
│   │   │   ├── PollAttachment.tsx
│   │   │   providers.tsx
│   │   │   ├── QuizAttachment.tsx
│   │   │   ├── ServiceWorkerRegistration.tsx
│   │   │   ├── StatusUploader.tsx
│   │   │   ├── StatusViewer.tsx
│   │   │   ├── SurveyAttachment.tsx
│   │   │   ├── ThemeCard.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   ├── ThemeSubscriptionDialog.tsx
│   │   │   ├── TwoFASetup.tsx
│   │   │   ├── VerificationModal.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── index.ts
│   │   │   ├── useAlert.tsx
│   │   │   ├── useE2EEncryption.ts
│   │   │   ├── usePushNotifications.ts
│   │   │   └── useWebSocket.ts
│   │   ├── i18n/
│   │   │   ├── index.ts
│   │   │   ├── translations.ts
│   │   │   ├── types.ts
│   │   │   └── locales/
│   │   │       ├── ba.ts
│   │   │       ├── be.ts
│   │   │       ├── ce.ts
│   │   │       ├── cv.ts
│   │   │       ├── en.ts
│   │   │       ├── hi.ts
│   │   │       ├── os.ts
│   │   │       ├── ru.ts
│   │   │       ├── sah.ts
│   │   │       ├── tt.ts
│   │   │       └── udm.ts
│   │   ├── lib/
│   │   │   ├── admin.ts
│   │   │   ├── api-error-handler.ts
│   │   │   ├── auth.ts
│   │   │   ├── avatar.js
│   │   │   ├── cache.ts
│   │   │   ├── config.ts
│   │   │   ├── crypto.ts
│   │   │   ├── database/
│   │   │   │   ├── index.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── types.ts
│   │   │   ├── database.js
│   │   │   ├── db-init.ts
│   │   │   ├── e2e/
│   │   │   │   └── index.ts
│   │   │   ├── email.js
│   │   │   ├── file-logger.ts
│   │   │   ├── image-optimizer.ts
│   │   │   ├── logger.ts
│   │   │   ├── notifications/
│   │   │   │   └── index.ts
│   │   │   ├── password.ts
│   │   │   ├── pwa.ts
│   │   │   ├── rxdb/
│   │   │   ├── screen-share/
│   │   │   │   └── index.ts
│   │   │   ├── service-worker.ts
│   │   │   ├── verification-code.js
│   │   │   ├── websocket.ts
│   │   │   └── yandex-disk.ts
│   │   ├── stores/
│   │   │   ├── accounts-store.ts
│   │   │   ├── auth-store.ts
│   │   │   ├── chat-store.ts
│   │   │   └── settings-store.ts
│   │   ├── types/
│   │   │   ├── attachments.ts
│   │   │   └── index.ts
│   │   └── stubs/
│   │       └── core-theme.ts
│   └── public/
├── admin-portal/                 # Admin Dashboard
├── packages/                     # Shared Packages
│   ├── core-brand/
│   │   ├── src/
│   │   │   ├── brand.ts
│   │   │   ├── index.ts
│   │   │   ├── Logo.tsx
│   │   │   └── types.ts
│   │   └── assets/
│   ├── core-config/
│   │   └── src/
│   │       ├── config.ts
│   │       ├── index.ts
│   │       └── types.ts
│   ├── core-docs-schema/
│   │   ├── manifest.json
│   │   └── schema.json
│   ├── core-i18n/
│   │   ├── languages.json
│   │   ├── schema.json
│   │   └── src/
│   │       └── index.ts
│   ├── core-theme/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── presets.ts
│   │   │   ├── theme-store.ts
│   │   │   └── types.ts
│   ├── core-types/
│   │   └── src/
│   │       └── index.ts
│   ├── core-ui/
│   │   └── src/
│   │       ├── components/
│   │       │   ├── Alert.tsx
│   │       │   ├── AuthForms.tsx
│   │       │   ├── Button.tsx
│   │       │   ├── Card.tsx
│   │       │   ├── FileUploader.tsx
│   │       │   ├── LogViewer.tsx
│   │       │   ├── MessageThread.tsx
│   │       │   ├── Modal.tsx
│   │       │   ├── NodeStatusBlock.tsx
│   │       │   ├── NodeSwitcher.tsx
│   │       │   ├── RealTimeStats.tsx
│   │       │   ├── SMSStatusWidget.tsx
│   │       │   ├── StatsDashboard.tsx
│   │       │   ├── VideoPlayer.tsx
│   │       │   └── VoiceRecorder.tsx
│   │       ├── design-tokens.ts
│   │       ├── index.ts
│   │       └── types.ts
│   └── core-yandex-disk/
│       └── src/
│           ├── index.ts
│           ├── YandexDiskClient.ts
│           └── __tests__/
├── docker/                       # Docker configs
├── nginx/                        # Nginx config
│   └── nginx.conf
├── scripts/                      # Deploy scripts
│   ├── deploy.sh
│   └── test.sh
├── e2e/                          # E2E tests
├── SUMMARY_DOCS/                 # Documentation
├── docs/                         # Additional docs
├── docker-compose.yml            # Main config
├── docker-compose.full.yml       # Full config (20 services)
├── .env.example                  # Env template
└── README.md
```

### B. Package Dependencies

**API Gateway:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "winston": "^3.11.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.3",
    "ioredis": "^5.3.2",
    "bull": "^4.12.0",
    "ws": "^8.14.2",
    "socket.io": "^4.7.2",
    "zod": "^3.23.8",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.16",
    "web-push": "^3.6.7",
    "axios": "^1.6.2",
    "uuid": "^9.0.1",
    "express-rate-limit": "^7.1.5",
    "rate-limit-redis": "^4.2.0"
  }
}
```

**Messenger:**
```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.16.1",
    "zod": "^3.23.8",
    "zustand": "^5.0.0",
    "lucide-react": "^0.460.0",
    "date-fns": "^4.1.0",
    "tweetnacl": "^1.0.3",
    "tweetnacl-util": "^0.15.1",
    "web-push": "^3.6.7",
    "yandex-disk": "^0.0.6"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7"
  }
}
```

---

**Конец мастер-документа.**

**Для воссоздания экосистемы:**
1. Скопируйте структуру директорий из Приложения A
2. Установите зависимости из Приложения B
3. Настройте `.env` из раздела 14.3
4. Запустите `docker-compose up -d --build`
5. Откройте `http://localhost:3000`

**🎈 Balloo — Переверни общение!**

**Последнее обновление:** 2026-06-23  
**Ответственный:** Koda AI (NLP-Core-Team)
