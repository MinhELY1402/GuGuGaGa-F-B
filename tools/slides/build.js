// Slide bảo vệ đồ án QTDA — GuGuGaGa. Chạy: node build.js <output.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const md = require("react-icons/md");
// applyTheme ghi màu theme vào file (nếu có skill PPTX); không có thì PowerPoint dùng bảng màu mặc định
let applyTheme = async () => console.warn("PPTX_SKILL_DIR chưa đặt: bỏ qua bước áp màu theme");
try { if (process.env.PPTX_SKILL_DIR) ({ applyTheme } = require(process.env.PPTX_SKILL_DIR + "/scripts/apply_theme.js")); } catch (e) { console.warn(e.message); }

const OUT = process.argv[2] || "deck.pptx";
const THEME = {
  name: "GuGuGaGa Chili",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1F1A17", lt1: "FFFFFF", dk2: "3A1512", lt2: "FBF1EC",
    accent1: "C62828", accent2: "EF6C00", accent3: "2E7D32", accent4: "6D4C41", accent5: "F9A825", accent6: "546E7A",
    hlink: "C62828", folHlink: "6D4C41",
  },
};
const HEX = THEME.colors;

// ---------- icons ----------
async function icon(Comp, color = "FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.title = "GuGuGaGa — Bảo vệ đồ án Quản trị Dự án Phần mềm";
  pres.author = "Nhóm GuGuGaGa";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const W = 13.333, H = 7.5;

  // ---------- layouts ----------
  pres.defineSlideMaster({
    title: "DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.1, w: 11.7, h: 1.6, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left" }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 3.85, w: 11.7, h: 1.0, fontSize: 20, color: "F3C9B8", valign: "top", align: "left" }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    margin: [0.5, 0.6, 0.6, 0.6],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 12.1, h: 0.8, fontSize: 28, bold: true, color: C.text2, valign: "middle", align: "left" }, text: "" } },
      { text: { text: "GuGuGaGa · Quản trị Dự án Phần mềm · VKU", options: { x: 0.6, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.accent6 } } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
  });

  const I = {
    team: await icon(md.MdGroups), problem: await icon(md.MdReportProblem), idea: await icon(md.MdLightbulb),
    phone: await icon(md.MdPhoneAndroid), moto: await icon(md.MdDeliveryDining), web: await icon(md.MdDashboard),
    api: await icon(md.MdDns), ai: await icon(md.MdPsychology), db: await icon(md.MdStorage),
    route: await icon(md.MdTimeline), warn: await icon(md.MdWarning), swap: await icon(md.MdSyncAlt),
    chart: await icon(md.MdShowChart), bug: await icon(md.MdBugReport), check: await icon(md.MdVerified),
    rocket: await icon(md.MdRocketLaunch), lock: await icon(md.MdLock), save: await icon(md.MdSave),
    gavel: await icon(md.MdGavel), play: await icon(md.MdPlayCircle), assign: await icon(md.MdAssignment),
  };
  // Icon trong vòng tròn đỏ — họa tiết lặp lại của cả bộ slide
  const badge = (s, ic, x, y, d = 0.62, fill = C.accent1) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: "icon circle" });
    s.addImage({ data: ic, x: x + d * 0.2, y: y + d * 0.2, w: d * 0.6, h: d * 0.6, altText: "" });
  };
  const card = (s, x, y, w, h, fill = C.background2) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { type: "none" }, objectName: "card" });
  const txt = (s, text, o) => s.addText(text, { isTextBox: true, fontSize: 16, color: C.text1, valign: "top", margin: 0, ...o });

  // ===== 1. Title =====
  pres.addSection({ title: "Mở đầu" });
  let s = pres.addSlide({ masterName: "DARK", sectionTitle: "Mở đầu" });
  s.addText("GuGuGaGa — Hệ sinh thái đặt món ăn tích hợp AI", { placeholder: "title" });
  s.addText("Đồ án Quản trị Dự án Phần mềm · Pathway 1 (kế thừa Đồ án chuyên ngành 1) · GVHD: TS. Nguyễn Thanh Tuấn", { placeholder: "body" });
  badge(s, I.team, 0.8, 5.35, 0.6, C.accent2);
  txt(s, [
    { text: "Võ Nhật Huy (23IT.EB047) · Trần Phan Minh Tiến (23IT.EB108)", options: { breakLine: true } },
    { text: "Nguyễn Bảo Quang Minh (23IT.EB057) · Nguyễn Gia Bảo (23IT.EB007)" },
  ], { x: 1.6, y: 5.35, w: 10.5, h: 0.8, fontSize: 16, color: C.background1, valign: "middle" });
  s.addNotes("Giới thiệu đề tài và nhóm. Nhấn mạnh: sản phẩm kế thừa từ ĐACN1 (Pathway 1), đồ án này áp dụng khung quản trị dự án lên sản phẩm đó.");

  // ===== 2. Problem & solution =====
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Mở đầu" });
  s.addText("Quán ăn mất 20–30% phí sàn, đối soát tiền bằng tay", { placeholder: "title" });
  card(s, 0.6, 1.5, 5.9, 4.4);
  badge(s, I.problem, 0.9, 1.8);
  txt(s, "Vấn đề", { x: 1.7, y: 1.85, w: 4.5, h: 0.5, fontSize: 22, bold: true, color: C.accent1 });
  txt(s, [
    { text: "Phí sàn giao đồ ăn 20–30% doanh thu", options: { bullet: true, breakLine: true } },
    { text: "Giờ cao điểm phải dò sao kê để xác nhận chuyển khoản", options: { bullet: true, breakLine: true } },
    { text: "Khách khó tìm lại món Việt chỉ có trong ảnh chụp", options: { bullet: true } },
  ], { x: 0.9, y: 2.7, w: 5.3, h: 3.0, fontSize: 20, paraSpaceAfter: 14 });
  card(s, 6.85, 1.5, 5.9, 4.4);
  badge(s, I.idea, 7.15, 1.8, 0.62, C.accent3);
  txt(s, "Giải pháp GuGuGaGa", { x: 7.95, y: 1.85, w: 4.6, h: 0.5, fontSize: 22, bold: true, color: C.accent3 });
  txt(s, [
    { text: "Kênh bán hàng riêng: app khách, app tài xế, web quản trị", options: { bullet: true, breakLine: true } },
    { text: "VietQR động + webhook Casso tự đối soát, có polling dự phòng (CR-01)", options: { bullet: true, breakLine: true } },
    { text: "Chatbot Gemini tư vấn theo thực đơn thật; nhận diện 30 món bằng ảnh", options: { bullet: true } },
  ], { x: 7.15, y: 2.7, w: 5.3, h: 3.0, fontSize: 20, paraSpaceAfter: 14 });
  s.addNotes("Bối cảnh nghiệp vụ. Lưu ý: nhận diện món bằng camera đã có trong code nhưng chưa host AI Service ở bản beta.");

  // ===== 3. Architecture =====
  pres.addSection({ title: "Phạm vi & kế hoạch" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Phạm vi & kế hoạch" });
  s.addText("5 phân hệ liên thông qua một REST API", { placeholder: "title" });
  const clients = [[I.phone, "App Khách hàng", "Flutter"], [I.moto, "App Tài xế", "Flutter"], [I.web, "Web Quản trị", "React + Vite"]];
  clients.forEach(([ic, a, b], i) => {
    const y = 1.6 + i * 1.75;
    card(s, 0.6, y, 3.6, 1.45);
    badge(s, ic, 0.85, y + 0.4);
    txt(s, a, { x: 1.65, y: y + 0.3, w: 2.45, h: 0.45, fontSize: 18, bold: true });
    txt(s, b, { x: 1.65, y: y + 0.8, w: 2.45, h: 0.4, fontSize: 14, color: C.accent6 });
    s.addShape(pres.shapes.LINE, { x: 4.25, y: y + 0.72, w: 1.25, h: 3.98 - (y + 0.72), line: { color: C.accent6, width: 1.5, endArrowType: "triangle" }, objectName: "arrow" });
  });
  card(s, 5.55, 3.25, 2.6, 1.45, C.accent1);
  txt(s, "Backend API", { x: 5.75, y: 3.4, w: 2.2, h: 0.5, fontSize: 20, bold: true, color: C.background1, align: "center" });
  txt(s, "Node.js · Express · JWT", { x: 5.75, y: 3.95, w: 2.2, h: 0.5, fontSize: 14, color: C.background1, align: "center" });
  const svcs = [[I.db, "Firestore", "dữ liệu"], [I.ai, "AI Service", "PyTorch MobileNetV2"], [I.api, "Dịch vụ ngoài", "Casso · Gemini · Mapbox · Cloudinary"]];
  svcs.forEach(([ic, a, b], i) => {
    const y = 1.6 + i * 1.75;
    s.addShape(pres.shapes.LINE, { x: 8.2, y: 3.98, w: 0.95, h: y + 0.72 - 3.98, line: { color: C.accent6, width: 1.5, endArrowType: "triangle" }, objectName: "arrow" });
    card(s, 9.2, y, 3.55, 1.45);
    badge(s, ic, 9.45, y + 0.4, 0.62, C.accent2);
    txt(s, a, { x: 10.25, y: y + 0.3, w: 2.35, h: 0.45, fontSize: 18, bold: true });
    txt(s, b, { x: 10.25, y: y + 0.8, w: 2.4, h: 0.55, fontSize: 13, color: C.accent6 });
  });
  s.addNotes("Kiến trúc: hai app Flutter và web React gọi chung một backend Express; backend dùng Firestore, AI Service và các dịch vụ ngoài.");

  // ===== 4. WBS & MoSCoW =====
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Phạm vi & kế hoạch" });
  s.addText("WBS 27 gói việc, Must-have chiếm 62% công sức", { placeholder: "title" });
  [["27", "gói việc lá"], ["1.480", "giờ công"], ["62,2%", "công sức Must (MVP)"]].forEach(([n, l], i) => {
    const y = 1.6 + i * 1.7;
    txt(s, n, { x: 0.6, y, w: 4.2, h: 0.95, fontSize: 54, bold: true, color: C.accent1, fontFace: "Cambria" });
    txt(s, l, { x: 0.6, y: y + 0.95, w: 4.2, h: 0.45, fontSize: 16, color: C.accent6 });
  });
  s.addChart(pres.charts.BAR, [{ name: "Giờ công", labels: ["Must", "Should", "Could", "Won't"], values: [920, 260, 300, 0] }], {
    x: 5.2, y: 1.5, w: 7.5, h: 5.2, barDir: "bar", chartColors: [HEX.accent1, HEX.accent2, HEX.accent5, HEX.accent6],
    varyColors: true, showValue: true, dataLabelPosition: "outEnd", dataLabelColor: HEX.dk1, dataLabelFontSize: 14, dataLabelFontFace: "+mn-lt",
    showTitle: true, title: "Phân bổ giờ công theo MoSCoW", titleFontSize: 16, titleColor: HEX.dk2, titleFontFace: "+mn-lt",
    catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 14, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false,
  });
  s.addNotes("100% rule: 27 gói lá, 1.480 giờ. Must 17 gói/920 giờ (62,2%), sát mức ~60% yêu cầu MVP. Gói 1.6.4 Gemini chatbot xếp Could.");

  // ===== 5. Critical path =====
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Phạm vi & kế hoạch" });
  s.addText("Đường găng thật 75 ngày, điều chỉnh còn 60 ngày", { placeholder: "title" });
  const chain = (labels, y, crit, color) => labels.forEach((l, i) => {
    const x = 0.6 + i * 1.35;
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.85, h: 0.85, fill: { color: crit.includes(l) ? color : C.background2 }, line: { type: "none" }, objectName: "node " + l });
    txt(s, l, { x, y, w: 0.85, h: 0.85, fontSize: 20, bold: true, align: "center", valign: "middle", color: crit.includes(l) ? C.background1 : C.text1 });
    if (i < labels.length - 1) s.addShape(pres.shapes.LINE, { x: x + 0.88, y: y + 0.425, w: 0.44, h: 0, line: { color: C.accent6, width: 1.5, endArrowType: "triangle" }, objectName: "arrow" });
  });
  txt(s, "Kế hoạch gốc (bản cũ bỏ sót C, ghi 67,5 ngày)", { x: 0.6, y: 1.5, w: 8, h: 0.4, fontSize: 16, bold: true, color: C.accent6 });
  chain(["A", "B", "C", "D", "E", "G", "I", "L", "M"], 2.0, ["A", "B", "C", "D", "E", "G", "I", "L", "M"], C.accent1);
  txt(s, "Sau điều chỉnh: C song song B · G không chờ E · kiểm thử liên tục · thêm N", { x: 0.6, y: 3.3, w: 12, h: 0.4, fontSize: 16, bold: true, color: C.accent6 });
  chain(["A", "B", "C", "F", "G", "I", "L", "M"], 3.8, ["A", "B", "C", "F", "G", "I", "L", "M"], C.accent3);
  [["75 ngày", "kế hoạch gốc · P(≤ 60 ngày) ≈ 0%", C.accent1], ["60 ngày", "sau điều chỉnh · P ≈ 50%", C.accent3], ["σ ≈ 2,8", "ngày (PERT 3 điểm)", C.accent6]].forEach(([n, l, col], i) => {
    const x = 0.6 + i * 4.15;
    card(s, x, 5.15, 3.85, 1.55);
    txt(s, n, { x: x + 0.3, y: 5.25, w: 3.4, h: 0.8, fontSize: 36, bold: true, color: col, fontFace: "Cambria" });
    txt(s, l, { x: x + 0.3, y: 6.05, w: 3.4, h: 0.5, fontSize: 14, color: C.text1 });
  });
  s.addNotes("Phát hiện khi làm báo cáo: D phụ thuộc cả B và C, nên C nằm trên đường găng. Tổng 75 ngày, không thể xong trong 12 tuần. Điều chỉnh mạng đưa về 60 ngày, xác suất ~50%, giữ vài ngày dự phòng trước ngày bảo vệ.");

  // ===== 6. Risk & CR-01 =====
  pres.addSection({ title: "Kiểm soát" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Kiểm soát" });
  s.addText("Rủi ro lớn nhất xử lý bằng thay đổi phạm vi CR-01", { placeholder: "title" });
  s.addTable([
    [{ text: "Mã", options: { bold: true, color: C.background1, fill: { color: C.accent1 } } }, { text: "Rủi ro", options: { bold: true, color: C.background1, fill: { color: C.accent1 } } }, { text: "P×I", options: { bold: true, color: C.background1, fill: { color: C.accent1 }, align: "center" } }],
    ["R02", "Hai tài xế cùng nhận một đơn", { text: "16", options: { align: "center" } }],
    ["R07", "Đường găng vượt hạn 12 tuần", { text: "16", options: { align: "center" } }],
    ["R01", "Webhook Casso trễ hoặc mất", { text: "15", options: { align: "center" } }],
    ["R06", "Lộ secret — đã xảy ra (key Gemini)", { text: "10", options: { align: "center" } }],
    ["R11", "Server demo trên máy cá nhân", { text: "9", options: { align: "center" } }],
  ], { x: 0.6, y: 1.55, w: 6.2, colW: [0.8, 4.4, 1.0], fontSize: 15, fontFace: "+mn-lt", color: C.text1, border: { type: "solid", pt: 0.75, color: "D9C8C0" }, rowH: 0.62, valign: "middle" });
  card(s, 7.2, 1.55, 5.55, 3.72);
  badge(s, I.swap, 7.5, 1.85, 0.62, C.accent2);
  txt(s, "CR-01 · Polling thanh toán", { x: 8.3, y: 1.9, w: 4.3, h: 0.5, fontSize: 20, bold: true, color: C.accent2 });
  txt(s, [
    { text: "Sự cố: webhook Casso trễ 30–60 giây, khách tưởng mất tiền", options: { bullet: true, breakLine: true } },
    { text: "CCB duyệt: thêm /check-payment, app tự hỏi mỗi 4–5 giây, nút \"Tôi đã chuyển khoản\"", options: { bullet: true, breakLine: true } },
    { text: "Webhook thêm Secure-Token và chống xử lý trùng (có test tự động)", options: { bullet: true, breakLine: true } },
    { text: "Số đo trước/sau: đang thu thập (issue #35)", options: { bullet: true, italic: true, color: C.accent6 } },
  ], { x: 7.5, y: 2.65, w: 4.95, h: 2.5, fontSize: 16, paraSpaceAfter: 8 });
  s.addNotes("Bảng rủi ro theo điểm P×I. CR-01 là thay đổi phạm vi đi đúng quy trình: đề xuất, đánh giá tác động, CCB duyệt, thực thi.");

  // ===== 7. EVM =====
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Kiểm soát" });
  s.addText("EVM tuần 6 (giả định): chậm tiến độ, vượt chi phí", { placeholder: "title" });
  s.addChart(pres.charts.LINE, [
    { name: "SPI", labels: ["T1", "T2", "T3", "T4", "T5", "T6"], values: [1.0, 0.99, 0.97, 0.95, 0.92, 0.902] },
    { name: "CPI", labels: ["T1", "T2", "T3", "T4", "T5", "T6"], values: [1.0, 0.98, 0.96, 0.94, 0.92, 0.909] },
  ], {
    x: 0.6, y: 1.5, w: 7.4, h: 5.2, chartColors: [HEX.accent2, HEX.accent1], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 8,
    valAxisMinVal: 0.8, valAxisMaxVal: 1.05, valAxisMajorUnit: 0.05, valAxisLabelFormatCode: "0.00",
    catAxisLabelColor: HEX.dk1, valAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 14, valAxisLabelFontSize: 12,
    catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: "E6D8D2", size: 0.75 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 14, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    showTitle: true, title: "SPI và CPI theo tuần (giả định)", titleFontSize: 16, titleColor: HEX.dk2, titleFontFace: "+mn-lt",
  });
  [["0,90", "SPI · chậm 10% so với kế hoạch"], ["0,91", "CPI · 1.000đ chỉ tạo 909đ giá trị"], ["162,8 tr", "IEAC so với BAC 148 tr"], ["13,3 tuần", "ISAC so với 12 tuần kế hoạch"]].forEach(([n, l], i) => {
    const y = 1.5 + i * 1.32;
    card(s, 8.35, y, 4.4, 1.15);
    txt(s, n, { x: 8.6, y: y + 0.08, w: 4.0, h: 0.6, fontSize: 28, bold: true, color: C.accent1, fontFace: "Cambria" });
    txt(s, l, { x: 8.6, y: y + 0.68, w: 4.0, h: 0.4, fontSize: 14 });
  });
  s.addNotes("Nhóm không ghi giờ công thực tế trong tuần 1–6, nên EV và AC là kịch bản giả định để minh hoạ phân tích; PV lấy từ baseline thật. Hành động: dồn người từ K (15 ngày float) sang G và E, áp dụng CR-01 sớm, cắt phạm vi Could nếu SPI < 0,95.");

  // ===== 8. Beta =====
  pres.addSection({ title: "Kết quả" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Kết quả" });
  s.addText("Thử trên điện thoại thật: 10 lỗi CI không bắt được", { placeholder: "title" });
  [["22/22", "test backend tự động pass", C.accent3], ["10", "lỗi tìm thấy khi cài APK", C.accent1], ["2 APK", "v1.1.0-beta trên GitHub Releases", C.accent2]].forEach(([n, l, col], i) => {
    const x = 0.6 + i * 4.15;
    card(s, x, 1.5, 3.85, 1.6);
    txt(s, n, { x: x + 0.3, y: 1.6, w: 3.4, h: 0.85, fontSize: 40, bold: true, color: col, fontFace: "Cambria" });
    txt(s, l, { x: x + 0.3, y: 2.45, w: 3.4, h: 0.5, fontSize: 15 });
  });
  const bugs = [
    [I.bug, "App khách không mở được", "thiếu MainActivity trong repo"],
    [I.route, "Bản đồ xám, địa chỉ tải mãi", "thiếu key → dự phòng Mapbox → OSM → toạ độ"],
    [I.lock, "Key Gemini ghi cứng trong code public", "chatbot chuyển qua backend /api/ai/chat"],
    [I.check, "Đăng nhập Google chỉ chạy trên web", "google_sign_in native + SHA-1 trên Firebase"],
    [I.save, "Mất 1 giờ dữ liệu demo khi tắt server", "script lưu trước khi tắt, mỗi 10 phút"],
    [I.chart, "Ảnh món null, \"Quán gần bạn\" là dữ liệu bịa", "ghép ảnh Cloudinary, chi nhánh thật"],
  ];
  bugs.forEach(([ic, a, b], i) => {
    const x = 0.6 + (i % 2) * 6.2, y = 3.4 + Math.floor(i / 2) * 1.12;
    badge(s, ic, x, y + 0.1, 0.55);
    txt(s, a, { x: x + 0.75, y: y + 0.02, w: 5.3, h: 0.42, fontSize: 16, bold: true });
    txt(s, b, { x: x + 0.75, y: y + 0.46, w: 5.3, h: 0.42, fontSize: 14, color: C.accent6 });
  });
  s.addNotes("Bản beta 15/11: CI xanh nhưng app khách hàng không khởi động được. Toàn bộ 10 lỗi đã sửa và phát hành lại cùng ngày. Hai sự cố thật: lộ key (R06) và mất dữ liệu demo (R11).");

  // ===== 9. UAT =====
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Kết quả" });
  s.addText("UAT: 7 kịch bản sẵn sàng trên bản beta", { placeholder: "title" });
  const uat = ["Chụp ảnh món → AI gợi ý", "Chatbot tư vấn theo ngân sách", "Chọn món, tính đúng tổng tiền", "Quét VietQR → đơn PAID", "Admin thấy đơn mới", "Tài xế nhận đơn, có đường đi", "Giao và xác nhận COD"];
  uat.forEach((u, i) => {
    const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
    const x = 0.6 + col * 6.2, y = 1.55 + row * 1.0;
    card(s, x, y, 5.9, 0.8);
    txt(s, `UAT-0${i + 1}`, { x: x + 0.25, y, w: 1.2, h: 0.8, fontSize: 15, bold: true, color: C.accent1, valign: "middle" });
    txt(s, u, { x: x + 1.45, y, w: 4.3, h: 0.8, fontSize: 16, valign: "middle" });
  });
  card(s, 6.8, 4.55, 5.9, 1.6, C.text2);
  badge(s, I.assign, 7.1, 5.05, 0.6, C.accent2);
  txt(s, [
    { text: "Trạng thái: chưa thực hiện", options: { bold: true, breakLine: true } },
    { text: "Kết quả PASS/FAIL và biên bản ký sẽ cập nhật sau buổi UAT (issue #39, #49)." },
  ], { x: 7.9, y: 4.7, w: 4.6, h: 1.3, fontSize: 16, color: C.background1, valign: "middle" });
  s.addNotes("Nói rõ với hội đồng: kịch bản UAT đã chuẩn bị, chưa có biên bản ký. Không trình bày kết quả khi chưa làm.");

  // ===== 9B. Rủi ro phát hiện khi kiểm thử luồng đơn =====
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Kết quả" });
  s.addText("Rủi ro lộ ra khi chủ động thử trường hợp xấu", { placeholder: "title" });
  [
    [I.swap, "R02 · Nhận đơn trùng", "16 → 3", "Nhận đơn bằng giao dịch. Ba tài xế bấm cùng lúc: chỉ một người nhận được."],
    [I.lock, "R13 · Tự đánh dấu đã trả", "20 → 5", "Khách gọi API xác nhận thủ công. Nay chỉ chủ đơn gọi được và chỉ ở chế độ demo."],
    [I.gavel, "R14 · Trạng thái đơn sai", "16 → 4", "Bảng chuyển trạng thái chung. Đơn online chưa trả không xác nhận được."],
  ].forEach(([ic, a, score, b], i) => {
    const x = 0.6 + i * 4.15, y = 1.55;
    card(s, x, y, 3.95, 3.6);
    badge(s, ic, x + 0.3, y + 0.3);
    txt(s, a, { x: x + 1.1, y: y + 0.3, w: 2.75, h: 0.6, fontSize: 17, bold: true, color: C.text2 });
    txt(s, score, { x: x + 0.3, y: y + 1.05, w: 3.35, h: 0.6, fontSize: 28, bold: true, color: C.accent1 });
    txt(s, b, { x: x + 0.3, y: y + 1.75, w: 3.4, h: 1.7, fontSize: 16 });
  });
  card(s, 0.6, 5.4, 12.3, 1.2, C.text2);
  txt(s, "Test cũ chỉ kiểm tra luồng đúng. Backend hiện có 80 test tự động; còn mở: giới hạn đăng nhập (R18), PR chưa được review (R19).", { x: 0.9, y: 5.4, w: 11.7, h: 1.2, fontSize: 18, color: C.background1, valign: "middle" });
  s.addNotes("Điểm số là mức rủi ro trước và sau biện pháp. R13 và R14 đã xảy ra thật khi nhóm thử API; R02 được kiểm chứng bằng ba tài xế bấm đồng thời. Nói rõ hai việc còn mở để hội đồng thấy nhóm không che giấu.");

  // ===== 10. Lessons =====
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Kết quả" });
  s.addText("Bốn bài học quản trị rút ra từ dự án", { placeholder: "title" });
  [
    [I.swap, "Dự phòng cho dịch vụ ngoài", "Polling song song webhook (CR-01); bản đồ và địa chỉ có nhiều tầng dự phòng."],
    [I.phone, "CI xanh chưa đủ", "Phải cài lên thiết bị thật: 10 lỗi chỉ lộ ra khi thử APK."],
    [I.lock, "Không nhúng secret vào app", "Mọi thứ trong APK đều giải nén được; key bí mật phải ở backend."],
    [I.gavel, "Quy trình phải được công cụ ép", "Hồ sơ ghi \"bắt buộc review\" nhưng PR vẫn merge thẳng vào main — cần branch protection."],
  ].forEach(([ic, a, b], i) => {
    const x = 0.6 + (i % 2) * 6.2, y = 1.55 + Math.floor(i / 2) * 2.6;
    card(s, x, y, 5.9, 2.3);
    badge(s, ic, x + 0.3, y + 0.3);
    txt(s, a, { x: x + 1.15, y: y + 0.32, w: 4.5, h: 0.55, fontSize: 20, bold: true, color: C.text2 });
    txt(s, b, { x: x + 0.3, y: y + 1.1, w: 5.3, h: 1.05, fontSize: 18 });
  });
  s.addNotes("Bốn bài học, mỗi bài gắn với một sự kiện thật trong dự án.");

  // ===== 11. Demo =====
  pres.addSection({ title: "Demo" });
  s = pres.addSlide({ masterName: "DARK", sectionTitle: "Demo" });
  s.addText("Live demo · 5 phút", { placeholder: "title" });
  s.addText("2 điện thoại + 1 máy tính, server demo qua Tailscale Funnel (link cố định)", { placeholder: "body" });
  [[I.phone, "Khách hàng", "Đặt đơn → thanh toán thẻ test (mô phỏng, OTP) → đơn Chờ xác nhận"],
   [I.moto, "Tài xế", "Nhận đơn → bản đồ Mapbox → quét AI đối soát → giao"],
   [I.web, "Admin", "Xác nhận đơn (đơn chưa trả bị từ chối), xem trạng thái"]].forEach(([ic, a, b], i) => {
    const x = 0.8 + i * 4.0;
    badge(s, ic, x, 5.2, 0.6, C.accent1);
    txt(s, a, { x: x + 0.8, y: 5.15, w: 3.0, h: 0.4, fontSize: 18, bold: true, color: C.background1 });
    txt(s, b, { x: x + 0.8, y: 5.6, w: 3.0, h: 0.9, fontSize: 14, color: "F3C9B8" });
  });
  s.addNotes("Server chạy bằng service (scripts/install-demo-services.sh) với link Tailscale Funnel cố định; tắt AUTO_ACCEPT_DEMO để admin xác nhận tay. Có video dự phòng. Không demo quét món bằng camera vì AI Service chưa host. Sau demo: mời hội đồng đặt câu hỏi.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("written", OUT);
})();
