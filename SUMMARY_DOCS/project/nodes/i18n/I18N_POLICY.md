---
title: I18N Policy
description: Языковая политика Balloo — реконструирована из messenger
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - policy
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_LANGUAGE_MODEL.md
  - SUMMARY_DOCS/contracts/i18n/I18nPolicyContract.md
  - SUMMARY_DOCS/state/i18n-languages.json
---

# 🌐 I18N POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **языковую архитектуру Balloo**, реконструированную из messenger.

**Цель:** Обеспечить полную переводимость всех текстов системы с возможностью добавления языков из технической зоны без правки кода.

---

## 📁 SOURCE OF TRUTH

### Primary Sources

| Source | Type | What It Provided |
|--------|------|------------------|
| `messenger/src/i18n/types.ts` | Code | Language list, types |
| `messenger/src/i18n/locales/` | Code | Translation files (12 languages) |
| `messenger/src/i18n/index.ts` | Code | i18n API |
| `messenger/src/i18n/translations.ts` | Code | Legacy translations |

### Evidence

```typescript
// messenger/src/i18n/types.ts
export type Language = 'ru' | 'hi' | 'zh' | 'tt' | 'en' | 'be' | 'ba' | 'cv' | 'sah' | 'udm' | 'ce' | 'os';

export const LANGUAGES: LanguageOption[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татарча' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ba', name: 'Bashkir', nativeName: 'Башҡорт' },
  { code: 'cv', name: 'Chuvash', nativeName: 'Чăваш' },
  { code: 'sah', name: 'Yakut', nativeName: 'Саха' },
  { code: 'udm', name: 'Udmurt', nativeName: 'Удмурт' },
  { code: 'ce', name: 'Chechen', nativeName: 'Нохчийн' },
  { code: 'os', name: 'Ossetian', nativeName: 'Ирон' },
];
```

---

## 🌍 SUPPORTED LANGUAGES

### Baseline (12 Languages)

| Priority | Code | Name | Native Name | Status | Coverage |
|----------|------|------|-------------|--------|----------|
| 1 | **ru** | Russian | Русский | ✅ Active | 100% |
| 2 | **en** | English | English | ✅ Active | 100% |
| 3 | **tt** | Tatar | Татарча | ✅ Active | 100% |
| 4 | **hi** | Hindi | हिंदी | ⚠️ Partial | ~80% |
| 5 | **zh** | Chinese | 中文 | ⚠️ Partial | ~80% |
| 6 | **be** | Belarusian | Беларуская | ✅ Active | 100% (fallback) |
| 7 | **ba** | Bashkir | Башҡорт | ✅ Active | 100% (fallback) |
| 8 | **cv** | Chuvash | Чăваш | ✅ Active | 100% (fallback) |
| 9 | **sah** | Yakut | Саха | ✅ Active | 100% (fallback) |
| 10 | **udm** | Udmurt | Удмурт | ✅ Active | 100% (fallback) |
| 11 | **ce** | Chechen | Нохчийн | ✅ Active | 100% (fallback) |
| 12 | **os** | Ossetian | Ирон | ✅ Active | 100% (fallback) |

### Language Categories

#### Primary Language

- **ru** (Russian) — Source of truth, default fallback

#### International Languages

- **en** (English) — Global lingua franca
- **hi** (Hindi) — India, large user base
- **zh** (Chinese) — China, large user base

#### Regional Languages (Russia)

- **tt** (Tatar) — Tatarstan
- **be** (Belarusian) — Belarus
- **ba** (Bashkir) — Bashkortostan
- **cv** (Chuvash) — Chuvashia
- **sah** (Yakut) — Sakha (Yakutia)
- **udm** (Udmurt) — Udmurtia
- **ce** (Chechen) — Chechnya
- **os** (Ossetian) — North Ossetia

---

## ✅ CRITICAL INVARIANTS

### 1. 100% Translatability

**Rule:** All user-visible text MUST be translatable.

**Forbidden:**
- ❌ Hardcoded strings in UI components
- ❌ Mixed-language packages
- ❌ Silent fallback without marking

**Required:**
- ✅ All strings in translation files
- ✅ Translation keys for all UI text
- ✅ Explicit missing translation markers

### 2. No Silent Fallback

**Rule:** Missing translations MUST be explicit, not silent.

