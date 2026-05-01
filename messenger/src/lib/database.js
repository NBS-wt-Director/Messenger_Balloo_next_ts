const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Создаем папку data если не существует
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

// Включаем WAL режим для лучшей производительности
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// Инициализация таблиц
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    displayName TEXT NOT NULL,
    passwordHash TEXT,
    authProvider TEXT,
    fullName TEXT,
    phone TEXT,
    bio TEXT,
    avatar TEXT,
    avatarHistory TEXT DEFAULT '[]',
    emailVerified INTEGER DEFAULT 0,
    adminRoles TEXT DEFAULT '[]',
    online INTEGER DEFAULT 0,
    isOnline INTEGER DEFAULT 0,
    status TEXT DEFAULT 'offline',
    settings TEXT DEFAULT '{}',
    points INTEGER DEFAULT -55,
    userNumber INTEGER,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Chat (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    type TEXT DEFAULT 'private',
    createdBy TEXT,
    isSystemChat INTEGER DEFAULT 0,
    avatar TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ChatMember (
    chatId TEXT NOT NULL,
    userId TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    joinedAt TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (chatId, userId)
  );

  CREATE TABLE IF NOT EXISTS Message (
    id TEXT PRIMARY KEY,
    chatId TEXT NOT NULL,
    userId TEXT NOT NULL,
    text TEXT,
    replyToId TEXT,
    forwardedFromId TEXT,
    attachmentId TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (chatId) REFERENCES Chat(id),
    FOREIGN KEY (userId) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS MessageReaction (
    messageId TEXT NOT NULL,
    userId TEXT NOT NULL,
    emoji TEXT NOT NULL,
    PRIMARY KEY (messageId, userId)
  );

  CREATE TABLE IF NOT EXISTS ChatFavorite (
    userId TEXT NOT NULL,
    chatId TEXT NOT NULL,
    pinnedAt TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (userId, chatId)
  );

  CREATE TABLE IF NOT EXISTS ChatPinned (
    userId TEXT NOT NULL,
    chatId TEXT NOT NULL,
    pinnedAt TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (userId, chatId)
  );

  CREATE TABLE IF NOT EXISTS Contact (
    userId TEXT NOT NULL,
    contactId TEXT NOT NULL,
    nickname TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (userId, contactId)
  );

  CREATE TABLE IF NOT EXISTS Invitation (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    fromUserId TEXT NOT NULL,
    toEmail TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now')),
    acceptedAt TEXT,
    FOREIGN KEY (fromUserId) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS InvitationUse (
    invitationId TEXT NOT NULL,
    userId TEXT NOT NULL,
    usedAt TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (invitationId, userId)
  );

  CREATE TABLE IF NOT EXISTS Notification (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data TEXT DEFAULT '{}',
    read INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS Report (
    id TEXT PRIMARY KEY,
    reporterId TEXT NOT NULL,
    reportedUserId TEXT,
    reportedChatId TEXT,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (reporterId) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS Feature (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    enabled INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS FeatureVote (
    featureId TEXT NOT NULL,
    userId TEXT NOT NULL,
    votedAt TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (featureId, userId)
  );

  CREATE TABLE IF NOT EXISTS Page (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS FamilyRelation (
    userId1 TEXT NOT NULL,
    userId2 TEXT NOT NULL,
    relationType TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (userId1, userId2)
  );

  CREATE TABLE IF NOT EXISTS _prisma_migrations (
    id TEXT PRIMARY KEY,
    checksum TEXT NOT NULL,
    finished_at TEXT,
    migration_name TEXT NOT NULL UNIQUE,
    logs TEXT,
    rolled_back_at TEXT,
    started_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS VerificationCode (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    code TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    expiresAt TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    usedAt TEXT,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  );
`);

// Индексы для оптимизации
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);
  CREATE INDEX IF NOT EXISTS idx_chat_member_user ON ChatMember(userId);
  CREATE INDEX IF NOT EXISTS idx_message_chat ON Message(chatId);
  CREATE INDEX IF NOT EXISTS idx_verification_user ON VerificationCode(userId);
  CREATE INDEX IF NOT EXISTS idx_verification_expires ON VerificationCode(expiresAt);
`);

console.log('✓ Все таблицы и индексы созданы успешно');

module.exports = db;
