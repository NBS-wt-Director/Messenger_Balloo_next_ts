# ThemeContract

## Purpose

This contract defines the mandatory theme system for the Balloo platform, including platform preset themes and rules for custom themes.

## Source of Truth

- **Platform preset themes**: `packages/core-theme/src/index.ts`
- **Current implementation**: `messenger/src/stores/settings-store.ts` (to be migrated)

## Platform Preset Themes (Current Stage)

**Exactly 3 preset themes are defined at the platform level:**

1. `dark` - Dark theme
2. `light` - Light theme
3. `russia` - Russia flag theme

## Must Rules

1. **Platform Presets**: All nodes MUST support the 3 platform preset themes
2. **Source of Truth**: `packages/core-theme` is the single source for preset themes
3. **Custom Themes**: Custom themes are **user-app-only**

## Should Rules

- Custom themes should be saved only after 2 days of usage
- Custom themes should be available without registration

## Must Not Rules

- **Must NOT create custom themes in admin/system nodes** (admin, api, docs-site, abaut, nodes-switcher)
- **Must NOT deviate from the 3 platform preset themes without separate contract**

## Machine-Binding Notes

Future machine-readable binding:
- `packages/core-theme/src/index.ts` will export `PRESET_THEMES` with exactly 3 themes
- Build-time validation will enforce theme contract

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active
- **Total Presets**: 3 (dark, light, russia)
