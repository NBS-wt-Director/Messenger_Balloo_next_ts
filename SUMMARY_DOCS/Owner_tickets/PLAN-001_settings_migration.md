---
title: Плановая Задача: Перенос Настроек в system_settings
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: planned
priority: high
category: infrastructure
type: refactoring
---

# 📋 ПЛАНОВАЯ ЗАДАЧА: ПЕРЕНОС ВСЕХ НАСТРОЕК В system_settings

**ID:** PLAN-001  
**Дата планирования:** 2026-06-13  
**Приоритет:** 🔴 Высокий  
**Срок:** Q2 2026 (Апрель - Июнь 2026)  
**Категория:** Infrastructure  
**Тип:** Refactoring  
**Оценка:** 8 часов

---

## 🎯 Описание

Полный перенос ВСЕХ настроек проекта из .env файлов, конфигурационных модулей и хардкода в центральную таблицу `system_settings` SQLite с возможностью динамического управления через админ-панель.

---

## 📊 Текущее состояние

### Настройки разбросаны по:
1. **api/.env** - 8 настроек
2. **messenger/.env.local** - 3 настройки
3. **admin-portal/.env.local** - 3 настройки
4. **settings/config.ts** - 10+ настроек
5. **Хардкод в коде** - 5+ мест

### Проблемы:
- ❌ Нет единого места для управления настройками
- ❌ Требуется перезапуск приложения для смены настроек
- ❌ Чувствительные данные в исходном коде
- ❌ Нет аудита изменений настроек
- ❌ Сложность настройки разных окружений
- ❌ Нет разделения публичных и приватных настроек

---

## ✅ Целевое состояние

### Все настройки в БД:
- ✅ Таблица `system_settings` - единый источник истины
- ✅ API endpoints для управления настройками
- ✅ Админ-панель для редактирования
- ✅ История изменений настроек
- ✅ Разделение на категории
- ✅ Шифрование чувствительных данных
- ✅ Публичные/приватные настройки
- ✅ Динамическое обновление без перезапуска

---

## 📋 План выполнения

### Фаза 1: Подготовка БД (2 часа)

#### 1.1 Добавить индексы
```sql
-- migrations/003_migrate_env_to_settings.sql

CREATE INDEX IF NOT EXISTS idx_settings_key ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_public ON system_settings(is_public);
CREATE INDEX IF NOT EXISTS idx_settings_encrypted ON system_settings(is_encrypted);
```

