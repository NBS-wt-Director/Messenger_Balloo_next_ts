---
title: ROOT NODE SUMMARY
description: Корневой сводный документ всех узлов экосистемы
version: 1.0.0
date: 2026-06-13
---

# 🌲 ROOT NODE SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ сводит всё дерево узлов экосистемы Balloo, объясняет отношения между узлами и содержит короткий rebuild order для восстановления системы.

**Human-Readable:** Для понимания архитектуры человеком  
**AI-Readable:** Для автоматического восстановления системы

---

## 📊 ДЕРЕВО УЗЛОВ

```
ROOT
├── control-plane (Управление и оркестрация)
│   ├── laptop_control ⭐ PRIMARY CONTROL NODE
│   ├── phone_personal ⭐ 2FA & ACCESS
│   ├── phone_service ⭐ ADMIN ACCESS
│   └── phone_recovery_optional (EMERGENCY)
│
├── execution-plane (Выполнение рабочих нагрузок)
│   ├── work_server ⭐⭐⭐ CRITICAL PRODUCTION
│   └── home_aio (DEV/STAGING)
│
└── storage-plane (Хранение и резервирование)
    └── home_nas ⭐ BACKUP STORAGE
```

⭐ = Обязательные узлы  
⭐⭐⭐ = Критичный production узел

---

## 🔗 ОТНОШЕНИЯ МЕЖДУ УЗЛАМИ

### control-plane → execution-plane
- laptop_control УПРАВЛЯЕТ work_server
- Deployment инициируется с laptop_control
- work_server ПРИНИМАЕТ команды

### control-plane → storage-plane
- laptop_control УПРАВЛЯЕТ home_aio/home_nas
- Dev deployment на home_aio
- Backup на home_nas

### execution-plane → storage-plane
- work_server СИНХРОНИЗИРУЕТСЯ с home_nas (backups)
- home_aio MAY синхронизироваться с work_server (code mirror)

### phones → ALL
- phone_personal: 2FA для всех critical операций
- phone_service: Admin 2FA для production
- phone_recovery_optional: Emergency recovery

---

## 🔄 REBUILD ORDER

### При полной потере системы:

**Step 1: Восстановить control-plane**
```bash
# 1.1 Настроить новый laptop_control
# - Установить VS Code/Koda
# - Установить git, SSH client
# - Настроить Tailscale
# - Восстановить SSH keys

# 1.2 Подключить phones
# - Установить 2FA на phone_personal
# - Установить admin app на phone_service
```

**Step 2: Восстановить execution-plane**
```bash
# 2.1 Provision work_server
# - Установить Linux
# - Установить Docker, Docker Compose
# - Настроить Tailscale

# 2.2 Восстановить из backup
# - Склонировать git repos
# - Восстановить .env из home_nas/encrypted backup
# - Запустить docker-compose

# 2.3 Восстановить database
# - Restore PostgreSQL backup from home_nas
# - Verify data integrity
```

**Step 3: Восстановить storage-plane**
```bash
# 3.1 Настроить home_nas
# - Установить NAS OS
# - Настроить SMB/NFS
# - Настроить Tailscale
```

**Step 4: Верификация**
```bash
# 4.1 Проверить все узлы в Tailscale
# 4.2 Проверить SSH access с laptop на все узлы
# 4.3 Проверить 2FA на phones
# 4.4 Проверить DNS и reverse proxy
# 4.5 Проверить health endpoints
```

---

## 📋 КЛЮЧЕВЫЕ ИНВАРИАНТЫ

1. **Control Plane:**
   - MUST иметь хотя бы один active control node
   - laptop_control MUST доступен

2. **Execution Plane:**
   - work_server MUST быть always-on
   - work_server MUST иметь backup на home_nas

3. **Storage Plane:**
   - home_nas MUST хранить актуальные бэкапы
   - home_aio MAY быть недоступен

4. **Network:**
   - ВСЕ узлы MUST иметь Tailscale
   - ВСЕ production сервисы MUST через reverse proxy

5. **Domains:**
   - balloo.su → work_server

---

## 🎯 MINIMAL VIABLE ARCHITECTURE

**Для работы production:**
- ✅ laptop_control (control)
- ✅ work_server (production)
- ✅ phone_personal (2FA)
- ✅ home_nas (backups)

**Опционально:**
- ⭕ home_aio (dev/staging)
- ⭕ phone_service (admin 2FA)
- ⭕ phone_recovery_optional (emergency)

---

## 📁 SOURCE INPUTS

Этот summary был создан на основе:
- Существующей структуры monorepo
- Infrastructure документации
- Migration docs
- Уже озвученных узлов и доменов
- Предыдущих audit документов

**Ссылки:**
- `workdocs/node-contracts/NodeTreeContract.md`
- `workdocs/node-contracts/NodeRolesContract.md`
- `workdocs/node-contracts/NodeDomainsContract.md`
- `platform-state/node-tree/node-tree.json`

---

## 🤖 RECREATION GUIDANCE

**Для AI-агента, восстанавливающего узел:**

1. **Прочитать этот документ** - понять общую картину
2. **Прочитать NodeTreeContract.md** - понять дерево узлов
3. **Прочитать соответствующий NODE_SUMMARY_*.md** - понять конкретный узел
4. **Проверить node-tree.json** - машиночитаемая структура
5. **Выполнить rebuild order** - пошагово восстановить

**Минимальные требования:**
- Tailscale установлен и подключён
- Git репозитории доступны
- SSH keys настроены
- Docker установлен (для execution nodes)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active Summary

---

**🎈 Balloo - Share your moments safely!**