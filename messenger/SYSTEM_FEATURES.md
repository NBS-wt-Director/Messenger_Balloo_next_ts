# Balloo Messenger - Системные Функции

## 🎯 Ключевые Особенности

### 1. Супер-Админ (Первый Пользователь)

**Кто получает:**
- Первый зарегистрировавшийся пользователь (`userNumber = 1`)
- Автоматически получает роль `superadmin`

**Правa супер-админа:**
- Полный доступ к админ-панели
- Управление пользователями (бан/разбан, выдача прав)
- Управление чатами и сообщениями
- Просмотр статистики
- Управление настройками системы
- Доступ ко всем API админки

**Проверка:**
```sql
SELECT id, email, displayName, adminRoles FROM User WHERE userNumber = 1;
-- adminRoles: ["superadmin"]
```

---

### 2. Системные Чаты

При регистрации каждому пользователю автоматически создаются:

#### a) Избранное (Notes Chat)
- **ID:** `chat-notes-{userId}`
- **Тип:** private
- **Участники:** только сам пользователь
- **Описание:** Личные заметки, сохранённые сообщения

#### b) Техподдержка (Support Chat)
- **ID:** `chat-support-{userId}`
- **Тип:** private
- **Участники:** пользователь + системный аккаунт "support"
- **Описание:** Обращение в техподдержку

#### c) Новости Balloo (News Channel)
- **ID:** `balloo-news` (общий для всех!)
- **Тип:** channel
- **Участники:** ВСЕ пользователи (автоматически добавляются при регистрации)
- **Описание:** Официальные новости, фичи, возможности мессенджера

---

### 3. Автоматическое Создание Чатов

**Как работает:**
- При отправке сообщения в несуществующий чат
- Чат создаётся автоматически
- Отправитель становится участником (role: creator)

**Пример:**
```javascript
// Отправка в несуществующий чат
POST /api/messages
{
  "chatId": "chat-123", // не существует
  "senderId": "user-1",
  "type": "text",
  "content": "Привет!"
}

// Результат:
// 1. Создаётся чат chat-123
// 2. user-1 добавляется как участник
// 3. Сообщение отправляется
```

---

## 📊 Структура Базы Данных

### Таблица User (обновлённая)

| Поле | Тип | Значение по умолчанию | Описание |
|------|-----|----------------------|----------|
| `id` | TEXT | генерируется | Уникальный ID |
| `email` | TEXT | REQUIRED | Email |
| `displayName` | TEXT | REQUIRED | Отображаемое имя |
| `passwordHash` | TEXT | NULL | Хеш пароля |
| `adminRoles` | TEXT | `'[]'` | JSON массив ролей |
| `userNumber` | INTEGER | NULL | Номер регистрации |
| `points` | INTEGER | -55 | Баланс баллов |
| `createdAt` | TEXT | datetime('now') | Дата создания |
| `updatedAt` | TEXT | datetime('now') | Дата обновления |

**Роль супер-админа:**
```json
{"adminRoles": ["superadmin"]}
```

---

### Таблица Chat

| Поле | Тип | Значение по умолчанию | Описание |
|------|-----|----------------------|----------|
| `id` | TEXT | генерируется | Уникальный ID |
| `type` | TEXT | `'private'` | private/group/channel |
| `name` | TEXT | NULL | Название |
| `createdBy` | TEXT | NULL | Создатель |
| `isSystemChat` | INTEGER | 0 | Флаг системного чата |
| `createdAt` | TEXT | datetime('now') | Дата создания |

**Системные чаты:**
- `isSystemChat = 1`
- Типы: private (избранное, поддержка), channel (новости)

---

### Таблица ChatMember

| Поле | Тип | Значение по умолчанию | Описание |
|------|-----|----------------------|----------|
| `chatId` | TEXT | REQUIRED | ID чата |
| `userId` | TEXT | REQUIRED | ID пользователя |
| `role` | TEXT | `'member'` | creator/reader/member |
| `joinedAt` | TEXT | datetime('now') | Дата вступления |

---

## 🔄 Логика Регистрации

### Flow регистрации:

```
1. Пользователь регистрируется
   ↓
2. Создаётся User с userNumber = N
   ↓
3. Начисляются баллы:
   - N <= 10000 → 5000 баллов
   - N > 10000 → -55 баллов
   ↓
4. Если N = 1 → adminRoles = ["superadmin"]
   ↓
5. Создаются системные чаты:
   - Избранное (chat-notes-{userId})
   - Техподдержка (chat-support-{userId})
   ↓
6. Добавляется в новости (balloo-news)
   ↓
7. Возвращается ответ с ID чатов
```

