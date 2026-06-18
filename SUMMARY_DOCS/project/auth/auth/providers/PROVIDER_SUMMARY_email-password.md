---
title: Email+Password Auth Provider Summary
description: Сводка по провайдеру Email+Password для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - provider
  - email-password
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/contracts/PROVIDER_CONTRACT_email-password.md
---

# 📧 EMAIL+PASSWORD AUTH PROVIDER SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 OVERVIEW

**Email+Password** — это локальный провайдер аутентификации на основе учётных данных.

**Тип:** Local credentials provider

---

## 📊 PROVIDER DETAILS

| Property | Value |
|----------|-------|
| **providerId** | email-password |
| **displayName** | E-mail + Password |
| **phase** | 1 |
| **type** | local-credentials |
| **primaryIdentityAnchor** | Email |
| **deliveryChannels** | Direct form input |

---

## 🔐 PASSWORD POLICY

| Requirement | Value |
|-------------|-------|
| **Minimum Length** | 8 characters |
| **Uppercase** | Required (A-Z) |
| **Lowercase** | Required (a-z) |
| **Number** | Required (0-9) |
| **Special Character** | Required (!@#$%^&*) |
| **Common Passwords** | Blocked (top 10000) |
| **Hashing** | Argon2id or bcrypt (cost >= 12) |

---

## 🔒 SECURITY REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| **Password Hashing** | Argon2id or bcrypt |
| **Email Verification** | Mandatory before first login |
| **Session Binding** | Yes |
| **Audit Logging** | Yes |
| **Invalidation on Change** | All sessions invalidated |

---

## 📋 BINDING RULES

### Mandatory Bindings

| Binding | Description |
|---------|-------------|
| **Email** | Verified email address |

### Optional Bindings

| Binding | Description |
|---------|-------------|
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
  "emailPasswordProvider": {
    "providerId": "email-password",
    "type": "local-credentials",
    "phase": 1,
    "identityAnchor": "email",
    "passwordPolicy": {
      "minLength": 8,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumber": true,
      "requireSpecial": true
    }
  }
}
```

---

**🎈 Balloo - Переверни общение!**
