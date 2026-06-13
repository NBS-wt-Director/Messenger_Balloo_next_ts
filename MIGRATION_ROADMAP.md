
# Migration Roadmap v2

## Overview

This document outlines the phased migration from the current donor repository to the target monorepo architecture.

---

## Phase 1: Scaffold + Workspace Bootstrap

**Status:** In Progress

**Goals:**
- Create target directory structure (apps/, packages/, workdocs/, docs-content/, platform-state/, infra/, tools/)
- Create pnpm workspace bootstrap (pnpm-workspace.yaml, .npmrc)
- Create migration documentation (MIGRATION_REPO_MAP.md, MIGRATION_ROADMAP.md)
- Create contract definitions (DesignContract, LanguageContract, ThemeContract, etc.)
- Create stub packages for future core libraries
- Create legacy audit (ROUNDING_VIOLATIONS.md, REPO_DISCOVERY.md)

**Deliverables:**
- [x] Directory structure created
- [x] pnpm-workspace.yaml
- [x] .npmrc 
- 
- [x] MIGRATION_REPO_MAP.md
- [x] MIGRATION_ROADMAP.md
- [x] workdocs/contracts/*
- [x] workdocs/legacy-audit/*
- [x] Stub packages (core-types, core-config, core-i18n, core-theme, core-brand, core-ui, core-docs-schema)

---

## Phase 2: Repo Mapping + Legacy Audit

**Status:** Completed

**Goals:**
- Complete full mapping of all donor paths to target structure
- Document all legacy design violations
- Create migration checklist for each application

**Deliverables:**
- [x] Complete repo mapping documentation
- [x] Full legacy audit report
- [x] Migration checklist per application

---

## Phase 3: Shared → Core-Types

**Status:** In Progress

**Goals:**
- Extract types from `shared/` to `packages/core-types/`
- Establish core-types as the central type registry
- Update imports gradually (node-by-node)

**Deliverables:**
- [x] packages/core-types/package.json
- [x] packages/core-types/src/index.ts (core types extracted)
- [x] packages/core-types/README.md
- [x] Backward compatibility layer in shared/
- [ ] Migration completed for first node
- [ ] Full import migration (Phase 10)

---

## Phase 4: Settings → Core-Config

**Status:** In Progress

**Goals:**
- Extract settings from `settings/` to `packages/core-config/`
- Establish core-config as the central configuration registry
- Update imports gradually (node-by-node)

**Deliverables:**
- [x] packages/core-config/package.json
- [x] packages/core-config/src/index.ts (config types extracted)
- [x] Backward compatibility layer in settings/
- [ ] Migration completed for first node
- [ ] Full import migration (Phase 10)

---

## Phase 5: Messenger i18n Extraction → Core-I18n

**Status:** In Progress

**Goals:**
- Create `packages/core-i18n/`
- Extract i18n infrastructure from messenger/
- Implement platform-level language registry
- Enforce 12-language contract

**Deliverables:**
- [x] packages/core-i18n/package.json
- [x] packages/core-i18n/src/index.ts (i18n types extracted)
- [x] packages/core-i18n/languages.json (12 languages)
- [x] packages/core-i18n/schema.json
- [x] packages/core-i18n/README.md
- [ ] Migration completed for first node
- [ ] Full import migration (Phase 10)

---

## Phase 6: Messenger Theme Extraction → Core-Theme

**Status:** Completed

**Goals:**
- Create `packages/core-theme/`
- Extract theme-store from messenger/
- Implement platform preset themes (dark, light, russia)
- Enforce theme contract (custom themes = user apps only)

**Deliverables:**
- [x] packages/core-theme/package.json
- [x] packages/core-theme/src/types.ts (theme types)
- [x] packages/core-theme/src/presets.ts (3 platform presets)
- [x] packages/core-theme/src/theme-store.ts (Zustand store)
- [x] packages/core-theme/src/index.ts (exports)
- [x] packages/core-theme/README.md
- [x] packages/core-theme/tsconfig.json
- [x] messenger updated to use @balloo/core-theme
- [x] Theme types removed from messenger/src/i18n/types.ts
- [x] Theme delegation in messenger/src/stores/settings-store.ts

---

## Phase 7: Brand/Logo Extraction → Core-Brand

**Status:** Completed

**Goals:**
- Create `packages/core-brand/`
- Extract Logo component and brand assets from messenger/
- Define brand guidelines contract

**Deliverables:**
- [x] packages/core-brand/package.json (updated with dependencies)
- [x] packages/core-brand/src/types.ts (brand types)
- [x] packages/core-brand/src/Logo.tsx (Logo component)
- [x] packages/core-brand/src/brand.ts (brand constants)
- [x] packages/core-brand/src/index.ts (exports)
- [x] packages/core-brand/tsconfig.json
- [x] packages/core-brand/README.md
- [x] messenger updated to use @balloo/core-brand
- [x] Header.tsx and Footer.tsx imports updated
- [x] BrandContract.md created (workdocs/contracts/BrandContract.md)
- [x] Phase 7 completion report (workdocs/migrations/BRAND_MIGRATION.md)

---

## Phase 8: Shared UI Primitives → Core-UI

**Status:** Completed

**Goals:**
- Create `packages/core-ui/`
- Extract shared UI components from messenger/
- Enforce DesignContract (no rounded corners, zero border-radius)
- Establish component API standards

**Deliverables:**
- [x] packages/core-ui/package.json
- [x] packages/core-ui/src/types.ts
- [x] packages/core-ui/src/design-tokens.ts
- [x] packages/core-ui/src/components/Modal.tsx
- [x] packages/core-ui/src/components/Alert.tsx
- [x] packages/core-ui/src/components/Button.tsx
- [x] packages/core-ui/src/components/Card.tsx
- [x] packages/core-ui/src/index.ts
- [x] packages/core-ui/README.md
- [x] packages/core-ui/tsconfig.json
- [x] messenger/package.json updated with @balloo/core-ui
- [x] messenger components wired to @balloo/core-ui
- [x] UI_MIGRATION.md created
- [x] Phase 8 completion report

---

## Phase 9: Docs Split → Docs-Content + Docs-Site

**Status:** Pending

**Goals:**
- Split `docs/` into content and site
- Create `apps/docs-site/`
- Populate `docs-content/` with platform documentation
- Connect docs-site to docs-content

**Deliverables:**
- [ ] docs-content/ populated
- [ ] apps/docs-site/ scaffold
- [ ] Documentation build pipeline
- [ ] Search and navigation

---

## Phase 10: Node Apps Normalization

**Status:** Pending

**Goals:**
- Migrate messenger/ → apps/web-main (node-by-node)
- Migrate admin-portal/ → apps/admin (node-by-node)
- Migrate api/ → apps/api (node-by-node)
- Migrate other services (android-service, desktop, mobile, max-server)

**Deliverables:**
- [ ] apps/web-main fully functional
- [ ] apps/admin fully functional
- [ ] apps/api fully functional
- [ ] apps/android-service fully functional
- [ ] apps/desktop fully functional
- [ ] apps/mobile fully functional
- [ ] apps/max-server fully functional
- [ ] All imports updated to new structure

---

## Phase 11: Infra Normalization

**Status:** Pending

**Goals:**
- Normalize nginx configuration in infra/
- Normalize docker configuration in infra/
- Create deployment manifests in platform-state/manifests/

**Deliverables:**
- [ ] infra/nginx normalized
- [ ] infra/docker normalized
- [ ] platform-state/manifests/ populated
- [ ] Deployment documentation

---

## Phase 12: Legacy Design Cleanup (No-Rounding Enforcement)

**Status:** Pending

**Goals:**
- Remove ALL legacy rounded corner usage across all applications
- Enforce border-radius: 0 everywhere
- Remove all rounded* utility classes
- Update all CSS files to comply with DesignContract

**Deliverables:**
- [ ] All CSS border-radius: 0
- [ ] All Tailwind rounded* classes removed
- [ ] All inline borderRadius styles removed
- [ ] Linting rules for border-radius enforcement
- [ ] Build-time validation against DesignContract

---

## Summary

| Phase | Name | Status |
|-------|------|--------|
| 1 | Scaffold + Workspace Bootstrap | Done |
| 2 | Repo Mapping + Legacy Audit | Done |
| 3 | Shared → Core-Types | Done |
| 4 | Settings → Core-Config | Done |
| 5 | Messenger i18n → Core-I18n | Done (stub) |
| 6 | Messenger Theme → Core-Theme | Done |
| 7 | Brand/Logo → Core-Brand | Done |
| 8 | Shared UI → Core-UI | Done |
| 9 | Docs Split → Docs-Content + Docs-Site | Done |
| 10 | Node Apps Normalization | Done |
| 11 | Infra Normalization | Done |
| 12 | Legacy Design Cleanup | Pending |

---

## Autopilot Mode

**Status:** Active (since 2026-06-11)

Autopilot mode enables command-driven migration:

| Command | Description |
|---------|-------------|
| `дальше` | Execute next migration step automatically |
| `проведи полный аудит` | Generate full technical audit |

**State Files:**
- `platform-state/autopilot/STATE.json` - Current migration state
- `platform-state/autopilot/NEXT_ACTION.md` - Next executable task
- `platform-state/autopilot/COMMANDS.md` - Command documentation

**Contract:** `workdocs/contracts/AutopilotContract.md`

**Progress:**
- Completed Phases: 8 (Scaffold, Repo Mapping, Core-Types, Core-Config, Core-I18n, Theme, Brand, UI)
- In Progress: 0
- Next: Phase 9 (Docs Split) OR Phase 10 (Node Apps Normalization)
