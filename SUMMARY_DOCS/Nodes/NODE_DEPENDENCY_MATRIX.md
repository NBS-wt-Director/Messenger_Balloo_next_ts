---
title: Node Dependency Matrix
description: Матрица зависимостей узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - dependencies
  - matrix
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/state/node-dependency-map.json
---

# 🔗 NODE DEPENDENCY MATRIX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует **зависимости между узлами** Balloo.

**Цель:** Определить hard/optional/planned/environment-specific зависимости.

---

## 📋 DEPENDENCY TYPES

| Type | Description |
|------|-------------|
| **hard** | Критическая зависимость, без которой узел не работает |
| **optional** | Опциональная зависимость, улучшает функциональность |
| **planned** | Запланированная зависимость, ещё не реализована |
| **environment-specific** | Зависимость только для определённой среды |

---

## 🔒 PRIORITY-1 TECHNICAL NODES DEPENDENCIES

| Node | Depends On Nodes | Depends On Modules | Depends On Settings | Dependency Type |
|------|------------------|-------------------|---------------------|-----------------|
| workdocs-working | docs-working, kpdegen-working | docs-core | docs-settings | hard |
| nodes-switcher-working | kpdegen-working, projectgeneralsettings-working | orchestration-core | version-registry, rollout-control | hard |
| kpdegen-working | workdocs-working, nodes-switcher-working | codegen-core | codegen-settings | hard |
| projectgeneralsettings-working | nodes-switcher-working, admin-working | settings-core | project-global, branch-level | hard |
| database-working | api-working, workers-working | database-core | database-settings | hard |

---

## 🏭 PRODUCTION NODES DEPENDENCIES

| Node | Depends On Nodes | Depends On Modules | Dependency Type |
|------|------------------|-------------------|-----------------|
| balloo-production-root | api-production, docs-production | core-types, messenger | hard |
| api-production | balloo-production-root | core-types, api-gateway | hard |
| ai-api-production | api-production | ai-core | planned (v4.*) |
| files-production | balloo-production-root | storage-core | hard |
| docs-production | balloo-production-root | docs-core | hard |
| admin-production | balloo-production-root, workers-production | admin-core | hard |
| workers-production | admin-production | workers-core | hard |

---

## 🔧 WORKING NODES DEPENDENCIES

| Node | Depends On Nodes | Depends On Modules | Dependency Type |
|------|------------------|-------------------|-----------------|
| working-root | api-working, docs-working | core-types, messenger | hard |
| api-working | working-root, database-working | core-types, api-gateway | hard |
| files-working | working-root | storage-core | hard |
| docs-working | working-root, workdocs-working | docs-core | optional |
| admin-working | working-root, workers-working | admin-core | hard |
| workers-working | admin-working, database-working | workers-core | hard |

---

## 📊 DEPENDENCY GRAPH (Simplified)

```
                    ┌─────────────────────┐
                    │  database-working   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ api-working  │  │workers-working│  │kpdegen-working│
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                 │
           └────────┬────────┴────────┬────────┘
                    │                 │
                    ▼                 ▼
          ┌──────────────┐  ┌──────────────┐
          │working-root  │  │nodes-switcher│
          └──────────────┘  └──────┬───────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │ workdocs     │  │projectgeneral│  │  other       │
          │              │  │settings      │  │  nodes       │
          └──────────────┘  └──────────────┘  └──────────────┘
```

---

## ✅ CRITICAL INVARIANTS

1. **database-working — hard dependency** для api-working, workers-working
2. **kpdegen-working — hard dependency** для codegen
3. **nodes-switcher-working — hard dependency** для rollout control
4. **projectgeneralsettings-working — hard dependency** для settings management
5. **ai-api-production — planned dependency** на api-production (v4.*)

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [node-dependency-map.json](../state/node-dependency-map.json) — Dependency state
- [NODE_CAPABILITY_MATRIX.md](./NODE_CAPABILITY_MATRIX.md) — Capability matrix

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
