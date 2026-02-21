import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { tools } from './tools/index.js';

/**
 * Creates and configures a new McpServer instance with all registered tools.
 */
function createServer() {
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

  return server;
}

async function main() {
  const transportType = process.env.MCP_TRANSPORT || 'stdio';

  if (transportType === 'http') {
    // createMcpExpressApp includes recommended security defaults like localhost protection
    const app = createMcpExpressApp();
    const port = parseInt(process.env.PORT || '3000', 10);

    // Map to store transports and their associated servers by session ID
    const sessions: {
      [sessionId: string]: {
        transport: StreamableHTTPServerTransport;
        server: McpServer;
      };
    } = {};

    app.use(express.json());

    // MCP endpoint handling all methods (GET for SSE, POST for messages, DELETE for termination)
    const mcpHandler = async (req: express.Request, res: express.Response) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;

      try {
        if (sessionId && sessions[sessionId]) {
          await sessions[sessionId].transport.handleRequest(req, res, req.body);
        } else if (
          !sessionId &&
          req.method === 'POST' &&
          isInitializeRequest(req.body)
        ) {
          // Initialize new stateful session with its own server instance
          const server = createServer();
          const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (id) => {
              console.error(`Session initialized: ${id}`);
              sessions[id] = { transport, server };
            },
            onsessionclosed: (id) => {
              console.error(`Session closed: ${id}`);
              const session = sessions[id];
              if (session) {
                session.server
                  .close()
                  .catch((err) =>
                    console.error(
                      `Error closing server for session ${id}:`,
                      err
                    )
                  );
                delete sessions[id];
              }
            },
          });

          await server.connect(transport);
          await transport.handleRequest(req, res, req.body);
        } else {
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Invalid session or missing initialization request',
            },
            id: null,
          });
        }
      } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
          res.status(500).send('Internal Server Error');
        }
      }
    };

    app.all('/mcp', mcpHandler);

    const httpServer = app.listen(port, () => {
      console.error(
        `Memo MCP Server running on Streamable HTTP at http://localhost:${port}/mcp`
      );
    });

    process.on('SIGINT', () => {
      console.error('Shutting down HTTP server...');
      httpServer.close(() => {
        // Use IIFE to handle async cleanup within void callback
        void (async () => {
          for (const id in sessions) {
            await sessions[id].server.close().catch(() => {});
          }
          process.exit(0);
        })();
      });
    });
  } else {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Memo MCP Server running on stdio');

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
  }
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
