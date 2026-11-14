# CÂY WBS & TỪ ĐIỂN WBS (WBS & WBS DICTIONARY)
## HỆ THỐNG GUGUGAGA (100% RULE COMPLIANT)

---

## 1. CÂY PHÂN RÃ CÔNG VIỆC WBS (LEVEL 1 -> LEVEL 3)

```
1.0 Hệ sinh thái GuGuGaGa
│
├── 1.1 Quản trị & Hạ tầng (PM & Infra)
│   ├── 1.1.1 Khởi tạo Repo, quy chuẩn Git & CI/CD Pipeline (Must)
│   └── 1.1.2 Thiết lập Firebase Firestore, Auth & Cloudinary (Must)
│
├── 1.2 Backend API & Database
│   ├── 1.2.1 Auth, JWT Tokens & Middleware phân quyền 3 Roles (Must)
│   ├── 1.2.2 Quản lý Thực đơn, Danh mục, Chi nhánh & Combo (Must)
│   ├── 1.2.3 Quản lý Giỏ hàng & Vòng đời Đơn hàng (Must)
│   ├── 1.2.4 Tích hợp Cổng VietQR & Webhook đối soát Casso (Must)
│   └── 1.2.5 Hệ thống Thông báo & Đánh giá Review (Should)
│
├── 1.3 Customer Mobile App (Flutter)
│   ├── 1.3.1 Màn hình Đăng nhập, Đăng ký & AuthProvider (Must)
│   ├── 1.3.2 Khám phá Món ăn, Lọc danh mục & Chọn Chi nhánh (Must)
│   ├── 1.3.3 Tùy biến Món, Giỏ hàng & Luồng Đặt món (Must)
│   ├── 1.3.4 Thanh toán VietQR động & Tiền mặt COD (Must)
│   ├── 1.3.5 Theo dõi lộ trình đơn hàng & Lịch sử (Should)
│   └── 1.3.6 Camera AI Scan món ăn & Gemini Chatbot UI (Could)
│
├── 1.4 Shipper Mobile App (Flutter)
│   ├── 1.4.1 Đăng nhập tài xế & Bật/Tắt trạng thái nhận đơn (Must)
│   ├── 1.4.2 Danh sách đơn chờ & Nhận đơn chống tranh chấp (Must)
│   ├── 1.4.3 Tích hợp Bản đồ Mapbox dẫn đường & OSRM fallback (Should)
│   └── 1.4.4 Xác nhận giao hàng, gọi khách & Thu tiền COD (Must)
│
├── 1.5 Admin Web Portal (React + Vite)
│   ├── 1.5.1 Dashboard phân tích doanh thu & Biểu đồ KPI (Should)
│   ├── 1.5.2 Quản lý Món ăn, Danh mục, Chi nhánh & Combos (Must)
│   ├── 1.5.3 Quản lý Đơn hàng & Gán tài xế thủ công (Must)
│   └── 1.5.4 Quản lý Tài khoản người dùng & Duyệt tài xế (Should)
│
├── 1.6 AI & Chatbot Service (Python + Gemini)
│   ├── 1.6.1 Thu thập & Tiền xử lý Dataset 30 món ăn Việt Nam (Could)
│   ├── 1.6.2 Huấn luyện Transfer Learning MobileNetV2 trên PyTorch (Could)
│   ├── 1.6.3 Triển khai Flask REST API & ImageNet Fallback Mapper (Could)
│   └── 1.6.4 Tích hợp Gemini 2.5 Flash quét hóa đơn & Chatbot thực đơn (Could)
│
└── 1.7 QA, Tích hợp & Triển khai
    ├── 1.7.1 Kiểm thử liên thông toàn hệ thống (E2E Integration Test) (Must)
    └── 1.7.2 Triển khai Cloud, Build APK & Nghiệm thu UAT (Must)
```

---

## 2. TỪ ĐIỂN WBS CHI TIẾT (3 GÓI TRỌNG YẾU)

