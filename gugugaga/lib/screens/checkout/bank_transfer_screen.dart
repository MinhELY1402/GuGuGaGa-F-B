// [W07 Initial] Static VietQR Dialog waiting for Casso webhook
import 'package:flutter/material.dart';

class BankTransferScreen extends StatelessWidget {
  final String orderId;
  final double amount;
  const BankTransferScreen({Key? key, required this.orderId, required this.amount}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Thanh toán VietQR")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("Vui lòng quét mã QR chuyển khoản số tiền: ${amount.toStringAsFixed(0)} VNĐ"),
            SizedBox(height: 16),
            // Static notice waiting for webhook
            Text("Hệ thống sẽ tự động chuyển trang khi nhận được tiền từ ngân hàng...", 
                 style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
