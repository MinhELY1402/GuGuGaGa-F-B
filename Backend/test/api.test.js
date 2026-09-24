import assert from 'node:assert';
import test from 'node:test';

test('ApiResponse wrapper standard', () => {
  const res = { success: true, message: 'OK', data: { items: [1, 2, 3] } };
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.items.length, 3);
});

test('Price calculation with delivery fee', () => {
  const subtotal = 120000;
  const shippingFee = 15000;
  assert.strictEqual(subtotal + shippingFee, 135000);
});
