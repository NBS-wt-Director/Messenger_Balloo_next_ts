---
title: Privileged Actions Matrix
description: Матрица привилегированных действий Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - privileged
  - matrix
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_MATRIX.md
  - SUMMARY_DOCS/access/PRIVILEGED_ACTIONS_MATRIX.md
---

# ⚠️ PRIVILEGED ACTIONS MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта матрица определяет **привилегированные действия** и требования к ним.

**Цель:** Контроль действий с повышенным риском.

---

## 📊 PRIVILEGED ACTIONS TABLE

### Legend

| Field | Description |
|-------|-------------|
| **Min Role** | Minimum role required |
| **Min Level** | Minimum authority level |
| **Audit** | Audit logging required |
| **Delegable** | Can be delegated |
| **Approval** | Approval required |

### Actions Matrix

| Action | Min Role | Min Level | Audit | Delegable | Approval | Node Scope |
|--------|----------|-----------|-------|-----------|----------|------------|
| **access:grant:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **access:revoke:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **access:delegate:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **role:assign:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **role:revoke:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **environment:bind:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **environment:promote:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **node:switch-version:\*** | delegated-node-admin | L8 | Maximum | ✅ | creator | A |
| **node:admin:\*** | delegated-node-admin | L8 | Maximum | ✅ | creator | Per-node |
| **node:superadmin:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | All |
| **codegen:execute:\*** | delegated-node-admin | L8 | Maximum | ✅ | creator | A |
| **codegen:deploy:\*** | delegated-node-admin | L8 | Maximum | ✅ | creator | A |
| **system:configure:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | A |
| **system:feature-toggle:\*** | delegated-node-admin | L8 | Standard | ✅ | creator | A, B |
| **system:tariff:\*** | delegated-node-admin | L8 | Standard | ✅ | creator | B |
| **production:deploy:\*** | delegated-node-admin | L8 | Maximum | ✅ | creator | E |
| **production:promote:\*** | creator-superadmin | L10 | Maximum | ❌ | Self | E |
| **docs:publish:\*** | delegated-node-admin | L8 | Standard | ✅ | creator | B, E |
| **alpha:volunteer:manage** | alpha-staff | L5 | Standard | ❌ | No | C |
| **sandbox:deploy:\*** | sandbox-operator | L3 | Standard | ❌ | No | D |

---

## 🔒 ACTION CATEGORIES

### Access Management Actions

| Action | Risk | Description |
|--------|------|-------------|
| access:grant:* | Critical | Grant access to users |
| access:revoke:* | Critical | Revoke access from users |
| access:delegate:* | Critical | Delegate access to others |

### Role Management Actions

| Action | Risk | Description |
|--------|------|-------------|
| role:assign:* | Critical | Assign roles to users |
| role:revoke:* | Critical | Revoke roles from users |

### Environment Actions

| Action | Risk | Description |
|--------|------|-------------|
| environment:bind:* | Critical | Bind nodes to environments |
| environment:promote:* | Critical | Promote to production |
| production:deploy:* | Critical | Deploy to production |
| production:promote:* | Critical | Approve production promotion |

### Node Actions

| Action | Risk | Description |
|--------|------|-------------|
| node:switch-version:* | High | Switch node versions |
| node:admin:* | High | Full node administration |
| node:superadmin:* | Critical | Creator-level node access |

### System Actions

| Action | Risk | Description |
|--------|------|-------------|
| system:configure:* | Critical | System-wide configuration |
| system:feature-toggle:* | Medium | Feature flag changes |
| system:tariff:* | High | Tariff/billing changes |

### Codegen Actions

| Action | Risk | Description |
|--------|------|-------------|
| codegen:execute:* | High | Execute code generation |
| codegen:deploy:* | Critical | Deploy generated code |

### Documentation Actions

| Action | Risk | Description |
|--------|------|-------------|
| docs:publish:* | Medium | Publish documentation |

### Alpha Actions

| Action | Risk | Description |
|--------|------|-------------|
| alpha:volunteer:manage | Medium | Manage volunteers |

### Sandbox Actions

| Action | Risk | Description |
|--------|------|-------------|
| sandbox:deploy:* | High | Deploy to sandbox |

---

## ⚠️ RISK LEVELS

### Critical (L10)

| Actions | Rationale |
|---------|-----------|
| access:grant, access:revoke, access:delegate | Full access control |
| role:assign, role:revoke | Role management |
| environment:bind, environment:promote | Environment control |
| production:promote | Production deployment |
| system:configure | System-wide changes |
| node:superadmin | Creator-level access |
| codegen:deploy | Code deployment |

### High (L8)

| Actions | Rationale |
|---------|-----------|
| node:switch-version | Version control |
| node:admin | Node administration |
| codegen:execute | Code generation |
| production:deploy | Production deployment |
| system:tariff | Billing changes |
| sandbox:deploy | Sandbox deployment |

### Medium (L5)

| Actions | Rationale |
|---------|-----------|
| system:feature-toggle | Feature flags |
| docs:publish | Documentation publishing |
| alpha:volunteer:manage | Volunteer management |

---

## 🔍 AUDIT REQUIREMENTS

### Maximum Audit

| Actions | Log Fields |
|---------|------------|
| access:grant, access:revoke, access:delegate | actor, target, scope, timestamp, nodeId, justification |
| role:assign, role:revoke | actor, target, role, timestamp, justification |
| environment:bind, environment:promote | actor, environment, timestamp, justification |
| production:promote | actor, source, target, timestamp, approval |
| system:configure | actor, changes, timestamp, justification |
| node:superadmin | actor, node, timestamp, justification |
| codegen:deploy | actor, code, timestamp, approval |
| node:switch-version | actor, node, from, to, timestamp |
| codegen:execute | actor, parameters, timestamp, result |
| production:deploy | actor, version, timestamp, approval |

### Standard Audit

| Actions | Log Fields |
|---------|------------|
| system:feature-toggle | actor, feature, state, timestamp |
| system:tariff | actor, tariff, changes, timestamp |
| docs:publish | actor, doc, timestamp |
| alpha:volunteer:manage | actor, volunteer, action, timestamp |
| sandbox:deploy | actor, version, timestamp |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "privilegedActionsMatrix": {
    "critical": [
      "access:grant:*",
      "access:revoke:*",
      "access:delegate:*",
      "role:assign:*",
      "role:revoke:*",
      "environment:bind:*",
      "environment:promote:*",
      "production:promote:*",
      "system:configure:*",
      "node:superadmin:*",
      "codegen:deploy:*"
    ],
    "high": [
      "node:switch-version:*",
      "node:admin:*",
      "codegen:execute:*",
      "production:deploy:*",
      "system:tariff:*",
      "sandbox:deploy:*"
    ],
    "medium": [
      "system:feature-toggle:*",
      "docs:publish:*",
      "alpha:volunteer:manage"
    ],
    "auditLevels": {
      "maximum": ["access:*", "role:*", "environment:*", "production:promote:*", "system:configure:*", "node:superadmin:*", "codegen:deploy:*", "node:switch-version:*", "codegen:execute:*", "production:deploy:*"],
      "standard": ["system:feature-toggle:*", "system:tariff:*", "docs:publish:*", "alpha:volunteer:manage", "sandbox:deploy:*"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_MATRIX.md](./ACCESS_MATRIX.md) — Access matrix
- [NODE_ACCESS_MATRIX.md](./NODE_ACCESS_MATRIX.md) — Node access matrix
- [../state/access-scopes.json](../state/access-scopes.json) — Scope registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
