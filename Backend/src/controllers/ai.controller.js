import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import FormData from "form-data";
import db from "../configs/firestore.js";
import { ApiResponse } from "../configs/apiResponse.js";
import { detectImageMime } from "../utils/image-mime.js";

const productsRef = db.collection("products");

// Giới hạn đơn giản cho /api/ai/chat: tối đa CHAT_LIMIT request / phút / IP
const CHAT_LIMIT = 20;
const CHAT_MAX_PROMPT = 30000;
const chatHits = new Map();
function chatRateLimited(ip) {
  const now = Date.now();
  const hits = (chatHits.get(ip) || []).filter((t) => now - t < 60_000);
  hits.push(now);
  chatHits.set(ip, hits);
  return hits.length > CHAT_LIMIT;
}

export const aiController = {
  /**
   * POST /api/ai/chat { prompt } — chuyển tiếp tới Gemini bằng key phía server,
   * để app không phải nhúng GEMINI_API_KEY. Trả nguyên JSON của Gemini (candidates...).
   */
  async chat(req, res) {
    const prompt = req.body?.prompt;
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "prompt is required" });
    }
    if (prompt.length > CHAT_MAX_PROMPT) {
      return res.status(413).json({ success: false, message: "prompt is too long" });
    }
    if (chatRateLimited(req.ip)) {
      return res.status(429).json({ success: false, message: "Quota exceeded: too many requests, try again in a minute" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ success: false, message: "GEMINI_API_KEY is not configured in backend environment" });
    }
    try {
      const model = process.env.GEMINI_CHAT_MODEL || "gemini-3.5-flash-lite";
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
        }
      );
      const body = await r.text();
      return res.status(r.status).type("application/json").send(body);
    } catch (error) {
      console.error("[AI chat]", error);
      return res.status(502).json({ success: false, message: "Gemini request failed" });
    }
  },

  /**
   * POST /api/ai/recognize-food (multipart "image")
   * 1) Nếu đặt AI_SERVICE_URL: gọi AI Service PyTorch (Flask /predict) của dự án.
   * 2) Nếu không có hoặc lỗi: nhận diện bằng Gemini Vision, chỉ chọn trong các món của menu.
   */
  async recognizeFood(req, res) {
    try {
      if (!req.file) throw new Error("No image file uploaded");
      const mime = detectImageMime(req.file.buffer, req.file.mimetype, req.file.originalname);

      const [prodSnap, catSnap] = await Promise.all([productsRef.get(), db.collection("categories").get()]);
      const allProducts = prodSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const allCategories = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const norm = (x) => String(x || "").toLowerCase().normalize("NFC").replace(/\s+/g, "");

      // ---- 1. AI Service riêng (chỉ khi được cấu hình) ----
      const aiUrl = process.env.AI_SERVICE_URL;
      if (aiUrl) {
        try {
          const form = new FormData();
          form.append("image", req.file.buffer, { filename: req.file.originalname || "image.jpg", contentType: mime });
          const r = await axios.post(`${aiUrl.replace(/\/$/, "")}/predict`, form, { headers: form.getHeaders(), timeout: 15000 });
          if (r.data?.success && r.data.class_name) {
            const name = r.data.class_name;
            const cat = allCategories.find((c) => norm(c.name) === norm(name));
            const matchedProducts = cat
              ? allProducts.filter((p) => p.categoryId === cat.id)
              : allProducts.filter((p) => norm(p.name).includes(norm(name)));
            return ApiResponse.success(res, {
              detectedFoodName: `${name} (Độ tin cậy: ${(r.data.confidence * 100).toFixed(0)}%)`,
              matchedProducts,
              engine: "local-ai",
            }, "Food recognized successfully by local AI");
          }
        } catch (e) {
          console.warn("[recognizeFood] AI_SERVICE_URL lỗi, chuyển sang Gemini:", e.message);
        }
      }

      // ---- 2. Gemini Vision ----
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chưa cấu hình AI nhận diện (AI_SERVICE_URL hoặc GEMINI_API_KEY)");
      const menu = allProducts.map((p) => p.name);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_VISION_MODEL || "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json", temperature: 0 },
      });
      const prompt = `Bạn là chuyên gia ẩm thực Việt Nam. Nhìn ảnh và cho biết món ăn trong ảnh.
Chọn tối đa 3 món PHÙ HỢP NHẤT trong thực đơn sau (ghi đúng tên như danh sách), sắp xếp theo độ tin cậy giảm dần:
${menu.map((n) => "- " + n).join("\n")}
Nếu ảnh không phải món ăn hoặc không khớp món nào, trả về danh sách rỗng.
Trả về JSON: {"dish": "<tên món nhìn thấy, tiếng Việt>", "matches": [{"name": "<tên trong thực đơn>", "confidence": 0-1}]}`;
      const result = await model.generateContent([prompt, { inlineData: { data: req.file.buffer.toString("base64"), mimeType: mime } }]);
      let parsed;
      try {
        parsed = JSON.parse(result.response.text());
      } catch {
        throw new Error("AI trả về kết quả không đọc được, vui lòng thử ảnh khác");
      }
      const matches = (parsed.matches || []).filter((m) => menu.includes(m.name)).slice(0, 3);
      const matchedProducts = matches.map((m) => allProducts.find((p) => p.name === m.name)).filter(Boolean);
      const top = matches[0];
      return ApiResponse.success(res, {
        detectedFoodName: top
          ? `${parsed.dish || top.name} (Độ tin cậy: ${Math.round((top.confidence || 0) * 100)}%)`
          : `${parsed.dish || "Không nhận ra món"} — chưa có trong thực đơn`,
        matchedProducts,
        engine: "gemini",
      }, "Food recognized successfully");
    } catch (error) {
      console.error("[recognizeFood]", error.message);
      return ApiResponse.error(res, error, 400);
    }
  },

  async scanReceipt(req, res) {
    try {
      if (!req.file) {
        throw new Error("No image file uploaded");
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in backend environment");
      }

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Convert buffer to generative part
      const imagePart = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: detectImageMime(req.file.buffer, req.file.mimetype, req.file.originalname)
        }
      };

      const prompt = `Phân tích ảnh chụp biên lai giao hàng hoặc ảnh chụp màn hình lịch sử giao dịch chuyển khoản (như Momo, Ngân hàng, v.v.).
Hãy trích xuất các thông tin sau:
1. "orderId": Mã đơn hàng (nếu tìm thấy trên biên lai/nội dung chuyển khoản, hãy lấy chuỗi đó, nếu không thấy thì trả về null).
2. "amount": Tổng số tiền đã thanh toán (số nguyên, ví dụ: 70000).
3. "paymentStatus": Trạng thái thanh toán ("SUCCESS" nếu giao dịch thành công, "FAILED" nếu thất bại, "PENDING" nếu đang xử lý hoặc chưa rõ).
4. "paymentMethod": Phương thức thanh toán ("MOMO", "BANKING", "COD" hoặc "UNKNOWN").

Trả về kết quả dưới dạng đối tượng JSON sạch có định dạng:
{
  "orderId": string hoặc null,
  "amount": number hoặc null,
  "paymentStatus": string,
  "paymentMethod": string
}
Không viết thêm bất kỳ từ giải tiếp hay giải thích nào khác ngoài chuỗi JSON sạch (không có khối mã markdown \`\`\`json).`;

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text().trim();
      
      let parsedResult;
      try {
        const cleanedText = text.replace(/```json|```/g, "").trim();
        parsedResult = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Gemini raw response:", text);
        throw new Error("AI returned invalid JSON format: " + text);
      }

      return ApiResponse.success(res, parsedResult, "Receipt scanned successfully");

    } catch (error) {
      console.error("AI Error:", error);
      return ApiResponse.error(res, error, 400);
    }
  }
};
