# KẾ HOẠCH QUẢN LÝ DỰ ÁN (PROJECT MANAGEMENT PLAN) — GUGUGAGA

Phạm vi: giai đoạn QTDA, từ khi tổ chức lại repo (09/11/2026) đến ngày bảo vệ. Sản phẩm kế thừa từ ĐACN1 (xem `00_Project_History.md`).

## 1. Quản lý phạm vi
- **Đường cơ sở phạm vi:** WBS 27 gói lá, 1.480h (`WBS_Project_Management.md`, `03_WBS_and_WBS_Dictionary.md`).
- **MoSCoW:** Must 17 gói / 920h (62,2%), Should 5 / 260h, Could 5 / 300h, Won't 0.
- **Kiểm soát thay đổi:** mọi thay đổi phạm vi phải lập Change Request theo mẫu `06_Scope_Change_Control_Record.md`. CCB gồm 4 thành viên, quyết định theo đa số, PM chủ trì.

## 2. Quản lý tiến độ — mini-sprint giai đoạn QTDA

| Sprint | Thời gian | Mục tiêu |
|---|---|---|
| QTDA-A | 14/11 – 19/11 | Re-baseline hồ sơ; khôi phục route backend; test thật + CI; Stakeholder Register |
| QTDA-B | 20/11 – 24/11 | Đo accuracy AI (`evaluate.py`); đo thời gian xác nhận thanh toán (CR-01); EVM giữa kỳ |
| QTDA-C | 25/11 – [bảo vệ] | UAT thật; build APK; GitHub Release; báo cáo tổng kết + slide |

Nghi thức của mỗi sprint: Planning (chọn issue, ước lượng story point), trao đổi hằng ngày qua nhóm chat, Review (demo), Retro theo 4Ls. Biên bản lưu ở `05_Sprint_Retrospectives.md`.

## 3. Quản lý chi phí & EVM
- **Hạ tầng:** 0 VNĐ (Firebase Spark, Cloudinary Free, Mapbox Free, Casso Free).
- **Nỗ lực:** đo bằng giờ công. Ngân sách giai đoạn QTDA (BAC) = tổng giờ ước lượng của các issue trong 3 mini-sprint.
- **EVM:** cập nhật vào cuối mỗi sprint.

| Chỉ số | Công thức | Nguồn số liệu |
|---|---|---|
| PV | Giờ kế hoạch của các issue dự kiến xong tới thời điểm đo | Board / milestone |
| EV | Giờ ước lượng của các issue đã **Done** | Issue đã đóng có PR merge |
| AC | Giờ thực tế đã bỏ ra | Mỗi thành viên ghi giờ vào issue |
| SPI / CPI | EV/PV, EV/AC | Tính trong báo cáo |

## 4. Quản lý chất lượng
- **Definition of Done:** PR có ≥ 1 approve của người khác tác giả; CI xanh; có test cho logic mới (backend); tài liệu liên quan được cập nhật.
- **Cổng CI:** backend `npm test`; Admin `npm run build`; Flutter `analyze` + `test`.
- **Tiêu chí nghiệm thu chính:**

| Tiêu chí | Ngưỡng | Cách đo |
|---|---|---|
| AI Top-1 / Top-3 | ≥ 80% / ≥ 92% | `evaluate.py` |
| Webhook sai token | Trả 401 | Test tự động |
| Webhook lặp lại | Không cập nhật lần 2 | Test `shouldMarkPaid` |
| UAT | 7 kịch bản ở `07_...` | Buổi UAT thật |

## 5. Quản lý truyền thông

| Kênh | Mục đích | Tần suất | Người phụ trách |
|---|---|---|---|
| Nhóm chat | Cập nhật hằng ngày, chặn việc | Hằng ngày | Cả nhóm |
| GitHub Issues / PR | Giao việc, review, quyết định kỹ thuật | Liên tục | Người được giao |
| Họp online | Planning / Review / Retro | Đầu và cuối sprint | Huy |
| Gặp GVHD | Báo cáo tiến độ | Theo lịch lớp | Huy |

## 6. Quản lý các bên liên quan (Stakeholder Register)

| Bên liên quan | Vai trò | Quan tâm / Ảnh hưởng | Cách tương tác |
|---|---|---|---|
| TS. Nguyễn Thanh Tuấn | GV môn QTDA | Cao / Cao | Báo cáo theo lịch, nộp hồ sơ |
| GVHD ĐACN1 | Nguồn kế thừa | Trung bình / Thấp | Xác nhận nguồn gốc nếu cần |
| Người tham gia UAT | Người dùng / chủ quán | Cao / Trung bình | Buổi UAT, biên bản |
| Nhóm 4 sinh viên | Thực hiện | Cao / Cao | Theo kế hoạch truyền thông |

## 7. Quản lý rủi ro
Sổ rủi ro nằm ở `04_Risk_Register_Evolution.md`, cập nhật vào cuối mỗi sprint. Bổ sung cho giai đoạn QTDA:

| Mã | Rủi ro | P×I | Ứng phó |
|---|---|---|---|
| R07 | Thời gian giai đoạn QTDA ngắn (kể từ 09/11) | 4×4 = 16 | Mini-sprint 5 ngày; ưu tiên Must; cắt Could nếu trễ |
| R08 | Model AI chưa đạt ≥ 80% (`train.py` ghi mốc 0,7205 khi resume) | 3×3 = 9 | Đo bằng `evaluate.py`; nếu không đạt thì báo cáo trung thực, giữ Top-3 + fallback |
| R09 | Lộ GitHub token / secret | 3×5 = 15 | Thu hồi token đã chia sẻ; không commit `.env`; mỗi người dùng token của mình |

## 8. Quản lý cấu hình
- GitFlow: `main` ← `develop` ← `feature/*`, `fix/*`, `docs/*`.
- Bật branch protection cho `main` và `develop`: bắt buộc PR, 1 approval, CI xanh, cấm force-push.
- Phát hành bằng tag `vX.Y.Z` + GitHub Release, đính kèm APK và file model.
