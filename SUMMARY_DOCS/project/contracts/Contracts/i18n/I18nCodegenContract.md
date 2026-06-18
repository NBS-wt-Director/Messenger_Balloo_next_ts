---
title: I18N Codegen Contract
description: Контракт для AI codegen по языковой политике
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - i18n
  - codegen
  - contract
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_CODEGEN_POLICY.md
  - SUMMARY_DOCS/state/i18n-languages.json
---

# 🤖 I18N CODEGEN CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот контракт определяет **правила для AI codegen** при работе с i18n в Balloo.

**Цель:** Обеспечить консистентную генерацию кода с соблюдением языковой политики.

---

## ✅ CODEGEN MUST RULES

### 1. Always Use Translation Keys

**AI MUST generate translation keys for all user-visible strings.**

```typescript
// ❌ FORBIDDEN
<button>Save Changes</button>

// ✅ REQUIRED
<button>{t('saveChanges')}</button>
```

### 2. Follow Key Naming Convention

**AI MUST use camelCase for translation keys.**

```typescript
// ✅ CORRECT
t('saveChanges'), t('errorNetwork'), t('userProfile')

// ❌ FORBIDDEN
t('save_changes'), t('ErrorNetwork'), t('user-profile')
```

### 3. Add to Russian First

**AI MUST add new strings to Russian translation first.**

```typescript
// Step 1: Add to ru.ts
export const ru: Translation = {
  newFeature: 'Новая функция',
};

// Step 2: Add to other languages (or mark as missing)
export const en: Translation = {
  newFeature: 'New Feature',
};
```

### 4. Use Explicit Missing Markers

**AI MUST NOT generate silent fallback.**

```typescript
// ❌ FORBIDDEN
function t(key: string) {
  return translations[key] || key;
}

// ✅ REQUIRED
function t(key: string) {
  return translations[key] || `[MISSING: ${key}]`;
}
```

### 5. Reference State Files

**AI MUST read language state from canonical files.**

```json
// Read from: SUMMARY_DOCS/state/i18n-languages.json
{
  "languages": ["ru", "en", "tt", "hi", "zh", ...],
  "primaryLanguage": "ru",
  "fallbackLanguage": "ru"
}
```

---

## 📋 CODEGEN SHOULD RULES

### 1. Check Coverage Before Adding Language

**AI SHOULD check coverage before suggesting language addition.**

```typescript
// Check coverage
const coverage = getCoverage('kk');
if (coverage < 80) {
  console.warn('Language coverage below threshold');
}
```

### 2. Use Language Metadata

**AI SHOULD use language metadata from state files.**

```json
{
  "languageId": "tt",
  "canonicalName": "Tatar",
  "nativeName": "Татарча",
  "status": "active",
  "priority": 3,
  "coverage": 100
}
```

### 3. Generate Translation Scaffolding

**AI SHOULD generate translation file scaffolding for new languages.**

```typescript
// Template for new language
export const kk: Translation = {
  // Copy keys from ru.ts
  appName: 'Balloo',
  loading: 'Жүктелуде...',
  // ... all 250 keys
};
```

---

## 🚫 CODEGEN MUST NOT RULES

### 1. No Hardcoded Strings

**AI MUST NOT generate hardcoded user-visible strings.**

```typescript
// ❌ FORBIDDEN
const error = "Network error";
<label>Last login</label>

// ✅ REQUIRED
const error = t('errorNetwork');
<label>{t('lastLogin')}</label>
```

### 2. No Mixed Languages

**AI MUST NOT mix languages in single translation file.**

```typescript
// ❌ FORBIDDEN
export const mixed: Translation = {
  save: "Сохранить",  // Russian
  cancel: "Cancel",   // English
};

// ✅ REQUIRED
export const ru: Translation = {
  save: "Сохранить",
  cancel: "Отмена",
};
```

### 3. No Silent Assumptions

**AI MUST NOT assume language availability without checking state.**

```typescript
// ❌ FORBIDDEN
// Assuming language exists
const lang = 'kk';  // Not in state file

// ✅ REQUIRED
// Check state file first
const availableLanguages = readStateFile('i18n-languages.json');
if (!availableLanguages.includes('kk')) {
  throw new Error('Language not available');
}
```

---

## 🔐 MACHINE-BINDING NOTES

### AI Context for I18N

```json
{
  "i18nContext": {
    "sourceOfTruth": "SUMMARY_DOCS/state/i18n-languages.json",
    "languages": {
      "total": 12,
      "active": 12,
      "fullCoverage": 10,
      "partialCoverage": 2
    },
    "primaryLanguage": "ru",
    "fallbackLanguage": "ru",
    "missingMarker": "[MISSING: {key}]",
    "keyNaming": "camelCase",
    "packages": ["ui", "system", "public"],
    "totalStrings": 250
  },
  "codegenRules": {
    "must": [
      "use-translation-keys",
      "follow-key-naming",
      "add-to-russian-first",
      "use-explicit-markers",
      "reference-state-files"
    ],
    "mustNot": [
      "hardcoded-strings",
      "mixed-languages",
      "silent-assumptions"
    ]
  }
}
```

### Validation for Generated Code

```typescript
interface CodegenValidation {
  // Translation usage
  noHardcodedStrings: boolean;
  usesTranslationKeys: boolean;
  keyNamingCorrect: boolean;
  
  // Language handling
  checksLanguageAvailability: boolean;
  usesCorrectFallback: boolean;
  handlesMissingTranslations: boolean;
  
  // State compliance
  referencesStateFiles: boolean;
  followsPolicy: boolean;
}
```

---

## 📊 TEMPLATE EXAMPLES

### Component Template

```typescript
// ✅ CORRECT: AI-generated component
import { t } from '@/i18n';

interface Props {
  userName: string;
}

export function WelcomeCard({ userName }: Props) {
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('helloUser', { name: userName })}</p>
      <button>{t('getStarted')}</button>
    </div>
  );
}
```

### Translation File Template

```typescript
// ✅ CORRECT: AI-generated translation file
import type { Translation } from '../types';

export const kk: Translation = {
  // App
  appName: 'Balloo',
  loading: 'Жүктелуде...',
  
  // Actions
  save: 'Сақтау',
  cancel: 'Бас тарту',
  
  // Errors
  error: 'Қате',
  errorNetwork: 'Желі қатесі',
  
  // ... all 250 keys
};
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](../../i18n/I18N_POLICY.md) — Language policy
- [I18N_CODEGEN_POLICY.md](../../i18n/I18N_CODEGEN_POLICY.md) — Codegen policy
- [../../state/i18n-languages.json](../../state/i18n-languages.json) — Language registry
- [../../state/i18n-packages.json](../../state/i18n-packages.json) — Package registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
