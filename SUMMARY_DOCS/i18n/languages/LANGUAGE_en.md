---
title: 'Language: English (en)'
description: Документация языка English для Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - language
  - english
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-languages.json
---

# 🇬🇧 LANGUAGE: ENGLISH (en)

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 📋 LANGUAGE IDENTITY

| Field | Value |
|-------|-------|
| **languageId** | `en` |
| **canonicalName** | English |
| **displayName** | English |
| **nativeName** | English |
| **iso639_1** | `en` |
| **iso639_2** | `eng` |
| **status** | `active` |
| **priority** | 2 |
| **category** | `international` |

---

## 🎯 PURPOSE

**English (en)** является **основным международным языком** для Balloo.

**Роль:**
- ✅ International lingua franca — Глобальный язык общения
- ✅ Secondary fallback — Второй уровень fallback после ru
- ✅ Default for international users — Язык по умолчанию для международных пользователей

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

**File:** `messenger/src/i18n/locales/en.ts`

---

## 🔄 FALLBACK CHAIN

```
en → ru → [MISSING: key]
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
    "languageId": "en",
    "canonicalName": "English",
    "nativeName": "English",
    "status": "active",
    "priority": 2,
    "category": "international",
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
