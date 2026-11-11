# KẾ HOẠCH TOÀN DIỆN: CHUYỂN ĐỔI MÃ NGUỒN & QUẢN TRỊ DỰ ÁN GUGUGAGA
**Học phần:** Quản Trị Dự Án Phần Mềm — VKU  
**Giảng viên phụ trách:** TS. Nguyễn Thanh Tuấn  
**Thời gian thực hiện:** 24/08/2026 $\rightarrow$ 16/11/2026 (12 tuần)  
**Nhóm sinh viên thực hiện (4 thành viên):**
1. **Huy (Project Lead & QA Lead)**: Điều phối tiến độ, GitHub Projects, Sprint Ceremonies, Risk & Scope Management, Test Matrix, Gói bằng chứng 7 hạng mục.
2. **Tiến (Technical Lead & System Architect)**: Kiến trúc hệ thống, Database Schema Firestore, Thiết lập CI/CD GitHub Actions, Review code các core PRs, Bảo mật & Cloud Deployment.
3. **Minh (Frontend Engineer)**: Phát triển ứng dụng khách hàng Flutter (`gugugaga`), ứng dụng tài xế Flutter (`gugugaga shipper`), và Web Admin Portal (`Admin` React+Vite).
4. **Bảo (Backend & AI Engineer)**: Phát triển Node.js REST API (`Backend`), tích hợp cổng VietQR & Webhook Casso, tích hợp Gemini Chatbot và AI Service nhận diện món ăn (`AI_Service`).

---

## PHẦN 1: CHIẾN LƯỢC CHUYỂN ĐỔI MÃ NGUỒN SANG REPO MỚI (MIGRATION STRATEGY)

### 1.1. Mục tiêu chuyển đổi
- Không "dump commit" (không nộp 1 commit duy nhất chứa toàn bộ code).
- Tái hiện lại dòng chảy phát triển tự nhiên (Authentic Git Flow) trải đều qua 12 tuần (24/08 – 16/11).
- Mỗi thành viên (Huy, Tiến, Minh, Bảo) đều có lịch sử đóng góp đồng đều theo đúng vai trò kỹ thuật trên GitHub Insights.
- Mọi tính năng đều bắt đầu từ **GitHub Issue** $\rightarrow$ Tạo **Feature Branch** $\rightarrow$ Thực hiện **Conventional Commits** $\rightarrow$ Mở **Pull Request** $\rightarrow$ **Review & Approve** $\rightarrow$ Merge vào nhánh `develop` / `main`.

### 1.2. Chiến lược phân nhánh (Branching Model - GitFlow chuẩn)
```
main (Protected - Production Ready)
  │
  └── develop (Protected - Integration Branch)
        │
        ├── feature/w01-repo-setup-ci               (Tiến)
        ├── feature/w02-db-schema-auth-base         (Bảo, Tiến)
        ├── feature/w03-customer-auth-ui            (Minh)
        ├── feature/w04-backend-menu-category       (Bảo)
        ├── feature/w05-admin-menu-management       (Minh)
        ├── feature/w06-cart-and-order-engine       (Bảo, Minh)
        ├── feature/w07-vietqr-casso-integration    (Bảo, Huy QA)
        ├── feature/w08-scope-change-polling-backup (Huy, Bảo) [BIẾN CỐ QLDA]
        ├── feature/w09-shipper-routing-mapbox      (Minh, Tiến)
        ├── feature/w10-admin-dashboard-dispatch    (Minh, Bảo)
        ├── feature/w11-ai-food-and-gemini-chat     (Bảo, Minh)
        └── feature/w12-e2e-testing-production-prep (Huy, Tiến, All)
```

---

## PHẦN 2: LỊCH TRÌNH 12 TUẦN & 4 SPRINT (TIMELINE 24/08 – 16/11/2026)

