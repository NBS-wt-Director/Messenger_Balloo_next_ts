# Audits Directory

## Purpose

This directory contains archived audit reports for the Balloo platform migration and development.

---

## Naming Convention

Audit files follow this naming pattern:

```
FULL_AUDIT_YYYY-MM-DD.md
```

Examples:
- `FULL_AUDIT_2026-06-11.md` - First audit
- `FULL_AUDIT_2026-06-18.md` - Weekly audit
- `FULL_AUDIT_2026-07-01.md` - Milestone audit

---

## Full Audit Format

Each audit report contains these sections:

1. **Repo Structure** - Directory tree and key files
2. **Workspace Status** - pnpm workspace validation
3. **Migration Roadmap Progress** - Phase-by-phase status
4. **Package Inventory** - All packages and dependencies
5. **App Status** - Build and typecheck status per app
6. **Contracts Status** - Contract compliance check
7. **Legacy Audit Summary** - Migration debt and risks
8. **Build/Typecheck Status** - Error counts and failures
9. **Git Status** - Branch and commit info
10. **Blockers / Risks** - Current blockers and risk assessment
11. **Next Recommended Ticket** - Suggested next action

---

## Difference Between Migration Docs and Audits

### Migration Docs (`workdocs/migrations/`)

- **Purpose**: Document completed migration steps
- **Content**: What was migrated, how, why
- **Timing**: Created after migration completes
- **Example**: `THEME_MIGRATION.md` - documents Phase 6 completion

### Audits (`workdocs/audits/`)

- **Purpose**: Snapshot of entire repository state
- **Content**: Comprehensive technical analysis
- **Timing**: Created on demand (command-driven)
- **Example**: `FULL_AUDIT_2026-06-11.md` - full repo audit

### Key Differences

| Aspect | Migration Docs | Audits |
|--------|---------------|--------|
| Scope | Single migration | Entire repository |
| Timing | After completion | On demand |
| Focus | What changed | Current state |
| Audience | Developers | Stakeholders + Devs |

---

## Audit Frequency

Recommended schedule:

- **Weekly**: Every Monday (or first workday)
- **Pre-Milestone**: Before starting new phase
- **Post-Milestone**: After completing major phase
- **On-Demand**: When encountering issues

---

## Audit Retention

- **Keep**: All audits indefinitely
- **Archive**: Move to `workdocs/audits/archive/` after 1 year
- **Delete**: Never (historical record)

---

## Latest Audit

The most recent audit is always available at:

```
platform-state/autopilot/LAST_AUDIT.md
```

This file is overwritten with each new audit.

---

## Running an Audit

To generate a new audit:

```
проведи полный аудит
```

Or in English:

```
run full audit
```

This command will:
1. Analyze entire repository
2. Generate comprehensive report
3. Save to `LAST_AUDIT.md` (overwrite)
4. Save to `FULL_AUDIT_YYYY-MM-DD.md` (archive)

---

## Audit Contract

Audits follow the format defined in:

```
workdocs/contracts/AutopilotContract.md
```

Section: **Command 2: "проведи полный аудит"**

---

## Related Directories

- `workdocs/migrations/` - Migration documentation
- `workdocs/contracts/` - Formal contracts
- `workdocs/legacy-audit/` - Legacy code analysis
- `platform-state/autopilot/` - Autopilot state files

---

*Directory Created: 2026-06-11*  
*Autopilot Mode: Active*
