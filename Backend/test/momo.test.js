import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createSignature, resultSignature, verifyResult, encodeExtraData, decodeExtraData, momoRequestType,
} from "../src/utils/momo.js";
import { initialOrderStatus } from "../src/utils/casso.js";

const AK = "test-access", SK = "test-secret";
const result = (over = {}) => {
  const b = { partnerCode: "MOMO", orderId: "GGG_abc_1", requestId: "GGG_abc_1", amount: "50000", orderInfo: "x",
    orderType: "momo_wallet", transId: "123", resultCode: 0, message: "Thành công.", payType: "qr",
    responseTime: 1700000000000, extraData: encodeExtraData({ orderId: "abc" }), ...over };
  b.signature = resultSignature(b, AK, SK);
  return b;
};

test("createSignature: HMAC-SHA256 hex 64 ký tự, đổi tham số thì đổi chữ ký", () => {
  const p = { amount: "50000", extraData: "", ipnUrl: "https://a/ipn", orderId: "o1", orderInfo: "i",
    partnerCode: "MOMO", redirectUrl: "https://a/r", requestId: "o1", requestType: "captureWallet" };
  const s1 = createSignature(p, AK, SK);
  assert.match(s1, /^[0-9a-f]{64}$/);
  assert.notEqual(s1, createSignature({ ...p, amount: "50001" }, AK, SK));
});

test("verifyResult: chấp nhận chữ ký đúng, từ chối dữ liệu bị sửa hoặc sai khoá", () => {
  const b = result();
  assert.equal(verifyResult(b, AK, SK), true);
  assert.equal(verifyResult({ ...b, amount: "1" }, AK, SK), false);
  assert.equal(verifyResult(b, AK, "wrong"), false);
  assert.equal(verifyResult({ ...b, signature: undefined }, AK, SK), false);
});

test("extraData mang orderId của GuGuGaGa và đọc lại được", () => {
  assert.deepEqual(decodeExtraData(encodeExtraData({ orderId: "abc" })), { orderId: "abc" });
  assert.deepEqual(decodeExtraData("không-phải-base64-json"), {});
});

test("momoRequestType: thẻ → payWithCC, mặc định → captureWallet (ví/QR)", () => {
  assert.equal(momoRequestType("card"), "payWithCC");
  assert.equal(momoRequestType("wallet"), "captureWallet");
  assert.equal(momoRequestType(undefined), "captureWallet");
});

test("Đơn MOMO bắt đầu ở PENDING như chuyển khoản", () => {
  assert.equal(initialOrderStatus("MOMO"), "PENDING");
});
