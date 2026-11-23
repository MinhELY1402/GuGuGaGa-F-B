import test from "node:test";
import assert from "node:assert/strict";
import { checkPaymentAccess, checkManualConfirm, payTimeoutMinutes, shouldExpire } from "../src/utils/paymentguard.js";

const order = { userId: "u1", status: "PENDING", paymentMethod: "BANKING" };
const t0 = new Date("2026-01-01T00:00:00Z");
const at = (min) => new Date(t0.getTime() + min * 60000);

test("chỉ chủ đơn mới kiểm tra/xác nhận thanh toán", () => {
  assert.equal(checkPaymentAccess(order, "u1").ok, true);
  assert.equal(checkPaymentAccess(order, "u2").status, 403);
  assert.equal(checkPaymentAccess(null, "u1").status, 404);
});
test("xác nhận thủ công bị chặn khi KHÔNG ở chế độ demo (tiền thật)", () => {
  assert.equal(checkManualConfirm(order, false).status, 403);
  assert.equal(checkManualConfirm(order, true).ok, true);
});
test("xác nhận thủ công chỉ cho đơn online", () => {
  assert.equal(checkManualConfirm({ ...order, paymentMethod: "COD" }, true).status, 400);
  assert.equal(checkManualConfirm({ ...order, paymentMethod: "MOMO" }, true).ok, true);
});
test("payTimeoutMinutes: mặc định 30, 0 hoặc sai thì tắt", () => {
  assert.equal(payTimeoutMinutes({}), 30);
  assert.equal(payTimeoutMinutes({ ORDER_PAY_TIMEOUT_MIN: "15" }), 15);
  assert.equal(payTimeoutMinutes({ ORDER_PAY_TIMEOUT_MIN: "0" }), 0);
  assert.equal(payTimeoutMinutes({ ORDER_PAY_TIMEOUT_MIN: "abc" }), 0);
});
test("shouldExpire: chỉ đơn online chờ xác nhận, chưa trả, quá hạn", () => {
  const o = { ...order, createdAt: t0 };
  assert.equal(shouldExpire(o, at(29), 30), false);
  assert.equal(shouldExpire(o, at(30), 30), true);
  assert.equal(shouldExpire({ ...o, paymentMethod: "COD" }, at(999), 30), false);
  assert.equal(shouldExpire({ ...o, paymentStatus: "PAID" }, at(999), 30), false);
  assert.equal(shouldExpire({ ...o, status: "ACCEPTED" }, at(999), 30), false);
  assert.equal(shouldExpire(o, at(999), 0), false);
});
