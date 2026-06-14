---
title: Core Types Module Summary
description: Shared TypeScript types for Balloo monorepo
moduleId: core-types
moduleType: package
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - core
  - types
  - typescript
  - shared
related_docs:
  - SUMMARY_DOCS/modules/MODULE_INDEX.md
  - SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_core-types.md
  - SUMMARY_DOCS/packages/core-types/README.md
---

# 🧩 MODULE SUMMARY: Core Types

**Module ID:** core-types  
**Module Type:** package  
**Status:** active  
**Version:** 1.0.0

---

## 1. ✅ ЧТО ЭТО ЗА МОДУЛЬ

**Core Types** — центральный пакет общих TypeScript типов для всего Balloo monorepo.

**Назначение:**
- Единый источник истины для типов данных
- Переиспользуемые type definitions
- Типизация для всех пакетов и приложений

---

## 2. ✅ ЗАЧЕМ ОН НУЖЕН

**Проблемы которые решает:**

1. **Дублирование типов** — типы не дублируются в разных пакетах
2. **Консистентность** — все используют одинаковые определения
3. **Поддержка** — изменения в одном месте
4. **Type safety** — строгая типизация во всём проекте

**Value Proposition:**
- ✅ Single source of truth for types
- ✅ Reduced code duplication
- ✅ Improved type safety
- ✅ Easier maintenance

---

## 3. ✅ КАКОГО ОН ТИПА

**Module Type:** package

**Characteristics:**
- ✅ Library package (npm)
- ✅ TypeScript types and interfaces
- ✅ No runtime code
- ✅ Import/export surface only

**Authority Type:** code

**Source of Truth:**
- ✅ TypeScript source files
- ✅ package.json
- ✅ Published npm package

---

## 4. ✅ ГДЕ ОН ЖИВЁТ В REPO

**Repository Paths:**
```
packages/core-types/
├── src/
│   ├── index.ts
│   ├── types/
│   │   ├── common.ts
│   │   ├── node.ts
│   │   ├── messenger.ts
│   │   └── ...
│   └── interfaces/
├── package.json
├── tsconfig.json
└── README.md
```

**Package Name:** `@balloo/core-types`

**Import Pattern:**
```typescript
import { MessageType, NodeConfig } from '@balloo/core-types';
```

---

## 5. ✅ КАКИЕ У НЕГО ЕСТЬ ИНТЕРФЕЙСЫ

### Public Interfaces:

**Type Exports:**
```typescript
// Common types
export type ID = string;
export type Timestamp = number;
export type Status = 'active' | 'inactive' | 'pending';

// Node types
export interface NodeConfig { ... }
export interface NodeState { ... }

// Messenger types
export interface Message { ... }
export interface Conversation { ... }
```

### Import Surface:

**Used By:**
- ✅ All core-* packages
- ✅ messenger app
- ✅ admin-portal app
- ✅ desktop app
- ✅ mobile app
- ✅ android-service

---

## 6. ✅ ГДЕ ОН ПРОЯВЛЯЕТСЯ В СИСТЕМЕ

### Node Presence:

| Node | Presence Type | Description |
|------|---------------|-------------|
| laptop_control | import | Used in development |
| work_server | import | Used in build/deployment |

### Domain Exposure:

**None** — package module, no domain exposure.

**Distribution:**
- ✅ npm package (@balloo/core-types)
- ✅ Importable from any module

---

## 7. ✅ С ЧЕМ ОН СВЯЗАН

### Dependencies:

**Upstream (depends on):**
- ⭕ None — base types package

**Downstream (used by):**
- ✅ core-config
- ✅ core-i18n
- ✅ core-theme
- ✅ core-brand
- ✅ core-ui
- ✅ core-docs-schema
- ✅ messenger
- ✅ admin-portal
- ✅ desktop
- ✅ mobile
- ✅ android-service

### Related Modules:

| Module | Relationship |
|--------|--------------|
| core-config | provides types |
| core-i18n | provides types |
| core-theme | provides types |
| core-ui | provides types |
| messenger | provides types |

---

## 8. ✅ НАСКОЛЬКО ОН РЕАЛИЗОВАН

**Implementation Status:** ✅ Implemented

**Evidence:**
- ✅ Package exists in packages/core-types/
- ✅ package.json present
- ✅ Source files present
- ✅ Imported by multiple modules
- ✅ Published to npm (or local registry)

**Completeness:**
- ✅ Core types defined
- ✅ Node types defined
- ✅ Messenger types defined
- ✅ Admin types defined
- ⭕ Some domain types may be incomplete

---

## 9. ✅ ПОЧЕМУ ОН ВАЖЕН ДЛЯ AI/РАЗРАБОТКИ

### For AI Codegen:

**HIGH Relevance:**
- ✅ Primary source for type generation
- ✅ Used in all codegen templates
- ✅ Type definitions drive scaffolding
- ✅ Contract-based type generation

**Codegen Usage:**
```typescript
// AI reads MODULE_CONTRACT_core-types.md
// Generates type definitions
export interface <TypeName> {
  // From contract spec
}
```

### For Developers:

**Quick Reference:**
- ✅ All types in one place
- ✅ Easy to find and import
- ✅ Well-documented
- ✅ Type hints in IDE

---

## 📊 METRICS

| Metric | Value | Updated |
|--------|-------|---------|
| **Type Count** | 80+ | ✅ 2026-06-14 |
| **Interface Count** | 45+ | ✅ 2026-06-14 |
| **Type Utilities** | 10 | ✅ 2026-06-14 |
| **Dependent Modules** | 11 | — |
| **Import Count** | 100+ | — |
| **Codegen Relevance** | HIGH | — |
| **Docgen Relevance** | HIGH | — |

### Type Categories:

| Category | Count | Status |
|----------|-------|--------|
| Common | 5 | ✅ Complete |
| User | 1 | ✅ Complete |
| Chat | 3 | ✅ Complete |
| Message | 4 | ✅ Complete |
| **Node** | **6** | ✅ **Added 2026-06-14** |
| Invitation | 1 | ✅ Complete |
| Notification | 1 | ✅ Complete |
| Feature | 1 | ✅ Complete |
| Page | 2 | ✅ Complete |
| Report | 1 | ✅ Complete |
| Auth | 3 | ✅ Complete |
| API | 2 | ✅ Complete |
| Platform | 3 | ✅ Complete |
| Admin | 5 | ✅ **Added 2026-06-14** |
| Type Utilities | 10 | ✅ **Added 2026-06-14** |

---

## 🔄 CHANGELOG

### Version 1.0.0 (2026-06-14)

**Added:**
- ✅ Node types (NodeConfig, NodeState, NodeTree, NodeType, NodeRole, NodeDeploymentTarget)
- ✅ Admin types (AdminUser, AdminRole, AdminPermission, AuditLogEntry, SystemMetrics)
- ✅ Common types (ID, Timestamp, Status, Result)
- ✅ Type utilities (Partial, Required, Readonly, Keys, PickByValue, OmitByValue, DeepPartial, Nullable, AsyncFunction)
- ✅ ID type aliases (UserId, ChatId, MessageId, NodeId, ConversationId, AnyID)

**Updated:**
- ✅ AppConfig extended with featureFlags and metadata
- ✅ Enhanced JSDoc documentation for all types

---

## 🔗 LINKS

- **Contract:** [MODULE_CONTRACT_core-types.md](../contracts/MODULE_CONTRACT_core-types.md)
- **Package:** [packages/core-types/](../../../packages/core-types/)
- **Module Index:** [MODULE_INDEX.md](../MODULE_INDEX.md)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
