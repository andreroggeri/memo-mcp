# memo-mcp

MCP (Model Context Protocol) Server for integrating with self-hosted Memo API (https://usememos.com/)

This MCP server enables AI assistants (like Claude) to interact with your self-hosted Memo instance, allowing them to create, read, update, and delete memos programmatically.

## Features

- **Full CRUD Operations**: Create, read, update, and delete memos
- **Pagination Support**: List memos with pagination for large collections
- **Visibility Control**: Set memo visibility (Private, Protected, Public)
- **Resource Access**: Access recent memos as MCP resources
- **Secure Authentication**: Uses Bearer token authentication

## Prerequisites

- Node.js 18 or higher
- A self-hosted Memo instance (https://usememos.com/)
- Memo API access token

## Installation

### Option 1: Install from npm (when published)

```bash
npm install -g memo-mcp
```

### Option 2: Install from source

```bash
git clone https://github.com/andreroggeri/memo-mcp.git
cd memo-mcp
npm install
npm run build
```

## Configuration

The server requires two environment variables:

- `MEMO_API_URL`: The base URL of your Memo instance (e.g., `https://memos.example.com`)
- `MEMO_ACCESS_TOKEN`: Your Memo API access token

### Getting a Memo Access Token

1. Log in to your Memo instance
2. Go to Settings → Access Tokens
3. Create a new access token
4. Copy the token for use in configuration

## Usage

### With Claude Desktop

Add the server to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "memo": {
      "command": "node",
      "args": ["/path/to/memo-mcp/dist/index.js"],
      "env": {
        "MEMO_API_URL": "https://your-memo-instance.com",
        "MEMO_ACCESS_TOKEN": "your-access-token-here"
      }
    }
  }
}
```

Or if installed globally via npm:

```json
{
  "mcpServers": {
    "memo": {
      "command": "memo-mcp",
      "env": {
        "MEMO_API_URL": "https://your-memo-instance.com",
        "MEMO_ACCESS_TOKEN": "your-access-token-here"
      }
    }
  }
}
```

### With Other MCP Clients

The server communicates via stdio and can be integrated with any MCP-compatible client by running:

```bash
MEMO_API_URL=https://your-memo-instance.com MEMO_ACCESS_TOKEN=your-token node dist/index.js
```

## Available Tools

The server provides the following tools to AI assistants:

### create_memo

Create a new memo in the Memo system.

**Parameters**:
- `content` (string, required): The content of the memo in markdown format
- `visibility` (string, optional): The visibility level (`PRIVATE`, `PROTECTED`, or `PUBLIC`). Default: `PRIVATE`

### list_memos

List memos with optional pagination.

**Parameters**:
- `pageSize` (number, optional): Number of memos to return per page. Default: 10
- `pageToken` (string, optional): Token for pagination to get the next page of results

### get_memo

Get a specific memo by its name/ID.

**Parameters**:
- `name` (string, required): The name/ID of the memo (e.g., `"memos/123"`)

### update_memo

Update an existing memo.

**Parameters**:
- `name` (string, required): The name/ID of the memo to update (e.g., `"memos/123"`)
- `content` (string, optional): The new content of the memo
- `visibility` (string, optional): The new visibility level (`PRIVATE`, `PROTECTED`, or `PUBLIC`)
- `pinned` (boolean, optional): Whether the memo should be pinned

### delete_memo

Delete a memo by its name/ID.

**Parameters**:
- `name` (string, required): The name/ID of the memo to delete (e.g., `"memos/123"`)

## Available Resources

### memo://recent

Access the list of 20 most recently created memos as a JSON resource.

## Development

### Build

```bash
npm run build
```

### Development Mode (with hot reload)

```bash
npm run dev
```

### Run

```bash
npm start
```

## Example Usage with Claude

Once configured, you can ask Claude to interact with your memos:

- "Create a memo with the content 'Meeting notes from today'"
- "List all my memos"
- "Show me the content of memo memos/123"
- "Update memo memos/123 to be public"
- "Delete memo memos/456"
- "Show me my recent memos"

## Security Considerations

- Keep your `MEMO_ACCESS_TOKEN` secure and never commit it to version control
- Use environment variables or secure configuration management for tokens
- Consider using Protected or Private visibility for sensitive memos
- Regularly rotate your access tokens

## License

MIT

## Links

- [Memo (usememos.com)](https://usememos.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

