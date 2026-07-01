# 🗺️ Карта информации узла BALLOO_MASTER_RECOVERY_GUIDE

**Версия:** v5.0  
**Последнее обновление:** 2026-07-02  
**Назначение:** Навигация для ИИ и разработчиков  

---

## 📁 Корневая структура

```
BALLOO_MASTER_RECOVERY_GUIDE/
├── core/              # 🔴 Ядро рендеринга (НЕ МЕНЯТЬ)
├── data/              # 📊 Данные разделов (JSON)
├── schemas/           # 📐 JSON Schema для валидации
├── static/            # 🎨 Клиентские файлы (НЕ МЕНЯТЬ)
├── sessions/          # 📜 История сессий
├── monorepo/          # 🏗️ Информация о монорепо
├── tz/                # 📝 ТЗ и тикеты (TODO)
├── autogen/           # 🤖 AI Codegen (TODO)
├── trash/             # 🗑️ Старые файлы v4.1
└── README_v5.md       # 📖 Главная документация
```

---

## 📂 Data разделы (34)

### 📨 Message System (новые V1)

| Раздел | Файл | Описание |
|--------|------|----------|
| `message_system_v1` | `data/message_system_v1/main.json` | Полная документация системы сообщений |
| `message_features_v1` | `data/message_features_v1/main.json` | 9 интерактивных функций, 10 вопросов до 10/10 |

### 📊 Основные разделы

| Раздел | Файл | Описание |
|--------|------|----------|
| `overview` | `data/overview/main.json` | Обзор проекта, метрики V1/V2 |
| `problems` | `data/problems/main.json` | Нерешённые проблемы (14 шт) |
| `resolved_problems` | `data/resolved_problems/main.json` | Решённые проблемы (9 шт) |
| `deferred_v2` | `data/deferred_v2/main.json` | Отложено до V2 (7 подразделов) |
| `functions` | `data/functions/main.json` | Реестр функций (74 шт) |
| `nodes` | `data/nodes/main.json` | Узлы архитектуры (8 шт) |
| `screens` | `data/screens/main.json` | Экраны (50 шт) |
| `killer_features` | `data/killer_features/main.json` | Уникальные преимущества |
| `recovery_protocol` | `data/recovery_protocol/main.json` | Protocol восстановления |
| `common_components` | `data/common_components/main.json` | Общие компоненты (8 шт) |

### 🔧 Технические разделы

| Раздел | Файл | Описание |
|--------|------|----------|
| `infrastructure` | `data/infrastructure/main.json` | Инфраструктура (сервер в Екб) |
| `security` | `data/security/main.json` | Безопасность и compliance |
| `design_system` | `data/design_system/main.json` | Дизайн-система (3 темы) |
| `devops_setup` | `data/devops_setup/main.json` | CI/CD и деплой |
| `data_schemas` | `data/data_schemas/main.json` | Схемы БД (15 таблиц) |
| `api_schemas` | `data/api_schemas/main.json` | REST API endpoints (30+) |
| `message_attachments` | `data/message_attachments/main.json` | Вложения и реакции |

### 📈 Аналитика

| Раздел | Файл | Описание |
|--------|------|----------|
| `competitive_analysis` | `data/competitive_analysis/main.json` | 7 конкурентов |
| `legal_analysis` | `data/legal_analysis/main.json` | 152-ФЗ и 150-ФЗ |
| `user_perspective` | `data/user_perspective/main.json` | Сильные/слабые стороны |
| `ui_conflicts` | `data/ui_conflicts/main.json` | UI-конфликты и решения |
| `functions_analysis` | `data/functions_analysis/main.json` | Анализ покрытия |
| `roadmap` | `data/roadmap/main.json` | 5 фаз разработки |
| `risks` | `data/risks/main.json` | Оценка рисков (7 рисков) |
| `verdict` | `data/verdict/main.json` | Вердикт (8.3/10) |

### 🎯 Планирование

