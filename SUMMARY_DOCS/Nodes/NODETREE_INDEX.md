---
title: Node Tree Index
description: Канонический индекс дерева узлов Balloo — branch tree, domain tree, node registry
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - nodes
  - branches
  - domains
  - codegen
  - canonical
related_docs:
  - SUMMARY_DOCS/INDEX.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/nodes/DOMAIN_TREE.md
  - SUMMARY_DOCS/contracts/nodes/BranchNodeContract.md
  - SUMMARY_DOCS/contracts/nodes/DomainNodeContract.md
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
---

# 🌳 NODE TREE INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **единая точка входа** для работы с деревом узлов Balloo.

**Primary Purpose:** Обеспечить AI и разработчиков канонической моделью внешней формы системы.

---

## 📊 ЧТО ЭТО ДАЁТ

Node Tree позволяет:
- ✅ Понимать дерево веток и узлов
- ✅ Понимать функционал каждого узла
- ✅ Понимать доменные привязки
- ✅ Понимать настройки и зависимости
- ✅ Генерировать новые документы
- ✅ Генерировать код и конфигурацию
- ✅ Различать dev/working без доменов и production под доменами

---

## 🏗️ АРХИТЕКТУРА ДОКУМЕНТАЦИИ

```
SUMMARY_DOCS/nodes/
├── NODETREE_INDEX.md              ← Вы здесь
├── NODETREE_MANIFEST.json         ← Machine-readable registry
├── BRANCH_TREE.md                 ← Ветки: production, alpha, working
├── DOMAIN_TREE.md                 ← Домены и поддомены
├── NODE_SETTINGS_MODEL.md         ← Модель настроек узлов
├── NODE_RUNTIME_MODEL.md          ← Модель runtime (dev/prod)
├── NODE_CODEGEN_MODEL.md          ← Модель кодогенерации
├── NODE_CODEGEN_POLICY.md         ← Политика кодогенерации
├── NODE_RUNTIME_POLICY.md         ← Политика runtime
├── NODE_DISCOVERY_REPORT.md       ← Отчёт обнаружения узлов
│
├── branches/                      ← Документы по веткам
│   ├── ENV_PRODUCTION.md
│   ├── ENV_ALPHA.md
│   └── ENV_WORKING.md
│
├── technical/                     ← Технические узлы (приоритет 1)
│   ├── TECHNICAL_NODES_PRIORITY.md
│   ├── NODE_workdocs_working.md
│   ├── NODE_nodes_switcher_working.md
│   ├── NODE_kpdegen_working.md
│   └── NODE_projectgeneralsettings_working.md
│
├── domains/                       ← Узлы с доменами
├── public/                        ← Публичные узлы
├── runtime/                       ← Runtime спецификации
│
├── summary/                       ← Human-readable summaries
│   └── NODE_SUMMARY_<node-id>.md
│
└── contracts/                     ← AI-readable contracts
    └── NODE_CONTRACT_<node-id>.md
```

---

## 🌿 ВЕТКИ (BRANCHES)

### Production Branch
**Среда:** production  
**Домен:** balloo.su  
**Статус:** Стабильная production-среда  
**Доступ:** Публичный + авторизованный

### Alpha Branch
**Среда:** alpha  
**Домен:** alpha.balloo.su  
**Статус:** Тестирование новых функций  
**Доступ:** Ограниченный

### Working Branch
**Среда:** working  
**Домен:** working.balloo.su  
**Статус:** Разработка и интеграция  
**Доступ:** Внутренний + разработчики

---

## 🔧 ТЕХНИЧЕСКИЕ УЗЛЫ (ПРИОРИТЕТ 1)

Следующие технические узлы working-ветки имеют **наивысший приоритет** для codegen:

| Node ID | Domain | Назначение |
|---------|--------|------------|
| workdocs.working | workdocs.working.balloo.su | Рабочая документация |
| nodes-switcher.working | nodes-switcher.working.balloo.su | Менеджер версий узлов |
| kpdegen.working | kpdegen.working.balloo.su | Серверный кодогенератор |
| projectgeneralsettings.working | projectgeneralsettings.working.balloo.su | Управление настройками |

---

## 📦 УЗЛЫ ПО ВЕТКАМ

### Production (11 узлов)
- balloo.su (root)
- api.balloo.su
- ai.api.balloo.su (v4.*)
- files.balloo.su
- docs.balloo.su
- future.balloo.su
- admin.balloo.su
- workers.balloo.su
- abaut.balloo.su
- apps.balloo.su
- client-apps (family: android, ios, windows, linux, macos)

### Alpha (3 узла)
- alpha.balloo.su (root)
- apps.alpha.balloo.su
- 2commands.alpha.balloo.su

### Working (15 узлов)
- working.balloo.su (root)
- api.working.balloo.su
- files.working.balloo.su
- docs.working.balloo.su
- future.working.balloo.su
- pilot-future.working.balloo.su
- admin.working.balloo.su
- workers.working.balloo.su
- abaut.working.balloo.su
- apps.working.balloo.su
- workdocs.working.balloo.su ⭐
- nodes-switcher.working.balloo.su ⭐
- kpdegen.working.balloo.su ⭐
- projectgeneralsettings.working.balloo.su ⭐
- database-working (technical, no domain)

