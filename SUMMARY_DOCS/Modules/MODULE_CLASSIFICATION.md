---
title: Module Classification
description: Classification of Balloo modules by type, area, status, and relevance
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - modules
  - classification
  - taxonomy
  - reference
related_docs:
  - SUMMARY_DOCS/modules/MODULE_INDEX.md
  - SUMMARY_DOCS/modules/MODULE_MANIFEST.json
  - SUMMARY_DOCS/contracts/modules/ModuleTypesContract.md
---

# 📊 MODULE CLASSIFICATION

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ классифицирует модули Balloo по различным критериям.

**Primary Purpose:** Обеспечить taxonomy модулей для навигации, codegen, docgen и анализа.

---

## 1. ✅ CLASSIFICATION BY TYPE

### Package Modules (7):

| Module | Description | Codegen |
|--------|-------------|---------|
| core-types | Shared TypeScript types | HIGH |
| core-config | Configuration management | HIGH |
| core-i18n | Internationalization | HIGH |
| core-theme | Theme system | MEDIUM |
| core-brand | Brand identity | MEDIUM |
| core-ui | UI components | HIGH |
| core-docs-schema | Documentation schema | MEDIUM |

### Hybrid Modules (4):

| Module | Description | Codegen |
|--------|-------------|---------|
| messenger | Messenger app (frontend + API) | HIGH |
| admin-portal | Admin portal (frontend + API) | HIGH |
| desktop | Desktop app (Electron) | MEDIUM |
| mobile | Mobile app (React Native) | MEDIUM |

### Service Modules (1):

| Module | Description | Codegen |
|--------|-------------|---------|
| android-service | Android backend service | HIGH |

### Contract Modules (1):

| Module | Description | Codegen |
|--------|-------------|---------|
| node-system | Node system contracts | HIGH |

### Documentation Modules (1):

| Module | Description | Codegen |
|--------|-------------|---------|
| summary-docs | Central documentation hub | MEDIUM |

---

## 2. ✅ CLASSIFICATION BY PROJECT AREA

### Core Infrastructure (7):

| Module | Area | Purpose |
|--------|------|---------|
| core-types | Infrastructure | Shared types |
| core-config | Infrastructure | Configuration |
| core-i18n | Infrastructure | Internationalization |
| core-theme | Infrastructure | Theming |
| core-brand | Infrastructure | Brand identity |
| core-ui | Infrastructure | UI components |
| core-docs-schema | Infrastructure | Docs schema |

### User Applications (4):

| Module | Area | Purpose |
|--------|------|---------|
| messenger | Communication | Messaging |
| admin-portal | Management | Admin UI |
| desktop | Desktop | Desktop app |
| mobile | Mobile | Mobile app |

### Backend Services (1):

| Module | Area | Purpose |
|--------|------|---------|
| android-service | Backend | Android API |

### System (2):

| Module | Area | Purpose |
|--------|------|---------|
| node-system | Topology | Node contracts |
| summary-docs | Documentation | Central docs |

---

## 3. ✅ CLASSIFICATION BY IMPLEMENTATION STATUS

### Active (14):

All modules are currently active:

| Module | Type | Status |
|--------|------|--------|
| core-types | package | active |
| core-config | package | active |
| core-i18n | package | active |
| core-theme | package | active |
| core-brand | package | active |
| core-ui | package | active |
| core-docs-schema | package | active |
| messenger | hybrid | active |
| admin-portal | hybrid | active |
| desktop | hybrid | active |
| mobile | hybrid | active |
| android-service | service | active |
| node-system | contract | active |
| summary-docs | documentation | active |

### Inferred (0):

No inferred modules — all have strong evidence.

### Planned (0):

No planned modules in current discovery.

### Deprecated (0):

No deprecated modules.

---

## 4. ✅ CLASSIFICATION BY AUTHORITY TYPE

### Code Authority (8):

Source of truth is code:

| Module | Type | Authority |
|--------|------|-----------|
| core-types | package | code |
| core-config | package | code |
| core-i18n | package | code |
| core-theme | package | code |
| core-brand | package | code |
| core-ui | package | code |
| core-docs-schema | package | code |
| android-service | service | code |

### Contract Authority (1):

Source of truth is contract:

| Module | Type | Authority |
|--------|------|-----------|
| node-system | contract | contract |

### Docs Authority (1):

Source of truth is documentation:

| Module | Type | Authority |
|--------|------|-----------|
| summary-docs | documentation | docs |

### Hybrid Authority (4):

Source of truth is combination:

| Module | Type | Authority |
|--------|------|-----------|
| messenger | hybrid | hybrid |
| admin-portal | hybrid | hybrid |
| desktop | hybrid | hybrid |
| mobile | hybrid | hybrid |

---

## 5. ✅ CLASSIFICATION BY CODEGEN RELEVANCE

### HIGH Relevance (11):

Used extensively for code generation:

| Module | Type | Reason |
|--------|------|--------|
| core-types | package | Type generation |
| core-config | package | Config generation |
| core-i18n | package | i18n generation |
| core-ui | package | Component generation |
| messenger | hybrid | Full app scaffolding |
| admin-portal | hybrid | Full app scaffolding |
| android-service | service | Service generation |
| node-system | contract | Contract-based codegen |
| desktop | hybrid | App scaffolding |
| mobile | hybrid | App scaffolding |
| core-brand | package | Brand generation |

