import express from "express";
import { paymentController } from "../controllers/payment.controller.js";

// Route công khai cho cổng thanh toán gọi về (xác thực bằng chữ ký, không dùng JWT)
const routerPayment = express.Router();
routerPayment.post("/momo/ipn", paymentController.momoIpn);
routerPayment.get("/momo/return", paymentController.momoReturn);

export default routerPayment;
