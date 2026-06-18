---
title: Auth Policy
description: Каноническая политика авторизации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - policy
  - canonical
related_docs:
  - SUMMARY_DOCS/auth/AUTH_PROVIDER_MODEL.md
  - SUMMARY_DOCS/auth/AUTH_SESSION_MODEL.md
  - SUMMARY_DOCS/auth/AUTH_CREATOR_SUPERADMIN_MODEL.md
---

# 🔐 AUTH POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **каноническую модель авторизации** платформы Balloo.

**Цель:** Обеспечить безопасную и удобную аутентификацию для всех точек входа с разделением authentication и authorization.

---

## 🔑 KEY PRINCIPLES

### 1. Authentication ≠ Authorization

| Aspect | Authentication | Authorization |
|--------|---------------|---------------|
| **Question** | Who are you? | What can you do? |
| **Scope** | Identity verification | Access control |
| **Mechanism** | Auth providers | Role/scope/node checks |
| **Document** | Auth Policy | Access Policy |

**Invariant:** Successful authentication does NOT grant automatic access to all nodes.

### 2. Creator-Superadmin Isolation

| Aspect | Common Users | Creator-Superadmin |
|--------|-------------|-------------------|
| **Auth Method** | Supported providers | Dedicated login + password |
| **Identity** | Provider-linked | Separate privileged identity |
| **Bindings** | Email/phone optional | Email + phone mandatory |
| **Cross-Entry** | Standard flow | May be isolated |
| **Recovery** | Standard recovery | Restricted recovery |

**Invariant:** Creator-superadmin account is separate from common auth providers.

### 3. Phase-Based Provider Rollout

| Phase | Providers | Status |
|-------|-----------|--------|
| **Phase 1** | Yandex.ID, Email+Password, Phone+3Char-Code | Active |
| **Phase 2** | Gosuslugi, MAX, QR-Code | Planned |

**Invariant:** Providers are enabled by phase, not all at once.

### 4. Cross-Entry Continuity

**Rule:** If a user has logged in on a specific device/browser in one entry point, login to other entry points is automatic within the same auth context.

| Aspect | Description |
|--------|-------------|
| **Scope** | Authentication continuity only |
| **Authorization** | Still checked separately per node |
| **Device Context** | Canonical device + browser + session trust |
| **Privileged Nodes** | May require additional checks |
| **Creator-Superadmin** | May be isolated from standard flow |

**Invariant:** Cross-entry is auth continuity, not access grant.

### 5. Binding Requirements

| Binding | Type | Required For |
|---------|------|--------------|
| **Email** | Mandatory | Creator-superadmin, Email+Password |
| **Phone** | Mandatory | Creator-superadmin, Phone+3Char-Code, MAX |
| **External ID** | Provider-specific | Yandex.ID, Gosuslugi |

**Invariant:** All identities must be properly bound to Balloo account.

### 6. Session Security

| Requirement | Description |
|-------------|-------------|
| **Token Validation** | All tokens must be validated |
| **Session Binding** | Sessions bound to device/browser |
| **Expiry** | All sessions have expiry |
| **Revocation** | Sessions can be revoked |
| **Password Change** | Invalidates all sessions |
| **Audit Logging** | All auth events logged |

**Invariant:** All sessions must be secured and auditable.

### 7. Security Baseline

| Provider | Security Requirements |
|----------|----------------------|
| **Yandex.ID** | Token validation, session binding |
| **Email+Password** | Password hashing, policy, email verification |
| **Phone+3Char-Code** | Short expiry, one-time use, rate limiting |
| **Gosuslugi** | Claims verification, audit logging |
| **MAX** | Bot delivery verification, code expiry |
| **QR-Code** | QR expiry, one-time use, device binding |
| **Creator-Superadmin** | Highest security, full audit |

**Invariant:** All providers must meet security baseline.

---

## 👥 USER CLASSES

| Class | Description | Auth Methods |
|-------|-------------|--------------|
| **creator-superadmin** | Single canonical creator | Dedicated login + password |
| **company-staff** | NBS-wt employees | All phase 1 providers |
| **alpha-staff** | Alpha zone curators | All phase 1 providers |
| **alpha-volunteer** | Alpha testing volunteers | All phase 1 providers |
| **sandbox-operator** | Working/sandbox users | All phase 1 providers |
| **public-user** | Production public | Limited providers |

