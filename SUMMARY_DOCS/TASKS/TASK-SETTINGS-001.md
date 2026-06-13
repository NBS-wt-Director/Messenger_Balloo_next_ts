---
title: Перенос всех настроек в центральный узел
date: 2026-06-13
priority: 🔴 КРИТИЧНО
status: В плане
quarter: Q3 2026
estimated_hours: 16
assigned_to: NLP-Core-Team
---

# 📋 ЗАДАЧА: Перенос всех настроек в центральный узел

**ID:** TASK-SETTINGS-001  
**Дата создания:** 2026-06-13  
**Приоритет:** 🔴 КРИТИЧНО  
**Статус:** В плане  
**Квартал:** Q3 2026  
**Оценка:** 16 часов

---

## 🎯 Цель

Создать единый центральный узел для хранения ВСЕХ настроек проекта с защитой паролем и централизованным управлением.

---

## 🔐 Пароль администратора

**Пароль:** `A10n13n13a_O_K`

**Хранение:**
- Таблица: `system_settings`
- Ключ: `admin.password`
- Тип: `encrypted`
- Категория: `auth`

---

## 📊 Текущее состояние

### Настройки разбросаны по:

1. **API Server** (`api/`)
   - `.env` файлы
   - `src/config/*.ts`
   - `src/middleware/*.ts`

2. **Messenger** (`messenger/`)
   - `.env.local`
   - `src/config/*.ts`
   - `src/components/Settings/*.tsx`

3. **Admin Portal** (`admin-portal/`)
   - `.env.local`
   - `src/config/*.ts`

4. **Mobile** (`mobile/`)
   - `app.json`
   - `.env`

5. **Desktop** (`desktop/`)
   - `electron.config.js`
   - `.env`

---

## 📁 Структура центрального узла

### Таблица `system_settings`

```sql
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type TEXT DEFAULT 'string',  -- string, number, boolean, json, encrypted
    description TEXT,
    category TEXT,  -- auth, ui, api, security, features
    is_public BOOLEAN DEFAULT FALSE,
    is_encrypted BOOLEAN DEFAULT FALSE,
    requires_restart BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT
);
```

---

## 📝 Категории настроек

### 1. Auth (Аутентификация)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `admin.password` | `A10n13n13a_O_K` | encrypted | ✅ | Пароль администратора |
| `auth.jwt_secret` | `...` | encrypted | ✅ | Секрет JWT токенов |
| `auth.session_timeout` | `86400` | number | ❌ | Таймаут сессии (сек) |
| `auth.refresh_token_days` | `30` | number | ❌ | Срок refresh токена |
| `auth.max_login_attempts` | `5` | number | ❌ | Макс. попыток входа |
| `auth.lockout_duration` | `900` | number | ❌ | Блокировка (сек) |
| `auth.2fa_required` | `false` | boolean | ❌ | Обязательно для всех |
| `auth.password_min_length` | `8` | number | ❌ | Мин. длина пароля |

### 2. UI (Интерфейс)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `ui.theme.default` | `"system"` | json | ❌ | Тема по умолчанию |
| `ui.theme.allow_custom` | `true` | boolean | ❌ | Разрешить кастомные |
| `ui.language.default` | `"ru"` | json | ❌ | Язык по умолчанию |
| `ui.language.available` | `["ru","en",...]` | json | ❌ | Доступные языки |
| `ui.date_format` | `"DD.MM.YYYY"` | json | ❌ | Формат даты |
| `ui.time_format` | `"HH:mm"` | json | ❌ | Формат времени |
| `ui.animations.enabled` | `true` | boolean | ❌ | Анимации |

### 3. API (Конфигурация API)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `api.version` | `"1.0.0"` | json | ❌ | Версия API |
| `api.rate_limit.requests` | `100` | number | ❌ | Запросов в минуту |
| `api.rate_limit.window` | `60` | number | ❌ | Окно (сек) |
| `api.cors_origins` | `["..."]` | json | ❌ | Разрешённые origins |
| `api.timeout` | `30000` | number | ❌ | Таймаут (мс) |
| `api.max_body_size` | `"50mb"` | json | ❌ | Макс. размер тела |

