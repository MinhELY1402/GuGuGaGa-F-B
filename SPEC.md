# Specification: GuGuGaGa Food Delivery Ecosystem with AI

## 1. Objective

GuGuGaGa là một hệ sinh thái hoàn chỉnh phục vụ đặt món ăn Việt Nam trực tuyến tích hợp trí tuệ nhân tạo (AI), bao gồm 5 phân hệ độc lập:
1. **Backend Service** (Node.js/Express): Cung cấp RESTful API, quản lý dữ liệu qua Firestore, xác thực JWT, thanh toán VietQR & webhook đối soát tự động Casso, và tích hợp AI.
2. **Web Admin Portal** (React + Vite + Tailwind CSS): Bảng điều khiển quản trị toàn diện dành cho chủ quán/quản lý (Dashboard KPI, món ăn, danh mục, combo, chi nhánh, phân phối đơn hàng, tài xế, người dùng).
3. **Customer Mobile App** (Flutter): Ứng dụng di động cho khách hàng đặt món, tìm kiếm món bằng ảnh chụp AI Camera (MobileNetV2), tư vấn thực đơn qua Gemini AI Chatbot, thanh toán quét mã VietQR và theo dõi trạng thái đơn hàng.
4. **Shipper Mobile App** (Flutter): Ứng dụng di động cho tài xế tiếp nhận đơn, chỉ đường bản đồ Mapbox/OSRM, cập nhật trạng thái đơn hàng và xác nhận thu hộ tiền mặt (COD).
5. **AI Service** (Python Flask + PyTorch): Dịch vụ thị giác máy tính nhận diện 30 món ăn Việt Nam sử dụng mô hình học sâu MobileNetV2 transfer learning và fallback mapper.

---

## 2. Tech Stack & Environment

| Subsystem | Technologies & Frameworks | Key Dependencies | Port / Target |
|---|---|---|---|
| **Backend** | Node.js (v18+), Express (ESM), Firebase Firestore | `firebase-admin`, `@google/generative-ai`, `jsonwebtoken`, `bcryptjs`, `cloudinary`, `multer`, `axios` | `http://localhost:5000` |
| **Admin** | React 18, Vite, Tailwind CSS, React Router v6 | `lucide-react`, `zustand`, `axios`, `recharts` | `http://localhost:5173` |
| **Customer App** | Flutter 3.3+, Dart | `provider`, `http`, `image_picker`, `flutter_markdown`, `intl`, `firebase_core`, `firebase_auth` | Android / iOS Mobile |
| **Shipper App** | Flutter 3.3+, Dart | `latlong2`, `flutter_map`, `http`, `url_launcher`, Mapbox Directions / OSRM | Android / iOS Mobile |
| **AI Service** | Python 3.9+, Flask, PyTorch, Torchvision | `torch`, `torchvision`, `pillow`, `numpy`, `flask` | `http://localhost:8000` |

---

## 3. Commands

### 3.1. Backend (`Backend/`)
- Cài đặt dependencies:
  ```bash
  cd Backend
  npm install
  ```
- Khởi động môi trường phát triển (Dev server):
  ```bash
  npm run dev
  ```
- Khởi động production:
  ```bash
  npm start
  ```
- Nạp dữ liệu mẫu Firestore (Database Seeding):
  ```bash
  npm run seed
  ```

### 3.2. Web Admin Portal (`Admin/`)
- Cài đặt dependencies:
  ```bash
  cd Admin
  npm install
  ```
- Khởi động dev server:
  ```bash
  npm run dev
  ```
- Build production bundle:
  ```bash
  npm run build
  ```
- Preview production build:
  ```bash
  npm run preview
  ```

### 3.3. Customer Mobile App (`gugugaga/`)
- Tải packages:
  ```bash
  cd gugugaga
  flutter pub get
  ```
- Cấu hình Firebase (nếu kết nối project mới):
  ```bash
  flutterfire configure
  ```
- Chạy ứng dụng trên thiết bị/máy ảo:
  ```bash
  flutter run
  ```
- Build APK:
  ```bash
  flutter build apk --release
  ```

### 3.4. Shipper Mobile App (`gugugaga shipper/`)
- Tải packages:
  ```bash
  cd "gugugaga shipper"
  flutter pub get
  ```
- Chạy ứng dụng:
  ```bash
  flutter run
  ```
- Build APK:
  ```bash
  flutter build apk --release
  ```

