---
title: 'Troubleshooting: workdocs-working'
description: Диагностика и решение проблем для workdocs.working.balloo.su
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - troubleshooting
  - workdocs
  - priority-1
  - canonical
related_docs:
  - SUMMARY_DOCS/runbooks/RUNBOOK_workdocs_working.md
  - SUMMARY_DOCS/nodes/technical/NODE_workdocs_working.md
---

# 🔧 TROUBLESHOOTING: workdocs-working

**Node ID:** `workdocs-working`  
**Domain:** `workdocs.working.balloo.su`  
**Local Dev:** `localhost:3210`  

---

## Scenario 1: Docs Not Loading

**Symptom:**
- 404 на страницах документации
- Пустой индекс
- Health check показывает `docs_loaded: 0`

**Likely Cause:**
- Неверный путь к SUMMARY_DOCS
- Проблема с правами доступа к файлам
- Ошибка парсинга Markdown

**Verification:**
```bash
# Проверить путь к docs
ls -la ./SUMMARY_DOCS

# Проверить права доступа
chmod -R 755 ./SUMMARY_DOCS

# Проверить логи
tail -f logs/workdocs-error.log
```

**Safe Action:**
```bash
# Исправить права
chmod -R 755 ./SUMMARY_DOCS

# Перезагрузить docs
curl -X POST http://localhost:3210/admin/reload-docs

# Проверить health
curl http://localhost:3210/health
```

**Escalation:**
- When: Не помогло после reload
- Who: docs-team lead

**Rollback Note:**
- Restore previous SUMMARY_DOCS from git
- `git checkout <previous-commit> -- SUMMARY_DOCS/`

**Related Runbook:**
- [RUNBOOK_workdocs_working.md](../runbooks/RUNBOOK_workdocs_working.md)

---

## Scenario 2: Auth Broken

**Symptom:**
- Login page циклически перезагружается
- 401 на всех запросах
- Health check показывает `auth_working: false`

**Likely Cause:**
- Password hash corrupted
- Session storage full
- Auth module misconfigured

**Verification:**
```bash
# Проверить auth config
cat .env.working | grep AUTH

# Проверить sessions
ls -la ./sessions/

# Проверить логи
tail -f logs/workdocs-error.log | grep auth
```

**Safe Action:**
```bash
# Reset auth
node scripts/reset-auth.js

# Clear sessions
rm -rf ./sessions/*

# Restart service
pm2 restart workdocs

# Verify
curl http://localhost:3210/health
```

**Escalation:**
- When: Auth still broken after reset
- Who: security team + admin

**Rollback Note:**
- Restore previous .env.working from backup
- `cp .env.working.backup .env.working`

**Related Runbook:**
- [RUNBOOK_workdocs_working.md](../runbooks/RUNBOOK_workdocs_working.md)

---

## Scenario 3: High Response Time

**Symptom:**
- Response time > 2000ms
- Timeout errors
- Health check degraded

**Likely Cause:**
- Cache disabled
- Large docs not cached
- Memory pressure

**Verification:**
```bash
# Проверить cache
curl http://localhost:3210/admin/cache-status

# Проверить memory
pm2 monit

# Проверить response time
curl -w "@format.txt" -o /dev/null -s http://localhost:3210/
```

**Safe Action:**
```bash
# Enable cache
export CACHE_ENABLED=true

# Clear cache
rm -rf ./cache/*

# Restart with more memory
pm2 restart workdocs --max-old-space-size=4096

# Verify
curl http://localhost:3210/health
```

**Escalation:**
- When: Response time still high after cache clear
- Who: performance team

**Rollback Note:**
- Revert memory settings
- Restore previous config

**Related Runbook:**
- [RUNBOOK_workdocs_working.md](../runbooks/RUNBOOK_workdocs_working.md)

---

## Scenario 4: SSL Certificate Expired

**Symptom:**
- Browser warnings
- curl errors with SSL
- Health check fails on HTTPS

**Likely Cause:**
- SSL certificate expired
- Certificate not renewed

**Verification:**
```bash
# Check certificate expiry
openssl s_client -connect workdocs.working.balloo.su:3210 -servername workdocs.working.balloo.su | openssl x509 -noout -dates

# Check cert files
ls -la ssl/
```

**Safe Action:**
```bash
# Renew certificate (Let's Encrypt example)
certbot renew

# Or generate new self-signed for dev
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem

# Restart
pm2 restart workdocs
```

**Escalation:**
- When: Certificate renewal fails
- Who: devops + security

**Rollback Note:**
- Restore previous certificate from backup
- `cp ssl/cert.pem.backup ssl/cert.pem`

**Related Runbook:**
- [RUNBOOK_workdocs_working.md](../runbooks/RUNBOOK_workdocs_working.md)

---

## Scenario 5: Markdown Parsing Errors

**Symptom:**
- Ошибки в логах о парсинге
- Некоторые docs не отображаются
- Health check warnings

**Likely Cause:**
- Invalid Markdown syntax
- Unsupported Markdown features
- Corrupted files

**Verification:**
```bash
# Find parsing errors
grep "parse error" logs/workdocs-error.log

# Validate markdown
node scripts/validate-markdown.js

# Check specific file
cat SUMMARY_DOCS/nodes/NODE_CONTRACT_xxx.md
```

**Safe Action:**
```bash
# Fix invalid markdown
# Edit the problematic file

# Reload docs
curl -X POST http://localhost:3210/admin/reload-docs

# Verify
curl http://localhost:3210/health
```

**Escalation:**
- When: Multiple files corrupted
- Who: docs-team

**Rollback Note:**
- Restore docs from git
- `git checkout <previous-commit> -- SUMMARY_DOCS/`

**Related Runbook:**
- [RUNBOOK_workdocs_working.md](../runbooks/RUNBOOK_workdocs_working.md)

---

## 📋 QUICK DIAGNOSIS FLOW

```
1. Check health: curl localhost:3210/health
   │
   ├─ status: healthy → All good
   ├─ status: degraded → Check response time, cache
   └─ status: failed → Check logs, restart
   │
2. Check logs: tail -f logs/workdocs-error.log
   │
   ├─ auth errors → Reset auth
   ├─ parse errors → Fix markdown
   └─ file errors → Check permissions
   │
3. Check resources: pm2 monit
   │
   ├─ high memory → Increase memory limit
   └─ high CPU → Check for loops
```

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
