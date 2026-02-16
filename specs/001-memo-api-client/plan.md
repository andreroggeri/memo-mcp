# Implementation Plan: Memo API Client Protobuf Generation

**Branch**: `001-memo-api-client` | **Date**: 2026-02-16 | **Spec**: [specs/001-memo-api-client/spec.md](spec.md)

## Summary
The goal is to implement a repeatable process for generating a type-safe TypeScript client for the Memos API. We will use `ts-proto` to transform the upstream `memo_service.proto` definitions into a TypeScript client. Instead of manually implementing the API methods, we will use the generated `MemoServiceClientImpl` and provide a custom `Rpc` implementation that handles REST/JSON over HTTP (via gRPC-Gateway). This ensures the MCP server has a robust, low-maintenance interface to the Memos backend that stays in sync with the Protobuf definitions.

## Technical Context

**Language/Version**: TypeScript (Node.js 18+)  
**Primary Dependencies**: `ts-proto`, `protoc`, `axios` (or fetch)  
**Storage**: N/A (API Client)  
**Testing**: Vitest or Jest (TBD)  
**Target Platform**: Node.js  
**Project Type**: MCP Server (Single project)  
**Performance Goals**: Generation < 30s, low overhead client  
**Constraints**: Must match upstream Memos API v1 exactly.  
**Scale/Scope**: Focus on `memo_service.proto` and its direct dependencies.

## Constitution Check

- [x] Simple: No manual method implementation logic; use generated code.
- [x] Maintainable: Repeatable generation script; minimal handwritten transport code.
- [x] Type-safe: Full TypeScript generation for both models and service interfaces.

## Project Structure

### Documentation (this feature)

```text
specs/001-memo-api-client/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Research on ts-proto and transport layer
├── data-model.md        # Mapping of proto entities to TS
├── quickstart.md        # How to run the generation
└── contracts/           # API contract documentation
```

### Source Code (repository root)

```text
src/
├── gen/                 # GENERATED: API Client artifacts
│   └── api/v1/          # Generated from memo_service.proto
├── index.ts             # Main entry point (future)
└── memo-api-client.ts   # Wrapper/Handwritten logic (future)

proto/                   # LOCAL COPY: Upstream .proto files
└── api/v1/

scripts/
├── fetch-protos.sh      # Downloads protos from GitHub
└── generate-client.sh   # Runs ts-proto
```

**Structure Decision**: Single project structure with dedicated `gen/` and `proto/` directories to separate concerns.

## Complexity Tracking

*No violations detected.*
