---
title: Module Placement Contract
description: Module placement rules and relationships to other architectural concepts
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - module
  - placement
  - architecture
  - contract
related_docs:
  - SUMMARY_DOCS/contracts/modules/ModuleContract.md
  - SUMMARY_DOCS/contracts/node-contracts/NodeTreeContract.md
  - SUMMARY_DOCS/topology/DOMAIN_MAP.md
---

# 📍 MODULE PLACEMENT CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот контракт определяет размещение модулей относительно других архитектурных концепций.

**Primary Purpose:** Прояснить отношения module vs package vs service vs app vs node vs domain.

---

## 1. ✅ MODULE VS PACKAGE

### Package — форма реализации, Module — логическая единица

| Аспект | Package | Module |
|--------|---------|--------|
| **Nature** | Implementation artifact | Logical architecture unit |
| **Scope** | Code distribution | System boundary |
| **Runtime** | Library import | MAY have runtime |
| **Boundary** | Export surface | Contract surface |

### Relationships:

```
✅ One module = One package (common)
✅ One module = Multiple packages (complex)
✅ One package = Part of module (sub-package)
❌ One package ≠ Always a module
```

### Examples:

```
Module: core-types
  Package: @balloo/core-types

Module: messenger
  Packages: 
    - @balloo/messenger-api
    - @balloo/messenger-ui
    - @balloo/messenger-types
```

---

## 2. ✅ MODULE VS SERVICE

### Service — runtime форма, Module — логическая форма

| Аспект | Service | Module |
|--------|---------|--------|
| **Nature** | Runtime process | Architecture unit |
| **Deployment** | Container/VM | Logical placement |
| **Endpoints** | HTTP/RPC ports | Interface surface |
| **Scaling** | Horizontal/vertical | N/A |

### Relationships:

```
✅ One module = One service (common)
✅ One module = Multiple services (distributed)
✅ One service = Implementation of module
❌ One service ≠ Always a module
```

### Examples:

```
Module: messenger-api
  Service: messenger-api-service (Node.js)
  Endpoints: GET /messages, POST /messages

Module: admin-portal
  Services:
    - admin-frontend (React SPA)
    - admin-backend (Node.js API)
```

---

## 3. ✅ MODULE VS APP

### App — контейнер deployment, Module — архитектурная единица

| Аспект | App | Module |
|--------|-----|--------|
| **Nature** | Deployment container | Logical boundary |
| **Scope** | Deployable unit | Architecture unit |
| **Composition** | MAY contain modules | MAY be in apps |

### Relationships:

```
✅ One app = Contains multiple modules (common)
✅ One module = Deployed within app
✅ One module = Spans multiple apps (shared)
❌ One app ≠ Always a module
```

### Examples:

```
App: messenger-app
  Modules:
    - messenger-api
    - messenger-ui
    - messenger-types

App: admin-app
  Modules:
    - admin-portal
    - admin-types
    - shared-components
```

---

## 4. ✅ MODULE VS NODE

### Node — физический/виртуальный хост, Module — логическая единица

| Аспект | Node | Module |
|--------|------|--------|
| **Nature** | Infrastructure unit | Architecture unit |
| **Purpose** | Hosting, execution | Functionality |
| **Presence** | Physical/virtual machine | Logical presence |

### Relationships:

```
✅ One module = Present on multiple nodes (distributed)
✅ One node = Hosts multiple modules (common)
✅ Module presence types: execution, exposure, storage, docs-only
❌ One node ≠ One module
```

### Examples:

```
Module: messenger-api
  Node Presence:
    - work_server: execution, exposure
    - home_nas: storage (backup)
    - laptop_control: docs-only

Module: summary-docs
  Node Presence:
    - laptop_control: execution (web reader)
    - work_server: docs-only (reference)
```

---

## 5. ✅ MODULE VS DOMAIN

### Domain — бизнес-концепция, Module — реализация

| Аспект | Domain | Module |
|--------|--------|--------|
| **Nature** | Business concept | Implementation |
| **Scope** | Business boundary | Technical boundary |
| **Purpose** | Business capability | Technical solution |

### Relationships:

```
✅ One domain = Implemented by multiple modules (common)
✅ One module = Implements part of domain
✅ One module = Implements full domain (simple)
❌ One domain ≠ One module
```

### Examples:

```
Domain: Messenger
  Modules:
    - messenger-api (service)
    - messenger-ui (component)
    - messenger-types (package)
    - messenger-contracts (contract)

Domain: Administration
  Modules:
    - admin-portal (hybrid)
    - admin-types (package)
```

