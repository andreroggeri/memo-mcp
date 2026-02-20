import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { afterAll, beforeAll } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MEMO_ACCESS_TOKEN,
  MEMO_DB_FILENAME,
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
  String(MEMO_DB_FILENAME)
);

const memoImage = String(MEMO_IMAGE);
const memoMode = String(MEMO_MODE);
const memoPort = Number(MEMO_PORT);
const startupTimeoutMs = Number(MEMO_STARTUP_TIMEOUT_MS);

async function prepareFixtureDir(): Promise<string> {
  await fs.access(fixtureDbPath);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "memo-fixture-"));
  const targetDbPath = path.join(tempDir, String(MEMO_DB_FILENAME));
  await fs.copyFile(fixtureDbPath, targetDbPath);
  return tempDir;
}

export async function startMemoContainer(): Promise<MemoTestContext> {
  const fixtureDir = await prepareFixtureDir();
  const container = await new GenericContainer(memoImage)
    .withExposedPorts(memoPort)
    .withEnvironment({ MEMOS_MODE: memoMode })
    .withBindMounts([{ source: fixtureDir, target: "/var/opt/memos" }])
    .withWaitStrategy(Wait.forListeningPorts())
    .withStartupTimeout(startupTimeoutMs)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(memoPort);

  return {
    container,
    baseUrl: `http://${host}:${port}`,
    accessToken: String(MEMO_ACCESS_TOKEN),
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
  }, startupTimeoutMs);

  afterAll(async () => {
    if (context) {
      await stopMemoContainer(context.container, context.fixtureDir);
    }
  }, startupTimeoutMs);

  return () => {
    if (!context) {
      throw new Error(
        "Memo test container is not available. This may happen if tests access the context before beforeAll has completed, or if the container failed to start in beforeAll. Check that startMemoContainer ran successfully and that the container started without errors."
      );
    }
    return context;
  };
}
