import assert from "node:assert/strict";
import { test } from "node:test";
import { luhnValid, expiryValid, cvvValid, checkCard, simulatorEnabled, TEST_CARDS } from "../src/utils/cardsim.js";

const NOW = new Date(2026, 10, 22); // 22/11/2026
const good = { number: "4111 1111 1111 1111", expiry: "12/30", cvv: "123", name: "NGUYEN VAN A" };

test("Luhn: thẻ test hợp lệ, số bị sai một chữ số thì không", () => {
  for (const n of Object.keys(TEST_CARDS)) assert.equal(luhnValid(n), true, n);
  assert.equal(luhnValid("4111111111111112"), false);
  assert.equal(luhnValid("abc"), false);
  assert.equal(luhnValid(""), false);
});

test("expiryValid: còn hạn đến hết tháng ghi trên thẻ", () => {
  assert.equal(expiryValid("11/26", NOW), true);   // tháng hiện tại vẫn còn hạn
  assert.equal(expiryValid("10/26", NOW), false);  // tháng trước
  assert.equal(expiryValid("12/30", NOW), true);
  assert.equal(expiryValid("13/30", NOW), false);  // tháng không tồn tại
  assert.equal(expiryValid("1230", NOW), false);
});

test("cvvValid: đúng 3 chữ số", () => {
  assert.equal(cvvValid("123"), true);
  assert.equal(cvvValid("12"), false);
  assert.equal(cvvValid("12a"), false);
});

test("checkCard: thẻ test Visa hợp lệ, trả về hãng và 4 số cuối", () => {
  const r = checkCard(good, NOW);
  assert.equal(r.ok, true);
  assert.equal(r.brand, "Visa");
  assert.equal(r.last4, "1111");
  assert.equal(r.result, "ok");
});

test("checkCard: thẻ Mastercard test và thẻ test bị từ chối", () => {
  assert.equal(checkCard({ ...good, number: "5555555555554444" }, NOW).brand, "Mastercard");
  assert.equal(checkCard({ ...good, number: "4000000000000002" }, NOW).result, "declined");
});

test("checkCard: TỪ CHỐI số thẻ không nằm trong danh sách thẻ test (kể cả số hợp lệ Luhn)", () => {
  // 4242424242424242 hợp lệ Luhn nhưng không phải thẻ test của cổng này → coi như thẻ thật
  const r = checkCard({ ...good, number: "4242 4242 4242 4242" }, NOW);
  assert.equal(r.ok, false);
  assert.match(r.error, /thẻ test/);
  assert.equal("last4" in r, false); // không lộ thông tin thẻ trong kết quả lỗi
});

test("checkCard: báo lỗi thiếu hoặc sai hạn, CVV, tên chủ thẻ", () => {
  assert.equal(checkCard({ ...good, expiry: "01/20" }, NOW).ok, false);
  assert.equal(checkCard({ ...good, cvv: "1" }, NOW).ok, false);
  assert.equal(checkCard({ ...good, name: "  " }, NOW).ok, false);
  assert.equal(checkCard({}, NOW).ok, false);
});

test("simulatorEnabled: mặc định TẮT, chỉ bật khi PAYMENT_SIMULATOR=1", () => {
  assert.equal(simulatorEnabled({}), false);
  assert.equal(simulatorEnabled({ PAYMENT_SIMULATOR: "0" }), false);
  assert.equal(simulatorEnabled({ PAYMENT_SIMULATOR: "1" }), true);
});
