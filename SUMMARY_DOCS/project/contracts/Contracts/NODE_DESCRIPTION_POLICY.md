---
title: Node Description Policy
description: Политика описания узлов в документации monorepo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
---

# 📜 NODE DESCRIPTION POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Активная политика  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует правила описания узлов в документации и контрактах monorepo Balloo.

**Primary Purpose:** Обеспечить нейтральность документации к физическому оборудованию, позволяя:
- Автопилоту работать без контекста конкретной инфраструктуры
- Лицензированию не зависеть от hardware
- Масштабированию без пересмотра документации
- Замене оборудования без изменения контрактов

---

## ✅ ПРАВИЛА

### 1. Физическое оборудование НЕ описывается

**ЗАПРЕЩЕНО** в contracts/docs/topology/state:
- Упоминания конкретных устройств (ноутбук, моноблок, Mac mini, сервер, телефоны)
- Упоминания "домашняя техника" / "рабочая техника"
- Упоминания "домашняя сеть" / "рабочая сеть"
- Описания в терминах "дом/работа"
- Поля `physical_device` в state files

**РАЗРЕШЕНО:**
- Логические роли узлов (control node, production node, dev node, backup node)
- Функциональное назначение (оркестрация, выполнение, хранение)
- OS target (Windows, Linux, macOS)
- Network roles (control-plane, execution-plane, storage-plane)

---

### 2. Узлы описываются только логически

**ПРАВИЛЬНО:**
```markdown
laptop_control = control node, основной операторский интерфейс, источник команд развертывания и аудита
work_server = production node, primary execution host для production приложений
home_aio = dev node, secondary development и staging environment
home_nas = backup node, хранение encrypted backups и archive
```

**НЕПРАВИЛЬНО:**
```markdown
laptop_control = мой ноутбук Techno K16SDA
work_server = рабочий сервер на 132 ГБ RAM
home_aio = домашний моноблок Linux
home_nas = Mac mini 2014
```

---

### 3. Планы описываются функционально

**ПРАВИЛЬНО:**
- control-plane — управление и оркестрация
- execution-plane — выполнение рабочих нагрузок
- storage-plane — хранение и резервирование

**НЕПРАВИЛЬНО:**
- control-plane — мой ноутбук и телефоны
- work-plane — рабочий сервер
- home-plane — домашняя инфраструктура

---

### 4. State files не содержат hardware информации

**ЗАПРЕЩЕНО в JSON state files:**
```json
{
  "physical_device": "Рабочий сервер (132 GB RAM)"  // ❌ НЕДОПУСТИМО
}
```

**РАЗРЕШЕНО:**
```json
{
  "role_class": "production-node",
  "os_target": "Linux (Ubuntu 22.04 LTS)",
  "criticality": "CRITICAL"
}
```

---

### 5. Recovery описывается по приоритетам ролей

**ПРАВИЛЬНО:**
1. control node — восстановить access
2. production node — восстановить production
3. backup node — восстановить backups

**НЕПРАВИЛЬНО:**
1. ноутбук — восстановить access
2. рабочий сервер — восстановить production
3. домашний NAS — восстановить backups

---

## 🔍 ПРИМЕРЫ ПРАВИЛЬНОГО ОПИСАНИЯ

### Node Identity
```markdown
**Canonical Name:** work_server
**Aliases:** work, production-server, main-server
**OS Target:** Linux (Ubuntu 22.04 LTS / Debian 12)
**Role Class:** production-node
**Criticality:** CRITICAL
**Always-On:** YES
```

### Node Responsibilities
```markdown
**Responsibilities:**
- MUST быть primary host для production приложений
- MUST выполнять backend/API сервисы
- MUST хранить production database (PostgreSQL)
- MUST выполнять websocket/realtime сервисы
```

### Network & Access
```markdown
**Network & Access:**
- Private access: Tailscale, internal network
- Public exposure: Через reverse proxy только нужные сервисы
- Ingress: HTTP/HTTPS через reverse proxy
```

---

## 🚫 СПИСОК ЗАПРЕЩЁННЫХ ТЕРМИНОВ

### Устройства
- ноутбук
- моноблок
- Mac mini
- сервер (в контексте "мой сервер", "рабочий сервер")
- телефон (в контексте "мой телефон", "личный телефон", "служебный телефон")
- NAS (в контексте "мой NAS", "домашний NAS")

### Локации
- дом / домашний
- работа / рабочий
- домашняя сеть
- рабочая сеть
- дом/работа

### Физические описания
- "мой [устройство]"
- "моя [устройство]"
- характеристики оборудования (RAM, CPU, диск)
- модели устройств (Techno K16SDA, Samsung J3 и т.п.)

---

## ✅ КРИТЕРИИ ПРИЁМКИ

Документация считается соответствующей политике если:

1. **В contracts/ нет упоминаний конкретных устройств**
2. **В docs/ нет описаний "дом/работа"**
3. **В topology/ нет привязок к physical locations**
4. **В state/ (JSON) нет поля physical_device**
5. **Все узлы описаны только логически**
6. **NODE_DESCRIPTION_POLICY.md существует и соблюдается**

---

## 🔧 ПРОЦЕСС ИЗМЕНЕНИЙ

При изменении документации:

1. **Проверить на запрещённые термины** — grep search по репозиторию
2. **Заменить на логические описания** — использовать role_class вместо physical_device
3. **Обновить state files** — удалить hardware-specific поля
4. **Проверить все связанные документы** — обновление ссылок и зависимостей

---

## 📝 ИСТОРИЯ ИЗМЕНЕНИЙ

| Версия | Дата | Описание | Автор |
|--------|------|----------|-------|
| 1.0.0 | 2026-06-13 | Initial policy | Koda (NLP-Core-Team) |

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active Policy  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
