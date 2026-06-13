---
title: Полный Аудит Кода и Функционала
date: 2026-06-13
auditor: Koda (NLP-Core-Team)
status: ⚠️ Требует исправления
priority: КРИТИЧНО
---

# 🔍 ПОЛНЫЙ АУДИТ МОНОРЕПОЗИТОРИЯ

**Дата:** 2026-06-13  
**Аудитор:** Koda (NLP-Core-Team)  
**Статус:** ⚠️ КРИТИЧЕСКИЕ ОШИБКИ  
**Приоритет:** НЕМЕДЛЕННОЕ ИСПРАВЛЕНИЕ

---

## 🚨 КРИТИЧЕСКИЕ ОШИБКИ СБОРКИ

### 1. API Server - НЕ СОБИРАЕТСЯ ❌

**Файл:** `api/tsconfig.json`  
**Ошибки:** 5 критических

```
src/index.ts(32,8): error TS1259: Module 'express' can only be default-imported using 'esModuleInterop' flag
src/index.ts(33,8): error TS1259: Module 'cors' can only be default-imported using 'esModuleInterop' flag
src/index.ts(35,8): error TS1259: Module 'winston' can only be default-imported using 'esModuleInterop' flag
src/index.ts(36,8): error TS1192: Module 'http' has no default export.
tsconfig.json(2,14): error TS6053: File '@balloo/tsconfig/base.json' not found.
```

**Причины:**
1. Отсутствует `esModuleInterop: true` в tsconfig
2. `@balloo/tsconfig/base.json` не разрешается через pnpm
3. Неправильный импорт http модуля

**Решение:**
```json
// api/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@balloo/tsconfig/*": ["../packages/tsconfig/*"]
    }
  }
}
```

**Статус:** ❌ БЛОКИРУЕТ СБОРКУ

---

### 2. Messenger - НЕ СОБИРАЕТСЯ ❌

**Файл:** `messenger/tsconfig.json`  
**Ошибки:** 1 критическая

```
error TS6053: File '@balloo/tsconfig/next.json' not found.
```

**Причина:** 
- `@balloo/tsconfig/next.json` не разрешается через pnpm workspace
- Файл существует но не связан через package.json зависимости

**Решение:**
```json
// messenger/package.json - добавить в devDependencies
"@balloo/tsconfig": "workspace:*"

// ИЛИ заменить extends на относительный путь
"extends": "../packages/tsconfig/next.json"
```

**Статус:** ❌ БЛОКИРУЕТ СБОРКУ

---

### 3. Admin Portal - НЕ СОБИРАЕТСЯ ❌

**Файл:** `admin-portal/tsconfig.json`  
**Ошибки:** 1 критическая

```
error TS6053: File '@balloo/tsconfig/next.json' not found.
```

**Причина:** Аналогична messenger

**Решение:** Аналогично messenger

**Статус:** ❌ БЛОКИРУЕТ СБОРКУ

---

## ⚠️ ОШИБКИ КОНФИГУРАЦИИ

### 4. pnpm-workspace.yaml - Неполная конфигурация

**Проблема:**
```yaml
allowBuilds:
  '@firebase/util': set this to true or false  # ⚠️ Не настроено!
  electron: set this to true or false          # ⚠️ Не настроено!
  msgpackr-extract: set this to true or false  # ⚠️ Не настроено!
  protobufjs: set this to true or false        # ⚠️ Не настроено!
  sharp: set this to true or false             # ⚠️ Не настроено!
  unrs-resolver: set this to true or false     # ⚠️ Не настроено!
```

**Решение:**
```yaml
allowBuilds:
  '@firebase/util': true
  electron: true
  msgpackr-extract: true
  protobufjs: true
  sharp: true
  unrs-resolver: true
```

**Статус:** ⚠️ Может вызвать проблемы при сборке

---

### 5. packages/tsconfig - Отсутствует экспорт файлов

**Файл:** `packages/tsconfig/package.json`

**Проблема:**
```json
{
  "name": "@balloo/tsconfig",
  "main": "index.json"  // ⚠️ Только один файл
}
```

**Отсутствуют:**
- `next.json` для Next.js проектов
- `base.json` для Node.js проектов
- `react.json` для React проектов

**Решение:**
```json
{
  "name": "@balloo/tsconfig",
  "version": "1.0.0",
  "exports": {
    "./base.json": "./base.json",
    "./next.json": "./next.json",
    "./react.json": "./react.json",
    "./index.json": "./index.json"
  }
}
```

