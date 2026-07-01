-- ============================================================
-- Balloo Platform — Предзаполнение таблицы функций
-- Версия: 1.0 (БАЗОВАЯ) + 2.0 (ПЛАН РАЗВИТИЯ)
-- ============================================================
-- Разделение:
--   - V1: is_premium = FALSE, released_at IS NOT NULL
--   - V2: is_premium = TRUE,  released_at IS NULL
-- ============================================================

-- 1. Таблица функций
CREATE TABLE IF NOT EXISTS platform_functions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(100) UNIQUE NOT NULL,
    name_ru         VARCHAR(255) NOT NULL,
    name_en         VARCHAR(255) NOT NULL,
    description_ru  TEXT,
    description_en  TEXT,
    category        VARCHAR(50) NOT NULL,
    subcategory     VARCHAR(50),
    is_free         BOOLEAN NOT NULL DEFAULT TRUE,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    is_beta         BOOLEAN NOT NULL DEFAULT FALSE,
    min_version     VARCHAR(20) DEFAULT '1.0.0',
    max_version     VARCHAR(20),
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
    icon            VARCHAR(50),
    sort_order      INTEGER NOT NULL DEFAULT 0,
    data_schema     JSONB,
    permissions     JSONB DEFAULT '[]',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    released_at     TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_functions_slug ON platform_functions(slug);
CREATE INDEX IF NOT EXISTS idx_functions_category ON platform_functions(category);
CREATE INDEX IF NOT EXISTS idx_functions_status ON platform_functions(status);
CREATE INDEX IF NOT EXISTS idx_functions_premium ON platform_functions(is_premium);

-- 2. Предзаполнение функций V1
INSERT INTO platform_functions (slug, name_ru, name_en, description_ru, description_en, category, subcategory, is_free, is_premium, status, icon, sort_order, data_schema, released_at) VALUES

-- AUTH & ACCOUNT
('auth_login', 'Вход в аккаунт', 'Login', 'Аутентификация по email/телефону', 'User auth via email/phone', 'auth', 'account', TRUE, FALSE, 'active', 'login', 1, '{"fields":["email","password"]}', '2026-01-01'),
('auth_register', 'Регистрация', 'Registration', 'Создание аккаунта', 'New account creation', 'auth', 'account', TRUE, FALSE, 'active', 'register', 2, '{"fields":["email","phone","username","password"]}', '2026-01-01'),
('auth_2fa_totp', '2FA (TOTP)', '2FA TOTP', 'Google Authenticator / Authy', 'Extra 2FA protection', 'auth', 'security', TRUE, FALSE, 'active', 'shield', 3, '{"fields":["secret_key","code"]}', '2026-01-01'),
('auth_2fa_sms', 'SMS-подтверждение', 'SMS Verification', 'Код из SMS', 'Verification code via SMS', 'auth', 'security', TRUE, FALSE, 'active', 'sms', 4, '{"fields":["phone","sms_code"]}', '2026-01-01'),
('auth_password_reset', 'Восстановление пароля', 'Password Reset', 'Сброс через email/SMS', 'Reset via email/SMS', 'auth', 'account', TRUE, FALSE, 'active', 'key', 5, '{"fields":["email","reset_token"]}', '2026-01-01'),
('auth_social_yandex', 'Вход через Яндекс', 'Login via Yandex', 'OAuth Яндекс', 'OAuth via Yandex', 'auth', 'social', TRUE, FALSE, 'active', 'yandex', 6, '{"fields":["yandex_token"]}', '2026-01-01'),
('auth_profile', 'Профиль', 'Profile', 'Редактирование профиля', 'Edit profile', 'auth', 'account', TRUE, FALSE, 'active', 'user', 7, '{"fields":["username","avatar","bio"]}', '2026-01-01'),
('auth_account_delete', 'Удаление аккаунта', 'Delete Account', 'Безвозвратное удаление', 'Irreversible deletion', 'auth', 'account', TRUE, FALSE, 'active', 'trash', 8, '{"fields":["confirmation"]}', '2026-01-01'),

