---
title: Access Environment Policy
description: Политика разграничения сред Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - access
  - environment
  - separation
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/state/access-environment-map.json
---

# 🌍 ACCESS ENVIRONMENT POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта политика определяет **разграничение сред** платформы Balloo.

**Цель:** Обеспечить изоляцию между production, alpha и working средами.

---

## 📊 ENVIRONMENTS

### Overview

| Environment | ID | Risk Level | Description |
|-------------|-----|------------|-------------|
| **Production** | `production` | Critical | Public production surface |
| **Alpha** | `alpha` | Medium | Alpha testing environment |
| **Working** | `working` | Medium | Sandbox/pre-prod environment |

---

## 🔒 ENVIRONMENT ISOLATION

### Core Principle

```
NO AUTOMATIC PRIVILEGE CARRYOVER BETWEEN ENVIRONMENTS
```

### Isolation Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| **No Automatic Carryover** | Access in one environment ≠ access to another | Runtime + Codegen |
| **Production Isolation** | Production requires explicit authorization | Runtime + Codegen |
| **Working ≠ Production** | Sandbox access is not production authority | Runtime + Codegen |
| **Controlled Promotion** | Production updates via controlled path only | Runtime |

---

## 📋 ENVIRONMENT ACCESS RULES

### Production Environment

| Aspect | Rule |
|--------|------|
| **Access** | Explicit authorization required |
| **Default** | Deny for non-public nodes |
| **Deployment** | Controlled promotion from working |
| **Approval** | creator-superadmin approval required |
| **Audit** | Standard audit logging |

### Alpha Environment

| Aspect | Rule |
|--------|------|
| **Access** | alpha-volunteer + alpha-staff roles |
| **Default** | Deny for external users |
| **Deployment** | Direct deployment allowed |
| **Approval** | alpha-staff approval |
| **Audit** | Standard audit logging |

### Working Environment

| Aspect | Rule |
|--------|------|
| **Access** | sandbox-operator + company-staff roles |
| **Default** | Deny for public users |
| **Deployment** | Direct deployment allowed |
| **Approval** | Varies by node group |
| **Audit** | Maximum for Group A nodes |

---

## 🗂️ NODE GROUPS BY ENVIRONMENT

### Working Environment

| Group | Nodes | Access |
|-------|-------|--------|
| **A** | projectgeneralsettings, kodegen, pilot-future, nodes-switcher | creator-superadmin + delegated |
| **D** | working, api, files, docs, future, admin, workers, abaut, apps | sandbox-operator |

### Alpha Environment

| Group | Nodes | Access |
|-------|-------|--------|
| **C** | alpha, apps.alpha, 2commands | alpha-volunteer + alpha-staff |

### Production Environment

| Group | Nodes | Access |
|-------|-------|--------|
| **B** | admin | company-staff |
| **E** | balloo.su, messenger.balloo.su | public-user |

---

## 🔄 CROSS-ENVIRONMENT ACCESS

### Allowed Cross-Environment Roles

| Role | Environments | Notes |
|------|--------------|-------|
| **creator-superadmin** | All (production, alpha, working) | Full platform authority |
| **delegated-node-admin** | Per-node explicit | Explicit delegation required |
| **company-staff** | working, production | Internal staff access |

### Forbidden Cross-Environment Access

| Pattern | Reason |
|---------|--------|
| alpha-volunteer → production | Alpha testing only |
| alpha-volunteer → working | Alpha zone isolation |
| sandbox-operator → production | Sandbox ≠ production authority |
| sandbox-operator → alpha | Separate environments |
| public-user → working | Public ≠ internal |
| public-user → alpha | Public ≠ testing |

---

## 🚀 PRODUCTION PROMOTION

### Promotion Path

```
working (sandbox) → approval → production
```

### Promotion Requirements

| Requirement | Description |
|-------------|-------------|
| **Testing Complete** | All sandbox tests passed |
| **Approval** | creator-superadmin approval |
| **Documentation** | Update docs in workdocs |
| **Rollback Plan** | Rollback procedure defined |
| **Audit** | Promotion logged |

### Promotion Process

1. **Request** — Submit promotion request from working
2. **Review** — creator-superadmin reviews request
3. **Approve** — Approval granted or rejected
4. **Deploy** — Deploy to production
5. **Verify** — Verify production deployment
6. **Log** — Log promotion event

---

## ⚠️ ENVIRONMENT VIOLATIONS

### Violation Types

| Violation | Severity | Example |
|-----------|----------|---------|
| **Unauthorized Cross-Environment** | Critical | Sandbox user accessing production admin |
| **Production Without Approval** | Critical | Direct production deployment |
| **Environment Boundary Bypass** | Critical | Using working credentials in production |
| **Audit Log Tampering** | Critical | Modifying environment access logs |

### Enforcement

| Violation | Action |
|-----------|--------|
| Unauthorized Cross-Environment | Immediate revocation + audit |
| Production Without Approval | Block deployment + audit |
| Environment Boundary Bypass | Block access + audit |
| Audit Log Tampering | Security incident response |

---

## 🤖 CODEGEN RELEVANCE

```json
{
  "environmentPolicy": {
    "environments": ["production", "alpha", "working"],
    "isolationRules": [
      "no-automatic-carryover",
      "production-isolation",
      "working-not-production",
      "controlled-promotion"
    ],
    "crossEnvironmentAccess": {
      "creator-superadmin": ["production", "alpha", "working"],
      "delegated-node-admin": ["per-node-explicit"],
      "company-staff": ["working", "production"],
      "alpha-staff": ["alpha"],
      "alpha-volunteer": ["alpha"],
      "sandbox-operator": ["working"],
      "public-user": ["production-public"]
    },
    "productionPromotion": {
      "requiresApproval": true,
      "approver": "creator-superadmin",
      "path": "working → production"
    },
    "violations": [
      "unauthorized-cross-environment",
      "production-without-approval",
      "environment-boundary-bypass",
      "audit-log-tampering"
    ]
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [ACCESS_POLICY.md](./ACCESS_POLICY.md) — Access policy
- [ACCESS_ROLE_MODEL.md](./ACCESS_ROLE_MODEL.md) — Role model
- [../state/access-environment-map.json](../state/access-environment-map.json) — Environment map
- [ENVIRONMENT_ACCESS_MATRIX.md](./ENVIRONMENT_ACCESS_MATRIX.md) — Environment matrix

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
