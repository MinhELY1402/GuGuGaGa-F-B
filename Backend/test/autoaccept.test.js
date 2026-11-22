import test from "node:test";
import assert from "node:assert/strict";
import { shouldAutoAccept, autoAcceptSeconds } from "../src/utils/autoaccept.js";

const t0 = new Date("2026-01-01T00:00:00Z");
const at = (s) => new Date(t0.getTime() + s * 1000);

test("autoAcceptSeconds: mặc định tắt", () => {
  assert.equal(autoAcceptSeconds({}), 0);
  assert.equal(autoAcceptSeconds({ AUTO_ACCEPT_DEMO: "abc" }), 0);
  assert.equal(autoAcceptSeconds({ AUTO_ACCEPT_DEMO: "30" }), 30);
});

test("tắt thì không bao giờ tự chấp nhận", () => {
  assert.equal(shouldAutoAccept({ status: "PENDING", paymentMethod: "COD", createdAt: t0 }, at(999), 0), false);
});

test("COD: chấp nhận sau đủ thời gian, chưa đủ thì chưa", () => {
  const o = { status: "PENDING", paymentMethod: "COD", createdAt: t0 };
  assert.equal(shouldAutoAccept(o, at(29), 30), false);
  assert.equal(shouldAutoAccept(o, at(30), 30), true);
});

test("Online chưa trả tiền không bao giờ được tự chấp nhận", () => {
  const o = { status: "PENDING", paymentMethod: "MOMO", paymentStatus: undefined, createdAt: t0 };
  assert.equal(shouldAutoAccept(o, at(9999), 30), false);
});

test("Online đã trả: tính thời gian từ lúc thanh toán", () => {
  const o = { status: "PENDING", paymentMethod: "MOMO", paymentStatus: "PAID", createdAt: t0, updatedAt: at(100) };
  assert.equal(shouldAutoAccept(o, at(120), 30), false);
  assert.equal(shouldAutoAccept(o, at(130), 30), true);
});

test("Đơn không còn PENDING thì bỏ qua", () => {
  assert.equal(shouldAutoAccept({ status: "CANCELLED", paymentMethod: "COD", createdAt: t0 }, at(999), 30), false);
});
