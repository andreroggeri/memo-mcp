# Feature Specification: Make the MCP server production-ready with Docker and CI/CD

**Feature Branch**: `004-mcp-production-ready`  
**Created**: Friday, February 20, 2026  
**Status**: Draft  
**Input**: User description: "we must make this mcp production ready. It should: 1. Produce a Docker image that it's ready to be consumed (Access token & memo server url should be provided through an environment variable) 2. Every push to the main branch should automatically build it and push to github registry (It should automatically handle versioning, starting from 0.0.0) -- It should also run the tests & lint before this docker stage)"

## Clarifications

### Session 2026-02-20

- Q: For the CI pipeline to run tests, how should credentials be provided? → A: CI tests will spin up the container using **testcontainers**, so no external credentials are required for the test stage.
- Q: Should the container run as a non-root user for production security? → A: Yes, the image MUST be configured to run as a **non-root user** by default.
- Q: Which Node.js version should be used for the production image? → A: **Node.js 22 LTS**.
- Q: Should the CI/CD pipeline support multi-platform builds (ARM64/AMD64)? → A: Yes, images MUST be built and pushed for both **linux/amd64** and **linux/arm64** architectures.
- Q: Should the `latest` tag be updated on every successful build? → A: Yes, every successful build and push MUST update the **latest** tag in the registry.
- Q: Which linting tools should be used in CI? → A: Use **eslint** for code linting and **hadolint** for Dockerfile linting.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Deploying the MCP Server via Containers (Priority: P1)

As a user of the MCP server, I want to be able to pull a pre-built container image and run it with my credentials so that I can quickly integrate it into my workflow without building from source.

**Why this priority**: Essential for the "production-ready" goal. Containers are the standard way to package and distribute modern services, ensuring environment parity.

**Independent Test**: Can be fully tested by pulling the image and running it with environment variables to see if it starts and responds correctly.

**Acceptance Scenarios**:

1. **Given** a container-ready environment, **When** I run the server image with `MEMO_ACCESS_TOKEN` and `MEMO_SERVER_URL`, **Then** the server starts successfully and is ready to accept connections.
2. **Given** a running container, **When** I connect via an MCP client, **Then** I can perform searches and other actions defined in the server.

---

### User Story 2 - Automated Continuous Integration and Delivery (Priority: P2)

As a developer on the project, I want every change merged into the primary branch to be automatically tested, linted, and published as a new versioned image so that the latest stable version is always available.

**Why this priority**: Automates the release process, ensuring consistency and preventing manual errors in the distribution chain.

**Independent Test**: Can be tested by pushing a change to the primary branch and verifying that the CI/CD pipeline runs tests, lints the code, and pushes a new image to the registry.

**Acceptance Scenarios**:

1. **Given** a new commit on the primary branch, **When** the CI pipeline starts, **Then** tests and linting must pass before the build stage can proceed.
2. **Given** passing tests and linting, **When** the CD pipeline runs, **Then** a new image is pushed to the secure registry with an incremented version number.

---

### User Story 3 - Automatic Versioning (Priority: P3)

As a consumer of the image, I want to be able to pull specific versions (e.g., `v0.0.1`) so that my deployments are predictable and I can roll back if needed.

**Why this priority**: Versioning is crucial for production stability and tracking changes over time.

**Independent Test**: Can be tested by verifying that consecutive pushes result in unique, incrementing tags in the registry.

**Acceptance Scenarios**:

1. **Given** the first successful build, **When** the image is pushed, **Then** it is tagged with `0.0.0`.
2. **Given** subsequent successful builds, **When** the image is pushed, **Then** the version number increments based on semantic versioning rules determined by **Conventional Commits** patterns (e.g., `feat:` for minor, `fix:` for patch).

### Edge Cases

- **CI Failure**: What happens if the tests or linting fail during the CI stage? (The build/push MUST be aborted).
- **Missing Configuration**: How does the system handle missing environment variables at runtime? (The server should fail gracefully with a clear error message).
- **Registry Unavailability**: What if the secure registry is temporarily unavailable? (The pipeline should retry or fail with a notification).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a container definition optimized for production use, including **running as a non-root user** and using **Node.js 22 LTS** for enhanced security and stability.
- **FR-002**: System MUST use environment variables for `MEMO_ACCESS_TOKEN` and `MEMO_SERVER_URL`.
- **FR-003**: CI pipeline MUST run tests and linting on every push to the primary branch.
  - Tests MUST be executed using **testcontainers**.
  - Linting MUST include **eslint** for application code and **hadolint** for Dockerfile validation.
- **FR-004**: CD pipeline MUST build and push a container image ONLY if all CI steps pass.
- **FR-005**: System MUST automatically manage versioning starting from `0.0.0` and update the **latest** tag in the registry on every push.
- **FR-006**: System MUST push images for both **linux/amd64 and linux/arm64** to a secure central container registry.
- **FR-007**: System MUST support both **stdio** and **Streamable HTTP** (remote) transports, configurable via environment variables.

### Key Entities _(include if feature involves data)_

- **Container Image**: The packaged application container.
- **Version Tag**: Semantic version identifier (e.g., `0.0.1`).
- **CI/CD Pipeline**: The automated workflow for building and deploying the application.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A container image is successfully pushed to the registry within 5 minutes of a merge to the primary branch.
- **SC-002**: 100% of production images have passed linting and unit tests prior to creation.
- **SC-003**: Users can start the MCP server using a single startup command with the required environment variables.