#### 1.2 Перенести все настройки из .env
```sql
-- API Server настройки
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, category, is_encrypted, is_public, description) VALUES
('api.database_url', 'sqlite:./data/baloohub.db', 'string', 'api', 1, 0, 'Путь к файлу базы данных'),
('api.jwt_secret', 'your-secret-key-change-this-in-production', 'encrypted', 'security', 1, 0, 'Секрет для JWT токенов'),
('api.jwt_expires_in', '7d', 'string', 'security', 0, 0, 'Срок действия JWT токена'),
('api.refresh_token_secret', 'your-refresh-secret', 'encrypted', 'security', 1, 0, 'Секрет для refresh токенов'),
('api.refresh_token_expires_in', '30d', 'string', 'security', 0, 0, 'Срок действия refresh токена'),
('api.yandex_disk_token', 'your-yandex-token', 'encrypted', 'integrations', 1, 0, 'OAuth токен Yandex Disk'),
('api.node_env', 'development', 'string', 'api', 0, 0, 'Окружение приложения'),
('api.port', '3001', 'number', 'api', 0, 0, 'Порт API сервера'),
('api.cors_origins', '["http://localhost:3000","http://localhost:3002"]', 'json', 'security', 0, 0, 'Разрешённые origin для CORS'),
('security.rate_limit_requests', '100', 'number', 'security', 0, 0, 'Максимум запросов в окне'),
('security.rate_limit_window', '900', 'number', 'security', 0, 0, 'Окно rate limiting в секундах (15 мин)'),
('security.session_timeout', '604800', 'number', 'security', 0, 0, 'Таймаут сессии в секундах (7 дней)'),
('security.password_min_length', '8', 'number', 'security', 0, 0, 'Минимальная длина пароля'),
('security.password_require_digits', 'true', 'boolean', 'security', 0, 0, 'Требуется ли цифра в пароле'),
('security.password_require_letters', 'true', 'boolean', 'security', 0, 0, 'Требуется ли буква в пароле'),

-- Messenger настройки
('messenger.api_url', 'http://localhost:3001/api/v1', 'string', 'messenger', 0, 1, 'URL API для мессенджера'),
('messenger.ws_url', 'ws://localhost:3001/ws', 'string', 'messenger', 0, 1, 'URL WebSocket для мессенджера'),
('messenger.yandex_client_id', 'your-yandex-client-id', 'string', 'integrations', 0, 1, 'Client ID для Yandex Disk'),
('messenger.max_file_size', '52428800', 'number', 'features', 0, 0, 'Максимальный размер файла (50MB)'),
('messenger.enable_voice_messages', 'false', 'boolean', 'features', 0, 1, 'Включить голосовые сообщения'),
('messenger.enable_video_messages', 'false', 'boolean', 'features', 0, 1, 'Включить видеосообщения'),
('messenger.default_theme', 'system', 'string', 'ui', 0, 1, 'Тема по умолчанию'),
('messenger.default_language', 'ru', 'string', 'i18n', 0, 1, 'Язык по умолчанию'),
('messenger.enable_beta_features', 'false', 'boolean', 'features', 0, 1, 'Включить бета-функции'),

-- Admin Portal настройки
('admin.api_url', 'http://localhost:3001/api/v1', 'string', 'admin', 0, 1, 'URL API для админки'),
('admin.email', 'admin@balloo.local', 'string', 'admin', 0, 0, 'Email администратора'),
('admin.password', 'Admin123!', 'encrypted', 'admin', 1, 0, 'Пароль администратора'),
('admin.require_2fa', 'false', 'boolean', 'security', 0, 0, 'Требуется ли 2FA для админов'),
('admin.session_timeout', '3600', 'number', 'security', 0, 0, 'Таймаут сессии администратора (1 час)'),
('admin.audit_log_enabled', 'true', 'boolean', 'security', 0, 0, 'Включить аудит действий администраторов'),

-- Notifications настройки
('notifications.email_enabled', 'true', 'boolean', 'notifications', 0, 0, 'Включить email уведомления'),
('notifications.email_smtp_host', 'smtp.example.com', 'string', 'notifications', 0, 0, 'SMTP сервер'),
('notifications.email_smtp_port', '587', 'number', 'notifications', 0, 0, 'SMTP порт'),
('notifications.email_smtp_user', 'smtp-user', 'string', 'notifications', 1, 0, 'SMTP пользователь'),
('notifications.email_smtp_password', 'smtp-password', 'encrypted', 'notifications', 1, 0, 'SMTP пароль'),
('notifications.push_vapid_public_key', 'your-vapid-public-key', 'string', 'notifications', 0, 1, 'VAPID публичный ключ'),
('notifications.push_vapid_private_key', 'your-vapid-private-key', 'encrypted', 'notifications', 1, 0, 'VAPID приватный ключ'),
('notifications.push_enabled', 'true', 'boolean', 'notifications', 0, 0, 'Включить push уведомления'),

-- Features настройки
('features.group_calls_enabled', 'false', 'boolean', 'features', 0, 1, 'Включить групповые звонки'),
('features.screen_sharing_enabled', 'false', 'boolean', 'features', 0, 1, 'Включить демонстрацию экрана'),
('features.reactions_enabled', 'false', 'boolean', 'features', 0, 1, 'Включить реакции на сообщения'),
('features.search_enabled', 'false', 'boolean', 'features', 0, 1, 'Включить поиск по сообщениям'),
('features.archive_chats_enabled', 'true', 'boolean', 'features', 0, 1, 'Включить архивацию чатов'),
('features.file_preview_enabled', 'true', 'boolean', 'features', 0, 1, 'Включить предпросмотр файлов'),

-- UI настройки
('ui.default_theme', 'system', 'string', 'ui', 0, 1, 'Тема по умолчанию'),
('ui.compact_mode', 'false', 'boolean', 'ui', 0, 1, 'Компактный режим'),
('ui.message_grouping', 'true', 'boolean', 'ui', 0, 1, 'Группировка сообщений'),
('ui.show_online_status', 'true', 'boolean', 'ui', 0, 1, 'Показывать онлайн статус'),
('ui.animate_messages', 'true', 'boolean', 'ui', 0, 1, 'Анимация сообщений'),

-- i18n настройки
('i18n.default_language', 'ru', 'string', 'i18n', 0, 1, 'Язык по умолчанию'),
('i18n.auto_detect', 'true', 'boolean', 'i18n', 0, 1, 'Автоматическое определение языка'),
('i18n.available_languages', '["ru","en","es","fr","de","it","pt","zh","ja","ko","ar","hi"]', 'json', 'i18n', 0, 1, 'Доступные языки'),

-- Logging настройки
('logging.level', 'info', 'string', 'logging', 0, 0, 'Уровень логирования'),
('logging.format', 'json', 'string', 'logging', 0, 0, 'Формат логов (json|text)'),
('logging.file_enabled', 'true', 'boolean', 'logging', 0, 0, 'Логировать в файл'),
('logging.file_path', './logs/app.log', 'string', 'logging', 0, 0, 'Путь к файлу логов'),
('logging.max_file_size', '10485760', 'number', 'logging', 0, 0, 'Макс. размер файла логов (10MB)'),
('logging.max_files', '5', 'number', 'logging', 0, 0, 'Макс. количество файлов логов');

-- Admin пароль (отдельно, так как это главный пароль)
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, category, is_encrypted, is_public, description) VALUES
('admin.password', 'A10n13n13a_O_K', 'encrypted', 'auth', 1, 0, 'Пароль администратора для редактора функций');
```

