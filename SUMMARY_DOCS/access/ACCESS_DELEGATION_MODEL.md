---
title: Access Delegation Model
description: Модель делегирования доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - delegation
  - rbac
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/access/ACCESS_ROLE_MODEL.md
  - SUMMARY_DOCS/state/access-delegation-map.json
---

# 🔐 ACCESS DELEGATION MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **делегирование доступа** платформы Balloo.

**Цель:** Обеспечить явное per-node делегирование с creator-superadmin authority.

---

## 👑 DELEGATION AUTHORITY

### Sole Delegator

| Field | Value |
|-------|-------|
| **Role** | creator-superadmin |
| **Name** | Оберюхтин Иван Анатольевич |
| **Email** | o8eryuhtin@yandex.ru |
| **Management Node** | projectgeneralsettings.working.balloo.su |

### Delegation Powers

**Can Delegate:**
- Per-node admin access
- Limited operational roles
- Read-only access
- Configuration access
- Time-limited access

**Cannot Delegate:**
- creator-superadmin role itself
- Cross-environment privileges
- Policy override authority
- Further delegation rights

---

## 📊 DELEGATION TYPES

### By Duration

| Type | Description | Max Duration | Renewal |
|------|-------------|--------------|---------|
| **Temporary** | Time-limited access | 90 days | Requires approval |
| **Persistent** | Until revoked | Unlimited | N/A |

### By Scope

| Type | Description | Allowed Scopes |
|------|-------------|----------------|
| **Read-Only** | View access only | read |
| **Operational** | Day-to-day operations | use, manage, deploy |
| **Configuration** | Configuration changes | configure |
| **Admin** | Full node admin | admin (per-node) |

---

## 🗂️ DELEGATION BY NODE GROUP

### Group A: Privileged Technical Nodes

| Rule | Value |
|------|-------|
| **Default Access** | creator-superadmin only |
| **Delegation Allowed** | ✅ Yes, explicit per-node |
| **Delegable Roles** | delegated-node-admin |
| **Delegable Scopes** | node:read, node:write, node:configure, node:admin |
| **Max Duration** | Unlimited (persistent) or 90d (temporary) |
| **Audit Level** | Maximum |
| **Approval Required** | creator-superadmin |

### Group B: Company Internal Nodes

| Rule | Value |
|------|-------|
| **Default Access** | company-staff |
| **Delegation Allowed** | ✅ Yes |
| **Delegable Roles** | delegated-node-admin, company-staff |
| **Delegable Scopes** | node:read, node:use, node:write, docs:write |
| **Max Duration** | Unlimited |
| **Audit Level** | Standard |
| **Approval Required** | creator-superadmin |

### Group C: Alpha Access Nodes

| Rule | Value |
|------|-------|
| **Default Access** | alpha-volunteer + alpha-staff |
| **Delegation Allowed** | ❌ No (role-based only) |
| **Notes** | Access via role assignment, not delegation |

### Group D: Sandbox Nodes

| Rule | Value |
|------|-------|
| **Default Access** | sandbox-operator |
| **Delegation Allowed** | ❌ No (role-based only) |
| **Notes** | Access via role assignment, not delegation |

### Group E: Production Public Nodes

| Rule | Value |
|------|-------|
| **Default Access** | public-user |
| **Delegation Allowed** | ❌ No (public access) |
| **Notes** | Public surface, no delegation needed |

---

## 📋 DELEGATION RULES

### Rule 1: Explicit Delegation Required

```
All delegation MUST be explicit.
No implicit or inherited delegation.
```

### Rule 2: Per-Node Specific

```
Delegation is node-specific.
Delegation to Node A does not grant access to Node B.
```

### Rule 3: No Further Delegation

```
delegated-node-admin CANNOT delegate further.
Single-level delegation only.
```

### Rule 4: Environment Boundaries

```
Delegation cannot cross environment boundaries.
Working delegation ≠ Production access.
```

### Rule 5: Audit Trail

```
All delegation MUST be logged.
Logs retained minimum 90 days.
```

---

## 🔄 DELEGATION LIFECYCLE

### 1. Request

```
Delegator: creator-superadmin
Target: User/Role
Node: Specific node
Scopes: Specific scopes
Duration: Temporary or Persistent
Justification: Required
```

