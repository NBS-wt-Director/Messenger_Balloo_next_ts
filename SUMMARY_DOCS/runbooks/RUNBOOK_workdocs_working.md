---
title: 'Runbook: workdocs-working'
description: Операционные инструкции для workdocs.working.balloo.su
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
  - SUMMARY_DOCS/nodes/technical/NODE_workdocs_working.md
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_workdocs_working.md
  - SUMMARY_DOCS/nodes/NODE_HEALTH_MODEL.md
---

# 📖 RUNBOOK: workdocs-working

**Node ID:** `workdocs-working`  
**Domain:** `workdocs.working.balloo.su` (optional)  
**Local Dev:** `localhost:3210`  
**Priority:** 1 ⭐  
**Branch:** Working  

---

## 1. PURPOSE

**Назначение:** Рабочая документация Balloo для разработчиков и AI.

**Key Responsibilities:**
- Presentation layer для SUMMARY_DOCS
- Password-protected docs access
- AI-readable documentation serving
- Codegen context assembly support

---

## 2. HEALTH CHECK

### Expected Healthy State

```yaml
status: healthy
http_status: 200
response_time_ms: < 500
summary_docs_accessible: true
contracts_accessible: true
state_files_accessible: true
auth_working: true
```

### Health Check Endpoint

```bash
curl -k https://workdocs.working.balloo.su:3210/health
# OR
curl http://localhost:3210/health
```

### Expected Response

```json
{
  "status": "healthy",
  "timestamp": "2026-06-13T10:00:00Z",
  "docs_loaded": 50,
  "contracts_loaded": 30,
  "state_files_loaded": 10,
  "uptime_seconds": 86400
}
```

### Degraded State

```yaml
status: degraded
indicators:
  - response_time_ms > 1000
  - some_docs_unavailable
  - auth_slow_but_working
```

### Failed State

```yaml
status: failed
indicators:
  - http_status != 200
  - service_unreachable
  - auth_broken
  - docs_not_loaded
```

---

## 3. START CONDITIONS

### Prerequisites

- [ ] Node contract exists: `NODE_CONTRACT_workdocs_working.md`
- [ ] Summary exists: `NODE_workdocs_working.md`
- [ ] SUMMARY_DOCS populated
- [ ] Port 3210 available
- [ ] Auth credentials configured
- [ ] SSL certs (if using domain)

### Required Services

- [ ] Node.js runtime (or appropriate runtime)
- [ ] File system access to SUMMARY_DOCS
- [ ] Network binding (localhost or domain)

### Configuration Files

```
.env.working
.env.local (optional overrides)
ssl/
  - cert.pem
  - key.pem
```

---

## 4. REQUIRED INPUTS/CONFIG

### Environment Variables

```bash
# Required
PORT=3210
NODE_ENV=working
DOCS_ROOT=./SUMMARY_DOCS
AUTH_ENABLED=true
AUTH_PASSWORD=<password_hash>

# Optional
SSL_ENABLED=true
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem
LOG_LEVEL=info
CACHE_ENABLED=true
CACHE_TTL_SECONDS=300
```

### Settings Scopes

| Scope | Source | Mutable By |
|-------|--------|------------|
| docs-settings | projectgeneralsettings-working | developers, docs_team |
| node-level | workdocs-working config | node_admin |
| runtime-local | .env.local | runtime |

---

## 5. COMMON FAILURE MODES

### Failure Mode 1: Docs Not Loading

**Symptoms:**
- 404 on docs pages
- Empty index
- Health check shows `docs_loaded: 0`

**Causes:**
- SUMMARY_DOCS path incorrect
- File permissions issue
- Markdown parsing error

**Resolution:**
```bash
# Check docs path
ls -la ./SUMMARY_DOCS

# Check file permissions
chmod -R 755 ./SUMMARY_DOCS

# Validate markdown
node scripts/validate-markdown.js
```

### Failure Mode 2: Auth Broken

**Symptoms:**
- Login page loops
- 401 on all requests
- Health check shows `auth_working: false`

**Causes:**
- Password hash corrupted
- Session storage full
- Auth module misconfigured

**Resolution:**
```bash
# Reset auth
node scripts/reset-auth.js

# Clear sessions
rm -rf ./sessions/*

# Restart service
npm restart
```

### Failure Mode 3: High Response Time

**Symptoms:**
- Response time > 2000ms
- Timeout errors
- Health check degraded

**Causes:**
- Cache disabled
- Large docs not cached
- Memory pressure

**Resolution:**
```bash
# Enable cache
export CACHE_ENABLED=true

# Clear cache
rm -rf ./cache/*

# Check memory
node --max-old-space-size=4096
```

---

## 6. SAFE RESTART PROCEDURE

