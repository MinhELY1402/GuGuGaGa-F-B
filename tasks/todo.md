# Action Tasks: Kế hoạch Chuyển Đổi & Quản Trị Dự Án GuGuGaGa (24/8 - 16/11)

## Giai đoạn 1: Chuẩn bị Kho lưu trữ mới & GitHub Ecosystem

- [ ] **Task 1.1: Tạo GitHub Repository mới & Cấu hình Quy tắc bảo vệ nhánh (Branch Protection)**
  - **Mô tả**: Tạo repo GitHub mới (ví dụ `gugugaga-food-delivery-ecosystem`), khởi tạo 2 nhánh chính `main` (Production) và `develop` (Integration). Bật Branch Protection: yêu cầu tối thiểu 1 approval PR trước khi merge, cấm force-push.
  - **Người phụ trách**: Tiến (Technical Lead) & Huy (PM)
  - **Tiêu chí nghiệm thu**:
    - Nhánh `main` và `develop` đã được tạo và kích hoạt Branch Protection.
    - Không thể push trực tiếp vào `main` hay `develop`.
  - **Xác minh**: `git branch -a`, kiểm tra tab Branches trên GitHub.

- [ ] **Task 1.2: Thiết lập GitHub Project Board & Milestones theo 4 Sprint**
  - **Mô tả**: Tạo GitHub Project (Agile/Kanban board) với các cột: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`. Tạo 4 Milestones:
    - `Sprint 1: Base Architecture & Catalog` (24/8 - 27/9)
    - `Sprint 2: Cart, Orders, VietQR & Scope Change` (28/9 - 18/10)
    - `Sprint 3: Shipper App & Admin Web Portal` (19/10 - 1/11)
    - `Sprint 4: AI Food Vision & Production Release` (2/11 - 16/11)
  - **Người phụ trách**: Huy (Project Lead)
  - **Tiêu chí nghiệm thu**: Project board có đủ 4 Milestones, gắn thời hạn rõ ràng.

- [ ] **Task 1.3: Cấu hình GitHub Issue Templates, PR Template & GitHub Actions CI**
  - **Mô tả**: Thêm `.github/ISSUE_TEMPLATE/` (User Story, Bug Report), `.github/pull_request_template.md` (yêu cầu điền Issue ID, Checklist tự test, Reviewer), và `.github/workflows/ci.yml` kiểm tra build tự động.
  - **Người phụ trách**: Tiến (Technical Lead)
  - **Tiêu chí nghiệm thu**: Khi tạo Issue hoặc PR mới trên GitHub, mẫu biểu chuẩn tự động hiển thị.
  - **Xác minh**: Thư mục `.github/` đầy đủ các file template.

---

## Giai đoạn 2: Tạo Danh sách 12 GitHub Issues & Phân vai 4 thành viên

- [ ] **Task 2.1: Khởi tạo 12 GitHub Issues trên Project Board**
  - **Mô tả**: Tạo 12 issues từ Issue #1 đến #12 đúng theo Bảng đặc tả chi tiết trong `tasks/plan.md`, gắn đúng nhãn (`feature`, `documentation`, `testing`), Milestone và gán Assignee (Huy, Tiến, Minh, Bảo).
  - **Người phụ trách**: Huy (Project Manager)
  - **Tiêu chí nghiệm thu**: 12 issues hiển thị trên GitHub Projects với Story Points ước tính.

- [ ] **Task 2.2: Thiết lập tài khoản Git cho 4 thành viên (Author Attribution)**
  - **Mô tả**: Đảm bảo cấu hình `git config user.name` và `git config user.email` chính xác của 4 bạn (Huy, Tiến, Minh, Bảo) khi thực hiện commit tương ứng để GitHub Insights ghi nhận biểu đồ đóng góp (Commit graph) đồng đều suốt 12 tuần.
  - **Người phụ trách**: Toàn nhóm (Huy, Tiến, Minh, Bảo)

---

## Giai đoạn 3: Thực thi chuyển code qua 12 Nhánh Tính Năng (Feature Branches) & PRs

- [ ] **Task 3.1: Sprint 1 (Tuần 1 - 5) — Hạ tầng, Auth & Thực đơn món ăn**
  - `feature/w01-repo-setup-ci` $\rightarrow$ Tiến & Huy (PR #1)
  - `feature/w02-db-schema-and-scaffold` $\rightarrow$ Tiến & Bảo (PR #2)
  - `feature/w03-auth-system` $\rightarrow$ Bảo & Minh (PR #3)
  - `feature/w04-menu-management` $\rightarrow$ Bảo & Minh (PR #4)
  - `test/w05-sprint1-qa-and-docs` $\rightarrow$ Huy (PR #5)
  - **Xác minh**: 5 PRs được review, merge tuần tự vào nhánh `develop`.

- [ ] **Task 3.2: Sprint 2 (Tuần 6 - 8) — Giỏ hàng, VietQR, Casso & Xử lý Biến cố Scope Change (CR-01)**
  - `feature/w06-cart-and-orders` $\rightarrow$ Bảo & Minh (PR #6)
  - `feature/w07-vietqr-casso-payment` $\rightarrow$ Bảo & Minh (PR #7)
  - `feature/w08-scope-change-casso-polling` $\rightarrow$ Huy, Bảo, Minh (PR #8) [Hồ sơ CR-01]
  - **Xác minh**: Test luồng đặt món từ giỏ hàng tới quét mã VietQR và kiểm tra đối soát.

- [ ] **Task 3.3: Sprint 3 (Tuần 9 - 10) — Shipper Mobile App & Web Admin Portal**
  - `feature/w09-shipper-mapbox-routing` $\rightarrow$ Minh & Tiến (PR #9)
  - `feature/w10-admin-dashboard-dispatch` $\rightarrow$ Minh & Bảo (PR #10)
  - **Xác minh**: Gán tài xế trên Web Admin, app Shipper nhận đơn và bật dẫn đường Mapbox.

- [ ] **Task 3.4: Sprint 4 (Tuần 11 - 12) — AI Computer Vision, Chatbot & Release v1.0.0**
  - `feature/w11-ai-service-and-chatbot` $\rightarrow$ Bảo & Minh (PR #11)
  - `release/v1.0.0` $\rightarrow$ Huy, Tiến, All team (PR #12 merge vào `main` và đánh tag `v1.0.0`)
  - **Xác minh**: Camera scan nhận diện món thành công; build APK release sẵn sàng chạy demo.

---

## Giai đoạn 4: Hoàn thiện Hồ sơ Gói Bằng Chứng (7 Hạng mục + Slide)

- [ ] **Task 4.1: Soạn thảo Báo cáo tổng kết kỹ thuật 7 chương chuẩn (`01_Final_Technical_Report.pdf`)**
  - **Mô tả**: Viết báo cáo 15-25 trang, tuân thủ thì QUÁ KHỨ (Past Tense), trích dẫn bằng chứng commit ID, biểu đồ Burndown chart từ GitHub.
  - **Người phụ trách**: Huy (Lead) & Tiến
- [ ] **Task 4.2: Hoàn thiện Điều lệ dự án đã ký (`02_Project_Charter_Signed.pdf`)**
  - **Mô tả**: Bản Charter 13 mục chuẩn hóa theo `Project-Charter-Template.md`.
  - **Người phụ trách**: Huy (PM)
- [ ] **Task 4.3: Xuất Cây WBS & Từ điển WBS 100% Rule (`03_WBS_and_WBS_Dictionary.pdf`)**
  - **Mô tả**: Sơ đồ phân rã WBS và từ điển chi tiết cho 3 gói trọng yếu (VietQR, Shipper Flow, AI Model).
  - **Người phụ trách**: Huy & Tiến
- [ ] **Task 4.4: Bảng theo dõi rủi ro cập nhật qua 2 đợt (`04_Risk_Register_Evolution.xlsx`)**
  - **Mô tả**: Bảng rủi ro gồm 6 rủi ro thực tế (R01 Casso delay, R02 Concurrency, R03 AI wrong label...).
  - **Người phụ trách**: Huy (QA Lead)
- [ ] **Task 4.5: Biên bản Sprint 1 Retro & Final Retro (`05_Sprint_Retrospectives.pdf`)**
  - **Mô tả**: Họp rút kinh nghiệm theo mô hình 4Ls (Liked, Learned, Lacked, Longed For).
  - **Người phụ trách**: Huy (Scrum Master)
- [ ] **Task 4.6: Hồ sơ xử lý thay đổi phạm vi thực tế (`06_Scope_Change_Control_Record.pdf`)**
  - **Mô tả**: Hồ sơ Change Request CR-01 xử lý bổ sung cơ chế Polling song song khi thanh toán VietQR.
  - **Người phụ trách**: Huy (CCB Lead)
- [ ] **Task 4.7: Biên bản nghiệm thu UAT từ Khách hàng thật (`07_Stakeholder_Acceptance_Signoff.pdf`)**
  - **Mô tả**: Biên bản kiểm thử chấp nhận người dùng có chữ ký/email xác nhận từ đối tác quán ăn / CLB.
  - **Người phụ trách**: Huy (PM)
- [ ] **Task 4.8: Soạn Slide thuyết trình 16 phút (`08_Presentation_Slide_Deck.pdf`)**
  - **Mô tả**: 8-10 slides chuẩn bị cho buổi bảo vệ trước Hội đồng theo phân bổ 6 phút nói + 5 phút live demo + 5 phút hỏi đáp.
  - **Người phụ trách**: Huy & Tiến
