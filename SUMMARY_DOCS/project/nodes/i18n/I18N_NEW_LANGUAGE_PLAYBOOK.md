---
title: I18N New Language Playbook
description: Пошаговое руководство по добавлению нового языка в Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - playbook
  - new-language
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/i18n/I18N_LANGUAGE_MANAGEMENT.md
  - SUMMARY_DOCS/playbooks/add-language-playbook.md
---

# 📖 I18N NEW LANGUAGE PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Это руководство описывает **процесс добавления нового языка** в Balloo.

**Цель:** Добавить новый язык без ручного изменения кодовых файлов.

---

## 📋 PREREQUISITES

### Required

- [ ] Language metadata prepared (code, name, nativeName)
- [ ] Translation file ready (all strings translated)
- [ ] Reviewer assigned
- [ ] Coverage validated (≥80% for activation)

### Optional

- [ ] ISO 639 codes assigned
- [ ] Region defined (for regional languages)
- [ ] Fallback chain defined

---

## 🚀 ADDITION PROCESS

### Phase 1: Preparation (Technical Zone)

#### Step 1.1: Create Language Metadata

**Location:** `SUMMARY_DOCS/state/i18n-languages.json`

```json
{
  "languageId": "kk",
  "canonicalName": "Kazakh",
  "displayName": "Kazakh",
  "nativeName": "Қазақ",
  "iso639_1": "kk",
  "iso639_2": "kaz",
  "status": "planned",
  "priority": 13,
  "category": "regional",
  "region": "Kazakhstan"
}
```

#### Step 1.2: Create Language Doc

**Location:** `SUMMARY_DOCS/i18n/languages/LANGUAGE_kk.md`

```markdown
---
title: 'Language: Kazakh (kk)'
status: planned
---

# 🇰🇿 LANGUAGE: KAZAKH (kk)

## Language Identity
| Field | Value |
|-------|-------|
| **languageId** | `kk` |
| **canonicalName** | Kazakh |
| **nativeName** | Қазақ |
| **status** | `planned` |
```

---

### Phase 2: Translation (Content Team)

#### Step 2.1: Create Translation File

**Location:** `messenger/src/i18n/locales/kk.ts`

```typescript
import type { Translation } from '../types';

export const kk: Translation = {
  appName: 'Balloo',
  loading: 'Жүктелуде...',
  error: 'Қате',
  // ... all 250 strings
};
```

#### Step 2.2: Validate Translation

```bash
# Check coverage
node scripts/validate-i18n.js --lang kk

# Expected output:
# ✅ Coverage: 100% (250/250)
# ✅ No missing strings
# ✅ File valid
```

---

### Phase 3: Validation (i18n-team)

#### Step 3.1: Run Validation Checks

```bash
# Full validation
node scripts/validate-language.js --lang kk

# Checks:
# ✅ Coverage ≥80%
# ✅ No high-priority missing strings
# ✅ Translation file exists
# ✅ Translation file valid
# ✅ Language metadata complete
```

#### Step 3.2: Human Review

**Reviewer Checklist:**

- [ ] All strings translated
- [ ] Translation accuracy verified
- [ ] No machine translation artifacts
- [ ] Cultural appropriateness checked
- [ ] Technical terms consistent

---

### Phase 4: Activation (Technical Zone)

#### Step 4.1: Update Language Status

**Location:** `SUMMARY_DOCS/state/i18n-languages.json`

```json
{
  "languageId": "kk",
  "status": "active",  // Changed from "planned"
  "coverage": {
    "ui": 100,
    "system": 100,
    "public": 100,
    "technical": 100,
    "overall": 100
  },
  "runtimeAvailability": true,
  "uiAvailability": true
}
```

#### Step 4.2: Update LANGUAGES Array

**Location:** `messenger/src/i18n/types.ts`

```typescript
export const LANGUAGES: LanguageOption[] = [
  // ... existing languages
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ' },
];
```

**Note:** In future state, this step will be automated.

---

### Phase 5: Deployment

#### Step 5.1: Deploy Changes

```bash
# Build and deploy
npm run build
npm run deploy

# Verify in production
curl https://api.balloo.su/i18n/languages
# Should include "kk" in response
```

#### Step 5.2: Verify Runtime

```bash
# Check language availability
curl https://app.balloo.su/api/i18n/available
# Expected: { "languages": ["ru", "en", ..., "kk"] }

# Test translation
curl https://app.balloo.su/api/i18n/t?lang=kk&key=appName
# Expected: { "key": "appName", "value": "Balloo", "lang": "kk" }
```

---

## ✅ VALIDATION CHECKLIST

### Pre-Activation

- [ ] Language metadata complete
- [ ] Translation file created
- [ ] Coverage ≥80%
- [ ] No high-priority missing strings
- [ ] Human review completed
- [ ] Validation script passed

### Post-Activation

- [ ] Status updated to "active"
- [ ] Runtime availability: true
- [ ] UI availability: true
- [ ] Language visible in selector
- [ ] Translations working in runtime

---

## 🔄 ROLLBACK STEPS

### If Issues Found

#### Step R1: Deactivate Language

```json
{
  "languageId": "kk",
  "status": "partial",  // Revert to "partial"
  "uiAvailability": false  // Hide from UI
}
```

#### Step R2: Fix Issues

- Address missing translations
- Fix translation errors
- Re-validate

#### Step R3: Re-activate

- Repeat Phase 4
- Deploy fix

---

## 📊 TIMELINE

| Phase | Duration | Owner |
|-------|----------|-------|
| **Preparation** | 1 day | i18n-team |
| **Translation** | 3-7 days | translators |
| **Validation** | 1-2 days | i18n-team |
| **Activation** | 1 day | devops |
| **Deployment** | 1 day | devops |

**Total:** 7-12 days

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "newLanguagePlaybook": {
    "phases": [
      "preparation",
      "translation",
      "validation",
      "activation",
      "deployment"
    ],
    "validationChecks": [
      "coverage >= 80%",
      "no high-priority missing",
      "file valid",
      "metadata complete",
      "human review"
    ],
    "rollbackSteps": [
      "deactivate",
      "fix issues",
      "re-activate"
    ]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_LANGUAGE_MANAGEMENT.md](./I18N_LANGUAGE_MANAGEMENT.md) — Language management
- [../playbooks/add-language-playbook.md](../playbooks/add-language-playbook.md) — Alternative playbook location

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
