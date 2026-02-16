# Quickstart: Memo API Client Generation

## Prerequisites
- `protoc` installed locally.
- Node.js and `npm` installed.

## 1. Fetch Protobuf Files
Run the fetch script (to be implemented):
```bash
./scripts/fetch-protos.sh
```
This will download `memo_service.proto` and dependencies into `proto/api/v1/`.

## 2. Generate Client
Run the generation command:
```bash
npm run gen:api
```
This uses `ts-proto` to generate the TypeScript client in `src/gen/`.

## 3. Usage in Code
```typescript
import { MemoServiceClientImpl } from "./gen/api/v1/memo_service";
import { MemosRpcAdapter } from "./memo-api-client";

const rpc = new MemosRpcAdapter({
  baseUrl: "https://your-memos-instance.com",
  accessToken: "your-token"
});

const client = new MemoServiceClientImpl(rpc);

// Example: List memos
const response = await client.ListMemos({ parent: "users/me" });
console.log(response.memos);
```
