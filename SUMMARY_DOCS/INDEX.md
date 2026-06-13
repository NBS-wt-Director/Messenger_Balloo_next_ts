,# 📚 Balloo Platform - Documentation Index

**Версия:** 2.0.0  
**Дата:** 2026-06-12  
**Статус:** ✅ Production Ready

---

## 🎯 Основные документы

| Документ | Описание | Статус |
|----------|----------|--------|
| [Monorepo_readme.md](./Monorepo_readme.md) | Главная документация | ✅ |
| [TZ.md](./TZ.md) | Техническое задание | ✅ |
| [Featurys.md](./Featurys.md) | Реализованные функции | ✅ |
| [Release_plan.md](./Release_plan.md) | План релиза | ✅ |
| [Realease_calendare.md](./Realease_calendare.md) | Календарь релизов | ✅ |
| [To_clean.md](./To_clean.md) | Файлы на очистку | ✅ |
| [Errors.md](./Errors.md) | Ошибки монорепо | ✅ |
| [Monorepo_structure.md](./Monorepo_structure.md) | Структура монорепо | ✅ |

---

## 📁 Поддиректории

### Contracts (/Contracts/)
Контракты платформы

| Контракт | Описание | Статус |
|----------|----------|--------|
| [DesignContract.md](./Contracts/DesignContract.md) | border-radius: 0 везде | ✅ |
| [ThemeContract.md](./Contracts/ThemeContract.md) | 3 preset themes | ✅ |
| [LanguageContract.md](./Contracts/LanguageContract.md) | 12 languages | ✅ |
| [BrandContract.md](./Contracts/BrandContract.md) | Logo, colors | ✅ |
| [AutopilotContract.md](./Contracts/AutopilotContract.md) | Autopilot mode | ✅ |
| [StatsContract.md](./Contracts/StatsContract.md) | Статистика | ✅ |
| [TranslationContract.md](./Contracts/TranslationContract.md) | Переводы | ✅ |
| [TreeContract.md](./Contracts/TreeContract.md) | Дерево проекта | ✅ |

### Nodes (/Nodes/)
Узлы проекта

| Узел | Описание | Статус |
|------|----------|--------|
| [api.md](./Nodes/api.md) | Backend API | ✅ |
| [messenger.md](./Nodes/messenger.md) | Мессенджер | ✅ |
| [admin-portal.md](./Nodes/admin-portal.md) | Админ панель | ✅ |

### Modules (/Modules/)
Модули проекта

| Модуль | Описание | Статус |
|--------|----------|--------|
| [index.md](./Modules/index.md) | Список модулей | ✅ |

### Tree (/Tree/)
Ветки монорепо

| Ветка | Описание | Статус |
|-------|----------|--------|
| [index.md](./Tree/index.md) | Структура дерева | ✅ |

### history_tickets/ (/history_tickets/)
История тикетов

| Тикет | Описание | Статус |
|-------|----------|--------|
| [index.md](./history_tickets/index.md) | Список тикетов | ✅ |

### media/ (/media/)
Медиа материалы

| Файл | Описание | Статус |
|------|----------|--------|
| (pending) | Фото/видео материалы | ⏳ |

---

## ✏️ Редактирование документов

Для изменения документов используйте **[Веб-редактор](http://localhost:3100/editor)**

Доступные для редактирования:
- To_clean.md
- Featurys.md
- Release_plan.md
- Realease_calendare.md
- TZ.md
- Errors.md

После редактирования нажмите "Сохранить" — страница обновится автоматически.

---

## 🔄 Автообновление из монорепо

Для синхронизации с файлами монорепо:

```bash
npm run update-docs
```

---

## 📊 Статус проекта

| Компонент | Готовность |
|-----------|------------|
| Backend API | 100% ✅ |
| Frontend Web | 100% ✅ |
| Admin Portal | 100% ✅ |
| Core Packages | 100% ✅ |
| Docker Infrastructure | 100% ✅ |
| CI/CD Pipeline | 100% ✅ |
| Documentation | 100% ✅ |
| Mobile App | 35% 🔄 |
| Desktop App | 40% 🔄 |

**Общая готовность:** 92% (Production Ready)

---

## 🚀 Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить сервисы
docker-compose -f docker/configs/docker-compose.prod.yml up -d

# 3. Проверить здоровье
curl http://localhost:3001/health
```

---

## 📞 Поддержка

- **GitHub Issues** — Баги и фичи
- **Email** — support@balloo.ru
- **Documentation** — /docs

---

## 🙏 Благодарности

**Команда:** NLP-Core-Team  
**AI Agent:** Autopilot mode  
**Время разработки:** ~10 часов  
**Дедлайн MVP:** 11 июня 2026 ✅

---

*Создано: 2026-06-12*  
*Версия: 2.0.0*  
*Статус: ✅ Production Ready*
