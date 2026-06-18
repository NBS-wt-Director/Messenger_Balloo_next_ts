---
title: Auth Provider Model
description: Модель провайдеров авторизации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - providers
  - model
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_BINDING_MODEL.md
  - SUMMARY_DOCS/state/auth-providers.json
---

# 🔐 AUTH PROVIDER MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **все провайдеры авторизации** платформы Balloo.

**Цель:** Обеспечить полную спецификацию auth providers для humans и AI-codegen.

---

## 📊 PROVIDER OVERVIEW

| Provider | Phase | Type | Identity Anchor | Status |
|----------|-------|------|-----------------|--------|
| **yandex-id** | 1 | External OIDC | Yandex user ID | Active |
| **email-password** | 1 | Local credentials | Email | Active |
| **phone-3char-code** | 1 | Phone OTP | Phone number | Active |
| **gosuslugi** | 2 | State identity | Gov ID | Planned |
| **max** | 2 | Messenger code | Phone number | Planned |
| **qr-code** | 2 | Device transfer | Existing session | Planned |
| **creator-superadmin** | N/A | Dedicated privileged | Login + Email + Phone | Always Active |

---

## 🚀 PHASE 1 PROVIDERS

### 1. Yandex.ID

| Field | Value |
|-------|-------|
| **providerId** | yandex-id |
| **displayName** | Yandex.ID |
| **phase** | 1 |
| **type** | External identity provider / OIDC-like social auth provider |
| **primaryIdentityAnchor** | External provider user ID, email if provided |
| **requiredData** | Provider user ID, email if available |
| **optionalData** | Display name, avatar |
| **deliveryChannels** | OAuth redirect |
| **mandatoryBindings** | Provider user ID |
| **optionalBindings** | Email, phone |
| **supportedEnvironments** | production, alpha, working |
| **supportedNodeClasses** | E, C, D |
| **securityRequirements** | Token validation, session binding, audit logging |
| **enabledByDefault** | true |

**Flow:**
1. User selects "Login with Yandex"
2. System redirects to Yandex OAuth
3. User authenticates with Yandex
4. Yandex returns user info + token
5. System validates token
6. System creates/links Balloo account
7. System creates session

### 2. Email + Password

| Field | Value |
|-------|-------|
| **providerId** | email-password |
| **displayName** | E-mail + Password |
| **phase** | 1 |
| **type** | Local credentials provider |
| **primaryIdentityAnchor** | Email |
| **requiredData** | Valid email, password meeting policy |
| **optionalData** | Display name, phone |
| **deliveryChannels** | Direct form input |
| **mandatoryBindings** | Email (verified) |
| **optionalBindings** | Phone |
| **supportedEnvironments** | production, alpha, working |
| **supportedNodeClasses** | E, C, D |
| **securityRequirements** | Password hashing, password policy, email verification, session binding, audit logging, invalidation on password change |
| **enabledByDefault** | true |

**Password Policy:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- No common passwords
- No email substring

**Flow:**
1. User enters email + password
2. System validates email format
3. System validates password policy
4. System verifies email (if first login)
5. System validates credentials
6. System creates session

### 3. Phone + 3-Character Code

| Field | Value |
|-------|-------|
| **providerId** | phone-3char-code |
| **displayName** | Phone + 3-character code |
| **phase** | 1 |
| **type** | Phone-based one-time code provider |
| **primaryIdentityAnchor** | Phone number |
| **requiredData** | Valid phone number, 3-character code |
| **codeFormat** | 3 characters (digits or alphanumeric) |
| **deliveryChannels** | SMS, internal bot if second device online |
| **mandatoryBindings** | Phone number |
| **optionalBindings** | Email |
| **supportedEnvironments** | production, alpha, working |
| **supportedNodeClasses** | E, C, D |
| **securityRequirements** | Short expiry (5 min), one-time use, replay protection, rate limiting, audit logging, session binding |
| **enabledByDefault** | true |

**Code Policy:**
- 3 characters (digits 0-9)
- Expires in 5 minutes
- One-time use only
- Max 3 attempts per code
- Rate limit: 5 codes per hour per phone
- Replay protection: code invalidated after use

**Flow:**
1. User enters phone number
2. System validates phone format
3. System generates 3-char code
4. System sends code via SMS (or bot)
5. User enters code
6. System validates code
7. System creates/links account
8. System creates session

---

## 🚀 PHASE 2 PROVIDERS

### 4. Gosuslugi

| Field | Value |
|-------|-------|
| **providerId** | gosuslugi |
| **displayName** | Госуслуги |
| **phase** | 2 |
| **type** | State identity provider |
| **primaryIdentityAnchor** | Verified government identity |
| **requiredData** | Gosuslugi user ID, verified claims |
| **optionalData** | Email, phone from Gosuslugi profile |
| **deliveryChannels** | Gosuslugi OAuth/ESIA |
| **mandatoryBindings** | Gosuslugi user ID |
| **optionalBindings** | Email, phone |
| **supportedEnvironments** | production (when enabled) |
| **supportedNodeClasses** | E |
| **securityRequirements** | Claims verification, audit logging, session binding |
| **enabledByDefault** | false (requires explicit enablement) |

**Flow:**
1. User selects "Login with Gosuslugi"
2. System redirects to Gosuslugi ESIA
3. User authenticates with Gosuslugi
4. Gosuslugi returns verified claims
5. System verifies claims
6. System creates/links Balloo account
7. System creates session