#### 1.3 Создать представление для мониторинга
```sql
CREATE VIEW IF NOT EXISTS v_settings_summary AS
SELECT 
  category,
  COUNT(*) as total_count,
  SUM(CASE WHEN is_public = 1 THEN 1 ELSE 0 END) as public_count,
  SUM(CASE WHEN is_encrypted = 1 THEN 1 ELSE 0 END) as encrypted_count
FROM system_settings
GROUP BY category;
```

---

### Фаза 2: Создать SettingsService (2 часа)

#### 2.1 Основной сервис
```typescript
// api/src/services/settings.service.ts
import { db } from '../config/database';
import { logger } from '../config/logger';

export class SettingsService {
  private static cache: Map<string, any> = new Map();
  private static readonly CACHE_TTL = 60000; // 1 минута

  /**
   * Получить настройку по ключу
   */
  static getSetting(key: string): any {
    // Проверка кэша
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value;
    }

    const setting = db.prepare(`
      SELECT setting_value, setting_type, is_encrypted FROM system_settings 
      WHERE setting_key = ?
    `).get(key) as any;

    if (!setting) {
      logger.warn(`Setting not found: ${key}`);
      return null;
    }

    let value = this.parseSetting(setting);
    
    // Кэширование
    this.cache.set(key, { value, timestamp: Date.now() });
    
    return value;
  }

  /**
   * Получить все настройки категории
   */
  static getSettingsByCategory(category: string): Record<string, any> {
    const settings = db.prepare(`
      SELECT setting_key, setting_value, setting_type, is_encrypted FROM system_settings 
      WHERE category = ?
    `).all(category) as any[];

    return settings.reduce((acc, s) => {
      acc[s.setting_key] = this.parseSetting(s);
      return acc;
    }, {} as Record<string, any>);
  }

  /**
   * Получить все настройки
   */
  static getAllSettings(): Record<string, any> {
    const settings = db.prepare(`
      SELECT setting_key, setting_value, setting_type, is_encrypted FROM system_settings
    `).all() as any[];

    return settings.reduce((acc, s) => {
      acc[s.setting_key] = this.parseSetting(s);
      return acc;
    }, {} as Record<string, any>);
  }

  /**
   * Обновить настройку
   */
  static updateSetting(key: string, value: any, updatedBy?: string): void {
    const setting = db.prepare(`
      SELECT setting_type, is_encrypted FROM system_settings WHERE setting_key = ?
    `).get(key) as any;

    if (!setting) {
      throw new Error(`Setting not found: ${key}`);
    }

    const stringValue = setting.setting_type === 'json' 
      ? JSON.stringify(value) 
      : String(value);

    // Шифрование если нужно
    const finalValue = setting.is_encrypted ? this.encrypt(stringValue) : stringValue;

    db.prepare(`
      UPDATE system_settings 
      SET setting_value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
      WHERE setting_key = ?
    `).run(finalValue, updatedBy || 'system', key);

    // Очистка кэша
    this.cache.delete(key);
    
    logger.info(`Setting updated: ${key}`, { key, updatedBy });
  }

  /**
   * Обновить несколько настроек сразу
   */
  static bulkUpdateSettings(updates: Record<string, any>, updatedBy?: string): void {
    const updateStmt = db.prepare(`
      UPDATE system_settings 
      SET setting_value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
      WHERE setting_key = ?
    `);

    const insertStmt = db.prepare(`
      INSERT INTO system_settings (setting_key, setting_value, setting_type, category, is_encrypted, is_public)
      VALUES (?, ?, 'string', 'custom', 0, 0)
    `);

    for (const [key, value] of Object.entries(updates)) {
      const setting = db.prepare(`
        SELECT setting_type, is_encrypted FROM system_settings WHERE setting_key = ?
      `).get(key) as any;

      if (setting) {
        const stringValue = setting.setting_type === 'json' 
          ? JSON.stringify(value) 
          : String(value);
        const finalValue = setting.is_encrypted ? this.encrypt(stringValue) : stringValue;
        updateStmt.run(finalValue, updatedBy || 'system', key);
      } else {
        const stringValue = typeof value === 'object' 
          ? JSON.stringify(value) 
          : String(value);
        insertStmt.run(key, stringValue);
      }

      this.cache.delete(key);
    }

    logger.info(`Bulk settings updated: ${Object.keys(updates).join(', ')}`, { updatedBy });
  }

  /**
   * Очистить кэш
   */
  static clearCache(): void {
    this.cache.clear();
    logger.info('Settings cache cleared');
  }

  /**
   * Парсинг значения настройки
   */
  private static parseSetting(setting: any): any {
    let value = setting.setting_value;
    
    // Расшифровка если нужно
    if (setting.is_encrypted) {
      value = this.decrypt(value);
    }

    if (setting.setting_type === 'json') {
      return JSON.parse(value);
    }
    if (setting.setting_type === 'number') {
      return Number(value);
    }
    if (setting.setting_type === 'boolean') {
      return value === 'true';
    }
    
    return value;
  }

  /**
   * Шифрование
   */
  private static encrypt(value: string): string {
    // TODO: Реализовать шифрование с crypto-js
    return value;
  }

  /**
   * Расшифровка
   */
  private static decrypt(value: string): string {
    // TODO: Реализовать расшифровку с crypto-js
    return value;
  }
}
```

