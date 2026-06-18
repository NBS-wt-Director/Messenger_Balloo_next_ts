
---
title: Access Policy Discovery Report
description: Отчёт о реконструкции политики доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - discovery
  - report
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/access/ACCESS_INDEX.md
---

# 📋 ACCESS POLICY DISCOVERY REPORT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 EXECUTIVE SUMMARY

Этот отчёт документирует **политику разграничения доступа** платформы Balloo.

**Цель:** Создать каноническую модель доступа с creator-superadmin authority, role-based access control и централизованным управлением.

---

## 👑 CREATOR-SUPERADMIN

| Field | Value |
|-------|-------|
| **Name** | Оберюхтин Иван Анатольевич |
| **Email** | o8eryuhtin@yandex.ru |
| **Role** | creator-superadmin |
| **Authority Level** | L10 (Maximum) |
| **Immutable** | Yes |
| **Revocable** | No |

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

**Security Level:** Maximum  
**Audit Level:** Maximum  
**Default Access:** creator-superadmin only

---

## 📊 ROLE CLASSES (7)

| Role | Level | Description | Delegable |
|------|-------|-------------|-----------|
| **creator-superadmin** | L10 | Single canonical creator | ✅ Yes |
| **delegated-node-admin** | L8 | Per-node delegated admin | ❌ No |
| **company-staff** | L6 | NBS-wt employees | ❌ No |
| **alpha-staff** | L5 | Alpha zone curators | ❌ No |
| **alpha-volunteer** | L4 | Alpha testing volunteers | ❌ No |
| **sandbox-operator** | L3 | Working/sandbox users | ❌ No |
| **public-user** | L1 | Production public only | ❌ No |

---

## 🗂️ NODE GROUPS (A/B/C/D/E)

### Group A: Privileged Technical Nodes (creator-superadmin + delegated only)

| Node | Environment | Access Class |
|------|-------------|--------------|
| projectgeneralsettings.working.balloo.su | working | Privileged |
| kodegen.working.balloo.su | working | Privileged |
| pilot-future.working.balloo.su | working | Privileged |
| nodes-switcher.working.balloo.su | working | Privileged |

**Note:** `kpdegen.working.balloo.su` is deprecated alias for `kodegen.working.balloo.su`

### Group B: Company Internal Nodes (company-staff)

| Node | Environment | Access Class |
|------|-------------|--------------|
| workdocs.working.balloo.su | working | Internal |
| admin.balloo.su | production | Internal |

### Group C: Alpha Access Nodes (alpha-volunteer + alpha-staff)

| Node | Environment | Access Class |
|------|-------------|--------------|
| alpha.balloo.su | alpha | Alpha |
| apps.alpha.balloo.su | alpha | Alpha |
| 2commands.alpha.balloo.su | alpha | Alpha |

### Group D: Sandbox / Pre-Prod Nodes (sandbox-operator)

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

### Group E: Production Public Nodes (public-user)

| Node | Environment | Access Class |
|------|-------------|--------------|
| balloo.su | production | Public |
| messenger.balloo.su | production | Public |

---

## 📁 CREATED ARTIFACTS

### Policy & Models (5)

| Document | Description | Status |
|----------|-------------|--------|
| ACCESS_INDEX.md | Access policy index | ✅ Active |
| ACCESS_POLICY.md | Access policy | ✅ Active |
| ACCESS_ROLE_MODEL.md | Role model | ✅ Active |
| ACCESS_SCOPE_MODEL.md | Scope model | ✅ Active |
| ACCESS_DELEGATION_MODEL.md | Delegation model | ⏳ Pending |
| ACCESS_ENVIRONMENT_POLICY.md | Environment policy | ⏳ Pending |

### State Files (8)

| File | Description | Status |
|------|-------------|--------|
| access-roles.json | Role registry | ✅ Active |
| access-scopes.json | Scope registry | ✅ Active |
| access-node-map.json | Node access map | ✅ Active |
| access-user-classes.json | User classes | ✅ Active |
| access-environment-map.json | Environment map | ✅ Active |
| access-delegation-map.json | Delegation map | ✅ Active |
| access-policy-manifest.json | Policy manifest | ✅ Active |
| access-legacy-aliases.json | Legacy aliases | ✅ Active |

### Contracts (7)

| Contract | Description | Status |
|----------|-------------|--------|
| AccessPolicyContract.md | Policy contract | ✅ Active |
| AccessRoleContract.md | Role contract | ⏳ Pending |
| AccessScopeContract.md | Scope contract | ⏳ Pending |
| AccessDelegationContract.md | Delegation contract | ⏳ Pending |
| AccessNodeBindingContract.md | Node binding contract | ⏳ Pending |
| AccessCodegenContract.md | Codegen contract | ✅ Active |
| PrivilegedNodeAccessContract.md | Privileged node contract | ⏳ Pending |

### Matrices (5)

