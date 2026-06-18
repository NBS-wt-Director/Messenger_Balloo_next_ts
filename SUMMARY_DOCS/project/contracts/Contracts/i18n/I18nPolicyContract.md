---
title: I18N Policy Contract
description: Контракт языковой политики Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - policy
  - contract
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-languages.json
---

# 📜 I18N POLICY CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот контракт определяет **обязательные правила языковой политики** Balloo.

**Цель:** Гарантировать полную переводимость всех текстов и возможность добавления языков из технической зоны.

---

## ✅ MUST RULES

### 1. 100% Translatability

**All user-visible text MUST be translatable.**

- ✅ All strings in translation files
- ✅ Translation keys for all UI text
- ✅ No hardcoded user-visible strings

**Forbidden:**
```typescript
// ❌ WRONG
<button>Save Changes</button>

// ✅ CORRECT
<button>{t('saveChanges')}</button>
```

### 2. No Silent Fallback

**Missing translations MUST be explicit, not silent.**

```typescript
// ❌ WRONG: Silent fallback
return translationsData[lang]?.[key] || translationsData.ru[key] || key;

// ✅ CORRECT: Explicit marker
return translationsData[lang]?.[key] || translationsData.ru[key] || `[MISSING: ${key}]`;
```

### 3. Russian as Source

**Russian (ru) MUST be the source of truth.**

- All new strings added to ru first
- Other languages translate from ru
- ru coverage MUST be 100%

### 4. Technical Zone Managed

**Languages MUST be addable from technical zone.**

**Future State:**
- ✅ Language management UI
- ✅ Canonical config/state
- ✅ No manual code file editing

### 5. Coverage Tracking

**Translation coverage MUST be tracked.**

- ✅ All missing strings logged
- ✅ Coverage visible in technical zone
- ✅ Missing strings block activation if > threshold

### 6. No Hardcoded Strings

**No hardcoded user-visible strings in code.**

**Forbidden:**
```typescript
// ❌ WRONG
const error = "Network error";
<label>Last login</label>

// ✅ CORRECT
const error = t('errorNetwork');
<label>{t('lastLogin')}</label>
```

---

## 📋 SHOULD RULES

### 1. Priority Order

**Languages SHOULD follow priority order.**

```
1. ru (primary)
2. en (international)
3. tt (regional)
4. hi (international)
5. zh (international)
...
```

### 2. Coverage Goals

**Languages SHOULD maintain high coverage.**

| Status | Target Coverage |
|--------|----------------|
| active | 100% |
| partial | >80% |
| planned | Working toward 80% |

### 3. Review Process

**Language changes SHOULD be reviewed.**

- New languages: i18n-team review
- Coverage updates: Automated validation
- Deprecation: CTO approval

---

## 🚫 MUST NOT RULES

### 1. No Silent Failures

**Must NOT silently fallback without logging.**

```typescript
// ❌ WRONG
function t(key: string) {
  return translationsData[key] || key; // Silent fallback
}
```

### 2. No Mixed-Language Packages

**Must NOT mix languages in single package.**

```typescript
// ❌ WRONG
const mixed = {
  save: "Сохранить",  // Russian
  cancel: "Cancel",   // English
};

// ✅ CORRECT
const ru = { save: "Сохранить", cancel: "Отмена" };
const en = { save: "Save", cancel: "Cancel" };
```

### 3. No Code Editing for Language Addition

**Must NOT require code file editing to add language.**

**Current State:** ⚠️ Code-based (temporary)  
**Future State:** ✅ Technical zone managed

### 4. No Unvalidated Activation

**Must NOT activate language without validation.**

```typescript
// ❌ WRONG
function activateLanguage(code: string) {
  languages.push({ code, status: 'active' });
}

// ✅ CORRECT
function activateLanguage(code: string) {
  const validation = validateLanguage(code);
  if (validation.coverage >= 80 && validation.valid) {
    languages.push({ code, status: 'active' });
  }
}
```

---

## 🔐 MACHINE-BINDING NOTES

### Future Machine-Readable Binding

```json
{
  "policy": {
    "invariants": [
      "100-percent-translatable",
      "no-hardcoded-strings",
      "no-silent-fallback",
      "russian-as-source",
      "technical-zone-managed"
    ],
    "validation": {
      "activationThreshold": 80,
      "activeThreshold": 100,
      "requiresReview": true
    },
    "fallback": {
      "default": "ru",
      "missingMarker": "[MISSING: {key}]"
    }
  }
}
```

### Build-Time Validation

```typescript
// Future: Build-time validation
function validateI18nPolicy(): ValidationResult {
  const errors = [];
  
  // Check for hardcoded strings
  const hardcodedStrings = findHardcodedStrings();
  if (hardcodedStrings.length > 0) {
    errors.push(`Found ${hardcodedStrings.length} hardcoded strings`);
  }
  
  // Check coverage
  const lowCoverage = checkCoverage();
  if (lowCoverage.length > 0) {
    errors.push(`Low coverage: ${lowCoverage.join(', ')}`);
  }
  
  return { valid: errors.length === 0, errors };
}
```

---

## 📊 COMPLIANCE STATUS

### Current Compliance

| Rule | Status | Notes |
|------|--------|-------|
| 100% translatable | ⚠️ Partial | Some hardcoded strings may exist |
| No silent fallback | ❌ Not implemented | Current code has silent fallback |
| Russian as source | ✅ Compliant | ru is fallback |
| Technical zone managed | ⏳ Future | Currently code-based |
| Coverage tracking | ✅ Compliant | i18n-missing-strings.json |
| No hardcoded strings | ⚠️ Partial | Needs audit |

### Action Items

| Priority | Action | Owner | Deadline |
|----------|--------|-------|----------|
| High | Implement explicit missing markers | i18n-team | 2026-06-20 |
| High | Complete hi, zh translations | translators | 2026-06-20 |
| Medium | Audit for hardcoded strings | i18n-team | 2026-06-27 |
| Medium | Build language management UI | dev-team | 2026-07-11 |

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](../../i18n/I18N_POLICY.md) — Language policy
- [I18N_LANGUAGE_MODEL.md](../../i18n/I18N_LANGUAGE_MODEL.md) — Language model
- [../../state/i18n-languages.json](../../state/i18n-languages.json) — Language registry
- [../../state/i18n-missing-strings.json](../../state/i18n-missing-strings.json) — Missing strings

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
