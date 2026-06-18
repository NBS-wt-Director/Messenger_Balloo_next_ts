---
title: Access Node Binding Contract
description: Контракт привязки узлов доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - contract
  - nodes
  - binding
  - canonical
related_docs:
  - SUMMARY_DOCS/access/NODE_ACCESS_MATRIX.md
  - SUMMARY_DOCS/state/access-node-map.json
---

# 📜 ACCESS NODE BINDING CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **привязку узлов к группам доступа** платформы Balloo.

**Цель:** Обеспечить машиночитаемую спецификацию для AI-codegen и runtime validation.

---

## 📊 NODE BINDING DEFINITIONS

### Schema

```json
{
  "nodeBinding": {
    "type": "object",
    "required": ["nodeId", "canonicalHostname", "nodeGroup", "accessClass"],
    "properties": {
      "nodeId": { "type": "string" },
      "canonicalHostname": { "type": "string" },
      "legacyAliases": {
        "type": "array",
        "items": { "type": "string" }
      },
      "environment": {
        "type": "string",
        "enum": ["production", "alpha", "working"]
      },
      "nodeGroup": {
        "type": "string",
        "enum": ["A", "B", "C", "D", "E"]
      },
      "accessClass": {
        "type": "string",
        "enum": ["privileged", "internal", "alpha", "sandbox", "public"]
      },
      "defaultAllowedRoles": {
        "type": "array",
        "items": { "type": "string" }
      },
      "delegatedAllowedRoles": {
        "type": "array",
        "items": { "type": "string" }
      },
      "accessManagedBy": {
        "type": "string",
        "const": "projectgeneralsettings.working.balloo.su"
      },
      "authRequired": { "type": "boolean" },
      "authLevel": {
        "type": "string",
        "enum": ["optional", "standard", "maximum"]
      },
      "publicVisible": { "type": "boolean" },
      "auditLevel": {
        "type": "string",
        "enum": ["standard", "maximum"]
      }
    }
  }
}
```

---

## 🗂️ NODE GROUP BINDINGS

### Group A: Privileged Technical Nodes

```json
{
  "groupA": {
    "name": "Privileged Technical Nodes",
    "accessClass": "privileged",
    "defaultAccess": "creator-superadmin-only",
    "delegationAllowed": true,
    "delegableRole": "delegated-node-admin",
    "nodes": [
      "projectgeneralsettings.working.balloo.su",
      "kodegen.working.balloo.su",
      "pilot-future.working.balloo.su",
      "nodes-switcher.working.balloo.su"
    ],
    "authLevel": "maximum",
    "auditLevel": "maximum",
    "publicVisible": false
  }
}
```

### Group B: Company Internal Nodes

```json
{
  "groupB": {
    "name": "Company Internal Nodes",
    "accessClass": "internal",
    "defaultAccess": "company-staff",
    "delegationAllowed": false,
    "nodes": [
      "workdocs.working.balloo.su",
      "admin.balloo.su"
    ],
    "authLevel": "standard",
    "auditLevel": "standard",
    "publicVisible": false
  }
}
```

### Group C: Alpha Access Nodes

```json
{
  "groupC": {
    "name": "Alpha Access Nodes",
    "accessClass": "alpha",
    "defaultAccess": "alpha-volunteer",
    "delegationAllowed": false,
    "nodes": [
      "alpha.balloo.su",
      "apps.alpha.balloo.su",
      "2commands.alpha.balloo.su"
    ],
    "authLevel": "standard",
    "auditLevel": "standard",
    "publicVisible": false
  }
}
```

### Group D: Sandbox / Pre-Prod Nodes

```json
{
  "groupD": {
    "name": "Sandbox / Pre-Prod Nodes",
    "accessClass": "sandbox",
    "defaultAccess": "sandbox-operator",
    "delegationAllowed": false,
    "nodes": [
      "working.balloo.su",
      "api.working.balloo.su",
      "files.working.balloo.su",
      "docs.working.balloo.su",
      "future.working.balloo.su",
      "admin.working.balloo.su",
      "workers.working.balloo.su",
      "abaut.working.balloo.su",
      "apps.working.balloo.su"
    ],
    "authLevel": "standard",
    "auditLevel": "standard",
    "publicVisible": false
  }
}
```

### Group E: Production Public Nodes

