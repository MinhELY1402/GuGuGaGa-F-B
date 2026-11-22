import crypto from "crypto";

/** Cấu hình MoMo (mặc định: môi trường sandbox test-payment.momo.vn). */
export function momoConfig(env = process.env) {
  return {
    partnerCode: env.MOMO_PARTNER_CODE || "",
    accessKey: env.MOMO_ACCESS_KEY || "",
    secretKey: env.MOMO_SECRET_KEY || "",
    endpoint: env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create",
  };
}

const hmac = (raw, secret) => crypto.createHmac("sha256", secret).update(raw).digest("hex");

/** Chữ ký request tạo thanh toán (thứ tự trường theo tài liệu MoMo v2). */
export function createSignature(p, accessKey, secretKey) {
  const raw =
    `accessKey=${accessKey}&amount=${p.amount}&extraData=${p.extraData}&ipnUrl=${p.ipnUrl}` +
    `&orderId=${p.orderId}&orderInfo=${p.orderInfo}&partnerCode=${p.partnerCode}` +
    `&redirectUrl=${p.redirectUrl}&requestId=${p.requestId}&requestType=${p.requestType}`;
  return hmac(raw, secretKey);
}

/** Chữ ký kết quả thanh toán (IPN và redirect dùng chung bộ trường). */
export function resultSignature(b, accessKey, secretKey) {
  const raw =
    `accessKey=${accessKey}&amount=${b.amount}&extraData=${b.extraData ?? ""}&message=${b.message}` +
    `&orderId=${b.orderId}&orderInfo=${b.orderInfo}&orderType=${b.orderType}&partnerCode=${b.partnerCode}` +
    `&payType=${b.payType ?? ""}&requestId=${b.requestId}&responseTime=${b.responseTime}` +
    `&resultCode=${b.resultCode}&transId=${b.transId}`;
  return hmac(raw, secretKey);
}

export function verifyResult(b, accessKey, secretKey) {
  if (!b || typeof b.signature !== "string" || !secretKey) return false;
  const expected = Buffer.from(resultSignature(b, accessKey, secretKey), "utf8");
  const got = Buffer.from(b.signature, "utf8");
  return expected.length === got.length && crypto.timingSafeEqual(expected, got);
}

export const encodeExtraData = (obj) => Buffer.from(JSON.stringify(obj), "utf8").toString("base64");
export function decodeExtraData(s) {
  try { return JSON.parse(Buffer.from(String(s || ""), "base64").toString("utf8")); } catch { return {}; }
}

/** requestType theo lựa chọn của khách: ví/QR hoặc thẻ quốc tế (Visa/Master/JCB). */
export const momoRequestType = (method) => (method === "card" ? "payWithCC" : "captureWallet");