---

### Фаза 3: Обновить конфигурационные файлы (1 час)

#### 3.1 API Server
```typescript
// api/src/config/index.ts
import { SettingsService } from '../services/settings.service';

export const config = {
  database: {
    url: SettingsService.getSetting('api.database_url') || 'sqlite:./data/baloohub.db',
  },
  jwt: {
    secret: SettingsService.getSetting('api.jwt_secret'),
    expiresIn: SettingsService.getSetting('api.jwt_expires_in') || '7d',
  },
  refresh: {
    secret: SettingsService.getSetting('api.refresh_token_secret'),
    expiresIn: SettingsService.getSetting('api.refresh_token_expires_in') || '30d',
  },
  server: {
    port: SettingsService.getSetting('api.port') || 3001,
    env: SettingsService.getSetting('api.node_env') || 'development',
  },
  cors: {
    origins: SettingsService.getSetting('api.cors_origins') || ['http://localhost:3000'],
  },
  security: {
    rateLimit: {
      requests: SettingsService.getSetting('security.rate_limit_requests') || 100,
      window: SettingsService.getSetting('security.rate_limit_window') || 900,
    },
    sessionTimeout: SettingsService.getSetting('security.session_timeout') || 604800,
  },
  yandex: {
    diskToken: SettingsService.getSetting('api.yandex_disk_token'),
  },
};
```