**Статус:** ⚠️ Требует исправления

---

## 🔧 ПРОБЛЕМЫ ЗАВИСИМОСТЕЙ

### 6. Смешанные версии React

**Проблема:**
```
messenger/package.json: "react": "^19.0.0"
admin-portal/package.json: "react": "^18.2.0"  # ⚠️ Разная версия!
SUMMARY_DOCS/package.json: "react": "^18.2.0"  # ⚠️ Разная версия!
```

**Риск:** Конфликты при сборке, разные поведения

**Решение:** Унифицировать до `^18.2.0` или `^19.0.0`

**Статус:** ⚠️ Потенциальный конфликт

---

### 7. Next.js разные версии

**Проблема:**
```
messenger: "next": "^15.1.0"      # ⚠️ Next 15
admin-portal: "next": "^14.2.35"  # ⚠️ Next 14
SUMMARY_DOCS: "next": "13.5.6"    # ⚠️ Next 13
```

**Риск:** Разное поведение, разные API

**Решение:** Унифицировать до одной мажорной версии

**Статус:** ⚠️ Потенциальный конфликт

---

## 📝 ПРОБЛЕМЫ КОДА

### 8. api/src/index.ts - Неправильные импорты

**Строки 32-36:**
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import winston from 'winston';
import http from 'http';  // ❌ Нет default export
```

**Решение:**
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import winston from 'winston';
import * as http from 'http';  // ✅ Правильно
// ИЛИ
import { createServer } from 'http';  // ✅ Именованный импорт
```

**Статус:** ❌ БЛОКИРУЕТ КОМПИЛЯЦИЮ

---

### 9. Отсутствие валидации типов

**Проблема:** В многих файлах используется `any` вместо конкретных типов

**Примеры:**
```typescript
// messenger/src/components/*.tsx
const data: any = await response.json();  // ⚠️ Любые данные

// api/src/routes/*.ts
function handler(req: any, res: any)  // ⚠️ Любые параметры
```

**Решение:** Использовать Zod схемы или TypeScript интерфейсы

**Статус:** ⚠️ Технический долг

---

### 10. Отсутствие обработки ошибок async/await

**Проблема:** Много кода без try/catch

**Пример:**
```typescript
// api/src/services/*.ts
const user = await db.getUser(id);  // ⚠️ Нет обработки ошибок
const data = await fetch(url);      // ⚠️ Нет try/catch
```

**Решение:** Обернуть в try/catch или использовать .catch()

**Статус:** ⚠️ Может вызвать падение

---

## 🎯 НЕ РЕАЛИЗОВАННЫЕ ФУНКЦИИ

### Мобильное приложение (mobile/)

**Статус:** 🟡 Частично реализовано (35%)

**Отсутствует:**
- [ ] E2E шифрование на React Native
- [ ] WebRTC звонки (аудио/видео)
- [ ] Push уведомления (настроены частично)
- [ ] Оффлайн режим с RxDB
- [ ] Биометрическая аутентификация
- [ ] Шифрование локальной БД
- [ ] Синхронизация с сервером
- [ ] Загрузка файлов на Яндекс.Диск
- [ ] Адаптивный UI для разных экранов
- [ ] Темизация (светлая/тёмная)

**Срок:** Q3 2026  
**Приоритет:** 🔴 Высокий

---

### Desktop приложение (desktop/)

**Статус:** 🟡 Частично реализовано (40%)

**Отсутствует:**
- [ ] Нативные уведомления
- [ ] Системный трей
- [ ] Автозапуск
- [ ] Глобальные горячие клавиши
- [ ] Интеграция с буфером обмена
- [ ] Drag-and-drop файлов
- [ ] Полноэкранный режим
- [ ] Multiple windows
- [ ] Native menu bar
- [ ] Автообновление

**Срок:** Q3 2026  
**Приоритет:** 🟡 Средний

---

### Android сервис (android-service/)

**Статус:** 🟠 Почти не реализовано (15%)

**Отсутствует:**
- [ ] Фоновая синхронизация
- [ ] Push уведомления
- [ ] Быстрый ответ из нотификации
- [ ] Виджет на главный экран
- [ ] Интеграция с контактами
- [ ] Экспорт/импорт данных
- [ ] Резервное копирование
- [ ] Синхронизация с облаком

**Срок:** Q4 2026  
**Приоритет:** 🟡 Средний

---

### Admin Portal

**Статус:** 🟢 Реализовано (90%)

