---
title: Technical Nodes Priority
description: Приоритет технических узлов Balloo — working branch technical nodes first
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - technical-nodes
  - priority
  - working
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
  - SUMMARY_DOCS/state/node-priority-map.json
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
---

# ⭐ TECHNICAL NODES PRIORITY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует **приоритет технических узлов** working-ветки Balloo.

**Ключевой принцип:** Технические узлы не второстепенны — они **приоритет 1** (first priority).

---

## 📊 PRIORITY 1 TECHNICAL NODES

### Список узлов

| # | Node ID | Domain | Type | Purpose |
|---|---------|--------|------|---------|
| 1 | workdocs-working | workdocs.working.balloo.su | technical-docs | Рабочая документация |
| 2 | nodes-switcher-working | nodes-switcher.working.balloo.su | technical-orchestration | Менеджер версий |
| 3 | kpdegen-working | kpdegen.working.balloo.su | technical-codegen | Серверный кодогенератор |
| 4 | projectgeneralsettings-working | projectgeneralsettings.working.balloo.su | technical-settings | Управление настройками |
| 5 | database-working | (no domain) | technical-runtime | База данных working |

---

## 🔍 ПОДРОБНОЕ ОПИСАНИЕ

### 1. WORKDOCS-WORKING ⭐

**Domain:** `workdocs.working.balloo.su`  
**Local Dev:** `localhost:3210`

**Назначение:**
- Рабочая документация
- md-файлы для разработчиков и AI
- Вывод документации как защищённого сайта
- Ядро SUMMARY_DOCS / web docs mode

**Ключевые функции:**
- source-of-truth relation to SUMMARY_DOCS
- password-protected docs presentation
- relation to AI doc reading
- relation to codegen context assembly

**Документы:**
- [NODE_workdocs_working.md](./NODE_workdocs_working.md) — Подробное описание
- [NODE_CONTRACT_workdocs_working.md](../contracts/NODE_CONTRACT_workdocs_working.md) — Контракт

---

### 2. NODES-SWITCHER-WORKING ⭐

**Domain:** `nodes-switcher.working.balloo.su`  
**Local Dev:** `localhost:3211`

**Назначение:**
- Отслеживание версий узлов
- Менеджер обновлений
- Переключение версий узлов

**Ключевые функции:**
- node version registry
- rollout control
- compatibility checks
- update orchestration role

**Документы:**
- [NODE_nodes_switcher_working.md](./NODE_nodes_switcher_working.md) — Подробное описание
- [NODE_CONTRACT_nodes_switcher_working.md](../contracts/NODE_CONTRACT_nodes_switcher_working.md) — Контракт

---

### 3. KPDEGEN-WORKING ⭐

**Domain:** `kpdegen.working.balloo.su`  
**Local Dev:** `localhost:4200`

**Назначение:**
- Серверный кодогенератор
- Execution/control surface для codegen

**Ключевые функции:**
- input docs/contracts/state
- output code/config/docs
- safety checks
- scope restrictions
- relation to module contracts and node contracts

**Документы:**
- [NODE_kpdegen_working.md](./NODE_kpdegen_working.md) — Подробное описание
- [NODE_CONTRACT_kpdegen_working.md](../contracts/NODE_CONTRACT_kpdegen_working.md) — Контракт

---

### 4. PROJECTGENERALSETTINGS-WORKING ⭐

**Domain:** `projectgeneralsettings.working.balloo.su`  
**Local Dev:** `localhost:3212`

**Назначение:**
- Управление всеми настройками других узлов
- Central settings UI/surface

**Ключевые функции:**
- project settings authority
- node settings map
- global vs node-local settings
- feature flags
- release toggles
- tariffs/features if applicable

**Документы:**
- [NODE_projectgeneralsettings_working.md](./NODE_projectgeneralsettings_working.md) — Подробное описание
- [NODE_CONTRACT_projectgeneralsettings_working.md](../contracts/NODE_CONTRACT_projectgeneralsettings_working.md) — Контракт

---

### 5. DATABASE-WORKING ⭐

**Domain:** (none)  
**Local Dev:** `localhost:5432`

**Назначение:**
- Technical runtime node
- Database for working environment

**Ключевые функции:**
- database for working branch
- no public domain
- internal access only

**Документы:**
- [NODE_database_working.md](./NODE_database_working.md) — Подробное описание
- [NODE_CONTRACT_database_working.md](../contracts/NODE_CONTRACT_database_working.md) — Контракт

---

## 🎯 CODEGEN PRIORITY

### Order of Generation

```
1. Priority 1 Technical Nodes (working)
   ↓
2. Priority 2 Other Working Nodes
   ↓
3. Priority 3 Alpha Nodes
   ↓
4. Priority 4 Production Public Nodes
```

### Why Technical Nodes First?

1. **workdocs** — обеспечивает документацию для codegen context
2. **nodes-switcher** — управляет версиями и rollout
3. **kpdegen** — это сама система кодогенерации
4. **projectgeneralsettings** — управляет настройками для codegen
5. **database-working** — хранит данные для working

---

## ✅ CRITICAL INVARIANTS

1. **Технические узлы — first-class** — не второстепенны
2. **Priority 1 для codegen** — highest codegen priority
3. **Working branch only** — technical nodes в working
4. **Auth required** — все технические узлы требуют авторизации
5. **No public access** — технические узлы не публичны
6. **domainRequired = false** — могут работать на localhost
7. **production identity preserved** — logical identity сохраняется

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../NODETREE_INDEX.md) — Главный индекс
- [NODETREE_MANIFEST.json](../NODETREE_MANIFEST.json) — Node registry
- [node-priority-map.json](../../state/node-priority-map.json) — Priority state
- [TechnicalNodeContract.md](../../contracts/nodes/TechnicalNodeContract.md) — Technical contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
