---
title: Access Policy Index
description: Индекс политики разграничения доступа Balloo
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
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/contracts/access/AccessPolicyContract.md
  - SUMMARY_DOCS/state/access-roles.json
---

# 🔐 ACCESS POLICY INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот документ — **индекс политики разграничения доступа** платформы Balloo.

**Цель:** Зафиксировать каноническую модель доступа с role-based access control, creator-superadmin authority и централизованным управлением.

---

## 👑 CREATOR-SUPERADMIN

| Field | Value |
|-------|-------|
| **Name** | Оберюхтин Иван Анатольевич |
| **Email** | o8eryuhtin@yandex.ru |
| **Role** | creator-superadmin |
| **Authority** | Full control over privileged node access |
| **Delegation** | Can delegate per-node access explicitly |
| **Management Node** | projectgeneralsettings.working.balloo.su |

---

## 🏛️ ACCESS MANAGEMENT AUTHORITY

**Canonical Authority Node:** `projectgeneralsettings.working.balloo.su`

**Responsibilities:**
- Node access assignments
- Role binding
- Environment restrictions
- Node visibility
- Delegated access policies
- Revocation rules

---

## 📊 ROLE CLASSES (7)

| Role | Authority Level | Description |
|------|----------------|-------------|
| **creator-superadmin** | L10 | Single canonical creator, full authority |
| **delegated-node-admin** | L8 | Per-node delegated access |
| **company-staff** | L6 | NBS-wt employees |
| **alpha-staff** | L5 | Alpha zone curators |
| **alpha-volunteer** | L4 | Alpha testing volunteers |
| **sandbox-operator** | L3 | Working/sandbox access |
| **public-user** | L1 | Production public nodes only |

---

## 🗂️ NODE GROUPS (A/B/C/D/E)

### Group A: creator-superadmin + Explicit Delegated

| Node | Environment | Access Class |
|------|-------------|--------------|
| projectgeneralsettings.working.balloo.su | working | Privileged |
| kodegen.working.balloo.su | working | Privileged |
| pilot-future.working.balloo.su | working | Privileged |
| nodes-switcher.working.balloo.su | working | Privileged |

**Note:** `kpdegen.working.balloo.su` is deprecated alias for `kodegen.working.balloo.su`

### Group B: Company Staff (NBS-wt)

| Node | Environment | Access Class |
|------|-------------|--------------|
| workdocs.working.balloo.su | working | Internal |
| admin.balloo.su | production | Internal |

### Group C: Alpha Access

| Node | Environment | Access Class |
|------|-------------|--------------|
| alpha.balloo.su | alpha | Alpha |
| apps.alpha.balloo.su | alpha | Alpha |
| 2commands.alpha.balloo.su | alpha | Alpha |

### Group D: Sandbox / Pre-Prod

| Node | Environment | Access Class |
|------|-------------|--------------|
| working.balloo.su | working | Sandbox |
| api.working.balloo.su | working | Sandbox |
| files.working.balloo.su | working | Sandbox |
| docs.working.balloo.su | working | Sandbox |
| future.working.balloo.su | working | Sandbox |
| admin.working.balloo.su | working | Sandbox |
| workers.working.balloo.su | working | Sandbox |
| abaut.working.balloo.su | working | Sandbox |
| apps.working.balloo.su | working | Sandbox |

### Group E: Production Public

| Node | Environment | Access Class |
|------|-------------|--------------|
| balloo.su | production | Public |
| messenger.balloo.su | production | Public |
| (other production nodes) | production | Public/Restricted |

---

## 📁 ACCESS DOCUMENTS

### Policy & Models

| Document | Description | Status |
|----------|-------------|--------|
| [ACCESS_POLICY.md](./ACCESS_POLICY.md) | Access policy | ✅ Active |
| [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) | Role model | ✅ Active |
| [ACCESS_SCOPE_MODEL.md](./ACCESS_SCOPE_MODEL.md) | Scope model | ✅ Active |
| [ACCESS_DELEGATION_MODEL.md](./ACCESS_DELEGATION_MODEL.md) | Delegation model | ✅ Active |
| [ACCESS_ENVIRONMENT_POLICY.md](./ACCESS_ENVIRONMENT_POLICY.md) | Environment policy | ✅ Active |

### Reports & Migration

| Document | Description | Status |
|----------|-------------|--------|
| [ACCESS_DISCOVERY_REPORT.md](./ACCESS_DISCOVERY_REPORT.md) | Discovery report | ✅ Active |
| [ACCESS_MIGRATION_NOTES.md](./ACCESS_MIGRATION_NOTES.md) | Migration notes | ✅ Active |

### Matrices

