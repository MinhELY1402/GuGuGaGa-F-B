import test from "node:test";
import assert from "node:assert/strict";
import { selectHideable } from "../src/utils/history.js";

const orders = [
  { id: "a", driverId: "d1", status: "DELIVERED" },
  { id: "b", driverId: "d1", status: "CANCELLED" },
  { id: "c", driverId: "d1", status: "DRIVER_ASSIGNED" },
  { id: "d", driverId: "d2", status: "DELIVERED" },
  { id: "e", driverId: "d1", status: "DELIVERED", hiddenByDriver: true },
];
const ids = (r) => r.map((o) => o.id);

test("all=true: chỉ đơn xong của chính tài xế và chưa ẩn", () => {
  assert.deepEqual(ids(selectHideable(orders, "d1", { all: true })), ["a", "b"]);
});
test("theo danh sách id: không ẩn được đơn đang giao hoặc của người khác", () => {
  assert.deepEqual(ids(selectHideable(orders, "d1", { ids: ["a", "c", "d"] })), ["a"]);
});
test("không truyền gì thì không ẩn đơn nào", () => {
  assert.deepEqual(selectHideable(orders, "d1", {}), []);
});