| Giai đoạn | Thời gian | Trọng tâm Sprint & Deliverable | Người phụ trách chính |
|---|---|---|---|
| **Tuần 1** | 24/08 – 30/08 | **Khởi động dự án**: Thiết lập Project Charter, quy chuẩn Git, setup Repo mới, GitHub Actions CI. | Huy (PM), Tiến (Tech Lead) |
| **Tuần 2** | 31/08 – 06/09 | **Kiến trúc & Hạ tầng**: Cấu trúc Monorepo, Database Firestore schema, seed data, Base API & Theme. | Tiến (Arch), Bảo (BE) |
| **Tuần 3** | 07/09 – 13/09 | **Sprint 1 (Khởi động)**: Module Authentication, User Roles (Customer, Shipper, Admin), UI Login. | Bảo (BE Auth), Minh (UI Auth) |
| **Tuần 4** | 14/09 – 20/09 | **Sprint 1 (Tiếp tục)**: Menu, Món ăn, Danh mục, Chi nhánh, Cloudinary upload. | Bảo (API Menu), Minh (UI Menu) |
| **Tuần 5** | 21/09 – 27/09 | **Sprint 1 (Hoàn tất)**: Review Sprint 1, Test Matrix Auth/Menu, **Sprint 1 Retrospective Meeting**. | Huy (QA), All team |
| **Tuần 6** | 28/09 – 04/10 | **Sprint 2 (Khởi động)**: Giỏ hàng đa chi nhánh, Luồng tạo đơn hàng, State Provider Flutter. | Bảo (Order API), Minh (Cart UI) |
| **Tuần 7** | 05/10 – 11/10 | **Sprint 2 (Tiếp tục)**: Cổng thanh toán VietQR & Webhook đối soát tự động Casso. | Bảo (VietQR/Casso), Minh (Dialog QR) |
| **Tuần 8** | 12/10 – 18/10 | **Sprint 2 (Biến cố QLDA)**: Xử lý rủi ro trễ Webhook Casso $\rightarrow$ **Approved Change Request (CR-01)** bổ sung Polling dự phòng & Sprint 2 Retro. | Huy (Lead CCB), Bảo, Minh |
| **Tuần 9** | 19/10 – 25/10 | **Sprint 3 (Khởi động)**: Shipper Mobile App (Đăng nhập, Nhận đơn, Mapbox Routing & OSRM). | Minh (Flutter Shipper), Tiến (Mapbox) |
| **Tuần 10** | 26/10 – 01/11 | **Sprint 3 (Tiếp tục)**: Web Admin Portal (KPI Dashboard, Phân bổ tài xế, Quản trị đơn hàng). | Minh (React Admin), Bảo (Admin API) |
| **Tuần 11** | 02/11 – 08/11 | **Sprint 4 (Mở rộng AI)**: AI MobileNetV2 nhận diện 30 món ăn, Quét biên lai Gemini, Chatbot tư vấn món. | Bảo (AI Flask + Gemini), Minh (UI AI) |
| **Tuần 12** | 09/11 – 16/11 | **Sprint 4 (Về đích)**: Kiểm thử E2E liên thông, Triển khai Cloud/APK, UAT Sign-off thật, Hoàn tất 8 Deliverables. | Huy (QA/PM), Tiến, All team |

---

## PHẦN 3: MA TRẬN PHÂN CÔNG CHI TIẾT THEO ISSUE, COMMIT, BRANCH & PR

Dưới đây là kế hoạch chi tiết từng Issue để 4 thành viên tạo trên GitHub, code theo nhánh và mở Pull Request tương ứng:

```mermaid
gantt
    title KẾ HOẠCH DỰ ÁN GUGUGAGA (24/08/2026 - 16/11/2026)
    dateFormat  YYYY-MM-DD
    section Sprint 1: Setup & Core Menu
    W01: Khởi tạo Repo & CI/CD (Tiến, Huy)         :done, w01, 2026-08-24, 2026-08-30
    W02: DB Schema & Monorepo Setup (Tiến, Bảo)    :done, w02, 2026-08-31, 2026-09-06
    W03: Auth Module JWT & Flutter UI (Bảo, Minh)  :done, w03, 2026-09-07, 2026-09-13
    W04: Product & Category API & UI (Bảo, Minh)   :done, w04, 2026-09-14, 2026-09-20
    W05: Sprint 1 Review & Retro (Huy, All)        :done, w05, 2026-09-21, 2026-09-27
    section Sprint 2: Đơn Hàng, VietQR & Biến Cố
    W06: Cart & Order Engine (Bảo, Minh)           :active, w06, 2026-09-28, 2026-10-04
    W07: VietQR & Casso Webhook (Bảo, Minh)        :w07, 2026-10-05, 2026-10-11
    W08: Xử lý Biến cố Scope Change (Huy, Bảo)     :crit, w08, 2026-10-12, 2026-10-18
    section Sprint 3: Shipper App & Admin Web
    W09: Shipper App & Mapbox Route (Minh, Tiến)   :w09, 2026-10-19, 2026-10-25
    W10: Admin Portal & Dispatch (Minh, Bảo)       :w10, 2026-10-26, 2026-11-01
    section Sprint 4: AI Feature & Nghiệm Thu
    W11: AI Vision & Gemini Chatbot (Bảo, Minh)    :w11, 2026-11-02, 2026-11-08
    W12: E2E Test, Cloud Deploy & UAT (Huy, All)   :crit, w12, 2026-11-09, 2026-11-16
```

