import assert from "node:assert/strict";
import { test } from "node:test";
import { detectImageMime } from "../src/utils/image-mime.js";

test("giữ nguyên MIME khi app đã khai báo image/*", () => {
  assert.equal(detectImageMime(Buffer.from([0]), "image/png", "a.bin"), "image/png");
});

test("octet-stream → nhận dạng JPEG/PNG/WEBP theo magic bytes", () => {
  assert.equal(detectImageMime(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), "application/octet-stream"), "image/jpeg");
  assert.equal(detectImageMime(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "application/octet-stream"), "image/png");
  assert.equal(detectImageMime(Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBP")]), "application/octet-stream"), "image/webp");
  assert.equal(detectImageMime(Buffer.concat([Buffer.alloc(4), Buffer.from("ftypheic")]), ""), "image/heic");
});

test("không nhận ra chữ ký → theo đuôi file, mặc định image/jpeg", () => {
  assert.equal(detectImageMime(Buffer.from("xxxx"), "application/octet-stream", "photo.PNG"), "image/png");
  assert.equal(detectImageMime(Buffer.from("xxxx"), "application/octet-stream", "blob"), "image/jpeg");
});
