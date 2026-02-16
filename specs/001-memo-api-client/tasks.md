# Tasks: Memo API Client Protobuf Generation

**Feature**: Memo API Client Protobuf Generation
**Plan**: [specs/001-memo-api-client/plan.md](plan.md)

## Implementation Strategy

We will follow an incremental approach:
1.  **Phase 1 & 2**: Setup the project structure and install the necessary Protobuf tooling.
2.  **Phase 3 (US1)**: Implement the core client generation. This is our MVP.
3.  **Phase 4 (US2)**: Automate the fetching and generation process.
4.  **Phase 5 (US3)**: Ensure robust error handling within the generated client.
5.  **Phase 6**: Final verification and cleanup.

## Phase 1: Setup

Goal: Initialize project structure and dependencies.

- [x] T001 Create `proto/api/v1/` directory for upstream Protobuf files
- [x] T002 Create `src/gen/` directory for generated TypeScript artifacts
- [x] T003 Create `scripts/` directory for fetch and generation scripts
- [x] T004 [P] Install `ts-proto` and `protoc-gen-ts` as dev dependencies in `package.json`
- [x] T005 [P] Install `axios` (if not already present) for transport layer in `package.json`

## Phase 2: Foundational

Goal: Establish the base scripts and tools needed for all stories.

- [x] T006 Implement Protobuf fetch script `scripts/fetch-protos.sh` using `curl`
- [x] T007 Implement client generation script `scripts/generate-client.sh` using `ts-proto`
- [x] T008 Add `gen:api` and `fetch:protos` scripts to `package.json`

## Phase 3: User Story 1 - Type-safe API Interactions (MVP)

Goal: Generate a working, type-safe TypeScript client from `memo_service.proto`.

**Independent Test**: Successfully run `npm run gen:api`, import the generated `MemoServiceClientImpl` in a test file, and verify it has the correct methods (e.g., `ListMemos`).

- [x] T009 [US1] Fetch `memo_service.proto` and its dependencies from GitHub using `scripts/fetch-protos.sh`
- [x] T010 [US1] Run `scripts/generate-client.sh` to produce TypeScript artifacts in `src/gen/api/v1/`
- [x] T011 [US1] Implement a reusable `Rpc` adapter in `src/memo-api-client.ts` that uses `axios` to talk to gRPC-gateway
- [x] T012 [US1] Instantiate `MemoServiceClientImpl` using the custom `Rpc` adapter and verify it works in `tests/unit/client-generation.test.ts`

## Phase 4: User Story 2 - Automated Client Updates

Goal: Ensure the client can be easily updated when upstream changes occur.

**Independent Test**: Modify a local `.proto` file, run `npm run gen:api`, and verify the changes are reflected in `src/gen/`.

- [x] T013 [US2] Update `scripts/generate-client.sh` to include a clean-up step for `src/gen/` before generation
- [x] T014 [US2] Verify that `scripts/fetch-protos.sh` correctly overwrites existing files in `proto/api/v1/`

## Phase 5: User Story 3 - Standardized Error Handling

Goal: Ensure the generated client handles Memos API errors according to the Protobuf definitions.

**Independent Test**: Mock a 404/500 response from the API and verify the client returns a structured error object.

- [x] T015 [US3] Configure `ts-proto` options in `scripts/generate-client.sh` to ensure optimal error object generation
- [x] T016 [US3] Add error handling tests to `tests/unit/client-generation.test.ts` to verify structured error parsing

## Phase 6: Polish & Cross-cutting concerns

- [x] T017 Update `README.md` with instructions from `specs/001-memo-api-client/quickstart.md`
- [x] T018 Ensure all generated files in `src/gen/` are ignored by linting if necessary in `.eslintignore`
- [x] T019 Run a final `npm run build` to ensure the generated client integrates without type errors

## Dependencies

- US1 is the foundation and must be completed first.
- US2 and US3 depend on the successful generation established in US1.

## Parallel Execution Examples

- T004 and T005 (Dependency installation) can run in parallel.
- T011 and T012 can run in parallel once T010 is complete.
