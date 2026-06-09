# Apps Directory

## Целевая структура

### Текущие приложения → Будущие названия

| Текущее состояние | Будущее | Описание |
|-------------------|---------|----------|
| `messenger/` | `apps/web-main` | Главный узел balloo.su (SPA/SSR) |
| `admin-portal/` | `apps/admin` | Админ-панель v3 |
| `api/` | `apps/api` | API сервер |
| `desktop/` | `apps/desktop` | Desktop приложение (Electron) |
| `mobile/` | `apps/mobile` | Mobile приложение (React Native) |
| `android-service/` | `apps/android-service` | Android push сервис |
| `max-server/` | `apps/max-server` | SMS/MMS сервис |

### Планируемые приложения

- `apps/docs-site` - Статический сайт документации (markdown-first)
- `apps/abaut` - Отображающий узел abaut.balloo.su
- `apps/nodes-switcher` - Переключатель узлов
- `apps/projectgeneralsettings` - Общие настройки проекта
- `apps/workdocs-ui` - UI для работы с документами

## Правила

1. **messenger = web-main**: messenger станет главным узлом платформы
2. **admin-portal = admin**: админка v3 будет здесь
3. **Общие правила дизайна**: все узлы придерживаются одних правил
4. **Общий логотип**: brand source в packages/core-brand
5. **Общий список языков**: packages/core-i18n
6. **Общий список preset themes**: packages/core-theme
7. **Custom themes**: только в user-facing приложениях (web-main, mobile, desktop)
8. **Статистика**: отображается в админке
9. **Markdown-first**: ТЗ, contracts, описания узлов - в markdown