```json
{
  "groupE": {
    "name": "Production Public Nodes",
    "accessClass": "public",
    "defaultAccess": "public-user",
    "delegationAllowed": false,
    "nodes": [
      "balloo.su",
      "messenger.balloo.su"
    ],
    "authLevel": "optional",
    "auditLevel": "standard",
    "publicVisible": true
  }
}
```

---

## 🔑 NODE BINDING INVARIANTS

### Critical Invariants

| ID | Invariant | Enforcement | Error Message |
|----|-----------|-------------|---------------|
| N001 | Each node belongs to exactly one group | Runtime + Codegen | "Node must belong to exactly one group" |
| N002 | Group A default deny | Runtime + Codegen | "Group A nodes default to deny" |
| N003 | Group A requires maximum auth | Runtime + Codegen | "Group A requires maximum authentication" |
| N004 | Group A requires maximum audit | Runtime + Codegen | "Group A requires maximum audit" |
| N005 | Access managed by canonical node | Runtime + Codegen | "Access must be managed by projectgeneralsettings" |
| N006 | Legacy aliases resolved | Runtime | "Legacy alias must resolve to canonical" |

---

## 🔄 NODE GROUP TRANSITIONS

### Allowed Transitions

| From Group | To Group | Approval Required |
|------------|----------|-------------------|
| D (Sandbox) | E (Production) | creator-superadmin |
| D (Sandbox) | C (Alpha) | alpha-staff |
| C (Alpha) | E (Production) | creator-superadmin |
| B (Internal) | E (Production) | creator-superadmin |

### Forbidden Transitions

| Transition | Reason |
|------------|--------|
| E → D | Production cannot become sandbox |
| E → C | Production cannot become alpha |
| A → Any | Privileged nodes are fixed |

---

## 🤖 CODEGEN INSTRUCTIONS

### For AI Code Generation

```typescript
// Access Node Binding Contract for Codegen
interface AccessNodeBindingContract {
  nodeGroups: {
    A: { name: string; accessClass: 'privileged'; defaultAccess: 'creator-superadmin-only' };
    B: { name: string; accessClass: 'internal'; defaultAccess: 'company-staff' };
    C: { name: string; accessClass: 'alpha'; defaultAccess: 'alpha-volunteer' };
    D: { name: string; accessClass: 'sandbox'; defaultAccess: 'sandbox-operator' };
    E: { name: string; accessClass: 'public'; defaultAccess: 'public-user' };
  };
  
  nodeBindings: Array<{
    nodeId: string;
    canonicalHostname: string;
    nodeGroup: 'A' | 'B' | 'C' | 'D' | 'E';
    accessClass: string;
    defaultAllowedRoles: string[];
    accessManagedBy: 'projectgeneralsettings.working.balloo.su';
  }>;
  
  invariants: string[];
}
```

### Validation Rules

```typescript
// AI must validate:
function validateNodeBinding(node: Node): boolean {
  // Check node group is valid
  const validGroups = ['A', 'B', 'C', 'D', 'E'];
  if (!validGroups.includes(node.nodeGroup)) {
    throw new Error(`Invalid node group: ${node.nodeGroup}`);
  }
  
  // Check Group A constraints
  if (node.nodeGroup === 'A') {
    if (node.authLevel !== 'maximum') {
      throw new Error('Group A requires maximum authentication');
    }
    if (node.auditLevel !== 'maximum') {
      throw new Error('Group A requires maximum audit');
    }
    if (node.publicVisible !== false) {
      throw new Error('Group A cannot be publicly visible');
    }
    if (!node.defaultAllowedRoles.includes('creator-superadmin')) {
      throw new Error('Group A must allow creator-superadmin');
    }
  }
  
  // Check access management authority
  if (node.accessManagedBy !== 'projectgeneralsettings.working.balloo.su') {
    throw new Error('Access must be managed by projectgeneralsettings');
  }
  
  // Check exactly one group
  const groupCount = [node.groupA, node.groupB, node.groupC, node.groupD, node.groupE]
    .filter(Boolean).length;
  if (groupCount !== 1) {
    throw new Error('Node must belong to exactly one group');
  }
  
  return true;
}
```

---

## 📖 RELATED DOCUMENTS

- [NODE_ACCESS_MATRIX.md](../../access/NODE_ACCESS_MATRIX.md) — Node access matrix
- [../../state/access-node-map.json](../../state/access-node-map.json) — Node map
- [AccessPolicyContract.md](./AccessPolicyContract.md) — Policy contract
- [PrivilegedNodeAccessContract.md](./PrivilegedNodeAccessContract.md) — Privileged node contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
