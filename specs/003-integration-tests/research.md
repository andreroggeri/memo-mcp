# Phase 0 Research

## Decision: Use `neosmemo/memos:stable` Docker image on port 5230

**Rationale**: The official installation guidance recommends the `neosmemo/memos:stable` image, and the default server port is 5230. Using the stable tag reduces breakage risk from nightly changes while matching upstream behavior.

**Alternatives considered**:
- `neosmemo/memos:canary` or nightly tags for fastest updates.
- `lincolnthalles/memos` (community builds) for faster pulls or different packaging.

## Decision: Enable demo mode for tests via `MEMOS_MODE=demo`

**Rationale**: The runtime options for Memos explicitly support a `demo` mode through `MEMOS_MODE`. This avoids the need to bootstrap a real user and API token for automated tests, keeping the integration suite deterministic and self-contained.

**Alternatives considered**:
- Running in `prod` mode and manually seeding an admin token.
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