| Раздел | Файл | Описание |
|--------|------|----------|
| `recommended_actions` | `data/recommended_actions/main.json` | V1 и BAP приоритеты |
| `codegen_instructions` | `data/codegen_instructions/main.json` | AI Codegen план |
| `tech_org` | `data/tech_org/main.json` | Тех-орг вопросы |
| `illegitimate_md` | `data/illegitimate_md/main.json` | MD без JSON |
| `documents` | `data/documents/main.json` | Документы |
| `data_audit` | `data/data_audit/main.json` | Аудит данных |
| `node_metrics` | `data/node_metrics/main.json` | Метрики узла |

---

## 📂 Deferred V2 подразделы (7)

| Раздел | Файл | Описание |
|--------|------|----------|
| `ai_chatbot` | `data/deferred_v2/ai_chatbot/main.json` | AI-ассистент |
| `balonishka` | `data/deferred_v2/balonishka/main.json` | Балунишка (AI) |
| `developer_api` | `data/deferred_v2/developer_api/main.json` | Developer API |
| `e2e_premium` | `data/deferred_v2/e2e_premium/main.json` | E2E шифрование Premium |
| `marketplace` | `data/deferred_v2/marketplace/main.json` | Маркетплейс тем |
| `premium` | `data/deferred_v2/premium/main.json` | Premium функции |
| `wallet` | `data/deferred_v2/wallet/main.json` | Кошелёк (P2P) |
| `white_label` | `data/deferred_v2/white_label/main.json` | White Label для бизнеса |

---

## 🔐 Core файлы (НЕ МЕНЯТЬ)

### Рендеринг

| Файл | Назначение |
|------|------------|
| `core/server.js` | HTTP-сервер (порт 3440), рендер на лету |
| `static/index.html` | HTML-шаблон |
| `static/app.js` | Client app, загрузка данных через API |
| `static/styles.css` | Стили (Dark Theme) |

### Схемы

| Файл | Назначение |
|------|------------|
| `schemas/message_features_v1.json` | Валидация функций сообщений |
| `schemas/message_system_v1.json` | Валидация системы сообщений |

---

## 📜 Сессии

| Сессия | Путь | Описание |
|--------|------|----------|
| #1 | `sessions/1/2026-07-02/` | Восстановление и документирование v5.0 |

---

## 🏗️ Монорепо информация

| Файл | Описание |
|------|----------|
| `monorepo/info/structure.md` | Структура, зависимости, БД, API |

---

## 🚀 Быстрый старт

### Запуск сервера

```bash
cd BALLOO_MASTER_RECOVERY_GUIDE
node core/server.js
```

**URL:** http://localhost:3440

### API endpoints

```bash
# Список разделов
curl http://localhost:3440/api/sections

# Данные раздела
curl http://localhost:3440/api/data/{section_id}
```

---

## 📊 Метрики для быстрого доступа

```
Разделов:           34
JSON файлов:        42
Схем JSON:          2
Функций:            74 (53 V1 + 21 V2)
Экранов:            50
Узлов:              8
Таблиц БД:          15
API Endpoints:      30+
WebSocket Events:   14
Итоговая оценка:    8.3/10
```

---

## ⚠️ Важные правила

1. **НЕ МЕНЯТЬ** файлы в `core/` и `static/` (кроме добавления рендереров в app.js)
2. **Все данные** только в `data/{section}/main.json`
3. **JSON Schema** в `schemas/`
4. **Сессии** в `sessions/{номер}/{дата}/`
5. **Никакого кеширования** — рендер на лету

---

## 🔍 Поиск информации

| Что ищу | Где смотреть |
|---------|--------------|
| Функции V1 | `data/functions/main.json` |
| Экраны | `data/screens/main.json` |
| API endpoints | `data/api_schemas/main.json` |
| БД таблицы | `data/data_schemas/main.json` |
| Проблемы | `data/problems/main.json` |
| Roadmap | `data/roadmap/main.json` |
| Риски | `data/risks/main.json` |
| Message System | `data/message_system_v1/main.json` |
| Message Features | `data/message_features_v1/main.json` |

---

*Используй эту карту для навигации по узлу*