-- MESSENGER CORE
('msg_chat_list', 'Список чатов', 'Chat List', 'Список чатов с поиском', 'Chat list with search', 'messenger', 'core', TRUE, FALSE, 'active', 'chat', 10, '{"fields":["chat_id","name","last_msg","unread"]}', '2026-01-01'),
('msg_private_chat', 'Приватные чаты', 'Private Chats', 'E2EE переписки', 'E2EE conversations', 'messenger', 'core', TRUE, FALSE, 'active', 'message', 11, '{"fields":["chat_id","peer_id","messages"]}', '2026-01-01'),
('msg_group_chat', 'Групповые чаты', 'Group Chats', 'Группы до 200К', 'Groups up to 200K', 'messenger', 'core', TRUE, FALSE, 'active', 'group', 12, '{"fields":["group_id","members","admins"]}', '2026-01-01'),
('msg_channel', 'Каналы', 'Channels', 'Каналы до 1М подписчиков', 'Channels up to 1M subs', 'messenger', 'core', TRUE, FALSE, 'active', 'broadcast', 13, '{"fields":["channel_id","subscribers"]}', '2026-01-01'),
('msg_message_send', 'Отправка сообщений', 'Send Messages', 'Текст, медиа, файлы', 'Text, media, files', 'messenger', 'core', TRUE, FALSE, 'active', 'send', 14, '{"fields":["chat_id","type","content"]}', '2026-01-01'),
('msg_message_edit', 'Редактирование', 'Edit Messages', 'До 24 часов', 'Up to 24 hours', 'messenger', 'core', TRUE, FALSE, 'active', 'edit', 15, '{"fields":["msg_id","new_content"]}', '2026-01-01'),
('msg_message_delete', 'Удаление сообщений', 'Delete Messages', 'Для себя или всех', 'For self or all', 'messenger', 'core', TRUE, FALSE, 'active', 'delete', 16, '{"fields":["msg_id","for_all"]}', '2026-01-01'),
('msg_message_reply', 'Ответы', 'Reply', 'Ответ на сообщение', 'Reply to message', 'messenger', 'core', TRUE, FALSE, 'active', 'reply', 17, '{"fields":["msg_id","reply_to"]}', '2026-01-01'),
('msg_message_forward', 'Пересылка', 'Forward', 'Пересылка в другие чаты', 'Forward to other chats', 'messenger', 'core', TRUE, FALSE, 'active', 'forward', 18, '{"fields":["msg_ids","target_chats"]}', '2026-01-01'),
('msg_message_pin', 'Закрепление', 'Pin', 'Закрепление в чате', 'Pin in chat', 'messenger', 'core', TRUE, FALSE, 'active', 'pin', 19, '{"fields":["msg_id","chat_id"]}', '2026-01-01'),
('msg_message_reaction', 'Реакции', 'Reactions', 'Эмодзи-реакции', 'Emoji reactions', 'messenger', 'core', TRUE, FALSE, 'active', 'heart', 20, '{"fields":["msg_id","reaction"]}', '2026-01-01'),
('msg_message_search', 'Поиск', 'Search', 'Поиск по сообщениям', 'Search messages', 'messenger', 'core', TRUE, FALSE, 'active', 'search', 21, '{"fields":["query","scope"]}', '2026-01-01'),

-- MESSENGER MEDIA
('msg_voice_message', 'Голосовые', 'Voice Messages', 'Голосовые сообщения', 'Voice messages', 'messenger', 'media', TRUE, FALSE, 'active', 'mic', 22, '{"fields":["audio","duration"]}', '2026-01-01'),
('msg_video_message', 'Видеосообщения', 'Video Messages', 'Короткие видео', 'Short videos', 'messenger', 'media', TRUE, FALSE, 'active', 'video', 23, '{"fields":["video","duration"]}', '2026-01-01'),
('msg_stickers', 'Стикеры', 'Stickers', 'Стикеры и пакеты', 'Stickers and packs', 'messenger', 'media', TRUE, FALSE, 'active', 'sticker', 24, '{"fields":["pack_id","sticker_id"]}', '2026-01-01'),
('msg_emoji', 'Эмодзи', 'Emoji', 'Эмодзи', 'Emoji', 'messenger', 'media', TRUE, FALSE, 'active', 'emoji', 25, '{"fields":["emoji"]}', '2026-01-01'),
('msg_mute_chat', 'Mute чата', 'Mute Chat', 'Отключить уведомления', 'Mute notifications', 'messenger', 'notifications', TRUE, FALSE, 'active', 'bell-off', 26, '{"fields":["chat_id","duration"]}', '2026-01-01'),
('msg_archive_chat', 'Архив', 'Archive', 'Архив чатов', 'Chat archive', 'messenger', 'core', TRUE, FALSE, 'active', 'archive', 27, '{"fields":["chat_ids"]}', '2026-01-01'),
('msg_favorites', 'Избранное', 'Saved Messages', 'Избранные сообщения', 'Saved messages', 'messenger', 'core', TRUE, FALSE, 'active', 'star', 28, '{"fields":["msg_id"]}', '2026-01-01'),

