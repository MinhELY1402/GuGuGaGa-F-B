import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:gugugaga/providers/auth_provider.dart';
import 'package:gugugaga/screens/checkout/online_payment_screen.dart';

/// Bản giả của AuthProvider: màn hình chỉ đọc `token`, và AuthProvider thật cần Firebase đã khởi tạo.
class _FakeAuth extends ChangeNotifier implements AuthProvider {
  @override
  String? get token => 't';

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

Widget _app() => ChangeNotifierProvider<AuthProvider>.value(
      value: _FakeAuth(),
      child: const MaterialApp(home: OnlinePaymentScreen(orderId: 'o1', amount: 125000)),
    );

void main() {
  setUp(() => dotenv.testLoad(fileInput: 'BASE_URL=http://localhost:1/api'));

  // Test logic dùng khung cao để mọi thông báo lỗi nằm trong vùng đã dựng của ListView
  Future<void> pumpScreen(WidgetTester tester, {Size size = const Size(360, 1400)}) async {
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(_app());
    await tester.pump();
  }

  // Huỷ màn hình để timer kiểm tra thanh toán được dọn trước khi test kết thúc
  Future<void> dispose(WidgetTester tester) => tester.pumpWidget(const SizedBox());

  Finder field(int i) => find.byType(TextFormField).at(i);
  String value(WidgetTester t, int i) => t.widget<TextFormField>(field(i)).controller!.text;
  Future<void> tapPay(WidgetTester tester) async {
    final btn = find.widgetWithText(FilledButton, 'Thanh toán');
    await tester.ensureVisible(btn);
    await tester.tap(btn);
    await tester.pump();
  }

  testWidgets('hiển thị đủ trên màn hình nhỏ 360x640, không tràn bố cục, có số tiền và cảnh báo thử nghiệm', (tester) async {
    await pumpScreen(tester, size: const Size(360, 640));
    expect(find.text('Thanh toán online'), findsOneWidget);
    expect(find.textContaining('125.000'), findsOneWidget);
    expect(find.textContaining('CỔNG THỬ NGHIỆM'), findsOneWidget);
    expect(find.byType(TextFormField), findsNWidgets(4));
    expect(tester.takeException(), isNull);
    await dispose(tester);
  });

  testWidgets('chuyển sang tab Mã QR không lỗi (API lỗi thì có nút Thử lại)', (tester) async {
    await pumpScreen(tester, size: const Size(360, 640));
    await tester.tap(find.text('Mã QR'));
    await tester.pumpAndSettle(const Duration(milliseconds: 300));
    expect(find.text('Thử lại'), findsOneWidget);
    expect(tester.takeException(), isNull);
    await dispose(tester);
  });

  testWidgets('chọn nhanh thẻ test sẽ điền sẵn form', (tester) async {
    await pumpScreen(tester);
    await tester.tap(find.widgetWithText(ActionChip, 'Visa ••1111'));
    await tester.pump();
    expect(value(tester, 0), '4111 1111 1111 1111');
    expect(value(tester, 1), 'NGUYEN VAN A');
    expect(value(tester, 2), '12/30');
    expect(value(tester, 3), '123');
    await dispose(tester);
  });

  testWidgets('tự định dạng số thẻ và ngày hết hạn', (tester) async {
    await pumpScreen(tester);
    await tester.enterText(field(0), '41111111');
    await tester.enterText(field(2), '1230');
    await tester.pump();
    expect(value(tester, 0), '4111 1111');
    expect(value(tester, 2), '12/30');
    await dispose(tester);
  });

  testWidgets('bỏ trống form: báo lỗi từng ô, không gọi mạng', (tester) async {
    await pumpScreen(tester);
    await tapPay(tester);
    expect(find.text('Nhập đủ 16 số thẻ'), findsOneWidget);
    expect(find.text('Nhập tên chủ thẻ'), findsOneWidget);
    expect(find.text('CVV 3 số'), findsOneWidget);
    await dispose(tester);
  });

  testWidgets('số thẻ KHÔNG thuộc danh sách thẻ test bị chặn ngay trên máy, không bước sang OTP', (tester) async {
    await pumpScreen(tester);
    await tester.enterText(field(0), '4242424242424242');
    await tester.enterText(field(1), 'NGUYEN VAN A');
    await tester.enterText(field(2), '1230');
    await tester.enterText(field(3), '123');
    await tapPay(tester);
    expect(find.textContaining('chỉ nhập thẻ test'), findsOneWidget);
    expect(find.textContaining('Xác thực thẻ'), findsNothing);
    await dispose(tester);
  });

  testWidgets('thẻ hết hạn bị báo lỗi ở ô ngày hết hạn', (tester) async {
    await pumpScreen(tester);
    await tester.tap(find.widgetWithText(ActionChip, 'Mastercard ••4444'));
    await tester.pump();
    await tester.enterText(field(2), '0120');
    await tapPay(tester);
    expect(find.text('Thẻ đã hết hạn'), findsOneWidget);
    await dispose(tester);
  });
}
