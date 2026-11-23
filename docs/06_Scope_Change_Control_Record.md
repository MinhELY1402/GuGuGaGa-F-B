# HỒ SƠ KIỂM SOÁT THAY ĐỔI PHẠM VI (SCOPE CHANGE CONTROL RECORD)
## YÊU CẦU THAY ĐỔI: CR-01 (APPROVED)

**Mã hồ sơ:** `CR-2026-GUGUGAGA-01`  
**Dự án:** Hệ sinh thái GuGuGaGa  
**Ngày khởi tạo yêu cầu:** 12/10/2026 (Tuần 8 — Sprint 2)  
**Người đề xuất (Requester):** Võ Nhật Huy (Project Lead & QA Lead)  
**Ban kiểm soát thay đổi (CCB):** Võ Nhật Huy, Trần Phan Minh Tiến, Nguyễn Gia Bảo, Nguyễn Bảo Quang Minh  
**Quyết định của CCB:** **APPROVED (Chấp thuận thực thi)**  

---

### 1. Bối cảnh & Lý do đề xuất thay đổi (Business Need & Problem Statement)
Trong quá trình thử nghiệm thực tế tính năng thanh toán VietQR động kết hợp Webhook đối soát số dư của Casso:
* Khi đường truyền mạng di động của khách hàng yếu hoặc hệ thống đối soát bên thứ 3 phát sinh độ trễ, Webhook đối soát chuyển khoản từ Casso về Backend thỉnh thoảng bị trễ từ **30 đến 60 giây**.
* Khách hàng sau khi chuyển khoản thành công trên app ngân hàng quay lại app GuGuGaGa thấy màn hình vẫn ở trạng thái chờ (`UNPAID`), dẫn tới tâm lý lo lắng bị mất tiền, bấm hủy đơn hoặc khiếu nại.
* Đây là một biến cố quản lý rủi ro thực tế (R01 trong Risk Register) đe dọa trực tiếp đến trải nghiệm cốt lõi của sản phẩm.

---

### 2. Mô tả chi tiết nội dung thay đổi phạm vi (Scope of Change)
Ban CCB quyết định bổ sung giải pháp kỹ thuật chịu lỗi đa tầng:
1. **Phía Backend (`order.service.js`)**:
   - Xây dựng thêm endpoint polling độc lập: `GET /api/user/orders/:id/check-payment`.
   - Endpoint này chủ động gọi sang API Casso (`/v2/transactions`) để quét 20 giao dịch gần nhất xem có giao dịch khớp cú pháp `GUGUGAGA_<orderId>` hay không, thay vì chỉ bị động ngồi đợi Webhook.
   - Thêm cờ hỗ trợ chế độ đối soát cưỡng bức (`force override`) khi chưa cấu hình API Key Casso hoặc khi Admin duyệt tay.
2. **Phía Mobile App Khách hàng (`checkout_screen.dart` / dialog VietQR)**:
   - Cài đặt một bộ đếm thời gian (Timer polling) tự động gửi request kiểm tra trạng thái mỗi **5 giây/lần** trong khi khách hàng đang mở dialog quét mã VietQR.
   - Bổ sung nút bấm trực quan: *"Tôi đã chuyển khoản thành công"* để khách hàng có thể chủ động kích hoạt kiểm tra ngay lập tức mà không phải chờ đợi.

---

### 3. Đánh giá tác động (Impact Analysis)
* **Tác động tiến độ (Schedule Impact)**: Tăng thêm 2 ngày làm việc trong Tuần 8. Nhóm đã điều chỉnh bằng cách tận dụng thời gian rảnh của nhánh AI và Backend, không làm ảnh hưởng đến mốc kết thúc Sprint 2 (18/10/2026).
* **Tác động chi phí (Cost Impact)**: 0 VNĐ (sử dụng tài nguyên API hiện có).
* **Tác động chất lượng (Quality Impact)**: Khách hàng không còn phụ thuộc hoàn toàn vào webhook: app tự kiểm tra mỗi 4–5 giây và có nút xác minh chủ động. *(Số liệu đo trước/sau: [CẦN BỔ SUNG nếu có log thật])*

