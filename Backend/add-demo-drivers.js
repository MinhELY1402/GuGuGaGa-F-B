/**
 * Thêm tài khoản tài xế mẫu vào dữ liệu ĐANG CÓ (không xoá gì, chạy lại nhiều lần không trùng).
 * Chạy:  FIRESTORE_EMULATOR_HOST=127.0.0.1:8085 FIREBASE_PROJECT_ID=demo-gugugaga node add-demo-drivers.js
 * Mật khẩu chung: 123456. Mỗi tài xế thuộc chi nhánh đầu tiên tìm thấy.
 */
import admin from "firebase-admin";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "demo-gugugaga" });
const db = admin.firestore();

export const DEMO_DRIVERS = [
  { name: "Tai xe Lan", phone: "0911111112" },
  { name: "Tai xe Hung", phone: "0911111113" },
  { name: "Tai xe Mai", phone: "0911111114" },
];

const existing = await db.collection("drivers").limit(1).get();
let branchId = existing.docs[0]?.data().branchId;
if (!branchId) branchId = (await db.collection("branches").limit(1).get()).docs[0]?.id;
const passwordHash = await bcrypt.hash("123456", 10);

for (const d of DEMO_DRIVERS) {
  const found = await db.collection("drivers").where("phone", "==", d.phone).limit(1).get();
  if (!found.empty) { console.log("đã có:", d.phone); continue; }
  const now = new Date();
  await db.collection("drivers").add({
    branchId, name: d.name, phone: d.phone, passwordHash, status: "AVAILABLE",
    latitude: null, longitude: null, createdAt: now, updatedAt: now,
  });
  console.log("đã thêm:", d.name, d.phone);
}
process.exit(0);
