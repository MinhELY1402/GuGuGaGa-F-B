# BIÊN BẢN NGHIỆM THU NGƯỜI DÙNG & BÀN GIAO SẢN PHẨM (UAT SIGNOFF)

> ⚠️ **Trạng thái: CHƯA THỰC HIỆN.** Đây là kịch bản UAT chuẩn bị sẵn. Cột "Kết quả thực tế", "Đánh giá", ý kiến và chữ ký chỉ được điền sau buổi UAT thật (ghi rõ UAT với khách thật hay UAT nội bộ).

## DỰ ÁN HỆ THỐNG GUGUGAGA

**Ngày nghiệm thu:** [CẦN BỔ SUNG]  
**Địa điểm:** [CẦN BỔ SUNG]  
**Đại diện Bên Nghiệm Thu:**
* Ông/Bà: [Họ tên người nghiệm thu thật] — [vai trò]
* Liên hệ: [email/SĐT thật]  
**Đại diện Bên Phát Triển (Nhóm sinh viên):**
* Võ Nhật Huy (Project Lead)
* Trần Phan Minh Tiến (Technical Lead)

---

### 1. BẢNG KẾT QUẢ KIỂM THỬ CHẤP NHẬN NGƯỜI DÙNG (UAT TEST MATRIX)

| STT | Kịch bản kiểm thử (Test Scenario) | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|:---:|:---|:---|:---|:---:|
| **UAT-01** | Khách chụp ảnh món Bánh bèo bằng camera app | AI nhận diện đúng nhãn "Bánh bèo", gợi ý món trong menu | [điền sau UAT] | [PASS/FAIL] |
| **UAT-02** | Khách chat hỏi: "Tôi có 50k, tư vấn món ăn trưa" | Gemini trả lời lịch sự và gợi ý món/combo dưới 50.000đ | [điền sau UAT] | [PASS/FAIL] |
| **UAT-03** | Khách chọn món, thêm topping, tạo đơn hàng | Giỏ hàng tính đúng tổng tiền, chuyển sang trang thanh toán | [điền sau UAT] | [PASS/FAIL] |
| **UAT-04** | Khách quét mã VietQR bằng app ngân hàng MBBank | Đơn tự động chuyển `PAID` sau khi nhận biến động số dư | [điền sau UAT] | [PASS/FAIL] |
| **UAT-05** | Quán ăn mở Web Admin nhận thông báo đơn mới | Web Admin rung chuông, hiển thị đơn mới trên Dashboard | [điền sau UAT] | [PASS/FAIL] |
| **UAT-06** | Shipper mở app, nhận đơn và bật dẫn đường | App Shipper vẽ tuyến đường ngắn nhất từ quán đến nhà khách | [điền sau UAT] | [PASS/FAIL] |
| **UAT-07** | Shipper giao món và xác nhận thu COD | Shipper tích vào checkbox "Đã thu đủ tiền", đơn hoàn tất | [điền sau UAT] | [PASS/FAIL] |

---

### 2. Ý KIẾN ĐÁNH GIÁ CỦA KHÁCH HÀNG THỰC TẾ
> [Ý kiến thật của người nghiệm thu]

---

### 3. KÝ TÊN XÁC NHẬN BÀN GIAO

* **Đại diện Khách hàng / Stakeholder:**  
  *(Ký và ghi rõ họ tên)*  
  [Họ tên & chữ ký thật]

* **Đại diện Nhóm Phát Triển (Project Manager):**  
  *(Ký và ghi rõ họ tên)*  
  **Võ Nhật Huy** ([ký thật])
