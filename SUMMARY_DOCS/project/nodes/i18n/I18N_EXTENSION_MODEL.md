---
title: I18N Extension Model
description: Модель расширения i18n-системы Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - extension-model
  - scalability
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/i18n/I18N_NEW_LANGUAGE_PLAYBOOK.md
---

# 🔗 I18N EXTENSION MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **как i18n-система расширяется** для добавления новых языков, пакетов и функций.

**Цель:** Обеспечить масштабируемую архитектуру без ручного изменения кода.

---

## 📈 EXTENSION POINTS

### 1. Adding New Languages

**Extension Type:** Language Registry

**Current State:** Code-based (temporary)  
**Future State:** Technical zone managed

```typescript
// Current (code-based)
export type Language = 'ru' | 'en' | 'tt' | ... | 'kk';  // Add to type

// Future (state-based)
// Add to i18n-languages.json
{
  "languageId": "kk",
  "canonicalName": "Kazakh",
  "nativeName": "Қазақ",
  "status": "planned"
}
```

**Steps:**
1. Add language metadata to `i18n-languages.json`
2. Upload translation file via technical zone UI
3. Validate coverage (≥80% for activation)
4. Activate language
5. No code changes required

---

### 2. Adding New Translation Packages

**Extension Type:** Package Registry

```typescript
// Add to i18n-packages.json
{
  "packageId": "marketing",
  "packageName": "Marketing Content",
  "packageType": "content",
  "description": "Marketing and promotional content",
  "owner": "marketing-team",
  "stringCount": 100,
  "coverageTarget": 90
}
```

**Steps:**
1. Define package metadata
2. Add to `i18n-packages.json`
3. Create translation keys
4. Translate to all active languages
5. Deploy

---

### 3. Adding New Translation Keys

**Extension Type:** Translation Surface

```typescript
// Add to Russian first (source of truth)
export const ru: Translation = {
  // ... existing keys
  newFeature: 'Новая функция',
};

// Then translate to other languages
export const en: Translation = {
  // ... existing keys
  newFeature: 'New Feature',
};
```

**Steps:**
1. Add key to Russian translation
2. Generate scaffolding for other languages
3. Translate keys
4. Validate all languages have key
5. Deploy

---

### 4. Adding New Fallback Chains

**Extension Type:** Fallback Configuration

```json
// Add to i18n-languages.json
{
  "languageId": "kk",
  "fallbackChain": ["kk", "ru"]
}
```

**Custom Fallback Example:**
```json
{
  "fallback": {
    "byLanguage": {
      "hi": ["hi", "en", "ru"],
      "zh": ["zh", "en", "ru"],
      "kk": ["kk", "ru"],
      "default": ["ru"]
    }
  }
}
```

---

## 🏗️ ARCHITECTURE FOR EXTENSIBILITY

### Current Architecture (Code-Based)

```
┌─────────────────────────────────────────┐
│  Code Files (messenger/src/i18n/)      │
│  ├── types.ts (Language type)          │
│  ├── locales/ru.ts                     │
│  ├── locales/en.ts                     │
│  └── locales/[lang].ts                 │
└─────────────────────────────────────────┘
                    ↓
            Manual code edit required
                    ↓
            Rebuild application
```

### Future Architecture (Technical Zone Managed)

```
┌─────────────────────────────────────────┐
│  Technical Zone UI                      │
│  ┌─────────────────────────────────┐   │
│  │  Language Management            │   │
│  │  - Add language                 │   │
│  │  - Upload translations          │   │
│  │  - Validate coverage            │   │
│  │  - Activate/deactivate          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Canonical State Files                  │
│  ├── i18n-languages.json               │
│  ├── i18n-packages.json                │
│  └── i18n-translation-coverage.json    │
└─────────────────────────────────────────┘
                    ↓
            Auto-generate code
                    ↓
            Hot reload / Rebuild
```

---

## 🔄 EXTENSION WORKFLOWS

### Workflow: Add Language

```
1. Request (anyone)
   ↓
2. Create metadata (i18n-team)
   ↓
3. Upload translations (translator)
   ↓
4. Validate (automated)
   ↓
5. Review (reviewer)
   ↓
6. Approve (admin)
   ↓
7. Activate (i18n-team)
   ↓
8. Deploy (automated)
```

### Workflow: Add Package

```
1. Define package (owner)
   ↓
2. Add to registry (i18n-team)
   ↓
3. Create keys (owner)
   ↓
4. Translate (translators)
   ↓
5. Validate (automated)
   ↓
6. Deploy (automated)
```

### Workflow: Add Keys

```
1. Identify need (developer)
   ↓
2. Add to ru.ts (developer)
   ↓
3. Generate scaffolding (automated)
   ↓
4. Translate (translators)
   ↓
5. Validate (automated)
   ↓
6. Deploy (automated)
```

---

## 📊 SCALABILITY CONSIDERATIONS

### Language Limit

**Current:** 12 languages  
**Scalable to:** 100+ languages

**Considerations:**
- Translation file size
- Load time per language
- UI selector performance
- Storage requirements

### Package Limit

**Current:** 3 packages (ui, system, public)  
**Scalable to:** 50+ packages

**Considerations:**
- Package dependencies
- Loading strategy (lazy vs eager)
- Version compatibility

### String Limit

**Current:** 250 strings  
**Scalable to:** 10,000+ strings

**Considerations:**
- Key organization (namespaces)
- Search and discovery
- Translation memory

---

## 🔧 TECHNICAL IMPLEMENTATION

### State-Driven Architecture

```typescript
// Load languages from state
async function loadLanguages(): Promise<Language[]> {
  const state = await fetch('/api/i18n/state/languages.json');
  return state.languages;
}

// Load translations dynamically
async function loadTranslations(lang: string): Promise<Translation> {
  const translations = await fetch(`/api/i18n/translations/${lang}.json`);
  return translations;
}

// Check language availability
function isLanguageAvailable(lang: string): boolean {
  const state = getI18nState();
  return state.languages.some(l => l.languageId === lang && l.enabled);
}
```

### Hot Reload Support

```typescript
// Listen for language changes
window.addEventListener('i18n-language-changed', (event) => {
  const { lang, translations } = event.detail;
  updateTranslations(lang, translations);
});

// Reload translations without page refresh
async function reloadLanguage(lang: string) {
  const translations = await loadTranslations(lang);
  window.dispatchEvent(new CustomEvent('i18n-language-changed', {
    detail: { lang, translations }
  }));
}
```

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "extensionModel": {
    "extensionPoints": [
      "add-language",
      "add-package",
      "add-keys",
      "add-fallback-chain"
    ],
    "workflows": {
      "addLanguage": ["request", "metadata", "translations", "validate", "review", "approve", "activate", "deploy"],
      "addPackage": ["define", "register", "create-keys", "translate", "validate", "deploy"],
      "addKeys": ["identify", "add-to-ru", "scaffold", "translate", "validate", "deploy"]
    },
    "scalability": {
      "languages": "100+",
      "packages": "50+",
      "strings": "10000+"
    },
    "architecture": {
      "current": "code-based",
      "future": "technical-zone-managed"
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_NEW_LANGUAGE_PLAYBOOK.md](./I18N_NEW_LANGUAGE_PLAYBOOK.md) — Add language guide
- [I18N_MANAGEMENT_MODEL.md](./I18N_MANAGEMENT_MODEL.md) — Management model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
