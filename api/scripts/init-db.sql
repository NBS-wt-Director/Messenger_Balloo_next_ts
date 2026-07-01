-- =====================================================
-- Balloo Production Database Schema
-- PostgreSQL 15+
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    display_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200),
    avatar TEXT,
    public_key TEXT,
    provider VARCHAR(20) DEFAULT 'email',
    yandex_id TEXT,
    yandex_token TEXT,
    yandex_refresh_token TEXT,
    settings TEXT DEFAULT '{}',
    family_relations TEXT DEFAULT '[]',
    push_tokens TEXT DEFAULT '[]',
    is_admin BOOLEAN DEFAULT FALSE,
    is_super_admin BOOLEAN DEFAULT FALSE,
    admin_roles TEXT DEFAULT '[]',
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret TEXT,
    temp_2fa_secret TEXT,
    sms_2fa_enabled BOOLEAN DEFAULT FALSE,
    sms_2fa_enabled_at BIGINT,
    phone VARCHAR(20),
    birth_date DATE,
    status VARCHAR(50) DEFAULT 'offline',
    last_seen BIGINT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_yandex_id ON users(yandex_id);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =============================================
-- SESSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    platform VARCHAR(20),
    device_id TEXT,
    device_name TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    push_token TEXT,
    last_active BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- =============================================
-- AUTH METHODS (2FA)
-- =============================================
CREATE TABLE IF NOT EXISTS auth_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    failures INTEGER DEFAULT 0,
    last_failure BIGINT,
    disabled_at BIGINT,
    disable_reason TEXT,
    updated_at BIGINT NOT NULL
);

-- =============================================
-- VERIFICATION CODES
-- =============================================
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'password_reset',
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_type ON verification_codes(email, type);

-- =============================================
-- CHATS
-- =============================================
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    name VARCHAR(200),
    avatar TEXT,
    participants TEXT NOT NULL,
    members TEXT DEFAULT '{}',
    admin_ids TEXT DEFAULT '[]',
    created_by UUID NOT NULL REFERENCES users(id),
    description TEXT,
    is_favorite TEXT DEFAULT '{}',
    pinned TEXT DEFAULT '{}',
    muted TEXT DEFAULT '{}',
    unread_count TEXT DEFAULT '{}',
    last_message TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chats_type ON chats(type);
CREATE INDEX IF NOT EXISTS idx_chats_created_by ON chats(created_by);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,
    encrypted_info TEXT,
    attachment_id UUID,
    reply_to_id UUID,
    forward_from_id UUID,
    reactions TEXT DEFAULT '{}',
    read_by TEXT DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'sent',
    edited BOOLEAN DEFAULT FALSE,
    edited_at BIGINT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- =============================================
-- ATTACHMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES users(id),
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    yandex_disk_path TEXT,
    yandex_disk_id TEXT,
    public_url TEXT,
    thumbnail_url TEXT,
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    status VARCHAR(20) DEFAULT 'uploading',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_attachments_chat_id ON attachments(chat_id);
CREATE INDEX IF NOT EXISTS idx_attachments_uploader_id ON attachments(uploader_id);
CREATE INDEX IF NOT EXISTS idx_attachments_status ON attachments(status);

-- =============================================
-- INVITATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at BIGINT,
    is_permanent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(code);
CREATE INDEX IF NOT EXISTS idx_invitations_chat_id ON invitations(chat_id);

-- =============================================
-- CONTACTS
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    is_favorite BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    UNIQUE(user_id, contact_user_id)
);

CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_user_id ON contacts(contact_user_id);

-- =============================================
-- CONTACT REQUESTS
-- =============================================
CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at BIGINT NOT NULL,
    processed_at BIGINT,
    UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_to_user ON contact_requests(to_user_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data TEXT DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    read_at BIGINT,
    created_at BIGINT NOT NULL,
    expires_at BIGINT
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- =============================================
-- DEVICES
-- =============================================
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20),
    device_id TEXT,
    device_name TEXT,
    push_token TEXT,
    last_active BIGINT NOT NULL,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);

-- =============================================
-- REPORTS
-- =============================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(20) NOT NULL,
    target_id UUID NOT NULL,
    reported_by UUID NOT NULL REFERENCES users(id),
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at BIGINT,
    resolution TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);

-- =============================================
-- VERSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(20) NOT NULL,
    version VARCHAR(50) NOT NULL,
    min_version VARCHAR(50),
    update_url TEXT,
    release_notes TEXT,
    is_force_update BOOLEAN DEFAULT FALSE,
    created_at BIGINT NOT NULL,
    UNIQUE(platform, version)
);

