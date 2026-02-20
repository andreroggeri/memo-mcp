import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { afterAll, beforeAll } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MEMO_ACCESS_TOKEN,
  MEMO_IMAGE,
  MEMO_MODE,
  MEMO_PORT,
  MEMO_STARTUP_TIMEOUT_MS,
} from "./test-config";

export interface MemoTestContext {
  container: StartedTestContainer;
  baseUrl: string;
  accessToken: string;
  fixtureDir: string;
}

const fixtureDbPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "fixtures",
  "db",
  "memos_prod.db"
);

async function prepareFixtureDir(): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "memo-fixture-"));
  const targetDbPath = path.join(tempDir, "memos_prod.db");
  await fs.copyFile(fixtureDbPath, targetDbPath);
  return tempDir;
}

export async function startMemoContainer(): Promise<MemoTestContext> {
  const fixtureDir = await prepareFixtureDir();
  const container = await new GenericContainer(MEMO_IMAGE)
    .withExposedPorts(MEMO_PORT)
    .withEnvironment({ MEMOS_MODE: MEMO_MODE })
    .withBindMounts([{ source: fixtureDir, target: "/var/opt/memos" }])
    .withWaitStrategy(Wait.forListeningPorts())
    .withStartupTimeout(MEMO_STARTUP_TIMEOUT_MS)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(MEMO_PORT);

  return {
    container,
    baseUrl: `http://${host}:${port}`,
    accessToken: MEMO_ACCESS_TOKEN,
    fixtureDir,
  };
}

export async function stopMemoContainer(
  container: StartedTestContainer,
  fixtureDir: string,
): Promise<void> {
  await container.stop();
  await fs.rm(fixtureDir, { recursive: true, force: true });
}

export function useMemoTestContainer(): () => MemoTestContext {
  let context: MemoTestContext | undefined;

  beforeAll(async () => {
    context = await startMemoContainer();
  }, MEMO_STARTUP_TIMEOUT_MS);

  afterAll(async () => {
    if (context) {
      await stopMemoContainer(context.container, context.fixtureDir);
    }
  }, MEMO_STARTUP_TIMEOUT_MS);

  return () => {
    if (!context) {
      throw new Error("Memo test container not initialized yet.");
    }
    return context;
  };
}
