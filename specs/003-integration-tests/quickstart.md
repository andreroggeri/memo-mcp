# Quickstart

## Prerequisites

- Docker running locally (for Testcontainers).
- Node.js dependencies installed.

## Run Integration Tests

```bash
npm test
```

> Integration tests use Testcontainers and require Docker to be running. The test DB fixture is mounted read-write from a temp copy.

## Expected Behavior

- A Memo container starts and waits until the API port is reachable.
- Integration tests exercise `ListMemos`, `CreateMemo`, `UpdateMemo`, `DeleteMemo`, and error handling.
- The container stops after tests complete.
