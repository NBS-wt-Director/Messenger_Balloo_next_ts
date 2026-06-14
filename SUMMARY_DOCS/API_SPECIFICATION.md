---
title: Balloo API Specification — Phase 1-2
description: Полная спецификация API для Balloo Platform
version: 1.0.0
date: 2026-06-14
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - api
  - specification
  - phase1
related_docs:
  - SUMMARY_DOCS/BALLOO_BUILD_SPEC.md
  - SUMMARY_DOCS/UBUNTU_DEPLOYMENT_GUIDE.md
---

# 📡 BALLOO API SPECIFICATION (PHASE 1-2)

**Версия:** 1.0.0  
**Дата:** 2026-06-14  
**Base URL:** `https://api.working.balloo.su`  
**Статус:** Active

---

## 🔐 AUTHENTICATION

### Endpoints

#### POST /api/auth/register

Регистрация нового пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "phone": "+79991234567",
  "displayName": "Иван Иванов"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "uuid-v4",
  "message": "Registration successful. Please verify your email."
}
```

**Status Codes:**
- `201` — Created
- `400` — Bad Request (invalid data)
- `409` — Conflict (email/phone exists)

---

#### POST /api/auth/login

Вход пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Иван Иванов",
    "roles": ["sandbox-operator"]
  }
}
```

**Status Codes:**
- `200` — OK
- `401` — Unauthorized
- `403` — Forbidden (account blocked)

---

#### POST /api/auth/yandex/callback

Yandex OAuth callback.

**Query Params:**
- `code` — Authorization code from Yandex

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": { ... }
}
```

---

#### POST /api/auth/sms/send

Отправка SMS кода.

**Request:**
```json
{
  "phone": "+79991234567"
}
```

**Response:**
```json
{
  "success": true,
  "requestId": "uuid-v4",
  "expiresIn": 300
}
```

**Status Codes:**
- `200` — OK
- `400` — Bad Request
- `429` — Too Many Requests (rate limit)

---

#### POST /api/auth/sms/verify

Проверка SMS кода.

**Request:**
```json
{
  "phone": "+79991234567",
  "code": "123",
  "requestId": "uuid-v4"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": { ... }
}
```

---

## 👥 USERS

### Endpoints

#### GET /api/users/me

Получение профиля текущего пользователя.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "+79991234567",
  "displayName": "Иван Иванов",
  "avatar": "https://...",
  "roles": ["sandbox-operator"],
  "createdAt": "2026-06-14T00:00:00Z",
  "lastLogin": "2026-06-14T12:00:00Z"
}
```

---

#### PUT /api/users/me

Обновление профиля.

**Request:**
```json
{
  "displayName": "Новое Имя",
  "avatar": "https://..."
}
```

---

## 💬 MESSENGER

### Endpoints

#### GET /api/chats

Список чатов пользователя.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "chats": [
    {
      "id": "uuid",
      "name": "Чат #1",
      "type": "private" | "group",
      "lastMessage": {
        "id": "uuid",
        "content": "Привет!",
        "timestamp": "2026-06-14T12:00:00Z",
        "senderId": "uuid"
      },
      "unreadCount": 5
    }
  ]
}
```

---

#### GET /api/chats/:id/messages

Сообщения чата.

**Query Params:**
- `limit` (default: 50)
- `offset` (default: 0)

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "chatId": "uuid",
      "senderId": "uuid",
      "type": "text" | "file" | "image" | "voice" | "video",
      "content": "Привет!",
      "attachments": [
        {
          "id": "uuid",
          "type": "file",
          "filename": "document.pdf",
          "size": 1024000,
          "yandexDiskPath": "/balloo-storage/user-id/msg-id/document.pdf"
        }
      ],
      "timestamp": "2026-06-14T12:00:00Z",
      "read": true
    }
  ]
}
```

---

#### POST /api/chats/:id/messages

Отправка сообщения.

**Request:**
```json
{
  "type": "text",
  "content": "Привет!",
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "uuid",
    "chatId": "uuid",
    "senderId": "uuid",
    "type": "text",
    "content": "Привет!",
    "timestamp": "2026-06-14T12:00:00Z"
  }
}
```

---

#### POST /api/chats/:id/messages/file

Загрузка файла (Yandex Disk).

