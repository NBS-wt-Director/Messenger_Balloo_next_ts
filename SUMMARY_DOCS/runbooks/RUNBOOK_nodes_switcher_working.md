---
title: 'Runbook: nodes-switcher-working'
description: Операционные инструкции для nodes-switcher.working.balloo.su
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - runbook
  - technical-node
  - priority-1
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/technical/NODE_nodes_switcher_working.md
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_nodes_switcher_working.md
  - SUMMARY_DOCS/nodes/NODE_HEALTH_MODEL.md
---

# 📖 RUNBOOK: nodes-switcher-working

**Node ID:** `nodes-switcher-working`  
**Domain:** `nodes-switcher.working.balloo.su` (optional)  
**Local Dev:** `localhost:3211`  
**Priority:** 1 ⭐  
**Branch:** Working  

---

## 1. PURPOSE

**Назначение:** Менеджер версий узлов и rollout control.

**Key Responsibilities:**
- Node version registry
- Rollout orchestration
- Compatibility checks
- Update coordination
- Version tracking

---

## 2. HEALTH CHECK

### Expected Healthy State

```yaml
status: healthy
http_status: 200
response_time_ms: < 500
version_registry_accessible: true
rollout_control_working: true
compatibility_checks_passing: true
all_nodes_tracked: 29
```

### Health Check Endpoint

```bash
curl -k https://nodes-switcher.working.balloo.su:3211/health
# OR
curl http://localhost:3211/health
```

### Expected Response

```json
{
  "status": "healthy",
  "timestamp": "2026-06-13T10:00:00Z",
  "nodes_tracked": 29,
  "rollouts_active": 0,
  "compatibility_issues": 0,
  "uptime_seconds": 86400
}
```

### Degraded State

```yaml
status: degraded
indicators:
  - response_time_ms > 1000
  - some_nodes_not_tracked
  - compatibility_warnings > 0
```

### Failed State

```yaml
status: failed
indicators:
  - http_status != 200
  - service_unreachable
  - version_registry_corrupted
```

---

## 3. START CONDITIONS

### Prerequisites

- [ ] Node contract exists
- [ ] Version registry initialized
- [ ] Port 3211 available
- [ ] Auth credentials configured
- [ ] Database connection (if used)

### Required Services

- [ ] Node.js runtime
- [ ] Version registry storage
- [ ] Network binding

### Configuration Files

```
.env.working
version-registry.json
compatibility-matrix.json
```

---

## 4. REQUIRED INPUTS/CONFIG

### Environment Variables

```bash
# Required
PORT=3211
NODE_ENV=working
VERSION_REGISTRY_PATH=./version-registry.json
COMPATIBILITY_MATRIX_PATH=./compatibility-matrix.json
AUTH_ENABLED=true

# Optional
LOG_LEVEL=info
ROLLOUT_DEFAULT_PERCENTAGE=10
COMPATIBILITY_CHECK_STRICT=true
```

### Settings Scopes

| Scope | Source | Mutable By |
|-------|--------|------------|
| version-registry | nodes-switcher-working | devops, admin |
| rollout-control | nodes-switcher-working | devops, admin |
| node-level | nodes-switcher config | node_admin |

---

## 5. COMMON FAILURE MODES

### Failure Mode 1: Version Registry Corrupted

**Symptoms:**
- Nodes not tracked
- Version mismatches
- Health check shows errors

**Resolution:**
```bash
# Restore from backup
cp version-registry.json.backup version-registry.json

# Or rebuild from manifest
node scripts/rebuild-registry.js
```

### Failure Mode 2: Rollout Stuck

**Symptoms:**
- Rollout not progressing
- Nodes in inconsistent state

**Resolution:**
```bash
# Check rollout status
curl http://localhost:3211/rollout/status

# Force complete or rollback
node scripts/rollout-force-complete.js
# OR
node scripts/rollout-rollback.js
```

### Failure Mode 3: Compatibility Check Failing

**Symptoms:**
- Updates blocked
- Compatibility warnings

**Resolution:**
```bash
# Check compatibility matrix
cat compatibility-matrix.json

# Update matrix if needed
node scripts/update-compatibility.js
```

---

## 6. SAFE RESTART PROCEDURE

### Steps

```bash
# 1. Check current rollouts
curl http://localhost:3211/rollout/status

# 2. Pause active rollouts (if any)
curl -X POST http://localhost:3211/rollout/pause

# 3. Stop service
pm2 stop nodes-switcher

# 4. Start service
pm2 start nodes-switcher

# 5. Verify health
curl http://localhost:3211/health

# 6. Resume rollouts (if paused)
curl -X POST http://localhost:3211/rollout/resume
```

---

## 7. ROLLBACK HINTS

### Rollback Triggers

- Version registry corruption
- Rollout causing issues
- Compatibility breakage

### Rollback Steps

```bash
# 1. Stop current version
pm2 stop nodes-switcher

# 2. Restore previous registry
git checkout <previous-commit> -- version-registry.json

# 3. Restore previous config
cp .env.working.backup .env.working

# 4. Restart
pm2 start nodes-switcher

# 5. Verify
curl http://localhost:3211/health
```

---

## 8. ACCESS REQUIREMENTS

### Authentication

| Access Type | Required | Method |
|-------------|----------|--------|
| Version view | ✅ Yes | Token |
| Rollout control | ✅ Yes | Admin token |
| Compatibility checks | ✅ Yes | Developer token |

### Role Requirements

| Role | Access Level |
|------|--------------|
| developers | View versions |
| devops | Full rollout control |
| admin | Full access |

---

## 9. LOGS/DIAGNOSTIC SURFACES

### Log Locations

```
logs/
  - nodes-switcher.log
  - nodes-switcher-error.log
  - rollout.log
```

### Diagnostic Endpoints

```bash
# Health check
curl http://localhost:3211/health

# Version registry
curl http://localhost:3211/versions

# Rollout status
curl http://localhost:3211/rollout/status

# Compatibility matrix
curl http://localhost:3211/compatibility
```

---

## 10. RELATED CONTRACTS/DOCS

### Node Documentation

- [NODE_nodes_switcher_working.md](../nodes/technical/NODE_nodes_switcher_working.md)
- [NODE_CONTRACT_nodes_switcher_working.md](../contracts/nodes/NODE_CONTRACT_nodes_switcher_working.md)

### Related Playbooks

- [NODE_DELIVERY_PLAYBOOK.md](../playbooks/NODE_DELIVERY_PLAYBOOK.md)
- [ROLLBACK_PLAYBOOK.md](../playbooks/ROLLBACK_PLAYBOOK.md)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