### BẢNG ĐẶC TẢ CHI TIẾT 12 HẠNG MỤC CÔNG VIỆC:

#### 1. Tuần 1 (24/08 – 30/08): Khởi tạo Repo & CI/CD Pipeline
- **Issue #1**: `[INFRA] Project Charter, Git Governance & GitHub Actions CI Setup`
- **Assignee**: **Tiến** (hỗ trợ bởi **Huy**)
- **Branch**: `feature/w01-repo-setup-ci` $\rightarrow$ merge vào `develop`
- **Nội dung code / commit**:
  - `docs: add Project Charter, CONTRIBUTING and branch protection rules` (Huy)
  - `feat(ci): configure github actions workflow for node and flutter linting` (Tiến)
- **PR #1**: *Init base repository, establish branching model and CI checks*. Reviewer: **Huy**.

#### 2. Tuần 2 (31/08 – 06/09): Cấu trúc Monorepo & Firebase Database Schema
- **Issue #2**: `[ARCH] Design Firestore Database Schema, Seeding Script & Monorepo Scaffold`
- **Assignee**: **Tiến** (Architecture) & **Bảo** (Database Backend)
- **Branch**: `feature/w02-db-schema-and-scaffold` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(arch): setup monorepo directory layout for Backend, Admin, Apps, and AI` (Tiến)
  - `feat(db): implement firestore connection and seed-firestore.js` (Bảo)
- **PR #2**: *Scaffold project structure, configure Firebase admin SDK and seed script*. Reviewer: **Tiến**.

#### 3. Tuần 3 (07/09 – 13/09): Module Authentication & Phân quyền đa vai trò
- **Issue #3**: `[AUTH] Implement JWT Authentication & Multi-Role Support (Customer, Shipper, Admin)`
- **Assignee**: **Bảo** (Backend Auth) & **Minh** (Flutter UI Auth)
- **Branch**: `feature/w03-auth-system` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(backend): implement auth controller, jwt tokens and checkRole middleware` (Bảo)
  - `feat(flutter): create login, register screens and AuthProvider integration` (Minh)
- **PR #3**: *Deliver end-to-end authentication for customer and admin*. Reviewer: **Tiến**.

#### 4. Tuần 4 (14/09 – 20/09): Quản lý Thực đơn, Món ăn, Danh mục & Chi nhánh
- **Issue #4**: `[MENU] Build Menu, Product, Category, and Branch Management APIs & UI`
- **Assignee**: **Bảo** (Backend Services) & **Minh** (Customer & Admin UI)
- **Branch**: `feature/w04-menu-management` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(backend): implement CRUD for products, categories, combos, and cloudinary upload` (Bảo)
  - `feat(flutter): build home screen with branch picker and category food list` (Minh)
- **PR #4**: *Implement food catalog, branch selection and multimedia upload*. Reviewer: **Huy**.

#### 5. Tuần 5 (21/09 – 27/09): Sprint 1 Review, Testing & Sprint 1 Retrospective
- **Issue #5**: `[QA] Sprint 1 Quality Assurance, Test Matrix, and Retrospective Meeting`
- **Assignee**: **Huy** (QA Lead & PM)
- **Branch**: `test/w05-sprint1-qa-and-docs` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `test(api): add auth and menu route sanity tests` (Huy)
  - `docs: compile Sprint 1 Retrospective meeting notes (4Ls format)` (Huy)
- **PR #5**: *Sprint 1 stabilization, test matrix validation and retrospective record*. Reviewer: **Tiến**.

#### 6. Tuần 6 (28/09 – 04/10): Quản trị Giỏ hàng & Vòng đời Đơn hàng
- **Issue #6**: `[ORDER] Build Cart Management, Price Computation & Order State Lifecycle`
- **Assignee**: **Bảo** (Order Backend) & **Minh** (Cart & Checkout UI)
- **Branch**: `feature/w06-cart-and-orders` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(backend): implement cart service, branch isolation, and order creation API` (Bảo)
  - `feat(flutter): create cart screen, checkout flow with address geocoding` (Minh)
