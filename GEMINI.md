# memo-mcp Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-20

## Active Technologies

- TypeScript (Node.js 18+, ESM) + `@modelcontextprotocol/sdk`, `zod`, `axios` (reserved for future) (002-mcp-search-memos)
- N/A (Hardcoded dummy data for this phase) (002-mcp-search-memos)
- TypeScript (Node.js 22 LTS) + Docker (Buildx), GitHub Actions, `testcontainers`, `eslint`, `hadolint`, `semantic-release` (or equivalent) (004-mcp-production-ready)
- N/A (Stateless MCP server) (004-mcp-production-ready)

- TypeScript (Node.js 18+) + `ts-proto`, `protoc`, `axios` (or fetch) (001-memo-api-client)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript (Node.js 18+): Follow standard conventions

## Recent Changes

- 004-mcp-production-ready: Added TypeScript (Node.js 22 LTS) + Docker (Buildx), GitHub Actions, `testcontainers`, `eslint`, `hadolint`, `semantic-release` (or equivalent)
- 002-mcp-search-memos: Completed MCP server scaffold with stdio transport and a dummy `search_memos` tool for integration testing. Includes unit tests for tool handlers and updated README documentation.

- 001-memo-api-client: Added TypeScript (Node.js 18+) + `ts-proto`, `protoc`, `axios` (or fetch) to generate a type-safe client from Protobuf definitions.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
