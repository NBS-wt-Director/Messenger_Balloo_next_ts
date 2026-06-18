---
title: Access Codegen Instructions
description: Инструкции для AI-codegen по генерации access layer
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - access
  - codegen
  - instructions
  - ai
related_docs:
  - SUMMARY_DOCS/contracts/access/AccessCodegenContract.md
  - SUMMARY_DOCS/playbooks/access-codegen-playbook.md
---

# 🤖 ACCESS CODEGEN INSTRUCTIONS

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эти инструкции определяют **правила генерации access/auth layer** для AI-codegen.

**Цель:** Обеспечить корректную и безопасную генерацию кода контроля доступа.

---

## 📚 SOURCE OF TRUTH

### Primary Sources

AI **MUST** read these documents before generating access code:

| Document | Purpose | Priority |
|----------|---------|----------|
| `SUMMARY_DOCS/access/ACCESS_POLICY.md` | Access policy | P0 |
| `SUMMARY_DOCS/access/ACCESS_ROLE_MODEL.md` | Role model | P0 |
| `SUMMARY_DOCS/access/ACCESS_SCOPE_MODEL.md` | Scope model | P0 |
| `SUMMARY_DOCS/state/access-roles.json` | Role registry | P0 |
| `SUMMARY_DOCS/state/access-scopes.json` | Scope registry | P0 |
| `SUMMARY_DOCS/state/access-node-map.json` | Node map | P0 |
| `SUMMARY_DOCS/state/access-policy-manifest.json` | Policy manifest | P0 |

### Secondary Sources

| Document | Purpose | Priority |
|----------|---------|----------|
| `SUMMARY_DOCS/contracts/access/AccessCodegenContract.md` | Codegen contract | P1 |
| `SUMMARY_DOCS/access/ACCESS_DELEGATION_MODEL.md` | Delegation model | P1 |
| `SUMMARY_DOCS/access/ACCESS_ENVIRONMENT_POLICY.md` | Environment policy | P1 |

---

## 👑 CREATOR-SUPERADMIN HANDLING

### Hardcoded Constants

AI **MUST** use these exact values:

```typescript
// ✅ CORRECT
const CREATOR_SUPERADMIN = {
  name: "Оберюхтин Иван Анатольевич",
  email: "o8eryuhtin@yandex.ru",
  role: "creator-superadmin",
  authorityLevel: "L10"
};

// ❌ WRONG - Do not change values
const CREATOR_SUPERADMIN = {
  name: "Admin",  // WRONG
  email: "admin@balloo.su",  // WRONG
  role: "admin",  // WRONG
  authorityLevel: "L9"  // WRONG
};
```

### Override Logic

AI **MUST** generate creator-superadmin override in all access checks:

```typescript
// ✅ CORRECT
function checkAccess(user: User, node: Node): boolean {
  // creator-superadmin always has access
  if (user.role === 'creator-superadmin') {
    return true;
  }
  
  // ... rest of checks
}

// ❌ WRONG - Missing creator override
function checkAccess(user: User, node: Node): boolean {
  // Missing creator-superadmin check!
  return user.roles.includes(node.requiredRole);
}
```

---

## 🏛️ ACCESS MANAGEMENT AUTHORITY

### Authority Node

AI **MUST** recognize this as the access management authority:

```typescript
const ACCESS_MANAGEMENT_AUTHORITY = 'projectgeneralsettings.working.balloo.su';
```

### Authority Node Handling

```typescript
// ✅ CORRECT
if (nodeId === ACCESS_MANAGEMENT_AUTHORITY) {
  // Apply maximum security
  requireAuthLevel('maximum');
  requireRole('creator-superadmin');
  enableAuditLogging('maximum');
}

// ❌ WRONG - Treating as regular node
if (nodeId === ACCESS_MANAGEMENT_AUTHORITY) {
  // Using standard checks - WRONG!
  checkStandardAccess(user, nodeId);
}
```

---

## 🗂️ NODE GROUP HANDLING

### Group A: Privileged Technical Nodes

AI **MUST** apply special handling:

```typescript
// ✅ CORRECT - Group A handling
const PRIVILEGED_NODES = [
  'projectgeneralsettings.working.balloo.su',
  'kodegen.working.balloo.su',
  'pilot-future.working.balloo.su',
  'nodes-switcher.working.balloo.su'
];

function checkGroupAAccess(user: User, nodeId: string): boolean {
  // Default: creator-superadmin only
  if (user.role !== 'creator-superadmin') {
    // Check explicit delegation
    if (!hasExplicitDelegation(user, nodeId)) {
      return false;  // Deny by default
    }
  }
  return true;
}

// ❌ WRONG - Using standard access check
function checkGroupAAccess(user: User, nodeId: string): boolean {
  // This would allow company-staff access - WRONG!
  return checkStandardAccess(user, nodeId);
}
```

