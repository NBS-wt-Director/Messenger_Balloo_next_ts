---
title: Access Codegen Contract
description: Контракт для AI-codegen по доступу Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - access
  - codegen
  - contract
  - ai
related_docs:
  - SUMMARY_DOCS/access/ACCESS_CODEGEN_INSTRUCTIONS.md
  - SUMMARY_DOCS/playbooks/access-codegen-playbook.md
---

# 🤖 ACCESS CODEGEN CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **требования к AI-codegen** для генерации access/auth layer.

**Цель:** Обеспечить корректную генерацию guards, checks и access control logic.

---

## 📋 CODEGEN REQUIREMENTS

### Must Generate

| Component | Description | Priority |
|-----------|-------------|----------|
| **Access Guards** | Route/page access guards | P0 |
| **Role Checks** | Role-based authorization | P0 |
| **Scope Checks** | Action-based authorization | P0 |
| **Environment Restrictions** | Environment boundary checks | P0 |
| **Node Bindings** | Node-specific access logic | P0 |
| **Privileged Action Guards** | High-risk action protection | P0 |
| **Delegation Logic** | Per-node delegation support | P1 |
| **Audit Logging** | Access change logging | P1 |

### Must NOT Generate

| Pattern | Reason | Enforcement |
|---------|--------|-------------|
| `*:*:*` scopes | Only creator-superadmin | Hard error |
| Implicit admin inheritance | Forbidden by policy | Hard error |
| Cross-environment access | Environment separation | Hard error |
| Public access to Group A | Privileged nodes | Hard error |
| Wildcard permissions | Security risk | Hard error |
| Hardcoded user emails | Use role-based | Warning |

---

## 🔐 ACCESS GUARD GENERATION

### Guard Template

```typescript
// AI must generate guards like this:
import { AccessGuard } from '@balloo/core-access';
import { Role } from '@balloo/access-roles';
import { Scope } from '@balloo/access-scopes';

export const createNodeAccessGuard = (
  nodeId: string,
  requiredRole: Role,
  requiredScope?: Scope
): AccessGuard => {
  return async (user: User, context: Context) => {
    // Check authentication
    if (!user.isAuthenticated) {
      throw new AccessError('Authentication required');
    }
    
    // Check creator-superadmin override
    if (user.role === 'creator-superadmin') {
      return true;
    }
    
    // Check node group
    const nodeGroup = getNodeGroup(nodeId);
    if (nodeGroup === 'A') {
      // Group A: creator-superadmin + explicit delegated only
      if (user.role !== 'creator-superadmin' && !hasDelegatedAccess(user, nodeId)) {
        throw new AccessError('Group A nodes require explicit delegation');
      }
    }
    
    // Check role
    if (!hasRole(user, requiredRole)) {
      throw new AccessError(`Role ${requiredRole} required`);
    }
    
    // Check scope if specified
    if (requiredScope && !hasScope(user, requiredScope, nodeId)) {
      throw new AccessError(`Scope ${requiredScope} required for node ${nodeId}`);
    }
    
    // Check environment
    if (!checkEnvironmentAccess(user, getNodeEnvironment(nodeId))) {
      throw new AccessError('Environment access denied');
    }
    
    return true;
  };
};
```

### Guard Rules

| Rule | Description | AI Must |
|------|-------------|---------|
| **Authentication First** | Check auth before authorization | ✅ Enforce |
| **Creator Override** | creator-superadmin bypasses checks | ✅ Enforce |
| **Group A Special** | Extra checks for privileged nodes | ✅ Enforce |
| **Role + Scope** | Both role AND scope required | ✅ Enforce |
| **Environment Check** | Verify environment access | ✅ Enforce |
| **Delegation Check** | Check delegated access | ✅ Enforce |

---

## 🎭 ROLE CHECK GENERATION

### Role Check Template

```typescript
// AI must generate role checks like this:
import { Role, RoleLevel } from '@balloo/access-roles';

export const checkRoleAccess = (
  user: User,
  requiredRole: Role,
  nodeId: string
): boolean => {
  const userRoleLevel = getRoleLevel(user.role);
  const requiredRoleLevel = getRoleLevel(requiredRole);
  
  // creator-superadmin always passes
  if (user.role === 'creator-superadmin') {
    return true;
  }
  
  // Check role level
  if (userRoleLevel < requiredRoleLevel) {
    return false;
  }
  
  // Check node group restrictions
  const nodeGroup = getNodeGroup(nodeId);
  if (!isRoleAllowedForGroup(user.role, nodeGroup)) {
    return false;
  }
  
  // Check explicit delegation for Group A
  if (nodeGroup === 'A' && user.role !== 'creator-superadmin') {
    return hasDelegatedAccess(user, nodeId);
  }
  
  return true;
};
```