| Document | Description | Status |
|----------|-------------|--------|
| [ACCESS_MATRIX.md](./ACCESS_MATRIX.md) | Access matrix | ✅ Active |
| [NODE_ACCESS_MATRIX.md](./NODE_ACCESS_MATRIX.md) | Node access matrix | ✅ Active |
| [ROLE_NODE_MATRIX.md](./ROLE_NODE_MATRIX.md) | Role-node matrix | ✅ Active |
| [ENVIRONMENT_ACCESS_MATRIX.md](./ENVIRONMENT_ACCESS_MATRIX.md) | Environment matrix | ✅ Active |
| [PRIVILEGED_ACTIONS_MATRIX.md](./PRIVILEGED_ACTIONS_MATRIX.md) | Privileged actions | ✅ Active |

---

## 📁 STATE FILES

| File | Description | Status |
|------|-------------|--------|
| [../state/access-roles.json](../state/access-roles.json) | Role registry | ✅ Active |
| [../state/access-scopes.json](../state/access-scopes.json) | Scope registry | ✅ Active |
| [../state/access-node-map.json](../state/access-node-map.json) | Node access map | ✅ Active |
| [../state/access-user-classes.json](../state/access-user-classes.json) | User classes | ✅ Active |
| [../state/access-environment-map.json](../state/access-environment-map.json) | Environment map | ✅ Active |
| [../state/access-delegation-map.json](../state/access-delegation-map.json) | Delegation map | ✅ Active |
| [../state/access-policy-manifest.json](../state/access-policy-manifest.json) | Policy manifest | ✅ Active |
| [../state/access-legacy-aliases.json](../state/access-legacy-aliases.json) | Legacy aliases | ✅ Active |

---

## 📁 CONTRACTS

| Contract | Description | Status |
|----------|-------------|--------|
| [../contracts/access/AccessPolicyContract.md](../contracts/access/AccessPolicyContract.md) | Policy contract | ✅ Active |
| [../contracts/access/AccessRoleContract.md](../contracts/access/AccessRoleContract.md) | Role contract | ✅ Active |
| [../contracts/access/AccessScopeContract.md](../contracts/access/AccessScopeContract.md) | Scope contract | ✅ Active |
| [../contracts/access/AccessDelegationContract.md](../contracts/access/AccessDelegationContract.md) | Delegation contract | ✅ Active |
| [../contracts/access/AccessNodeBindingContract.md](../contracts/access/AccessNodeBindingContract.md) | Node binding contract | ✅ Active |
| [../contracts/access/AccessCodegenContract.md](../contracts/access/AccessCodegenContract.md) | Codegen contract | ✅ Active |
| [../contracts/access/PrivilegedNodeAccessContract.md](../contracts/access/PrivilegedNodeAccessContract.md) | Privileged node contract | ✅ Active |

---

## 📁 SCHEMAS

| Schema | Description | Status |
|--------|-------------|--------|
| [../schemas/access-policy.schema.json](../schemas/access-policy.schema.json) | Policy schema | ✅ Active |
| [../schemas/access-role.schema.json](../schemas/access-role.schema.json) | Role schema | ✅ Active |
| [../schemas/access-node-binding.schema.json](../schemas/access-node-binding.schema.json) | Node binding schema | ✅ Active |
| [../schemas/access-delegation.schema.json](../schemas/access-delegation.schema.json) | Delegation schema | ✅ Active |

---

## 🔑 KEY INVARIANTS

### Critical (Never Violate)

1. **Least Privilege** — Minimal required access only
2. **Creator-Superadmin Authority** — Single canonical authority
3. **Centralized Access Management** — projectgeneralsettings.working.balloo.su
4. **No Implicit Admin** — Explicit per-node delegation required
5. **Environment Separation** — No automatic privilege carryover
6. **Audit Trail** — All access changes logged
7. **Deny by Default** — Privileged nodes denied unless explicitly allowed

### Strong (Should Follow)

1. **Role-Node Binding** — Access via roles, not individuals
2. **Scope Limitation** — Action-specific scopes
3. **Revocation Support** — Access can be revoked
4. **Documentation** — All changes documented

---

## 🤖 AI CODEGEN RELEVANCE

### For Code Generation

```json
{
  "accessPolicy": "SUMMARY_DOCS/access/ACCESS_POLICY.md",
  "roles": "SUMMARY_DOCS/state/access-roles.json",
  "scopes": "SUMMARY_DOCS/state/access-scopes.json",
  "nodeMap": "SUMMARY_DOCS/state/access-node-map.json",
  "delegation": "SUMMARY_DOCS/state/access-delegation-map.json",
  "invariants": [
    "least-privilege",
    "creator-superadmin-authority",
    "centralized-management",
    "no-implicit-admin",
    "environment-separation",
    "deny-by-default"
  ],
  "legacyAliases": {
    "kpdegen.working.balloo.su": "kodegen.working.balloo.su"
  }
}
```

---

## 🔗 RELATED DOCUMENTS

- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) — Role model
- [../state/access-roles.json](../state/access-roles.json) — Role registry
- [../contracts/access/AccessPolicyContract.md](../contracts/access/AccessPolicyContract.md) — Policy contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
