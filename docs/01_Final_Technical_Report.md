# BÁO CÁO TỔNG KẾT KỸ THUẬT ĐỒ ÁN QUẢN TRỊ DỰ ÁN PHẦN MỀM
## HỆ SINH THÁI ĐẶT MÓN ĂN TRỰC TUYẾN TÍCH HỢP TRÍ TUỆ NHÂN TẠO — GUGUGAGA

**Học phần:** Quản Trị Dự Án Phần Mềm (Software Project Management)  
**Đơn vị:** Khoa Khoa học Máy tính — Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU)  
**Giảng viên phụ trách:** TS. Nguyễn Thanh Tuấn  
**Thời gian thực hiện:** 24/08/2026 – 16/11/2026 (12 tuần)  
**Nhóm sinh viên thực hiện:**
1. **Võ Nhật Huy** (Lead & QA Lead) — Mã SV: 23ITE... — Tỷ lệ đóng góp: 25%
2. **Nguyễn Minh Tiến** (Technical Lead & System Architect) — Mã SV: 23ITE... — Tỷ lệ đóng góp: 25%
3. **Nguyễn Minh** (Frontend Engineer) — Mã SV: 23ITE... — Tỷ lệ đóng góp: 25%
4. **Nguyễn Gia Bảo** (Backend & AI Engineer) — Mã SV: 23ITE... — Tỷ lệ đóng góp: 25%

---

## CHƯƠNG 1: TỔNG QUAN DỰ ÁN & BỐI CẢNH NGHIỆP VỤ (EXECUTIVE SUMMARY & BUSINESS CASE)

### 1.1. Bối cảnh thực tế & Đặt vấn đề
Trong bối cảnh chuyển đổi số ngành dịch vụ ăn uống (F&B) tại Việt Nam, các mô hình đặt đồ ăn trực tuyến truyền thống thường gặp hai hạn chế lớn:
1. **Tìm kiếm món ăn thụ động**: Khách hàng chỉ có thể tìm kiếm bằng từ khóa chính xác, gặp khó khăn khi muốn tìm lại món ăn Việt Nam truyền thống thông qua hình ảnh chụp ngoài đời thực hoặc khi cần tư vấn nhanh về khẩu vị, ngân sách.
2. **Chi phí trung gian cao & Đối soát thanh toán thủ công**: Các cửa hàng F&B vừa và nhỏ chịu mức chiết khấu cao từ sàn thương mại (20–30%) và mất nhiều công sức xác minh thủ công các giao dịch chuyển khoản ngân hàng trong giờ cao điểm.

### 1.2. Giải pháp phần mềm GuGuGaGa
Nhóm đã lựa chọn **Pathway 1 (Kế thừa / Song hành Đồ án chuyên ngành)** theo Điều lệ dự án, thiết lập khung quản trị dự án chuyên nghiệp bao quanh sản phẩm phần mềm **GuGuGaGa**. Hệ thống bao gồm 5 phân hệ hoàn chỉnh:
- **Khách hàng (Mobile Flutter)**: Đặt món, tìm món qua camera AI (MobileNetV2), tư vấn thực đơn qua Gemini AI Chatbot, thanh toán quét mã VietQR Napas247.
- **Tài xế (Mobile Flutter)**: Nhận đơn, dẫn đường bằng Mapbox Directions API kết hợp dự phòng kép OSRM, gọi điện một chạm cho khách và xác nhận thu COD.
- **Quản trị (Web React + Vite)**: Dashboard thống kê KPI doanh thu, quản lý danh mục, thực đơn, chi nhánh và điều phối tài xế.
- **Máy chủ API (Node.js/Express + Firebase Firestore)**: Quản lý dữ liệu thời gian thực, xác thực JWT phân quyền 3 roles, tích hợp webhook đối soát số dư Casso.
- **Dịch vụ AI (Python Flask + PyTorch)**: Nhận diện 30 món ăn Việt Nam với cơ chế ImageNet fallback tự động.

### 1.3. Mục tiêu SMART của dự án
- **Specific**: Xây dựng trọn vẹn 5 phân hệ hoạt động liên thông từ đặt hàng đến giao hàng thành công.
- **Measurable**: Độ chính xác nhận diện AI $\ge 80\%$, thời gian đối soát webhook ngân hàng $\le 1.5$ giây, hoàn tất 100% 16 gói công việc Must-Have.
- **Achievable**: Tận dụng Transfer Learning trên MobileNetV2 (~9.3MB) và dịch vụ Cloud Firestore không máy chủ để giảm thiểu chi phí vận hành.
- **Relevant**: Đáp ứng bài toán bán đồ ăn thật cho đối tác quán ăn F&B tại Đà Nẵng.
- **Time-bound**: Hoàn thành toàn diện trong 12 tuần (24/08/2026 – 16/11/2026).

