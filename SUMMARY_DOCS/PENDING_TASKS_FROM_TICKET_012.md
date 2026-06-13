---
title: Незавершённые Задачи из Тикета 012
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: pending
priority: high
related_ticket: 012
---

# 📋 НЕЗАВЕРшёННЫЕ ЗАДАЧИ ИЗ ПРЕДЫДУЩЕГО ТИКЕТА

**Дата создания:** 2026-06-13  
**Источник:** Тикет от 2026-06-12 (SUMMARY_DOCS создание)  
**Статус:** Ожидает выполнения в следующем тикете  
**Приоритет:** 🔴 Высокий

---

## 🎯 ЗАДАЧИ ДЛЯ СЛЕДУЮЩЕГО ТИКЕТА

### 1. Плановая задача: Перенос всех настроек в system_settings

**ID:** TASK-001  
**Приоритет:** 🔴 Высокий  
**Срок:** Q2 2026

#### Описание:
Перенести ВСЕ настройки из различных .env файлов и конфигураций в центральную таблицу `system_settings` SQLite.

#### Текущее состояние:
- ✅ Таблица `system_settings` создана
- ✅ Пароль администратора записан
- ⚠️ Остальные настройки разбросаны по .env файлам

#### Настройки для переноса:

**Из api/.env:**
```
DATABASE_URL=sqlite:./data/baloohub.db
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d
YANDEX_DISK_TOKEN=your-yandex-token
NODE_ENV=development
PORT=3001
```

**Из messenger/.env:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
NEXT_PUBLIC_YANDEX_CLIENT_ID=your-yandex-client-id
```

**Из admin-portal/.env:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ADMIN_EMAIL=admin@balloo.local
NEXT_PUBLIC_ADMIN_PASSWORD=Admin123!
```

**Из settings/config.ts:**
```typescript
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    timeout: 30000,
  },
  features: {
    enableBetaFeatures: false,
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  ui: {
    defaultTheme: 'system',
    defaultLanguage: 'ru',
  },
}
```

#### План переноса:

**Шаг 1: Добавить настройки в БД**
```sql
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, is_encrypted, is_public) VALUES
-- API настройки
('api.database_url', 'sqlite:./data/baloohub.db', 'string', 'api', TRUE, FALSE),
('api.jwt_secret', 'your-secret-key-change-this-in-production', 'encrypted', 'security', TRUE, FALSE),
('api.jwt_expires_in', '7d', 'string', 'security', FALSE, FALSE),
('api.refresh_token_secret', 'your-refresh-secret', 'encrypted', 'security', TRUE, FALSE),
('api.refresh_token_expires_in', '30d', 'string', 'security', FALSE, FALSE),
('api.yandex_disk_token', 'your-yandex-token', 'encrypted', 'integrations', TRUE, FALSE),
('api.node_env', 'development', 'string', 'api', FALSE, FALSE),
('api.port', '3001', 'number', 'api', FALSE, FALSE),

-- Messenger настройки
('messenger.api_url', 'http://localhost:3001/api/v1', 'string', 'messenger', FALSE, TRUE),
('messenger.ws_url', 'ws://localhost:3001/ws', 'string', 'messenger', FALSE, TRUE),
('messenger.yandex_client_id', 'your-yandex-client-id', 'string', 'integrations', FALSE, TRUE),

-- Admin Portal настройки
('admin.api_url', 'http://localhost:3001/api/v1', 'string', 'admin', FALSE, TRUE),
('admin.email', 'admin@balloo.local', 'string', 'admin', FALSE, FALSE),
('admin.password', 'Admin123!', 'encrypted', 'admin', TRUE, FALSE),

-- Общие настройки
('features.beta_enabled', 'false', 'boolean', 'features', FALSE, FALSE),
('features.max_file_size', '52428800', 'number', 'features', FALSE, FALSE),
('ui.default_theme', 'system', 'string', 'ui', FALSE, FALSE),
('ui.default_language', 'ru', 'string', 'i18n', FALSE, FALSE),
('security.session_timeout', '604800', 'number', 'security', FALSE, FALSE),
('security.rate_limit_requests', '100', 'number', 'security', FALSE, FALSE),
('security.rate_limit_window', '900', 'number', 'security', FALSE, FALSE);
```

