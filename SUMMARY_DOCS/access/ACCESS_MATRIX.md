---
title: Access Matrix
description: Матрица доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - matrix
  - canonical
related_docs:
  - SUMMARY_DOCS/access/NODE_ACCESS_MATRIX.md
  - SUMMARY_DOCS/access/ROLE_NODE_MATRIX.md
---

# 📊 ACCESS MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта матрица определяет **общий доступ по ролям и группам узлов**.

**Цель:** Быстрая справка по доступу для людей и AI-codegen.

---

## 📊 ROLE × NODE GROUP MATRIX

### Access Level Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full access |
| ⚠️ | Explicit/Limited access |
| ❌ | No access |
| 📢 | Public access only |

### Matrix

| Role | Group A | Group B | Group C | Group D | Group E |
|------|---------|---------|---------|---------|---------|
| **creator-superadmin** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **delegated-node-admin** | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit |
| **company-staff** | ❌ No | ✅ Full | ⚠️ Limited | ✅ Full | 📢 Public |
| **alpha-staff** | ❌ No | ❌ No | ✅ Full | ⚠️ Limited | 📢 Public |
| **alpha-volunteer** | ❌ No | ❌ No | ⚠️ Limited | ❌ No | 📢 Public |
| **sandbox-operator** | ❌ No | ❌ No | ❌ No | ✅ Full | 📢 Public |
| **public-user** | ❌ No | ❌ No | ❌ No | ❌ No | 📢 Public |

---

## 📊 ROLE × ENVIRONMENT MATRIX

| Role | production | alpha | working |
|------|-----------|-------|---------|
| **creator-superadmin** | ✅ | ✅ | ✅ |
| **delegated-node-admin** | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit |
| **company-staff** | ✅ Internal | ❌ | ✅ Full |
| **alpha-staff** | ❌ | ✅ | ❌ |
| **alpha-volunteer** | ❌ | ✅ | ❌ |
| **sandbox-operator** | ❌ | ❌ | ✅ |
| **public-user** | ✅ Public | ❌ | ❌ |

---

## 📊 ACCESS LEVEL × ACTION MATRIX

| Level | read | use | moderate | manage | configure | deploy | switch-version | approve | admin |
|-------|------|-----|----------|--------|-----------|--------|----------------|---------|-------|
| **L1 (public-user)** | ✅ Public | ✅ Public | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **L3 (sandbox-operator)** | ✅ Sandbox | ✅ Sandbox | ❌ | ❌ | ⚠️ Limited | ⚠️ Sandbox | ❌ | ❌ | ❌ |
| **L4 (alpha-volunteer)** | ✅ Alpha | ✅ Alpha | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **L5 (alpha-staff)** | ✅ Alpha | ✅ Alpha | ✅ Alpha | ⚠️ Limited | ❌ | ❌ | ❌ | ❌ | ❌ |
| **L6 (company-staff)** | ✅ Internal | ✅ Internal | ❌ | ⚠️ Limited | ⚠️ Limited | ❌ | ❌ | ❌ | ❌ |
| **L8 (delegated-node-admin)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Delegated | ⚠️ Delegated | ⚠️ Delegated |
| **L10 (creator-superadmin)** | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |

---

## 📊 PRIVILEGED ACTIONS MATRIX

| Action | Min Role | Min Level | Audit Required | Delegation Allowed |
|--------|----------|-----------|----------------|-------------------|
| **access:grant** | delegated-node-admin | L8 | ✅ Maximum | ❌ No |
| **access:revoke** | delegated-node-admin | L8 | ✅ Maximum | ❌ No |
| **access:delegate** | creator-superadmin | L10 | ✅ Maximum | ❌ No |
| **role:assign** | creator-superadmin | L10 | ✅ Maximum | ❌ No |
| **role:revoke** | creator-superadmin | L10 | ✅ Maximum | ❌ No |
| **environment:bind** | creator-superadmin | L10 | ✅ Maximum | ❌ No |
| **environment:promote** | creator-superadmin | L10 | ✅ Maximum | ❌ No |
| **node:switch-version** | delegated-node-admin | L8 | ✅ Maximum | ✅ Yes |
| **node:admin** | delegated-node-admin | L8 | ✅ Maximum | ✅ Yes |
| **node:superadmin** | creator-superadmin | L10 | ✅ Maximum | ❌ No |
| **codegen:execute** | delegated-node-admin | L8 | ✅ Maximum | ✅ Yes |
| **system:configure** | creator-superadmin | L10 | ✅ Maximum | ❌ No |
| **production:deploy** | delegated-node-admin | L8 | ✅ Maximum | ✅ Yes |
| **production:promote** | creator-superadmin | L10 | ✅ Maximum | ❌ No |

