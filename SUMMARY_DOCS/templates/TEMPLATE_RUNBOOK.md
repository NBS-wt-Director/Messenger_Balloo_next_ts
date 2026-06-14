---
title: 'Template: Runbook'
description: Шаблон для runbook узла Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - template
  - runbook
  - canonical
related_docs:
  - SUMMARY_DOCS/runbooks/RUNBOOK_INDEX.md
  - SUMMARY_DOCS/templates/TEMPLATE_NODE_CONTRACT.md
---

# 📖 TEMPLATE: RUNBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 📝 TEMPLATE

```markdown
---
title: 'Runbook: <node-id>'
description: <Runbook description>
version: 1.0.0
date: YYYY-MM-DD
author: <Author>
status: active
audience: both
tags:
  - runbook
  - <node-id>
  - <branch>
related_docs:
  - SUMMARY_DOCS/nodes/summary/NODE_SUMMARY_<node-id>.md
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_<node-id>.md
  - SUMMARY_DOCS/nodes/NODE_HEALTH_MODEL.md
---

# 📖 RUNBOOK: <node-id>

**Node ID:** `<node-id>`  
**Domain:** `<domain or null>`  
**Local Dev:** `localhost:<PORT>`  
**Priority:** `<1-4>`  
**Branch:** `<production|alpha|working>`  

---

## 1. PURPOSE

<Description of node purpose>

**Key Responsibilities:**
- <Responsibility 1>
- <Responsibility 2>
- <Responsibility 3>

---

## 2. HEALTH CHECK

### Expected Healthy State

```yaml
status: healthy
http_status: 200
response_time_ms: < threshold
<other-indicators>
```

### Health Check Endpoint

```bash
curl http://localhost:<PORT>/health
```

### Expected Response

```json
{
  "status": "healthy",
  ...
}
```

### Degraded State

```yaml
status: degraded
indicators:
  - <indicator-1>
  - <indicator-2>
```

### Failed State

```yaml
status: failed
indicators:
  - <indicator-1>
  - <indicator-2>
```

---

## 3. START CONDITIONS

### Prerequisites

- [ ] <Prerequisite 1>
- [ ] <Prerequisite 2>
- [ ] <Prerequisite 3>

### Required Services

- [ ] <Service 1>
- [ ] <Service 2>

### Configuration Files

```
<config-file-1>
<config-file-2>
```

---

## 4. REQUIRED INPUTS/CONFIG

### Environment Variables

```bash
# Required
PORT=<PORT>
NODE_ENV=<environment>
<other-vars>

# Optional
LOG_LEVEL=info
<optional-vars>
```

### Settings Scopes

| Scope | Source | Mutable By |
|-------|--------|------------|
| <scope> | <source> | <who> |

---

## 5. COMMON FAILURE MODES

### Failure Mode 1: <Name>

**Symptoms:**
- <Symptom 1>
- <Symptom 2>

**Causes:**
- <Cause 1>
- <Cause 2>

**Resolution:**
```bash
<resolution-commands>
```

### Failure Mode 2: <Name>

...

---

## 6. SAFE RESTART PROCEDURE

### Steps

```bash
# 1. Check current state
<command>

# 2. <Step 2>
<command>

# 3. <Step 3>
<command>

# 4. Verify health
curl http://localhost:<PORT>/health
```

---

## 7. ROLLBACK HINTS

### Rollback Triggers

- <Trigger 1>
- <Trigger 2>

### Rollback Steps

```bash
# 1. Stop current version
<command>

# 2. Restore previous version
<command>

# 3. Restart
<command>

# 4. Verify
<command>
```

---

## 8. ACCESS REQUIREMENTS

### Authentication

| Access Type | Required | Method |
|-------------|----------|--------|
| <type> | <Yes/No> | <method> |

### Role Requirements

| Role | Access Level |
|------|--------------|
| <role> | <level> |

---

## 9. LOGS/DIAGNOSTIC SURFACES

### Log Locations

```
logs/
  - <log-file-1>
  - <log-file-2>
```

### Diagnostic Endpoints

```bash
# Health check
curl http://localhost:<PORT>/health

# <Other endpoints>
<command>
```

### Key Log Patterns

```
<log-pattern-example>
```

---

## 10. RELATED CONTRACTS/DOCS

### Node Documentation

- [NODE_SUMMARY_<node-id>.md](../nodes/summary/NODE_SUMMARY_<node-id>.md)
- [NODE_CONTRACT_<node-id>.md](../contracts/nodes/NODE_CONTRACT_<node-id>.md)

### Related Playbooks

- [NODE_DELIVERY_PLAYBOOK.md](../playbooks/NODE_DELIVERY_PLAYBOOK.md)
- [ROLLBACK_PLAYBOOK.md](../playbooks/ROLLBACK_PLAYBOOK.md)

---

## 📋 QUICK REFERENCE

| Action | Command |
|--------|---------|
| Health check | `curl localhost:<PORT>/health` |
| Restart | `<restart-command>` |
| View logs | `<logs-command>` |

---

**Создано:** YYYY-MM-DD  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** <Author>

---

**🎈 Balloo - Переверни общение!**
```

---

## 📋 REQUIRED SECTIONS

1. **Purpose** — node purpose and responsibilities
2. **Health Check** — health states and endpoints
3. **Start Conditions** — prerequisites and config
4. **Required Inputs/Config** — environment variables
5. **Common Failure Modes** — failures and resolutions
6. **Safe Restart Procedure** — restart steps
7. **Rollback Hints** — rollback triggers and steps
8. **Access Requirements** — auth and roles
9. **Logs/Diagnostic Surfaces** — logs and endpoints
10. **Related Contracts/Docs** — cross-references

---

## ✅ BEST PRACTICES

- ✅ Пошаговые инструкции
- ✅ Commands для копирования
- ✅ Clear failure modes
- ✅ Quick reference section
- ✅ Cross-references к contract

---

**🎈 Balloo - Переверни общение!**
