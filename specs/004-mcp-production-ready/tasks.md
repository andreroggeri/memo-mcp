# Tasks: Make the MCP server production-ready with Docker and CI/CD

**Feature Name**: Make the MCP server production-ready with Docker and CI/CD
**Plan**: [plan.md](./plan.md)
**Strategy**: Implement a secure, multi-stage Docker image followed by an automated GitHub Actions pipeline for testing, linting, and semantic versioning. Deliver US1 (Containerization) as the MVP.

## Phase 1: Setup

- [x] T001 Initialize project structure and ensure `.github/workflows/` directory exists
- [x] T002 Configure `.dockerignore` to exclude `node_modules`, `dist`, and `.git` in `root/.dockerignore`

## Phase 2: Foundational

- [x] T003 [P] Add production build and start scripts to `package.json`
- [x] T004 Ensure `eslint` is configured for production-ready code analysis in `eslint.config.mjs`

## Phase 3: [US1] Deploying the MCP Server via Containers

**Story Goal**: Produce a secure, optimized Docker image that runs the MCP server.
**Independent Test**: Build image locally and run with `docker run -e MEMO_ACCESS_TOKEN=... -e MEMO_SERVER_URL=... <image>` to verify server startup.

- [x] T005 [P] [US1] Create a multi-stage `Dockerfile` using Node.js 22 Alpine in `root/Dockerfile`
- [x] T006 [P] [US1] Configure non-root user `node` in the runtime stage of `root/Dockerfile`
- [x] T007 [US1] Implement environment variable support for credentials in `root/Dockerfile`
- [x] T008 [US1] Verify container starts and responds correctly to MCP protocol via `stdio` locally

## Phase 4: [US2] Automated Continuous Integration and Delivery

**Story Goal**: Implement automated pipeline for linting, testing, and publishing images to GHCR.
**Independent Test**: Trigger workflow on push and verify all jobs (lint, test, build) complete successfully in GitHub Actions.

- [x] T009 [P] [US2] Create GitHub Actions workflow definition in `.github/workflows/release.yml`
- [x] T010 [P] [US2] Integrate `hadolint/hadolint-action` for Dockerfile validation in `.github/workflows/release.yml`
- [x] T011 [P] [US2] Configure Node.js 22 and dependency caching in `.github/workflows/release.yml`
- [x] T012 [US2] Implement Docker Buildx for multi-platform (AMD64/ARM64) builds in `.github/workflows/release.yml`
- [x] T013 [US2] Configure GitHub Container Registry (GHCR) login and push logic in `.github/workflows/release.yml`

## Phase 5: [US3] Automatic Versioning

**Story Goal**: Automate semantic versioning and tagging based on Conventional Commits.
**Independent Test**: Verify that a commit starting with `feat:` increments the minor version and creates a new tag in GHCR.

- [x] T014 [P] [US3] Install and configure `semantic-release` and its plugins in `package.json`
- [x] T015 [US3] Add `semantic-release` execution step to the release job in `.github/workflows/release.yml`
- [x] T016 [US3] Verify `latest` tag update logic on every successful release in `.github/workflows/release.yml`

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T017 Update `README.md` with instructions on how to run the MCP server via Docker
- [x] T018 Verify that image builds are under the 5-minute performance target (SC-001)

## Phase 7: [US4] Dual-Transport Support (Stdio & Streamable HTTP)

**Story Goal**: Allow the server to run in both local (stdio) and remote (HTTP) modes using the modern Streamable HTTP transport.
**Independent Test**: Run with `MCP_TRANSPORT=http` and verify it responds on `http://localhost:3000/mcp`.

- [x] T019 [US4] Install and configure `express` for Streamable HTTP support in `src/index.ts`
- [x] T020 [US4] Implement switching logic for `stdio` vs `http` in `src/index.ts`
- [x] T021 [US4] Update `Dockerfile` to expose the HTTP port and default to `stdio`
- [x] T022 [US4] Document Streamable HTTP usage and configuration in `README.md`

## Implementation Strategy

1. **MVP (User Story 1)**: Focus on the `Dockerfile`. A working production image is the most critical asset.
2. **Incremental CI/CD**: Add linting and testing to the pipeline before enabling the release/push logic.
3. **Automated Versioning**: Finalize by adding `semantic-release` to ensure clean delivery.

## Dependencies

- [US1] (Containers) is a prerequisite for [US2] (CI/CD build/push stage).
- [US2] (CI/CD) is a prerequisite for [US3] (Automatic Versioning) to automate the tagging.

## Parallel Execution

- T003, T004, T005, T006 can be started in parallel.
- T009, T010, T011 (CI setup) can be started as soon as Phase 1 is complete.
- T014 (Versioning config) can be done in parallel with CI development.
