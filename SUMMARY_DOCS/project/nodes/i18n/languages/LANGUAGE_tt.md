---
title: 'Language: Tatar (tt)'
description: Документация языка Tatar для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - language
  - tatar
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-languages.json
---

# 🇹🇹 LANGUAGE: TATAR (tt)

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 📋 LANGUAGE IDENTITY

| Field | Value |
|-------|-------|
| **languageId** | `tt` |
| **canonicalName** | Tatar |
| **displayName** | Tatar |
| **nativeName** | Татарча |
| **iso639_1** | `tt` |
| **iso639_2** | `tat` |
| **status** | `active` |
| **priority** | 3 |
| **category** | `regional` |
| **region** | Tatarstan |

---

## 🎯 PURPOSE

**Tatar (tt)** является **основным региональным языком** для Balloo.

**Роль:**
- ✅ Regional language — Язык Татарстана
- ✅ High priority — Приоритет 3 (после ru, en)
- ✅ Full coverage — 100% покрытие

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

**File:** `messenger/src/i18n/locales/tt.ts`

---

## 🔄 FALLBACK CHAIN

```
tt → ru → [MISSING: key]
```

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

```json
{
  "language": {
    "languageId": "tt",
    "canonicalName": "Tatar",
    "nativeName": "Татарча",
    "status": "active",
    "priority": 3,
    "category": "regional",
    "region": "Tatarstan",
    "coverage": 100,
    "stringCount": 250
  }
}
```

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
