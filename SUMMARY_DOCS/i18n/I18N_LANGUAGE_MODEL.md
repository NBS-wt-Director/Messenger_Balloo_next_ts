---
title: I18N Language Model
description: Модель языков Balloo — структура, метаданные, жизненный цикл
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - language-model
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-languages.json
  - SUMMARY_DOCS/contracts/i18n/I18nLanguageContract.md
---

# 🌐 I18N LANGUAGE MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **структуру языка, метаданные и жизненный цикл** в i18n-системе Balloo.

**Цель:** Обеспечить машиночитаемое описание языка для codegen, docgen и runtime.

---

## 📊 LANGUAGE STRUCTURE

### Core Fields

```typescript
interface Language {
  // Identity
  languageId: string;           // e.g., "ru", "en", "tt"
  canonicalName: string;        // e.g., "Russian", "English"
  displayName: string;          // e.g., "Russian", "English"
  nativeName: string;           // e.g., "Русский", "English", "Татарча"
  
  // Standards
  iso639_1?: string;            // 2-letter code (e.g., "ru")
  iso639_2?: string;            // 3-letter code (e.g., "rus")
  iso639_3?: string;            // For languages without 2-letter code
  
  // Status
  status: LanguageStatus;       // active | partial | planned | inferred | deprecated
  priority: number;             // 1 = highest (primary)
  category: LanguageCategory;   // primary | international | regional
  
  // Region (for regional languages)
  region?: string;              // e.g., "Tatarstan", "Belarus"
  
  // Coverage
  coverage: CoverageMetrics;    // UI, system, public, technical, overall
  
  // Source
  translationSource: string;    // Path to translation file
  stringCount: number;          // Total strings
  missingStrings?: number;      // Missing strings count
  fallbackBased?: boolean;      // true if uses fallback for missing
  
  // Availability
  runtimeAvailability: boolean; // Available at runtime
  uiAvailability: boolean;      // Visible in UI selector
  managementAvailability: boolean; // Manageable from technical zone
  
  // Future-ready
  canAddWithoutCodeChanges: boolean; // true = technical zone managed
  fallbackChain: string[];      // e.g., ["hi", "en", "ru"]
  
  // Governance
  reviewRequired: boolean;      // true if needs review for activation
  lastUpdated: string;          // ISO 8601 timestamp
  reviewer?: string;            // Team or person responsible
}
```

### Language Status

| Status | Description | UI Visible | Runtime Available |
|--------|-------------|------------|-------------------|
| **active** | Fully supported | ✅ Yes | ✅ Yes |
| **partial** | Partial coverage (>80%) | ✅ Yes | ✅ Yes |
| **planned** | In development | ❌ No | ❌ No |
| **inferred** | Detected but not confirmed | ❌ No | ❌ No |
| **deprecated** | Being phased out | ⚠️ Warning | ⚠️ Warning |

### Language Category

| Category | Description | Examples |
|----------|-------------|----------|
| **primary** | Source of truth, default fallback | ru |
| **international** | Major world languages | en, hi, zh |
| **regional** | Languages of specific regions | tt, be, ba, cv, sah, udm, ce, os |

---

## 📈 COVERAGE METRICS

### Coverage Structure

```typescript
interface CoverageMetrics {
  ui: number;         // UI components (buttons, labels)
  system: number;     // System messages (errors, notifications)
  public: number;     // Public pages (about, terms)
  technical: number;  // Technical docs (contracts, runbooks)
  overall: number;    // Weighted average
}
```

### Coverage Thresholds

| Status | Minimum Coverage | Target |
|--------|-----------------|--------|
| **active** | 100% | 100% |
| **partial** | 80% | 100% |
| **planned** | 0% | 80% |

### Coverage Calculation

```typescript
function calculateOverallCoverage(coverage: CoverageMetrics): number {
  const weights = {
    ui: 0.4,        // 40% weight
    system: 0.3,    // 30% weight
    public: 0.2,    // 20% weight
    technical: 0.1  // 10% weight
  };
  
  return (
    coverage.ui * weights.ui +
    coverage.system * weights.system +
    coverage.public * weights.public +
    coverage.technical * weights.technical
  );
}
```

