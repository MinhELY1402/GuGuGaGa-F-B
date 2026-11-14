# BIÊN BẢN HỌP CẢI TIẾN QUY TRÌNH (SPRINT RETROSPECTIVES)

> Ghi chú: Retro Sprint 1 thuộc giai đoạn ĐACN1 — nhóm cần đối chiếu nội dung với ghi chép/tin nhắn thật và đính kèm bằng chứng. Các retro của giai đoạn QTDA (sau 09/11) được ghi tiếp ở cuối file theo từng mini-sprint.
## DỰ ÁN GUGUGAGA (THEO MÔ HÌNH 4Ls: LIKED - LEARNED - LACKED - LONGED FOR)

---

## 1. BIÊN BẢN SPRINT 1 RETROSPECTIVE (HỌP NGÀY 26/09/2026)

* **Thời gian:** 19:30 – 21:00, Thứ Bảy ngày 26/09/2026
* **Địa điểm:** Google Meet & Bảng thảo luận nhóm
* **Chủ trì (Scrum Master):** Võ Nhật Huy (Project Lead)
* **Thành phần tham gia:** Võ Nhật Huy, Trần Phan Minh Tiến, Nguyễn Minh, Nguyễn Gia Bảo (Đầy đủ 4/4)

### Nội dung thảo luận theo mô hình 4Ls:
1. **Liked (Những điểm làm tốt, đáng phát huy):**
   - Thiết lập Monorepo và Firestore Seeding rất nhanh nhờ sự chuẩn bị kỹ của Tiến và Bảo.
   - Minh nắm bắt cấu trúc widget Flutter tốt, hoàn thành màn hình Home và Menu đúng hạn.
2. **Learned (Những bài học kinh nghiệm rút ra):**
   - Cần thống nhất cấu trúc Model JSON (`fromJson`, `toJson`) giữa Backend và Flutter ngay từ đầu để tránh lỗi ép kiểu `Null check operator used on a null value`.
   - Cấu hình Firebase Auth trên máy ảo Android cần file `google-services.json` đồng bộ với SHA-1.
3. **Lacked (Những điểm còn thiếu sót, trở ngại):**
   - Tài liệu mô tả các API endpoints còn ghi chú rải rác, Minh phải hỏi Bảo qua chat nhiều lần.
   - Chưa có file kiểm thử tự động (Unit test) cho các route Backend trước khi tạo PR.
4. **Longed For (Những mong muốn cho Sprint sau):**
   - Có một file collection Postman hoặc file mẫu curl tập trung để test nhanh.
   - Huy (QA Lead) sẽ viết bộ test tự động `api.test.js` trong tuần 5 để đảm bảo chất lượng.

---

## 2. BIÊN BẢN FINAL SPRINT RETROSPECTIVE (HỌP NGÀY 14/11/2026)

* **Thời gian:** 20:00 – 21:30, Thứ Bảy ngày 14/11/2026
* **Chủ trì (Scrum Master):** Võ Nhật Huy
* **Thành phần tham gia:** Toàn bộ 4 thành viên

### Nội dung thảo luận:
1. **Liked (Thành tựu lớn nhất của toàn dự án):**
   - Cả 5 phân hệ phần mềm chạy mượt mà, liên thông dữ liệu hoàn chỉnh 100%.
   - Xử lý thành công biến cố **Scope Change CR-01** (VietQR Polling) giúp hệ thống thanh toán đạt độ tin cậy tuyệt đối.
2. **Learned (Bài học quản trị quan trọng nhất):**
   - "Dự án thật luôn phát sinh rủi ro thật" — việc duy trì Bảng rủi ro và họp CCB kịp thời quan trọng hơn việc cố bám đuổi kế hoạch ban đầu một cách máy móc.
   - Tối ưu hóa mô hình AI: MobileNetV2 9.3MB là quyết định sáng suốt thay vì dùng ResNet hay VGG cồng kềnh.
3. **Lacked (Điểm có thể làm tốt hơn nếu có thêm thời gian):**
   - Có thể tích hợp thêm thông báo đẩy qua Firebase Cloud Messaging (FCM) ở chế độ nền khi tắt màn hình điện thoại.
4. **Longed For (Định hướng phát triển phiên bản 2.0):**
   - Triển khai mở rộng cho nhiều chuỗi nhà hàng độc lập cùng đăng ký (Multi-tenant SaaS).
   - Tích hợp thêm kênh đặt hàng trực tiếp qua Zalo Mini App.
