# Monorepo Structure - Balloo Platform

**Дата аудита:** 2026-06-12  
**Версия:** 2.0.0  
**Статус:** Актуально

---

## 📁 Структура монорепо

```
app_balloo/
├── 📄 README.md                          # Главная документация
├── 📄 CONTRIBUTING.md                    # Правила вклада
├── 📄 CHANGELOG.md                       # История изменений
├── 📄 MIGRATION_GUIDE.md                 # Гайд по миграции
├── 📄 MIGRATION_ROADMAP.md               # Дорожная карта
├── 📄 MIGRATION_COMPLETE.md              # Финальный отчёт
├── 📄 RELEASE_NOTES.md                   # Примечания к релизу
├── 📄 package.json                       # Root package
├── 📄 pnpm-workspace.yaml                # Workspace config
├── 📄 pnpm-lock.yaml                     # Lock file
├── 📄 .npmrc                             # NPM config
├── 📄 .gitignore                         # Git ignore
├── 📄 docker-compose.yml                 # Docker Compose
│
├── 📦 packages/                          # Core packages
│   ├── core-types/                       # 20+ типов
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── core-config/                      # 15+ типов, 11 функций
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── core-i18n/                        # 12 языков
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── languages.json
│   │   ├── schema.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── core-theme/                       # 3 пресета
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── presets.ts
│   │   │   └── theme-store.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── core-brand/                       # Логотип, брендинг
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── Logo.tsx
│   │   │   └── brand.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── core-ui/                          # UI компоненты
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── design-tokens.ts
│   │   │   └── components/
│   │   │       ├── Modal.tsx
│   │   │       ├── Alert.tsx
│   │   │       ├── Button.tsx
│   │   │       └── Card.tsx
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── eslint-config/                    # Общие правила ESLint
│   │   ├── index.js
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── prettier-config/                  # Общие правила Prettier
│   │   ├── index.js
│   │   └── package.json
│   │
│   └── tsconfig/                         # Общие конфиги TS
│       ├── base.json
│       ├── next.json
│       ├── index.json
│       └── package.json
│
├── 🖥️ api/                               # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── schema/
│   │   ├── websocket/
│   │   └── scripts/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── 🌐 admin-portal/                      # Админ панель (Next.js)
│   ├── src/
│   │   ├── pages/
│   │   └── components/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── 💬 messenger/                         # Мессенджер (Next.js)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── stores/
│   │   └── hooks/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── 📱 mobile/                            # Мобильное приложение (Expo)
│   ├── src/
│   ├── package.json
│   └── app.json
│
├── 💻 desktop/                           # Десктоп приложение (Electron)
│   ├── src/
│   ├── package.json
│   └── electron-builder.config.js
│
├── 🐳 docker/                            # Docker конфигурации
│   ├── README.md
│   ├── base/
│   │   ├── node/
│   │   │   ├── Dockerfile
│   │   │   ├── README.md
│   │   │   └── .dockerignore
│   │   └── nginx/
│   ├── scripts/
│   │   ├── healthcheck.sh
│   │   └── entrypoint.sh
│   └── configs/
│       ├── docker-compose.prod.yml
│       ├── nginx/
│       │   └── nginx.conf
│       ├── ci-cd.yml
│       └── .env.example
│
├── 📚 docs/                              # Документация (legacy)
├── 📚 docs-content/                      # MDX контент
├── 📚 docs-contracts/                    # API контракты
├── 📚 docs-migration/                    # Миграционные гайды
├── 🌐 docs-site/                         # Next.js docs site
│   ├── src/
│   ├── pages/
│   ├── package.json
│   └── next.config.js
│
├── 🏗️ platform-state/                    # Состояние платформы
│   └── autopilot/
│       ├── STATE.json
│       ├── NEXT_ACTION.md
│       ├── COMMANDS.md
│       ├── MIGRATION_SUMMARY.md
│       ├── FINAL_SUMMARY.md
│       ├── FINAL_REPORT.md
│       └── FINAL_REPORT_V2.md
│
├── 📝 workdocs/                          # Внутренняя документация
│   ├── contracts/                        # Контракты
│   │   ├── DesignContract.md
│   │   ├── ThemeContract.md
│   │   ├── LanguageContract.md
│   │   ├── BrandContract.md
│   │   ├── AutopilotContract.md
│   │   ├── StatsContract.md
│   │   ├── TranslationContract.md
│   │   └── TreeContract.md
│   │
│   ├── migrations/                       # Отчёты миграции
│   │   ├── CORE_TYPES_MIGRATION.md
│   │   ├── CORE_CONFIG_MIGRATION.md
│   │   ├── CORE_I18N_MIGRATION.md
│   │   ├── THEME_MIGRATION.md
│   │   ├── BRAND_MIGRATION.md
│   │   ├── UI_MIGRATION.md
│   │   ├── DOCS_SPLIT_MIGRATION.md
│   │   ├── NODE_APPS_NORMALIZATION.md
│   │   ├── PHASE_9_COMPLETE.md
│   │   ├── PHASE_10_COMPLETE.md
│   │   ├── PHASE_11_PROGRESS.md
│   │   └── PHASE_12_CLEANUP.md
│   │
│   ├── audits/                           # Аудиты
│   │   ├── README.md
│   │   └── FULL_AUDIT_2026-06-11.md
│   │
│   ├── legacy-audit/                     # Legacy issues
│   │   ├── REPO_DISCOVERY.md
│   │   └── ROUNDING_VIOLATIONS.md
│   │
│   └── PROJECT_READINESS_REPORT.md
│
├── 🔧 tools/                             # Инструменты
│   └── README.md
│
└── 📂 SUMMARY_DOCS/                      # Узел документации (новый)
    ├── To_clean.md
    ├── Featurys.md
    ├── Release_plan.md
    ├── Realease_calendare.md
    ├── TZ.md
    ├── Errors.md
    ├── Monorepo_structure.md
    ├── Monorepo_readme.md
    ├── Contracts/                        # Контракты
    ├── Nodes/                            # Узлы
    ├── Modules/                          # Модули
    ├── Tree/                             # Ветки
    ├── history_tickets/                  # История тикетов
    └── media/                            # Медиа материалы
```

---

## 📊 Статистика структуры

| Категория | Количество |
|-----------|------------|
| Core packages | 10 |
| Applications | 5 (3 active, 2 deferred) |
| Directories | 15+ |
| Contract files | 8 |
| Migration reports | 12 |
| Total files | ~150+ |

---

## 🔄 Workspace packages

```json
{
  "packages": [
    "@balloo/core-types",
    "@balloo/core-config",
    "@balloo/core-i18n",
    "@balloo/core-theme",
    "@balloo/core-brand",
    "@balloo/core-ui",
    "@balloo/eslint-config",
    "@balloo/prettier-config",
    "@balloo/tsconfig"
  ]
}
```

---

## 🎯 Приложения

| Приложение | Type | Status | Port |
|------------|------|--------|------|
| api | Node.js + Express | ✅ Production | 3001 |
| admin-portal | Next.js | ✅ Production | 3002 |
| messenger | Next.js | ✅ Production | 3000 |
| mobile | Expo + React Native | 🔄 Deferred | - |
| desktop | Electron | 🔄 Deferred | - |

---

*Создано: 2026-06-12*  
*Аудит: Полный монорепо*  
*Версия: 2.0.0*
