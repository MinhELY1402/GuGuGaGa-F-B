import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../payment/payment_success_screen.dart';

/// Thẻ test của cổng mô phỏng (trùng danh sách ở Backend/src/utils/cardsim.js).
/// Số thẻ khác — kể cả thẻ thật — bị chặn ngay trên máy, không gửi đi đâu cả.
const _testCards = <String, String>{
  '4111111111111111': 'Visa',
  '5555555555554444': 'Mastercard',
  '4000000000000002': 'Visa (bị từ chối)',
};

/// Thanh toán online NGAY TRONG ỨNG DỤNG: nhập thẻ Visa/Master + OTP, hoặc quét mã QR.
/// Đây là cổng THỬ NGHIỆM/MÔ PHỎNG, không trừ tiền thật.
class OnlinePaymentScreen extends StatefulWidget {
  final String orderId;
  final num amount;

  const OnlinePaymentScreen({super.key, required this.orderId, required this.amount});

  @override
  State<OnlinePaymentScreen> createState() => _OnlinePaymentScreenState();
}

class _OnlinePaymentScreenState extends State<OnlinePaymentScreen> with SingleTickerProviderStateMixin {
  static const _accent = Color(0xFFC62828);

  final _api = ApiService();
  late final TabController _tabs = TabController(length: 2, vsync: this);
  final _formKey = GlobalKey<FormState>();
  final _number = TextEditingController();
  final _name = TextEditingController();
  final _expiry = TextEditingController();
  final _cvv = TextEditingController();
  final _otp = TextEditingController();

  Timer? _timer;
  bool _done = false;
  bool _busy = false;
  String? _error;

  // Thẻ: sau bước 1 có paymentId và chờ OTP
  String? _paymentId;
  String _brand = '';
  String _last4 = '';

