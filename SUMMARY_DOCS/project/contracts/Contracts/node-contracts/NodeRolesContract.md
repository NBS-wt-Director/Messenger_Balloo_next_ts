---
title: Node Roles Contract
description: Контракт ролей узлов
version: 1.0.0
date: 2026-06-13
---

# 👥 NODE ROLES CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🎯 ЦЕЛЬ

Определить стандартные роли узлов и их обязанности.

---

## 📋 РОЛИ

### control-node
**Описание:** Узел управления и оркестрации  
**Примеры:** `laptop_control`  
**Обязанности:**
- MUST запускать deployment commands
- MUST иметь git client
- MUST иметь SSH access ко всем узлам
- MAY запускать dev environments
**Forbidden:**
- MUST NOT выполнять production workload
- MUST NOT хранить production database

### production-node
**Описание:** Production execution node  
**Примеры:** `work_server`  
**Обязанности:**
- MUST быть всегда online
- MUST хранить production данные
- MUST выполнять production сервисы
- MUST иметь backups
**Forbidden:**
- MUST NOT запускать dev-only сервисы
- MUST NOT быть выключен без плана

### dev-node
**Описание:** Development node  
**Примеры:** `home_aio`  
**Обязанности:**
- MAY запускать preview environments
- MAY синхронизироваться с production
**Forbidden:**
- MUST NOT быть production source of truth
- MUST NOT хранить production данные без шифрования

### backup-node
**Описание:** Узел для резервного копирования  
**Примеры:** `home_nas`  
**Обязанности:**
- MUST хранить encrypted backups
- MUST定期进行 backup sync
**Forbidden:**
- MUST NOT выполнять production workload
- MUST NOT быть primary execution node

### access-node
**Описание:** Узел доступа (мобильные устройства)  
**Примеры:** `phone_personal`, `phone_service`  
**Обязанности:**
- MAY получать notifications
- MUST использоваться для 2FA
**Forbidden:**
- MUST NOT быть execution node

### recovery-node
**Описание:** Опциональный узел восстановления  
**Примеры:** `phone_recovery_optional`  
**Обязанности:**
- MAY использоваться для emergency access
**Forbidden:**
- MUST NOT участвовать в normal deployment

---

**Создано:** 2026-06-13

---

**🎈 Balloo**