# BÁO CÁO TỔNG KẾT ĐỒ ÁN QUẢN TRỊ DỰ ÁN PHẦN MỀM
## HỆ THỐNG ĐẶT MÓN ĂN TRỰC TUYẾN TÍCH HỢP AI — GUGUGAGA

**Học phần:** Quản trị Dự án Phần mềm — Khoa Khoa học Máy tính, VKU
**Giảng viên:** TS. Nguyễn Thanh Tuấn
**Nguồn đề tài:** Pathway 1 — kế thừa Đồ án chuyên ngành 1 (phát triển sản phẩm từ 24/08/2026)
**Giai đoạn QTDA:** 09/11/2026 (lập repo & khung quản trị) → [ngày bảo vệ]

| Thành viên | MSSV | Vai trò |
|---|---|---|
| Võ Nhật Huy | [MSSV] | Project Lead / Scrum Master & QA Lead |
| Trần Phan Minh Tiến | [MSSV] | Technical Lead & System Architect |
| Nguyễn Minh | [MSSV] | Frontend Engineer (Flutter, React) |
| Nguyễn Gia Bảo | [MSSV] | Backend & AI Engineer |

> Quy ước: mọi con số trong báo cáo đều có nguồn kiểm chứng đi kèm. Các mục `[CẦN BỔ SUNG]` chỉ được điền khi có số đo hoặc bằng chứng thật.

---

## CHƯƠNG 1. TỔNG QUAN

### 1.1. Bài toán
Quán ăn F&B vừa và nhỏ đang gặp hai vấn đề:
- Phí sàn trung gian cao.
- Đối soát chuyển khoản phải làm thủ công.

Về phía khách hàng, rất khó tìm lại món ăn Việt truyền thống khi chỉ có ảnh chụp.

### 1.2. Giải pháp — 5 phân hệ
| Phân hệ | Chức năng chính | Công nghệ |
|---|---|---|
| Backend API | JWT 3 vai trò, menu/chi nhánh/combo, giỏ hàng, đơn hàng, VietQR + webhook Casso | Node.js, Express, Firestore |
| App khách hàng | Đặt món, thanh toán VietQR/COD, camera AI, chatbot Gemini, đánh giá | Flutter |
| App tài xế | Nhận đơn chống tranh chấp, dẫn đường Mapbox/OSRM, thu COD | Flutter |
| Admin Web | Dashboard KPI, quản lý menu/đơn/tài xế | React, Vite |
| AI Service | Nhận diện 30 món Việt, Top-3, fallback ImageNet | Flask, PyTorch MobileNetV2 |

### 1.3. Nguồn gốc & lịch sử dự án
- Sản phẩm được phát triển từ 24/08/2026 trong ĐACN1.
- Ngày 09/11/2026, nhóm chuyển mã nguồn sang repo `GuGuGaGa-F-B` và lập khung quản trị (issue, milestone, CI, template).
- Lịch sử commit trước 09/11 là lịch sử được tổ chức lại. Repo không có PR tương ứng trên GitHub cho giai đoạn này.
- Chi tiết và bằng chứng: `docs/00_Project_History.md`.

---

## CHƯƠNG 2. PHƯƠNG PHÁP & TỔ CHỨC

- **Phương pháp:** Scrum rút gọn + Kanban trên GitHub Projects. Giai đoạn QTDA chia thành 3 mini-sprint, mỗi sprint khoảng 5 ngày (`02_Project_Management_Plan.md` §2).
- **RACI:** `WBS_Project_Management.md` Phần 4.
- **Quy trình mã nguồn:** GitFlow. PR vào `develop` cần ≥ 1 reviewer khác tác giả và CI xanh.

---

## CHƯƠNG 3. PHẠM VI — WBS & MoSCoW

- **WBS:** 7 nhánh, 27 gói lá, tổng ước lượng **1.480 giờ công**.
- **MoSCoW** (tính lại ngày 14/11/2026 từ bảng WBS):

| Nhóm | Số gói | % gói | Giờ | % công sức |
|---|---:|---:|---:|---:|
| Must (MVP) | 17 | 63,0% | 920 | 62,2% |
| Should | 5 | 18,5% | 260 | 17,6% |
| Could | 5 | 18,5% | 300 | 20,3% |
| Won't | 0 | 0% | 0 | 0% |

