---
title: Access Policy Contract
description: Контракт политики доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - contract
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/state/access-policy-manifest.json
---

# 📜 ACCESS POLICY CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **каноническую политику доступа** платформы Balloo.

**Цель:** Обеспечить машиночитаемую спецификацию для AI-codegen и runtime validation.

---

## 👑 CREATOR-SUPERADMIN

### Schema

```json
{
  "creatorSuperadmin": {
    "type": "object",
    "required": ["name", "email", "role", "authorityLevel"],
    "properties": {
      "name": { "type": "string", "const": "Оберюхтин Иван Анатольевич" },
      "email": { "type": "string", "const": "o8eryuhtin@yandex.ru" },
      "role": { "type": "string", "const": "creator-superadmin" },
      "authorityLevel": { "type": "string", "const": "L10" },
      "immutable": { "type": "boolean", "const": true },
      "revocable": { "type": "boolean", "const": false }
    }
  }
}
```

### Invariants

| Invariant | Value | Enforcement |
|-----------|-------|-------------|
| **Single Creator** | Exactly one creator-superadmin | Runtime + Codegen |
| **Email Fixed** | o8eryuhtin@yandex.ru | Runtime + Codegen |
| **Name Fixed** | Оберюхтин Иван Анатольевич | Runtime + Codegen |
| **Cannot Delegate Own Role** | true | Runtime + Codegen |
| **Cannot Be Revoked** | true | Runtime + Codegen |

---

## 🏛️ ACCESS MANAGEMENT AUTHORITY

### Schema

```json
{
  "accessManagementAuthority": {
    "type": "object",
    "required": ["node", "responsibilities"],
    "properties": {
      "node": {
        "type": "string",
        "const": "projectgeneralsettings.working.balloo.su"
      },
      "responsibilities": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "node-access-assignments",
            "role-binding",
            "environment-restrictions",
            "node-visibility",
            "delegated-access-policies",
            "revocation-rules"
          ]
        }
      }
    }
  }
}
```

### Invariants

| Invariant | Value | Enforcement |
|-----------|-------|-------------|
| **Single Authority Node** | projectgeneralsettings.working.balloo.su | Runtime + Codegen |
| **Group A Classification** | true | Runtime + Codegen |
| **Maximum Auth Level** | true | Runtime + Codegen |
| **Maximum Audit Level** | true | Runtime + Codegen |

---

## 📊 NODE GROUPS

### Schema

```json
{
  "nodeGroups": {
    "type": "object",
    "required": ["A", "B", "C", "D", "E"],
    "properties": {
      "A": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "const": "Privileged Technical Nodes" },
          "access": { "type": "string", "const": "creator-superadmin + explicit delegated" },
          "nodes": {
            "type": "array",
            "items": { "type": "string" },
            "const": [
              "projectgeneralsettings.working.balloo.su",
              "kodegen.working.balloo.su",
              "pilot-future.working.balloo.su",
              "nodes-switcher.working.balloo.su"
            ]
          }
        }
      },
      "B": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "const": "Company Internal Nodes" },
          "access": { "type": "string", "const": "company-staff" },
          "nodes": {
            "type": "array",
            "items": { "type": "string" },
            "const": [
              "workdocs.working.balloo.su",
              "admin.balloo.su"
            ]
          }
        }
      },
      "C": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "const": "Alpha Access Nodes" },
          "access": { "type": "string", "const": "alpha-volunteer + alpha-staff" },
          "nodes": {
            "type": "array",
            "items": { "type": "string" },
            "const": [
              "alpha.balloo.su",
              "apps.alpha.balloo.su",
              "2commands.alpha.balloo.su"
            ]
          }
        }
      },
      "D": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "const": "Sandbox / Pre-Prod Nodes" },
          "access": { "type": "string", "const": "sandbox-operator" },
          "nodes": {
            "type": "array",
            "items": { "type": "string" },
            "const": [
              "working.balloo.su",
              "api.working.balloo.su",
              "files.working.balloo.su",
              "docs.working.balloo.su",
              "future.working.balloo.su",
              "admin.working.balloo.su",
              "workers.working.balloo.su",
              "abaut.working.balloo.su",
              "apps.working.balloo.su"
            ]
          }
        }
      },
      "E": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "const": "Production Public Nodes" },
          "access": { "type": "string", "const": "public-user" },
          "nodes": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    }
  }
}
```

---

## 🎭 ROLES

### Schema

