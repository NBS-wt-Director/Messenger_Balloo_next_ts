---
title: Access Delegation Contract
description: Контракт делегирования доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - contract
  - delegation
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_DELEGATION_MODEL.md
  - SUMMARY_DOCS/state/access-delegation-map.json
---

# 📜 ACCESS DELEGATION CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **делегирование доступа** платформы Balloo.

**Цель:** Обеспечить машиночитаемую спецификацию для AI-codegen и runtime validation.

---

## 📊 DELEGATION DEFINITIONS

### Schema

```json
{
  "delegation": {
    "type": "object",
    "required": ["delegator", "delegatee", "targetNode", "role", "scopes"],
    "properties": {
      "delegationId": { "type": "string" },
      "delegator": {
        "type": "object",
        "required": ["userId", "role"],
        "properties": {
          "userId": { "type": "string" },
          "role": { "type": "string", "const": "creator-superadmin" }
        }
      },
      "delegatee": {
        "type": "object",
        "required": ["userId", "role"],
        "properties": {
          "userId": { "type": "string" },
          "role": { "type": "string" }
        }
      },
      "targetNode": { "type": "string" },
      "role": { "type": "string" },
      "scopes": {
        "type": "array",
        "items": { "type": "string" }
      },
      "delegationType": {
        "type": "string",
        "enum": ["temporary", "persistent", "read-only", "operational", "configuration"]
      },
      "expiresAt": { "type": ["string", "null"], "format": "date-time" },
      "createdAt": { "type": "string", "format": "date-time" },
      "status": {
        "type": "string",
        "enum": ["active", "revoked", "expired"]
      }
    }
  }
}
```

---

## 🔑 DELEGATION RULES

### Delegation Authorization

```json
{
  "delegationAuthorization": {
    "onlyDelegator": "creator-superadmin",
    "delegatorNode": "projectgeneralsettings.working.balloo.su",
    "allowedDelegatedRoles": [
      "delegated-node-admin",
      "company-staff",
      "alpha-staff",
      "alpha-volunteer",
      "sandbox-operator"
    ],
    "forbiddenDelegations": [
      "no-self-delegation",
      "no-implicit-admin",
      "no-cross-environment",
      "no-further-delegation",
      "no-wildcard-permissions"
    ]
  }
}
```

### Delegation Types

```json
{
  "delegationTypes": {
    "temporary": {
      "description": "Time-limited delegation",
      "requiresExpiry": true,
      "maxDuration": "90d",
      "renewalRequiresApproval": true
    },
    "persistent": {
      "description": "Indefinite delegation",
      "requiresExpiry": false,
      "maxDuration": null,
      "renewalRequiresApproval": false
    },
    "read-only": {
      "description": "Read access only",
      "allowedScopes": ["read:*", "read:public", "read:internal"],
      "modificationAllowed": false
    },
    "operational": {
      "description": "Operational access",
      "allowedScopes": ["use", "manage", "deploy"],
      "modificationAllowed": true
    },
    "configuration": {
      "description": "Configuration access",
      "allowedScopes": ["configure:*", "configure:node"],
      "modificationAllowed": true
    }
  }
}
```

---

## ⚠️ FORBIDDEN DELEGATIONS

### Forbidden Rules

| Rule | Description | Reason |
|------|-------------|--------|
| **no-self-delegation** | Cannot delegate to self | Redundant |
| **no-implicit-admin** | No implicit admin rights | Least privilege |
| **no-cross-environment** | No cross-environment delegation | Environment isolation |
| **no-further-delegation** | Delegatee cannot redelegate | Chain of trust |
| **no-wildcard-permissions** | No wildcard on privileged nodes | Security |

### Validation

```json
{
  "forbiddenDelegations": [
    {
      "rule": "no-self-delegation",
      "description": "creator-superadmin cannot delegate to self",
      "reason": "Redundant - already has full access"
    },
    {
      "rule": "no-implicit-admin",
      "description": "No implicit admin rights in delegation",
      "reason": "Violates least privilege principle"
    },
    {
      "rule": "no-cross-environment",
      "description": "Cannot delegate across environments",
      "reason": "Violates environment separation"
    },
    {
      "rule": "no-further-delegation",
      "description": "Delegatee cannot redelegate",
      "reason": "Maintains chain of trust"
    },
    {
      "rule": "no-wildcard-permissions",
      "description": "No wildcard permissions on Group A",
      "reason": "Privileged nodes require explicit scopes"
    }
  ]
}
```

---

## 🔄 REVOCATION RULES

### Immediate Revocation

```json
{
  "immediateRevocation": [
    "security_incident",
    "terms_violation",
    "employment_termination",
    "creator-superadmin_request"
  ]
}
```

### Scheduled Revocation

```json
{
  "scheduledRevocation": [
    "delegation_expiry",
    "role_change",
    "environment_change"
  ]
}
```

### Automatic Revocation

```json
{
  "automaticRevocation": [
    "alpha_program_end",
    "sandbox_access_period_end"
  ]
}
```

---

## 🤖 CODEGEN INSTRUCTIONS

### For AI Code Generation

```typescript
// Access Delegation Contract for Codegen
interface AccessDelegationContract {
  delegator: 'creator-superadmin';
  delegatorNode: 'projectgeneralsettings.working.balloo.su';
  
  delegationTypes: {
    temporary: { requiresExpiry: true; maxDuration: '90d' };
    persistent: { requiresExpiry: false };
    'read-only': { allowedScopes: string[]; modificationAllowed: false };
    operational: { allowedScopes: string[]; modificationAllowed: boolean };
    configuration: { allowedScopes: string[]; modificationAllowed: boolean };
  };
  
  forbiddenDelegations: string[];
  revocationRules: {
    immediate: string[];
    scheduled: string[];
    automatic: string[];
  };
}
```

### Validation Rules

```typescript
// AI must validate:
function validateDelegation(delegation: Delegation): boolean {
  // Check delegator is creator-superadmin
  if (delegation.delegator.role !== 'creator-superadmin') {
    throw new Error('Only creator-superadmin can delegate');
  }
  
  // Check no self-delegation
  if (delegation.delegator.userId === delegation.delegatee.userId) {
    throw new Error('Self-delegation is forbidden');
  }
  
  // Check delegated role is allowed
  const allowedRoles = [
    'delegated-node-admin',
    'company-staff',
    'alpha-staff',
    'alpha-volunteer',
    'sandbox-operator'
  ];
  if (!allowedRoles.includes(delegation.delegatee.role)) {
    throw new Error(`Role ${delegation.delegatee.role} cannot be delegated`);
  }
  
  // Check temporary delegation has expiry
  if (delegation.delegationType === 'temporary' && !delegation.expiresAt) {
    throw new Error('Temporary delegation requires expiry');
  }
  
  // Check no further delegation
  if (delegation.delegatee.canDelegate) {
    throw new Error('Further delegation is forbidden');
  }
  
  return true;
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_DELEGATION_MODEL.md](../../access/ACCESS_DELEGATION_MODEL.md) — Delegation model
- [../../state/access-delegation-map.json](../../state/access-delegation-map.json) — Delegation map
- [AccessRoleContract.md](./AccessRoleContract.md) — Role contract
- [../../playbooks/access-grant-playbook.md](../../playbooks/access-grant-playbook.md) — Grant playbook
- [../../playbooks/access-revoke-playbook.md](../../playbooks/access-revoke-playbook.md) — Revoke playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
