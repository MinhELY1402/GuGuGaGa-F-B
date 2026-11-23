import test from "node:test";
import assert from "node:assert/strict";
import { canDriverTakeOrder, visibleToDriver } from "../src/utils/dispatch.js";

const driver = { id: "d1", branchId: "b1" };
const order = { id: "o1", status: "ACCEPTED", branchId: "b1" };

test("đơn đã xác nhận, chưa ai nhận, cùng chi nhánh: nhận được", () => {
  assert.deepEqual(canDriverTakeOrder(order, driver), { ok: true });
});
test("đơn đã có tài xế hoặc chưa được xác nhận: không nhận được", () => {
  assert.equal(canDriverTakeOrder({ ...order, driverId: "d2" }, driver).ok, false);
  assert.equal(canDriverTakeOrder({ ...order, status: "PENDING" }, driver).ok, false);
  assert.equal(canDriverTakeOrder({ ...order, status: "DRIVER_ASSIGNED" }, driver).ok, false);
});
test("đơn của chi nhánh khác: không nhận được; tài xế chưa gán chi nhánh: nhận mọi chi nhánh", () => {
  assert.equal(canDriverTakeOrder({ ...order, branchId: "b2" }, driver).ok, false);
  assert.equal(canDriverTakeOrder({ ...order, branchId: "b2" }, { id: "d3" }).ok, true);
});
test("không có đơn hoặc tài xế", () => {
  assert.equal(canDriverTakeOrder(null, driver).ok, false);
  assert.equal(canDriverTakeOrder(order, null).ok, false);
});
test("visibleToDriver lọc đúng chi nhánh và trạng thái, không giới hạn số lượng", () => {
  const list = [order, { ...order, id: "o2", branchId: "b2" }, { ...order, id: "o3", status: "PENDING" }, { ...order, id: "o4" }];
  assert.deepEqual(visibleToDriver(list, driver).map((o) => o.id), ["o1", "o4"]);
});
