# AppDocEditContract — Контракт browser-редактора

## Purpose

Описывает API-контракт для privileged browser-редактирования канонических объектов.

## Authentication

Все edit-эндпоинты требуют:
1. Аутентификацию creator-superadmin
2. Privileged verification через генеральный пароль

## Endpoints

### POST /api/appdocs/verify-privilege

Запрос на привилегированную верификацию.

**Request:**
```json
{
  "generalPassword": "<password>"
}
```

**Response (success):**
```json
{
  "success": true,
  "sessionToken": "<ephemeral-token>",
  "expiresIn": 900
}
```

**Response (failure):**
```json
{
  "success": false,
  "message": "Invalid privilege verification"
}
```

> **Важно:** Пароль никогда не возвращается клиенту. Session token ephemeral (15 мин).

### POST /api/appdocs/save

Сохранение объекта.

**Request:**
```json
{
  "sessionToken": "<token>",
  "nodeId": "working",
  "appId": "messenger",
  "objectType": "screen",
  "objectId": "login",
  "data": {
    "objectType": "screen",
    "nodeId": "working",
    "appId": "messenger",
    "screenId": "login",
    "title": "Updated title",
    "purpose": "Updated purpose",
    ...
  }
}
```

**Response:**
```json
{
  "success": true,
  "auditId": "audit-20260619-001",
  "message": "Object saved successfully"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "status",
      "message": "Invalid status: must be draft|active|deprecated"
    }
  ]
}
```

### GET /api/appdocs/diff

Получение diff между текущей и новой версией.

**Request:**
```json
{
  "sessionToken": "<token>",
  "nodeId": "working",
  "appId": "messenger",
  "objectType": "screen",
  "objectId": "login",
  "data": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "diff": [
    {
      "field": "title",
      "old": "Экран входа",
      "new": "Обновлённый экран входа"
    }
  ]
}
```

## Audit Log Entry

```json
{
  "auditId": "audit-20260619-001",
  "timestamp": "2026-06-19T15:30:00Z",
  "actor": "creator-superadmin",
  "action": "appdoc.save",
  "nodeId": "working",
  "appId": "messenger",
  "objectType": "screen",
  "objectId": "login",
  "changes": {
    "title": { "old": "...", "new": "..." }
  },
  "ip": "127.0.0.1",
  "userAgent": "..."
}
```

## Security Constraints

- deny-by-default: все эндпоинты закрыты
- password server-side only: пароль проверяется только на сервере
- session isolation: privileged session отделён от обычных сессий
- rate limiting: max 10 verify attempts per minute
- audit mandatory: все действия логируются
- scope limited: только docs/app-canonical/** и linked-view state files
