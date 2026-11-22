import db from "../configs/firestore.js";
import { orderService } from "./order.service.js";
import { autoAcceptSeconds, shouldAutoAccept } from "../utils/autoaccept.js";

/** Quét định kỳ các đơn PENDING và tự chấp nhận khi đủ điều kiện (chỉ khi AUTO_ACCEPT_DEMO được đặt). */
export function startAutoAccept() {
  const seconds = autoAcceptSeconds();
  if (!seconds) return null;
  console.log(`⏱  AUTO_ACCEPT_DEMO: tự chấp nhận đơn sau ${seconds}s (chỉ dùng khi demo)`);
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const snap = await db.collection("orders").where("status", "==", "PENDING").get();
      for (const doc of snap.docs) {
        if (shouldAutoAccept(doc.data(), new Date(), seconds)) await orderService.updateStatus(doc.id, "ACCEPTED");
      }
    } catch (err) {
      console.error("[AutoAccept]", err.message);
    } finally {
      running = false;
    }
  };
  return setInterval(tick, 5000);
}