### 2. Approval

```
Approver: creator-superadmin (self-approval for own delegations)
Validation: Check node group, scopes, duration
Decision: Approve or Reject
```

### 3. Grant

```
Action: Assign delegation record
Notification: Notify delegatee
Logging: Log delegation grant
```

### 4. Use

```
Delegatee: Access delegated resources
Monitoring: Track delegated actions
Auditing: Log delegated actions
```

### 5. Revocation

```
Trigger: Expiry, manual revoke, security incident
Action: Remove delegation record
Notification: Notify delegatee
Logging: Log delegation revoke
```

---

## ⚠️ FORBIDDEN DELEGATIONS

| Pattern | Reason | Enforcement |
|---------|--------|-------------|
| **creator-superadmin role** | Canonical unique role | Hard error |
| **Implicit admin inheritance** | Violates least privilege | Hard error |
| **Cross-environment** | Violates environment separation | Hard error |
| **Wildcard permissions** | Security risk | Hard error |
| **Further delegation** | Single-level only | Hard error |

---

## 🔍 DELEGATION EXAMPLES

### Example 1: Delegated Node Admin (Group A)

```json
{
  "delegationId": "del-001",
  "delegator": "creator-superadmin",
  "delegatee": "user-123",
  "role": "delegated-node-admin",
  "node": "kodegen.working.balloo.su",
  "scopes": ["codegen:read:*", "codegen:execute:*"],
  "type": "persistent",
  "duration": null,
  "justification": "Code generation operations",
  "auditLevel": "maximum"
}
```

### Example 2: Temporary Version Switch Access

```json
{
  "delegationId": "del-002",
  "delegator": "creator-superadmin",
  "delegatee": "user-456",
  "role": "delegated-node-admin",
  "node": "nodes-switcher.working.balloo.su",
  "scopes": ["node:switch-version:assigned"],
  "type": "temporary",
  "duration": "7d",
  "justification": "Scheduled maintenance window",
  "auditLevel": "maximum"
}
```

### Example 3: Company Staff Workdocs Access

```json
{
  "delegationId": "del-003",
  "delegator": "creator-superadmin",
  "delegatee": "user-789",
  "role": "company-staff",
  "node": "workdocs.working.balloo.su",
  "scopes": ["docs:read:*", "docs:write:workdocs"],
  "type": "persistent",
  "duration": null,
  "justification": "NBS-wt employee",
  "auditLevel": "standard"
}
```

---

## 🔒 REVOCATION RULES

### Immediate Revocation

| Trigger | Action |
|---------|--------|
| Security incident | Revoke immediately |
| Terms violation | Revoke immediately |
| Employment termination | Revoke immediately |
| creator-superadmin request | Revoke immediately |

### Scheduled Revocation

| Trigger | Action |
|---------|--------|
| Delegation expiry | Revoke at expiry |
| Role change | Review and revoke if needed |
| Environment change | Review and revoke if needed |

### Automatic Revocation

| Trigger | Action |
|---------|--------|
| Alpha program end | Revoke alpha delegations |
| Sandbox period end | Revoke sandbox delegations |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "delegationModel": {
    "soleDelegator": "creator-superadmin",
    "delegableRoles": ["delegated-node-admin"],
    "delegationTypes": ["temporary", "persistent", "read-only", "operational", "configuration"],
    "forbiddenDelegations": [
      "creator-superadmin-role",
      "implicit-admin",
      "cross-environment",
      "wildcard-permissions",
      "further-delegation"
    ],
    "nodeGroupRules": {
      "A": { "delegationAllowed": true, "requiresExplicit": true },
      "B": { "delegationAllowed": true, "requiresExplicit": false },
      "C": { "delegationAllowed": false, "roleBased": true },
      "D": { "delegationAllowed": false, "roleBased": true },
      "E": { "delegationAllowed": false, "public": true }
    },
    "revocationTriggers": [
      "security_incident",
      "terms_violation",
      "employment_termination",
      "creator-superadmin_request",
      "delegation_expiry"
    ]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) — Role model
- [../state/access-delegation-map.json](../state/access-delegation-map.json) — Delegation map
- [../contracts/access/AccessDelegationContract.md](../contracts/access/AccessDelegationContract.md) — Delegation contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