```json
{
  "roles": {
    "type": "array",
    "items": {
      "type": "object",
      "required": ["roleId", "authorityLevel", "delegable"],
      "properties": {
        "roleId": { "type": "string" },
        "authorityLevel": { "type": "string", "enum": ["L1", "L3", "L4", "L5", "L6", "L8", "L10"] },
        "delegable": { "type": "boolean" }
      }
    },
    "const": [
      { "roleId": "creator-superadmin", "authorityLevel": "L10", "delegable": true },
      { "roleId": "delegated-node-admin", "authorityLevel": "L8", "delegable": false },
      { "roleId": "company-staff", "authorityLevel": "L6", "delegable": false },
      { "roleId": "alpha-staff", "authorityLevel": "L5", "delegable": false },
      { "roleId": "alpha-volunteer", "authorityLevel": "L4", "delegable": false },
      { "roleId": "sandbox-operator", "authorityLevel": "L3", "delegable": false },
      { "roleId": "public-user", "authorityLevel": "L1", "delegable": false }
    ]
  }
}
```

---

## 🔒 INVARIANTS

### Critical Invariants (Must Enforce)

| ID | Invariant | Enforcement | Error Message |
|----|-----------|-------------|---------------|
| I001 | Single creator-superadmin | Runtime + Codegen | "Multiple creator-superadmin roles detected" |
| I002 | creator-superadmin email fixed | Runtime + Codegen | "creator-superadmin email must be o8eryuhtin@yandex.ru" |
| I003 | Access management from single node | Runtime + Codegen | "Access management must be from projectgeneralsettings.working.balloo.su" |
| I004 | Group A nodes require explicit access | Runtime + Codegen | "Group A nodes require explicit creator-superadmin or delegated access" |
| I005 | No implicit admin inheritance | Runtime + Codegen | "Implicit admin inheritance is forbidden" |
| I006 | Environment separation | Runtime + Codegen | "Cross-environment privilege carryover is forbidden" |
| I007 | Deny by default for privileged nodes | Runtime + Codegen | "Privileged nodes default to deny" |
| I008 | Legacy alias kpdegen → kodegen | Runtime + Codegen | "Use canonical node name kodegen.working.balloo.su" |

### Strong Invariants (Should Enforce)

| ID | Invariant | Enforcement | Warning Message |
|----|-----------|-------------|-----------------|
| I101 | All access changes logged | Runtime | "Access change not logged" |
| I102 | Delegation auditable | Runtime | "Delegation not auditable" |
| I103 | No wildcard permissions | Codegen | "Wildcard permissions detected" |
| I104 | Production isolated | Runtime | "Production isolation check failed" |

---

## 🤖 CODEGEN INSTRUCTIONS

### For AI Code Generation

```typescript
// Access Policy Contract for Codegen
interface AccessPolicyContract {
  creatorSuperadmin: {
    name: "Оберюхтин Иван Анатольевич";
    email: "o8eryuhtin@yandex.ru";
    role: "creator-superadmin";
    authorityLevel: "L10";
  };
  
  accessManagementAuthority: {
    node: "projectgeneralsettings.working.balloo.su";
    responsibilities: string[];
  };
  
  nodeGroups: {
    A: { name: string; access: string; nodes: string[] };
    B: { name: string; access: string; nodes: string[] };
    C: { name: string; access: string; nodes: string[] };
    D: { name: string; access: string; nodes: string[] };
    E: { name: string; access: string; nodes: string[] };
  };
  
  roles: Array<{
    roleId: string;
    authorityLevel: string;
    delegable: boolean;
  }>;
  
  invariants: string[];
}
```

### Validation Rules

```typescript
// AI must validate:
function validateAccessPolicy(policy: AccessPolicyContract): boolean {
  // Check creator-superadmin
  if (policy.creatorSuperadmin.email !== "o8eryuhtin@yandex.ru") {
    throw new Error("Invalid creator-superadmin email");
  }
  
  // Check access management authority
  if (policy.accessManagementAuthority.node !== "projectgeneralsettings.working.balloo.su") {
    throw new Error("Invalid access management authority node");
  }
  
  // Check Group A nodes
  for (const node of policy.nodeGroups.A.nodes) {
    if (!isPrivilegedNode(node)) {
      throw new Error(`Node ${node} is not a privileged node`);
    }
  }
  
  // Check no implicit admin
  if (hasImplicitAdminInheritance(policy)) {
    throw new Error("Implicit admin inheritance is forbidden");
  }
  
  return true;
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](../../access/ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](../../access/ACCESS_ROLE_MODEL.md) — Role model
- [../../state/access-roles.json](../../state/access-roles.json) — Role registry
- [../../state/access-node-map.json](../../state/access-node-map.json) — Node map
- [AccessRoleContract.md](./AccessRoleContract.md) — Role contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
