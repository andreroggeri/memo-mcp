# Feature Specification: Real Memo Integration Tests via Testcontainers

**Feature Branch**: `003-integration-tests`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: User description: "I want to run a real memo instance so we can do integration testing to ensure the tools actually work. For this initial implementation just update the existing unit tests to be an integration test the actually call the real instance (This should be spun up using testcontainers)"

## Clarifications

### Session 2026-02-20
- Q: Should unit tests be replaced or mirrored as integration tests? → A: Update the existing unit tests to run as integration tests against a real Memo instance.
- Q: How should the real Memo instance be provisioned? → A: Use Testcontainers to spin up a real Memo instance for tests.
- Q: Scope of initial implementation? → A: Only update tests; no production code changes required unless needed to support integration configuration.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Real Instance Validation (Priority: P1)

As a developer, I want integration tests that hit a real Memo instance so that I can verify the client and tools work end-to-end.

**Why this priority**: The current tests mock axios and do not verify actual server behavior. Real instance tests reduce regressions from API changes and request/response mapping errors.

**Independent Test**: Run the test suite and confirm it brings up a Memo instance via Testcontainers, exercises core API operations, and cleans up containers afterward.

**Acceptance Scenarios**:

1. **Given** a Memo container is running, **When** the integration tests execute `ListMemos`, **Then** the response should be parsed into expected memo objects.
2. **Given** a Memo container is running, **When** the integration tests execute `CreateMemo`, **Then** the created memo should be retrievable with expected content.
3. **Given** a Memo container is running, **When** the integration tests execute `UpdateMemo` and `DeleteMemo`, **Then** the server should reflect those changes.

---

### User Story 2 - Error Handling Against Real Server (Priority: P2)

As a developer, I want integration tests that validate error handling against a real server so that failures are reported consistently through `MemoApiError`.

**Why this priority**: Error translation can diverge from actual server responses. Testing against a real server ensures the adapter and error mapping remain correct.

**Independent Test**: Force an error (e.g., missing memo ID) and validate the resulting `MemoApiError` fields.

**Acceptance Scenarios**:

1. **Given** an invalid memo ID, **When** `GetMemo` is called, **Then** `MemoApiError` should include the HTTP status and API error code.

---

### Edge Cases

- **Container startup latency**: Tests must wait for the Memo server to be ready before issuing requests.
- **Authentication bootstrapping**: The tests must establish a valid auth token or use a configured default user for API access.
- **Cleanup**: Containers and any temporary data should be cleaned up after tests run.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The test suite MUST start a real Memo instance using Testcontainers.
- **FR-002**: Existing unit tests for the client MUST be converted to integration tests against the real instance.
- **FR-003**: Tests MUST cover `ListMemos`, `CreateMemo`, `UpdateMemo`, and `DeleteMemo` against the real server.
- **FR-004**: Tests MUST validate `MemoApiError` behavior against real server errors.
- **FR-005**: The tests MUST perform container lifecycle management (start, wait for readiness, stop).

### Key Entities *(include if feature involves data)*

- **Memo Container**: The Testcontainers-managed instance of Memo server.
- **Integration Tests**: The updated tests that call the real server.
- **Auth Token**: Credentials used to call the Memo API.

## Assumptions & Dependencies

- **Dependency**: Testcontainers for Node.js is available or will be added as a dev dependency.
- **Dependency**: A Memo Docker image is available and can be run locally.
- **Assumption**: The Memo API v1 endpoints behave consistently with current client expectations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Running `npm test` or `pnpm test` (project standard) brings up a Memo container and executes integration tests without external manual steps.
- **SC-002**: The integration test suite fails if the server is unavailable or responses deviate from expected structures.
- **SC-003**: All existing client tests are now real-instance integration tests and still pass on a clean environment.