- **Ngoài phạm vi (v2):** trợ lý giọng nói, thanh toán quốc tế.
- **Từ điển WBS** cho 3 gói trọng yếu (1.2.4, 1.4.2/1.4.4, 1.6.2/1.6.3), kèm tiêu chí nghiệm thu định lượng: xem `03_WBS_and_WBS_Dictionary.md`.

---

## CHƯƠNG 4. TIẾN ĐỘ

### 4.1. Ước lượng PERT/CPM (kế hoạch ban đầu)
- Đường găng: Start → A → B → D → E → G → I → L → M → End.
- Thời gian kỳ vọng: **67,5 ngày làm việc**, σ ≈ 2,62 ngày.
- Xác suất hoàn thành trong 70 ngày ≈ 83%.
- Chi tiết: `WBS_Project_Management.md` Phần 5.

### 4.2. Tiến độ thực tế
| Giai đoạn | Thời gian | Kết quả |
|---|---|---|
| ĐACN1 | 24/08 → 09/11 | 5 phân hệ ở mức chức năng (xem `00_Project_History.md`) |
| Lập repo QTDA | 09/11 | Repo, 25 issue, 3 milestone, CI, template |
| QTDA-A | 14/11 → 19/11 | Khôi phục route backend, test thật, CI thật, re-baseline hồ sơ |
| QTDA-B | 20/11 → 24/11 | [CẦN BỔ SUNG] |
| QTDA-C | 25/11 → bảo vệ | [CẦN BỔ SUNG] |

### 4.3. Velocity / Burndown
Chỉ tính cho giai đoạn QTDA, lấy từ story point của các issue đã đóng có PR merge: [CẦN BỔ SUNG sau mỗi mini-sprint]. Giai đoạn ĐACN1 không ghi story point, nên báo cáo không nêu velocity cho giai đoạn này.

---

## CHƯƠNG 5. CHI PHÍ & EVM
- **Chi phí hạ tầng:** 0 VNĐ (dùng free tier).
- **EVM giai đoạn QTDA** (định nghĩa tại `02_Project_Management_Plan.md` §3):

| Thời điểm | PV | EV | AC | SPI | CPI |
|---|---|---|---|---|---|
| Cuối QTDA-A | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cuối QTDA-B | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cuối QTDA-C | [ ] | [ ] | [ ] | [ ] | [ ] |

---

## CHƯƠNG 6. CHẤT LƯỢNG & KIỂM THỬ

### 6.1. Rà soát khi tổ chức lại repo (14/11/2026)
| Phát hiện | Mức độ | Xử lý |
|---|---|---|
| Backend import `routes/user.route.js`, `routes/admin.route.js` không tồn tại, nên server không khởi động được | Nghiêm trọng | Dựng lại 2 file từ route con và đường dẫn API mà client gọi |
| Test cũ chỉ kiểm tra hằng số; CI backend chỉ chạy `console.log` | Cao | Viết 16 test thật; CI chạy test |
| Webhook Casso không kiểm tra `Secure-Token` (tiêu chí WBS 1.2.4) | Cao | Thêm kiểm tra qua `CASSO_SECURE_TOKEN` |
| Thiếu file model và số đo accuracy AI | Trung bình | Thêm `AI_Service/evaluate.py` |

### 6.2. Kết quả kiểm thử tự động (chạy ngày 14/11/2026)
| Bộ kiểm thử | Kết quả |
|---|---|
| Backend `npm test`: 8 API test (supertest), 5 test đối soát Casso, 3 test phân quyền | **16/16 pass** |
| Flutter `analyze` — app khách hàng | 0 error (27 info/warning) |
| Flutter `analyze` — app tài xế | 0 error (21 info/warning) |
| Flutter `test` — app tài xế (màn hình đăng nhập) | **1/1 pass** |
| Admin `npm run build` | Build thành công |

Các API test xác nhận:
- Route khách hàng, admin và tài xế trả **401** khi thiếu token.
- JWT sai chữ ký trả **401**.
- Webhook sai `Secure-Token` trả **401**.
- Webhook gửi lại lần 2 không cập nhật trạng thái lần nữa (idempotent).
- Mã đơn được trích đúng từ nội dung chuyển khoản.

