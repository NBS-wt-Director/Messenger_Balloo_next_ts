#!/usr/bin/env node
/**
 * Migration Script: SQLite → PostgreSQL
 * Перенос данных из SQLite (in-memory) в PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const { Client } = require('pg');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // SQLite (текущая БД)
  sqlitePath: process.env.SQLITE_PATH || './data/database.sqlite',
  
  // PostgreSQL (новая БД)
  postgresUrl: process.env.DATABASE_URL || 'postgresql://balloo:password@localhost:5432/balloo_production',
  
  // Таблицы для миграции
  tables: [
    'users', 'sessions', 'auth_methods', 'verification_codes',
    'chats', 'chat_participants', 'messages', 'message_reactions',
    'contacts', 'groups', 'group_members', 'invitations',
    'notifications', 'bans', 'reports', 'files', 'calls',
    'call_participants', 'call_recordings', 'user_settings',
    'device_tokens', 'web_push_subscriptions'
  ]
};

// ============================================
// POSTGRESQL SCHEMA
// ============================================

const SCHEMA = `
-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  display_name VARCHAR(100),
  avatar_url TEXT,
  twoFAEnabled BOOLEAN DEFAULT FALSE,
  sms2FAEnabled BOOLEAN DEFAULT FALSE,
  twoFASecret VARCHAR(255),
  status VARCHAR(50) DEFAULT 'offline',
  lastSeen BIGINT,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  refreshToken VARCHAR(500) NOT NULL,
  userAgent TEXT,
  ipAddress VARCHAR(45),
  deviceInfo TEXT,
  expiresAt BIGINT NOT NULL,
  createdAt BIGINT NOT NULL
);

-- Auth Methods (2FA)
CREATE TABLE IF NOT EXISTS auth_methods (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  recentFailures INTEGER DEFAULT 0,
  lastFailure BIGINT,
  disabled BOOLEAN DEFAULT FALSE,
  disabledAt BIGINT,
  disableReason TEXT
);

-- Verification Codes
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  expires_at BIGINT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  usedAt BIGINT,
  createdAt BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);

-- Chats
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  type VARCHAR(50) NOT NULL,
  avatarUrl TEXT,
  createdBy UUID REFERENCES users(id),
  participants TEXT NOT NULL,
  lastMessage TEXT,
  updatedAt BIGINT NOT NULL,
  createdAt BIGINT NOT NULL
);

-- Chat Participants
CREATE TABLE IF NOT EXISTS chat_participants (
  chatId UUID REFERENCES chats(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joinedAt BIGINT NOT NULL,
  lastReadAt BIGINT,
  PRIMARY KEY (chatId, userId)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY,
  chatId UUID REFERENCES chats(id) ON DELETE CASCADE,
  senderId UUID REFERENCES users(id),
  type VARCHAR(50) DEFAULT 'text',
  content TEXT,
  encryptedInfo TEXT,
  attachmentId UUID,
  replyToId UUID,
  reactions TEXT DEFAULT '{}',
  readBy TEXT DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'sent',
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_chatId ON messages(chatId);
CREATE INDEX IF NOT EXISTS idx_messages_senderId ON messages(senderId);
CREATE INDEX IF NOT EXISTS idx_messages_createdAt ON messages(createdAt);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  contactUserId UUID REFERENCES users(id) ON DELETE CASCADE,
  alias VARCHAR(100),
  isBlocked BOOLEAN DEFAULT FALSE,
  createdAt BIGINT NOT NULL,
  UNIQUE(userId, contactUserId)
);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  avatarUrl TEXT,
  ownerId UUID REFERENCES users(id),
  settings TEXT DEFAULT '{}',
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL
);

-- Group Members
CREATE TABLE IF NOT EXISTS group_members (
  groupId UUID REFERENCES groups(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joinedAt BIGINT NOT NULL,
  PRIMARY KEY (groupId, userId)
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY,
  chatId UUID REFERENCES chats(id) ON DELETE CASCADE,
  inviterId UUID REFERENCES users(id),
  recipientEmail VARCHAR(255),
  recipientUserId UUID REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expiresAt BIGINT NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  acceptedAt BIGINT,
  createdAt BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200),
  body TEXT,
  data TEXT DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  readAt BIGINT,
  expiresAt BIGINT,
  createdAt BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(userId, read);

-- Bans
CREATE TABLE IF NOT EXISTS bans (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  expiredAt BIGINT,
  createdAt BIGINT NOT NULL
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY,
  reporterId UUID REFERENCES users(id),
  reportedUserId UUID REFERENCES users(id),
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  resolvedAt BIGINT,
  resolvedBy UUID REFERENCES users(id),
  createdAt BIGINT NOT NULL
);

-- Files
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  fileName VARCHAR(255) NOT NULL,
  storageId VARCHAR(255) NOT NULL,
  storageType VARCHAR(50) DEFAULT 'yandex',
  size BIGINT,
  mimeType VARCHAR(100),
  metadata TEXT DEFAULT '{}',
  createdAt BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_files_userId ON files(userId);

-- Calls
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY,
  fromUserId UUID REFERENCES users(id),
  toUserId UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  offer TEXT,
  answer TEXT,
  status VARCHAR(50) DEFAULT 'offered',
  recording BOOLEAN DEFAULT FALSE,
  recordingId UUID,
  recordingPath TEXT,
  recordingUrl TEXT,
  endedAt BIGINT,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL
);

-- Call Participants
CREATE TABLE IF NOT EXISTS call_participants (
  callId UUID REFERENCES calls(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  joinedAt BIGINT NOT NULL,
  leftAt BIGINT,
  PRIMARY KEY (callId, userId)
);

-- Call Recordings
CREATE TABLE IF NOT EXISTS call_recordings (
  id UUID PRIMARY KEY,
  callId UUID REFERENCES calls(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  url TEXT,
  duration BIGINT,
  size BIGINT,
  createdAt BIGINT NOT NULL
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  userId UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'ru',
  notificationsEnabled BOOLEAN DEFAULT TRUE,
  soundEnabled BOOLEAN DEFAULT TRUE,
  vibrateEnabled BOOLEAN DEFAULT TRUE,
  showLastSeen BOOLEAN DEFAULT TRUE,
  privacySettings TEXT DEFAULT '{}',
  updatedAt BIGINT NOT NULL
);

-- Device Tokens
CREATE TABLE IF NOT EXISTS device_tokens (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  deviceType VARCHAR(50),
  platform VARCHAR(50),
  lastActive BIGINT NOT NULL,
  createdAt BIGINT NOT NULL,
  UNIQUE(userId, token)
);

-- Web Push Subscriptions
CREATE TABLE IF NOT EXISTS web_push_subscriptions (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint VARCHAR(500) NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  createdAt BIGINT NOT NULL,
  UNIQUE(userId, endpoint)
);
`;

// ============================================
// MIGRATION FUNCTIONS
// ============================================

async function createPostgresSchema(client) {
  console.log('📝 Creating PostgreSQL schema...');
  await client.query(SCHEMA);
  console.log('✅ Schema created');
}

async function migrateTable(client, sqliteDb, tableName) {
  console.log(`🔄 Migrating ${tableName}...`);
  
  try {
    // Получить данные из SQLite
    const rows = sqliteDb.exec(`SELECT * FROM ${tableName}`);
    
    if (rows.length === 0 || !rows[0].values || rows[0].values.length === 0) {
      console.log(`  ⚠️  No data in ${tableName} or table doesn't exist`);
      return 0;
    }
    
    const columns = rows[0].columns;
    const values = rows[0].values;
    
    console.log(`  📊 ${values.length} rows to migrate`);
    
    // Вставить в PostgreSQL
    let inserted = 0;
    for (const row of values) {
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
      
      try {
        await client.query(query, row.flat());
        inserted++;
      } catch (err) {
        // Игнорируем конфликты (дубликаты)
        if (!err.code || err.code !== '23505') {
          console.error(`  ❌ Error inserting row:`, err.message);
        }
      }
    }
    
    console.log(`  ✅ Migrated ${inserted}/${values.length} rows`);
    return inserted;
  } catch (error) {
    console.error(`  ❌ Error migrating ${tableName}:`, error.message);
    return 0;
  }
}

async function runMigration() {
  console.log('🚀 Starting migration: SQLite → PostgreSQL\n');
  
  // 1. Подключение к PostgreSQL
  const client = new Client({ connectionString: CONFIG.postgresUrl });
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    console.log('\n💡 Инструкция:');
    console.log('   1. Убедитесь, что PostgreSQL запущен:');
    console.log('      docker-compose up -d postgres');
    console.log('   2. Установите DATABASE_URL в .env:');
    console.log('      DATABASE_URL=postgresql://balloo:password@localhost:5432/balloo_production');
    process.exit(1);
  }
  
  // 2. Проверка SQLite файла
  const sqlitePath = path.resolve(CONFIG.sqlitePath);
  if (!fs.existsSync(sqlitePath)) {
    console.log(`⚠️  SQLite file not found: ${sqlitePath}`);
    console.log('   Создадим пустую базу данных...');
  } else {
    console.log(`✅ Found SQLite file: ${sqlitePath}`);
  }
  
  // 3. Инициализация PostgreSQL схемы
  await createPostgresSchema(client);
  
  // 4. Миграция данных (если есть SQLite)
  if (fs.existsSync(sqlitePath)) {
    const initSqlJs = require('sql.js');
    const sql = await initSqlJs();
    const dbBuffer = fs.readFileSync(sqlitePath);
    const db = new sql.Database(dbBuffer);
    
    console.log('\n📦 Migrating data...\n');
    
    for (const tableName of CONFIG.tables) {
      await migrateTable(client, db, tableName);
    }
    
    db.close();
  }
  
  // 5. Заполнение auth_methods если пусто
  console.log('\n🔧 Initializing auth methods...');
  const authMethods = ['sms', 'bot', 'totp'];
  for (const method of authMethods) {
    await client.query(`
      INSERT INTO auth_methods (id, name, enabled)
      VALUES (gen_random_uuid(), $1, TRUE)
      ON CONFLICT (name) DO NOTHING
    `, [method]);
  }
  console.log('✅ Auth methods initialized');
  
  // 6. Завершение
  await client.end();
  console.log('\n✅ Migration completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Обновите DATABASE_URL в .env');
  console.log('   2. Перезапустите API: docker-compose restart api');
  console.log('   3. Проверьте: curl http://localhost:3001/health');
}

// ============================================
// CLI
// ============================================

if (require.main === module) {
  runMigration().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { runMigration, CONFIG };
