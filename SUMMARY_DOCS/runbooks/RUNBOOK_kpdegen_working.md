---
title: 'Runbook: kpdegen-working'
description: Операционные инструкции для kpdegen.working.balloo.su
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
  - SUMMARY_DOCS/nodes/technical/NODE_kpdegen_working.md
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_kpdegen_working.md
  - SUMMARY_DOCS/nodes/NODE_HEALTH_MODEL.md
---

# 📖 RUNBOOK: kpdegen-working

**Node ID:** `kpdegen-working`  
**Domain:** `kpdegen.working.balloo.su` (optional)  
**Local Dev:** `localhost:4200`  
**Priority:** 1 ⭐  
**Branch:** Working  

---

## 1. PURPOSE

**Назначение:** Серверный кодогенератор Balloo.

**Key Responsibilities:**
- Code generation from contracts
- Config generation from state files
- Docs generation from templates
- Safety checks on generated code
- Scope restrictions enforcement

---

## 2. HEALTH CHECK

### Expected Healthy State

```yaml
status: healthy
http_status: 200
response_time_ms: < 1000
codegen_engine_ready: true
templates_loaded: true
contracts_accessible: true
state_files_accessible: true
output_dir_writable: true
```

### Health Check Endpoint

```bash
curl -k https://kpdegen.working.balloo.su:4200/health
# OR
curl http://localhost:4200/health
```

### Expected Response

```json
{
  "status": "healthy",
  "timestamp": "2026-06-13T10:00:00Z",
  "templates_loaded": 10,
  "contracts_available": 30,
  "state_files_available": 15,
  "last_codegen_run": "2026-06-13T09:00:00Z",
  "uptime_seconds": 86400
}
```

### Degraded State

```yaml
status: degraded
indicators:
  - response_time_ms > 3000
  - some_templates_missing
  - output_dir_slow
```

### Failed State

```yaml
status: failed
indicators:
  - http_status != 200
  - codegen_engine_crashed
  - templates_not_loaded
```

---

## 3. START CONDITIONS

### Prerequisites

- [ ] Node contract exists
- [ ] Templates directory populated
- [ ] Contracts accessible
- [ ] State files accessible
- [ ] Port 4200 available
- [ ] Output directory writable

### Required Services

- [ ] Node.js runtime (or appropriate runtime)
- [ ] File system access
- [ ] Network binding

### Configuration Files

```
.env.working
templates/
contracts/
state/
output/
```

---

## 4. REQUIRED INPUTS/CONFIG

### Environment Variables

```bash
# Required
PORT=4200
NODE_ENV=working
TEMPLATES_DIR=./templates
CONTRACTS_DIR=./SUMMARY_DOCS/contracts
STATE_DIR=./SUMMARY_DOCS/state
OUTPUT_DIR=./output

# Optional
LOG_LEVEL=info
CODEGEN_TIMEOUT_MS=60000
MAX_CONCURRENT_GENERATIONS=5
SAFETY_CHECKS_ENABLED=true
```

### Settings Scopes

| Scope | Source | Mutable By |
|-------|--------|------------|
| codegen-settings | kpdegen-working | developers, ai-agents |
| node-level | kpdegen config | node_admin |

---

## 5. COMMON FAILURE MODES

### Failure Mode 1: Templates Not Loading

**Symptoms:**
- Health check shows `templates_loaded: 0`
- Codegen fails immediately

**Resolution:**
```bash
# Check templates directory
ls -la ./templates

# Validate templates
node scripts/validate-templates.js

# Reload templates
curl -X POST http://localhost:4200/admin/reload-templates
```

### Failure Mode 2: Codegen Timeout

**Symptoms:**
- Codegen requests timeout
- Partial output generated

**Resolution:**
```bash
# Increase timeout
export CODEGEN_TIMEOUT_MS=120000

# Check for large contracts
find ./contracts -size +1M

# Split large contracts if needed
```

### Failure Mode 3: Output Directory Full

**Symptoms:**
- Codegen fails with disk error
- No new files generated

**Resolution:**
```bash
# Check disk space
df -h

# Clean old output
rm -rf ./output/old-*

# Clear output (if safe)
rm -rf ./output/*
```

---

## 6. SAFE RESTART PROCEDURE

### Steps

```bash
# 1. Check active generations
curl http://localhost:4200/admin/active-generations

# 2. Wait for active generations to complete (or cancel)
curl -X POST http://localhost:4200/admin/cancel-all

# 3. Stop service
pm2 stop kpdegen

# 4. Clear temp files
rm -rf ./tmp/*

# 5. Start service
pm2 start kpdegen

# 6. Verify health
curl http://localhost:4200/health

# 7. Test codegen
curl -X POST http://localhost:4200/generate/test
```

---

## 7. ROLLBACK HINTS

### Rollback Triggers

- Codegen producing incorrect code
- Templates corrupted
- Safety checks bypassed

### Rollback Steps

```bash
# 1. Stop current version
pm2 stop kpdegen

# 2. Restore previous templates
git checkout <previous-commit> -- templates/

# 3. Restore previous config
cp .env.working.backup .env.working

# 4. Restart
pm2 start kpdegen

# 5. Verify with test generation
curl -X POST http://localhost:4200/generate/test
```

---

## 8. ACCESS REQUIREMENTS

### Authentication

| Access Type | Required | Method |
|-------------|----------|--------|
| Codegen API | ✅ Yes | API token |
| Admin functions | ✅ Yes | Admin token |
| Health check | ❌ No | Public |

### Role Requirements

| Role | Access Level |
|------|--------------|
| developers | Codegen API |
| ai-agents | Codegen API |
| admin | Full access |

---

## 9. LOGS/DIAGNOSTIC SURFACES

### Log Locations

```
logs/
  - kpdegen.log
  - kpdegen-error.log
  - codegen-audit.log
```

### Diagnostic Endpoints

```bash
# Health check
curl http://localhost:4200/health

# Active generations
curl http://localhost:4200/admin/active-generations

# Template status
curl http://localhost:4200/admin/templates

# Recent generations
curl http://localhost:4200/admin/recent-generations
```

---

## 10. RELATED CONTRACTS/DOCS

### Node Documentation

- [NODE_kpdegen_working.md](../nodes/technical/NODE_kpdegen_working.md)
- [NODE_CONTRACT_kpdegen_working.md](../contracts/nodes/NODE_CONTRACT_kpdegen_working.md)

### Related Playbooks

- [NODE_DELIVERY_PLAYBOOK.md](../playbooks/NODE_DELIVERY_PLAYBOOK.md)
- [ROLLBACK_PLAYBOOK.md](../playbooks/ROLLBACK_PLAYBOOK.md)
- [codegen-playbook.md](../playbooks/codegen-playbook.md)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
