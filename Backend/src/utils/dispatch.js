/**
 * Quy tắc điều phối đơn cho tài xế.
 * - Tài xế chỉ thấy/nhận đơn đã được cửa hàng xác nhận (ACCEPTED), chưa có người nhận.
 * - Nếu tài xế thuộc một chi nhánh thì chỉ thấy/nhận đơn của chi nhánh đó.
 * - Không giới hạn số đơn một tài xế đang giao.
 */
export function canDriverTakeOrder(order, driver) {
  if (!order) return { ok: false, error: "Đơn hàng không tồn tại" };
  if (!driver) return { ok: false, error: "Tài xế không tồn tại" };
  if (order.driverId) return { ok: false, error: "Đơn hàng đã có tài xế nhận" };
  if (order.status !== "ACCEPTED") return { ok: false, error: "Đơn hàng chưa sẵn sàng để nhận" };
  if (driver.branchId && order.branchId !== driver.branchId) {
    return { ok: false, error: "Đơn hàng thuộc chi nhánh khác" };
  }
  return { ok: true };
}

/** Lọc danh sách đơn mà tài xế này được phép thấy ở tab "Mới". */
export const visibleToDriver = (orders, driver) => orders.filter((o) => canDriverTakeOrder(o, driver).ok);
