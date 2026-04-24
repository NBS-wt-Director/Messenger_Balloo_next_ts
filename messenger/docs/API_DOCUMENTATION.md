

# Balloo Messenger - Полная Документация API

## Содержание
1. [Аутентификация](#аутентификация)
2. [Пользователи](#пользователи)
3. [Чаты](#чаты)
4. [Сообщения](#сообщения)
5. [Вложения](#вложения)
6. [Приглашения](#приглашения)
7. [Контакты](#контакты)
8. [Уведомления](#уведомления)
9. [Админ-панель](#админ-панель)

---

## Аутентификация

### Регистрация
**POST** `/api/auth/register`

Создание нового аккаунта.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "displayName": "Иван Иванов",
  "fullName": "Иван Иванович Иванов",
  "phone": "+79001234567"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_1234567890_abc",
    "email": "user@example.com",
    "displayName": "Иван Иванов",
    "fullName": "Иван Иванович Иванов",
    "avatar": null,
    "status": "online"
  },
  "token": "token_1234567890_xyz",
  "message": "Регистрация успешна"
}
```

### Вход
**POST** `/api/auth/login`

Авторизация пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_1234567890_abc",
    "email": "user@example.com",
    "displayName": "Иван Иванов",
    "isAdmin": false,
    "isSuperAdmin": false,
    "settings": {
      "theme": "dark",
      "language": "ru"
    }
  },
  "token": "token_1234567890_xyz",
  "message": "Вход выполнен успешно"
}
```

### Выход
**POST** `/api/auth/logout`

Выполнение выхода из системы.

**Request:**
```json
{
  "userId": "user_1234567890_abc"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Выход выполнен успешно"
}
```

### Получение профиля
**GET** `/api/auth/profile?userId=USER_ID`

Получение данных пользователя.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_1234567890_abc",
    "email": "user@example.com",
    "displayName": "Иван Иванов",
    "fullName": "Иван Иванович Иванов",
    "avatar": "https://...",
    "birthDate": 631152000000,
    "status": "online",
    "bio": "Привет! Я разработчик.",
    "phone": "+79001234567",
    "isAdmin": false,
    "settings": {
      "theme": "dark",
      "language": "ru",
      "notificationsEnabled": true
    },
    "createdAt": 1234567890000,
    "lastSeen": 1234567890000
  }
}
```

### Обновление профиля
**PATCH** `/api/auth/profile`

Обновление данных профиля.

**Request:**
```json
{
  "userId": "user_1234567890_abc",
  "updates": {
    "displayName": "Иван И.",
    "bio": "Новое описание",
    "avatar": "https://...",
    "settings": {
      "theme": "light"
    }
  }
}
```

---

## Пользователи

### Поиск пользователей
**GET** `/api/contacts/search?userId=USER_ID&q=QUERY&limit=20`

Поиск пользователей по имени, email или телефону.

**Request Parameters:**
- `userId` - ID текущего пользователя (обязательно)
- `q` - поисковый запрос (минимум 2 символа)
- `limit` - максимум результатов (по умолчанию 20)

**Response:**
```json
{
  "success": true,
  "contacts": [
    {
      "id": "user_456",
      "displayName": "Мария Петрова",
      "fullName": "Мария Сергеевна Петрова",
      "email": "maria@example.com",
      "phone": "+79007654321",
      "avatar": "https://...",
      "status": "online",
      "isContact": true,
      "isFavorite": false,
      "isBlocked": false
    }
  ],
  "query": "мария"
}
```

---

## Чаты

### Получение списка чатов
**GET** `/api/chats?userId=USER_ID&type=all&favorite=false`

Получение всех чатов пользователя.

**Request Parameters:**
- `userId` - ID пользователя (обязательно)
- `type` - тип чата: 'private', 'group', 'all' (по умолчанию 'all')
- `favorite` - только избранные (по умолчанию false)

**Response:**
```json
{
  "success": true,
  "chats": [
    {
      "id": "chat_123",
      "type": "group",
      "name": "Друзья",
      "avatar": "https://...",
      "participants": ["user_1", "user_2", "user_3"],
      "members": {
        "user_1": { "role": "creator", "joinedAt": 1234567890000 },
        "user_2": { "role": "author", "joinedAt": 1234567891000 }
      },
      "adminIds": ["user_1"],
      "createdBy": "user_1",
      "description": "Чат с друзьями",
      "isFavorite": { "user_1": true, "user_2": false },
      "pinned": { "user_1": true },
      "unreadCount": { "user_2": 5 },
      "lastMessage": {
        "id": "msg_789",
        "content": "Привет!",
        "type": "text",
        "createdAt": 1234567892000,
        "senderId": "user_1"
      },
      "createdAt": 1234567890000,
      "updatedAt": 1234567892000
    }
  ]
}
```

### Создание чата
**POST** `/api/chats`

Создание нового чата или группы.

**Request:**
```json
{
  "type": "group",
  "name": "Рабочая группа",
  "description": "Чат для обсуждения проектов",
  "participants": ["user_1", "user_2", "user_3"],
  "createdBy": "user_1"
}
```

**Response:**
```json
{
  "success": true,
  "chat": {
    "id": "chat_456",
    "type": "group",
    "name": "Рабочая группа",
    "participants": ["user_1", "user_2", "user_3"],
    "createdBy": "user_1",
    "createdAt": 1234567890000,
    "updatedAt": 1234567890000
  },
  "chatId": "chat_456"
}
```

### Обновление чата
**PATCH** `/api/chats`

Обновление информации о чате.

**Request:**
```json
{
  "chatId": "chat_123",
  "updates": {
    "name": "Новое название",
    "avatar": "https://...",
    "description": "Новое описание",
    "isFavorite": true,
    "pinned": true
  }
}
```

### Выход из чата / Удаление чата
**DELETE** `/api/chats?chatId=CHAT_ID&userId=USER_ID`

Выйти из чата или удалить чат (если создатель).

**Response:**
```json
{
  "success": true,
  "message": "Left chat"
}
```

---

## Сообщения

### Получение сообщений
**GET** `/api/messages?chatId=CHAT_ID&limit=50&before=TIMESTAMP`

Получение истории сообщений чата.

**Request Parameters:**
- `chatId` - ID чата (обязательно)
- `limit` - количество сообщений (по умолчанию 50)
- `before` - получить сообщения до этого timestamp (пагинация)

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_123",
      "chatId": "chat_456",
      "senderId": "user_1",
      "type": "text",
      "content": "Привет! Как дела?",
      "mediaUrl": null,
      "thumbnailUrl": null,
      "fileName": null,
      "fileSize": null,
      "mimeType": null,
      "replyToId": null,
      "replyToMessage": null,
      "reactions": {
        "👍": { "emoji": "👍", "userIds": ["user_2", "user_3"], "count": 2 }
      },
      "readBy": ["user_1", "user_2"],
      "status": "read",
      "edited": false,
      "editedAt": null,
      "createdAt": 1234567890000,
      "updatedAt": 1234567890000
    }
  ],
  "hasMore": true
}
```


### Отправка сообщения
**POST** `/api/messages`

Отправка нового сообщения в чат.

**Request:**
```json
{
  "chatId": "chat_123",
  "senderId": "user_1",
  "type": "text",
  "content": "Привет! Как дела?",
  "mediaUrl": "https://...",
  "replyToId": "msg_456"
}
```

**Types:**
- `text` - текстовое сообщение
- `image` - изображение
- `video` - видео
- `audio` - аудио / голосовое
- `document` - файл
- `system` - системное сообщение

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg_789",
    "chatId": "chat_123",
    "senderId": "user_1",
    "type": "text",
    "content": "Привет! Как дела?",
    "status": "sent",
    "createdAt": 1234567890000
  },
  "createdAt": 1234567890000
}
```

### Редактирование сообщения
**PATCH** `/api/messages`

Редактирование отправленного сообщения.

**Request:**
```json
{
  "messageId": "msg_123",
  "content": "Исправленный текст сообщения"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg_123",
    "content": "Исправленный текст сообщения",
    "edited": true,
    "editedAt": 1234567891000
  }
}
```

### Удаление сообщения
**DELETE** `/api/messages?messageId=MESSAGE_ID`

Удаление сообщения.

**Response:**
```json
{
  "success": true,
  "message": "Message deleted"
}
```

---

## Вложения

### Получение вложений
**GET** `/api/attachments?messageId=MESSAGE_ID&chatId=CHAT_ID`

Получение списка вложений.

**Request Parameters:**
- `messageId` - ID сообщения (опционально)
- `chatId` - ID чата (опционально, если messageId не указан)

**Response:**
```json
{
  "success": true,
  "attachments": [
    {
      "id": "att_123",
      "messageId": "msg_456",
      "chatId": "chat_789",
      "uploaderId": "user_1",
      "fileName": "photo.jpg",
      "originalName": "IMG_20240101_123456.jpg",
      "mimeType": "image/jpeg",
      "fileSize": 2048576,
      "url": "/uploads/user_1/att_123.jpg",
      "thumbnailUrl": "/uploads/user_1/att_123.jpg?thumb",
      "width": 1920,
      "height": 1080,
      "duration": null,
      "status": "ready",
      "yandexDiskId": null,
      "createdAt": 1234567890000,
      "updatedAt": 1234567890000
    }
  ]
}
```

### Загрузка вложения
**POST** `/api/attachments`

Загрузка файла (изображение, видео, аудио, документ).

**Request (multipart/form-data):**
- `file` - файл (обязательно)
- `messageId` - ID сообщения (обязательно)
- `chatId` - ID чата (обязательно)
- `uploaderId` - ID пользователя (обязательно)

**Response:**
```json
{
  "success": true,
  "attachment": {
    "id": "att_123",
    "fileName": "photo.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 2048576,
    "url": "/uploads/user_1/att_123.jpg",
    "thumbnailUrl": "/uploads/user_1/att_123.jpg?thumb",
    "status": "ready"
  },
  "uploadTime": 1234567890000
}
```

### Удаление вложения
**DELETE** `/api/attachments?attachmentId=ATTACHMENT_ID`

Удаление вложения.

**Response:**
```json
{
  "success": true,
  "message": "Вложение удалено"
}
```

---

## Приглашения

### Создание приглашения
**POST** `/api/invitations`

Создание ссылки-приглашения в чат.

**Request:**
```json
{
  "chatId": "chat_123",
  "invitedBy": "user_1",
  "message": "Присоединяйтесь к нашему чату!",
  "maxUses": 10,
  "expiresDays": 7,
  "isOneTime": false
}
```

**Response:**
```json
{
  "success": true,
  "invitation": {
    "id": "inv_abc123",
    "code": "abc123_xyz456",
    "chatId": "chat_123",
    "invitedBy": "user_1",
    "chatName": "Друзья",
    "chatType": "group",
    "message": "Присоединяйтесь к нашему чату!",
    "maxUses": 10,
    "currentUses": 0,
    "expiresAt": 1235172690000,
    "isActive": true,
    "isOneTime": false,
    "createdAt": 1234567890000
  },
  "inviteUrl": "https://balloo.app/invite/abc123_xyz456"
}
```

### Получение информации о приглашении
**GET** `/api/invitations?code=INVITE_CODE`

Получение информации о приглашении.

**Response:**
```json
{
  "success": true,
  "invitation": {
    "code": "abc123_xyz456",
    "chatId": "chat_123",
    "chatName": "Друзья",
    "chatAvatar": "https://...",
    "chatType": "group",
    "invitedBy": "user_1",
    "invitedByEmail": "user1@example.com",
    "message": "Присоединяйтесь к нашему чату!",
    "maxUses": 10,
    "currentUses": 3,
    "expiresAt": 1235172690000,
    "isActive": true
  }
}
```

### Принятие приглашения
**POST** `/api/invitations/accept`

Присоединение к чату по приглашению.

**Request:**
```json
{
  "code": "abc123_xyz456",
  "userId": "user_new"
}
```

**Response:**
```json
{
  "success": true,
  "chatId": "chat_123",
  "message": "Успешно присоединились к чату"
}
```

### Деактивация приглашения
**DELETE** `/api/invitations`

Деактивация созданного приглашения.

**Request:**
```json
{
  "invitationId": "inv_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation deactivated"
}
```

---

## Уведомления

### Подписка на push-уведомления
**POST** `/api/notifications/token`

Сохранение токена push-уведомлений.

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "platform": "web",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token saved successfully",
  "savedAt": 1234567890000
}
```

### Отписка от push-уведомлений
**DELETE** `/api/notifications/token`

Удаление токена push-уведомлений.

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token removed successfully"
}
```

### Отправка уведомления
**POST** `/api/notifications/send`

Отправка push-уведомления пользователю.

**Request:**
```json
{
  "userId": "user_123",
  "title": "Новое сообщение",
  "body": "Иван: Привет, как дела?",
  "icon": "/icon-192x192.png",
  "badge": "/badge-72x72.png",
  "url": "/chats/chat_456",
  "tag": "message-chat_456",
  "data": {
    "chatId": "chat_456",
    "messageId": "msg_789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Уведомление отправлено",
  "sentAt": 1234567890000,
  "recipients": 1
}
```

---

## Админ-панель

### Получение списка пользователей
**GET** `/api/admin/users?adminId=ADMIN_ID&role=all&page=1&limit=50`

**Request Parameters:**
- `adminId` - ID администратора (обязательно)
- `role` - фильтр по роли: 'admin', 'superadmin', 'all'
- `page` - номер страницы (по умолчанию 1)
- `limit` - количество на странице (по умолчанию 50)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "displayName": "Иван Иванов",
      "fullName": "Иван Иванович Иванов",
      "avatar": "https://...",
      "status": "online",
      "isAdmin": false,
      "isSuperAdmin": false,
      "createdAt": 1234567890000,
      "lastSeen": 1234567891000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "totalPages": 25
  }
}
```

### Управление пользователем
**POST** `/api/admin/users`

Блокировка, разблокировка, выдача/отзыв прав.

**Request:**
```json
{
  "adminId": "admin_123",
  "targetUserId": "user_456",
  "action": "ban" // или 'unban', 'makeAdmin', 'removeAdmin'
}
```

**Response:**
```json
{
  "success": true,
  "message": "Пользователь ban успешно"
}
```

### Получение списка чатов
**GET** `/api/admin/chats?adminId=ADMIN_ID&type=all&page=1&limit=50`

**Response:**
```json
{
  "success": true,
  "chats": [
    {
      "id": "chat_123",
      "type": "group",
      "name": "Друзья",
      "participants": 15,
      "createdBy": "user_1",
      "createdAt": 1234567890000,
      "updatedAt": 1234567891000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 856,
    "totalPages": 18
  }
}
```

### Удаление чата
**DELETE** `/api/admin/chats`

Удаление чата и всех сообщений.

**Request:**
```json
{
  "adminId": "admin_123",
  "chatId": "chat_456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Чат и все сообщения удалены"
}
```

### Получение списка сообщений
**GET** `/api/admin/messages?adminId=ADMIN_ID&chatId=CHAT_ID&userId=USER_ID&page=1&limit=50`

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_123",
      "chatId": "chat_456",
      "senderId": "user_1",
      "type": "text",
      "content": "Текст сообщения...",
      "createdAt": 1234567890000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 45678,
    "totalPages": 914
  }
}
```

### Удаление сообщения
**DELETE** `/api/admin/messages`

**Request:**
```json
{
  "adminId": "admin_123",
  "messageId": "msg_456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Сообщение удалено"
}
```

### Управление банами
**GET** `/api/admin/bans?adminId=ADMIN_ID&userId=USER_ID&chatId=CHAT_ID`

**Response:**
```json
{
  "success": true,
  "bans": [
    {
      "id": "ban_123",
      "userId": "user_456",
      "chatId": null,
      "bannedBy": "admin_123",
      "reason": "Спам",
      "expiresAt": null,
      "createdAt": 1234567890000
    }
  ]
}
```

### Создание бана
**POST** `/api/admin/bans`

**Request:**
```json
{
  "adminId": "admin_123",
  "userId": "user_456",
  "chatId": null,
  "reason": "Нарушение правил",
  "expiresDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "ban": {
    "id": "ban_789",
    "userId": "user_456",
    "chatId": null,
    "bannedBy": "admin_123",
    "reason": "Нарушение правил",
    "expiresAt": 1237159890000,
    "createdAt": 1234567890000
  },
  "message": "Пользователь заблокирован"
}
```

### Удаление бана
**DELETE** `/api/admin/bans`

**Request:**
```json
{
  "adminId": "admin_123",
  "banId": "ban_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Пользователь разблокирован"
}
```

### Настройки системы
**GET** `/api/admin/settings?adminId=ADMIN_ID`

**Response:**
```json
{
  "success": true,
  "settings": {
    "registrationEnabled": true,
    "emailVerificationRequired": false,
    "maxGroupSize": 1000,
    "maxFileSize": 104857600,
    "messageRetentionDays": 365,
    "maintenanceMode": false,
    "allowedDomains": ["*"],
    "defaultLanguage": "ru",
    "theme": "dark"
  }
}
```

### Обновление настроек
**POST** `/api/admin/settings`

**Request:**
```json
{
  "adminId": "admin_123",
  "updates": {
    "maxGroupSize": 500,
    "maxFileSize": 52428800,
    "maintenanceMode": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "registrationEnabled": true,
    "emailVerificationRequired": false,
    "maxGroupSize": 500,
    "maxFileSize": 52428800,
    "messageRetentionDays": 365,
    "maintenanceMode": true,
    "allowedDomains": ["*"],
    "defaultLanguage": "ru",
    "theme": "dark"
  },
  "message": "Настройки обновлены"
}
```

---

## Ошибки API

Все ошибки возвращаются в следующем формате:

```json
{
  "error": "Описание ошибки"
}
```

**HTTP коды ошибок:**
- `400` - Неверный запрос (отсутствуют обязательные поля)
- `401` - Неавторизован
- `403` - Доступ запрещен
- `404` - Ресурс не найден
- `409` - Конфликт (например, email уже занят)
- `500` - Внутренняя ошибка сервера

---

## Rate Limiting

- **Обычные запросы**: 100 запросов в минуту
- **Аутентификация**: 10 запросов в минуту
- **Загрузка файлов**: 20 запросов в минуту
- **Админ-панель**: 200 запросов в минуту

---

## CORS

Все API endpoints поддерживают CORS для доменов:
- `https://balloo.app`
- `http://localhost:3000` (разработка)
