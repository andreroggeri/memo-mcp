# Phase 0 Research: MCP Production Readiness

## Decision 1: Multi-platform Builds via Docker Buildx

**Decision**: Use `docker/setup-buildx-action` and `docker/build-push-action` in GitHub Actions.
**Rationale**: Buildx is the standard Docker tool for building multi-platform images (linux/amd64, linux/arm64) within a single command. It handles the complexity of cross-compilation and pushing manifest lists.
**Alternatives considered**: Building separately and manually merging manifests (too complex/brittle).

## Decision 2: Automated Versioning via `cycjimmy/semantic-release-action`

**Decision**: Use `semantic-release` to automate versioning based on Conventional Commits.
**Rationale**: `semantic-release` is the industry standard for automated semantic versioning. It parses commit messages (`feat:`, `fix:`) to determine the next version number, updates `package.json`, and creates git tags automatically.
**Alternatives considered**: Manual tagging (error-prone), `release-please` (excellent, but `semantic-release` has better integration for simple single-repo flows).

## Decision 3: Non-Root Node.js Docker Image Best Practices

**Decision**: Use the built-in `node` user in the official Node.js Alpine/Slim images and set `USER node`.
**Rationale**: The official Node.js images already include a `node` user (UID 1000). By setting `USER node` in the `Dockerfile`, we ensure the application doesn't run with root privileges. We will use a multi-stage build to keep the production image small.
**Alternatives considered**: Creating a custom user (more boilerplate, same result).

## Decision 4: Linting Strategy (Hadolint)

**Decision**: Use `hadolint/hadolint-action` in the CI pipeline.
**Rationale**: Hadolint is the standard linter for Dockerfiles, enforcing best practices (e.g., using specific tags, avoiding `sudo`, proper clean-up of package managers).
**Alternatives considered**: Manual review only (unsatisfactory for "production-ready").
