---
title: I18N Translation Model
description: Модель переводов Balloo — структура, ключи, форматы
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - translation-model
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/i18n/I18N_LANGUAGE_MODEL.md
  - SUMMARY_DOCS/state/i18n-packages.json
---

# 📝 I18N TRANSLATION MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **структуру переводов, ключи и форматы** в i18n-системе Balloo.

**Цель:** Обеспечить консистентную структуру переводов для codegen, docgen и runtime.

---

## 📊 TRANSLATION STRUCTURE

### Core Translation Object

```typescript
interface Translation {
  [key: string]: string;
}
```

### Example Translation File

```typescript
// messenger/src/i18n/locales/ru.ts
import type { Translation } from '../types';

export const ru: Translation = {
  // App
  appName: 'Balloo',
  loading: 'Загрузка...',
  
  // Actions
  save: 'Сохранить',
  cancel: 'Отмена',
  delete: 'Удалить',
  edit: 'Редактировать',
  
  // Errors
  error: 'Ошибка',
  errorNetwork: 'Ошибка сети',
  errorAuth: 'Ошибка авторизации',
  
  // ... 250 strings total
};
```

---

## 🔑 TRANSLATION KEYS

### Key Naming Convention

**Format:** `camelCase`

| Category | Pattern | Examples |
|----------|---------|----------|
| **Simple** | Single word | `save`, `cancel`, `error` |
| **Compound** | Descriptive phrase | `saveChanges`, `cancelAction` |
| **Contextual** | With context | `errorNetwork`, `errorAuth` |
| **Namespaced** | With namespace | `chat.newMessage`, `user.profile` |

### Key Categories

| Category | Prefix | Examples |
|----------|--------|----------|
| **UI Actions** | (none) | `save`, `cancel`, `delete`, `edit` |
| **Errors** | `error` | `error`, `errorNetwork`, `errorUpload` |
| **Success** | `success` | `success`, `saved`, `deleted` |
| **Navigation** | `nav` | `nav.home`, `nav.settings` |
| **User** | `user` | `user.profile`, `user.login` |
| **Chat** | `chat` | `chat.message`, `chat.send` |

---

## 📦 TRANSLATION PACKAGES

### Package Structure

```typescript
interface TranslationPackage {
  packageId: string;
  packageName: string;
  packageType: 'ui' | 'system' | 'public' | 'technical';
  translations: Record<string, string>;
  stringCount: number;
  coverage: number;
}
```

### Identified Packages

| Package | Strings | Description |
|---------|---------|-------------|
| **ui** | ~150 | UI components (buttons, labels, forms) |
| **system** | ~50 | System messages (errors, notifications) |
| **public** | ~50 | Public pages (about, downloads, terms) |

---

## 🔄 TRANSLATION INHERITANCE

### Fallback Chain

```
Selected Language
    ↓ (if key missing)
Fallback Language 1 (en for hi, zh)
    ↓ (if key missing)
Russian (ru) — Ultimate fallback
    ↓ (if key missing)
[MISSING: key] — Explicit marker
```

### Inheritance Configuration

```json
{
  "fallback": {
    "default": "ru",
    "byLanguage": {
      "hi": ["hi", "en", "ru"],
      "zh": ["zh", "en", "ru"],
      "tt": ["tt", "ru"],
      "be": ["be", "ru"]
    }
  }
}
```

---

## 📝 TRANSLATION FORMATS

### Supported Formats

| Format | Use Case | Example |
|--------|----------|---------|
| **Plain Text** | Simple strings | `"Save"` |
| **With Variables** | Dynamic content | `"Hello, {name}!"` |
| **With Plurals** | Count-based | `"{count} message" | "{count} messages"` |
| **Rich Text** | HTML/Markdown | `"**Bold** text"` |

### Variable Interpolation

```typescript
// Pattern
"welcome": "Welcome, {name}!",
"unreadCount": "You have {count} unread messages",
"lastSeen": "Last seen {time} ago"

// Usage
t('welcome', { name: 'John' }) // "Welcome, John!"
t('unreadCount', { count: 5 }) // "You have 5 unread messages"
```

---

## ✅ TRANSLATION QUALITY

### Quality Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| **No Empty Strings** | All values must be non-empty | Validation |
| **No HTML Injection** | Sanitize user input | Runtime |
| **Consistent Terminology** | Same term = same translation | Review |
| **Cultural Appropriateness** | Respect local customs | Human review |

### Validation Rules

```typescript
interface TranslationValidation {
  // Structure
  hasAllKeys: boolean;        // All keys from ru present
  noExtraKeys: boolean;       // No unexpected keys
  noEmptyValues: boolean;     // All values non-empty
  
  // Quality
  noHtmlTags: boolean;        // No raw HTML (unless allowed)
  noVariablesMismatch: boolean; // Variables match ru version
  consistentTerminology: boolean; // Terminology consistent
}
```

---

## 🔍 MISSING TRANSLATIONS

### Missing String Structure

```typescript
interface MissingString {
  key: string;
  packageName: string;
  ruValue: string;
  status: 'missing' | 'in-progress' | 'review';
  priority: 'high' | 'medium' | 'low';
  addedAt: string;  // ISO 8601
  assignedTo?: string;
}
```

### Missing String Handling

```typescript
// When translation is missing:
// 1. Log to i18n-missing-strings.json
// 2. Return explicit marker
// 3. Notify i18n-team

function handleMissingTranslation(key: string, lang: string): string {
  // Log missing string
  logMissingString(key, lang);
  
  // Return explicit marker
  return `[MISSING: ${key}]`;
}
```

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "translationModel": {
    "keyNaming": "camelCase",
    "categories": ["ui", "system", "public", "technical"],
    "packages": {
      "ui": { "stringCount": 150, "coverage": 96.7 },
      "system": { "stringCount": 50, "coverage": 96.7 },
      "public": { "stringCount": 50, "coverage": 96.7 }
    },
    "formats": ["plain", "variables", "plurals", "rich-text"],
    "validation": {
      "noEmptyStrings": true,
      "noHtmlInjection": true,
      "consistentTerminology": true
    },
    "missingHandling": {
      "marker": "[MISSING: {key}]",
      "logging": true,
      "notification": true
    }
  }
}
```

### Template Variables

```typescript
interface TranslationTemplate {
  key: string;
  value: string;
  language: string;
  packageName: string;
  variables?: string[];
  isMissing?: boolean;
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_LANGUAGE_MODEL.md](./I18N_LANGUAGE_MODEL.md) — Language model
- [I18N_COVERAGE_POLICY.md](./I18N_COVERAGE_POLICY.md) — Coverage policy
- [../state/i18n-packages.json](../state/i18n-packages.json) — Package registry
- [../state/i18n-missing-strings.json](../state/i18n-missing-strings.json) — Missing strings

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
