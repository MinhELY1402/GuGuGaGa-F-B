# LỊCH SỬ DỰ ÁN (PROJECT HISTORY) — GUGUGAGA

Tài liệu ghi lại tiến trình thực tế của sản phẩm và của repo này, để người đọc đối chiếu được giữa hồ sơ quản trị và dữ liệu trên GitHub.

> Các mục `[CẦN BỔ SUNG]` phải được nhóm điền bằng thông tin thật, kèm link hoặc ảnh làm bằng chứng.

## 1. Nguồn gốc — Pathway 1 (Kế thừa Đồ án chuyên ngành 1)

| Mục | Thông tin |
|---|---|
| Học phần gốc | Đồ án chuyên ngành 1 |
| GVHD học phần gốc | [CẦN BỔ SUNG] |
| Thời gian phát triển sản phẩm | Từ 24/08/2026 |
| Bằng chứng | [link đề cương / báo cáo / slide ĐACN1], [link repo hoặc thư mục code gốc], [ảnh nhóm chat có ngày] |

## 2. Dòng thời gian

| Thời điểm | Sự kiện | Bằng chứng |
|---|---|---|
| 24/08/2026 | Bắt đầu phát triển GuGuGaGa trong ĐACN1 | [CẦN BỔ SUNG] |
| [ngày] | Hoàn thành backend + catalog, app khách hàng | [CẦN BỔ SUNG] |
| [ngày] | Sự cố webhook Casso bị trễ → đề xuất CR-01 (polling + nút xác minh) | [log / tin nhắn thật] |
| [ngày] | Hoàn thành app tài xế, Admin web, AI service | [CẦN BỔ SUNG] |
| 09/11/2026 | Tạo repo `GuGuGaGa-F-B`, chuyển mã nguồn từ ĐACN1 sang; lập issue, milestone, CI, template | GitHub: ngày tạo repo, issue #1–#25 |
| 14/11/2026 → | Giai đoạn QTDA: re-baseline hồ sơ, bổ sung test, CI chạy test thật, sửa lỗi; mọi thay đổi qua PR có review | Danh sách PR, lần chạy Actions |
| [ngày bảo vệ] | Bảo vệ đồ án | — |

## 3. Ghi chú về lịch sử Git trong repo

- Các commit có ngày trước **09/11/2026** là lịch sử **được tổ chức lại** khi chuyển mã nguồn từ ĐACN1 sang repo này. Chúng không phải ghi nhận trực tiếp theo thời gian thực trên GitHub.
- Các commit `Merge pull request #1…#24` trong giai đoạn đó là **merge cục bộ**. Repo không có Pull Request tương ứng trên GitHub.
- Issue #1–#25 và các milestone được tạo ngày 09/11/2026 để **ghi lại** các hạng mục đã làm trong ĐACN1.
- Từ 14/11/2026, quy trình được áp dụng trực tiếp trên GitHub. Mỗi thay đổi đều có PR thật, review của thành viên khác và lần chạy CI. Bằng chứng tiến độ của giai đoạn QTDA lấy từ các dữ liệu này.

## 4. Phát hiện khi tổ chức lại repo (14/11/2026)

| Phát hiện | Xử lý |
|---|---|
| `Backend/src/server.js` import `routes/user.route.js` và `routes/admin.route.js` nhưng 2 file không có trong repo, nên backend không khởi động được | Dựng lại 2 file từ các route con và đường dẫn API mà Admin/Flutter gọi |
| Test backend cũ chỉ kiểm tra hằng số (`120000 + 15000`), CI backend chỉ chạy `console.log` | Thay bằng 16 test thật (API, middleware, đối soát Casso); CI chạy `npm test`, `flutter analyze`, `flutter test` |
| Webhook Casso chưa kiểm tra `Secure-Token`, chưa đạt tiêu chí nghiệm thu WBS 1.2.4 | Thêm kiểm tra token (biến `CASSO_SECURE_TOKEN`) |
| Bảng MoSCoW tính sai (16 gói Must / 1.500h; nhóm Could/Won't lại đánh dấu thuộc MVP) | Tính lại từ bảng WBS: 17 gói Must, 920h / 1.480h (62,2%) |
| `models/food_classifier.pth` không có trong repo; chưa có số đo accuracy | Thêm `AI_Service/evaluate.py` để sinh báo cáo đo |