  // QR
  Map<String, dynamic>? _qr;
  bool _qrLoading = false;
  String? _qrError;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 4), (_) => _checkPaid());
    _tabs.addListener(() {
      if (_tabs.index == 1 && _qr == null && !_qrLoading) _loadQr();
      setState(() => _error = null);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _tabs.dispose();
    for (final c in [_number, _name, _expiry, _cvv, _otp]) {
      c.dispose();
    }
    super.dispose();
  }

  String? get _token => Provider.of<AuthProvider>(context, listen: false).token;
  String _msg(Object e) => e.toString().replaceFirst('Exception: ', '');

  Future<void> _checkPaid() async {
    final token = _token;
    if (_done || token == null) return;
    try {
      final order = await _api.getOrderDetail(widget.orderId, token);
      if (order['paymentStatus'] == 'PAID') _finish('Thanh toán thành công!');
    } catch (_) {
      // lỗi mạng tạm thời: lần kiểm tra sau sẽ thử lại
    }
  }

  void _finish(String message) {
    if (_done || !mounted) return;
    _done = true;
    _timer?.cancel();
    Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const PaymentSuccessScreen()));
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message), backgroundColor: Colors.green));
  }

  // ---------- Thẻ ----------
  void _fillTestCard(String number) {
    setState(() {
      _number.text = _CardNumberFormatter.format(number);
      _name.text = 'NGUYEN VAN A';
      _expiry.text = '12/30';
      _cvv.text = '123';
      _error = null;
    });
  }

  Future<void> _submitCard() async {
    final token = _token;
    if (token == null || !_formKey.currentState!.validate()) return;
    final digits = _number.text.replaceAll(RegExp(r'\D'), '');
    if (!_testCards.containsKey(digits)) {
      setState(() => _error = 'Đây là cổng thử nghiệm: chỉ nhập thẻ test ở trên, không nhập thẻ thật.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final r = await _api.startCardPayment(
        widget.orderId,
        token,
        number: digits,
        expiry: _expiry.text,
        cvv: _cvv.text,
        name: _name.text.trim(),
      );
      setState(() {
        _paymentId = r['paymentId'] as String;
        _brand = (r['brand'] ?? '') as String;
        _last4 = (r['last4'] ?? '') as String;
        _otp.clear();
      });
    } catch (e) {
      setState(() => _error = _msg(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _confirmOtp() async {
    final token = _token;
    final id = _paymentId;
    if (token == null || id == null) return;
    if (_otp.text.trim().length != 6) {
      setState(() => _error = 'Nhập đủ 6 chữ số OTP');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await _api.confirmCardPayment(widget.orderId, token, id, _otp.text.trim());
      _finish('Thanh toán thẻ thành công!');
    } catch (e) {
      final m = _msg(e);
      setState(() {
        _error = m;
        // phiên đã bị huỷ (quá 3 lần sai / hết hạn): quay về form nhập thẻ
        if (m.contains('quá 3 lần') || m.contains('hết hạn')) _paymentId = null;
      });
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  // ---------- QR ----------
  Future<void> _loadQr() async {
    final token = _token;
    if (token == null) return;
    setState(() {
      _qrLoading = true;
      _qrError = null;
    });
    try {
      final r = await _api.createPaymentQr(widget.orderId, token);
      setState(() => _qr = r);
    } catch (e) {
      setState(() => _qrError = _msg(e));
    } finally {
      if (mounted) setState(() => _qrLoading = false);
    }
  }

  Future<void> _simulateQr() async {
    final token = _token;
    if (token == null) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await _api.simulateQrPaid(widget.orderId, token);
      _finish('Thanh toán QR thành công!');
    } catch (e) {
      setState(() => _error = _msg(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  // ---------- Giao diện ----------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thanh toán online'),
        bottom: TabBar(
          controller: _tabs,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(icon: Icon(Icons.credit_card), text: 'Thẻ Visa / Master'),
            Tab(icon: Icon(Icons.qr_code_2), text: 'Mã QR'),
          ],
        ),
      ),
      body: TabBarView(controller: _tabs, children: [_cardTab(), _qrTab()]),
    );
  }

  Widget _header() {
    final money = NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(widget.amount);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Số tiền cần thanh toán', style: TextStyle(color: Colors.grey.shade700)),
        const SizedBox(height: 2),
        Text(money, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: _accent)),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: Colors.amber.shade50, borderRadius: BorderRadius.circular(12)),
          child: const Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.science_outlined, size: 20),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'CỔNG THỬ NGHIỆM (MÔ PHỎNG): không trừ tiền thật. Chỉ dùng thẻ test bên dưới, '
                  'tuyệt đối không nhập thẻ ngân hàng thật.',
                  style: TextStyle(fontSize: 13),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _errorBox() => _error == null
      ? const SizedBox.shrink()
      : Padding(
          padding: const EdgeInsets.only(top: 12),
          child: Text(_error!, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w600)),
        );

  Widget _cardTab() {
    return ListView(
      padding: EdgeInsets.fromLTRB(20, 20, 20, 24 + MediaQuery.of(context).viewInsets.bottom),
      children: [_header(), if (_paymentId == null) _cardForm() else _otpStep()],
    );
  }

  Widget _cardForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Chọn nhanh thẻ test', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: [
              for (final e in _testCards.entries)
                ActionChip(
                  avatar: const Icon(Icons.credit_card, size: 18),
                  label: Text('${e.value} ••${e.key.substring(12)}'),
                  onPressed: () => _fillTestCard(e.key),
                ),
            ],
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _number,
            keyboardType: TextInputType.number,
            inputFormatters: [_CardNumberFormatter()],
            decoration: const InputDecoration(
              labelText: 'Số thẻ',
              hintText: '4111 1111 1111 1111',
              prefixIcon: Icon(Icons.credit_card),
              border: OutlineInputBorder(),
            ),
            validator: (v) => (v ?? '').replaceAll(RegExp(r'\D'), '').length == 16 ? null : 'Nhập đủ 16 số thẻ',
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _name,
            textCapitalization: TextCapitalization.characters,
            decoration: const InputDecoration(
              labelText: 'Tên chủ thẻ',
              prefixIcon: Icon(Icons.person_outline),
              border: OutlineInputBorder(),
            ),
            validator: (v) => (v ?? '').trim().isEmpty ? 'Nhập tên chủ thẻ' : null,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _expiry,
                  keyboardType: TextInputType.number,
                  inputFormatters: [_ExpiryFormatter()],
                  decoration: const InputDecoration(labelText: 'Hết hạn (MM/YY)', hintText: '12/30', border: OutlineInputBorder()),
                  validator: _validateExpiry,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                  controller: _cvv,
                  keyboardType: TextInputType.number,
                  obscureText: true,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(3)],
                  decoration: const InputDecoration(labelText: 'CVV', hintText: '123', border: OutlineInputBorder()),
                  validator: (v) => (v ?? '').length == 3 ? null : 'CVV 3 số',
                ),
              ),
            ],
          ),
          _errorBox(),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _busy ? null : _submitCard,
            style: FilledButton.styleFrom(backgroundColor: _accent, padding: const EdgeInsets.symmetric(vertical: 16)),
            child: _busy
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Text('Thanh toán', style: TextStyle(fontSize: 16)),
          ),
        ],
      ),
    );
  }

  static String? _validateExpiry(String? v) {
    final m = RegExp(r'^(\d{2})/(\d{2})$').firstMatch(v ?? '');
    if (m == null) return 'MM/YY';
    final month = int.parse(m.group(1)!);
    final year = 2000 + int.parse(m.group(2)!);
    if (month < 1 || month > 12) return 'Tháng không hợp lệ';
    return DateTime(year, month + 1, 1).isAfter(DateTime.now()) ? null : 'Thẻ đã hết hạn';
  }

  Widget _otpStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.verified_user_outlined, color: _accent),
            const SizedBox(width: 8),
            Expanded(
              child: Text('Xác thực thẻ $_brand •••• $_last4', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        const Text('Nhập mã OTP gồm 6 chữ số để hoàn tất thanh toán.'),
        const SizedBox(height: 4),
        Text('Mã OTP thử nghiệm: 123456', style: TextStyle(color: Colors.grey.shade700, fontStyle: FontStyle.italic)),
        const SizedBox(height: 16),
        TextField(
          controller: _otp,
          keyboardType: TextInputType.number,
          autofocus: true,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 28, letterSpacing: 8),
          inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(6)],
          decoration: const InputDecoration(border: OutlineInputBorder(), counterText: ''),
        ),
        _errorBox(),
        const SizedBox(height: 20),
        FilledButton(
          onPressed: _busy ? null : _confirmOtp,
          style: FilledButton.styleFrom(backgroundColor: _accent, padding: const EdgeInsets.symmetric(vertical: 16)),
          child: _busy
              ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : const Text('Xác nhận', style: TextStyle(fontSize: 16)),
        ),
        TextButton(
          onPressed: _busy ? null : () => setState(() {
            _paymentId = null;
            _error = null;
          }),
          child: const Text('Đổi thẻ khác'),
        ),
      ],
    );
  }

  Widget _qrTab() {
    final qr = _qr;
    final source = qr?['source'];
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _header(),
        if (_qrLoading)
          const Padding(padding: EdgeInsets.all(40), child: Center(child: CircularProgressIndicator()))
        else if (_qrError != null)
          Column(
            children: [
              Text(_qrError!, style: const TextStyle(color: Colors.red)),
              const SizedBox(height: 8),
              OutlinedButton(onPressed: _loadQr, child: const Text('Thử lại')),
            ],
          )
        else if (qr == null)
          Center(child: OutlinedButton.icon(onPressed: _loadQr, icon: const Icon(Icons.qr_code_2), label: const Text('Tạo mã QR')))
        else ...[
          Center(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: QrImageView(data: qr['qrContent'] as String, size: 240, backgroundColor: Colors.white),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            source == 'momo'
                ? 'Quét mã bằng ứng dụng MoMo (bản test của MoMo). Đơn sẽ tự cập nhật khi thanh toán xong.'
                : 'Mã QR mô phỏng: dùng nút bên dưới để giả lập khách đã quét và thanh toán.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey.shade700),
          ),
          if (qr['simulator'] == true) ...[
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: _busy ? null : _simulateQr,
              icon: const Icon(Icons.phone_android),
              label: const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Text('Mô phỏng: khách đã quét và thanh toán', style: TextStyle(fontSize: 15)),
              ),
              style: FilledButton.styleFrom(backgroundColor: _accent),
            ),
          ],
          _errorBox(),
          TextButton(onPressed: _loadQr, child: const Text('Tạo lại mã QR')),
        ],
      ],
    );
  }
}

/// Số thẻ: chỉ chữ số, tối đa 16, nhóm 4 số cách nhau một dấu cách.
class _CardNumberFormatter extends TextInputFormatter {
  static String format(String input) {
    final d = input.replaceAll(RegExp(r'\D'), '');
    final s = d.length > 16 ? d.substring(0, 16) : d;
    final b = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && i % 4 == 0) b.write(' ');
      b.write(s[i]);
    }
    return b.toString();
  }

  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final t = format(newValue.text);
    return TextEditingValue(text: t, selection: TextSelection.collapsed(offset: t.length));
  }
}

/// Ngày hết hạn: tự thêm dấu "/" sau 2 số đầu (MM/YY).
class _ExpiryFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final d = newValue.text.replaceAll(RegExp(r'\D'), '');
    final s = d.length > 4 ? d.substring(0, 4) : d;
    final t = s.length > 2 ? '${s.substring(0, 2)}/${s.substring(2)}' : s;
    return TextEditingValue(text: t, selection: TextSelection.collapsed(offset: t.length));
  }
}
