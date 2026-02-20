import { z } from 'zod';
import { Memo as ApiMemo } from '../gen/api/v1/memo_service.js';
import { getMemoApiClient } from '../memo-client-provider.js';
import { Memo, SearchMemosResult } from '../types/memo.js';
import { ToolDefinition } from '../types/tool.js';

const SearchMemosSchema = z.object({
  query: z.string().describe('Text query to search for in memo content'),
  pageSize: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe('Maximum number of memos to return (1-100, default 10)'),
});

const toSearchFilter = (query: string): string | undefined => {
  const trimmed = query.trim();
  if (!trimmed) {
    return undefined;
  }

  const escaped = trimmed.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  return `content.contains("${escaped}")`;
};

const toMemo = (memo: ApiMemo): Memo | undefined => {
  if (!memo.name || !memo.content || !memo.createTime) {
    return undefined;
  }

  return {
    id: memo.name.split('/').pop() ?? memo.name,
    content: memo.content,
    createdAt: memo.createTime.toISOString(),
  };
};

export const searchMemosTool: ToolDefinition<
  typeof SearchMemosSchema,
  SearchMemosResult
> = {
  name: 'search_memos',
  description: 'Search for memos by content query',
  schema: SearchMemosSchema,
  handler: async (args) => {
    const client = getMemoApiClient();
    const response = await client.ListMemos({
      pageSize: args.pageSize,
      filter: toSearchFilter(args.query),
    });
    const memos = (response.memos ?? [])
      .map(toMemo)
      .filter((memo): memo is Memo => memo !== undefined);

    if (memos.length === 0) {
      return { message: 'No results found.', memos: [] };
    }

    return {
      message: `Found ${memos.length} result(s).`,
      memos,
    };
  },
};
