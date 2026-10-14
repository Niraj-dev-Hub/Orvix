import test from "node:test";
import assert from "node:assert/strict";
import { chatProviders, getChatResponse } from "../utils/chatModels.js";

test("exposes Gemini and Groq as the supported chat providers", () => {
  assert.deepEqual(chatProviders, ["gemini", "groq"]);
});

test("rejects unsupported chat providers", () => {
  assert.throws(
    () => getChatResponse("unsupported", "Hello"),
    /Unsupported chat provider/,
  );
});