-- =============================================
-- CALLS
-- =============================================
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    chat_id UUID REFERENCES chats(id),
    type VARCHAR(20) NOT NULL,
    offer TEXT,
    answer TEXT,
    status VARCHAR(20) DEFAULT 'offered',
    recording BOOLEAN DEFAULT FALSE,
    recording_id UUID,
    recording_path TEXT,
    recording_url TEXT,
    duration INTEGER DEFAULT 0,
    created_at BIGINT NOT NULL,
    ended_at BIGINT,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calls_from_user ON calls(from_user_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_chat_id ON calls(chat_id);

-- =============================================
-- CALL RECORDINGS
-- =============================================
CREATE TABLE IF NOT EXISTS call_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    url TEXT,
    duration BIGINT,
    file_size BIGINT,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_call_recordings_call_id ON call_recordings(call_id);

-- =============================================
-- CALL PARTICIPANTS
-- =============================================
CREATE TABLE IF NOT EXISTS call_participants (
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at BIGINT NOT NULL,
    left_at BIGINT,
    PRIMARY KEY (call_id, user_id)
);

-- =============================================
-- STATUS (STORIES)
-- =============================================
CREATE TABLE IF NOT EXISTS statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    attachment_id UUID NOT NULL REFERENCES attachments(id),
    views TEXT DEFAULT '[]',
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_statuses_user_id ON statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_statuses_expires ON statuses(expires_at);

-- =============================================
-- AUDIO MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS audio_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES users(id),
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    duration INTEGER DEFAULT 0,
    yandex_disk_id TEXT,
    public_url TEXT,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audio_messages_chat_id ON audio_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_audio_messages_message_id ON audio_messages(message_id);

-- =============================================
-- E2E KEYS
-- =============================================
CREATE TABLE IF NOT EXISTS e2e_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    public_key TEXT NOT NULL,
    encrypted_private_key TEXT,
    created_at BIGINT NOT NULL,
    expires_at BIGINT,
    UNIQUE(user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_e2e_keys_user_id ON e2e_keys(user_id);

-- =============================================
-- SUPPORT TICKETS
-- =============================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'medium',
    user_id UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    resolution TEXT,
    created_at BIGINT NOT NULL,
    processed_at BIGINT,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);

-- =============================================
-- SUPPORT MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);

-- =============================================
-- PAGES
-- =============================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sections TEXT,
    metadata TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(is_active);

-- =============================================
-- FEATURES (VOTING)
-- =============================================
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    votes INTEGER DEFAULT 0,
    voted_by TEXT DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    created_by_name VARCHAR(100),
    admin_note TEXT,
    planned_at BIGINT,
    completed_at BIGINT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_votes ON features(votes DESC);

-- =============================================
-- BANS
-- =============================================
CREATE TABLE IF NOT EXISTS bans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    banned_by UUID REFERENCES users(id),
    expires_at BIGINT,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bans_user_id ON bans(user_id);
CREATE INDEX IF NOT EXISTS idx_bans_expires ON bans(expires_at);
CREATE INDEX IF NOT EXISTS idx_bans_active ON bans(expires_at) WHERE expires_at IS NULL OR expires_at > EXTRACT(EPOCH FROM NOW()) * 1000;

-- =============================================
-- YANDEX TOKENS
-- =============================================
CREATE TABLE IF NOT EXISTS yandex_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_yandex_tokens_user_id ON yandex_tokens(user_id);

-- =============================================
-- PUSH SUBSCRIPTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- =============================================
-- GROUPS
-- =============================================
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    avatar TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    settings TEXT DEFAULT '{}',
    permissions TEXT DEFAULT '{}',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON groups(owner_id);

-- =============================================
-- GROUP MEMBERS
-- =============================================
CREATE TABLE IF NOT EXISTS group_members (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at BIGINT NOT NULL,
    PRIMARY KEY (group_id, user_id)
);

-- =============================================
-- INIT AUTH METHODS
-- =============================================
INSERT INTO auth_methods (id, name, enabled, failures, updated_at)
VALUES 
    (uuid_generate_v4(), 'sms', TRUE, 0, EXTRACT(EPOCH FROM NOW()) * 1000),
    (uuid_generate_v4(), 'bot', TRUE, 0, EXTRACT(EPOCH FROM NOW()) * 1000),
    (uuid_generate_v4(), 'totp', TRUE, 0, EXTRACT(EPOCH FROM NOW()) * 1000)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- INIT DEFAULT VERSIONS
-- =============================================
INSERT INTO versions (platform, version, min_version, is_force_update, created_at)
VALUES 
    ('windows', '1.0.0', '0.1.0', FALSE, EXTRACT(EPOCH FROM NOW()) * 1000),
    ('macos', '1.0.0', '0.1.0', FALSE, EXTRACT(EPOCH FROM NOW()) * 1000),
    ('linux', '1.0.0', '0.1.0', FALSE, EXTRACT(EPOCH FROM NOW()) * 1000),
    ('android', '1.0.0', '0.1.0', FALSE, EXTRACT(EPOCH FROM NOW()) * 1000),
    ('ios', '1.0.0', '0.1.0', FALSE, EXTRACT(EPOCH FROM NOW()) * 1000),
    ('web', '1.0.0', '0.1.0', FALSE, EXTRACT(EPOCH FROM NOW()) * 1000)
ON CONFLICT (platform, version) DO NOTHING;
