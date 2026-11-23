import test from "node:test";
import assert from "node:assert/strict";
import { checkTransition, checkAssign, checkPayable, TRANSITIONS } from "../src/utils/orderflow.js";

const admin = { role: "ADMIN" };
const o = (extra = {}) => ({ userId: "u1", status: "PENDING", paymentMethod: "COD", ...extra });

test("admin: các bước hợp lệ theo bảng", () => {
  assert.equal(checkTransition(o(), "ACCEPTED", admin).ok, true);
  assert.equal(checkTransition(o({ status: "ACCEPTED" }), "DRIVER_ASSIGNED", admin).status, 409); // phải giao qua chức năng giao tài xế
  assert.equal(checkTransition(o({ status: "DRIVER_ASSIGNED" }), "DELIVERED", admin).ok, true);
  for (const s of ["PENDING", "ACCEPTED", "DRIVER_ASSIGNED"]) assert.equal(checkTransition(o({ status: s }), "CANCELLED", admin).ok, true, s);
});
test("admin: không nhảy cóc, không đi lùi, trạng thái cuối không đổi", () => {
  assert.equal(checkTransition(o(), "DELIVERED", admin).status, 409);
  assert.equal(checkTransition(o({ status: "ACCEPTED" }), "PENDING", admin).status, 409);
  for (const s of ["DELIVERED", "CANCELLED"]) for (const to of Object.keys(TRANSITIONS)) assert.equal(checkTransition(o({ status: s }), to, admin).ok, false, `${s}->${to}`);
});
test("#1 đơn online chưa trả tiền không được xác nhận; trả rồi thì được; COD không cần", () => {
  for (const m of ["MOMO", "BANKING"]) {
    assert.match(checkTransition(o({ paymentMethod: m }), "ACCEPTED", admin).error, /chưa được thanh toán/);
    assert.equal(checkTransition(o({ paymentMethod: m, paymentStatus: "PAID" }), "ACCEPTED", admin).ok, true);
  }
  assert.equal(checkTransition(o({ paymentMethod: "COD" }), "ACCEPTED", admin).ok, true);
});
test("#1 đơn online chưa trả vẫn hủy được", () => {
  assert.equal(checkTransition(o({ paymentMethod: "MOMO" }), "CANCELLED", admin).ok, true);
});
test("trạng thái lạ và đơn không tồn tại", () => {
  assert.equal(checkTransition(o(), "SHIPPING", admin).status, 400);
  assert.equal(checkTransition(null, "ACCEPTED", admin).status, 404);
});
test("tài xế: chỉ đơn của mình và chỉ hoàn thành/hủy", () => {
  const d = { role: "DRIVER", id: "d1" };
  const mine = o({ status: "DRIVER_ASSIGNED", driverId: "d1" });
  assert.equal(checkTransition(mine, "DELIVERED", d).ok, true);
  assert.equal(checkTransition(mine, "CANCELLED", d).ok, true);
  assert.equal(checkTransition({ ...mine, driverId: "d2" }, "DELIVERED", d).status, 403);
  assert.equal(checkTransition(mine, "ACCEPTED", d).status, 403);
  assert.equal(checkTransition(o({ status: "ACCEPTED", driverId: "d1" }), "DELIVERED", d).status, 409); // chưa ở bước đang giao
});
test("#4 khách: chỉ hủy đơn của mình khi còn Chờ xác nhận", () => {
  const c = { role: "CUSTOMER", id: "u1" };
  assert.equal(checkTransition(o(), "CANCELLED", c).ok, true);
  assert.equal(checkTransition(o(), "CANCELLED", { role: "CUSTOMER", id: "u2" }).status, 403);
  assert.equal(checkTransition(o(), "ACCEPTED", c).status, 403);
  for (const s of ["ACCEPTED", "DRIVER_ASSIGNED", "DELIVERED", "CANCELLED"]) assert.equal(checkTransition(o({ status: s }), "CANCELLED", c).status, 409, s);
});
test("giao tài xế: cần đơn đã xác nhận và chưa có tài xế", () => {
  assert.equal(checkAssign(o({ status: "ACCEPTED" })).ok, true);
  assert.equal(checkAssign(o()).status, 409);
  assert.equal(checkAssign(o({ status: "ACCEPTED", driverId: "d1" })).status, 409);
});
test("#2 đơn đã hủy hoặc đã trả không thanh toán được", () => {
  assert.equal(checkPayable(o({ paymentMethod: "MOMO" })).ok, true);
  assert.match(checkPayable(o({ status: "CANCELLED" })).error, /đã bị hủy/);
  assert.equal(checkPayable(o({ status: "ACCEPTED" })).status, 409);
  assert.equal(checkPayable(o({ paymentStatus: "PAID" })).status, 409);
});

test("đặt 'Đang giao' trực tiếp luôn bị từ chối, kể cả khi đơn đã có tài xế", () => {
  assert.match(checkTransition(o({ status: "ACCEPTED" }), "DRIVER_ASSIGNED", admin).error, /giao tài xế/);
  assert.equal(checkTransition(o({ status: "ACCEPTED", driverId: "d1" }), "DRIVER_ASSIGNED", admin).ok, false);
});
