---
title: Break-Glass Access Playbook
description: Playbook для экстренного доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - playbook
  - emergency
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/playbooks/access-revoke-playbook.md
---

# 🚨 BREAK-GLASS ACCESS PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот playbook определяет **процедуру экстренного доступа** (break-glass).

**Цель:** Обеспечить доступ в критических ситуациях с максимальным контролем.

---

## 🚨 BREAK-GLASS DEFINITION

**Break-Glass Access:** Emergency access granted outside normal procedures when:
- Normal access paths are unavailable
- Critical system functionality is impaired
- Immediate action is required
- No authorized personnel are available

---

## ⚠️ AUTHORIZED SCENARIOS

| Scenario | Description | Approval |
|----------|-------------|----------|
| **System Outage** | Critical system down | Post-facto |
| **Security Incident** | Active security breach | Post-facto |
| **Key Personnel Unavailable** | creator-superadmin unreachable | Delegated approver |
| **Natural Disaster** | Emergency response | Post-facto |

### NOT Authorized

| Scenario | Reason |
|----------|--------|
| Routine maintenance | Use normal process |
| Scheduled deployments | Use normal process |
| Convenience | Use normal process |
| Testing | Use sandbox |

---

## 🔐 BREAK-GLASS MECHANISM

### Break-Glass Account

| Property | Value |
|----------|-------|
| **Account Type** | Emergency access account |
| **Access Level** | creator-superadmin equivalent |
| **Availability** | 24/7 |
| **Credentials** | Securely stored (physical + digital) |
| **Usage** | Emergency only |

### Credential Storage

| Location | Access |
|----------|--------|
| **Physical Safe** | Security team + designated personnel |
| **Password Manager** | Emergency access group |
| **Encrypted Backup** | creator-superadmin only |

---

## 🔄 BREAK-GLASS PROCESS

### Phase 1: Emergency Declaration

**Actor:** On-call engineer / Security team / Manager

**Actions:**
1. Confirm emergency scenario
2. Document emergency details
3. Declare break-glass activation
4. Notify security team
5. Notify creator-superadmin (if possible)

**Declaration Format:**
```json
{
  "eventType": "break_glass_activation",
  "timestamp": "ISO-8601",
  "declarer": "user-id",
  "scenario": "system_outage" | "security_incident" | "personnel_unavailable",
  "description": "Emergency details",
  "affectedSystems": ["system1", "system2"],
  "estimatedDuration": "2h"
}
```

### Phase 2: Credential Retrieval

**Actor:** Declarer + Witness (two-person rule)

**Actions:**
1. Retrieve credentials from secure storage
2. Two-person verification
3. Log credential retrieval
4. Activate break-glass account

### Phase 3: Emergency Access

**Actor:** Authorized emergency responder

**Actions:**
1. Authenticate with break-glass credentials
2. Perform only emergency actions
3. Document all actions taken
4. Minimize access duration

**Usage Rules:**
- ✅ Perform only emergency-required actions
- ✅ Document every action
- ✅ Minimize access time
- ❌ No routine operations
- ❌ No exploration
- ❌ No data export (unless critical)

### Phase 4: Access Termination

**Actor:** Emergency responder

**Actions:**
1. Complete emergency actions
2. Log out immediately
3. Return credentials to secure storage
4. Document completion
5. Notify security team

### Phase 5: Post-Incident Review

**Actor:** creator-superadmin + Security team + Auditor

**Timeline:** Within 48 hours

**Review Items:**
- [ ] Emergency was justified
- [ ] Actions were appropriate
- [ ] All actions documented
- [ ] Credentials returned
- [ ] Access revoked
- [ ] Lessons learned

---

## 📋 DOCUMENTATION REQUIREMENTS

### During Emergency

| Item | Requirement |
|------|-------------|
| **Declaration** | Before credential use |
| **Action Log** | Real-time during access |
| **Completion Notice** | Immediately after |

### Post-Incident Report

| Section | Content |
|---------|---------|
| **Incident Summary** | What happened |
| **Timeline** | When each action occurred |
| **Actions Taken** | What was done |
| **Justification** | Why break-glass was needed |
| **Lessons Learned** | How to prevent future |

---

## 🔒 SECURITY CONTROLS

### During Break-Glass

| Control | Description |
|---------|-------------|
| **Enhanced Logging** | All actions logged in real-time |
| **Session Recording** | Full session recorded |
| **Real-time Alert** | Security team notified |
| **Time Limit** | Maximum 4 hours |

### After Break-Glass

| Control | Description |
|---------|-------------|
| **Credential Rotation** | Change break-glass credentials |
| **Access Review** | Review all actions |
| **Audit** | Full audit within 48 hours |
| **Policy Update** | Update if needed |

---

## ⚠️ ABUSE PREVENTION

### Detection

| Indicator | Response |
|-----------|----------|
| **Non-Emergency Use** | Disciplinary action |
| **Extended Duration** | Alert + investigation |
| **Unauthorized Actions** | Investigation + revocation |
| **Repeated Use** | Process review + training |

### Consequences

| Violation | Consequence |
|-----------|-------------|
| **Unauthorized Use** | Immediate termination |
| **Policy Violation** | Disciplinary action |
| **Documentation Failure** | Training + warning |
| **Repeated Violations** | Access revocation |

---

## 📊 METRICS

| Metric | Target |
|--------|--------|
| **Break-Glass Activations** | < 4 per year |
| **Post-Incident Review Time** | < 48 hours |
| **Credential Rotation** | 100% after use |
| **Documentation Compliance** | 100% |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "breakGlassAccessPlaybook": {
    "authorizedScenarios": ["system_outage", "security_incident", "personnel_unavailable", "natural_disaster"],
    "phases": ["declaration", "credential_retrieval", "emergency_access", "access_termination", "post_incident_review"],
    "securityControls": {
      "during": ["enhanced_logging", "session_recording", "real_time_alert", "time_limit_4h"],
      "after": ["credential_rotation", "access_review", "full_audit_48h", "policy_update"]
    },
    "documentation": {
      "during": ["declaration", "action_log", "completion_notice"],
      "after": ["incident_summary", "timeline", "actions_taken", "justification", "lessons_learned"]
    },
    "metrics": {
      "maxActivationsPerYear": 4,
      "reviewTimeHours": 48,
      "credentialRotation": "100%"
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy
- [access-revoke-playbook.md](./access-revoke-playbook.md) — Access revoke playbook
- [privileged-node-access-playbook.md](./privileged-node-access-playbook.md) — Privileged node access playbook
- [access-audit-playbook.md](./access-audit-playbook.md) — Access audit playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
