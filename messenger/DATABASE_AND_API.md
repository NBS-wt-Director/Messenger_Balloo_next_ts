# Balloo Messenger - База Данных и API

## 📊 Структура Базы Данных

### Таблица: User

| Поле | Тип | Описание | Значение по умолчанию |
|------|-----|----------|----------------------|
| `id` | TEXT | Уникальный ID пользователя | Генерируется |
| `email` | TEXT | Email (уникальный) | REQUIRED |
| `displayName` | TEXT | Отображаемое имя | REQUIRED |
| `passwordHash` | TEXT | Хеш пароля | NULL (для OAuth) |
| `authProvider` | TEXT | Провайдер auth (yandex, google) | NULL |
| `fullName` | TEXT | Полное имя | NULL |
| `phone` | TEXT | Телефон | NULL |
| `bio` | TEXT | Биография | NULL |
| `avatar` | TEXT | URL аватара | NULL |
| `adminRoles` | TEXT | JSON массив ролей | `'[]'` |
| `online` | INTEGER | Статус онлайн | 0 |
| `isOnline` | INTEGER | Флаг онлайн | 0 |
| `status` | TEXT | Статус (online/offline/banned) | `'offline'` |
| `settings` | TEXT | JSON настроек | `'{}'` |
| **`points`** | INTEGER | **Баланс баллов** | **-55** |
| **`userNumber`** | INTEGER | **Номер регистрации (#1, #2...)** | **NULL** |
| `createdAt` | TEXT | Дата создания | datetime('now') |
| `updatedAt` | TEXT | Дата обновления | datetime('now') |

### Новые поля (точки интереса):

1. **`points`** (INTEGER, default: -55)
   - Баллы пользователя
   - Первые 10000 получают 5000 баллов
   - Остальные получают -55 баллов
   - Можно тратить на услуги

2. **`userNumber`** (INTEGER, nullable)
   - Порядковый номер регистрации
   - #1 = первый пользователь
   - #9999 = 9999-й пользователь
   - Отображается в профиле

### Другие таблицы:

- `Chat` - Чаты (private, group, channel)
- `ChatMember` - Участники чатов
- `Message` - Сообщения
- `MessageReaction` - Реакции на сообщения
- `ChatFavorite` - Избранные чаты
- `ChatPinned` - Закреплённые чаты
- `Contact` - Контакты
- `Invitation` - Пригласительные ссылки
- `InvitationUse` - Использование пригласительных
- `Notification` - Уведомления
- `Report` - Жалобы
- `Feature` - Предложения функций
- `FeatureVote` - Голоса за функции
- `Page` - Страницы (support, about, etc.)
- `FamilyRelation` - Семейные связи
- `_prisma_migrations` - История миграций

---

## 🔧 API Функции

### 🔐 Аутентификация

#### POST /api/auth/register
**Регистрация пользователя**
```json
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
    "userNumber": 1234,
    "points": 5000
  },
  "systemChats": {
    "notes": "chat-notes-user-xxx",
    "support": "chat-support-user-xxx",
    "news": "balloo-news"
  }
}
```

#### POST /api/auth/login
**Вход в систему**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

---

### 👤 Профиль

#### GET /api/auth/profile?userId=xxx
**Получение профиля (включая ID и баллы)**
```json
{
  "success": true,
  "user": {
    "id": "user-xxx",
    "displayName": "User Name",
    "userNumber": 1234,
    "points": 5000,
    "isAdmin": false,
    "status": "online"
  }
}
```

#### PATCH /api/auth/profile
**Обновление профиля**
```json
{
  "userId": "user-xxx",
  "updates": {
    "displayName": "New Name",
    "avatar": "url..."
  }
}
```

---

### 💰 Баланс и Баллы

#### GET /api/balance?userId=xxx
**Получение баланса (ТОЛЬКО СВОЙ!)**
```json
{
  "success": true,
  "balance": {
    "points": 5000,
    "userNumber": 1234,
    "canSpend": true,
    "changeUserIdCost": 4444,
    "message": "Поздравляем! Вы один из первых 10000 пользователей!"
  }
}
```

**Подсказка для UI:**
```
💡 Позже баллы можно будет потратить на оплаты услуг и пакетов от самого мессенджера
```

#### POST /api/balance
**Обновление баланса (админ)**
```json
{
  "userId": "user-xxx",
  "points": 100,
  "action": "add" // или "set", "remove"
}
```

---

### 🆔 Смена User ID

#### GET /api/user-id/change?userId=xxx
**Проверка возможности смены ID**
```json
{
  "success": true,
  "canChange": true,
  "currentId": "user-xxx",
  "currentPoints": 5000,
  "cost": 4444,
  "message": "Вы можете сменить ID",
  "rules": {
    "minLength": 3,
    "maxLength": 32,
    "allowedChars": "Латинские буквы, цифры, _, -"
  }
}
```

**Подсказка для UI:**
```
💡 Пользовательский ID можно изменить за 4444 балла
```

#### POST /api/user-id/change
**Смена User ID**
```json
{
  "userId": "user-xxx",
  "newId": "my-custom-id"
}
```
**Ответ:**
```json
{
  "success": true,
  "message": "ID успешно изменён",
  "oldId": "user-xxx",
  "newId": "my-custom-id",
  "previousPoints": 5000,
  "newPoints": 556,
  "cost": 4444,
  "warning": "Пожалуйста, перезагрузите страницу для применения изменений"
}
```

**Ошибки:**
```json
{
  "error": "Недостаточно баллов. Требуется 4444 балла.",
  "currentPoints": 1000,
  "required": 4444,
  "deficit": 3444
}
```

---

### 💬 Сообщения

#### GET /api/messages?chatId=xxx&limit=50&before=timestamp
**Получение сообщений чата**

#### POST /api/messages
**Отправка сообщения**
```json
{
  "chatId": "chat-xxx",
  "senderId": "user-xxx",
  "type": "text",
  "content": "Привет!",
  "replyToId": "msg-xxx"
}
```

#### PATCH /api/messages
**Редактирование сообщения**
```json
{
  "messageId": "msg-xxx",
  "content": "Отредактированный текст"
}
```

#### DELETE /api/messages?messageId=xxx
**Удаление сообщения**

---

### 💬 Чаты

#### GET /api/chats?userId=xxx
**Получение списка чатов пользователя**

#### POST /api/chats
**Создание чата**
```json
{
  "type": "private", // или "group", "channel"
  "participants": ["user-1", "user-2"],
  "name": "Название группы",
  "createdBy": "user-1"
}
```

#### GET /api/chats/search?q=xxx&userId=xxx
**Поиск чатов**

---

### 🔍 Поиск

#### GET /api/global-search?q=xxx&type=all&limit=20
**Глобальный поиск (пользователи, чаты)**
```json
{
  "success": true,
  "users": [...],
  "groups": [...],
  "communities": [...],
  "totalGroups": 10,
  "totalCommunities": 5
}
```

#### GET /api/messages/search?q=xxx&userId=xxx&limit=20
**Поиск по сообщениям**

---

### ⭐ Функции

#### GET /api/features?status=all
**Список предложений функций**

#### POST /api/features
**Предложить функцию**
```json
{
  "title": "Новая функция",
  "description": "Описание функции",
  "category": "general",
  "userId": "user-xxx"
}
```

---

### 📄 Страницы

#### GET /api/pages?slug=support
**Получение контента страницы**

#### POST /api/pages
**Обновление страницы (админ)**
```json
{
  "slug": "support",
  "title": "Поддержка",
  "content": "Контент",
  "sections": []
}
```

---

## 🎯 Особенности реализации

### Балльная система

1. **Первые 10000 пользователей:**
   - Получают **5000 баллов** при регистрации
   - Видят поздравление в профиле
   - Могут сменить ID за 4444 балла

2. **Пользователи после 10000:**
   - Получают **-55 баллов** при регистрации
   - Могут заработать баллы позже

3. **Траты баллов:**
   - Смена User ID: **4444 балла**
   - Будущие услуги и пакеты

### Пользовательский ID

- **По умолчанию:** `user-{timestamp}-{random}`
- **Можно сменить:** За 4444 балла
- **Формат:** 3-32 символа (латиница, цифры, _, -)
- **Влияет на:** Все связи в БД (транзакция)

### Отображение в профиле

**Для себя:**
```
User ID: user-xxx [✏️ Изменить за 4444 балла]
Баланс: 5000 💰 [ℹ️ Баллы можно тратить на услуги]
Номер: #1234 🎉
```

**Для других:**
```
User ID: user-xxx
Номер: #1234
```
(Баллы НЕ видны другим!)

---

## 🚀 Быстрый старт

```bash
# Установка
npm install better-sqlite3

# Инициализация БД
mkdir -p data
node scripts/init-db.js

# Проверка
sqlite3 data/app.db "SELECT userNumber, points FROM User;"

# Запуск
NODE_ENV=production npx next build
pm2 start "npx next start -p 3000"
```

---

**Версия:** 2.0  
**Дата:** 2024  
**Статус:** ✅ Готово к деплою
