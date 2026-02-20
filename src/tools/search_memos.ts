import { z } from 'zod';
import { Memo } from '../types/memo.js';
import { ToolDefinition } from '../types/tool.js';

export const DUMMY_MEMOS: Memo[] = [
  {
    id: '1',
    content: 'Remember to buy milk',
    createdAt: '2026-02-16T10:00:00Z',
  },
  {
    id: '2',
    content: 'MCP protocol research: look into stdio transport',
    createdAt: '2026-02-16T11:00:00Z',
  },
  {
    id: '3',
    content: 'Call John about the project',
    createdAt: '2026-02-16T12:00:00Z',
  },
];

const SearchMemosSchema = z.object({
  query: z.string().describe('Text query to search for in memo content'),
});

export const searchMemosTool: ToolDefinition<typeof SearchMemosSchema, Memo[]> =
  {
    name: 'search_memos',
    description: 'Search for memos by content query',
    schema: SearchMemosSchema,
    handler: async (_args) => {
      // In this dummy phase, we return the full static set regardless of the query content
      // to facilitate UI testing, as specified in FR-004.
      return Promise.resolve(DUMMY_MEMOS);
    },
  };
