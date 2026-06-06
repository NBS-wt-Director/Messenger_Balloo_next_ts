/**
 * Конфигурация базы данных
 * Используется sql.js (чистый JS SQLite, не требует компиляции)
 * База данных поднимается на том же процессе, что и API
 */

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let db = null;
let DB_PATH = null;

// Импортируем общие настройки (если доступны)
try {
  const settingsModule = require('@app-balloo/settings');
  const settings = settingsModule.getSettings('api');
  DB_PATH = settings.database.path;
} catch (error) {
  // Fallback если settings не установлены
  DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/database.sqlite');
}

const DEFAULT_DB_PATH = DB_PATH;

/**
 * Инициализация базы данных
 */
async function initDatabase() {
  DB_PATH = DEFAULT_DB_PATH;
  
  // Гарантируем существование директории
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Инициализируем sql.js
  const SQL = await initSqlJs();
  
  // Пытаемся загрузить существующую БД или создаём новую
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('Database loaded from file');
  } else {
    db = new SQL.Database();
    console.log('New database created');
  }

  // Включаем foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Создаём все таблицы
  createTables(db);
  
  // Сохраняем БД
  saveDatabase();
  
  console.log('Database initialized successfully');
}

function createTables(database) {
  // Таблица пользователей
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT,
      displayName TEXT NOT NULL,
      fullName TEXT,
      avatar TEXT,
      publicKey TEXT,
      provider TEXT DEFAULT 'email',
      yandexId TEXT,
      yandexToken TEXT,
      yandexRefreshToken TEXT,
      settings TEXT DEFAULT '{}',
      familyRelations TEXT DEFAULT '[]',
      pushTokens TEXT DEFAULT '[]',
      isAdmin INTEGER DEFAULT 0,
      isSuperAdmin INTEGER DEFAULT 0,
      adminRoles TEXT DEFAULT '[]',
      twoFAEnabled INTEGER DEFAULT 0,
      twoFASecret TEXT,
      temp2faSecret TEXT,
      sms2FAEnabled INTEGER DEFAULT 0,
      sms2FAEnabledAt INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      lastSeen INTEGER
    )
  `);

  // Таблица чатов
  database.run(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT,
      avatar TEXT,
      participants TEXT NOT NULL,
      members TEXT DEFAULT '{}',
      adminIds TEXT DEFAULT '[]',
      createdBy TEXT NOT NULL,
      description TEXT,
      isFavorite TEXT DEFAULT '{}',
      pinned TEXT DEFAULT '{}',
      muted TEXT DEFAULT '{}',
      unreadCount TEXT DEFAULT '{}',
      lastMessage TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Таблица сообщений
  database.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chatId TEXT NOT NULL,
      senderId TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      encryptedInfo TEXT,
      attachmentId TEXT,
      replyToId TEXT,
      forwardFromId TEXT,
      reactions TEXT DEFAULT '{}',
      readBy TEXT DEFAULT '[]',
      status TEXT DEFAULT 'sent',
      edited INTEGER DEFAULT 0,
      editedAt INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Таблица вложений
  database.run(`
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      messageId TEXT NOT NULL,
      chatId TEXT NOT NULL,
      uploaderId TEXT NOT NULL,
      fileName TEXT NOT NULL,
      mimeType TEXT NOT NULL,
      fileSize INTEGER NOT NULL,
      yandexDiskPath TEXT,
      yandexDiskId TEXT,
      publicUrl TEXT,
      thumbnailUrl TEXT,
      width INTEGER,
      height INTEGER,
      duration INTEGER,
      status TEXT DEFAULT 'uploading',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Таблица приглашений
  database.run(`
    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      chatId TEXT NOT NULL,
      invitedBy TEXT NOT NULL,
      maxUses INTEGER,
      usedCount INTEGER DEFAULT 0,
      expiresAt INTEGER,
      isPermanent INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt INTEGER NOT NULL
    )
  `);

  // Таблица контактов
  database.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      contactUserId TEXT NOT NULL,
      displayName TEXT,
      isFavorite INTEGER DEFAULT 0,
      isBlocked INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      UNIQUE(userId, contactUserId)
    )
  `);

  // Таблица уведомлений
  database.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      data TEXT DEFAULT '{}',
      read INTEGER DEFAULT 0,
      readAt INTEGER,
      createdAt INTEGER NOT NULL,
      expiresAt INTEGER
    )
  `);

  // Таблица сессий
  database.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      refreshToken TEXT NOT NULL,
      platform TEXT,
      deviceId TEXT,
      lastActive INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL
    )
  `);

  // Таблица устройств
  database.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      platform TEXT,
      deviceId TEXT,
      pushToken TEXT,
      deviceName TEXT,
      lastActive INTEGER NOT NULL,
      createdAt INTEGER NOT NULL
    )
  `);

  // Таблица отчётов
  database.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      targetType TEXT NOT NULL,
      targetId TEXT NOT NULL,
      reportedBy TEXT NOT NULL,
      reason TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      reviewedBy TEXT,
      reviewedAt INTEGER,
      resolution TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Таблица версий
  database.run(`
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      version TEXT NOT NULL,
      minVersion TEXT,
      updateUrl TEXT,
      releaseNotes TEXT,
      isForceUpdate INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      UNIQUE(platform, version)
    )
  `);

  // Таблица кодов подтверждения
  database.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      type TEXT DEFAULT 'password_reset',
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  // Таблица звонков
  database.run(`
    CREATE TABLE IF NOT EXISTS calls (
      id TEXT PRIMARY KEY,
      fromUserId TEXT NOT NULL,
      toUserId TEXT,
      chatId TEXT,
      type TEXT NOT NULL,
      offer TEXT,
      answer TEXT,
      status TEXT DEFAULT 'offered',
      recording INTEGER DEFAULT 0,
      recordingId TEXT,
      recordingPath TEXT,
      recordingUrl TEXT,
      duration INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      endedAt INTEGER,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Таблица статусов (сторис)
  database.run(`
    CREATE TABLE IF NOT EXISTS statuses (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      attachmentId TEXT NOT NULL,
      views TEXT DEFAULT '[]',
      createdAt INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL
    )
  `);

  // Таблица голосовых сообщений
  database.run(`
    CREATE TABLE IF NOT EXISTS audio_messages (
      id TEXT PRIMARY KEY,
      messageId TEXT NOT NULL,
      chatId TEXT NOT NULL,
      uploaderId TEXT NOT NULL,
      fileName TEXT NOT NULL,
      mimeType TEXT NOT NULL,
      fileSize INTEGER NOT NULL,
      duration INTEGER DEFAULT 0,
      yandexDiskId TEXT,
      publicUrl TEXT,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (messageId) REFERENCES messages(id),
      FOREIGN KEY (chatId) REFERENCES chats(id),
      FOREIGN KEY (uploaderId) REFERENCES users(id)
    )
  `);

  // Таблица запросов в друзья
  database.run(`
    CREATE TABLE IF NOT EXISTS contact_requests (
      id TEXT PRIMARY KEY,
      fromUserId TEXT NOT NULL,
      toUserId TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      createdAt INTEGER NOT NULL,
      processedAt INTEGER,
      FOREIGN KEY (fromUserId) REFERENCES users(id),
      FOREIGN KEY (toUserId) REFERENCES users(id),
      UNIQUE(fromUserId, toUserId)
    )
  `);

  // Таблица E2E ключей
  database.run(`
    CREATE TABLE IF NOT EXISTS e2e_keys (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      deviceId TEXT NOT NULL,
      publicKey TEXT NOT NULL,
      encryptedPrivateKey TEXT,
      createdAt INTEGER NOT NULL,
      expiresAt INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE(userId, deviceId)
    )
  `);

  // Таблица тикетов поддержки
  database.run(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'medium',
      userId TEXT NOT NULL,
      assignedTo TEXT,
      resolution TEXT,
      createdAt INTEGER NOT NULL,
      processedAt INTEGER,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (assignedTo) REFERENCES users(id)
    )
  `);

  // Таблица сообщений тикетов
  database.run(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id TEXT PRIMARY KEY,
      ticketId TEXT NOT NULL,
      senderId TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (ticketId) REFERENCES support_tickets(id),
      FOREIGN KEY (senderId) REFERENCES users(id)
    )
  `);

  // Таблица страниц (about, privacy, terms, etc.)
  database.run(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      sections TEXT,
      metadata TEXT,
      isActive INTEGER DEFAULT 1,
      createdBy TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    )
  `);

  // Таблица голосований за фичи
  database.run(`
    CREATE TABLE IF NOT EXISTS features (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT,
      status TEXT DEFAULT 'pending',
      votes INTEGER DEFAULT 0,
      votedBy TEXT DEFAULT '[]',
      createdBy TEXT,
      createdByName TEXT,
      adminNote TEXT,
      plannedAt INTEGER,
      completedAt INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    )
  `);

  // Таблица банов
  database.run(`
    CREATE TABLE IF NOT EXISTS bans (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      reason TEXT,
      bannedBy TEXT,
      expiresAt INTEGER,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (bannedBy) REFERENCES users(id)
    )
  `);

  // Таблица токенов Yandex Disk
  database.run(`
    CREATE TABLE IF NOT EXISTS yandex_tokens (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      accessToken TEXT NOT NULL,
      refreshToken TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE(userId)
    )
  `);

  // Таблица push-подписок
  database.run(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE(userId)
    )
  `);

  // Таблица методов аутентификации (статус 2FA методов)
  database.run(`
    CREATE TABLE IF NOT EXISTS auth_methods (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      enabled INTEGER DEFAULT 1,
      failures INTEGER DEFAULT 0,
      lastFailure INTEGER,
      disabledAt INTEGER,
      disableReason TEXT,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Индексы для производительности
  database.run(`CREATE INDEX IF NOT EXISTS idx_messages_chatId ON messages(chatId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_messages_senderId ON messages(senderId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(userId, read)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_contacts_userId ON contacts(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_devices_userId ON devices(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_calls_fromUser ON calls(fromUserId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_statuses_userId ON statuses(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_contact_requests_toUser ON contact_requests(toUserId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_e2e_keys_user ON e2e_keys(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages(ticketId)`);
  
  // Индексы для новых таблиц
  database.run(`CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(isActive)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_features_status ON features(status)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_features_votes ON features(votes)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_bans_user ON bans(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_bans_expires ON bans(expiresAt)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_yandex_tokens_user ON yandex_tokens(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(userId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_audio_messages_chat ON audio_messages(chatId)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_audio_messages_message ON audio_messages(messageId)`);

  // Seed auth_methods
  const methodNames = ['sms', 'bot', 'totp'];
  methodNames.forEach(name => {
    const exists = database.prepare('SELECT id FROM auth_methods WHERE name = ?').get(name);
    if (!exists) {
      database.run(`
        INSERT INTO auth_methods (id, name, enabled, failures, lastFailure, disabledAt, disableReason, updatedAt)
        VALUES (?, ?, 1, 0, NULL, NULL, NULL, ?)
      `, [require('uuid').v4(), name, Date.now()]);
    }
  });
}

/**
 * Сохранение базы данных
 */
function saveDatabase() {
  if (db && DB_PATH) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

/**
 * Выполнение запроса
 */
function prepare(sql) {
  return {
    run: function(params = []) {
      try {
        db.run(sql, params);
        saveDatabase();
        return this;
      } catch (err) {
        console.error('DB run error:', err);
        throw err;
      }
    },
    all: function(params = []) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    },
    get: function(params = []) {
      const results = this.all(params);
      return results.length > 0 ? results[0] : null;
    }
  };
}

// Обёртка для db
const dbProxy = new Proxy({}, {
  get: function(target, prop) {
    if (prop === 'prepare') return prepare;
    if (prop === 'exec') return (sql) => { db.run(sql); saveDatabase(); };
    if (prop === 'close') return () => { saveDatabase(); };
    return target[prop];
  }
});

/**
 * Закрыть базу данных
 */
function closeDatabase() {
  saveDatabase();
  console.log('Database closed and saved');
}

module.exports = {
  db: dbProxy,
  initDatabase,
  closeDatabase,
  get DB_PATH() { return DB_PATH; }
};
