---
title: Access Codegen Playbook
description: Playbook для AI-codegen по доступу Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - access
  - playbook
  - codegen
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_CODEGEN_INSTRUCTIONS.md
  - SUMMARY_DOCS/contracts/access/AccessCodegenContract.md
---

# 🤖 ACCESS CODEGEN PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот playbook определяет **процесс AI-codegen для доступа** к узлам Balloo.

**Цель:** Обеспечить корректную генерацию кода для access control.

---

## 👥 ROLES

| Role | Responsibility |
|------|---------------|
| **AI Codegen** | Generates access control code |
| **Reviewer** | Reviews generated code |
| **creator-superadmin** | Final authority |

---

## 📋 CODEGEN TRIGGERS

### Access Policy Changes

| Trigger | Codegen Action |
|---------|---------------|
| New role defined | Generate role validation |
| New scope defined | Generate scope validation |
| New node group | Generate node binding |
| Policy update | Regenerate access checks |

### Node Changes

| Trigger | Codegen Action |
|---------|---------------|
| New node added | Generate node access rules |
| Node group changed | Update access rules |
| Node deprecated | Generate deprecation warnings |

### User Changes

| Trigger | Codegen Action |
|---------|---------------|
| New user class | Generate user validation |
| Role assignment changed | Update access checks |
| Delegation changed | Update delegation rules |

---

## 🔄 CODEGEN PROCESS

### Phase 1: Context Loading

**Actor:** AI Codegen

**Actions:**
1. Load access policy contract
2. Load role contract
3. Load scope contract
4. Load node binding contract
5. Load delegation contract

**Context Files:**
```
SUMMARY_DOCS/contracts/access/AccessPolicyContract.md
SUMMARY_DOCS/contracts/access/AccessRoleContract.md
SUMMARY_DOCS/contracts/access/AccessScopeContract.md
SUMMARY_DOCS/contracts/access/AccessNodeBindingContract.md
SUMMARY_DOCS/contracts/access/AccessDelegationContract.md
SUMMARY_DOCS/state/access-roles.json
SUMMARY_DOCS/state/access-scopes.json
SUMMARY_DOCS/state/access-node-map.json
```

### Phase 2: Validation Rules Generation

**Actor:** AI Codegen

**Generate:**
1. Role validation functions
2. Scope validation functions
3. Node binding validation
4. Delegation validation
5. Access check functions

**Example Output:**
```typescript
// Generated access validation
function validateAccess(user: User, node: Node, action: string): boolean {
  // Check role
  if (!isValidRole(user.role)) {
    throw new AccessError('Invalid role');
  }
  
  // Check node group access
  if (!hasNodeGroupAccess(user.role, node.nodeGroup)) {
    throw new AccessError('No access to node group');
  }
  
  // Check action scope
  if (!hasScope(user.scopes, action)) {
    throw new AccessError('Missing required scope');
  }
  
  // Check delegation (for Group A)
  if (node.nodeGroup === 'A' && user.role !== 'creator-superadmin') {
    if (!hasExplicitDelegation(user.id, node.nodeId)) {
      throw new AccessError('Group A requires explicit delegation');
    }
  }
  
  return true;
}
```

### Phase 3: Invariant Enforcement

**Actor:** AI Codegen

**Enforce Invariants:**
1. creator-superadmin authority
2. Least privilege
3. Environment separation
4. No implicit admin
5. Audit trail

**Example:**
```typescript
// Generated invariant checks
const INVARIANTS = {
  CREATOR_SUPERADMIN_EMAIL: 'o8eryuhtin@yandex.ru',
  ACCESS_MANAGEMENT_NODE: 'projectgeneralsettings.working.balloo.su',
  MAX_AUTHORITY_LEVEL: 'L10',
  GROUP_A_DEFAULT_DENY: true,
  NO_IMPLICIT_ADMIN: true,
  ENVIRONMENT_SEPARATION: true
};

function checkInvariants(): void {
  if (creatorSuperadmin.email !== INVARIANTS.CREATOR_SUPERADMIN_EMAIL) {
    throw new InvariantError('creator-superadmin email mismatch');
  }
  
  if (accessManagementNode !== INVARIANTS.ACCESS_MANAGEMENT_NODE) {
    throw new InvariantError('Access management node mismatch');
  }
}
```

### Phase 4: Access Control Code Generation

**Actor:** AI Codegen

**Generate:**
1. Access control middleware
2. Role-based access control (RBAC)
3. Scope-based access control
4. Delegation checks
5. Audit logging