### 4. Security (Безопасность)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `security.encryption_key` | `...` | encrypted | ✅ | Ключ шифрования |
| `security.salt_rounds` | `10` | number | ❌ | Раунды bcrypt |
| `security.ssl_required` | `true` | boolean | ❌ | Требовать SSL |
| `security.hsts_enabled` | `true` | boolean | ❌ | HSTS |
| `security.csp_enabled` | `true` | boolean | ❌ | Content Security Policy |
| `security.audit_log` | `true` | boolean | ❌ | Лог аудита |

### 5. Features (Функции)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `features.show_unimplemented` | `false` | boolean | ❌ | Показывать нереализованные |
| `features.voice_messages` | `true` | boolean | ❌ | Голосовые сообщения |
| `features.video_calls` | `true` | boolean | ❌ | Видеозвонки |
| `features.group_calls` | `false` | boolean | ❌ | Групповые звонки |
| `features.file_sharing` | `true` | boolean | ❌ | Обмен файлами |
| `features.reactions` | `false` | boolean | ❌ | Реакции на сообщения |

### 6. Files (Файлы)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `files.max_size` | `50` | number | ❌ | Макс. размер (MB) |
| `files.allowed_types` | `["image/*",...]` | json | ❌ | Разрешённые типы |
| `files.storage_provider` | `"yandex_disk"` | json | ❌ | Провайдер |
| `files.compression.enabled` | `true` | boolean | ❌ | Сжатие |
| `files.compression.quality` | `80` | number | ❌ | Качество |

### 7. Notifications (Уведомления)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `notifications.push.enabled` | `true` | boolean | ❌ | Push уведомления |
| `notifications.email.enabled` | `true` | boolean | ❌ | Email уведомления |
| `notifications.sound.enabled` | `true` | boolean | ❌ | Звуки |
| `notifications.vapid_key` | `...` | encrypted | ✅ | VAPID ключ |

### 8. Database (База данных)

| Ключ | Значение | Тип | Зашифровано | Описание |
|------|----------|-----|-------------|----------|
| `database.path` | `"./data/balloo.db"` | json | ❌ | Путь к БД |
| `database.backup.enabled` | `true` | boolean | ❌ | Бэкапы |
| `database.backup.interval` | `86400` | number | ❌ | Интервал (сек) |
| `database.pool_size` | `10` | number | ❌ | Размер пула |

---

## 🔄 План миграции

### Этап 1: Подготовка (2 часа)

- [ ] Создать таблицу `system_settings` (✅ Уже создана)
- [ ] Добавить начальные настройки (✅ Частично)
- [ ] Создать API endpoints для настроек (✅ Создано)
- [ ] Создать админ-интерфейс (⏳ В работе)

### Этап 2: Перенос настроек API (4 часа)

- [ ] Перенести настройки из `.env` в БД
- [ ] Обновить `api/src/config/*.ts` для чтения из БД
- [ ] Добавить кэширование настроек
- [ ] Протестировать все endpoints

**Файлы для обновления:**
```
api/src/config/database.ts
api/src/config/logger.ts
api/src/config/yandex.ts
api/src/middleware/auth.ts
api/src/middleware/rateLimit.ts
api/src/middleware/cors.ts
```

### Этап 3: Перенос настроек Messenger (4 часа)

- [ ] Перенести настройки из `.env.local` в БД
- [ ] Обновить `messenger/src/config/*.ts`
- [ ] Обновить компоненты настроек
- [ ] Добавить синхронизацию с API

**Файлы для обновления:**
```
messenger/src/config/theme.ts
messenger/src/config/i18n.ts
messenger/src/components/Settings/*.tsx
```

### Этап 4: Перенос настроек Admin Portal (2 часа)

- [ ] Перенести настройки из `.env.local`
- [ ] Обновить конфиги
- [ ] Добавить админ-панель настроек

### Этап 5: Перенос настроек Mobile/Desktop (2 часа)

- [ ] Перенести настройки
- [ ] Добавить синхронизацию

### Этап 6: Тестирование (2 часа)

