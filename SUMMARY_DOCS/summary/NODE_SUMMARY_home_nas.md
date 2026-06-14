---
title: Node Summary - Home NAS
description: Документация узла home_nas
version: 1.0.0
date: 2026-06-13
---

# 💾 NODE_SUMMARY_home_nas

**Canonical Name:** `home_nas`  
**Aliases:** `nas`, `backup-server`, `storage`

---

## 1. NODE IDENTITY

- **Canonical Name:** home_nas
- **Aliases:** nas, backup-server, storage
- **OS Target:** macOS / Linux (NETATALK/SMB)
- **Role Class:** backup-node
- **Criticality:** HIGH (для backup)
- **Always-On:** SHOULD (для scheduled backups)

---

## 2. RESPONSIBILITIES

### Main Functions:
- MUST хранить backups work_server
- MUST хранить git/artifact mirrors
- MAY хранить media файлы
- MAY выполнять non-critical задачи

### Project Bindings:
- **All Projects:** Backup storage

### Services Expected:
- SMB/NFS file sharing
- Backup scripts
- rsync
- Optional: Docker (for non-critical tasks)

---

## 3. BOUNDARIES

### MUST NEVER DO:
- MUST NOT быть primary execution node
- MUST NOT выполнять production workload

### AUTHORITATIVE FOR:
- Backup storage
- Archive mirror

---

## 4. NETWORK & ACCESS

### Private Access:
- Tailscale
- Local network (SMB/NFS)

### Public Exposure:
- NONE

---

## 5. DEPLOYMENT ROLE

- **Dev:** MAY (хранилище артефактов)
- **Stage:** NO
- **Prod:** NO
- **Can host production:** NO

---

## 6. RECOVERY ROLE

- **Recovery Priority:** HIGH
- **What breaks if absent:** Невозможно восстановить work_server
- **Recovery Method:** Замена storage node + восстановление из remote backup

---

## 7-8. SOURCES & RECREATION

- Configure SMB/NFS sharing
- Set up Tailscale
- Configure backup sync from work_server
- Encrypt sensitive data

---

**🎈 Balloo**