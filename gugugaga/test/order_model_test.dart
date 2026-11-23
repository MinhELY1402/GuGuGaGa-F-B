import 'package:flutter_test/flutter_test.dart';
import 'package:gugugaga/models/order.dart';

Map<String, dynamic> _json({String status = 'PENDING', String method = 'MOMO', String? paid}) => {
      'id': 'o1',
      'userId': 'u1',
      'branchId': 'b1',
      'totalAmount': 25000,
      'status': status,
      'paymentMethod': method,
      'paymentStatus': paid,
      'deliveryAddress': 'x',
      'deliveryPhone': '0',
      'createdAt': '2026-11-22T00:00:00.000Z',
      'updatedAt': '2026-11-22T00:00:00.000Z',
      'orderItem': [],
    };

void main() {
  orderCancelTests();
  test('đơn online chờ xác nhận, chưa trả tiền: cần thanh toán', () {
    expect(Order.fromJson(_json()).needsPayment, isTrue);
    expect(Order.fromJson(_json(method: 'BANKING')).needsPayment, isTrue);
  });
  test('đơn đã trả, đơn COD, đơn đã được xác nhận: không cần thanh toán', () {
    expect(Order.fromJson(_json(paid: 'PAID')).needsPayment, isFalse);
    expect(Order.fromJson(_json(method: 'COD')).needsPayment, isFalse);
    expect(Order.fromJson(_json(status: 'ACCEPTED')).needsPayment, isFalse);
  });
}

void orderCancelTests() {
  test('chỉ hủy được đơn đang chờ xác nhận', () {
    expect(Order.fromJson(_json()).canCancel, isTrue);
    expect(Order.fromJson(_json(method: 'COD')).canCancel, isTrue);
    expect(Order.fromJson(_json(status: 'ACCEPTED')).canCancel, isFalse);
    expect(Order.fromJson(_json(status: 'DELIVERED')).canCancel, isFalse);
  });
}