---

## 🗂️ NODE ENTRY POINTS

| Node Class | Auth Required | Providers |
|------------|---------------|-----------|
| **Production (E)** | Optional/Public | All enabled providers |
| **Alpha (C)** | Required | All phase 1 providers |
| **Working/Sandbox (D)** | Required | All phase 1 providers |
| **Privileged (A)** | Maximum | Creator-superadmin + delegated |

---

## 🔄 AUTH FLOW

### Standard User Flow

```
1. User selects entry point (node)
2. User selects auth provider
3. Provider validates identity
4. System creates/authenticates Balloo account
5. System binds identity (email/phone/external)
6. System creates session
7. System binds session to device/browser context
8. User authenticated
9. Authorization checks apply per node/action
```

### Cross-Entry Flow

```
1. User already authenticated on device/browser
2. User accesses different entry point
3. System detects existing device/browser context
4. System reuses auth session automatically
5. User authenticated without re-login
6. Authorization checks apply per node/action
```

### Creator-Superadmin Flow

```
1. Creator-superadmin accesses privileged entry point
2. System routes to dedicated auth endpoint
3. Creator-superadmin enters login + password
4. System validates credentials
5. System validates email + phone bindings
6. System creates privileged session
7. Maximum audit logging enabled
8. Creator-superadmin authenticated
9. Full platform access granted
```

---

## ⚠️ EXCEPTIONS

### Creator-Superadmin Exceptions

| Exception | Description |
|-----------|-------------|
| **Separate Identity** | Not linked to common providers |
| **Dedicated Auth** | Login + password only |
| **Mandatory Bindings** | Email + phone required |
| **Isolated Flow** | May bypass cross-entry |
| **Restricted Recovery** | Special recovery process |

### Privileged Node Exceptions

| Exception | Description |
|-----------|-------------|
| **Additional Checks** | May require re-authentication |
| **Maximum Audit** | All actions logged at maximum level |
| **Session Timeout** | Shorter session timeout |
| **MFA Recommended** | Additional factor recommended |

---

## 📊 AUTH VS ACCESS

| Aspect | Auth (This Policy) | Access (Access Policy) |
|--------|-------------------|----------------------|
| **Question** | Who are you? | What can you do? |
| **Mechanism** | Providers, sessions | Roles, scopes, nodes |
| **Continuity** | Cross-entry automatic | Per-node checks |
| **Creator-Superadmin** | Separate identity | L10 authority |
| **Document** | AUTH_POLICY.md | ACCESS_POLICY.md |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "authPolicy": {
    "principles": [
      "auth-not-equal-access",
      "creator-superadmin-isolation",
      "phase-based-rollout",
      "cross-entry-continuity",
      "binding-required",
      "session-security",
      "security-baseline"
    ],
    "phases": {
      "phase1": ["yandex-id", "email-password", "phone-3char-code"],
      "phase2": ["gosuslugi", "max", "qr-code"]
    },
    "userClasses": [
      "creator-superadmin",
      "company-staff",
      "alpha-staff",
      "alpha-volunteer",
      "sandbox-operator",
      "public-user"
    ],
    "invariants": [
      "auth-not-equal-access",
      "creator-superadmin-separate",
      "phase-based-enablement",
      "cross-entry-auth-only",
      "binding-mandatory",
      "session-secured",
      "audit-required"
    ]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [AUTH_PROVIDER_MODEL.md](./AUTH_PROVIDER_MODEL.md) — Provider model
- [AUTH_SESSION_MODEL.md](./AUTH_SESSION_MODEL.md) — Session model
- [AUTH_CREATOR_SUPERADMIN_MODEL.md](./AUTH_CREATOR_SUPERADMIN_MODEL.md) — Creator-superadmin model
- [AUTH_CROSS_ENTRY_POLICY.md](./AUTH_CROSS_ENTRY_POLICY.md) — Cross-entry policy
- [../access/ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
