# Phase 9: Docs Split

**Date:** 2026-06-12  
**Status:** In Progress  
**Phase:** 9/12

---

## Objective

Split `docs/` into:
- `docs-content/` - MDX content
- `docs-site/` - Next.js documentation site
- `docs-contracts/` - API contracts
- `docs-migration/` - Migration guides

---

## Files Created

### Directory Structure

```
docs-content/          # MDX content
docs-site/            # Next.js app
docs-contracts/       # API contracts
docs-migration/       # Migration guides
```

### docs-site Package

```
docs-site/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.mjs
├── next-env.d.ts
├── .gitignore
├── README.md
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
```

---

## Progress

### Completed
- ✅ Create directory structure
- ✅ Create docs-site Next.js app
- ✅ Configure Next.js + Tailwind + MDX
- ✅ Create basic pages (home)
- ✅ Create README files for each directory

### In Progress
- ⏳ Migrate content from docs/
- ⏳ Create navigation structure
- ⏳ Set up MDX components
- ⏳ Update internal links

### Pending
- ⏳ Deploy docs-site
- ⏳ Update codebase references
- ⏳ Archive old reports

---

## File Categorization

### To Migrate to docs-content/

#### Core Documentation
- `README.md`
- `ARCHITECTURE.md`
- `SPECIFICATION.md`
- `TECH_STACK_AUDIT.md`
- `PROJECT_SUMMARY.md`
- `MONOREPO_DOCUMENTATION.md`

#### API Documentation
- `API_DOCUMENTATION.md`
- `API_EXPANSION_STRATEGY.md`
- `API_EXPANSION_SUMMARY.md`
- `MIGRATION_TO_EXTERNAL_API.md`

#### Migration Documentation
- `MIGRATION_GUIDE.md`
- `MIGRATION_SUMMARY.md`
- `MIGRATION_FINAL_SUMMARY.md`
- `MIGRATION_MILESTONE_1.md`
- `MIGRATION_MILESTONE_2.md`
- `MIGRATION_PROGRESS.md`
- `BACKEND_MIGRATION_PLAN.md`

#### Deployment
- `DEPLOYMENT.md`
- `DOCKER_DEPLOYMENT.md`
- `SSL_SETUP.md`

#### Testing
- `TESTING.md`
- `QUICK_START_TESTING.md`
- `QUICK_SETUP_2FA.md`

#### Archive (Status Reports)
- All `*_SUMMARY.md`, `*_REPORT.md`, `*_STATUS.md` files

---

## Next Steps

1. Create MDX components for documentation
2. Set up navigation sidebar
3. Copy core documentation to docs-content/
4. Create archive folder for status reports
5. Update internal links
6. Test docs-site build

---

## Acceptance Criteria

1. [ ] docs-site builds successfully
2. [ ] All documentation accessible
3. [ ] Navigation working
4. [ ] Search functional (optional)
5. [ ] Mobile responsive
6. [ ] Internal links updated

---

## Rollback

If rollback needed:
1. Remove docs-content/, docs-site/, docs-contracts/, docs-migration/
2. Restore original docs/ structure
3. Update STATE.json

---

*Phase 9 started: 2026-06-12*
