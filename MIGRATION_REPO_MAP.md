# Migration Repo Map v2

## Current State (Donor Repository)

This document maps the current repository structure to the target monorepo architecture.

---

## Applications Mapping

| Current Path | Future Path | Status | Notes |
|--------------|-------------|--------|-------|
| `messenger/` | `apps/web-main` | keep-as-is / migrate later | Main web app (messenger), contains i18n, theme-store, Logo |
| `admin-portal/` | `apps/admin` | keep-as-is / migrate later | Admin portal v3, uses @app-balloo/settings |
| `api/` | `apps/api` | keep-as-is / migrate later | Backend API server |
| `android-service/` | `apps/android-service` | keep-as-is / migrate later | Android push service |
| `desktop/` | `apps/desktop` | keep-as-is / migrate later | Desktop application (Electron) |
| `mobile/` | `apps/mobile` | keep-as-is / migrate later | Mobile application (React Native) |
| `max-server/` | `apps/max-server` | keep-as-is / migrate later | SMS/MMS service |
| `docs/` | `docs-content/` + `apps/docs-site/` | split required | Docs split between content and site |

---

## Packages Mapping

| Current Path | Future Path | Status | Notes |
|--------------|-------------|--------|-------|
| `shared/` | `packages/core-types` | package extraction candidate | Shared types, candidate for core-types |
| `settings/` | `packages/core-config` | package extraction candidate | Shared settings, candidate for core-config |

---

## Infrastructure Mapping

| Current Path | Future Path | Status | Notes |
|--------------|-------------|--------|-------|
| `nginx/` | `infra/nginx` | infra-only | Nginx configuration |
| `docker-compose.yml` | `infra/docker/` | infra-only | Docker configuration |

---

## Legacy Items to Address

### Shared Packages (Preserved in Current Location)
- `shared/` remains in place until Phase 3
- `settings/` remains in place until Phase 4

### Applications (No Physical Move in This Ticket)
- All applications stay in current locations until Phase 10-11
- No imports changed in this phase

### Root Configuration
- Current `package.json` (balloo-monorepo) remains unchanged
- `pnpm-workspace.yaml` created in Phase 2 (bootstrap-only)

---

## Legacy Design Issues

### Rounded Corners (Critical)

**Status:** Legacy usage exists throughout donor repository

**Finding:** The current donor repository contains extensive rounded corner usage in:
- Inline `borderRadius` styles in JSX/TSX
- Tailwind `rounded-*` classes (rounded-lg, rounded-full, rounded-xl, etc.)
- CSS `border-radius` properties (50%, 0.5rem, 0.75rem, 1rem, 2rem, etc.)

**Contract Violation:** All rounded corners must be eliminated as per DesignContract.md:
- `border-radius: 0` is mandatory across all platform UI
- Any `rounded*` utility classes are forbidden
- Legacy rounded usage in donor is a known migration defect

**Action Required:** See `workdocs/legacy-audit/ROUNDING_VIOLATIONS.md` for complete audit.

---

## Transition Notes

1. **No imports changed** - Existing imports in messenger, admin-portal, api remain untouched
2. **No physical moves** - Applications stay in current locations until Phase 10-11
3. **No build changes** - Existing scripts and builds are preserved
4. **Scaffold only** - This phase creates the target structure without breaking current functionality
5. **Workspace bootstrap** - pnpm-workspace.yaml created but does not force migration

---

## Next Steps

See `MIGRATION_ROADMAP.md` for detailed phase breakdown.
