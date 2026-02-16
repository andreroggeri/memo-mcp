#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { MemoApiClient, CreateMemoRequest, UpdateMemoRequest } from './memo-api-client.js';

// Get configuration from environment variables
const MEMO_API_URL = process.env.MEMO_API_URL;
const MEMO_ACCESS_TOKEN = process.env.MEMO_ACCESS_TOKEN;

if (!MEMO_API_URL || !MEMO_ACCESS_TOKEN) {
  console.error('Error: MEMO_API_URL and MEMO_ACCESS_TOKEN environment variables are required');
  process.exit(1);
}

// Initialize the Memo API client
const memoClient = new MemoApiClient({
  baseUrl: MEMO_API_URL,
  accessToken: MEMO_ACCESS_TOKEN,
});

// Create MCP server
const server = new Server(
  {
    name: 'memo-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_memo',
        description: 'Create a new memo in the Memo system',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The content of the memo in markdown format',
            },
            visibility: {
              type: 'string',
              enum: ['PRIVATE', 'PROTECTED', 'PUBLIC'],
              description: 'The visibility level of the memo (default: PRIVATE)',
              default: 'PRIVATE',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'list_memos',
        description: 'List memos with optional pagination',
        inputSchema: {
          type: 'object',
          properties: {
            pageSize: {
              type: 'number',
              description: 'Number of memos to return per page (default: 10)',
              default: 10,
            },
            pageToken: {
              type: 'string',
              description: 'Token for pagination to get the next page of results',
            },
          },
        },
      },
      {
        name: 'get_memo',
        description: 'Get a specific memo by its name/ID',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name/ID of the memo (e.g., "memos/123")',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'update_memo',
        description: 'Update an existing memo',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name/ID of the memo to update (e.g., "memos/123")',
            },
            content: {
              type: 'string',
              description: 'The new content of the memo',
            },
            visibility: {
              type: 'string',
              enum: ['PRIVATE', 'PROTECTED', 'PUBLIC'],
              description: 'The new visibility level of the memo',
            },
            pinned: {
              type: 'boolean',
              description: 'Whether the memo should be pinned',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'delete_memo',
        description: 'Delete a memo by its name/ID',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name/ID of the memo to delete (e.g., "memos/123")',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_memo': {
        const createRequest: CreateMemoRequest = {
          content: args.content as string,
          visibility: args.visibility as 'PRIVATE' | 'PROTECTED' | 'PUBLIC' | undefined,
        };
        const memo = await memoClient.createMemo(createRequest);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(memo, null, 2),
            },
          ],
        };
      }

      case 'list_memos': {
        const pageSize = args.pageSize as number | undefined;
        const pageToken = args.pageToken as string | undefined;
        const response = await memoClient.listMemos(pageSize, pageToken);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case 'get_memo': {
        const name = args.name as string;
        const memo = await memoClient.getMemo(name);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(memo, null, 2),
            },
          ],
        };
      }

      case 'update_memo': {
        const name = args.name as string;
        const updateRequest: UpdateMemoRequest = {};
        if (args.content !== undefined) updateRequest.content = args.content as string;
        if (args.visibility !== undefined) updateRequest.visibility = args.visibility as 'PRIVATE' | 'PROTECTED' | 'PUBLIC';
        if (args.pinned !== undefined) updateRequest.pinned = args.pinned as boolean;
        
        const memo = await memoClient.updateMemo(name, updateRequest);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(memo, null, 2),
            },
          ],
        };
      }

      case 'delete_memo': {
        const name = args.name as string;
        await memoClient.deleteMemo(name);
        return {
          content: [
            {
              type: 'text',
              text: `Memo ${name} has been successfully deleted`,
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${name}: ${errorMessage}`
    );
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'memo://recent',
        name: 'Recent Memos',
        description: 'List of recently created memos',
        mimeType: 'application/json',
      },
    ],
  };
});

// Read resource contents
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    if (uri === 'memo://recent') {
      const response = await memoClient.listMemos(20);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(response.memos, null, 2),
          },
        ],
      };
    }

    throw new McpError(
      ErrorCode.InvalidRequest,
      `Unknown resource: ${uri}`
    );
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(
      ErrorCode.InternalError,
      `Error reading resource ${uri}: ${errorMessage}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr instead of stdout to avoid interfering with MCP protocol
  console.error('Memo MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
