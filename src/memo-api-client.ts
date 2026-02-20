import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  CreateMemoRequest,
  DeleteMemoRequest,
  GetMemoRequest,
  ListMemosRequest,
  ListMemosResponse,
  Memo,
  MemoServiceClientImpl,
  UpdateMemoRequest,
} from './gen/api/v1/memo_service.js';
import { Empty } from './gen/google/protobuf/empty.js';

export interface MemoApiClientConfig {
  /** The base URL of the Memos instance (e.g., https://demo.usememos.com) */
  baseUrl: string;
  /** The access token for authentication */
  accessToken: string;
}

/**
 * Custom error class for Memos API errors.
 */
export class MemoApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'MemoApiError';
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

interface MethodConfig<TReq extends object, TRes extends object> {
  req: {
    decode(data: Uint8Array): TReq;
    toJSON(message: TReq): unknown;
  };
  res: {
    encode(message: TRes): { finish(): Uint8Array };
    fromJSON(object: object): TRes;
  };
  method: 'get' | 'post' | 'patch' | 'delete';
  path: (req: TReq) => string;
  getBody?: (req: TReq) => unknown;
}

const configs = {
  ListMemos: {
    req: ListMemosRequest,
    res: ListMemosResponse,
    method: 'get',
    path: () => '/api/v1/memos',
  },
  GetMemo: {
    req: GetMemoRequest,
    res: Memo,
    method: 'get',
    path: (req: GetMemoRequest) => `/api/v1/${req.name}`,
  },
  CreateMemo: {
    req: CreateMemoRequest,
    res: Memo,
    method: 'post',
    path: () => '/api/v1/memos',
    getBody: (req: CreateMemoRequest) => req.memo,
  },
  UpdateMemo: {
    req: UpdateMemoRequest,
    res: Memo,
    method: 'patch',
    path: (req: UpdateMemoRequest) => {
      if (!req.memo) {
        throw new MemoApiError('Memo is required', 400);
      }
      return `/api/v1/${req.memo.name}`;
    },
    getBody: (req: UpdateMemoRequest) => req.memo,
  },
  DeleteMemo: {
    req: DeleteMemoRequest,
    res: Empty,
    method: 'delete',
    path: (req: DeleteMemoRequest) => `/api/v1/${req.name}`,
  },
} as const;

/**
 * Adapter that implements the Rpc interface required by ts-proto generated clients.
 * It maps gRPC method calls to REST/JSON endpoints used by gRPC-Gateway.
 */
export class MemosRpcAdapter implements Rpc {
  private axiosInstance: AxiosInstance;

  constructor(config: MemoApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Add error interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const data = error.response.data as {
            message?: string;
            code?: string;
            details?: unknown;
          };
          throw new MemoApiError(
            data.message || error.message,
            error.response.status,
            data.code,
            data.details
          );
        }
        throw error;
      }
    );
  }

  private async processRequest<TReq extends object, TRes extends object>(
    config: MethodConfig<TReq, TRes>,
    data: Uint8Array
  ): Promise<Uint8Array> {
    const requestMsg = config.req.decode(data);
    const url = config.path(requestMsg);

    let responseData: TRes;

    // Logic inside here is now type-safe relative to TReq/TRes
    if (config.method === 'get') {
      const json = config.req.toJSON(requestMsg) as Record<string, unknown>;
      const response = await this.axiosInstance.get<TRes>(url, {
        params: json,
      });
      responseData = response.data;
    } else if (config.method === 'post' || config.method === 'patch') {
      const json = config.req.toJSON(requestMsg);
      const body = config.getBody ? config.getBody(requestMsg) : json;
      const response = await this.axiosInstance[config.method]<TRes>(url, body);
      responseData = response.data;
    } else if (config.method === 'delete') {
      const response = await this.axiosInstance.delete<TRes>(url);
      responseData = response.data;
    } else {
      throw new Error(`Unsupported method: ${config.method as string}`);
    }

    const responseMsg = config.res.fromJSON(responseData);
    return config.res.encode(responseMsg).finish();
  }

  async request(
    _service: string,
    method: keyof typeof configs,
    data: Uint8Array
  ): Promise<Uint8Array> {
    const config: MethodConfig<object, object> = configs[method];
    return this.processRequest(config, data);
  }
}

/**
 * A type-safe client for the Memos API v1, using the generated MemoServiceClientImpl.
 */
export class MemoApiClient extends MemoServiceClientImpl {
  constructor(config: MemoApiClientConfig) {
    const adapter = new MemosRpcAdapter(config);
    super(adapter);
  }
}
