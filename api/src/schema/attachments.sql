-- Schema for message attachments (polls, quizzes, surveys, lists)
-- Created: 2026-06-07

-- Голосования
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  settings JSON NOT NULL,
  total_votes INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_polls_chat ON polls(chat_id);
CREATE INDEX IF NOT EXISTS idx_polls_message ON polls(message_id);

-- Ответы на голосования
CREATE TABLE IF NOT EXISTS poll_responses (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  option_ids JSON,
  text_response TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(poll_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_poll_responses_poll ON poll_responses(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_responses_user ON poll_responses(user_id);

-- Списки
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  items JSON NOT NULL,
  settings JSON NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lists_chat ON lists(chat_id);

-- Совместное выполнение списков
CREATE TABLE IF NOT EXISTS list_items_completion (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  completed_at INTEGER NOT NULL,
  UNIQUE(list_id, item_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_list_completion_list ON list_items_completion(list_id);

-- Опросы
CREATE TABLE IF NOT EXISTS surveys (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSON NOT NULL,
  settings JSON NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_surveys_chat ON surveys(chat_id);

-- Ответы на опросы
CREATE TABLE IF NOT EXISTS survey_submissions (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  answers JSON NOT NULL,
  duration INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE(survey_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_survey_submissions_survey ON survey_submissions(survey_id);

-- Тесты
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSON NOT NULL,
  settings JSON NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quizzes_chat ON quizzes(chat_id);

-- Результаты тестов
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  answers JSON NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  duration INTEGER,
  attempt_number INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(quiz_id, user_id, attempt_number)
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
