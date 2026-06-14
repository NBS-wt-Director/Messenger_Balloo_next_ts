---
title: Module Index
description: Central navigation for Balloo module layer
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - modules
  - index
  - navigation
  - canonical
related_docs:
  - SUMMARY_DOCS/INDEX.md
  - SUMMARY_DOCS/MANIFEST.json
  - SUMMARY_DOCS/modules/MODULE_MANIFEST.json
---

# 🧩 MODULE INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Центральная навигация по module layer системы Balloo.

**Primary Purpose:** Обеспечить единую точку входа для навигации по всем модулям системы.

---

## 📚 QUICK START

### Для AI/Codegen:

1. **Начни с** → [MODULE_MANIFEST.json](./MODULE_MANIFEST.json) — machine-readable реестр
2. **Проверь** → [MODULE_RELATIONS.json](./MODULE_RELATIONS.json) — зависимости и связи
3. **Читай** → MODULE_CONTRACT_*.md — AI-readable контракты
4. **Используй** → MODULE_SUMMARY_*.md — human-readable summaries

### Для Разработчиков:

1. **Начни с** → [MODULE_DISCOVERY_REPORT.md](./MODULE_DISCOVERY_REPORT.md) — как найдены модули
2. **Проверь** → [MODULE_CLASSIFICATION.md](./MODULE_CLASSIFICATION.md) — классификация
3. **Читай** → MODULE_SUMMARY_*.md — quick reference
4. **Углубись** → MODULE_CONTRACT_*.md — формальные спецификации

---

## 📊 MODULE STATISTICS

| Статистика | Значение |
|------------|----------|
| **Всего модулей** | 14 |
| **Implemented** | 13 |
| **Inferred** | 1 |
| **Planned** | 0 |
| **Deprecated** | 0 |

### By Type:

| Тип | Количество |
|-----|------------|
| package | 7 |
| hybrid | 4 |
| service | 1 |
| documentation | 1 |
| contract | 1 |

### By Codegen Relevance:

| Relevance | Количество |
|-----------|------------|
| HIGH | 11 |
| MEDIUM | 3 |
| LOW | 0 |

---

## 🗂️ MODULE CATEGORIES

### Core Packages (7 модулей)

Базовые пакеты, используемые во всей системе:

| Модуль | Тип | Статус | Codegen |
|--------|-----|--------|---------|
| [core-types](./summary/MODULE_SUMMARY_core-types.md) | package | active | HIGH |
| [core-config](./summary/MODULE_SUMMARY_core-config.md) | package | active | HIGH |
| [core-i18n](./summary/MODULE_SUMMARY_core-i18n.md) | package | active | HIGH |
| [core-theme](./summary/MODULE_SUMMARY_core-theme.md) | package | active | MEDIUM |
| [core-brand](./summary/MODULE_SUMMARY_core-brand.md) | package | active | MEDIUM |
| [core-ui](./summary/MODULE_SUMMARY_core-ui.md) | package | active | HIGH |
| [core-docs-schema](./summary/MODULE_SUMMARY_core-docs-schema.md) | package | active | MEDIUM |

### Applications (4 модуля)

Пользовательские приложения и сервисы:

| Модуль | Тип | Статус | Codegen |
|--------|-----|--------|---------|
| [messenger](./summary/MODULE_SUMMARY_messenger.md) | hybrid | active | HIGH |
| [admin-portal](./summary/MODULE_SUMMARY_admin-portal.md) | hybrid | active | HIGH |
| [desktop](./summary/MODULE_SUMMARY_desktop.md) | hybrid | active | MEDIUM |
| [mobile](./summary/MODULE_SUMMARY_mobile.md) | hybrid | active | MEDIUM |

### Services (1 модуль)

Backend сервисы:

| Модуль | Тип | Статус | Codegen |
|--------|-----|--------|---------|
| [android-service](./summary/MODULE_SUMMARY_android-service.md) | service | active | HIGH |

### Infrastructure (2 модуля)

Инфраструктурные модули:

| Модуль | Тип | Статус | Codegen |
|--------|-----|--------|---------|
| [node-system](./summary/MODULE_SUMMARY_node-system.md) | contract | active | HIGH |
| [summary-docs](./summary/MODULE_SUMMARY_summary-docs.md) | documentation | active | MEDIUM |

---

## 📁 СТРУКТУРА MODULE LAYER

