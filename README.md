# 🍜 GuGuGaGa — Hệ thống đặt món ăn tích hợp AI

Đồ án môn **Quản trị Dự án Phần mềm** (VKU) — GVHD: TS. Nguyễn Thanh Tuấn.
Sản phẩm kế thừa từ Đồ án chuyên ngành 1 theo **Pathway 1** (xem [docs/00_Project_History.md](docs/00_Project_History.md)).

| Thành viên | Vai trò |
|---|---|
| Võ Nhật Huy | Project Lead / Scrum Master & QA Lead |
| Trần Phan Minh Tiến | Technical Lead & System Architect |
| Nguyễn Minh | Frontend Engineer (Flutter, React) |
| Nguyễn Gia Bảo | Backend & AI Engineer (Node.js, PyTorch) |

## Kiến trúc

```
 Flutter Customer App ─┐                       ┌─ Firebase Firestore
 Flutter Shipper App  ─┼─► Backend (Express) ──┼─ Cloudinary (ảnh)
 Admin Web (React)    ─┘        │              ├─ Casso / VietQR (thanh toán)
                                │              └─ Gemini API (chatbot, OCR)
                                └─► AI Service (Flask + PyTorch MobileNetV2)
```

| Thư mục | Thành phần | Công nghệ |
|---|---|---|
| `Backend/` | REST API, JWT 3 vai trò, đơn hàng, VietQR + webhook Casso | Node.js 20, Express, firebase-admin |
| `Admin/` | Web quản trị: dashboard KPI, menu, đơn, tài xế | React, Vite, Tailwind, Recharts |
| `gugugaga/` | App khách hàng: đặt món, thanh toán, camera AI, chatbot | Flutter |
| `gugugaga shipper/` | App tài xế: nhận đơn, Mapbox/OSRM, COD | Flutter |
| `AI_Service/` | Nhận diện 30 món Việt, `/predict`, `/health` | Flask, PyTorch |

## Chạy local

### Backend (cổng 5000)
```bash
cd Backend
cp .env.example .env          # điền JWT_SECRET, Firebase, Cloudinary, Casso...
# đặt serviceAccountKey.json (Firebase Admin SDK) theo FIREBASE_SERVICE_ACCOUNT_PATH
npm install
npm run seed                  # (tuỳ chọn) dữ liệu mẫu Firestore
npm run dev
```

### Admin Web
```bash
cd Admin && npm install && npm run dev     # gọi API tại http://localhost:5000/api/admin
```

### Mobile apps
```bash
cd gugugaga            # hoặc "gugugaga shipper"
# tạo file .env: BASE_URL=http://10.0.2.2:5000/api, MAPBOX_ACCESS_TOKEN=..., OPENCAGE_API_KEY=...
flutter pub get && flutter run
```

### AI Service (cổng 8000)
```bash
cd AI_Service
pip install -r requirements.txt
python app.py                                   # tự fallback ImageNet nếu chưa có models/food_classifier.pth
python evaluate.py --data-dir <dataset>         # đo Top-1/Top-3/latency → models/eval_report.json
```

## Kiểm thử & CI

```bash
cd Backend && npm test        # unit test + API test (supertest), không cần Firestore thật
```

GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) chạy trên mọi PR vào `develop`/`main`:
- Backend: `npm test`
- Admin: `npm run build`
- 2 app Flutter: `flutter analyze` + `flutter test`

## Quy trình làm việc

- Nhánh: `main` (release) ← `develop` (tích hợp) ← `feature/*`, `fix/*`, `docs/*`.
- Mọi thay đổi vào `develop` qua **Pull Request**, ≥ 1 reviewer khác tác giả, CI xanh.
- Commit theo Conventional Commits: `feat(...)`, `fix(...)`, `test(...)`, `docs(...)`.
- Issue dùng mẫu User Story / Bug Report trong `.github/ISSUE_TEMPLATE/`.

## Tài liệu quản trị dự án

| Tài liệu | Nội dung |
|---|---|
| [Project-Charter.md](Project-Charter.md) | Điều lệ dự án |
| [docs/00_Project_History.md](docs/00_Project_History.md) | Lịch sử dự án (ĐACN1 → repo QTDA) |
| [docs/01_Final_Technical_Report.md](docs/01_Final_Technical_Report.md) | Báo cáo tổng kết |
| [docs/02_Project_Management_Plan.md](docs/02_Project_Management_Plan.md) | Kế hoạch quản lý dự án |
| [WBS_Project_Management.md](WBS_Project_Management.md), [docs/03](docs/03_WBS_and_WBS_Dictionary.md) | WBS, MoSCoW, RACI, PERT/CPM, Gantt |
| [docs/04](docs/04_Risk_Register_Evolution.md) | Sổ đăng ký rủi ro |
| [docs/05](docs/05_Sprint_Retrospectives.md) | Biên bản sprint / retro |
| [docs/06](docs/06_Scope_Change_Control_Record.md) | Kiểm soát thay đổi CR-01 |
| [docs/07](docs/07_Stakeholder_Acceptance_Signoff.md) | Kịch bản & biên bản UAT |
| [docs/08](docs/08_Presentation_Slide_Deck.md) | Slide bảo vệ |