### Role Matrix for Codegen

| Role | Group A | Group B | Group C | Group D | Group E |
|------|---------|---------|---------|---------|---------|
| creator-superadmin | ✅ | ✅ | ✅ | ✅ | ✅ |
| delegated-node-admin | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit | ⚠️ Explicit |
| company-staff | ❌ | ✅ | ⚠️ | ✅ | ⚠️ Public |
| alpha-staff | ❌ | ❌ | ✅ | ⚠️ | ⚠️ Public |
| alpha-volunteer | ❌ | ❌ | ⚠️ | ❌ | ⚠️ Public |
| sandbox-operator | ❌ | ❌ | ❌ | ✅ | ⚠️ Public |
| public-user | ❌ | ❌ | ❌ | ❌ | ✅ Public |

---

## 🎯 SCOPE CHECK GENERATION

### Scope Check Template

```typescript
// AI must generate scope checks like this:
import { Scope, isPrivilegedScope } from '@balloo/access-scopes';

export const checkScopeAccess = (
  user: User,
  requiredScope: Scope,
  nodeId: string
): boolean => {
  // Check if scope is privileged
  if (isPrivilegedScope(requiredScope)) {
    // Privileged scopes require elevated authorization
    if (user.role === 'creator-superadmin') {
      return true;
    }
    
    if (user.role === 'delegated-node-admin' && hasDelegatedScope(user, requiredScope, nodeId)) {
      return true;
    }
    
    return false;
  }
  
  // Check user scopes
  if (!user.scopes.includes(requiredScope)) {
    return false;
  }
  
  // Check node compatibility
  if (!isScopeCompatibleWithNode(requiredScope, nodeId)) {
    return false;
  }
  
  return true;
};
```

### Privileged Scopes List

AI must treat these as privileged:

```json
{
  "privilegedScopes": [
    "access:grant:*",
    "access:revoke:*",
    "access:delegate:*",
    "role:assign:*",
    "role:revoke:*",
    "environment:bind:*",
    "environment:promote:*",
    "node:switch-version:*",
    "node:admin:*",
    "node:superadmin:*",
    "codegen:execute:*",
    "system:configure:*",
    "production:deploy:*",
    "production:promote:*"
  ]
}
```

---

## 🌍 ENVIRONMENT RESTRICTION GENERATION

### Environment Check Template

```typescript
// AI must generate environment checks like this:
import { Environment } from '@balloo/access-environments';

export const checkEnvironmentAccess = (
  user: User,
  targetEnvironment: Environment
): boolean => {
  const userEnvironment = getUserEnvironment(user);
  
  // creator-superadmin has all environment access
  if (user.role === 'creator-superadmin') {
    return true;
  }
  
  // No automatic carryover between environments
  if (userEnvironment !== targetEnvironment) {
    // Check if user has explicit cross-environment access
    if (!hasExplicitEnvironmentAccess(user, targetEnvironment)) {
      return false;
    }
  }
  
  // Production requires explicit authorization
  if (targetEnvironment === 'production') {
    if (!hasProductionAccess(user)) {
      return false;
    }
  }
  
  return true;
};
```

### Environment Separation Rules

| Rule | AI Must Enforce |
|------|-----------------|
| No automatic carryover | ✅ |
| Production explicit auth | ✅ |
| Working ≠ Production | ✅ |
| Controlled promotion | ✅ |

---

## 🏛️ PRIVILEGED NODE HANDLING

### Group A Node Template

```typescript
// AI must generate special handling for Group A nodes:
import { isPrivilegedNode } from '@balloo/access-nodes';

export const checkPrivilegedNodeAccess = (
  user: User,
  nodeId: string
): boolean => {
  if (!isPrivilegedNode(nodeId)) {
    // Not a privileged node, use standard checks
    return checkStandardNodeAccess(user, nodeId);
  }
  
  // Group A: Privileged Technical Node
  // Default: creator-superadmin only
  
  if (user.role === 'creator-superadmin') {
    return true;
  }
  
  // Check explicit delegation
  if (user.role === 'delegated-node-admin') {
    return hasExplicitDelegation(user, nodeId);
  }
  
  // All other roles denied by default
  return false;
};
```