**Отсутствует:**
- [ ] Экспорт статистики в CSV/PDF
- [ ] Массовые операции с пользователями
- [ ] Аудит действий администраторов
- [ ] Двухфакторная аутентификация для админов
- [ ] Ролевая модель (Super Admin, Moderator, Support)
- [ ] API keys управление
- [ ] Webhooks настройка
- [ ] Кастомные дашборды

**Срок:** Q2 2026  
**Приоритет:** 🟡 Средний

---

### API Server

**Статус:** 🟢 Реализовано (95%)

**Отсутствует:**
- [ ] GraphQL API (только REST)
- [ ] WebSocket репликация между серверами
- [ ] Rate limiting по IP + User ID
- [ ] Кэширование Redis для частых запросов
- [ ] API versioning (только v1)
- [ ] OpenAPI/Swagger документация
- [ ] gRPC для внутренней коммуникации
- [ ] Distributed tracing

**Срок:** Q2-Q3 2026  
**Приоритет:** 🟢 Низкий

---

### Messenger (Web)

**Статус:** 🟢 Реализовано (95%)

**Отсутствует:**
- [ ] Голосовые сообщения (запись/отправка)
- [ ] Видеосообщения
- [ ] Реакции на сообщения (эмодзи)
- [ ] Цитирование сообщений
- [ ] Пересылка сообщений
- [ ] Закреплённые сообщения
- [ ] Поиск по сообщениям
- [ ] Избранные сообщения
- [ ] Архивация чатов
- [ ] Скрытие чатов
- [ ] Групповые звонки ( conferences)
- [ ] Демонстрация экрана
- [ ] Виртуальные фоны
- [ ] Запись звонков
- [ ] End-to-End для групповых чатов

**Срок:** Q2-Q3 2026  
**Приоритет:** 🟡 Средний

---

## 📊 ДЕТАЛЬНЫЙ РАЗБОР ПРОЕКТА

### Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    КЛИЕНТСКИЕ ПРИЛОЖЕНИЯ                     │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Messenger   │ Admin Portal │   Mobile     │   Desktop      │
│  Next.js 15  │  Next.js 14  │ React Native │   Electron     │
│   Порт 3000  │   Порт 3002  │   Порт 3003  │    Порт 3004   │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬────────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Gateway     │
                    │   Express.js      │
                    │    Порт 3001      │
                    └─────────┬─────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
┌──────▼──────┐      ┌───────▼───────┐     ┌───────▼───────┐
│  SQLite DB  │      │  Redis Cache  │     │ WebSocket WS  │
│ better-sql  │      │   (optional)  │     │   Порт 3001   │
└─────────────┘      └───────────────┘     └───────────────┘
```

---

### Технологический стек

#### Backend
| Компонент | Технология | Версия | Статус |
|-----------|------------|--------|--------|
| Runtime | Node.js | 20.x | ✅ |
| Framework | Express.js | 4.x | ✅ |
| Database | Better-SQLite3 | 9.x | ✅ |
| ORM | - | Native SQL | ✅ |
| WebSocket | ws | 8.x | ✅ |
| Auth | JWT | jose 5.x | ✅ |
| Encryption | crypto-js | 4.x | ✅ |
| Logging | winston | 3.x | ✅ |
| Validation | Zod | 3.x | ✅ |

#### Frontend (Messenger)
| Компонент | Технология | Версия | Статус |
|-----------|------------|--------|--------|
| Framework | Next.js | 15.1.0 | ✅ |
| Language | TypeScript | 5.7.x | ✅ |
| UI Library | React | 19.0.0 | ✅ |
| Styling | Tailwind CSS | 3.4.x | ✅ |
| State | Zustand | 5.0.0 | ✅ |
| DB Offline | RxDB | 17.1.0 | ✅ |
| Real-time | WebSocket | Native | ✅ |
| Calls | WebRTC | Native | ✅ |
| Icons | Lucide React | 0.460.x | ✅ |

#### Frontend (Admin Portal)
| Компонент | Технология | Версия | Статус |
|-----------|------------|--------|--------|
| Framework | Next.js | 14.2.35 | ✅ |
| Language | TypeScript | 5.7.x | ✅ |
| UI Library | React | 18.2.0 | ✅ |
| Styling | Tailwind CSS | 3.4.x | ✅ |
| State | Zustand | 5.0.0 | ✅ |
| Charts | Recharts | 2.x | ✅ |

#### Mobile
| Компонент | Технология | Версия | Статус |
|-----------|------------|--------|--------|
| Framework | React Native | 0.74.x | ⚠️ |
| Language | TypeScript | 5.7.x | ✅ |
| State | Redux Toolkit | 2.x | ⚠️ |
| Navigation | React Navigation | 6.x | ⚠️ |

#### Desktop
| Компонент | Технология | Версия | Статус |
|-----------|------------|--------|--------|
| Framework | Electron | 30.x | ⚠️ |
| Language | TypeScript | 5.7.x | ✅ |
| Bundler | Vite | 5.x | ✅ |

---

### Структура базы данных

#### Таблицы SQLite

**users**
```sql
- id: INTEGER PRIMARY KEY
- username: TEXT UNIQUE
- email: TEXT UNIQUE
- phone: TEXT
- password_hash: TEXT
- public_key: TEXT
- avatar_url: TEXT
- status: TEXT
- last_seen: DATETIME
- created_at: DATETIME
- updated_at: DATETIME
```

**chats**
```sql
- id: INTEGER PRIMARY KEY
- type: TEXT (private, group, channel)
- name: TEXT
- avatar_url: TEXT
- created_by: INTEGER
- created_at: DATETIME
- updated_at: DATETIME
```

**messages**
```sql
- id: INTEGER PRIMARY KEY
- chat_id: INTEGER
- sender_id: INTEGER
- content: TEXT (encrypted)
- message_type: TEXT (text, image, video, file, audio)
- media_url: TEXT
- encrypted: BOOLEAN
- signature: TEXT
- created_at: DATETIME
- read_at: DATETIME
```

**contacts**
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER
- contact_user_id: INTEGER
- status: TEXT (pending, accepted, blocked)
- created_at: DATETIME
```

