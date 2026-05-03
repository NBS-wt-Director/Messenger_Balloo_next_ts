# 🗄️ Архитектура Базы Данных Balloo Messenger

**Версия:** 1.0  
**Дата:** 2026-04-30  
**Автор:** NLP-Core-Team

---

## 📊 Общая Архитектура

Проект использует **ДВЕ отдельные базы данных**:

| База данных | Тип | Расположение | Использование |
|-------------|-----|--------------|---------------|
| **SQLite (сервер)** | better-sqlite3 | `messenger/data/app.db` | API routes, серверная логика |
| **RxDB (клиент)** | IndexedDB | Браузер (IndexedDB) | Клиентский интерфейс, оффлайн-режим |

---

## 🖥️ Серверная База Данных (SQLite)

### Расположение

```bash
~/Messenger_Balloo_next_ts/messenger/data/app.db
```

### Файлы БД

```
data/
├── app.db          # Основная база данных
├── app.db-wal      # Write-Ahead Log (кэш записей)
└── app.db-shm      # Shared memory файл
```

### Инициализация при первом запуске

**Файл:** `messenger/src/lib/database.js`

```javascript
const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

// При первом запуске создаются ВСЕ таблицы:
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    displayName TEXT NOT NULL,
    ...
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  
  CREATE TABLE IF NOT EXISTS Chat (...);
  CREATE TABLE IF NOT EXISTS Message (...);
  ...
`);
```

### ⚠️ Важные замечания

1. **`CREATE TABLE IF NOT EXISTS` не добавляет новые колонки!**
   - Если вы измените схему БД, старые колонки останутся
   - Для миграций нужно писать отдельные скрипты

2. **Данные НЕ удаляются при перезапуске**
   - Файл `app.db` остаётся на сервере
   - PM2 не удаляет файлы БД при перезапуске

3. **Данные УДАЛЯЮТСЯ только если:**
   - Вручную удалён файл: `rm data/app.db`
   - Вручную удалена папка: `rm -rf data/`
   - Явно выполнен `DROP TABLE` или `DELETE FROM`

---

## 🔄 Миграции и Обновления

### Проблема

SQLite не имеет автоматических миграций как Prisma. При изменении схемы:

**❌ НЕ РАБОТАЕТ:**
```sql
-- Это НЕ сработает, если таблица уже существует!
ALTER TABLE User ADD COLUMN newColumn TEXT;
```

**✅ РАБОТАЕТ:**
```javascript
// Нужно писать скрипт миграции:
function migrate() {
  const db = getDatabase();
  
  // Проверить существует ли колонка
  const hasColumn = db.prepare("PRAGMA table_info(User)")
    .all().some(col => col.name === 'newColumn');
  
  if (!hasColumn) {
    db.prepare("ALTER TABLE User ADD COLUMN newColumn TEXT").run();
  }
}
```

### Рекомендация

Создать скрипт миграций: `messenger/scripts/migrate.js`

---

## 💾 Перенос на Другой Сервер

### Шаг 1: Создать бэкап на старом сервере

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Остановить приложение
pm2 stop messenger-alpha

# Создать бэкап
cp data/app.db data/app.db.backup.$(date +%Y%m%d_%H%M%S)

# Сжать бэкап
tar czf backup-$(date +%Y%m%d).tar.gz data/app.db
```

### Шаг 2: Переписать на новый сервер

```bash
# Скопировать на новый сервер
scp backup-20260430.tar.gz user@new-server:~/Messenger_Balloo_next_ts/messenger/

# Или через git (если код в репозитории)
git pull origin main
```

### Шаг 3: Восстановить на новом сервере

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Распаковать
tar xzf backup-20260430.tar.gz

# Переместить БД
mv app.db data/

# Проверить права
chmod 644 data/app.db

# Запустить
pm2 start messenger-alpha
```

---

## ⚙️ Хранение Настроек

### 1. Переменные Окружения (`.env`)

**Где:** `messenger/.env.local` или `.env.production`

**Что хранится:**
```env
# Секреты
JWT_SECRET=your-32-character-secret-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# SMTP
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=balloo.Messenger@yandex.ru
SMTP_PASS=your-password

# База данных
DATABASE_URL=file:./data/app.db

# Настройки проекта
MAX_PINNED_CHATS=15
MAX_PUSH_TOKENS=5
```

**⚠️ Никогда не коммитьте `.env` в git!**

### 2. Настройки Пользователей (SQLite)

**Таблица:** `User`

**Поле:** `settings` (TEXT, JSON)

```json
{
  "theme": "dark",
  "language": "ru",
  "notifications": true,
  "avatar": "https://..."
}
```

**API:** `PUT /api/profile` - обновление настроек пользователя

### 3. Глобальные Настройки (SQLite)

**Таблица:** `Settings` (если нужна)

```sql
CREATE TABLE IF NOT EXISTS Settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updatedAt TEXT
);
```

**Примеры:**
- `maintenance_mode` - режим обслуживания
- `max_message_length` - максимальная длина сообщения
- `allowed_registrations` - разрешена ли регистрация

---

## 🔐 Безопасность

### 1. Права Доступа

```bash
# Папка data/
chmod 755 ~/Messenger_Balloo_next_ts/messenger/data

