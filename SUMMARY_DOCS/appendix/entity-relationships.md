---
title: Entity Relationships
description: Схемы отношений между сущностями дерева узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - entities
  - relationships
  - schema
  - canonical
related_docs:
  - SUMMARY_DOCS/appendix/entity-definitions.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
---

# 🔗 ENTITY RELATIONSHIPS

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **отношения между сущностями** дерева узлов Balloo.

**Цель:** Показать явные связи для AI и codegen.

---

## 📊 RELATIONSHIP DIAGRAMS

### High-Level Overview

```
┌─────────────┐
│   BRANCH    │
│ (production,│
│  alpha,     │
│  working)   │
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐
│    NODE     │
│ (29 nodes)  │
└──────┬──────┘
       │
       ├────────────────┬────────────────┬────────────────┐
       │ 1:1            │ 1:N            │ N:M            │
       ▼                ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   DOMAIN    │  │   MODULE    │  │  SETTINGS   │  │ CAPABILITY  │
│  BINDING    │  │             │  │   SCOPE     │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🔗 SPECIFIC RELATIONSHIPS

### 1. Branch → Nodes

```
Branch "owns" Nodes

production ──► 11 nodes (balloo-production-root, api-production, ...)
alpha      ──► 3 nodes  (alpha-root, apps-alpha, 2commands-alpha)
working    ──► 15 nodes (working-root, api-working, ..., database-working)
```

**Relationship Type:** One-to-Many  
**Cardinality:** 1 Branch : N Nodes  
**Constraints:**
- Node belongs to exactly one branch
- Branch can have multiple nodes

---

### 2. Node → Domains

```
Node "has" Domain Binding

workdocs-working ──► workdocs.working.balloo.su (optional)
                  └─► localhost:3210 (local dev)

balloo-production-root ──► balloo.su (required)
                         └─► localhost:3000 (local dev)

database-working ──► (no domain)
                  └─► localhost:5432 (local dev)
```

**Relationship Type:** One-to-One (per environment)  
**Cardinality:** 1 Node : 1 Domain (per environment)  
**Constraints:**
- Production nodes require production domains
- Working nodes: domain optional
- All nodes have local dev identity

---

### 3. Node → Modules

```
Node "uses" Modules

api-working ──► core-types
             └─► api-gateway

kpdegen-working ──► codegen-core

workdocs-working ──► docs-core
```

**Relationship Type:** Many-to-Many  
**Cardinality:** N Nodes : M Modules  
**Constraints:**
- Module can be used by multiple nodes
- Node can use multiple modules

---

### 4. Node → Settings Scopes

```
Node "has" Settings Scopes

projectgeneralsettings-working ──► project-global
                                └─► branch-level
                                └─► node-level
                                └─► feature-level

workdocs-working ──► node-level
                  └─► docs-settings

database-working ──► node-level
                  └─► database-settings
```

**Relationship Type:** One-to-Many  
**Cardinality:** 1 Node : N Settings Scopes  
**Constraints:**
- Settings scopes are hierarchical
- Higher scopes can override lower scopes

---

### 5. Node → Runtime Targets

```
Node "maps to" Runtime Targets

workdocs-working ──► local_dev: localhost:3210
                  └─► working: workdocs.working.balloo.su

api-production ──► local_dev: localhost:4000
                └─► production: api.balloo.su
```

**Relationship Type:** One-to-Many  
**Cardinality:** 1 Node : N Runtime Targets (per environment)  
**Constraints:**
- Each environment has exactly one runtime target
- Runtime target identity preserved across environments

---

### 6. Node → Capabilities

```
Node "provides" Capabilities

ai-api-production ──► ai_api_capability (v4.*, planned)

files-production ──► file_storage_capability (active)
                  └─► yandex_disk_strategy (v3.1.*, active)
                  └─► spifs_strategy (planned)
```

**Relationship Type:** One-to-Many  
**Cardinality:** 1 Node : N Capabilities  
**Constraints:**
- Capabilities can be version-scoped
- Capabilities can be planned or active

---

### 7. Node → Release Roles

```
Node "has" Release Role

workdocs-working ──► working_only (does not promote)
api-working ──► promotes_to_production (via alpha)
alpha-root ──► alpha_only (testing)
```

**Relationship Type:** One-to-One  
**Cardinality:** 1 Node : 1 Release Role  
**Constraints:**
- Technical nodes are working-only
- Production nodes must pass through alpha

---

## 📐 RELATIONSHIP MATRIX

### Node Relationships Summary

| Node | Branch | Domain | Modules | Settings | Runtime | Capabilities |
|------|--------|--------|---------|----------|---------|--------------|
| workdocs-working | working | optional | docs-core | node-level, docs-settings | 2 | docs |
| nodes-switcher-working | working | optional | orchestration-core | version-registry, rollout-control | 2 | orchestration |
| kpdegen-working | working | optional | codegen-core | codegen-settings | 2 | codegen |
| projectgeneralsettings-working | working | optional | settings-core | project-global, branch-level, node-level, feature-level | 2 | settings_management |
| database-working | working | none | database-core | database-settings | 1 | database |
| balloo-production-root | production | required | core-types, messenger | project-global, node-level | 2 | root |
| api-production | production | required | core-types, api-gateway | node-level, feature-level | 2 | api |

---

## 🔗 RELATED DOCUMENTS

- [entity-definitions.md](./entity-definitions.md) — Entity definitions
- [domain-glossary.md](./domain-glossary.md) — Domain glossary
- [NODETREE_MANIFEST.json](../nodes/NODETREE_MANIFEST.json) — Node registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
