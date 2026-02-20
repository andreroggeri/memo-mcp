# Tasks: 002-mcp-search-memos

**Input**: Design documents from `/specs/002-mcp-search-memos/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/search_memos.json

**Tests**: Tests are included as per the implementation plan and project conventions (Vitest).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure: `src/tools/`, `src/types/`, `tests/unit/`
- [X] T002 [P] Verify `package.json` dependencies and `tsconfig.json` for ESM compatibility

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create shared types for Memos in `src/types/memo.ts` based on data-model.md
- [X] T004 Initialize MCP Server with stdio transport in `src/index.ts`
- [X] T005 Setup basic error handling and logging for the MCP server in `src/index.ts`

**Checkpoint**: Foundation ready - MCP server can start and stop correctly.

---

## Phase 3: User Story 1 - MCP Client connects to Server (Priority: P1) 🎯 MVP

**Goal**: As a developer, I want to connect to the memo MCP server so that I can see the available tools.

**Independent Test**: Start the server and verify it responds to `listTools` with the "search_memos" tool definition.

### Tests for User Story 1

- [X] T006 [P] [US1] Create tool listing test in `tests/unit/tools.test.ts`

### Implementation for User Story 1

- [X] T007 [US1] Register "search_memos" tool in `src/index.ts` using schema from `specs/002-mcp-search-memos/contracts/search_memos.json`

**Checkpoint**: User Story 1 complete - Tool is visible to clients.

---

## Phase 4: User Story 2 - Search Memos with Dummy Data (Priority: P2)

**Goal**: As an MCP client user, I want to search for memos and receive dummy results for integration verification.

**Independent Test**: Call the "search_memos" tool and verify it returns the hardcoded dummy memos.

### Tests for User Story 2

- [X] T008 [P] [US2] Create unit test for `search_memos` tool handler in `tests/unit/tools.test.ts` (Include "empty query" case)

### Implementation for User Story 2

- [X] T009 [P] [US2] Define dummy memo data constant in `src/tools/search_memos.ts`
- [X] T010 [US2] Implement `search_memos` tool handler logic in `src/tools/search_memos.ts`
- [X] T011 [US2] Connect the tool handler to the MCP server in `src/index.ts`

**Checkpoint**: User Story 2 complete - Tool returns functional dummy data.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T012 Run `npm run build` to verify type safety
- [X] T013 [P] Verify `quickstart.md` instructions against the final implementation
- [X] T014 [P] Ensure all exports in `src/index.ts` follow project conventions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - US1 (P1) should be completed first as the MVP.
  - US2 (P2) depends on US1's tool registration but can be developed in parallel if stubs are used.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Fundamental - ensures communication works.
- **User Story 2 (P2)**: Functional - adds the actual dummy search logic.

### Parallel Opportunities

- T002 can run in parallel with T001.
- T006 [US1] and T008 [US2] tests can be drafted in parallel.
- T009 [US2] can be done in parallel with US1 implementation.

---

## Parallel Example: User Story 2

```bash
# Define data and write tests at the same time:
Task: "Define dummy memo data constant in src/tools/search_memos.ts"
Task: "Create unit test for search_memos tool handler in tests/unit/tools.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. **VALIDATE**: Use MCP Inspector to verify "search_memos" is listed.

### Incremental Delivery

1. Foundation ready (Phase 2).
2. Tool discovery works (Phase 3).
3. Tool execution works with dummy data (Phase 4).
4. Final cleanup (Phase 5).
