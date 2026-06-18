---
title: Node Access Matrix
description: Матрица доступа по узлам Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - matrix
  - nodes
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_MATRIX.md
  - SUMMARY_DOCS/state/access-node-map.json
---

# 📊 NODE ACCESS MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта матрица определяет **доступ к каждому узлу** по ролям.

**Цель:** Детальная справка по доступу для каждого узла.

---

## 📊 NODE ACCESS TABLE

### Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full access |
| ⚠️ | Explicit/Limited access |
| ❌ | No access |
| 📢 | Public access |

### Group A: Privileged Technical Nodes

| Node | creator-superadmin | delegated-node-admin | company-staff | alpha-staff | alpha-volunteer | sandbox-operator | public-user |
|------|-------------------|---------------------|---------------|-------------|-----------------|-----------------|-------------|
| **projectgeneralsettings.working.balloo.su** | ✅ | ⚠️ Explicit | ❌ | ❌ | ❌ | ❌ | ❌ |
| **kodegen.working.balloo.su** | ✅ | ⚠️ Explicit | ❌ | ❌ | ❌ | ❌ | ❌ |
| **pilot-future.working.balloo.su** | ✅ | ⚠️ Explicit | ❌ | ❌ | ❌ | ❌ | ❌ |
| **nodes-switcher.working.balloo.su** | ✅ | ⚠️ Explicit | ❌ | ❌ | ❌ | ❌ | ❌ |

### Group B: Company Internal Nodes

| Node | creator-superadmin | delegated-node-admin | company-staff | alpha-staff | alpha-volunteer | sandbox-operator | public-user |
|------|-------------------|---------------------|---------------|-------------|-----------------|-----------------|-------------|
| **workdocs.working.balloo.su** | ✅ | ⚠️ Explicit | ✅ | ❌ | ❌ | ❌ | ❌ |
| **admin.balloo.su** | ✅ | ⚠️ Explicit | ✅ | ❌ | ❌ | ❌ | ❌ |

### Group C: Alpha Access Nodes

| Node | creator-superadmin | delegated-node-admin | company-staff | alpha-staff | alpha-volunteer | sandbox-operator | public-user |
|------|-------------------|---------------------|---------------|-------------|-----------------|-----------------|-------------|
| **alpha.balloo.su** | ✅ | ❌ | ❌ | ✅ | ⚠️ Limited | ❌ | ❌ |
| **apps.alpha.balloo.su** | ✅ | ❌ | ❌ | ✅ | ⚠️ Limited | ❌ | ❌ |
| **2commands.alpha.balloo.su** | ✅ | ❌ | ❌ | ✅ | ⚠️ Limited | ❌ | ❌ |

### Group D: Sandbox / Pre-Prod Nodes

| Node | creator-superadmin | delegated-node-admin | company-staff | alpha-staff | alpha-volunteer | sandbox-operator | public-user |
|------|-------------------|---------------------|---------------|-------------|-----------------|-----------------|-------------|
| **working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **api.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **files.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **docs.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **future.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **admin.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **workers.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **abaut.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **apps.working.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |

### Group E: Production Public Nodes

| Node | creator-superadmin | delegated-node-admin | company-staff | alpha-staff | alpha-volunteer | sandbox-operator | public-user |
|------|-------------------|---------------------|---------------|-------------|-----------------|-----------------|-------------|
| **balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | 📢 |
| **messenger.balloo.su** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | 📢 |

---

## 🔐 PRIVILEGED ACTIONS BY NODE

### projectgeneralsettings.working.balloo.su

| Action | Min Role | Audit Level |
|--------|----------|-------------|
| access:grant:* | creator-superadmin | Maximum |
| access:revoke:* | creator-superadmin | Maximum |
| role:assign:* | creator-superadmin | Maximum |
| environment:bind:* | creator-superadmin | Maximum |

### kodegen.working.balloo.su

| Action | Min Role | Audit Level |
|--------|----------|-------------|
| codegen:execute:* | delegated-node-admin | Maximum |
| codegen:deploy:* | delegated-node-admin | Maximum |
| node:switch-version:* | delegated-node-admin | Maximum |

### nodes-switcher.working.balloo.su

| Action | Min Role | Audit Level |
|--------|----------|-------------|
| node:switch-version:* | delegated-node-admin | Maximum |
| environment:promote:* | creator-superadmin | Maximum |

---

## 🌍 ENVIRONMENT BY NODE

| Node | Environment | Access Class |
|------|-------------|--------------|
| projectgeneralsettings.working.balloo.su | working | Privileged |
| kodegen.working.balloo.su | working | Privileged |
| pilot-future.working.balloo.su | working | Privileged |
| nodes-switcher.working.balloo.su | working | Privileged |
| workdocs.working.balloo.su | working | Internal |
| admin.balloo.su | production | Internal |
| alpha.balloo.su | alpha | Alpha |
| apps.alpha.balloo.su | alpha | Alpha |
| 2commands.alpha.balloo.su | alpha | Alpha |
| working.balloo.su | working | Sandbox |
| api.working.balloo.su | working | Sandbox |
| files.working.balloo.su | working | Sandbox |
| docs.working.balloo.su | working | Sandbox |
| future.working.balloo.su | working | Sandbox |
| admin.working.balloo.su | working | Sandbox |
| workers.working.balloo.su | working | Sandbox |
| abaut.working.balloo.su | working | Sandbox |
| apps.working.balloo.su | working | Sandbox |
| balloo.su | production | Public |
| messenger.balloo.su | production | Public |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "nodeAccessMatrix": {
    "groupA": {
      "projectgeneralsettings.working.balloo.su": ["creator-superadmin", "delegated-node-admin:explicit"],
      "kodegen.working.balloo.su": ["creator-superadmin", "delegated-node-admin:explicit"],
      "pilot-future.working.balloo.su": ["creator-superadmin", "delegated-node-admin:explicit"],
      "nodes-switcher.working.balloo.su": ["creator-superadmin", "delegated-node-admin:explicit"]
    },
    "groupB": {
      "workdocs.working.balloo.su": ["creator-superadmin", "company-staff"],
      "admin.balloo.su": ["creator-superadmin", "company-staff"]
    },
    "groupC": {
      "alpha.balloo.su": ["creator-superadmin", "alpha-staff", "alpha-volunteer:limited"],
      "apps.alpha.balloo.su": ["creator-superadmin", "alpha-staff", "alpha-volunteer:limited"],
      "2commands.alpha.balloo.su": ["creator-superadmin", "alpha-staff", "alpha-volunteer:limited"]
    },
    "groupD": {
      "working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "api.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "files.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "docs.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "future.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "admin.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "workers.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "abaut.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"],
      "apps.working.balloo.su": ["creator-superadmin", "company-staff", "sandbox-operator"]
    },
    "groupE": {
      "balloo.su": ["creator-superadmin", "company-staff", "public-user"],
      "messenger.balloo.su": ["creator-superadmin", "company-staff", "public-user"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_MATRIX.md](./ACCESS_MATRIX.md) — Access matrix
- [ROLE_NODE_MATRIX.md](./ROLE_NODE_MATRIX.md) — Role-node matrix
- [../state/access-node-map.json](../state/access-node-map.json) — Node map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
