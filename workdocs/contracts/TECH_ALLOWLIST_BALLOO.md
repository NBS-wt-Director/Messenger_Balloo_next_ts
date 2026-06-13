---
title: Technology Allowlist for Balloo
description: Допустимые технологии для проекта Balloo
version: 1.0.0
date: 2026-06-13
---

# ✅ TECH ALLOWLIST BALLOO

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active Allowlist

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет допустимые технологии для проекта Balloo, безопасные для лицензирования и локального развёртывания в РФ.

---

## ✅ ДОПУСТИМЫЕ ТЕХНОЛОГИИ

### Backend / Runtime

**Node.js Ecosystem:**
- ✅ Node.js (LTS versions)
- ✅ Express.js
- ✅ TypeScript
- ✅ NestJS (опционально)

**Databases:**
- ✅ PostgreSQL 15+
- ✅ Redis 7+
- ✅ SQLite (dev only)

---

### Frontend

**Frameworks:**
- ✅ React 18+
- ✅ Next.js 14+
- ✅ Vue.js (опционально)

**State Management:**
- ✅ React Query
- ✅ Redux Toolkit
- ✅ Zustand

---

### Infrastructure

**Containerization:**
- ✅ Docker
- ✅ Docker Compose

**Orchestration:**
- ✅ Self-hosted Kubernetes (опционально)
- ✅ Docker Swarm (опционально)

---

### Networking

**Private Network:**
- ✅ Tailscale
- ✅ WireGuard
- ✅ OpenVPN

**Reverse Proxy:**
- ✅ Nginx
- ✅ Caddy
- ✅ HAProxy

**DNS:**
- ✅ Internal DNS (Tailscale DNS)
- ✅ Self-hosted DNS

---

### Monitoring (Self-hosted)

**Metrics:**
- ✅ Prometheus
- ✅ Grafana

**Tracing:**
- ✅ Jaeger
- ✅ Zipkin

**Logging:**
- ✅ ELK Stack (self-hosted)
- ✅ Loki
- ✅ Fluentd

---

### Security

**Authentication:**
- ✅ JWT
- ✅ OAuth 2.0 (self-hosted providers)
- ✅ OIDC

**Encryption:**
- ✅ TLS 1.3
- ✅ AES-256
- ✅ bcrypt/argon2

---

### DevOps

**CI/CD:**
- ✅ GitHub Actions (self-hosted runners)
- ✅ GitLab CI
- ✅ Self-hosted Jenkins

**Package Management:**
- ✅ pnpm
- ✅ npm
- ✅ Yarn

**Version Control:**
- ✅ Git
- ✅ GitLab (self-hosted)
- ✅ Gitea

---

### Storage

**File Storage:**
- ✅ Local filesystem
- ✅ NFS
- ✅ S3-compatible (self-hosted, e.g., MinIO)
- ✅ Yandex Disk API (for user uploads only)

**Backup:**
- ✅ rsync
- ✅ BorgBackup
- ✅ Restic

---

## 📝 НЕЙТРАЛЬНЫЕ ФОРМУЛИРОВКИ

### Вместо "Cloudflare Tunnel":
- ✅ "Reverse proxy with TLS termination"
- ✅ "Secure public ingress via Nginx/Caddy"
- ✅ "SSL/TLS termination at reverse proxy"

### Вместо "AWS/Azure/GCP":
- ✅ "Self-hosted infrastructure"
- ✅ "On-premises deployment"
- ✅ "Local server infrastructure"

### Вместо "New Relic/Datadog":
- ✅ "Self-hosted monitoring stack"
- ✅ "Prometheus + Grafana for metrics"
- ✅ "Open-source APM solutions"

---

## 🔒 ПРИНЦИПЫ ВЫБОРА

1. **Self-hosted preference:**
   - Предпочитать self-hosted решения над SaaS
   - Избегать зависимости от external providers

2. **Open source:**
   - Предпочитать open-source технологии
   - Проверять лицензии на совместимость

3. **Local deployment:**
   - Технологии должны работать без internet
   - Поддержка локального развёртывания

4. **RF compliance:**
   - Отсутствие санкционных ограничений
   - Возможность легальной поставки в РФ

---

## 📋 ДОКУМЕНТИРОВАНИЕ

**При описании архитектуры:**
- Указывать self-hosted решения как primary
- Использовать нейтральные формулировки
- Не привязываться к конкретным foreign провайдерам

**При указании зависимостей:**
- Проверять лицензии
- Указывать альтернативы
- Документировать reason for choice

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active

---

**🎈 Balloo**