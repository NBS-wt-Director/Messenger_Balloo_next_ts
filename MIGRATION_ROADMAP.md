# Migration Roadmap

## Overview

This document outlines the phased migration from the current donor repository to the target monorepo architecture.

## Phase 1: Scaffold Creation ✅

**Status:** In Progress

**Goals:**
- Create target directory structure (apps/, packages/, workdocs/, docs-content/, platform-state/, infra/, tools/)
- Create migration documentation (MIGRATION_REPO_MAP.md, MIGRATION_ROADMAP.md)
- Create contract definitions (DesignContract, LanguageContract, ThemeContract, etc.)
- Create stub packages for future core libraries

**Deliverables:**
- [x] Directory structure created
- [x] MIGRATION_REPO_MAP.md
- [x] MIGRATION_ROADMAP.md
- [x] workdocs/contracts/*
- [x] Stub packages (core-config, core-i18n, core-theme, core-docs-schema)

---

## Phase 2: Workspace Setup

**Goals:**
- Create `pnpm-workspace.yaml`
- Configure workspace package resolution
- Add workspace-level scripts and tooling

**Deliverables:**
- [ ] pnpm-workspace.yaml
- [ ] Root package.json updates for workspace scripts
- [ ] ESLint/Prettier workspace configuration

---

## Phase 3: Shared → Core-Types

**Goals:**
- Extract types from `shared/` to `packages/core-types/`
- Establish core-types as the central type registry
- Update imports gradually (node-by-node)

**Deliverables:**
- [ ] packages/core-types/package.json
- [ ] packages/core-types/src/index.ts
- [ ] Migration of shared types to core-types
- [ ] Backward compatibility layer in shared/

---

## Phase 4: Settings → Core-Config

**Goals:**
- Extract settings from `settings/` to `packages/core-config/`
- Establish core-config as the central configuration registry
- Update imports gradually (node-by-node)

**Deliverables:**
- [ ] packages/core-config fully populated from settings/
- [ ] Backward compatibility layer in settings/
- [ ] Configuration schema validation

---

## Phase 5: Core-Brand

**Goals:**
- Create `packages/core-brand/`
- Extract Logo component and brand assets
- Define brand guidelines contract

**Deliverables:**
- [ ] packages/core-brand/package.json
- [ ] packages/core-brand/src/Logo component
- [ ] Brand color palette
- [ ] Typography definitions

---

## Phase 6: Core-I18n

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

## Phase 7: Core-Theme

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

## Phase 8: Core-UI

**Goals:**
- Create `packages/core-ui/`
- Extract shared UI components
- Enforce DesignContract (no rounded corners, zero border-radius)
- Establish component API standards

**Deliverables:**
- [ ] packages/core-ui/package.json
- [ ] Core component library
- [ ] Design system components
- [ ] Accessibility compliance

---

## Phase 9: Docs-Site

**Goals:**
- Create `apps/docs-site/`
- Set up documentation infrastructure
- Connect to docs-content/

**Deliverables:**
- [ ] apps/docs-site/ scaffold
- [ ] Documentation build pipeline
- [ ] Search and navigation

---

## Phase 10: Docs-Content + Platform-State Manifests

**Goals:**
- Populate `docs-content/` with platform documentation
- Create `platform-state/manifests/` for deployment state
- Establish docs-content schema

**Deliverables:**
- [ ] Platform documentation in docs-content/
- [ ] Deployment manifests in platform-state/manifests/
- [ ] docs-content schema validation

---

## Phase 11: App Migration by Node

**Goals:**
- Migrate messenger/ → apps/web-main (node-by-node)
- Migrate admin-portal/ → apps/admin (node-by-node)
- Migrate api/ → apps/api (node-by-node)
- Remove legacy rounded corner usage

**Deliverables:**
- [ ] apps/web-main fully functional
- [ ] apps/admin fully functional
- [ ] apps/api fully functional
- [ ] All legacy rounded corners removed
- [ ] All imports updated to new structure
- [ ] Backward compatibility layers removed

---

## Summary

| Phase | Name | Status |
|-------|------|--------|
| 1 | Scaffold Creation | In Progress |
| 2 | Workspace Setup | Pending |
| 3 | Shared → Core-Types | Pending |
| 4 | Settings → Core-Config | Pending |
| 5 | Core-Brand | Pending |
| 6 | Core-I18n | Pending |
| 7 | Core-Theme | Pending |
| 8 | Core-UI | Pending |
| 9 | Docs-Site | Pending |
| 10 | Docs-Content + Platform-State | Pending |
| 11 | App Migration by Node | Pending |
