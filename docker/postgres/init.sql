-- Balloo Platform - PostgreSQL Initialization Script
-- Database schema for Phase 1-2
-- Author: NBS-wt
-- Version: 1.0.0

-- ==================== EXTENSIONS ====================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== ENUMS ====================

-- User roles
CREATE TYPE user_role AS ENUM (
  'creator-superadmin',      -- L10: Full system access
  'delegated-node-admin',    -- L8: Node administration
  'company-staff',           -- L6: Company features
  'sandbox-operator'         -- L3: Sandbox testing
);

-- Node groups
CREATE TYPE node_group AS ENUM (
  'A',  -- Privileged (kodegen, nodes-switcher)
  'B',  -- Company (admin, workdocs)
  'D',  -- Sandbox (working, api)
  'E'   -- Production (balloo.su, messenger)
);

-- Node status
CREATE TYPE node_status AS ENUM (
  'online',
  'offline',
  'degraded'
);

-- Message types
CREATE TYPE message_type AS ENUM (
  'text',
  'file',
  'image',
  'voice',
  'video'
);

-- Message status
CREATE TYPE message_status AS ENUM (
  'sent',
  'delivered',
  'read'
);

-- Auth provider types
CREATE TYPE auth_provider_type AS ENUM (
  'yandex-id',
  'email-password',
  'phone-3char-code'
);

-- File types
CREATE TYPE file_type AS ENUM (
  'file',
  'image',
  'audio',
  'video'
);

-- Audit log actions
CREATE TYPE audit_action AS ENUM (
  'user:login',
  'user:logout',
  'user:register',
  'user:update',
  'user:role_change',
  'message:send',
  'message:delete',
  'file:upload',
  'file:download',
  'file:delete',
  'node:access',
  'system:error'
);

-- ==================== TABLES ====================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'sandbox-operator',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  creator_id UUID REFERENCES users(id),
  
  CONSTRAINT users_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Auth providers
CREATE TABLE IF NOT EXISTS auth_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_type auth_provider_type NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, provider_type),
  UNIQUE(provider_type, provider_id)
);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address INET
);

-- SMS verification codes
CREATE TABLE IF NOT EXISTS sms_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(3) NOT NULL,
  request_id UUID NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  is_expired BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Nodes
CREATE TABLE IF NOT EXISTS nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id VARCHAR(100) NOT NULL UNIQUE,
  hostname VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  node_group node_group NOT NULL,
  status node_status NOT NULL DEFAULT 'offline',
  url TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_heartbeat TIMESTAMP WITH TIME ZONE
);

-- Chats
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  type VARCHAR(20) NOT NULL DEFAULT 'private',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat participants
CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE,
  last_read_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(chat_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  type message_type NOT NULL DEFAULT 'text',
  content TEXT,
  status message_status NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP WITH TIME ZONE
);

-- Message attachments (Yandex Disk)
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_type file_type NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size_bytes BIGINT NOT NULL,
  yandex_disk_path TEXT NOT NULL,
  yandex_disk_id VARCHAR(255),
  download_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Message reads
CREATE TABLE IF NOT EXISTS message_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(message_id, user_id)
);

-- Files (Yandex Disk integration)
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_type file_type NOT NULL,
  mime_type VARCHAR(100),
  size_bytes BIGINT NOT NULL,
  yandex_disk_path TEXT NOT NULL,
  yandex_disk_id VARCHAR(255),
  download_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action audit_action NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System metrics (for monitoring)
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id VARCHAR(100) NOT NULL,
  cpu_usage NUMERIC(5,2),
  memory_usage BIGINT,
  active_connections INTEGER,
  requests_per_second NUMERIC(10,2),
  error_rate NUMERIC(5,2),
  disk_usage BIGINT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES ====================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Auth providers
CREATE INDEX IF NOT EXISTS idx_auth_providers_user_id ON auth_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_providers_provider ON auth_providers(provider_type, provider_id);

