# Data Model: MCP Search Memos (Dummy)

## Entities

### Memo
Represents a single memo record returned by the dummy tool.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | `string` | Unique identifier for the memo | Required |
| `content` | `string` | The text content of the memo | Required |
| `createdAt` | `string` | ISO 8601 timestamp of creation | Required |

## Relationships
N/A for dummy implementation.

## State Transitions
N/A - Read-only dummy data.
