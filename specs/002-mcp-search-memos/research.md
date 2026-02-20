# Research: MCP Server Implementation with `@modelcontextprotocol/sdk`

## Decision 1: Server Transport
- **Decision**: Use `StdioServerTransport`.
- **Rationale**: The specification (FR-002) explicitly requires stdio as the communication transport. This is the standard for most MCP integrations (like with Claude Desktop).
- **Alternatives considered**: `SseServerTransport` (HTTP-based), but rejected due to spec requirement.

## Decision 2: SDK Version and Patterns
- **Decision**: Use the latest version of `@modelcontextprotocol/sdk` (v1.x) following the official patterns for tool definition.
- **Rationale**: Version 1.26.0 is already in `package.json`. The SDK provides a `Server` class that handles the protocol lifecycle and tool registration.
- **Alternatives considered**: Manual JSON-RPC implementation, but rejected as the SDK simplifies the process and handles protocol details.

## Decision 3: Dummy Data Structure
- **Decision**: Hardcode a small array of memos in the tool handler.
- **Rationale**: Requirement FR-007 explicitly forbids connecting to the real service. Hardcoded data ensures SC-004 (no API keys needed) is met.
- **Alternatives considered**: Local JSON file, but unnecessary for a simple "dummy implementation" scaffold.

## Decision 4: Input Validation
- **Decision**: Use `zod` for tool argument validation (already in dependencies).
- **Rationale**: `zod` provides a type-safe way to define the tool schema and is already part of the project's dependencies.
