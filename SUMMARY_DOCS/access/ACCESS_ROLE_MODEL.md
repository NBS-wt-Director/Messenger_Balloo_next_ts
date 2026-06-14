---
title: Access Role Model
description: Модель ролей доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - roles
  - rbac
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/access/ACCESS_SCOPE_MODEL.md
  - SUMMARY_DOCS/state/access-roles.json
---

# 🎭 ACCESS ROLE MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **роли доступа** платформы Balloo.

**Цель:** Обеспечить role-based access control с явными полномочиями и ограничениями.

---

## 👑 ROLE CLASSES (7)

### Overview

| Role ID | Level | Name | Authority |
|---------|-------|------|-----------|
| `creator-superadmin` | L10 | Creator Superadmin | Full platform |
| `delegated-node-admin` | L8 | Delegated Node Admin | Per-node |
| `company-staff` | L6 | Company Staff | NBS-wt internal |
| `alpha-staff` | L5 | Alpha Staff | Alpha zone |
| `alpha-volunteer` | L4 | Alpha Volunteer | Alpha testing |
| `sandbox-operator` | L3 | Sandbox Operator | Working/sandbox |
| `public-user` | L1 | Public User | Production public |

---

## 1. CREATOR-SUPERADMIN (L10)

### Identity

| Field | Value |
|-------|-------|
| **roleId** | `creator-superadmin` |
| **displayName** | Creator Superadmin |
| **authorityLevel** | L10 |
| **canonicalHolder** | Оберюхтин Иван Анатольевич |
| **email** | o8eryuhtin@yandex.ru |

### Purpose

Единственная каноническая роль создателя с максимальными полномочиями.

### Allowed Node Groups

| Group | Access | Notes |
|-------|--------|-------|
| **A (Privileged)** | ✅ Full | All privileged nodes |
| **B (Company)** | ✅ Full | Override authority |
| **C (Alpha)** | ✅ Full | Override authority |
| **D (Sandbox)** | ✅ Full | Override authority |
| **E (Production)** | ✅ Full | Override authority |

### Forbidden Node Groups

**None** — Has access to all node groups.

### Default Scopes

- `node:*:*` — All node actions
- `access:*:*` — All access management
- `role:*:*` — All role management
- `environment:*:*` — All environment actions
- `system:*:*` — All system actions

### Delegation Rules

| Can Delegate | To Role | Scope |
|-------------|---------|-------|
| ✅ | delegated-node-admin | Per-node admin |
| ✅ | company-staff | Internal access |
| ✅ | alpha-staff | Alpha zone |
| ✅ | alpha-volunteer | Alpha testing |
| ✅ | sandbox-operator | Sandbox access |
| ❌ | creator-superadmin | Cannot delegate own role |

### Escalation Rules

**N/A** — Highest authority level.

### Revocation Rules

**Cannot be revoked** — Canonical creator role.

---

## 2. DELEGATED-NODE-ADMIN (L8)

### Identity

| Field | Value |
|-------|-------|
| **roleId** | `delegated-node-admin` |
| **displayName** | Delegated Node Admin |
| **authorityLevel** | L8 |
| **delegatedBy** | creator-superadmin |

### Purpose

Делегированная администрация отдельных узлов.

### Allowed Node Groups

| Group | Access | Notes |
|-------|--------|-------|
| **A (Privileged)** | ⚠️ Explicit only | Per-node delegation required |
| **B (Company)** | ✅ With delegation | Specific nodes only |
| **C (Alpha)** | ⚠️ Explicit only | Per-node delegation required |
| **D (Sandbox)** | ✅ With delegation | Specific nodes only |
| **E (Production)** | ⚠️ Explicit only | Per-node delegation required |

### Forbidden Node Groups

**None by default** — Access is per-node explicit.

### Default Scopes

- `node:read:*` — Read access to assigned nodes
- `node:write:*` — Write access to assigned nodes
- `node:configure:*` — Configure assigned nodes
- `access:read:*` — Read access logs

### Delegation Rules

| Can Delegate | To Role | Scope |
|-------------|---------|-------|
| ❌ | Any | Cannot delegate further |

### Escalation Rules

**To creator-superadmin** — For access beyond delegation.

### Revocation Rules

- creator-superadmin can revoke at any time
- Automatic revocation on node reassignment
- Time-limited delegations expire automatically

---

