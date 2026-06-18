---
title: Creator-Superadmin Account
description: Канонический аккаунт creator-superadmin Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - creator-superadmin
  - account
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_CREATOR_SUPERADMIN_MODEL.md
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/state/auth-creator-superadmin.json
---

# 👑 CREATOR-SUPERADMIN ACCOUNT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот документ определяет **канонический аккаунт creator-superadmin** платформы Balloo.

**Цель:** Зафиксировать immutable identity profile для максимальной privileged account.

---

## 👑 CANONICAL IDENTITY PROFILE

### Personal Information

| Field | Value | Immutable |
|-------|-------|-----------|
| **fullName** | Оберюхтин Иван Анатольевич | ✅ Yes |
| **email** | o8eryuhtin@yandex.ru | ✅ Yes |
| **phone** | 89292167585 | ✅ Yes |
| **gender** | male | ✅ Yes |
| **birthDate** | 06.04.1993 | ✅ Yes |

### Project Information

| Field | Value | Immutable |
|-------|-------|-----------|
| **registrationDate** | 14.06.2026 | ✅ Yes |
| **projectStartDate** | 14.06.2026 | ✅ Yes |
| **role** | creator-superadmin | ✅ Yes |
| **authorityLevel** | L10 | ✅ Yes |

### Access Configuration

| Field | Value |
|-------|-------|
| **accessClass** | maximal |
| **nodeAdminClass** | full-node-admin |
| **accessScope** | superadmin-only |
| **nodeGroups** | A, B, C, D, E (all) |

---

## 🔐 AUTH CONFIGURATION

### Auth Method

| Property | Value |
|----------|-------|
| **authMethod** | Dedicated login + password |
| **loginIdentifier** | `creator` (or email) |
| **passwordRequired** | Yes |
| **mfaEnabled** | No (recommended for future) |

### Password Policy

