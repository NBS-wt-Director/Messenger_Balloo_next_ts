---
title: Node Deployment Contract
description: Контракт развёртывания узлов
version: 1.0.0
date: 2026-06-13
---

# 🚀 NODE DEPLOYMENT CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🎯 ЦЕЛЬ

Определить правила развёртывания на узлах.

---

## 📊 DEV/STAGE/PROD

### Dev
- **Node:** laptop_control, home_aio
- **Initiated by:** Developer
- **Source:** Local branch
- **Isolation:** Complete

### Stage
- **Node:** home_aio (primary), work-server (isolated containers)
- **Initiated by:** Developer/CI
- **Source:** Pull request
- **Isolation:** Docker network

### Prod
- **Node:** work-server ONLY
- **Initiated by:** Control-plane (laptop_control)
- **Source:** Main branch + approval
- **Isolation:** Production network

---

## 🏗️ DEPLOYMENT FLOW

1. **Initiation:** laptop_control запускает deployment
2. **Validation:** home_aio выполняет tests (optional)
3. **Execution:** work-server выполняет rollout
4. **Verification:** Health checks + manual verification

---

## 📍 SOURCE OF TRUTH

**Production Rollout:**
- Source code: GitHub (main branch)
- Configuration: work-server .env + home_nas backup
- Database: PostgreSQL on work-server
- Artifacts: home_nas backup

**Separation:**
- Messenger: Separate Docker network per environment

---

**Создано:** 2026-06-13

---

**🎈 Balloo**