---

## 🛠️ API Endpoints

### Регистрация

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "displayName": "User Name",
  "fullName": "Full Name",
  "phone": "+79991234567"
}
```

**Ответ:**
```json
{
  "success": true,
  "user": {
    "id": "user-xxx",
    "email": "user@example.com",
    "displayName": "User Name",
    "userNumber": 2,
    "points": 5000,
    "isAdmin": false,
    "isSuperAdmin": false
  },
  "systemChats": {
    "notes": "chat-notes-user-xxx",
    "support": "chat-support-user-xxx",
    "news": "balloo-news"
  }
}
```

---

### Отправка сообщения (с авто-созданием чата)

```bash
POST /api/messages
Content-Type: application/json

{
  "chatId": "chat-123", // может не существовать!
  "senderId": "user-xxx",
  "type": "text",
  "content": "Привет!"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": {
    "id": "msg-xxx",
    "chatId": "chat-123",
    "content": "Привет!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🚀 Инициализация БД

### Скрипт `scripts/init-db.js`

При запуске:
1. Создаёт папку `data/` если не существует
2. Создаёт все таблицы (IF NOT EXISTS)
3. Создаёт системный чат новостей (`balloo-news`)
4. Создаёт тестового пользователя (если нет)
   - Если первый → супер-админ
   - Начисляет баллы

**Запуск:**
```bash
node scripts/init-db.js
```

**Вывод:**
```
✓ База данных инициализирована успешно
✓ Путь к БД: /home/.../data/app.db
✓ Таблиц: 17
  - User
  - Chat
  - ChatMember
  - ...
✓ Создан системный чат новостей
✓ Создаём тестового пользователя...
✓ Пользователь создан: admin@test.com
✓ Номер пользователя: #1
✓ Баланс баллов: 5000
✓ РОЛЬ: СУПЕР-АДМИН (первый пользователь!)
✓ Инициализация завершена
```

---

## 👤 Проверка Прав

### Супер-Админ
```javascript
const user = getUserById(userId);
const adminRoles = JSON.parse(user.adminRoles || '[]');

if (adminRoles.includes('superadmin')) {
  // Полный доступ
} else if (adminRoles.includes('admin')) {
  // Обычный админ
} else {
  // Обычный пользователь
}
```

### Доступ к админке
```typescript
// В API админке:
const adminRoles = JSON.parse(user.adminRoles || '[]');
if (!adminRoles.includes('superadmin') && !adminRoles.includes('admin')) {
  return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
}
```

---

## 📝 Примеры Использования

### 1. Первый пользователь (супер-админ)

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "first@example.com",
    "password": "Admin123!",
    "displayName": "First User"
  }'

# Проверка роли
sqlite3 data/app.db "SELECT email, adminRoles, userNumber, points FROM User WHERE userNumber = 1;"
-- Результат:
-- first@example.com|["superadmin"]|1|5000
```

### 2. Второй пользователь (обычный)

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "second@example.com",
    "password": "User123!",
    "displayName": "Second User"
  }'

# Проверка
sqlite3 data/app.db "SELECT email, adminRoles, userNumber, points FROM User WHERE userNumber = 2;"
-- Результат:
-- second@example.com|[]|2|5000
```

### 3. Автоматическое создание чата

```bash
# Отправка в несуществующий чат
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "new-chat-123",
    "senderId": "user-1",
    "type": "text",
    "content": "Создаю чат!"
  }'

# Проверка
sqlite3 data/app.db "SELECT id, type, createdBy FROM Chat WHERE id = 'new-chat-123';"
-- Результат:
-- new-chat-123|private|user-1

sqlite3 data/app.db "SELECT chatId, userId, role FROM ChatMember WHERE chatId = 'new-chat-123';"
-- Результат:
-- new-chat-123|user-1|creator
```

---

## ⚠️ Важные Заметки

### Безопасность
- Супер-админ имеет ПОЛНЫЙ доступ ко ВСЕМ данным
- Баланс баллов виден ТОЛЬКО самому пользователю
- Смена User ID требует 4444 балла
- Все операции с ID пользователя выполняются в транзакции

### Производительность
- SQLite WAL режим включён
- Индексы на email, chatId, userId
- LIMIT на запросы (пагинация)

### Ограничения
- Максимум 32 символа в кастомном User ID
- Первые 10000 получают 5000 баллов
- Все новые пользователи автоматически в новостях

---

**Версия:** 3.0  
**Дата:** 2024  
**Статус:** ✅ Готово к деплою
