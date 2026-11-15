# BẢNG THEO DÕI TIẾN HÓA RỦI RO (RISK REGISTER EVOLUTION)
## DỰ ÁN GUGUGAGA (CẬP NHẬT QUA SPRINT 1 VÀ SPRINT 2)

**Công thức đánh giá:**  
$$\text{Mức Độ Rủi Ro (Risk Score)} = \text{Xác Suất (P: 1–5)} \times \text{Mức Ảnh Hưởng (I: 1–5)}$$  
*Thang điểm: $1 - 6$: Thấp (🟢 Xanh) | $8 - 14$: Trung bình (🟡 Vàng) | $15 - 25$: Nghiêm trọng (🔴 Đỏ)*

---

### BẢNG THEO DÕI RỦI RO CHI TIẾT (6 RỦI RO THỰC TẾ)

| Mã | Tên rủi ro & Mô tả sự cố | Phân loại | Đợt 1 (Sprint 1) P × I = Score | Đợt 2 (Sprint 2) P × I = Score | Biện pháp phòng ngừa (Mitigation) & Ứng phó thực tế (Contingency) | Người phụ trách | Trạng thái hiện tại |
|:---:|:---|:---:|:---:|:---:|:---|:---:|:---:|
| **R01** | **Webhook Casso trễ hoặc gián đoạn** do mạng hoặc bên thứ 3 khiến khách hàng thanh toán xong phải chờ lâu | Kỹ thuật / Bên thứ 3 | 3 × 5 = **15** (🔴 Đỏ) | 1 × 4 = **4** (🟢 Xanh) | **Xử lý qua CR-01**: Bổ sung cơ chế Polling chu kỳ 5 giây từ Flutter app lên endpoint `/check-payment`, đồng thời thêm nút *"Tôi đã chuyển khoản"* cho phép đối soát cưỡng bức. | Bảo (BE), Huy (QA) | **Đã giải quyết triệt để** |
| **R02** | **Xung đột nhận đơn (Race Condition)**: 2 tài xế cùng lúc bấm nhận 1 đơn hàng | Kỹ thuật / Đồng thời | 4 × 4 = **16** (🔴 Đỏ) | 1 × 3 = **3** (🟢 Xanh) | Áp dụng Firestore Transaction và kiểm tra Optimistic Locking `status == 'PENDING'`. Khi phát hiện tranh chấp, app tài xế báo ngay *"Đơn đã có tài xế khác tiếp nhận"*. | Minh (Mobile), Bảo (BE) | **Đã giải quyết** |
| **R03** | **Mô hình AI nhận diện nhầm món ăn** do góc chụp hoặc ánh sáng phức tạp | Kỹ thuật / AI | 4 × 3 = **12** (🟡 Vàng) | 2 × 2 = **4** (🟢 Xanh) | Áp dụng Data Augmentation khi train; API trả về Top-3 món gợi ý trong BottomSheet; kích hoạt chế độ Fallback ImageNet Mapper tự động. | Bảo (AI Engineer) | **Kiểm soát tốt** |
| **R04** | **Vượt hạn mức miễn phí (Rate Limit)** của Firebase Firestore và Mapbox API | Tài chính / Vận hành | 3 × 3 = **9** (🟡 Vàng) | 1 × 3 = **3** (🟢 Xanh) | Cài đặt cache lộ trình Mapbox (`route_service.dart`) với bán kính 30m và thời gian 30s; thiết lập Debounce tìm kiếm. | Tiến (Tech Lead) | **Kiểm soát tốt** |
| **R05** | **Trễ hạn tiến độ do thành viên bỡ ngỡ** công nghệ mới (Flutter / PyTorch) | Nhân sự / Tiến độ | 3 × 4 = **12** (🟡 Vàng) | 1 × 3 = **3** (🟢 Xanh) | Tiến hành Pair Programming (Tiến kèm Minh phần Flutter, Bảo nghiên cứu sâu AI); duy trì Daily Scrum 15 phút. | Huy (Project Lead) | **Đã vượt qua** |
| **R06** | **Nguy cơ lộ lọt thông tin bí mật** (`serviceAccountKey.json`, `JWT_SECRET`, API keys) | An toàn thông tin | 2 × 5 = **10** (🟡 Vàng) | 1 × 5 = **5** (🟢 Xanh) | Đưa toàn bộ file credentials vào `.gitignore`; cung cấp file mẫu `.env.example`; quét commit trước khi merge. | Tiến (Tech Lead) | **Bảo mật an toàn** |

