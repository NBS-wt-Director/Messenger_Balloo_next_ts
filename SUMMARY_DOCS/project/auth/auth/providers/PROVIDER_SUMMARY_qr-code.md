---
title: QR-Code Auth Provider Summary
description: Сводка по провайдеру QR-Code для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - provider
  - qr-code
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/contracts/PROVIDER_CONTRACT_qr-code.md
---

# 📷 QR-CODE AUTH PROVIDER SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 OVERVIEW

**QR-Code** — это провайдер аутентификации на основе передачи сессии через QR-код.

**Тип:** Device-linked session transfer provider

---

## 📊 PROVIDER DETAILS

| Property | Value |
|----------|-------|
| **providerId** | qr-code |
| **displayName** | QR-Code |
| **phase** | 2 |
| **type** | device-transfer |
| **primaryIdentityAnchor** | Existing authenticated session |
| **deliveryChannels** | QR code display + scanner |

---

## 🔐 AUTHENTICATION FLOW

```
1. User opens QR login on new device
2. QR code displayed on new device
3. User scans QR with authenticated device
4. User confirms trust transfer on authenticated device
5. System validates QR and creates session on new device
6. New device authenticated
```

---

## 🔒 SECURITY REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| **QR Expiry** | 2 minutes |
| **One-Time Use** | Yes |
| **Device Binding** | Yes |
| **Confirmation Required** | Yes (on source device) |
| **Audit Logging** | Yes |

---

## 📋 BINDING RULES

### Mandatory Bindings

| Binding | Description |
|---------|-------------|
| **Existing Session** | Must have authenticated session on source device |

### Optional Bindings

| Binding | Description |
|---------|-------------|
| **N/A** | No optional bindings |

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
  "qrCodeProvider": {
    "providerId": "qr-code",
    "type": "device-transfer",
    "phase": 2,
    "identityAnchor": "existing-session",
    "qrExpiryMinutes": 2,
    "oneTimeUse": true
  }
}
```

---

**🎈 Balloo - Переверни общение!**
