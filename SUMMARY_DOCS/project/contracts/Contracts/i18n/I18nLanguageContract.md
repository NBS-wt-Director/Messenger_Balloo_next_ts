---
title: I18N Language Contract
description: Контракт языка Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - language
  - contract
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_LANGUAGE_MODEL.md
  - SUMMARY_DOCS/state/i18n-languages.json
---

# 📜 I18N LANGUAGE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот контракт определяет **обязательные правила для языков** в Balloo.

**Цель:** Гарантировать консистентность метаданных, статусов и жизненного цикла языков.

---

## ✅ MUST RULES

### 1. Language Must Have Valid ID

**All languages MUST have a valid languageId.**

```typescript
// ✅ CORRECT
{ languageId: "ru", canonicalName: "Russian", ... }
{ languageId: "en", canonicalName: "English", ... }

// ❌ FORBIDDEN
{ languageId: "", ... }  // Empty
{ languageId: "russian", ... }  // Not ISO code
```

### 2. Language Must Have Required Fields

**All languages MUST have these required fields:**

```typescript
interface RequiredLanguageFields {
  languageId: string;        // ISO 639 code
  canonicalName: string;     // English name
  nativeName: string;        // Name in native script
  status: LanguageStatus;    // active | partial | planned | deprecated
  priority: number;          // 1-12
  category: LanguageCategory; // primary | international | regional
}
```

### 3. Russian Must Be Primary

**Russian (ru) MUST be the primary language.**

- Priority MUST be 1
- Category MUST be "primary"
- MUST be source of truth for all translations

### 4. Status Must Be Valid

**Language status MUST be one of:**

| Status | Description | UI Visible | Runtime |
|--------|-------------|------------|---------|
| **active** | Fully supported | ✅ Yes | ✅ Yes |
| **partial** | Partial coverage (>80%) | ✅ Yes | ✅ Yes |
| **planned** | In development | ❌ No | ❌ No |
| **deprecated** | Being phased out | ⚠️ Warning | ⚠️ Warning |

### 5. Priority Must Be Unique

**Each language MUST have a unique priority.**

```typescript
// ✅ CORRECT
ru: 1, en: 2, tt: 3, ...

// ❌ FORBIDDEN
ru: 1, en: 1  // Duplicate priority
```

---

## 📋 SHOULD RULES

### 1. ISO Codes Should Be Provided

**Languages SHOULD have ISO 639 codes when available.**

```typescript
// ✅ RECOMMENDED
{
  languageId: "ru",
  iso639_1: "ru",
  iso639_2: "rus"
}

// ⚠️ ACCEPTABLE (for languages without 2-letter code)
{
  languageId: "sah",
  iso639_1: null,
  iso639_2: "sah",
  iso639_3: "sah"
}
```

### 2. Region Should Be Specified for Regional Languages

**Regional languages SHOULD specify their region.**

```typescript
// ✅ RECOMMENDED
{
  languageId: "tt",
  category: "regional",
  region: "Tatarstan"
}
```

### 3. Coverage Should Be Tracked

**Language coverage SHOULD be tracked and updated.**

```typescript
// ✅ RECOMMENDED
{
  languageId: "hi",
  coverage: {
    ui: 80,
    system: 80,
    public: 75,
    overall: 80
  }
}
```

---

## 🚫 MUST NOT RULES

### 1. No Duplicate Language IDs

**Language IDs MUST be unique.**

```typescript
// ❌ FORBIDDEN
[
  { languageId: "ru", ... },
  { languageId: "ru", ... }  // Duplicate
]
```

### 2. No Invalid Status Transitions

**Languages MUST NOT transition through invalid states.**

```
✅ Valid: planned → partial → active → deprecated
❌ Invalid: planned → active (skip partial)
❌ Invalid: active → planned (backward)
```

### 3. No Activation Without Validation

**Languages MUST NOT be activated without validation.**

```typescript
// ❌ FORBIDDEN
function activateLanguage(lang: string) {
  languages[lang].status = "active";  // No validation
}

// ✅ REQUIRED
function activateLanguage(lang: string) {
  const validation = validateLanguage(lang);
  if (validation.coverage >= 80 && validation.valid) {
    languages[lang].status = "active";
  }
}
```

---

## 🔐 MACHINE-BINDING NOTES

### Validation Schema

```json
{
  "language": {
    "requiredFields": [
      "languageId",
      "canonicalName",
      "nativeName",
      "status",
      "priority",
      "category"
    ],
    "validStatuses": ["active", "partial", "planned", "deprecated"],
    "validCategories": ["primary", "international", "regional"],
    "constraints": {
      "uniquePriority": true,
      "uniqueLanguageId": true,
      "primaryLanguageIsRu": true
    }
  }
}
```

### Build-Time Validation

```typescript
// Future: Build-time validation
function validateLanguages(): ValidationResult {
  const errors = [];
  
  // Check for duplicate IDs
  const ids = languages.map(l => l.languageId);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate language IDs: ${duplicates.join(', ')}`);
  }
  
  // Check for duplicate priorities
  const priorities = languages.map(l => l.priority);
  const priorityDuplicates = priorities.filter((p, i) => priorities.indexOf(p) !== i);
  if (priorityDuplicates.length > 0) {
    errors.push(`Duplicate priorities found`);
  }
  
  // Check Russian is primary
  const ru = languages.find(l => l.languageId === 'ru');
  if (ru?.category !== 'primary' || ru?.priority !== 1) {
    errors.push('Russian must be primary with priority 1');
  }
  
  return { valid: errors.length === 0, errors };
}
```

---

## 📊 COMPLIANCE STATUS

### Current Compliance

| Rule | Status | Notes |
|------|--------|-------|
| Valid language ID | ✅ Compliant | All 12 languages have valid IDs |
| Required fields | ✅ Compliant | All fields present |
| Russian as primary | ✅ Compliant | ru is priority 1, category primary |
| Valid status | ✅ Compliant | All statuses valid |
| Unique priority | ✅ Compliant | All priorities unique |
| No duplicate IDs | ✅ Compliant | No duplicates |
| Validation before activation | ⚠️ Partial | Needs implementation |

---

## 📖 RELATED DOCUMENTS

- [I18N_LANGUAGE_MODEL.md](../../i18n/I18N_LANGUAGE_MODEL.md) — Language model
- [I18N_POLICY.md](../../i18n/I18N_POLICY.md) — Language policy
- [../../state/i18n-languages.json](../../state/i18n-languages.json) — Language registry
- [../../state/i18n-language-priority.json](../../state/i18n-language-priority.json) — Priority map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
