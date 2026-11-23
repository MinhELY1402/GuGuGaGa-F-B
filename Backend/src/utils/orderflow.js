/**
 * Luồng trạng thái đơn hàng (dùng chung cho khách, admin và tài xế).
 *
 *   PENDING ──> ACCEPTED ──> DRIVER_ASSIGNED ──> DELIVERED
 *      │            │               │
 *      └────────────┴───────────────┴──> CANCELLED      (DELIVERED và CANCELLED là trạng thái cuối)
 *
 * - Admin: xác nhận / hủy / giao tài xế theo bảng; đơn online CHƯA thanh toán không được xác nhận.
 * - Tài xế: chỉ đơn của mình, DRIVER_ASSIGNED -> DELIVERED hoặc CANCELLED.
 * - Khách: chỉ hủy đơn của mình khi còn PENDING (cửa hàng chưa xác nhận).
 */
export const ORDER_STATUSES = ["PENDING", "ACCEPTED", "DRIVER_ASSIGNED", "DELIVERED", "CANCELLED"];

export const TRANSITIONS = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["DRIVER_ASSIGNED", "CANCELLED"],
  DRIVER_ASSIGNED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const DRIVER_ALLOWED = ["DELIVERED", "CANCELLED"];
const isOnline = (o) => ["BANKING", "MOMO"].includes(String(o?.paymentMethod).toUpperCase());

const STATUS_VI = {
  PENDING: "Chờ xác nhận", ACCEPTED: "Đã chấp nhận", DRIVER_ASSIGNED: "Đang giao", DELIVERED: "Đã giao", CANCELLED: "Đã hủy",
};

/**
 * @param {object} order  đơn hiện tại
 * @param {string} to     trạng thái muốn chuyển tới
 * @param {{role:"ADMIN"|"DRIVER"|"CUSTOMER", id?:string}} actor
 * @returns {{ok:true} | {ok:false, status:number, error:string}}
 */
export function checkTransition(order, to, actor = { role: "ADMIN" }) {
  if (!order) return { ok: false, status: 404, error: "Đơn hàng không tồn tại" };
  if (!ORDER_STATUSES.includes(to)) return { ok: false, status: 400, error: `Trạng thái không hợp lệ. Chỉ chấp nhận: ${ORDER_STATUSES.join(", ")}` };

  if (actor.role === "DRIVER") {
    if (order.driverId !== actor.id) return { ok: false, status: 403, error: "Đơn hàng không thuộc về bạn" };
    if (!DRIVER_ALLOWED.includes(to)) return { ok: false, status: 403, error: "Tài xế chỉ được hoàn thành hoặc hủy đơn của mình" };
  }
  if (actor.role === "CUSTOMER") {
    if (order.userId !== actor.id) return { ok: false, status: 403, error: "Không có quyền với đơn hàng này" };
    if (to !== "CANCELLED") return { ok: false, status: 403, error: "Khách chỉ được hủy đơn" };
    if (order.status !== "PENDING") return { ok: false, status: 409, error: "Chỉ hủy được đơn đang chờ cửa hàng xác nhận" };
  }

  // "Đang giao" phải đi cùng một tài xế cụ thể: dùng chức năng giao tài xế (checkAssign) hoặc tài xế tự nhận đơn
  if (to === "DRIVER_ASSIGNED") {
    return { ok: false, status: 409, error: 'Không đặt trạng thái "Đang giao" trực tiếp được, hãy dùng chức năng giao tài xế' };
  }

  if (!(TRANSITIONS[order.status] || []).includes(to)) {
    return { ok: false, status: 409, error: `Không thể chuyển đơn từ "${STATUS_VI[order.status] ?? order.status}" sang "${STATUS_VI[to]}"` };
  }
  if (to === "ACCEPTED" && isOnline(order) && order.paymentStatus !== "PAID") {
    return { ok: false, status: 409, error: "Đơn thanh toán online chưa được thanh toán, chưa thể xác nhận" };
  }
  return { ok: true };
}

/** Giao tài xế cho đơn: đơn phải ACCEPTED và chưa có tài xế (khi gán tay từ admin). */
export function checkAssign(order) {
  if (!order) return { ok: false, status: 404, error: "Đơn hàng không tồn tại" };
  if (order.driverId) return { ok: false, status: 409, error: "Đơn hàng đã có tài xế" };
  if (order.status !== "ACCEPTED") return { ok: false, status: 409, error: "Chỉ giao tài xế cho đơn đã được xác nhận" };
  return { ok: true };
}

/** Có thể thanh toán đơn này không (đơn phải đang chờ xác nhận và chưa trả). */
export function checkPayable(order) {
  if (!order) return { ok: false, status: 404, error: "Đơn hàng không tồn tại" };
  if (order.paymentStatus === "PAID") return { ok: false, status: 409, error: "Đơn hàng đã được thanh toán" };
  if (order.status !== "PENDING") return { ok: false, status: 409, error: order.status === "CANCELLED" ? "Đơn hàng đã bị hủy, không thể thanh toán" : "Đơn hàng không còn ở trạng thái chờ thanh toán" };
  return { ok: true };
}
