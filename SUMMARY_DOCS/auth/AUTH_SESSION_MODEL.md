---
title: Auth Session Model
description: Модель сессий авторизации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - session
  - model
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_DEVICE_CONTEXT_MODEL.md
  - SUMMARY_DOCS/state/auth-session-map.json
---

# 🔄 AUTH SESSION MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **жизненный цикл сессий** платформы Balloo.

**Цель:** Обеспечить единую session model для всех провайдеров.

---

## 📊 SESSION LIFECYCLE

### States

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Created   │────▶│   Active    │────▶│  Expired    │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │   Revoked   │
                    └─────────────┘
```

### Transitions

| From | To | Trigger |
|------|-----|---------|
| Created | Active | First successful request |
| Active | Active | Session refresh/activity |
| Active | Expired | Timeout reached |
| Active | Revoked | Manual revocation, password change, security event |

---

## 🔐 SESSION CREATION

### Per Provider

| Provider | Session Creation |
|----------|-----------------|
| **yandex-id** | After token validation |
| **email-password** | After credential validation |
| **phone-3char-code** | After code validation |
| **gosuslugi** | After claims verification |
| **max** | After code validation via MAX bot |
| **qr-code** | After QR validation |
| **creator-superadmin** | After dedicated auth |

### Session Data

```typescript
interface AuthSession {
  sessionId: string;           // Unique identifier
  userId: string;              // User identifier
  providerId: string;          // Auth provider used
  deviceContextId: string;     // Device context reference
  browserContextId: string;    // Browser context reference
  createdAt: string;           // ISO-8601 timestamp
  expiresAt: string;           // ISO-8601 timestamp
  lastActivity: string;        // ISO-8601 timestamp
  revoked: boolean;            // Revocation flag
  type: 'standard' | 'privileged'; // Session type
  auditLevel: 'standard' | 'maximum'; // Audit level
}
```

---

## 🔄 SESSION REFRESH

### Refresh Rules

| Condition | Action |
|-----------|--------|
| **Active session** | Extend expiry on activity |
| **Idle < 60 min** | Refresh automatically |
| **Idle 60-120 min** | Require re-authentication |
| **Idle > 120 min** | Session expired |

### Refresh Flow

```
1. User makes request with session token
2. System validates session
3. System updates lastActivity
4. System extends expiry (if within limits)
5. System returns refreshed session
```

---

## ⏰ SESSION EXPIRY

### Expiry Rules

| Session Type | Idle Timeout | Absolute Timeout |
|-------------|--------------|------------------|
| **Standard** | 60 minutes | 30 days |
| **Privileged** | 15 minutes | 8 hours |
| **creator-superadmin** | 15 minutes | 8 hours |

### Expiry Handling

```typescript
function checkSessionExpiry(session: AuthSession): SessionStatus {
  const now = Date.now();
  
  // Check absolute expiry
  if (now > new Date(session.expiresAt).getTime()) {
    return 'expired';
  }
  
  // Check idle timeout
  const idleMinutes = (now - new Date(session.lastActivity).getTime()) / 60000;
  const maxIdle = session.type === 'privileged' ? 15 : 60;
  
  if (idleMinutes > maxIdle) {
    return 'idle-timeout';
  }
  
  return 'active';
}
```

---

## 🚫 SESSION REVOCATION

### Revocation Triggers

| Trigger | Scope | Automatic |
|---------|-------|-----------|
| **User logout** | Single session | ✅ Yes |
| **Logout all devices** | All user sessions | ✅ Yes |
| **Password change** | All sessions | ✅ Yes |
| **Security incident** | Affected sessions | ✅ Yes |
| **Account suspension** | All sessions | ✅ Yes |
| **creator-superadmin revoke** | Any session | ✅ Yes |

### Revocation Flow

```
1. Revocation triggered
2. Session marked as revoked
3. Session removed from active store
4. Audit log entry created
5. User notified (if applicable)
```

---

## 🔗 PASSWORD CHANGE INVALIDATION

### Invalidation Rules

| Event | Session Impact |
|-------|---------------|
| **Password changed** | All sessions invalidated |
| **Password reset** | All sessions invalidated |
| **OTP used for password reset** | All sessions invalidated |

### Invalidation Flow

```
1. Password change detected
2. All user sessions found
3. All sessions marked as revoked
4. Audit log entries created
5. User must re-authenticate
```

---

## 📊 SESSION STORAGE

### Storage Requirements

| Requirement | Description |
|-------------|-------------|
| **Secure Storage** | Encrypted at rest |
| **Fast Lookup** | Session ID index |
| **Expiry Cleanup** | Automatic removal |
| **Audit Trail** | All changes logged |

### Storage Structure

```typescript
interface SessionStore {
  // Session data
  sessions: Map<string, AuthSession>;
  
  // User index
  userSessions: Map<string, string[]>;  // userId -> [sessionIds]
  
  // Device index
  deviceSessions: Map<string, string[]>;  // deviceContextId -> [sessionIds]
  
  // Revocation list
  revokedSessions: Set<string>;
}
```

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authSessionModel": {
    "lifecycle": ["created", "active", "expired", "revoked"],
    "creation": {
      "providers": ["yandex-id", "email-password", "phone-3char-code", "gosuslugi", "max", "qr-code", "creator-superadmin"]
    },
    "expiry": {
      "standard": { "idleMinutes": 60, "absoluteDays": 30 },
      "privileged": { "idleMinutes": 15, "absoluteHours": 8 }
    },
    "revocation": {
      "triggers": ["logout", "logout-all", "password-change", "security-incident", "account-suspension"],
      "automatic": true
    },
    "passwordChangeInvalidation": {
      "invalidateAll": true,
      "requireReauth": true
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [AUTH_DEVICE_CONTEXT_MODEL.md](./AUTH_DEVICE_CONTEXT_MODEL.md) — Device context model
- [../state/auth-session-map.json](../state/auth-session-map.json) — Session mappings

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