**groups**
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT
- description: TEXT
- admin_id: INTEGER
- max_members: INTEGER
- created_at: DATETIME
```

**group_members**
```sql
- id: INTEGER PRIMARY KEY
- group_id: INTEGER
- user_id: INTEGER
- role: TEXT (admin, moderator, member)
- joined_at: DATETIME
```

**notifications**
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER
- type: TEXT
- title: TEXT
- body: TEXT
- data: TEXT (JSON)
- read: BOOLEAN
- created_at: DATETIME
```

---

### API Endpoints

#### Authentication (`/api/v1/auth`)
- `POST /register` - Регистрация пользователя
- `POST /login` - Вход
- `POST /logout` - Выход
- `POST /refresh` - Обновление токена
- `POST /verify-email` - Подтверждение email
- `POST /resend-verification` - Повторная отправка
- `POST /forgot-password` - Сброс пароля
- `POST /reset-password` - Установка нового пароля
- `POST /2fa/enable` - Включить 2FA
- `POST /2fa/disable` - Отключить 2FA
- `POST /2fa/verify` - Проверка 2FA кода

#### Users (`/api/v1/users`)
- `GET /me` - Текущий пользователь
- `PUT /me` - Обновление профиля
- `DELETE /me` - Удаление аккаунта
- `GET /:id` - Получить пользователя по ID
- `PUT /avatar` - Загрузка аватара
- `PUT /status` - Установка статуса

#### Chats (`/api/v1/chats`)
- `GET /` - Список чатов
- `POST /` - Создать чат
- `GET /:id` - Получить чат
- `PUT /:id` - Обновить чат
- `DELETE /:id` - Удалить чат
- `POST /:id/messages` - Отправить сообщение
- `GET /:id/messages` - История сообщений
- `DELETE /:id/messages/:messageId` - Удалить сообщение

#### Contacts (`/api/v1/contacts`)
- `GET /` - Список контактов
- `POST /` - Добавить контакт
- `DELETE /:id` - Удалить контакт
- `PUT /:id/accept` - Принять запрос
- `PUT /:id/block` - Заблокировать

#### Groups (`/api/v1/groups`)
- `GET /` - Список групп
- `POST /` - Создать группу
- `GET /:id` - Получить группу
- `PUT /:id` - Обновить группу
- `DELETE /:id` - Удалить группу
- `POST /:id/members` - Добавить участника
- `DELETE /:id/members/:userId` - Удалить участника
- `PUT /:id/members/:userId/role` - Изменить роль

#### Files (`/api/v1/files`)
- `POST /upload` - Загрузить файл
- `GET /:id` - Скачать файл
- `DELETE /:id` - Удалить файл
- `GET /:id/preview` - Предпросмотр

