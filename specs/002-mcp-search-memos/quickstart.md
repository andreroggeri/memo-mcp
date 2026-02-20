# Quickstart: MCP Search Memos (Dummy)

## Prerequisites
- Node.js 18+
- `npm install` to install dependencies

## Running the Server
The server runs over stdio. You can start it using:

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Testing with MCP Inspector
To interactively test the tool without a full MCP client:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Manual Verification
Once the inspector (or client) is connected:
1. Call the `list_tools` method to ensure `search_memos` is available.
2. Call `search_memos` with any query:
   ```json
   {
     "query": "test"
   }
   ```
3. Verify that dummy memos are returned in the response.
