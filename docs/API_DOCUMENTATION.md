 # API Documentation

**Base URL:** `https://api.balloo.ru/api/v1`  
**Version:** 1.0.0

---

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "User Name",
  "phone": "+79991234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

---

## 2FA (Two-Factor Authentication)

### Send 2FA Code (Smart Router)
```http
POST /auth/smart-2fa/send-code
Authorization: Bearer <token>

# Автоматический выбор метода: Max SMS → Bot → TOTP
```

**Response:**
```json
{
  "success": true,
  "method": "sms",
  "message": "Код отправлен через Max SMS"
}
```

### Verify 2FA Code
```http
POST /auth/smart-2fa/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123"  // 3 цифры
}
```

### Get 2FA Method Status
```http
GET /auth/smart-2fa/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "methods": {
      "sms": {
        "enabled": true,
        "recentFailures": 0
      },
      "bot": {
        "enabled": true,
        "recentFailures": 2
      },
      "totp": {
        "enabled": true,
        "recentFailures": 0
      }
    }
  }
}
```

---

## Chats

### Create Chat
```http
POST /chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "participants": ["uuid-user-1", "uuid-user-2"],
  "name": "Group Name"  // для групп
}
```

### Get Chats
```http
GET /chats
Authorization: Bearer <token>
```

---

## Messages

### Send Message
```http
POST /messages/chats/:chatId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello world!",
  "type": "text",
  "replyToId": "uuid-message"  // optional
}
```

---

## Health Check

### Simple Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-03T12:00:00.000Z",
  "database": "connected"
}
```

### Detailed Health Check
```http
GET /health/detailed
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-03T12:00:00.000Z",
  "uptime": 3600,
  "responseTime": 15,
  "checks": {
    "database": {
      "status": "healthy",
      "type": "database"
    },
    "sms": {
      "status": "healthy",
      "type": "sms"
    },
    "websocket": {
      "status": "healthy",
      "type": "websocket"
    },
    "maxServer": {
      "status": "healthy",
      "type": "maxServer",
      "uptime": 3600,
      "activeDevices": 1
    }
  },
  "metrics": {
    "memoryUsage": { ... },
    "cpuUsage": { ... }
  }
}
```

### Readiness Probe
```http
GET /health/ready
```

### Liveness Probe
```http
GET /health/live
```

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Global | 100 req | 15 min |
| Auth (login/register) | 20 req | 1 hour |
| SMS | 10 req | 1 hour |
| Upload | 50 req | 1 hour |
| WebSocket | 10 msg | 3 sec |

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Ошибка валидации |
| `UNAUTHORIZED` | 401 | Неверный токен |
| `FORBIDDEN` | 403 | Нет прав доступа |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `RATE_LIMIT_EXCEEDED` | 429 | Превышен лимит |
| `INTERNAL_ERROR` | 500 | Внутренняя ошибка |

---

## WebSocket

### Connection
```
ws://api.balloo.ru/ws?token=<jwt_token>
```

### Events

#### Client → Server
- `typing:start`
- `typing:stop`
- `message:send`
- `message:read`
- `call:offer`
- `call:answer`
- `call:end`

#### Server → Client
- `message:new`
- `typing:start`
- `typing:stop`
- `presence:update`
- `notification:new`
- `call:incoming`

---

## Max SMS System

### Max Server API (port 8080)

#### Send SMS
```http
POST http://localhost:8080/send-sms
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "phone": "+79991234567",
  "code": "123",
  "message": "Balloo: Ваш код: 123"
}
```

#### Get Queue (Android App)
```http
GET http://localhost:8080/queue/:deviceToken
```

#### Confirm SMS Sent
```http
POST http://localhost:8080/confirm-sent
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "messageId": "uuid",
  "deviceToken": "uuid",
  "success": true
}
```

#### Server Status
```http
GET http://localhost:8080/status
```

---

## OpenAPI Spec

Полная OpenAPI (Swagger) спецификация доступна по адресу:  
`https://api.balloo.ru/api-docs/json`