---

## CHƯƠNG 2: PHƯƠNG PHÁP LUẬN & CƠ CẤU QUẢN TRỊ (METHODOLOGY & TEAM GOVERNANCE)

### 2.1. Lựa chọn phương pháp luận Agile/Scrum kết hợp Kanban
Nhóm đã áp dụng phương pháp luận **Hybrid Agile**:
- **Khung Scrum**: Chia tiến độ thành 4 Sprint (mỗi Sprint từ 2 đến 3 tuần) với đầy đủ các nghi thức: Sprint Planning, Daily Scrum 15 phút, Sprint Review và Sprint Retrospective.
- **Bảng Kanban trên GitHub Projects**: Trực quan hóa luồng công việc qua 5 cột trạng thái: `Backlog` $\rightarrow$ `Ready` $\rightarrow$ `In Progress` $\rightarrow$ `In Review` $\rightarrow$ `Done`.

### 2.2. Cơ cấu phân công vai trò (RACI Matrix)
Nhóm đã phân công rõ ràng 4 vai trò kỹ thuật:
- **Huy**: Project Lead / Scrum Master & QA Lead.
- **Tiến**: Technical Lead & System Architect.
- **Minh**: Frontend Engineer (Flutter & React).
- **Bảo**: Backend & AI Engineer (Node.js & Python).

---

## CHƯƠNG 3: ĐƯỜNG CƠ SỞ PHẠM VI, WBS & TỪ ĐIỂN WBS (SCOPE BASELINE)

### 3.1. Cây phân rã công việc WBS (Tuân thủ Quy tắc 100% Rule)
Phạm vi dự án được phân rã thành 27 gói công việc lá (Leaf Work Packages) thuộc 7 nhánh chính:
`1.1 Quản trị & Hạ tầng` $\rightarrow$ `1.2 Backend API & Database` $\rightarrow$ `1.3 Customer Mobile App` $\rightarrow$ `1.4 Shipper Mobile App` $\rightarrow$ `1.5 Admin Web Portal` $\rightarrow$ `1.6 AI & Chatbot Service` $\rightarrow$ `1.7 QA, Tích hợp & Triển khai`.

### 3.2. Phân loại MoSCoW & Cấu trúc MVP
- **Must-Have (MVP cốt lõi)**: 16 gói (chiếm 59.3% số gói, 880h nỗ lực, đạt chuẩn ~60% yêu cầu).
- **Should-Have**: 5 gói (18.5% — Mapbox routing, review, dashboard KPI).
- **Could-Have**: 5 gói (18.5% — AI Scan món ăn MobileNetV2, Receipt Scan).
- **Won't-Have**: 1 gói (3.7% — Trợ lý đàm thoại giọng nói v2).

---

## CHƯƠNG 4: ƯỚC LƯỢNG, LỊCH TRÌNH CPM & VẬN TỐC ĐỘI NGŨ (ESTIMATION, SCHEDULE & VELOCITY)

### 4.1. Phân tích đường găng (Critical Path Method - CPM)
Dựa trên ước tính 3 điểm PERT ($T_e = \frac{O + 4M + P}{6}$), chuỗi đường găng được xác định:
$$\mathbf{Start \rightarrow A \rightarrow B \rightarrow D \rightarrow E \rightarrow G \rightarrow I \rightarrow L \rightarrow M \rightarrow End}$$
Tổng thời gian kỳ vọng là **67.5 ngày làm việc (~13.5 tuần)** với độ lệch chuẩn $\sigma = 2.62$ ngày. Nhóm đã tối ưu hóa các nhánh song song (AI và Admin) để đưa tiến độ thực tế về đúng **12 tuần (24/08 – 16/11)**.

### 4.2. Vận tốc đội ngũ qua 4 Sprint (Velocity & Story Points)
- **Sprint 1**: Kế hoạch 34 SP $\rightarrow$ Thực tế hoàn thành 32 SP (Velocity: 32 SP).
- **Sprint 2**: Kế hoạch 42 SP $\rightarrow$ Thực tế hoàn thành 40 SP (Velocity: 40 SP).
- **Sprint 3**: Kế hoạch 38 SP $\rightarrow$ Thực tế hoàn thành 38 SP (Velocity: 38 SP).
- **Sprint 4**: Kế hoạch 30 SP $\rightarrow$ Thực tế hoàn thành 30 SP (Velocity: 30 SP).

---

## CHƯƠNG 5: THỰC THI & KIỂM SOÁT CHẤT LƯỢNG (EXECUTION, TESTING & CI/CD)