| Requirement | Value |
|-------------|-------|
| **Minimum Length** | 16 characters |
| **Uppercase** | Required (A-Z) |
| **Lowercase** | Required (a-z) |
| **Number** | Required (0-9) |
| **Special Character** | Required (!@#$%^&*...) |
| **Hashing Algorithm** | Argon2id |
| **Rotation Period** | 60 days recommended |
| **Password History** | Last 10 passwords blocked |

### Mandatory Bindings

| Binding | Value | Verified | Immutable |
|---------|-------|----------|-----------|
| **Email** | o8eryuhtin@yandex.ru | ✅ Yes | ✅ Yes |
| **Phone** | 89292167585 | ✅ Yes | ✅ Yes |

---

## 🚫 EXCLUSIONS FROM COMMON PROVIDERS

### NOT Used By Creator-Superadmin

| Provider | Type | Reason for Exclusion |
|----------|------|---------------------|
| **yandex-id** | External OIDC | External provider not allowed for creator |
| **email-password** | Local credentials | Creator uses dedicated auth, not standard email-password |
| **phone-3char-code** | Phone OTP | Common provider, creator uses dedicated auth |
| **max** | Messenger code | Common provider, creator uses dedicated auth |
| **gosuslugi** | State identity | External provider not allowed for creator |
| **qr-code** | Device transfer | Session transfer not applicable to creator |

### Separation Rationale

| Aspect | Creator-Superadmin | Common Users |
|--------|-------------------|--------------|
| **Identity Source** | Fixed canonical profile | Provider-linked identity |
| **Auth Flow** | Dedicated endpoint | Standard provider flow |
| **Session Handling** | May be isolated | Standard sessions |
| **Recovery** | Special process | Standard recovery |
| **Audit Level** | Maximum | Standard |

---

## 🔒 SECURITY CONFIGURATION

### Security Class

| Property | Value |
|----------|-------|
| **securityClass** | highest |
| **auditLevel** | maximum |
| **realTimeMonitoring** | enabled |
| **alertOnFailure** | enabled (after 3 failures) |

### Session Policy

| Property | Value |
|----------|-------|
| **Idle Timeout** | 15 minutes |
| **Absolute Timeout** | 8 hours |
| **Max Concurrent Sessions** | 3 |
| **Device Binding** | Strict fingerprint |
| **IP Whitelist** | Optional (not configured by default) |

### Isolation Rules

| Rule | Enabled |
|------|---------|
| **Isolated from Common Providers** | ✅ Yes |
| **Separate Auth Endpoint** | ✅ Yes |
| **Separate Session Store** | ✅ Yes (optional) |
| **Separate Audit Log** | ✅ Yes (maximum level stream) |
| **Cross-Entry Isolation** | ✅ Yes (may bypass standard cross-entry) |
| **Recovery Isolation** | ✅ Yes (special process only) |

---

## 🔑 PRIVILEGES

### Node Access

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ✅ Full | Default authority |
| **B (Company)** | ✅ Full | Override authority |
| **C (Alpha)** | ✅ Full | Override authority |
| **D (Sandbox)** | ✅ Full | Override authority |
| **E (Production)** | ✅ Full | Override authority |

### Action Privileges

| Action | Allowed | Notes |
|--------|---------|-------|
| **access:grant:\*** | ✅ Yes | Grant access to users |
| **access:revoke:\*** | ✅ Yes | Revoke access from users |
| **access:delegate:\*** | ✅ Yes | Delegate access to others |
| **role:assign:\*** | ✅ Yes | Assign roles |
| **role:revoke:\*** | ✅ Yes | Revoke roles |
| **environment:bind:\*** | ✅ Yes | Bind nodes to environments |
| **environment:promote:\*** | ✅ Yes | Promote to production |
| **node:admin:\*** | ✅ Yes | Full node administration |
| **node:superadmin:\*** | ✅ Yes | Creator-level node access |
| **codegen:execute:\*** | ✅ Yes | Execute code generation |
| **codegen:deploy:\*** | ✅ Yes | Deploy generated code |
| **system:configure:\*** | ✅ Yes | System-wide configuration |
| **production:deploy:\*** | ✅ Yes | Deploy to production |
| **production:promote:\*** | ✅ Yes | Approve production promotion |

### Override Authority

| Property | Value |
|----------|-------|
| **Can Override Access Policies** | ✅ Yes |
| **Can Override Role Assignments** | ✅ Yes |
| **Can Override Environment Restrictions** | ✅ Yes |
| **Can Revoke Any Session** | ✅ Yes |
| **Can Invalidate Any Token** | ✅ Yes |

---

## 📝 AUDIT REQUIREMENTS

### Logged Events

| Event | Audit Level | Details Required |
|-------|-------------|-----------------|
| **Login** | Maximum | IP, device, timestamp, user agent |
| **Logout** | Maximum | Session duration, reason |
| **Failed Login** | Maximum | IP, device, timestamp, failure reason |
| **Session Created** | Maximum | Session ID, device context, browser context |
| **Session Revoked** | Maximum | Reason, initiator, timestamp |
| **Password Changed** | Maximum | Timestamp, IP, device (not password itself) |
| **Binding Changed** | Maximum | Old/new binding details |
| **Privileged Action** | Maximum | Action, target, result, timestamp |
| **Delegation Created** | Maximum | Delegatee, node, role, scopes |
| **Delegation Revoked** | Maximum | Delegatee, node, reason |

### Audit Retention

| Property | Value |
|----------|-------|
| **Retention Period** | 365 days |
| **Storage** | Immutable audit log |
| **Access** | creator-superadmin + auditors only |
| **Export** | Allowed for compliance |

---

## 🔄 RECOVERY PROCESS

### Standard Recovery NOT Available

| Recovery Method | Available | Reason |
|-----------------|-----------|--------|
| **Email Reset** | ❌ No | Security risk |
| **Phone Reset** | ❌ No | Security risk |
| **Security Questions** | ❌ No | Not configured |
| **Provider Recovery** | ❌ No | Not linked to providers |

### Special Recovery Process

| Step | Action |
|------|--------|
| 1 | Contact designated recovery contacts |
| 2 | Provide identity verification documents |
| 3 | Manual verification by trusted parties |
| 4 | Multi-party approval required |
| 5 | Account recovery with full audit |
| 6 | Password reset with new credentials |
| 7 | All sessions invalidated |
| 8 | Full security review |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "creatorSuperadminAccount": {
    "identity": {
      "fullName": "Оберюхтин Иван Анатольевич",
      "email": "o8eryuhtin@yandex.ru",
      "phone": "89292167585",
      "gender": "male",
      "birthDate": "06.04.1993",
      "registrationDate": "14.06.2026",
      "projectStartDate": "14.06.2026"
    },
    "role": {
      "roleId": "creator-superadmin",
      "authorityLevel": "L10",
      "accessClass": "maximal"
    },
    "auth": {
      "authMethod": "dedicated-login-password",
      "passwordMinLength": 16,
      "mandatoryBindings": ["email", "phone"]
    },
    "exclusions": {
      "notAllowedProviders": ["yandex-id", "phone-3char-code", "max", "gosuslugi", "qr-code"],
      "isolatedFromCommonProviders": true
    },
    "security": {
      "securityClass": "highest",
      "auditLevel": "maximum",
      "idleTimeoutMinutes": 15,
      "maxConcurrentSessions": 3
    },
    "privileges": {
      "fullPlatformAccess": true,
      "nodeGroups": ["A", "B", "C", "D", "E"],
      "overrideAuthority": true
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_CREATOR_SUPERADMIN_MODEL.md](./AUTH_CREATOR_SUPERADMIN_MODEL.md) — Auth model
- [../access/ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy
- [../state/auth-creator-superadmin.json](../state/auth-creator-superadmin.json) — State file
- [../contracts/auth/AuthCreatorSuperadminContract.md](../contracts/auth/AuthCreatorSuperadminContract.md) — Contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
