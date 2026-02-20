import { describe, expect, it } from 'vitest';
import { searchMemosTool } from '../../src/tools/search_memos.js';
import { useMemoTestContainer } from './memo-container.js';
import { getIntegrationMemoClient, uniqueContent } from './test-utils.js';

const getContext = useMemoTestContainer();

describe('searchMemosTool (integration)', () => {
  it('returns matching memos from the real instance', async () => {
    const client = getIntegrationMemoClient(getContext);
    const content = uniqueContent('tool-match');
    await client.CreateMemo({ memo: { content } });

    const results = await searchMemosTool.handler({
      query: content,
      pageSize: 10,
    });

    expect(results.message).toContain('Found 1 result(s).');
    expect(results.memos).toContainEqual({
      id: expect.any(String),
      content,
      createdAt: expect.any(String),
    });
  });

  it('returns memos for an empty query', async () => {
    const client = getIntegrationMemoClient(getContext);
    const content = uniqueContent('tool-empty');
    await client.CreateMemo({ memo: { content } });

    const results = await searchMemosTool.handler({ query: '', pageSize: 50 });

    expect(results.memos).toContainEqual({
      id: expect.any(String),
      content,
      createdAt: expect.any(String),
    });
  });

  it('returns a no-results message when no memos match', async () => {
    const client = getIntegrationMemoClient(getContext);
    await client.CreateMemo({ memo: { content: uniqueContent('tool-other') } });

    const results = await searchMemosTool.handler({
      query: 'no-match-2fa07fcad0084d95b5dfe09fafe60067',
      pageSize: 10,
    });

    expect(results).toEqual({ message: 'No results found.', memos: [] });
  });
});
