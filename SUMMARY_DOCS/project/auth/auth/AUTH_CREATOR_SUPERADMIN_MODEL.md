---
title: Auth Creator-Superadmin Model
description: Модель авторизации creator-superadmin Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - creator-superadmin
  - privileged
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/CREATOR_SUPERADMIN_ACCOUNT.md
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
---

# 👑 AUTH CREATOR-SUPERADMIN MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **авторизацию creator-superadmin** как отдельной privileged identity.

**Цель:** Обеспечить максимальную безопасность для canonical creator account.

---

## 👑 CANONICAL IDENTITY

### Fixed Profile

| Field | Value | Immutable |
|-------|-------|-----------|
| **fullName** | Оберюхтин Иван Анатольевич | ✅ Yes |
| **email** | o8eryuhtin@yandex.ru | ✅ Yes |
| **phone** | 89292167585 | ✅ Yes |
| **gender** | male | ✅ Yes |
| **birthDate** | 06.04.1993 | ✅ Yes |
| **registrationDate** | 14.06.2026 | ✅ Yes |
| **projectStartDate** | 14.06.2026 | ✅ Yes |
| **role** | creator-superadmin | ✅ Yes |
| **authorityLevel** | L10 | ✅ Yes |

### Auth Configuration

| Field | Value |
|-------|-------|
| **authMethod** | Dedicated login + password |
| **accessClass** | maximal / full-node-admin / superadmin-only |
| **requiredBindings** | Email + Phone (both mandatory) |
| **securityClass** | highest |
| **auditRequired** | true (maximum level) |
| **isolatedFromCommonProviders** | ✅ Yes |

---

## 🔐 SEPARATION FROM COMMON PROVIDERS

### NOT Used By Creator-Superadmin

| Provider | Reason |
|----------|--------|
| **Yandex.ID** | External provider — not allowed for creator |
| **Phone OTP** | Common provider — creator uses dedicated auth |
| **MAX** | Common provider — creator uses dedicated auth |
| **Gosuslugi** | External provider — not allowed for creator |
| **QR-Code** | Session transfer — creator uses dedicated auth |

### Dedicated Auth Only

| Aspect | Creator-Superadmin | Common Users |
|--------|-------------------|--------------|
| **Login Method** | Dedicated login + password | Provider-based |
| **Identity Source** | Fixed canonical profile | Provider identity |
| **Bindings** | Email + phone mandatory | Provider-dependent |
| **Recovery** | Restricted, special process | Standard recovery |
| **Sessions** | May be isolated | Standard sessions |
| **Cross-Entry** | May be isolated | Standard cross-entry |
| **Audit** | Maximum level | Standard level |

---

## 🔑 AUTH FLOW

### Creator-Superadmin Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Access privileged entry point                           │
│ - Creator-superadmin accesses system                            │
│ - System routes to dedicated auth endpoint                      │
│ - Common login UI bypassed                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Enter dedicated credentials                             │
│ - Login: canonical identifier (fixed)                           │
│ - Password: creator password                                    │
│ - No provider selection                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Validate credentials                                    │
│ - Verify login matches canonical                                │
│ - Verify password (argon2id/bcrypt)                             │
│ - Verify email binding exists                                   │
│ - Verify phone binding exists                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Create privileged session                               │
│ - Session marked as privileged                                  │
│ - Session may be isolated from common sessions                  │
│ - Maximum audit logging enabled                                 │
│ - Shorter idle timeout (15 minutes)                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Grant full platform access                              │
│ - All node groups accessible (A, B, C, D, E)                    │
│ - All actions authorized (subject to audit)                     │
│ - Override authority enabled                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY REQUIREMENTS

### Password Requirements

| Requirement | Value |
|-------------|-------|
| **Minimum Length** | 16 characters (higher than standard) |
| **Character Classes** | All 4 required (upper, lower, number, special) |
| **Hashing** | Argon2id with high cost factor |
| **Rotation** | Recommended every 60 days |
| **History** | Last 10 passwords blocked |

### Session Requirements

| Requirement | Value |
|-------------|-------|
| **Idle Timeout** | 15 minutes (shorter than standard) |
| **Absolute Timeout** | 8 hours (shorter than standard) |
| **Concurrent Sessions** | Maximum 3 (lower than standard) |
| **Device Binding** | Strict device fingerprint |
| **IP Binding** | Optional IP whitelist |
| **MFA** | Recommended (future enhancement) |

