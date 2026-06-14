---
title: 'Runbook: projectgeneralsettings-working'
description: Операционные инструкции для projectgeneralsettings.working.balloo.su
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
  - SUMMARY_DOCS/nodes/technical/NODE_projectgeneralsettings_working.md
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_projectgeneralsettings_working.md
  - SUMMARY_DOCS/nodes/NODE_HEALTH_MODEL.md
---

# 📖 RUNBOOK: projectgeneralsettings-working

**Node ID:** `projectgeneralsettings-working`  
**Domain:** `projectgeneralsettings.working.balloo.su` (optional)  
**Local Dev:** `localhost:3212`  
**Priority:** 1 ⭐  
**Branch:** Working  

---

## 1. PURPOSE

**Назначение:** Центральное управление настройками проекта Balloo.

**Key Responsibilities:**
- Project settings authority
- Node settings map management
- Global vs node-local settings
- Feature flags management
- Release toggles control
- Tariffs/features (if applicable)

---

## 2. HEALTH CHECK

### Expected Healthy State

```yaml
status: healthy
http_status: 200
response_time_ms: < 500
settings_ui_accessible: true
settings_storage_accessible: true
audit_log_working: true
all_scopes_available: true
```

### Health Check Endpoint

```bash
curl -k https://projectgeneralsettings.working.balloo.su:3212/health
# OR
curl http://localhost:3212/health
```

### Expected Response

```json
{
  "status": "healthy",
  "timestamp": "2026-06-13T10:00:00Z",
  "settings_scopes_available": 15,
  "nodes_configured": 29,
  "feature_flags_active": 10,
  "audit_log_entries": 1000,
  "uptime_seconds": 86400
}
```

### Degraded State

```yaml
status: degraded
indicators:
  - response_time_ms > 1000
  - some_settings_scopes_unavailable
  - audit_log_slow
```

### Failed State

```yaml
status: failed
indicators:
  - http_status != 200
  - settings_storage_corrupted
  - auth_broken
```

---

## 3. START CONDITIONS

### Prerequisites

- [ ] Node contract exists
- [ ] Settings storage initialized
- [ ] Port 3212 available
- [ ] Auth credentials configured
- [ ] Audit log storage ready

### Required Services

- [ ] Node.js runtime
- [ ] Settings storage (database or file)
- [ ] Audit log storage
- [ ] Network binding

### Configuration Files

```
.env.working
settings-storage.json
audit-log.json
feature-flags.json
```

---

## 4. REQUIRED INPUTS/CONFIG

### Environment Variables

```bash
# Required
PORT=3212
NODE_ENV=working
SETTINGS_STORAGE_PATH=./settings-storage.json
AUDIT_LOG_PATH=./audit-log.json
FEATURE_FLAGS_PATH=./feature-flags.json
AUTH_ENABLED=true

# Optional
LOG_LEVEL=info
AUDIT_ENABLED=true
SESSION_TIMEOUT_MINUTES=60
```

### Settings Scopes

| Scope | Authority | Mutable By |
|-------|-----------|------------|
| project-global | projectgeneralsettings-working | admin, owner |
| branch-level | projectgeneralsettings-working | admin, branch_owner |
| node-level | projectgeneralsettings-working + node | admin, node_admin |
| feature-level | projectgeneralsettings-working | admin, product-owner |

---

## 5. COMMON FAILURE MODES

### Failure Mode 1: Settings Storage Corrupted

**Symptoms:**
- Settings not loading
- UI shows errors
- Health check fails

**Resolution:**
```bash
# Restore from backup
cp settings-storage.json.backup settings-storage.json

# Or rebuild from state files
node scripts/rebuild-settings.js
```

### Failure Mode 2: Audit Log Full

**Symptoms:**
- Settings updates slow
- Disk space warning
- Audit writes failing

**Resolution:**
```bash
# Archive old audit logs
node scripts/archive-audit-logs.js

# Compress old logs
gzip audit-log-*.json

# Clear old archives (keep 90 days)
find . -name "audit-log-*.json.gz" -mtime +90 -delete
```

### Failure Mode 3: Feature Flags Not Applying

**Symptoms:**
- Feature flags not taking effect
- Nodes not receiving flag updates

**Resolution:**
```bash
# Check feature flags file
cat feature-flags.json

# Reload flags
curl -X POST http://localhost:3212/admin/reload-flags

# Check node sync
curl http://localhost:3212/admin/node-sync-status
```

---

## 6. SAFE RESTART PROCEDURE

### Steps

```bash
# 1. Check current state
curl http://localhost:3212/health

# 2. Notify users (if any)
# Post notice in working channel

# 3. Stop service
pm2 stop projectgeneralsettings

# 4. Backup settings
cp settings-storage.json settings-storage.json.backup.$(date +%Y%m%d-%H%M%S)

# 5. Clear cache (if any)
rm -rf ./cache/*

# 6. Start service
pm2 start projectgeneralsettings

# 7. Verify health
curl http://localhost:3212/health

# 8. Verify settings UI
curl http://localhost:3212/
```

---

## 7. ROLLBACK HINTS

### Rollback Triggers

- Settings corruption
- Feature flags causing issues
- Audit log failure

### Rollback Steps

```bash
# 1. Stop current version
pm2 stop projectgeneralsettings

# 2. Restore previous settings
git checkout <previous-commit> -- settings-storage.json

# 3. Restore previous config
cp .env.working.backup .env.working

# 4. Restart
pm2 start projectgeneralsettings

# 5. Verify
curl http://localhost:3212/health
```

---

## 8. ACCESS REQUIREMENTS

### Authentication

| Access Type | Required | Method |
|-------------|----------|--------|
| Settings view | ✅ Yes | Token |
| Settings edit | ✅ Yes | Admin token |
| Feature flags | ✅ Yes | Admin/Product token |
| Audit log view | ✅ Yes | Admin token |

### Role Requirements

| Role | Access Level |
|------|--------------|
| admin | Full settings control |
| owner | Full settings control |
| product-owner | Feature flags control |
| developer | Read-only settings |

---

## 9. LOGS/DIAGNOSTIC SURFACES

### Log Locations

```
logs/
  - projectgeneralsettings.log
  - projectgeneralsettings-error.log
  - audit-log.json
```

### Diagnostic Endpoints

```bash
# Health check
curl http://localhost:3212/health

# Settings status
curl http://localhost:3212/admin/settings-status

# Feature flags
curl http://localhost:3212/admin/feature-flags

# Audit log (admin)
curl http://localhost:3212/admin/audit-log

# Node sync status
curl http://localhost:3212/admin/node-sync-status
```

---

## 10. RELATED CONTRACTS/DOCS

### Node Documentation

- [NODE_projectgeneralsettings_working.md](../nodes/technical/NODE_projectgeneralsettings_working.md)
- [NODE_CONTRACT_projectgeneralsettings_working.md](../contracts/nodes/NODE_CONTRACT_projectgeneralsettings_working.md)

### Related Playbooks

- [NODE_DELIVERY_PLAYBOOK.md](../playbooks/NODE_DELIVERY_PLAYBOOK.md)
- [ROLLBACK_PLAYBOOK.md](../playbooks/ROLLBACK_PLAYBOOK.md)
- [canonical-node-doc-update-playbook.md](../playbooks/canonical-node-doc-update-playbook.md)

### Related Schemas

- [project-settings.schema.json](../schemas/project-settings.schema.json)
- [node-settings.schema.json](../schemas/node-settings.schema.json)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
