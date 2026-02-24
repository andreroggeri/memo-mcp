# Tasks: Helm Chart Deployment and Automation

**Input**: Design documents from `/specs/005-helm-chart-deployment/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No explicit request for TDD or automated Helm tests was made in the spec, but basic validation tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create the `charts/` directory at the repository root
- [x] T002 [P] Configure `.helmignore` in `charts/memo-mcp/.helmignore`
- [x] T003 [P] Update `.gitignore` to ignore Helm chart development artifacts (e.g., `.tgz` files)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Initialize basic Helm chart structure using `helm create charts/memo-mcp`
- [x] T005 Cleanup default `charts/memo-mcp/templates/` to remove boilerplate not needed for this project (keep `_helpers.tpl`)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Deploying MCP Server to Kubernetes (Priority: P1) 🎯 MVP

**Goal**: Provide a working Helm chart that deploys the MCP server with SSE transport.

**Independent Test**: Run `helm install memo-mcp ./charts/memo-mcp` on a local cluster and verify the pod starts and the service is created.

### Implementation for User Story 1

- [x] T006 [P] [US1] Define chart metadata in `charts/memo-mcp/Chart.yaml`
- [x] T007 [P] [US1] Implement default values in `charts/memo-mcp/values.yaml` (including `memo.server_url` and `memo.api_key`)
- [x] T008 [P] [US1] Implement Kubernetes Deployment template in `charts/memo-mcp/templates/deployment.yaml`
- [x] T009 [P] [US1] Implement Kubernetes Service template in `charts/memo-mcp/templates/service.yaml`
- [x] T010 [US1] Configure container command, environment (including `MEMO_SERVER_URL` and `MEMO_API_KEY`), and transport in `charts/memo-mcp/templates/deployment.yaml`
- [x] T011 [US1] Add basic resource limits and health probes (Liveness/Readiness) in `charts/memo-mcp/templates/deployment.yaml`
- [x] T012 [US1] Run `helm lint charts/memo-mcp` to verify template correctness

**Checkpoint**: At this point, User Story 1 is fully functional and can be deployed manually.

---

## Phase 4: User Story 2 - Automated Chart Releasing (Priority: P2)

**Goal**: Automatically package and release the Helm chart to GitHub Pages on tag push.

**Independent Test**: Push a test tag and verify the `release-charts` workflow succeeds and updates the chart repository.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create GitHub Actions workflow file in `.github/workflows/release-charts.yml`
- [x] T014 [US2] Configure `helm/chart-releaser-action` in the workflow to target the `gh-pages` branch
- [x] T015 [US2] Set up workflow triggers for new tags and pushes to the main branch
- [x] T016 [US2] Ensure the workflow has `contents: write` permissions for GitHub Pages updates
- [x] T017 [US2] Document the chart repository URL in `README.md` and `quickstart.md`

**Checkpoint**: At this point, automated releases are configured and ready for the next project version.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 [P] Update `README.md` with Helm installation instructions
- [x] T019 Final validation of `charts/memo-mcp/values.yaml` against `contracts/values-schema.json`
- [x] T020 Run `quickstart.md` validation on a local Kubernetes cluster (e.g., Kind)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (requires a valid chart to release).
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- T001, T002, T003 can run in parallel.
- T006, T007, T008, T009 can run in parallel once T005 is done.
- T013 can be drafted in parallel with US1 implementation.

---

## Parallel Example: User Story 1

```bash
# Define chart structure and values in parallel:
Task: "Define chart metadata in charts/memo-mcp/Chart.yaml"
Task: "Implement default values in charts/memo-mcp/values.yaml"
Task: "Implement Kubernetes Deployment template in charts/memo-mcp/templates/deployment.yaml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and 2.
2. Complete User Story 1 (Phase 3).
3. **VALIDATE**: Manually deploy to a local cluster and verify SSE connectivity.

### Incremental Delivery

1. Deliver US1 → Users can now deploy to K8s manually.
2. Deliver US2 → Users can now consume the chart via a standard Helm repo.
3. Polish → Instructions and final cleanup.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Verify `helm lint` passes before finalizing any chart changes.