- **PR #6**: *Implement vertical order placement slice from cart to processing status*. Reviewer: **Huy**.

#### 7. Tuần 7 (05/10 – 11/10): Tích hợp Cổng VietQR & Webhook Đối Soát Casso
- **Issue #7**: `[PAYMENT] Integrate VietQR Dynamic Generation & Automated Casso Webhook`
- **Assignee**: **Bảo** (Casso Webhook & Napas247) & **Minh** (Payment UI Dialog)
- **Branch**: `feature/w07-vietqr-casso-payment` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(backend): implement VietQR payment service and Casso balance webhook handler` (Bảo)
  - `feat(flutter): create dynamic VietQR checkout dialog and payment success screen` (Minh)
- **PR #7**: *VietQR code generation and automated webhook reconciliation*. Reviewer: **Tiến**.

#### 8. Tuần 8 (12/10 – 18/10): [BIẾN CỐ QLDA] Scope Change Control — Casso Fallback Polling
- **Issue #8**: `[CR-01] Scope Change: Implement Fallback Polling Mechanism for Bank Reconciliation`
- **Bối cảnh biến cố thực tế**: Khi thử nghiệm thực tế với Casso, mạng di động hoặc server Casso thỉnh thoảng trễ webhook tới 30-60 giây khiến khách hàng thanh toán xong phải chờ đợi lâu, gây nguy cơ huỷ đơn.
- **Biện pháp xử lý QLDA**: Họp ban kiểm soát thay đổi (CCB), lập hồ sơ **Change Request CR-01 (Approved)**: bổ sung cơ chế Polling song song mỗi 5s tại Client và nút xác nhận cưỡng bức cho phép Admin duyệt tay tức thì.
- **Assignee**: **Huy** (Lập hồ sơ CR), **Bảo** (API check-payment), **Minh** (Client Polling)
- **Branch**: `feature/w08-scope-change-casso-polling` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `docs: add Change Request CR-01 for payment fallback resilience` (Huy)
  - `feat(backend): add /check-payment endpoint with transaction search and force override` (Bảo)
  - `feat(flutter): integrate 5s interval payment status polling in VietQR dialog` (Minh)
- **PR #8**: *Handle payment delay risk via CR-01: Add resilient status polling*. Reviewer: **Huy**.

#### 9. Tuần 9 (19/10 – 25/10): Shipper Mobile App & Mapbox Route Navigation
- **Issue #9**: `[SHIPPER] Build Shipper Flutter App with Live Orders & Mapbox Navigation`
- **Assignee**: **Minh** (Flutter Shipper) & **Tiến** (Mapbox API & Route Service)
- **Branch**: `feature/w09-shipper-mapbox-routing` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(shipper): implement available order list, optimistic locking accept order` (Minh)
  - `feat(routing): integrate Mapbox directions with OSRM dual-server fallback` (Tiến)
  - `feat(shipper): add one-touch customer calling and mandatory COD confirmation` (Minh)
- **PR #9**: *Shipper logistics app with turnkey map routing and COD collection*. Reviewer: **Bảo**.

