-- Schema for user themes and subscriptions
-- Created: 2026-06-07

-- Таблица пользовательских тем
CREATE TABLE IF NOT EXISTS user_themes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors JSON NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Таблица подписок на темы
CREATE TABLE IF NOT EXISTS theme_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activated_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  days_count INTEGER NOT NULL,
  cost INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Таблица истории использованных тем
CREATE TABLE IF NOT EXISTS theme_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  used_at INTEGER NOT NULL
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_user_themes_user ON user_themes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_themes_favorite ON user_themes(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_theme_subscriptions_user ON theme_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_theme_subscriptions_status ON theme_subscriptions(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_theme_history_user ON theme_history(user_id, used_at);
