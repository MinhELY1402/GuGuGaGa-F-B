import assert from "node:assert/strict";
import { test, before } from "node:test";
import request from "supertest";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.CASSO_SECURE_TOKEN = "casso-test-token";
process.env.FIREBASE_SERVICE_ACCOUNT_PATH = "./__no_service_account__.json";

let app;
before(async () => {
  ({ default: app } = await import("../src/app.js"));
});

test("GET /health trả về 200", async () => {
  const res = await request(app).get("/health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: "ok" });
});

test("Route khách hàng cần đăng nhập → 401 khi không có token", async () => {
  for (const path of ["/api/user/orders", "/api/user/carts", "/api/user/notifications"]) {
    const res = await request(app).get(path);
    assert.equal(res.status, 401, path);
    assert.equal(res.body.success, false);
  }
});

test("Route admin cần đăng nhập → 401 khi không có token", async () => {
  for (const path of ["/api/admin/products", "/api/admin/orders", "/api/admin/dashboard"]) {
    const res = await request(app).get(path);
    assert.equal(res.status, 401, path);
  }
});

test("Token JWT sai chữ ký → 401", async () => {
  const forged = jwt.sign({ userId: "u1", role: "ADMIN" }, "wrong-secret");
  const res = await request(app)
    .get("/api/admin/orders")
    .set("Authorization", `Bearer ${forged}`);
  assert.equal(res.status, 401);
});

test("Route shipper cần token tài xế → 401 khi không có token", async () => {
  const res = await request(app).get("/api/shipper/orders/available");
  assert.equal(res.status, 401);
});

test("Webhook Casso từ chối request sai Secure-Token → 401", async () => {
  const res = await request(app)
    .post("/api/user/orders/webhook-casso")
    .set("Secure-Token", "sai-token")
    .send({ data: [] });
  assert.equal(res.status, 401);
});

test("Webhook Casso với token đúng nhưng payload sai định dạng → success=false", async () => {
  const res = await request(app)
    .post("/api/user/orders/webhook-casso")
    .set("Secure-Token", "casso-test-token")
    .send({ foo: "bar" });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, false);
});

test("Webhook Casso: giao dịch không có cú pháp GUGUGAGA không đụng tới DB", async () => {
  const res = await request(app)
    .post("/api/user/orders/webhook-casso")
    .set("Secure-Token", "casso-test-token")
    .send({ data: [{ description: "chuyen tien an trua", amount: 50000 }] });
  assert.equal(res.status, 200);
  assert.equal(res.body.results[0].status, "NO_MATCHING_DESCRIPTION");
});
