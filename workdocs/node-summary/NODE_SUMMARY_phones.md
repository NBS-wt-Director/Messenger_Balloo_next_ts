---
title: Node Summary - Phones
description: Документация phone узлов
version: 1.0.0
date: 2026-06-13
---

# 📱 NODE_SUMMARY_phones

## phone_personal

**Canonical Name:** `phone_personal`  
**Aliases:** `personal-phone`, `user-phone`

### Node Identity
- **Physical Device:** Личный телефон пользователя
- **OS Target:** Android / iOS
- **Role Class:** access-node
- **Criticality:** MEDIUM
- **Always-On:** SHOULD

### Responsibilities
- MAY использоваться для access к сервисам
- MAY получать notifications
- MUST использоваться для auth confirmation (2FA)

### Boundaries
- MUST NOT быть execution node
- MUST NOT запускать серверные сервисы

### Recovery Role
- **Recovery Priority:** MEDIUM
- **What breaks if absent:** Невозможно пройти 2FA

---

## phone_service

**Canonical Name:** `phone_service`  
**Aliases:** `service-phone`, `admin-phone`

### Node Identity
- **Physical Device:** Служебный телефон
- **OS Target:** Android / iOS
- **Role Class:** access-node
- **Criticality:** MEDIUM
- **Always-On:** SHOULD

### Responsibilities
- MUST использоваться для isolated service access
- MUST использоваться для second-factor admin checks
- MUST использоваться для project separation

### Boundaries
- MUST NOT быть личным устройством
- MUST быть отделён от personal phone

### Recovery Role
- **Recovery Priority:** MEDIUM
- **What breaks if absent:** Сложнее делать admin checks

---

## phone_recovery_optional

**Canonical Name:** `phone_recovery_optional`  
**Aliases:** `recovery-phone`, `rugged-phone`

### Node Identity
- **Physical Device:** Сломанный/восстанавливаемый телефон
- **OS Target:** Android / iOS
- **Role Class:** recovery-node
- **Criticality:** LOW
- **Always-On:** NO (опционально)

### Responsibilities
- MAY использоваться как rugged recovery endpoint
- MAY использоваться для emergency access

### Boundaries
- MUST быть по умолчанию inactive
- MUST NOT участвовать в основном deployment path

### Recovery Role
- **Recovery Priority:** LOW
- **Optional:** MAY не существовать

---

**🎈 Balloo**