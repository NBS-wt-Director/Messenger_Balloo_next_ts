---
title: Auth Codegen Instructions
description: Инструкции для AI-codegen по авторизации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - auth
  - codegen
  - instructions
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/contracts/auth/AuthCodegenContract.md
---

# 🤖 AUTH CODEGEN INSTRUCTIONS

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эти инструкции определяют **правила генерации auth layer** для AI-codegen.

**Цель:** Обеспечить корректную генерацию auth providers, session model и provider integrations.

---

## 🔑 CORE PRINCIPLES

### AI Must Follow

| Rule | Description |
|------|-------------|
| **Use Contracts** | Always reference contract files for canonical definitions |
| **Separate Creator-Superadmin** | Generate creator-superadmin auth separately from common providers |
| **Phase-Based Enablement** | Respect provider phases (1 vs 2) |
| **Auth ≠ Access** | Never confuse authentication with authorization |
| **Preserve Cross-Entry** | Implement device/browser/session continuity |
| **Enforce Security** | All security requirements must be implemented |
| **Audit Everything** | All auth events must be logged |

### AI Must NOT Do

| Rule | Description |
|------|-------------|
| **No Hardcoded Providers** | Use contract-defined providers only |
| **No Creator-Superadmin via Common Providers** | Never allow creator to use yandex-id, phone OTP, MAX, etc. |
| **No MAX as OAuth** | MAX is phone-first messenger-code, NOT OAuth/social |
| **No Implicit Access** | Auth success ≠ automatic node access |
| **No Bypass Security** | All security checks must run |
| **No Skip Audit** | All events must be logged |

---

## 📊 PROVIDER GENERATION

### Generate All Phase 1 Providers

```typescript
// AI must generate these providers:

// 1. Yandex.ID Provider
class YandexIdProvider implements AuthProvider {
  providerId = 'yandex-id';
  type = 'external-oidc';
  identityAnchor = 'provider-user-id';
  
  async authenticate(code: string): Promise<AuthResult> {
    // Exchange code for token
    const token = await this.exchangeCode(code);
    
    // Validate token with Yandex
    const userInfo = await this.validateToken(token);
    
    // Create/link Balloo account
    const account = await this.getOrCreateAccount(userInfo);
    
    // Create session
    const session = await this.createSession(account);
    
    return { success: true, account, session };
  }
}

// 2. Email+Password Provider
class EmailPasswordProvider implements AuthProvider {
  providerId = 'email-password';
  type = 'local-credentials';
  identityAnchor = 'email';
  
  async authenticate(email: string, password: string): Promise<AuthResult> {
    // Validate email format
    if (!isValidEmail(email)) {
      throw new AuthError('Invalid email format');
    }
    
    // Validate password policy
    if (!validatePasswordPolicy(password)) {
      throw new AuthError('Password does not meet policy');
    }
    
    // Find account
    const account = await findAccountByEmail(email);
    if (!account) {
      throw new AuthError('Account not found');
    }
    
    // Verify password
    const valid = await verifyPassword(password, account.passwordHash);
    if (!valid) {
      throw new AuthError('Invalid password');
    }
    
    // Create session
    const session = await this.createSession(account);
    
    return { success: true, account, session };
  }
}

// 3. Phone+3Char-Code Provider
class Phone3CharCodeProvider implements AuthProvider {
  providerId = 'phone-3char-code';
  type = 'phone-otp';
  identityAnchor = 'phone';
  codeLength = 3;
  expiryMinutes = 5;
  
  async sendCode(phone: string): Promise<void> {
    // Validate phone format
    if (!isValidPhone(phone)) {
      throw new AuthError('Invalid phone number');
    }
    
    // Generate 3-digit code
    const code = generateOTP(3);
    
    // Store code with expiry
    await storeCode(phone, code, 5 * 60 * 1000);
    
    // Send via SMS or bot
    await sendSMS(phone, code);
  }
  
  async authenticate(phone: string, code: string): Promise<AuthResult> {
    // Validate code
    const valid = await validateCode(phone, code);
    if (!valid) {
      throw new AuthError('Invalid or expired code');
    }
    
    // Get/create account
    const account = await this.getOrCreateAccountByPhone(phone);
    
    // Create session
    const session = await this.createSession(account);
    
    return { success: true, account, session };
  }
}
```

### Generate Phase 2 Providers (When Enabled)

