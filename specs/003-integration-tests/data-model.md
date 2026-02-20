# Data Model

## Memo

**Fields**:
- `name`: string (server-assigned identifier like `memos/{id}`)
- `content`: string

**Relationships**:
- Created/updated by the Memo API via `CreateMemo`, `UpdateMemo`, `DeleteMemo`.

**Validation rules**:
- `content` must be non-empty for create/update tests.

## Memo Container

**Fields**:
- `image`: string (Docker image reference)
- `port`: number (expected service port, default 5230)
- `env`: key/value map (demo mode and other runtime settings)

**Relationships**:
- Owned by the integration test lifecycle.

## Integration Test Context

**Fields**:
- `baseUrl`: string (computed from container host + mapped port)
- `accessToken`: string (demo token or empty string per configuration)

**State transitions**:
- `created` → `ready` (container start + wait strategy)
- `ready` → `stopped` (after tests complete)
