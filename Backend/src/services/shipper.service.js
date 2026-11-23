import { selectHideable } from "../utils/history.js";
import { canDriverTakeOrder } from "../utils/dispatch.js";
import { checkTransition } from "../utils/orderflow.js";
import db from "../configs/firestore.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../configs/env.js";
import { notificationService } from "./notification.service.js";

const driversRef = db.collection("drivers");
const ordersRef = db.collection("orders");
const branchesRef = db.collection("branches");
const usersRef = db.collection("users");
const productsRef = db.collection("products");
const combosRef = db.collection("combos");

// Helper: populate order with branch, user, orderItems (product + combo)
async function populateOrder(order) {
  if (order.branchId) {
    const branchDoc = await branchesRef.doc(order.branchId).get();
    order.branch = branchDoc.exists ? { id: branchDoc.id, ...branchDoc.data() } : null;
  }
  if (order.userId) {
    const userDoc = await usersRef.doc(order.userId).get();
    order.user = userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
  }
  // orderItems sub-collection
  const itemsSnap = await ordersRef.doc(order.id).collection("orderItems").get();
  order.orderItem = [];
  for (const itemDoc of itemsSnap.docs) {
    const item = { id: itemDoc.id, ...itemDoc.data() };
    if (item.productId) {
      const prodDoc = await productsRef.doc(item.productId).get();
      item.product = prodDoc.exists ? { id: prodDoc.id, ...prodDoc.data() } : null;
    } else {
      item.product = null;
    }
    if (item.comboId) {
      const comboDoc = await combosRef.doc(item.comboId).get();
      item.combo = comboDoc.exists ? { id: comboDoc.id, ...comboDoc.data() } : null;
    } else {
      item.combo = null;
    }
    order.orderItem.push(item);
  }
  return order;
}