```typescript
// AI must generate these providers for phase 2:

// 4. Gosuslugi Provider
class GosuslugiProvider implements AuthProvider {
  providerId = 'gosuslugi';
  type = 'state-identity';
  identityAnchor = 'gov-id';
  
  async authenticate(code: string): Promise<AuthResult> {
    // Exchange code for token via ESIA
    const token = await this.exchangeCode(code);
    
    // Validate claims
    const claims = await this.validateClaims(token);
    
    // Create/link account
    const account = await this.getOrCreateAccount(claims);
    
    // Create session
    const session = await this.createSession(account);
    
    return { success: true, account, session };
  }
}

// 5. MAX Provider
// ⚠️ IMPORTANT: MAX is NOT OAuth/social provider
// MAX is phone-first messenger-code authentication
class MAXProvider implements AuthProvider {
  providerId = 'max';
  type = 'messenger-code';
  identityAnchor = 'phone';
  deliveryChannel = 'max-bot';
  
  async sendCode(phone: string): Promise<void> {
    // Validate phone format
    if (!isValidPhone(phone)) {
      throw new AuthError('Invalid phone number');
    }
    
    // Find account by phone binding
    const account = await findAccountByPhone(phone);
    if (!account) {
      throw new AuthError('No account bound to this phone');
    }
    
    // Generate code
    const code = generateOTP(3);
    
    // Store code with expiry
    await storeCode(phone, code, 5 * 60 * 1000);
    
    // Send via MAX bot (NOT SMS)
    await sendViaMAXBot(phone, code);
  }
  
  async authenticate(phone: string, code: string): Promise<AuthResult> {
    // Validate code
    const valid = await validateCode(phone, code);
    if (!valid) {
      throw new AuthError('Invalid or expired code');
    }
    
    // Get account
    const account = await findAccountByPhone(phone);
    
    // Create session
    const session = await this.createSession(account);
    
    return { success: true, account, session };
  }
}

// 6. QR-Code Provider
class QRCodeProvider implements AuthProvider {
  providerId = 'qr-code';
  type = 'device-transfer';
  identityAnchor = 'existing-session';
  expiryMinutes = 2;
  
  async generateQR(userId: string, deviceId: string): Promise<string> {
    // Generate secure token
    const token = crypto.randomBytes(16).toString('hex');
    
    // Store with expiry
    await storeQRToken(token, {
      userId,
      deviceId,
      expiresAt: Date.now() + 2 * 60 * 1000
    });
    
    // Encode as QR
    return encodeQR(token);
  }
  
  async authenticate(token: string, newDeviceId: string): Promise<AuthResult> {
    // Validate token
    const qrData = await validateQRToken(token);
    if (!qrData) {
      throw new AuthError('Invalid or expired QR code');
    }
    
    // Get user account
    const account = await getAccount(qrData.userId);
    
    // Create session on new device
    const session = await this.createSession(account, newDeviceId);
    
    return { success: true, account, session };
  }
}
```

---

## 👑 CREATOR-SUPERADMIN GENERATION

### Generate Separate Auth Flow

```typescript
// ⚠️ CRITICAL: Creator-superadmin MUST be separate from common providers

class CreatorSuperadminProvider implements AuthProvider {
  providerId = 'creator-superadmin';
  type = 'dedicated-privileged';
  identityAnchor = 'login+email+phone';
  
  // Canonical identity (immutable)
  canonicalIdentity = {
    fullName: 'Оберюхтин Иван Анатольевич',
    email: 'o8eryuhtin@yandex.ru',
    phone: '89292167585',
    role: 'creator-superadmin',
    authorityLevel: 'L10'
  };
  
  async authenticate(login: string, password: string): Promise<AuthResult> {
    // Verify login matches canonical
    if (login !== 'creator' && login !== this.canonicalIdentity.email) {
      throw new AuthError('Invalid creator login');
    }
    
    // Get creator account
    const account = await getCreatorSuperadminAccount();
    
    // Verify password
    const valid = await verifyPassword(password, account.passwordHash);
    if (!valid) {
      await logFailedAttempt(account.id);
      throw new AuthError('Invalid creator password');
    }
    
    // Verify mandatory bindings
    if (!account.emailVerified || !account.phoneVerified) {
      throw new AuthError('Creator bindings not verified');
    }
    
    // Create privileged session
    const session = await this.createPrivilegedSession(account);
    
    // Log at maximum audit level
    await auditLog({
      level: 'maximum',
      eventType: 'creator_login',
      accountId: account.id,
      timestamp: new Date().toISOString(),
      // ... full details
    });
    
    return { success: true, account, session, privileged: true };
  }
  
  async createPrivilegedSession(account: Account): Promise<Session> {
    return {
      sessionId: generateSecureId(),
      userId: account.id,
      type: 'privileged',
      idleTimeoutMinutes: 15, // Shorter than standard
      absoluteTimeoutHours: 8,
      maxConcurrent: 3,
      isolated: true, // May be isolated from common sessions
      auditLevel: 'maximum'
    };
  }
}
```

### AI Must NOT Allow Creator to Use Common Providers