**Example:**
```typescript
// Generated access middleware
function accessMiddleware(requiredRole: string, requiredScopes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const node = req.node;
    
    try {
      // Check role
      if (user.role !== requiredRole && !hasHigherRole(user.role, requiredRole)) {
        return res.status(403).json({ error: 'Insufficient role' });
      }
      
      // Check scopes
      for (const scope of requiredScopes) {
        if (!user.scopes.includes(scope)) {
          return res.status(403).json({ error: `Missing scope: ${scope}` });
        }
      }
      
      // Check Group A
      if (node.nodeGroup === 'A' && user.role !== 'creator-superadmin') {
        const delegation = await getDelegation(user.id, node.nodeId);
        if (!delegation) {
          return res.status(403).json({ error: 'Group A requires explicit delegation' });
        }
      }
      
      // Log access
      await auditLog({
        eventType: 'access_check',
        userId: user.id,
        nodeId: node.nodeId,
        action: req.method,
        result: 'allowed',
        timestamp: new Date().toISOString()
      });
      
      next();
    } catch (error) {
      await auditLog({
        eventType: 'access_check',
        userId: user.id,
        nodeId: node.nodeId,
        action: req.method,
        result: 'denied',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      return res.status(403).json({ error: error.message });
    }
  };
}
```

### Phase 5: Testing Code Generation

**Actor:** AI Codegen

**Generate:**
1. Unit tests for access functions
2. Integration tests for access flows
3. Security tests for access bypass
4. Performance tests for access checks

**Example:**
```typescript
// Generated access tests
describe('Access Control', () => {
  describe('validateAccess', () => {
    it('should allow creator-superadmin to all nodes', () => {
      const user = { role: 'creator-superadmin', scopes: ['*'] };
      const node = { nodeId: 'projectgeneralsettings.working.balloo.su', nodeGroup: 'A' };
      
      expect(validateAccess(user, node, 'admin:*')).toBe(true);
    });
    
    it('should deny public-user to Group A', () => {
      const user = { role: 'public-user', scopes: ['read:public'] };
      const node = { nodeId: 'kodegen.working.balloo.su', nodeGroup: 'A' };
      
      expect(() => validateAccess(user, node, 'read:*'))
        .toThrow('No access to node group');
    });
    
    it('should require explicit delegation for Group A', () => {
      const user = { role: 'delegated-node-admin', scopes: ['admin:node'] };
      const node = { nodeId: 'kodegen.working.balloo.su', nodeGroup: 'A' };
      
      // Without delegation
      expect(() => validateAccess(user, node, 'admin:node'))
        .toThrow('Group A requires explicit delegation');
      
      // With delegation
      mockDelegation(user.id, node.nodeId);
      expect(validateAccess(user, node, 'admin:node')).toBe(true);
    });
  });
});
```

---

## ⚠️ CODEGEN RULES

### Must Follow

| Rule | Description |
|------|-------------|
| **Use contracts** | Always reference contract files |
| **Enforce invariants** | All invariants must be enforced |
| **Audit logging** | All access checks must be logged |
| **Least privilege** | Default deny, explicit allow |
| **Environment separation** | No cross-environment access |

### Must Not Do

| Rule | Description |
|------|-------------|
| **No hardcoded roles** | Use contract-defined roles |
| **No implicit admin** | Explicit checks only |
| **No bypass** | All checks must run |
| **No logging skip** | All checks must log |

---

## 📊 CODEGEN QUALITY CHECKS

### Pre-Commit

- [ ] All contracts referenced
- [ ] All invariants enforced
- [ ] All access checks logged
- [ ] Tests generated
- [ ] Documentation updated

### Pre-Deploy

- [ ] All tests pass
- [ ] Security review complete
- [ ] Performance acceptable
- [ ] Rollback plan ready

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "accessCodegenPlaybook": {
    "triggers": ["policy-change", "node-change", "user-change"],
    "phases": ["context-loading", "validation-rules", "invariant-enforcement", "access-control-generation", "testing-generation"],
    "contextFiles": [
      "AccessPolicyContract.md",
      "AccessRoleContract.md",
      "AccessScopeContract.md",
      "AccessNodeBindingContract.md",
      "AccessDelegationContract.md"
    ],
    "rules": {
      "mustFollow": ["use-contracts", "enforce-invariants", "audit-logging", "least-privilege", "environment-separation"],
      "mustNotDo": ["no-hardcoded-roles", "no-implicit-admin", "no-bypass", "no-logging-skip"]
    },
    "qualityChecks": {
      "preCommit": ["contracts-referenced", "invariants-enforced", "access-logged", "tests-generated", "docs-updated"],
      "preDeploy": ["tests-pass", "security-review", "performance-ok", "rollback-ready"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_CODEGEN_INSTRUCTIONS.md](../access/ACCESS_CODEGEN_INSTRUCTIONS.md) — Codegen instructions
- [../contracts/access/AccessCodegenContract.md](../contracts/access/AccessCodegenContract.md) — Codegen contract
- [access-grant-playbook.md](./access-grant-playbook.md) — Access grant playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
