---
title: Environment Access Matrix
description: Матрица доступа по средам Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - environment
  - matrix
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_ENVIRONMENT_POLICY.md
  - SUMMARY_DOCS/state/access-environment-map.json
---

# 🌍 ENVIRONMENT ACCESS MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта матрица определяет **доступ по средам** (production, alpha, working).

**Цель:** Обеспечить изоляцию между средами.

---

## 📊 ENVIRONMENTS OVERVIEW

| Environment | ID | Risk Level | Node Count | Description |
|-------------|-----|------------|------------|-------------|
| **Production** | `production` | Critical | 2+ | Public production surface |
| **Alpha** | `alpha` | Medium | 3 | Alpha testing environment |
| **Working** | `working` | Medium | 13 | Sandbox/pre-prod environment |

---

## 📊 ROLE × ENVIRONMENT MATRIX

### Access Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full access |
| ⚠️ | Explicit/Limited access |
| ❌ | No access |
| 📢 | Public access only |

### Matrix

| Role | Production | Alpha | Working |
|------|------------|-------|---------|
| **creator-superadmin** | ✅ Full | ✅ Full | ✅ Full |
| **delegated-node-admin** | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit |
| **company-staff** | ✅ Internal | ❌ No | ✅ Full |
| **alpha-staff** | 📢 Public | ✅ Full | ❌ No |
| **alpha-volunteer** | 📢 Public | ⚠️ Limited | ❌ No |
| **sandbox-operator** | 📢 Public | ❌ No | ✅ Full |
| **public-user** | 📢 Public | ❌ No | ❌ No |

---

## 🏭 PRODUCTION ENVIRONMENT

### Nodes

| Node | Access Class | Default Access |
|------|-------------|----------------|
| balloo.su | Public | public-user |
| messenger.balloo.su | Public | public-user |
| admin.balloo.su | Internal | company-staff |

### Access Rules

| Rule | Description |
|------|-------------|
| **Default** | Deny for non-public nodes |
| **Public Nodes** | Accessible to all |
| **Internal Nodes** | company-staff minimum |
| **Deployment** | Controlled promotion from working |
| **Approval** | creator-superadmin for privileged actions |

### Role Access

| Role | Access Level | Notes |
|------|-------------|-------|
| creator-superadmin | ✅ Full | All nodes |
| delegated-node-admin | ⚠️ Explicit | Per-node delegation |
| company-staff | ✅ Internal | workdocs, admin |
| alpha-staff | 📢 Public | Public surfaces only |
| alpha-volunteer | 📢 Public | Public surfaces only |
| sandbox-operator | 📢 Public | Public surfaces only |
| public-user | 📢 Public | Public surfaces only |

---

## 🧪 ALPHA ENVIRONMENT

### Nodes

| Node | Access Class | Default Access |
|------|-------------|----------------|
| alpha.balloo.su | Alpha | alpha-volunteer |
| apps.alpha.balloo.su | Alpha | alpha-volunteer |
| 2commands.alpha.balloo.su | Alpha | alpha-staff |

### Access Rules

| Rule | Description |
|------|-------------|
| **Default** | Deny for non-alpha roles |
| **Volunteers** | Limited testing access |
| **Staff** | Full alpha access |
| **Deployment** | Direct deployment allowed |
| **Approval** | alpha-staff for changes |

### Role Access

| Role | Access Level | Notes |
|------|-------------|-------|
| creator-superadmin | ✅ Full | All nodes |
| delegated-node-admin | ❌ No | Not applicable |
| company-staff | ❌ No | Requires alpha role |
| alpha-staff | ✅ Full | All alpha nodes |
| alpha-volunteer | ⚠️ Limited | Testing surfaces |
| sandbox-operator | ❌ No | Separate environment |
| public-user | ❌ No | Testing only |

---

## 🔧 WORKING ENVIRONMENT

### Nodes

