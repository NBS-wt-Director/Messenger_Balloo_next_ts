---
title: Technology Denylist for Russia 2026
description: Запрещённые технологии для лицензирования в РФ
version: 1.0.0
date: 2026-06-13
---

# 🚫 TECH DENYLIST RU 2026

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active Denylist

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет технологии и внешние сервисы, которые НЕ ДОПУСТИМЫ в документации и контрактах проекта Balloo из-за лицензионных рисков для поставки в РФ в 2026 году.

---

## ❌ ЗАПРЕЩЁННЫЕ КЛАССЫ ТЕХНОЛОГИЙ

### 1. Облачные зависимости (внешние регионы)

**MUST NOT использовать как source of truth:**
- AWS (Amazon Web Services)
- Google Cloud Platform
- Microsoft Azure
- Any foreign cloud provider

**Причина:** Зависимость от внешних регионов, риски блокировки

---

### 2. CDN и Tunnel провайдеры

**MUST NOT упоминать в контрактах:**
- ❌ Cloudflare (включая Cloudflare Tunnel)
- ❌ Cloudwhere
- ❌ AWS CloudFront
- ❌ Any foreign CDN provider

**Причина:** Внешние зависимости, потенциальные ограничения

**Альтернативы:**
- ✅ Локальный reverse proxy (Nginx, Caddy)
- ✅ Самоhosted CDN решения
- ✅ Tailscale для private access

---

### 3. APM и Monitoring сервисы

**MUST NOT использовать как primary solution:**
- ❌ New Relic
- ❌ Datadog
- ❌ Dynatrace
- ❌ Any foreign SaaS monitoring

**Причина:** Внешняя зависимость, SaaS модель

**Альтернативы:**
- ✅ Prometheus (self-hosted)
- ✅ Grafana (self-hosted)
- ✅ Jaeger (self-hosted)

---

### 4. Внешние сервисы как source of truth

**MUST NOT:**
- ❌ Использовать foreign cloud как source of truth для данных
- ❌ Зависимость от external APIs для critical функций
- ❌ Хранение production данных в foreign regions

---

## 🚫 КОНКРЕТНЫЕ ЗАПРЕЩЁННЫЕ УПОМИНАНИЯ

### MUST BE REMOVED from ALL docs:

**Домены и проекты:**
- ❌ ЦФР
- ❌ центр-фр.рф
- ❌ CFR
- ❌ CFR Ecosystem
- ❌ ЦФР Official Website

**Технологии и сервисы:**
- ❌ Cloudflare
- ❌ Cloudflare Tunnel
- ❌ Cloudwhere
- ❌ New Relic
- ❌ Datadog
- ❌ AWS CloudFront
- ❌ Google Cloud
- ❌ Azure
- ❌ Amazon Web Services

**Двойственные формулировки:**
- ❌ "Balloo / ЦФР ecosystem"
- ❌ "Messenger и ЦФР проекты"
- ❌ "Multi-project deployment (Balloo + ЦФР)"

---

## 📝 ПРАВИЛА ДОКУМЕНТИРОВАНИЯ

### MUST:
- Описывать только Balloo проект
- Использовать нейтральные формулировки
- Указывать self-hosted решения как primary
- Использовать локальные/отечественные альтернативы где возможно

### MUST NOT:
- Упоминать foreign cloud providers
- Использовать external services как source of truth
- Смешивать несколько проектов в одном репозитории
- Указывать запрещённые технологии в contracts

---

## 🔍 ПРОВЕРКА ДОКУМЕНТОВ

**Перед коммитом проверить:**
```bash
grep -r "ЦФР\|центр-фр\.рф\|Cloudflare\|Cloudwhere\|New Relic\|Datadog" \
  workdocs/ \
  platform-state/ \
  infra/topology/
```

**Должно вернуть:** NO RESULTS в workdocs/, platform-state/, infra/topology/

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active

---

**🎈 Balloo**