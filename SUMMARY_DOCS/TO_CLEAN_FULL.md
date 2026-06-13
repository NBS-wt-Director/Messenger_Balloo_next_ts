---
title: Файлы на Очистку
date: 2026-06-12
status: ⚠️ Требует выполнения
priority: Высокая
---

# 🗑️ Файлы на Очистку

**Дата аудита:** 2026-06-12  
**Аудитор:** Koda (NLP-Core-Team)  
**Причина:** Дубликаты, устаревшие отчёты, временные файлы  
**Цель:** Вся документация только в SUMMARY_DOCS/

---

## 🔴 КРИТИЧНО - Удалить немедленно

### 1. repo-check/ - ПОЛНАЯ КОПИЯ монорепо

```
repo-check/                          # ❌ УДАЛИТЬ ЦЕЛИКОМ
├── *.md (30+ файлов)                # Дубликаты из корня
├── admin-portal/                    # Копия admin-portal/
├── api/                             # Копия api/
├── docs/                            # Копия docs/ (80+ файлов)
├── messenger/                       # Копия messenger/
├── workdocs/                        # Копия workdocs/
└── ...                              # Все файлы проекта
```

**Причина:** Создан для аудита 2026-06-11. Все данные перенесены в SUMMARY_DOCS.  
**Действие:** `Remove-Item -Path "repo-check" -Recurse -Force`

---

### 2. docs/ - Старая документация (80+ файлов)

```
docs/                                # ❌ УДАЛИТЬ ЦЕЛИКОМ
├── API_DOCUMENTATION.md             → дубликат SUMMARY_DOCS/Nodes/api.md
├── ARCHITECTURE.md                  → дубликат SUMMARY_DOCS/TZ.md
├── DEPLOYMENT.md                    → дубликат SUMMARY_DOCS/Nodes/
├── FINAL_*.md (20+ файлов)          → устаревшие отчёты
├── MIGRATION_*.md (15+ файлов)      → дубликат SUMMARY_DOCS/history_tickets/
├── STATUS_*.md (10+ файлов)         → устаревшие статусы
├── SPECIFICATION.md                 → дубликат SUMMARY_DOCS/TZ.md
└── ... (80+ файлов всего)
```

**Исключения:** Некоторые файлы из docs/api/ и docs/messenger/ могут содержать уникальную информацию - проверить перед удалением.

**Действие:** `Remove-Item -Path "docs" -Recurse -Force`

---

### 3. docs-*/ папки (дубликаты)

```
docs-contracts/                      # ❌ УДАЛИТЬ - контракты в SUMMARY_DOCS/Contracts/
docs-migration/                      # ❌ УДАЛИТЬ - миграции в SUMMARY_DOCS/history_tickets/
docs-site/                           # ❌ УДАЛИТЬ - сайт в SUMMARY_DOCS/
docs-content/                        # ❌ УДАЛИТЬ - пусто
```

**Действие:**
```powershell
Remove-Item -Path "docs-contracts" -Recurse -Force
Remove-Item -Path "docs-migration" -Recurse -Force
Remove-Item -Path "docs-site" -Recurse -Force
Remove-Item -Path "docs-content" -Recurse -Force
```

---

## 🟡 Корневые файлы на удаление