#### 3.2 Messenger
```typescript
// messenger/src/config/index.ts
import { SettingsAPI } from '@/api/settings';

export const config = {
  api: {
    baseUrl: SettingsAPI.getPublicSetting('messenger.api_url') || 'http://localhost:3001/api/v1',
  },
  websocket: {
    url: SettingsAPI.getPublicSetting('messenger.ws_url') || 'ws://localhost:3001/ws',
  },
  yandex: {
    clientId: SettingsAPI.getPublicSetting('messenger.yandex_client_id'),
  },
  features: {
    maxFileSize: SettingsAPI.getPublicSetting('messenger.max_file_size') || 50 * 1024 * 1024,
    enableVoiceMessages: SettingsAPI.getPublicSetting('messenger.enable_voice_messages') || false,
    enableVideoMessages: SettingsAPI.getPublicSetting('messenger.enable_video_messages') || false,
    enableBetaFeatures: SettingsAPI.getPublicSetting('messenger.enable_beta_features') || false,
  },
  ui: {
    defaultTheme: SettingsAPI.getPublicSetting('messenger.default_theme') || 'system',
    defaultLanguage: SettingsAPI.getPublicSetting('messenger.default_language') || 'ru',
  },
};
```

---

### Фаза 4: Добавить API endpoints (1 час)

```typescript
// api/src/routes/settings.routes.ts
import { Router, Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';
import { verifyToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/v1/settings/public
 * Получить публичные настройки
 */
router.get('/public', async (_req: Request, res: Response) => {
  try {
    const allSettings = SettingsService.getAllSettings();
    const publicSettings: Record<string, any> = {};

    // Фильтрация только публичных
    const publicKeys = [
      'messenger.api_url', 'messenger.ws_url', 'messenger.yandex_client_id',
      'messenger.max_file_size', 'messenger.enable_voice_messages',
      'messenger.enable_video_messages', 'messenger.default_theme',
      'messenger.default_language', 'messenger.enable_beta_features',
      'admin.api_url', 'ui.default_theme', 'i18n.default_language',
      'features.*'
    ];

    for (const key of publicKeys) {
      if (key.includes('*')) {
        const prefix = key.replace('*', '');
        for (const [k, v] of Object.entries(allSettings)) {
          if (k.startsWith(prefix)) {
            publicSettings[k] = v;
          }
        }
      } else if (allSettings[key] !== undefined) {
        publicSettings[key] = allSettings[key];
      }
    }

    res.json({
      success: true,
      data: publicSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get settings' },
    });
  }
});

/**
 * GET /api/v1/settings
 * Получить все настройки (только staff)
 */
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { message: 'Staff access required' },
      });
    }

    const allSettings = SettingsService.getAllSettings();
    
    res.json({
      success: true,
      data: allSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get settings' },
    });
  }
});

/**
 * GET /api/v1/settings/:category
 * Получить настройки категории
 */
router.get('/:category', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { message: 'Staff access required' },
      });
    }

    const { category } = req.params;
    const settings = SettingsService.getSettingsByCategory(category);
    
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get settings' },
    });
  }
});

/**
 * PUT /api/v1/settings
 * Обновить настройки (только staff)
 */
router.put('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { message: 'Staff access required' },
      });
    }

    const updates = req.body;
    
    SettingsService.bulkUpdateSettings(updates, user.username);
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update settings' },
    });
  }
});

/**
 * PUT /api/v1/settings/:key
 * Обновить одну настройку (только staff)
 */
router.put('/:key', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.is_staff) {
      return res.status(403).json({
        success: false,
        error: { message: 'Staff access required' },
      });
    }

    const { key } = req.params;
    const { value } = req.body;
    
    SettingsService.updateSetting(key, value, user.username);
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update setting' },
    });
  }
});

export default router;
```

---

### Фаза 5: Создать UI в Admin Portal (2 часа)

