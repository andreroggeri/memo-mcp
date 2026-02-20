import axios, { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi, Mock } from "vitest";
import { MemoApiClient, MemoApiError } from "../../src/memo-api-client.js";

vi.mock("axios");

describe("MemoApiClient", () => {
  let interceptorErrorCallback: ((error: any) => any) | undefined;

  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      response: {
        use: vi.fn((_success, error: (err: any) => any) => {
          interceptorErrorCallback = error;
        }),
      },
    },
  };

  beforeEach(() => {
    (axios.create as Mock).mockReturnValue(mockAxiosInstance as unknown as AxiosInstance);
    vi.clearAllMocks();
    interceptorErrorCallback = undefined;
  });

  it("should be instantiable", () => {
    new MemoApiClient({
      baseUrl: "https://demo.usememos.com",
      accessToken: "test-token",
    });
    expect(axios.create).toHaveBeenCalled();
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  it("should have expected PascalCase methods from generated client", () => {
    const client = new MemoApiClient({
      baseUrl: "https://demo.usememos.com",
      accessToken: "test-token",
    });
    expect(typeof client.ListMemos).toBe("function");
    expect(typeof client.GetMemo).toBe("function");
    expect(typeof client.CreateMemo).toBe("function");
    expect(typeof client.UpdateMemo).toBe("function");
    expect(typeof client.DeleteMemo).toBe("function");
  });

  it("should use the Rpc adapter to make calls", async () => {
    const mockResponse = {
      data: {
        memos: [{ name: "memos/1", content: "hello" }],
      },
    };

    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const client = new MemoApiClient({
      baseUrl: "https://demo.usememos.com",
      accessToken: "test-token",
    });

    const response = await client.ListMemos({ pageSize: 10 });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith( // eslint-disable-line @typescript-eslint/unbound-method
      "/api/v1/memos",
      expect.objectContaining({
        params: expect.objectContaining({ pageSize: 10 }),
      }),
    );
    expect(response.memos).toHaveLength(1);
    expect(response.memos?.[0]?.content).toBe("hello");
  });

  it("should handle CreateMemo", async () => {
    const mockResponse = {
      data: { name: "memos/1", content: "new memo" },
    };
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const client = new MemoApiClient({
      baseUrl: "https://demo.usememos.com",
      accessToken: "test-token",
    });

    const response = await client.CreateMemo({
      memo: { content: "new memo" } as any, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith( // eslint-disable-line @typescript-eslint/unbound-method
      "/api/v1/memos",
      expect.objectContaining({
        content: "new memo",
      }),
    );
    expect(response.name).toBe("memos/1");
  });

  it("should handle UpdateMemo", async () => {
    const mockResponse = {
      data: { name: "memos/1", content: "updated" },
    };
    mockAxiosInstance.patch.mockResolvedValue(mockResponse);

    const client = new MemoApiClient({
      baseUrl: "https://demo.usememos.com",
      accessToken: "test-token",
    });

    const response = await client.UpdateMemo({
      memo: { name: "memos/1", content: "updated" } as any, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      updateMask: ["content"],
    });

    expect(mockAxiosInstance.patch).toHaveBeenCalledWith( // eslint-disable-line @typescript-eslint/unbound-method
      "/api/v1/memos/1",
      expect.objectContaining({
        content: "updated",
      }),
    );
    expect(response.content).toBe("updated");
  });

  it("should handle DeleteMemo", async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: {} });

    const client = new MemoApiClient({
      baseUrl: "https://demo.usememos.com",
      accessToken: "test-token",
    });

    await client.DeleteMemo({ name: "memos/1" });

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/api/v1/memos/1"); // eslint-disable-line @typescript-eslint/unbound-method
  });

  it("should throw MemoApiError on API errors", async () => {
    const errorResponse = {
      response: {
        status: 404,
        data: { message: "Not found", code: "NOT_FOUND", details: "More info" },
      },
    };

    // Simulate axios behavior where interceptor is called on error
    mockAxiosInstance.get.mockImplementation(() => {
      if (interceptorErrorCallback) {
        throw interceptorErrorCallback(errorResponse); // eslint-disable-line @typescript-eslint/only-throw-error
      }
      throw errorResponse;
    });

    const client = new MemoApiClient({
      baseUrl: "https://demo.usememos.com",
      accessToken: "test-token",
    });

    try {
      await client.ListMemos({});
      expect.fail("Should have thrown MemoApiError");
    } catch (e: unknown) {
      const err = e as MemoApiError;
      expect(err).toBeInstanceOf(MemoApiError);
      expect(err.message).toBe("Not found");
      expect(err.status).toBe(404);
      expect(err.code).toBe("NOT_FOUND");
    }
  });
});

describe("MemoApiError", () => {
  it("should preserve error details", () => {
    const error = new MemoApiError("Not found", 404, "NOT_FOUND", {
      resource: "memo",
    });
    expect(error.message).toBe("Not found");
    expect(error.status).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.details).toEqual({ resource: "memo" });
    expect(error.name).toBe("MemoApiError");
  });
});
