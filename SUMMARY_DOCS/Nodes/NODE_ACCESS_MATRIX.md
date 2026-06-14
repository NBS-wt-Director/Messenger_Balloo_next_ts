---
title: Node Access Matrix
description: Матрица доступа и безопасности узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - security
  - matrix
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/state/node-access-map.json
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
---

# 🔐 NODE ACCESS MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует **правила доступа и безопасности** для всех узлов Balloo.

**Цель:** Определить access levels, auth requirements, audit rules.

---

## 📋 ACCESS LEVELS

| Level | Description |
|-------|-------------|
| **public** | Доступно всем без авторизации |
| **private** | Требуется авторизация |
| **restricted** | Ограниченный доступ (role-based) |
| **creator-only** | Только создатели/владельцы |
| **staff-only** | Только staff/internal team |
| **internal** | Только внутренняя команда |

---

## 🔒 PRIORITY-1 TECHNICAL NODES ACCESS

| Node | Access Level | Auth Required | Role Classes | Secret-Bearing | Settings Authority | Audit Required |
|------|--------------|---------------|--------------|----------------|-------------------|----------------|
| workdocs-working | internal | ✅ Yes | developers, ai-agents, internal | ❌ No | ✅ Yes (docs-settings) | ✅ Yes |
| nodes-switcher-working | restricted | ✅ Yes | developers, devops, admin | ❌ No | ✅ Yes (version-registry, rollout-control) | ✅ Yes |
| kpdegen-working | restricted | ✅ Yes | developers, ai-agents, system | ❌ No | ✅ Yes (codegen-settings) | ✅ Yes |
| projectgeneralsettings-working | restricted | ✅ Yes | admin, owner, product-owner | ✅ Yes | ✅ Yes (project-global, branch-level, node-level, feature-level) | ✅ Yes |
| database-working | internal | ✅ Yes (internal) | system, api-working, workers-working | ✅ Yes | ✅ Yes (database-settings) | ✅ Yes |

---

## 🏭 PRODUCTION NODES ACCESS

| Node | Access Level | Auth Required | Role Classes | Secret-Bearing | Settings Authority | Audit Required |
|------|--------------|---------------|--------------|----------------|-------------------|----------------|
| balloo-production-root | public | ❌ No (public pages) | - | ❌ No | ❌ No | ❌ No |
| api-production | private | ✅ Yes | authenticated_users | ✅ Yes | ❌ No | ✅ Yes |
| ai-api-production | private | ✅ Yes | authenticated_users | ✅ Yes | ❌ No | ✅ Yes |
| files-production | private | ✅ Yes | authenticated_users | ✅ Yes | ❌ No | ✅ Yes |
| docs-production | public | ❌ No | - | ❌ No | ❌ No | ❌ No |
| future-production | public | ❌ No | - | ❌ No | ❌ No | ❌ No |
| admin-production | restricted | ✅ Yes | admin, staff | ✅ Yes | ✅ Yes (admin-settings) | ✅ Yes |
| workers-production | internal | ✅ Yes | system, admin | ✅ Yes | ❌ No | ✅ Yes |
| abaut-production | public | ❌ No | - | ❌ No | ❌ No | ❌ No |
| apps-production | public | ❌ No | - | ❌ No | ❌ No | ❌ No |
| client-apps-family | public | ❌ No | - | ❌ No | ❌ No | ❌ No |

---

## 🔬 ALPHA NODES ACCESS

| Node | Access Level | Auth Required | Role Classes | Secret-Bearing | Settings Authority | Audit Required |
|------|--------------|---------------|--------------|----------------|-------------------|----------------|
| alpha-root | restricted | ✅ Yes | testers, qa, early_adopters | ❌ No | ❌ No | ✅ Yes |
| apps-alpha | restricted | ✅ Yes | testers, qa | ❌ No | ❌ No | ✅ Yes |
| 2commands-alpha | restricted | ✅ Yes | testers, qa, product_team | ❌ No | ✅ Yes (feature-level) | ✅ Yes |

---

## 🔧 WORKING NODES ACCESS (Non-Technical)

| Node | Access Level | Auth Required | Role Classes | Secret-Bearing | Settings Authority | Audit Required |
|------|--------------|---------------|--------------|----------------|-------------------|----------------|
| working-root | internal | ✅ Yes | developers, internal | ❌ No | ❌ No | ✅ Yes |
| api-working | private | ✅ Yes | developers, authenticated | ✅ Yes | ❌ No | ✅ Yes |
| files-working | private | ✅ Yes | developers, authenticated | ✅ Yes | ❌ No | ✅ Yes |
| docs-working | internal | ✅ Yes | developers, internal | ❌ No | ✅ Yes (docs-settings) | ❌ No |
| future-working | internal | ✅ Yes | developers, product_team | ❌ No | ✅ Yes (feature-level) | ❌ No |
| pilot-future-working | internal | ✅ Yes | developers, product_team | ❌ No | ✅ Yes (feature-level) | ❌ No |
| admin-working | restricted | ✅ Yes | admin, developers | ✅ Yes | ✅ Yes (admin-settings) | ✅ Yes |
| workers-working | internal | ✅ Yes | developers, system | ✅ Yes | ❌ No | ✅ Yes |
| abaut-working | internal | ✅ Yes | developers, internal | ❌ No | ❌ No | ❌ No |
| apps-working | internal | ✅ Yes | developers, internal | ❌ No | ❌ No | ❌ No |

---

## 🔑 ACCESS METHOD MATRIX

| Access Method | Nodes |
|---------------|-------|
| **web** | workdocs-working, docs-*, abaut-*, apps-*, admin-* |
| **api** | api-*, kpdegen-working, workers-* |
| **internal** | database-working, workers-production |

---

## 🛡️ SECURITY SUMMARY

### Secret-Bearing Nodes

```
Total secret-bearing nodes: 11
- projectgeneralsettings-working
- database-working
- api-production
- ai-api-production
- files-production
- admin-production
- workers-production
- api-working
- files-working
- admin-working
- workers-working
```

### Settings Authority Nodes

```
Total nodes with settings authority: 9
- projectgeneralsettings-working (highest authority)
- nodes-switcher-working
- kpdegen-working
- workdocs-working
- database-working
- admin-production
- admin-working
- docs-working
- future-working, pilot-future-working
```

### Audit Required Nodes

```
Total nodes requiring audit: 16
- All technical nodes (5)
- All production API/service nodes (5)
- All alpha nodes (3)
- admin-production, admin-working
- api-production, api-working
- workers-production, workers-working
```

---

## ✅ CRITICAL INVARIANTS

1. **Все технические узлы требуют auth** — internal/restricted access
2. **projectgeneralsettings-working — highest settings authority**
3. **Secret-bearing nodes требуют audit**
4. **Public nodes не требуют auth** — docs, abaut, apps, root landing
5. **Production API nodes — private + audit**

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [node-access-map.json](../state/node-access-map.json) — Access state
- [TechnicalNodeContract.md](../contracts/nodes/TechnicalNodeContract.md) — Technical contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
