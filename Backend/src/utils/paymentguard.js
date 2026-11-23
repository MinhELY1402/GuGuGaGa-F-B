/**
 * Bảo vệ đường "xác nhận đã thanh toán" (check-payment) và hết hạn thanh toán.
 *
 * - Mọi lần kiểm tra thanh toán phải do CHỦ ĐƠN gọi.
 * - Xác nhận thủ công ("Tôi đã chuyển khoản", force=true) KHÔNG đối soát tiền thật, nên chỉ chạy ở chế độ demo
 *   (PAYMENT_SIMULATOR=1). Khi tiền thật (Casso) thì chỉ webhook/đối soát mới được đánh dấu đã trả.
 * - Đơn đã hủy (hoặc không còn chờ xác nhận) không được đánh dấu đã trả bằng đường này.
 */
export function checkPaymentAccess(order, userId) {
  if (!order) return { ok: false, status: 404, error: "Đơn hàng không tồn tại" };
  if (order.userId !== userId) return { ok: false, status: 403, error: "Không có quyền với đơn hàng này" };
  return { ok: true };
}

export function checkManualConfirm(order, simulator) {
  if (!simulator) return { ok: false, status: 403, error: "Xác nhận thủ công chỉ dùng ở chế độ demo. Vui lòng chuyển khoản, hệ thống sẽ tự đối soát" };
  if (!["BANKING", "MOMO"].includes(String(order.paymentMethod).toUpperCase())) {
    return { ok: false, status: 400, error: "Đơn hàng không chọn thanh toán online" };
  }
  return { ok: true };
}

/** Số phút chờ thanh toán trước khi đơn online tự hủy. Mặc định 30; đặt 0 để tắt. */
export const payTimeoutMinutes = (env = process.env) => {
  if (env.ORDER_PAY_TIMEOUT_MIN === undefined || env.ORDER_PAY_TIMEOUT_MIN === "") return 30;
  const n = Number(env.ORDER_PAY_TIMEOUT_MIN);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** Đơn online còn chờ xác nhận, chưa trả tiền và quá hạn thanh toán thì tự hủy. */
export function shouldExpire(order, now = new Date(), minutes = payTimeoutMinutes()) {
  if (!minutes || order?.status !== "PENDING") return false;
  if (!["BANKING", "MOMO"].includes(String(order.paymentMethod).toUpperCase())) return false;
  if (order.paymentStatus === "PAID") return false;
  const created = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
  return now - created >= minutes * 60 * 1000;
}
