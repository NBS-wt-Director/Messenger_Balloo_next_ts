---
title: MAX Provider Contract
description: Контракт провайдера MAX для AI-codegen
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - auth
  - provider
  - max
  - contract
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/providers/PROVIDER_SUMMARY_max.md
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
---

# 📜 MAX PROVIDER CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **провайдер MAX** для AI-codegen.

**Цель:** Обеспечить машиночитаемую спецификацию для генерации MAX auth integration.

---

## 📊 PROVIDER SCHEMA

```json
{
  "provider": {
    "type": "object",
    "required": [
      "providerId",
      "displayName",
      "phase",
      "type",
      "primaryIdentityAnchor",
      "deliveryChannel"
    ],
    "properties": {
      "providerId": {
        "type": "string",
        "const": "max"
      },
      "displayName": {
        "type": "string",
        "const": "MAX"
      },
      "phase": {
        "type": "integer",
        "const": 2
      },
      "type": {
        "type": "string",
        "const": "messenger-code"
      },
      "primaryIdentityAnchor": {
        "type": "string",
        "const": "phone"
      },
      "authFactor": {
        "type": "object",
        "properties": {
          "factor1": { "type": "string", "const": "phone-number" },
          "factor2": { "type": "string", "const": "one-time-code" }
        }
      },
      "deliveryChannel": {
        "type": "string",
        "const": "max-bot"
      }
    }
  }
}
```

---

## 🔐 AUTHENTICATION CONTRACT

### Input Schema

```json
{
  "sendCodeRequest": {
    "type": "object",
    "required": ["phone"],
    "properties": {
      "phone": {
        "type": "string",
        "pattern": "^\\+?[0-9]{10,15}$"
      }
    }
  },
  "authenticateRequest": {
    "type": "object",
    "required": ["phone", "code"],
    "properties": {
      "phone": {
        "type": "string",
        "pattern": "^\\+?[0-9]{10,15}$"
      },
      "code": {
        "type": "string",
        "pattern": "^[0-9]{3}$",
        "maxLength": 3,
        "minLength": 3
      }
    }
  }
}
```

### Output Schema

```json
{
  "sendCodeResponse": {
    "type": "object",
    "required": ["success"],
    "properties": {
      "success": { "type": "boolean" },
      "message": { "type": "string" },
      "codeExpirySeconds": { "type": "integer", "const": 300 }
    }
  },
  "authenticateResponse": {
    "type": "object",
    "required": ["success"],
    "properties": {
      "success": { "type": "boolean" },
      "account": {
        "type": "object",
        "properties": {
          "accountId": { "type": "string" },
          "email": { "type": "string" },
          "phone": { "type": "string" }
        }
      },
      "session": {
        "type": "object",
        "properties": {
          "sessionId": { "type": "string" },
          "expiresAt": { "type": "string", "format": "date-time" }
        }
      },
      "error": { "type": "string" }
    }
  }
}
```

---

## 🔒 SECURITY CONTRACT

### Code Policy

```json
{
  "codePolicy": {
    "codeLength": { "type": "integer", "const": 3 },
    "codeFormat": { "type": "string", "const": "numeric" },
    "codeExpiryMinutes": { "type": "integer", "const": 5 },
    "oneTimeUse": { "type": "boolean", "const": true },
    "maxAttempts": { "type": "integer", "const": 3 },
    "rateLimitPerHour": { "type": "integer", "const": 5 },
    "replayProtection": { "type": "boolean", "const": true }
  }
}
```

### Bot Delivery Verification

```json
{
  "botDeliveryVerification": {
    "required": { "type": "boolean", "const": true },
    "verifyDelivery": { "type": "boolean", "const": true },
    "verifyReceipt": { "type": "boolean", "const": true }
  }
}
```

---

## 📋 BINDING CONTRACT

### Mandatory Bindings

```json
{
  "mandatoryBindings": {
    "phone": {
      "required": { "type": "boolean", "const": true },
      "verified": { "type": "boolean", "const": true },
      "immutable": { "type": "boolean", "const": false }
    }
  }
}
```

### Optional Bindings

```json
{
  "optionalBindings": {
    "email": {
      "required": { "type": "boolean", "const": false },
      "forRecovery": { "type": "boolean", "const": true }
    }
  }
}
```

