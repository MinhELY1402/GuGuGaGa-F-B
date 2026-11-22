import { paymentService } from "../services/payment.service.js";
import { ApiResponse } from "../configs/apiResponse.js";

// Địa chỉ công khai của backend: ưu tiên biến môi trường, nếu không lấy theo request (qua Cloudflare Tunnel)
const publicBaseUrl = (req) =>
  (process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");

const page = (title, msg, ok) => `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;background:#fff;color:#1f1a17;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px}
.c{max-width:420px;text-align:center}.i{font-size:56px}.t{font-size:22px;font-weight:700;margin:12px 0;color:${ok ? "#2e7d32" : "#c62828"}}p{color:#555;line-height:1.5}</style></head>
<body><div class="c"><div class="i">${ok ? "✅" : "⚠️"}</div><div class="t">${title}</div><p>${msg}</p>
<p><b>Hãy quay lại ứng dụng GuGuGaGa</b> — đơn hàng sẽ tự cập nhật.</p></div></body></html>`;

export const paymentController = {
  /** POST /api/user/orders/:id/momo  { method: "wallet" | "card" } */
  async createMomo(req, res) {
    try {
      const result = await paymentService.createMomoPayment(
        req.params.id, req.user.id, req.body?.method, publicBaseUrl(req)
      );
      return ApiResponse.success(res, result, "Đã tạo phiên thanh toán MoMo");
    } catch (error) {
      console.error("[createMomo]", error.message);
      return ApiResponse.error(res, error, error.status || 400);
    }
  },

  /** POST /api/user/orders/:id/pay/qr — mã QR hiển thị trong app */
  async createQr(req, res) {
    try {
      return ApiResponse.success(res, await paymentService.createQr(req.params.id, req.user.id, publicBaseUrl(req)), "Đã tạo mã QR");
    } catch (error) {
      console.error("[createQr]", error.message);
      return ApiResponse.error(res, error, error.status || 400);
    }
  },

  /** POST /api/user/orders/:id/pay/qr/simulate — mô phỏng khách đã quét và thanh toán */
  async simulateQr(req, res) {
    try {
      return ApiResponse.success(res, await paymentService.simulateQrPaid(req.params.id, req.user.id), "Thanh toán QR (mô phỏng) thành công");
    } catch (error) {
      return ApiResponse.error(res, error, error.status || 400);
    }
  },

  /** POST /api/user/orders/:id/pay/card { number, expiry, cvv, name } — bước 1, chờ OTP. Không ghi log dữ liệu thẻ. */
  async startCard(req, res) {
    try {
      const { number, expiry, cvv, name } = req.body || {};
      return ApiResponse.success(res, await paymentService.startCardPayment(req.params.id, req.user.id, { number, expiry, cvv, name }), "Nhập mã OTP để hoàn tất");
    } catch (error) {
      return ApiResponse.error(res, error, error.status || 400);
    }
  },

  /** POST /api/user/orders/:id/pay/card/confirm { paymentId, otp } */
  async confirmCard(req, res) {
    try {
      const { paymentId, otp } = req.body || {};
      return ApiResponse.success(res, await paymentService.confirmCardPayment(req.params.id, req.user.id, paymentId, otp), "Thanh toán thẻ (mô phỏng) thành công");
    } catch (error) {
      return ApiResponse.error(res, error, error.status || 400);
    }
  },

  /** POST /api/payment/momo/ipn — MoMo gọi server-to-server; luôn trả 204 nếu chữ ký hợp lệ */
  async momoIpn(req, res) {
    try {
      const r = await paymentService.handleMomoResult(req.body);
      if (!r.ok && r.reason === "invalid_signature") return res.status(400).json({ success: false, message: "Invalid signature" });
      return res.status(204).end();
    } catch (error) {
      console.error("[momoIpn]", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** GET /api/payment/momo/return — trình duyệt quay về sau khi thanh toán */
  async momoReturn(req, res) {
    try {
      const r = await paymentService.handleMomoResult(req.query);
      if (r.paid) return res.type("html").send(page("Thanh toán thành công", "MoMo đã xác nhận thanh toán cho đơn hàng của bạn.", true));
      return res.type("html").send(page("Thanh toán chưa hoàn tất", r.reason ? `MoMo: ${r.reason}` : "Giao dịch chưa thành công hoặc đã bị huỷ.", false));
    } catch (error) {
      return res.status(500).type("html").send(page("Có lỗi xảy ra", error.message, false));
    }
  },
};
