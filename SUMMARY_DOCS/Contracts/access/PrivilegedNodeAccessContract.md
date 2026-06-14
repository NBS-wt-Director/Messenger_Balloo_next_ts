---
title: Privileged Node Access Contract
description: Контракт доступа к привилегированным узлам Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - contract
  - privileged
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/playbooks/privileged-node-access-playbook.md
---

# 📜 PRIVILEGED NODE ACCESS CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **доступ к привилегированным узлам** (Group A).

**Цель:** Обеспечить машиночитаемую спецификацию для AI-codegen и runtime validation.

---

## 🗂️ PRIVILEGED NODES

### Node List

```json
{
  "privilegedNodes": {
    "groupA": [
      {
        "nodeId": "projectgeneralsettings.working.balloo.su",
        "purpose": "Access management authority",
        "defaultAccess": "creator-superadmin-only",
        "delegationAllowed": true
      },
      {
        "nodeId": "kodegen.working.balloo.su",
        "purpose": "Code generation",
        "defaultAccess": "creator-superadmin-only",
        "delegationAllowed": true,
        "legacyAliases": ["kpdegen.working.balloo.su"]
      },
      {
        "nodeId": "pilot-future.working.balloo.su",
        "purpose": "Future features pilot",
        "defaultAccess": "creator-superadmin-only",
        "delegationAllowed": true
      },
      {
        "nodeId": "nodes-switcher.working.balloo.su",
        "purpose": "Node version switching",
        "defaultAccess": "creator-superadmin-only",
        "delegationAllowed": true
      }
    ]
  }
}
```

---

## 🔐 ACCESS CRITERIA

### Default Access

| Node Group | Default Access | Override |
|------------|---------------|----------|
| **A (Privileged)** | creator-superadmin only | Explicit delegation |

### Delegation Requirements

```json
{
  "delegationRequirements": {
    "delegator": "creator-superadmin",
    "delegableRole": "delegated-node-admin",
    "delegationType": "explicit-per-node",
    "auditLevel": "maximum",
    "approvalRequired": "creator-superadmin",
    "forbiddenDelegation": [
      "further-delegation",
      "cross-environment",
      "wildcard-permissions"
    ]
  }
}
```

---

## ⚠️ PROTECTED ACTIONS

### Privileged Actions List

```json
{
  "privilegedActions": [
    {
      "action": "access:grant:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "access:revoke:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "access:delegate:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "role:assign:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "role:revoke:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "environment:bind:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "environment:promote:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "node:switch-version:*",
      "minRole": "delegated-node-admin",
      "minLevel": "L8",
      "auditLevel": "maximum",
      "delegable": true
    },
    {
      "action": "codegen:execute:*",
      "minRole": "delegated-node-admin",
      "minLevel": "L8",
      "auditLevel": "maximum",
      "delegable": true
    },
    {
      "action": "codegen:deploy:*",
      "minRole": "delegated-node-admin",
      "minLevel": "L8",
      "auditLevel": "maximum",
      "delegable": true
    },
    {
      "action": "system:configure:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    },
    {
      "action": "node:admin:*",
      "minRole": "delegated-node-admin",
      "minLevel": "L8",
      "auditLevel": "maximum",
      "delegable": true
    },
    {
      "action": "node:superadmin:*",
      "minRole": "creator-superadmin",
      "minLevel": "L10",
      "auditLevel": "maximum",
      "delegable": false
    }
  ]
}
```

---

## 🔒 SECURITY REQUIREMENTS

### Authentication

```json
{
  "authenticationRequirements": {
    "mfaRequired": true,
    "sessionTimeout": "15m",
    "ipRestrictions": "recommended",
    "deviceTrust": "recommended",
    "credentialRotation": "90d"
  }
}
```

### Authorization

```json
{
  "authorizationRequirements": {
    "roleCheck": true,
    "scopeCheck": true,
    "environmentCheck": true,
    "delegationCheck": true,
    "nodeGroupCheck": true
  }
}
```

### Audit

```json
{
  "auditRequirements": {
    "auditLevel": "maximum",
    "logRetention": "90d",
    "logFields": [
      "eventType",
      "timestamp",
      "actor",
      "target",
      "action",
      "result",
      "nodeId",
      "sessionId"
    ],
    "alertOnAnomaly": true,
    "realTimeMonitoring": true
  }
}
```

---

## 📋 INVARIANTS

### Critical Invariants

| ID | Invariant | Enforcement | Error Message |
|----|-----------|-------------|---------------|
| PN001 | Group A default deny | Runtime + Codegen | "Group A nodes default to deny" |
| PN002 | creator-superadmin only default | Runtime + Codegen | "Group A requires creator-superadmin or explicit delegation" |
| PN003 | Maximum audit for privileged actions | Runtime | "Privileged action not logged at maximum level" |
| PN004 | No implicit delegation | Runtime + Codegen | "Implicit delegation is forbidden for Group A" |
| PN005 | MFA required | Runtime | "MFA required for privileged node access" |
| PN006 | Session timeout enforced | Runtime | "Session timeout for privileged access" |

---

## 🤖 CODEGEN INSTRUCTIONS

### For AI Code Generation

```typescript
// Privileged Node Access Contract for Codegen
interface PrivilegedNodeAccessContract {
  privilegedNodes: string[];
  defaultAccess: 'creator-superadmin-only';
  delegationAllowed: true;
  delegableRole: 'delegated-node-admin';
  
  securityRequirements: {
    mfaRequired: true;
    sessionTimeout: '15m';
    auditLevel: 'maximum';
    logRetention: '90d';
  };
  
  protectedActions: Array<{
    action: string;
    minRole: string;
    minLevel: string;
    auditLevel: string;
    delegable: boolean;
  }>;
  
  invariants: string[];
}
```

### Validation Rules

```typescript
// AI must validate:
function validatePrivilegedNodeAccess(
  user: User,
  nodeId: string,
  action: string
): boolean {
  // Check if node is privileged
  if (!isPrivilegedNode(nodeId)) {
    return checkStandardAccess(user, nodeId, action);
  }
  
  // Group A: Default deny
  if (user.role !== 'creator-superadmin') {
    // Check explicit delegation
    if (!hasExplicitDelegation(user, nodeId)) {
      throw new AccessError('Group A nodes require explicit delegation');
    }
  }
  
  // Check MFA
  if (!user.mfaVerified) {
    throw new AccessError('MFA required for privileged node access');
  }
  
  // Check action authorization
  if (!isActionAuthorized(user, action, nodeId)) {
    throw new AccessError(`Action ${action} not authorized on ${nodeId}`);
  }
  
  // Log at maximum level
  auditLog({
    level: 'maximum',
    eventType: 'privileged_access',
    user: user.id,
    node: nodeId,
    action: action,
    timestamp: new Date().toISOString()
  });
  
  return true;
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](../../access/ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](../../access/ACCESS_ROLE_MODEL.md) — Role model
- [../../playbooks/privileged-node-access-playbook.md](../../playbooks/privileged-node-access-playbook.md) — Privileged node playbook
- [../../state/access-node-map.json](../../state/access-node-map.json) — Node map

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