### Node Group Matrix

AI **MUST** use this matrix:

| Node Group | Default Access | Delegation Allowed | Auth Level |
|------------|---------------|-------------------|------------|
| **A** | creator-superadmin only | ✅ Explicit | Maximum |
| **B** | company-staff | ✅ | Standard |
| **C** | alpha-volunteer | ❌ | Standard |
| **D** | sandbox-operator | ❌ | Standard |
| **E** | public-user | ❌ | Optional |

---

## 🎭 ROLE HANDLING

### Role Definitions

AI **MUST** use these exact role IDs:

```typescript
const ROLES = {
  CREATOR_SUPERADMIN: 'creator-superadmin',
  DELEGATED_NODE_ADMIN: 'delegated-node-admin',
  COMPANY_STAFF: 'company-staff',
  ALPHA_STAFF: 'alpha-staff',
  ALPHA_VOLUNTEER: 'alpha-volunteer',
  SANDBOX_OPERATOR: 'sandbox-operator',
  PUBLIC_USER: 'public-user'
} as const;
```

### Role Level Enforcement

AI **MUST** enforce role levels:

```typescript
// ✅ CORRECT
const ROLE_LEVELS: Record<string, number> = {
  'creator-superadmin': 10,
  'delegated-node-admin': 8,
  'company-staff': 6,
  'alpha-staff': 5,
  'alpha-volunteer': 4,
  'sandbox-operator': 3,
  'public-user': 1
};

function checkRoleLevel(userRole: string, requiredLevel: number): boolean {
  return ROLE_LEVELS[userRole] >= requiredLevel;
}

// ❌ WRONG - Hardcoded checks
function checkRoleLevel(userRole: string, requiredLevel: number): boolean {
  if (userRole === 'admin') return true;  // WRONG role name
  return false;
}
```

---

## 🎯 SCOPE HANDLING

### Scope Format

AI **MUST** use this format:

```
{resource}:{action}:{target}
```

**Examples:**
- `node:read:*` — Read all nodes
- `node:write:sandbox` — Write to sandbox nodes
- `access:grant:*` — Grant access (privileged)

### Privileged Scopes

AI **MUST** recognize these as privileged:

```typescript
const PRIVILEGED_SCOPES = [
  'access:grant:*',
  'access:revoke:*',
  'access:delegate:*',
  'role:assign:*',
  'role:revoke:*',
  'environment:bind:*',
  'environment:promote:*',
  'node:switch-version:*',
  'node:admin:*',
  'node:superadmin:*',
  'codegen:execute:*',
  'system:configure:*',
  'production:deploy:*',
  'production:promote:*'
];

function isPrivilegedScope(scope: string): boolean {
  return PRIVILEGED_SCOPES.includes(scope);
}
```

### Forbidden Scope Patterns

AI **MUST NOT** generate:

```typescript
// ❌ FORBIDDEN - Wildcard all
const scope = '*:*:*';  // Only creator-superadmin

// ❌ FORBIDDEN - Wildcard admin
const scope = 'node:admin:*';  // Too broad

// ❌ FORBIDDEN - Wildcard access
const scope = 'access:*:*';  // Only creator-superadmin

// ❌ FORBIDDEN - Wildcard environment
const scope = 'environment:*:*';  // Only creator-superadmin
```

---

## 🌍 ENVIRONMENT SEPARATION

### Environment Definitions

AI **MUST** use these environment IDs:

```typescript
const ENVIRONMENTS = {
  PRODUCTION: 'production',
  ALPHA: 'alpha',
  WORKING: 'working'
} as const;
```

### Separation Rules

AI **MUST** enforce:

```typescript
// ✅ CORRECT - Environment separation
function checkEnvironmentAccess(user: User, targetEnv: string): boolean {
  // creator-superadmin has all environment access
  if (user.role === 'creator-superadmin') {
    return true;
  }
  
  // No automatic carryover
  if (user.environment !== targetEnv) {
    // Check explicit cross-environment access
    if (!hasExplicitEnvironmentAccess(user, targetEnv)) {
      return false;
    }
  }
  
  // Production requires explicit authorization
  if (targetEnv === 'production' && !user.productionAccess) {
    return false;
  }
  
  return true;
}

// ❌ WRONG - No environment separation
function checkEnvironmentAccess(user: User, targetEnv: string): boolean {
  // This allows sandbox user to access production - WRONG!
  return true;
}
```

