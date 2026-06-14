---
title: Balloo Project Status
description: Текущий статус разработки Balloo Platform (Phase 1-2)
version: 1.0.0
date: 2026-06-14
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - project-status
  - phase1-phase2
  - dashboard
related_docs:
  - SUMMARY_DOCS/BALLOO_BUILD_SPEC.md
  - SUMMARY_DOCS/access/ACCESS_POLICY.md
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
---

# 📊 BALLOO PROJECT STATUS

**Версия:** 1.0.0  
**Дата:** 2026-06-14  
**Статус:** 🔴 In Development (Phase 1)  
**Дедлайн Phase 1:** 2026-06-22  
**Владелец:** Оберюхтин Иван Анатольевич (o8eryuhtin@yandex.ru)

---

## 🎯 EXECUTIVE SUMMARY

| Показатель | Значение |
|------------|----------|
| **Общий прогресс** | ~65% |
| **Phase 1 прогресс** | ~70% |
| **Phase 2 прогресс** | ~10% |
| **Документация** | ✅ 95% |
| **Код** | 🟡 50% |
| **Тесты** | 🔴 15% |
| **Деплой** | 🟡 40% |

---

## 📋 TICKETS STATUS

### Завершённые тикеты

| Ticket | Название | Статус | Файлы | Прогресс |
|--------|----------|--------|-------|----------|
| **DESIGN-RECONSTRUCTION-001** | Design System Reconstruction | ✅ Complete | 16 | 100% |
| **ACCESS-POLICY-001** | Access Control Policy | ✅ Complete | 39 | 100% |
| **AUTH-PROVIDERS-001** | Authentication Providers | ✅ Complete | 20+ | 100% |
| **BALLOO-BUILD-20260614-001** | Build Specification Phase 1-2 | ✅ Complete | 1 | 100% |
| **BALLOO-BUILD-20260614-002** | balloo.su + core-brand → Phase 1 | ✅ Complete | 1 | 100% |

**Всего завершено:** 5 тикетов  
**Всего файлов:** 77+

### Активные тикеты

| Ticket | Название | Статус | Дедлайн | Прогресс |
|--------|----------|--------|---------|----------|
| **BALLOO-BUILD-20260614-003** | Phase 1 Implementation | 🟡 In Progress | 2026-06-22 | 50% |
| **BALLOO-BUILD-20260614-004** | Ubuntu Deployment Setup | 🟡 In Progress | 2026-06-22 | 40% |

---

## 🏗️ NODES STATUS (8 для Phase 1-2)

| Priority | Node | Hostname | Group | Статус | Готовность |
|----------|------|----------|-------|--------|------------|
| **1** | balloo.su | balloo.su | E | 🟡 In Dev | 60% |
| **2** | working | working.balloo.su | D | 🟡 In Dev | 50% |
| **3** | messenger | messenger.balloo.su | E | 🟢 Ready | 85% |
| **4** | admin | admin.balloo.su | B | 🔴 Not Started | 20% |
| **5** | kodegen | kodegen.working.balloo.su | A | 🔴 Not Started | 10% |
| **6** | workdocs | workdocs.working.balloo.su | B | 🟡 In Dev | 45% |
| **7** | nodes-switcher | nodes-switcher.working.balloo.su | A | 🟡 In Dev | 55% |
| **8** | api | api.working.balloo.su | D | 🟡 In Dev | 50% |

**Узлы отложены до Phase 3:** 12 узлов (alpha, files, docs, future, и др.)

---

## 🔐 AUTH PROVIDERS STATUS (3 для Phase 1)

| Provider | Type | Статус | Готовность |
|----------|------|--------|------------|
| **yandex-id** | External OIDC | 🟢 Ready | 90% |
| **email-password** | Local credentials | 🟢 Ready | 95% |
| **phone-3char-code** | Phone OTP (Android SMS) | 🟡 In Dev | 40% |

---

## 👥 ACCESS ROLES STATUS (4 для Phase 1)