---

## 🔄 LANGUAGE LIFECYCLE

### States

```
planned → in-development → partial → active → (optional) deprecated
```

### Transitions

| From | To | Requirements | Approval |
|------|----|--------------|----------|
| **planned** | **in-development** | Language metadata created | i18n-team |
| **in-development** | **partial** | >0% coverage, file uploaded | i18n-team |
| **partial** | **active** | 100% coverage, validated | i18n-team + reviewer |
| **active** | **deprecated** | Business decision | CTO |

### Validation Rules

```typescript
interface LanguageValidation {
  // Required for all languages
  hasLanguageId: boolean;
  hasCanonicalName: boolean;
  hasNativeName: boolean;
  hasValidStatusCode: boolean;
  
  // Required for activation
  coverageAboveThreshold: boolean;  // >= 80%
  noCriticalMissingStrings: boolean; // No high-priority missing
  translationFileExists: boolean;
  translationFileValid: boolean;
  
  // Required for active status
  coverageAt100: boolean;
  reviewedByHuman: boolean;
}
```

---

## 📦 LANGUAGE METADATA

### Required Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `languageId` | string | ✅ | Unique identifier (ISO 639 code) |
| `canonicalName` | string | ✅ | English name |
| `nativeName` | string | ✅ | Name in native script |
| `status` | enum | ✅ | Current status |
| `priority` | number | ✅ | Display priority (1 = highest) |
| `category` | enum | ✅ | Language category |

### Optional Metadata

| Field | Type | When Required | Description |
|-------|------|---------------|-------------|
| `iso639_1` | string | If available | 2-letter ISO code |
| `iso639_2` | string | If available | 3-letter ISO code |
| `region` | string | For regional | Geographic region |
| `fallbackChain` | array | Recommended | Fallback order |
| `reviewer` | string | For active | Review owner |

---

## 🔗 FALLBACK CHAIN

### Default Fallback

```
Selected Language → Russian (ru) → [MISSING: key]
```

### Custom Fallback Chain

```typescript
// Example for Hindi
const hiFallbackChain = ["hi", "en", "ru"];

// Resolution:
// 1. Try Hindi
// 2. If missing, try English
// 3. If missing, try Russian
// 4. If missing, return [MISSING: key]
```

### Fallback Configuration

```json
{
  "default": {
    "chain": ["ru"],
    "missingMarker": "[MISSING: {key}]"
  },
  "byLanguage": {
    "hi": {
      "chain": ["hi", "en", "ru"],
      "missingMarker": "[MISSING: {key}]"
    },
    "zh": {
      "chain": ["zh", "en", "ru"],
      "missingMarker": "[MISSING: {key}]"
    }
  }
}
```

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "languageModel": {
    "coreFields": [
      "languageId",
      "canonicalName",
      "nativeName",
      "status",
      "priority",
      "category"
    ],
    "coverageMetrics": [
      "ui",
      "system",
      "public",
      "technical",
      "overall"
    ],
    "lifecycleStates": [
      "planned",
      "in-development",
      "partial",
      "active",
      "deprecated"
    ],
    "validationRules": {
      "activation": {
        "minCoverage": 80,
        "requiresReview": true
      },
      "active": {
        "minCoverage": 100,
        "requiresHumanReview": true
      }
    }
  }
}
```

### Template Variables

```typescript
interface LanguageTemplate {
  language: Language;
  coverage: CoverageMetrics;
  fallbackChain: string[];
  missingStrings?: MissingString[];
  validationStatus: ValidationStatus;
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_TRANSLATION_MODEL.md](./I18N_TRANSLATION_MODEL.md) — Translation model
- [../state/i18n-languages.json](../state/i18n-languages.json) — Language registry
- [../contracts/i18n/I18nLanguageContract.md](../contracts/i18n/I18nLanguageContract.md) — Language contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