#### Calls (`/api/v1/calls`)
- `POST /` - Инициировать звонок
- `GET /:id` - Информация о звонке
- `POST /:id/accept` - Принять звонок
- `POST /:id/reject` - Отклонить звонок
- `POST /:id/end` - Завершить звонок

#### Admin (`/api/v1/admin`)
- `GET /users` - Все пользователи
- `GET /users/:id` - Пользователь по ID
- `PUT /users/:id` - Обновить пользователя
- `DELETE /users/:id` - Удалить пользователя
- `GET /statistics` - Статистика
- `GET /logs` - Логи системы

---

## 📋 ПЛАН ИСПРАВЛЕНИЙ

### Критично (Блокируют сборку)

| # | Задача | Файлы | Срок | Статус |
|---|--------|-------|------|--------|
| 1 | Исправить api/tsconfig.json | api/tsconfig.json | 1 час | ⏳ |
| 2 | Исправить messenger/tsconfig.json | messenger/tsconfig.json, package.json | 1 час | ⏳ |
| 3 | Исправить admin-portal/tsconfig.json | admin-portal/tsconfig.json, package.json | 1 час | ⏳ |
| 4 | Исправить импорты в api/src/index.ts | api/src/index.ts | 30 мин | ⏳ |
| 5 | Настроить pnpm allowBuilds | pnpm-workspace.yaml | 15 мин | ⏳ |

### Важно (Технический долг)

| # | Задача | Файлы | Срок | Статус |
|---|--------|-------|------|--------|
| 6 | Унифицировать версии React | Все package.json | 2 часа | ⏳ |
| 7 | Унифицировать версии Next.js | Все package.json | 2 часа | ⏳ |
| 8 | Добавить exports в packages/tsconfig | packages/tsconfig/package.json | 30 мин | ⏳ |
| 9 | Заменить any на конкретные типы | Все *.ts файлы | 8 часов | ⏳ |
| 10 | Добавить обработку ошибок | Все async функции | 8 часов | ⏳ |

### Функциональность (Не реализовано)

| # | Функция | Модуль | Срок | Приоритет |
|---|---------|--------|------|-----------|
| 11 | Голосовые сообщения | Messenger | Q2 2026 | 🟡 |
| 12 | Реакции на сообщения | Messenger | Q2 2026 | 🟡 |
| 13 | Поиск по сообщениям | Messenger | Q2 2026 | 🟡 |
| 14 | Групповые звонки | Messenger | Q3 2026 | 🔴 |
| 15 | Мобильное приложение | Mobile | Q3 2026 | 🔴 |
| 16 | Desktop приложение | Desktop | Q3 2026 | 🟡 |
| 17 | Android сервис | android-service | Q4 2026 | 🟡 |
| 18 | GraphQL API | API | Q3 2026 | 🟢 |
| 19 | OpenAPI документация | API | Q2 2026 | 🟡 |
| 20 | Ролевая модель админки | Admin Portal | Q2 2026 | 🟡 |

---

## ✅ ЧЕКЛИСТ ИСПРАВЛЕНИЙ

### Сборка
- [ ] Исправить api/tsconfig.json
- [ ] Исправить messenger/tsconfig.json
- [ ] Исправить admin-portal/tsconfig.json
- [ ] Исправить импорты в api/src/index.ts
- [ ] Настроить pnpm-workspace.yaml
- [ ] Проверить сборку api (`npm run build`)
- [ ] Проверить сборку messenger (`npm run build`)
- [ ] Проверить сборку admin-portal (`npm run build`)

### Зависимости
- [ ] Унифицировать React версии
- [ ] Унифицировать Next.js версии
- [ ] Добавить exports в packages/tsconfig
- [ ] Проверить все package.json на конфликты

### Качество кода
- [ ] Заменить `any` на конкретные типы
- [ ] Добавить try/catch во все async функции
- [ ] Добавить валидацию входных данных (Zod)
- [ ] Добавить unit тесты для критичных функций
- [ ] Настроить ESLint правила
- [ ] Настроить Prettier форматирование

### Документация
- [ ] Обновить README.md
- [ ] Добавить API документацию
- [ ] Обновить CHANGELOG.md
- [ ] Добавить migration guides

---

**Аудит проведён:** 2026-06-13  
**Аудитор:** Koda (NLP-Core-Team)  
**Статус:** ⚠️ ТРЕБУЕТ НЕМЕДЛЕННОГО ИСПРАВЛЕНИЯ  
**Критичных ошибок:** 5  
**Важных проблем:** 10  
**Не реализованных функций:** 20+

---

**🎈 Balloo - Share your moments safely!**
