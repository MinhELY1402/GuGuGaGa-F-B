/**
 * Tiện ích thuần (không phụ thuộc Firestore) cho đối soát Casso — tách ra để kiểm thử.
 */

/** Trích mã đơn rút gọn (8 ký tự cuối của orderId) từ nội dung chuyển khoản "GUGUGAGA <id>". */
export function extractShortOrderId(description) {
  const normalized = String(description || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = normalized.match(/GUGUGAGA([A-Z0-9]{8})/);
  return match ? match[1] : null;
}

/** Mã rút gọn tương ứng của một orderId Firestore. */
export function toShortOrderId(orderId) {
  const id = String(orderId);
  return (id.length > 8 ? id.substring(id.length - 8) : id).toUpperCase();
}

/** Giao dịch có đủ điều kiện chuyển đơn sang PAID không (chưa PAID và đủ tiền). */
export function shouldMarkPaid(order, amount) {
  return order.paymentStatus !== "PAID" && Number(amount) >= Number(order.totalAmount);
}

/**
 * Xác thực Secure-Token của webhook Casso.
 * Nếu chưa cấu hình CASSO_SECURE_TOKEN thì bỏ qua (môi trường dev).
 */
export function isValidCassoToken(headers, expected = process.env.CASSO_SECURE_TOKEN) {
  if (!expected) return true;
  const received = headers?.["secure-token"] ?? headers?.["Secure-Token"];
  return received === expected;
}

/**
 * Trạng thái ban đầu của đơn: MỌI đơn đều vào "Chờ xác nhận" (PENDING),
 * cửa hàng/admin xác nhận thì mới chuyển sang ACCEPTED để tài xế nhận đơn.
 * Thanh toán (paymentStatus) tách riêng khỏi trạng thái xử lý đơn.
 */
export function initialOrderStatus(_paymentMethod) {
  return "PENDING";
}

/** Dữ liệu cập nhật khi xác nhận đã thanh toán: chỉ đổi paymentStatus, KHÔNG tự chấp nhận đơn. */
export function paidUpdate(_order, now = new Date()) {
  return { paymentStatus: "PAID", updatedAt: now };
}
