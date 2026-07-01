# ⛔ Критические Проблемы V1

**Дата создания:** 26.06.2026  
**Последнее обновление:** 2026-06-26  
**Платформа:** Balloo Platform  

---

## Проблема #1: Документация — не исходный код

**Серьёзность:** 🔴 Критическая

BALLOO_MASTER_RECOVERY_GUIDE — это документация, описывающая как работает, структурирована и видится платформа: start-release (V1) и OneYersPlatformRelease (V2). Не recovery-гайд, а blueprint-документ. Все фрагменты кода — архитектурные заглушки для иллюстрации концепции.

**Решение:** Чёткое позиционирование — документ как архитектурное описание V1 и V2.

---

## Проблема #2: Monorepo — архитектура узлов

**Серьёзность:** 🔴 Критическая

Monorepo из нескольких узлов, объединённых кодовой базой. Каждый узел может подниматься на одном или более контейнерах на одном или более серверах в рамках одной виртуальной сети и одного workspace.

**Решение:** Monorepo + контейнеризация. Каждый узел — отдельный сервис в monorepo.

---

## Проблема #3: Порты узлов

**Серьёзность:** 🟡 Предупреждение

У каждого узла свой порт 30**. Назначение портов: API Gateway — 3001, Messenger — 3002, Admin Portal — 3003, Web App — 3004, Mobile API — 3005, Database — 3006, Cache — 3007, File Storage — 3008.

**Решение:** Единая таблица портов.

---

## Проблема #4: E2E шифрование — архитектурный риск

**Серьёзность:** 🔴 Критическая

Решение ФИНАЛИЗИРОВАНО. V1: Web Crypto + PBKDF2 + PIN. V2: Signal Protocol + Premium Secret Chats с AI-фильтром (терроризм, хищения, незаконная торговля, аморальный контент), human review (24ч), эскалацией (6=подозрительный, 7=бан 24ч, 8=бан + 50% штраф, 9=бан + полиция).

**Решения:**
1. Signal Protocol (libsignal) — industry standard (WhatsApp, Signal)
2. Web Crypto API + PBKDF2 (V1) — шифровать ключи паролем пользователя
3. Premium Secret Chats (V2) — AI-фильтр + human review + эскалация

---

## Проблема #5: Миграция БД

**Серьёзность:** 🟡 Предупреждение

15+ таблиц описаны, но нет migration файлов, версионирования схемы, стратегии миграции, seed данных, индексов для производительности.

**Решение:** Drizzle ORM — TypeScript-native, light-weight, генерирует миграции из schema.

---

## Проблема #6: Тесты

**Серьёзность:** 🟡 Предупреждение

Ни слова о тестировании. Нет unit/integration/E2E тестов, test-coverage goals, CI/CD pipeline.

**Решение:** Vitest + Testing Library. Backend 70%+, frontend 60%+.

---

## Проблема #7: Платёжная система V2

**Серьёзность:** 🔴 Критическая

V2 включает кошелёк, маркетплейс с escrow, платежи. Требует PCI DSS, платёжный провайдер, escrow-логика, chargeback, налоговая отчётность, AML/KYC.

**Решения:**
1. White-label payment SDK (ЮKassa, CloudPayments)
2. Отложить V2 Monetization (запустить V1 без платежей)
3. MVP Wallet (только баланс)

---

## Проблема #8: AI-чат V2

**Серьёзность:** 🟡 Предупреждение

Неясно: какая модель, кто платит за токены, где хостинг, какой latency, как обрабатывать prompt-injection, где модерация контента.

**Решения:**
1. OpenRouter API — агрегатор моделей
2. Self-hosted LLM — Ollama + Llama 3/Mistral
3. Tiered AI — Free: Mistral 7B, Premium: GPT-4/Claude

---

## Проблема #9: API Versioning

**Серьёзность:** 🟡 Предупреждение

Все endpoints на /api/v1/, но нет стратегии версионирования.

**Решение:** URL + Header versioning. Старые версии 12 месяцев.

---

## Проблема #10: WebSocket offline-first

**Серьёзность:** 🟡 Предупреждение

Нет: offline message queue, message deduplication, message ordering, backpressure handling, IndexedDB кэш.

**Решения:**
1. RxDB + Socket.IO
2. CRDT-подход (Yjs или Automerge)

---

## Проблема #11: Rate Limiting

**Серьёзность:** 🟢 Минор

Нет: sliding window vs fixed window, per-IP vs per-user, Retry-After header, визуальный feedback.

**Решение:** Redis sliding window.

---

## Проблема #12: Yandex Disk — единая точка отказа

**Серьёзность:** 🟡 Предупреждение

Все файлы в Yandex Disk: зависимость от одного провайдера, нет control над данными, лимиты API, нет CDN.

**Решения:**
1. Multi-storage abstraction (MinIO, Yandex Object Storage, Selectel)
2. CDN + Edge caching (Cloudflare R2)

---

*Все проблемы описаны с решениями для приоритизации разработки.*