### Gói 1: WBS 1.2.4 — Cổng Thanh toán VietQR & Webhook Casso
* **Phân hệ**: Backend Service (`Backend/src/services/order.service.js`)
* **Chủ trì**: Nguyễn Gia Bảo (Backend Lead) | **Người kiểm thử**: Võ Nhật Huy (QA)
* **Thời gian ước tính**: 60 giờ (1.5 tuần) | **Phân cấp MoSCoW**: **Must-Have**
* **Mô tả công việc**:
  1. Sinh mã VietQR theo chuẩn Napas247 dựa trên mã đơn hàng duy nhất và tài khoản ngân hàng.
  2. Xây dựng API nhận Webhook (`POST /api/user/orders/webhook/casso`) đối soát biến động số dư.
  3. Khớp chuỗi nội dung chuyển khoản `GUGUGAGA_<orderId>` và số tiền thanh toán trong Firestore.
  4. Cập nhật `paymentStatus = "PAID"` và gửi thông báo realtime cho người dùng.
* **Tiêu chí nghiệm thu (Acceptance Criteria)**:
  - Mã VietQR quét được bằng các ứng dụng ngân hàng thông dụng (MB, Vietcombank, Techcombank).
  - Tự động đối soát và cập nhật đơn trong thời gian $\le 1.5$ giây kể từ khi nhận webhook.
  - Xử lý Idempotency: Nhận trùng 2 webhook không làm sai lệch trạng thái đơn hàng.

### Gói 2: WBS 1.4.2 & 1.4.4 — Shipper Tiếp Nhận Đơn & Xác Nhận Thu COD
* **Phân hệ**: Shipper Mobile App (`gugugaga shipper/lib/screens/`)
* **Chủ trì**: Nguyễn Minh (Frontend) | **Phối hợp**: Trần Phan Minh Tiến (Tech Lead)
* **Thời gian ước tính**: 80 giờ (2 tuần) | **Phân cấp MoSCoW**: **Must-Have**
* **Mô tả công việc**:
  1. Xây dựng danh sách đơn hàng sẵn sàng nhận theo chi nhánh.
  2. Cơ chế khóa lạc quan (Optimistic check) ngăn chặn 2 tài xế nhận cùng 1 đơn.
  3. Màn hình chi tiết lộ trình, tích hợp nút gọi điện trực tiếp cho người nhận.
  4. Nút bấm chuyển trạng thái: `ASSIGNED` $\rightarrow$ `PICKED_UP` $\rightarrow$ `DELIVERING` $\rightarrow$ `DELIVERED`.
  5. Hộp kiểm bắt buộc tài xế xác nhận *"Đã thu đủ [X] VNĐ"* trước khi hoàn tất đơn COD.
* **Tiêu chí nghiệm thu (Acceptance Criteria)**:
  - Tài xế thứ hai bấm nhận đơn đã có chủ sẽ lập tức nhận thông báo lỗi và danh sách tự làm mới.
  - Nút gọi khách hàng mở ứng dụng điện thoại mặc định với số điện thoại chính xác.

### Gói 3: WBS 1.6.2 & 1.6.3 — Huấn Luyện MobileNetV2 & Flask Inference API
* **Phân hệ**: AI Service (`AI_Service/`)
* **Chủ trì**: Nguyễn Gia Bảo (AI Engineer) | **Kiểm duyệt**: Trần Phan Minh Tiến
* **Thời gian ước tính**: 80 giờ (2 tuần) | **Phân cấp MoSCoW**: **Could-Have**
* **Mô tả công việc**:
  1. Xây dựng pipeline Transfer Learning trên PyTorch với Backbone MobileNetV2 pretrained từ ImageNet.
  2. Đóng băng blocks 0-13, mở khóa tinh chỉnh blocks 14-18; classifier head 30 lớp món Việt Nam.
  3. Xuất file trọng số `food_classifier.pth` nhẹ dưới 15MB.
  4. Lập trình Flask API endpoint `POST /predict`, xử lý tensor chuẩn hóa ImageNet.
  5. Xây dựng module Fallback ImageNet Mapper tự động nếu chưa có file trọng số custom.
* **Tiêu chí nghiệm thu (Acceptance Criteria)**:
  - Top-1 Accuracy trên tập kiểm thử đạt $\ge 80\%$, Top-3 đạt $\ge 92\%$.
  - Tốc độ xử lý inference $\le 500$ms trên CPU thông thường.
  - Trả về JSON đúng cấu trúc `{ success: true, class_name: string, confidence: float }`.