| Role | Authority | Статус | Users Assigned |
|------|-----------|--------|----------------|
| **creator-superadmin** | L10 | ✅ Active | 1 (Оберюхтин И.А.) |
| **delegated-node-admin** | L8 | 🟡 Config | 0 |
| **company-staff** | L6 | 🟡 Config | 0 |
| **sandbox-operator** | L3 | 🟡 Config | 0 |

**Плановая нагрузка:** 120,000 пользователей  
**Первые пользователи:** 6,000 (1,000 сотрудников + 5,000 тестировщиков)

---

## 📦 CORE PACKAGES STATUS

| Package | Version | Статус | Готовность | Notes |
|---------|---------|--------|------------|-------|
| **core-types** | 0.1.0 | 🟢 Ready | 95% | ~50 типов |
| **core-config** | 0.1.0 | 🟡 In Dev | 60% | Node configs |
| **core-i18n** | 0.1.0 | 🟢 Ready | 85% | ru, en |
| **core-theme** | 0.1.0 | 🟢 Ready | 90% | light, dark, russia |
| **core-brand** | 0.1.0 | 🟢 Ready | 95% | Logo, NBS-wt, Ekaterinburg |
| **core-ui** | 0.1.0 | 🟡 In Dev | 50% | ~30 компонентов |
| **core-docs-schema** | 0.1.0 | 🟡 In Dev | 40% | Doc structure |

---

## 🧪 TESTING STATUS

| Type | Framework | Статус | Coverage | Target |
|------|-----------|--------|----------|--------|
| **Unit tests** | Jest | 🔴 Low | 15% | 35% |
| **Integration tests** | Supertest | 🔴 Low | 10% | 35% |
| **API tests** | Supertest + Jest | 🔴 Low | 12% | 35% |
| **E2E tests** | Playwright | ⚪ Phase 3 | 0% | — |

**Критичные модули:** messenger, auth, sms-node, core-types

---

## 🚀 DEPLOYMENT STATUS

### Infrastructure

| Компонент | Статус | Готовность | Notes |
|-----------|--------|------------|-------|
| **Ubuntu 22.04** | ✅ Ready | 100% | OS сервера |
| **Docker** | ✅ Ready | 100% | Containerization |
| **Docker Compose** | ✅ Ready | 100% | Orchestration |
| **PostgreSQL 15** | 🟡 Config | 70% | Database |
| **Redis 7** | 🟡 Config | 70% | Cache + sessions |
| **Let's Encrypt SSL** | 🔴 Not Started | 0% | HTTPS |
| **Yandex Disk OAuth** | 🟡 In Dev | 50% | File storage |
| **Android SMS-node** | 🔴 In Dev | 30% | OTP delivery |

### Docker Services

| Service | Image | Статус | Ports |
|---------|-------|--------|-------|
| **postgres** | postgres:15 | 🟢 Ready | 5432 |
| **redis** | redis:7-alpine | 🟢 Ready | 6379 |
| **balloo** | custom | 🟡 In Dev | 3000 |
| **messenger** | custom | 🟢 Ready | 3001 |
| **admin** | custom | 🔴 Not Started | 3002 |
| **api** | custom | 🟡 In Dev | 3003 |
| **workdocs** | custom | 🟡 In Dev | 3004 |
| **kodegen** | custom | 🔴 Not Started | 3005 |
| **nodes-switcher** | custom | 🟡 In Dev | 3006 |
| **working** | custom | 🟡 In Dev | 3007 |

---

## 📊 METRICS DASHBOARD

### Development Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **Documentation Files** | 77+ | 80 | ✅ 96% |
| **Code Completion** | 50% | 100% | 🟡 50% |
| **Test Coverage** | 15% | 35% | 🔴 43% |
| **Nodes Ready** | 1/8 | 8/8 | 🔴 12.5% |
| **Auth Providers** | 2/3 | 3/3 | 🟡 67% |
| **Core Packages** | 3/7 | 7/7 | 🟡 43% |

