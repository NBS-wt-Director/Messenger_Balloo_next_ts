---
title: I18N Language Management
description: Управление языками Balloo из технической зоны
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - language-management
  - technical-zone
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_MANAGEMENT_MODEL.md
  - SUMMARY_DOCS/i18n/I18N_NEW_LANGUAGE_PLAYBOOK.md
  - SUMMARY_DOCS/state/i18n-management-map.json
---

# 🛠️ I18N LANGUAGE MANAGEMENT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот документ описывает **управление языками Balloo из технической зоны**.

**Цель:** Обеспечить централизованное управление языками без ручного изменения кода.

---

## 🌐 TECHNICAL ZONE CAPABILITIES

### What Technical Zone Can Do

| Capability | Description | Status |
|------------|-------------|--------|
| **View Languages** | See all supported languages | ✅ Current |
| **View Coverage** | See translation coverage per language | ✅ Current |
| **Add Language** | Add new language metadata | ⏳ Future |
| **Upload Translations** | Upload translation files via UI | ⏳ Future |
| **Validate Translations** | Run automated validation | ⏳ Future |
| **Enable/Disable** | Toggle language availability | ⏳ Future |
| **Change Priority** | Modify language priority | ⏳ Future |
| **View Audit Log** | See change history | ⏳ Future |

---

## 👥 ROLES & PERMISSIONS

### Management Roles

| Role | Permissions | Members |
|------|-------------|---------|
| **Admin** | Full access | CTO, Tech Lead |
| **i18n-team** | Language management | i18n developers |
| **Translator** | Update translations | Professional translators |
| **Reviewer** | Review translations | Native speakers |
| **User** | Select language | End users |

### Permission Matrix

| Action | Admin | i18n-team | Translator | Reviewer | User |
|--------|-------|-----------|------------|----------|------|
| Add language | ✅ | ✅ | ❌ | ❌ | ❌ |
| Enable/disable | ✅ | ✅ | ❌ | ❌ | ❌ |
| Change priority | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update translations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Review translations | ✅ | ✅ | ❌ | ✅ | ❌ |
| Select language | ✅ | ✅ | ✅ | ✅ | ✅ |
| View audit log | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🔄 MANAGEMENT WORKFLOWS

### Workflow: Add New Language

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADD NEW LANGUAGE WORKFLOW                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Request                                                     │
│     └── Anyone can request new language                         │
│                    ↓                                            │
│  2. Create Metadata (i18n-team)                                 │
│     └── Add to i18n-languages.json                              │
│     └── Set status: "planned"                                   │
│                    ↓                                            │
│  3. Prepare Translations (translators)                          │
│     └── Translate all 250 strings                               │
│     └── Upload via technical zone UI                            │
│                    ↓                                            │
│  4. Validate Coverage (automated)                               │
│     └── Check coverage ≥80%                                     │
│     └── Verify no critical missing strings                      │
│                    ↓                                            │
│  5. Review (reviewer)                                           │
│     └── Native speaker review                                   │
│     └── Approve/reject translations                             │
│                    ↓                                            │
│  6. Approve Activation (admin)                                  │
│     └── Final approval                                          │
│     └── Set status: "active"                                    │
│                    ↓                                            │
│  7. Deploy (automated)                                          │
│     └── Hot reload or rebuild                                   │
│     └── Language available in UI                                │
│                                                                 │
│  Estimated Duration: 7-12 days                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow: Update Translations

```
┌─────────────────────────────────────────────────────────────────┐
│                  UPDATE TRANSLATIONS WORKFLOW                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Edit (translator)                                           │
│     └── Update translation file                                 │
│     └── Submit for review                                       │
│                    ↓                                            │
│  2. Validate (automated)                                        │
│     └── Check structure                                         │
│     └── Verify no empty values                                  │
│                    ↓                                            │
│  3. Review (reviewer)                                           │
│     └── Quality check                                           │
│     └── Approve/reject                                          │
│                    ↓                                            │
│  4. Deploy (automated)                                          │
│     └── Hot reload translations                                 │
│                                                                 │
│  Estimated Duration: 1-3 days                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow: Enable/Disable Language

```
┌─────────────────────────────────────────────────────────────────┐
│                ENABLE/DISABLE LANGUAGE WORKFLOW                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Request (i18n-team)                                         │
│     └── Submit enable/disable request                           │
│     └── Provide reason                                          │
│                    ↓                                            │
│  2. Validate Impact (automated)                                 │
│     └── Check affected users                                    │
│     └── Estimate impact                                         │
│                    ↓                                            │
│  3. Approve (admin)                                             │
│     └── Review impact                                           │
│     └── Approve/reject                                          │
│                    ↓                                            │
│  4. Update State (i18n-team)                                    │
│     └── Set enabled: true/false                                 │
│     └── Log audit entry                                         │
│                    ↓                                            │
│  5. Deploy (automated)                                          │
│     └── Hot reload                                              │
│                                                                 │
│  Estimated Duration: 1-2 days                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 STATE FILES

