# Data Model: Memo API (v1)

Derived from `memo_service.proto`.

## Core Entities

### Memo
Represents a single memo entry in the system.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Unique resource name (e.g., `memos/123`) |
| content | string | The markdown content of the memo |
| visibility | Visibility | Privacy level (PRIVATE, PROTECTED, PUBLIC) |
| creator | string | Resource name of the creator |
| create_time | string (ISO) | Timestamp of creation |
| update_time | string (ISO) | Timestamp of last update |
| tags | string[] | List of tags associated with the memo |

### Visibility (Enum)
- `VISIBILITY_UNSPECIFIED`
- `PRIVATE`
- `PROTECTED`
- `PUBLIC`

## Service Operations (MemoService)

- `CreateMemo`: Creates a new memo.
- `ListMemos`: Retrieves a list of memos with pagination and filtering.
- `GetMemo`: Retrieves a specific memo by resource name.
- `UpdateMemo`: Updates an existing memo's content or metadata.
- `DeleteMemo`: Removes a memo from the system.
