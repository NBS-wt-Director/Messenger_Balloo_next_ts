# Migration Roadmap: Balloo Monorepo → Platform Structure

## Phase 1: Scaffold (Current - 2026-06-09)

### Completed
- ✅ Created `apps/` directory structure
- ✅ Created `packages/` directory structure
- ✅ Created `workdocs/contracts/` with 6 contracts
- ✅ Created machine-readable manifests
- ✅ Fixed TypeScript errors (0 errors)
- ✅ Committed and pushed

### Next Steps (Phase 2)
1. Create pnpm workspace config
2. Migrate `shared/` → `packages/core-types`
3. Migrate `settings/` → `packages/core-config`
4. Move `messenger/` → `apps/web-main` (symbolic link or rename)
5. Move `admin-portal/` → `apps/admin`
6. Move `api/` → `apps/api`

## Phase 3: Core Packages

- [ ] `packages/core-brand` - Extract logo, colors from messenger
- [ ] `packages/core-i18n` - Extract i18n from messenger
- [ ] `packages/core-theme` - Extract theme system
- [ ] `packages/core-ui` - Extract common UI components
- [ ] `packages/core-api-client` - Extract API client
- [ ] `packages/data-access` - Create data access layer
- [ ] `packages/storage-adapters` - PostgreSQL adapter

## Phase 4: Apps Migration

- [ ] `apps/web-main` - Full migration from messenger
- [ ] `apps/admin` - Full migration from admin-portal
- [ ] `apps/api` - Full migration from api
- [ ] `apps/docs-site` - Create markdown-first docs
- [ ] `apps/abaut` - Create abaut.balloo.su node

## Phase 5: WorkDocs System

- [ ] `workdocs/nodes/` - Node definitions
- [ ] `workdocs/trees/` - Tree structures
- [ ] `workdocs/releases/` - Release tracking
- [ ] `apps/nodes-switcher` - Node switcher UI
- [ ] `apps/workdocs-ui` - WorkDocs UI

## Risks

1. **Breaking imports**: при переносе файлов могут сломаться imports
2. **Build pipeline**: нужно обновить CI/CD для новой структуры
3. **Environment variables**: могут потребовать обновления
4. **Database migrations**: PostgreSQL schema может потребовать изменений

## Open Questions

1. Использовать pnpm или npm workspaces?
2. Монолитная БД или микросервисы?
3. Где хранить загрузочные файлы?
4. Нужна ли поддержка SQLite кроме PostgreSQL?

## As-IS → Target Map

| As-IS | Target | Status |
|-------|--------|--------|
| `messenger/` | `apps/web-main` | Scaffolded |
| `admin-portal/` | `apps/admin` | Scaffolded |
| `api/` | `apps/api` | Scaffolded |
| `shared/` | `packages/core-types` | Planned |
| `settings/` | `packages/core-config` | Planned |
| - | `packages/core-i18n` | Scaffolded |
| - | `packages/core-theme` | Scaffolded |
| - | `packages/core-brand` | Planned |
| - | `packages/core-ui` | Planned |

## Version

- **Roadmap Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Phase 1 Complete
