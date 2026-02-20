---

description: "Task list for real Memo integration tests via Testcontainers"

---

# Tasks: Real Memo Integration Tests via Testcontainers

**Input**: Design documents from `/Users/andre/Projects/personal/memo-mcp-2/specs/003-integration-tests/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/  
**Tests**: Tests are REQUIRED by the feature spec (integration tests against a real Memo instance).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Add Testcontainers dev dependency in /Users/andre/Projects/personal/memo-mcp-2/package.json
- [X] T002 Add integration test directory scaffold in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/.gitkeep
- [X] T003 [P] Document Docker/Testcontainers requirement in /Users/andre/Projects/personal/memo-mcp-2/README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Create Memo container lifecycle helper in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/memo-container.ts
- [X] T005 Configure Vitest integration lifecycle hooks in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/memo-container.ts
- [X] T006 Define integration test config (timeouts, env, baseUrl) in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/test-config.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Real Instance Validation (Priority: P1) 🎯 MVP

**Goal**: Convert existing unit tests into real integration tests that hit a live Memo instance.

**Independent Test**: Run `npm test` and verify a Memo container starts, CRUD tests pass, and container stops.

### Tests for User Story 1

- [X] T007 [US1] Migrate client tests to integration suite in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts
- [X] T008 [US1] Implement ListMemos integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts
- [X] T009 [US1] Implement CreateMemo integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts
- [X] T010 [US1] Implement UpdateMemo integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts
- [X] T011 [US1] Implement DeleteMemo integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts
- [X] T012 [US1] Remove axios mocks and unit-only assertions in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts
- [X] T013 [US1] Deprecate or remove old unit test file in /Users/andre/Projects/personal/memo-mcp-2/tests/unit/client-generation.test.ts

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Error Handling Against Real Server (Priority: P2)

**Goal**: Validate `MemoApiError` behavior against real server error responses.

**Independent Test**: Call `GetMemo` with an invalid ID and assert a `MemoApiError` with status/code is returned.

### Tests for User Story 2

- [X] T014 [US2] Add GetMemo error scenario in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts
- [X] T015 [US2] Assert `MemoApiError` fields from real server error in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts

**Checkpoint**: User Story 2 should be independently testable

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T016 [P] Ensure quickstart references integration tests in /Users/andre/Projects/personal/memo-mcp-2/specs/003-integration-tests/quickstart.md
- [X] T017 [P] Add guidance for running tests in /Users/andre/Projects/personal/memo-mcp-2/README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - depends on US1 test scaffolding

### Parallel Opportunities

- T003 can run in parallel with other setup tasks
- T004–T006 must complete before user story tasks
- T016–T017 can run in parallel after stories are complete

---

## Parallel Example: User Story 1

```bash
Task: "Implement ListMemos integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts"
Task: "Implement CreateMemo integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts"
Task: "Implement UpdateMemo integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts"
Task: "Implement DeleteMemo integration case in /Users/andre/Projects/personal/memo-mcp-2/tests/integration/client-generation.int.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate with `npm test`

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add User Story 1 → run integration suite → validate
3. Add User Story 2 → run integration suite → validate
4. Polish & documentation updates
