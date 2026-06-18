---
title: Access Scope Contract
description: Контракт области доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - contract
  - scopes
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_SCOPE_MODEL.md
  - SUMMARY_DOCS/state/access-scopes.json
---

# 📜 ACCESS SCOPE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **области доступа (scopes)** платформы Balloo.

**Цель:** Обеспечить машиночитаемую спецификацию для AI-codegen и runtime validation.

---

## 📊 SCOPE DEFINITIONS

### Schema

```json
{
  "scopes": {
    "type": "array",
    "items": {
      "type": "object",
      "required": ["scopeId", "category", "accessType"],
      "properties": {
        "scopeId": { "type": "string" },
        "displayName": { "type": "string" },
        "description": { "type": "string" },
        "category": { "type": "string", "enum": ["read", "write", "admin", "deploy", "configure"] },
        "accessType": { "type": "string", "enum": ["node", "environment", "system"] },
        "combinable": { "type": "boolean" }
      }
    }
  }
}
```

### Scope List

```json
{
  "scopes": [
    {
      "scopeId": "read:*",
      "displayName": "Read All",
      "category": "read",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "read:public",
      "displayName": "Read Public",
      "category": "read",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "read:internal",
      "displayName": "Read Internal",
      "category": "read",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "write:*",
      "displayName": "Write All",
      "category": "write",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "write:content",
      "displayName": "Write Content",
      "category": "write",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "admin:*",
      "displayName": "Admin All",
      "category": "admin",
      "accessType": "node",
      "combinable": false
    },
    {
      "scopeId": "admin:node",
      "displayName": "Admin Node",
      "category": "admin",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "deploy:*",
      "displayName": "Deploy All",
      "category": "deploy",
      "accessType": "node",
      "combinable": false
    },
    {
      "scopeId": "deploy:version",
      "displayName": "Deploy Version",
      "category": "deploy",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "configure:*",
      "displayName": "Configure All",
      "category": "configure",
      "accessType": "system",
      "combinable": false
    },
    {
      "scopeId": "configure:node",
      "displayName": "Configure Node",
      "category": "configure",
      "accessType": "node",
      "combinable": true
    },
    {
      "scopeId": "access:grant",
      "displayName": "Grant Access",
      "category": "admin",
      "accessType": "system",
      "combinable": false
    },
    {
      "scopeId": "access:revoke",
      "displayName": "Revoke Access",
      "category": "admin",
      "accessType": "system",
      "combinable": false
    },
    {
      "scopeId": "access:delegate",
      "displayName": "Delegate Access",
      "category": "admin",
      "accessType": "system",
      "combinable": false
    }
  ]
}
```

---

## 🔑 SCOPE INVARIANTS

### Critical Invariants

| ID | Invariant | Enforcement | Error Message |
|----|-----------|-------------|---------------|
| S001 | Wildcard scopes non-combinable | Runtime + Codegen | "Wildcard scopes cannot be combined" |
| S002 | Admin scopes restricted | Runtime + Codegen | "Admin scopes require L8+ authority" |
| S003 | Deploy scopes restricted | Runtime + Codegen | "Deploy scopes require L8+ authority" |
| S004 | Access management scopes L10 only | Runtime + Codegen | "Access management requires L10 authority" |
| S005 | Scope category must match action | Runtime | "Scope category does not match action" |

---

## 🎭 SCOPE CATEGORIES

### Read Scopes

| Scope | Description | Min Role |
|-------|-------------|----------|
| read:* | Read all accessible content | public-user |
| read:public | Read public content only | public-user |
| read:internal | Read internal content | company-staff |

### Write Scopes

| Scope | Description | Min Role |
|-------|-------------|----------|
| write:* | Write all accessible content | sandbox-operator |
| write:content | Write content only | sandbox-operator |

### Admin Scopes

| Scope | Description | Min Role |
|-------|-------------|----------|
| admin:* | Full admin (non-combinable) | delegated-node-admin |
| admin:node | Admin specific node | delegated-node-admin |
| access:grant | Grant access to users | creator-superadmin |
| access:revoke | Revoke access from users | creator-superadmin |
| access:delegate | Delegate access to others | creator-superadmin |

### Deploy Scopes

| Scope | Description | Min Role |
|-------|-------------|----------|
| deploy:* | Full deploy (non-combinable) | delegated-node-admin |
| deploy:version | Deploy specific version | delegated-node-admin |

### Configure Scopes

| Scope | Description | Min Role |
|-------|-------------|----------|
| configure:* | Full configure (non-combinable) | creator-superadmin |
| configure:node | Configure specific node | delegated-node-admin |

---

## 🤖 CODEGEN INSTRUCTIONS

### For AI Code Generation

```typescript
// Access Scope Contract for Codegen
interface AccessScopeContract {
  scopes: Array<{
    scopeId: string;
    displayName: string;
    category: 'read' | 'write' | 'admin' | 'deploy' | 'configure';
    accessType: 'node' | 'environment' | 'system';
    combinable: boolean;
  }>;
  
  invariants: string[];
}
```

### Validation Rules

```typescript
// AI must validate:
function validateScopeAssignment(
  user: User,
  scopes: string[]
): boolean {
  // Check wildcard scopes
  const wildcardScopes = scopes.filter(s => s.includes('*'));
  if (wildcardScopes.length > 1) {
    throw new Error('Multiple wildcard scopes not allowed');
  }
  
  // Check admin scopes require L8+
  const adminScopes = scopes.filter(s => 
    s.startsWith('admin:') || s.startsWith('access:')
  );
  if (adminScopes.length > 0 && user.authorityLevelNumeric < 8) {
    throw new Error('Admin scopes require L8+ authority');
  }
  
  // Check access management scopes require L10
  const accessMgmtScopes = scopes.filter(s => 
    s.startsWith('access:')
  );
  if (accessMgmtScopes.length > 0 && user.authorityLevelNumeric < 10) {
    throw new Error('Access management scopes require L10 authority');
  }
  
  return true;
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_SCOPE_MODEL.md](../../access/ACCESS_SCOPE_MODEL.md) — Scope model
- [../../state/access-scopes.json](../../state/access-scopes.json) — Scope registry
- [AccessRoleContract.md](./AccessRoleContract.md) — Role contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
