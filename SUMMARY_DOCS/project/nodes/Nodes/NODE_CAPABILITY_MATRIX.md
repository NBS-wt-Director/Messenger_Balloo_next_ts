---
title: Node Capability Matrix
description: Матрица функциональных возможностей узлов Balloo по версиям
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - capabilities
  - versions
  - matrix
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/state/node-capability-map.json
---

# 📊 NODE CAPABILITY MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует **функциональные возможности** узлов Balloo по версиям.

**Цель:** Показать какие функции активны, planned, version-scoped.

---

## 📋 CAPABILITY STATUS

| Status | Description |
|--------|-------------|
| **active** | Функция активна и доступна |
| **planned** | Функция запланирована, не реализована |
| **deprecated** | Функция устарела, будет удалена |
| **version-scoped** | Функция доступна с определённой версии |

---

## 🔥 KEY CAPABILITIES BY NODE

### 1. files.* Storage Strategies

| Capability | Node | Status | Min Version | Notes | Evidence |
|------------|------|--------|-------------|-------|----------|
| base_file_storage | files-production | active | 3.0.0 | Base file storage role | Production deployment |
| yandex_disk_strategy | files-production | active | 3.1.0 | Yandex.Disk integration v3.1.* | Implementation in 3.1.* |
| spifs_strategy | files-production | planned | TBD | SPiFS proprietary storage | No evidence of implementation |
| local_storage | files-working | active | 3.0.0 | Local file storage for working | Working deployment |

### 2. ai.api.balloo.su

| Capability | Node | Status | Min Version | Notes | Evidence |
|------------|------|--------|-------------|-------|----------|
| ai_api_capability | ai-api-production | planned | 4.* | AI API from version 4.* | Not yet implemented |

### 3. Technical Nodes (working)

| Capability | Node | Status | Min Version | Notes | Evidence |
|------------|------|--------|-------------|-------|----------|
| workdocs_presentation | workdocs-working | active | 3.0.0 | SUMMARY_DOCS web presentation | Implemented |
| nodes_version_registry | nodes-switcher-working | active | 3.0.0 | Node version tracking | Implemented |
| nodes_rollout_control | nodes-switcher-working | active | 3.0.0 | Rollout orchestration | Implemented |
| kpdegen_server | kpdegen-working | active | 3.0.0 | Server code generator | Implemented |
| project_settings_ui | projectgeneralsettings-working | active | 3.0.0 | Central settings management | Implemented |

### 4. Production Public Nodes

| Capability | Node | Status | Min Version | Notes | Evidence |
|------------|------|--------|-------------|-------|----------|
| root_landing | balloo-production-root | active | 3.0.0 | Production root landing page | Production deployment |
| api_gateway | api-production | active | 3.0.0 | Production API gateway | Production deployment |
| public_docs | docs-production | active | 3.0.0 | Public documentation site | docs.balloo.su |
| admin_panel | admin-production | active | 3.0.0 | Admin panel | Production deployment |
| workers_backend | workers-production | active | 3.0.0 | Background workers | Production deployment |

---

## 📄 VERSION SCOPED CAPABILITIES

### Starting from 3.0.*

| Capability | Node | Status |
|------------|------|--------|
| base_file_storage | files-production | active |
| local_storage | files-working | active |
| root_landing | balloo-production-root | active |
| api_gateway | api-production | active |
| public_docs | docs-production | active |
| admin_panel | admin-production | active |
| workdocs_presentation | workdocs-working | active |
| nodes_version_registry | nodes-switcher-working | active |
| kpdegen_server | kpdegen-working | active |
| project_settings_ui | projectgeneralsettings-working | active |

### Starting from 3.1.*

| Capability | Node | Status |
|------------|------|--------|
| yandex_disk_strategy | files-production | active |

### Starting from 4.*

| Capability | Node | Status |
|------------|------|--------|
| ai_api_capability | ai-api-production | planned |

### Planned (TBD Version)

| Capability | Node | Status | Notes |
|------------|------|--------|-------|
| spifs_strategy | files-production | planned | SPiFS proprietary storage |
| future_showcase | future-production | planned | Future features showcase |

---

## ⚠️ IMPORTANT NOTES

### SPiFS Storage

```
⚠️ SPiFS — planned/proprietary storage model
⚠️ Не считать production решением без evidence
⚠️ Status: planned (not active)
```

### AI API

```
⚠️ ai.api.balloo.su — capability from version 4.*
⚠️ Статус: planned (not active)
⚠️ Не считать active production функцией до 4.*
```

### Yandex.Disk

```
✅ Yandex.Disk — accepted storage strategy for 3.1.*
✅ Status: active (implemented in 3.1.*)
```

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [node-capability-map.json](../state/node-capability-map.json) — Capability state
- [NODE_RUNTIME_MODEL.md](./NODE_RUNTIME_MODEL.md) — Runtime model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
