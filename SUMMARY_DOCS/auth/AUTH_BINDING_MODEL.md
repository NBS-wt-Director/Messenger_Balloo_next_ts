---
title: Auth Binding Model
description: Модель привязки идентичностей Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - binding
  - identity
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/state/auth-binding-map.json
---

# 🔗 AUTH BINDING MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **привязку идентичностей** к аккаунтам Balloo.

**Цель:** Обеспечить единую binding model для всех провайдеров.

---

## 📊 IDENTITY TYPES

### Supported Identity Types

| Type | Description | Providers |
|------|-------------|-----------|
| **email** | Email address | email-password, recovery |
| **phone** | Phone number | phone-3char-code, max |
| **yandex-user-id** | Yandex external ID | yandex-id |
| **gosuslugi-user-id** | Gosuslugi external ID | gosuslugi |
| **login-password** | Dedicated login | creator-superadmin |

---

## 🔗 BINDING RULES

### Mandatory Bindings

| Provider | Mandatory Bindings |
|----------|-------------------|
| **email-password** | email (verified) |
| **phone-3char-code** | phone (verified) |
| **yandex-id** | yandex-user-id |
| **gosuslugi** | gosuslugi-user-id |
| **max** | phone (verified) |
| **qr-code** | existing-session |
| **creator-superadmin** | email + phone + login-password |

### Optional Bindings

| Provider | Optional Bindings |
|----------|------------------|
| **email-password** | phone (for recovery) |
| **phone-3char-code** | email (for recovery) |
| **yandex-id** | email, phone |
| **gosuslugi** | email, phone |
| **max** | email (for recovery) |

---

## 🔄 BINDING LIFECYCLE

### Binding Creation

```
1. User authenticates with provider
2. System extracts identity from provider
3. System checks for existing binding
4. If no binding: create new binding
5. If existing binding: link to account
6. Verify binding (if required)
7. Binding active
```

### Binding Verification

| Identity Type | Verification Method |
|--------------|---------------------|
| **email** | Verification email with link/code |
| **phone** | OTP code via SMS/bot |
| **yandex-user-id** | OAuth token validation |
| **gosuslugi-user-id** | ESIA claims validation |
| **login-password** | creator-superadmin setup |

### Binding Removal

| Trigger | Action |
|---------|--------|
| **User request** | Remove binding (if not mandatory) |
| **Account deletion** | Remove all bindings |
| **Security incident** | Remove compromised bindings |
| **Provider deprecation** | Migrate or remove bindings |

---

## ⚠️ DUPLICATE RESOLUTION

### Duplicate Detection

| Identity Type | Duplicate Policy |
|--------------|------------------|
| **email** | Reject duplicate |
| **phone** | Reject duplicate |
| **yandex-user-id** | Link to existing account |
| **gosuslugi-user-id** | Link to existing account |
| **login-password** | Unique (creator-superadmin only) |

### Resolution Rules

```typescript
async function resolveDuplicateBinding(
  identityType: string,
  identityValue: string,
  existingAccountId: string
): Promise<BindingResolution> {
  switch (identityType) {
    case 'email':
    case 'phone':
      // Reject duplicate
      return { action: 'reject', message: 'Identity already bound' };
    
    case 'yandex-user-id':
    case 'gosuslugi-user-id':
      // Link to existing account
      return { 
        action: 'link', 
        accountId: existingAccountId,
        message: 'Identity linked to existing account'
      };
    
    default:
      return { action: 'error', message: 'Unknown identity type' };
  }
}
```

---

## 🔐 RECOVERY RELEVANCE

### Recovery Bindings

| Binding | Recovery Use |
|---------|--------------|
| **email** | Password reset, account recovery |
| **phone** | Password reset, account recovery, 2FA |
| **yandex-user-id** | Not for recovery |
| **gosuslugi-user-id** | Not for recovery |
| **login-password** | Special creator-superadmin process |

### Recovery Flow

```
1. User requests recovery
2. System checks available recovery bindings
3. System sends recovery code to binding
4. User enters recovery code
5. System validates code
6. User sets new password
7. All sessions invalidated
8. Recovery complete
```

---

## 👑 CREATOR-SUPERADMIN BINDINGS

### Special Rules

| Rule | Description |
|------|-------------|
| **Email Mandatory** | o8eryuhtin@yandex.ru |
| **Phone Mandatory** | 89292167585 |
| **Login-Password Mandatory** | Dedicated credentials |
| **Immutable** | Bindings cannot be changed |
| **Verified at Creation** | All bindings verified during setup |
| **No Recovery Bindings** | Special recovery process only |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authBindingModel": {
    "identityTypes": ["email", "phone", "yandex-user-id", "gosuslugi-user-id", "login-password"],
    "mandatoryBindings": {
      "email-password": ["email"],
      "phone-3char-code": ["phone"],
      "yandex-id": ["yandex-user-id"],
      "gosuslugi": ["gosuslugi-user-id"],
      "max": ["phone"],
      "creator-superadmin": ["email", "phone", "login-password"]
    },
    "duplicatePolicy": {
      "email": "reject",
      "phone": "reject",
      "yandex-user-id": "link-to-existing",
      "gosuslugi-user-id": "link-to-existing"
    },
    "recoveryBindings": ["email", "phone"],
    "creatorSuperadmin": {
      "email": "o8eryuhtin@yandex.ru",
      "phone": "89292167585",
      "immutable": true
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [AUTH_PROVIDER_MODEL.md](./AUTH_PROVIDER_MODEL.md) — Provider model
- [../state/auth-binding-map.json](../state/auth-binding-map.json) — Binding mappings

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