| Node | Access Class | Default Access |
|------|-------------|----------------|
| projectgeneralsettings.working.balloo.su | Privileged | creator-superadmin |
| kodegen.working.balloo.su | Privileged | creator-superadmin |
| pilot-future.working.balloo.su | Privileged | creator-superadmin |
| nodes-switcher.working.balloo.su | Privileged | creator-superadmin |
| workdocs.working.balloo.su | Internal | company-staff |
| working.balloo.su | Sandbox | sandbox-operator |
| api.working.balloo.su | Sandbox | sandbox-operator |
| files.working.balloo.su | Sandbox | sandbox-operator |
| docs.working.balloo.su | Sandbox | sandbox-operator |
| future.working.balloo.su | Sandbox | sandbox-operator |
| admin.working.balloo.su | Sandbox | sandbox-operator |
| workers.working.balloo.su | Sandbox | sandbox-operator |
| abaut.working.balloo.su | Sandbox | sandbox-operator |
| apps.working.balloo.su | Sandbox | sandbox-operator |

### Access Rules

| Rule | Description |
|------|-------------|
| **Group A (Privileged)** | creator-superadmin + delegated only |
| **Group B (Internal)** | company-staff |
| **Group D (Sandbox)** | sandbox-operator |
| **Deployment** | Direct deployment allowed |
| **Promotion to Production** | Requires creator-superadmin approval |

### Role Access

| Role | Access Level | Notes |
|------|-------------|-------|
| creator-superadmin | ✅ Full | All nodes |
| delegated-node-admin | ⚠️ Explicit | Group A only with delegation |
| company-staff | ✅ Internal+B | workdocs, sandbox |
| alpha-staff | ❌ No | Alpha zone only |
| alpha-volunteer | ❌ No | Alpha zone only |
| sandbox-operator | ✅ Sandbox | Group D nodes |
| public-user | ❌ No | Internal only |

---

## 🚫 CROSS-ENVIRONMENT ACCESS

### Forbidden Patterns

| Pattern | Reason |
|---------|--------|
| alpha-volunteer → production | Alpha testing only |
| alpha-volunteer → working | Alpha zone isolation |
| sandbox-operator → production | Sandbox ≠ production authority |
| sandbox-operator → alpha | Separate environments |
| public-user → working | Public ≠ internal |
| public-user → alpha | Public ≠ testing |

### Allowed Cross-Environment

| Role | Environments | Notes |
|------|-------------|-------|
| creator-superadmin | All | Full platform authority |
| delegated-node-admin | Per-node explicit | Explicit delegation |
| company-staff | working, production | Internal staff access |

---

## 🔄 ENVIRONMENT PROMOTION

### Promotion Path

```
working (sandbox) → approval → production
```

### Promotion Requirements

| Requirement | Description |
|-------------|-------------|
| **Testing Complete** | All sandbox tests passed |
| **Approval** | creator-superadmin approval |
| **Documentation** | Update docs in workdocs |
| **Rollback Plan** | Rollback procedure defined |
| **Audit** | Promotion logged |

### Promotion Process

1. Request promotion from working
2. creator-superadmin reviews
3. Approval granted or rejected
4. Deploy to production
5. Verify deployment
6. Log promotion event

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "environmentAccessMatrix": {
    "environments": ["production", "alpha", "working"],
    "roleAccess": {
      "creator-superadmin": { "production": true, "alpha": true, "working": true },
      "delegated-node-admin": { "production": "explicit", "alpha": "explicit", "working": "explicit" },
      "company-staff": { "production": "internal", "alpha": false, "working": true },
      "alpha-staff": { "production": "public", "alpha": true, "working": false },
      "alpha-volunteer": { "production": "public", "alpha": "limited", "working": false },
      "sandbox-operator": { "production": "public", "alpha": false, "working": true },
      "public-user": { "production": "public", "alpha": false, "working": false }
    },
    "crossEnvironmentRules": {
      "noAutomaticCarryover": true,
      "productionIsolation": true,
      "workingNotProduction": true,
      "controlledPromotion": true
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_ENVIRONMENT_POLICY.md](./ACCESS_ENVIRONMENT_POLICY.md) — Environment policy
- [ACCESS_MATRIX.md](./ACCESS_MATRIX.md) — Access matrix
- [../state/access-environment-map.json](../state/access-environment-map.json) — Environment map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
