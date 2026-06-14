---
title: Access Revoke Playbook
description: Playbook для отзыва доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - playbook
  - revoke
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/access/ACCESS_DELEGATION_MODEL.md
---

# 📖 ACCESS REVOKE PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот playbook определяет **процесс отзыва доступа** к узлам Balloo.

**Цель:** Обеспечить безопасный и аудируемый отзыв доступа.

---

## 👥 ROLES

| Role | Responsibility |
|------|---------------|
| **Initiator** | Requests revocation |
| **Approver** | creator-superadmin (or automated) |
| **Implementer** | System (automated) |
| **Auditor** | Reviews revocation logs |

---

## 📋 REVOCATION TRIGGERS

### Immediate Revocation

| Trigger | Action |
|---------|--------|
| **Security Incident** | Revoke immediately |
| **Terms Violation** | Revoke immediately |
| **Employment Termination** | Revoke immediately |
| **creator-superadmin Request** | Revoke immediately |

### Scheduled Revocation

| Trigger | Action |
|---------|--------|
| **Delegation Expiry** | Revoke at expiry |
| **Role Change** | Review and revoke if needed |
| **Environment Change** | Review and revoke if needed |

### Automatic Revocation

| Trigger | Action |
|---------|--------|
| **Alpha Program End** | Revoke alpha delegations |
| **Sandbox Period End** | Revoke sandbox delegations |

---

## 🔄 PROCESS

### Step 1: Revocation Initiation

**Actor:** Initiator (creator-superadmin, HR system, security system)

**Initiation Methods:**
1. Manual request via `projectgeneralsettings.working.balloo.su`
2. Automated trigger (HR system, security system)
3. Scheduled expiry

**Initiation Format:**
```json
{
  "requestType": "access_revoke",
  "initiator": "user-id" | "system",
  "targetUser": "user-id",
  "targetNode": "node-id" | "all",
  "reason": "security_incident" | "employment_termination" | "expiry" | "manual",
  "urgency": "immediate" | "scheduled",
  "details": "Additional context"
}
```

### Step 2: Revocation Validation

**Actor:** System (automated)

**Actions:**
1. Validate initiator authority
2. Validate target user exists
3. Validate target access exists
4. Check for dependencies

**Validation Rules:**
| Check | Rule |
|-------|------|
| **Initiator Authority** | creator-superadmin or automated system |
| **Target User** | Must exist in system |
| **Target Access** | Must have active access |
| **Dependencies** | Check for active sessions |

### Step 3: Approval

**Actor:** creator-superadmin or System (automated)

**Approval Rules:**
| Trigger | Approval Required |
|---------|-------------------|
| Security Incident | No (immediate) |
| Employment Termination | No (automated) |
| Expiry | No (automated) |
| Manual Request | Yes (creator-superadmin) |

### Step 4: Revocation Implementation

**Actor:** System (automated)

**Actions:**
1. Invalidate active sessions
2. Remove delegation record
3. Remove role assignments
4. Remove scope assignments
5. Notify user
6. Log action

**Implementation Details:**
```json
{
  "revocationId": "rev-XXX",
  "delegationId": "del-XXX",
  "revokedAt": "ISO-8601 timestamp",
  "reason": "security_incident" | "employment_termination" | "expiry" | "manual",
  "initiator": "user-id" | "system",
  "status": "revoked"
}
```

### Step 5: Notification

**Actor:** System (automated)

**Recipients:**
- Revoked user (access revoked)
- Initiator (confirmation)
- creator-superadmin (notification)
- Auditor (log entry)

**Notification Content:**
```
Access Revoked

User: {user-id}
Node: {node-id}
Role: {role-id}
Revoked: {timestamp}
Reason: {reason}
Initiated by: {initiator}
```

### Step 6: Audit Logging

**Actor:** System (automated)

**Log Entry:**
```json
{
  "eventType": "access_revoke",
  "eventId": "evt-XXX",
  "timestamp": "ISO-8601",
  "actor": {
    "role": "creator-superadmin" | "system",
    "id": "initiator-id"
  },
  "target": {
    "userId": "user-id",
    "nodeId": "node-id"
  },
  "details": {
    "reason": "security_incident" | "employment_termination" | "expiry" | "manual",
    "urgency": "immediate" | "scheduled",
    "delegationId": "del-XXX"
  }
}
```

---

## ⚠️ SPECIAL CASES

### Security Incident

**Additional Actions:**
1. Revoke ALL access immediately
2. Invalidate all sessions
3. Preserve audit logs
4. Notify security team
5. Document incident

### Employment Termination

**Additional Actions:**
1. Revoke ALL access
2. HR system integration
3. Exit checklist completion
4. Asset return verification

### Temporary Access Expiry

**Additional Actions:**
1. Auto-revoke on expiry
2. Notify user before expiry (24h)
3. Offer renewal path

---

## 🚫 APPEAL PROCESS

### Appeal Eligibility

| Revocation Reason | Appeal Allowed |
|-------------------|----------------|
| Security Incident | After investigation |
| Terms Violation | After review |
| Employment Termination | No |
| Expiry | Request new grant |
| Manual Request | Yes (to creator-superadmin) |

### Appeal Process

1. Submit appeal to creator-superadmin
2. Review within 48 hours
3. Decision: Uphold or Reverse
4. Notify appellant
5. Log decision

---

## 📊 METRICS

| Metric | Target |
|--------|--------|
| **Immediate Revocation Time** | < 1 minute |
| **Scheduled Revocation Accuracy** | 100% |
| **Audit Compliance** | 100% |
| **Appeal Resolution Time** | < 48 hours |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "accessRevokePlaybook": {
    "triggers": {
      "immediate": ["security_incident", "terms_violation", "employment_termination", "creator-superadmin_request"],
      "scheduled": ["delegation_expiry", "role_change", "environment_change"],
      "automatic": ["alpha_program_end", "sandbox_period_end"]
    },
    "steps": ["initiation", "validation", "approval", "implementation", "notification", "audit"],
    "specialCases": {
      "securityIncident": { "revokeAll": true, "preserveLogs": true, "notifySecurity": true },
      "employmentTermination": { "revokeAll": true, "hrIntegration": true },
      "expiry": { "autoRevoke": true, "notifyBefore": "24h" }
    },
    "logFields": ["eventType", "timestamp", "actor", "target", "details"]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy
- [ACCESS_DELEGATION_MODEL.md](../access/ACCESS_DELEGATION_MODEL.md) — Delegation model
- [access-grant-playbook.md](./access-grant-playbook.md) — Access grant playbook
- [access-audit-playbook.md](./access-audit-playbook.md) — Access audit playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
