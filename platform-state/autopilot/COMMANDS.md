# Autopilot Commands

## Overview

Autopilot mode provides command-driven migration workflow with two primary commands:

1. **"дальше"** (next) - Execute next migration step
2. **"проведи полный аудит"** (run full audit) - Generate full technical audit

---

## Command: "дальше" (next)

### Purpose

Automatically determine and execute the next migration or development step without manual intervention.

### Usage

```
дальше
```

Or in English:
```
next
```

### Algorithm

#### Step A: Read Context

The autopilot reads the following files to understand current state:

| File | Purpose |
|------|---------|
| `MIGRATION_ROADMAP.md` | Phase status and deliverables |
| `platform-state/autopilot/STATE.json` | Current migration state |
| `MIGRATION_REPO_MAP.md` | Repository mapping |
| `workdocs/contracts/*` | Active contracts |
| `workdocs/legacy-audit/*` | Legacy code audit |

#### Step B: Determine Next Actionable Step

Decision tree:

```
1. Is current phase in_progress?
   ├── Yes → Select next incomplete substep
   └── No → Check next phase

2. Is next phase pending?
   ├── Yes → Start next phase (update STATE.json)
   └── No → Check if phase is done

3. Is current phase blocked?
   ├── Yes → Switch to unblock task
   └── No → Continue with current phase

4. Are all migration phases done?
   ├── Yes → Switch to development/improvement tasks
   └── No → Continue migration
```

#### Step C: Execute Step

Execution checklist:

- [ ] Create/modify files as needed
- [ ] Maintain backward compatibility
- [ ] Update documentation
- [ ] Run validation (tsc --noEmit where applicable)
- [ ] Verify no breaking changes to legacy apps

#### Step D: Update State

Mandatory updates after execution:

1. **STATE.json**
   - Update `lastCompletedTicket`
   - Update `currentFocus`
   - Update `nextAction`
   - Update `metadata.lastUpdated`
   - Add to `notes` if relevant

2. **NEXT_ACTION.md**
   - Rewrite with new next task
   - Update acceptance criteria
   - Update dependencies

3. **MIGRATION_ROADMAP.md**
   - Update phase status if phase completed
   - Mark deliverables as done

4. **workdocs/migrations/*.md** (if applicable)
   - Create migration report for completed phase

#### Step E: Generate Report

Report format:

```markdown
## Выполнено

- [Task 1]
- [Task 2]

## Изменённые файлы

- file1.ts
- file2.json

## Статус фазы

Phase X: in_progress (Y% complete)

## Следующий шаг

[Next action description]
```

### Safety Checks

Before executing:

- [ ] STATE.json.blocked is empty or understood
- [ ] No contract violations
- [ ] Backward compatibility maintained
- [ ] Validation passes

---

## Command: "проведи полный аудит" (run full audit)

### Purpose

Collect comprehensive technical audit of the repository in a stable, analyzable format.

### Usage

```
проведи полный аудит
```

Or in English:
```
run full audit
```

### Output Files

Two files are created/updated:

1. **`platform-state/autopilot/LAST_AUDIT.md`** - Latest audit (overwritten each time)
2. **`workdocs/audits/FULL_AUDIT_YYYY-MM-DD.md`** - Archived audit (new file each time)

### Audit Sections

#### 1. Repo Structure

```markdown
## Repo Structure

- apps/
  - [ ] web-main (messenger)
  - [ ] admin (admin-portal)
  - [ ] api
- packages/
  - [x] core-types
  - [x] core-config
  - [x] core-i18n
  - [x] core-theme
  - [ ] core-brand
  ...
- workdocs/
  - contracts/
  - audits/
  - legacy-audit/
  - migrations/
```

#### 2. Workspace Status

- pnpm-workspace.yaml validity
- Package linkage
- Version conflicts
- Missing dependencies

#### 3. Migration Roadmap Progress

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | Scaffold | Done | 100% |
| 2 | Repo Mapping | Done | 100% |
| 3 | Core-Types | In Progress | 70% |
| ... | ... | ... | ... |

#### 4. Package Inventory

List all packages with:
- Name
- Version
- Dependencies
- Dependents
- Status (active/deprecated)

#### 5. App Status

For each app:
- Build status (pass/fail)
- Type check status (errors count)
- Last modified
- Migration status

#### 6. Contracts Status

| Contract | Status | Compliance | Violations |
|----------|--------|------------|------------|
| ThemeContract | Active | 100% | 0 |
| AutopilotContract | Active | 100% | 0 |
| ... | ... | ... | ... |

#### 7. Legacy Audit Summary

- Legacy code locations
- Migration debt estimate
- Technical debt summary
- Risk assessment

#### 8. Build/Typecheck Status

```
TypeScript Errors:
- packages/core-brand: 0 errors
- messenger: 0 errors
- admin-portal: X errors
...

Build Status:
- messenger: pass
- api: pass
...
```

#### 9. Git Status

- Current branch
- Uncommitted changes count
- Recent commits (last 5)
- Stale branches

#### 10. Blockers / Risks

| Blocker | Severity | Resolution |
|---------|----------|------------|
| [Description] | High/Medium/Low | [Steps] |

#### 11. Next Recommended Ticket

```markdown
## Next Recommended Ticket

**Ticket**: TICKET 8  
**Phase**: 7  
**Task**: Extract Logo to core-brand  
**Priority**: High  
**Effort**: 2-3 hours  
**Justification**: [Why this task next]
```

### Audit Frequency

Recommended:
- Before starting new phase
- After completing major milestone
- When encountering unexpected errors
- Weekly during active development

### Audit Retention

- LAST_AUDIT.md: Always overwritten (latest only)
- FULL_AUDIT_*.md: Keep indefinitely (historical record)

---

## Command Aliases

| Command | Aliases |
|---------|---------|
| дальше | next, continue, proceed |
| проведи полный аудит | audit, full audit, run audit |

---

## Error Handling

### If STATE.json is Missing

1. Create STATE.json with default values
2. Set currentPhase to first incomplete phase
3. Add note about auto-creation
4. Continue with command

### If Migration Roadmap is Out of Sync

1. Compare STATE.json.phaseStatus with MIGRATION_ROADMAP.md
2. Use STATE.json as source of truth
3. Update MIGRATION_ROADMAP.md to match
4. Note the correction in STATE.json.notes

### If Validation Fails

1. Do not update STATE.json
2. Report error to user
3. Suggest manual intervention
4. Add to STATE.json.blocked if blocking

---

## Examples

### Example 1: Normal Flow

```
User: дальше

[Autopilot reads context, determines next step, executes]

## Выполнено
- Создан packages/core-brand/package.json
- Создан packages/core-brand/src/index.ts

## Изменённые файлы
- packages/core-brand/package.json
- packages/core-brand/src/index.ts

## Статус фазы
Phase 7: in_progress (30% complete)

## Следующий шаг
- Создать Logo.tsx компонент
```

### Example 2: Audit Request

```
User: проведи полный аудит

[Autopilot generates audit]

Аудит сохранён в:
- platform-state/autopilot/LAST_AUDIT.md
- workdocs/audits/FULL_AUDIT_2026-06-11.md

Краткая сводка:
- Фаз: 12, завершено: 2, в процессе: 4
- Пакетов: 7
- Ошибок TypeScript: 0
- Блокеров: 0
```

---

*Document Version: 1.0.0*  
*Last Updated: 2026-06-11*
