---
title: Module Types Contract
description: Classification of module types in Balloo monorepo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - module
  - types
  - classification
  - contract
related_docs:
  - SUMMARY_DOCS/contracts/modules/ModuleContract.md
  - SUMMARY_DOCS/modules/MODULE_INDEX.md
---

# 🧩 MODULE TYPES CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот контракт определяет типы модулей в системе Balloo.

**Primary Purpose:** Классифицировать модули по типу для правильного понимания их назначения, артефактов и использования в codegen/docgen.

---

## 1. ✅ SERVICE MODULE

### Определение:
Модуль, который предоставляет runtime сервис с endpoints.

### Purpose:
- Исполнение бизнес-логики
- Обработка запросов
- Управление данными

### Required Artifacts:
- ✅ Code (service implementation)
- ✅ API specification (OpenAPI/gRPC)
- ✅ Deployment configuration
- ✅ Health checks

### Optional Artifacts:
- ⭕ Database schema
- ⭕ Monitoring dashboards
- ⭕ Runbooks

### Runtime Expectation:
- ✅ Always-on or on-demand service
- ✅ Listens on port(s)
- ✅ Has health endpoint

### Endpoint Expectation:
- ✅ HTTP/HTTPS endpoints
- ✅ MAY have gRPC endpoints
- ✅ MAY have WebSocket endpoints

### Doc Expectation:
- ✅ API documentation
- ✅ Deployment guide
- ✅ Operations manual

### Node Expectation:
- ✅ execution presence on at least one node
- ✅ MAY have replica on other nodes

### Codegen Relevance:
- ✅ HIGH — service code generation
- ✅ API client generation
- ✅ Deployment scripts

### Examples:
- `messenger-api` — Messenger backend service
- `admin-portal-api` — Admin portal backend

---

## 2. ✅ PACKAGE MODULE

### Определение:
Модуль, который предоставляет библиотеку для импорта.

### Purpose:
- Переиспользуемая функциональность
- Общие утилиты
- Shared types и interfaces

### Required Artifacts:
- ✅ Code (library implementation)
- ✅ Package manifest (package.json)
- ✅ Public API exports
- ✅ Type definitions

### Optional Artifacts:
- ⭕ Examples
- ⭕ Usage guides
- ⭕ Migration guides

### Runtime Expectation:
- ⭕ No independent runtime
- ✅ Imported by other modules

### Endpoint Expectation:
- ✅ Import/export surface
- ⭕ No HTTP/RPC endpoints

### Doc Expectation:
- ✅ API documentation
- ✅ Usage examples
- ✅ Installation guide

### Node Expectation:
- ✅ Present where imported
- ⭕ No dedicated node

### Codegen Relevance:
- ✅ HIGH — package scaffolding
- ✅ Type generation
- ✅ API documentation

### Examples:
- `core-types` — Shared TypeScript types
- `core-config` — Configuration management
- `core-i18n` — Internationalization
- `core-theme` — Theme system

---

## 3. ✅ COMPONENT MODULE

### Определение:
Модуль, который предоставляет UI компоненты.

### Purpose:
- Переиспользуемые UI элементы
- Интерфейсные паттерны
- Стилевые системы

### Required Artifacts:
- ✅ Component code (React/Vue/etc.)
- ✅ Styles (CSS/SCSS)
- ✅ Props definition
- ✅ Storybook/examples

### Optional Artifacts:
- ⭕ Tests
- ⭕ Accessibility docs
- ⭕ Design tokens

### Runtime Expectation:
- ⭕ No independent runtime
- ✅ Rendered in browser

### Endpoint Expectation:
- ✅ Import/export surface
- ✅ UI entrypoints (routes)

### Doc Expectation:
- ✅ Component documentation
- ✅ Usage examples
- ✅ Design guidelines

### Node Expectation:
- ✅ Deployed with frontend apps
- ⭕ No dedicated node

### Codegen Relevance:
- ✅ MEDIUM — component generation
- ✅ Style generation
- ✅ Storybook generation

### Examples:
- `messenger-ui-chat` — Chat UI components
- `admin-ui-tables` — Admin table components

---

## 4. ✅ CONTRACT MODULE

### Определение:
Модуль, который определяет контракты и спецификации.

### Purpose:
- Формализация интерфейсов
- Определение правил
- Specification source of truth

### Required Artifacts:
- ✅ Contract definitions (Markdown/JSON)
- ✅ Interface specifications
- ✅ Validation rules

