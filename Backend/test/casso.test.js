import assert from "node:assert/strict";
import { test } from "node:test";
import {
  extractShortOrderId,
  toShortOrderId,
  shouldMarkPaid,
  isValidCassoToken,
} from "../src/utils/casso.js";

test("extractShortOrderId đọc được mã đơn trong nội dung chuyển khoản", () => {
  assert.equal(extractShortOrderId("GUGUGAGA AB12CD34"), "AB12CD34");
  assert.equal(extractShortOrderId("ck gugugaga_ab12cd34 thanh toan"), "AB12CD34");
  assert.equal(extractShortOrderId("MBVCB.123.GUGUGAGA-AB12CD34.CT"), "AB12CD34");
});

test("extractShortOrderId trả về null khi không có cú pháp GUGUGAGA", () => {
  assert.equal(extractShortOrderId("chuyen tien an trua"), null);
  assert.equal(extractShortOrderId(""), null);
  assert.equal(extractShortOrderId(undefined), null);
  assert.equal(extractShortOrderId("GUGUGAGA AB12"), null);
});

test("toShortOrderId lấy 8 ký tự cuối, viết hoa", () => {
  assert.equal(toShortOrderId("xYz9aB12cD34"), "AB12CD34");
  assert.equal(toShortOrderId("abc"), "ABC");
});

test("shouldMarkPaid chỉ chuyển PAID khi đủ tiền và chưa thanh toán", () => {
  assert.equal(shouldMarkPaid({ paymentStatus: "UNPAID", totalAmount: 50000 }, 50000), true);
  assert.equal(shouldMarkPaid({ paymentStatus: "UNPAID", totalAmount: 50000 }, 60000), true);
  assert.equal(shouldMarkPaid({ paymentStatus: "UNPAID", totalAmount: 50000 }, 49999), false);
  // Idempotency: webhook gửi lại lần 2 không cập nhật lại
  assert.equal(shouldMarkPaid({ paymentStatus: "PAID", totalAmount: 50000 }, 50000), false);
});

test("isValidCassoToken so khớp header Secure-Token", () => {
  assert.equal(isValidCassoToken({ "secure-token": "abc" }, "abc"), true);
  assert.equal(isValidCassoToken({ "secure-token": "sai" }, "abc"), false);
  assert.equal(isValidCassoToken({}, "abc"), false);
  // Chưa cấu hình token → không chặn (dev)
  assert.equal(isValidCassoToken({}, ""), true);
});
