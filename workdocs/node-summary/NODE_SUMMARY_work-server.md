---
title: Node Summary - Work Server
description: Документация узла work-server
version: 1.0.0
date: 2026-06-13
---

# 🖥️ NODE_SUMMARY_work-server

**Canonical Name:** `work-server`  
**Aliases:** `work`, `production-server`, `main-server`

---

## 1. NODE IDENTITY

- **Canonical Name:** work-server
- **Aliases:** work, production-server, main-server
- **Physical Device:** Рабочий сервер (132 GB RAM)
- **OS Target:** Linux (Ubuntu 22.04 LTS / Debian 12)
- **Role Class:** production-node
- **Criticality:** CRITICAL
- **Always-On:** YES

---

## 2. RESPONSIBILITIES

### Main Functions:
- MUST быть primary host для production приложений
- MUST выполнять backend/API сервисы
- MUST хранить production database (PostgreSQL)
- MUST выполнять websocket/realtime сервисы
- MUST выполнять reverse proxy (Nginx/Caddy)

### Project Bindings:
- **Balloo Messenger:** balloo.su ecosystem

### Services Expected:
- API Server (Express.js)
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- WebSocket server
- Reverse proxy (Nginx/Caddy)
- Messenger production app
- Admin Portal production app
- Ollama (heavy AI models) - MAY
- Open WebUI - MAY

---

## 3. BOUNDARIES

### MUST NEVER DO:
- MUST NOT выполнять local dev environments
- MUST NOT хранить personal files
- MUST NOT хранить unencrypted sensitive data
- MUST NOT быть единственным местом (backup required)

### NOT AUTHORITATIVE FOR:
- Not authoritative for backup (home_nas is)
- Not authoritative for source code (GitHub is)

---

## 4. NETWORK & ACCESS

### Private Access:
- Tailscale IP: dynamic from Tailscale
- Internal Docker network: 172.x.x.x

### Public Exposure:
- ONLY через reverse proxy
- ONLY необходимые сервисы (balloo.su)
- ALL через self-hosted reverse proxy

### Ingress/Egress:
- Ingress: HTTP/HTTPS через reverse proxy
- Egress: Internet (npm, Docker Hub, APIs)

---

## 5. DEPLOYMENT ROLE

- **Dev:** NO
- **Stage:** MAY (изолированные preview)
- **Prod:** YES (единственный production host)
- **Can initiate rollout:** NO (принимает команды)
- **Can host production:** YES

---

## 6. RECOVERY ROLE

- **Recovery Priority:** CRITICAL (самый важный)
- **Must be restored before:** Nothing (first priority)
- **What breaks if absent:** ВСЁ production падает

### Recovery Method:
1. Provision new server
2. Restore from home_nas backup
3. Restore PostgreSQL backup
4. Update DNS if needed
5. Verify services

---

## 7. SOURCE INPUTS

- Migration docs
- Infrastructure docs
- Existing code structure
- Previously stated architecture

---

## 8. RECREATION GUIDANCE

### How AI Should Recreate:
1. Install Linux (Ubuntu 22.04 LTS)
2. Install Docker + Docker Compose
3. Install Tailscale
4. Clone git repositories
5. Restore .env from encrypted backup
6. Run docker-compose up
7. Verify health endpoints

### Minimal Required Services:
- PostgreSQL
- Redis
- API Server
- Reverse proxy
- Messenger app
- Admin Portal

### Optional Enhancements:
- Ollama
- Open WebUI
- Monitoring (Prometheus/Grafana)

### Exact Caution:
- NEVER expose database ports publicly
- ALWAYS use encrypted backups
- ALWAYS have home_nas sync
- NEVER store secrets unencrypted

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0

---

**🎈 Balloo**