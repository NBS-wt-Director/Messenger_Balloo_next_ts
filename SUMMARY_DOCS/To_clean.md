# To Clean - Монорепо Balloo

**Дата аудита:** 2026-06-12  
**Статус:** Актуально  
**Версия:** 1.0.0

---

## 📋 Обзор файлов на очистку

### 🔴 Критичные (удалить)

| Файл | Причина | Действие |
|------|---------|----------|
| `deploy.sh` | Старый скрипт деплоя, заменён на Docker Compose | Удалить |
| `deploy-and-fix.sh` | Устаревший, не используется | Удалить |
| `SAFE_DEPLOY.sh` | Ручной деплой, заменён на CI/CD | Удалить |
| `DEPLOY_ONE_COMMAND.sh` | Дубликат функций | Удалить |
| `push-stage.sh` | Ручной деплой на stage | Удалить |
| `repo-check/` | Копия репозитория для тестов | Удалить (если не нужна) |

---

### 🟡 Требуют анализа (часть полезная)

| Файл | Полезное | Куда переместить |
|------|----------|------------------|
| `MIGRATION_MILESTONE_*.md` | История миграции | `workdocs/migrations/history/` |
| `STATUS_*.md` | Отчёты о статусе | `workdocs/audits/history/` |
| `*_COMPLETE.md` | Отчёты о завершении фаз | `workdocs/migrations/` (оставить) |
| `DAY1_*.md` | Планы на день | `workdocs/planning/history/` |
| `FRONTEND_DAY*.md` | Планы по фронтенду | `workdocs/planning/history/` |
| `STAGE_5_REPORT.md` | Отчёт по этапу | `workdocs/reports/` |
| `IMPLEMENTATION_*.md` | Планы реализации | `workdocs/planning/archive/` |

**Действие:**
- Переместить в `workdocs/archive/`
- Создать индекс `workdocs/archive/INDEX.md`

---

### 🟢 Сохранить (важная документация)

| Файл | Причина |
|------|---------|
| `README.md` | Основная документация |
| `CONTRIBUTING.md` | Правила вклада |
| `CHANGELOG.md` | История изменений |
| `MIGRATION_GUIDE.md` | Гайд по миграции |
| `MIGRATION_ROADMAP.md` | Дорожная карта (актуальная) |
| `RELEASE_NOTES.md` | Примечания к релизу |
| `RELEASE_PLAN.md` | План релиза (архив) |
| `PROJECT_READme.md` | Обзор проекта |
| `API_CHECKLIST.md` | Чеклист API |
| `MIGRATION_COMPLETE.md` | Финальный отчёт миграции |
| `platform-state/` | Состояние платформы (активно) |
| `workdocs/contracts/` | Контракты (активно) |
| `workdocs/migrations/` | Отчёты миграции (активно) |
| `workdocs/audits/` | Аудиты (активно) |
| `docker/` | Docker конфигурации |
| `docs/` | Документация |
| `packages/` | Core packages |
| `api/`, `admin-portal/`, `messenger/` | Приложения |

---

## 🧹 Структура после очистки

```
app_balloo/
├── README.md                    # ✅ Главная
├── CONTRIBUTING.md              # ✅ Вклад
├── CHANGELOG.md                 # ✅ История
├── MIGRATION_GUIDE.md           # ✅ Миграция
├── MIGRATION_ROADMAP.md         # ✅ Дорожная карта
├── MIGRATION_COMPLETE.md        # ✅ Финальный отчёт
├── RELEASE_NOTES.md             # ✅ Релиз
├── docker/                      # ✅ Docker configs
├── docs/                        # ✅ Документация
├── packages/                    # ✅ Core packages
├── api/                         # ✅ API приложение
├── admin-portal/                # ✅ Админка
├── messenger/                   # ✅ Мессенджер
├── platform-state/              # ✅ Состояние платформы
├── workdocs/                    # ✅ Внутренняя документация
│   ├── contracts/               # Контракты
│   ├── migrations/              # Отчёты миграции
│   ├── audits/                  # Аудиты
│   ├── legacy-audit/            # Legacy issues
│   └── archive/                 # Архив (новые)
├── SUMMARY_DOCS/                # ✅ Новый узел документации
└── .gitignore                   # Исключения
```

---

## 🗑️ Файлы для удаления

### Корневой уровень
```bash
# Удалить
rm deploy.sh
rm deploy-and-fix.sh
rm SAFE_DEPLOY.sh
rm DEPLOY_ONE_COMMAND.sh
rm push-stage.sh

# Переместить в архив
mkdir -p workdocs/archive/milestones
mkdir -p workdocs/archive/status
mkdir -p workdocs/archive/planning

mv MIGRATION_MILESTONE_*.md workdocs/archive/milestones/
mv STATUS_*.md workdocs/archive/status/
mv DAY1_*.md workdocs/archive/planning/
mv FRONTEND_DAY*.md workdocs/archive/planning/
mv IMPLEMENTATION_*.md workdocs/archive/planning/
```

### repo-check (если не нужна)
```bash
# Если репозиторий для проверки не нужен
rm -rf repo-check/
```

---

## 📊 Статистика

| Категория | Количество |
|-----------|------------|
| Файлы на удаление | ~10 |
| Файлы на архивацию | ~20 |
| Файлы на сохранение | ~50+ |
| Директории на очистку | 1 (repo-check/) |

---

## ✅ Чеклист очистки

- [ ] Удалить старые скрипты деплоя
- [ ] Переместить устаревшие отчёты в archive
- [ ] Проверить ссылки в документации
- [ ] Обновить README.md при необходимости
- [ ] Закоммитить изменения
- [ ] Создать тег clean-v1.0.0

---

*Создано: 2026-06-12*  
*Аудит: Полный монорепо*  
*Статус: Требует выполнения*