---

## 6. ✅ MODULE VS BRANCH

### Branch — Git организация, Module — архитектурная единица

| Аспект | Branch | Module |
|--------|--------|--------|
| **Nature** | Version control | Architecture |
| **Purpose** | Code organization | System design |
| **Lifecycle** | Merge/delete | Evolve/deprecate |

### Relationships:

```
✅ One module = Code in multiple branches (feature development)
✅ One branch = Contains multiple modules (common)
✅ Module docs track module lifecycle
❌ Branch structure ≠ Module structure
```

### Examples:

```
Module: messenger-api
  Branches:
    - main (stable)
    - feature/messenger-v2 (development)
    - bugfix/messenger-auth (fix)
```

---

## 7. ✅ MODULE VS DOCUMENT

### Document — информационная единица, Module — архитектурная единица

| Аспект | Document | Module |
|--------|----------|--------|
| **Nature** | Information artifact | Architecture unit |
| **Purpose** | Knowledge transfer | System functionality |
| **Form** | Markdown, PDF, etc. | Code + docs + contracts |

### Relationships:

```
✅ One module = Multiple documents (common)
✅ One document = Describes module
✅ Documentation module = Module type
❌ One document ≠ One module
```

### Examples:

```
Module: summary-docs
  Documents:
    - INDEX.md
    - ROOT_SUMMARY_DOCS.md
    - MODULE_INDEX.md
    - All module summaries and contracts
```

---

## 8. ✅ MODULE VS CONTRACT SET

### Contract Set — группа контрактов, Module — может включать контракты

| Аспект | Contract Set | Module |
|--------|--------------|--------|
| **Nature** | Contract collection | Architecture unit |
| **Purpose** | Specification | Implementation + spec |
| **Form** | Markdown contracts | Code + docs + contracts |

### Relationships:

```
✅ One module = Contains contract set (common)
✅ Contract module = Module type
✅ One contract set = Describes multiple modules
❌ Contract set ≠ Always a module
```

### Examples:

```
Module: node-contracts
  Contracts:
    - NodeTreeContract.md
    - NodeRolesContract.md
    - NodeDomainsContract.md
    - NodeNetworkingContract.md
    - NodeSecurityContract.md
    - NodeDeploymentContract.md
    - NodeRecoveryContract.md

Module: messenger
  Contracts:
    - messenger-api-contract.md
    - messenger-ui-contract.md
```

---

## 9. ✅ PLACEMENT MATRIX

| Module Type | Package | Service | App | Node | Domain | Branch | Document |
|-------------|---------|---------|-----|------|--------|--------|----------|
| service | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| package | ✅ | ⭕ | ⭕ | ⭕ | ⭕ | ✅ | ✅ |
| component | ✅ | ⭕ | ✅ | ⭕ | ⭕ | ✅ | ✅ |
| contract | ⭕ | ⭕ | ⭕ | ⭕ | ✅ | ✅ | ✅ |
| documentation | ⭕ | ⭕ | ⭕ | ✅ | ⭕ | ✅ | ✅ |
| data | ✅ | ⭕ | ⭕ | ✅ | ⭕ | ✅ | ✅ |
| hybrid | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| orchestration | ✅ | ✅ | ✅ | ✅ | ⭕ | ✅ | ✅ |
| integration | ✅ | ✅ | ✅ | ✅ | ⭕ | ✅ | ✅ |
| interface | ✅ | ⭕ | ⭕ | ⭕ | ✅ | ✅ | ✅ |

**Legend:** ✅ Common, ⭕ Possible but less common

---

## 10. ✅ PLACEMENT RULES

### Rule 1: Module is Logical

```
✅ Module — логическая архитектурная единица
✅ Package/Service/App/Node — формы существования или контейнеры
✅ Один модуль может иметь несколько форм
```

### Rule 2: Module Boundaries Transcend Implementation

```
✅ Module boundary — contract boundary
✅ Package boundary — export boundary
✅ Service boundary — runtime boundary
✅ Module может span multiple packages/services
```

### Rule 3: Module Identity is Stable

```
✅ Module identity стабильна через изменения реализации
✅ Package name может измениться
✅ Service deployment может измениться
✅ Module identity сохраняется
```

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Module vs package определено
2. ✅ Module vs service определено
3. ✅ Module vs app определено
4. ✅ Module vs node определено
5. ✅ Module vs domain определено
6. ✅ Module vs branch определено
7. ✅ Module vs document определено
8. ✅ Module vs contract set определено
9. ✅ Placement matrix создан
10. ✅ Placement rules зафиксированы

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
