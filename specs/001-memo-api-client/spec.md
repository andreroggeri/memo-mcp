# Feature Specification: Memo API Client Protobuf Generation

**Feature Branch**: `001-memo-api-client`  
**Created**: 2026-02-16  
**Status**: Draft  
**Input**: User description: "memo api client should be generated from the protobuf (see proto files/doc here: https://github.com/usememos/memos/tree/main/proto/api/v1)"

## Clarifications

### Session 2026-02-16
- Q: How should the system access the upstream Memos .proto files? → A: Option A (Remote Download) with manual script execution.
- Q: Which protocol should the transport layer use? → A: Option A (REST/JSON via HTTP).
- Q: Where should the generated client code reside? → A: Option A (src/gen/).
- Q: How should the generated client handle authentication? → A: Option A (Constructor Config).
- Q: Which specific tooling should be used for generation? → A: Option A (ts-proto).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Type-safe API Interactions (Priority: P1)

As a developer, I want to use a generated client that matches the Memos API Protobuf definitions exactly, so that I can interact with the server using type-safe methods and models without manual coding errors.

**Why this priority**: This is the core value proposition. Without a type-safe client, the MCP remains prone to runtime errors due to schema mismatches.

**Independent Test**: Can be tested by attempting to call a Memos API service method (e.g., `GetMemo`) using the generated client and verifying that the request/response objects match the Protobuf definition.

**Acceptance Scenarios**:

1. **Given** a generated client, **When** a developer calls a service method, **Then** the request parameters must match the Protobuf message fields.
2. **Given** a response from the Memos server, **When** the generated client receives it, **Then** the response must be parsed into the corresponding Protobuf message type correctly.

---

### User Story 2 - Automated Client Updates (Priority: P2)

As a maintainer, I want to be able to regenerate the API client whenever the upstream Memos Protobuf definitions change, so that the MCP stays in sync with the latest API features.

**Why this priority**: Ensures long-term maintainability and easy updates as the Memos project evolves.

**Independent Test**: Can be tested by updating a local copy of a proto file and running the generation script, verifying that the generated client reflects the changes.

**Acceptance Scenarios**:

1. **Given** a change in the upstream `.proto` files, **When** the generation command is executed, **Then** the generated client code must be updated to include new fields or services.

---

### User Story 3 - Standardized Error Handling (Priority: P3)

As a developer, I want the generated client to use standard error structures defined in the Protobuf files, so that I can handle API errors consistently across different services.

**Why this priority**: Improves developer experience and reliability of error handling logic.

**Independent Test**: Can be tested by inducing a server-side error and verifying that the client returns an error object that preserves the Protobuf error details.

**Acceptance Scenarios**:

1. **Given** an API error response, **When** processed by the generated client, **Then** the resulting error object must provide access to the status codes and messages defined in the API contract.

---

### Edge Cases

- **What happens when the Protobuf definitions contain circular dependencies?** The generator must handle or flag these to prevent infinite loops in generated types.
- **How does the system handle missing optional fields in the Protobuf messages?** The generated client should provide clear patterns for identifying present vs. absent optional fields.
- **What happens if the upstream repository structure for proto files changes?** The generation process should be configurable to point to new locations.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST generate a client directly from the Memos API v1 `memo_service.proto` file and its dependencies from the specified repository.
- **FR-002**: The generated client MUST include all services defined in `api/v1/memo_service.proto`.
- **FR-003**: The generated client MUST include all message definitions (models) used by the memo service.
- **FR-004**: The generation process MUST be repeatable through a single command or script.
- **FR-005**: The generated client MUST support asynchronous/Promise-based interactions for all service methods.
- **FR-006**: The system MUST use the generated client implementation classes (e.g., `MemoServiceClientImpl`) instead of manually reimplementing service methods (like `ListMemos`, `CreateMemo`).
- **FR-007**: The generated client MUST be implemented in TypeScript, matching the project's primary language.
- **FR-008**: The generated code MUST be placed in a dedicated `src/gen/` directory to separate it from manually written logic.
- **FR-009**: The system MUST implement a reusable `Rpc` interface (or similar transport adapter) that handles the network communication (e.g., via `axios` or `fetch`) and authentication.
- **FR-010**: The system MUST use `ts-proto` as the primary generation tool to ensure idiomatic TypeScript output.

### Key Entities *(include if feature involves data)*

- **Proto Definition**: The source `.proto` files defining the API contract.
- **Generated Client**: The resulting code artifact providing service interfaces and data models.
- **Service**: A gRPC/Protobuf service definition (e.g., `MemoService`).
- **Message**: A Protobuf data structure definition (e.g., `Memo`).

## Assumptions & Dependencies

- **Dependency**: Access to the upstream `usememos/memos` repository is required for fetching `.proto` files.
- **Assumption**: The Memos API v1 is stable enough for client generation.
- **Assumption**: The project environment has the necessary tools for Protobuf code generation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the services defined in Memos API v1 are represented in the generated client.
- **SC-002**: The generated client compiles without errors and passes basic type-check validation.
- **SC-003**: A developer can perform a "Create Memo" operation using only the generated client types and methods.
- **SC-004**: The time required to regenerate the client from scratch is less than 30 seconds.
