---
title: I18N Package Model
description: Модель пакетов переводов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - package-model
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-packages.json
---

# 📦 I18N PACKAGE MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **структуру пакетов переводов** в Balloo.

**Цель:** Организовать переводы по пакетам для удобного управления и coverage tracking.

---

## 📊 PACKAGE STRUCTURE

### Core Package Object

```typescript
interface TranslationPackage {
  // Identity
  packageId: string;           // e.g., "ui", "system", "public"
  packageName: string;         // e.g., "UI Components"
  packageType: PackageType;    // user-facing | system | content | technical
  
  // Content
  description: string;
  translatableSurface: TranslatableSurface;
  
  // Ownership
  owner: string;               // Team or person responsible
  
  // Coverage
  fallbackLanguage: string;    // e.g., "ru"
  coverageStatus: CoverageStatus;
  stringCount: number;
  
  // Dependencies
  releaseDependency: boolean;  // Blocks release if incomplete
  runtimeDependency: boolean;  // Required at runtime
  codegenDependency: boolean;  // Required for codegen
}
```

### Package Types

| Type | Description | Examples | Coverage Target |
|------|-------------|----------|-----------------|
| **user-facing** | UI visible to users | Buttons, labels, forms | 100% |
| **system** | System messages | Errors, notifications | 100% |
| **content** | Public content | About, terms, privacy | 95% |
| **technical** | Technical docs | Contracts, runbooks | 80% |

---

## 📦 IDENTIFIED PACKAGES

### 1. UI Package

```json
{
  "packageId": "ui",
  "packageName": "UI Components",
  "packageType": "user-facing",
  "description": "User interface strings (buttons, labels, messages)",
  "translatableSurface": {
    "components": ["Button", "Input", "Modal", "Header", "Footer", "Card"],
    "elements": ["labels", "placeholders", "tooltips", "error-messages"]
  },
  "owner": "frontend-team",
  "stringCount": 150,
  "coverageTarget": 100
}
```

**Example Keys:**
- `save`, `cancel`, `delete`, `edit`
- `loading`, `success`, `error`
- `username`, `password`, `email`
- `search`, `filter`, `sort`

### 2. System Package

```json
{
  "packageId": "system",
  "packageName": "System Messages",
  "packageType": "system",
  "description": "System messages (errors, notifications, status)",
  "translatableSurface": {
    "components": ["Notification", "Alert", "Toast", "ErrorBoundary"],
    "elements": ["error-messages", "success-messages", "warnings", "loading-text"]
  },
  "owner": "backend-team",
  "stringCount": 50,
  "coverageTarget": 100
}
```

**Example Keys:**
- `error`, `errorNetwork`, `errorAuth`
- `success`, `saved`, `deleted`
- `warning`, `confirm`, `cancelAction`

### 3. Public Package

```json
{
  "packageId": "public",
  "packageName": "Public Pages",
  "packageType": "content",
  "description": "Public pages content (about, downloads, terms, privacy)",
  "translatableSurface": {
    "pages": ["about-balloo", "downloads", "privacy", "terms", "support"],
    "elements": ["headings", "paragraphs", "links", "cta-buttons"]
  },
  "owner": "content-team",
  "stringCount": 50,
  "coverageTarget": 95
}
```

**Example Keys:**
- `aboutBalloo`, `downloads`, `privacyPolicy`
- `termsOfService`, `support`, `contactUs`

---

## 📈 COVERAGE BY PACKAGE

### Coverage Matrix

| Package | ru | en | tt | hi | zh | be | ba | cv | sah | udm | ce | os |
|---------|----|----|----|----|----|----|----|----|-----|-----|----|----|
| **ui** | 100 | 100 | 100 | 80 | 80 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| **system** | 100 | 100 | 100 | 80 | 80 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| **public** | 100 | 100 | 100 | 75 | 75 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |

### Coverage Summary

| Package | Total Strings | Average Coverage | Languages at 100% |
|---------|--------------|------------------|-------------------|
| **ui** | 150 | 96.7% | 10/12 |
| **system** | 50 | 96.7% | 10/12 |
| **public** | 50 | 95.8% | 10/12 |

---

## 🔗 PACKAGE DEPENDENCIES

### Release Dependency

**Definition:** Package blocks release if coverage below threshold.

| Package | Release Dependency | Threshold |
|---------|-------------------|-----------|
| **ui** | ✅ Yes | 95% |
| **system** | ✅ Yes | 95% |
| **public** | ❌ No | N/A |

### Runtime Dependency

**Definition:** Package required at runtime.

| Package | Runtime Dependency | Lazy Load |
|---------|-------------------|-----------|
| **ui** | ✅ Yes | ❌ No |
| **system** | ✅ Yes | ❌ No |
| **public** | ✅ Yes | ✅ Yes |

### Codegen Dependency

**Definition:** Package required for code generation.

| Package | Codegen Dependency |
|---------|-------------------|
| **ui** | ✅ Yes |
| **system** | ✅ Yes |
| **public** | ❌ No |

---

## 🏛️ GOVERNANCE

### Package Ownership

| Package | Owner | Reviewer | Update Frequency |
|---------|-------|----------|-----------------|
| **ui** | frontend-team | i18n-team | Per feature |
| **system** | backend-team | i18n-team | Per release |
| **public** | content-team | i18n-team | As needed |

### Update Process

```
1. Identify new strings (owner)
   ↓
2. Add to Russian translation (owner)
   ↓
3. Translate to other languages (translators)
   ↓
4. Validate coverage (automated)
   ↓
5. Review translations (reviewer)
   ↓
6. Merge and deploy (i18n-team)
```

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "packageModel": {
    "packages": [
      {
        "packageId": "ui",
        "packageType": "user-facing",
        "stringCount": 150,
        "coverageTarget": 100,
        "releaseDependency": true
      },
      {
        "packageId": "system",
        "packageType": "system",
        "stringCount": 50,
        "coverageTarget": 100,
        "releaseDependency": true
      },
      {
        "packageId": "public",
        "packageType": "content",
        "stringCount": 50,
        "coverageTarget": 95,
        "releaseDependency": false
      }
    ],
    "coverageThresholds": {
      "user-facing": 100,
      "system": 100,
      "content": 95,
      "technical": 80
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_TRANSLATION_MODEL.md](./I18N_TRANSLATION_MODEL.md) — Translation model
- [../state/i18n-packages.json](../state/i18n-packages.json) — Package registry
- [../state/i18n-translation-coverage.json](../state/i18n-translation-coverage.json) — Coverage map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
