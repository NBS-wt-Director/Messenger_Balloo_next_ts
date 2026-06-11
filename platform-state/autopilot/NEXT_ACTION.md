# Next Action

## Current Focus

**Phase 8: Shared UI → Core-UI**

Core-UI package created with Modal, Alert, Button, Card components. DesignContract enforced (border-radius: 0).

---

## Next Executable Task

### Task: Wire Messenger to Core-UI

**Priority**: High  
**Estimated Effort**: 1-2 hours  
**Risk Level**: Low

#### Acceptance Criteria

1. [ ] messenger components import from @balloo/core-ui
2. [ ] Legacy UI components removed from messenger/src/components/ui/
3. [ ] TypeScript validation passes (no errors)
4. [ ] Phase 8 marked complete in MIGRATION_ROADMAP.md
5. [ ] STATE.json updated

#### Implementation Steps

1. **Update Imports**
   - Find all imports from messenger/src/components/ui/
   - Replace with @balloo/core-ui imports
   - Test each component

2. **Remove Legacy**
   - Delete messenger/src/components/ui/Modal.tsx
   - Delete messenger/src/components/ui/Alert.tsx
   - Keep Logo.tsx (already migrated to core-brand)
   - Keep BurgerMenu.tsx, Confirm.tsx (messenger-specific)

3. **Validation**
   - Run `npx tsc --noEmit` in messenger
   - Fix any type errors
   - Verify components render correctly

4. **Documentation**
   - Update UI_MIGRATION.md
   - Mark Phase 8 complete

---

## Rollback Notes

If rollback needed:
1. Remove @balloo/core-ui from messenger/package.json
2. Restore legacy UI components
3. Revert imports
4. Update STATE.json

---

## Dependencies

- Phase 1 (Scaffold): ✅ Done
- Phase 6 (Theme): ✅ Done
- Phase 7 (Brand): ✅ Done
- Phase 8 (UI): 🔄 In Progress (package created, wiring pending)

---

## Related Documents

- [MIGRATION_ROADMAP.md](../../MIGRATION_ROADMAP.md) - Phase 8 details
- [DesignContract.md](../../workdocs/contracts/DesignContract.md) - Design system contract
- [UI_MIGRATION.md](../../workdocs/migrations/UI_MIGRATION.md) - Migration report
- [@balloo/core-ui README](../../packages/core-ui/README.md) - Package docs

---

*Generated: 2026-06-11*  
*Autopilot Mode: Active*
