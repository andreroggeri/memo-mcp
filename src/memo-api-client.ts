import axios, { AxiosInstance } from 'axios';

export interface MemoApiConfig {
  baseUrl: string;
  accessToken: string;
}

export interface Memo {
  name: string;
  uid: string;
  content: string;
  visibility: string;
  createTime: string;
  updateTime: string;
  displayTime?: string;
  pinned?: boolean;
  tags?: string[];
}

export interface CreateMemoRequest {
  content: string;
  visibility?: 'PRIVATE' | 'PROTECTED' | 'PUBLIC';
}

export interface UpdateMemoRequest {
  content?: string;
  visibility?: 'PRIVATE' | 'PROTECTED' | 'PUBLIC';
  pinned?: boolean;
}

export interface ListMemosResponse {
  memos: Memo[];
  nextPageToken?: string;
}

export class MemoApiClient {
  private client: AxiosInstance;

  constructor(config: MemoApiConfig) {
    this.client = axios.create({
      baseURL: `${config.baseUrl}/api/v1`,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createMemo(request: CreateMemoRequest): Promise<Memo> {
    const response = await this.client.post<Memo>('/memos', request);
    return response.data;
  }

  async listMemos(pageSize?: number, pageToken?: string): Promise<ListMemosResponse> {
    const params: Record<string, any> = {};
    if (pageSize) params.pageSize = pageSize;
    if (pageToken) params.pageToken = pageToken;
    
    const response = await this.client.get<ListMemosResponse>('/memos', { params });
    return response.data;
  }

  async getMemo(name: string): Promise<Memo> {
    const response = await this.client.get<Memo>(`/memos/${name}`);
    return response.data;
  }

  async updateMemo(name: string, request: UpdateMemoRequest): Promise<Memo> {
    const updateMask: string[] = [];
    if (request.content !== undefined) updateMask.push('content');
    if (request.visibility !== undefined) updateMask.push('visibility');
    if (request.pinned !== undefined) updateMask.push('pinned');

    const response = await this.client.patch<Memo>(
      `/memos/${name}`,
      request,
      {
        params: {
          updateMask: updateMask.join(','),
        },
      }
    );
    return response.data;
  }

  async deleteMemo(name: string): Promise<void> {
    await this.client.delete(`/memos/${name}`);
  }
}
