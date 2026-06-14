---
title: Gosuslugi Auth Provider Summary
description: Сводка по провайдеру Госуслуги для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - provider
  - gosuslugi
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/contracts/PROVIDER_CONTRACT_gosuslugi.md
---

# 🏛️ GOSUSLUGI AUTH PROVIDER SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 OVERVIEW

**Gosuslugi** — это провайдер аутентификации на основе государственной идентичности РФ.

**Тип:** State identity provider

---

## 📊 PROVIDER DETAILS

| Property | Value |
|----------|-------|
| **providerId** | gosuslugi |
| **displayName** | Госуслуги |
| **phase** | 2 |
| **type** | state-identity |
| **primaryIdentityAnchor** | Verified government identity |
| **deliveryChannels** | ESIA OAuth |

---

## 🔐 AUTHENTICATION FLOW

```
1. User selects "Login with Gosuslugi"
2. System redirects to Gosuslugi ESIA
3. User authenticates with Gosuslugi
4. Gosuslugi returns verified claims
5. System verifies claims
6. System creates/links Balloo account
7. System creates auth session
```

---

## 🔒 SECURITY REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| **Claims Verification** | Verify all ESIA claims |
| **Session Binding** | Yes |
| **Audit Logging** | Yes |
| **Environment** | Production only (when enabled) |

---

## 📋 BINDING RULES

### Mandatory Bindings

| Binding | Description |
|---------|-------------|
| **Gosuslugi User ID** | External government identity |

### Optional Bindings

| Binding | Description |
|---------|-------------|
| **Email** | From Gosuslugi profile |
| **Phone** | From Gosuslugi profile |

---

## 🗂️ APPLICABILITY

| Environment | Supported |
|-------------|-----------|
| **production** | ✅ Yes (when enabled) |
| **alpha** | ❌ No |
| **working** | ❌ No |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "gosuslugiProvider": {
    "providerId": "gosuslugi",
    "type": "state-identity",
    "phase": 2,
    "identityAnchor": "gov-id",
    "enabledByDefault": false
  }
}
```

---

**🎈 Balloo - Переверни общение!**