-- CALLS
('call_voice', 'Голосовые звонки', 'Voice Calls', 'VOIP звонки', 'VOIP calls', 'calls', 'core', TRUE, FALSE, 'active', 'phone', 30, '{"fields":["caller","callee","duration"]}', '2026-01-01'),
('call_video', 'Видеозвонки', 'Video Calls', 'Видеозвонки', 'Video calls', 'calls', 'core', TRUE, FALSE, 'active', 'video', 31, '{"fields":["caller","callee","is_video"]}', '2026-01-01'),
('call_group_voice', 'Групповые голосовые', 'Group Voice', 'До 30 участников', 'Up to 30 participants', 'calls', 'group', TRUE, FALSE, 'active', 'phone', 32, '{"fields":["group","participants"]}', '2026-01-01'),
('call_group_video', 'Групповые видео', 'Group Video', 'До 10 участников', 'Up to 10 participants', 'calls', 'group', TRUE, FALSE, 'active', 'video', 33, '{"fields":["group","participants"]}', '2026-01-01'),

-- FILES
('file_send', 'Отправка файлов', 'Send Files', 'До 100 МБ', 'Up to 100 MB', 'files', 'core', TRUE, FALSE, 'active', 'file', 40, '{"fields":["file","size","mime"]}', '2026-01-01'),
('file_download', 'Загрузки', 'Downloads', 'Управление файлами', 'Manage files', 'files', 'core', TRUE, FALSE, 'active', 'download', 41, '{"fields":["file_id","path"]}', '2026-01-01'),
('file_photo', 'Фото', 'Photos', 'Фотографии', 'Photos', 'files', 'media', TRUE, FALSE, 'active', 'image', 42, '{"fields":["photo","caption"]}', '2026-01-01'),
('file_document', 'Документы', 'Documents', 'Документы', 'Documents', 'files', 'media', TRUE, FALSE, 'active', 'file', 43, '{"fields":["doc","caption"]}', '2026-01-01'),
('file_location', 'Геолокация', 'Location', 'Местоположение', 'Location', 'files', 'media', TRUE, FALSE, 'active', 'map-pin', 44, '{"fields":["lat","lng"]}', '2026-01-01'),
('file_contact', 'Контакты', 'Contacts', 'Отправка контактов', 'Send contacts', 'files', 'media', TRUE, FALSE, 'active', 'user', 45, '{"fields":["name","phone"]}', '2026-01-01'),

-- SECURITY
('sec_e2ee', 'E2EE шифрование', 'E2EE', 'Сквозное шифрование', 'End-to-end encryption', 'security', 'encryption', TRUE, FALSE, 'active', 'lock', 50, '{"fields":["protocol","keys"]}', '2026-01-01'),
('sec_self_destruct', 'Самоуничтожение', 'Self-Destruct', 'Удаление через время', 'Auto-delete after time', 'security', 'encryption', TRUE, FALSE, 'active', 'timer', 51, '{"fields":["msg_id","ttl"]}', '2026-01-01'),
('sec_passcode', 'Блокировка', 'App Lock', 'PIN / биометрия', 'PIN / biometrics', 'security', 'access', TRUE, FALSE, 'active', 'lock', 52, '{"fields":["type","pin"]}', '2026-01-01'),
('sec_sessions', 'Сессии', 'Sessions', 'Управление устройствами', 'Manage devices', 'security', 'access', TRUE, FALSE, 'active', 'devices', 53, '{"fields":["device_id","last_active"]}', '2026-01-01'),

