/**
 * Represents a single memo record returned by the search tool.
 */
export interface Memo {
  /** Unique identifier for the memo */
  id: string;
  /** The text content of the memo */
  content: string;
  /** ISO 8601 timestamp of creation */
  createdAt: string;
}

export interface SearchMemosResult {
  message: string;
  memos: Memo[];
}
