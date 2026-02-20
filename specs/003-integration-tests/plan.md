# Implementation Plan: Real Memo Integration Tests via Testcontainers

**Branch**: `003-integration-tests` | **Date**: 2026-02-20 | **Spec**: `/Users/andre/Projects/personal/memo-mcp-2/specs/003-integration-tests/spec.md`
**Input**: Feature specification from `/Users/andre/Projects/personal/memo-mcp-2/specs/003-integration-tests/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Convert existing Memo API client unit tests into real integration tests by running a Memo server in Testcontainers, then exercising `ListMemos`, `CreateMemo`, `UpdateMemo`, `DeleteMemo`, and error handling against the live instance.

## Technical Context

**Language/Version**: TypeScript (tsc via `tsconfig.json`)  
**Primary Dependencies**: `axios`, `@modelcontextprotocol/sdk`, `zod`  
**Storage**: N/A (client library)  
**Testing**: `vitest`  
**Target Platform**: Node.js (ESM)  
**Project Type**: single (library)  
**Performance Goals**: N/A (test-only change)  
**Constraints**: Integration tests must run locally with Docker available  
**Scale/Scope**: Single test suite with one container per run

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file is a placeholder template. Per user instruction, this plan proceeds without enforced constitution gates for this PR.

Post-Phase 1 re-check: No change (constitution still unavailable).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── index.ts
└── memo-api-client.ts

tests/
├── integration/
└── unit/
```

**Structure Decision**: Single project with tests split into `tests/integration` and `tests/unit` (unit tests will be migrated to integration for this feature).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
