
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
- [x] MIGRATION_REPO_MAP.md
- [x] MIGRATION_ROADMAP.md
- [x] workdocs/contracts/*
- [x] workdocs/legacy-audit/*
- [x] Stub packages (core-types, core-config, core-i18n, core-theme, core-brand, core-ui, core-docs-schema)

---

## Phase 2: Repo Mapping + Legacy Audit

**Status:** Pending

**Goals:**
- Complete full mapping of all donor paths to target structure
- Document all legacy design violations
- Create migration checklist for each application

**Deliverables:**
- [ ] Complete repo mapping documentation
- [ ] Full legacy audit report
- [ ] Migration checklist per application

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

**Status:** Pending

**Goals:**
- Create `packages/core-i18n/`
- Extract i18n infrastructure from messenger/
- Implement platform-level language registry
- Enforce 12-language contract

**Deliverables:**
- [ ] packages/core-i18n fully populated
- [ ] Language registry implementation
- [ ] Translation loading mechanism
- [ ] Language switching utilities

---

## Phase 6: Messenger Theme Extraction → Core-Theme

**Status:** Pending

**Goals:**
- Create `packages/core-theme/`
- Extract theme-store from messenger/
- Implement platform preset themes (dark, light, russia)
- Enforce theme contract (custom themes = user apps only)

**Deliverables:**
- [ ] packages/core-theme fully populated
- [ ] Theme store implementation
- [ ] Theme switching utilities
- [ ] Admin/system theme restrictions

---

## Phase 7: Brand/Logo Extraction → Core-Brand

**Status:** Pending

**Goals:**
- Create `packages/core-brand/`
- Extract Logo component and brand assets from messenger/
- Define brand guidelines contract

**Deliverables:**
- [ ] packages/core-brand/package.json
- [ ] packages/core-brand/src/Logo component
- [ ] Brand color palette
- [ ] Typography definitions

---

## Phase 8: Shared UI Primitives → Core-UI

**Status:** Pending

**Goals:**
- Create `packages/core-ui/`
- Extract shared UI components from messenger/
- Enforce DesignContract (no rounded corners, zero border-radius)
- Establish component API standards

**Deliverables:**
- [ ] packages/core-ui/package.json
- [ ] Core component library
- [ ] Design system components
- [ ] Accessibility compliance
- [ ] No-rounding enforcement

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
| 1 | Scaffold + Workspace Bootstrap | In Progress |
| 2 | Repo Mapping + Legacy Audit | Pending |
| 3 | Shared → Core-Types | Pending |
| 4 | Settings → Core-Config | Pending |
| 5 | Messenger i18n → Core-I18n | Pending |
| 6 | Messenger Theme → Core-Theme | Pending |
| 7 | Brand/Logo → Core-Brand | Pending |
| 8 | Shared UI → Core-UI | Pending |
| 9 | Docs Split → Docs-Content + Docs-Site | Pending |
| 10 | Node Apps Normalization | Pending |
| 11 | Infra Normalization | Pending |
| 12 | Legacy Design Cleanup | Pending |
