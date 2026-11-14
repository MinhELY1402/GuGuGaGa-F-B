# BỘ SLIDE THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN CUỐI KỲ (16 PHÚT)
## ĐỒ ÁN MÔN HỌC QUẢN TRỊ DỰ ÁN PHẦN MỀM — VKU

**Hội đồng chấm thi:** TS. Nguyễn Thanh Tuấn & Các thầy cô Hội đồng Khoa Khoa học Máy tính  
**Tên đề tài:** Hệ Sinh Thái Đặt Món Ăn Trực Tuyến Tích Hợp AI — GuGuGaGa  
**Nhóm sinh viên (4 thành viên):** Võ Nhật Huy, Trần Phan Minh Tiến, Nguyễn Minh, Nguyễn Gia Bảo  
**Thời lượng phân bổ:** 6 phút thuyết trình Slide + 5 phút Live Demo + 5 phút Hội đồng Q&A  

---

### SLIDE 1: TRANG TIÊU ĐỀ & ĐỘI NGŨ DỰ ÁN
* **Tiêu đề lớn**: HỆ SINH THÁI ĐẶT MÓN ĂN VIỆT NAM TÍCH HỢP TRÍ TUỆ NHÂN TẠO (GUGUGAGA)
* **Sourcing Pathway**: Pathway 1 (Kế thừa / Song hành Đồ án chuyên ngành kỹ thuật)
* **Cơ cấu tổ chức (4 thành viên)** — tỷ lệ đóng góp lấy theo GitHub Insights, xem báo cáo:
  - **Võ Nhật Huy**: Project Lead / Scrum Master & QA Lead
  - **Trần Phan Minh Tiến**: Technical Lead & System Architect
  - **Nguyễn Minh**: Frontend Engineer — Flutter & React
  - **Nguyễn Gia Bảo**: Backend & AI Engineer — Node.js & PyTorch

---

### SLIDE 2: BỐI CẢNH NGHIỆP VỤ & BUSINESS CASE
* **Vấn đề thực tế**:
  - Khách hàng gặp khó khăn khi tìm kiếm món ăn Việt Nam truyền thống bằng hình ảnh thực tế.
  - Quán ăn F&B chịu mức phí sàn quá cao (20–30%) và mất nhiều thời gian kiểm tra sao kê chuyển khoản ngân hàng thủ công.
* **Giải pháp GuGuGaGa**:
  - Bộ 5 phân hệ khép kín (Khách hàng, Tài xế, Quản trị, Server API và Dịch vụ AI nhận diện 30 món ăn Việt Nam).
  - Tự động hóa 100% quy trình đối soát tiền ngân hàng qua cổng VietQR/Casso.

---

### SLIDE 3: KIẾN TRÚC HỆ THỐNG & CƠ CẤU PHÂN RÃ WBS (100% RULE)
* **Sơ đồ kiến trúc 5 phân hệ**: Flutter Mobile (Khách & Shipper) $\rightarrow$ REST API (Node.js/Express) $\leftrightarrow$ Flask AI (PyTorch MobileNetV2) & Firebase Firestore.
* **Quy tắc 100% Rule**: Bao quát toàn diện 27 gói công việc lá (1.480h nỗ lực).
* **MoSCoW Sizing**: Must-Have chiếm **63.0% số gói và 62.2% công sức** (sát mức ~60% yêu cầu MVP).

---

### SLIDE 4: CHỈ SỐ THỰC THI & LỊCH TRÌNH ĐƯỜNG GĂNG (CPM & BURNDOWN)
* **Chuỗi đường găng**: $\text{Start} \rightarrow A \rightarrow B \rightarrow D \rightarrow E \rightarrow G \rightarrow I \rightarrow L \rightarrow M \rightarrow \text{End}$ (67.5 ngày làm việc).
* **Lịch sử dự án**: Sản phẩm kế thừa từ ĐACN1 (từ 24/08); repo QTDA được tổ chức lại ngày 09/11/2026; từ đó mọi thay đổi đi qua PR có review và CI (xem `docs/00_Project_History.md`).

---

### SLIDE 5: THÁCH THỨC QUẢN TRỊ LỚN NHẤT — BIẾN CỐ SCOPE CHANGE CR-01
* **Biến cố thực tế**: Webhook Casso chậm 30–60s do mạng chập chờn $\rightarrow$ Khách hàng hoang mang sợ mất tiền.
* **Biện pháp giải quyết chuẩn QLDA**:
  - Ghi nhận rủi ro R01 (Mức Đỏ 15/25) trong Risk Register.
  - Ban CCB phê duyệt **Change Request CR-01**: Bổ sung endpoint `/check-payment`, kích hoạt polling 5 giây tại Client và nút *"Tôi đã chuyển khoản"*.
  - Kết quả: Khách không còn phải chờ webhook; có thể chủ động kiểm tra thanh toán. *(Số liệu đo: [CẦN BỔ SUNG])*

---

### SLIDE 6: KẾT QUẢ NGHIỆM THU (UAT)
* Địa điểm / người tham gia: [CẦN BỔ SUNG].
* Kết quả UAT: [CẦN BỔ SUNG sau buổi UAT thật — số kịch bản PASS/FAIL, người tham gia].
* Biên bản nghiệm thu: [đính kèm bản scan có chữ ký thật].

---

### SLIDE 7: BÀI HỌC KINH NGHIỆM HÀNG ĐẦU (TOP LESSONS LEARNED)
* **Thiết kế chịu lỗi cho dịch vụ bên thứ ba (Third-party Resilience)**: Luôn xây dựng cơ chế Polling song song và Fallback đa tầng.
* **Kỷ luật GitFlow**: Bắt buộc Peer Review và bảo vệ nhánh chính giúp bảo vệ tính toàn vẹn hệ thống.
* **Tối ưu hóa mô hình AI**: Chọn giải pháp thực dụng (MobileNetV2 9.3MB) thay vì mô hình cồng kềnh khó triển khai.

---

### SLIDE 8: CHUYỂN TIẾP SANG LIVE DEMO (5 PHÚT)
* **Quy trình Demo 3 thiết bị đồng thời**:
  1. *Khách hàng (Minh)*: Chụp ảnh món Bánh bèo $\rightarrow$ AI nhận diện $\rightarrow$ Đặt món quét mã VietQR.
  2. *Web Admin (Bảo)*: Màn hình Admin nhận đơn $\rightarrow$ Tiền vào tài khoản đơn tự động duyệt $\rightarrow$ Gán tài xế.
  3. *Tài xế (Minh)*: App Shipper nhận đơn $\rightarrow$ Mapbox vẽ tuyến đường giao hàng $\rightarrow$ Xác nhận thu COD.
* *Sẵn sàng nhận câu hỏi phản biện từ Hội đồng!*
