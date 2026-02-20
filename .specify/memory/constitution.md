# Project Constitution: memo-mcp

## 1. Core Principles
- **P0: Security First**: Never log or expose API keys or user credentials.
- **P1: Protocol Fidelity**: Strictly adhere to the Model Context Protocol (MCP) specification.
- **P2: Integration-Driven**: All new tools and handlers SHOULD have corresponding integration tests (To be implemented in the next spec).
- **P3: ESM-Native**: The codebase MUST remain ESM-compatible for Node.js 18+.
- **P4: Lint Integrity**: NEVER disable lint rules globally or in configuration files without explicit approval. Prefer code fixes or line-specific disables (`eslint-disable-next-line`) as a last resort.

## 2. Technical Mandates
- **Language**: TypeScript (Node.js 18+)
- **Transport**: stdio for MCP Server
- **Schema Validation**: Zod for all input/output contracts

## 3. Quality Gates
- `npm test` must pass before any feature is considered complete.
- `npm run lint` must pass before any feature is considered complete.
- `npm run build` must pass with zero type errors.