| Файл | Причина | Действие |
|------|---------|----------|
| API_CHECKLIST.md | Устарел | ❌ Удалить |
| API_COMPLETE_SUMMARY.md | Устарел | ❌ Удалить |
| API_EXPANSION_STRATEGY.md | Устарел | ❌ Удалить |
| DAY1_CHECKLIST.md | Временный | ❌ Удалить |
| DAY1_COMPLETE.md | Временный | ❌ Удалить |
| DAY1_PROGRESS.md | Временный | ❌ Удалить |
| DEPLOY_INSTRUCTIONS.md | Устарел | ❌ Удалить |
| DEPLOY_ONE_COMMAND.sh | Скрипт | ❌ Удалить |
| FINAL_CHANGES_REPORT.md | Устарел | ❌ Удалить |
| FINAL_SUMMARY.md | Устарел | ❌ Удалить |
| FRONTEND_DAY3_COMPLETE.md | Устарел | ❌ Удалить |
| FRONTEND_DAY4_COMPLETE.md | Устарел | ❌ Удалить |
| FRONTEND_PLAN.md | Устарел | ❌ Удалить |
| IMPLEMENTATION_PLAN_ATTACHMENTS.md | Устарел | ❌ Удалить |
| IMPLEMENTATION_PLAN_THEMES.md | Устарел | ❌ Удалить |
| IMPLEMENTATION_SCHEDULE.md | Устарел | ❌ Удалить |
| MIGRATION_COMPLETE.md | Дубликат | ❌ Удалить |
| MIGRATION_GUIDE.md | Дубликат | ❌ Удалить |
| MIGRATION_REPO_MAP.md | Дубликат | ❌ Удалить |
| MIGRATION_ROADMAP.md | Дубликат | ❌ Удалить |
| MIGRATION_TO_EXTERNAL_API.md | Устарел | ❌ Удалить |
| PLAN.md | Устарел | ❌ Удалить |
| PROGRESS_REPORT.md | Устарел | ❌ Удалить |
| PROJECT_AUDIT_AND_IMPROVEMENTS.md | Устарел | ❌ Удалить |
| RELEASE_NOTES.md | Устарел | ❌ Удалить |
| RELEASE_PLAN.md | Дубликат | ❌ Удалить |
| RELEASE_READY.md | Устарел | ❌ Удалить |
| REMAINING_TASKS.md | Устарел | ❌ Удалить |
| STAGE_5_REPORT.md | Устарел | ❌ Удалить |
| START_HERE.md | Устарел | ❌ Удалить |
| SUMMARY.md | Дубликат | ❌ Удалить |
| deploy.sh | Скрипт | ❌ Удалить |
| deploy-and-fix.sh | Скрипт | ❌ Удалить |
| SAFE_DEPLOY.sh | Скрипт | ❌ Удалить |
| push-stage.sh | Скрипт | ❌ Удалить |

**Действие:**
```powershell
Remove-Item -Path "API_*.md" -Force
Remove-Item -Path "DAY*.md" -Force
Remove-Item -Path "FINAL_*.md" -Force
Remove-Item -Path "FRONTEND_*.md" -Force
Remove-Item -Path "IMPLEMENTATION_*.md" -Force
Remove-Item -Path "MIGRATION_*.md" -Force
Remove-Item -Path "PLAN.md" -Force
Remove-Item -Path "PROGRESS_REPORT.md" -Force
Remove-Item -Path "RELEASE_*.md" -Force
Remove-Item -Path "STAGE_5_REPORT.md" -Force
Remove-Item -Path "START_HERE.md" -Force
Remove-Item -Path "SUMMARY.md" -Force
Remove-Item -Path "*.sh" -Force
```

---

## 🟢 workdocs/ - Чистка

### Оставить:
```
workdocs/
├── contracts/                    # ✅ 8 контрактов
├── migrations/                   # ✅ Отчёты о миграции (12 файлов)
└── PROJECT_READINESS_REPORT.md   # ✅ Готовность проекта
```

### Удалить:
```
workdocs/
├── audits/                       # ❌ Дубликат аудитов
├── legacy-audit/                 # ❌ Устарел
└── migrations/BRAND_MIGRATION.md # ⚠️ Перенести в SUMMARY_DOCS/history_tickets/
```

**Действие:**
```powershell
# Перенести важные миграции
Move-Item -Path "workdocs/migrations/*.md" -Destination "SUMMARY_DOCS/history_tickets/" -Force

# Удалить остальное
Remove-Item -Path "workdocs/audits" -Recurse -Force
Remove-Item -Path "workdocs/legacy-audit" -Recurse -Force
```

---

## 📊 Итоговая статистика

| Категория | Файлов | Папок | Действие |
|-----------|--------|-------|----------|
| repo-check/ | ~200 | 15 | ❌ Удалить |
| docs/ | ~80 | 8 | ❌ Удалить |
| docs-*/ | ~5 | 4 | ❌ Удалить |
| Корень (*.md) | ~35 | - | ❌ Удалить |
| Корень (*.sh) | ~5 | - | ❌ Удалить |
| workdocs/ | ~15 | 2 | ⚠️ Частично |
| **ВСЕГО НА УДАЛЕНИЕ** | **~340** | **29** | |

---

## 🚀 Скрипт полной очистки