### MEDIUM Relevance (3):

Used for specific code generation:

| Module | Type | Reason |
|--------|------|--------|
| core-theme | package | Theme generation |
| core-docs-schema | package | Schema generation |
| summary-docs | documentation | Site generation |

### LOW Relevance (0):

Not used for code generation.

---

## 6. ✅ CLASSIFICATION BY DOCGEN RELEVANCE

### HIGH Relevance (14):

All modules have docgen relevance:

| Module | Type | Docgen Purpose |
|--------|------|----------------|
| core-types | package | API docs |
| core-config | package | API docs |
| core-i18n | package | API docs |
| core-theme | package | API docs |
| core-brand | package | Brand docs |
| core-ui | package | Component docs |
| core-docs-schema | package | Schema docs |
| messenger | hybrid | App docs |
| admin-portal | hybrid | App docs |
| desktop | hybrid | App docs |
| mobile | hybrid | App docs |
| android-service | service | API docs |
| node-system | contract | Contract docs |
| summary-docs | documentation | Site docs |

---

## 7. ✅ CLASSIFICATION BY NODE PRESENCE

### Multi-Node (10):

Present on multiple nodes:

| Module | Nodes |
|--------|-------|
| core-types | laptop_control, work_server |
| core-config | laptop_control, work_server |
| core-i18n | laptop_control, work_server |
| core-theme | laptop_control, work_server |
| core-brand | laptop_control, work_server |
| core-ui | laptop_control, work_server |
| core-docs-schema | laptop_control, work_server |
| messenger | work_server, laptop_control |
| admin-portal | work_server, laptop_control |
| summary-docs | laptop_control, work_server |

### Single-Node (4):

Present on single node:

| Module | Node |
|--------|------|
| desktop | laptop_control |
| mobile | laptop_control |
| android-service | work_server |
| node-system | laptop_control, work_server, home_aio, home_nas |

---

## 8. ✅ CLASSIFICATION BY DOMAIN EXPOSURE

### Public Domain (3):

Exposed via public domains:

| Module | Domain | Type |
|--------|--------|------|
| messenger | messenger.balloo.su | subdomain |
| admin-portal | admin.balloo.su | subdomain |
| android-service | api.balloo.su | subdomain |

### Internal Only (10):

No public domain exposure:

| Module | Exposure |
|--------|----------|
| core-types | none (package) |
| core-config | none (package) |
| core-i18n | none (package) |
| core-theme | none (package) |
| core-brand | none (package) |
| core-ui | none (package) |
| core-docs-schema | none (package) |
| desktop | none (desktop app) |
| mobile | none (mobile app) |
| node-system | none (contracts) |

### Documentation Domain (1):

| Module | Domain | Type |
|--------|--------|------|
| summary-docs | docs.balloo.su | subdomain |

---

## 9. ✅ CLASSIFICATION BY ENDPOINT COUNT

### High Endpoint Count (10+):

| Module | Endpoints |
|--------|-----------|
| admin-portal | 10 |

### Medium Endpoint Count (3-9):

| Module | Endpoints |
|--------|-----------|
| messenger | 5 |
| android-service | 3 |

### No Endpoints (0):

| Module | Reason |
|--------|--------|
| core-types | package (imports only) |
| core-config | package (imports only) |
| core-i18n | package (imports only) |
| core-theme | package (imports only) |
| core-brand | package (imports only) |
| core-ui | package (imports only) |
| core-docs-schema | package (imports only) |
| desktop | desktop app |
| mobile | mobile app |
| node-system | contracts only |
| summary-docs | web reader (1 entrypoint) |

---

## 10. ✅ TAXONOMY SUMMARY

### Full Taxonomy:

```
Balloo Modules
├── Core Infrastructure (7)
│   ├── core-types (package, code, HIGH)
│   ├── core-config (package, code, HIGH)
│   ├── core-i18n (package, code, HIGH)
│   ├── core-theme (package, code, MEDIUM)
│   ├── core-brand (package, code, MEDIUM)
│   ├── core-ui (package, code, HIGH)
│   └── core-docs-schema (package, code, MEDIUM)
├── User Applications (4)
│   ├── messenger (hybrid, hybrid, HIGH)
│   ├── admin-portal (hybrid, hybrid, HIGH)
│   ├── desktop (hybrid, hybrid, MEDIUM)
│   └── mobile (hybrid, hybrid, MEDIUM)
├── Backend Services (1)
│   └── android-service (service, code, HIGH)
└── System (2)
    ├── node-system (contract, contract, HIGH)
    └── summary-docs (documentation, docs, MEDIUM)
```

### Legend:
- **Type:** package | hybrid | service | contract | documentation
- **Authority:** code | hybrid | contract | docs
- **Codegen:** HIGH | MEDIUM | LOW

---

## ✅ ACCEPTANCE CRITERIA

Классификация считается выполненной если:

1. ✅ Classification by type provided
2. ✅ Classification by project area provided
3. ✅ Classification by implementation status provided
4. ✅ Classification by authority type provided
5. ✅ Classification by codegen relevance provided
6. ✅ Classification by docgen relevance provided
7. ✅ Classification by node presence provided
8. ✅ Classification by domain exposure provided
9. ✅ Classification by endpoint count provided
10. ✅ Taxonomy summary provided

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
