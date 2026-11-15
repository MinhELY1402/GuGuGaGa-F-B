/**
 * Xác định MIME type thật của ảnh upload.
 * App Flutter gửi multipart không kèm Content-Type → multer báo "application/octet-stream",
 * Gemini sẽ từ chối. Nhận dạng theo chữ ký (magic bytes), sau đó theo đuôi file.
 */
const EXT = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", heic: "image/heic", heif: "image/heif", gif: "image/gif" };

export function detectImageMime(buffer, declared = "", filename = "") {
  if (declared && declared.startsWith("image/")) return declared;
  const b = buffer || Buffer.alloc(0);
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b.length >= 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (b.length >= 6 && b.toString("ascii", 0, 3) === "GIF") return "image/gif";
  if (b.length >= 12 && b.toString("ascii", 4, 8) === "ftyp") {
    const brand = b.toString("ascii", 8, 12);
    if (["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1"].includes(brand)) return brand === "mif1" || brand === "msf1" ? "image/heif" : "image/heic";
  }
  const ext = String(filename).split(".").pop().toLowerCase();
  return EXT[ext] || "image/jpeg";
}
