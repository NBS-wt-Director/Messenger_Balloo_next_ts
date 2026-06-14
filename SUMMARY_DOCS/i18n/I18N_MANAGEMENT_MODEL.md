---
title: I18N Management Model
description: Модель управления языками Balloo — роли, права, процессы
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - management-model
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/state/i18n-management-map.json
---

# 🛠️ I18N MANAGEMENT MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **роли, права и процессы управления языками** в Balloo.

**Цель:** Обеспечить контролируемое добавление и управление языками из технической зоны.

---

## 👥 ROLES & RESPONSIBILITIES

### Role Matrix

| Role | Add Language | Enable/Disable | Update Translation | Change Priority | Delete Language |
|------|-------------|----------------|-------------------|-----------------|-----------------|
| **Admin** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Review |
| **i18n-team** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Suggest | ❌ No |
| **Translator** | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **Reviewer** | ⚠️ Review | ⚠️ Review | ⚠️ Review | ❌ No | ❌ No |
| **User** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### Role Definitions

#### Admin
- **Who:** CTO, Tech Lead
- **Responsibilities:** Final approval for language changes
- **Permissions:** Full access to language management

#### i18n-team
- **Who:** Internationalization team
- **Responsibilities:** Language addition, validation, activation
- **Permissions:** Add, enable, disable, update translations

#### Translator
- **Who:** Professional translators, native speakers
- **Responsibilities:** Translate strings, maintain quality
- **Permissions:** Update translations only

#### Reviewer
- **Who:** Native speakers, quality assurance
- **Responsibilities:** Review translations for accuracy
- **Permissions:** Approve/reject translations

#### User
- **Who:** End users
- **Responsibilities:** Select preferred language
- **Permissions:** Change personal language preference

---

## 🔄 MANAGEMENT PROCESSES

### Process: Add New Language

```
1. Request (anyone)
   ↓
2. Create metadata (i18n-team)
   ↓
3. Prepare translations (translators)
   ↓
4. Validate coverage (i18n-team)
   ↓
5. Review translations (reviewer)
   ↓
6. Approve activation (admin)
   ↓
7. Activate language (i18n-team)
   ↓
8. Deploy (devops)
```

### Process: Update Translations

```
1. Edit translations (translator)
   ↓
2. Validate changes (automated)
   ↓
3. Review changes (reviewer)
   ↓
4. Approve (i18n-team)
   ↓
5. Deploy (automated)
```

### Process: Enable/Disable Language

```
1. Request change (i18n-team)
   ↓
2. Validate impact (automated)
   ↓
3. Approve (admin)
   ↓
4. Update state (i18n-team)
   ↓
5. Deploy (automated)
```

---

## 📋 VALIDATION RULES

### Language Addition Validation

```typescript
interface LanguageAdditionValidation {
  // Metadata
  hasValidId: boolean;           // e.g., "kk"
  hasCanonicalName: boolean;     // e.g., "Kazakh"
  hasNativeName: boolean;        // e.g., "Қазақ"
  hasValidStatus: boolean;       // planned | partial | active
  
  // Translations
  hasTranslationFile: boolean;
  coverageAboveThreshold: boolean;  // >= 80%
  noCriticalMissing: boolean;       // No high-priority missing
  
  // Review
  reviewedByHuman: boolean;
  approvedByAdmin: boolean;
}
```

### Translation Update Validation

```typescript
interface TranslationUpdateValidation {
  // Structure
  allKeysPresent: boolean;       // All keys from ru present
  noExtraKeys: boolean;          // No unexpected keys
  noEmptyValues: boolean;        // All values non-empty
  
  // Quality
  noHtmlInjection: boolean;      // No unsafe HTML
  variablesMatch: boolean;       // Variables match ru version
  terminologyConsistent: boolean; // Consistent terminology
  
  // Review
  reviewedByHuman: boolean;
}
```

---

## 🔐 AUDIT TRAIL

