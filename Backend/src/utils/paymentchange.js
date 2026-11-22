/**
 * Đổi phương thức thanh toán của một đơn đã tạo nhưng chưa trả tiền
 * (vd. khách thoát màn thanh toán, giỏ hàng đã bị xoá nên không đặt lại được).
 */
export const PAYMENT_METHODS = ["COD", "BANKING", "MOMO"];

/** @returns {{ok:true, method:string} | {ok:false, status:number, error:string}} */
export function checkPaymentChange(order, userId, method) {
  const m = String(method ?? "").toUpperCase();
  if (!PAYMENT_METHODS.includes(m)) return { ok: false, status: 400, error: "Phương thức thanh toán không hợp lệ" };
  if (!order) return { ok: false, status: 404, error: "Đơn hàng không tồn tại" };
  if (order.userId !== userId) return { ok: false, status: 403, error: "Không có quyền với đơn hàng này" };
  if (order.paymentStatus === "PAID") return { ok: false, status: 409, error: "Đơn hàng đã thanh toán, không thể đổi phương thức" };
  if (order.status !== "PENDING") return { ok: false, status: 409, error: "Chỉ đổi được phương thức khi đơn đang chờ xác nhận" };
  return { ok: true, method: m };
}
