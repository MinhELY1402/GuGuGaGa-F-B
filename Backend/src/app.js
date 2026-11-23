import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import routerUser from "./routes/user.route.js";
import routerAdmin from "./routes/admin.route.js";
import routerShipper from "./routes/shipper.route.js";
import routerPublic from "./routes/public.route.js";
import routerAI from "./routes/ai.route.js";
import routerPayment from "./routes/payment.route.js";

dotenv.config();

const app = express();

// Chạy sau Cloudflare Tunnel (cloudflared ở localhost): lấy IP thật từ X-Forwarded-For
app.set("trust proxy", "loopback");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Thứ tự mount giữ nguyên như server.js cũ
app.use("/api/admin", routerAdmin);
app.use("/api/user", routerUser);
app.use("/api/shipper", routerShipper);
app.use("/api", routerPublic);
app.use("/api/ai", routerAI);
app.use("/api/payment", routerPayment);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
