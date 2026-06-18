---
title: Phone+3Char-Code Auth Provider Summary
description: Сводка по провайдеру Phone+3Char-Code для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - provider
  - phone-otp
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/contracts/PROVIDER_CONTRACT_phone-3char-code.md
---

# 📱 PHONE+3CHAR-CODE AUTH PROVIDER SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 OVERVIEW

**Phone+3Char-Code** — это провайдер аутентификации на основе одноразового SMS-кода.

**Тип:** Phone-based one-time code provider

---

## 📊 PROVIDER DETAILS

| Property | Value |
|----------|-------|
| **providerId** | phone-3char-code |
| **displayName** | Phone + 3-character code |
| **phase** | 1 |
| **type** | phone-otp |
| **primaryIdentityAnchor** | Phone number |
| **deliveryChannels** | SMS, internal bot |

---

## 🔐 CODE POLICY

| Requirement | Value |
|-------------|-------|
| **Code Length** | 3 characters (digits 0-9) |
| **Code Expiry** | 5 minutes |
| **One-Time Use** | Yes |
| **Max Attempts** | 3 per code |
| **Rate Limit** | 5 codes per hour per phone |
| **Replay Protection** | Yes |

---

## 🔒 SECURITY REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| **Short Expiry** | 5 minutes |
| **One-Time Use** | Invalidated after use |
| **Rate Limiting** | 5 codes/hour |
| **Session Binding** | Yes |
| **Audit Logging** | Yes |

---

## 📋 BINDING RULES

### Mandatory Bindings

| Binding | Description |
|---------|-------------|
| **Phone** | Verified phone number |

### Optional Bindings

| Binding | Description |
|---------|-------------|
| **Email** | Can be linked for recovery |

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
  "phone3CharCodeProvider": {
    "providerId": "phone-3char-code",
    "type": "phone-otp",
    "phase": 1,
    "identityAnchor": "phone",
    "codePolicy": {
      "codeLength": 3,
      "expiryMinutes": 5,
      "oneTimeUse": true,
      "maxAttempts": 3,
      "rateLimitPerHour": 5
    }
  }
}
```

---

**🎈 Balloo - Переверни общение!**