-- Refresh tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- SMS codes
CREATE INDEX IF NOT EXISTS idx_sms_codes_phone ON sms_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sms_codes_request ON sms_codes(request_id);
CREATE INDEX IF NOT EXISTS idx_sms_codes_expires ON sms_codes(expires_at);

-- Nodes
CREATE INDEX IF NOT EXISTS idx_nodes_group ON nodes(node_group);
CREATE INDEX IF NOT EXISTS idx_nodes_status ON nodes(status);

-- Chats
CREATE INDEX IF NOT EXISTS idx_chats_created_by ON chats(created_by);
CREATE INDEX IF NOT EXISTS idx_chats_type ON chats(type);

-- Chat participants
CREATE INDEX IF NOT EXISTS idx_chat_participants_chat ON chat_participants(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);

-- Message attachments
CREATE INDEX IF NOT EXISTS idx_attachments_message ON message_attachments(message_id);

-- Message reads
CREATE INDEX IF NOT EXISTS idx_message_reads_message ON message_reads(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_user ON message_reads(user_id);

-- Files
CREATE INDEX IF NOT EXISTS idx_files_user ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_files_created ON files(created_at);

-- Audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- System metrics
CREATE INDEX IF NOT EXISTS idx_metrics_node ON system_metrics(node_id);
CREATE INDEX IF NOT EXISTS idx_metrics_recorded ON system_metrics(recorded_at);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_users_display_name_trgm ON users USING gin(display_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_messages_content_trgm ON messages USING gin(content gin_trgm_ops);

-- ==================== INITIAL DATA ====================

-- Insert default nodes (Phase 1-2)
INSERT INTO nodes (node_id, hostname, name, description, node_group, status) VALUES
  ('balloo.su', 'balloo.su', 'Balloo Main', 'Главный лендинг', 'E', 'online'),
  ('messenger.balloo.su', 'messenger.balloo.su', 'Messenger', 'Мессенджер', 'E', 'online'),
  ('working.balloo.su', 'working.balloo.su', 'Working', 'Песочница', 'D', 'online'),
  ('admin.balloo.su', 'admin.balloo.su', 'Admin', 'Админ-панель', 'B', 'online'),
  ('kodegen.working.balloo.su', 'kodegen.working.balloo.su', 'Kodegen', 'AI Codegen', 'A', 'online'),
  ('workdocs.working.balloo.su', 'workdocs.working.balloo.su', 'Workdocs', 'Документация', 'B', 'online'),
  ('nodes-switcher.working.balloo.su', 'nodes-switcher.working.balloo.su', 'Nodes Switcher', 'Переключение узлов', 'A', 'online'),
  ('api.working.balloo.su', 'api.working.balloo.su', 'API', 'API Gateway', 'D', 'online')
ON CONFLICT (node_id) DO NOTHING;

-- ==================== FUNCTIONS ====================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nodes_updated_at
  BEFORE UPDATE ON nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==================== COMMENTS ====================

COMMENT ON TABLE users IS 'Пользователи платформы Balloo';
COMMENT ON TABLE auth_providers IS 'Провайдеры аутентификации (Yandex, email, phone)';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens';
COMMENT ON TABLE sms_codes IS 'SMS OTP коды для phone-3char-code auth';
COMMENT ON TABLE nodes IS 'Узлы платформы (8 nodes для Phase 1-2)';
COMMENT ON TABLE chats IS 'Чаты мессенджера';
COMMENT ON TABLE messages IS 'Сообщения чатов';
COMMENT ON TABLE message_attachments IS 'Вложения сообщений (Yandex Disk)';
COMMENT ON TABLE files IS 'Файлы пользователей (Yandex Disk)';
COMMENT ON TABLE audit_logs IS 'Аудит лог действий пользователей';
COMMENT ON TABLE system_metrics IS 'Системные метрики для мониторинга';

-- ==================== GRANTS ====================

-- Grant permissions to balloo user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO balloo;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO balloo;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO balloo;
