---
title: Privileged Node Access Playbook
description: Playbook для доступа к привилегированным узлам Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - playbook
  - privileged
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/contracts/access/PrivilegedNodeAccessContract.md
---

# 📖 PRIVILEGED NODE ACCESS PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот playbook определяет **доступ к привилегированным узлам** (Group A).

**Цель:** Обеспечить максимальную безопасность для критических узлов.

---

## 🗂️ PRIVILEGED NODES (GROUP A)

| Node | Purpose | Access |
|------|---------|--------|
| **projectgeneralsettings.working.balloo.su** | Access management authority | creator-superadmin only |
| **kodegen.working.balloo.su** | Code generation | creator-superadmin + delegated |
| **pilot-future.working.balloo.su** | Future features pilot | creator-superadmin + delegated |
| **nodes-switcher.working.balloo.su** | Node version switching | creator-superadmin + delegated |

**Note:** `kpdegen.working.balloo.su` is deprecated alias for `kodegen.working.balloo.su`

---

## 🔐 ACCESS REQUIREMENTS

### Default Access

| Node | Default Access |
|------|---------------|
| All Group A | creator-superadmin only |

### Delegated Access

| Requirement | Description |
|-------------|-------------|
| **Delegator** | creator-superadmin only |
| **Delegable Role** | delegated-node-admin |
| **Delegation Type** | Explicit per-node |
| **Audit Level** | Maximum |
| **Approval** | creator-superadmin |

---

## 🔄 ACCESS PROCESS

### Step 1: Access Request

**Actor:** Requestor (via manager or direct to creator-superadmin)

**Request Requirements:**
- Node identification
- Business justification
- Required scopes
- Duration (temporary or persistent)
- Security clearance confirmation

**Request Format:**
```json
{
  "requestType": "privileged_access_grant",
  "nodeGroup": "A",
  "targetNode": "kodegen.working.balloo.su",
  "requestor": "user-id",
  "justification": "Code generation operations for release v2.0",
  "scopes": ["codegen:read:*", "codegen:execute:*"],
  "duration": "persistent",
  "securityClearance": "confirmed"
}
```

### Step 2: Security Review

**Actor:** creator-superadmin

**Review Checklist:**
- [ ] Business justification verified
- [ ] Requestor identity confirmed
- [ ] Security clearance verified
- [ ] Least privilege applied
- [ ] Duration appropriate

### Step 3: Approval

**Actor:** creator-superadmin

**Approval Requirements:**
- Direct approval (no delegation)
- Documented justification
- Audit log entry

### Step 4: Access Grant

**Actor:** System (automated)

**Grant Actions:**
1. Create delegation record
2. Assign role (delegated-node-admin)
3. Assign scopes (node-specific)
4. Enable maximum audit logging
5. Notify requestor
6. Notify creator-superadmin

### Step 5: Access Use

**Actor:** Delegatee

**Usage Requirements:**
- Use only for approved purpose
- No further delegation
- Comply with security policies
- Report incidents immediately

### Step 6: Ongoing Monitoring

**Actor:** System + Auditor

**Monitoring:**
- All actions logged (maximum audit)
- Regular access review (monthly)
- Anomaly detection
- Immediate alert on suspicious activity

---

## ⚠️ SECURITY REQUIREMENTS

### Authentication

| Requirement | Description |
|-------------|-------------|
| **MFA Required** | Yes, mandatory |
| **Session Timeout** | 15 minutes inactivity |
| **IP Restrictions** | Recommended |
| **Device Trust** | Recommended |

### Authorization

| Requirement | Description |
|-------------|-------------|
| **Role Check** | delegated-node-admin minimum |
| **Scope Check** | Node-specific scopes |
| **Environment Check** | Working environment only |
| **Delegation Check** | Explicit delegation required |

### Audit

| Requirement | Description |
|-------------|-------------|
| **Audit Level** | Maximum |
| **Log Retention** | Minimum 90 days |
| **Log Fields** | All actions, timestamps, actors |
| **Alert Threshold** | Immediate on anomalies |

---

## 🚨 INCIDENT RESPONSE

### Suspicious Activity

| Activity | Response |
|----------|----------|
| **Unusual Access Pattern** | Alert + review |
| **Failed Auth Attempts** | Lock after 3 attempts |
| **Scope Violation** | Immediate revocation + investigation |
| **Delegation Abuse** | Immediate revocation + investigation |

### Response Process

1. Detect anomaly
2. Alert security team
3. Review access logs
4. Revoke access if needed
5. Investigate incident
6. Document findings
7. Update security measures

---

## 📊 ACCESS REVIEW

### Review Schedule

| Review Type | Frequency | Reviewer |
|-------------|-----------|----------|
| **Access List Review** | Monthly | creator-superadmin |
| **Delegation Review** | Monthly | creator-superadmin |
| **Audit Log Review** | Weekly | Auditor |
| **Security Assessment** | Quarterly | Security team |

### Review Checklist

- [ ] All delegations still required
- [ ] No excessive permissions
- [ ] No dormant access
- [ ] Audit logs complete
- [ ] No policy violations

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "privilegedNodeAccessPlaybook": {
    "groupANodes": [
      "projectgeneralsettings.working.balloo.su",
      "kodegen.working.balloo.su",
      "pilot-future.working.balloo.su",
      "nodes-switcher.working.balloo.su"
    ],
    "defaultAccess": "creator-superadmin-only",
    "delegationAllowed": true,
    "delegableRole": "delegated-node-admin",
    "securityRequirements": {
      "mfaRequired": true,
      "sessionTimeout": "15m",
      "auditLevel": "maximum",
      "logRetention": "90d"
    },
    "reviewSchedule": {
      "accessList": "monthly",
      "delegation": "monthly",
      "auditLog": "weekly",
      "securityAssessment": "quarterly"
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy
- [ACCESS_DELEGATION_MODEL.md](../access/ACCESS_DELEGATION_MODEL.md) — Delegation model
- [PrivilegedNodeAccessContract.md](../contracts/access/PrivilegedNodeAccessContract.md) — Privileged node contract
- [access-audit-playbook.md](./access-audit-playbook.md) — Access audit playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
