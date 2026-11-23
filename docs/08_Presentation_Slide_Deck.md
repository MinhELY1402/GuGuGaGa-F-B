# BỘ SLIDE THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN CUỐI KỲ (16 PHÚT)
## ĐỒ ÁN MÔN HỌC QUẢN TRỊ DỰ ÁN PHẦN MỀM — VKU

**Hội đồng chấm thi:** TS. Nguyễn Thanh Tuấn & Các thầy cô Hội đồng Khoa Khoa học Máy tính  
**Tên đề tài:** Hệ Sinh Thái Đặt Món Ăn Trực Tuyến Tích Hợp AI — GuGuGaGa  
**Nhóm sinh viên (4 thành viên):** Võ Nhật Huy, Trần Phan Minh Tiến, Nguyễn Bảo Quang Minh, Nguyễn Gia Bảo  
**Thời lượng phân bổ:** 6 phút thuyết trình Slide + 5 phút Live Demo + 5 phút Hội đồng Q&A  

---

### SLIDE 1: TRANG TIÊU ĐỀ & ĐỘI NGŨ DỰ ÁN
* **Tiêu đề lớn**: HỆ SINH THÁI ĐẶT MÓN ĂN VIỆT NAM TÍCH HỢP TRÍ TUỆ NHÂN TẠO (GUGUGAGA)
* **Sourcing Pathway**: Pathway 1 (Kế thừa / Song hành Đồ án chuyên ngành kỹ thuật)
* **Cơ cấu tổ chức (4 thành viên)** — tỷ lệ đóng góp lấy theo GitHub Insights, xem báo cáo:
  - **Võ Nhật Huy**: Project Lead / Scrum Master & QA Lead
  - **Trần Phan Minh Tiến**: Technical Lead & System Architect
  - **Nguyễn Bảo Quang Minh**: Frontend Engineer — Flutter & React
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
* **Chuỗi đường găng**: $\text{Start} \rightarrow A \rightarrow B \rightarrow C \rightarrow D \rightarrow E \rightarrow G \rightarrow I \rightarrow L \rightarrow M \rightarrow \text{End}$ (cũ, bỏ sót C). Tính lại: **A→B→C→D→E→G→I→L→M = 75 ngày** → vượt hạn 12 tuần → điều chỉnh mạng còn **60 ngày (12 tuần), P ≈ 50%**.
* **Lịch sử dự án**: Sản phẩm kế thừa từ ĐACN1 (từ 24/08); repo QTDA được tổ chức lại ngày 09/11/2026; từ 14/11 thay đổi đi qua PR và CI có test thật (PR #26: CI 4/4 xanh, nhưng chưa có review). Branch protection đang chờ bật (issue #30).

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

### SLIDE 7: KIỂM THỬ THỰC TẾ & PHÁT HÀNH BETA (v1.1.0-beta)
* **Phát hành:** 2 APK Android (Khách hàng, Tài xế) trên GitHub Releases; server demo chạy qua Cloudflare Tunnel, đổi được địa chỉ server ngay trong app.
* **Test xanh chưa đủ:** 22/22 test tự động pass, CI xanh, nhưng khi cài lên điện thoại thật nhóm vẫn tìm ra **10 lỗi**:
  - App khách hàng không mở được (thiếu `MainActivity`).
  - Bản đồ và tra địa chỉ hỏng khi thiếu key.
  - Đăng nhập Google chỉ chạy trên web.
  - Quét AI đối soát lỗi do loại ảnh.
  - Dữ liệu mẫu thiếu ảnh, có danh sách quán bịa.
* **Sự cố bảo mật thật (R06):** key Gemini bị ghi cứng trong repo public. Đã chuyển chatbot sang gọi qua backend và xoá key khỏi app; key cũ cần được thu hồi.
* **Sự cố vận hành (R11):** tắt server sai cách làm mất dữ liệu demo 1 giờ. Đã sửa script để lưu dữ liệu trước khi tắt và tự lưu mỗi 10 phút.

---

### SLIDE 7B: RỦI RO PHÁT HIỆN KHI KIỂM THỬ LUỒNG ĐƠN (R02, R13, R14)
* **R02 — nhận đơn trùng (16 điểm đỏ):** nhận đơn bằng giao dịch Firestore. Đã thử ba tài xế bấm cùng lúc: chỉ một người nhận được.
* **R13 — khách tự đánh dấu "đã thanh toán" (20 điểm đỏ):** phát hiện khi thử gọi API sai cách; đã sửa: chỉ chủ đơn gọi được, xác nhận thủ công chỉ ở chế độ demo.
* **R14 — chuyển trạng thái đơn sai (16 điểm đỏ):** bảng chuyển trạng thái chung; đơn online chưa trả không xác nhận được.
* **Bài học:** test cũ chỉ kiểm tra luồng đúng. Lỗi lộ ra khi chủ động thử trường hợp xấu. Backend hiện có 80 test tự động.
* **Còn mở:** giới hạn số lần đăng nhập (R18), PR chưa được review (R19).

---

### SLIDE 8: BÀI HỌC KINH NGHIỆM HÀNG ĐẦU (TOP LESSONS LEARNED)
* **Thiết kế chịu lỗi cho dịch vụ bên thứ ba**: polling song song với webhook (CR-01); bản đồ và tra địa chỉ có nhiều tầng dự phòng (Mapbox → OpenStreetMap → toạ độ).
* **Phải thử trên thiết bị thật**: CI chỉ chứng minh code build được, không chứng minh app chạy được.
* **Không nhúng secret vào app di động**: key bí mật đặt ở backend; app chỉ giữ token public.
* **Quy trình phải khớp thực tế**: hồ sơ ghi "bắt buộc review", nhưng PR #26 vẫn được merge thẳng vào `main` khi chưa ai review. Cần bật branch protection (issue #30) thì quy định mới có hiệu lực.

---

### SLIDE 9: CHUYỂN TIẾP SANG LIVE DEMO (5 PHÚT)
* **Chuẩn bị:** bật server demo (`scripts/serve-demo.sh`), nhập URL vào 2 app.
* **Kịch bản demo 2 điện thoại + 1 máy tính** (các bước đã chạy được trên bản v1.1.0-beta):
  1. *Khách hàng*: đăng nhập bằng Google → chọn chi nhánh Đà Nẵng → hỏi chatbot "Tôi có 50k, tư vấn món ăn trưa" → thêm món vào giỏ → chọn địa chỉ trên bản đồ → đặt đơn chuyển khoản → bấm "Tôi đã chuyển khoản" (giả lập thanh toán).
  2. *Tài xế*: thấy đơn trong danh sách chờ → nhận đơn → bản đồ Mapbox vẽ đường đi → "Quét AI đối soát" ảnh biên lai → xác nhận giao.
  3. *Admin Web*: dashboard cập nhật doanh thu, đơn chuyển sang "Đã giao hàng".
* **Chưa demo:** quét món bằng camera AI, vì AI Service (PyTorch) chưa được host.
* *Sẵn sàng nhận câu hỏi phản biện từ Hội đồng!*
