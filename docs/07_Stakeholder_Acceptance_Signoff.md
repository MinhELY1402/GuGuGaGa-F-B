# BIÊN BẢN NGHIỆM THU NGƯỜI DÙNG & BÀN GIAO SẢN PHẨM (UAT SIGNOFF)
## DỰ ÁN HỆ THỐNG GUGUGAGA

**Ngày nghiệm thu:** 13/11/2026  
**Địa điểm:** Cửa hàng Đối tác Ẩm thực Truyền thống GuGuGaGa (Đà Nẵng) & Phòng Thí nghiệm Phần mềm VKU  
**Đại diện Bên Nghiệm Thu (Khách hàng/Stakeholder thật):**
* Ông/Bà: **Trần Quốc Tuấn** — Chủ cơ sở kinh doanh Quán Ăn GuGuGaGa
* Email đối tác: `quanangugugaga.danang@gmail.com`  
**Đại diện Bên Phát Triển (Nhóm sinh viên):**
* Võ Nhật Huy (Project Lead)
* Nguyễn Minh Tiến (Technical Lead)

---

### 1. BẢNG KẾT QUẢ KIỂM THỬ CHẤP NHẬN NGƯỜI DÙNG (UAT TEST MATRIX)

| STT | Kịch bản kiểm thử (Test Scenario) | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|:---:|:---|:---|:---|:---:|
| **UAT-01** | Khách chụp ảnh món Bánh bèo bằng camera app | AI nhận diện đúng nhãn "Bánh bèo", gợi ý món trong menu | Hiển thị đúng món Bánh bèo chén kèm giá 35.000đ | **PASS ✅** |
| **UAT-02** | Khách chat hỏi: "Tôi có 50k, tư vấn món ăn trưa" | Gemini trả lời lịch sự và gợi ý món/combo dưới 50.000đ | Gợi ý đúng món Cơm sườn 45.000đ có thẻ bấm xem | **PASS ✅** |
| **UAT-03** | Khách chọn món, thêm topping, tạo đơn hàng | Giỏ hàng tính đúng tổng tiền, chuyển sang trang thanh toán | Tính đúng tiền món + 15.000đ phí giao hàng | **PASS ✅** |
| **UAT-04** | Khách quét mã VietQR bằng app ngân hàng MBBank | Đơn tự động chuyển `PAID` sau khi nhận biến động số dư | Đơn chuyển `PAID` trong 1.2s, app báo thành công | **PASS ✅** |
| **UAT-05** | Quán ăn mở Web Admin nhận thông báo đơn mới | Web Admin rung chuông, hiển thị đơn mới trên Dashboard | Đơn xuất hiện ngay lập tức, hiển thị trạng thái chuẩn | **PASS ✅** |
| **UAT-06** | Shipper mở app, nhận đơn và bật dẫn đường | App Shipper vẽ tuyến đường ngắn nhất từ quán đến nhà khách | Bản đồ Mapbox dẫn đường chính xác tới địa chỉ nhận | **PASS ✅** |
| **UAT-07** | Shipper giao món và xác nhận thu COD | Shipper tích vào checkbox "Đã thu đủ tiền", đơn hoàn tất | Đơn đổi trạng thái `DELIVERED`, admin ghi nhận doanh thu | **PASS ✅** |

---

### 2. Ý KIẾN ĐÁNH GIÁ CỦA KHÁCH HÀNG THỰC TẾ
> *"Hệ thống GuGuGaGa hoạt động rất mượt mà và trực quan. Tính năng quét mã VietQR tự động xác nhận giúp quán không phải chụp màn hình hay kiểm tra sao kê ngân hàng thủ công trong giờ cao điểm trưa. Món ăn được nhận diện chuẩn xác và bản đồ giao hàng cho tài xế rất tiện lợi. Tôi đồng ý nghiệm thu và đưa vào thử nghiệm bán hàng thực tế tại cơ sở."*

---

### 3. KÝ TÊN XÁC NHẬN BÀN GIAO

* **Đại diện Khách hàng / Stakeholder:**  
  *(Ký và ghi rõ họ tên)*  
  **Trần Quốc Tuấn** (Đã ký)

* **Đại diện Nhóm Phát Triển (Project Manager):**  
  *(Ký và ghi rõ họ tên)*  
  **Võ Nhật Huy** (Đã ký)
