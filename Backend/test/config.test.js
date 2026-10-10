import test from "node:test";
import assert from "node:assert/strict";
import { validateEnvironment } from "../config.js";

const validEnvironment = {
  MONGO_URI: "mongodb://localhost/orvix",
  JWT_SECRET: "a".repeat(32),
  GEMINI_API_KEY: "test-api-key",
  NODE_ENV: "development"
};

test("accepts a complete development environment", () => {
  assert.doesNotThrow(() => validateEnvironment(validEnvironment));
});

test("reports missing required variables", () => {
  assert.throws(
    () => validateEnvironment({ ...validEnvironment, GEMINI_API_KEY: "" }),
    /GEMINI_API_KEY/
  );
});

test("rejects short JWT secrets", () => {
  assert.throws(
    () => validateEnvironment({ ...validEnvironment, JWT_SECRET: "too-short" }),
    /at least 32 characters/
  );
});

test("requires an HTTPS frontend origin in production", () => {
  const productionEnvironment = {
    ...validEnvironment,
    NODE_ENV: "production"
  };

  assert.throws(
    () => validateEnvironment(productionEnvironment),
    /CLIENT_URL is required in production/
  );
  assert.throws(
    () => validateEnvironment({
      ...productionEnvironment,
      CLIENT_URL: "http://example.com"
    }),
    /must use HTTPS/
  );
  assert.doesNotThrow(() => validateEnvironment({
    ...productionEnvironment,
    CLIENT_URL: "https://example.com"
  }));
});
