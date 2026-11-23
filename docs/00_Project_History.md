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
| 15/11/2026 | Phát hành bản thử nghiệm **v1.1.0-beta** (2 APK Android) và dựng server demo qua Cloudflare Tunnel. Thử trên điện thoại thật, sửa các lỗi tìm được (mục 5) | [Release v1.1.0-beta](https://github.com/MinhELY1402/GuGuGaGa-F-B/releases/tag/v1.1.0-beta), nhánh `feat/tunnel-release` |
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

## 5. Kiểm thử thực tế và phát hành beta (15/11/2026)

### 5.1. Hạ tầng demo
- Không có server cố định nên backend chạy trên máy nhóm, dùng **Firestore Emulator** (dữ liệu mẫu, lưu ở `.demo-data/`). Backend được mở ra Internet qua **Cloudflare Quick Tunnel** (`scripts/serve-demo.sh`).
- URL tunnel thay đổi mỗi lần khởi động, nên app cho phép **đổi địa chỉ server ngay trong ứng dụng**: tự hỏi khi không kết nối được, hoặc nhấn giữ chữ "GuGuGaGa" ở màn hình đăng nhập.
- Build APK chỉ cho arm64, giới hạn bộ nhớ Gradle ở 2GB để không bị hệ điều hành dừng tiến trình (lỗi exit 137) trên máy 14GB RAM.

### 5.2. Lỗi phát hiện khi thử trên điện thoại và cách xử lý
| # | Lỗi | Nguyên nhân | Xử lý |
|---|---|---|---|
| 1 | App Khách hàng không mở được | `MainActivity.kt` chưa từng được commit; manifest khai báo `.MainActivity` | Thêm `MainActivity.kt` |
| 2 | Ô địa chỉ giao hàng "Đang tải..." mãi | Không có key OpenCage; code không xử lý lỗi 401 | Tra địa chỉ theo thứ tự OpenCage → Mapbox → Nominatim (OSM); lỗi thì hiện toạ độ |
| 3 | Bản đồ xám | Không có token Mapbox | Dùng token Mapbox public; không có token thì dùng ảnh nền OpenStreetMap |
| 4 | Đường giao hàng 860 km | Chi nhánh mẫu đặt ở TP.HCM, khách ở Đà Nẵng | Chuyển chi nhánh mẫu về Đà Nẵng |
| 5 | Quét AI đối soát lỗi `GEMINI_API_KEY` | Backend chưa có key | Cấu hình key ở backend |
| 6 | Quét AI đối soát lỗi `Unsupported mime type` | App gửi ảnh không kèm Content-Type | Backend nhận dạng loại ảnh theo magic bytes |
| 7 | Đăng nhập Google lỗi `signInWithPopup()` | Code chỉ hỗ trợ web | Dùng `google_sign_in` native trên Android, project Firebase `guga-27d3f` (thêm SHA-1); backend xác thực token theo `FIREBASE_AUTH_PROJECT_ID` |
| 8 | Ảnh món ăn không hiện | Dữ liệu mẫu `image: null` | Ghép 43 ảnh có sẵn trên Cloudinary của nhóm với 28/30 món |
| 9 | Bấm "Quán gần bạn" không phản hồi | Danh sách quán bịa ghi cứng, không có xử lý khi bấm | Hiển thị chi nhánh thật từ API; bấm để chọn chi nhánh và mở thực đơn |
| 10 | Lỗi `Invalid or expired token` | JWT secret đổi sau khi khởi động lại server | Đăng nhập lại; JWT secret giờ cố định trong `Backend/.env` |

### 5.3. Sự cố và bảo mật
- **Lộ key Gemini:** `ai_service.dart` ghi cứng một key Gemini trong repo public và trong APK. Đã chuyển chatbot sang gọi qua backend (`/api/ai/chat`, giới hạn 20 request/phút/IP) và xoá key khỏi mã nguồn. Key cũ vẫn còn trong lịch sử git nên **cần được thu hồi**.
- **Mất dữ liệu demo 19:04–20:02:** khi tắt server, emulator bị dừng trước khi kịp lưu. Đã sửa `serve-demo.sh` để chủ động lưu dữ liệu trước khi tắt, và tự lưu định kỳ mỗi 10 phút.
- **Chia sẻ token GitHub cá nhân trong nhóm:** token đã lộ phải được thu hồi. Mỗi thành viên commit bằng tài khoản của chính mình.

### 5.4. Kết quả
- Backend: **22/22** test tự động pass (`npm test`). CI chạy backend test, build Admin, `flutter analyze` và `flutter test`.
- Kiểm thử thủ công trên điện thoại Android: [CẦN BỔ SUNG: người thử, thiết bị, các luồng đã chạy được].

### 22–23/11/2026: ổn định luồng đơn và thanh toán
- Thanh toán thẻ và QR ngay trong app (cổng mô phỏng, CR-02); bốn đợt phát hành APK trên `v1.1.0-beta`.
- Chạy thử API thật và trên điện thoại, phát hiện và sửa các lỗ hổng luồng đơn, thanh toán (CR-03, R13, R14).
- Chuyển server demo sang Tailscale Funnel (link cố định) và service chạy lâu dài (R11).
- Quay video demo trên điện thoại thật và Chromium. Merge PR #51–#55 vào `main` (tự merge, chưa có reviewer, R19).

