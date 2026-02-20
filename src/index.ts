import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { tools } from './tools/index.js';

const server = new McpServer({
  name: 'memo-mcp-server',
  version: '1.0.0',
});

// Register tools
for (const tool of Object.values(tools)) {
  server.registerTool(
    tool.name,
    {
      description: tool.description,
      inputSchema: tool.schema.shape,
    },
    async (args: z.infer<typeof tool.schema>) => {
      const result = await tool.handler(args);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}

// Basic error handling
server.server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

process.on('SIGINT', () => {
  server
    .close()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error closing server:', error);
      process.exit(1);
    });
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Memo MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
