---
title: Module Discovery Contract
description: Rules and methods for discovering modules in Balloo monorepo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - module
  - discovery
  - analysis
  - contract
related_docs:
  - SUMMARY_DOCS/contracts/modules/ModuleContract.md
  - SUMMARY_DOCS/contracts/modules/ModuleTypesContract.md
  - SUMMARY_DOCS/modules/MODULE_DISCOVERY_REPORT.md
---

# 🔍 MODULE DISCOVERY CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот контракт определяет правила и методы выявления модулей в Balloo monorepo.

**Primary Purpose:** Обеспечить консистентный подход к discovery модулей на основе evidence из существующей документации и структуры репозитория.

---

## 1. ✅ DISCOVERY SOURCES

### Источники для выявления модулей:

| Источник | Описание | Evidence Type |
|----------|----------|---------------|
| **repo structure** | apps/*, packages/* | Structural |
| **SUMMARY_DOCS** | contracts, topology, state | Documentary |
| **migration docs** | MIGRATION_ROADMAP.md, phases | Planning |
| **contracts** | Node contracts, domain contracts | Contractual |
| **topology docs** | NETWORK_MAP, DEPLOYMENT_MAP | Architectural |
| **state docs** | node-tree.json, node-services.json | Configuration |
| **package manifests** | package.json files | Implementation |
| **import surfaces** | Import/export patterns | Code Analysis |
| **endpoint surfaces** | API routes, services | Runtime |
| **domain language** | Repeated terminology | Linguistic |
| **existing packages** | core-*, shared/* | Implementation |

---

## 2. ✅ DISCOVERY RULES

### Правило 1: Package ≠ Module (но часто указывает)

```
✅ Package может быть модулем
❌ Не каждый пакет — модуль
✅ Ищи package clusters
✅ Ищи shared packages
```

### Правило 2: App ≠ Module (app может содержать много модулей)

```
✅ App может содержать несколько modules
❌ App не автоматически module
✅ Ищи app boundaries внутри приложений
✅ Ищи service boundaries
```

### Правило 3: Docs-only areas могут быть модулями

```
✅ SUMMARY_DOCS — documentation module
✅ Contracts — contract modules
✅ Топология — topology module
```

### Правило 4: Contract clusters могут быть модулями

```
✅ Node contracts cluster — module
✅ Domain contracts cluster — module
✅ API contracts cluster — module
```

### Правило 5: Shared UI или domain logic — отдельные модули

```
✅ Shared components — component module
✅ Shared types — package module
✅ Shared config — data module
```

### Правило 6: Inferred modules MUST быть явно маркированы

```
✅ inferred: true в MODULE_MANIFEST.json
✅ "Inferred" в status notes
✅ Evidence source указан
```

### Правило 7: No hallucinated implementation details

```
❌ Не придумывай runtime там, где только docs
❌ Не придумывай endpoints без evidence
❌ Не придумывай зависимости без evidence
```

### Правило 8: Inferred module allowed только с evidence

```
✅ Supported by existing docs
✅ Supported by code structure
✅ Supported by contracts
❌ Pure speculation not allowed
```

---

## 3. ✅ DISCOVERY PROCESS

### Шаг 1: Structural Analysis

```bash
# Analyze repo structure
ls -la apps/
ls -la packages/
ls -la SUMMARY_DOCS/
```

**Что ищем:**
- ✅ App directories
- ✅ Package directories
- ✅ Documentation directories
- ✅ Contract directories

### Шаг 2: Documentary Analysis

```bash
# Read existing documentation
cat SUMMARY_DOCS/contracts/node-contracts/*.md
cat SUMMARY_DOCS/topology/*.md
cat SUMMARY_DOCS/state/*.json
```

**Что ищем:**
- ✅ Module mentions
- ✅ Service descriptions
- ✅ Package references
- ✅ Deployment targets

### Шаг 3: Package Analysis

```bash
# Analyze package.json files
find . -name "package.json" -exec cat {} \;
```

**Что ищем:**
- ✅ Package names
- ✅ Dependencies
- ✅ Entry points
- ✅ Descriptions

### Шаг 4: Import Surface Analysis

```bash
# Find import patterns
grep -r "from '@balloo" --include="*.ts" --include="*.tsx"
grep -r "from 'core-" --include="*.ts" --include="*.tsx"
```

**Что ищем:**
- ✅ Shared package imports
- ✅ Cross-app imports
- ✅ Module boundaries

### Шаг 5: Endpoint Surface Analysis

```bash
# Find API endpoints
grep -r "app.get\|app.post\|router.get" --include="*.ts"
grep -r "http://\|https://" --include="*.md"
```

**Что ищем:**
- ✅ HTTP endpoints
- ✅ Service URLs
- ✅ API routes

### Шаг 6: Domain Language Analysis

```bash
# Find repeated terminology
grep -r "messenger" --include="*.md" | head -20
grep -r "admin.*portal" --include="*.md" | head -20
```

**Что ищем:**
- ✅ Repeated domain terms
- ✅ Service names
- ✅ Feature areas

---

## 4. ✅ EVIDENCE CLASSIFICATION

### Strong Evidence (implemented modules):

| Evidence Type | Confidence | Action |
|---------------|------------|--------|
| Code + package.json | HIGH | Mark as `active` |
| Service deployment | HIGH | Mark as `active` |
| API endpoints | HIGH | Mark as `active` |
| Contracts + code | HIGH | Mark as `active` |

### Medium Evidence (inferred modules):

| Evidence Type | Confidence | Action |
|---------------|------------|--------|
| Docs only | MEDIUM | Mark as `inferred` |
| Package name only | MEDIUM | Mark as `inferred` |
| Contract cluster | MEDIUM | Mark as `inferred` |
| Migration plan | MEDIUM | Mark as `planned` |

### Weak Evidence (requires validation):

| Evidence Type | Confidence | Action |
|---------------|------------|--------|
| Single mention | LOW | Validate or discard |
| Speculative | LOW | Validate or discard |
| Outdated | LOW | Validate or discard |

---

## 5. ✅ MODULE VALIDATION

### Validation Checklist:

- [ ] **Identity** — moduleId, moduleName, moduleType определены
- [ ] **Purpose** — problem solved описан
- [ ] **Boundary** — scope и out of scope ясны
- [ ] **Artifacts** — code/docs/contracts identified
- [ ] **Interfaces** — public surface defined
- [ ] **Dependencies** — upstream/downstream identified
- [ ] **Evidence** — source of discovery documented
- [ ] **Status** — active/inferred/planned marked
- [ ] **Authority** — source of truth defined

### Validation Rules:

```
✅ Minimum 2 evidence sources for inferred modules
✅ Minimum 1 strong evidence for active modules
✅ All inferred modules explicitly marked
✅ No implementation details without evidence
```

---

## 6. ✅ DISCOVERY OUTPUT

### MODULE_DISCOVERY_REPORT.md должен содержать:

1. **Discovery Process** — как были найдены модули
2. **Evidence Sources** — на каких источниках основан вывод
3. **Implemented Modules** — фактические модули
4. **Inferred Modules** — предполагаемые модули
5. **Controversial Modules** — спорные случаи
6. **Gaps** — обнаруженные пробелы
7. **Recommendations** — рекомендации по дальнейшей работе

### MODULE_MANIFEST.json должен содержать:

```json
{
  "modules": [
    {
      "moduleId": "core-types",
      "moduleName": "Core Types",
      "moduleType": "package",
      "status": "active",
      "inferred": false,
      "evidence": ["package.json", "imports", "docs"]
    }
  ]
}
```

---

## 7. ✅ DISCOVERY ANTI-PATTERNS

### ❌ Anti-Pattern 1: Package = Module

```
НЕПРАВИЛЬНО:
- Нашли пакет → объявили модулем

ПРАВИЛЬНО:
- Нашли пакет → проверили evidence → классифицировали
```

### ❌ Anti-Pattern 2: App = Module

```
НЕПРАВИЛЬНО:
- Нашли app directory → объявили модулем

ПРАВИЛЬНО:
- Нашли app → нашли boundaries внутри → выявили modules
```

### ❌ Anti-Pattern 3: Hallucinated Details

```
НЕПРАВИЛЬНО:
- Придумали endpoints без evidence
- Придумали зависимости без evidence

ПРАВИЛЬНО:
- Только подтверждённые evidence детали
- Inferred modules явно маркированы
```

### ❌ Anti-Pattern 4: Ignoring Docs-Only

```
НЕПРАВИЛЬНО:
- Игнорируем docs-only areas как "не модули"

ПРАВИЛЬНО:
- Documentation module — валидный тип
- Contract module — валидный тип
```

---

## 8. ✅ DISCOVERY WORKFLOW

```
1. Structural Analysis
   ↓
2. Documentary Analysis
   ↓
3. Package Analysis
   ↓
4. Import Surface Analysis
   ↓
5. Endpoint Surface Analysis
   ↓
6. Domain Language Analysis
   ↓
7. Evidence Classification
   ↓
8. Module Validation
   ↓
9. MODULE_DISCOVERY_REPORT.md
   ↓
10. MODULE_MANIFEST.json
```

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Discovery sources определены
2. ✅ Discovery rules зафиксированы
3. ✅ Discovery process описан
4. ✅ Evidence classification установлена
5. ✅ Module validation определён
6. ✅ Discovery output специфицирован
7. ✅ Anti-patterns документированы
8. ✅ Discovery workflow описан

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
