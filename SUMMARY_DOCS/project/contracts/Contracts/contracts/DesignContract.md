# DesignContract

## Purpose

This contract defines the mandatory design rules for all platform UI across the Balloo ecosystem.

## Source of Truth

- `packages/core-brand` - Brand assets, logo, colors
- `packages/core-theme` - Theme system, preset themes
- `packages/core-ui` - Shared UI components

## Must Rules

### 1. No Rounded Corners (Critical)

**border-radius must be 0 everywhere across all platform UI.**

- **rounded corners are forbidden everywhere**
- **Any `rounded*` utility classes are forbidden**
- **Circles via `border-radius: 50%` are forbidden**
- All containers, buttons, inputs, cards must have sharp corners (border-radius: 0)
- Legacy rounded usage in donor repository is a known migration defect
- Any found rounded corners must be treated as migration defects to be fixed

### 2. Visual Identity

- **Logo**: Must use the shared logo from `packages/core-brand`
- **Color Palette**: Must use colors defined in `packages/core-theme`
- **Typography**: Must use platform-wide typography settings

### 3. Theme System

#### Platform Preset Themes (Current Stage)
- `dark` - Dark theme
- `light` - Light theme
- `russia` - Russia flag theme

#### Custom Themes
- **Allowed only in user-facing apps**: web-main, mobile, desktop
- **Forbidden in admin/system nodes**: admin, api, infra without separate contract

## Should Rules

- All components must support all preset themes
- All components must be available on all platform languages

## Must Not Rules

- **Must NOT use any border-radius > 0**
- **Must NOT use rounded* utility classes**
- **Must NOT use border-radius: 50% for circles**
- **Must NOT create custom themes in admin/system nodes**
- **Must NOT deviate from platform color palette**

## Machine-Binding Notes

Future machine-readable binding:
- CSS variables from `packages/core-theme` must be enforced
- Linting rules will forbid border-radius > 0
- Build-time validation against this contract

## Legacy Issues

**Donor Repository Status:**
The current donor repository contains legacy rounded corner usage in various UI components. These are known migration defects that must be identified and removed in Phase 12.

**Audit Location:** `workdocs/legacy-audit/ROUNDING_VIOLATIONS.md`

## Version

- **Contract Version**: 2.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active
