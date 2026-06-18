---
title: Module Dependency Contract
description: Module dependency types and rules
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - module
  - dependencies
  - architecture
  - contract
related_docs:
  - SUMMARY_DOCS/contracts/modules/ModuleContract.md
  - SUMMARY_DOCS/modules/MODULE_RELATIONS.json
---

# 🔗 MODULE DEPENDENCY CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот контракт определяет типы зависимостей между модулями и правила их управления.

**Primary Purpose:** Обеспечить явное описание зависимостей на уровне модулей для правильного codegen, docgen и deployment.

---

## 1. ✅ DEPENDENCY TYPES

### 1.1 Code Dependencies

**Определение:** Зависимости на уровне кода (импорты, пакеты).

**Examples:**
```typescript
// Code dependency: messenger-ui depends on core-types
import { MessageType } from '@balloo/core-types';
```

**Characteristics:**
- ✅ Explicit in package.json
- ✅ Resolved by package manager
- ✅ Version constraints
- ✅ Transitive dependencies

**Tracking:**
```json
{
  "moduleId": "messenger-ui",
  "codeDependencies": [
    {
      "moduleId": "core-types",
      "package": "@balloo/core-types",
      "version": "^1.0.0",
      "type": "direct"
    }
  ]
}
```

---

### 1.2 Contract Dependencies

**Определение:** Зависимости на уровне контрактов (спецификации, интерфейсы).

**Examples:**
```markdown
// Contract dependency: messenger-api depends on node-security-contract
- Implements NodeSecurityContract requirements
- Follows authentication patterns from security module
```

**Characteristics:**
- ✅ Documented in module contract
- ✅ May not have code dependency
- ✅ Architectural constraint
- ✅ Compliance requirement

**Tracking:**
```json
{
  "moduleId": "messenger-api",
  "contractDependencies": [
    {
      "contractId": "node-security-contract",
      "compliance": "required",
      "aspects": ["authentication", "authorization"]
    }
  ]
}
```

---

### 1.3 Doc Dependencies

**Определение:** Зависимости на уровне документации (ссылки, контекст).

**Examples:**
```markdown
// Doc dependency: MODULE_SUMMARY_messenger.md references MODULE_SUMMARY_core-types.md
See: [Core Types Module](./MODULE_SUMMARY_core-types.md)
```

**Characteristics:**
- ✅ Markdown links
- ✅ Cross-references
- ✅ Context requirements
- ✅ Knowledge dependencies

**Tracking:**
```json
{
  "moduleId": "messenger",
  "docDependencies": [
    {
      "moduleId": "core-types",
      "relationship": "references",
      "context": "type definitions"
    }
  ]
}
```

---

### 1.4 Data Dependencies

**Определение:** Зависимости на уровне данных (конфигурации, state).

**Examples:**
```json
// Data dependency: messenger-api depends on node-state configuration
{
  "nodeConfig": "./state/node-tree.json",
  "domainConfig": "./state/node-domains.json"
}
```

**Characteristics:**
- ✅ Configuration files
- ✅ State dependencies
- ✅ Data schemas
- ✅ Runtime data

**Tracking:**
```json
{
  "moduleId": "messenger-api",
  "dataDependencies": [
    {
      "dataId": "node-state",
      "files": ["node-tree.json", "node-services.json"],
      "usage": "deployment configuration"
    }
  ]
}
```

---

### 1.5 Runtime Dependencies

**Определение:** Зависимости на уровне runtime (сервисы, endpoints).

**Examples:**
```yaml
# Runtime dependency: messenger-api requires database service
services:
  - postgres:13
  - redis:6
```

**Characteristics:**
- ✅ Service dependencies
- ✅ Database requirements
- ✅ External APIs
- ✅ Infrastructure

**Tracking:**
```json
{
  "moduleId": "messenger-api",
  "runtimeDependencies": [
    {
      "service": "postgres",
      "version": "13",
      "purpose": "message storage"
    },
    {
      "service": "redis",
      "version": "6",
      "purpose": "caching"
    }
  ]
}
```

---

### 1.6 Node Dependencies

**Определение:** Зависимости на уровне узлов (размещение, networking).

**Examples:**
```markdown
// Node dependency: messenger-api requires work_server for execution
- Execution: work_server
- Exposure: work_server (port 3001)
- Storage: work_server (postgres)
```

**Characteristics:**
- ✅ Node placement
- ✅ Network requirements
- ✅ Resource requirements
- ✅ Proximity constraints

**Tracking:**
```json
{
  "moduleId": "messenger-api",
  "nodeDependencies": [
    {
      "nodeId": "work_server",
      "presence": "execution",
      "requirements": ["port:3001", "postgres:13"]
    }
  ]
}
```

---

### 1.7 Domain Dependencies

