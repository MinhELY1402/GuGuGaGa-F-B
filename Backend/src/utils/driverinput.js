/**
 * Kiểm tra dữ liệu khi admin tạo/sửa tài xế. Trả về chuỗi lỗi (tiếng Việt) hoặc null nếu hợp lệ.
 * mode "create": bắt buộc đủ tên, SĐT, mật khẩu, chi nhánh. mode "update": chỉ kiểm tra trường được gửi lên.
 */
export const PHONE_RE = /^0\d{9,10}$/;
export const MIN_PASSWORD = 6;

export function validateDriverInput(data = {}, mode = "create") {
  const has = (k) => data[k] !== undefined;
  const create = mode === "create";

  if (create || has("name")) {
    if (!String(data.name ?? "").trim()) return "Vui lòng nhập tên tài xế";
  }
  if (create || has("phone")) {
    if (!String(data.phone ?? "").trim()) return "Vui lòng nhập số điện thoại";
    if (!PHONE_RE.test(String(data.phone).trim())) return "Số điện thoại không hợp lệ (bắt đầu bằng 0, gồm 10 hoặc 11 chữ số)";
  }
  if (create || (has("password") && data.password !== "")) {
    if (!String(data.password ?? "")) return "Vui lòng nhập mật khẩu";
    if (String(data.password).length < MIN_PASSWORD) return `Mật khẩu tối thiểu ${MIN_PASSWORD} ký tự`;
  }
  if (create || has("branchId")) {
    if (!String(data.branchId ?? "").trim()) return "Vui lòng chọn chi nhánh";
  }
  return null;
}
