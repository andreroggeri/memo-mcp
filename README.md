# memo-mcp

MCP (Model Context Protocol) Server foundation for integrating with self-hosted Memo API (https://usememos.com/)

> **⚠️ Work in Progress**: This is currently a scaffolded project structure. Implementation is being developed incrementally.

## Overview

This project aims to create an MCP server that enables AI assistants (like Claude) to interact with self-hosted Memo instances, allowing them to create, read, update, and delete memos programmatically.

## Planned Features

- **Full CRUD Operations**: Create, read, update, and delete memos
- **Pagination Support**: List memos with pagination for large collections
- **Visibility Control**: Set memo visibility (Private, Protected, Public)
- **Resource Access**: Access recent memos as MCP resources
- **Secure Authentication**: Uses Bearer token authentication

## Prerequisites

- Node.js 18 or higher
- A self-hosted Memo instance (https://usememos.com/)
- Memo API access token

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
import { MemoApiClient } from "./memo-api-client.js";

const client = new MemoApiClient({
  baseUrl: "https://your-memos-instance.com",
  accessToken: "your-access-token",
});

// PascalCase methods from generated client
const response = await client.ListMemos({ pageSize: 10 });
console.log(response.memos);
```

## Project Structure

```
memo-mcp/
├── src/
│   ├── index.ts              # Main MCP server (TODO: implement)
│   └── memo-api-client.ts    # Memo API client wrapper (TODO: implement)
├── package.json
├── tsconfig.json
└── README.md
```

## Planned Implementation

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

