import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { orderController } from "../controllers/order.controller.js";
import routerAuth from "./user/user-auth.route.js";
import routerCart from "./user/cart.route.js";
import routerOrder from "./user/order.route.js";
import routerNotification from "./user/notification.route.js";

const routerUser = express.Router();

// Xác thực khách hàng (sign-in/sign-up public; /me và /profile tự gắn protectRoute)
routerUser.use("/auth", routerAuth);

// Webhook Casso: do Casso gọi (không có JWT) — xác thực bằng Secure-Token trong controller
routerUser.post("/orders/webhook-casso", orderController.cassoWebhook);

// Các nhóm route cần đăng nhập
routerUser.use("/carts", protectRoute, routerCart);
routerUser.use("/orders", protectRoute, routerOrder);
routerUser.use("/notifications", protectRoute, routerNotification);

export default routerUser;
