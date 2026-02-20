# memo-mcp

MCP (Model Context Protocol) Server foundation for integrating with self-hosted Memo API (https://usememos.com/)

> **⚠️ Work in Progress**: This is currently a scaffolded project structure. Implementation is being developed incrementally.

## Overview

This project implements an MCP server that enables AI assistants (like Claude) to interact with self-hosted Memo instances. It uses the Model Context Protocol (MCP) to provide a standard interface for memo management.

## Features

- **MCP Search Tool (Dummy)**: Prototype `search_memos` tool for verifying end-to-end integration without backend dependencies.
- **Stdio Transport**: Seamless integration with MCP-compatible clients via standard I/O.
- **Type-Safe API Client**: Automatically generated client from Memos Protobuf definitions using `ts-proto`.

## Planned Features

- **Full CRUD Operations**: Create, read, update, and delete memos (real backend integration)
- **Pagination Support**: List memos with pagination for large collections
- **Visibility Control**: Set memo visibility (Private, Protected, Public)
- **Resource Access**: Access recent memos as MCP resources
- **Secure Authentication**: Uses Bearer token authentication

## Prerequisites

- Node.js 18 or higher
- A self-hosted Memo instance (https://usememos.com/)
- Memo API access token
- Docker (required for integration tests via Testcontainers)

## Development Setup

```bash
git clone https://github.com/andreroggeri/memo-mcp.git
cd memo-mcp
npm install
```

### Build

```bash
npm run build
```

### Development Mode (with hot reload)

```bash
npm run dev
```

### Testing

Integration tests run against a real Memo instance via Testcontainers (Docker required).
The test DB fixture is mounted from `tests/fixtures/db` (via a temp copy) and includes a pre-seeded access token.

```bash
npm test
```

## API Client Generation

This project uses `ts-proto` to generate a type-safe client from the Memos Protobuf definitions.

### 1. Fetch Protobuf Files

```bash
npm run fetch:protos
```

### 2. Generate Client

```bash
npm run gen:api
```

The generated code will be located in `src/gen/`.

### 3. Usage

```typescript
import { MemoApiClient } from './memo-api-client.js';

const client = new MemoApiClient({
  baseUrl: 'https://your-memos-instance.com',
  accessToken: 'your-access-token',
});

// PascalCase methods from generated client
const response = await client.ListMemos({ pageSize: 10 });
console.log(response.memos);
```

## Project Structure

```
memo-mcp/
├── src/
│   ├── index.ts              # Main MCP server with stdio transport
│   ├── tools/                # MCP Tool implementations
│   │   ├── index.ts          # Tool registration registry
│   │   └── search_memos.ts   # Dummy 'search_memos' tool
│   ├── types/                # Shared type definitions (Memo, Tool)
│   └── memo-api-client.ts    # Memo API client wrapper (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Current Features

- **MCP Server Scaffold**: Ready-to-use MCP server structure using `@modelcontextprotocol/sdk`.
- **Stdio Transport**: Communication via standard input/output, compatible with Claude Desktop and other MCP clients.
- **Search Memos (Dummy)**: A `search_memos` tool that returns hardcoded dummy data for integration testing.

## Next Implementation Steps

### Tools to Implement

- `create_memo` - Create a new memo
- `list_memos` - List memos with pagination
- `get_memo` - Get a specific memo by ID
- `update_memo` - Update an existing memo
- `delete_memo` - Delete a memo

### Resources to Implement

- `memo://recent` - Access recent memos

## Configuration (Planned)

The server will require environment variables:

- `MEMO_API_URL`: The base URL of your Memo instance
- `MEMO_ACCESS_TOKEN`: Your Memo API access token

## Contributing

This is an incremental development project. Contributions are welcome!

## License

MIT

## Links

- [Memo (usememos.com)](https://usememos.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
