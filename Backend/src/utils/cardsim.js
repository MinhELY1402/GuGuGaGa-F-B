/**
 * Cổng thanh toán MÔ PHỎNG (chỉ dùng khi demo, bật bằng PAYMENT_SIMULATOR=1).
 *
 * An toàn cho người dùng: cổng chỉ chấp nhận một số thẻ TEST công khai. Mọi số thẻ khác
 * (kể cả thẻ thật) bị từ chối ngay ở bước kiểm tra, không được lưu và không được ghi log.
 */

export const SIM_OTP = "123456";
export const MAX_OTP_ATTEMPTS = 3;

/** Thẻ test công khai và kết quả mô phỏng. */
export const TEST_CARDS = {
  "4111111111111111": { brand: "Visa", result: "ok" },
  "5555555555554444": { brand: "Mastercard", result: "ok" },
  "4000000000000002": { brand: "Visa", result: "declined" },
};

export const digitsOnly = (s) => String(s ?? "").replace(/\D/g, "");

/** Thuật toán Luhn: kiểm tra chữ số cuối của số thẻ. */
export function luhnValid(number) {
  const d = digitsOnly(number);
  if (d.length < 12 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

/** "MM/YY" còn hạn (hết hạn vào cuối tháng đó). */
export function expiryValid(expiry, now = new Date()) {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(String(expiry ?? "").trim());
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 1); // ngày 1 tháng kế tiếp
  return endOfMonth > now;
}

export const cvvValid = (cvv) => /^\d{3}$/.test(String(cvv ?? "").trim());

/**
 * Kiểm tra thông tin thẻ nhập vào.
 * @returns {{ok:true, brand:string, last4:string, result:"ok"|"declined"} | {ok:false, error:string}}
 */
export function checkCard({ number, expiry, cvv, name } = {}, now = new Date()) {
  const d = digitsOnly(number);
  if (!luhnValid(d)) return { ok: false, error: "Số thẻ không hợp lệ" };
  const test = TEST_CARDS[d];
  if (!test) {
    return { ok: false, error: "Đây là cổng thử nghiệm: chỉ chấp nhận thẻ test, không nhập thẻ thật" };
  }
  if (!expiryValid(expiry, now)) return { ok: false, error: "Ngày hết hạn không hợp lệ (định dạng MM/YY, còn hạn)" };
  if (!cvvValid(cvv)) return { ok: false, error: "CVV gồm 3 chữ số" };
  if (!String(name ?? "").trim()) return { ok: false, error: "Vui lòng nhập tên chủ thẻ" };
  return { ok: true, brand: test.brand, last4: d.slice(-4), result: test.result };
}

export const simulatorEnabled = (env = process.env) => String(env.PAYMENT_SIMULATOR || "") === "1";