### Audit Requirements

| Event | Audit Level | Details |
|-------|-------------|---------|
| **Login** | Maximum | Full details, IP, device, timestamp |
| **Logout** | Maximum | Full details, session duration |
| **Failed Login** | Maximum | Full details, alert on 3+ failures |
| **Session Created** | Maximum | Full session details |
| **Session Revoked** | Maximum | Reason, initiator |
| **Password Change** | Maximum | Before/after hash comparison |
| **Binding Change** | Maximum | Old/new binding details |
| **Privileged Action** | Maximum | Action, target, result |

---

## 🚫 ISOLATION RULES

### Auth Flow Isolation

| Rule | Description |
|------|-------------|
| **Separate Endpoint** | Dedicated auth endpoint, not shared with common users |
| **Separate UI** | Dedicated login UI, not mixed with provider selection |
| **Separate Session Store** | Sessions may be stored separately |
| **Separate Audit Log** | Audit logs at maximum level, separate stream |

### Cross-Entry Isolation

| Rule | Description |
|------|-------------|
| **Optional Isolation** | Creator-superadmin may bypass standard cross-entry |
| **Privileged-Only Cross-Entry** | May only auto-login to privileged nodes |
| **Manual Re-Auth** | May require manual re-auth for non-privileged nodes |
| **Session Isolation** | Privileged sessions not reused for common nodes |

### Recovery Isolation

| Rule | Description |
|------|-------------|
| **No Standard Recovery** | Standard password recovery NOT available |
| **Special Process** | Separate recovery process with additional verification |
| **No Self-Service** | No self-service recovery options |
| **Manual Verification** | Manual identity verification required |

---

## 📊 BINDING REQUIREMENTS

### Mandatory Bindings

| Binding | Value | Verification |
|---------|-------|--------------|
| **Email** | o8eryuhtin@yandex.ru | Verified at creation, immutable |
| **Phone** | 89292167585 | Verified at creation, immutable |

### Binding Validation

```typescript
async function validateCreatorSuperadminBindings(): Promise<boolean> {
  const creator = await getCreatorSuperadmin();
  
  // Check email binding
  if (!creator.email || creator.email !== 'o8eryuhtin@yandex.ru') {
    throw new Error('Creator-superadmin email binding invalid');
  }
  if (!creator.emailVerified) {
    throw new Error('Creator-superadmin email not verified');
  }
  
  // Check phone binding
  if (!creator.phone || creator.phone !== '89292167585') {
    throw new Error('Creator-superadmin phone binding invalid');
  }
  if (!creator.phoneVerified) {
    throw new Error('Creator-superadmin phone not verified');
  }
  
  return true;
}
```

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authCreatorSuperadminModel": {
    "canonicalIdentity": {
      "fullName": "Оберюхтин Иван Анатольевич",
      "email": "o8eryuhtin@yandex.ru",
      "phone": "89292167585",
      "gender": "male",
      "birthDate": "06.04.1993",
      "registrationDate": "14.06.2026",
      "projectStartDate": "14.06.2026",
      "role": "creator-superadmin",
      "authorityLevel": "L10"
    },
    "authConfig": {
      "authMethod": "login+password",
      "accessClass": "maximal",
      "requiredBindings": ["email", "phone"],
      "securityClass": "highest",
      "auditRequired": true,
      "isolatedFromCommonProviders": true
    },
    "notUsedProviders": ["yandex-id", "phone-3char-code", "max", "gosuslugi", "qr-code"],
    "securityRequirements": {
      "passwordMinLength": 16,
      "idleTimeoutMinutes": 15,
      "absoluteTimeoutHours": 8,
      "maxConcurrentSessions": 3,
      "hashingAlgorithm": "argon2id"
    },
    "isolationRules": {
      "separateEndpoint": true,
      "separateUI": true,
      "separateSessionStore": true,
      "separateAuditLog": true,
      "crossEntryIsolation": true,
      "recoveryIsolation": true
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [CREATOR_SUPERADMIN_ACCOUNT.md](./CREATOR_SUPERADMIN_ACCOUNT.md) — Account profile
- [../access/ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy
- [../contracts/auth/AuthCreatorSuperadminContract.md](../contracts/auth/AuthCreatorSuperadminContract.md) — Contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
