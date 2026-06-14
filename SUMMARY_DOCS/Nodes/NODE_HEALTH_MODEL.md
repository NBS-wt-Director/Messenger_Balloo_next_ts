---
title: Node Health Model
description: Модель здоровья узлов Balloo — состояния, проверки, сигналы
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - health
  - monitoring
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/state/node-health-map.json
  - SUMMARY_DOCS/runbooks/RUNBOOK_INDEX.md
---

# 🏥 NODE HEALTH MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **модель здоровья** для всех узлов Balloo.

**Цель:** Обеспечить консистентные health checks и state definitions для всех узлов.

---

## 📊 HEALTH STATES

### 1. Healthy

```yaml
state: healthy
description: Узел работает нормально
indicators:
  - http_status: 200
  - response_time_ms: < threshold
  - all_checks_passing: true
actions:
  - normal_operation
  - routine_monitoring
```

### 2. Degraded

```yaml
state: degraded
description: Узел работает с ограничениями
indicators:
  - response_time_ms: > threshold
  - some_checks_failing: true
  - partial_functionality: true
actions:
  - investigate
  - alert_team
  - prepare_rollback
```

### 3. Failed

```yaml
state: failed
description: Узел не работает
indicators:
  - http_status: != 200
  - service_unreachable: true
  - critical_checks_failing: true
actions:
  - alert_immediately
  - initiate_recovery
  - rollback_if_needed
```

### 4. Startup

```yaml
state: startup
description: Узел запускается
indicators:
  - service_starting: true
  - health_check_pending: true
  - initialization_in_progress: true
actions:
  - wait_for_healthy
  - timeout_if_too_long
```

### 5. Maintenance

```yaml
state: maintenance
description: Узел на обслуживании
indicators:
  - maintenance_mode: true
  - health_checks_paused: true
  - scheduled_downtime: true
actions:
  - notify_users
  - perform_maintenance
  - return_to_healthy
```

---

## 🔍 HEALTH CHECKS

### Check Types

| Type | Description | Frequency |
|------|-------------|-----------|
| **HTTP Status** | Проверка HTTP status code | 30s |
| **Response Time** | Проверка времени ответа | 30s |
| **Smoke Tests** | Базовые функциональные тесты | 5m |
| **Deep Checks** | Полная проверка функциональности | 15m |
| **Dependency Checks** | Проверка зависимостей | 1m |

### Check Severity

| Severity | Description | Action |
|----------|-------------|--------|
| **Critical** | Узел не работает | Alert immediately |
| **Warning** | Деградация производительности | Alert team |
| **Info** | Мелкие проблемы | Log only |

---

## 📋 PRIORITY-1 TECHNICAL NODES HEALTH

### workdocs-working

```json
{
  "nodeId": "workdocs-working",
  "healthChecks": [
    {"name": "http_status", "type": "http", "expected": 200, "critical": true},
    {"name": "response_time", "type": "latency", "threshold_ms": 500, "critical": false},
    {"name": "docs_loaded", "type": "functional", "expected_min": 50, "critical": true},
    {"name": "auth_working", "type": "functional", "expected": true, "critical": true}
  ],
  "criticalSignals": ["http_status", "docs_loaded", "auth_working"],
  "optionalSignals": ["response_time", "cache_hit_rate"],
  "smokeChecks": ["index_page_loads", "contract_accessible"],
  "rollbackCheckRequired": true,
  "healthOwner": "developers"
}
```

### nodes-switcher-working

```json
{
  "nodeId": "nodes-switcher-working",
  "healthChecks": [
    {"name": "http_status", "type": "http", "expected": 200, "critical": true},
    {"name": "response_time", "type": "latency", "threshold_ms": 500, "critical": false},
    {"name": "version_registry", "type": "functional", "expected": "accessible", "critical": true},
    {"name": "nodes_tracked", "type": "functional", "expected_min": 29, "critical": true}
  ],
  "criticalSignals": ["http_status", "version_registry", "nodes_tracked"],
  "optionalSignals": ["response_time", "rollout_active"],
  "smokeChecks": ["version_query_works", "compatibility_check_works"],
  "rollbackCheckRequired": true,
  "healthOwner": "devops"
}
```

