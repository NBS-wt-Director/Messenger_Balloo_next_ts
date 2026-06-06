# Admin API Documentation

Все эндпоинты требуют JWT токена с правами администратора.

## 🔐 Аутентификация

Все запросы должны включать заголовок:
```
Authorization: Bearer <admin_jwt_token>
```

---

## 👥 Управление пользователями

### Получить список пользователей
```http
GET /api/v1/admin/users
```

**Query параметры:**
- `limit` (optional) - Количество на странице (по умолчанию 100)
- `offset` (optional) - Смещение (по умолчанию 0)
- `search` (optional) - Поиск по email или displayName
- `isAdmin` (optional) - Фильтр по роли (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "displayName": "User Name",
        "fullName": "Full Name",
        "avatar": "url",
        "provider": "email",
        "isAdmin": false,
        "isSuperAdmin": false,
        "createdAt": 1234567890,
        "lastSeen": 1234567890
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 100,
      "offset": 0
    }
  }
}
```

### Получить информацию о пользователе
```http
GET /api/v1/admin/users/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "User Name",
    "fullName": "Full Name",
    "avatar": "url",
    "provider": "email",
    "yandexId": "yandex_id",
    "settings": {},
    "familyRelations": [],
    "isAdmin": false,
    "isSuperAdmin": false,
    "adminRoles": [],
    "pushTokens": [],
    "createdAt": 1234567890,
    "lastSeen": 1234567890
  }
}
```

### Изменить роль пользователя
```http
PUT /api/v1/admin/users/:userId/role
```

**Body:**
```json
{
  "isAdmin": true,
  "isSuperAdmin": false,
  "adminRoles": ["moderator"]
}
```

**Примечание:** Только super-admin может назначать super-admins.

### Заблокировать пользователя
```http
DELETE /api/v1/admin/users/:userId
```

**Примечание:** Сбрасывает все сессии пользователя.

### Сбросить пароль пользователя
```http
POST /api/v1/admin/users/:userId/reset-password
```

**Body:**
```json
{
  "newPassword": "newPassword123" // optional, если не указан - сгенерируется случайный
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "newPassword": null // Показываем только если сгенерирован случайный
  }
}
```

### Получить сессии пользователя
```http
GET /api/v1/admin/users/:userId/sessions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "sessions": [
      {
        "id": "session_id",
        "platform": "web",
        "deviceId": "device_id",
        "pushToken": "token",
        "lastActive": 1234567890,
        "expiresAt": 1234567890
      }
    ]
  }
}
```

### Завершить сессию пользователя
```http
DELETE /api/v1/admin/users/:userId/sessions/:sessionId
```

### Завершить все сессии пользователя
```http
DELETE /api/v1/admin/users/:userId/sessions
```

### Получить устройства пользователя
```http
GET /api/v1/admin/users/:userId/devices
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "devices": [
      {
        "id": "device_id",
        "platform": "web",
        "deviceId": "device_id",
        "deviceName": "Chrome on Windows",
        "pushToken": "token",
        "lastActive": 1234567890,
        "createdAt": 1234567890
      }
    ]
  }
}
```

### Удалить устройство пользователя
```http
DELETE /api/v1/admin/users/:userId/devices/:deviceId
```

### Получить E2E ключи пользователя
```http
GET /api/v1/admin/users/:userId/e2e-keys
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "keys": [
      {
        "id": "key_id",
        "deviceId": "device_id",
        "publicKey": "public_key",
        "createdAt": 1234567890,
        "expiresAt": 1234567890
      }
    ]
  }
}
```

### Удалить E2E ключ пользователя
```http
DELETE /api/v1/admin/users/:userId/e2e-keys/:keyId
```

### Получить статистику пользователей по периодам
```http
GET /api/v1/admin/users/stats?period=week
```

**Query параметры:**
- `period` (optional) - Период: 'day', 'week', 'month' (по умолчанию 'week')

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "newUsersByDay": [
      { "date": "2024-01-01", "count": 10 },
      { "date": "2024-01-02", "count": 15 }
    ],
    "activeUsersByDay": [
      { "date": "2024-01-01", "count": 100 },
      { "date": "2024-01-02", "count": 120 }
    ]
  }
}
```

---

## 💬 Управление чатами

### Получить список чатов
```http
GET /api/v1/admin/chats
```

**Query параметры:**
- `limit` (optional) - Количество на странице (по умолчанию 100)
- `offset` (optional) - Смещение (по умолчанию 0)
- `type` (optional) - Тип чата: 'private', 'group'