---

## 📊 NODE GROUP SUMMARY

### Group A: Privileged Technical Nodes

| Node | Environment | Access | Delegation |
|------|-------------|--------|------------|
| projectgeneralsettings.working.balloo.su | working | creator-superadmin only | ✅ |
| kodegen.working.balloo.su | working | creator-superadmin only | ✅ |
| pilot-future.working.balloo.su | working | creator-superadmin only | ✅ |
| nodes-switcher.working.balloo.su | working | creator-superadmin only | ✅ |

### Group B: Company Internal Nodes

| Node | Environment | Access | Delegation |
|------|-------------|--------|------------|
| workdocs.working.balloo.su | working | company-staff | ✅ |
| admin.balloo.su | production | company-staff | ✅ |

### Group C: Alpha Access Nodes

| Node | Environment | Access | Delegation |
|------|-------------|--------|------------|
| alpha.balloo.su | alpha | alpha-volunteer + alpha-staff | ❌ |
| apps.alpha.balloo.su | alpha | alpha-volunteer + alpha-staff | ❌ |
| 2commands.alpha.balloo.su | alpha | alpha-volunteer + alpha-staff | ❌ |

### Group D: Sandbox / Pre-Prod Nodes

| Node | Environment | Access | Delegation |
|------|-------------|--------|------------|
| working.balloo.su | working | sandbox-operator | ❌ |
| api.working.balloo.su | working | sandbox-operator | ❌ |
| files.working.balloo.su | working | sandbox-operator | ❌ |
| docs.working.balloo.su | working | sandbox-operator | ❌ |
| future.working.balloo.su | working | sandbox-operator | ❌ |
| admin.working.balloo.su | working | sandbox-operator | ❌ |
| workers.working.balloo.su | working | sandbox-operator | ❌ |
| abaut.working.balloo.su | working | sandbox-operator | ❌ |
| apps.working.balloo.su | working | sandbox-operator | ❌ |

### Group E: Production Public Nodes

| Node | Environment | Access | Delegation |
|------|-------------|--------|------------|
| balloo.su | production | public-user | ❌ |
| messenger.balloo.su | production | public-user | ❌ |

---

## 📊 QUICK REFERENCE

### Creator-Superadmin Only Nodes

```
- projectgeneralsettings.working.balloo.su
- kodegen.working.balloo.su
- pilot-future.working.balloo.su
- nodes-switcher.working.balloo.su
```

### Company Staff Nodes

```
- workdocs.working.balloo.su
- admin.balloo.su
```

### Alpha Access Nodes

```
- alpha.balloo.su
- apps.alpha.balloo.su
- 2commands.alpha.balloo.su
```

### Sandbox Nodes

```
- working.balloo.su
- api.working.balloo.su
- files.working.balloo.su
- docs.working.balloo.su
- future.working.balloo.su
- admin.working.balloo.su
- workers.working.balloo.su
- abaut.working.balloo.su
- apps.working.balloo.su
```

### Production Public Nodes

```
- balloo.su
- messenger.balloo.su
```

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "accessMatrix": {
    "roleNodeMatrix": {
      "creator-superadmin": { "A": true, "B": true, "C": true, "D": true, "E": true },
      "delegated-node-admin": { "A": "explicit", "B": "explicit", "C": "explicit", "D": "explicit", "E": "explicit" },
      "company-staff": { "A": false, "B": true, "C": "limited", "D": true, "E": "public" },
      "alpha-staff": { "A": false, "B": false, "C": true, "D": "limited", "E": "public" },
      "alpha-volunteer": { "A": false, "B": false, "C": "limited", "D": false, "E": "public" },
      "sandbox-operator": { "A": false, "B": false, "C": false, "D": true, "E": "public" },
      "public-user": { "A": false, "B": false, "C": false, "D": false, "E": "public" }
    },
    "privilegedActions": [
      "access:grant",
      "access:revoke",
      "access:delegate",
      "role:assign",
      "role:revoke",
      "environment:bind",
      "environment:promote",
      "node:switch-version",
      "node:admin",
      "node:superadmin",
      "codegen:execute",
      "system:configure",
      "production:deploy",
      "production:promote"
    ]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [NODE_ACCESS_MATRIX.md](./NODE_ACCESS_MATRIX.md) — Node access matrix
- [ROLE_NODE_MATRIX.md](./ROLE_NODE_MATRIX.md) — Role-node matrix
- [ENVIRONMENT_ACCESS_MATRIX.md](./ENVIRONMENT_ACCESS_MATRIX.md) — Environment matrix
- [PRIVILEGED_ACTIONS_MATRIX.md](./PRIVILEGED_ACTIONS_MATRIX.md) — Privileged actions

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