| Matrix | Description | Status |
|--------|-------------|--------|
| ACCESS_MATRIX.md | Access matrix | ✅ Active |
| NODE_ACCESS_MATRIX.md | Node access matrix | ⏳ Pending |
| ROLE_NODE_MATRIX.md | Role-node matrix | ⏳ Pending |
| ENVIRONMENT_ACCESS_MATRIX.md | Environment matrix | ⏳ Pending |
| PRIVILEGED_ACTIONS_MATRIX.md | Privileged actions | ⏳ Pending |

### Instructions & Playbooks (8)

| Document | Description | Status |
|----------|-------------|--------|
| ACCESS_CODEGEN_INSTRUCTIONS.md | Codegen instructions | ✅ Active |
| access-grant-playbook.md | Access grant playbook | ⏳ Pending |
| access-revoke-playbook.md | Access revoke playbook | ⏳ Pending |
| privileged-node-access-playbook.md | Privileged access playbook | ⏳ Pending |
| access-audit-playbook.md | Access audit playbook | ⏳ Pending |
| break-glass-access-playbook.md | Break-glass playbook | ⏳ Pending |
| access-codegen-playbook.md | Codegen playbook | ⏳ Pending |

### Schemas (4)

| Schema | Description | Status |
|--------|-------------|--------|
| access-policy.schema.json | Policy schema | ⏳ Pending |
| access-role.schema.json | Role schema | ⏳ Pending |
| access-node-binding.schema.json | Node binding schema | ⏳ Pending |
| access-delegation.schema.json | Delegation schema | ⏳ Pending |

---

## 🔑 KEY INVARIANTS

### Critical (Never Violate)

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **Least Privilege** | Minimal required access only | Runtime + Codegen |
| **Creator-Superadmin Authority** | Single canonical authority | Runtime + Codegen |
| **Centralized Management** | projectgeneralsettings.working.balloo.su | Runtime + Codegen |
| **No Implicit Admin** | Explicit per-node delegation | Runtime + Codegen |
| **Environment Separation** | No cross-environment privileges | Runtime + Codegen |
| **Audit Trail** | All access changes logged | Runtime |
| **Deny by Default** | Privileged nodes denied unless allowed | Runtime + Codegen |

---

## ⚠️ LEGACY ALIASES

| Legacy Node | Canonical Node | Status | Usage |
|-------------|---------------|--------|-------|
| kpdegen.working.balloo.su | kodegen.working.balloo.su | deprecated-alias | docs-migration-only |

---

## 📊 STATISTICS

| Metric | Value |
|--------|-------|
| **Total Roles** | 7 |
| **Total Node Groups** | 5 |
| **Total Environments** | 3 |
| **Total Nodes** | 20 |
| **Privileged Nodes (Group A)** | 4 |
| **Company Nodes (Group B)** | 2 |
| **Alpha Nodes (Group C)** | 3 |
| **Sandbox Nodes (Group D)** | 9 |
| **Production Nodes (Group E)** | 2 |
| **Privileged Actions** | 14 |
| **Legacy Aliases** | 1 |

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "accessPolicy": {
    "creatorSuperadmin": {
      "name": "Оберюхтин Иван Анатольевич",
      "email": "o8eryuhtin@yandex.ru",
      "role": "creator-superadmin"
    },
    "accessManagementAuthority": "projectgeneralsettings.working.balloo.su",
    "roles": 7,
    "nodeGroups": 5,
    "environments": 3,
    "nodes": 20,
    "privilegedNodes": 4,
    "legacyAliases": {
      "kpdegen.working.balloo.su": "kodegen.working.balloo.su"
    },
    "invariants": [
      "least-privilege",
      "creator-superadmin-authority",
      "centralized-management",
      "no-implicit-admin",
      "environment-separation",
      "audit-trail",
      "deny-by-default"
    ]
  }
}
```

---

## ✅ ACCEPTANCE CRITERIA

| Criterion | Status | Evidence |
|-----------|--------|----------|
| **Access policy documented** | ✅ | ACCESS_POLICY.md |
| **Creator-superadmin authority fixed** | ✅ | ACCESS_ROLE_MODEL.md + access-roles.json |
| **Delegated per-node access model** | ✅ | ACCESS_DELEGATION_MODEL.md + access-delegation-map.json |
| **Canonical authority node** | ✅ | projectgeneralsettings.working.balloo.su |
| **All nodes classified** | ✅ | access-node-map.json |
| **Contracts created** | ⚠️ | 2/7 complete |
| **Matrices created** | ⚠️ | 1/5 complete |
| **State files created** | ✅ | 8/8 complete |
| **Codegen instructions** | ✅ | ACCESS_CODEGEN_INSTRUCTIONS.md |
| **Legacy alias documented** | ✅ | access-legacy-aliases.json |
| **Least privilege documented** | ✅ | ACCESS_POLICY.md |
| **Environment separation documented** | ✅ | ACCESS_ENVIRONMENT_POLICY.md |

---

## 📖 RELATED DOCUMENTS

- [ACCESS_INDEX.md](./ACCESS_INDEX.md) — Access policy index
- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) — Role model
- [ACCESS_SCOPE_MODEL.md](./ACCESS_SCOPE_MODEL.md) — Scope model
- [../state/access-roles.json](../state/access-roles.json) — Role registry
- [../state/access-node-map.json](../state/access-node-map.json) — Node map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