#### 10. Tuần 10 (26/10 – 01/11): Web Admin Portal — Dashboard KPI & Order Dispatch
- **Issue #10**: `[ADMIN] Develop Admin Portal with Sales Analytics & Manual Driver Dispatch`
- **Assignee**: **Minh** (React Frontend) & **Bảo** (Dashboard Backend API)
- **Branch**: `feature/w10-admin-dashboard-dispatch` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(backend): build aggregation APIs for revenue, order metrics and driver status` (Bảo)
  - `feat(admin): build Recharts KPI analytics, Order management and Driver assignment modal` (Minh)
- **PR #10**: *Admin management portal for order dispatching and revenue monitoring*. Reviewer: **Huy**.

#### 11. Tuần 11 (02/11 – 08/11): Phân hệ AI — Nhận diện món ăn & Gemini Assistant
- **Issue #11**: `[AI] Integrate MobileNetV2 Food Classifier, Gemini Vision Receipt & Menu Chatbot`
- **Assignee**: **Bảo** (AI Flask & Gemini API) & **Minh** (Camera Scan UI & Chat Screen)
- **Branch**: `feature/w11-ai-service-and-chatbot` $\rightarrow$ `develop`
- **Nội dung code / commit**:
  - `feat(ai): build Flask inference API with MobileNetV2 and ImageNet menu fallback` (Bảo)
  - `feat(backend): integrate Gemini 2.5 Flash for receipt scanning and live menu chatbot` (Bảo)
  - `feat(flutter): implement home camera scan bottomsheet and interactive chat screen` (Minh)
- **PR #11**: *Deploy AI computer vision model and conversational sales chatbot*. Reviewer: **Tiến**.

#### 12. Tuần 12 (09/11 – 16/11): Kiểm thử E2E, Triển khai Cloud, Nghiệm thu UAT & Hồ sơ
- **Issue #12**: `[RELEASE] End-to-End System Testing, Cloud Deployment, Stakeholder Sign-off & Final Deliverables`
- **Assignee**: **Huy** (Lead, UAT, Hồ sơ 7 hạng mục), **Tiến** (Deploy Render/APK), **Bảo**, **Minh**
- **Branch**: `release/v1.0.0` $\rightarrow$ Merge vào `main` & `develop`
- **Nội dung code / commit**:
  - `test(e2e): perform full-cycle testing from customer order to shipper delivery` (Huy)
  - `ci: create release tag v1.0.0, build release APK and verify production deployment` (Tiến)
  - `docs: finalize Technical Report, Risk Register, UAT Signoff and Presentation Slides` (Huy + All)
- **PR #12**: *Release v1.0.0: Complete GuGuGaGa AI Food Delivery System*. Reviewer: **All team**.

---

## PHẦN 4: MA TRẬN PHÂN BỔ CÔNG VIỆC RACI (4 THÀNH VIÊN)

| Gói công việc | Huy (Lead & QA) | Tiến (Tech Lead) | Minh (Frontend) | Bảo (Backend & AI) |
|---|:---:|:---:|:---:|:---:|
| **W01: Khởi tạo Repo, Charter & CI** | **A / C** | **R** | I | I |
| **W02: Monorepo & Database Schema** | A | **R** | I | **R** |
| **W03: Module Authentication (BE & UI)** | A | C | **R** | **R** |
| **W04: Danh mục, Món ăn & Chi nhánh** | A | I | **R** | **R** |
| **W05: Sprint 1 QA & Retrospective** | **A / R** | C | C | C |
| **W06: Giỏ hàng & Vòng đời Đơn hàng** | A | C | **R** | **R** |
| **W07: VietQR & Casso Webhook** | A | C | **R** | **R** |
| **W08: [Biến cố QLDA] Scope Change CR-01** | **A / R** | C | **R** | **R** |
| **W09: Shipper App & Mapbox Routing** | A | **R** | **R** | I |
| **W10: Admin Web & Điều phối đơn** | A | I | **R** | **R** |
| **W11: AI Vision (MobileNet) & Gemini Chat** | A | C | **R** | **R** |
| **W12: E2E Test, Cloud Deploy & Gói Bằng Chứng** | **A / R** | **R** | **R** | **R** |

---

## PHẦN 5: CHUẨN BỊ GÓI BẰNG CHỨNG 7 HẠNG MỤC + SLIDE CHO BUỔI BẢO VỆ 16 PHÚT

```text
📁 NHOM_GUGUGAGA_GOI_BANG_CHUNG_QLDA/
├── 📄 01_Final_Technical_Report.pdf          (15-25 trang, 7 chương chuẩn, viết thì Quá khứ)
├── 📄 02_Project_Charter_Signed.pdf          (Điều lệ dự án 13 mục chuẩn hóa có chữ ký)
├── 📄 03_WBS_and_WBS_Dictionary.pdf          (Cây phân rã WBS 100% Rule & từ điển 3 gói cốt lõi)
├── 📄 04_Risk_Register_Evolution.xlsx        (Bảng rủi ro cập nhật qua 2 đợt: R01 Casso delay, R02 Concurrency)
├── 📄 05_Sprint_Retrospectives.pdf           (Biên bản Sprint 1 Retro & Final Retro theo mô hình 4Ls)
├── 📄 06_Scope_Change_Control_Record.pdf     (Hồ sơ thay đổi phạm vi CR-01: Thêm Polling dự phòng VietQR)
├── 📄 07_Stakeholder_Acceptance_Signoff.pdf  (Biên bản UAT có chữ ký hoặc email xác nhận từ Quán ăn thật)
└── 📄 08_Presentation_Slide_Deck.pdf         (Bộ slide 8-10 trang cho buổi bảo vệ 16 phút)
```
