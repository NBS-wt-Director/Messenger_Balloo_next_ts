---
title: I18N Coverage Policy
description: Политика покрытия переводов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - coverage
  - policy
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-translation-coverage.json
  - SUMMARY_DOCS/state/i18n-missing-strings.json
---

# 📊 I18N COVERAGE POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **требования к покрытию переводов** для всех языковых пакетов Balloo.

**Цель:** Гарантировать 100% переводимость всех языковых пакетов.

---

## ✅ COVERAGE REQUIREMENTS

### 100% Translation Rule

**All translation packages MUST be 100% translated for active languages.**

| Package Type | Minimum Coverage | Target | Blocking Threshold |
|--------------|-----------------|--------|-------------------|
| **UI** | 100% | 100% | <95% |
| **System** | 100% | 100% | <95% |
| **Public** | 95% | 100% | <90% |
| **Technical** | 80% | 95% | <70% |

---

## 🚫 FORBIDDEN PATTERNS

### 1. No Silent Fallback Policy

**Missing translations MUST NOT fallback silently.**

```typescript
// ❌ FORBIDDEN: Silent fallback
function t(key: string, lang: string): string {
  return translations[lang][key] || translations.ru[key] || key;
}

// ✅ REQUIRED: Explicit marker
function t(key: string, lang: string): string {
  const translation = translations[lang]?.[key] || translations.ru?.[key];
  
  if (!translation) {
    console.warn(`Missing translation: ${key} in ${lang}`);
    return `[MISSING: ${key}]`;
  }
  
  return translation;
}
```

### 2. No Hidden Hardcoded UI Policy

**All user-visible strings MUST be in translation files.**

```typescript
// ❌ FORBIDDEN: Hardcoded string
<button>Save Changes</button>

// ✅ REQUIRED: Translation key
<button>{t('saveChanges')}</button>
```

### 3. No Mixed-Language Package Policy

**Single package MUST NOT contain multiple languages.**

```typescript
// ❌ FORBIDDEN: Mixed languages
const mixed = {
  save: "Сохранить",  // Russian
  cancel: "Cancel",   // English
};

// ✅ REQUIRED: Separate by language
const ru = { save: "Сохранить", cancel: "Отмена" };
const en = { save: "Save", cancel: "Cancel" };
```

---

## 📊 COVERAGE TRACKING

### Missing Strings Registry

**All missing strings MUST be logged in `i18n-missing-strings.json`.**

```json
{
  "hi": [
    {
      "key": "familyRelations",
      "packageName": "ui",
      "ruValue": "Семейные связи",
      "status": "missing",
      "priority": "medium",
      "addedAt": "2026-06-13T00:00:00Z"
    }
  ]
}
```

### Coverage Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **String Coverage** | % of keys translated | 100% |
| **Package Coverage** | % of packages complete | 100% |
| **Language Coverage** | % of languages at 100% | 100% |

---

## 🔒 ACTIVATION RULES

### Language Activation

**Languages MUST meet coverage threshold before activation.**

| Status | Minimum Coverage | Review Required |
|--------|-----------------|-----------------|
| **planned** | 0% | No |
| **partial** | ≥80% | i18n-team |
| **active** | 100% | i18n-team + reviewer |

### Blocking Conditions

**Language activation BLOCKED if:**

- ❌ Coverage < 80%
- ❌ High-priority strings missing
- ❌ Translation file invalid
- ❌ No human review completed

---

## ⚠️ MISSING TRANSLATION BEHAVIOR

### Required Fallback Behavior

```
1. Try selected language
   ↓ (if missing)
2. Try fallback language (ru)
   ↓ (if missing)
3. Return explicit marker: [MISSING: key]
   ↓
4. Log warning to console
```

### Missing String Marker

**Format:** `[MISSING: {key}]`

**Examples:**
- `[MISSING: familyRelations]`
- `[MISSING: installAppDesc]`
- `[MISSING: contactsPermissionDenied]`

---

## 📈 COVERAGE THRESHOLDS

### By Language Status

| Status | Min Coverage | Max Missing | Blocking |
|--------|-------------|-------------|----------|
| **active** | 100% | 0 | N/A |
| **partial** | 80% | 50 | Yes, if >50 |
| **planned** | 0% | N/A | No |

### By Package Priority

| Priority | Packages | Min Coverage | Review |
|----------|----------|-------------|--------|
| **Critical** | UI, System | 100% | Required |
| **High** | Public | 95% | Required |
| **Medium** | Technical | 80% | Recommended |

---

## 🔍 AUDIT REQUIREMENTS

### Regular Audits

| Audit Type | Frequency | Owner |
|------------|-----------|-------|
| **Coverage Audit** | Weekly | i18n-team |
| **Hardcoded String Scan** | Monthly | i18n-team |
| **Full Translation Review** | Quarterly | i18n-team + reviewers |

### Audit Checks

- [ ] All strings translated for active languages
- [ ] No hardcoded strings in UI
- [ ] Missing strings logged
- [ ] Coverage above threshold
- [ ] Fallback behavior correct

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "coveragePolicy": {
    "rules": [
      "100-percent-translatable",
      "no-silent-fallback",
      "no-hardcoded-ui",
      "no-mixed-packages"
    ],
    "thresholds": {
      "active": 100,
      "partial": 80,
      "blocking": 50
    },
    "missingMarker": "[MISSING: {key}]",
    "fallbackChain": ["selected", "ru", "[MISSING]"]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_LANGUAGE_MODEL.md](./I18N_LANGUAGE_MODEL.md) — Language model
- [../state/i18n-missing-strings.json](../state/i18n-missing-strings.json) — Missing strings
- [../contracts/i18n/I18nTranslationContract.md](../contracts/i18n/I18nTranslationContract.md) — Translation contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
