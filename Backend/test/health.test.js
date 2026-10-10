import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { app } from "../app.js";

test("health endpoint reports when the database is not connected", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    status: "not_ready",
    database: "disconnected"
  });
});