### Privileged Nodes List

AI must recognize these as privileged:

```json
{
  "privilegedNodes": [
    "projectgeneralsettings.working.balloo.su",
    "kodegen.working.balloo.su",
    "pilot-future.working.balloo.su",
    "nodes-switcher.working.balloo.su"
  ]
}
```

---

## ⚠️ LEGACY ALIAS HANDLING

### Alias Check Template

```typescript
// AI must handle legacy aliases:
import { getCanonicalNodeId } from '@balloo/access-legacy';

export const resolveNodeId = (nodeId: string): string => {
  const legacyAliases: Record<string, string> = {
    'kpdegen.working.balloo.su': 'kodegen.working.balloo.su'
  };
  
  if (legacyAliases[nodeId]) {
    // Log warning
    console.warn(`Legacy node alias used: ${nodeId}. Use canonical: ${legacyAliases[nodeId]}`);
    return legacyAliases[nodeId];
  }
  
  return nodeId;
};
```

### Legacy Alias Rules

| Rule | AI Must |
|------|---------|
| Use canonical in new code | ✅ |
| Warn on legacy usage | ✅ |
| Redirect to canonical | ✅ |
| Document legacy in comments | ✅ |

---

## 🔍 AUDIT LOGGING GENERATION

### Audit Log Template

```typescript
// AI must generate audit logging:
import { auditLog } from '@balloo/audit';

export const logAccessChange = (
  action: 'grant' | 'revoke' | 'delegate',
  actor: User,
  target: User | Role | Node,
  scope?: Scope
): void => {
  auditLog({
    eventType: 'access_change',
    action,
    actor: {
      userId: actor.id,
      role: actor.role,
      email: actor.email
    },
    target: {
      type: target.type,
      id: target.id
    },
    scope,
    timestamp: new Date().toISOString(),
    nodeId: 'projectgeneralsettings.working.balloo.su'
  });
};
```

### Audit Requirements

| Event | Log Required | Retention |
|-------|--------------|-----------|
| Access Grant | ✅ | 90 days |
| Access Revoke | ✅ | 90 days |
| Role Assignment | ✅ | 90 days |
| Privileged Action | ✅ | 90 days |
| Delegation Change | ✅ | 90 days |
| Environment Change | ✅ | 90 days |

---

## 🤖 AI CODEGEN VALIDATION

### Pre-Generation Checks

```typescript
// AI must validate before generating:
interface CodegenValidation {
  // Check source documents
  checkPolicyDocument(): boolean;
  checkRoleModel(): boolean;
  checkScopeModel(): boolean;
  checkNodeMap(): boolean;
  
  // Check invariants
  checkCreatorSuperadmin(): boolean;
  checkAccessManagementAuthority(): boolean;
  checkNodeGroups(): boolean;
  checkEnvironmentSeparation(): boolean;
  
  // Check for forbidden patterns
  checkNoWildcardPermissions(): boolean;
  checkNoImplicitAdmin(): boolean;
  checkNoCrossEnvironment(): boolean;
}
```

### Post-Generation Validation

```typescript
// AI must validate after generating:
interface GeneratedCodeValidation {
  // Check generated guards
  validateAccessGuards(): boolean;
  
  // Check role checks
  validateRoleChecks(): boolean;
  
  // Check scope checks
  validateScopeChecks(): boolean;
  
  // Check environment checks
  validateEnvironmentChecks(): boolean;
  
  // Check audit logging
  validateAuditLogging(): boolean;
  
  // Check for forbidden patterns
  validateNoForbiddenPatterns(): boolean;
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_CODEGEN_INSTRUCTIONS.md](../../access/ACCESS_CODEGEN_INSTRUCTIONS.md) — Codegen instructions
- [ACCESS_POLICY.md](../../access/ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](../../access/ACCESS_ROLE_MODEL.md) — Role model
- [ACCESS_SCOPE_MODEL.md](../../access/ACCESS_SCOPE_MODEL.md) — Scope model
- [../../state/access-roles.json](../../state/access-roles.json) — Role registry
- [../../state/access-scopes.json](../../state/access-scopes.json) — Scope registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
