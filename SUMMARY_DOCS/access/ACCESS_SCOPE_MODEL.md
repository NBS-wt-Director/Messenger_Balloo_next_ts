---
title: Access Scope Model
description: Модель scope и действий доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - scopes
  - permissions
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/access/ACCESS_ROLE_MODEL.md
  - SUMMARY_DOCS/state/access-scopes.json
---

# 🎯 ACCESS SCOPE MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **scope и действия доступа** платформы Balloo.

**Цель:** Обеспечить детализированный контроль действий с read/write/admin разграничением.

---

## 📊 SCOPE STRUCTURE

### Format

```
{resource}:{action}:{target}
```

**Components:**
- **resource** — What resource (node, access, role, environment, system)
- **action** — What action (read, write, use, configure, manage, etc.)
- **target** — Target scope (* for all, or specific)

### Examples

| Scope | Meaning |
|-------|---------|
| `node:read:*` | Read all nodes |
| `node:write:sandbox` | Write to sandbox nodes |
| `access:grant:*` | Grant access |
| `role:assign:alpha` | Assign alpha roles |

---

## 🔤 ACTION TYPES

### Core Actions

| Action | Level | Description |
|--------|-------|-------------|
| **none** | L0 | No action permitted |
| **read** | L1 | Read/view only |
| **use** | L2 | Basic usage |
| **moderate** | L3 | Content moderation |
| **manage** | L4 | Resource management |
| **configure** | L5 | Configuration changes |
| **deploy** | L6 | Deployment actions |
| **switch-version** | L7 | Version switching |
| **approve** | L8 | Approval authority |
| **admin** | L9 | Full node admin |
| **superadmin** | L10 | Creator-superadmin only |

---

## 📋 SCOPE CATALOGUE

### Node Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `node:read:*` | read | Low | ❌ | All |
| `node:use:*` | use | Low | ❌ | All |
| `node:moderate:*` | moderate | Medium | ❌ | C, D, E |
| `node:manage:*` | manage | Medium | ❌ | B, C, D |
| `node:configure:*` | configure | Medium | ⚠️ | B, D |
| `node:deploy:*` | deploy | High | ✅ | D, E |
| `node:switch-version:*` | switch-version | High | ✅ | A, D |
| `node:admin:*` | admin | Critical | ✅ | Per-node |
| `node:superadmin:*` | superadmin | Critical | ✅ | All (creator only) |

### Access Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `access:read:*` | read | Low | ❌ | All |
| `access:grant:*` | grant | High | ✅ | A |
| `access:revoke:*` | revoke | High | ✅ | A |
| `access:delegate:*` | delegate | High | ✅ | A |
| `access:audit:*` | audit | Medium | ⚠️ | A, B |

### Role Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `role:read:*` | read | Low | ❌ | All |
| `role:assign:*` | assign | High | ✅ | A |
| `role:modify:*` | modify | High | ✅ | A |
| `role:revoke:*` | revoke | High | ✅ | A |

### Environment Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `environment:read:*` | read | Low | ❌ | All |
| `environment:bind:*` | bind | High | ✅ | A |
| `environment:promote:*` | promote | Critical | ✅ | A |

### System Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `system:read:*` | read | Low | ❌ | All |
| `system:configure:*` | configure | High | ✅ | A |
| `system:feature-toggle:*` | feature-toggle | Medium | ⚠️ | A, B |
| `system:tariff:*` | tariff | High | ✅ | A, B |

### Codegen Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `codegen:read:*` | read | Low | ❌ | A |
| `codegen:execute:*` | execute | High | ✅ | A (kodegen only) |
| `codegen:deploy:*` | deploy | Critical | ✅ | A |

### Documentation Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `docs:read:*` | read | Low | ❌ | All |
| `docs:write:*` | write | Medium | ❌ | B (workdocs) |
| `docs:publish:*` | publish | Medium | ⚠️ | B, E |

### Alpha Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `alpha:read:*` | read | Low | ❌ | C |
| `alpha:use:*` | use | Low | ❌ | C |
| `alpha:feedback:*` | feedback | Low | ❌ | C |
| `alpha:volunteer:manage` | manage | Medium | ⚠️ | C (2commands) |

### Sandbox Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `sandbox:read:*` | read | Low | ❌ | D |
| `sandbox:use:*` | use | Low | ❌ | D |
| `sandbox:configure:*` | configure | Medium | ❌ | D |
| `sandbox:deploy:*` | deploy | High | ⚠️ | D |

### Production Scopes

| Scope | Action Type | Risk Level | Privileged | Compatible Nodes |
|-------|-------------|------------|------------|------------------|
| `production:read:*` | read | Low | ❌ | E |
| `production:use:*` | use | Low | ❌ | E |
| `production:deploy:*` | deploy | Critical | ✅ | A, E |
| `production:promote:*` | promote | Critical | ✅ | A |