---

## 🔑 КЛЮЧЕВЫЕ ПРИНЦИПЫ

### 1. Dev/Working без доменов
```
working/dev запускается локально и без обязательных доменов
```

### 2. Production под доменами
```
production работает под закреплёнными production доменами
```

### 3. Alpha как отдельная среда
```
alpha работает как отдельная ограниченная среда
```

### 4. Технические узлы — first-class
```
Технические узлы не второстепенны — они приоритет 1
```

### 5. Production identity не теряется
```
Production identity узла не теряется даже если dev запускается локально
```

---

## 📖 ПОРЯДОК ЧТЕНИЯ (AI WORKFLOW)

### Для codegen:
```
1. NODETREE_INDEX.md (вы здесь)
2. NODETREE_MANIFEST.json (machine-readable)
3. BRANCH_TREE.md (ветки)
4. DOMAIN_TREE.md (домены)
5. NODE_SETTINGS_MODEL.md (настройки)
6. NODE_RUNTIME_MODEL.md (runtime)
7. NODE_CODEGEN_MODEL.md (codegen)
8. Relevant NODE_CONTRACT_<node-id>.md
```

### Для понимания узла:
```
1. NODE_SUMMARY_<node-id>.md (human-readable)
2. NODE_CONTRACT_<node-id>.md (AI-readable spec)
3. NODE_SETTINGS_MODEL.md (настройки)
4. NODE_RUNTIME_MODEL.md (runtime behavior)
```

### Для environment understanding:
```
1. ENV_WORKING.md / ENV_ALPHA.md / ENV_PRODUCTION.md
2. NODE_RUNTIME_POLICY.md
3. NODE_DISCOVERY_REPORT.md
```

---

## 🗂️ CONTRACTS

Контракты определяют спецификации для AI:

- [BranchNodeContract.md](../contracts/nodes/BranchNodeContract.md) — Ветки и их правила
- [DomainNodeContract.md](../contracts/nodes/DomainNodeContract.md) — Доменные привязки
- [TechnicalNodeContract.md](../contracts/nodes/TechnicalNodeContract.md) — Технические узлы
- [NodeSettingsContract.md](../contracts/nodes/NodeSettingsContract.md) — Настройки
- [NodeEnvironmentContract.md](../contracts/nodes/NodeEnvironmentContract.md) — Среды
- [NodeReleaseContract.md](../contracts/nodes/NodeReleaseContract.md) — Релизы
- [NodeRoutingContract.md](../contracts/nodes/NodeRoutingContract.md) — Routing

---

## 📊 STATE FILES

Machine-readable state для codegen:

- [branch-tree.json](../state/branch-tree.json) — Дерево веток
- [domain-tree.json](../state/domain-tree.json) — Дерево доменов
- [node-settings-map.json](../state/node-settings-map.json) — Настройки узлов
- [node-runtime-map.json](../state/node-runtime-map.json) — Runtime mapping
- [node-codegen-map.json](../state/node-codegen-map.json) — Codegen relevance
- [node-priority-map.json](../state/node-priority-map.json) — Приоритеты

---

## 🎯 CODEGEN RELEVANCE

### Priority 1 (Технические working)
- workdocs.working
- nodes-switcher.working
- kpdegen.working
- projectgeneralsettings.working

### Priority 2 (Остальные working)
- api.working
- files.working
- docs.working
- admin.working
- workers.working
- apps.working

### Priority 3 (Alpha)
- alpha.balloo.su
- apps.alpha
- 2commands.alpha

### Priority 4 (Production public)
- balloo.su
- api.balloo.su
- files.balloo.su
- docs.balloo.su
- admin.balloo.su
- client-apps family

---

## ✅ CRITICAL INVARIANTS

1. **Не смешивать Balloo с другими проектами**
2. **Не делать технические узлы второстепенными**
3. **Не требовать реальные домены для local/dev**
4. **Не терять production identity доменов**
5. **Не выдумывать неозвученные узлы**
6. **Planned узлы отмечать status = planned**
7. **Version-scoped capabilities отмечать версию**
8. **SPiFS — planned, не production**
9. **ai.api.balloo.su — v4.* capability**
10. **database-working — technical runtime node**

---

## 🔗 RELATED DOCUMENTS

- [SUMMARY_DOCS/INDEX.md](../INDEX.md) — Главная навигация
- [SUMMARY_DOCS/MANIFEST.json](../MANIFEST.json) — Индекс документации
- [SUMMARY_DOCS/modules/MODULE_INDEX.md](../Modules/MODULE_INDEX.md) — Дерево модулей
- [SUMMARY_DOCS/playbooks/codegen-playbook.md](../playbooks/codegen-playbook.md) — Codegen playbook
- [SUMMARY_DOCS/appendix/AI_ENTRYPOINTS.md](../appendix/AI_ENTRYPOINTS.md) — AI entry points

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
