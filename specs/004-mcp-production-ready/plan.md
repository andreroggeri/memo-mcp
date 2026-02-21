# Implementation Plan: Make the MCP server production-ready with Docker and CI/CD

**Branch**: `004-mcp-production-ready` | **Date**: Friday, February 20, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-mcp-production-ready/spec.md`

## Summary

This feature focuses on making the `memo-mcp` server production-ready by containerizing the application and automating the CI/CD pipeline. We will provide a secure, multi-platform Docker image (Node.js 22 LTS, non-root user) and implement a GitHub Actions workflow that handles testing, linting (ESLint & Hadolint), and automated semantic versioning via Conventional Commits before pushing to GitHub Container Registry (GHCR).

## Technical Context

**Language/Version**: TypeScript (Node.js 22 LTS)  
**Primary Dependencies**: Docker (Buildx), GitHub Actions, `testcontainers`, `eslint`, `hadolint`, `semantic-release` (or equivalent), `express` (for Streamable HTTP transport)  
**Storage**: N/A (Stateless MCP server)  
**Testing**: `testcontainers`, `npm test`  
**Target Platform**: Linux (amd64/arm64) via Docker  
**Project Type**: single  
**Performance Goals**: Build and push image within 5 minutes (SC-001)  
**Constraints**: MUST run as non-root user, MUST support multi-platform builds, MUST use Conventional Commits for versioning, MUST support both `stdio` and `Streamable HTTP` transports.  
**Scale/Scope**: Automated delivery pipeline for the MCP server.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **P0: Security First**: Container runs as non-root user; credentials handled via environment variables at runtime. **PASS**
- **P3: ESM-Native**: Dockerfile and build process will maintain ESM compatibility. **PASS**
- **P4: Lint Integrity**: Pipeline includes both `eslint` and `hadolint`. **PASS**
- **Quality Gates**: Pipeline enforces `npm test`, `npm run lint`, and `npm run build`. **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/004-mcp-production-ready/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (GitHub Actions Workflows)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── release.yml      # CI/CD Pipeline definition

src/
├── ... (Existing source)

tests/
├── ... (Existing tests)

Dockerfile               # Production container definition
.dockerignore            # Docker build exclusions
package.json             # Version and script management
```

**Structure Decision**: Standard single-project structure with the addition of a `Dockerfile` and GitHub Actions workflows.

## Complexity Tracking

_No violations detected._
