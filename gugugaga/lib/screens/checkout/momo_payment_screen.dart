import 'dart:async';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../payment/payment_success_screen.dart';

/// Thanh toán đơn MOMO qua cổng MoMo (môi trường thử nghiệm — không trừ tiền thật):
/// thẻ Visa/Mastercard (payWithCC) hoặc ví MoMo / quét QR (captureWallet).
/// Sau khi khách thanh toán, MoMo gọi IPN về backend; màn hình này tự kiểm tra trạng thái đơn.
class MomoPaymentScreen extends StatefulWidget {
  final String orderId;
  final num amount;

  const MomoPaymentScreen({super.key, required this.orderId, required this.amount});

  @override
  State<MomoPaymentScreen> createState() => _MomoPaymentScreenState();
}

class _MomoPaymentScreenState extends State<MomoPaymentScreen> {
  final _api = ApiService();
  Timer? _timer;
  bool _opening = false;
  bool _done = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 4), (_) => _checkPaid());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String? get _token => Provider.of<AuthProvider>(context, listen: false).token;

  Future<void> _checkPaid() async {
    final token = _token;
    if (_done || token == null) return;
    try {
      final order = await _api.getOrderDetail(widget.orderId, token);
      if (order['paymentStatus'] == 'PAID' && mounted && !_done) {
        _done = true;
        _timer?.cancel();
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const PaymentSuccessScreen()),
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Thanh toán MoMo thành công!'), backgroundColor: Colors.green),
        );
      }
    } catch (_) {
      // Bỏ qua lỗi mạng tạm thời, lần kiểm tra sau sẽ thử lại
    }
  }

  Future<void> _pay(String method) async {
    final token = _token;
    if (token == null) return;
    setState(() {
      _opening = true;
      _error = null;
    });
    try {
      final data = await _api.createMomoPayment(widget.orderId, method, token);
      final ok = await launchUrl(Uri.parse(data['payUrl'] as String), mode: LaunchMode.externalApplication);
      if (!ok) throw Exception('Không mở được trang thanh toán MoMo');
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _opening = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final money = NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(widget.amount);
    const momoPink = Color(0xFFA50064);

    return Scaffold(
      appBar: AppBar(title: const Text('Thanh toán MoMo')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Số tiền cần thanh toán', style: TextStyle(color: Colors.grey.shade700)),
          const SizedBox(height: 4),
          Text(money, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: momoPink)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: Colors.amber.shade50, borderRadius: BorderRadius.circular(12)),
            child: const Text(
              'Môi trường thử nghiệm MoMo (sandbox): không trừ tiền thật. '
              'Dùng thẻ test hoặc ứng dụng MoMo bản test theo hướng dẫn của MoMo.',
              style: TextStyle(fontSize: 13),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: _opening ? null : () => _pay('card'),
            icon: const Icon(Icons.credit_card),
            label: const Padding(
              padding: EdgeInsets.symmetric(vertical: 14),
              child: Text('Thẻ Visa / Mastercard / JCB', style: TextStyle(fontSize: 16)),
            ),
            style: FilledButton.styleFrom(backgroundColor: momoPink),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: _opening ? null : () => _pay('wallet'),
            icon: const Icon(Icons.qr_code_2, color: momoPink),
            label: const Padding(
              padding: EdgeInsets.symmetric(vertical: 14),
              child: Text('Ví MoMo / Quét mã QR', style: TextStyle(fontSize: 16, color: momoPink)),
            ),
            style: OutlinedButton.styleFrom(side: const BorderSide(color: momoPink)),
          ),
          if (_opening) ...[
            const SizedBox(height: 16),
            const Center(child: CircularProgressIndicator()),
          ],
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 28),
          Row(
            children: [
              const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Sau khi thanh toán trên trang MoMo, hãy quay lại ứng dụng — đơn hàng sẽ tự cập nhật.',
                  style: TextStyle(color: Colors.grey.shade700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: _checkPaid,
            child: const Text('Tôi đã thanh toán — kiểm tra lại'),
          ),
        ],
      ),
    );
  }
}
