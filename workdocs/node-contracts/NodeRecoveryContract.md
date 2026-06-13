---
title: Node Recovery Contract
description: Контракт восстановления узлов
version: 1.0.0
date: 2026-06-13
---

# 🔄 NODE RECOVERY CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🎯 ЦЕЛЬ

Определить порядок и правила восстановления узлов.

---

## 📊 RECOVERY PRIORITY

**Tier 1 - CRITICAL:**
1. laptop_control - восстановить access
2. work-server - восстановить production
3. home_nas - восстановить backups

**Tier 2 - IMPORTANT:**
4. phone_personal - восстановить 2FA
5. home_aio - восстановить dev

**Tier 3 - OPTIONAL:**
6. phone_service - восстановить admin
7. phone_recovery_optional - восстановить emergency

---

## 🔄 RECOVERY SCENARIOS

### Loss of home-plane (home_aio + home_nas)
**Impact:** Dev workflow, backups  
**Recovery:**
1. Восстановить home_nas из remote backup
2. Восстановить home_aio из git
3. Sync с work-server

### Loss of work-server
**Impact:** Production DOWN  
**Recovery:**
1. Provision new server
2. Restore from home_nas backup
3. Restore database from backup
4. Update DNS if IP changed
5. Verify all services

### Loss of laptop_control
**Impact:** Cannot manage system  
**Recovery:**
1. New laptop
2. Restore SSH keys from password manager
3. Clone git repositories
4. Install CLI tools
5. Access other nodes via Tailscale

---

## 📁 REQUIRED DOCUMENTS FOR RECOVERY

**MUST have:**
- NodeTreeContract.md
- NodeRecoveryContract.md (this file)
- docker-compose.yml
- database schema
- .env template
- SSH keys backup
- Recovery codes

**Location:**
- Primary: work-server
- Backup: home_nas
- Offsite: encrypted cloud storage

---

**Создано:** 2026-06-13

---

**🎈 Balloo**