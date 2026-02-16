import axios, { AxiosInstance, AxiosError } from "axios";
import {
  MemoServiceClientImpl,
  ListMemosRequest,
  ListMemosResponse,
  GetMemoRequest,
  CreateMemoRequest,
  UpdateMemoRequest,
  DeleteMemoRequest,
  Memo,
} from "./gen/api/v1/memo_service.js";
import { Empty } from "./gen/google/protobuf/empty.js";

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
    public details?: any
  ) {
    super(message);
    this.name = "MemoApiError";
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
        "Content-Type": "application/json",
      },
    });

    // Add error interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const data = error.response.data as any;
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

  async request(_service: string, method: string, data: Uint8Array): Promise<Uint8Array> {
    const config = this.getMethodConfig(method);
    if (!config) {
      throw new Error(`Method ${method} not implemented in Rpc adapter`);
    }

    const requestMsg = config.req.decode(data);
    const url = config.path(requestMsg);
    const axiosMethod = config.method.toLowerCase() as "get" | "post" | "patch" | "delete";

    let responseData: any;
    if (axiosMethod === "get") {
      const json = config.req.toJSON(requestMsg);
      const response = await this.axiosInstance.get(url, { params: json });
      responseData = response.data;
    } else if (axiosMethod === "post" || axiosMethod === "patch") {
      const json = config.req.toJSON(requestMsg);
      const body = config.getBody ? config.getBody(json) : json;
      const response = await this.axiosInstance[axiosMethod](url, body);
      responseData = response.data;
    } else if (axiosMethod === "delete") {
      const response = await this.axiosInstance.delete(url);
      responseData = response.data;
    }

    const responseMsg = config.res.fromJSON(responseData);
    return config.res.encode(responseMsg).finish();
  }

  private getMethodConfig(method: string): any {
    const configs: Record<string, any> = {
      ListMemos: {
        req: ListMemosRequest,
        res: ListMemosResponse,
        method: "GET",
        path: () => "/api/v1/memos",
        getParams: (req: any) => req,
      },
      GetMemo: {
        req: GetMemoRequest,
        res: Memo,
        method: "GET",
        path: (req: any) => `/api/v1/${req.name}`,
      },
      CreateMemo: {
        req: CreateMemoRequest,
        res: Memo,
        method: "POST",
        path: () => "/api/v1/memos",
        getBody: (req: any) => req.memo,
      },
      UpdateMemo: {
        req: UpdateMemoRequest,
        res: Memo,
        method: "PATCH",
        path: (req: any) => `/api/v1/${req.memo.name}`,
        getBody: (req: any) => req.memo,
      },
      DeleteMemo: {
        req: DeleteMemoRequest,
        res: Empty,
        method: "DELETE",
        path: (req: any) => `/api/v1/${req.name}`,
      },
    };
    return configs[method];
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
