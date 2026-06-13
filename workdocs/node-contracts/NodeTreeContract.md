---
title: Node Tree Contract
description: Контракт дерева узлов экосистемы Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
---

# 🌲 NODE TREE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Активный контракт  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 ЦЕЛЬ

Этот контракт определяет каноническую структуру дерева узлов экосистемы Balloo, обеспечивая возможность полного восстановления архитектуры по документации без потери архитектурного смысла.

**Primary Purpose:** Позволить AI-агенту без контекста чата:
1. Понять какие узлы существуют в экосистеме
2. Определить сервисы, домены, роли и зависимости каждого узла
3. Восстановить экосистему заново без потери архитектурного смысла

---

## 📖 GLOSSARY

### Физический узел (Physical Node)
Аппаратное устройство или виртуальная машина с уникальными физическими характеристиками.

### Логическая роль (Logical Role)
Функциональное назначение узла в архитектуре (control-plane, work-plane, home-plane).

### Node State
- **Active** - узел работает и выполняет свои функции
- **Inactive** - узел выключен или временно недоступен
- **Optional** - узел не является обязательным для работы экосистемы

### Source of Truth
Первоисточник истины для данных, конфигураций или состояния системы.

### Control Plane
Слой управления, отвечающий за оркестрацию, deployment и администрирование.

### Work Plane
Слой рабочей нагрузки, где выполняются production и stage приложения.

### Home Plane
Слой домашней инфраструктуры для разработки, тестирования и резервирования.

---

## 🌳 КАНОНИЧЕСКОЕ ДЕРЕВО УЗЛОВ

```
ROOT
├── control-plane (Управление и оркестрация)
│   ├── laptop_control (Основной control node)
│   ├── phone_personal (Персональный доступ)
│   ├── phone_service (Служебный доступ)
│   └── phone_recovery_optional (Опциональный recovery)
│
├── work-plane (Production рабочая нагрузка)
│   └── work-server (Primary production host)
│
└── home-plane (Домашняя инфраструктура)
    ├── home_aio (Secondary dev/review node)
    └── home_nas (Backup и хранение)
```

---

## 📋 ОПИСАНИЕ ГРУПП УЗЛОВ

### control-plane

**Purpose:** Группа узлов управления и оркестрации

**Why exists separate from execution nodes:**
- Control plane НЕ является местом выполнения production workload
- Control plane содержит инструменты управления, а не бизнес-логику
- Разделение обеспечивает безопасность и изоляцию operator devices
- Control plane может быть временно недоступен без остановки production

**Characteristics:**
- MAY быть выключен без остановки production сервисов
- SHOULD иметь доступ ко всем узлам через SSH/API
- MUST содержать git client, VS Code/Koda, CLI tools
- MUST NOT выполнять production workload

**Nodes:**
- `laptop_control` - Primary control node (обязательный)
- `phone_personal` - Personal access endpoint (обязательный)
- `phone_service` - Service access endpoint (обязательный)
- `phone_recovery_optional` - Recovery endpoint (опциональный)

---

### work-plane

**Purpose:** Группа production рабочей нагрузки

**Why exists:**
- Primary host для production приложений
- Единственный узел, где живёт production source of truth
- Где выполняются тяжёлые AI сервисы и backend

**Characteristics:**
- MUST быть всегда включён (always-on)
- MUST хранить production данные
- MUST выполнять production workload
- SHOULD иметь резервное копирование
- Criticality: **CRITICAL**

**Nodes:**
- `work-server` - Primary production host (единственный в этой группе)

---

### home-plane

**Purpose:** Группа домашней инфраструктуры

**Why exists separate from production:**
- Не является production source of truth
- Используется для dev/staging/testing
- Резервная копия и archive
- Media и non-critical задачи

**Characteristics:**
- MAY быть выключен без остановки production
- SHOULD синхронизироваться с work-server
- MUST NOT содержать production-critical данные без бэкапа
- Criticality: **LOW** (для production), **MEDIUM** (для dev)

**Nodes:**
- `home_aio` - Secondary dev node
- `home_nas` - Backup и storage node

---

## 🏷️ ОПИСАНИЕ УЗЛОВ

### 1. laptop_control

