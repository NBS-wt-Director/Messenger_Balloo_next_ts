---
title: 'Quickstart: kpdegen-working'
description: Быстрый старт для kpdegen.working.balloo.su
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - quickstart
  - kpdegen
  - priority-1
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/technical/NODE_kpdegen_working.md
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_kpdegen_working.md
  - SUMMARY_DOCS/runbooks/RUNBOOK_kpdegen_working.md
---

# 🚀 QUICKSTART: kpdegen-working

**Что это:** Серверный кодогенератор Balloo — генерирует код, конфиги и документы из contracts.

**Когда нужен:** Когда нужно сгенерировать код узла, конфиги или документы на основе contracts и state files.

---

## 📍 ГДЕ НАЙТИ

| Среда | Access |
|-------|--------|
| **Working** | `https://kpdegen.working.balloo.su:4200` |
| **Local Dev** | `http://localhost:4200` |

---

## ✅ ПРОВЕРКА РАБОТЫ

```bash
curl http://localhost:4200/health
```

**Ожидаемый ответ:**
```json
{
  "status": "healthy",
  "templates_loaded": 10,
  "codegen_engine_ready": true
}
```

---

## 🎯 ПЕРВЫЕ ШАГИ

### 1. Подготовить контекст

```bash
# Убедиться что SUMMARY_DOCS доступны
ls SUMMARY_DOCS/contracts/nodes/
ls SUMMARY_DOCS/state/
```

### 2. Запустить генерацию

```bash
curl -X POST http://localhost:4200/generate \
  -H "Content-Type: application/json" \
  -d '{
    "nodeId": "my-new-node",
    "template": "node-scaffold",
    "outputDir": "./output"
  }'
```

### 3. Проверить output

```bash
ls ./output/
```

### 4. Валидировать результат

```bash
node scripts/validate-output.js ./output/
```

---

## 📚 ПОЛНАЯ ДОКУМЕНТАЦИЯ

| Документ | Link |
|----------|------|
| **Summary** | [NODE_kpdegen_working.md](../technical/NODE_kpdegen_working.md) |
| **Contract** | [NODE_CONTRACT_kpdegen_working.md](../contracts/nodes/NODE_CONTRACT_kpdegen_working.md) |
| **Runbook** | [RUNBOOK_kpdegen_working.md](../runbooks/RUNBOOK_kpdegen_working.md) |
| **Troubleshooting** | [TROUBLESHOOTING_kpdegen_working.md](../troubleshooting/TROUBLESHOOTING_kpdegen_working.md) |
| **Examples** | [NODE_EXAMPLES_kpdegen_working.md](../examples/NODE_EXAMPLES_kpdegen_working.md) |

---

## ❌ НЕЛЬЗЯ

- ❌ **Не генерировать без чтения contracts** — specs обязательны
- ❌ **Не игнорировать safety checks** — validate output
- ❌ **Не коммитить generated code без review** — human review required
- ❌ **Не использовать для production без testing** — working only

---

## 🆘 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

1. Проверить health: `curl http://localhost:4200/health`
2. Проверить templates: `curl http://localhost:4200/admin/templates`
3. Проверить логи: `tail -f logs/kpdegen.log`
4. Перезапустить: `pm2 restart kpdegen`
5. См. [Troubleshooting](../troubleshooting/TROUBLESHOOTING_kpdegen_working.md)

---

## ⏱️ TIME TO VALUE

- **Первый доступ:** 1 минута
- **Первая генерация:** 5 минут
- **Валидация output:** 5 минут
- **Полное понимание:** 20 минут

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
