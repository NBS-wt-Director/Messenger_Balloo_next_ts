# Migration Repo Map

## Current State (Donor Repository)

This document maps the current repository structure to the target monorepo architecture.

### Current Applications → Future Applications

| Current Path | Future Path | Status | Notes |
|--------------|-------------|--------|-------|
| `messenger/` | `apps/web-main` | To migrate | Contains i18n, theme-store, Logo component |
| `admin-portal/` | `apps/admin` | To migrate | Uses @app-balloo/settings |
| `api/` | `apps/api` | To migrate | Backend service |

### Current Packages → Future Packages

| Current Path | Future Path | Status | Notes |
|--------------|-------------|--------|-------|
| `shared/` | `packages/core-types` | To migrate | Shared types, candidate for core-types |
| `settings/` | `packages/core-config` | To migrate | Shared settings, candidate for core-config |

## Legacy Items to Address

### Shared Packages (Preserved in Current Location)
- `shared/` remains in place until Phase 3
- `settings/` remains in place until Phase 4

### Applications (No Physical Move in This Ticket)
- `messenger/` - not physically moved, will be migrated node-by-node in Phase 11
- `admin-portal/` - not physically moved, will be migrated node-by-node in Phase 11
- `api/` - not physically moved, will be migrated node-by-node in Phase 11

### Root Configuration
- Current `package.json` (balloo-monorepo) remains unchanged
- `pnpm-workspace.yaml` will be created in Phase 2 (workspace setup)

## Legacy Design Issues

### Rounded Corners (Critical)
**Status:** Legacy usage exists in donor repository

**Finding:** The current donor repository contains rounded corner usage in various UI components. These are considered migration defects and must be removed in future phases.

**Contract Violation:** All rounded corners must be eliminated as per DesignContract.md:
- `border-radius: 0` is mandatory across all platform UI
- Any `rounded*` utility classes are forbidden
- Legacy rounded usage in donor is a known issue to be fixed

**Action Required:** Later migration tickets must identify and remove all rounded corner instances.

## Transition Notes

1. **No imports changed** - Existing imports in messenger, admin-portal, api remain untouched
2. **No physical moves** - Applications stay in current locations until Phase 11
3. **No build changes** - Existing scripts and builds are preserved
4. **Scaffold only** - This phase creates the target structure without breaking current functionality

## Next Steps

See `MIGRATION_ROADMAP.md` for detailed phase breakdown.
