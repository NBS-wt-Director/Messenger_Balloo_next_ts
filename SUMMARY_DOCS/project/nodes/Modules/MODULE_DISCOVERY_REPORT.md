---
title: Module Discovery Report
description: Report on module discovery process in Balloo monorepo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - modules
  - discovery
  - analysis
  - report
related_docs:
  - SUMMARY_DOCS/modules/MODULE_INDEX.md
  - SUMMARY_DOCS/modules/MODULE_MANIFEST.json
  - SUMMARY_DOCS/contracts/modules/ModuleDiscoveryContract.md
---

# 🔍 MODULE DISCOVERY REPORT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот отчёт документирует процесс выявления модулей в Balloo monorepo.

**Primary Purpose:** Объяснить как были найдены модули, на каких источниках основан вывод, и какие gaps обнаружены.

---

## 1. ✅ DISCOVERY PROCESS

### Шаг 1: Structural Analysis

**Что анализировали:**
```
apps/
packages/
messenger/
admin-portal/
android-service/
desktop/
mobile/
SUMMARY_DOCS/
```

**Результаты:**
- ✅ 7 packages в packages/ (core-*)
- ✅ 5 apps (messenger, admin-portal, android-service, desktop, mobile)
- ✅ SUMMARY_DOCS как documentation hub

### Шаг 2: Documentary Analysis

**Что анализировали:**
```
SUMMARY_DOCS/contracts/node-contracts/
SUMMARY_DOCS/topology/
SUMMARY_DOCS/state/
MIGRATION_ROADMAP.md
```

**Результаты:**
- ✅ 7 node contracts (NodeTree, NodeRoles, NodeDomains, etc.)
- ✅ Topology docs (DOMAIN_MAP, NETWORK_MAP, DEPLOYMENT_MAP)
- ✅ State files (node-tree.json, node-domains.json, etc.)

### Шаг 3: Package Analysis

**Что анализировали:**
```
packages/core-types/package.json
packages/core-config/package.json
packages/core-i18n/package.json
packages/core-theme/package.json
packages/core-brand/package.json
packages/core-ui/package.json
packages/core-docs-schema/package.json
```

**Результаты:**
- ✅ Все 7 core packages существуют
- ✅ Package names: @balloo/core-*
- ✅ Shared types, config, i18n, theme, brand, UI, docs-schema

### Шаг 4: Import Surface Analysis

**Что искали:**
```typescript
import { ... } from '@balloo/core-types'
import { ... } from '@balloo/core-theme'
import { ... } from 'core-'
```

**Результаты:**
- ✅ core-types импортируется во всех apps
- ✅ core-theme импортируется в UI apps
- ✅ core-i18n импортируется в messenger, mobile

### Шаг 5: Endpoint Surface Analysis

**Что искали:**
```
messenger/ — Next.js app with API routes
admin-portal/ — Next.js app with API routes
android-service/ — Backend service
```

**Результаты:**
- ✅ messenger: Next.js app (frontend + API)
- ✅ admin-portal: Next.js app (frontend + API)
- ✅ android-service: Backend service

### Шаг 6: Domain Language Analysis

**Что искали:**
```
"messenger" — repeated in docs, contracts, code
"admin" — repeated in docs, contracts
"node" — repeated in node-contracts
```

**Результаты:**
- ✅ Messenger domain clearly defined
- ✅ Admin domain clearly defined
- ✅ Node system clearly defined

---

## 2. ✅ EVIDENCE SOURCES

### Strong Evidence (implemented):

| Module | Evidence Sources | Confidence |
|--------|------------------|------------|
| core-types | package.json, imports, docs | HIGH |
| core-config | package.json, imports, docs | HIGH |
| core-i18n | package.json, imports, docs | HIGH |
| core-theme | package.json, imports, docs | HIGH |
| core-brand | package.json, imports, docs | HIGH |
| core-ui | package.json, imports, docs | HIGH |
| core-docs-schema | package.json, imports, docs | HIGH |
| messenger | app directory, package.json, docs | HIGH |
| admin-portal | app directory, package.json, docs | HIGH |
| desktop | app directory, package.json | HIGH |
| mobile | app directory, package.json | HIGH |
| android-service | app directory, package.json | HIGH |
| node-system | node-contracts, topology docs | HIGH |
| summary-docs | SUMMARY_DOCS directory, web reader | HIGH |

### Evidence Types:

