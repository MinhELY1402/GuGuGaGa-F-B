import db from "../configs/firestore.js";
import { orderService } from "./order.service.js";
import { autoAcceptSeconds, shouldAutoAccept } from "../utils/autoaccept.js";
import { payTimeoutMinutes, shouldExpire } from "../utils/paymentguard.js";

/**
 * Quét định kỳ các đơn PENDING:
 *  - tự chấp nhận khi demo (AUTO_ACCEPT_DEMO=<giây>, mặc định tắt)
 *  - tự hủy đơn online quá hạn thanh toán (ORDER_PAY_TIMEOUT_MIN=<phút>, mặc định 30, 0 = tắt)
 */
export function startOrderSweeper() {
  const accept = autoAcceptSeconds();
  const timeout = payTimeoutMinutes();
  if (!accept && !timeout) return null;
  if (accept) console.log(`⏱  AUTO_ACCEPT_DEMO: tự chấp nhận đơn sau ${accept}s (chỉ dùng khi demo)`);
  if (timeout) console.log(`⏱  ORDER_PAY_TIMEOUT_MIN: tự hủy đơn online chưa thanh toán sau ${timeout} phút`);
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const snap = await db.collection("orders").where("status", "==", "PENDING").get();
      const now = new Date();
      for (const doc of snap.docs) {
        const order = doc.data();
        if (shouldExpire(order, now, timeout)) await orderService.expireUnpaidOrder(doc.id);
        else if (shouldAutoAccept(order, now, accept)) await orderService.updateStatus(doc.id, "ACCEPTED");
      }
    } catch (err) {
      console.error("[OrderSweeper]", err.message);
    } finally {
      running = false;
    }
  };
  return setInterval(tick, 5000);
}