### Audit Log Structure

```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string;           // ISO 8601
  actor: string;               // User ID or role
  action: string;              // e.g., "language.add", "translation.update"
  target: string;              // e.g., "language:kk", "translation:hi"
  changes: Record<string, any>; // Before/after values
  status: 'pending' | 'approved' | 'rejected';
  reviewer?: string;
  reviewComment?: string;
}
```

### Example Audit Log

```json
{
  "entries": [
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
    },
    {
      "id": "audit-002",
      "timestamp": "2026-06-13T11:00:00Z",
      "actor": "translator-1",
      "action": "translation.update",
      "target": "translation:hi",
      "changes": {
        "coverage": { "from": 75, "to": 80 }
      },
      "status": "approved",
      "reviewer": "reviewer-1"
    }
  ]
}
```

---

## 🌐 TECHNICAL ZONE MANAGEMENT

### Management Capabilities

Technical zone can:

1. **View Language Status**
   - Coverage per language
   - Missing strings count
   - Activation status

2. **Add New Languages**
   - Create language metadata
   - Upload translation files
   - Trigger validation

3. **Manage Existing Languages**
   - Enable/disable languages
   - Update priority
   - Modify fallback chain

4. **Audit & Reporting**
   - View audit trail
   - Export coverage reports
   - Track translation progress

### Management API (Future)

```typescript
// Language Management API
interface LanguageManagementAPI {
  // Read
  getLanguages(): Promise<Language[]>;
  getLanguage(id: string): Promise<Language>;
  getCoverage(id: string): Promise<CoverageMetrics>;
  
  // Write
  addLanguage(lang: Language): Promise<void>;
  updateLanguage(id: string, changes: Partial<Language>): Promise<void>;
  deleteLanguage(id: string): Promise<void>;
  
  // Translations
  uploadTranslation(id: string, file: File): Promise<void>;
  validateTranslation(id: string): Promise<ValidationResult>;
  
  // Activation
  enableLanguage(id: string): Promise<void>;
  disableLanguage(id: string): Promise<void>;
  
  // Audit
  getAuditLog(filters?: AuditFilters): Promise<AuditLogEntry[]>;
}
```

---

## 📊 STATE MANAGEMENT

### Management State Structure

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-06-13T00:00:00Z",
  "roles": {
    "admin": ["user-1", "user-2"],
    "i18n-team": ["user-3", "user-4"],
    "translators": ["user-5", "user-6"],
    "reviewers": ["user-7", "user-8"]
  },
  "permissions": {
    "language.add": ["admin", "i18n-team"],
    "language.enable": ["admin", "i18n-team"],
    "translation.update": ["admin", "i18n-team", "translators"],
    "translation.approve": ["admin", "i18n-team", "reviewers"]
  },
  "auditTrail": {
    "enabled": true,
    "retention": "90 days",
    "storage": "database"
  }
}
```

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "managementModel": {
    "roles": ["admin", "i18n-team", "translator", "reviewer", "user"],
    "permissions": {
      "language.add": ["admin", "i18n-team"],
      "language.enable": ["admin", "i18n-team"],
      "translation.update": ["admin", "i18n-team", "translator"],
      "translation.approve": ["admin", "i18n-team", "reviewer"]
    },
    "processes": [
      "add-language",
      "update-translations",
      "enable-disable-language"
    ],
    "validation": {
      "languageAddition": ["metadata", "coverage", "review"],
      "translationUpdate": ["structure", "quality", "review"]
    },
    "auditTrail": {
      "enabled": true,
      "retention": "90 days"
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_LANGUAGE_MODEL.md](./I18N_LANGUAGE_MODEL.md) — Language model
- [../state/i18n-management-map.json](../state/i18n-management-map.json) — Management mapping
- [../contracts/i18n/I18nLanguageManagementContract.md](../contracts/i18n/I18nLanguageManagementContract.md) — Management contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
