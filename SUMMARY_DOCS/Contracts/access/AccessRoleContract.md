---
title: Access Role Contract
description: Контракт роли доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - contract
  - roles
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_ROLE_MODEL.md
  - SUMMARY_DOCS/state/access-roles.json
---

# 📜 ACCESS ROLE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **роли доступа** платформы Balloo.

**Цель:** Обеспечить машиночитаемую спецификацию для AI-codegen и runtime validation.

---

## 📊 ROLE DEFINITIONS

### Schema

```json
{
  "roles": {
    "type": "array",
    "items": {
      "type": "object",
      "required": ["roleId", "displayName", "authorityLevel", "delegable"],
      "properties": {
        "roleId": { "type": "string" },
        "displayName": { "type": "string" },
        "description": { "type": "string" },
        "authorityLevel": { "type": "string", "enum": ["L1", "L3", "L4", "L5", "L6", "L8", "L10"] },
        "authorityLevelNumeric": { "type": "integer", "enum": [1, 3, 4, 5, 6, 8, 10] },
        "delegable": { "type": "boolean" },
        "revocable": { "type": "boolean" }
      }
    }
  }
}
```

### Role List

```json
{
  "roles": [
    {
      "roleId": "creator-superadmin",
      "displayName": "Creator Superadmin",
      "authorityLevel": "L10",
      "authorityLevelNumeric": 10,
      "delegable": true,
      "revocable": false,
      "canonicalHolder": {
        "name": "Оберюхтин Иван Анатольевич",
        "email": "o8eryuhtin@yandex.ru"
      }
    },
    {
      "roleId": "delegated-node-admin",
      "displayName": "Delegated Node Admin",
      "authorityLevel": "L8",
      "authorityLevelNumeric": 8,
      "delegable": false,
      "revocable": true
    },
    {
      "roleId": "company-staff",
      "displayName": "Company Staff",
      "authorityLevel": "L6",
      "authorityLevelNumeric": 6,
      "delegable": false,
      "revocable": true,
      "organization": "NBS-wt"
    },
    {
      "roleId": "alpha-staff",
      "displayName": "Alpha Staff",
      "authorityLevel": "L5",
      "authorityLevelNumeric": 5,
      "delegable": false,
      "revocable": true,
      "zone": "alpha"
    },
    {
      "roleId": "alpha-volunteer",
      "displayName": "Alpha Volunteer",
      "authorityLevel": "L4",
      "authorityLevelNumeric": 4,
      "delegable": false,
      "revocable": true,
      "zone": "alpha"
    },
    {
      "roleId": "sandbox-operator",
      "displayName": "Sandbox Operator",
      "authorityLevel": "L3",
      "authorityLevelNumeric": 3,
      "delegable": false,
      "revocable": true,
      "environment": "working"
    },
    {
      "roleId": "public-user",
      "displayName": "Public User",
      "authorityLevel": "L1",
      "authorityLevelNumeric": 1,
      "delegable": false,
      "revocable": true,
      "environment": "production"
    }
  ]
}
```

---

## 🔑 ROLE INVARIANTS

### Critical Invariants

| ID | Invariant | Enforcement | Error Message |
|----|-----------|-------------|---------------|
| R001 | Exactly one creator-superadmin | Runtime + Codegen | "Multiple creator-superadmin roles detected" |
| R002 | creator-superadmin email fixed | Runtime + Codegen | "creator-superadmin email must be o8eryuhtin@yandex.ru" |
| R003 | creator-superadmin not revocable | Runtime + Codegen | "creator-superadmin role cannot be revoked" |
| R004 | Only creator-superadmin delegable | Runtime + Codegen | "Only creator-superadmin can delegate" |
| R005 | Authority levels fixed | Runtime + Codegen | "Authority level must be one of L1, L3, L4, L5, L6, L8, L10" |

---

## 🎭 ROLE HIERARCHY

### Authority Chain

```
creator-superadmin (L10)
    ↓ (delegates)
delegated-node-admin (L8)
    ↓
company-staff (L6)
    ↓
alpha-staff (L5)
    ↓
alpha-volunteer (L4)
    ↓
sandbox-operator (L3)
    ↓
public-user (L1)
```

### Hierarchy Rules

| Rule | Description |
|------|-------------|
| **No Implicit Inheritance** | Higher role ≠ automatic lower role access |
| **Explicit Delegation** | Delegation must be explicit |
| **Single Delegator** | Only creator-superadmin can delegate |
| **No Further Delegation** | delegated-node-admin cannot delegate |

---

## 🤖 CODEGEN INSTRUCTIONS

### For AI Code Generation

```typescript
// Access Role Contract for Codegen
interface AccessRoleContract {
  roles: Array<{
    roleId: string;
    displayName: string;
    authorityLevel: string;
    authorityLevelNumeric: number;
    delegable: boolean;
    revocable: boolean;
  }>;
  
  creatorSuperadmin: {
    name: "Оберюхтин Иван Анатольевич";
    email: "o8eryuhtin@yandex.ru";
    role: "creator-superadmin";
    authorityLevel: "L10";
  };
  
  invariants: string[];
}
```

### Validation Rules

```typescript
// AI must validate:
function validateRole(role: Role): boolean {
  // Check role ID is valid
  const validRoleIds = [
    'creator-superadmin',
    'delegated-node-admin',
    'company-staff',
    'alpha-staff',
    'alpha-volunteer',
    'sandbox-operator',
    'public-user'
  ];
  
  if (!validRoleIds.includes(role.roleId)) {
    throw new Error(`Invalid role ID: ${role.roleId}`);
  }
  
  // Check authority level is valid
  const validLevels = ['L1', 'L3', 'L4', 'L5', 'L6', 'L8', 'L10'];
  if (!validLevels.includes(role.authorityLevel)) {
    throw new Error(`Invalid authority level: ${role.authorityLevel}`);
  }
  
  // Check creator-superadmin constraints
  if (role.roleId === 'creator-superadmin') {
    if (role.delegable !== true) {
      throw new Error('creator-superadmin must be delegable');
    }
    if (role.revocable !== false) {
      throw new Error('creator-superadmin cannot be revoked');
    }
  }
  
  return true;
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_ROLE_MODEL.md](../../access/ACCESS_ROLE_MODEL.md) — Role model
- [../../state/access-roles.json](../../state/access-roles.json) — Role registry
- [AccessPolicyContract.md](./AccessPolicyContract.md) — Policy contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
