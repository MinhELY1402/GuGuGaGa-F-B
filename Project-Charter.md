# ĐIỀU LỆ DỰ ÁN (PROJECT CHARTER)
## HỆ THỐNG ĐẶT MÓN ĂN TRỰC TUYẾN TÍCH HỢP AI — GUGUGAGA

**Mã dự án:** `DA-QLDA-2026-GUGUGAGA`  
**Học phần:** Quản Trị Dự Án Phần Mềm — VKU  
**Bắt đầu phát triển sản phẩm (ĐACN1):** 24/08/2026 | **Lập repo & khung QTDA:** 09/11/2026 | **Bảo vệ:** [ngày bảo vệ]  

---

### 1. Mục Đích & Bối Cảnh Dự Án (Project Purpose & Context)
Xây dựng giải pháp phần mềm hoàn chỉnh giúp các chuỗi cửa hàng ăn uống Việt Nam tự chủ kênh bán hàng trực tuyến, tích hợp trí tuệ nhân tạo (Computer Vision) để nhận diện món ăn truyền thống, trợ lý Gemini AI tư vấn thực đơn và cổng thanh toán tự động VietQR/Casso.

### 2. Nguồn Gốc Đề Tài (Sourcing Pathway)
* **Lựa chọn:** **Pathway 1 (Kế thừa / Song hành Đồ án chuyên ngành)**.
* **Nguồn kế thừa:** Đồ án chuyên ngành 1 — GVHD: [CẦN BỔ SUNG]; bằng chứng: [link báo cáo/repo ĐACN1].
* Lịch sử commit trước 09/11/2026 là lịch sử được tổ chức lại khi chuyển sản phẩm sang repo này (xem `docs/00_Project_History.md`).
* Thiết lập khung quản trị dự án phần mềm chuyên nghiệp (WBS, PERT/CPM, Agile/Scrum, GitFlow, Gói bằng chứng kiểm soát) bao quanh đồ án chuyên ngành kỹ thuật.

### 3. Mục Tiêu Dự Án (Project Objectives)
- Phát triển 5 phân hệ: Backend Node.js, Web Admin React, Mobile App Khách hàng (Flutter), Mobile App Tài xế (Flutter) và AI Service (Flask/PyTorch).
- Đạt độ chính xác nhận diện AI $\ge 80\%$, độ trễ đối soát ngân hàng $\le 1.5$s.
- 100% mã nguồn kiểm soát qua GitHub với sự đóng góp đều đặn của 4 thành viên.

### 4. Phạm Vi Dự Án (Project Scope)
- **In-Scope**: Xác thực JWT đa vai trò, quản lý Menu/Chi nhánh/Combo, Giỏ hàng, Đặt món, VietQR + Webhook Casso, Camera AI Scan món, Chatbot Gemini, App Shipper kèm Mapbox Routing & COD, Dashboard Admin.
- **Out-of-Scope (v2)**: Trợ lý giọng nói hai chiều trực tiếp; tích hợp cổng thanh toán quốc tế (Visa/Mastercard).

### 5. Yêu Cầu & Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- Giao dịch chuyển khoản ngân hàng khớp đúng mã đơn hàng và số tiền được tự động cập nhật sang trạng thái `PAID`.
- Tài xế tiếp nhận đơn hàng không xảy ra hiện tượng tranh chấp (Race condition).
- Giao diện người dùng di động và web hoạt động ổn định, không phát sinh crash.

### 6. Ràng Buộc & Giả Định (Constraints & Assumptions)
- Ràng buộc ngân sách: Sử dụng tài nguyên đám mây miễn phí (Firebase Spark Plan, Cloudinary Free, Mapbox Free Tier).
- Thời gian: Đúng 12 tuần (từ 24/08/2026 đến 16/11/2026).

### 7. Hệ Sinh Thái Quản Trị Dự Án Thống Nhất (Ecosystem)
- Sử dụng **GitHub Repository** làm nền tảng quản trị trung tâm: GitHub Issues, GitHub Projects Board, Pull Requests, và GitHub Actions.

### 8. Lịch Trình Các Mốc Chính (Key Milestones)
- **M1 (24/08/2026)**: Phê duyệt Điều lệ dự án & Setup hạ tầng CI/CD.
- **M2 (27/09/2026)**: Hoàn tất Sprint 1 (Auth, Database Schema & Menu Catalog).
- **M3 (18/10/2026)**: Hoàn tất Sprint 2 (Luồng Đặt món, VietQR & Biến cố CR-01).
- **M4 (01/11/2026)**: Hoàn tất Sprint 3 (Shipper App, Mapbox & Admin Web).
- **M5 (08/11/2026)**: Hoàn tất Sprint 4 (Phân hệ AI Computer Vision & Gemini).
- **M6 (16/11/2026)**: Nghiệm thu UAT, Đóng gói hồ sơ và Bảo vệ trước Hội đồng.

### 9. Rủi Ro Ban Đầu (Initial Risks)
- Trễ Webhook đối soát tài khoản ngân hàng Casso.
- Xung đột đồng thời khi hai tài xế cùng bấm nhận một đơn hàng.
- Mô hình AI nhận diện nhầm nhãn món ăn do ánh sáng hoặc góc chụp.

### 10. Cơ Cấu Tổ Chức & Phân Công 4 Thành Viên
1. **Võ Nhật Huy**: Project Lead / PM & QA Lead (Chịu trách nhiệm chung, phê duyệt PRs, lập Test Matrix).
2. **Trần Phan Minh Tiến**: Technical Lead & System Architect (Kiến trúc hệ thống, Firestore Schema, CI/CD).
3. **Nguyễn Minh**: Frontend Engineer (Chịu trách nhiệm 2 Mobile Apps Flutter và Web Admin).
4. **Nguyễn Gia Bảo**: Backend & AI Engineer (Chịu trách nhiệm Express API, VietQR, Casso và Flask AI).

### 11. Các Bên Liên Quan Chính (Key Stakeholders)
- **Giảng viên hướng dẫn môn học**: TS. Nguyễn Thanh Tuấn.
- **Khách hàng thụ hưởng thực tế**: Đại diện quán ăn đối tác F&B (ký nghiệm thu UAT).
- **Nhóm sinh viên phát triển**: 4 thành viên nhóm GuGuGaGa.

### 12. Ngân Sách Dự Kiến
- Chi phí hạ tầng: 0 VNĐ (tận dụng Free Tier của Google Cloud Firebase, Cloudinary, Casso và Mapbox).

### 13. Ký Tên Phê Duyệt (Sign-off)
- **Đại diện Nhóm (Project Lead)**: Võ Nhật Huy ([ký thật]).
- **Giảng viên phụ trách**: TS. Nguyễn Thanh Tuấn ([chữ ký / xác nhận thật]).
