import test from "node:test";
import assert from "node:assert/strict";
import getGroqResponse from "../utils/Groq.js";

test("sends a chat completion request to Groq and returns its response", async (t) => {
  const previousApiKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = "test-groq-key";
  t.after(() => {
    if (previousApiKey === undefined) {
      delete process.env.GROQ_API_KEY;
    } else {
      process.env.GROQ_API_KEY = previousApiKey;
    }
  });

  let request;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Groq reply" } }],
      }),
    };
  });

  assert.equal(await getGroqResponse("Hello"), "Groq reply");
  assert.equal(request.url, "https://api.groq.com/openai/v1/chat/completions");
  assert.equal(request.options.headers.Authorization, "Bearer test-groq-key");
  assert.deepEqual(JSON.parse(request.options.body).messages.at(-1), {
    role: "user",
    content: "Hello",
  });
});

test("preserves Groq API status errors for the chat route", async (t) => {
  const previousApiKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = "test-groq-key";
  t.after(() => {
    if (previousApiKey === undefined) {
      delete process.env.GROQ_API_KEY;
    } else {
      process.env.GROQ_API_KEY = previousApiKey;
    }
  });

  t.mock.method(globalThis, "fetch", async () => ({
    ok: false,
    status: 429,
    json: async () => ({ error: { message: "Rate limit reached" } }),
  }));

  await assert.rejects(
    getGroqResponse("Hello"),
    (error) => error.status === 429 && error.message === "Rate limit reached",
  );
});