### Получить информацию о чате
```http
GET /api/v1/admin/chats/:chatId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chat_id",
    "type": "group",
    "name": "Group Name",
    "avatar": "url",
    "description": "Description",
    "participants": [
      {
        "id": "user_id",
        "displayName": "User Name",
        "avatar": "url",
        "lastSeen": 1234567890,
        "role": "creator",
        "joinedAt": 1234567890
      }
    ],
    "adminIds": ["user_id"],
    "createdBy": "user_id",
    "lastMessage": { "id": "msg_id", "content": "...", ... },
    "messageCount": 150,
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  }
}
```

### Удалить чат
```http
DELETE /api/v1/admin/chats/:chatId
```

**Примечание:** Удаляет чат и все сообщения в нём.

---

## 📝 Управление сообщениями

### Поиск сообщений
```http
GET /api/v1/admin/messages/search
```

**Query параметры:**
- `search` (optional) - Текст для поиска
- `userId` (optional) - ID отправителя
- `chatId` (optional) - ID чата
- `limit` (optional) - Количество (по умолчанию 50)
- `offset` (optional) - Смещение (по умолчанию 0)

### Удалить сообщение
```http
DELETE /api/v1/admin/messages/:messageId
```

---

## 🎙️ Записи звонков

### Получить информацию о записях
```http
GET /api/v1/admin/recordings/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRecordings": 10,
    "totalSizeBytes": 52428800,
    "totalSizeMB": "50.00",
    "recordings": [
      {
        "filename": "call_123.webm",
        "size": 5242880,
        "sizeMB": "5.00",
        "createdAt": 1234567890
      }
    ]
  }
}
```

### Очистить старые записи
```http
POST /api/v1/admin/recordings/cleanup
```

**Body:**
```json
{
  "days": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 5,
    "remainingCount": 5,
    "cleanedOlderThan": 30
  }
}
```

---

## 📊 Отчёты

### Получить список отчётов
```http
GET /api/v1/admin/reports
```

**Query параметры:**
- `status` (optional) - Статус: 'pending', 'reviewing', 'resolved', 'rejected'
- `targetType` (optional) - Тип цели: 'chat', 'user', 'contact', 'invitation'

### Обработать отчёт
```http
PUT /api/v1/admin/reports/:reportId
```

**Body:**
```json
{
  "status": "resolved",
  "resolution": "User was banned for spam"
}
```

---

## 📱 Управление версиями приложений

### Получить список версий
```http
GET /api/v1/admin/versions
```

### Добавить версию
```http
POST /api/v1/admin/versions
```

**Body:**
```json
{
  "platform": "web",
  "version": "1.2.0",
  "minVersion": "1.0.0",
  "updateUrl": "https://example.com/update",
  "releaseNotes": "Bug fixes and improvements",
  "isForceUpdate": false
}
```

### Обновить версию
```http
PUT /api/v1/admin/versions/:versionId
```

**Body:**
```json
{
  "version": "1.2.1",
  "isForceUpdate": true
}
```

### Удалить версию
```http
DELETE /api/v1/admin/versions/:versionId
```

---

## 📈 Аналитика и система

### Получить аналитику
```http
GET /api/v1/admin/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "activeUsers": 500,
    "totalChats": 200,
    "totalMessages": 50000,
    "totalAdmins": 5,
    "dailyActiveUsers": 500,
    "newUsersToday": 10
  }
}
```

### Получить системную информацию
```http
GET /api/v1/admin/system
```

**Response:**
```json
{
  "success": true,
  "data": {
    "server": {
      "nodeVersion": "v18.0.0",
      "platform": "linux",
      "arch": "x64",
      "uptime": 3600,
      "uptimeFormatted": "1h 0m"
    },
    "database": {
      "totalUsers": 1000,
      "totalChats": 200,
      "totalMessages": 50000,
      "totalAdmins": 5,
      "activeUsersToday": 500,
      "newUsersToday": 10
    },
    "recordings": {
      "totalRecordings": 10
    },
    "timestamp": 1234567890
  }
}
```

---

## 🔒 Роли администраторов

| Роль | Права |
|------|-------|
| **Admin** | Просмотр пользователей, чатов, отчётов, аналитика |
| **Super-admin** | Все права + управление правами других админов |

---

## ⚠️ Ошибки

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Отсутствует токен авторизации"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Треуются права администратора"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Ресурс не найден"
  }
}
```

---

**API Version:** 1.0.0
**Last Updated:** 2024-01-01
