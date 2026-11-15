# HỒ SƠ KIỂM SOÁT THAY ĐỔI PHẠM VI (SCOPE CHANGE CONTROL RECORD)
## YÊU CẦU THAY ĐỔI: CR-01 (APPROVED)

**Mã hồ sơ:** `CR-2026-GUGUGAGA-01`  
**Dự án:** Hệ sinh thái GuGuGaGa  
**Ngày khởi tạo yêu cầu:** 12/10/2026 (Tuần 8 — Sprint 2)  
**Người đề xuất (Requester):** Võ Nhật Huy (Project Lead & QA Lead)  
**Ban kiểm soát thay đổi (CCB):** Võ Nhật Huy, Nguyễn Minh Tiến, Nguyễn Gia Bảo, Nguyễn Minh  
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
* **Tác động chất lượng (Quality Impact)**: Nâng tỷ lệ xác nhận thanh toán thành công tức thì từ 78% lên **99.5%**, loại bỏ hoàn toàn rủi ro khách hàng huỷ đơn do trễ webhook.

---

### 4. Biên bản phê duyệt của Ban Kiểm Soát Thay Đổi (CCB Sign-off)

| Thành viên CCB | Vai trò | Quyết định | Chữ ký xác nhận |
|---|---|:---:|:---:|
| **Võ Nhật Huy** | Project Lead / Chủ tịch CCB | **Chấp thuận** | *(Đã ký)* |
| **Nguyễn Minh Tiến** | Technical Lead / Thành viên | **Chấp thuận** | *(Đã ký)* |
| **Nguyễn Gia Bảo** | Backend Lead / Người thực thi BE | **Chấp thuận** | *(Đã ký)* |
| **Nguyễn Minh** | Frontend Lead / Người thực thi UI | **Chấp thuận** | *(Đã ký)* |

*Hồ sơ này được lưu trữ trong Kho bằng chứng dự án môn học Quản trị dự án phần mềm theo đúng tiêu chuẩn Cổng chân thực (Authenticity Gate).*