## 3. COMPANY-STAFF (L6)

### Identity

| Field | Value |
|-------|-------|
| **roleId** | `company-staff` |
| **displayName** | Company Staff |
| **authorityLevel** | L6 |
| **organization** | NBS-wt |

### Purpose

Сотрудники компании NBS-wt с доступом к внутренним узлам.

### Allowed Node Groups

| Group | Access | Notes |
|-------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ✅ Full | workdocs, admin |
| **C (Alpha)** | ⚠️ Limited | Alpha-staff role required for more |
| **D (Sandbox)** | ✅ Full | All sandbox nodes |
| **E (Production)** | ⚠️ Public only | Public surfaces only |

### Forbidden Node Groups

- **Group A** — Privileged technical nodes

### Default Scopes

- `node:read:company` — Read company nodes
- `node:use:company` — Use company nodes
- `node:read:sandbox` — Read sandbox nodes
- `node:use:sandbox` — Use sandbox nodes
- `docs:read:*` — Read documentation
- `docs:write:workdocs` — Write to workdocs

### Delegation Rules

| Can Delegate | To Role | Scope |
|-------------|---------|-------|
| ❌ | Any | Cannot delegate |

### Escalation Rules

**To delegated-node-admin** — For node admin access.

### Revocation Rules

- Revoked on employment termination
- HR system integration required
- Immediate revocation on security incident

---

## 4. ALPHA-STAFF (L5)

### Identity

| Field | Value |
|-------|-------|
| **roleId** | `alpha-staff` |
| **displayName** | Alpha Staff |
| **authorityLevel** | L5 |
| **zone** | alpha |

### Purpose

Кураторы и сотрудники alpha-зоны.

### Allowed Node Groups

| Group | Access | Notes |
|-------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ⚠️ Limited | If also company-staff |
| **C (Alpha)** | ✅ Full | All alpha nodes |
| **D (Sandbox)** | ⚠️ Limited | Alpha-related only |
| **E (Production)** | ⚠️ Public only | Public surfaces only |

### Forbidden Node Groups

- **Group A** — Privileged technical nodes
- **Group B** — Without company-staff role

### Default Scopes

- `node:read:alpha` — Read alpha nodes
- `node:use:alpha` — Use alpha nodes
- `node:moderate:alpha` — Moderate alpha content
- `volunteer:manage:*` — Manage volunteers

### Delegation Rules

| Can Delegate | To Role | Scope |
|-------------|---------|-------|
| ❌ | Any | Cannot delegate |

### Escalation Rules

**To company-staff or delegated-node-admin** — For broader access.

### Revocation Rules

- Revoked on alpha program end
- Revoked on volunteer agreement termination

---

## 5. ALPHA-VOLUNTEER (L4)

### Identity

| Field | Value |
|-------|-------|
| **roleId** | `alpha-volunteer` |
| **displayName** | Alpha Volunteer |
| **authorityLevel** | L4 |
| **zone** | alpha |

### Purpose

Волонтёры и участники alpha-тестирования.

### Allowed Node Groups

| Group | Access | Notes |
|-------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ❌ No | company-staff only |
| **C (Alpha)** | ✅ Limited | Testing surfaces only |
| **D (Sandbox)** | ❌ No | sandbox-operator required |
| **E (Production)** | ⚠️ Public only | Public surfaces only |

### Forbidden Node Groups

- **Group A** — Privileged technical nodes
- **Group B** — Company internal
- **Group D** — Sandbox (requires separate role)

### Default Scopes

- `node:read:alpha-public` — Read public alpha
- `node:use:alpha-testing` — Use testing features
- `feedback:submit:*` — Submit feedback
- `volunteer:read:own` — Read own volunteer data

### Delegation Rules

| Can Delegate | To Role | Scope |
|-------------|---------|-------|
| ❌ | Any | Cannot delegate |

### Escalation Rules

**To alpha-staff** — For volunteer coordination.

### Revocation Rules

- Revoked on alpha program end
- Revoked on request
- Revoked on terms violation

---

## 6. SANDBOX-OPERATOR (L3)

### Identity

| Field | Value |
|-------|-------|
| **roleId** | `sandbox-operator` |
| **displayName** | Sandbox Operator |
| **authorityLevel** | L3 |
| **environment** | working |

### Purpose

Пользователи sandbox/pre-prod среды.