### 3.5. AI Service (`AI_Service/`)
- Tạo môi trường ảo & cài dependencies:
  ```bash
  cd AI_Service
  python -m venv venv
  # Windows:
  .\venv\Scripts\activate
  # Linux/macOS:
  source venv/bin/activate
  pip install -r requirements.txt
  ```
- Khởi động Flask API server:
  ```bash
  python app.py
  ```
- Huấn luyện lại mô hình (khi có dataset):
  ```bash
  python train.py --epochs 20 --batch_size 16 --lr 0.001
  ```

---

## 4. Project Structure & Architecture

```
d:\Quản Trị Dự Án\
├── AGENTS.md                          # Hướng dẫn cấu hình AI Agent & Skills
├── CONTRIBUTING.md                    # Quy chuẩn đóng góp dự án
├── SPEC.md                            # Đặc tả kỹ thuật và hiện trạng dự án (file này)
└── GuGuGaGa/                          # Thư mục mã nguồn chính của hệ thống
    ├── Backend/                       # Phân hệ API & Database
    │   ├── src/
    │   │   ├── configs/               # Cấu hình Firestore, Cloudinary, Env, ApiResponse
    │   │   ├── controllers/           # Auth, Orders, AI, Products, Cart, Dashboard...
    │   │   ├── middleware/            # JWT Auth, Role checking, File upload
    │   │   ├── routes/                # User, Admin, Shipper, Public, AI routes
    │   │   ├── services/              # Nghiệp vụ xử lý database, Casso, VietQR
    │   │   └── server.js              # Entrypoint server Express
    │   ├── seed-firestore.js          # Script tạo dữ liệu menu, chi nhánh ban đầu
    │   └── package.json
    │
    ├── Admin/                         # Phân hệ Quản trị Web Portal (React + Vite)
    │   ├── src/
    │   │   ├── components/            # Layout, Dialogs (Món, Combo, Tài xế, Chi nhánh)
    │   │   ├── hooks/                 # Custom React hooks (useOrders, useProducts...)
    │   │   ├── pages/                 # Dashboard, Orders, Products, Combos, Drivers...
    │   │   ├── services/              # API Client (Axios) tương tác với Backend
    │   │   ├── stores/                # Zustand State (useAuthStore)
    │   │   └── App.jsx
    │   └── package.json
    │
    ├── gugugaga/                      # Khách hàng - Mobile App (Flutter)
    │   ├── lib/
    │   │   ├── models/                # Order, Product, Combo, Branch, Review...
    │   │   ├── providers/             # AuthProvider, CartProvider, FavoriteProvider
    │   │   ├── screens/               # Home (AI Scan), Chat (Gemini), Checkout (VietQR), Tracking...
    │   │   ├── services/              # ApiService, AIService (Gemini), RouteService
    │   │   └── main.dart
    │   └── pubspec.yaml
    │
    ├── gugugaga shipper/              # Shipper - Mobile App (Flutter)
    │   ├── lib/
    │   │   ├── screens/               # Login, Home (Order list), OrderDetail (Status & COD)
    │   │   ├── services/              # ApiService, LocationService, RouteService (Mapbox/OSRM)
    │   │   └── main.dart
    │   └── pubspec.yaml
    │
    └── AI_Service/                    # Phân hệ Trí tuệ Nhân tạo (Flask + PyTorch)
        ├── models/                    # Lưu file trọng số food_classifier.pth (~9.3MB)
        ├── app.py                     # Flask inference API (cổng 8000), Fallback Mapper
        ├── train.py                   # Huấn luyện MobileNetV2 cho 30 món ăn Việt Nam
        └── requirements.txt
```

---

## 5. Implementation Status Audit (Đánh giá hiện trạng)

### 5.1. Những phần đã hoàn thiện (Completed Features)
1. **Backend Lõi & API**:
   - Xác thực JWT phân quyền 3 roles (`CUSTOMER`, `ADMIN`, `DRIVER`).
   - Quản lý đầy đủ Menu, Món ăn, Danh mục, Chi nhánh, Combo, Giỏ hàng.
   - Vòng đời đơn hàng (`PENDING` -> `ACCEPTED` -> `DRIVER_ASSIGNED` -> `DELIVERED` / `CANCELLED`).
   - Tích hợp cổng thanh toán VietQR động và dịch vụ đối soát biến động số dư ngân hàng qua Webhook Casso (`handleCassoWebhook`).
   - Tích hợp endpoint chuyển tiếp ảnh nhận diện món sang AI Service (`/api/ai/recognize-food`) và quét biên lai qua Gemini Vision (`/api/ai/scan-receipt`).
   - Hệ thống đánh giá sao (Reviews) cho món ăn và tài xế; hệ thống thông báo realtime đơn hàng.

