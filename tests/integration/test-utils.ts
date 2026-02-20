import { MemoApiClient } from '../../src/memo-api-client.js';
import { getMemoApiClient } from '../../src/memo-client-provider.js';
import { MemoTestContext } from './memo-container.js';

export const uniqueContent = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createMemoClient = (context: MemoTestContext): MemoApiClient => {
  process.env.MEMO_API_URL = context.baseUrl;
  process.env.MEMO_ACCESS_TOKEN = context.accessToken;
  return getMemoApiClient();
};

export const getIntegrationMemoClient = (
  getContext: () => MemoTestContext
): MemoApiClient => createMemoClient(getContext());
