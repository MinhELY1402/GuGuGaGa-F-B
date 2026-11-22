import 'package:flutter/material.dart';

/// Màn Trợ giúp: các câu hỏi thường gặp về đặt hàng, thanh toán và theo dõi đơn.
class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  static const List<(String, String)> faqs = [
    (
      'Làm sao để đặt món?',
      'Chọn chi nhánh, vào Thực đơn, thêm món vào giỏ rồi bấm "Thanh toán". '
          'Nhập địa chỉ giao hàng, chọn phương thức thanh toán và xác nhận đơn.'
    ),
    (
      'Các cách thanh toán?',
      'Tiền mặt khi nhận hàng (COD), chuyển khoản VietQR, hoặc thanh toán online bằng thẻ / mã QR ngay trong ứng dụng.'
    ),
    (
      'Thanh toán bằng thẻ có trừ tiền thật không?',
      'Không. Cổng thẻ trong bản thử nghiệm là mô phỏng và chỉ nhận thẻ test, '
          'ví dụ 4111 1111 1111 1111 (hết hạn 12/30, CVV 123, OTP 123456). Tuyệt đối không nhập thẻ ngân hàng thật.'
    ),
    (
      'Vì sao đơn của tôi ở mục "Chờ xác nhận"?',
      'Mọi đơn đều chờ cửa hàng xác nhận trước khi giao cho tài xế. '
          'Khi cửa hàng xác nhận, đơn chuyển sang "Đã chấp nhận" và bạn nhận được thông báo.'
    ),
    (
      'Theo dõi đơn hàng ở đâu?',
      'Vào Tài khoản → Lịch sử đặt hàng. Các tab Chờ xác nhận, Đã chấp nhận, Đang giao, Đã giao cho biết đơn đang ở bước nào.'
    ),
    (
      'Không kết nối được máy chủ?',
      'Vào Tài khoản → Cài đặt → Địa chỉ máy chủ và nhập đúng địa chỉ do nhóm phát triển cung cấp. '
          'Địa chỉ thử nghiệm có thể thay đổi khi máy chủ khởi động lại.'
    ),
    (
      'Cần hỗ trợ thêm?',
      'Dùng trợ lý AI (nút chat ở góc màn hình) để hỏi về món ăn, hoặc gửi phản hồi cho nhóm phát triển qua mục Issues trên GitHub: '
          'github.com/MinhELY1402/GuGuGaGa-F-B'
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trợ giúp'),
        backgroundColor: Colors.red.shade700,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text('Câu hỏi thường gặp', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          for (final (q, a) in faqs)
            ExpansionTile(
              title: Text(q, style: const TextStyle(fontWeight: FontWeight.w600)),
              childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              expandedCrossAxisAlignment: CrossAxisAlignment.start,
              children: [Text(a, style: TextStyle(color: Colors.grey.shade800, height: 1.4))],
            ),
        ],
      ),
    );
  }
}
