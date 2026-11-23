import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:gugugaga/screens/account/help_screen.dart';

void main() {
  testWidgets('Trợ giúp hiển thị câu hỏi và mở được câu trả lời', (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(const MaterialApp(home: HelpScreen()));
    expect(find.text('Trợ giúp'), findsOneWidget);
    expect(find.text('Làm sao để đặt món?'), findsOneWidget);

    await tester.tap(find.text('Thanh toán bằng thẻ có trừ tiền thật không?'));
    await tester.pumpAndSettle();
    expect(find.textContaining('mô phỏng'), findsWidgets);
    expect(tester.takeException(), isNull);
  });
}