**Шаг 2: Создать сервис для загрузки настроек**
```typescript
// api/src/services/settings.service.ts
import { db } from '../config/database';
import { logger } from '../config/logger';

export class SettingsService {
  /**
   * Получить настройку по ключу
   */
  static getSetting(key: string): any {
    const setting = db.prepare(`
      SELECT setting_value, setting_type FROM system_settings 
      WHERE setting_key = ?
    `).get(key) as any;

    if (!setting) {
      logger.warn(`Setting not found: ${key}`);
      return null;
    }

    if (setting.setting_type === 'json') {
      return JSON.parse(setting.setting_value);
    }

    if (setting.setting_type === 'number') {
      return Number(setting.setting_value);
    }

    if (setting.setting_type === 'boolean') {
      return setting.setting_value === 'true';
    }

    return setting.setting_value;
  }

  /**
   * Получить все настройки категории
   */
  static getSettingsByCategory(category: string): Record<string, any> {
    const settings = db.prepare(`
      SELECT setting_key, setting_value, setting_type FROM system_settings 
      WHERE category = ?
    `).all(category) as any[];

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
      SELECT setting_type FROM system_settings WHERE setting_key = ?
    `).get(key) as any;

    if (!setting) {
      throw new Error(`Setting not found: ${key}`);
    }

    const stringValue = setting.setting_type === 'json' 
      ? JSON.stringify(value) 
      : String(value);

    db.prepare(`
      UPDATE system_settings 
      SET setting_value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
      WHERE setting_key = ?
    `).run(stringValue, updatedBy || 'system', key);
  }

  /**
   * Парсинг значения настройки
   */
  private static parseSetting(setting: any): any {
    if (setting.setting_type === 'json') {
      return JSON.parse(setting.setting_value);
    }
    if (setting.setting_type === 'number') {
      return Number(setting.setting_value);
    }
    if (setting.setting_type === 'boolean') {
      return setting.setting_value === 'true';
    }
    return setting.setting_value;
  }
}
```

**Шаг 3: Обновить конфигурационные файлы**
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
  security: {
    rateLimit: {
      requests: SettingsService.getSetting('security.rate_limit_requests') || 100,
      window: SettingsService.getSetting('security.rate_limit_window') || 900,
    },
  },
};
```

**Шаг 4: Добавить миграцию для переноса**
```sql
-- migrations/003_migrate_env_to_settings.sql
-- Миграция переноса настроек из .env в БД

-- Создать индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_settings_encrypted ON system_settings(is_encrypted);
CREATE INDEX IF NOT EXISTS idx_settings_public ON system_settings(is_public);

-- Перенести существующие настройки (если их нет)
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, category, is_encrypted, is_public)
SELECT 'api.database_url', 'sqlite:./data/baloohub.db', 'string', 'api', 1, 0
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key = 'api.database_url');

-- ... добавить остальные настройки
```

#### Требования:
- [ ] Создать миграцию 003_migrate_env_to_settings.sql
- [ ] Создать SettingsService
- [ ] Обновить все конфигурационные файлы
- [ ] Добавить API endpoints для управления настройками
- [ ] Добавить UI для редактирования настроек в admin-portal
- [ ] Зашифровать чувствительные настройки
- [ ] Протестировать перенос
- [ ] Обновить документацию

---

### 2. Реализовать UI редактора функций

**ID:** TASK-002  
**Приоритет:** 🔴 Высокий  
**Срок:** Q2 2026

#### Описание:
Создать административный интерфейс для создания, редактирования и удаления функций с парольной защитой.

#### Требования:

**Страница: /admin/functions**
```tsx
// admin-portal/src/pages/admin/functions.tsx
import { useState, useEffect } from 'react';
import { FunctionsAPI } from '@/api/functions';
import { AuthGuard } from '@/components/AuthGuard';

export default function FunctionsPage() {
  const [functions, setFunctions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка пароля
  const checkPassword = async () => {
    const isValid = await FunctionsAPI.verifyAdminPassword(password);
    if (isValid) {
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthGuard requiredRole="staff">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление функциями</h1>
        
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl mb-4">Введите пароль администратора</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Пароль"
            />
            <button
              onClick={checkPassword}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Войти
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Список функций</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                + Добавить функцию
              </button>
            </div>
            
            <FunctionsTable functions={functions} />
          </>
        )}
        
        {showAddModal && (
          <AddFunctionModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              loadFunctions();
            }}
          />
        )}
      </div>
    </AuthGuard>
  );
}
```

**Модальное окно: Добавить функцию**
```tsx
// admin-portal/src/components/Functions/AddFunctionModal.tsx
import { useState } from 'react';
import { FunctionsAPI } from '@/api/functions';

interface AddFunctionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFunctionModal({ onClose, onSuccess }: AddFunctionModalProps) {
  const [formData, setFormData] = useState({
    function_id: '',
    name: '',
    short_description: '',
    long_description: '',
    technical_description: '',
    module: 'messenger',
    category: '',
    status: 'planned',
    priority: 'medium',
    components: [],
    api_endpoints: [],
    ui_tabs: [],
    ui_pages: [],
    attachment_types: [],
    auth_methods: [],
    is_visible_to_users: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await FunctionsAPI.createFunction(formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create function:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Добавить новую функцию</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Основная информация */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Function ID *</label>
                <input
                  type="text"
                  value={formData.function_id}
                  onChange={(e) => setFormData({...formData, function_id: e.target.value})}
                  className="border p-2 w-full"
                  placeholder="MESSENGER-CAT-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Название *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border p-2 w-full"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Короткое описание</label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                className="border p-2 w-full"
                rows={2}
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Длинное описание</label>
              <textarea
                value={formData.long_description}
                onChange={(e) => setFormData({...formData, long_description: e.target.value})}
                className="border p-2 w-full"
                rows={4}
              />
            </div>
          </div>

          {/* Классификация */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Классификация</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Модуль *</label>
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({...formData, module: e.target.value})}
                  className="border p-2 w-full"
                  required
                >
                  <option value="messenger">Messenger</option>
                  <option value="api">API Server</option>
                  <option value="admin">Admin Portal</option>
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                  <option value="android">Android</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Категория *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="border p-2 w-full"
                >
                  <option value="planned">В плане</option>
                  <option value="in_progress">В работе</option>
                  <option value="implemented">Реализовано</option>
                  <option value="deprecated">Устарело</option>
                </select>
              </div>
            </div>
          </div>

          {/* Вложения */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Вложения</h3>
            <div className="flex gap-4 flex-wrap">
              {['image', 'video', 'file', 'audio', 'document'].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.attachment_types.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          attachment_types: [...formData.attachment_types, type]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          attachment_types: formData.attachment_types.filter(t => t !== type)
                        });
                      }
                    }}
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Методы авторизации */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Методы авторизации</h3>
            <div className="flex gap-4 flex-wrap">
              {['jwt', '2fa', 'biometric', 'sms'].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.auth_methods.includes(method)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          auth_methods: [...formData.auth_methods, method]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          auth_methods: formData.auth_methods.filter(m => m !== method)
                        });
                      }
                    }}
                  />
                  <span className="capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Видимость */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Видимость</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_visible_to_users}
                onChange={(e) => setFormData({...formData, is_visible_to_users: e.target.checked})}
              />
              <span>Видимо пользователям</span>
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Создать функцию
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### Требования:
- [ ] Создать страницу /admin/functions
- [ ] Создать компонент AddFunctionModal
- [ ] Создать компонент FunctionsTable
- [ ] Создать компонент EditFunctionModal
- [ ] Добавить API клиент FunctionsAPI
- [ ] Реализовать проверку пароля
- [ ] Добавить валидацию формы
- [ ] Добавить подтверждение удаления
- [ ] Протестировать CRUD операции

---

### 3. Интегрировать Functions API с UI

**ID:** TASK-003  
**Приоритет:** 🟡 Средний  
**Срок:** Q2 2026

#### Описание:
Интегрировать API функций с messenger и admin-portal для отображения списка функций.

#### Требования:

**Messenger - Страница функций**
```tsx
// messenger/src/pages/functions.tsx
import { useEffect, useState } from 'react';
import { FunctionsAPI } from '@/api/functions';