# Файл БД
chmod 644 ~/Messenger_Balloo_next_ts/messenger/data/app.db

# Владельц
chown balloo:balloo ~/Messenger_Balloo_next_ts/messenger/data/app.db
```

### 2. Резервное Копирование

```bash
# Ежедневный бэкап (cron)
0 2 * * * cd ~/Messenger_Balloo_next_ts/messenger && \
  cp data/app.db data/app.db.$(date +\%Y\%m\%d) && \
  find data -name "app.db.*" -mtime +7 -delete
```

### 3. Восстановление

```bash
# Остановить приложение
pm2 stop messenger-alpha

# Восстановить из бэкапа
cp data/app.db.20260430 data/app.db

# Проверить целостность
sqlite3 data/app.db "PRAGMA integrity_check;"

# Запустить
pm2 start messenger-alpha
```

---

## 📊 Таблицы Базы Данных

### User

| Поле | Тип | Описание |
|------|-----|----------|
| id | TEXT | Primary key |
| email | TEXT | Уникальный email |
| displayName | TEXT | Отображаемое имя |
| passwordHash | TEXT | Хешированный пароль |
| avatar | TEXT | URL аватара |
| adminRoles | TEXT | JSON массив ролей |
| settings | TEXT | JSON настройки |
| createdAt | TEXT | Дата создания |
| updatedAt | TEXT | Дата обновления |

### Chat

| Поле | Тип | Описание |
|------|-----|----------|
| id | TEXT | Primary key |
| type | TEXT | private/group/channel |
| name | TEXT | Название чата |
| createdBy | TEXT | ID создателя |
| isSystemChat | INTEGER | Системный чат |
| createdAt | TEXT | Дата создания |

### Message

| Поле | Тип | Описание |
|------|-----|----------|
| id | TEXT | Primary key |
| chatId | TEXT | Foreign key к Chat |
| userId | TEXT | Foreign key к User |
| text | TEXT | Текст сообщения |
| attachmentId | TEXT | Foreign key к Attachment |
| createdAt | TEXT | Дата создания |

(Полный список таблиц в `messenger/src/lib/database.js`)

---

## 🚀 Деплой и Обновления

### При первом запуске

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# 1. Создать папку data/
mkdir -p data

# 2. Установить зависимости
npm install --production

# 3. Создать .env.production
cat > .env.production << EOF
NODE_ENV=production
JWT_SECRET=$(openssl rand -hex 32)
DATABASE_URL=file:./data/app.db
EOF

# 4. Создать БД (автоматически при первом запросе к API)
# Или вручную:
node -e "require('./src/lib/database.js')"

# 5. Создать админа
npm run create-admin

# 6. Собрать приложение
NODE_ENV=production npx next build

# 7. Запустить
pm2 start "npx next start -p 3000" --name messenger-alpha
```

### При обновлении кода

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# 1. Обновить код
git pull origin main

# 2. Установить новые зависимости
npm install --production

# 3. Остановить приложение
pm2 stop messenger-alpha

# 4. Собрать
rm -rf .next
NODE_ENV=production npx next build

# 5. Запустить
pm2 start messenger-alpha

# 6. Проверить
pm2 logs messenger-alpha --lines 20
```

### ⚠️ Важно!

- **Не удаляйте папку `data/`** - все данные будут потеряны
- **Не редактируйте `app.db` вручную** - используйте API
- **Делайте бэкапы перед обновлениями**

---

## 🔍 Диагностика

### Проверка БД

```bash
# Проверить что БД существует
ls -lh data/app.db

# Проверить таблицы
sqlite3 data/app.db ".tables"

# Проверить пользователей
sqlite3 data/app.db "SELECT id, email, displayName FROM User LIMIT 5;"

# Проверить целостность
sqlite3 data/app.db "PRAGMA integrity_check;"

# Проверить размер
sqlite3 data/app.db "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();"
```

### Восстановление после ошибок

```bash
# Очистить WAL файлы
sqlite3 data/app.db "VACUUM;"

# Проверить锁
lsof data/app.db

# Восстановить из бэкапа
cp data/app.db.backup data/app.db
```

---

## 📞 Контакты

При проблемах проверьте:
1. ✅ Файл `data/app.db` существует
2. ✅ Папка `data/` имеет права 755
3. ✅ PM2 процесс запущен: `pm2 status`
4. ✅ Нет ошибок в логах: `pm2 logs messenger-alpha`

---

**Поддержка:** i@o8eryuhtin.ru  
**Версия:** 1.0  
**Последнее обновление:** 2026-04-30
