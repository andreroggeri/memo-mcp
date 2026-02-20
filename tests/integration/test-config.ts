export const MEMO_IMAGE =
  process.env.MEMO_TEST_IMAGE ?? "neosmemo/memos:stable";
export const MEMO_PORT = Number(process.env.MEMO_TEST_PORT ?? 5230);
export const MEMO_MODE = process.env.MEMO_TEST_MODE ?? "prod";
export const MEMO_STARTUP_TIMEOUT_MS = Number(
  process.env.MEMO_TEST_STARTUP_TIMEOUT_MS ?? 120000,
);
// This is a token created to use for testing. it is only used to access the test instance.
export const MEMO_ACCESS_TOKEN = "memos_pat_mBiAEFKTatCqn8SbGCpK2Gj8jc4HCiDa";