---

### RỦI RO BỔ SUNG — GIAI ĐOẠN QTDA (CẬP NHẬT 14/11/2026)

| Mã | Tên rủi ro & Mô tả | Phân loại | P × I = Score | Biện pháp | Người phụ trách | Trạng thái |
|:---:|:---|:---:|:---:|:---|:---:|:---:|
| **R07** | Thời gian giai đoạn QTDA ngắn: repo và khung quản trị chỉ được lập từ 09/11 | Tiến độ | 4 × 4 = **16** (🔴) | Mini-sprint 5 ngày; ưu tiên Must; cắt Could nếu trễ | Huy | Đang theo dõi |
| **R08** | Model AI chưa đạt Top-1 ≥ 80%. `train.py` dùng mốc 0,7205 khi resume, gợi ý val acc gần nhất ~72% | Kỹ thuật / AI | 3 × 3 = **9** (🟡) | Đo bằng `evaluate.py`; báo cáo đúng số đo; giữ Top-3 + fallback | Bảo | Đang theo dõi |
| **R09** | Lộ GitHub token cá nhân do chia sẻ trong nhóm | An toàn thông tin | 3 × 5 = **15** (🔴) | Thu hồi token đã chia sẻ; mỗi người chỉ dùng token của mình | Tiến | Cần xử lý ngay |
| **R10** | Backend không khởi động từ repo do thiếu `user.route.js`, `admin.route.js` | Kỹ thuật | 5 × 4 = **20** → đã xử lý | Dựng lại route + test API trong CI | Tiến | Đã xử lý (14/11) |

---

### CẬP NHẬT SAU KIỂM THỬ THỰC TẾ (15/11/2026)

| Mã | Diễn biến | P × I (mới) | Phản ứng thực tế | Trạng thái |
|:---:|:---|:---:|:---|:---:|
| **R06** | **Đã xảy ra:** key Gemini ghi cứng trong `ai_service.dart` (repo public và APK). Token GitHub cá nhân bị chia sẻ trong nhóm | 5 × 5 = **25** (🔴) → 2 × 5 = **10** | Chatbot gọi qua backend (`/api/ai/chat`), xoá key khỏi mã nguồn, kiểm tra APK không còn key bí mật, `.gitignore` chặn file service account. **Còn lại:** thu hồi key Gemini cũ và các token GitHub đã lộ | Đang xử lý |
| **R01** | Webhook Casso: thêm kiểm tra `Secure-Token`, có test tự động cho idempotency | 1 × 4 = 4 | Giữ polling (CR-01) | Đã kiểm soát |
| **R03** | Quét hoá đơn bằng Gemini lỗi do ảnh gửi lên không có Content-Type | 2 × 3 = 6 | Backend tự nhận dạng loại ảnh | Đã kiểm soát |
| **R04** | Không có key OpenCage hay token Mapbox thì bản đồ và tra địa chỉ hỏng | 2 × 3 = 6 | Dự phòng nhiều tầng: Mapbox → Nominatim/OSM → toạ độ | Đã kiểm soát |
| **R11** | **Mới:** server demo chạy trên máy cá nhân (tunnel đổi URL, mất dữ liệu khi tắt đột ngột) | 3 × 3 = **9** (🟡) | Đổi URL ngay trong app; lưu dữ liệu trước khi tắt và mỗi 10 phút. **Đã xảy ra một lần:** mất dữ liệu 19:04–20:02 ngày 15/11 | Đang theo dõi |
| **R12** | **Mới:** đăng nhập Google phụ thuộc SHA-1 của máy build | 3 × 2 = 6 | Ghi rõ trong README; máy build khác phải thêm SHA-1 vào Firebase | Đang theo dõi |
