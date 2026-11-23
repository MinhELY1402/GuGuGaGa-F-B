/**
 * Tự chấp nhận đơn khi DEMO (bật bằng AUTO_ACCEPT_DEMO=giây, ví dụ 30).
 * Mô phỏng bước "cửa hàng xác nhận" để không phải mở trang admin mỗi lần thử.
 * Điều kiện: đơn đang PENDING, đã quá số giây chờ, và (đơn COD hoặc đã thanh toán).
 * Đơn online chưa trả tiền KHÔNG bao giờ được tự chấp nhận.
 */
export const autoAcceptSeconds = (env = process.env) => {
  const n = Number(env.AUTO_ACCEPT_DEMO);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function shouldAutoAccept(order, now = new Date(), seconds = autoAcceptSeconds()) {
  if (!seconds || order?.status !== "PENDING") return false;
  const online = ["BANKING", "MOMO"].includes(String(order.paymentMethod).toUpperCase());
  if (online && order.paymentStatus !== "PAID") return false;
  const created = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
  const paidAt = order.updatedAt?.toDate ? order.updatedAt.toDate() : new Date(order.updatedAt ?? created);
  const since = online ? paidAt : created; // đơn online tính từ lúc thanh toán
  return now - since >= seconds * 1000;
}