---

## ⚠️ LEGACY ALIAS HANDLING

### Legacy Alias Map

AI **MUST** recognize and handle:

```typescript
const LEGACY_ALIASES: Record<string, string> = {
  'kpdegen.working.balloo.su': 'kodegen.working.balloo.su'
};

function resolveNodeId(nodeId: string): string {
  if (LEGACY_ALIASES[nodeId]) {
    console.warn(`Legacy alias used: ${nodeId}. Use canonical: ${LEGACY_ALIASES[nodeId]}`);
    return LEGACY_ALIASES[nodeId];
  }
  return nodeId;
}
```

### Usage Rules

| Context | AI Must |
|---------|---------|
| **New code** | Use canonical names only |
| **Comments** | Document legacy if relevant |
| **Migration** | Provide migration path |
| **Validation** | Warn on legacy usage |

---

## 🔒 SAFE DEFAULTS

### Default Access Rules

AI **MUST** use these defaults:

| Node Type | Default Access | Rationale |
|-----------|---------------|-----------|
| **Group A** | Deny | Privileged nodes |
| **Group B** | company-staff | Internal nodes |
| **Group C** | alpha-volunteer | Alpha testing |
| **Group D** | sandbox-operator | Sandbox |
| **Group E** | public-user | Public surface |

### Default Deny Pattern

```typescript
// ✅ CORRECT - Deny by default
function checkNodeAccess(user: User, nodeId: string): boolean {
  const nodeGroup = getNodeGroup(nodeId);
  
  // Group A: Default deny
  if (nodeGroup === 'A') {
    return false;  // Deny unless explicitly allowed
  }
  
  // ... check explicit permissions
}

// ❌ WRONG - Allow by default
function checkNodeAccess(user: User, nodeId: string): boolean {
  // This allows access unless denied - WRONG!
  return true;
}
```

---

## 🔍 AUDIT LOGGING

### Required Audit Events

AI **MUST** generate logging for:

| Event | Log Fields |
|-------|------------|
| **Access Grant** | actor, target, scope, timestamp, nodeId |
| **Access Revoke** | actor, target, scope, timestamp, nodeId |
| **Role Assignment** | actor, target, role, timestamp |
| **Privileged Action** | actor, action, node, result, timestamp |
| **Delegation Change** | delegator, delegatee, scope, timestamp |

### Audit Log Template

```typescript
// ✅ CORRECT - Audit logging
async function grantAccess(actor: User, target: User, scope: Scope, nodeId: string) {
  // ... grant logic
  
  // Log the action
  await auditLog({
    eventType: 'access_grant',
    actor: { id: actor.id, role: actor.role, email: actor.email },
    target: { id: target.id, role: target.role },
    scope,
    nodeId,
    timestamp: new Date().toISOString()
  });
}

// ❌ WRONG - No audit logging
async function grantAccess(actor: User, target: User, scope: Scope, nodeId: string) {
  // ... grant logic
  // Missing audit log!
}
```

---

## 🤖 CODEGEN VALIDATION CHECKLIST

### Pre-Generation

- [ ] Read ACCESS_POLICY.md
- [ ] Read ACCESS_ROLE_MODEL.md
- [ ] Read ACCESS_SCOPE_MODEL.md
- [ ] Read access-roles.json
- [ ] Read access-scopes.json
- [ ] Read access-node-map.json
- [ ] Read access-policy-manifest.json

### During Generation

- [ ] Use creator-superadmin override
- [ ] Apply Group A special handling
- [ ] Enforce role levels
- [ ] Check scope compatibility
- [ ] Enforce environment separation
- [ ] Handle legacy aliases
- [ ] Apply safe defaults

### Post-Generation

- [ ] Validate no wildcard permissions
- [ ] Validate no implicit admin
- [ ] Validate no cross-environment
- [ ] Validate audit logging present
- [ ] Validate creator-superadmin handling
- [ ] Validate Group A handling

---

## 📖 RELATED DOCUMENTS

- [AccessCodegenContract.md](../contracts/access/AccessCodegenContract.md) — Codegen contract
- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) — Role model
- [ACCESS_SCOPE_MODEL.md](./ACCESS_SCOPE_MODEL.md) — Scope model
- [../playbooks/access-codegen-playbook.md](../playbooks/access-codegen-playbook.md) — Codegen playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