```
SUMMARY_DOCS/modules/
├── MODULE_INDEX.md                    # Этот файл
├── MODULE_MANIFEST.json               # Machine-readable реестр
├── MODULE_RELATIONS.json              # Связи между модулями
├── MODULE_DISCOVERY_REPORT.md         # Отчёт о discovery
├── MODULE_CLASSIFICATION.md           # Классификация модулей
├── summary/
│   ├── MODULE_SUMMARY_core-types.md
│   ├── MODULE_SUMMARY_core-config.md
│   ├── MODULE_SUMMARY_core-i18n.md
│   ├── MODULE_SUMMARY_core-theme.md
│   ├── MODULE_SUMMARY_core-brand.md
│   ├── MODULE_SUMMARY_core-ui.md
│   ├── MODULE_SUMMARY_core-docs-schema.md
│   ├── MODULE_SUMMARY_messenger.md
│   ├── MODULE_SUMMARY_admin-portal.md
│   ├── MODULE_SUMMARY_desktop.md
│   ├── MODULE_SUMMARY_mobile.md
│   ├── MODULE_SUMMARY_android-service.md
│   ├── MODULE_SUMMARY_node-system.md
│   └── MODULE_SUMMARY_summary-docs.md
└── contracts/
    ├── MODULE_CONTRACT_core-types.md
    ├── MODULE_CONTRACT_core-config.md
    ├── MODULE_CONTRACT_core-i18n.md
    ├── MODULE_CONTRACT_core-theme.md
    ├── MODULE_CONTRACT_core-brand.md
    ├── MODULE_CONTRACT_core-ui.md
    ├── MODULE_CONTRACT_core-docs-schema.md
    ├── MODULE_CONTRACT_messenger.md
    ├── MODULE_CONTRACT_admin-portal.md
    ├── MODULE_CONTRACT_desktop.md
    ├── MODULE_CONTRACT_mobile.md
    ├── MODULE_CONTRACT_android-service.md
    ├── MODULE_CONTRACT_node-system.md
    └── MODULE_CONTRACT_summary-docs.md
```

---

## 🔗 MODULE CONTRACTS

### Core Module Contracts:

- [ModuleContract.md](../contracts/modules/ModuleContract.md) — определение модуля
- [ModuleTypesContract.md](../contracts/modules/ModuleTypesContract.md) — типы модулей
- [ModuleDiscoveryContract.md](../contracts/modules/ModuleDiscoveryContract.md) — discovery rules
- [ModulePlacementContract.md](../contracts/modules/ModulePlacementContract.md) — размещение
- [ModuleDependencyContract.md](../contracts/modules/ModuleDependencyContract.md) — зависимости
- [ModuleDocgenContract.md](../contracts/modules/ModuleDocgenContract.md) — docgen rules
- [ModuleCodegenContract.md](../contracts/modules/ModuleCodegenContract.md) — codegen rules

---

## 🎯 MODULE LAYER В КОНТЕКСТЕ SUMMARY_DOCS

```
SUMMARY_DOCS/
├── INDEX.md → ROOT_SUMMARY_DOCS.md → MODULE_INDEX.md
├── MANIFEST.json → включает MODULE_MANIFEST.json
├── contracts/
│   ├── node-contracts/
│   ├── domain-contracts/
│   ├── modules/ ← Module contracts
│   └── project-contracts/
├── modules/ ← Module layer
│   ├── MODULE_INDEX.md
│   ├── MODULE_MANIFEST.json
│   ├── summary/
│   └── contracts/
├── topology/
├── state/
│   ├── module-state.json ← Module state
│   ├── module-node-map.json
│   ├── module-domain-map.json
│   └── module-endpoints.json
└── summary/
```

---

## 🤖 AI ENTRYPOINTS

### Для Codegen:

1. **Primary:** [MODULE_MANIFEST.json](./MODULE_MANIFEST.json)
2. **Contracts:** `contracts/MODULE_CONTRACT_*.md`
3. **Relations:** [MODULE_RELATIONS.json](./MODULE_RELATIONS.json)
4. **Types:** [ModuleTypesContract.md](../contracts/modules/ModuleTypesContract.md)

### Для Docgen:

1. **Primary:** [MODULE_INDEX.md](./MODULE_INDEX.md)
2. **Summaries:** `summary/MODULE_SUMMARY_*.md`
3. **Discovery:** [MODULE_DISCOVERY_REPORT.md](./MODULE_DISCOVERY_REPORT.md)
4. **Classification:** [MODULE_CLASSIFICATION.md](./MODULE_CLASSIFICATION.md)

---

## ✅ ACCEPTANCE CRITERIA

Module layer считается выполненным если:

1. ✅ MODULE_INDEX.md создан
2. ✅ MODULE_MANIFEST.json создан
3. ✅ MODULE_RELATIONS.json создан
4. ✅ MODULE_DISCOVERY_REPORT.md создан
5. ✅ MODULE_CLASSIFICATION.md создан
6. ✅ MODULE_SUMMARY_*.md созданы для всех модулей
7. ✅ MODULE_CONTRACT_*.md созданы для всех модулей
8. ✅ Module contracts в SUMMARY_DOCS/contracts/modules/
9. ✅ Module state files в SUMMARY_DOCS/state/
10. ✅ Web reader показывает module layer

---

## 🔗 LINKS

### Navigation:

- [SUMMARY_DOCS INDEX](../INDEX.md)
- [ROOT_SUMMARY_DOCS](../summary/ROOT_SUMMARY_DOCS.md)
- [AI_ENTRYPOINTS](../appendix/AI_ENTRYPOINTS.md)

### Module Contracts:

- [ModuleContract](../contracts/modules/ModuleContract.md)
- [ModuleTypesContract](../contracts/modules/ModuleTypesContract.md)
- [ModuleDiscoveryContract](../contracts/modules/ModuleDiscoveryContract.md)

### Registry:

- [MODULE_MANIFEST.json](./MODULE_MANIFEST.json)
- [MODULE_RELATIONS.json](./MODULE_RELATIONS.json)
- [MODULE_DISCOVERY_REPORT.md](./MODULE_DISCOVERY_REPORT.md)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
