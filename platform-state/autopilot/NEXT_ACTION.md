# Next Action

## Current Focus

**Phase 9: Docs Split - Complete**  
**Phase 10: Node Apps Normalization - Next**

Core packages (types, config, i18n, theme, brand, UI) all complete. Docs split complete with Next.js docs site scaffolded.

---

## Next Executable Task

### Task: Complete Phase 10 - Update api/, admin-api/, notifications/

**Priority**: High  
**Estimated Effort**: 1-2 hours  
**Risk Level**: Low

#### Acceptance Criteria

1. [ ] api/ uses @balloo/tsconfig/base.json
2. [ ] api/ uses @balloo/eslint-config
3. [ ] api/ uses @balloo/prettier-config
4. [ ] admin-api/ uses shared configs
5. [ ] notifications/ uses shared configs
6. [ ] TypeScript validation passes
7. [ ] Linting passes

#### Implementation Steps

1. **Update api/**
   - Modify tsconfig.json to extend @balloo/tsconfig/base.json
   - Create .eslintrc.js extending @balloo
   - Create .prettierrc extending @balloo
   - Standardize package.json scripts

2. **Update admin-api/**
   - Same as api/

3. **Update notifications/**
   - Same as api/

4. **Validation**
   - Run tsc --noEmit on all apps
   - Run eslint on all apps
   - Test builds

---

## Rollback Notes

If rollback needed:
1. Revert package.json changes
2. Remove shared config packages
3. Restore original configs
4. Update STATE.json

---

## Dependencies

- Phase 1 (Scaffold): ✅ Done
- Phase 2 (Repo Mapping): ✅ Done
- Phase 3 (Core-Types): ✅ Done
- Phase 4 (Core-Config): ✅ Done
- Phase 5 (Core-I18n): ✅ Done (stub)
- Phase 6 (Theme): ✅ Done
- Phase 7 (Brand): ✅ Done
- Phase 8 (UI): ✅ Done
- Phase 9 (Docs Split): ✅ Done

---

## Related Documents

- [MIGRATION_ROADMAP.md](../../MIGRATION_ROADMAP.md) - Full roadmap
- [STATE.json](./STATE.json) - Current state
- [PHASE_9_COMPLETE.md](../../workdocs/migrations/PHASE_9_COMPLETE.md) - Phase 9 report
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Full migration summary

---

*Generated: 2026-06-12*  
*Autopilot Mode: Active*
*Progress: 9/12 phases complete (75%)*