-- SETTINGS
('settings_profile', 'Профиль', 'Profile Settings', 'Настройки профиля', 'Profile settings', 'settings', 'account', TRUE, FALSE, 'active', 'user', 60, '{"fields":["username","avatar","lang"]}', '2026-01-01'),
('settings_privacy', 'Приватность', 'Privacy', 'Настройки видимости', 'Visibility settings', 'settings', 'privacy', TRUE, FALSE, 'active', 'eye', 61, '{"fields":["status","phone","avatar"]}', '2026-01-01'),
('settings_notifications', 'Уведомления', 'Notifications', 'Звуки, push', 'Sounds, push', 'settings', 'notifications', TRUE, FALSE, 'active', 'bell', 62, '{"fields":["sound","preview","push"]}', '2026-01-01'),
('settings_themes', 'Темы', 'Themes', 'Тёмная, светлая, РФ', 'Dark, light, RU', 'settings', 'appearance', TRUE, FALSE, 'active', 'palette', 63, '{"fields":["theme","accent"]}', '2026-01-01'),
('settings_language', 'Язык', 'Language', 'Выбор языка', 'Language selection', 'settings', 'appearance', TRUE, FALSE, 'active', 'globe', 64, '{"fields":["lang_code"]}', '2026-01-01'),
('settings_storage', 'Хранилище', 'Storage', 'Диск, автозагрузка', 'Disk, auto-download', 'settings', 'storage', TRUE, FALSE, 'active', 'disk', 65, '{"fields":["auto_dl","cache"]}', '2026-01-01'),
('settings_about_balloo', 'О Balloo', 'About Balloo', 'Версия, лицензии', 'Version, licenses', 'settings', 'info', TRUE, FALSE, 'active', 'info', 66, '{"fields":["version","build"]}', '2026-01-01'),
('settings_about_company', 'О компании', 'About Company', 'NBS — web-tech', 'NBS — web-tech info', 'settings', 'info', TRUE, FALSE, 'active', 'building', 67, '{"fields":["name","address"]}', '2026-01-01'),
('settings_terms', 'Условия', 'Terms of Service', 'Пользовательское соглашение', 'Terms of Service', 'settings', 'legal', TRUE, FALSE, 'active', 'document', 68, '{"fields":["version","content"]}', '2026-01-01'),
('settings_privacy_policy', 'Конфиденциальность', 'Privacy Policy', 'Политика ПДн', 'Privacy Policy', 'settings', 'legal', TRUE, FALSE, 'active', 'shield', 69, '{"fields":["version","content"]}', '2026-01-01'),
('settings_support', 'Поддержка', 'Support', 'Служба поддержки', 'Support service', 'settings', 'support', TRUE, FALSE, 'active', 'help', 70, '{"fields":["ticket","message"]}', '2026-01-01'),
('settings_features', 'Функции', 'Features', 'Обзор функций', 'Features overview', 'settings', 'info', TRUE, FALSE, 'active', 'grid', 71, '{"fields":["features"]}', '2026-01-01'),

-- DISCOVER
('discover_balonishka', 'Балунишка', 'Baloonishka', 'Маскот Борис', 'Mascot Boris', 'discover', 'core', TRUE, FALSE, 'active', 'bear', 80, '{"fields":["mascot_state","animation"]}', '2026-01-01'),
('discover_marketplace', 'Рынок', 'Marketplace', 'Маркетплейс', 'Marketplace', 'discover', 'core', TRUE, FALSE, 'active', 'store', 81, '{"fields":["items","categories"]}', '2026-01-01'),
('discover_news', 'Новости', 'News', 'Новости платформы', 'Platform news', 'discover', 'content', TRUE, FALSE, 'active', 'newspaper', 82, '{"fields":["news_id","content"]}', '2026-01-01'),