**Canonical Name:** `laptop_control`  
**Aliases:** `laptop`, `control-node`, `operator-device`  
**Physical Device:** Основной ноутбук пользователя  
**OS Target:** Windows 11 Pro / Linux  
**Role Class:** `control-node`

**Responsibilities:**
- MUST быть главным entry point для orchestration
- MUST содержать VS Code / Koda для разработки
- MUST иметь git client для работы с репозиториями
- MUST иметь SSH client для доступа к узлам
- MUST использоваться для запуска deployment команд
- MUST использоваться для запуска audit команд
- MAY содержать локальные dev окружения

**Boundaries:**
- MUST NOT выполнять production workload
- MUST NOT хранить production данные без шифрования
- MUST NOT быть единственным местом хранения кода (git remote обязателен)
- MUST NOT запускать production database

**Network & Access:**
- Private access: Tailscale/SSH через work-server
- Public exposure: NONE (ноутбук не публикует сервисы)
- Ingress: Только исходящие подключения

**Deployment Role:**
- Dev: YES (локальная разработка)
- Stage: MAY (preview environments)
- Prod: NO (не является production host)
- Can initiate rollout: YES (главный control point)
- Can host production: NO

**Recovery Role:**
- Recovery priority: HIGH (главный operator interface)
- What breaks if absent: Невозможно управлять системой
- Recovery method: Замена ноутбука + восстановление git/SSH ключей

---

### 2. work-server

**Canonical Name:** `work-server`  
**Aliases:** `work`, `production-server`, `main-server`  
**Physical Device:** Рабочий сервер (132 GB RAM)  
**OS Target:** Linux (Ubuntu 22.04 LTS / Debian 12)  
**Role Class:** `production-node`

**Responsibilities:**
- MUST быть primary host для production приложений
- MUST выполнять backend/API сервисы
- MUST хранить production database (PostgreSQL)
- MUST выполнять websocket/realtime сервисы
- MUST выполнять reverse proxy (Nginx/Caddy)
- MAY выполнять Ollama heavy AI модели
- MAY выполнять Open WebUI
- MUST быть source of truth для deployment metadata

**Domain Binding:**
- `balloo.su` - messenger ecosystem (ПУБЛИЧНЫЙ)

**Services MUST live here:**
- API Server (Express.js)
- PostgreSQL database
- Redis cache
- WebSocket server
- Reverse proxy
- Production Messenger app
- Production Admin Portal
- Ollama (heavy models)

**Services MUST NOT live here:**
- Local dev environments
- Personal files
- Non-encrypted sensitive data

**Services MAY live here:**
- Stage/preview environments (isolated)
- Monitoring (Prometheus/Grafana)
- CI/CD runners (GitHub Actions self-hosted)

**Network & Access:**
- Private access: Tailscale, internal network
- Public exposure: Через reverse proxy только нужные сервисы
- Ingress: HTTP/HTTPS через reverse proxy
- Egress: Internet для API, npm, Docker Hub

**Deployment Role:**
- Dev: NO
- Stage: MAY (изолированные preview)
- Prod: YES (единственный production host)
- Can initiate rollout: NO (принимает команды от control-plane)
- Can host production: YES (единственный узел)

**Recovery Role:**
- Recovery priority: CRITICAL (самый важный узел)
- What breaks if absent: ВСЁ production падает
- Recovery method: Восстановление из backup + развертывание на новом сервере
- Backup source: home_nas, git repositories

---

### 3. home_aio

**Canonical Name:** `home_aio`  
**Aliases:** `home`, `aio`, `secondary-dev`  
**Physical Device:** Домашний моноблок Linux  
**OS Target:** Linux (Ubuntu 22.04 LTS)  
**Role Class:** `dev-node`

**Responsibilities:**
- MAY быть secondary dev environment
- MAY запускать preview environments
- MAY выполнять secondary AI model inference
- MAY использоваться для local CI/validation
- MAY быть staging helper
- MAY зеркалить код с work-server

**Boundaries:**
- MUST NOT быть production source of truth
- MUST NOT хранить production данные без явного бэкапа
- SHOULD синхронизироваться с work-server
- MUST быть изолирован от production traffic