**Behavior:**
```typescript
// ❌ WRONG: Silent fallback
t('missing.key') // Returns Russian without warning

// ✅ CORRECT: Explicit marker
t('missing.key') // Returns "[MISSING: missing.key]" or logs warning
```

### 3. Technical Zone Managed

**Rule:** Languages are added from technical zone, not by code editing.

**Future State:**
- Language management UI in technical zone
- Canonical config/state for languages
- No manual code file editing required

### 4. Russian as Source

**Rule:** Russian (ru) is the source of truth for all translations.

**Implications:**
- All new strings added to ru first
- Other languages translate from ru
- ru coverage MUST be 100%

### 5. No Hardcoded Strings

**Rule:** No hardcoded user-visible strings in code.

**Forbidden:**
```typescript
// ❌ WRONG
<button>Save Changes</button>

// ✅ CORRECT
<button>{t('saveChanges')}</button>
```

---

## 📦 TRANSLATION PACKAGES

### Package Types

| Type | Description | Examples |
|------|-------------|----------|
| **UI** | User interface strings | buttons, labels, messages |
| **System** | System messages | errors, notifications |
| **Public** | Public pages | about, terms, privacy |
| **Technical** | Technical docs | runbooks, contracts |

### Coverage Requirements

| Package Type | Minimum Coverage | Target |
|--------------|-----------------|--------|
| **UI** | 100% (active langs) | 100% |
| **System** | 100% (active langs) | 100% |
| **Public** | 95% (active langs) | 100% |
| **Technical** | 80% (active langs) | 95% |

---

## 🔄 FALLBACK BEHAVIOR

### Fallback Chain

```
Selected Language
    ↓
If missing → Russian (ru)
    ↓
If missing → "[MISSING: key]"
```

### Implementation

```typescript
function t(key: string, lang: Language = 'ru'): string {
  // Try selected language
  if (translationsData[lang]?.[key]) {
    return translationsData[lang][key];
  }
  
  // Fallback to Russian
  if (translationsData.ru?.[key]) {
    return translationsData.ru[key];
  }
  
  // Missing - explicit marker
  return `[MISSING: ${key}]`;
}
```

---

## 🚀 ADDING NEW LANGUAGES

### Current State (Code-Based)

```typescript
// messenger/src/i18n/types.ts
export type Language = 'ru' | 'en' | 'tt' | ... | 'os';

// messenger/src/i18n/locales/new-lang.ts
export const newLang: Translation = {
  appName: '...',
  // ... all keys
};
```

### Future State (Technical Zone Managed)

```json
// SUMMARY_DOCS/state/i18n-languages.json
{
  "languages": [
    {
      "code": "new",
      "name": "New Language",
      "nativeName": "Native Name",
      "status": "active",
      "coverage": 100
    }
  ]
}
```

**Process:**
1. Add language metadata to state file
2. Upload translation file via UI
3. Validate coverage
4. Activate language
5. No code changes required

---

## 📊 COVERAGE TRACKING

### Coverage Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **String Coverage** | % of keys translated | 100% |
| **Package Coverage** | % of packages complete | 100% |
| **Language Coverage** | % of languages active | As needed |

### Missing Strings

**Tracking:**
- All missing strings logged in `i18n-missing-strings.json`
- Missing strings visible in technical zone
- Missing strings block language activation if > threshold

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "i18nPolicy": {
    "sourceOfTruth": "messenger/src/i18n/",
    "languages": "SUMMARY_DOCS/state/i18n-languages.json",
    "invariants": [
      "100-percent-translatable",
      "no-hardcoded-strings",
      "no-silent-fallback",
      "technical-zone-managed"
    ],
    "fallbackChain": ["selected", "ru", "[MISSING]"]
  }
}
```

### Template Variables

```typescript
interface I18nContext {
  availableLanguages: Language[];
  primaryLanguage: 'ru';
  fallbackLanguage: 'ru';
  missingStringMarker: string;
  coverageThreshold: number;
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_LANGUAGE_MODEL.md](./I18N_LANGUAGE_MODEL.md) — Language model
- [I18N_TRANSLATION_MODEL.md](./I18N_TRANSLATION_MODEL.md) — Translation model
- [I18N_COVERAGE_POLICY.md](./I18N_COVERAGE_POLICY.md) — Coverage policy
- [../contracts/i18n/I18nPolicyContract.md](../contracts/i18n/I18nPolicyContract.md) — Policy contract
- [../state/i18n-languages.json](../state/i18n-languages.json) — Language registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