-- SUPPORT
('support_ticket', 'Создать обращение', 'Create Ticket', 'Обращение в поддержку', 'Support ticket', 'support', 'core', TRUE, FALSE, 'active', 'ticket', 90, '{"fields":["category","description"]}', '2026-01-01'),
('support_tickets_list', 'Мои обращения', 'My Tickets', 'Список обращений', 'Ticket list', 'support', 'core', TRUE, FALSE, 'active', 'list', 91, '{"fields":["tickets"]}', '2026-01-01'),
('support_faq', 'FAQ', 'FAQ', 'Частые вопросы', 'FAQ', 'support', 'info', TRUE, FALSE, 'active', 'question', 92, '{"fields":["questions"]}', '2026-01-01'),
('support_feedback', 'Обратная связь', 'Feedback', 'Отзывы', 'Reviews', 'support', 'core', TRUE, FALSE, 'active', 'comment', 93, '{"fields":["type","message"]}', '2026-01-01'),
('support_donate', 'Поддержать', 'Support Project', 'Пожертвования', 'Donations', 'support', 'finance', TRUE, FALSE, 'active', 'heart', 94, '{"fields":["amount","method"]}', '2026-01-01'),
('support_versions', 'История версий', 'Version History', 'История обновлений', 'Update history', 'support', 'info', TRUE, FALSE, 'active', 'history', 95, '{"fields":["versions"]}', '2026-01-01'),

-- DOWNLOADS
('downloads_app', 'Скачать приложение', 'Download App', 'Ссылки на скачивание', 'Download links', 'downloads', 'core', TRUE, FALSE, 'active', 'download', 100, '{"fields":["platform","url"]}', '2026-01-01'),
('downloads_files', 'Загруженные файлы', 'Downloaded Files', 'Библиотека файлов', 'File library', 'downloads', 'files', TRUE, FALSE, 'active', 'folder', 101, '{"fields":["files"]}', '2026-01-01'),

-- EMERGENCY
('emergency_mchs', 'Оповещения МЧС', 'MChS Alerts', 'Экстренные МЧС', 'MChS emergency alerts', 'emergency', 'alerts', TRUE, FALSE, 'active', 'alert', 110, '{"fields":["alert","severity"]}', '2026-01-01'),
('emergency_police', 'Оповещения Полиции', 'Police Alerts', 'Экстренные полиция', 'Police emergency alerts', 'emergency', 'alerts', TRUE, FALSE, 'active', 'alert', 111, '{"fields":["alert","severity"]}', '2026-01-01'),

-- PLATFORM
('platform_404', 'Страница 404', '404 Page', 'Ошибка не найдена', 'Page not found', 'platform', 'ui', TRUE, FALSE, 'active', 'alert', 200, '{"fields":["error"]}', '2026-01-01');


-- 3. Вспомогательные таблицы

-- =============================================
-- V2 ФУНКЦИИ (ПЛАН РАЗВИТИЯ — Premium)
-- is_premium = TRUE, released_at = NULL
-- =============================================

INSERT INTO platform_functions (slug, name_ru, name_en, description_ru, description_en, category, subcategory, is_free, is_premium, status, icon, sort_order, data_schema, released_at) VALUES

-- MESSENGER V2
('msg_reactions_custom', 'Кастомные реакции', 'Custom Reactions', 'Пользовательские реакции (GIF)', 'Custom GIF reactions', 'messenger', 'core', FALSE, TRUE, 'active', 'heart', 201, NULL, NULL),
('msg_threads', 'Треды', 'Threads', 'Треды в групповых чатах', 'Threads in group chats', 'messenger', 'core', FALSE, TRUE, 'active', 'thread', 202, NULL, NULL),
('msg_scheduled', 'Запланированные сообщения', 'Scheduled Messages', 'Отправка в заданное время', 'Send at scheduled time', 'messenger', 'core', FALSE, TRUE, 'active', 'calendar', 203, NULL, NULL),
('msg_auto_translate', 'Автоперевод', 'Auto Translate', 'Перевод сообщений на язык чата', 'Auto-translate to chat language', 'messenger', 'ai', FALSE, TRUE, 'active', 'globe', 204, NULL, NULL),

-- FILES V2
('file_upload_1gb', 'Файлы до 1 ГБ', 'Files up to 1 GB', 'Расширенный лимит файлов', 'Extended file limit', 'files', 'core', FALSE, TRUE, 'active', 'file', 205, NULL, NULL),

