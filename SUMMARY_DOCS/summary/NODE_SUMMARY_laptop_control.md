---
title: Node Summary - Laptop Control
description: Документация узла laptop_control
version: 1.0.0
date: 2026-06-13
---

# 💻 NODE_SUMMARY_laptop_control

**Canonical Name:** `laptop_control`  
**Aliases:** `laptop`, `control-node`, `operator-device`

---

## 1. NODE IDENTITY

- **Canonical Name:** laptop_control
- **Aliases:** laptop, control-node, operator-device
- **OS Target:** Windows 11 Pro / Linux
- **Role Class:** control-node
- **Criticality:** HIGH (для управления)
- **Always-On:** NO (но должен быть доступен для управления)

---

## 2. RESPONSIBILITIES

### Main Functions:
- MUST быть главным entry point для orchestration
- MUST содержать VS Code / Koda для разработки
- MUST иметь git client
- MUST иметь SSH client
- MUST использоваться для deployment commands

### Project Bindings:
- **All Projects:** Control point

### Services Expected:
- VS Code / Koda
- Git
- SSH client
- Tailscale client
- Terminal/Shell

---

## 3. BOUNDARIES

### MUST NEVER DO:
- MUST NOT выполнять production workload
- MUST NOT хранить production данные без шифрования
- MUST NOT быть единственным местом хранения кода

---

## 4. NETWORK & ACCESS

### Private Access:
- Tailscale
- SSH to all nodes

### Public Exposure:
- NONE

---

## 5. DEPLOYMENT ROLE

- **Dev:** YES
- **Stage:** MAY
- **Prod:** NO (не execution node)
- **Can initiate rollout:** YES

---

## 6. RECOVERY ROLE

- **Recovery Priority:** HIGH
- **What breaks if absent:** Невозможно управлять системой
- **Recovery Method:** Замена устройства + восстановление git/SSH ключей

---

## 7-8. SOURCES & RECREATION

- Install VS Code/Koda
- Install Git, SSH
- Configure Tailscale
- Restore SSH keys from password manager
- Clone git repositories

---

**🎈 Balloo**