---

## ⚠️ IMPORTANT INVARIANTS

### AI Must Enforce

| ID | Invariant | Error Message |
|----|-----------|---------------|
| M001 | MAX is NOT OAuth | "MAX provider is not an OAuth provider" |
| M002 | MAX is NOT social login | "MAX provider does not provide social profile" |
| M003 | Phone binding required | "Phone number must be bound to account" |
| M004 | Code is 3 digits | "Code must be exactly 3 digits" |
| M005 | Code expires in 5 min | "Code has expired" |
| M006 | One-time use only | "Code has already been used" |
| M007 | Max 3 attempts | "Maximum attempts exceeded" |
| M008 | Rate limit 5/hour | "Rate limit exceeded, try again later" |
| M009 | Bot delivery verified | "Failed to deliver code via MAX bot" |

---

## 🤖 CODEGEN INSTRUCTIONS

### For AI Code Generation

```typescript
// MAX Provider Contract for Codegen
interface MAXProviderContract {
  providerId: 'max';
  displayName: 'MAX';
  phase: 2;
  type: 'messenger-code';
  primaryIdentityAnchor: 'phone';
  deliveryChannel: 'max-bot';
  
  // IMPORTANT: MAX is NOT OAuth/social provider
  // MAX is phone-first messenger-code authentication
  
  authFlow: {
    step1: 'user-enters-phone-number';
    step2: 'system-finds-account-by-phone-binding';
    step3: 'system-generates-3-digit-code';
    step4: 'system-sends-code-via-max-bot';
    step5: 'user-enters-code';
    step6: 'system-validates-code-and-creates-session';
  };
  
  security: {
    codeLength: 3;
    codeExpiryMinutes: 5;
    oneTimeUse: true;
    maxAttempts: 3;
    rateLimitPerHour: 5;
    replayProtection: true;
    botDeliveryVerification: true;
  };
  
  bindings: {
    mandatory: ['phone'];
    optional: ['email'];
  };
  
  invariants: string[];
}
```

### Validation Function

```typescript
// AI must generate this validation
async function validateMAXAuth(
  phone: string,
  code: string
): Promise<AuthResult> {
  // Validate phone format
  if (!isValidPhone(phone)) {
    throw new AuthError('Invalid phone number');
  }
  
  // Find account by phone binding
  const account = await findAccountByPhone(phone);
  if (!account) {
    throw new AuthError('No account bound to this phone');
  }
  
  // Validate code
  if (!/^[0-9]{3}$/.test(code)) {
    throw new AuthError('Code must be 3 digits');
  }
  
  // Check rate limit
  const rateLimitOk = await checkRateLimit(phone, 'max-code', 5, 60 * 60 * 1000);
  if (!rateLimitOk) {
    throw new AuthError('Rate limit exceeded');
  }
  
  // Get stored code
  const storedCode = await getStoredCode(phone);
  if (!storedCode) {
    throw new AuthError('No code sent or code expired');
  }
  
  // Check expiry
  if (Date.now() > storedCode.expiresAt) {
    await invalidateCode(phone);
    throw new AuthError('Code expired');
  }
  
  // Check attempts
  if (storedCode.attempts >= 3) {
    await invalidateCode(phone);
    throw new AuthError('Maximum attempts exceeded');
  }
  
  // Check code match
  if (storedCode.code !== code) {
    await incrementAttempts(phone);
    throw new AuthError('Invalid code');
  }
  
  // Invalidate on success (one-time use)
  await invalidateCode(phone);
  
  // Create session
  const session = await createSession(account);
  
  // Log audit event
  await auditLog({
    eventType: 'max_auth_success',
    accountId: account.id,
    phone: phone,
    timestamp: new Date().toISOString()
  });
  
  return { success: true, account, session };
}
```

---

## 📖 RELATED DOCUMENTS

- [../providers/PROVIDER_SUMMARY_max.md](../providers/PROVIDER_SUMMARY_max.md) — Provider summary
- [../../AUTH_PROVIDER_MODEL.md](../../AUTH_PROVIDER_MODEL.md) — Provider model
- [../../state/auth-providers.json](../../state/auth-providers.json) — Provider registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
