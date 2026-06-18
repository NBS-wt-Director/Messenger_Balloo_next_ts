---
title: Core Types Module Contract
description: Formal specification for Core Types module
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
  - contract
related_docs:
  - SUMMARY_DOCS/modules/MODULE_INDEX.md
  - SUMMARY_DOCS/modules/summary/MODULE_SUMMARY_core-types.md
  - SUMMARY_DOCS/contracts/modules/ModuleTypesContract.md
---

# 🧩 MODULE CONTRACT: Core Types

**Module ID:** core-types  
**Module Name:** Core Types  
**Module Type:** package  
**Version:** 1.0.0  
**Date:** 2026-06-13  
**Status:** active  
**Authority Type:** code

---

## 1. ✅ MODULE IDENTITY

| Field | Value |
|-------|-------|
| **moduleId** | core-types |
| **moduleName** | Core Types |
| **moduleType** | package |
| **moduleStatus** | active |
| **authorityType** | code |
| **package** | @balloo/core-types |
| **version** | 1.0.0 |

---

## 2. ✅ PURPOSE

### Problem Solved:

**Centralized type definitions** — Without core-types, each package and app defines its own types, leading to duplication and inconsistency.

### Why Module Exists:

- ✅ Single source of truth for TypeScript types
- ✅ Shared type definitions across monorepo
- ✅ Type safety and consistency
- ✅ Reduced maintenance burden

### Scope:

- ✅ TypeScript type definitions
- ✅ Interface definitions
- ✅ Type utilities
- ✅ Generic types

### Out of Scope:

- ⭕ Runtime code
- ⭕ Business logic
- ⭕ API implementations
- ⭕ UI components

---

## 3. ✅ ARTIFACTS

### Code Artifacts:

```
packages/core-types/
├── src/
│   ├── index.ts              # Main entry point
│   ├── types/
│   │   ├── common.ts         # Common types (ID, Timestamp, Status)
│   │   ├── node.ts           # Node-related types
│   │   ├── messenger.ts      # Messenger types
│   │   ├── admin.ts          # Admin types
│   │   └── index.ts          # Type exports
│   └── interfaces/
│       ├── NodeConfig.ts     # Node configuration interface
│       ├── Message.ts        # Message interface
│       └── index.ts          # Interface exports
├── package.json
├── tsconfig.json
└── README.md
```

### Doc Artifacts:

- ✅ README.md — Package documentation
- ✅ MODULE_SUMMARY_core-types.md — Human-readable summary
- ✅ MODULE_CONTRACT_core-types.md — This contract
- ✅ API documentation (generated)

### Contract Artifacts:

- ✅ This module contract
- ✅ Type specifications
- ✅ Interface definitions

### Data Artifacts:

- ⭕ None — types only, no runtime data

### Runtime Artifacts:

- ⭕ None — no runtime code

---

## 4. ✅ INTERFACES

### Public Interfaces:

**Type Exports:**
```typescript
// Common
export type ID = string;
export type Timestamp = number;
export type Status = 'active' | 'inactive' | 'pending';

// Node
export interface NodeConfig {
  nodeId: ID;
  nodeName: string;
  nodeType: 'laptop' | 'server' | 'nas' | 'aio';
  // ...
}

export interface NodeState {
  nodeId: ID;
  status: Status;
  lastSeen: Timestamp;
  // ...
}

// Messenger
export interface Message {
  messageId: ID;
  conversationId: ID;
  senderId: ID;
  content: string;
  timestamp: Timestamp;
  // ...
}

export interface Conversation {
  conversationId: ID;
  participants: ID[];
  lastMessage: Message;
  // ...
}
```

### Internal Interfaces:

- ⭕ None — all interfaces are public

### Endpoint Surface:

**Import Surface:**
```typescript
import { MessageType, NodeConfig } from '@balloo/core-types';
```

**No HTTP/RPC endpoints** — package module.

### Docs Entrypoints:

- ✅ MODULE_SUMMARY_core-types.md
- ✅ MODULE_CONTRACT_core-types.md
- ✅ packages/core-types/README.md

---

## 5. ✅ PLACEMENT

### Repo Placement:

```
packages/core-types/
```

### Node Presence:

| Node | Presence | Description |
|------|----------|-------------|
| laptop_control | import | Used in development |
| work_server | import | Used in build/deployment |

### Domain Exposure:

**None** — package module.

**Distribution:** npm package (@balloo/core-types)

### Branch Relevance:

