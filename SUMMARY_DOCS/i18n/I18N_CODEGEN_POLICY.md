---
title: I18N Codegen Policy
description: Политика для AI codegen по работе с i18n
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - i18n
  - codegen
  - policy
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/contracts/i18n/I18nCodegenContract.md
---

# 🤖 I18N CODEGEN POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **правила для AI codegen** при генерации кода с i18n в Balloo.

**Цель:** Обеспечить консистентную генерацию кода с соблюдением языковой политики.

---

## ✅ CRITICAL RULES FOR AI

### 1. All User Text Must Use Translation

**AI MUST generate translation keys for ALL user-visible strings.**

```typescript
// ❌ AI MUST NOT generate this
<button>Save Changes</button>
<label>Username</label>
<p>Last login: {date}</p>

// ✅ AI MUST generate this
<button>{t('saveChanges')}</button>
<label>{t('username')}</label>
<p>{t('lastLogin', { date })}</p>
```

### 2. Read Language State from Canonical Files

**AI MUST read available languages from state files.**

```json
// Source: SUMMARY_DOCS/state/i18n-languages.json
{
  "languages": ["ru", "en", "tt", "hi", "zh", "be", "ba", "cv", "sah", "udm", "ce", "os"],
  "primaryLanguage": "ru",
  "fallbackLanguage": "ru"
}
```

### 3. Follow Key Naming Convention

**AI MUST use camelCase for translation keys.**

```typescript
// ✅ CORRECT
t('saveChanges'), t('errorNetwork'), t('userProfile')

// ❌ WRONG
t('save_changes'), t('ErrorNetwork'), t('user-profile')
```

### 4. No Hardcoded Strings

**AI MUST NOT generate hardcoded user-visible strings.**

```typescript
// ❌ FORBIDDEN
const messages = {
  error: "Network error",
  success: "Operation completed"
};

// ✅ REQUIRED
const messages = {
  error: t('errorNetwork'),
  success: t('operationCompleted')
};
```

---

## 📋 AI CONTEXT FOR I18N

### Language Inventory

| Code | Name | Status | Coverage | Priority |
|------|------|--------|----------|----------|
| ru | Russian | active | 100% | 1 |
| en | English | active | 100% | 2 |
| tt | Tatar | active | 100% | 3 |
| hi | Hindi | active | 80% | 4 |
| zh | Chinese | active | 80% | 5 |
| be | Belarusian | active | 100% | 6 |
| ba | Bashkir | active | 100% | 7 |
| cv | Chuvash | active | 100% | 8 |
| sah | Yakut | active | 100% | 9 |
| udm | Udmurt | active | 100% | 10 |
| ce | Chechen | active | 100% | 11 |
| os | Ossetian | active | 100% | 12 |

### Translation Packages

| Package | Strings | Coverage |
|---------|---------|----------|
| ui | 150 | 96.7% |
| system | 50 | 96.7% |
| public | 50 | 96.7% |

### Missing Strings

- **hi:** 50 missing strings
- **zh:** 50 missing strings
- **Total:** 100 missing strings

---

## 🔧 AI GENERATION PATTERNS

### Component Pattern

```typescript
// ✅ AI-GENERATED COMPONENT TEMPLATE
import { t } from '@/i18n';
import type { Language } from '@/i18n/types';

interface Props {
  userName: string;
  language?: Language;
}

export function WelcomeCard({ userName, language = 'ru' }: Props) {
  return (
    <div className="welcome-card">
      <h1>{t('welcome', language)}</h1>
      <p>{t('helloUser', { name: userName }, language)}</p>
      <button onClick={handleClick}>
        {t('getStarted', language)}
      </button>
    </div>
  );
}
```

### Translation File Pattern

```typescript
// ✅ AI-GENERATED TRANSLATION FILE TEMPLATE
import type { Translation } from '../types';

export const newLang: Translation = {
  // App
  appName: 'Balloo',
  loading: '...',
  
  // Actions
  save: '...',
  cancel: '...',
  delete: '...',
  edit: '...',
  
  // Errors
  error: '...',
  errorNetwork: '...',
  errorAuth: '...',
  
  // ... all 250 keys must be present
};
```

---

## ⚠️ AI VALIDATION CHECKS

### Before Generating Code

- [ ] Check if language exists in i18n-languages.json
- [ ] Check language coverage in i18n-translation-coverage.json
- [ ] Verify translation keys exist in source (ru)
- [ ] Ensure no hardcoded strings in generated code

### After Generating Code

- [ ] All user-visible strings use t()
- [ ] Key naming follows camelCase
- [ ] Fallback behavior is explicit
- [ ] No mixed languages in translation files

---

## 📊 AI RESPONSE TEMPLATE

### When Asked About Languages

```
Available languages in Balloo:

**Active (12):**
- ru (Russian) — 100% coverage, primary
- en (English) — 100% coverage
- tt (Tatar) — 100% coverage
- hi (Hindi) — 80% coverage, 50 missing strings
- zh (Chinese) — 80% coverage, 50 missing strings
- be, ba, cv, sah, udm, ce, os — 100% coverage

**Source of truth:** SUMMARY_DOCS/state/i18n-languages.json
```

### When Asked About Missing Translations

```
Missing translations found:

**Hindi (hi):** 50 strings missing
- familyRelations, addRelation, relationChildMother, ...

**Chinese (zh):** 50 strings missing
- familyRelations, addRelation, relationChildMother, ...

**Full list:** SUMMARY_DOCS/state/i18n-missing-strings.json
```

---

## 🤖 MACHINE-BINDING

### AI System Prompt Addendum

```
When generating code for Balloo platform:

1. ALWAYS use translation keys for user-visible text
2. NEVER hardcode strings like "Save", "Cancel", "Error"
3. READ language availability from i18n-languages.json
4. FOLLOW camelCase naming for translation keys
5. ADD new strings to Russian translation first
6. USE explicit missing markers: [MISSING: key]
7. CHECK coverage before suggesting new language support

Source of truth: SUMMARY_DOCS/state/i18n-languages.json
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_LANGUAGE_MODEL.md](./I18N_LANGUAGE_MODEL.md) — Language model
- [../contracts/i18n/I18nCodegenContract.md](../contracts/i18n/I18nCodegenContract.md) — Codegen contract
- [../state/i18n-languages.json](../state/i18n-languages.json) — Language registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
