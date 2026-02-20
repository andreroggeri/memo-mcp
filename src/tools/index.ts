import { searchMemosTool } from './search_memos.js';

export const tools = {
  [searchMemosTool.name]: searchMemosTool,
} as const;
