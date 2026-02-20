import { MemoApiClient } from './memo-api-client.js';

let cachedClient: MemoApiClient | undefined;

const readConfigFromEnv = (): { baseUrl: string; accessToken: string } => {
  const baseUrl = process.env.MEMO_API_URL;
  const accessToken = process.env.MEMO_ACCESS_TOKEN;

  if (!baseUrl) {
    throw new Error('MEMO_API_URL is required.');
  }

  if (!accessToken) {
    throw new Error('MEMO_ACCESS_TOKEN is required.');
  }

  return { baseUrl, accessToken };
};

export const getMemoApiClient = (): MemoApiClient => {
  if (cachedClient) {
    return cachedClient;
  }

  const config = readConfigFromEnv();
  cachedClient = new MemoApiClient(config);
  return cachedClient;
};
