---
title: MAX Auth Provider Summary
description: Сводка по провайдеру MAX для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - provider
  - max
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/contracts/PROVIDER_CONTRACT_max.md
---

# 📱 MAX AUTH PROVIDER SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 OVERVIEW

**MAX** — это провайдер аутентификации на основе телефонного кода через бота в мессенджере MAX.

**⚠️ ВАЖНО:** MAX — это НЕ OAuth/social provider. MAX — это phone-first messenger-code authentication.

---

## 📊 PROVIDER DETAILS

| Property | Value |
|----------|-------|
| **providerId** | max |
| **displayName** | MAX |
| **phase** | 2 |
| **type** | Messenger-based phone code authentication provider |
| **primaryIdentityAnchor** | Phone number |
| **authFactor** | Phone number + one-time code via MAX bot |
| **deliveryChannel** | Bot in MAX messenger |

---

## 🔐 AUTHENTICATION FLOW

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User enters phone number                                │
│ - User inputs phone number on login form                        │
│ - System validates phone format                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: System finds account by phone binding                   │
│ - System searches for Balloo account bound to this phone        │
│ - If no account found, authentication fails                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: System generates one-time code                          │
│ - 3-character code generated (digits 0-9)                       │
│ - Code stored with 5-minute expiry                              │
│ - One-time use enforced                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: System sends code via MAX bot                           │
│ - Code delivered through MAX messenger bot                      │
│ - NOT via SMS (different from phone-3char-code provider)        │
│ - Bot delivery verified                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: User enters code                                        │
│ - User receives code in MAX messenger                           │
│ - User enters code on login form                                │
│ - System validates code                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: System confirms login and creates session               │
│ - Code validated successfully                                   │
│ - Auth session created                                          │
│ - Device/browser context linked to session trust model          │
│ - User authenticated                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| **Code Length** | 3 characters (digits 0-9) |
| **Code Expiry** | 5 minutes |
| **One-Time Use** | Yes, invalidated after use |
| **Replay Protection** | Yes, code stored and checked |
| **Rate Limiting** | 5 codes per hour per phone |
| **Max Attempts** | 3 attempts per code |
| **Bot Delivery Verification** | Yes, confirm bot delivery |
| **Audit Logging** | Yes, all events logged |
| **Session Binding** | Yes, bound to device/browser |

---

## 📋 BINDING RULES

### Mandatory Bindings

| Binding | Description |
|---------|-------------|
| **Phone** | Phone number must be bound to Balloo account |

### Optional Bindings

| Binding | Description |
|---------|-------------|
| **Email** | Email can be attached for recovery |

### Binding Precedence

| Scenario | Resolution |
|----------|------------|
| Phone already bound | Use existing binding |
| Phone not bound | Authentication fails |
| Multiple accounts with same phone | Error (should not happen) |

---

## 🗂️ APPLICABILITY

### Supported Environments

| Environment | Supported | Notes |
|-------------|-----------|-------|
| **production** | ✅ Yes (when enabled) | Phase 2 |
| **alpha** | ✅ Yes (when enabled) | Phase 2 |
| **working** | ⚠️ Explicit only | Not default |

### Supported Node Classes

| Node Class | Supported | Notes |
|------------|-----------|-------|
| **E (Production)** | ✅ Yes | Public nodes |
| **C (Alpha)** | ✅ Yes | Alpha nodes |
| **D (Sandbox)** | ❌ No | Not applicable |
| **A (Privileged)** | ❌ No | Creator-superadmin only |

---

## ⚠️ IMPORTANT DISTINCTIONS

### MAX vs Phone+3Char-Code

| Aspect | MAX | Phone+3Char-Code |
|--------|-----|------------------|
| **Phase** | 2 | 1 |
| **Delivery** | MAX bot | SMS or internal bot |
| **Prerequisite** | Account must exist with phone binding | Any phone number |
| **Type** | Messenger-code | Phone OTP |
| **OAuth** | ❌ No | ❌ No |

### MAX vs Yandex.ID

| Aspect | MAX | Yandex.ID |
|--------|-----|-----------|
| **Type** | Messenger-code | External OIDC |
| **Identity** | Phone number | Yandex user ID |
| **OAuth** | ❌ No | ✅ Yes |
| **Profile** | ❌ No profile data | ✅ Profile data available |

### MAX Is NOT

| Myth | Reality |
|------|---------|
| OAuth provider | ❌ MAX is NOT OAuth |
| Social login | ❌ MAX is NOT social profile |
| External identity | ❌ MAX uses internal phone binding |
| Profile provider | ❌ MAX does NOT provide profile data |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "maxProvider": {
    "providerId": "max",
    "displayName": "MAX",
    "phase": 2,
    "type": "messenger-code",
    "primaryIdentityAnchor": "phone",
    "deliveryChannel": "max-bot",
    "importantNote": "NOT OAuth/social provider, phone-first messenger-code authentication",
    "flow": [
      "user-enters-phone",
      "system-finds-account-by-phone",
      "system-generates-code",
      "system-sends-via-max-bot",
      "user-enters-code",
      "system-confirms-login"
    ],
    "security": {
      "codeLength": 3,
      "expiryMinutes": 5,
      "oneTimeUse": true,
      "replayProtection": true,
      "rateLimitPerHour": 5
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_PROVIDER_MODEL.md](../AUTH_PROVIDER_MODEL.md) — Provider model
- [../contracts/PROVIDER_CONTRACT_max.md](../contracts/PROVIDER_CONTRACT_max.md) — Provider contract
- [../state/auth-providers.json](../../state/auth-providers.json) — Provider registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
