import express from "express";
import { orderController } from "../../controllers/order.controller.js";
import { reviewController } from "../../controllers/review.controller.js";
import { paymentController } from "../../controllers/payment.controller.js";

const routerOrder = express.Router();

// Lấy cấu hình tài khoản ngân hàng (Cần để trước /:id để tránh trùng khớp tham số ID)
routerOrder.get("/payment-config", orderController.getPaymentConfig);

// Tạo đơn hàng từ cart
routerOrder.post("/create", orderController.createOrder);

// Lấy danh sách đơn hàng của user
routerOrder.get("/", orderController.getOrders);

// Kiểm tra trạng thái thanh toán chuyển khoản qua Casso
routerOrder.get("/:id/check-payment", orderController.checkPayment);

// Tạo phiên thanh toán MoMo (ví/QR hoặc thẻ Visa) cho đơn MOMO
routerOrder.post("/:id/cancel", orderController.cancelMyOrder);
routerOrder.patch("/:id/payment-method", paymentController.changeMethod);
routerOrder.post("/:id/momo", paymentController.createMomo);

// Thanh toán online ngay trong app: mã QR và thẻ Visa/Master (cổng mô phỏng, bật bằng PAYMENT_SIMULATOR=1)
routerOrder.post("/:id/pay/qr", paymentController.createQr);
routerOrder.post("/:id/pay/qr/simulate", paymentController.simulateQr);
routerOrder.post("/:id/pay/card", paymentController.startCard);
routerOrder.post("/:id/pay/card/confirm", paymentController.confirmCard);

// Lấy chi tiết đơn hàng
routerOrder.get("/:id", orderController.getOrderDetail);

// Đánh giá đơn hàng
routerOrder.post("/:id/reviews", reviewController.createOrderReview);

export default routerOrder;
