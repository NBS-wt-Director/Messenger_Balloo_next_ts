---
title: Auth Device Context Model
description: Модель контекста устройства для авторизации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - device
  - context
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_CROSS_ENTRY_POLICY.md
  - SUMMARY_DOCS/state/auth-device-context-map.json
---

# 📱 AUTH DEVICE CONTEXT MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **контекст устройства и браузера** для кросс-входа.

**Цель:** Обеспечить seamless authentication continuity на всех устройствах.

---

## 📊 CONTEXT HIERARCHY

```
┌─────────────────────────────────────────────────────────┐
│                    DeviceContext                         │
│  - deviceContextKey (canonical device identifier)       │
│  - deviceFingerprint (hardware/software characteristics)│
│  - trustState (trusted | untrusted | revoked)           │
│  - createdAt                                            │
│  - lastActivity                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   BrowserContext                         │
│  - browserContextKey (canonical browser identifier)     │
│  - browserFingerprint (UA, plugins, timezone, etc.)     │
│  - trustCarrier (cookie + fingerprint)                  │
│  - sessionTokens [active sessions]                      │
│  - crossEntryEnabled (true | false)                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     AuthSession                          │
│  - sessionId                                            │
│  - userId                                               │
│  - providerId                                           │
│  - expiresAt                                            │
│  - revoked                                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 DEVICE CONTEXT

### Device Context Key

```typescript
interface DeviceContext {
  deviceContextKey: string;      // Canonical identifier
  deviceFingerprint: {
    screenResolution: string;
    platform: string;
    hardwareConcurrency: number;
    deviceMemory: number;
    // ... other fingerprints
  };
  trustState: 'trusted' | 'untrusted' | 'revoked';
  createdAt: string;             // ISO-8601
  lastActivity: string;          // ISO-8601
  sessionsLinked: string[];      // [sessionIds]
  crossEntryEnabled: boolean;
  privilegedExceptions: {
    isolatedFromStandard: boolean;
    requiresReauth: boolean;
  };
}
```

### Device Fingerprinting

| Factor | Description | Stability |
|--------|-------------|-----------|
| **Screen Resolution** | Display dimensions | High |
| **Platform** | OS/Platform | High |
| **Hardware Concurrency** | CPU cores | High |
| **Device Memory** | RAM estimate | Medium |
| **Timezone** | System timezone | High |
| **Language** | System language | Medium |

---

## 🌐 BROWSER CONTEXT

### Browser Context Key

```typescript
interface BrowserContext {
  browserContextKey: string;     // Canonical identifier
  deviceContextKey: string;      // Parent device reference
  browserFingerprint: {
    userAgent: string;
    languages: string[];
    platform: string;
    plugins: string[];
    timezone: string;
    // ... other fingerprints
  };
  trustCarrier: {
    cookieToken: string;
    fingerprintHash: string;
  };
  sessionTokens: string[];       // [sessionIds]
  lastActivity: string;          // ISO-8601
  crossEntryEnabled: boolean;
}
```

### Trust Carrier

| Component | Purpose | Storage |
|-----------|---------|---------|
| **cookieToken** | Session identification | httpOnly cookie |
| **fingerprintHash** | Browser verification | Server-side |

---

## 🔄 CROSS-ENTRY TRUST

### Trust States

| State | Description | Cross-Entry |
|-------|-------------|-------------|
| **trusted** | Known device, previous successful auth | ✅ Enabled |
| **untrusted** | New device, no history | ⚠️ Requires verification |
| **revoked** | Security incident, manually revoked | ❌ Blocked |

### Trust Transitions

```
untrusted ──────▶ trusted (after successful auth)
     │                │
     │                ▼
     │           revoked (security event)
     │
     └───────────────▶ revoked (failed auth attempts)
```

---

## ⚠️ PRIVILEGED EXCEPTIONS

### creator-superadmin Isolation

| Exception | Description |
|-----------|-------------|
| **Isolated Sessions** | May be stored separately |
| **Separate Device Context** | May use isolated device context |
| **Cross-Entry Bypass** | May bypass standard cross-entry |
| **Enhanced Fingerprinting** | Additional verification factors |

### Privileged Node Isolation

| Exception | Description |
|-----------|-------------|
| **Re-auth Required** | May require re-authentication |
| **Shorter Session** | 15 min idle timeout |
| **Separate Audit** | Maximum audit level |

---

## 📊 CONTEXT PERSISTENCE

### Storage Strategy

| Context | Storage | Lifetime |
|---------|---------|----------|
| **Device Context** | Server-side + cookie | 1 year |
| **Browser Context** | Server-side + cookie | 30 days |
| **Session** | Server-side + cookie | Per session policy |

### Cookie Strategy

```typescript
// Device context cookie
res.cookie('balloo_device', deviceContextKey, {
  domain: '.balloo.su',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
});

// Browser context cookie
res.cookie('balloo_browser', browserContextKey, {
  domain: '.balloo.su',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
});

// Session cookie
res.cookie('balloo_session', sessionToken, {
  domain: '.balloo.su',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
});
```

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authDeviceContextModel": {
    "hierarchy": ["DeviceContext", "BrowserContext", "AuthSession"],
    "deviceContext": {
      "fields": ["deviceContextKey", "deviceFingerprint", "trustState", "crossEntryEnabled"],
      "trustStates": ["trusted", "untrusted", "revoked"]
    },
    "browserContext": {
      "fields": ["browserContextKey", "browserFingerprint", "trustCarrier", "sessionTokens"],
      "trustCarrier": ["cookieToken", "fingerprintHash"]
    },
    "crossEntry": {
      "enabled": true,
      "trustRequired": true,
      "privilegedExceptions": true
    },
    "creatorSuperadminIsolation": {
      "isolatedSessions": true,
      "separateDeviceContext": true,
      "crossEntryBypass": true
    },
    "cookieStrategy": {
      "domain": ".balloo.su",
      "cookies": ["balloo_device", "balloo_browser", "balloo_session"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [AUTH_CROSS_ENTRY_POLICY.md](./AUTH_CROSS_ENTRY_POLICY.md) — Cross-entry policy
- [../state/auth-device-context-map.json](../state/auth-device-context-map.json) — Device context mappings

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