-- AI V2
('ai_chatbot', 'AI-ассистент', 'AI Assistant', 'Встроенный AI-помощник', 'Built-in AI assistant', 'ai', 'core', FALSE, TRUE, 'active', 'sparkle', 220, NULL, NULL),
('ai_content_gen', 'Генерация контента ИИ', 'AI Content Gen', 'Генерация текстов', 'Text generation', 'ai', 'core', FALSE, TRUE, 'active', 'wand', 221, NULL, NULL),
('ai_smart_reply', 'Умные ответы', 'Smart Replies', 'Предложения ответов', 'Reply suggestions', 'ai', 'core', FALSE, TRUE, 'active', 'lightbulb', 222, NULL, NULL),

-- MARKETPLACE V2
('marketplace_sell', 'Продажа на Рынке', 'Sell on Marketplace', 'Размещение товаров', 'List products', 'marketplace', 'trade', FALSE, TRUE, 'active', 'tag', 230, NULL, NULL),
('marketplace_wallet', 'Кошелёк', 'Wallet', 'Встроенный кошелёк', 'Built-in wallet', 'marketplace', 'finance', FALSE, TRUE, 'active', 'wallet', 231, NULL, NULL),
('marketplace_escrow', 'Эскроу', 'Escrow', 'Безопасные сделки', 'Secure transactions', 'marketplace', 'finance', FALSE, TRUE, 'active', 'lock', 232, NULL, NULL),

-- PREMIUM SETTINGS V2
('settings_data_ttl', 'TTL данных', 'Data TTL', 'Автоудаление данных', 'Auto-delete data', 'settings', 'privacy', FALSE, TRUE, 'active', 'timer', 240, NULL, NULL),
('settings_export_granular', 'Гранулярный экспорт', 'Granular Export', 'Выборочный экспорт', 'Selective export', 'settings', 'data', FALSE, TRUE, 'active', 'download', 241, NULL, NULL),

-- PLATFORM V2
('platform_api', 'Developer API', 'Developer API', 'REST API для интеграции', 'REST API for integration', 'platform', 'developer', FALSE, TRUE, 'active', 'code', 260, NULL, NULL),
('platform_webhooks', 'Webhooks', 'Webhooks', 'Уведомления о событиях', 'Event notifications', 'platform', 'developer', FALSE, TRUE, 'active', 'webhook', 261, NULL, NULL),
('platform_white_label', 'White Label', 'White Label', 'Брендированная версия', 'Branded version', 'platform', 'enterprise', FALSE, TRUE, 'active', 'brand', 262, NULL, NULL);


-- 4. Вспомогательные таблицы
CREATE TABLE IF NOT EXISTS platform_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version         VARCHAR(20) NOT NULL,
    build_number    INTEGER NOT NULL,
    release_date    DATE NOT NULL,
    is_latest       BOOLEAN NOT NULL DEFAULT FALSE,
    changelog_ru    TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO platform_versions (version, build_number, release_date, is_latest, changelog_ru) VALUES
('1.0.0', 1, '2026-06-01', TRUE, 'Базовая версия: авторизация, чаты, звонки, файлы, настройки'),
('1.1.0', 2, '2026-07-01', FALSE, 'Добавлены: группы, каналы, стикеры'),
('1.2.0', 3, '2026-08-01', FALSE, 'Добавлены: E2EE, голосовые, самоудаление'),
('2.0.0', 4, '2026-12-01', FALSE, 'Premium: AI, Рынок, White Label');

CREATE TABLE IF NOT EXISTS platform_themes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(50) UNIQUE NOT NULL,
    name_ru     VARCHAR(255) NOT NULL,
    is_default  BOOLEAN NOT NULL DEFAULT FALSE,
    colors      JSONB NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO platform_themes (slug, name_ru, is_default, colors) VALUES
('dark', 'Тёмная тема', TRUE, '{"bg":"#0F172A","surface":"#1E293B","text":"#F8FAFC","primary":"#2563EB","secondary":"#7C3AED","border":"#334155"}'),
('light', 'Светлая тема', FALSE, '{"bg":"#FFFFFF","surface":"#F1F5F9","text":"#0F172A","primary":"#2563EB","secondary":"#7C3AED","border":"#E2E8F0"}'),
('russia', 'Тема Россия', FALSE, '{"bg":"#0A1628","surface":"#1A2744","text":"#E8ECF4","primary":"#FFFFFF","secondary":"#0039A6","accent":"#D52B1E","border":"#2D4A7A"}');