---

### 4. Biên bản phê duyệt của Ban Kiểm Soát Thay Đổi (CCB Sign-off)

| Thành viên CCB | Vai trò | Quyết định | Chữ ký xác nhận |
|---|---|:---:|:---:|
| **Võ Nhật Huy** | Project Lead / Chủ tịch CCB | **Chấp thuận** | [ký thật] |
| **Trần Phan Minh Tiến** | Technical Lead / Thành viên | **Chấp thuận** | [ký thật] |
| **Nguyễn Gia Bảo** | Backend Lead / Người thực thi BE | **Chấp thuận** | [ký thật] |
| **Nguyễn Bảo Quang Minh** | Frontend Lead / Người thực thi UI | **Chấp thuận** | [ký thật] |

*Bằng chứng kèm theo: [link tin nhắn/log sự cố webhook thật, biên bản họp CCB].*

---

## YÊU CẦU THAY ĐỔI: CR-02 — THÊM CỔNG THANH TOÁN MOMO (THẺ VISA/MASTER VÀ QR)

**Mã hồ sơ:** `CR-2026-GUGUGAGA-02`
**Ngày khởi tạo:** 16/11/2026 (giai đoạn QTDA, sau bản beta v1.1.0-beta)
**Người đề xuất:** Trần Phan Minh Tiến (Technical Lead)
**Trạng thái:** Đã thực hiện trên nhánh `feat/momo-payment`; **chờ CCB xác nhận** (chữ ký bên dưới)

### 1. Lý do đề xuất
- Phạm vi gốc chỉ có COD và chuyển khoản VietQR/Casso. Bản demo không có tài khoản Casso, nên khoản thanh toán chỉ được xác nhận khi khách bấm nút "Tôi đã chuyển khoản".
- Yêu cầu khi demo và bảo vệ: **không dùng tiền thật**, **thanh toán được bằng thẻ Visa**, và **có mã QR**.

### 2. Phương án đã cân nhắc
| Phương án | Kết quả thử ngày 16/11/2026 | Quyết định |
|---|---|---|
| VNPay Sandbox | Trang tự đăng ký `sandbox.vnpayment.vn/devreg` trả 404, phải liên hệ VNPay để có tài khoản | Loại vì không kịp tiến độ |
| ZaloPay Sandbox | Tạo đơn thành công nhưng trang thanh toán báo "đang bảo trì" | Loại vì không ổn định |
| **MoMo Sandbox** | Tạo đơn thành công cho cả ví/QR (có mã QR) lẫn thẻ (`payWithCC`); dùng khoá test công khai trong repo mẫu chính thức của MoMo | **Chọn** |

### 3. Nội dung thay đổi
- **Backend:**
  - `POST /api/user/orders/:id/momo`: tạo phiên thanh toán ví/QR hoặc thẻ.
  - `POST /api/payment/momo/ipn` và `GET /api/payment/momo/return`: kiểm chữ ký HMAC-SHA256, kiểm mã đối tác và số tiền, chống xử lý lặp. Thanh toán thành công thì đơn chuyển `PENDING` → `ACCEPTED`.
  - Đơn `MOMO` được tạo ở trạng thái `PENDING`.
- **App khách hàng (build 4):**
  - Thêm phương thức "MoMo: thẻ Visa/Master hoặc quét QR".
  - Thêm màn hình mở trang thanh toán MoMo; app tự kiểm tra trạng thái đơn để cập nhật.
- **Giữ nguyên:** COD và VietQR.

