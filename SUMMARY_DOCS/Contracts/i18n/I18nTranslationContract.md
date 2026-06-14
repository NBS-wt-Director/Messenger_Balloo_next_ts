---
title: I18N Translation Contract
description: Контракт переводов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - translation
  - contract
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_TRANSLATION_MODEL.md
  - SUMMARY_DOCS/state/i18n-packages.json
---

# 📜 I18N TRANSLATION CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот контракт определяет **обязательные правила для переводов** в Balloo.

**Цель:** Гарантировать консистентность, качество и полную переводимость всех текстов.

---

## ✅ MUST RULES

### 1. All Strings Must Be Translated

**All user-visible strings MUST be in translation files.**

```typescript
// ❌ FORBIDDEN: Hardcoded string
<button>Save Changes</button>

// ✅ REQUIRED: Translation key
<button>{t('saveChanges')}</button>
```

### 2. Keys Must Follow Naming Convention

**Translation keys MUST use camelCase.**

```typescript
// ✅ CORRECT
{
  saveChanges: 'Сохранить изменения',
  cancelAction: 'Отменить',
  errorNetwork: 'Ошибка сети'
}

// ❌ FORBIDDEN
{
  save_changes: '...',  // snake_case
  SaveChanges: '...',   // PascalCase
  'save-changes': '...' // kebab-case
}
```

### 3. No Empty Values

**All translation values MUST be non-empty strings.**

```typescript
// ❌ FORBIDDEN
{
  save: '',  // Empty value
  cancel: undefined  // Undefined
}

// ✅ REQUIRED
{
  save: 'Сохранить',
  cancel: 'Отмена'
}
```

### 4. Russian is Source of Truth

**All new strings MUST be added to Russian first.**

```typescript
// Process:
// 1. Add to ru.ts
export const ru: Translation = {
  newFeature: 'Новая функция',
  // ...
};

// 2. Translate to other languages
export const en: Translation = {
  newFeature: 'New Feature',
  // ...
};
```

### 5. Variables Must Match Source

**Variable placeholders MUST match Russian version.**

```typescript
// Russian (source)
{
  welcome: 'Добро пожаловать, {name}!',
  unreadCount: 'У вас {count} непрочитанных сообщений'
}

// ✅ CORRECT (English)
{
  welcome: 'Welcome, {name}!',
  unreadCount: 'You have {count} unread messages'
}

// ❌ FORBIDDEN (variables don't match)
{
  welcome: 'Welcome, {user}!',  // Wrong variable name
  unreadCount: 'You have %{count} messages'  // Wrong syntax
}
```

---

## 📋 SHOULD RULES

### 1. Consistent Terminology

**Same term SHOULD have same translation across all packages.**

```typescript
// ✅ CONSISTENT
// ui package: save: 'Сохранить'
// system package: save: 'Сохранить'

// ❌ INCONSISTENT
// ui package: save: 'Сохранить'
// system package: save: 'Записать'
```

### 2. Cultural Appropriateness

**Translations SHOULD respect local customs and norms.**

- Use appropriate formality level
- Respect cultural sensitivities
- Avoid idioms that don't translate well

### 3. Review Before Activation

**Translations SHOULD be reviewed by native speaker.**

- Human review required for activation
- Machine translation not sufficient
- Technical terms verified

---

## 🚫 MUST NOT RULES

### 1. No Mixed Languages

**Single translation file MUST NOT contain multiple languages.**

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

export const en: Translation = {
  save: "Save",
  cancel: "Cancel",
};
```

### 2. No HTML Injection

**Translation values MUST NOT contain unsafe HTML.**

```typescript
// ❌ FORBIDDEN
{
  warning: '<script>alert("XSS")</script>',
  link: '<a href="evil.com">Click</a>'
}

// ✅ REQUIRED (plain text or sanitized)
{
  warning: 'Warning: potential issue',
  link: 'Click here'  // Link added in code, not translation
}
```

### 3. No Silent Fallback

**Missing translations MUST NOT fallback silently.**

```typescript
// ❌ FORBIDDEN
function t(key: string) {
  return translations[key] || key;  // Silent fallback to key
}

// ✅ REQUIRED
function t(key: string) {
  return translations[key] || `[MISSING: ${key}]`;  // Explicit marker
}
```

---

## 🔐 MACHINE-BINDING NOTES

### Validation Schema

```json
{
  "translation": {
    "keyFormat": "camelCase",
    "valueFormat": "string (non-empty)",
    "variables": {
      "syntax": "{variableName}",
      "mustMatchSource": true
    },
    "validation": {
      "noEmptyValues": true,
      "noHtmlInjection": true,
      "noMixedLanguages": true,
      "consistentTerminology": true
    }
  }
}
```

### Build-Time Validation

```typescript
// Future: Build-time validation
function validateTranslations(): ValidationResult {
  const errors = [];
  
  // Check for empty values
  const emptyValues = findEmptyValues();
  if (emptyValues.length > 0) {
    errors.push(`Found ${emptyValues.length} empty values`);
  }
  
  // Check variable consistency
  const variableMismatches = checkVariables();
  if (variableMismatches.length > 0) {
    errors.push(`Variable mismatches: ${variableMismatches.join(', ')}`);
  }
  
  return { valid: errors.length === 0, errors };
}
```

---

## 📊 COMPLIANCE STATUS

### Current Compliance

| Rule | Status | Notes |
|------|--------|-------|
| All strings translated | ⚠️ Partial | Some hardcoded may exist |
| Keys follow convention | ✅ Compliant | camelCase used |
| No empty values | ✅ Compliant | Validated |
| Russian as source | ✅ Compliant | ru is source |
| Variables match | ✅ Compliant | Consistent syntax |
| No mixed languages | ✅ Compliant | Separate files |
| No HTML injection | ✅ Compliant | Plain text |
| No silent fallback | ⚠️ Pending | Needs implementation |

---

## 📖 RELATED DOCUMENTS

- [I18N_TRANSLATION_MODEL.md](../../i18n/I18N_TRANSLATION_MODEL.md) — Translation model
- [I18N_POLICY.md](../../i18n/I18N_POLICY.md) — Language policy
- [I18N_COVERAGE_POLICY.md](../../i18n/I18N_COVERAGE_POLICY.md) — Coverage policy
- [../../state/i18n-packages.json](../../state/i18n-packages.json) — Package registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