2. **Web Admin Portal**:
   - Giao diện quản trị hiện đại, responsive với Tailwind CSS & Lucide Icons.
   - Dashboard thống kê tổng quan doanh thu, số lượng đơn, tài xế khả dụng.
   - Đầy đủ tính năng CRUD sản phẩm, danh mục, chi nhánh, tài khoản tài xế và khách hàng.
   - Tính năng điều phối đơn hàng và gán tài xế trực tiếp trên web.

3. **Customer Mobile App**:
   - Màn hình Home tích hợp AI Camera Scan món ăn, nén ảnh gửi lên server nhận diện và mở danh sách món gợi ý hoặc chuyển thẳng đến chi tiết món.
   - Chatbot AI tư vấn món ăn tích hợp trực tiếp Gemini Flash (`gemini-2.5-flash-lite`), tự động nạp ngữ cảnh thực đơn hiện tại của quán và sinh các món gợi ý (suggested items).
   - Quy trình đặt món hoàn chỉnh: Xem thực đơn -> Tùy chọn món/topping -> Giỏ hàng -> Chọn chi nhánh -> Thanh toán VietQR (hiển thị mã QR ngân hàng có kiểm tra tự động) hoặc COD.
   - Theo dõi lộ trình đơn hàng với bản đồ.

4. **Shipper Mobile App**:
   - Đăng nhập tài xế, bật/tắt nhận đơn.
   - Danh sách đơn hàng chờ giao, nhận đơn với kiểm tra xung đột (Optimistic check).
   - Tích hợp điều hướng bản đồ chi tiết (Mapbox Directions API với fallback kép qua OSRM).
   - Nút gọi điện nhanh cho khách và hộp kiểm xác nhận đã thu đủ tiền COD.

5. **AI Service**:
   - Pipeline huấn luyện MobileNetV2 hoàn chỉnh trong `train.py` với Transfer Learning, Fine-tuning blocks 14-18, Learning Rate Scheduler và Early Stopping.
   - Flask API `app.py` chạy ổn định, có cơ chế Fallback sang mô hình ImageNet gốc và tự động map sang danh mục món Việt Nam nếu chưa nạp file `food_classifier.pth`.

### 5.2. Các khoảng trống và rủi ro kỹ thuật cần lưu ý (Gaps & Technical Debt)
1. **Thiếu file môi trường và khóa bí mật trên máy cục bộ**:
   - `Backend/.env` và `serviceAccountKey.json` chưa được cấu hình (phải tạo trước khi khởi chạy Backend).
2. **Thư mục rác/lồng nhau**:
   - `gugugaga shipper/chickengoo` là một thư mục con lồng nhau chứa code Flutter cũ/trùng lặp, gây nặng dung lượng và xung đột khi phân tích lockfile.
3. **Mô hình AI `.pth`**:
   - File trọng số `food_classifier.pth` (~9.3MB) chưa có sẵn trong `AI_Service/models/` (hiện hệ thống sẽ tự động kích hoạt chế độ Fallback ImageNet).
4. **Kiểm thử tự động (Automated Testing)**:
   - Thiếu bộ unit test và integration test cho Backend services và các State Providers của Flutter (mới chỉ có file test mẫu mặc định).

---

## 6. Code Style & Engineering Standards

### 6.1. Backend (JavaScript - Node.js ESM)
- Sử dụng cú pháp ES Modules chuẩn (`import`/`export`), không dùng `require`.
- Quy chuẩn định dạng phản hồi chuẩn qua `ApiResponse`:
  ```javascript
  return ApiResponse.success(res, data, "Thông điệp thành công");
  return ApiResponse.error(res, error, statusCode);
  ```
- Tên biến và hàm dùng `camelCase`, tên class và controller dùng `PascalCase`.
- Dùng async/await nhất quán, bắt lỗi bằng try/catch trong Controllers và ghi log cụ thể.

### 6.2. Web Admin (React JSX)
- Sử dụng Functional Components và React Hooks (`useState`, `useEffect`, custom hooks).
- Quản lý global auth state thông qua Zustand store.
- Phân tách rõ ràng giữa Service (gọi API axios) và View Component.

