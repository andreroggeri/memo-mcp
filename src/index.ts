import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
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

export async function startServer(
  config: {
    transportType?: string;
    port?: number;
  } = {}
) {
  const transportType =
    config.transportType || process.env.MCP_TRANSPORT || 'stdio';

  if (transportType === 'http') {
    const allowedHosts = process.env.MCP_ALLOWED_HOSTS
      ? process.env.MCP_ALLOWED_HOSTS.split(',').map((h) => h.trim())
      : undefined;
    const app = createMcpExpressApp({
      ...{ allowedHosts },
    });
    const port = config.port || parseInt(process.env.PORT || '3000', 10);

    const sessions: Record<string, number> = {};
    const transports: Record<string, StreamableHTTPServerTransport> = {};
    const servers: Record<string, McpServer> = {};
    const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

    const cleanupInterval = setInterval(
      () => {
        const now = Date.now();
        for (const id in sessions) {
          if (now - sessions[id] > SESSION_TIMEOUT_MS) {
            console.error(`[MCP] Closing stale session: ${id}`);
            const staleTransport = transports[id];
            if (staleTransport) {
              void staleTransport.close().catch((error) => {
                console.warn(
                  `[MCP] Error closing stale transport: ${id}`,
                  error
                );
              });
            }
            const staleServer = servers[id];
            if (staleServer) {
              void staleServer.close().catch((error) => {
                console.warn(`[MCP] Error closing stale server: ${id}`, error);
              });
            }
            delete transports[id];
            delete servers[id];
            delete sessions[id];
          }
        }
      },
      5 * 60 * 1000
    );

    app.all('/mcp', async (req, res) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      try {
        let transport: StreamableHTTPServerTransport | undefined;

        if (sessionId && transports[sessionId]) {
          transport = transports[sessionId];
          sessions[sessionId] = Date.now();
        } else if (
          !sessionId &&
          req.method === 'POST' &&
          isInitializeRequest(req.body)
        ) {
          const server = createServer();
          const newTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (id) => {
              console.error(`[MCP] Session initialized: ${id}`);
              sessions[id] = Date.now();
              transports[id] = newTransport;
              servers[id] = server;
            },
            onsessionclosed: (id) => {
              console.error(`[MCP] Session closed: ${id}`);
              delete sessions[id];
              delete transports[id];
              const sessionServer = servers[id];
              if (sessionServer) {
                void sessionServer.close().catch((error) => {
                  console.warn(
                    `[MCP] Error closing session server: ${id}`,
                    error
                  );
                });
                delete servers[id];
              }
            },
          });

          newTransport.onclose = () => {
            const id = newTransport.sessionId;
            if (!id) {
              return;
            }
            delete sessions[id];
            delete transports[id];
            const sessionServer = servers[id];
            if (sessionServer) {
              void sessionServer.close().catch(() => {});
              delete servers[id];
            }
          };

          await server.connect(newTransport);
          transport = newTransport;
        } else {
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Bad Request: No valid session ID provided',
            },
            id: null,
          });
          return;
        }

        if (!transport) {
          throw new Error('Failed to resolve MCP transport for request');
        }

        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('[MCP] Error handling request:', error);
        if (!res.headersSent) {
          res.status(500).send('Internal Server Error');
        }
      }
    });

    const httpServer = app.listen(port, () => {
      console.error(
        `Memo MCP Server running on Streamable HTTP at http://localhost:${port}/mcp`
      );
    });

    const gracefulShutdown = () => {
      console.error('Shutting down HTTP server...');
      clearInterval(cleanupInterval);
      httpServer.close(() => {
        void (async () => {
          await Promise.all(
            Object.values(transports).map((sessionTransport) =>
              sessionTransport.close().catch(() => {})
            )
          );
          await Promise.all(
            Object.values(servers).map((sessionServer) =>
              sessionServer.close().catch(() => {})
            )
          );
          process.exit(0);
        })();
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    return { httpServer, sessions, transports, servers, cleanupInterval };
  } else {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Memo MCP Server running on stdio');

    const gracefulShutdown = () => {
      server
        .close()
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          console.error('Error closing server:', error);
          process.exit(1);
        });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    return { server, transport };
  }
}

// Automatically start if executed directly
const isMain =
  process.argv[1] === import.meta.filename ||
  process.argv[1]?.endsWith('/dist/index.js') ||
  process.argv[1]?.endsWith('/src/index.ts');

if (isMain) {
  startServer().catch((error) => {
    console.error('Fatal error in startServer():', error);
    process.exit(1);
  });
}