#### 5.1 Страница настроек
```tsx
// admin-portal/src/pages/admin/settings.tsx
import { useState, useEffect } from 'react';
import { SettingsAPI } from '@/api/settings';

const categories = [
  { id: 'api', name: 'API Server' },
  { id: 'messenger', name: 'Messenger' },
  { id: 'admin', name: 'Admin Portal' },
  { id: 'security', name: 'Безопасность' },
  { id: 'features', name: 'Функции' },
  { id: 'ui', name: 'Интерфейс' },
  { id: 'i18n', name: 'Языки' },
  { id: 'notifications', name: 'Уведомления' },
  { id: 'logging', name: 'Логирование' },
  { id: 'integrations', name: 'Интеграции' },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('api');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [activeCategory]);

  const loadSettings = async () => {
    setLoading(true);
    const result = await SettingsAPI.getCategorySettings(activeCategory);
    setSettings(result.data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await SettingsAPI.updateSettings(settings);
    setSaving(false);
    alert('Настройки сохранены!');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Настройки</h2>
        <nav className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`block w-full text-left px-4 py-2 rounded ${
                activeCategory === cat.id
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">
          {categories.find((c) => c.id === activeCategory)?.name}
        </h1>

        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded shadow">
                <label className="block text-sm font-medium mb-2">
                  {key}
                </label>
                {typeof value === 'boolean' ? (
                  <select
                    value={value.toString()}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [key]: e.target.value === 'true',
                      })
                    }
                    className="border p-2 w-full"
                  >
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [key]: Number(e.target.value),
                      })
                    }
                    className="border p-2 w-full"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [key]: e.target.value,
                      })
                    }
                    className="border p-2 w-full"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Фаза 6: Тестирование (1 час)

#### 6.1 Unit тесты
```typescript
// api/tests/services/settings.service.test.ts
import { SettingsService } from '../../src/services/settings.service';
import { db } from '../../src/config/database';

describe('SettingsService', () => {
  beforeAll(() => {
    // Setup test data
    db.prepare(`
      INSERT OR REPLACE INTO system_settings 
      (setting_key, setting_value, setting_type, category, is_encrypted, is_public)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('test.key', 'test_value', 'string', 'test', 0, 1);
  });

  afterAll(() => {
    // Cleanup
    db.prepare("DELETE FROM system_settings WHERE setting_key = 'test.key'").run();
  });

  describe('getSetting', () => {
    it('should return setting value', () => {
      const value = SettingsService.getSetting('test.key');
      expect(value).toBe('test_value');
    });

    it('should return null for non-existent setting', () => {
      const value = SettingsService.getSetting('non.existent');
      expect(value).toBeNull();
    });
  });

  describe('updateSetting', () => {
    it('should update setting value', () => {
      SettingsService.updateSetting('test.key', 'new_value');
      const value = SettingsService.getSetting('test.key');
      expect(value).toBe('new_value');
    });
  });

  describe('getSettingsByCategory', () => {
    it('should return all settings in category', () => {
      const settings = SettingsService.getSettingsByCategory('test');
      expect(settings).toHaveProperty('test.key');
    });
  });
});
```

---

## ✅ Критерии приемки

### Функциональные:
- [ ] Все настройки из .env перенесены в system_settings
- [ ] SettingsService работает корректно
- [ ] Кэширование настроек работает
- [ ] Шифрование чувствительных данных работает
- [ ] API endpoints работают
- [ ] Админ-панель для настроек работает
- [ ] Динамическое обновление без перезапуска
- [ ] История изменений записывается

### Нефункциональные:
- [ ] Все тесты проходят
- [ ] Производительность не ухудшилась
- [ ] Документация обновлена
- [ ] Нет breaking changes

---

## 📝 Примечания

### Зависимости:
- Требуется миграция БД 003_migrate_env_to_settings.sql
- Требуется обновление всех конфигурационных файлов
- Требуется обновление документации

### Риски:
- Потеря настроек при миграции (решение: бэкап БД перед миграцией)
- Несоответствие типов (решение: тщательное тестирование)
- Проблемы с кэшированием (решение: механизм инвалидации)

### Откат:
- Сохранить старый .env файл
- Откатить миграцию БД
- Вернуть конфигурационные файлы

---

**Создано:** 2026-06-13  
**Автор:** Koda (NLP-Core-Team)  
**Статус:** Планируется  
**Ожидаемое начало:** Q2 2026

---

**🎈 Balloo - Share your moments safely!**