### 6.3. Mobile (Flutter / Dart)
- Tuân thủ Flutter style guide, phân chia thư mục rõ ràng theo `models`, `providers`, `screens`, `services`.
- Sử dụng `Consumer` hoặc `context.watch`/`context.read` từ `provider` để quản lý state phản ứng.
- Luôn kiểm tra `if (!mounted) return;` trước khi tương tác với `BuildContext` sau các tác vụ bất đồng bộ (`await`).

### 6.4. AI Service (Python)
- Tuân thủ PEP 8 cho code Python.
- Tên hàm và biến dùng `snake_case`, tên lớp dùng `PascalCase`.
- Hàm inference phải bọc trong khối try/except và trả về JSON đúng cấu trúc `{ success: boolean, class_name: string, confidence: float }`.

---

## 7. Testing Strategy

1. **Unit Testing**:
   - Backend: Kiểm thử các logic tính tiền giỏ hàng, xác thực webhook Casso, và phân quyền middleware.
   - Flutter: Kiểm thử logic chuyển đổi dữ liệu Models (`fromJson`, `toJson`), Cart calculation trong `CartProvider`.
2. **Integration Testing**:
   - Kiểm thử luồng liên thông: Khách đặt đơn -> Backend tạo đơn Firestore -> Webhook Casso xác nhận -> Thông báo hiển thị -> Shipper thấy đơn mới.
   - Kiểm thử endpoint AI Service `/predict` với các định dạng ảnh hợp lệ và ảnh lỗi.
3. **End-to-End (E2E) Acceptance Testing**:
   - Kiểm thử trên thiết bị di động thật (Camera scan, Quét VietQR qua app ngân hàng, Mapbox routing định vị GPS).

---

## 8. Boundaries & Safety Rules

- **Always**:
  - Giữ bí mật các API keys (`GEMINI_API_KEY`, `JWT_SECRET`, Cloudinary, Firebase credentials) qua file `.env`, không bao giờ commit lên Git.
  - Sử dụng Firestore batch hoặc transaction khi cập nhật đồng thời đơn hàng và giỏ hàng để tránh mất tính toàn vẹn dữ liệu.
  - Luôn kiểm tra độ tin cậy của AI nhận diện trước khi tự động chuyển hướng màn hình.
- **Ask First**:
  - Dọn dẹp hoặc xóa thư mục `gugugaga shipper/chickengoo`.
  - Thay đổi cấu trúc Firestore Database (collections/sub-collections schema).
  - Thay đổi phiên bản các dependencies lớn của Flutter hoặc Node.js.
- **Never**:
  - Hardcode đường dẫn tuyệt đối cục bộ của máy lập trình viên vào mã nguồn.
  - Bỏ qua kiểm tra role và xác thực JWT trên các route Admin hoặc Shipper nhạy cảm.

---

## 9. Success Criteria (Tiêu chí thành công)

1. Cả 5 phân hệ (Backend, Admin, Customer App, Shipper App, AI Service) khởi động thành công và liên thông dữ liệu thông qua REST API.
2. Khách hàng có thể tìm món qua camera AI và nhận diện đúng danh mục món ăn tương ứng trong menu.
3. Chatbot Gemini tư vấn được món theo thực đơn thực tế và trả lời câu hỏi của khách hàng mượt mà.
4. Đơn hàng tạo ra có thể quét mã VietQR và tự động chuyển trạng thái `PAID` khi có webhook đối soát hoặc khi kiểm tra thanh toán.
5. Shipper nhận được đơn hàng, xem được tuyến đường dẫn đến địa chỉ khách hàng và cập nhật đơn hàng thành công.

---

## 10. Open Questions for Human Review

1. **Dọn dẹp thư mục trùng**: Bạn có muốn dọn dẹp hoặc loại bỏ thư mục con `gugugaga shipper/chickengoo` để tránh xung đột dependencies và làm nhẹ dự án không?
2. **Cấu hình môi trường chạy thử**: Bạn đã có sẵn file `serviceAccountKey.json` và file `.env` cho Backend trên máy chưa, hay cần một file mẫu `.env.example` chuẩn để điền thông tin?
3. **Mô hình AI `.pth`**: Bạn muốn tiếp tục dùng cơ chế Fallback ImageNet tích hợp sẵn cho AI Service hay bạn muốn tải/nạp file trọng số `food_classifier.pth` đã huấn luyện riêng?