### 4. Đánh giá tác động
- **Tiến độ:** khoảng 1 ngày làm việc (16/11). Không ảnh hưởng ngày nộp báo cáo (tuần sau).
- **Chi phí:** 0 VNĐ (sandbox).
- **Chất lượng:**
  - Test tự động backend tăng từ 24 lên **32/32**.
  - Đã kiểm thử luồng API qua URL công khai: đơn PENDING → tạo phiên ví và phiên thẻ → IPN hợp lệ đưa đơn sang ACCEPTED/PAID → IPN lặp lại không cập nhật lần 2 → IPN bị sửa số tiền bị từ chối.
  - Thanh toán bằng thẻ test trên điện thoại: [CẦN BỔ SUNG kết quả thử].
- **Rủi ro mới:**
  - Phụ thuộc môi trường sandbox của MoMo (có thể bảo trì).
  - IPN cần URL công khai: hiện dùng tunnel, URL đổi khi bật lại (xem R11).
  - Khoá sandbox là khoá công khai, chỉ dùng cho demo, không dùng production.

### 5. Phê duyệt của CCB
| Thành viên CCB | Vai trò | Quyết định | Chữ ký xác nhận |
|---|---|---|---|
| **Võ Nhật Huy** | Project Lead / Chủ tịch CCB | [ ] | [ký thật] |
| **Trần Phan Minh Tiến** | Technical Lead (người đề xuất) | [ ] | [ký thật] |
| **Nguyễn Gia Bảo** | Backend & AI | [ ] | [ký thật] |
| **Nguyễn Bảo Quang Minh** | Frontend | [ ] | [ký thật] |

### 6. Điều chỉnh phương án ngày 22/11/2026 (sau khi thử thực tế trên điện thoại)
**Vấn đề phát hiện khi thử:** thanh toán MoMo bắt người dùng rời ứng dụng sang trang web, và cả hai đường đều không dùng được:
- **Thẻ Visa/Master:** trang thanh toán thẻ của MoMo sandbox tải Bootstrap từ `stackpath.bootstrapcdn.com` (CDN đã ngừng hoạt động) nên trình duyệt bị treo, không hiện form nhập thẻ.
- **Ví/QR:** trang chuyển sang mở ứng dụng MoMo thật trên điện thoại; ứng dụng này không nhận đơn của môi trường sandbox nên không có gì xảy ra. Thanh toán sandbox bằng ví cần ứng dụng MoMo bản test riêng.
- API của MoMo cũng không cho ứng dụng nhận số thẻ trực tiếp (dữ liệu thẻ chỉ được nhập trên trang của MoMo).

**Yêu cầu của nhóm:** người dùng thanh toán được ngay trong ứng dụng, không mở trang web.

**Quyết định:** giữ tích hợp MoMo (mã QR thật của MoMo vẫn hiển thị trong ứng dụng) và bổ sung **cổng thanh toán MÔ PHỎNG** do backend tự phục vụ:
- Form nhập thẻ Visa/Mastercard + bước OTP và tab mã QR nằm **trong ứng dụng** (`OnlinePaymentScreen`).
- **Chỉ nhận một số thẻ test công khai** (`4111 1111 1111 1111`, `5555 5555 5555 4444`, thẻ lỗi `4000 0000 0000 0002`); mọi số thẻ khác, kể cả thẻ thật, bị chặn ngay trên thiết bị và ở máy chủ. Máy chủ chỉ lưu hãng thẻ và 4 số cuối.
- Giao diện ghi rõ **"Cổng thử nghiệm (mô phỏng), không trừ tiền thật"**. Tài liệu và buổi bảo vệ phải trình bày đúng đây là **mô phỏng**, không phải tích hợp cổng thanh toán thật.
- Chỉ hoạt động khi đặt `PAYMENT_SIMULATOR=1` (mặc định tắt). Đơn chỉ chuyển `PENDING` → `ACCEPTED` sau khi thanh toán thành công, như các phương thức khác.