**Network & Access:**
- Private access: Tailscale
- Public exposure: MAY (preview environments через tunnel)
- Ingress: Только из private network

**Deployment Role:**
- Dev: YES (основная dev среда)
- Stage: YES (preview/staging)
- Prod: NO (не production)
- Can initiate rollout: NO (только control-plane)
- Can host production: NO

**Recovery Role:**
- Recovery priority: LOW (некритичен для production)
- What breaks if absent: Dev workflow замедляется
- Recovery method: Восстановление из git + sync с work-server

---

### 4. home_nas

**Canonical Name:** `home_nas`  
**Aliases:** `nas`, `backup-server`, `storage`  
**Physical Device:** Mac mini 2014 или замена  
**OS Target:** macOS / Linux (с NETATALK/SMB)  
**Role Class:** `backup-node`

**Responsibilities:**
- MUST хранить backups work-server
- MUST хранить git/artifact mirrors
- MAY хранить media файлы
- MAY выполнять non-critical задачи
- MAY быть fallback proxy/docs mirror
- MUST быть резервным узлом для восстановления

**Boundaries:**
- MUST NOT быть primary execution node для production
- MUST NOT выполнять production workload
- SHOULD быть только для хранения и зеркалирования
- MUST хранить зашифрованные бэкапы

**Network & Access:**
- Private access: Tailscale, local network
- Public exposure: NONE
- Ingress: Только backup sync от work-server

**Deployment Role:**
- Dev: MAY (хранилище артефактов)
- Stage: NO
- Prod: NO
- Can initiate rollout: NO
- Can host production: NO

**Recovery Role:**
- Recovery priority: HIGH (хранилище бэкапов)
- What breaks if absent: Невозможно восстановить work-server
- Recovery method: Замена NAS + восстановление из remote backup

---

### 5. phone_personal

**Canonical Name:** `phone_personal`  
**Aliases:** `personal-phone`, `user-phone`  
**Physical Device:** Личный телефон пользователя  
**OS Target:** Android / iOS  
**Role Class:** `access-node`

**Responsibilities:**
- MAY использоваться для access к сервисам
- MAY получать notifications
- MUST использоваться для auth confirmation (2FA)
- MAY использоваться для quick checks

**Boundaries:**
- MUST NOT быть execution node
- MUST NOT запускать серверные сервисы
- MUST NOT хранить production данные

**Network & Access:**
- Private access: Tailscale (опционально)
- Public exposure: N/A (клиентское устройство)
- Ingress: Push notifications

**Deployment Role:**
- Dev: NO
- Stage: NO
- Prod: NO
- Can initiate rollout: NO
- Access to production: YES (через browser/app)

**Recovery Role:**
- Recovery priority: MEDIUM (потеря доступа)
- What breaks if absent: Невозможно пройти 2FA
- Recovery method: Привязка нового телефона + recovery codes

---

### 6. phone_service

**Canonical Name:** `phone_service`  
**Aliases:** `service-phone`, `admin-phone`  
**Physical Device:** Служебный телефон  
**OS Target:** Android / iOS  
**Role Class:** `access-node`

**Responsibilities:**
- MUST использоваться для isolated service access
- MUST использоваться для second-factor admin checks
- MUST использоваться для project separation
- MAY использоваться для admin 2FA

**Boundaries:**
- MUST NOT быть личным устройством
- MUST быть отделён от personal phone
- MUST NOT использоваться для личных целей

**Network & Access:**
- Private access: Tailscale (опционально)
- Public exposure: N/A
- Ingress: Push notifications для admin alerts

**Deployment Role:**
- Dev: NO
- Stage: NO
- Prod: NO
- Can initiate rollout: NO
- Access to admin: YES (изолированный доступ)

**Recovery Role:**
- Recovery priority: MEDIUM (admin access)
- What breaks if absent: Сложнее делать admin checks
- Recovery method: Привязка нового служебного телефона

---

### 7. phone_recovery_optional

**Canonical Name:** `phone_recovery_optional`  
**Aliases:** `recovery-phone`, `rugged-phone`  
**Physical Device:** Сломанный/восстанавливаемый телефон (опционально)  
**OS Target:** Android / iOS  
**Role Class:** `recovery-node`