**FormData:**
- `file` — File object
- `message` — Optional text message

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "uuid",
    "type": "file",
    "attachments": [
      {
        "id": "uuid",
        "filename": "document.pdf",
        "size": 1024000,
        "yandexDiskPath": "/balloo-storage/..."
      }
    ]
  }
}
```

**Limits:**
- Max file size: 25 MB
- Audio/Video: max 30 seconds

---

#### WS /ws/chats

WebSocket для real-time сообщений.

**Connection:**
```
wss://api.working.balloo.su/ws/chats?token=jwt-token
```

**Messages:**

Incoming:
```json
{
  "type": "message:new",
  "payload": {
    "chatId": "uuid",
    "message": { ... }
  }
}
```

Outgoing:
```json
{
  "type": "message:send",
  "payload": {
    "chatId": "uuid",
    "content": "Привет!",
    "type": "text"
  }
}
```

---

## 📊 METRICS

### Endpoints

#### GET /api/metrics/system

Системные метрики.

**Headers:**
- `Authorization: Bearer <token>`
- Role: `creator-superadmin` or `delegated-node-admin`

**Response:**
```json
{
  "cpuUsage": 45.2,
  "memoryUsage": 2048,
  "activeConnections": 1250,
  "smsQueue": 5,
  "dbLoad": 150,
  "diskUsage": 125.5,
  "uptime": 86400,
  "errorRate": 0.5
}
```

---

#### GET /api/metrics/nodes

Метрики по узлам.

**Response:**
```json
{
  "nodes": [
    {
      "nodeId": "messenger.balloo.su",
      "status": "online",
      "uptime": 86400,
      "cpuUsage": 30.5,
      "memoryUsage": 512,
      "activeConnections": 500
    }
  ]
}
```

---

#### WS /ws/metrics

WebSocket для real-time метрик.

**Connection:**
```
wss://api.working.balloo.su/ws/metrics?token=jwt-token
```

**Messages:**
```json
{
  "type": "metrics:update",
  "payload": {
    "nodeId": "admin",
    "timestamp": 1686744000000,
    "metrics": { ... }
  }
}
```

---

## 📱 SMS

### Endpoints

#### POST /api/sms/send

Отправка SMS (для Android SMS-узла).

**Headers:**
- `Authorization: Bearer <sms-api-token>`

**Request:**
```json
{
  "phone": "+79991234567",
  "code": "123",
  "requestId": "uuid-v4"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "sms-uuid",
  "status": "sent",
  "timestamp": "2026-06-14T12:00:00Z"
}
```

---

#### GET /api/sms/status/:requestId

Статус SMS.

**Response:**
```json
{
  "requestId": "uuid",
  "status": "sent" | "delivered" | "failed",
  "sentAt": "2026-06-14T12:00:00Z",
  "deliveredAt": "2026-06-14T12:00:05Z"
}
```

---

## 🗂️ YANDEX DISK

### Endpoints

#### POST /api/yandex-disk/upload

Загрузка файла на Яндекс.Диск.

**Headers:**
- `Authorization: Bearer <token>`

**FormData:**
- `file` — File object

**Response:**
```json
{
  "success": true,
  "fileId": "uuid",
  "yandexDiskPath": "/balloo-storage/user-id/file.pdf",
  "downloadUrl": "https://disk.yandex.ru/...",
  "size": 1024000
}
```

---

#### GET /api/yandex-disk/file/:fileId

Получение файла.

**Response:**
```json
{
  "fileId": "uuid",
  "filename": "document.pdf",
  "size": 1024000,
  "yandexDiskPath": "/balloo-storage/...",
  "downloadUrl": "https://...",
  "expiresAt": "2026-06-14T13:00:00Z"
}
```

---

#### DELETE /api/yandex-disk/file/:fileId

Удаление файла.

**Response:**
```json
{
  "success": true,
  "message": "File deleted"
}
```

---

## 🔧 ADMIN

### Endpoints

#### GET /api/admin/users

Список пользователей (admin only).

**Query Params:**
- `limit` (default: 50)
- `offset` (default: 0)
- `role` (filter by role)

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "Иван Иванов",
      "roles": ["sandbox-operator"],
      "createdAt": "2026-06-14T00:00:00Z",
      "lastLogin": "2026-06-14T12:00:00Z"
    }
  ],
  "total": 1000
}
```

---

#### PUT /api/admin/users/:id/role

Изменение роли пользователя.

**Request:**
```json
{
  "role": "company-staff",
  "action": "grant" | "revoke"
}
```

---

#### GET /api/admin/audit

Audit logs.

**Query Params:**
- `startDate`
- `endDate`
- `userId`
- `action`

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "userId": "uuid",
      "action": "user:login",
      "timestamp": "2026-06-14T12:00:00Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

---

## 📦 RATE LIMITS

| Endpoint | Limit | Window |
|----------|-------|--------|
| **/api/auth/** | 10 requests | 1 minute |
| **/api/auth/sms/send** | 5 requests | 1 hour |
| **/api/chats/:id/messages** | 100 requests | 1 minute |
| **/api/yandex-disk/upload** | 20 requests | 1 minute |
| **/api/metrics/** | 60 requests | 1 minute |
| **WS connections** | 10 per user | concurrent |

---

## ❌ ERROR RESPONSES

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 🔒 SECURITY

### Authentication

- JWT tokens (access + refresh)
- Token expiry: 60 minutes (standard), 15 minutes (privileged)
- Refresh token expiry: 30 days

### Password Policy

- Min length: 6 characters
- Max length: 9 characters
- Allowed: lowercase, uppercase (Cyrillic + Latin), digits, _, =, +
- No repeating characters (aaa, 111)
- No simple passwords (123456, password)

### CORS

Allowed origins:
- `https://balloo.su`
- `https://messenger.balloo.su`
- `https://admin.balloo.su`
- `https://working.balloo.su`

---

## 📝 OPENAPI SPEC

OpenAPI 3.0 spec available at:
- `/api/docs` — Swagger UI
- `/api/docs/json` — JSON spec
- `/api/docs/yaml` — YAML spec

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 1.0.0  
**Статус:** Active