### kpdegen-working

```json
{
  "nodeId": "kpdegen-working",
  "healthChecks": [
    {"name": "http_status", "type": "http", "expected": 200, "critical": true},
    {"name": "response_time", "type": "latency", "threshold_ms": 1000, "critical": false},
    {"name": "codegen_engine", "type": "functional", "expected": "ready", "critical": true},
    {"name": "templates_loaded", "type": "functional", "expected_min": 10, "critical": true}
  ],
  "criticalSignals": ["http_status", "codegen_engine", "templates_loaded"],
  "optionalSignals": ["response_time", "queue_length"],
  "smokeChecks": ["test_generation_works", "templates_accessible"],
  "rollbackCheckRequired": true,
  "healthOwner": "developers"
}
```

### projectgeneralsettings-working

```json
{
  "nodeId": "projectgeneralsettings-working",
  "healthChecks": [
    {"name": "http_status", "type": "http", "expected": 200, "critical": true},
    {"name": "response_time", "type": "latency", "threshold_ms": 500, "critical": false},
    {"name": "settings_storage", "type": "functional", "expected": "accessible", "critical": true},
    {"name": "audit_log", "type": "functional", "expected": "working", "critical": true}
  ],
  "criticalSignals": ["http_status", "settings_storage", "audit_log"],
  "optionalSignals": ["response_time", "session_count"],
  "smokeChecks": ["settings_ui_loads", "feature_flags_accessible"],
  "rollbackCheckRequired": true,
  "healthOwner": "admin"
}
```

### database-working

```json
{
  "nodeId": "database-working",
  "healthChecks": [
    {"name": "connection", "type": "tcp", "port": 5432, "critical": true},
    {"name": "response_time", "type": "latency", "threshold_ms": 100, "critical": false},
    {"name": "query_execution", "type": "functional", "expected": "success", "critical": true},
    {"name": "disk_space", "type": "resource", "threshold_percent": 80, "critical": true}
  ],
  "criticalSignals": ["connection", "query_execution", "disk_space"],
  "optionalSignals": ["response_time", "connection_count"],
  "smokeChecks": ["simple_query_works", "tables_accessible"],
  "rollbackCheckRequired": true,
  "healthOwner": "dba"
}
```

---

## 📈 PRODUCTION NODES HEALTH (Excerpt)

### api-production

```json
{
  "nodeId": "api-production",
  "healthChecks": [
    {"name": "http_status", "type": "http", "expected": 200, "critical": true},
    {"name": "response_time", "type": "latency", "threshold_ms": 200, "critical": true},
    {"name": "api_endpoints", "type": "functional", "expected": "accessible", "critical": true},
    {"name": "auth_layer", "type": "functional", "expected": "working", "critical": true}
  ],
  "criticalSignals": ["http_status", "response_time", "api_endpoints"],
  "optionalSignals": ["request_rate", "error_rate"],
  "smokeChecks": ["health_endpoint", "auth_flow"],
  "rollbackCheckRequired": true,
  "healthOwner": "api-team"
}
```

---

## 🎯 HEALTH MODEL SCHEMA

```typescript
interface NodeHealthModel {
  nodeId: string;
  healthChecks: HealthCheck[];
  criticalSignals: string[];
  optionalSignals: string[];
  smokeChecks: string[];
  rollbackCheckRequired: boolean;
  healthOwner: string;
}

interface HealthCheck {
  name: string;
  type: "http" | "tcp" | "functional" | "resource" | "latency";
  expected?: any;
  threshold_ms?: number;
  threshold_percent?: number;
  port?: number;
  critical: boolean;
}
```

---

## ✅ CRITICAL INVARIANTS

1. **Все priority-1 узлы имеют health model** — обязательно
2. **Critical signals требуют alert** — немедленно
3. **Rollback check required для production** — обязательно
4. **Health owner назначен** — для каждого узла
5. **Smoke checks выполняются регулярно** — 5 минут

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [node-health-map.json](../state/node-health-map.json) — Health state
- [RUNBOOK_INDEX.md](../runbooks/RUNBOOK_INDEX.md) — Runbooks

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
