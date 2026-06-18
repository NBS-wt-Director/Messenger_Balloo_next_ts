---
title: Yandex.ID Auth Provider Summary
description: Сводка по провайдеру Yandex.ID для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - provider
  - yandex-id
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/contracts/PROVIDER_CONTRACT_yandex-id.md
---

# 🔐 YANDEX.ID AUTH PROVIDER SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 OVERVIEW

**Yandex.ID** — это внешний провайдер аутентификации на основе OAuth/OIDC.

**Тип:** External identity provider / OIDC-like social auth provider

---

## 📊 PROVIDER DETAILS

| Property | Value |
|----------|-------|
| **providerId** | yandex-id |
| **displayName** | Yandex.ID |
| **phase** | 1 |
| **type** | external-oidc |
| **primaryIdentityAnchor** | Yandex provider user ID |
| **deliveryChannels** | OAuth redirect |

---

## 🔐 AUTHENTICATION FLOW

```
1. User selects "Login with Yandex"
2. System redirects to Yandex OAuth endpoint
3. User authenticates with Yandex
4. Yandex returns authorization code
5. System exchanges code for access token
6. System validates token and fetches user info
7. System creates/links Balloo account
8. System creates auth session
```

---

## 🔒 SECURITY REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| **Token Validation** | Verify signature with Yandex public key |
| **State Parameter** | CSRF protection required |
| **PKCE** | Recommended for public clients |
| **Session Binding** | Yes, bound to device/browser |
| **Audit Logging** | Yes, all events logged |

---

## 📋 BINDING RULES

### Mandatory Bindings

| Binding | Description |
|---------|-------------|
| **Yandex User ID** | External provider identity |

### Optional Bindings

| Binding | Description |
|---------|-------------|
| **Email** | Can be linked for recovery |
| **Phone** | Can be linked for recovery |

---

## 🗂️ APPLICABILITY

| Environment | Supported |
|-------------|-----------|
| **production** | ✅ Yes |
| **alpha** | ✅ Yes |
| **working** | ✅ Yes |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "yandexIdProvider": {
    "providerId": "yandex-id",
    "type": "external-oidc",
    "phase": 1,
    "identityAnchor": "provider-user-id",
    "flow": ["oauth-redirect", "token-exchange", "user-info", "session-create"]
  }
}
```

---

**🎈 Balloo - Переверни общение!**
