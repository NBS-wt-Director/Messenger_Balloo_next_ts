---
title: Node Delivery Playbook
description: Инструкции по доставке узлов Balloo через working → alpha → production
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - delivery
  - playbook
  - release
  - canonical
related_docs:
  - SUMMARY_DOCS/adr/ADR-005-working-alpha-production-release-flow.md
  - SUMMARY_DOCS/playbooks/ROLLBACK_PLAYBOOK.md
  - SUMMARY_DOCS/playbooks/POST_DEPLOY_CHECKLIST.md
---

# 🚀 NODE DELIVERY PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот playbook описывает workflow **доставки узлов** Balloo через working → alpha → production.

**Цель:** Обеспечить консистентный и безопасный release process.

---

## 📊 RELEASE FLOW

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ WORKING  │ ───► │  ALPHA   │ ───► │PRODUCTION│
│          │      │          │      │          │
│ Develop  │      │  Test    │      │ Release  │
│ Integrate│      │ Validate │      │  Stable  │
│  (15)    │      │   (3)    │      │   (11)   │
└──────────┘      └──────────┘      └──────────┘
```

---

## 🔄 WORKING → ALPHA PROMOTION

### Pre-Promotion Checklist

- [ ] Feature complete
- [ ] CI/CD passed
- [ ] Docs updated (contracts, summaries, runbooks)
- [ ] Health model defined
- [ ] Ownership assigned
- [ ] Tech lead approval
- [ ] Product owner approval

### Promotion Steps

```bash
# 1. Verify working node health
curl http://localhost:<port>/health

# 2. Run tests
npm test

# 3. Update manifest (branch = alpha)
# Edit NODETREE_MANIFEST.json

# 4. Deploy to alpha
./deploy.sh --target alpha --node <node-id>

# 5. Verify alpha deployment
curl https://<node>.alpha.balloo.su/health

# 6. Run smoke tests
./smoke-tests.sh --environment alpha
```

### Post-Promotion Validation

- [ ] Health check passes on alpha
- [ ] Smoke tests pass
- [ ] No critical errors in logs
- [ ] Performance acceptable

---

## 🔄 ALPHA → PRODUCTION PROMOTION

### Pre-Promotion Checklist

- [ ] QA approved
- [ ] No critical bugs
- [ ] Performance tests passed
- [ ] Security review completed
- [ ] Docs updated
- [ ] Runbook updated
- [ ] Rollback plan ready
- [ ] Tech lead approval
- [ ] Product owner approval
- [ ] Security approval

### Promotion Steps

```bash
# 1. Verify alpha node health
curl https://<node>.alpha.balloo.su/health

# 2. Run production tests
npm run test:production

# 3. Update manifest (branch = production)
# Edit NODETREE_MANIFEST.json

# 4. Deploy to production (canary)
./deploy.sh --target production --node <node-id> --canary 10%

# 5. Monitor canary
./monitor.sh --environment production --duration 1h

# 6. Full rollout (if canary successful)
./deploy.sh --target production --node <node-id> --rollout 100%

# 7. Verify production deployment
curl https://<node>.balloo.su/health

# 8. Run smoke tests
./smoke-tests.sh --environment production
```

### Post-Promotion Validation

- [ ] Health check passes on production
- [ ] Smoke tests pass
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] User metrics stable

---

## ⚠️ TECHNICAL NODES DELIVERY

### Priority-1 Technical Nodes

**ВАЖНО:** Технические узлы working-ветки НЕ двигаются в alpha или production.

```
workdocs-working           — working only
nodes-switcher-working     — working only
kpdegen-working            — working only
projectgeneralsettings-working — working only
database-working           — working only
```

### Delivery Process for Technical Nodes

```bash
# 1. Update working deployment
./deploy.sh --target working --node <technical-node-id>

# 2. Verify working deployment
curl http://localhost:<port>/health

# 3. Run technical tests
./technical-tests.sh --node <technical-node-id>

# 4. Update docs (contracts, runbooks, health model)
# Edit relevant docs

# 5. Validate manifest
node scripts/validate-manifest.js
```

---

## 📋 PRE-DEPLOY CHECKLIST

### For All Nodes

- [ ] Contract updated
- [ ] Summary updated
- [ ] Manifest entry exists
- [ ] State files updated
- [ ] Runbook exists/updated
- [ ] Health model defined
- [ ] Ownership assigned
- [ ] Tests passing
- [ ] Docs validated

### For Production Nodes

- [ ] Alpha testing completed
- [ ] QA approval obtained
- [ ] Security review completed
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Alerts configured

---

## 📋 POST-DEPLOY CHECKLIST

См. [POST_DEPLOY_CHECKLIST.md](./POST_DEPLOY_CHECKLIST.md)

---

## 🔗 RELATED DOCUMENTS

- [ADR-005](../adr/ADR-005-working-alpha-production-release-flow.md) — Release flow ADR
- [ROLLBACK_PLAYBOOK.md](./ROLLBACK_PLAYBOOK.md) — Rollback playbook
- [POST_DEPLOY_CHECKLIST.md](./POST_DEPLOY_CHECKLIST.md) — Post-deploy checklist
- [RUNBOOK_INDEX.md](../runbooks/RUNBOOK_INDEX.md) — Runbooks

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
