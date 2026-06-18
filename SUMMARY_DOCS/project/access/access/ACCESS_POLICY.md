---
title: Access Policy
description: Каноническая политика разграничения доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - security
  - rbac
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_ROLE_MODEL.md
  - SUMMARY_DOCS/access/ACCESS_SCOPE_MODEL.md
  - SUMMARY_DOCS/contracts/access/AccessPolicyContract.md
---

# 🔐 ACCESS POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **каноническую модель разграничения доступа** платформы Balloo.

**Цель:** Обеспечить безопасное управление доступом к узлам с creator-superadmin authority, role-based access control и централизованным управлением.

---

## 👑 CREATOR-SUPERADMIN AUTHORITY

### Canonical Creator-Superadmin

| Field | Value |
|-------|-------|
| **Name** | Оберюхтин Иван Анатольевич |
| **Email** | o8eryuhtin@yandex.ru |
| **Role** | creator-superadmin |
| **Authority Level** | L10 (Maximum) |

### Creator-Superadmin Powers

**Has Full Control Over:**
- Privileged node access policy
- Per-node delegated access grants
- Access revocation
- Role assignments
- Environment restrictions
- System-wide settings

**Can Delegate:**
- Per-node admin access (explicit, not implicit)
- Limited operational roles
- Read-only access
- Configuration access

**Cannot Delegate:**
- creator-superadmin role itself
- Cross-environment privileges
- Policy override authority

---

## 🏛️ ACCESS MANAGEMENT AUTHORITY

### Canonical Authority Node

**Node:** `projectgeneralsettings.working.balloo.su`

**Purpose:** Centralized access management for all platform nodes.

**Responsibilities:**
| Function | Description |
|----------|-------------|
| **Node Access Assignments** | Assign roles to nodes |
| **Role Binding** | Bind users to roles |
| **Environment Restrictions** | Define environment boundaries |
| **Node Visibility** | Control node visibility |
| **Delegated Access Policies** | Manage delegation rules |
| **Revocation Rules** | Define revocation conditions |

### Authority Node Security

**Access Class:** Privileged (Group A)  
**Default Access:** creator-superadmin only  
**Delegated Access:** Explicit per-node only  
**Audit Level:** Maximum (all actions logged)

---

## 🎯 PHILOSOPHY

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Least Privilege** | Grant minimal required access |
| **Explicit Authorization** | No implicit permissions |
| **Centralized Management** | Single authority node |
| **Environment Separation** | No cross-environment privileges |
| **Audit Trail** | All changes logged |
| **Deny by Default** | Privileged nodes denied unless allowed |

### Access Model

```
User → Role → Scopes → Node → Actions
```

**Key Concepts:**
- Users are assigned roles
- Roles have defined scopes
- Scopes permit specific actions
- Actions apply to specific nodes
- Nodes belong to environments

---

## 📊 ROLE MODEL OVERVIEW

### Role Classes (7)

| Role | Level | Description |
|------|-------|-------------|
| **creator-superadmin** | L10 | Single canonical creator |
| **delegated-node-admin** | L8 | Per-node delegated admin |
| **company-staff** | L6 | NBS-wt employees |
| **alpha-staff** | L5 | Alpha zone curators |
| **alpha-volunteer** | L4 | Alpha testing volunteers |
| **sandbox-operator** | L3 | Working/sandbox users |
| **public-user** | L1 | Production public only |

### Role Hierarchy

```
creator-superadmin (L10)
    ↓ (delegates)
delegated-node-admin (L8)
    ↓
company-staff (L6)
    ↓
alpha-staff (L5)
    ↓
alpha-volunteer (L4)
    ↓
sandbox-operator (L3)
    ↓
public-user (L1)
```

**Note:** Higher roles do NOT automatically inherit lower role node access. Each role has explicit node bindings.

---

## 🗂️ NODE CLASSIFICATION

### Group A: Privileged Technical Nodes

**Access:** creator-superadmin + explicit delegated only

| Node | Environment | Purpose |
|------|-------------|---------|
| projectgeneralsettings.working.balloo.su | working | Access management authority |
| kodegen.working.balloo.su | working | Code generation |
| pilot-future.working.balloo.su | working | Future features pilot |
| nodes-switcher.working.balloo.su | working | Node version switching |

**Legacy Alias:** `kpdegen.working.balloo.su` → `kodegen.working.balloo.su`

### Group B: Company Internal Nodes

**Access:** company-staff + higher

| Node | Environment | Purpose |
|------|-------------|---------|
| workdocs.working.balloo.su | working | Work documentation |
| admin.balloo.su | production | Production admin |

### Group C: Alpha Access Nodes

**Access:** alpha-volunteer + alpha-staff + higher

| Node | Environment | Purpose |
|------|-------------|---------|
| alpha.balloo.su | alpha | Alpha testing |
| apps.alpha.balloo.su | alpha | Alpha apps |
| 2commands.alpha.balloo.su | alpha | Volunteer cabinet |

### Group D: Sandbox / Pre-Prod Nodes

**Access:** sandbox-operator + higher