**Responsibilities:**
- MAY использоваться как rugged recovery endpoint
- MAY использоваться для emergency access
- SHOULD быть всегда заряжен и готов

**Boundaries:**
- MUST быть по умолчанию inactive
- MUST NOT участвовать в основном deployment path
- MUST NOT использоваться для повседневных задач

**Network & Access:**
- Private access: Tailscale
- Public exposure: N/A
- Ingress: Emergency access только

**Deployment Role:**
- Dev: NO
- Stage: NO
- Prod: NO
- Can initiate rollout: NO
- Access in emergency: YES

**Recovery Role:**
- Recovery priority: LOW (опционально)
- What breaks if absent: Нет emergency phone
- Recovery method: Включение телефона + настройка access

---

## 🔗 RULES OF OWNERSHIP

### Naming Convention

**Формат:** `<plane>-<role>[_<modifier>]`

**Примеры:**
- `laptop_control` - control plane, control role
- `work-server` - work plane, server role
- `home_aio` - home plane, all-in-one role
- `phone_personal` - control plane, personal modifier

**Правила:**
- MUST использовать lowercase
- MUST использовать underscore как разделитель
- MUST явно указывать plane в имени
- SHOULD указывать role/функцию

### Active/Inactive/Optional States

**Active:**
- `laptop_control` - MUST быть active когда выполняется управление
- `work-server` - MUST быть всегда active (always-on)
- `phone_personal` - SHOULD быть active для 2FA

**Inactive:**
- `home_aio` - MAY быть выключен когда не используется
- `home_nas` - MAY быть выключен когда не делается backup

**Optional:**
- `phone_service` - MAY не использоваться если нет separate admin access
- `phone_recovery_optional` - MAY не существовать вообще

### Required Invariants

1. **Control Plane Invariant:**
   - MUST иметь хотя бы один active control node
   - `laptop_control` MUST быть доступен для deployment

2. **Work Plane Invariant:**
   - MUST иметь хотя бы один work-server для production
   - work-server MUST иметь backup на home_nas

3. **Home Plane Invariant:**
   - home_nas MUST хранить актуальные бэкапы
   - home_aio MAY быть недоступен без влияния на production

4. **Network Invariant:**
   - ВСЕ узлы MUST иметь доступ к Tailscale network
   - ВСЕ production сервисы MUST быть доступны через reverse proxy

5. **Domain Invariant:**
   - `balloo.su` MUST указывать на work-server
   - Internal сервисы MUST НЕ быть публично доступны

---

## 🔄 RECOVERY IMPLICATIONS

### Recovery Order (при полной потере системы)

**Tier 1 (Критично):**
1. `laptop_control` - восстановить access
2. `work-server` - восстановить production
3. `home_nas` - восстановить backups

**Tier 2 (Важно):**
4. `phone_personal` - восстановить 2FA access
5. `home_aio` - восстановить dev environment

**Tier 3 (Опционально):**
6. `phone_service` - восстановить admin access
7. `phone_recovery_optional` - восстановить emergency access

### What Each Document Must Enable

**NodeTreeContract.md:**
- Понять дерево узлов и их иерархию
- Определить роли и зависимости

**NodeRolesContract.md:**
- Понять responsibilities каждого типа узла
- Определить allowed/forbidden services

**NodeDomainsContract.md:**
- Понять доменные привязки
- Определить public/private boundaries

**NodeRecoveryContract.md:**
- Знать порядок восстановления
- Понять recovery priorities

**NodeDeploymentContract.md:**
- Понять deployment flow
- Определить source of truth

---

## ✅ CRITERIA FOR RECONSTRUCTION AI

AI-агент, восстанавливающий экосистему, ДОЛЖЕН:

1. **Прочитать все node contracts**
2. **Понять физическую и логическую topology**
3. **Определить node responsibilities для каждого узла**
4. **Восстановить canonical tree без ошибок**
5. **Не спутать dev/stage/prod окружения**
6. **Не спутать physical устройства и logical роли**
7. **Не потерять доменные привязки**
8. **Создать все state files (JSON)**
9. **Создать все topology maps**

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active Contract  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
