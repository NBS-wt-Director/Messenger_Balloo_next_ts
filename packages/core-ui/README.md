# Core UI

## Purpose

Shared UI components for the Balloo platform.

## Design Rules

**CRITICAL: No-Rounding Design Rule**

All UI components in this package MUST obey the no-rounding design rule:
- `border-radius: 0` everywhere
- NO `rounded*` utility classes
- NO circular elements via `border-radius: 50%`
- All containers, buttons, inputs must have sharp corners

## Migration Status

- **Phase 8**: UI extraction from messenger/
- **Current**: Stub package

## Rules

1. **DesignContract compliance**: All components obey DesignContract
2. **Theme support**: All components support all preset themes
3. **Accessibility**: All components accessible
4. **No rounding**: Strict enforcement of border-radius: 0
