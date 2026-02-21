# Quickstart: Running the memo-mcp Container

## Prerequisites

- **Docker** installed.
- **MEMO_ACCESS_TOKEN**: Your personal access token for the Memo API.
- **MEMO_SERVER_URL**: The URL of your Memo server.

## Run with Docker

To run the latest stable version of the MCP server:

```bash
docker run -i --rm
  -e MEMO_ACCESS_TOKEN="your_token_here"
  -e MEMO_SERVER_URL="https://your-memo-server.com"
  ghcr.io/andreroggeri/memo-mcp:latest
```

> **Note**: The `-i` flag is required because the MCP server communicates via `stdio`.

## Pull a Specific Version

To pull a specific version of the image:

```bash
docker pull ghcr.io/andreroggeri/memo-mcp:1.0.0
```

## Security Notice

The image runs as a non-privileged `node` user for enhanced security. All sensitive configuration is passed through environment variables at runtime.
