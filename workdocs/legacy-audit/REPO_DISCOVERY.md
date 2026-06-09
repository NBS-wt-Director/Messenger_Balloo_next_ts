# Repository Discovery Report

## Purpose

Document the actual top-level structure of the donor repository and map to target architecture.

## Audit Date

2026-06-09

---

## Top-Level Directories Found

| Directory | Type | Target Location | Status |
|-----------|------|-----------------|--------|
| `messenger/` | Application | `apps/web-main` | keep-as-is / migrate later |
| `admin-portal/` | Application | `apps/admin` | keep-as-is / migrate later |
| `api/` | Application | `apps/api` | keep-as-is / migrate later |
| `android-service/` | Application | `apps/android-service` | keep-as-is / migrate later |
| `desktop/` | Application | `apps/desktop` | keep-as-is / migrate later |
| `mobile/` | Application | `apps/mobile` | keep-as-is / migrate later |
| `max-server/` | Application | `apps/max-server` | keep-as-is / migrate later |
| `shared/` | Package | `packages/core-types` | package extraction candidate |
| `settings/` | Package | `packages/core-config` | package extraction candidate |
| `docs/` | Documentation | `docs-content/` + `apps/docs-site/` | split required |
| `nginx/` | Infrastructure | `infra/nginx` | infra-only |
| `apps/` | Scaffold | `apps/` | NEW (target structure) |
| `packages/` | Scaffold | `packages/` | NEW (target structure) |
| `workdocs/` | Scaffold | `workdocs/` | NEW (target structure) |
| `docs-content/` | Scaffold | `docs-content/` | NEW (target structure) |
| `platform-state/` | Scaffold | `platform-state/` | NEW (target structure) |
| `infra/` | Scaffold | `infra/` | NEW (target structure) |
| `tools/` | Scaffold | `tools/` | NEW (target structure) |

---

## Top-Level Files Found

| File | Type | Notes |
|------|------|-------|
| `package.json` | Config | Root package (balloo-monorepo) |
| `package-lock.json` | Lock | npm lockfile |
| `docker-compose.yml` | Infra | Docker configuration |
| `deploy*.sh` | Scripts | Deployment scripts |
| `MIGRATION_REPO_MAP.md` | Docs | Migration mapping |
| `MIGRATION_ROADMAP.md` | Docs | Migration phases |
| `README.md` | Docs | Project readme |
| `CONTRIBUTING.md` | Docs | Contribution guide |
| `CHANGELOG.md` | Docs | Change log |

---

## Applications Summary

### Active Applications (7)

1. **messenger/** - Main web application
   - Contains: i18n, theme-store, Logo component
   - Target: apps/web-main

2. **admin-portal/** - Admin portal v3
   - Uses: @app-balloo/settings
   - Target: apps/admin

3. **api/** - Backend API server
   - Target: apps/api

4. **android-service/** - Android push service
   - Target: apps/android-service

5. **desktop/** - Desktop application (Electron)
   - Target: apps/desktop

6. **mobile/** - Mobile application (React Native)
   - Target: apps/mobile

7. **max-server/** - SMS/MMS service
   - Target: apps/max-server

---

## Packages Summary

### Current Packages (2)

1. **shared/** - Shared types and utilities
   - Target: packages/core-types
   - Status: Extraction candidate

2. **settings/** - Shared configuration
   - Target: packages/core-config
   - Status: Extraction candidate

---

## Infrastructure Summary

### Current Infrastructure

1. **nginx/** - Nginx web server configuration
   - Target: infra/nginx
   - Status: infra-only

2. **docker-compose.yml** - Docker orchestration
   - Target: infra/docker/
   - Status: infra-only

---

## Documentation Summary

### Current Documentation

1. **docs/** - Documentation directory
   - Target: split between docs-content/ and apps/docs-site/
   - Status: split required

---

## Legacy Issues Identified

### Design Violations

- **Rounded corners**: 200+ instances found across messenger/ and admin-portal/
- **See**: `workdocs/legacy-audit/ROUNDING_VIOLATIONS.md`

### Package Manager

- **Current**: npm (package-lock.json)
- **Target**: pnpm (pnpm-workspace.yaml created in Phase 2)
- **Status**: bootstrap-only, no forced migration

---

## Migration Readiness

| Component | Ready for Migration | Notes |
|-----------|---------------------|-------|
| messenger/ | No | Phase 10 |
| admin-portal/ | No | Phase 10 |
| api/ | No | Phase 10 |
| shared/ | No | Phase 3 |
| settings/ | No | Phase 4 |
| docs/ | No | Phase 9 |

---

## Version

- **Report Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Complete