| Node | Environment | Purpose |
|------|-------------|---------|
| working.balloo.su | working | Sandbox main |
| api.working.balloo.su | working | Sandbox API |
| files.working.balloo.su | working | Sandbox files |
| docs.working.balloo.su | working | Sandbox docs |
| future.working.balloo.su | working | Sandbox future |
| admin.working.balloo.su | working | Sandbox admin |
| workers.working.balloo.su | working | Sandbox workers |
| abaut.working.balloo.su | working | Sandbox about |
| apps.working.balloo.su | working | Sandbox apps |

### Group E: Production Public Nodes

**Access:** public-user + higher

| Node | Environment | Purpose |
|------|-------------|---------|
| balloo.su | production | Production main |
| messenger.balloo.su | production | Production messenger |
| (others) | production | Production services |

---

## 🔒 ACCESS LEVELS

### Level Hierarchy

| Level | Name | Description |
|-------|------|-------------|
| L0 | none | No access |
| L1 | view | Read-only visibility |
| L2 | use | Basic usage |
| L3 | moderate | Content moderation |
| L4 | manage | Resource management |
| L5 | configure | Configuration changes |
| L6 | deploy | Deployment actions |
| L7 | switch-version | Version switching |
| L8 | approve | Approval authority |
| L9 | full-node-admin | Full node admin |
| L10 | superadmin-only | Creator-superadmin only |

---

## ⚠️ PRIVILEGED ACTIONS

### Actions Requiring Elevated Access

| Action | Min Level | Notes |
|--------|-----------|-------|
| **Change node settings** | L6 | Configuration changes |
| **Switch node versions** | L7 | Version control |
| **Manage rollout/update** | L7 | Deployment control |
| **Execute code generation** | L8 | kodegen access |
| **Grant/revoke access** | L9 | Access management |
| **Activate/deactivate features** | L6 | Feature flags |
| **Change system-wide settings** | L8 | Global config |
| **Change tariff/settings** | L7 | Billing changes |
| **Change visibility** | L6 | Node visibility |
| **Change environment binding** | L8 | Environment changes |
| **Approve production promotion** | L9 | Production deployment |

---

## 🌍 ENVIRONMENT SEPARATION

### Environment Boundaries

| Environment | Nodes | Access Restrictions |
|-------------|-------|---------------------|
| **production** | balloo.su, messenger.balloo.su, admin.balloo.su | Strict access control |
| **alpha** | alpha.balloo.su, apps.alpha.balloo.su | Alpha roles only |
| **working** | *.working.balloo.su | Internal/sandbox only |

### Separation Rules

1. **No Automatic Carryover** — Access in one environment does not grant access to another
2. **Production Isolation** — Production requires explicit authorization
3. **Working ≠ Production** — Sandbox access is not production authority
4. **Controlled Promotion** — Production updates via controlled path only

---

## 📋 DELEGATION RULES

### Delegation Principles

| Principle | Description |
|-----------|-------------|
| **Explicit** | All delegation must be explicit |
| **Per-Node** | Delegation is node-specific |
| **Scoped** | Delegation includes scope limits |
| **Auditable** | All delegation logged |
| **Revocable** | All delegation can be revoked |

### Delegation Types

| Type | Description | Example |
|------|-------------|---------|
| **Temporary** | Time-limited access | 7-day access grant |
| **Persistent** | Until revoked | Ongoing node admin |
| **Read-Only** | View access only | Audit access |
| **Operational** | Day-to-day operations | Deploy access |
| **Configuration** | Config changes only | Settings admin |

### Forbidden Delegation

- ❌ Implicit admin inheritance
- ❌ Cross-environment privileges
- ❌ creator-superadmin role delegation
- ❌ Wildcard permissions

---

## 🔍 AUDIT REQUIREMENTS

### What Must Be Logged

| Event | Details |
|-------|---------|
| **Access Grant** | Who, what, when, which node |
| **Access Revoke** | Who, what, when, which node |
| **Role Assignment** | User, role, timestamp |
| **Privileged Action** | Action, user, node, result |
| **Delegation Change** | Delegator, delegatee, scope |
| **Environment Change** | What changed, who, when |

### Audit Trail Requirements

- All access changes logged
- Logs immutable
- Logs retained minimum 90 days
- Logs accessible to creator-superadmin
- Logs reviewable by delegated auditors

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "accessPolicy": {
    "creatorSuperadmin": {
      "name": "Оберюхтин Иван Анатольевич",
      "email": "o8eryuhtin@yandex.ru",
      "authorityNode": "projectgeneralsettings.working.balloo.su"
    },
    "roleClasses": 7,
    "nodeGroups": 5,
    "accessLevels": 11,
    "invariants": [
      "least-privilege",
      "explicit-authorization",
      "centralized-management",
      "environment-separation",
      "audit-trail",
      "deny-by-default"
    ],
    "legacyAliases": {
      "kpdegen.working.balloo.su": "kodegen.working.balloo.su"
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) — Role model
- [ACCESS_SCOPE_MODEL.md](./ACCESS_SCOPE_MODEL.md) — Scope model
- [ACCESS_DELEGATION_MODEL.md](./ACCESS_DELEGATION_MODEL.md) — Delegation model
- [../contracts/access/AccessPolicyContract.md](../contracts/access/AccessPolicyContract.md) — Policy contract
- [../state/access-roles.json](../state/access-roles.json) — Role registry
- [../state/access-node-map.json](../state/access-node-map.json) — Node map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
