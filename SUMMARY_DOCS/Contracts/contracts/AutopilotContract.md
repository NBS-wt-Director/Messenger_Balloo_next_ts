# Autopilot Contract

## Version
- **Version**: 1.0.0
- **Date**: 2026-06-11
- **Status**: Active

## Purpose

This contract defines the autopilot mode for the Balloo platform migration workflow. Autopilot enables command-driven migration with formal state tracking and audit capabilities.

## Commands

### Command 1: "дальше" (next)

**Purpose**: Automatically determine and execute the next migration/development step.

**Input Format**:
- Natural language command: "дальше" or "next"
- Optional context: specific phase or area focus

**Output Format**:
- Execution report with:
  - What was done
  - Files changed
  - Current phase status
  - Next step preview

**Algorithm**:

```
A. Read Context:
   - MIGRATION_ROADMAP.md
   - platform-state/autopilot/STATE.json
   - MIGRATION_REPO_MAP.md
   - workdocs/contracts/*
   - workdocs/legacy-audit/*

B. Determine Next Actionable Step:
   1. Find incomplete migration phase (lowest number)
   2. If phase already started, select next incomplete substep
   3. If phase blocked, switch to unblock task
   4. If migration phase complete, move to next phase

C. Execute Step:
   1. Create/modify files
   2. Maintain backward compatibility
   3. Update docs and roadmap
   4. Run validation (minimum ts/noEmit where applicable)

D. Update State:
   1. platform-state/autopilot/STATE.json
   2. platform-state/autopilot/NEXT_ACTION.md
   3. MIGRATION_ROADMAP.md
   4. workdocs/migrations/*.md (if applicable)

E. Generate Report:
   1. What was done
   2. Files changed
   3. Current phase status
   4. Next step preview
```

**Preconditions**:
- STATE.json exists and is valid
- MIGRATION_ROADMAP.md is accessible
- No critical blockers in STATE.json.blocked

**Postconditions**:
- STATE.json updated with new state
- NEXT_ACTION.md reflects new next step
- At least one file created or modified
- Report generated in chat

---

### Command 2: "проведи полный аудит" (run full audit)

**Purpose**: Collect full technical audit of the repository in a stable format for further analysis.

**Input Format**:
- Natural language command: "проведи полный аудит" or "run full audit"
- Optional: specific focus area (e.g., "audit packages", "audit apps")

**Output Format**:
- Markdown report saved to:
  - `platform-state/autopilot/LAST_AUDIT.md` (latest)
  - `workdocs/audits/FULL_AUDIT_YYYY-MM-DD.md` (archived)

**Required Sections**:

1. **Repo Structure**
   - Directory tree overview
   - Key directories status
   - Orphaned files detection

2. **Workspace Status**
   - pnpm-workspace.yaml validation
   - Package linkage status
   - Version conflicts

3. **Migration Roadmap Progress**
   - Phase-by-phase status
   - Completed deliverables
   - Pending items

4. **Package Inventory**
   - All packages in packages/
   - Dependencies graph
   - Circular dependencies check

5. **App Status**
   - All apps in apps/ and root
   - Build status
   - Type check status

6. **Contracts Status**
   - All contracts in workdocs/contracts/
   - Contract compliance check
   - Violations list

7. **Legacy Audit Summary**
   - Legacy code locations
   - Migration debt
   - Technical debt summary

8. **Build/Typecheck Status**
   - TypeScript errors count
   - Build failures
   - Linting issues

9. **Git Status**
   - Uncommitted changes
   - Branch info
   - Recent commits

10. **Blockers / Risks**
    - Current blockers
    - High-risk areas
    - Migration risks

11. **Next Recommended Ticket**
    - Suggested next action
    - Priority justification
    - Estimated effort

**Preconditions**:
- Repository is accessible
- Basic file system read permissions

**Postconditions**:
- LAST_AUDIT.md created/updated
- Archived audit created in workdocs/audits/
- Audit summary shown in chat

---

## State Management

### STATE.json Structure

```json
{
  "currentPhase": <number>,
  "phaseStatus": {
    "1": "done" | "in_progress" | "pending" | "blocked",
    "2": "...",
    ...
  },
  "lastCompletedTicket": "TICKET X",
  "currentFocus": "<string>",
  "nextAction": "<string>",
  "blocked": ["<reason1>", "<reason2>"],
  "notes": ["<note1>", "<note2>"]
}
```

### Update Rules

1. **Mandatory Update**: STATE.json MUST be updated after every "дальше" command
2. **Atomic Updates**: Update all fields atomically (no partial updates)
3. **History Preservation**: Keep notes array for historical context
4. **Blocker Tracking**: Any new blocker MUST be added to blocked array
5. **Phase Transition**: When phase completes, update phaseStatus and currentPhase

---

## Safety Rules

### Before Changes

1. **Read Context**: Always read relevant files before making changes
2. **Check Blockers**: Verify STATE.json.blocked is empty or understood
3. **Backward Compatibility**: Never break legacy apps without explicit migration step
4. **Validation**: Run typecheck/build where applicable

### During Changes

1. **Minimal Changes**: Change only what's necessary for the current step
2. **Documentation**: Update docs alongside code changes
3. **Contract Compliance**: Ensure changes comply with relevant contracts

### After Changes

1. **State Update**: Update STATE.json immediately
2. **Roadmap Update**: Update MIGRATION_ROADMAP.md if phase status changed
3. **Report Generation**: Generate clear report of what was done

---

## Risky Changes

### Definition

Risky changes include:
- Breaking API changes
- Removing legacy files
- Modifying core infrastructure
- Changing workspace configuration

### Requirements

For risky changes:
1. **Audit First**: Run "проведи полный аудит" before making changes
2. **Explicit Confirmation**: Get user confirmation for high-risk changes
3. **Rollback Plan**: Document rollback steps in NEXT_ACTION.md
4. **Incremental**: Make changes incrementally, not all at once

---

## File Locations

| File | Purpose |
|------|---------|
| `platform-state/autopilot/STATE.json` | Current migration state |
| `platform-state/autopilot/NEXT_ACTION.md` | Next executable action |
| `platform-state/autopilot/LAST_AUDIT.md` | Latest audit report |
| `platform-state/autopilot/COMMANDS.md` | Command documentation |
| `workdocs/contracts/AutopilotContract.md` | This contract |
| `workdocs/audits/FULL_AUDIT_YYYY-MM-DD.md` | Archived audits |

---

## Contract Violations

### Critical Violations

- Modifying STATE.json without executing corresponding action
- Skipping validation steps before changes
- Breaking legacy apps without migration step
- Not updating docs after code changes

### Reporting

Contract violations MUST be:
1. Logged in STATE.json.notes
2. Reported to user immediately
3. Fixed before continuing with next action

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-11 | Initial contract |