- [ ] Unit тесты
- [ ] Integration тесты
- [ ] E2E тесты

---

## 🔒 Защита паролем

### Реализация

**Файл:** `api/src/middleware/settingsAuth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import bcrypt from 'bcryptjs';

export const verifyAdminPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PASSWORD', message: 'Password required' },
      });
    }
    
    // Get stored password
    const setting = db.prepare(`
      SELECT setting_value FROM system_settings
      WHERE setting_key = 'admin.password'
    `).get() as any;
    
    if (!setting) {
      return res.status(500).json({
        success: false,
        error: { code: 'CONFIG_ERROR', message: 'Admin password not configured' },
      });
    }
    
    // Compare passwords
    const storedPassword = setting.setting_value;
    const isValid = await bcrypt.compare(password, storedPassword);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_PASSWORD', message: 'Invalid password' },
      });
    }
    
    // Add to request
    (req as any).isAdmin = true;
    next();
  } catch (error) {
    next(error);
  }
};
```

### Обновление роута

**Файл:** `api/src/routes/functions.routes.ts`

```typescript
// Добавить middleware для проверки пароля
router.post('/admin/create', 
  verifyToken, 
  verifyAdminPassword,  // ← Добавить
  async (req: Request, res: Response) => {
    // ...
  }
);
```

---

## 📊 Миграция данных

### Скрипт миграции

**Файл:** `api/src/scripts/migrate-settings.ts`

```typescript
import { db } from '../config/database';

const settingsToMigrate = [
  {
    key: 'admin.password',
    value: 'A10n13n13a_O_K',
    type: 'encrypted',
    description: 'Пароль администратора',
    category: 'auth',
  },
  {
    key: 'api.version',
    value: JSON.stringify('1.0.0'),
    type: 'json',
    description: 'Версия API',
    category: 'api',
  },
  // ... остальные настройки
];

export async function migrateSettings() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO system_settings 
    (setting_key, setting_value, setting_type, description, category, is_encrypted)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  for (const setting of settingsToMigrate) {
    insert.run(
      setting.key,
      setting.value,
      setting.type,
      setting.description,
      setting.category,
      setting.type === 'encrypted'
    );
  }
  
  console.log('Settings migrated successfully!');
}
```

---

## ✅ Чеклист выполнения

### База данных
- [x] Создать таблицу `system_settings`
- [x] Добавить индексы
- [x] Добавить начальные настройки
- [ ] Добавить триггеры для audit log

### API
- [x] Создать endpoints для настроек
- [ ] Добавить middleware проверки пароля
- [ ] Добавить кэширование
- [ ] Добавить валидацию

### Админ-интерфейс
- [ ] Создать страницу настроек
- [ ] Добавить форму редактирования
- [ ] Добавить защиту паролем
- [ ] Добавить историю изменений

### Миграция
- [ ] Перенести настройки API
- [ ] Перенести настройки Messenger
- [ ] Перенести настройки Admin Portal
- [ ] Перенести настройки Mobile/Desktop
- [ ] Обновить документацию

### Тесты
- [ ] Unit тесты для endpoints
- [ ] Integration тесты
- [ ] E2E тесты
- [ ] Тесты безопасности

---

## 📈 Метрики успеха

| Метрика | До | После | Цель |
|---------|----|----|----|
| Количество источников настроек | 10+ | 1 | 1 |
| Время на изменение настройки | 15 мин | 1 мин | < 2 мин |
| Безопасность (зашифровано) | 0% | 100% критичных | 100% |
| Централизация | 0% | 100% | 100% |

---

## 🔗 Связанные документы

- [FULL_AUDIT_2026-06-13.md](../FULL_AUDIT_2026-06-13.md)
- [FUNCTIONS_REGISTRY/INDEX.md](./FUNCTIONS_REGISTRY/INDEX.md)
- [api/src/migrations/002_create_functions_table.sql](../../api/src/migrations/002_create_functions_table.sql)

---

**Исполнитель:** NLP-Core-Team  
**Дедлайн:** Q3 2026  
**Статус:** Ожидает начала

---

**🎈 Balloo - Share your moments safely!**