---

## ⚠️ PRIVILEGED SCOPES

### Definition

Privileged scopes require elevated authorization and audit logging.

### List

| Scope | Reason | Min Role |
|-------|--------|----------|
| `access:grant:*` | Grants access | delegated-node-admin |
| `access:revoke:*` | Revokes access | delegated-node-admin |
| `access:delegate:*` | Delegates access | creator-superadmin |
| `role:assign:*` | Assigns roles | creator-superadmin |
| `role:revoke:*` | Revokes roles | creator-superadmin |
| `environment:bind:*` | Changes environment | creator-superadmin |
| `environment:promote:*` | Promotes to production | creator-superadmin |
| `node:switch-version:*` | Switches versions | delegated-node-admin |
| `node:admin:*` | Full node admin | delegated-node-admin |
| `node:superadmin:*` | Creator authority | creator-superadmin |
| `codegen:execute:*` | Executes codegen | delegated-node-admin |
| `system:configure:*` | System config | creator-superadmin |
| `production:deploy:*` | Production deploy | delegated-node-admin |
| `production:promote:*` | Production promote | creator-superadmin |

---

## 🎭 ROLE TO SCOPE MAPPING

### creator-superadmin

```json
{
  "roleId": "creator-superadmin",
  "scopes": [
    "*:*:*"
  ]
}
```

### delegated-node-admin

```json
{
  "roleId": "delegated-node-admin",
  "scopes": [
    "node:read:*",
    "node:write:assigned",
    "node:configure:assigned",
    "node:admin:assigned",
    "access:read:*",
    "access:grant:assigned",
    "access:revoke:assigned"
  ]
}
```

### company-staff

```json
{
  "roleId": "company-staff",
  "scopes": [
    "node:read:company",
    "node:use:company",
    "node:read:sandbox",
    "node:use:sandbox",
    "docs:read:*",
    "docs:write:workdocs"
  ]
}
```

### alpha-staff

```json
{
  "roleId": "alpha-staff",
  "scopes": [
    "node:read:alpha",
    "node:use:alpha",
    "node:moderate:alpha",
    "alpha:volunteer:manage"
  ]
}
```

### alpha-volunteer

```json
{
  "roleId": "alpha-volunteer",
  "scopes": [
    "node:read:alpha-public",
    "node:use:alpha-testing",
    "alpha:feedback:*"
  ]
}
```

### sandbox-operator

```json
{
  "roleId": "sandbox-operator",
  "scopes": [
    "node:read:sandbox",
    "node:use:sandbox",
    "node:configure:sandbox",
    "sandbox:deploy:*"
  ]
}
```

### public-user

```json
{
  "roleId": "public-user",
  "scopes": [
    "node:read:public",
    "node:use:public",
    "account:manage:own"
  ]
}
```

---

## 🔒 SCOPE INHERITANCE

### Rules

1. **No Implicit Inheritance** — Scopes must be explicitly assigned
2. **No Wildcard by Default** — `*:*:*` only for creator-superadmin
3. **Node-Specific** — Scopes bound to specific nodes unless explicitly broader
4. **Environment-Bound** — Scopes limited to role's environment

### Forbidden Patterns

| Pattern | Reason |
|---------|--------|
| `*:*:*` | Only creator-superadmin |
| `node:admin:*` | Too broad, use per-node |
| `access:*:*` | Only creator-superadmin |
| `environment:*:*` | Only creator-superadmin |

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "scopeModel": {
    "format": "{resource}:{action}:{target}",
    "actionTypes": [
      "none", "read", "use", "moderate", "manage",
      "configure", "deploy", "switch-version", "approve",
      "admin", "superadmin"
    ],
    "resources": [
      "node", "access", "role", "environment",
      "system", "codegen", "docs", "alpha",
      "sandbox", "production"
    ],
    "privilegedScopes": [
      "access:grant:*",
      "access:revoke:*",
      "access:delegate:*",
      "role:assign:*",
      "role:revoke:*",
      "environment:bind:*",
      "environment:promote:*",
      "node:switch-version:*",
      "node:admin:*",
      "node:superadmin:*",
      "codegen:execute:*",
      "system:configure:*",
      "production:deploy:*",
      "production:promote:*"
    ],
    "forbiddenPatterns": [
      "*:*:*",
      "node:admin:*",
      "access:*:*",
      "environment:*:*"
    ]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) — Role model
- [ACCESS_DELEGATION_MODEL.md](./ACCESS_DELEGATION_MODEL.md) — Delegation model
- [../state/access-scopes.json](../state/access-scopes.json) — Scope registry
- [../contracts/access/AccessScopeContract.md](../contracts/access/AccessScopeContract.md) — Scope contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
