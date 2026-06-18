---
title: Auth Security Policy
description: Политика безопасности авторизации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - security
  - policy
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/AUTH_SESSION_MODEL.md
---

# 🔐 AUTH SECURITY POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **требования безопасности** для всех провайдеров авторизации Balloo.

**Цель:** Обеспечить единый security baseline для всех auth flows.

---

## 🔑 SECURITY BASELINE

### All Providers Must Implement

| Requirement | Description |
|-------------|-------------|
| **Token Validation** | All tokens must be cryptographically validated |
| **Session Binding** | Sessions bound to device/browser context |
| **Audit Logging** | All auth events logged with full details |
| **Rate Limiting** | Prevent brute-force attacks |
| **Replay Protection** | Prevent code/token reuse |
| **Expiry Enforcement** | All codes/tokens/sessions expire |
| **Secure Transmission** | All data transmitted over HTTPS |
| **Input Validation** | All inputs validated and sanitized |

---

## 🔐 PASSWORD POLICY

### Applicable To: Email+Password, Creator-Superadmin

| Requirement | Value |
|-------------|-------|
| **Minimum Length** | 8 characters |
| **Uppercase Required** | Yes (A-Z) |
| **Lowercase Required** | Yes (a-z) |
| **Number Required** | Yes (0-9) |
| **Special Character Required** | Yes (!@#$%^&*()_+-=[]{}|;:,.<>?) |
| **Common Passwords Blocked** | Yes (top 10000) |
| **Email Substring Blocked** | Yes |
| **Name Substring Blocked** | Yes |
| **Password History** | Last 5 passwords blocked |
| **Max Age** | 90 days recommended |
| **Hashing Algorithm** | Argon2id or bcrypt (cost >= 12) |

### Validation Rules

```typescript
function validatePassword(password: string, email: string, name: string): boolean {
  // Length check
  if (password.length < 8) return false;
  
  // Character class checks
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) return false;
  
  // Common password check
  if (isCommonPassword(password)) return false;
  
  // Email substring check
  if (password.toLowerCase().includes(email.split('@')[0].toLowerCase())) return false;
  
  // Name substring check
  if (password.toLowerCase().includes(name.toLowerCase())) return false;
  
  return true;
}
```

---

## 📱 OTP POLICY

### Applicable To: Phone+3Char-Code, MAX

| Requirement | Value |
|-------------|-------|
| **Code Length** | 3 characters (digits 0-9) |
| **Code Format** | Numeric only |
| **Expiry** | 5 minutes |
| **Max Attempts** | 3 per code |
| **Rate Limit** | 5 codes per hour per phone |
| **One-Time Use** | Yes, invalidated after use |
| **Replay Protection** | Yes, code stored and checked |
| **Delivery Channel** | SMS or MAX bot |
| **Generation** | Cryptographically secure random |

### Code Generation

```typescript
function generateOTP(): string {
  // Generate cryptographically secure 3-digit code
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 1000).toString().padStart(3, '0');
}
```

### Code Validation

```typescript
async function validateOTP(phone: string, code: string): Promise<boolean> {
  // Get stored code
  const stored = await getStoredCode(phone);
  
  // Check expiry
  if (Date.now() > stored.expiresAt) {
    await invalidateCode(phone);
    return false;
  }
  
  // Check attempts
  if (stored.attempts >= 3) {
    await invalidateCode(phone);
    return false;
  }
  
  // Check code match
  if (stored.code !== code) {
    await incrementAttempts(phone);
    return false;
  }
  
  // Invalidate on success
  await invalidateCode(phone);
  return true;
}
```

---

## 🔗 TOKEN POLICY

### Applicable To: Yandex.ID, Gosuslugi

| Requirement | Value |
|-------------|-------|
| **Token Validation** | Verify signature with provider public key |
| **Token Expiry** | Per provider specification |
| **Token Refresh** | Supported where available |
| **Token Storage** | Secure, encrypted at rest |
| **Token Transmission** | Authorization header only |
| **Token Revocation** | Supported on logout |

### Token Validation

```typescript
async function validateToken(provider: string, token: string): Promise<boolean> {
  // Get provider public key
  const publicKey = await getProviderPublicKey(provider);
  
  // Verify signature
  const valid = await verifySignature(token, publicKey);
  if (!valid) return false;
  
  // Decode payload
  const payload = decodeJWT(token);
  
  // Check expiry
  if (Date.now() > payload.exp * 1000) return false;
  
  // Check issuer
  if (payload.iss !== getProviderIssuer(provider)) return false;
  
  // Check audience
  if (payload.aud !== getConfiguredAudience(provider)) return false;
  
  return true;
}
```

---

## 📱 QR-CODE POLICY

### Applicable To: QR-Code

| Requirement | Value |
|-------------|-------|
| **QR Expiry** | 2 minutes |
| **One-Time Use** | Yes, invalidated after scan |
| **Code Entropy** | Minimum 128 bits |
| **Device Binding** | Yes, bound to target device |
| **Confirmation Required** | Yes, on source device |
| **Rate Limit** | 5 QR codes per hour per user |

### QR Generation

```typescript
function generateQRCode(userId: string, deviceId: string): string {
  // Generate cryptographically secure token
  const token = crypto.randomBytes(16).toString('hex');
  
  // Store with expiry
  storeQRToken(token, {
    userId,
    deviceId,
    expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
    used: false
  });
  
  // Encode as QR
  return encodeQR(token);
}
```

---

## 🔒 SESSION SECURITY

### Session Requirements

| Requirement | Value |
|-------------|-------|
| **Session ID** | Cryptographically secure, 128+ bits |
| **Session Expiry** | 30 days default, configurable |
| **Idle Timeout** | 15 minutes for privileged, 60 minutes standard |
| **Session Binding** | Device + browser fingerprint |
| **Session Storage** | Secure, httpOnly cookie |
| **Session Invalidation** | On logout, password change, revocation |
| **Concurrent Sessions** | Allowed, max 10 per user |

### Session Creation

```typescript
function createSession(userId: string, deviceContext: DeviceContext): Session {
  // Generate secure session ID
  const sessionId = crypto.randomBytes(16).toString('hex');
  
  // Create session
  return {
    sessionId,
    userId,
    deviceContextId: deviceContext.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    lastActivity: Date.now(),
    revoked: false
  };
}
```

---

## 🛡️ RATE LIMITING

### Rate Limit Rules

| Action | Limit | Window |
|--------|-------|--------|
| **Login attempts** | 10 | 15 minutes |
| **OTP requests** | 5 | 1 hour per phone |
| **OTP validations** | 3 | Per code |
| **Password reset** | 3 | 1 hour per email |
| **QR generation** | 5 | 1 hour per user |
| **Session refresh** | 60 | 1 hour |

### Rate Limit Implementation

```typescript
async function checkRateLimit(key: string, action: string, limit: number, windowMs: number): Promise<boolean> {
  const keyName = `ratelimit:${action}:${key}`;
  const current = await redis.incr(keyName);
  
  if (current === 1) {
    await redis.pexpire(keyName, windowMs);
  }
  
  return current <= limit;
}
```

---

## 📝 AUDIT LOGGING

### Required Log Fields

| Field | Description |
|-------|-------------|
| **eventId** | Unique event identifier |
| **eventType** | Type of auth event |
| **timestamp** | ISO-8601 timestamp |
| **userId** | User identifier (if available) |
| **providerId** | Auth provider used |
| **deviceId** | Device identifier |
| **browserId** | Browser identifier |
| **ipAddress** | Client IP address |
| **userAgent** | Client user agent |
| **result** | success/failure |
| **failureReason** | Reason for failure (if applicable) |
| **metadata** | Additional context |

### Event Types to Log

| Event | Description |
|-------|-------------|
| **login.initiated** | Login attempt started |
| **login.success** | Login successful |
| **login.failure** | Login failed |
| **logout** | User logged out |
| **session.created** | Session created |
| **session.refreshed** | Session refreshed |
| **session.revoked** | Session revoked |
| **otp.sent** | OTP sent |
| **otp.validated** | OTP validated |
| **otp.failed** | OTP validation failed |
| **password.changed** | Password changed |
| **binding.added** | Identity binding added |
| **binding.removed** | Identity binding removed |
| **qr.generated** | QR code generated |
| **qr.scanned** | QR code scanned |

---

## 🚨 SUSPICIOUS ACTIVITY

### Detection Rules

| Pattern | Response |
|---------|----------|
| **Multiple failed logins** | Lock account after 10 failures |
| **Unusual location** | Flag for review |
| **Unusual device** | Flag for review |
| **Rapid session creation** | Rate limit |
| **Known bad IP** | Block |
| **Credential stuffing pattern** | Block + alert |

### Response Actions

| Severity | Actions |
|----------|---------|
| **Low** | Log only |
| **Medium** | Log + rate limit |
| **High** | Log + block + alert |
| **Critical** | Log + block + alert + revoke sessions |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authSecurityPolicy": {
    "passwordPolicy": {
      "minLength": 8,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumber": true,
      "requireSpecial": true,
      "blockCommon": true,
      "hashingAlgorithm": "argon2id"
    },
    "otpPolicy": {
      "codeLength": 3,
      "expiryMinutes": 5,
      "maxAttempts": 3,
      "rateLimitPerHour": 5
    },
    "qrPolicy": {
      "expiryMinutes": 2,
      "oneTimeUse": true,
      "minEntropy": 128
    },
    "sessionPolicy": {
      "expiryDays": 30,
      "idleTimeoutMinutes": 60,
      "privilegedIdleTimeoutMinutes": 15,
      "maxConcurrent": 10
    },
    "rateLimiting": {
      "loginAttempts": { "limit": 10, "windowMinutes": 15 },
      "otpRequests": { "limit": 5, "windowMinutes": 60 },
      "passwordReset": { "limit": 3, "windowMinutes": 60 }
    },
    "auditLogging": {
      "required": true,
      "retentionDays": 90,
      "eventTypes": ["login", "logout", "session", "otp", "password", "binding", "qr"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [AUTH_PROVIDER_MODEL.md](./AUTH_PROVIDER_MODEL.md) — Provider model
- [AUTH_SESSION_MODEL.md](./AUTH_SESSION_MODEL.md) — Session model
- [AUTH_RECOVERY_MODEL.md](./AUTH_RECOVERY_MODEL.md) — Recovery model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
