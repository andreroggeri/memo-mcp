import { describe, expect, it } from 'vitest';
import { searchMemosTool } from '../../src/tools/search_memos.js';

describe('searchMemosTool', () => {
  it('should return all dummy memos regardless of query', async () => {
    const results = await searchMemosTool.handler({ query: 'milk' });
    expect(results).toHaveLength(3);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: 'Remember to buy milk' }),
        expect.objectContaining({
          content: 'MCP protocol research: look into stdio transport',
        }),
        expect.objectContaining({ content: 'Call John about the project' }),
      ])
    );
  });

  it('should return all dummy memos for an empty query', async () => {
    const results = await searchMemosTool.handler({ query: '' });
    expect(results).toHaveLength(3);
  });

  it('should return all dummy memos even if no match is expected', async () => {
    const results = await searchMemosTool.handler({ query: 'nonexistent' });
    expect(results).toHaveLength(3);
  });
});