export const shipperService = {
  login: async (phone, password) => {
    const snap = await driversRef.where("phone", "==", phone).limit(1).get();

    if (snap.empty) {
      throw new Error("Tài xế không tồn tại");
    }

    const doc = snap.docs[0];
    const driver = { id: doc.id, ...doc.data() };

    const isMatch = await bcrypt.compare(password, driver.passwordHash);
    if (!isMatch) {
      throw new Error("Mật khẩu không đúng");
    }

    // Populate branch
    if (driver.branchId) {
      const branchDoc = await branchesRef.doc(driver.branchId).get();
      driver.branch = branchDoc.exists ? { id: branchDoc.id, ...branchDoc.data() } : null;
    }

    const token = jwt.sign(
      { id: driver.id, role: "DRIVER" },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    return { driver, token };
  },

  // Đơn hàng mới chưa có tài xế nhận (hiển thị cho tất cả tài xế)
  getAvailableOrders: async (driverId) => {
    const driverDoc = driverId ? await driversRef.doc(driverId).get() : null;
    const driver = driverDoc?.exists ? { id: driverDoc.id, ...driverDoc.data() } : null;
    // Dùng single-field query để tránh lỗi composite index
    const snap = await ordersRef.where("status", "==", "ACCEPTED").get();

    const orders = [];
    for (const doc of snap.docs) {
      const data = doc.data();
      // Chỉ lấy đơn chưa có tài xế, và (nếu tài xế thuộc chi nhánh) đúng chi nhánh
      if (!data.driverId && (!driver || canDriverTakeOrder(data, driver).ok)) {
        const order = { id: doc.id, ...data };
        await populateOrder(order);
        orders.push(order);
      }
    }
    // Sắp xếp theo thời gian mới nhất ở JS thay vì Firestore orderBy (tránh composite index)
    orders.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt?._seconds ?? 0) * 1000;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt?._seconds ?? 0) * 1000;
      return timeB - timeA;
    });
    return orders;
  },

  // Tài xế nhận đơn: dùng giao dịch để hai người bấm cùng lúc thì chỉ một người nhận được
  acceptOrder: async (orderId, driverId) => {
    const orderRef = ordersRef.doc(orderId);
    const driverRef = driversRef.doc(driverId);

    const orderData = await db.runTransaction(async (tx) => {
      const [orderDoc, driverDoc] = await Promise.all([tx.get(orderRef), tx.get(driverRef)]);
      const check = canDriverTakeOrder(
        orderDoc.exists ? orderDoc.data() : null,
        driverDoc.exists ? { id: driverDoc.id, ...driverDoc.data() } : null
      );
      if (!check.ok) throw new Error(check.error);
      tx.update(driverRef, { status: "ON_DELIVERY" });
      tx.update(orderRef, { driverId, status: "DRIVER_ASSIGNED", updatedAt: new Date() });
      return orderDoc.data();
    });

    // Tạo thông báo cho user
    try {
      const orderShortId = orderId.substring(orderId.length - 6);
      if (orderData.userId) {
        await notificationService.createNotification(
          orderData.userId,
          "Tài xế đã nhận đơn",
          `Tài xế đang giao đơn hàng #${orderShortId} cho bạn.`,
          orderId
        );
      }
    } catch (err) {
      console.error("[shipper acceptOrder Notification Error]", err);
    }

    const updatedDoc = await orderRef.get();
    const order = { id: updatedDoc.id, ...updatedDoc.data() };
    await populateOrder(order);
    return order;
  },

  // Tất cả đơn của tài xế (đã nhận + đã giao + ...)
  getMyOrders: async (driverId) => {
    const snap = await ordersRef.where("driverId", "==", driverId).get();
    const orders = [];
    for (const doc of snap.docs) {
      const order = { id: doc.id, ...doc.data() };
      await populateOrder(order);
      orders.push(order);
    }
    orders.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt?._seconds ?? 0) * 1000;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt?._seconds ?? 0) * 1000;
      return timeB - timeA;
    });
    return orders;
  },

  // Xoá đơn đã xong khỏi lịch sử của tài xế (gắn cờ hiddenByDriver, không xoá dữ liệu đơn)
  hideHistory: async (driverId, { ids, all } = {}) => {
    const snap = await ordersRef.where("driverId", "==", driverId).get();
    const all_ = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const targets = selectHideable(all_, driverId, { ids, all });
    const batch = db.batch();
    for (const o of targets) batch.update(ordersRef.doc(o.id), { hiddenByDriver: true });
    if (targets.length) await batch.commit();
    return { hidden: targets.length };
  },

  // Chỉ đơn đang giao (DRIVER_ASSIGNED) của tài xế
  getAssignedOrders: async (driverId) => {
    // Dùng single-field query + filter JS để tránh composite index
    const snap = await ordersRef.where("driverId", "==", driverId).get();
    const orders = [];
    for (const doc of snap.docs) {
      const data = doc.data();
      if (data.status === "DRIVER_ASSIGNED") {
        const order = { id: doc.id, ...data };
        await populateOrder(order);
        orders.push(order);
      }
    }
    orders.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt?._seconds ?? 0) * 1000;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt?._seconds ?? 0) * 1000;
      return timeB - timeA;
    });
    return orders;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, driverId, status) => {
    // Verify đơn thuộc về tài xế này
    const orderDoc = await ordersRef.doc(orderId).get();
    if (!orderDoc.exists) {
      throw new Error("Đơn hàng không tồn tại");
    }

    const orderData = orderDoc.data();
    const check = checkTransition(orderData, status, { role: "DRIVER", id: driverId });
    if (!check.ok) throw Object.assign(new Error(check.error), { status: check.status });

    await ordersRef.doc(orderId).update({ status, updatedAt: new Date() });

    // Tạo thông báo cho user
    try {
      let title = "";
      let message = "";
      const orderShortId = orderId.substring(orderId.length - 6);
      if (status === "DELIVERED") {
        title = "Giao hàng thành công";
        message = `Đơn hàng #${orderShortId} đã được giao thành công. Chúc bạn ngon miệng!`;
      } else if (status === "CANCELLED") {
        title = "Đơn hàng đã bị hủy";
        message = `Đơn hàng #${orderShortId} đã bị hủy.`;
      }

      if (title && orderData.userId) {
        await notificationService.createNotification(
          orderData.userId,
          title,
          message,
          orderId
        );
      }
    } catch (err) {
      console.error("[shipper updateOrderStatus Notification Error]", err);
    }

    if (status === "DELIVERED" || status === "CANCELLED") {
      await driversRef.doc(driverId).update({ status: "AVAILABLE" });
    }

    const updatedDoc = await ordersRef.doc(orderId).get();
    const order = { id: updatedDoc.id, ...updatedDoc.data() };
    await populateOrder(order);
    return order;
  },

  updateLocation: async (driverId, latitude, longitude) => {
    await driversRef.doc(driverId).update({
      latitude,
      longitude,
      updatedAt: new Date(),
    });
    const updated = await driversRef.doc(driverId).get();
    return { id: updated.id, ...updated.data() };
  },
};