### Optional Artifacts:
- ⭕ Examples
- ⭕ Migration guides
- ⭕ Compliance checks

### Runtime Expectation:
- ⭕ No runtime
- ✅ Referenced by other modules

### Endpoint Expectation:
- ✅ Documentation entrypoints
- ⭕ No HTTP/RPC endpoints

### Doc Expectation:
- ✅ Contract documentation
- ✅ Usage guidelines
- ✅ Compliance rules

### Node Expectation:
- ✅ docs-only presence
- ✅ Referenced from multiple nodes

### Codegen Relevance:
- ✅ HIGH — contract-based codegen
- ✅ Validation generation
- ✅ Type generation

### Examples:
- `node-contracts` — Node system contracts
- `domain-contracts` — Domain rules
- `api-contracts` — API specifications

---

## 5. ✅ DOCUMENTATION MODULE

### Определение:
Модуль, который предоставляет документацию.

### Purpose:
- Documentation source of truth
- Knowledge base
- User guides

### Required Artifacts:
- ✅ Documentation files (Markdown)
- ✅ Navigation structure
- ✅ Search index

### Optional Artifacts:
- ⭕ Examples
- ⭕ Tutorials
- ⭕ Videos

### Runtime Expectation:
- ⭕ No runtime (docs-only)
- ✅ MAY have web reader

### Endpoint Expectation:
- ✅ Documentation entrypoints
- ✅ Web reader routes

### Doc Expectation:
- ✅ Self-documenting
- ✅ Navigation guide
- ✅ Search functionality

### Node Expectation:
- ✅ docs-only presence
- ✅ Web reader deployment

### Codegen Relevance:
- ✅ MEDIUM — doc generation
- ✅ Site generation
- ✅ Search index generation

### Examples:
- `summary-docs` — SUMMARY_DOCS documentation hub
- `api-docs` — API documentation
- `user-guides` — User documentation

---

## 6. ✅ DATA MODULE

### Определение:
Модуль, который предоставляет данные или конфигурации.

### Purpose:
- Data source of truth
- Configuration management
- Reference data

### Required Artifacts:
- ✅ Data files (JSON/YAML/etc.)
- ✅ Schema definition
- ✅ Validation rules

### Optional Artifacts:
- ⭕ Migration scripts
- ⭕ Backup procedures
- ⭕ Sync mechanisms

### Runtime Expectation:
- ⭕ No independent runtime
- ✅ Loaded by other modules

### Endpoint Expectation:
- ✅ Import/export surface
- ⭕ MAY have API for data access

### Doc Expectation:
- ✅ Data dictionary
- ✅ Schema documentation
- ✅ Usage examples

### Node Expectation:
- ✅ storage presence
- ✅ MAY have replica

### Codegen Relevance:
- ✅ MEDIUM — config generation
- ✅ Schema validation
- ✅ Data migration

### Examples:
- `node-state` — Node configuration state
- `domain-mappings` — Domain configuration
- `i18n-data` — Translation data

---

## 7. ✅ HYBRID MODULE

### Определение:
Модуль, который комбинирует несколько типов.

### Purpose:
- Multi-faceted functionality
- Complex system boundaries
- Integrated solutions

### Required Artifacts:
- ✅ Code (multiple types)
- ✅ Contracts
- ✅ Documentation
- ✅ Configuration

### Optional Artifacts:
- ⭕ Tests
- ⭕ Examples
- ⭕ Migration guides

### Runtime Expectation:
- ✅ MAY have runtime
- ✅ MAY have multiple components

### Endpoint Expectation:
- ✅ Multiple endpoint types
- ✅ Mixed surfaces

### Doc Expectation:
- ✅ Comprehensive documentation
- ✅ Multiple entrypoints

### Node Expectation:
- ✅ Multiple node presence
- ✅ Mixed presence types

### Codegen Relevance:
- ✅ HIGH — multi-target generation
- ✅ Complex scaffolding

### Examples:
- `messenger` — Full messenger system (service + UI + contracts)
- `admin-portal` — Admin system (frontend + backend + docs)

---

## 8. ✅ ORCHESTRATION MODULE

### Определение:
Модуль, который управляет другими модулями.

### Purpose:
- Coordination
- Deployment orchestration
- Workflow management

### Required Artifacts:
- ✅ Orchestration scripts
- ✅ Workflow definitions
- ✅ Configuration

