---
title: Node Domains Contract
description: Контракт доменных привязок узлов
version: 1.0.0
date: 2026-06-13
---

# 🌐 NODE DOMAINS CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Активный контракт

---

## 🎯 ЦЕЛЬ

Этот контракт определяет правила привязки доменов к узлам экосистемы, границы публичного и приватного доступа, и политики маршрутизации.

---

## 📋 ДОМЕНЫ

### 1. balloo.su

**Domain Owner:** Messenger Ecosystem  
**Project Binding:** Balloo Messenger  
**Scope:** PUBLIC

**Root Domain Semantics:**
- Root domain = messenger ecosystem entry point
- Root MAY redirect to `/` (messenger app)
- Root MUST NOT expose internal admin endpoints

**Allowed Hostnames/Subdomains:**
- `balloo.su` - Messenger main app
- `api.balloo.su` - API Server
- `admin.balloo.su` - Admin Portal
- `docs.balloo.su` - Documentation
- `*.balloo.su` - MAY be used for preview environments

**Public Endpoints (MAY be exposed):**
- `/` - Messenger web app
- `/api/*` - Public API endpoints (auth, users, chats)
- `/socket.io/*` - WebSocket connection
- `/health` - Health checks

**Internal Endpoints (MUST NOT be public):**
- `/api/admin/*` - Admin API
- `/api/internal/*` - Internal services
- `/metrics` - Prometheus metrics
- `/debug/*` - Debug endpoints
- `/admin/*` - Admin portal (should be on subdomain)

**Routing Policy:**
- Root: Redirect to `/app` or serve SPA
- `/api/*`: Reverse proxy to API Server
- `/app/*`: Serve Messenger static files
- `/admin/*`: Reverse proxy to Admin Portal

**TLS Expectation:**
- MUST use HTTPS everywhere
- Certificate via self-hosted CA or Let's Encrypt
- HSTS MUST be enabled

---

## 🔒 PUBLIC/PRIVATE BOUNDARIES

### Public Endpoints (MAY be exposed)

**MUST pass through reverse proxy:**
- Reverse Proxy → Service

**Allowed for public access:**
- Messenger web app
- API public endpoints
- Static files
- Health checks (limited info)

**REQUIRE authentication:**
- User endpoints
- Admin endpoints (even if public URL)
- Websocket connections

---

### Private Endpoints (MUST NOT be public)

**MUST stay within private network:**
- Database ports (5432)
- Redis ports (6379)
- Internal API endpoints
- Monitoring/metrics
- Debug endpoints
- Admin panels (unless on separate subdomain with auth)

**Access methods:**
- Tailscale network
- SSH tunnel
- VPN
- Internal service mesh

---

## 🏗️ ARCHITECTURE LAYERS

### Layer 1: DNS
```
balloo.su NS → Self-hosted DNS
```

### Layer 2: Tunnel/Proxy
```
Internet → Nginx/Caddy Reverse Proxy
```

### Layer 3: Routing
```
Reverse Proxy → Backend Services
- balloo.su → Messenger (port 3000)
- api.balloo.su → API Server (port 3001)
- admin.balloo.su → Admin Portal (port 3002)
```

### Layer 4: Services
```
Services run in Docker containers on work_server
Only reverse proxy exposed to public
All other ports internal only
```

---

### Reverse Proxy

**Reverse Proxy (Primary):**
- Single entry point on work_server
- Route by hostname/path
- SSL termination
- Load balancing (if multiple instances)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active Contract

---

**🎈 Balloo - Share your moments safely!**