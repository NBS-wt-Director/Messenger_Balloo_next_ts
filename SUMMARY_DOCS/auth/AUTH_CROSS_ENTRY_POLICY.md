---
title: Auth Cross-Entry Policy
description: Политика автоматического входа между точками входа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - cross-entry
  - session
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_SESSION_MODEL.md
  - SUMMARY_DOCS/auth/AUTH_DEVICE_CONTEXT_MODEL.md
---

# 🔄 AUTH CROSS-ENTRY POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **правила автоматического входа между точками входа** платформы Balloo.

**Цель:** Обеспечить seamless authentication continuity на всех устройствах и браузерах.

---

## 🔑 CORE PRINCIPLE

### Cross-Entry Rule

> **Если на конкретном устройстве/браузере уже был выполнен вход в одну точку входа Balloo, то в другие точки входа пользователь входит автоматически в рамках общего auth context.**

### Important Distinctions

| Aspect | Description |
|--------|-------------|
| **Authentication Continuity** | Automatic login across entry points |
| **Authorization Checks** | Still performed per node/action |
| **Access Control** | NOT automatic — role/scope/node checks apply |
| **Device Context** | Shared across entry points |
| **Session Trust** | Reused within same device/browser |

---

## 📊 CONTEXT MODEL

### Device Context

```
DeviceContext = {
  deviceContextKey: canonical-identifier-of-device,
  browserContext: browser-specific-trust-state,
  sessionLinked: authenticated-session-reference,
  trustState: trusted | untrusted | revoked,
  crossEntryEnabled: true | false,
  privilegedExceptions: node-specific-isolation-rules
}
```

### Browser Context

```
BrowserContext = {
  browserContextKey: canonical-identifier-of-browser,
  deviceContextKey: parent-device-reference,
  trustCarrier: cookie + fingerprint,
  sessionTokens: [active-session-references],
  lastActivity: ISO-8601-timestamp,
  crossEntryEnabled: true | false
}
```

### Auth Session

```
AuthSession = {
  sessionId: unique-session-identifier,
  userId: user-identifier,
  deviceContextId: device-context-reference,
  browserContextId: browser-context-reference,
  providerId: auth-provider-used,
  createdAt: ISO-8601-timestamp,
  expiresAt: ISO-8601-timestamp,
  lastActivity: ISO-8601-timestamp,
  revoked: boolean
}
```

---

## 🔄 CROSS-ENTRY FLOW