### Optional Artifacts:
- ⭕ Monitoring
- ⭕ Alerting rules
- ⭕ Runbooks

### Runtime Expectation:
- ✅ MAY have runtime
- ✅ Coordinates other modules

### Endpoint Expectation:
- ✅ Control endpoints
- ✅ MAY have API

### Doc Expectation:
- ✅ Orchestration guide
- ✅ Workflow documentation
- ✅ Recovery procedures

### Node Expectation:
- ✅ control-only presence
- ✅ MAY have execution presence

### Codegen Relevance:
- ✅ MEDIUM — workflow generation
- ✅ Deployment scripts

### Examples:
- `deployment-orchestration` — Deployment coordination
- `migration-manager` — Migration orchestration

---

## 9. ✅ INTEGRATION MODULE

### Определение:
Модуль, который обеспечивает интеграции с внешними системами.

### Purpose:
- External system connectivity
- Adapter patterns
- API bridging

### Required Artifacts:
- ✅ Integration code
- ✅ API adapters
- ✅ Configuration

### Optional Artifacts:
- ⭕ Testing mocks
- ⭕ Fallback mechanisms
- ⭕ Rate limiting

### Runtime Expectation:
- ✅ MAY have runtime
- ✅ Connects to external systems

### Endpoint Expectation:
- ✅ External API endpoints
- ✅ Internal adaptation layer

### Doc Expectation:
- ✅ Integration guide
- ✅ API mapping
- ✅ Troubleshooting

### Node Expectation:
- ✅ execution presence
- ✅ Network access required

### Codegen Relevance:
- ✅ MEDIUM — adapter generation
- ✅ API client generation

### Examples:
- `tailscale-integration` — Tailscale connectivity
- `github-integration` — GitHub API integration

---

## 10. ✅ INTERFACE MODULE

### Определение:
Модуль, который определяет интерфейсы между другими модулями.

### Purpose:
- Interface definition
- Protocol specification
- Communication contracts

### Required Artifacts:
- ✅ Interface definitions
- ✅ Protocol specs
- ✅ Type definitions

### Optional Artifacts:
- ⭕ Reference implementation
- ⭕ Testing tools
- ⭕ Examples

### Runtime Expectation:
- ⭕ No runtime (interface-only)
- ✅ Implemented by other modules

### Endpoint Expectation:
- ✅ Interface surface
- ⭕ No direct endpoints

### Doc Expectation:
- ✅ Interface documentation
- ✅ Implementation guide
- ✅ Examples

### Node Expectation:
- ✅ docs-only presence
- ✅ Referenced by implementing modules

### Codegen Relevance:
- ✅ HIGH — interface generation
- ✅ Type generation
- ✅ Stub generation

### Examples:
- `node-interfaces` — Node communication interfaces
- `service-interfaces` — Inter-service contracts

---

## 📊 TYPE COMPARISON

| Type | Runtime | Endpoints | Code | Contracts | Docs | Codegen |
|------|---------|-----------|------|-----------|------|---------|
| service | ✅ | ✅ HTTP/RPC | ✅ | ✅ | ✅ | HIGH |
| package | ⭕ | ⭕ Import | ✅ | ⭕ | ✅ | HIGH |
| component | ⭕ | ⭕ UI | ✅ | ⭕ | ✅ | MEDIUM |
| contract | ⭕ | ⭕ Docs | ⭕ | ✅ | ✅ | HIGH |
| documentation | ⭕ | ⭕ Docs | ⭕ | ⭕ | ✅ | MEDIUM |
| data | ⭕ | ⭕ Import | ⭕ | ✅ | ✅ | MEDIUM |
| hybrid | ✅ | ✅ Mixed | ✅ | ✅ | ✅ | HIGH |
| orchestration | ⭕ | ✅ Control | ✅ | ✅ | ✅ | MEDIUM |
| integration | ✅ | ✅ External | ✅ | ✅ | ✅ | MEDIUM |
| interface | ⭕ | ⭕ Interface | ⭕ | ✅ | ✅ | HIGH |

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Все 10 типов модулей определены
2. ✅ Для каждого типа указан purpose
3. ✅ Required artifacts определены
4. ✅ Optional artifacts определены
5. ✅ Runtime expectation указан
6. ✅ Endpoint expectation указан
7. ✅ Doc expectation указан
8. ✅ Node expectation указан
9. ✅ Codegen relevance указан
10. ✅ Examples предоставлены

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
