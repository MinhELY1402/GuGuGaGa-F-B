import db from "../configs/firestore.js";
import { notificationService } from "./notification.service.js";
import { paidUpdate, toShortOrderId } from "../utils/casso.js";
import {
  momoConfig, createSignature, verifyResult, encodeExtraData, decodeExtraData, momoRequestType,
} from "../utils/momo.js";
import { checkCard, simulatorEnabled, SIM_OTP, MAX_OTP_ATTEMPTS } from "../utils/cardsim.js";
import { checkPaymentChange } from "../utils/paymentchange.js";
import { checkPayable } from "../utils/orderflow.js";
import crypto from "crypto";

const ordersRef = db.collection("orders");

const httpError = (status, message) => Object.assign(new Error(message), { status });

/** Lấy đơn và kiểm tra: tồn tại, của đúng người dùng, chưa thanh toán, chọn thanh toán online. */
async function loadPayableOrder(orderId, userId) {
  const doc = await ordersRef.doc(orderId).get();
  if (!doc.exists) throw httpError(404, "Đơn hàng không tồn tại");
  const order = doc.data();
  if (order.userId !== userId) throw httpError(403, "Không có quyền với đơn hàng này");
  const payable = checkPayable(order); // đơn đã hủy / đã trả / không còn chờ xác nhận thì không thanh toán được
  if (!payable.ok) throw httpError(payable.status, payable.error);
  if (String(order.paymentMethod).toUpperCase() !== "MOMO") throw httpError(400, "Đơn hàng không chọn thanh toán online");
  return { ref: doc.ref, order };
}

/** Đánh dấu đã thanh toán, báo cho khách (đơn vẫn chờ cửa hàng xác nhận). */
async function markPaid(orderId, order, extra, message) {
  await ordersRef.doc(orderId).update({ ...paidUpdate(order), ...extra });
  try {
    await notificationService.createNotification(order.userId, "Thanh toán thành công", message, orderId);
  } catch (err) {
    console.error("[Payment Notification Error]", err);
  }
}

// Phiên thanh toán thẻ đang chờ OTP (mô phỏng). Lưu trong bộ nhớ, chỉ giữ 4 số cuối của thẻ.
const pendingCards = new Map();
const PENDING_TTL_MS = 10 * 60 * 1000;
const sweepPending = () => {
  const now = Date.now();
  for (const [id, p] of pendingCards) if (p.expires < now) pendingCards.delete(id);
};

