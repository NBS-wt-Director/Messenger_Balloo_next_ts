# 📡 API Документация Balloo Messenger

**Email:** i@o8eryuhtin.ru

---

## Аутентификация

### POST /api/auth/register - Регистрация

```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Имя",
  "phone": "+79991234567"
}
```

### POST /api/auth/login - Вход

### GET /api/auth/profile - Профиль

---

## Чаты

### GET /api/chats?userId=xxx

### POST /api/chats - Создание

```json
{
  "type": "private",
  "participants": ["user1", "user2"],
  "createdBy": "user1"
}
```

---

## Сообщения

### GET /api/messages?chatId=xxx

### POST /api/messages - Отправка

---

## Поиск

### GET /api/global-search?q=...&type=all

### GET /api/chats/search?q=...&userId=...

### GET /api/messages/search?q=...&userId=...

---

## Версии

### GET /api/versions

### POST /api/versions

---

**Поддержка:** i@o8eryuhtin.ru
