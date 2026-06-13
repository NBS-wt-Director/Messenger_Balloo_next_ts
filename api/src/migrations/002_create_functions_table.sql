-- Миграция: Создание таблицы функций проекта
-- Дата: 2026-06-13
-- Версия: 1.0.0

-- Таблица функций проекта
CREATE TABLE IF NOT EXISTS project_functions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Основная информация
    function_id TEXT UNIQUE NOT NULL,  -- Уникальный ID (напр. MESSENGER-AUTH-001)
    name TEXT NOT NULL,                 -- Название функции
    short_description TEXT,             -- Короткое описание (для пользователей)
    long_description TEXT,              -- Длинное описание (для сотрудников)
    technical_description TEXT,         -- Техническое описание (для разработчиков)
    
    -- Классификация
    module TEXT NOT NULL,               -- Модуль (messenger, api, admin, mobile, desktop, android)
    category TEXT NOT NULL,             -- Категория (auth, chat, files, calls, etc.)
    subcategory TEXT,                   -- Подкатегория
    function_type TEXT,                 -- Тип (feature, endpoint, component, ui, integration)
    
    -- Статус
    status TEXT DEFAULT 'planned',      -- planned, in_progress, implemented, deprecated
    priority TEXT DEFAULT 'medium',     -- critical, high, medium, low
    completion_percentage INTEGER DEFAULT 0,  -- 0-100
    
    -- Реализация
    implemented_date DATETIME,          -- Дата реализации
    implemented_by TEXT,                -- Кто реализовал
    github_commit TEXT,                 -- Ссылка на коммит
    github_pr TEXT,                     -- Ссылка на PR
    
    -- Компоненты
    components TEXT,                    -- JSON массив компонентов (React компоненты)
    hooks TEXT,                         -- JSON массив хуков
    api_endpoints TEXT,                 -- JSON массив API endpoints
    database_tables TEXT,               -- JSON массив таблиц БД
    
    -- UI элементы
    ui_tabs TEXT,                       -- JSON массив вкладок
    ui_pages TEXT,                      -- JSON массив страниц
    ui_buttons TEXT,                    -- JSON массив кнопок
    ui_forms TEXT,                      -- JSON массив форм
    
    -- Вложения и типы данных
    attachment_types TEXT,              -- JSON массив типов вложений (image, video, file, audio)
    supported_formats TEXT,             -- JSON массив форматов
    max_file_size INTEGER,              -- Максимальный размер файла (MB)
    
    -- Авторизация
    auth_methods TEXT,                  -- JSON массив методов авторизации (jwt, 2fa, biometric)
    permissions TEXT,                   -- JSON массив требуемых разрешений
    roles TEXT,                         -- JSON массив ролей (user, admin, moderator)
    
    -- Медиа
    icon_url TEXT,                      -- Ссылка на иконку
    screenshot_url TEXT,                -- Скриншот
    demo_url TEXT,                      -- Ссылка на демо
    
    -- Документация
    docs_url TEXT,                      -- Ссылка на документацию в SUMMARY_DOCS
    changelog TEXT,                     -- История изменений (JSON)
    
    -- Планирование
    planned_quarter TEXT,               -- Квартал плана (Q2 2026, Q3 2026)
    estimated_hours INTEGER,            -- Оценка часов
    actual_hours INTEGER,               -- Фактические часы
    
    -- Мета
    tags TEXT,                          -- JSON массив тегов
    related_functions TEXT,             -- JSON массив связанных функций
    parent_function_id TEXT,            -- ID родительской функции
    sort_order INTEGER DEFAULT 0,       -- Порядок сортировки
    
    -- Системные поля
    is_visible_to_users BOOLEAN DEFAULT TRUE,   -- Видимо пользователям
    is_visible_to_staff BOOLEAN DEFAULT TRUE,   -- Видимо сотрудникам
    is_api_exposed BOOLEAN DEFAULT TRUE,        -- Доступно через API
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT
);

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_functions_module ON project_functions(module);
CREATE INDEX IF NOT EXISTS idx_functions_category ON project_functions(category);
CREATE INDEX IF NOT EXISTS idx_functions_status ON project_functions(status);
CREATE INDEX IF NOT EXISTS idx_functions_priority ON project_functions(priority);
CREATE INDEX IF NOT EXISTS idx_functions_type ON project_functions(function_type);
CREATE INDEX IF NOT EXISTS idx_functions_visible ON project_functions(is_visible_to_users);

-- Таблица истории изменений функций
CREATE TABLE IF NOT EXISTS project_functions_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    function_id TEXT NOT NULL,
    action TEXT NOT NULL,  -- created, updated, deleted, status_changed
    old_value TEXT,        -- JSON старых значений
    new_value TEXT,        -- JSON новых значений
    changed_by TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (function_id) REFERENCES project_functions(function_id)
);