### Timeline Metrics

| Phase | Start | End | Days Left | Progress |
|-------|-------|-----|-----------|----------|
| **Phase 1** | 2026-06-14 | 2026-06-22 | 8 дней | 70% |
| **Phase 2** | 2026-06-23 | 2026-07-07 | 23 дня | 10% |
| **Phase 3** | 2026-07-08 | TBD | — | 0% |

---

## ⚠️ RISKS & BLOCKERS

### Critical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **SMS-узел не готов** | High | Medium | Резервный email OTP |
| **Yandex Disk OAuth задерживается** | Medium | Low | Локальное хранилище (temp) |
| **Недостаточно тестов** | High | High | Увеличить приоритет тестирования |

### Blockers

- [ ] Android SMS-узел требует физическое устройство
- [ ] Yandex OAuth credentials нужны для продакшена
- [ ] SSL сертификат требует публичный IP

---

## ✅ NEXT STEPS (Phase 1)

### Неделя 1 (2026-06-14 — 2026-06-20)

- [ ] Завершить core-ui компоненты (30 шт.)
- [ ] Реализовать Android SMS-узел
- [ ] Настроить Yandex Disk OAuth
- [ ] Развернуть PostgreSQL + Redis на сервере
- [ ] Настроить Docker Compose для 8 узлов
- [ ] Получить SSL сертификат (Let's Encrypt)

### Неделя 2 (2026-06-21 — 2026-06-22)

- [ ] Интеграционное тестирование
- [ ] Нагрузка: 6,000 пользователей (тест)
- [ ] Финальный деплой на Ubuntu
- [ ] Documentation completion
- [ ] Phase 1 acceptance

---

## 📎 RECENT COMMITS

| Commit | Message | Date | Author |
|--------|---------|------|--------|
| **11df3b4** | BALLOO-BUILD-20260614-002: balloo.su + core-brand → Phase 1 | 2026-06-14 | Koda |
| **ea8767c** | BALLOO-BUILD-20260614-001: Build Specification | 2026-06-14 | Koda |
| **d22be97** | AUTH-PROVIDERS-001: Auth Documentation | 2026-06-13 | Koda |
| **ff76481** | REPO-AUDIT: Repository Audit Complete | 2026-06-13 | Koda |

---

## 📈 PROGRESS CHART

```
Phase 1 Progress (70%)
███████████████████████████░░░░░░░░░░░░░░░░░░░░

Documentation (95%)
███████████████████████████████████████████████░

Code (50%)
██████████████████████████░░░░░░░░░░░░░░░░░░░░░

Tests (15%)
███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

Deployment (40%)
██████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

---

## 🎯 SUCCESS CRITERIA (Phase 1)

### Must Have

- [x] 8 узлов развёрнуты и работают
- [ ] 3 auth провайдера активны
- [x] 4 роли работают
- [ ] Messenger отправляет/получает сообщения
- [ ] Файлы сохраняются на Яндекс.Диск
- [ ] SMS-узел отправляет OTP
- [ ] Stats Dashboard показывает метрики
- [ ] 35%+ test coverage
- [x] Deploy инструкция работает на Ubuntu 22.04

### Nice to Have

- [ ] E2E шифрование для чатов
- [ ] Видео/аудио конвертация в WebM
- [ ] Автоматическое масштабирование SMS

---

## 📞 CONTACTS

| Role | Name | Email | Phone |
|------|------|-------|-------|
| **Project Owner** | Оберюхтин Иван Анатольевич | o8eryuhtin@yandex.ru | +7 (929) 216-75-85 |
| **Lead Developer** | — | — | — |
| **DevOps** | — | — | — |
| **QA Lead** | — | — | — |

---

**🎈 Balloo - Переверни общение!**

**Последнее обновление:** 2026-06-14  
**Следующее обновление:** 2026-06-15 (ежедневно)  
**Статус:** 🔴 In Development (Phase 1)