```typescript
// ⚠️ CRITICAL: Block creator from using common providers

async function authenticateWithProvider(
  providerId: string,
  credentials: any
): Promise<AuthResult> {
  // Check if this is creator-superadmin account
  const isCreator = await checkIfCreatorSuperadmin(credentials);
  
  // Creator-superadmin CANNOT use common providers
  if (isCreator && providerId !== 'creator-superadmin') {
    throw new AuthError(
      'Creator-superadmin must use dedicated auth flow, not common providers'
    );
  }
  
  // Proceed with normal provider auth
  const provider = getProvider(providerId);
  return provider.authenticate(credentials);
}
```

---

## 🔄 CROSS-ENTRY GENERATION

### Generate Device/Browser/Session Model

```typescript
// AI must generate cross-entry continuity

class CrossEntryManager {
  async validateCrossEntry(
    session: Session,
    deviceContext: DeviceContext,
    browserContext: BrowserContext,
    targetNode: Node
  ): Promise<boolean> {
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
      if (session.lastActivity < Date.now() - 15 * 60 * 1000) {
        return false; // Idle > 15 min for privileged
      }
    }
    
    // Check creator-superadmin isolation
    if (session.userId === CREATOR_SUPERADMIN_ID) {
      if (session.isolated && targetNode.nodeGroup !== 'A') {
        return false;
      }
    }
    
    return true;
  }
  
  async reuseSession(
    existingSession: Session,
    targetNode: Node
  ): Promise<Session> {
    // Reuse existing session for cross-entry
    // Authorization checks still apply per node
    
    return {
      ...existingSession,
      lastActivity: Date.now(),
      nodeAccess: await checkNodeAccess(existingSession.userId, targetNode)
    };
  }
}
```

---

## 🔒 SECURITY GENERATION

### Generate Security Checks

```typescript
// AI must generate all security checks

// Password validation
function validatePassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*]/.test(password)) return false;
  if (isCommonPassword(password)) return false;
  return true;
}

// Rate limiting
async function checkRateLimit(key: string, action: string): Promise<boolean> {
  const limits = {
    'login': { limit: 10, windowMs: 15 * 60 * 1000 },
    'otp-request': { limit: 5, windowMs: 60 * 60 * 1000 },
    'otp-validate': { limit: 3, windowMs: 5 * 60 * 1000 }
  };
  
  const config = limits[action];
  if (!config) return true;
  
  const current = await redis.incr(`ratelimit:${action}:${key}`);
  if (current === 1) {
    await redis.pexpire(`ratelimit:${action}:${key}`, config.windowMs);
  }
  
  return current <= config.limit;
}

// Audit logging
async function auditLog(event: AuditEvent): Promise<void> {
  await auditStore.insert({
    eventId: generateId(),
    ...event,
    timestamp: new Date().toISOString()
  });
}
```

---

## 📊 CONTEXT FILES FOR AI

### Must Reference

| File | Purpose |
|------|---------|
| `AUTH_POLICY.md` | Overall auth philosophy |
| `AUTH_PROVIDER_MODEL.md` | All provider definitions |
| `AUTH_SESSION_MODEL.md` | Session lifecycle |
| `AUTH_DEVICE_CONTEXT_MODEL.md` | Device/browser context |
| `AUTH_CROSS_ENTRY_POLICY.md` | Cross-entry rules |
| `AUTH_SECURITY_POLICY.md` | Security requirements |
| `AUTH_CREATOR_SUPERADMIN_MODEL.md` | Creator-superadmin auth |
| `CREATOR_SUPERADMIN_ACCOUNT.md` | Creator account profile |
| `../state/auth-providers.json` | Provider registry |
| `../state/auth-creator-superadmin.json` | Creator profile |
| `../contracts/auth/*.md` | All contracts |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authCodegenInstructions": {
    "mustFollow": [
      "use-contracts",
      "separate-creator-superadmin",
      "phase-based-enablement",
      "auth-not-equal-access",
      "preserve-cross-entry",
      "enforce-security",
      "audit-everything"
    ],
    "mustNotDo": [
      "no-hardcoded-providers",
      "no-creator-via-common-providers",
      "no-max-as-oauth",
      "no-implicit-access",
      "no-bypass-security",
      "no-skip-audit"
    ],
    "providers": {
      "phase1": ["yandex-id", "email-password", "phone-3char-code"],
      "phase2": ["gosuslugi", "max", "qr-code"],
      "creatorSuperadmin": "separate-dedicated-flow"
    },
    "security": {
      "passwordPolicy": true,
      "otpPolicy": true,
      "rateLimiting": true,
      "auditLogging": true,
      "sessionSecurity": true
    },
    "crossEntry": {
      "deviceContext": true,
      "browserContext": true,
      "sessionReuse": true,
      "privilegedExceptions": true
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy
- [AUTH_PROVIDER_MODEL.md](./AUTH_PROVIDER_MODEL.md) — Provider model
- [../contracts/auth/AuthCodegenContract.md](../contracts/auth/AuthCodegenContract.md) — Codegen contract
- [../playbooks/auth-codegen-playbook.md](../playbooks/auth-codegen-playbook.md) — Codegen playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
