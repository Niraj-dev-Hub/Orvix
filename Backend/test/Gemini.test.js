import test from "node:test";
import assert from "node:assert/strict";
import { retryUnavailable } from "../utils/retry.js";

test("retries Gemini 503 errors and returns a successful response", async () => {
  let calls = 0;
  const waits = [];
  const result = await retryUnavailable(async () => {
    calls += 1;
    if (calls < 3) {
      throw { status: 503 };
    }
    return "reply";
  }, async (ms) => waits.push(ms));

  assert.equal(result, "reply");
  assert.equal(calls, 3);
  assert.deepEqual(waits, [1000, 2000]);
});

test("stops retrying after three Gemini 503 errors", async () => {
  let calls = 0;
  const error = { status: 503 };

  await assert.rejects(
    retryUnavailable(async () => {
      calls += 1;
      throw error;
    }, async () => {}),
    (received) => received === error,
  );

  assert.equal(calls, 3);
});

test("does not retry non-503 errors", async () => {
  let calls = 0;
  const error = { status: 401 };

  await assert.rejects(
    retryUnavailable(async () => {
      calls += 1;
      throw error;
    }, async () => {}),
    (received) => received === error,
  );

  assert.equal(calls, 1);
});