export const paymentService = {
  /**
   * Tạo phiên thanh toán MoMo cho một đơn MOMO đang chờ thanh toán.
   * method: "wallet" (ví MoMo / QR) | "card" (thẻ Visa/Master/JCB).
   * baseUrl: địa chỉ công khai của backend (để MoMo gọi IPN và quay về).
   */
  async createMomoPayment(orderId, userId, method, baseUrl) {
    const cfg = momoConfig();
    if (!cfg.partnerCode || !cfg.accessKey || !cfg.secretKey) {
      throw Object.assign(new Error("Chưa cấu hình MoMo (MOMO_PARTNER_CODE / MOMO_ACCESS_KEY / MOMO_SECRET_KEY)"), { status: 503 });
    }
    const { order } = await loadPayableOrder(orderId, userId);

    const requestType = momoRequestType(method);
    const momoOrderId = `GGG_${orderId}_${Date.now()}`; // MoMo yêu cầu orderId duy nhất cho mỗi lần tạo
    const p = {
      partnerCode: cfg.partnerCode,
      requestId: momoOrderId,
      orderId: momoOrderId,
      amount: String(Math.round(Number(order.totalAmount))),
      orderInfo: `GuGuGaGa - Don hang #${toShortOrderId(orderId)}`,
      redirectUrl: `${baseUrl}/api/payment/momo/return`,
      ipnUrl: `${baseUrl}/api/payment/momo/ipn`,
      extraData: encodeExtraData({ orderId }),
      requestType,
    };
    const signature = createSignature(p, cfg.accessKey, cfg.secretKey);
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, accessKey: cfg.accessKey, signature, lang: "vi" }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.resultCode !== 0 || !data.payUrl) {
      throw Object.assign(new Error(`MoMo từ chối tạo thanh toán: ${data.message || res.status}`), { status: 502 });
    }
    await ordersRef.doc(orderId).update({ momoOrderId, updatedAt: new Date() });
    return { payUrl: data.payUrl, qrCodeUrl: data.qrCodeUrl || null, deeplink: data.deeplink || null, requestType };
  },

  /**
   * Xử lý kết quả MoMo (IPN server-to-server hoặc tham số redirect).
   * Trả về { ok, paid, orderId, reason }.
   */
  async handleMomoResult(body) {
    const cfg = momoConfig();
    if (!verifyResult(body, cfg.accessKey, cfg.secretKey) || body.partnerCode !== cfg.partnerCode) {
      return { ok: false, reason: "invalid_signature" };
    }
    const { orderId } = decodeExtraData(body.extraData);
    if (!orderId) return { ok: false, reason: "missing_order" };
    const ref = ordersRef.doc(orderId);
    const doc = await ref.get();
    if (!doc.exists) return { ok: false, reason: "order_not_found" };
    const order = doc.data();

    if (Number(body.resultCode) !== 0) return { ok: true, paid: false, orderId, reason: body.message };
    if (order.paymentStatus === "PAID") return { ok: true, paid: true, orderId }; // gọi lặp: không cập nhật lần 2
    if (Number(body.amount) !== Math.round(Number(order.totalAmount))) {
      return { ok: false, orderId, reason: "amount_mismatch" };
    }

    await markPaid(
      orderId, order,
      { momoTransId: String(body.transId), momoPayType: body.payType || null },
      `Đơn hàng #${toShortOrderId(orderId)} đã được thanh toán qua MoMo. Đơn đang chờ cửa hàng xác nhận.`
    );
    return { ok: true, paid: true, orderId };
  },

  /** Đổi phương thức thanh toán cho đơn đang chờ xác nhận và chưa trả tiền. */
  async changePaymentMethod(orderId, userId, method) {
    const ref = ordersRef.doc(orderId);
    const doc = await ref.get();
    const c = checkPaymentChange(doc.exists ? doc.data() : null, userId, method);
    if (!c.ok) throw httpError(c.status, c.error);
    await ref.update({ paymentMethod: c.method, updatedAt: new Date() });
    return { id: orderId, paymentMethod: c.method };
  },

  /** Có bật cổng mô phỏng không (app dùng để hiện nút mô phỏng). */
  simulatorEnabled: () => simulatorEnabled(),

  /**
   * Mã QR hiển thị TRONG app. Ưu tiên mã thật của MoMo sandbox (quét bằng app MoMo bản test);
   * nếu MoMo không phản hồi và cổng mô phỏng đang bật thì trả mã mô phỏng.
   */
  async createQr(orderId, userId, baseUrl) {
    const { order } = await loadPayableOrder(orderId, userId);
    try {
      const r = await this.createMomoPayment(orderId, userId, "wallet", baseUrl);
      if (r.qrCodeUrl) return { source: "momo", qrContent: r.qrCodeUrl, amount: order.totalAmount, simulator: simulatorEnabled() };
    } catch (err) {
      console.warn("[createQr] MoMo không khả dụng:", err.message);
    }
    if (!simulatorEnabled()) throw httpError(502, "Không tạo được mã QR MoMo, vui lòng thử lại sau");
    return {
      source: "simulator",
      qrContent: `GUGUGAGA-SIM|${orderId}|${Math.round(Number(order.totalAmount))}`,
      amount: order.totalAmount,
      simulator: true,
    };
  },

  /** Mô phỏng: khách đã quét QR và thanh toán. Chỉ khi PAYMENT_SIMULATOR=1. */
  async simulateQrPaid(orderId, userId) {
    if (!simulatorEnabled()) throw httpError(403, "Cổng mô phỏng đang tắt");
    const { order } = await loadPayableOrder(orderId, userId);
    await markPaid(orderId, order, { paymentChannel: "SIMULATOR_QR" },
      `Đơn hàng #${toShortOrderId(orderId)} đã thanh toán bằng mã QR (mô phỏng). Đơn đang chờ cửa hàng xác nhận.`);
    return { paid: true };
  },

  /** Bước 1 thanh toán thẻ (mô phỏng): kiểm tra thẻ test, chờ nhập OTP. */
  async startCardPayment(orderId, userId, card) {
    if (!simulatorEnabled()) throw httpError(403, "Cổng mô phỏng đang tắt");
    await loadPayableOrder(orderId, userId);
    const c = checkCard(card);
    if (!c.ok) throw httpError(400, c.error);
    if (c.result === "declined") throw httpError(402, "Thẻ bị từ chối (thẻ test mô phỏng lỗi)");
    sweepPending();
    const paymentId = crypto.randomUUID();
    pendingCards.set(paymentId, {
      orderId, userId, brand: c.brand, last4: c.last4, attempts: 0, expires: Date.now() + PENDING_TTL_MS,
    });
    return { paymentId, status: "otp_required", brand: c.brand, last4: c.last4 };
  },

  /** Bước 2: nhập OTP. Đúng thì đơn được đánh dấu đã thanh toán. */
  async confirmCardPayment(orderId, userId, paymentId, otp) {
    if (!simulatorEnabled()) throw httpError(403, "Cổng mô phỏng đang tắt");
    sweepPending();
    const p = pendingCards.get(String(paymentId));
    if (!p || p.orderId !== orderId || p.userId !== userId) throw httpError(404, "Phiên thanh toán không tồn tại hoặc đã hết hạn");
    if (String(otp ?? "").trim() !== SIM_OTP) {
      p.attempts += 1;
      if (p.attempts >= MAX_OTP_ATTEMPTS) { pendingCards.delete(String(paymentId)); throw httpError(400, "Nhập sai OTP quá 3 lần, vui lòng thử lại từ đầu"); }
      throw httpError(400, `OTP không đúng (còn ${MAX_OTP_ATTEMPTS - p.attempts} lần thử)`);
    }
    const { order } = await loadPayableOrder(orderId, userId);
    pendingCards.delete(String(paymentId));
    await markPaid(orderId, order, { paymentChannel: "SIMULATOR_CARD", cardBrand: p.brand, cardLast4: p.last4 },
      `Đơn hàng #${toShortOrderId(orderId)} đã thanh toán bằng thẻ ${p.brand} •••• ${p.last4} (mô phỏng). Đơn đang chờ cửa hàng xác nhận.`);
    return { paid: true, brand: p.brand, last4: p.last4 };
  },
};
