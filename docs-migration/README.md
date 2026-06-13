# Docs Migration

Migration guides and process documentation.

## Phase 9: Docs Split

**Status:** In Progress  
**Date:** 2026-06-12

### Objective

Split `docs/` into:
- `docs-content/` - MDX content
- `docs-site/` - Next.js documentation site
- `docs-contracts/` - API contracts
- `docs-migration/` - Migration guides

### Migration Steps

1. ✅ Create directory structure
2. ⏳ Categorize existing docs
3. ⏳ Move files to appropriate locations
4. ⏳ Update internal links
5. ⏳ Create docs-site Next.js app
6. ⏳ Update references in codebase

### File Categorization

#### Core Documentation (to docs-content/)
- `README.md`
- `ARCHITECTURE.md`
- `SPECIFICATION.md`
- `TECH_STACK_AUDIT.md`
- `PROJECT_SUMMARY.md`
- `MONOREPO_DOCUMENTATION.md`

#### API Documentation (to docs-content/api/)
- `API_DOCUMENTATION.md`
- `API_EXPANSION_STRATEGY.md`
- `API_EXPANSION_SUMMARY.md`
- `API_FINAL_REPORT.md`
- `MIGRATION_TO_EXTERNAL_API.md`

#### Migration Documentation (to docs-migration/)
- `MIGRATION_GUIDE.md`
- `MIGRATION_SUMMARY.md`
- `MIGRATION_FINAL_SUMMARY.md`
- `MIGRATION_MILESTONE_1.md`
- `MIGRATION_MILESTONE_2.md`
- `MIGRATION_PROGRESS.md`
- `MIGRATION_UPDATE.md`
- `MIGRATION_TO_EXTERNAL_API.md`
- `BACKEND_MIGRATION_PLAN.md`

#### Deployment (to docs-content/deployment/)
- `DEPLOYMENT.md`
- `DOCKER_DEPLOYMENT.md`
- `SSL_SETUP.md`

#### Testing (to docs-content/testing/)
- `TESTING.md`
- `QUICK_START_TESTING.md`
- `QUICK_SETUP_2FA.md`

#### Status Reports (archive to docs-content/archive/)
- All `*_SUMMARY.md`, `*_REPORT.md`, `*_STATUS.md` files

### Next Steps

1. Create docs-site Next.js app
2. Set up MDX support
3. Create navigation structure
4. Migrate content files
5. Update internal links
