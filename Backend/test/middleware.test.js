import assert from "node:assert/strict";
import { test } from "node:test";
import { checkRole } from "../src/middleware/checkRole.midlleware.js";

function run(mw, req) {
  const out = { status: null, body: null, nextCalled: false };
  const res = {
    status(code) { out.status = code; return this; },
    json(body) { out.body = body; return this; },
  };
  mw(req, res, () => { out.nextCalled = true; });
  return out;
}

test("checkRole cho phép đúng role", () => {
  const out = run(checkRole("ADMIN"), { user: { role: "ADMIN" } });
  assert.equal(out.nextCalled, true);
});

test("checkRole chặn role khác → 403", () => {
  const out = run(checkRole("ADMIN"), { user: { role: "CUSTOMER" } });
  assert.equal(out.status, 403);
  assert.equal(out.nextCalled, false);
});

test("checkRole chặn khi chưa có user → 401", () => {
  const out = run(checkRole("ADMIN"), {});
  assert.equal(out.status, 401);
});