### 5. MAX

| Field | Value |
|-------|-------|
| **providerId** | max |
| **displayName** | MAX |
| **phase** | 2 |
| **type** | Messenger-based phone code authentication provider |
| **primaryIdentityAnchor** | Phone number |
| **authFactor** | Phone number + one-time code via MAX bot |
| **deliveryChannel** | Bot in MAX messenger |
| **requiredData** | Valid phone number bound to Balloo account |
| **optionalData** | Email for recovery |
| **mandatoryBindings** | Phone number |
| **optionalBindings** | Email |
| **supportedEnvironments** | production, alpha (when enabled) |
| **supportedNodeClasses** | E, C |
| **securityRequirements** | Code expiry (5 min), one-time use, replay protection, rate limiting, bot-delivery verification, audit logging, session binding |
| **enabledByDefault** | false (requires explicit enablement) |

**⚠️ IMPORTANT:** MAX is NOT OAuth/social profile login. MAX is phone-first messenger-code authentication.

**Flow:**
1. User enters phone number
2. System finds account binding by phone
3. System sends one-time code via MAX bot
4. User receives code in MAX messenger
5. User enters code
6. System validates code
7. System confirms login and creates auth session
8. Device/browser context linked to session trust model

### 6. QR-Code

| Field | Value |
|-------|-------|
| **providerId** | qr-code |
| **displayName** | QR-Code |
| **phase** | 2 |
| **type** | Device-linked session transfer provider |
| **primaryIdentityAnchor** | Existing authenticated session on another device |
| **requiredData** | Valid QR code from authenticated session |
| **deliveryChannels** | QR code display + scanner |
| **mandatoryBindings** | Existing authenticated session |
| **optionalBindings** | N/A |
| **supportedEnvironments** | production, alpha, working |
| **supportedNodeClasses** | E, C, D |
| **securityRequirements** | QR expiry (2 min), one-time use, device binding, audit logging, session transfer validation |
| **enabledByDefault** | false (requires explicit enablement) |

**Flow:**
1. User opens QR login on new device
2. QR code displayed
3. User scans QR with authenticated device
4. User confirms trust transfer on authenticated device
5. System validates QR and creates session on new device
6. New device authenticated

---

## 👑 CREATOR-SUPERADMIN AUTH

| Field | Value |
|-------|-------|
| **providerId** | creator-superadmin |
| **displayName** | Creator Superadmin |
| **phase** | N/A (Always Active) |
| **type** | Dedicated privileged identity |
| **primaryIdentityAnchor** | Login + Email + Phone |
| **authMethod** | Dedicated login + password |
| **requiredBindings** | Email (o8eryuhtin@yandex.ru), Phone (89292167585) |
| **isolationRules** | Not linked to common providers, separate auth flow |
| **supportedEnvironments** | All (production, alpha, working) |
| **supportedNodeClasses** | All (A, B, C, D, E) |
| **securityRequirements** | Highest security, full audit, mandatory bindings |

**⚠️ IMPORTANT:** Creator-superadmin does NOT use common auth providers (Yandex.ID, phone OTP, MAX, Gosuslugi, QR-code).

---

## 📊 PROVIDER COMPARISON

| Provider | Phase | Identity | Delivery | Expiry | One-Time |
|----------|-------|----------|----------|--------|----------|
| yandex-id | 1 | Yandex ID | OAuth | Session | No |
| email-password | 1 | Email | Form | Session | No |
| phone-3char-code | 1 | Phone | SMS/Bot | 5 min | Yes |
| gosuslugi | 2 | Gov ID | ESIA | Session | No |
| max | 2 | Phone | MAX Bot | 5 min | Yes |
| qr-code | 2 | Session | QR | 2 min | Yes |
| creator-superadmin | N/A | Login+Email+Phone | Form | Session | No |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authProviderModel": {
    "phase1": ["yandex-id", "email-password", "phone-3char-code"],
    "phase2": ["gosuslugi", "max", "qr-code"],
    "creatorSuperadmin": {
      "providerId": "creator-superadmin",
      "authMethod": "login+password",
      "isolatedFromCommonProviders": true
    },
    "providers": [
      {
        "providerId": "yandex-id",
        "type": "external-oidc",
        "identityAnchor": "provider-user-id"
      },
      {
        "providerId": "email-password",
        "type": "local-credentials",
        "identityAnchor": "email"
      },
      {
        "providerId": "phone-3char-code",
        "type": "phone-otp",
        "identityAnchor": "phone",
        "codeLength": 3,
        "expiryMinutes": 5
      },
      {
        "providerId": "max",
        "type": "messenger-code",
        "identityAnchor": "phone",
        "deliveryChannel": "MAX-bot",
        "note": "NOT OAuth, phone-first messenger-code auth"
      },
      {
        "providerId": "qr-code",
        "type": "device-transfer",
        "identityAnchor": "existing-session",
        "expiryMinutes": 2
      }
    ]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [AUTH_BINDING_MODEL.md](./AUTH_BINDING_MODEL.md) — Binding model
- [../state/auth-providers.json](../state/auth-providers.json) — Provider registry
- [../state/auth-provider-phases.json](../state/auth-provider-phases.json) — Phase definitions

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