**Определение:** Зависимости на уровне доменов (бизнес-логика, routing).

**Examples:**
```markdown
// Domain dependency: messenger module exposed via messenger.balloo.su
- Domain: messenger.balloo.su
- Parent domain: balloo.su
- Routing: path-based under /messenger/*
```

**Characteristics:**
- ✅ Domain allocation
- ✅ Subdomain dependencies
- ✅ Routing rules
- ✅ DNS requirements

**Tracking:**
```json
{
  "moduleId": "messenger",
  "domainDependencies": [
    {
      "domain": "messenger.balloo.su",
      "type": "subdomain",
      "parent": "balloo.su",
      "routing": "direct"
    }
  ]
}
```

---

## 2. ✅ DEPENDENCY RULES

### Rule 1: Dependencies Fixed at Module Level

```
✅ Зависимости фиксируются на уровне модуля
✅ Один пакет может быть зависимостью внутри более крупного модуля
✅ Один модуль может зависеть от нескольких типов артефактов
```

### Rule 2: Dependency Direction

```
✅ Upstream dependencies — что модуль использует
✅ Downstream dependencies — что использует модуль
✅ Circular dependencies — forbidden (must be resolved)
```

### Rule 3: Dependency Declaration

```
✅ Все зависимости MUST быть декларированы
✅ Dependency type MUST быть указан
✅ Dependency strength MUST быть указан (required/optional)
```

### Rule 4: Dependency Resolution

```
✅ Code dependencies resolved by package manager
✅ Contract dependencies resolved by compliance
✅ Doc dependencies resolved by linking
✅ Runtime dependencies resolved by deployment
```

---

## 3. ✅ DEPENDENCY GRAPH

### Module Dependency Structure:

```
                    ┌─────────────────┐
                    │  core-types     │
                    │  (package)      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
     │  core-i18n  │ │  core-config│ │  core-theme │
     │  (package)  │ │  (package)  │ │  (package)  │
     └─────────────┘ └──────┬──────┘ └─────────────┘
                            │
                            │
                            ▼
                   ┌─────────────────┐
                   │   messenger     │
                   │   (hybrid)      │
                   └────────┬────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
     ┌─────────────────┐        ┌─────────────────┐
     │  messenger-api  │        │  messenger-ui   │
     │  (service)      │        │  (component)    │
     └─────────────────┘        └─────────────────┘
```

---

## 4. ✅ DEPENDENCY TRACKING

### MODULE_RELATIONS.json Structure:

```json
{
  "moduleDependencies": [
    {
      "from": "messenger-api",
      "to": "core-types",
      "type": "code",
      "strength": "required"
    },
    {
      "from": "messenger-api",
      "to": "node-security-contract",
      "type": "contract",
      "strength": "required"
    },
    {
      "from": "messenger-ui",
      "to": "messenger-api",
      "type": "runtime",
      "strength": "required"
    }
  ],
  "moduleNodeMap": {
    "messenger-api": ["work_server"],
    "messenger-ui": ["work_server", "laptop_control"],
    "summary-docs": ["laptop_control"]
  },
  "moduleDomainMap": {
    "messenger-api": "messenger.balloo.su",
    "summary-docs": "docs.balloo.su"
  }
}
```

---

## 5. ✅ DEPENDENCY VALIDATION

### Validation Checklist:

- [ ] **All dependencies declared** — нет скрытых зависимостей
- [ ] **Dependency types specified** — code/contract/doc/runtime/etc.
- [ ] **Dependency strength specified** — required/optional
- [ ] **No circular dependencies** — graph is acyclic
- [ ] **Version constraints valid** — semver compatible
- [ ] **Runtime dependencies satisfiable** — infrastructure available
- [ ] **Contract dependencies compliant** — contracts implemented

### Validation Rules:

```
✅ No undeclared dependencies
✅ No circular dependencies
✅ All required dependencies satisfiable
✅ Version constraints compatible
✅ Contract dependencies implementable
```

---

## 6. ✅ DEPENDENCY IMPACT ANALYSIS

### Impact Types:

| Change Type | Impact Scope | Examples |
|-------------|--------------|----------|
| **Breaking** | All dependents | API change, contract violation |
| **Non-breaking** | Direct dependents | New feature, optional param |
| **Internal** | Module only | Refactoring, optimization |

### Impact Propagation:

```
Module A (changed)
  ↓
Module B (direct dependency) — HIGH impact
  ↓
Module C (depends on B) — MEDIUM impact
  ↓
Module D (depends on C) — LOW impact
```

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Все 7 типов зависимостей определены
2. ✅ Dependency rules зафиксированы
3. ✅ Dependency graph описан
4. ✅ Dependency tracking специфицирован
5. ✅ Dependency validation определён
6. ✅ Dependency impact analysis описан

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
