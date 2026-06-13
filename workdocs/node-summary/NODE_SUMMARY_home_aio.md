---
title: Node Summary - Home AIO
description: Документация узла home_aio
version: 1.0.0
date: 2026-06-13
---

# 🖥️ NODE_SUMMARY_home_aio

**Canonical Name:** `home_aio`  
**Aliases:** `home`, `aio`, `secondary-dev`

---

## 1. NODE IDENTITY

- **Canonical Name:** home_aio
- **Aliases:** home, aio, secondary-dev
- **Physical Device:** Домашний моноблок Linux
- **OS Target:** Linux (Ubuntu 22.04 LTS)
- **Role Class:** dev-node
- **Criticality:** LOW (для production), MEDIUM (для dev)
- **Always-On:** NO

---

## 2. RESPONSIBILITIES

### Main Functions:
- MAY быть secondary dev environment
- MAY запускать preview environments
- MAY выполнять secondary AI model inference
- MAY использоваться для local CI/validation

### Project Bindings:
- **Balloo Messenger:** Dev/Staging

### Services Expected:
- Docker + Docker Compose
- Node.js (dev)
- PostgreSQL (dev/staging only)
- Preview environments

---

## 3. BOUNDARIES

### MUST NEVER DO:
- MUST NOT быть production source of truth
- MUST NOT хранить production данные без бэкапа
- MUST NOT выполнять production workload

### NOT AUTHORITATIVE FOR:
- Production data
- Production deployments

---

## 4. NETWORK & ACCESS

### Private Access:
- Tailscale

### Public Exposure:
- MAY (preview environments через tunnel)

---

## 5. DEPLOYMENT ROLE

- **Dev:** YES
- **Stage:** YES
- **Prod:** NO
- **Can host previews:** YES

---

## 6. RECOVERY ROLE

- **Recovery Priority:** LOW
- **What breaks if absent:** Dev workflow замедляется
- **Recovery Method:** Восстановление из git + sync с work-server

---

## 7-8. SOURCES & RECREATION

- Sync с work-server repositories
- Install Docker, Node.js
- Configure Tailscale
- Optional for production

---

**🎈 Balloo**