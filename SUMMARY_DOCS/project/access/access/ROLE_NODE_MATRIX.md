---
title: Role-Node Matrix
description: Матрица ролей и узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - matrix
  - roles
  - nodes
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_MATRIX.md
  - SUMMARY_DOCS/access/NODE_ACCESS_MATRIX.md
---

# 📊 ROLE-NODE MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта матрица определяет **доступ по ролям для каждого узла**.

**Цель:** Быстрая справка по доступу для каждой роли.

---

## 📊 MATRIX OVERVIEW

### Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full access |
| ⚠️ | Explicit/Limited access |
| ❌ | No access |
| 📢 | Public access |

---

## 👑 CREATOR-SUPERADMIN (L10)

### Access: All Nodes

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ✅ Full | Default authority |
| **B (Company)** | ✅ Full | Override authority |
| **C (Alpha)** | ✅ Full | Override authority |
| **D (Sandbox)** | ✅ Full | Override authority |
| **E (Production)** | ✅ Full | Override authority |

### All Nodes List

```
Group A: projectgeneralsettings, kodegen, pilot-future, nodes-switcher
Group B: workdocs, admin
Group C: alpha, apps.alpha, 2commands
Group D: working, api, files, docs, future, admin, workers, abaut, apps
Group E: balloo.su, messenger.balloo.su
```

---

## 🔐 DELEGATED-NODE-ADMIN (L8)

### Access: Explicit Per-Node Only

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ⚠️ Explicit | Per-node delegation required |
| **B (Company)** | ⚠️ Explicit | Per-node delegation required |
| **C (Alpha)** | ⚠️ Explicit | Per-node delegation required |
| **D (Sandbox)** | ⚠️ Explicit | Per-node delegation required |
| **E (Production)** | ⚠️ Explicit | Per-node delegation required |

### Delegation Rules

| Rule | Description |
|------|-------------|
| **Delegator** | creator-superadmin only |
| **Scope** | Per-node explicit |
| **Duration** | Temporary or persistent |
| **Audit** | Maximum for Group A |

---

## 👔 COMPANY-STAFF (L6)

### Access: Internal + Sandbox

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ✅ Full | workdocs, admin |
| **C (Alpha)** | ❌ No | alpha role required |
| **D (Sandbox)** | ✅ Full | All sandbox nodes |
| **E (Production)** | 📢 Public | Public surfaces only |

### Allowed Nodes

```
Group B: workdocs.working.balloo.su, admin.balloo.su
Group D: working, api, files, docs, future, admin, workers, abaut, apps
Group E: balloo.su (public), messenger.balloo.su (auth required)
```

---

## 🎓 ALPHA-STAFF (L5)

### Access: Alpha Zone

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ❌ No | company-staff required |
| **C (Alpha)** | ✅ Full | All alpha nodes |
| **D (Sandbox)** | ❌ No | sandbox-operator required |
| **E (Production)** | 📢 Public | Public surfaces only |

### Allowed Nodes

```
Group C: alpha.balloo.su, apps.alpha.balloo.su, 2commands.alpha.balloo.su
Group E: balloo.su (public), messenger.balloo.su (auth required)
```

---

## 🙋 ALPHA-VOLUNTEER (L4)

### Access: Alpha Testing Only

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ❌ No | company-staff required |
| **C (Alpha)** | ⚠️ Limited | Testing surfaces only |
| **D (Sandbox)** | ❌ No | sandbox-operator required |
| **E (Production)** | 📢 Public | Public surfaces only |

### Allowed Nodes

```
Group C: alpha.balloo.su (public areas), apps.alpha.balloo.su (testing)
Group E: balloo.su (public), messenger.balloo.su (auth required)
```

---

## 🏖️ SANDBOX-OPERATOR (L3)

### Access: Sandbox Environment

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ❌ No | company-staff required |
| **C (Alpha)** | ❌ No | alpha role required |
| **D (Sandbox)** | ✅ Full | All sandbox nodes |
| **E (Production)** | 📢 Public | Public surfaces only |

### Allowed Nodes

```
Group D: working, api, files, docs, future, admin, workers, abaut, apps
Group E: balloo.su (public), messenger.balloo.su (auth required)
```

---

## 🌐 PUBLIC-USER (L1)

### Access: Production Public Only

| Node Group | Access | Notes |
|------------|--------|-------|
| **A (Privileged)** | ❌ No | creator-superadmin only |
| **B (Company)** | ❌ No | company-staff required |
| **C (Alpha)** | ❌ No | alpha role required |
| **D (Sandbox)** | ❌ No | sandbox-operator required |
| **E (Production)** | 📢 Public | Public surfaces only |

### Allowed Nodes

```
Group E: balloo.su (public), messenger.balloo.su (public areas)
```

---

## 📊 SUMMARY TABLE

| Role | Group A | Group B | Group C | Group D | Group E | Total Nodes |
|------|---------|---------|---------|---------|---------|-------------|
| **creator-superadmin** | ✅ 4 | ✅ 2 | ✅ 3 | ✅ 9 | ✅ 2 | 20/20 |
| **delegated-node-admin** | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | Per delegation |
| **company-staff** | ❌ 0 | ✅ 2 | ❌ 0 | ✅ 9 | 📢 2 | 11/20 |
| **alpha-staff** | ❌ 0 | ❌ 0 | ✅ 3 | ❌ 0 | 📢 2 | 5/20 |
| **alpha-volunteer** | ❌ 0 | ❌ 0 | ⚠️ 3 | ❌ 0 | 📢 2 | 5/20 |
| **sandbox-operator** | ❌ 0 | ❌ 0 | ❌ 0 | ✅ 9 | 📢 2 | 11/20 |
| **public-user** | ❌ 0 | ❌ 0 | ❌ 0 | ❌ 0 | 📢 2 | 2/20 |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "roleNodeMatrix": {
    "creator-superadmin": {
      "access": "all",
      "nodes": 20,
      "groups": ["A", "B", "C", "D", "E"]
    },
    "delegated-node-admin": {
      "access": "explicit-per-node",
      "nodes": "variable",
      "groups": ["A", "B", "C", "D", "E"],
      "requiresDelegation": true
    },
    "company-staff": {
      "access": "internal+sandbox",
      "nodes": 11,
      "groups": ["B", "D", "E"]
    },
    "alpha-staff": {
      "access": "alpha-zone",
      "nodes": 5,
      "groups": ["C", "E"]
    },
    "alpha-volunteer": {
      "access": "alpha-testing",
      "nodes": 5,
      "groups": ["C", "E"]
    },
    "sandbox-operator": {
      "access": "sandbox",
      "nodes": 11,
      "groups": ["D", "E"]
    },
    "public-user": {
      "access": "public-only",
      "nodes": 2,
      "groups": ["E"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_MATRIX.md](./ACCESS_MATRIX.md) — Access matrix
- [NODE_ACCESS_MATRIX.md](./NODE_ACCESS_MATRIX.md) — Node access matrix
- [../state/access-roles.json](../state/access-roles.json) — Role registry
- [../state/access-node-map.json](../state/access-node-map.json) — Node map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