### Standard Cross-Entry Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User authenticated on Entry Point A                     │
│ - Device: Device-X                                              │
│ - Browser: Browser-Y                                            │
│ - Session: Session-123                                          │
│ - DeviceContext: DeviceContext-ABC                              │
│ - BrowserContext: BrowserContext-XYZ                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: User accesses Entry Point B (same device/browser)       │
│ - Device: Device-X (matches)                                    │
│ - Browser: Browser-Y (matches)                                  │
│ - System detects existing DeviceContext                         │
│ - System finds active Session-123                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: System validates session                                │
│ - Session not expired                                           │
│ - Session not revoked                                           │
│ - Device context matches                                        │
│ - Browser context matches                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Automatic authentication                                │
│ - User authenticated without re-login                           │
│ - Session reused (or refreshed)                                 │
│ - Authorization checks apply per node                           │
└─────────────────────────────────────────────────────────────────┘
```

### Cross-Entry Matrix

| Source Node Class | Target Node Class | Auto-Entry | Re-Check Required |
|-------------------|-------------------|------------|-------------------|
| **E (Production)** | E (Production) | ✅ Yes | ❌ No |
| **E (Production)** | C (Alpha) | ✅ Yes | ⚠️ Role check |
| **E (Production)** | D (Working) | ✅ Yes | ⚠️ Role check |
| **E (Production)** | A (Privileged) | ❌ No | ⚠️ Full re-auth |
| **C (Alpha)** | C (Alpha) | ✅ Yes | ❌ No |
| **C (Alpha)** | E (Production) | ✅ Yes | ❌ No |
| **C (Alpha)** | D (Working) | ✅ Yes | ❌ No |
| **C (Alpha)** | A (Privileged) | ❌ No | ⚠️ Full re-auth |
| **D (Working)** | D (Working) | ✅ Yes | ❌ No |
| **D (Working)** | E (Production) | ✅ Yes | ❌ No |
| **D (Working)** | C (Alpha) | ✅ Yes | ❌ No |
| **D (Working)** | A (Privileged) | ❌ No | ⚠️ Full re-auth |
| **A (Privileged)** | A (Privileged) | ⚠️ Session timeout 15min | ⚠️ Re-check |
| **A (Privileged)** | E/C/D | ✅ Yes | ❌ No |

---

## ⚠️ EXCEPTIONS

### Privileged Node Exceptions

| Exception | Description |
|-----------|-------------|
| **Group A Nodes** | May require re-authentication even with valid session |
| **Session Timeout** | Shorter timeout for privileged sessions (15 min idle) |
| **Additional Checks** | May require MFA or additional verification |
| **Isolated Sessions** | Privileged sessions may be isolated from standard cross-entry |

### Creator-Superadmin Exceptions

| Exception | Description |
|-----------|-------------|
| **Separate Flow** | Creator-superadmin may use isolated auth flow |
| **No Cross-Entry** | May bypass standard cross-entry for security |
| **Dedicated Sessions** | Sessions may be isolated from common sessions |
| **Maximum Audit** | All cross-entry attempts logged at maximum level |

### Environment Exceptions

| Exception | Description |
|-----------|-------------|
| **Production → Working** | Allowed, but authorization still checked |
| **Working → Production** | Allowed, but deployment requires additional checks |
| **Alpha → Production** | Allowed, but feature access may be limited |

---

## 🔒 SECURITY CONSIDERATIONS

### Trust Validation

| Check | Description |
|-------|-------------|
| **Device Fingerprint** | Validate device matches |
| **Browser Fingerprint** | Validate browser matches |
| **Session Validity** | Check session not expired/revoked |
| **IP Consistency** | Flag significant IP changes |
| **Geolocation** | Flag impossible travel |
| **User Agent** | Flag significant UA changes |

### Session Binding

```typescript
function validateCrossEntry(
  session: AuthSession,
  deviceContext: DeviceContext,
  browserContext: BrowserContext,
  targetNode: Node
): boolean {
  // Check session validity
  if (session.revoked || Date.now() > session.expiresAt) {
    return false;
  }
  
  // Check device context match
  if (session.deviceContextId !== deviceContext.id) {
    return false;
  }
  
  // Check browser context match
  if (session.browserContextId !== browserContext.id) {
    return false;
  }
  
  // Check privileged node exception
  if (targetNode.nodeGroup === 'A') {
    // Require re-auth for privileged nodes
    if (session.lastActivity < Date.now() - 15 * 60 * 1000) {
      return false; // Session idle > 15 min
    }
  }
  
  // Check creator-superadmin isolation
  if (session.userId === CREATOR_SUPERADMIN_ID) {
    // Creator-superadmin may have isolated sessions
    if (session.isolated && targetNode.nodeGroup !== 'A') {
      return false;
    }
  }
  
  return true;
}
```

---

## 📊 IMPLEMENTATION GUIDELINES

### Cookie Strategy

| Cookie | Purpose | Scope |
|--------|---------|-------|
| **balloo_session** | Session token | *.balloo.su |
| **balloo_device** | Device context ID | *.balloo.su |
| **balloo_browser** | Browser context ID | *.balloo.su |
| **balloo_trust** | Trust state | *.balloo.su |

### Subdomain Strategy

```
Production:
  - balloo.su (main)
  - messenger.balloo.su (messenger)
  - alpha.balloo.su (alpha)
  - *.alpha.balloo.su (alpha apps)

Working:
  - working.balloo.su (main)
  - *.working.balloo.su (working apps)

Privileged:
  - projectgeneralsettings.working.balloo.su
  - kodegen.working.balloo.su
  - pilot-future.working.balloo.su
  - nodes-switcher.working.balloo.su
```

### Cross-Subdomain Session Sharing

```typescript
// Set cookies with wildcard domain
res.cookie('balloo_session', sessionToken, {
  domain: '.balloo.su',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
});

res.cookie('balloo_device', deviceContextId, {
  domain: '.balloo.su',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
});
```

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authCrossEntryPolicy": {
    "coreRule": "if-authenticated-on-device-browser-then-auto-login-on-other-entry-points",
    "contextModel": {
      "deviceContext": ["deviceContextKey", "browserContext", "sessionLinked", "trustState"],
      "browserContext": ["browserContextKey", "deviceContextKey", "trustCarrier", "sessionTokens"],
      "authSession": ["sessionId", "userId", "deviceContextId", "browserContextId", "providerId"]
    },
    "crossEntryMatrix": {
      "E-to-E": true,
      "E-to-C": true,
      "E-to-D": true,
      "E-to-A": false,
      "C-to-C": true,
      "C-to-E": true,
      "C-to-D": true,
      "C-to-A": false,
      "D-to-D": true,
      "D-to-E": true,
      "D-to-C": true,
      "D-to-A": false,
      "A-to-A": "session-timeout-15min"
    },
    "exceptions": {
      "privilegedNodes": {
        "reauthRequired": true,
        "sessionTimeoutMinutes": 15,
        "additionalChecks": true
      },
      "creatorSuperadmin": {
        "isolatedFlow": true,
        "noCrossEntry": true,
        "dedicatedSessions": true
      }
    },
    "cookieStrategy": {
      "domain": ".balloo.su",
      "cookies": ["balloo_session", "balloo_device", "balloo_browser", "balloo_trust"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [AUTH_SESSION_MODEL.md](./AUTH_SESSION_MODEL.md) — Session model
- [AUTH_DEVICE_CONTEXT_MODEL.md](./AUTH_DEVICE_CONTEXT_MODEL.md) — Device context model
- [AUTH_CREATOR_SUPERADMIN_MODEL.md](./AUTH_CREATOR_SUPERADMIN_MODEL.md) — Creator-superadmin model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