```powershell
# Windows PowerShell - Запуск из корня app_balloo/

Write-Host "🗑️  Начало очистки монорепо Balloo..." -ForegroundColor Yellow

# 1. Удаление полных копий
Write-Host "`n📁 Удаление repo-check/..." -ForegroundColor Cyan
Remove-Item -Path "repo-check" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Удаление старых docs папок
Write-Host "`n📁 Удаление docs-*/ папок..." -ForegroundColor Cyan
Remove-Item -Path "docs" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "docs-contracts" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "docs-migration" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "docs-site" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "docs-content" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Удаление устаревших MD файлов
Write-Host "`n📄 Удаление устаревших MD файлов..." -ForegroundColor Cyan
Get-ChildItem -Path "." -Filter "API_*.md" | Remove-Item -Force
Get-ChildItem -Path "." -Filter "DAY*.md" | Remove-Item -Force
Get-ChildItem -Path "." -Filter "FINAL_*.md" | Remove-Item -Force
Get-ChildItem -Path "." -Filter "FRONTEND_*.md" | Remove-Item -Force
Get-ChildItem -Path "." -Filter "IMPLEMENTATION_*.md" | Remove-Item -Force
Get-ChildItem -Path "." -Filter "MIGRATION_*.md" | Remove-Item -Force
Get-ChildItem -Path "." -Filter "RELEASE_*.md" | Remove-Item -Force
Remove-Item -Path "PLAN.md","PROGRESS_REPORT.md","STAGE_5_REPORT.md","START_HERE.md","SUMMARY.md" -Force -ErrorAction SilentlyContinue

# 4. Удаление скриптов
Write-Host "`n🔧 Удаление старых скриптов..." -ForegroundColor Cyan
Get-ChildItem -Path "." -Filter "*.sh" | Remove-Item -Force

# 5. Чистка workdocs
Write-Host "`n📂 Чистка workdocs/..." -ForegroundColor Cyan
Move-Item -Path "workdocs/migrations/*.md" -Destination "SUMMARY_DOCS/history_tickets/" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "workdocs/audits" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "workdocs/legacy-audit" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n✅ Очистка завершена!" -ForegroundColor Green
Write-Host "📊 Удалено файлов: ~340" -ForegroundColor Green
Write-Host "📊 Удалено папок: 29" -ForegroundColor Green
Write-Host "`n📁 Вся документация теперь в SUMMARY_DOCS/" -ForegroundColor Green
```

---

## ✅ Результат после очистки

```
app_balloo/
├── SUMMARY_DOCS/              # ✅ ЕДИНЫЙ источник документации
│   ├── *.md (18 файлов)       # TZ, Featurys, Release_*, Errors, To_clean
│   ├── Contracts/ (8)         # Все контракты
│   ├── Nodes/ (3)             # API, Messenger, Admin Portal
│   ├── Modules/ (1)           # Модули
│   ├── Tree/ (1)              # Структура
│   ├── history_tickets/ (15+) # История тикетов + миграции
│   ├── Owner_tickets/ (3)     # Планируемые тикеты
│   ├── media/ (2)             # CSS, логотип
│   └── pages/                 # Next.js сайт
├── api/                       # ✅ Код API
├── admin-portal/              # ✅ Код Admin Portal
├── messenger/                 # ✅ Код Messenger
├── mobile/                    # ✅ Код Mobile
├── desktop/                   # ✅ Код Desktop
├── docker/                    # ✅ Docker configs
├── infra/                     # ✅ Инфраструктура
├── packages/                  # ✅ Core пакеты
├── platform-state/            # ✅ Состояние
├── workdocs/                  # ✅ Только contracts/ и migrations/
├── README.md                  # ✅ Главный README
├── CONTRIBUTING.md            # ✅ Контрибьюция
├── CHANGELOG.md               # ✅ История изменений
└── .gitignore                 # ✅ Исключения
```

---

## ⚠️ ВАЖНО

**После очистки:**
1. ✅ Вся документация ТОЛЬКО в SUMMARY_DOCS/
2. ✅ Нет дубликатов
3. ✅ ИИ (Koda) работает только с SUMMARY_DOCS/
4. ✅ Чистая структура монорепо
5. ✅ Легко поддерживать

**Перед очисткой:**
- [ ] Убедиться что все файлы перенесены в SUMMARY_DOCS
- [ ] Сделать backup (git commit)
- [ ] Проверить что сайт SUMMARY_DOCS работает

---

**Дата выполнения:** 2026-06-12  
**Исполнитель:** Koda (NLP-Core-Team)  
**Статус:** ⏳ Ожидает выполнения