### Source of Truth

| File | Purpose | Update Method |
|------|---------|---------------|
| `i18n-languages.json` | Language registry | Technical zone UI |
| `i18n-packages.json` | Translation packages | Technical zone UI |
| `i18n-translation-coverage.json` | Coverage tracking | Automated |
| `i18n-runtime-map.json` | Runtime state | Automated |
| `i18n-management-map.json` | Roles & permissions | Admin |
| `i18n-missing-strings.json` | Missing strings | Automated |

### Example: Update Language State

```json
// Before (planned)
{
  "languageId": "kk",
  "status": "planned",
  "coverage": 0
}

// After (active)
{
  "languageId": "kk",
  "status": "active",
  "coverage": 100,
  "enabled": true,
  "runtimeAvailability": true,
  "uiAvailability": true
}
```

---

## 🔍 AUDIT TRAIL

### What Is Logged

| Event | Details Logged |
|-------|---------------|
| Language added | Who, when, metadata |
| Language enabled/disabled | Who, when, reason |
| Translations updated | Who, when, coverage change |
| Priority changed | Who, when, old/new priority |
| Review completed | Who, when, decision |

### Audit Log Structure

```json
{
  "id": "audit-001",
  "timestamp": "2026-06-13T10:00:00Z",
  "actor": "i18n-team",
  "action": "language.add",
  "target": "language:kk",
  "changes": {
    "status": { "from": null, "to": "planned" }
  },
  "status": "approved",
  "reviewer": "admin"
}
```

---

## 🛠️ FUTURE UI FEATURES

### Language Management Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    LANGUAGE MANAGEMENT DASHBOARD                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Languages (12)                                          │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Code  Name        Status    Coverage    Actions       │   │
│  │  ru    Russian     active    100%        [Edit]        │   │
│  │  en    English     active    100%        [Edit]        │   │
│  │  hi    Hindi       active    80%    ⚠️   [Edit]        │   │
│  │  ...                                                     │   │
│  │  [+ Add Language]                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Coverage Overview                                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Average: 96.7%                                          │   │
│  │  Missing: 100 strings                                    │   │
│  │  Languages below threshold: hi, zh                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Recent Activity                                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  [2026-06-13] hi translations updated by translator-1   │   │
│  │  [2026-06-12] zh reviewed by reviewer-zh                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Add Language Form

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADD NEW LANGUAGE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Language ID: [kk _____________] (ISO 639 code)                │
│                                                                 │
│  Canonical Name: [Kazakh _________] (English name)             │
│                                                                 │
│  Native Name: [Қазақ __________] (Name in native script)       │
│                                                                 │
│  Category: [Regional _________▼]                               │
│                                                                 │
│  Region: [Kazakhstan _________] (For regional languages)       │
│                                                                 │
│  Priority: [13 _____________] (Display order)                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Translation File                                        │   │
│  │  [Upload File] or [Create from Template]                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Cancel]  [Save as Planned]  [Validate & Activate]            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "languageManagement": {
    "technicalZone": {
      "capabilities": [
        "view-languages",
        "view-coverage",
        "add-language",
        "upload-translations",
        "validate",
        "enable-disable",
        "change-priority",
        "view-audit"
      ],
      "roles": ["admin", "i18n-team", "translator", "reviewer", "user"],
      "workflows": ["add-language", "update-translations", "enable-disable"],
      "stateFiles": [
        "i18n-languages.json",
        "i18n-packages.json",
        "i18n-translation-coverage.json",
        "i18n-management-map.json"
      ]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_MANAGEMENT_MODEL.md](./I18N_MANAGEMENT_MODEL.md) — Management model
- [I18N_NEW_LANGUAGE_PLAYBOOK.md](./I18N_NEW_LANGUAGE_PLAYBOOK.md) — Add language guide
- [../state/i18n-management-map.json](../state/i18n-management-map.json) — Management mapping

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
