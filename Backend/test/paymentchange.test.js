import test from "node:test";
import assert from "node:assert/strict";
import { checkPaymentChange } from "../src/utils/paymentchange.js";

const order = { userId: "u1", status: "PENDING", paymentMethod: "MOMO" };

test("đơn chờ xác nhận, chưa trả: đổi được (không phân biệt hoa thường)", () => {
  assert.deepEqual(checkPaymentChange(order, "u1", "cod"), { ok: true, method: "COD" });
  assert.equal(checkPaymentChange(order, "u1", "BANKING").ok, true);
});
test("phương thức lạ bị từ chối", () => {
  assert.equal(checkPaymentChange(order, "u1", "PAYPAL").status, 400);
  assert.equal(checkPaymentChange(order, "u1", undefined).status, 400);
});
test("không có đơn → 404; đơn của người khác → 403", () => {
  assert.equal(checkPaymentChange(null, "u1", "COD").status, 404);
  assert.equal(checkPaymentChange(order, "u2", "COD").status, 403);
});
test("đơn đã thanh toán không đổi được → 409", () => {
  assert.equal(checkPaymentChange({ ...order, paymentStatus: "PAID" }, "u1", "COD").status, 409);
});
test("đơn đã được xác nhận thì không đổi được → 409", () => {
  assert.equal(checkPaymentChange({ ...order, status: "ACCEPTED" }, "u1", "COD").status, 409);
});