### Allowed Node Groups

| Group | Access | Notes |
|-------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ❌ No | company-staff only |
| **C (Alpha)** | ❌ No | alpha role required |
| **D (Sandbox)** | ✅ Full | All sandbox nodes |
| **E (Production)** | ⚠️ Public only | Public surfaces only |

### Forbidden Node Groups

- **Group A** — Privileged technical nodes
- **Group B** — Company internal
- **Group C** — Alpha zone

### Default Scopes

- `node:read:sandbox` — Read sandbox nodes
- `node:use:sandbox` — Use sandbox features
- `node:configure:sandbox` — Configure sandbox (limited)
- `api:use:sandbox` — Use sandbox API

### Delegation Rules

| Can Delegate | To Role | Scope |
|-------------|---------|-------|
| ❌ | Any | Cannot delegate |

### Escalation Rules

**To company-staff** — For production access.

### Revocation Rules

- Revoked on sandbox access period end
- Revoked on terms violation

---

## 7. PUBLIC-USER (L1)

### Identity

| Field | Value |
|-------|-------|
| **roleId** | `public-user` |
| **displayName** | Public User |
| **authorityLevel** | L1 |
| **environment** | production |

### Purpose

Внешние пользователи публичных production узлов.

### Allowed Node Groups

| Group | Access | Notes |
|-------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ❌ No | company-staff only |
| **C (Alpha)** | ❌ No | alpha role required |
| **D (Sandbox)** | ❌ No | sandbox-operator required |
| **E (Production)** | ✅ Public only | Public surfaces only |

### Forbidden Node Groups

- **Group A-D** — All non-public nodes

### Default Scopes

- `node:read:public` — Read public content
- `node:use:public` — Use public features
- `account:manage:own` — Manage own account

### Delegation Rules

| Can Delegate | To Role | Scope |
|-------------|---------|-------|
| ❌ | Any | Cannot delegate |

### Escalation Rules

**To sandbox-operator** — For sandbox access.

### Revocation Rules

- Revoked on terms violation
- Revoked on account deletion

---

## 📊 ROLE SUMMARY TABLE

| Role | Level | Group A | Group B | Group C | Group D | Group E | Can Delegate |
|------|-------|---------|---------|---------|---------|---------|--------------|
| creator-superadmin | L10 | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Yes |
| delegated-node-admin | L8 | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ❌ No |
| company-staff | L6 | ❌ No | ✅ Full | ⚠️ Limited | ✅ Full | ⚠️ Public | ❌ No |
| alpha-staff | L5 | ❌ No | ⚠️ Limited | ✅ Full | ⚠️ Limited | ⚠️ Public | ❌ No |
| alpha-volunteer | L4 | ❌ No | ❌ No | ⚠️ Limited | ❌ No | ⚠️ Public | ❌ No |
| sandbox-operator | L3 | ❌ No | ❌ No | ❌ No | ✅ Full | ⚠️ Public | ❌ No |
| public-user | L1 | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Public | ❌ No |

**Legend:** ✅ Full access | ⚠️ Limited/Explicit | ❌ No access

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "roleModel": {
    "totalRoles": 7,
    "creatorSuperadmin": {
      "roleId": "creator-superadmin",
      "level": "L10",
      "holder": "Оберюхтин Иван Анатольевич",
      "email": "o8eryuhtin@yandex.ru"
    },
    "roles": [
      { "id": "creator-superadmin", "level": 10, "delegable": true },
      { "id": "delegated-node-admin", "level": 8, "delegable": false },
      { "id": "company-staff", "level": 6, "delegable": false },
      { "id": "alpha-staff", "level": 5, "delegable": false },
      { "id": "alpha-volunteer", "level": 4, "delegable": false },
      { "id": "sandbox-operator", "level": 3, "delegable": false },
      { "id": "public-user", "level": 1, "delegable": false }
    ],
    "nodeGroups": ["A", "B", "C", "D", "E"],
    "accessLevels": ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_SCOPE_MODEL.md](./ACCESS_SCOPE_MODEL.md) — Scope model
- [ACCESS_DELEGATION_MODEL.md](./ACCESS_DELEGATION_MODEL.md) — Delegation model
- [../state/access-roles.json](../state/access-roles.json) — Role registry
- [../contracts/access/AccessRoleContract.md](../contracts/access/AccessRoleContract.md) — Role contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
