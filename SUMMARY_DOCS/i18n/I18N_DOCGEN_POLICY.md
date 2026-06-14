---
title: I18N Docgen Policy
description: Политика для AI docgen по работе с i18n документацией
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - i18n
  - docgen
  - policy
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/i18n/I18N_CODEGEN_POLICY.md
---

# 📚 I18N DOCGEN POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **правила для AI docgen** при генерации документации по i18n в Balloo.

**Цель:** Обеспечить консистентную документацию с актуальной информацией о языках и переводах.

---

## ✅ CRITICAL RULES FOR AI

### 1. Read From Canonical Sources

**AI MUST read language data from canonical state files.**

```json
// ✅ CORRECT Sources
- SUMMARY_DOCS/state/i18n-languages.json
- SUMMARY_DOCS/state/i18n-translation-coverage.json
- SUMMARY_DOCS/state/i18n-packages.json

// ❌ FORBIDDEN
- Hardcoded language lists
- Outdated documentation
- Assumptions about language availability
```

### 2. Show Accurate Coverage

**AI MUST show accurate coverage from state files.**

```markdown
| Language | Coverage | Status |
|----------|----------|--------|
| ru       | 100%     | ✅     |
| hi       | 80%      | ⚠️     |
```

### 3. List All Supported Languages

**AI MUST list all languages from i18n-languages.json.**

**Current baseline:** 12 languages
- ru, en, tt, hi, zh, be, ba, cv, sah, udm, ce, os

### 4. Show Missing Strings

**AI MUST reference missing strings from state.**

```markdown
## Missing Translations

- **Hindi (hi):** 50 strings missing
- **Chinese (zh):** 50 strings missing

**Full list:** `SUMMARY_DOCS/state/i18n-missing-strings.json`
```

---

## 📋 DOCUMENTATION TEMPLATES

### Language Table Template

```markdown
## Supported Languages

| Code | Name | Native Name | Status | Coverage | Priority |
|------|------|-------------|--------|----------|----------|
{{#each languages}}
| {{code}} | {{name}} | {{nativeName}} | {{status}} | {{coverage}}% | {{priority}} |
{{/each}}

**Total:** {{total}} languages  
**Average Coverage:** {{avgCoverage}}%
```

### Coverage Report Template

```markdown
## Translation Coverage

### By Language

| Language | UI | System | Public | Overall |
|----------|-----|--------|--------|---------|
{{#each languages}}
| {{name}} | {{ui}}% | {{system}}% | {{public}}% | {{overall}}% |
{{/each}}

### Missing Strings

{{#if hasMissing}}
| Language | Missing Keys | Priority |
|----------|-------------|----------|
{{#each missing}}
| {{language}} | {{count}} | {{priority}} |
{{/each}}
{{else}}
All strings translated! ✅
{{/if}}
```

### Package Documentation Template

```markdown
## Translation Packages

{{#each packages}}
### {{packageName}} ({{packageId}})

- **Type:** {{packageType}}
- **Strings:** {{stringCount}}
- **Coverage:** {{avgCoverage}}%
- **Owner:** {{owner}}

**Description:** {{description}}
{{/each}}
```

---

## 🔧 AI GENERATION PATTERNS

### When Asked About Languages

```
AI Response Template:

**Supported Languages in Balloo**

Balloo supports {{total}} languages:

{{languageTable}}

**Source of Truth:** [i18n-languages.json](SUMMARY_DOCS/state/i18n-languages.json)

**Coverage Details:** [i18n-translation-coverage.json](SUMMARY_DOCS/state/i18n-translation-coverage.json)
```

### When Asked About Coverage

```
AI Response Template:

**Translation Coverage Report**

| Metric | Value |
|--------|-------|
| Total Languages | {{total}} |
| Full Coverage (100%) | {{fullCoverage}} |
| Partial Coverage | {{partialCoverage}} |
| Average Coverage | {{avgCoverage}}% |
| Missing Strings | {{totalMissing}} |

**Languages needing attention:**
{{#each belowThreshold}}
- {{name}}: {{coverage}}% ({{missing}} strings missing)
{{/each}}

**Source:** [i18n-translation-coverage.json](SUMMARY_DOCS/state/i18n-translation-coverage.json)
```

### When Asked About Adding Languages

```
AI Response Template:

**Adding a New Language**

To add a new language to Balloo:

1. **Create metadata** in `i18n-languages.json`
2. **Upload translations** via technical zone UI
3. **Validate coverage** (≥80% required)
4. **Review** by native speaker
5. **Activate** language

**Documentation:** [I18N_NEW_LANGUAGE_PLAYBOOK.md](SUMMARY_DOCS/i18n/I18N_NEW_LANGUAGE_PLAYBOOK.md)
```

---

## 📊 DOCUMENTATION STRUCTURE

### Required Sections

1. **Overview**
   - What is i18n in Balloo
   - Supported languages summary
   - Key invariants

2. **Languages**
   - Full language list
   - Language details (per language)
   - Coverage status

3. **Translation**
   - Translation packages
   - Key naming convention
   - Fallback behavior

4. **Management**
   - How to add languages
   - Roles and permissions
   - Audit trail

5. **API Reference**
   - Translation API
   - Management API
   - State files

### Optional Sections

- Missing strings report
- Translation history
- Contributor guide
- FAQ

---

## ⚠️ AI VALIDATION CHECKS

### Before Generating Documentation

- [ ] Read latest state from i18n-languages.json
- [ ] Read coverage from i18n-translation-coverage.json
- [ ] Check for missing strings in i18n-missing-strings.json
- [ ] Verify language count matches state

### After Generating Documentation

- [ ] All 12 languages listed
- [ ] Coverage percentages accurate
- [ ] Missing strings count correct
- [ ] Links to state files working
- [ ] No hardcoded language lists

---

## 🤖 MACHINE-BINDING

### AI System Prompt Addendum

```
When generating documentation for Balloo i18n:

1. ALWAYS read from canonical state files
2. NEVER hardcode language lists or coverage
3. SHOW all 12 supported languages
4. REFERENCE missing strings from state
5. LINK to relevant policy and model docs
6. UPDATE coverage numbers from state files
7. INDICATE status (active/partial/planned)

Canonical sources:
- Languages: SUMMARY_DOCS/state/i18n-languages.json
- Coverage: SUMMARY_DOCS/state/i18n-translation-coverage.json
- Missing: SUMMARY_DOCS/state/i18n-missing-strings.json
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_CODEGEN_POLICY.md](./I18N_CODEGEN_POLICY.md) — Codegen policy
- [I18N_INDEX.md](./I18N_INDEX.md) — Documentation index

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
