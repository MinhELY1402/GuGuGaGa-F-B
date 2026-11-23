import test from "node:test";
import assert from "node:assert/strict";
import { validateDriverInput } from "../src/utils/driverinput.js";

const ok = { name: "A", phone: "0911111111", password: "123456", branchId: "b1" };

test("dữ liệu hợp lệ", () => assert.equal(validateDriverInput(ok), null));
test("thiếu từng trường bắt buộc khi tạo", () => {
  for (const k of ["name", "phone", "password", "branchId"]) {
    assert.ok(validateDriverInput({ ...ok, [k]: undefined }), k);
    assert.ok(validateDriverInput({ ...ok, [k]: "  " }), k);
  }
});
test("số điện thoại sai định dạng", () => {
  for (const p of ["123", "0911", "abc", "09111111111111", "9111111111"]) assert.ok(validateDriverInput({ ...ok, phone: p }), p);
  assert.equal(validateDriverInput({ ...ok, phone: "01234567890" }), null);
});
test("mật khẩu quá ngắn", () => assert.match(validateDriverInput({ ...ok, password: "12345" }), /tối thiểu/));
test("sửa: chỉ kiểm tra trường được gửi; mật khẩu rỗng nghĩa là giữ nguyên", () => {
  assert.equal(validateDriverInput({ name: "B" }, "update"), null);
  assert.equal(validateDriverInput({ password: "" }, "update"), null);
  assert.ok(validateDriverInput({ phone: "12" }, "update"));
  assert.ok(validateDriverInput({ password: "1" }, "update"));
});
