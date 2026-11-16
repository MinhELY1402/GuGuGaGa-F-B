import db from "../configs/firestore.js";
import { notificationService } from "./notification.service.js";
import { paidUpdate, toShortOrderId } from "../utils/casso.js";
import {
  momoConfig, createSignature, verifyResult, encodeExtraData, decodeExtraData, momoRequestType,
} from "../utils/momo.js";

const ordersRef = db.collection("orders");

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
    const doc = await ordersRef.doc(orderId).get();
    if (!doc.exists) throw Object.assign(new Error("Đơn hàng không tồn tại"), { status: 404 });
    const order = doc.data();
    if (order.userId !== userId) throw Object.assign(new Error("Không có quyền với đơn hàng này"), { status: 403 });
    if (order.paymentStatus === "PAID") throw Object.assign(new Error("Đơn hàng đã được thanh toán"), { status: 409 });
    if (String(order.paymentMethod).toUpperCase() !== "MOMO") {
      throw Object.assign(new Error("Đơn hàng không chọn thanh toán MoMo"), { status: 400 });
    }

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

    await ref.update({ ...paidUpdate(order), momoTransId: String(body.transId), momoPayType: body.payType || null });
    try {
      await notificationService.createNotification(
        order.userId,
        "Thanh toán MoMo thành công",
        `Đơn hàng #${toShortOrderId(orderId)} đã được thanh toán qua MoMo. Cửa hàng đang chuẩn bị món ăn!`,
        orderId
      );
    } catch (err) {
      console.error("[MoMo Notification Error]", err);
    }
    return { ok: true, paid: true, orderId };
  },
};
