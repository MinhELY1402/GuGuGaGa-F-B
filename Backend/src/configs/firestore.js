import admin from "firebase-admin";
import { existsSync, readFileSync } from "fs";
import { config } from "./env.js";

const serviceAccountPath = config.firebase.serviceAccountPath;

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else if (process.env.NODE_ENV === "test") {
  // Môi trường kiểm thử/CI: không có service account, khởi tạo không credential.
  // Các test không gọi tới Firestore thật.
  admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "gugugaga-test" });
} else {
  throw new Error(
    `Không tìm thấy Firebase service account tại "${serviceAccountPath}". ` +
      "Đặt FIREBASE_SERVICE_ACCOUNT_PATH trong .env (xem .env.example)."
  );
}

const db = admin.firestore();

export default db;
