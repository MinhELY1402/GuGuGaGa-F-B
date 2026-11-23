/**
 * Chọn các đơn mà tài xế được phép "xoá khỏi lịch sử".
 * Chỉ đơn của chính tài xế, đã xong (DELIVERED/CANCELLED) và chưa bị ẩn.
 * Dữ liệu đơn vẫn được giữ nguyên (khách, admin, thống kê vẫn thấy) - chỉ gắn cờ hiddenByDriver.
 */
export const DONE_STATUSES = ["DELIVERED", "CANCELLED"];

export function selectHideable(orders, driverId, { ids = [], all = false } = {}) {
  const wanted = new Set((ids || []).map(String));
  return orders.filter(
    (o) =>
      o.driverId === driverId &&
      DONE_STATUSES.includes(o.status) &&
      !o.hiddenByDriver &&
      (all === true || wanted.has(String(o.id)))
  );
}