**Chưa tự động hóa:** luồng E2E qua Firestore thật (đặt món → thanh toán → giao). Luồng này được kiểm bằng UAT (Chương 8).

### 6.3. Tiêu chí nghiệm thu kỹ thuật
| Tiêu chí | Ngưỡng | Kết quả |
|---|---|---|
| AI Top-1 / Top-3 (test set) | ≥ 80% / ≥ 92% | [CẦN BỔ SUNG từ `models/eval_report.json`] |
| Kích thước model | ≤ 15 MB | [CẦN BỔ SUNG] |
| Latency `/predict` (CPU, p95) | ≤ 500 ms | [CẦN BỔ SUNG] |
| Webhook sai token → 401 | Bắt buộc | ✅ Đạt (test tự động) |
| Webhook lặp lại không cập nhật lần 2 | Bắt buộc | ✅ Đạt (test tự động) |
| Thời gian webhook cập nhật PAID | ≤ 1,5 s | [CẦN BỔ SUNG — đo thật] |

---

## CHƯƠNG 7. RỦI RO & THAY ĐỔI PHẠM VI

- **Sổ rủi ro** (`04_Risk_Register_Evolution.md`):
  - R01–R06 từ giai đoạn ĐACN1.
  - Bổ sung R07–R10 cho giai đoạn QTDA: thời gian ngắn, model AI có thể chưa đạt ngưỡng, lộ token, lỗi thiếu route (đã xử lý).
- **CR-01** (`06_Scope_Change_Control_Record.md`):
  - Vấn đề: webhook Casso bị trễ.
  - Giải pháp: thêm endpoint `GET /api/user/orders/:id/check-payment`, app tự polling và có nút "Tôi đã chuyển khoản".
  - Mã nguồn: `order.service.js` (`checkPayment`) và màn hình thanh toán của app khách hàng.
  - Số đo hiệu quả: [CẦN BỔ SUNG nếu có log].

---

## CHƯƠNG 8. NGHIỆM THU (UAT)
- 7 kịch bản UAT đã chuẩn bị tại `07_Stakeholder_Acceptance_Signoff.md`.
- Kết quả: [CẦN BỔ SUNG sau buổi UAT thật — ngày, người tham gia (ghi rõ khách thật hay nội bộ), số kịch bản PASS/FAIL, biên bản có chữ ký].

---

## CHƯƠNG 9. ĐÓNG GÓP THÀNH VIÊN
Lấy từ GitHub Insights và danh sách PR của giai đoạn QTDA (sau 09/11), kèm mô tả vai trò trong ĐACN1:

| Thành viên | PR tạo (QTDA) | PR review (QTDA) | Issue hoàn thành | Phần việc chính |
|---|---:|---:|---:|---|
| Võ Nhật Huy | [ ] | [ ] | [ ] | Quản lý dự án, QA, hồ sơ |
| Trần Phan Minh Tiến | [ ] | [ ] | [ ] | Kiến trúc, CI, test backend, route |
| Nguyễn Minh | [ ] | [ ] | [ ] | App Flutter, Admin web |
| Nguyễn Gia Bảo | [ ] | [ ] | [ ] | Backend nghiệp vụ, AI |

---

## CHƯƠNG 10. BÀI HỌC KINH NGHIỆM
1. **Hồ sơ phải kiểm chứng được.** Lúc tổ chức lại repo, nhóm phát hiện nhiều tuyên bố trong tài liệu không khớp với code và dữ liệu GitHub (MoSCoW tính sai, test và CI chỉ mang tính hình thức, route bị thiếu). Từ đó nhóm thống nhất mọi con số phải đi kèm nguồn đo.
2. **CI phải kiểm tra thật.** Một pipeline "luôn xanh" mà không chạy test đã che mất lỗi server không khởi động được.
3. **Dịch vụ bên thứ ba cần đường dự phòng.** Đó là lý do có CR-01: polling song song với webhook.
4. **Kế thừa đồ án (Pathway 1) cần ghi nguồn gốc ngay từ đầu.** Như vậy hội đồng mới phân biệt được phần đã làm ở ĐACN1 với phần làm trong QTDA.
5. **Bảo mật tài khoản.** Không chia sẻ token cá nhân. Mỗi thành viên commit bằng tài khoản của chính mình.
