# BẢNG THEO DÕI TIẾN HÓA RỦI RO (RISK REGISTER EVOLUTION)
## DỰ ÁN GUGUGAGA — CẬP NHẬT WEEK 6 (SPRINT 1), WEEK 11 (SPRINT 2), 14/11, 15/11 VÀ 22–23/11/2026

**Công thức đánh giá:**  
$$\text{Mức Độ Rủi Ro (Risk Score)} = \text{Xác Suất (P: 1–5)} \times \text{Mức Ảnh Hưởng (I: 1–5)}$$  
*Thang điểm: $1 - 6$: Thấp (🟢 Xanh) | $8 - 14$: Trung bình (🟡 Vàng) | $15 - 25$: Nghiêm trọng (🔴 Đỏ)*

### LỊCH CẬP NHẬT VÀ NGUỒN GỐC TỪNG ĐỢT

| Đợt | Thời điểm | Giai đoạn | Cách ghi nhận | Bằng chứng |
|:---:|:---|:---|:---|:---|
| **Week 6** | 28/09 – 02/10/2026, sau Sprint 1 (24/08 – 27/09) | ĐACN1 | **Ghi lại sau** khi lập repo QTDA (09–14/11/2026), dựa trên trao đổi của nhóm | [CẦN BỔ SUNG: biên bản họp / tin nhắn nhóm gốc có ngày, issue #32] |
| **Week 11** | 02/11 – 06/11/2026, cuối Sprint 2 (28/09 – 08/11) | ĐACN1 | **Ghi lại sau**, như trên | [CẦN BỔ SUNG, như trên] |
| **14/11** | 14/11/2026, bắt đầu QTDA-A | QTDA | Ghi nhận đúng thời điểm: R07–R10 | Commit trên GitHub, issue #27–#42 |
| **15/11** | 15/11/2026, sau kiểm thử beta trên điện thoại | QTDA | Ghi nhận đúng thời điểm: R06 đã xảy ra, R11, R12 | Release v1.1.0-beta, PR #43, #44, issue #45–#50 |
| **22–23/11** | 22–23/11/2026, sau thử API thật và thử trên điện thoại | QTDA | Ghi nhận đúng thời điểm: R02 đã kiểm chứng, R11 xảy ra lần 2, R13–R20 | Test backend (80), PR #51–#55, video demo, CR-02, CR-03 |

> Đợt Week 6 và Week 11 thuộc giai đoạn ĐACN1, khi nhóm chưa dùng repo này. Số điểm P×I của hai đợt được nhóm **ghi lại sau** khi lập repo, không phải bản cập nhật lưu đúng vào tuần 6 và tuần 11. Muốn dùng làm bằng chứng kiểm toán, cần đính kèm tài liệu gốc của thời điểm đó.

---

### BẢNG THEO DÕI RỦI RO CHI TIẾT (6 RỦI RO THỰC TẾ)

| Mã | Tên rủi ro & Mô tả sự cố | Phân loại | Week 6 · Sprint 1 — P × I = Score | Week 11 · Sprint 2 — P × I = Score | Biện pháp phòng ngừa (Mitigation) & Ứng phó thực tế (Contingency) | Người phụ trách | Trạng thái hiện tại |
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

---

### CẬP NHẬT SAU KIỂM THỬ LUỒNG ĐƠN VÀ THANH TOÁN (22–23/11/2026)

Các rủi ro dưới đây được phát hiện khi chạy thử API thật, thử trên điện thoại và quay video demo. Điểm **trước** là mức rủi ro khi lỗi còn tồn tại, điểm **sau** là mức còn lại sau biện pháp.

| Mã | Rủi ro / diễn biến | P × I (trước → sau) | Biện pháp thực tế | Bằng chứng | Trạng thái |
|:---:|:---|:---:|:---|:---|:---:|
| **R02** | Xung đột nhận đơn: hai tài xế bấm nhận cùng lúc | 4 × 4 = **16** (🔴) → 1 × 3 = **3** (🟢) | Nhận đơn bằng giao dịch Firestore. **Đã kiểm chứng:** ba tài xế bấm đồng thời, một người nhận được, hai người nhận "Đơn hàng đã có tài xế nhận" | `Backend/src/services/shipper.service.js`, test `dispatch.test.js` | Đã kiểm soát |
| **R13** | **Đã xảy ra (23/11):** khách tự đánh dấu đơn "đã thanh toán" bằng `check-payment?force=true`, không trả tiền, và có thể làm với đơn của người khác | 4 × 5 = **20** (🔴) → 1 × 5 = **5** (🟢) | `check-payment` chỉ chủ đơn gọi được; xác nhận thủ công chỉ chạy ở chế độ demo (`PAYMENT_SIMULATOR=1`); app ẩn nút khi tiền thật | `paymentguard.test.js`; thử API ở chế độ tiền thật bị 403 | Đã xử lý |
| **R14** | **Đã xảy ra:** chuyển trạng thái đơn tuỳ ý: nhảy cóc, đặt "Đang giao" không có tài xế (đơn kẹt), xác nhận đơn online chưa trả, thanh toán đơn đã hủy | 4 × 4 = **16** (🔴) → 1 × 4 = **4** (🟢) | Bảng chuyển trạng thái dùng chung cho admin, tài xế, khách; đơn online chưa trả không xác nhận được | `orderflow.test.js`; CR-03 | Đã xử lý |
| **R15** | Cổng thanh toán thẻ/QR là **mô phỏng**: người dùng hoặc hội đồng hiểu nhầm là có tiền thật, hoặc nhập thẻ ngân hàng thật | 2 × 5 = **10** (🟡) | Chỉ nhận thẻ test, chặn mọi số thẻ khác ở app và server; banner "Cổng thử nghiệm (mô phỏng)"; mặc định tắt | CR-02 mục 6, `cardsim.test.js` | Chấp nhận, đã công bố |
| **R16** | Đơn online bỏ dở nằm mãi ở "Chờ xác nhận" | 4 × 2 = 8 (🟡) → 1 × 2 = **2** (🟢) | Đơn online chưa trả sau 30 phút tự hủy (`ORDER_PAY_TIMEOUT_MIN`), có thông báo cho khách | `paymentguard.test.js`; khi bật, 8 đơn cũ tự hủy | Đã xử lý |
| **R17** | Hủy đơn đã thanh toán **không tự hoàn tiền** | 3 × 3 = **9** (🟡) | Chỉ đánh dấu và báo khách cửa hàng sẽ liên hệ hoàn tiền; cổng là mô phỏng nên chưa có tiền thật | CR-03 | Chấp nhận |
| **R18** | Đăng nhập không giới hạn số lần sai; tài khoản mẫu dùng mật khẩu `123456` | 3 × 4 = **12** (🟡) | **Chưa xử lý.** Cần giới hạn số lần thử và đổi mật khẩu trước khi chạy thật | — | Mở |
| **R19** | **Đã xảy ra:** PR tự merge, chưa có người review; trái với quy trình ghi trong hồ sơ | 4 × 3 = **12** (🟡) | Nhờ thành viên khác review PR #51–#55; bật branch protection (issue #30) | PR #51–#55 | Mở |
| **R11** | **Xảy ra lần 2 (22/11):** chuyển server sang service mới, `export-on-exit` lỗi, mất khoảng 14 đơn thử | 3 × 3 = 9 (🟡) → 2 × 2 = **4** (🟢) | Lưu chủ động trước khi dừng và lưu định kỳ 5 phút; link cố định qua Tailscale Funnel; service tự chạy | `scripts/install-demo-services.sh`; thử khởi động lại, dữ liệu còn | Đã kiểm soát |
| **R20** | Trang admin **không hiển thị thông báo** (thiếu `<Toaster />`), admin không biết thao tác bị từ chối | 5 × 2 = 10 (🟡) → 1 × 2 = **2** (🟢) | Gắn `<Toaster />`; nhãn thanh toán và badge Đã/Chưa thanh toán; tự làm mới đơn | Commit `fix(admin)`; video demo | Đã xử lý |
| **R21** | App khách giữ địa chỉ server cũ do người dùng nhập tay, đè địa chỉ cài sẵn; danh sách đơn của khách không tự làm mới | 3 × 3 = **9** (🟡) | **Chưa xử lý.** Phát hiện khi quay video trên điện thoại thật | Video demo | Mở |

> **Bài học quản trị:** R13 và R14 không bị test cũ phát hiện, vì test cũ chỉ kiểm tra luồng đúng. Chúng lộ ra khi nhóm chủ động thử các trường hợp sai (người khác gọi API, đi sai thứ tự, tắt chế độ demo). Vì vậy sổ rủi ro nên đi cùng danh sách trường hợp xấu cần thử, không chỉ luồng thành công.
