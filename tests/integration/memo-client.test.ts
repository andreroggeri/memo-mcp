import { describe, expect, it } from 'vitest';
import { MemoApiClient, MemoApiError } from '../../src/memo-api-client.js';
import { useMemoTestContainer } from './memo-container.js';

const getContext = useMemoTestContainer();

const createClient = () => {
  const { baseUrl, accessToken } = getContext();
  return new MemoApiClient({ baseUrl, accessToken });
};

const uniqueContent = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const assertMemoApiError = (error: unknown): MemoApiError => {
  if (error instanceof MemoApiError) {
    return error;
  }
  throw error;
};

describe('MemoApiClient (integration)', () => {
  it('should be instantiable', () => {
    const client = createClient();
    expect(client).toBeDefined();
  });

  it('should list memos from the real instance', async () => {
    const client = createClient();
    const content = uniqueContent('list');
    const created = await client.CreateMemo({ memo: { content } });
    const response = await client.ListMemos({ pageSize: 10 });
    expect(response.memos?.length).toBeGreaterThan(0);
    expect(response.memos?.some((memo) => memo.content === content)).toBe(true);
    expect(created.name).toBeDefined();
  });

  it('should create a memo', async () => {
    const client = createClient();
    const content = uniqueContent('create');

    const response = await client.CreateMemo({ memo: { content } });
    expect(response.name).toContain('memos/');
    expect(response.content).toBe(content);
  });

  it('should update a memo', async () => {
    const client = createClient();
    const content = uniqueContent('update');
    const created = await client.CreateMemo({ memo: { content } });
    const updatedContent = `${content}-updated`;
    const response = await client.UpdateMemo({
      memo: { name: created.name, content: updatedContent },
      updateMask: ['content'],
    });

    expect(response.content).toBe(updatedContent);
  });

  it('should delete a memo', async () => {
    const client = createClient();
    const content = uniqueContent('delete');
    const created = await client.CreateMemo({ memo: { content } });

    await client.DeleteMemo({ name: created.name });

    try {
      await client.GetMemo({ name: created.name });
      expect.fail('Expected GetMemo to fail for deleted memo');
    } catch (error: unknown) {
      const err = assertMemoApiError(error);
      expect(err.status).toBe(404);
    }
  });
});

describe('MemoApiError (integration)', () => {
  it('should preserve error details from real server responses', async () => {
    const client = createClient();

    try {
      await client.GetMemo({ name: 'memos/does-not-exist' });
      expect.fail('Should have thrown MemoApiError');
    } catch (error: unknown) {
      const err = assertMemoApiError(error);
      expect(err.status).toBe(404);
      expect(err.code).toBeDefined();
      expect(typeof err.code).toBe('string');
    }
  });
});