**Kết quả kiểm thử:**
- Backend: 41/41 test tự động (kiểm tra thẻ, Luhn, hạn thẻ, từ chối thẻ thật, yêu cầu đăng nhập).
- Luồng API thật (17 tình huống): thẻ lạ bị chặn, thẻ lỗi bị từ chối, thẻ hết hạn, OTP sai (3 lần thì huỷ phiên), thanh toán lặp bị chặn, người dùng khác không thanh toán được đơn của người khác, QR trong app, đơn COD không bị ảnh hưởng.
- Ứng dụng: 7 widget test (bố cục khổ 360×640 không tràn, định dạng/kiểm tra form, chặn thẻ thật).
- Thử trên điện thoại thật với APK build 5: [CẦN BỔ SUNG].

**Tác động:** tiến độ thêm khoảng 0,5 ngày; chi phí 0 VNĐ. Rủi ro còn lại: cổng mô phỏng không chứng minh được tích hợp với cổng thanh toán thật; muốn dùng thật cần một cổng có tài khoản merchant (VNPay, PayOS...) và thay phần xử lý thẻ bằng trang/SDK của cổng đó.

---

## YÊU CẦU THAY ĐỔI: CR-03 — CỬA HÀNG XÁC NHẬN ĐƠN, KHÁCH TỰ HỦY, ĐIỀU PHỐI TÀI XẾ

**Mã hồ sơ:** `CR-2026-GUGUGAGA-03`
**Ngày khởi tạo:** 22/11/2026 (giai đoạn QTDA, sau CR-02)
**Người đề xuất:** Trần Phan Minh Tiến (Technical Lead)
**Trạng thái:** Đã thực hiện và merge vào `main` (PR #51–#55); **chờ CCB xác nhận** (chữ ký bên dưới)

### 1. Lý do đề xuất
- Khi thử trên điện thoại, đơn COD chuyển thẳng sang "Đã chấp nhận" nên tài xế nhận đơn khi cửa hàng chưa xác nhận; tab "Chờ xác nhận" của khách luôn trống với đơn đã thanh toán.
- Khi chạy thử API thật, nhóm tìm ra các lỗ hổng luồng đơn và thanh toán (R13, R14 trong sổ rủi ro).
- Nhiều người cùng thử bằng một tài khoản tài xế, dễ nhận trùng đơn.

### 2. Nội dung thay đổi
| Hạng mục | Trước | Sau |
|---|---|---|
| Trạng thái đầu của đơn | COD: Đã chấp nhận; online: Chờ xác nhận | **Mọi đơn** vào Chờ xác nhận; cửa hàng/admin xác nhận thì tài xế mới thấy |
| Chuyển trạng thái | Tuỳ ý | Theo bảng chuyển trạng thái chung (admin, tài xế, khách) |
| Đơn online chưa trả | Xác nhận được | Không xác nhận được; quá 30 phút tự hủy |
| Khách hủy đơn | Không có | Khách hủy được khi còn Chờ xác nhận |
| Nhận đơn | Đọc rồi ghi, có thể nhận trùng | Giao dịch Firestore; tab Mới lọc theo chi nhánh |
| Tài khoản tài xế | Một tài khoản | Bốn tài khoản mẫu; admin tạo tài xế có kiểm tra dữ liệu |
| `check-payment` | Ai có token cũng gọi được, `force` luôn chạy | Chỉ chủ đơn; `force` chỉ ở chế độ demo |

### 3. Đánh giá tác động
- **Phạm vi:** backend, trang admin, app khách, app tài xế; không thêm phân hệ mới.
- **Tiến độ:** thực hiện trong 22–23/11, không làm trễ mốc nộp.
- **Chất lượng:** backend 80 test tự động, kiểm chứng ba tài xế nhận đồng thời một đơn, quay video demo trên điện thoại thật.
- **Hạn chế còn lại:** hủy đơn đã trả tiền chưa tự hoàn tiền (R17); khi demo có công tắc `AUTO_ACCEPT_DEMO` tự xác nhận sau 30 giây, mặc định tắt.

### 4. Phê duyệt của CCB
[CẦN BỔ SUNG: chữ ký Technical Lead, PM/QA và giảng viên nếu có]