- ✅ main — stable version
- ✅ feature/* — development branches
- ✅ All branches that modify types

---

## 6. ✅ DEPENDENCIES

### Depends On Modules:

- ⭕ None — base types package

### External Dependencies:

```json
{
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### Upstream Contracts:

- ⭕ None

### Downstream Consumers:

| Module | Type | Usage |
|--------|------|-------|
| core-config | package | Type definitions |
| core-i18n | package | Type definitions |
| core-theme | package | Type definitions |
| core-brand | package | Type definitions |
| core-ui | package | Type definitions |
| core-docs-schema | package | Type definitions |
| messenger | hybrid | Type definitions |
| admin-portal | hybrid | Type definitions |
| desktop | hybrid | Type definitions |
| mobile | hybrid | Type definitions |
| android-service | service | Type definitions |

---

## 7. ✅ GENERATION RELEVANCE

### Used For Codegen:

**YES — HIGH Relevance**

**Codegen Usage:**
- ✅ Type generation templates
- ✅ Interface scaffolding
- ✅ Type-safe code generation
- ✅ Contract-based type definitions

### Used For Docgen:

**YES — HIGH Relevance**

**Docgen Usage:**
- ✅ API documentation generation
- ✅ Type reference docs
- ✅ Interface documentation

### Reconstruction Value:

**HIGH** — Essential for monorepo consistency.

### Audit Value:

**HIGH** — Types affect all dependent modules.

---

## 8. ✅ EVIDENCE

### Inferred From:

- ⭕ Not inferred — implemented module

### Canonical Docs:

- ✅ MODULE_SUMMARY_core-types.md
- ✅ MODULE_CONTRACT_core-types.md
- ✅ packages/core-types/README.md

### Related Packages:

- ✅ @balloo/core-types (npm)

### Related Apps:

- ✅ messenger
- ✅ admin-portal
- ✅ desktop
- ✅ mobile
- ✅ android-service

### Related Contracts:

- ✅ ModuleTypesContract.md
- ✅ ModuleDependencyContract.md

---

## 9. ✅ INVARIANTS

### Required Invariants:

1. ✅ **Type consistency** — All types must be consistent across monorepo
2. ✅ **No breaking changes** — Backward compatibility required
3. ✅ **Single source** — Types defined only in core-types
4. ✅ **Type safety** — All exports must be properly typed

### Forbidden Assumptions:

- ❌ Don't assume types are optional — they are required
- ❌ Don't duplicate types in other packages
- ❌ Don't modify types without updating all consumers

### Compatibility Notes:

- ✅ Semver versioning
- ✅ Breaking changes require major version bump
- ✅ Deprecation path for old types

---

## 10. ✅ STATUS NOTES

### Implementation Status:

**✅ Implemented (v1.0.0)**

**Evidence:**
- ✅ Package exists in packages/core-types/
- ✅ package.json present
- ✅ Source files present (src/index.ts)
- ✅ Imported by multiple modules
- ✅ [CODEGEN] 2026-06-14 — Full type generation complete

### Codegen History:

| Date | Version | Changes |
|------|---------|---------|
| 2026-06-14 | 1.0.0 | Full type generation from MODULE_CONTRACT |
| 2026-06-14 | 1.0.0 | Added Node types (NodeConfig, NodeState, NodeTree) |
| 2026-06-14 | 1.0.0 | Added Admin types (AdminUser, AuditLogEntry, SystemMetrics) |
| 2026-06-14 | 1.0.0 | Added Type Utilities (10 utility types) |
| 2026-06-14 | 1.0.0 | Enhanced JSDoc documentation |

### Migration Notes:

- ⭕ No migration needed — stable module
- ✅ Backward compatible with previous versions

### Future Work:

- ⭕ Add more domain-specific types (as needed)
- ✅ Type documentation enhanced with JSDoc
- ⭕ Add type tests (pending test framework setup)

---

## 📊 METRICS

| Metric | Value |
|--------|-------|
| **Type Count** | 50+ |
| **Interface Count** | 30+ |
| **Dependent Modules** | 11 |
| **Import Count** | 100+ |
| **Codegen Relevance** | HIGH |
| **Docgen Relevance** | HIGH |

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Module identity defined
2. ✅ Purpose documented
3. ✅ Artifacts listed
4. ✅ Interfaces specified
5. ✅ Placement documented
6. ✅ Dependencies listed
7. ✅ Generation relevance defined
8. ✅ Evidence provided
9. ✅ Invariants specified
10. ✅ Status notes included

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