### Step 1: Check Current State

```bash
curl http://localhost:3210/health
# Note current status
```

### Step 2: Notify Users (if production-like)

```markdown
Post notice in working channel:
"workdocs-working will restart in 2 minutes"
```

### Step 3: Graceful Shutdown

```bash
# If using PM2
pm2 graceful-stop workdocs

# If using systemd
sudo systemctl stop workdocs

# If using docker
docker stop workdocs
```

### Step 4: Clear Cache (Optional)

```bash
rm -rf ./cache/*
```

### Step 5: Start Service

```bash
# If using PM2
pm2 start workdocs

# If using systemd
sudo systemctl start workdocs

# If using docker
docker start workdocs
```

### Step 6: Verify Health

```bash
# Wait 10 seconds
sleep 10

# Check health
curl http://localhost:3210/health

# Expected: status = healthy
```

### Step 7: Verify Docs Access

```bash
# Check index
curl http://localhost:3210/

# Check key docs
curl http://localhost:3210/nodes/NODETREE_INDEX.md
```

---

## 7. ROLLBACK HINTS

### Rollback Triggers

- New deployment broken
- Docs rendering incorrect
- Auth system failure
- Performance regression

### Rollback Steps

```bash
# 1. Stop current version
pm2 stop workdocs

# 2. Restore previous version
git checkout <previous-commit>

# 3. Restore previous config
cp .env.working.backup .env.working

# 4. Restart
pm2 start workdocs

# 5. Verify
curl http://localhost:3210/health
```

### Rollback Validation

- [ ] Health check passes
- [ ] Docs render correctly
- [ ] Auth works
- [ ] Response time acceptable

---

## 8. ACCESS REQUIREMENTS

### Authentication

| Access Type | Required | Method |
|-------------|----------|--------|
| Public pages | ❌ No | None |
| Protected docs | ✅ Yes | Password |
| Admin functions | ✅ Yes | Admin password |

### Network Access

| Source | Allowed | Notes |
|--------|---------|-------|
| localhost | ✅ Yes | Always |
| working.balloo.su network | ✅ Yes | Internal |
| Public internet | ❌ No | Blocked |

### Role Requirements

| Role | Access Level |
|------|--------------|
| developers | Read protected docs |
| ai-agents | Read all docs |
| internal-team | Read all docs |
| admin | Full access |

---

## 9. LOGS/DIAGNOSTIC SURFACES

### Log Locations

```
logs/
  - workdocs.log (main log)
  - workdocs-error.log (errors only)
  - workdocs-access.log (access log)
```

### Diagnostic Endpoints

```bash
# Health check
curl http://localhost:3210/health

# Metrics
curl http://localhost:3210/metrics

# Debug info (admin only)
curl http://localhost:3210/debug
```

### Key Log Patterns

```
# Successful doc load
[INFO] Loaded docs: 50 files in 1.2s

# Auth success
[INFO] Auth success for user: developer-1

# Auth failure
[WARN] Auth failed for IP: 192.168.1.100

# Error
[ERROR] Failed to parse markdown: NODE_CONTRACT_xxx.md
```

---

## 10. RELATED CONTRACTS/DOCS

### Node Documentation

- [NODE_workdocs_working.md](../nodes/technical/NODE_workdocs_working.md) — Node summary
- [NODE_CONTRACT_workdocs_working.md](../contracts/nodes/NODE_CONTRACT_workdocs_working.md) — Node contract

### Related Nodes

- [kpdegen-working](./RUNBOOK_kpdegen_working.md) — Codegen (uses workdocs)
- [nodes-switcher-working](./RUNBOOK_nodes_switcher_working.md) — Version management
- [docs-working](./RUNBOOK_docs_working.md) — Public docs (related)

### Related Playbooks

- [NODE_DELIVERY_PLAYBOOK.md](../playbooks/NODE_DELIVERY_PLAYBOOK.md) — Delivery process
- [ROLLBACK_PLAYBOOK.md](../playbooks/ROLLBACK_PLAYBOOK.md) — Rollback process
- [POST_DEPLOY_CHECKLIST.md](../playbooks/POST_DEPLOY_CHECKLIST.md) — Post-deploy checks

### Related Schemas

- [node-settings.schema.json](../schemas/node-settings.schema.json) — Settings schema
- [node-manifest.schema.json](../schemas/node-manifest.schema.json) — Manifest schema

---

## 📋 QUICK REFERENCE

| Action | Command |
|--------|---------|
| Health check | `curl localhost:3210/health` |
| Restart | `pm2 restart workdocs` |
| View logs | `tail -f logs/workdocs.log` |
| Clear cache | `rm -rf ./cache/*` |
| Reset auth | `node scripts/reset-auth.js` |

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