export default function FunctionsPage() {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFunctions = async () => {
      const result = await FunctionsAPI.getPublicFunctions();
      setFunctions(result.data);
      setLoading(false);
    };
    
    loadFunctions();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Функции проекта</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {functions.map((func: any) => (
          <FunctionCard key={func.function_id} function={func} />
        ))}
      </div>
    </div>
  );
}
```

**Admin Portal - Статистика функций**
```tsx
// admin-portal/src/pages/admin/functions-stats.tsx
import { useEffect, useState } from 'react';
import { FunctionsAPI } from '@/api/functions';

export default function FunctionsStatsPage() {
  const [stats, setStats] = useState({
    total: 0,
    implemented: 0,
    inProgress: 0,
    planned: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const result = await FunctionsAPI.getAllFunctions();
      const functions = result.data;
      
      setStats({
        total: functions.length,
        implemented: functions.filter(f => f.status === 'implemented').length,
        inProgress: functions.filter(f => f.status === 'in_progress').length,
        planned: functions.filter(f => f.status === 'planned').length,
      });
    };
    
    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Статистика функций</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Всего" value={stats.total} color="blue" />
        <StatCard title="Реализовано" value={stats.implemented} color="green" />
        <StatCard title="В работе" value={stats.inProgress} color="yellow" />
        <StatCard title="В плане" value={stats.planned} color="gray" />
      </div>
    </div>
  );
}
```

#### Требования:
- [ ] Создать FunctionsAPI клиент
- [ ] Создать FunctionCard компонент
- [ ] Создать FunctionsPage в messenger
- [ ] Создать FunctionsStatsPage в admin-portal
- [ ] Добавить навигацию к страницам
- [ ] Добавить фильтрацию и поиск
- [ ] Протестировать интеграцию

---

### 4. Добавить кнопку "Добавить функцию" в FUNCTIONS_REGISTRY

**ID:** TASK-004  
**Приоритет:** 🟡 Средний  
**Срок:** Q2 2026

#### Описание:
Добавить в FUNCTIONS_REGISTRY/INDEX.md кнопку для создания новой функции с парольной защитой.

#### Требования:
- [ ] Обновить FUNCTIONS_REGISTRY/INDEX.md
- [ ] Добавить компонент кнопки
- [ ] Добавить модальное окно входа
- [ ] Подключить к API

---

## 📊 ПРИБЛИЗИТЕЛЬНЫЕ СРОКИ

| Задача | Оценка часов | Приоритет |
|--------|--------------|-----------|
| TASK-001: Перенос настроек | 8 | 🔴 Высокий |
| TASK-002: UI редактор функций | 16 | 🔴 Высокий |
| TASK-003: Интеграция API | 8 | 🟡 Средний |
| TASK-004: Кнопка в INDEX | 2 | 🟡 Средний |
| **ИТОГО** | **34 часа** | |

---

## 🎯 КРИТЕРИИ ЗАВЕРШЕНИЯ

### TASK-001:
- [ ] Все настройки из .env перенесены в system_settings
- [ ] Создан SettingsService
- [ ] Конфигурационные файлы используют БД
- [ ] Чувствительные данные зашифрованы
- [ ] Протестировано

### TASK-002:
- [ ] Страница /admin/functions работает
- [ ] Парольная защита работает
- [ ] CRUD операции работают
- [ ] Валидация формы работает
- [ ] Протестировано

### TASK-003:
- [ ] FunctionsAPI клиент создан
- [ ] Страницы функций созданы
- [ ] Отображение функций работает
- [ ] Протестировано

### TASK-004:
- [ ] Кнопка добавлена
- [ ] Парольная защита работает
- [ ] Ссылка на админку

---

**Создано:** 2026-06-13  
**Автор:** Koda (NLP-Core-Team)  
**Статус:** Ожидает выполнения  
**Следующий тикет:** TICKET-016

---

**🎈 Balloo - Share your moments safely!**
