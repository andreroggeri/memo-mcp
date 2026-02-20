# Phase 0 Research

## Decision: Use `neosmemo/memos:stable` Docker image on port 5230

**Rationale**: The official installation guidance recommends the `neosmemo/memos:stable` image, and the default server port is 5230. Using the stable tag reduces breakage risk from nightly changes while matching upstream behavior.

**Alternatives considered**:
- `neosmemo/memos:canary` or nightly tags for fastest updates.
- `lincolnthalles/memos` (community builds) for faster pulls or different packaging.

## Decision: Use prod mode with a seeded fixture DB via `MEMOS_MODE=prod`

**Rationale**: A pre-seeded SQLite fixture (`tests/fixtures/db/memos_prod.db`) provides a stable user and access token without needing to bootstrap accounts at runtime. Running in `prod` mode ensures the server uses the fixture database.

**Alternatives considered**:
- Using demo mode with runtime bootstrapping.
- Attempting to drive the UI for first-time setup (fragile and slow).

## Decision: Use Testcontainers wait strategy for listening ports (and increase startup timeout)

**Rationale**: The default wait strategy ensures the container port is bound before tests begin. A longer startup timeout reduces flakiness during image pulls or slow startup.

**Alternatives considered**:
- Waiting for a specific log line.
- Polling an HTTP health endpoint (not guaranteed to exist in all versions).

## Decision: Use Vitest `beforeAll`/`afterAll` for container lifecycle

**Rationale**: Vitest hooks provide a clear, suite-wide lifecycle for starting and stopping the Memo container once per test file.

**Alternatives considered**:
- Per-test setup/teardown (`beforeEach`/`afterEach`) which would be too slow.
