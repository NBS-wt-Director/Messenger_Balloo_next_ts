---
title: Access Policy Migration Notes
description: Заметки по миграции политики доступа Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - migration
  - notes
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/access/ACCESS_DISCOVERY_REPORT.md
---

# 🔄 ACCESS POLICY MIGRATION NOTES

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот документ определяет **процесс миграции** к новой политике доступа.

**Цель:** Обеспечить плавный переход к канонической access policy.

---

## 📋 MIGRATION SCOPE

### What Changes

| Area | Before | After |
|------|--------|-------|
| **Access Management** | Decentralized | Centralized (projectgeneralsettings) |
| **Role Model** | Undefined | 7 canonical roles |
| **Node Classification** | None | 5 groups (A/B/C/D/E) |
| **Creator Authority** | Informal | Formalized (Оберюхтин И.А.) |
| **Legacy Aliases** | Mixed | Canonical names only |

### What Stays Same

| Area | Status |
|------|--------|
| **Existing User Accounts** | Preserved, re-mapped to roles |
| **Node Hostnames** | Preserved (except kpdegen→kodegen) |
| **Authentication System** | Preserved, enhanced with MFA |

---

## 🔑 KEY MIGRATION ITEMS

### 1. Node Name Correction

**Legacy:** `kpdegen.working.balloo.su`  
**Canonical:** `kodegen.working.balloo.su`

**Migration Steps:**
1. Update all documentation references
2. Update DNS/routing configuration
3. Update codebase references
4. Add redirect from legacy to canonical
5. Deprecate legacy name after 6 months

**Timeline:**
- **Phase 1 (Week 1-2):** Documentation update
- **Phase 2 (Week 3-4):** DNS/routing update
- **Phase 3 (Week 5-6):** Codebase update
- **Phase 4 (Week 7+):** Legacy deprecation

### 2. Role Mapping

**Existing Users → New Roles**

| Existing Access | New Role | Migration Action |
|-----------------|----------|------------------|
| Full admin | creator-superadmin | Single user only |
| Node admin | delegated-node-admin | Explicit delegation required |
| Internal staff | company-staff | Automatic for NBS-wt employees |
| Alpha tester | alpha-volunteer | Opt-in required |
| Alpha curator | alpha-staff | Appointment required |
| Sandbox user | sandbox-operator | Agreement required |
| Public user | public-user | No action needed |

### 3. Node Group Classification

**Migration Steps:**
1. Audit all existing nodes
2. Classify into groups A/B/C/D/E
3. Apply access policies per group
4. Verify access controls
5. Document exceptions

### 4. Access Management Authority

**New Authority Node:** `projectgeneralsettings.working.balloo.su`

**Migration Steps:**
1. Set up authority node
2. Migrate existing access rules
3. Enable centralized management
4. Train administrators
5. Decommission old access systems

---

## 📅 MIGRATION PHASES

### Phase 1: Preparation (Week 1-2)

**Tasks:**
- [ ] Review access policy documentation
- [ ] Identify all existing nodes
- [ ] Map existing users to new roles
- [ ] Prepare migration scripts
- [ ] Set up test environment

**Deliverables:**
- Node inventory
- User role mapping
- Migration scripts
- Test plan

### Phase 2: Infrastructure (Week 3-4)

**Tasks:**
- [ ] Set up projectgeneralsettings node
- [ ] Configure DNS for kodegen
- [ ] Set up redirect for kpdegen
- [ ] Deploy access control system
- [ ] Enable audit logging

**Deliverables:**
- Infrastructure ready
- DNS configured
- Access system deployed

### Phase 3: Role Migration (Week 5-6)

**Tasks:**
- [ ] Migrate creator-superadmin
- [ ] Migrate company-staff roles
- [ ] Migrate alpha roles
- [ ] Migrate sandbox roles
- [ ] Verify role assignments

**Deliverables:**
- All users mapped to roles
- Role verification complete

### Phase 4: Node Classification (Week 7-8)

**Tasks:**
- [ ] Classify Group A nodes
- [ ] Classify Group B nodes
- [ ] Classify Group C nodes
- [ ] Classify Group D nodes
- [ ] Classify Group E nodes
- [ ] Apply access policies

**Deliverables:**
- All nodes classified
- Access policies applied

### Phase 5: Validation (Week 9-10)

**Tasks:**
- [ ] Test access controls
- [ ] Verify audit logging
- [ ] Test delegation workflows
- [ ] Test environment separation
- [ ] Fix issues

**Deliverables:**
- Validation report
- Issue log
- Remediation complete

### Phase 6: Go-Live (Week 11-12)

**Tasks:**
- [ ] Final backup
- [ ] Enable new access system
- [ ] Monitor for issues
- [ ] Support users
- [ ] Document lessons learned

**Deliverables:**
- System live
- Monitoring active
- Lessons learned document

---

## ⚠️ MIGRATION RISKS

### High Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Access Loss** | Users locked out | Rollback plan, emergency access |
| **Data Loss** | Access rules lost | Full backup before migration |
| **Security Gap** | Unauthorized access | Parallel run, verification |

### Medium Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| **User Confusion** | Support tickets | Communication, training |
| **Performance Impact** | Slow access checks | Load testing, optimization |
| **Integration Issues** | Third-party breaks | API compatibility testing |

### Low Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Documentation Gaps** | Confusion | Comprehensive docs |
| **Training Needs** | Slow adoption | Training sessions |

---

## 🔄 ROLLBACK PLAN

### Trigger Conditions

| Condition | Action |
|-----------|--------|
| Critical access loss | Immediate rollback |
| Security breach | Immediate rollback |
| Data corruption | Immediate rollback |
| Extended downtime | Rollback after 4 hours |

### Rollback Steps

1. Stop new access system
2. Restore backup
3. Re-enable old access system
4. Verify access restored
5. Document incident
6. Plan re-migration

---

## 📊 SUCCESS CRITERIA

| Criterion | Target |
|-----------|--------|
| **User Access** | 100% users have correct access |
| **Node Classification** | 100% nodes classified |
| **Audit Logging** | 100% access changes logged |
| **Security** | No unauthorized access |
| **Downtime** | < 4 hours total |
| **User Complaints** | < 5% of users |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "migrationNotes": {
    "phases": 6,
    "timeline": "12 weeks",
    "keyItems": [
      "node-name-correction",
      "role-mapping",
      "node-classification",
      "access-management-authority"
    ],
    "risks": {
      "high": ["access-loss", "data-loss", "security-gap"],
      "medium": ["user-confusion", "performance", "integration"],
      "low": ["documentation", "training"]
    },
    "rollback": {
      "triggers": ["critical-access-loss", "security-breach", "data-corruption", "extended-downtime"],
      "steps": ["stop-new-system", "restore-backup", "re-enable-old", "verify", "document"]
    },
    "successCriteria": {
      "userAccess": "100%",
      "nodeClassification": "100%",
      "auditLogging": "100%",
      "security": "no-unauthorized-access",
      "downtime": "<4h",
      "complaints": "<5%"
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_DISCOVERY_REPORT.md](./ACCESS_DISCOVERY_REPORT.md) — Discovery report
- [../state/access-legacy-aliases.json](../state/access-legacy-aliases.json) — Legacy aliases

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
