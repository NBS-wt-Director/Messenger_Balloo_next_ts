---
title: 'Language: Russian (ru)'
description: Документация языка Russian для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - language
  - russian
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-languages.json
  - SUMMARY_DOCS/contracts/i18n/I18nLanguageContract.md
---

# 🇷🇺 LANGUAGE: RUSSIAN (ru)

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 📋 LANGUAGE IDENTITY

| Field | Value |
|-------|-------|
| **languageId** | `ru` |
| **canonicalName** | Russian |
| **displayName** | Russian |
| **nativeName** | Русский |
| **iso639_1** | `ru` |
| **iso639_2** | `rus` |
| **status** | `active` |
| **priority** | 1 (Primary) |
| **category** | `primary` |

---

## 🎯 PURPOSE

**Russian (ru)** является **источником истины** для всех переводов в Balloo.

**Роль:**
- ✅ Source of truth — Все новые строки добавляются сначала на русском
- ✅ Default fallback — Язык fallback для всех остальных языков
- ✅ Primary UI — Основной язык пользовательского интерфейса

---

## 📊 COVERAGE

| Package | Coverage | Strings | Status |
|---------|----------|---------|--------|
| **UI** | 100% | 150 | ✅ Complete |
| **System** | 100% | 50 | ✅ Complete |
| **Public** | 100% | 50 | ✅ Complete |
| **Overall** | 100% | 250 | ✅ Complete |

---

## 📁 TRANSLATION SOURCE

**File:** `messenger/src/i18n/locales/ru.ts`

**Structure:**
```typescript
import type { Translation } from '../types';

export const ru: Translation = {
  appName: 'Balloo',
  loading: 'Загрузка...',
  error: 'Ошибка',
  // ... 250 strings total
};
```

---

## 🔄 FALLBACK CHAIN

```
ru → [MISSING: key]
```

**Notes:**
- Russian is the final fallback before missing marker
- Russian strings should never be missing (source of truth)

---

## ✅ VALIDATION STATUS

| Check | Status | Notes |
|-------|--------|-------|
| **Coverage ≥100%** | ✅ Pass | 100% coverage |
| **No Missing Strings** | ✅ Pass | 0 missing |
| **Translation File Valid** | ✅ Pass | File exists and valid |
| **Reviewed by Human** | ✅ Pass | i18n-team |

---

## 🏛️ GOVERNANCE

| Role | Value |
|------|-------|
| **Owner** | i18n-team |
| **Reviewer** | i18n-team |
| **Last Updated** | 2026-06-13 |
| **Next Review** | 2026-07-13 |

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "language": {
    "languageId": "ru",
    "canonicalName": "Russian",
    "nativeName": "Русский",
    "status": "active",
    "priority": 1,
    "category": "primary",
    "isSourceOfTruth": true,
    "isDefaultFallback": true,
    "coverage": 100,
    "stringCount": 250
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](../I18N_POLICY.md) — Language policy
- [../state/i18n-languages.json](../../state/i18n-languages.json) — Language registry
- [../../contracts/i18n/I18nLanguageContract.md](../../contracts/i18n/I18nLanguageContract.md) — Language contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