-- Таблица настроек системы (центральный узел настроек)
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Ключ и значение
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,  -- JSON значение
    
    -- Мета
    setting_type TEXT DEFAULT 'string',  -- string, number, boolean, json, encrypted
    description TEXT,
    category TEXT,  -- auth, ui, api, security, features
    
    -- Доступ
    is_public BOOLEAN DEFAULT FALSE,      -- Публичная настройка
    is_encrypted BOOLEAN DEFAULT FALSE,   -- Требует шифрования
    requires_restart BOOLEAN DEFAULT FALSE,  -- Требует перезапуска
    
    -- Системные поля
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT
);

-- Таблица версий документации
CREATE TABLE IF NOT EXISTS documentation_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_path TEXT NOT NULL,  -- Путь к файлу в SUMMARY_DOCS
    version TEXT NOT NULL,
    content TEXT NOT NULL,
    changelog TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    UNIQUE(doc_path, version)
);

-- Добавим начальные настройки
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description, category, is_encrypted) VALUES
('admin.password', 'A10n13n13a_O_K', 'encrypted', 'Пароль администратора для редактора и создания функций', 'auth', TRUE),
('api.version', '"1.0.0"', 'json', 'Версия API', 'api', FALSE),
('features.show_unimplemented', 'false', 'boolean', 'Показывать не реализованные функции', 'features', FALSE),
('ui.theme.default', '"system"', 'json', 'Тема по умолчанию', 'ui', FALSE),
('security.session_timeout', '86400', 'number', 'Таймаут сессии в секундах', 'security', FALSE);

-- Добавим примеры функций (из аудита)
INSERT OR IGNORE INTO project_functions (
    function_id, name, short_description, module, category, status, priority, completion_percentage,
    components, api_endpoints, auth_methods, attachment_types, ui_pages, is_visible_to_users
) VALUES
('MESSENGER-AUTH-001', 'Регистрация пользователя', 'Создание нового аккаунта с подтверждением email', 'messenger', 'auth', 'implemented', 'high', 100,
 '["src/pages/auth/register.tsx", "src/components/Auth/RegisterForm.tsx"]',
 '["POST /api/v1/auth/register"]',
 '["jwt"]',
 'null',
 '["/auth/register"]',
 TRUE),

('MESSENGER-AUTH-002', 'Вход в систему', 'Аутентификация с поддержкой 2FA', 'messenger', 'auth', 'implemented', 'high', 100,
 '["src/pages/auth/login.tsx", "src/components/Auth/LoginForm.tsx", "src/components/Auth/TwoFactorForm.tsx"]',
 '["POST /api/v1/auth/login", "POST /api/v1/auth/2fa/verify"]',
 '["jwt", "2fa"]',
 'null',
 '["/auth/login"]',
 TRUE),

('MESSENGER-CHAT-004', 'Отправка сообщений', 'Отправка текстовых сообщений с форматированием и вложениями', 'messenger', 'chat', 'implemented', 'high', 100,
 '["src/components/Chat/MessageInput.tsx", "src/components/Chat/EmojiPicker.tsx", "src/components/Chat/FileUploader.tsx"]',
 '["POST /api/v1/chats/:id/messages"]',
 '["jwt"]',
 '["image", "video", "file", "audio"]',
 '["/chat/[id]"]',
 TRUE),

('MESSENGER-FILE-001', 'Загрузка файлов', 'Drag-and-drop загрузка файлов до 50MB', 'messenger', 'files', 'implemented', 'medium', 100,
 '["src/components/Chat/FileUploader.tsx", "src/components/Chat/FilePreview.tsx"]',
 '["POST /api/v1/files/upload"]',
 '["jwt"]',
 '["image", "video", "file", "audio", "document"]',
 '["/chat/[id]"]',
 TRUE),

('MESSENGER-CALL-001', 'Аудио звонки', 'WebRTC аудио звонки между пользователями', 'messenger', 'calls', 'implemented', 'high', 100,
 '["src/components/Calls/AudioCall.tsx", "src/components/Calls/CallModal.tsx"]',
 '["POST /api/v1/calls"]',
 '["jwt"]',
 'null',
 '["/call/[id]"]',
 TRUE),

('MESSENGER-CALL-002', 'Видео звонки', 'WebRTC видео звонки с переключением камер', 'messenger', 'calls', 'implemented', 'high', 100,
 '["src/components/Calls/VideoCall.tsx", "src/components/Calls/VideoPreview.tsx"]',
 '["POST /api/v1/calls"]',
 '["jwt"]',
 'null',
 '["/call/[id]"]',
 TRUE),

('API-AUTH-001', 'Регистрация API', 'REST API endpoint для регистрации', 'api', 'auth', 'implemented', 'high', 100,
 'null',
 '["POST /api/v1/auth/register"]',
 'null',
 'null',
 'null',
 FALSE),

('ADMIN-STAT-001', 'Статистика пользователей', 'Дашборд со статистикой пользователей', 'admin', 'dashboard', 'implemented', 'medium', 100,
 '["src/components/Dashboard/UserStats.tsx", "src/components/Dashboard/UserChart.tsx"]',
 '["GET /api/v1/admin/statistics"]',
 '["jwt", "admin"]',
 'null',
 '["/admin/dashboard"]',
 FALSE);

-- Индекс для поиска по настройкам
CREATE INDEX IF NOT EXISTS idx_settings_key ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON system_settings(category);
