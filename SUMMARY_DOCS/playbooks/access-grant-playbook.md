---
title: Access Grant Playbook
description: Playbook для предоставления доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - playbook
  - grant
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/access/ACCESS_DELEGATION_MODEL.md
---

# 📖 ACCESS GRANT PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот playbook определяет **процесс предоставления доступа** к узлам Balloo.

**Цель:** Обеспечить безопасное и аудируемое предоставление доступа.

---

## 👥 ROLES

| Role | Responsibility |
|------|---------------|
| **Requestor** | Requests access |
| **Approver** | creator-superadmin (or delegated) |
| **Implementer** | System (automated) |
| **Auditor** | Reviews access logs |

---

## 📋 PREREQUISITES

- [ ] Requestor identified
- [ ] Target node identified
- [ ] Required role/scope determined
- [ ] Justification prepared
- [ ] Approver available (creator-superadmin)

---

## 🔄 PROCESS

### Step 1: Access Request

**Actor:** Requestor (or manager on behalf)

**Actions:**
1. Identify target node
2. Determine required access level
3. Prepare justification
4. Submit request via `projectgeneralsettings.working.balloo.su`

**Request Format:**
```json
{
  "requestType": "access_grant",
  "requestor": "user-id",
  "targetNode": "node-id",
  "requestedRole": "role-id",
  "requestedScopes": ["scope1", "scope2"],
  "justification": "Business reason",
  "duration": "persistent" | "temporary (7d, 30d, 90d)"
}
```

### Step 2: Request Validation

**Actor:** System (automated)

**Actions:**
1. Validate requestor identity
2. Validate target node exists
3. Validate requested role is valid
4. Validate requested scopes are compatible with node
5. Check for conflicts (existing access)

**Validation Rules:**
| Check | Rule |
|-------|------|
| **Node Group** | Group A requires creator-superadmin approval |
| **Role Compatibility** | Role must be allowed for node group |
| **Scope Compatibility** | Scopes must be valid for node |
| **Duration** | Temporary max 90 days |

### Step 3: Approval

**Actor:** creator-superadmin

**Actions:**
1. Review request details
2. Review justification
3. Check node group requirements
4. Approve or reject

**Decision Criteria:**
| Criterion | Requirement |
|-----------|-------------|
| **Business Need** | Clear justification |
| **Least Privilege** | Minimum required access |
| **Node Sensitivity** | Higher scrutiny for Group A |
| **Duration** | Appropriate for need |

### Step 4: Grant Implementation

**Actor:** System (automated)

**Actions:**
1. Create delegation record
2. Assign role to user
3. Assign scopes to user
4. Set expiry (if temporary)
5. Notify requestor
6. Log action

**Implementation Details:**
```json
{
  "delegationId": "del-XXX",
  "delegator": "creator-superadmin",
  "delegatee": "user-id",
  "node": "node-id",
  "role": "role-id",
  "scopes": ["scope1", "scope2"],
  "grantedAt": "ISO-8601 timestamp",
  "expiresAt": "ISO-8601 timestamp or null",
  "status": "active"
}
```

### Step 5: Notification

**Actor:** System (automated)

**Recipients:**
- Requestor (access granted)
- Approver (confirmation)
- Auditor (log entry)

**Notification Content:**
```
Access Granted

User: {user-id}
Node: {node-id}
Role: {role-id}
Scopes: {scopes}
Granted: {timestamp}
Expires: {expiry or "persistent"}
Approved by: creator-superadmin
```

### Step 6: Audit Logging

**Actor:** System (automated)

**Log Entry:**
```json
{
  "eventType": "access_grant",
  "eventId": "evt-XXX",
  "timestamp": "ISO-8601",
  "actor": {
    "role": "creator-superadmin",
    "email": "o8eryuhtin@yandex.ru"
  },
  "target": {
    "userId": "user-id",
    "nodeId": "node-id"
  },
  "details": {
    "role": "role-id",
    "scopes": ["scope1", "scope2"],
    "duration": "persistent" | "temporary",
    "justification": "Business reason"
  }
}
```

---

## ⚠️ SPECIAL CASES

### Group A Nodes (Privileged)

**Additional Requirements:**
- creator-superadmin approval mandatory
- Maximum audit level
- Explicit justification required
- No automatic approval

### Temporary Access

**Additional Requirements:**
- Expiry date must be set
- Maximum 90 days
- Renewal requires new approval
- Auto-revoke on expiry

### Emergency Access

**Additional Requirements:**
- Break-glass procedure
- Post-grant review required
- Maximum 24 hours
- Immediate audit notification

---

## 🚫 REJECTION HANDLING

### Rejection Reasons

| Reason | Description |
|--------|-------------|
| **Insufficient Justification** | Business need not clear |
| **Excessive Access** | More than needed |
| **Role Incompatible** | Role not allowed for node |
| **Scope Incompatible** | Scopes not valid for node |
| **Policy Violation** | Violates access policy |

### Rejection Process

1. Document rejection reason
2. Notify requestor
3. Log rejection
4. Offer appeal path (to creator-superadmin)

---

## 📊 METRICS

| Metric | Target |
|--------|--------|
| **Approval Time** | < 24 hours |
| **Rejection Rate** | < 10% |
| **Audit Compliance** | 100% |
| **Emergency Access** | < 1% of grants |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "accessGrantPlaybook": {
    "steps": ["request", "validation", "approval", "implementation", "notification", "audit"],
    "approver": "creator-superadmin",
    "managementNode": "projectgeneralsettings.working.balloo.su",
    "specialCases": {
      "groupA": { "requiresCreatorApproval": true, "auditLevel": "maximum" },
      "temporary": { "maxDuration": "90d", "autoRevoke": true },
      "emergency": { "maxDuration": "24h", "postReview": true }
    },
    "logFields": ["eventType", "timestamp", "actor", "target", "details"]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy
- [ACCESS_DELEGATION_MODEL.md](../access/ACCESS_DELEGATION_MODEL.md) — Delegation model
- [access-revoke-playbook.md](./access-revoke-playbook.md) — Access revoke playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