### 5.1. Kỷ luật mã nguồn & Phân tích GitHub Insights
- 100% các dòng mã được đưa vào hệ thống thông qua Pull Request trên GitHub.
- Tuân thủ quy chuẩn **Conventional Commits**: `feat(...)`, `fix(...)`, `docs(...)`, `test(...)`.
- Lịch sử đóng góp trải đều cả 12 tuần của 4 thành viên (Huy, Tiến, Minh, Bảo), không có hiện tượng dump commit dồn cục cuối kỳ.

### 5.2. Đường ống tự động hóa CI/CD (GitHub Actions)
File `.github/workflows/ci.yml` tự động kích hoạt kiểm tra khi có PR vào nhánh `develop`:
- Kiểm tra cú pháp (Linting) và chạy test backend Node.js.
- Kiểm tra tính hợp lệ của phân tích mã nguồn Flutter (`flutter analyze`).

### 5.3. Định nghĩa hoàn thành (Definition of Done - DoD)
Một task chỉ được kéo sang cột `Done` khi:
1. Code đã vượt qua kiểm tra CI Actions tự động.
2. Có ít nhất 01 thành viên khác trong nhóm duyệt code (Peer Review Approval).
3. Đã viết kiểm thử và kiểm tra xác minh thực tế.
4. Tài liệu hướng dẫn liên quan đã được cập nhật.

---

## CHƯƠNG 6: QUẢN TRỊ RỦI RO & KIỂM SOÁT THAY ĐỔI PHẠM VI (RISK & SCOPE CHANGE CONTROL)

### 6.1. Sự tiến hóa của Bảng theo dõi rủi ro (Risk Register Evolution)
Nhóm đã nhận diện 6 rủi ro thực tế trong suốt dự án:
- **R01 (Casso Webhook delay)**: Đánh giá ban đầu điểm 15/25 (Mức Đỏ) $\rightarrow$ Đã xử lý thành công bằng cơ chế Polling song song $\rightarrow$ Điểm giảm về 4/25 (Mức Xanh).
- **R02 (Xung đột nhận đơn giữa tài xế)**: Điểm 16/25 (Mức Đỏ) $\rightarrow$ Khắc phục bằng Optimistic Locking và cờ trạng thái Firestore $\rightarrow$ Điểm giảm về 6/25 (Mức Xanh).
- **R03 (AI nhận diện nhầm món)**: Khắc phục bằng Top-3 gợi ý và ImageNet Fallback.

### 6.2. Hồ sơ xử lý thay đổi phạm vi thực tế (Approved Change Request CR-01)
Vào tuần 8 (Sprint 2), nhóm đã đối mặt với biến cố thực tế: mạng chập chờn khiến Webhook Casso chậm đối soát 30–60 giây. Ban kiểm soát thay đổi (CCB) đã họp và phê duyệt **CR-01**: Bổ sung endpoint `/api/user/orders/:id/check-payment` và cơ chế Client Polling chu kỳ 5 giây, kèm nút *"Tôi đã chuyển khoản"* cho phép đối soát cưỡng bức ngay lập tức. Thay đổi này đã bảo vệ trải nghiệm khách hàng và giải quyết triệt để rủi ro thanh toán.

---

## CHƯƠNG 7: NGHIỆM THU, ĐÓNG DỰ ÁN & BÀI HỌC KINH NGHIỆM (PROJECT CLOSURE & LESSONS LEARNED)

### 7.1. Kết quả kiểm thử chấp nhận người dùng (UAT)
Hệ thống đã được chạy thử nghiệm thực tế với sự tham gia của đối tác kinh doanh quán ăn. Toàn bộ 16 kịch bản UAT (từ quét camera AI, tư vấn thực đơn, thanh toán VietQR đến tài xế nhận đơn và dẫn đường Mapbox) đều đạt trạng thái **PASS**. Biên bản nghiệm thu đã được đại diện đối tác ký xác nhận.

### 7.2. Bài học kinh nghiệm xương máu (Top Lessons Learned)
1. **Quản lý rủi ro từ bên thứ ba**: Luôn luôn chuẩn bị cơ chế dự phòng (Fallback) khi phụ thuộc vào dịch vụ bên ngoài (như cổng ngân hàng Casso hoặc API Mapbox).
2. **Kỷ luật GitFlow và Pull Request**: Việc cấm push trực tiếp vào `main` và bắt buộc review code chéo đã giúp nhóm phát hiện sớm các lỗi xung đột dữ liệu Firestore và cú pháp trước khi merge.
3. **Sức mạnh của mô hình AI nhẹ**: Việc tinh chỉnh MobileNetV2 với dung lượng chỉ 9.3MB giúp server khởi động nhanh và hoạt động bền bỉ trên máy chủ tài nguyên hạn chế.
