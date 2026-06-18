---
title: I18N Language Management Contract
description: Контракт управления языками Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - management
  - contract
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_MANAGEMENT_MODEL.md
  - SUMMARY_DOCS/state/i18n-management-map.json
---

# 📜 I18N LANGUAGE MANAGEMENT CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот контракт определяет **обязательные правила для управления языками** в Balloo.

**Цель:** Гарантировать контролируемое и аудируемое управление языками из технической зоны.

---

## ✅ MUST RULES

### 1. Roles Must Be Defined

**All management roles MUST be explicitly defined.**

```typescript
// ✅ REQUIRED
interface ManagementRoles {
  admin: string[];        // Full access
  i18n-team: string[];    // Language management
  translator: string[];   // Translation updates
  reviewer: string[];     // Translation review
  user: string[];         // Language selection
}
```

### 2. Permissions Must Be Enforced

**All actions MUST check permissions.**

```typescript
// ✅ REQUIRED
function addLanguage(lang: Language, actor: string) {
  if (!hasPermission(actor, 'language.add')) {
    throw new Error('Permission denied');
  }
  // Proceed with addition
}

// ❌ FORBIDDEN
function addLanguage(lang: Language, actor: string) {
  // No permission check
  languages.push(lang);
}
```

### 3. Audit Trail Must Be Maintained

**All management actions MUST be logged.**

```typescript
// ✅ REQUIRED
interface AuditLogEntry {
  id: string;
  timestamp: string;       // ISO 8601
  actor: string;           // User ID or role
  action: string;          // e.g., "language.add"
  target: string;          // e.g., "language:kk"
  changes: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
}
```

### 4. Validation Must Precede Activation

**Languages MUST be validated before activation.**

```typescript
// ✅ REQUIRED
async function activateLanguage(langId: string, actor: string) {
  // 1. Check permission
  if (!hasPermission(actor, 'language.enable')) {
    throw new Error('Permission denied');
  }
  
  // 2. Validate language
  const validation = await validateLanguage(langId);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  // 3. Update state
  languages[langId].status = 'active';
  
  // 4. Log action
  await logAudit({ action: 'language.enable', target: langId, actor });
}
```

### 5. Technical Zone Must Be Source of Management

**Language management MUST be from technical zone.**

- No manual code file editing
- Management via UI or API
- State files are source of truth

---

## 📋 SHOULD RULES

### 1. Changes Should Be Reviewed

**Significant changes SHOULD require review.**

| Change Type | Review Required | Approver |
|-------------|-----------------|----------|
| Add language | ✅ Yes | Admin |
| Enable/disable | ✅ Yes | Admin |
| Update priority | ✅ Yes | Admin |
| Update translations | ✅ Yes | Reviewer |
| Delete language | ✅ Yes | CTO |

### 2. Audit Log Should Be Retained

**Audit logs SHOULD be retained for 90 days.**

```typescript
// ✅ RECOMMENDED
const auditConfig = {
  enabled: true,
  retention: '90 days',
  storage: 'database'
};
```

### 3. Notifications Should Be Sent

**Stakeholders SHOULD be notified of changes.**

```typescript
// ✅ RECOMMENDED
async function notifyLanguageChange(change: LanguageChange) {
  await notify('i18n-team', `Language ${change.langId} ${change.action}`);
  await notify('devops', `Deployment required for ${change.langId}`);
}
```

---

## 🚫 MUST NOT RULES

### 1. No Unauthorized Changes

**Changes MUST NOT be made without proper authorization.**

```typescript
// ❌ FORBIDDEN
function deleteLanguage(langId: string, actor: string) {
  // No permission check
  delete languages[langId];
}

// ✅ REQUIRED
function deleteLanguage(langId: string, actor: string) {
  if (!hasPermission(actor, 'language.delete')) {
    throw new Error('Permission denied: language.delete');
  }
  // Proceed with deletion
}
```

### 2. No Silent Failures

**Failures MUST NOT be silent.**

```typescript
// ❌ FORBIDDEN
function updateTranslation(langId: string, data: any) {
  try {
    languages[langId].translations = data;
  } catch (e) {
    // Silent failure
  }
}

// ✅ REQUIRED
function updateTranslation(langId: string, data: any) {
  try {
    languages[langId].translations = data;
    logAudit({ action: 'translation.update', target: langId });
  } catch (e) {
    logError(e);
    notify('i18n-team', `Translation update failed for ${langId}`);
    throw e;
  }
}
```

### 3. No State Inconsistency

**State MUST NOT become inconsistent.**

```typescript
// ❌ FORBIDDEN
function updateLanguage(langId: string, changes: any) {
  // Partial update without rollback
  languages[langId].status = changes.status;
  languages[langId].coverage = changes.coverage;
  // If second line fails, state is inconsistent
}

// ✅ REQUIRED
function updateLanguage(langId: string, changes: any) {
  const previousState = { ...languages[langId] };
  try {
    Object.assign(languages[langId], changes);
    logAudit({ action: 'language.update', target: langId, changes });
  } catch (e) {
    // Rollback
    languages[langId] = previousState;
    throw e;
  }
}
```

---

## 🔐 MACHINE-BINDING NOTES

### Permission Matrix

```json
{
  "permissions": {
    "language.add": ["admin", "i18n-team"],
    "language.update": ["admin", "i18n-team"],
    "language.delete": ["admin"],
    "language.enable": ["admin", "i18n-team"],
    "language.disable": ["admin", "i18n-team"],
    "language.priority.change": ["admin"],
    "translation.update": ["admin", "i18n-team", "translator"],
    "translation.approve": ["admin", "i18n-team", "reviewer"],
    "audit.view": ["admin", "i18n-team"]
  }
}
```

### Audit Schema

```json
{
  "auditLog": {
    "fields": ["id", "timestamp", "actor", "action", "target", "changes", "status"],
    "retention": "90 days",
    "storage": "database",
    "events": [
      "language.add",
      "language.update",
      "language.enable",
      "language.disable",
      "translation.update",
      "translation.approve"
    ]
  }
}
```

---

## 📊 COMPLIANCE STATUS

### Current Compliance

| Rule | Status | Notes |
|------|--------|-------|
| Roles defined | ✅ Documented | In i18n-management-map.json |
| Permissions enforced | ⏳ Pending | Needs implementation |
| Audit trail | ⏳ Pending | Needs implementation |
| Validation before activation | ⏳ Pending | Needs implementation |
| Technical zone managed | ⏳ Future | Architecture defined |

---

## 📖 RELATED DOCUMENTS

- [I18N_MANAGEMENT_MODEL.md](../../i18n/I18N_MANAGEMENT_MODEL.md) — Management model
- [I18N_POLICY.md](../../i18n/I18N_POLICY.md) — Language policy
- [../../state/i18n-management-map.json](../../state/i18n-management-map.json) — Management mapping

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