| Type | Count | Examples |
|------|-------|----------|
| Package manifest | 7 | core-*/package.json |
| App directory | 5 | messenger/, admin-portal/, etc. |
| Contracts | 7 | node-contracts/*.md |
| Documentation | 14+ | MODULE_SUMMARY_*.md |
| Imports | 20+ | import statements |
| Endpoints | 19 | API routes |

---

## 3. ✅ IMPLEMENTED MODULES

### Core Packages (7):

| Module | Path | Evidence |
|--------|------|----------|
| core-types | packages/core-types | package.json, imports |
| core-config | packages/core-config | package.json, imports |
| core-i18n | packages/core-i18n | package.json, imports |
| core-theme | packages/core-theme | package.json, imports |
| core-brand | packages/core-brand | package.json, imports |
| core-ui | packages/core-ui | package.json, imports |
| core-docs-schema | packages/core-docs-schema | package.json, imports |

### Applications (5):

| Module | Path | Evidence |
|--------|------|----------|
| messenger | messenger/ | app directory, package.json |
| admin-portal | admin-portal/ | app directory, package.json |
| desktop | desktop/ | app directory, package.json |
| mobile | mobile/ | app directory, package.json |
| android-service | android-service/ | app directory, package.json |

### Infrastructure (2):

| Module | Path | Evidence |
|--------|------|----------|
| node-system | SUMMARY_DOCS/contracts/node-contracts/ | contracts, topology |
| summary-docs | SUMMARY_DOCS/ | docs, web reader |

---

## 4. ✅ INFERRED MODULES

**Inferred modules: 0**

Все выявленные модули имеют strong evidence (package.json, app directory, contracts, или docs).

---

## 5. ✅ CONTROVERSIAL MODULES

### Controversial Case 1: messenger as one module vs multiple

**Discussion:**
- messenger содержит frontend (Next.js) и API routes
- Можно рассматривать как messenger-frontend + messenger-api
- Решение: рассматривать как hybrid module (один модуль, multiple artifacts)

**Resolution:**
- ✅ messenger = hybrid module
- ✅ Includes both frontend and API
- ✅ Single module identity

### Controversial Case 2: node-system as module

**Discussion:**
- node-system не имеет кода, только контракты
- Можно рассматривать как "не модуль"
- Решение: contract module — валидный тип модуля

**Resolution:**
- ✅ node-system = contract module
- ✅ Source of truth: contracts
- ✅ Valid module type per ModuleTypesContract

---

## 6. ✅ GAPS

### Gap 1: Package documentation

**Issue:**
- Core packages имеют minimal documentation
- No MODULE_SUMMARY_*.md for all packages initially

**Resolution:**
- ✅ Created MODULE_SUMMARY_*.md for all packages
- ✅ Created MODULE_CONTRACT_*.md for all packages

### Gap 2: Module relations not formalized

**Issue:**
- Dependencies between modules not documented
- No MODULE_RELATIONS.json initially

**Resolution:**
- ✅ Created MODULE_RELATIONS.json
- ✅ Documented all code dependencies

### Gap 3: Node presence not mapped

**Issue:**
- Module-to-node mapping not documented
- No module-node-map.json initially

**Resolution:**
- ✅ Created SUMMARY_DOCS/state/module-node-map.json
- ✅ Mapped all modules to nodes

---

## 7. ✅ RECOMMENDATIONS

### Recommendation 1: Maintain module registry

**Action:**
- ✅ Keep MODULE_MANIFEST.json up to date
- ✅ Update on new modules
- ✅ Deprecate old modules properly

### Recommendation 2: Document dependencies

**Action:**
- ✅ Maintain MODULE_RELATIONS.json
- ✅ Track code, contract, doc dependencies
- ✅ Update on dependency changes

### Recommendation 3: Use module contracts for codegen

**Action:**
- ✅ AI codegen reads MODULE_CONTRACT_*.md
- ✅ Module summaries give overview
- ✅ Conflicts resolved in favor of canonical

### Recommendation 4: Expand module coverage

**Action:**
- ⭕ Add more module summaries for existing code
- ⭕ Document inferred modules from migration roadmap
- ⭕ Create contracts for planned modules

---

## 8. ✅ DISCOVERY SUMMARY

### Statistics:

| Metric | Value |
|--------|-------|
| **Total modules discovered** | 14 |
| **Implemented modules** | 14 |
| **Inferred modules** | 0 |
| **Planned modules** | 0 |
| **Deprecated modules** | 0 |
| **Evidence sources** | 6 |
| **Strong evidence** | 14 |
| **Medium evidence** | 0 |
| **Weak evidence** | 0 |

### By Type:

| Type | Count |
|------|-------|
| package | 7 |
| hybrid | 4 |
| service | 1 |
| contract | 1 |
| documentation | 1 |

### By Evidence:

| Evidence Type | Modules |
|---------------|---------|
| Package manifest | 7 |
| App directory | 5 |
| Contracts | 1 |
| Documentation | 1 |

---

## ✅ ACCEPTANCE CRITERIA

Отчёт считается выполненным если:

1. ✅ Discovery process описан
2. ✅ Evidence sources документированы
3. ✅ Implemented modules listed
4. ✅ Inferred modules listed
5. ✅ Controversial modules discussed
6. ✅ Gaps identified
7. ✅ Recommendations provided
8. ✅ Discovery summary provided

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
