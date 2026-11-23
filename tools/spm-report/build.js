// Dựng báo cáo Major Assignment (Software Project Management) theo mẫu VKU.
// Dùng: node build.js <thư mục chứa data.json + hình từ calc.py> <output.docx>
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, LevelFormat, Footer, PageNumber, ImageRun, TableOfContents,
  PageOrientation, VerticalAlign,
} = require("docx");

const [, , DIR = ".", OUT = "report.docx"] = process.argv;
const data = JSON.parse(fs.readFileSync(path.join(DIR, "data.json"), "utf8"));
const img = (f) => fs.readFileSync(f.includes("/") ? f : path.join(DIR, f));
const FONT = "Times New Roman";
const A4 = { w: 11907, h: 16840 }, M = 1440;
const CW = A4.w - 2 * M, CWL = A4.h - 2 * M;
const vnd = (n) => Math.round(n).toLocaleString("de-DE");
const mil = (n) => (n / 1e6).toFixed(2);

// ---------- Thông tin nhóm (lấy từ bản đã điền tay) ----------
const ROLE = { HUY: "Võ Nhật Huy", TIEN: "Trần Phan Minh Tiến", MINH: "Nguyễn Bảo Quang Minh", BAO: "Nguyễn Gia Bảo" };
const SID = { HUY: "23IT.EB047", TIEN: "23IT.EB108", MINH: "23IT.EB057", BAO: "23IT.EB007" };
const CLASS = "[Class]", DATE = "15/11/2026";

// ---------- helpers ----------
const t = (text, o = {}) => new TextRun({ text, font: FONT, ...o });
const P = (text, o = {}) => new Paragraph({ spacing: { after: 120, line: 312 }, alignment: AlignmentType.JUSTIFIED, ...o,
  children: Array.isArray(text) ? text : [t(text)] });
const H1 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [t(s)] });
const H2 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(s)] });
const H3 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [t(s)] });
const bullet = (s, lvl = 0) => new Paragraph({ numbering: { reference: "bul", level: lvl }, spacing: { after: 60, line: 300 },
  children: Array.isArray(s) ? s : [t(s)] });
const B = (s) => t(s, { bold: true });
let tableNo = 0, figNo = 0;
const caption = (s) => { tableNo++;
  return new Paragraph({ spacing: { before: 120, after: 60 }, children: [t(`Table ${tableNo}. ${s}`, { italics: true, size: 22 })] }); };
const figure = (file, w, h, s) => { figNo++; return [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new ImageRun({ type: "png", data: img(file), transformation: { width: w, height: h } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [t(`Figure ${figNo}. ${s}`, { italics: true, size: 22 })] }),
]; };
const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };
function table(head, rows, widthsRel, total = CW, opt = {}) {
  const sum = widthsRel.reduce((a, b) => a + b, 0);
  const w = widthsRel.map((x) => Math.floor((x / sum) * total)); w[w.length - 1] += total - w.reduce((a, b) => a + b, 0);
  const size = opt.size || 22;
  const cell = (txt, i, isHead, extra = {}) => new TableCell({
    borders, width: { size: w[i], type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
    margins: { top: opt.pad ?? 50, bottom: opt.pad ?? 50, left: 90, right: 90 },
    shading: isHead ? { fill: "D9D9D9", type: ShadingType.CLEAR, color: "auto" } : (extra.fill ? { fill: extra.fill, type: ShadingType.CLEAR, color: "auto" } : undefined),
    children: String(txt).split("\n").map((line) => new Paragraph({
      alignment: isHead || (opt.center || []).includes(i) ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [t(line, { bold: isHead || opt.boldCol === i || extra.bold, size })] })),
  });
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: w,
    rows: [new TableRow({ tableHeader: true, children: head.map((h, i) => cell(h, i, true)) }),
      ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, i, false, opt.rowStyle ? opt.rowStyle(r) : {})) }))] });
}
const note = (title, body) => new Paragraph({ spacing: { after: 120 }, indent: { left: 200 },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: "C00000", space: 8 } }, children: [B(title + " "), t(body, { italics: true })] });

const ORIG = data.orig, REV = data.rev, ro = REV.res, r1 = ORIG.res, W6 = data.week6;

// ================= COVER =================
const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [t("VIETNAM – KOREA UNIVERSITY OF INFORMATION AND COMMUNICATION TECHNOLOGY", { size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [t("Faculty of Computer Science", { bold: true, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 500, after: 500 }, children: [new ImageRun({ type: "png", data: img(path.join(__dirname, "vku_logo.png")), transformation: { width: 238, height: 143 } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [t("MAJOR ASSIGNMENT", { bold: true, size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [t("Object: SOFTWARE PROJECT MANAGEMENT", { bold: true, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [t("Topic: GUGUGAGA – AI-INTEGRATED FOOD ORDERING AND DELIVERY ECOSYSTEM", { bold: true, size: 28 })] }),
  ...[["Students", `${ROLE.HUY}  ${SID.HUY}`], ["", `${ROLE.TIEN}  ${SID.TIEN}`], ["", `${ROLE.MINH}  ${SID.MINH}`], ["", `${ROLE.BAO}  ${SID.BAO}`], ["", ""],
    ["Class", CLASS], ["Supervisor", "Dr. Nguyen Thanh Tuan"]].map(([a, b]) => new Paragraph({
    indent: { left: 1700 }, spacing: { after: 60 }, tabStops: [{ type: "left", position: 3300 }, { type: "left", position: 3600 }],
    children: [t(a, { size: 26 }), t(a ? "\t:\t" : "\t\t", { size: 26 }), t(b, { size: 26, bold: a === "Students" || a === "" })] })),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 900 }, children: [t(`Da Nang, ${DATE}`, { bold: true, size: 26 })] }),
];

// ================= FRONT MATTER =================
const front = [
  new Paragraph({ pageBreakBefore: true, alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [t("TABLE OF CONTENTS", { bold: true, size: 30 })] }),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ children: [t("(If the table of contents is empty, right-click it in Word and choose “Update Field”.)", { italics: true, size: 20, color: "808080" })] }),
  new Paragraph({ pageBreakBefore: true, alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [t("ABBREVIATIONS", { bold: true, size: 30 })] }),
  table(["ABBREVIATIONS", "MEANING"], [
    ["PM", "Project Manager"], ["SM", "Scrum Master"], ["DEV", "Developer"], ["QA", "Quality Assurance"],
    ["WBS", "Work Breakdown Structure"], ["PERT", "Program Evaluation and Review Technique"], ["CPM", "Critical Path Method"],
    ["RACI", "Responsible – Accountable – Consulted – Informed"], ["MVP", "Minimum Viable Product"], ["MoSCoW", "Must / Should / Could / Won't have"],
    ["EVM", "Earned Value Management"], ["PV / EV / AC", "Planned Value / Earned Value / Actual Cost"], ["BAC", "Budget at Completion"],
    ["CV / SV", "Cost Variance / Schedule Variance"], ["CPI / SPI", "Cost / Schedule Performance Index"],
    ["IEAC / VAC / ISAC", "Independent Estimate at Completion / Variance at Completion / Independent Schedule at Completion"],
    ["CR / CCB", "Change Request / Change Control Board"], ["UAT", "User Acceptance Testing"], ["API", "Application Programming Interface"],
    ["JWT", "JSON Web Token"], ["COD", "Cash on Delivery"], ["CI/CD", "Continuous Integration / Continuous Delivery"],
    ["APK", "Android Package (installable Android app file)"], ["SHA-1", "Signing-certificate fingerprint registered in Firebase for Google sign-in"],
    ["ĐACN1", "Specialized Project 1 (the course this product is inherited from)"],
  ], [1, 3]),
  P([B("Version note. "), t(`Version 2, updated ${DATE}. Compared with version 1 (14/11/2026) this version adds the beta release and real-device testing (Appendix A), the risks that actually occurred (Part 4, Section V) and the new risks R11–R12.`, { italics: true })], { spacing: { before: 240 } }),
];

// ================= PART 1 =================
const p1 = [
  H1("PART 1. INTRODUCTION"),
  H2("I. Project Overview"),
  H3("1.1. Introduction to the project"),
  P("Small and medium food-and-beverage (F&B) shops in Vietnam depend heavily on third-party delivery platforms that charge 20–30% commission, and they still verify bank transfers by hand during rush hours. Customers, on the other hand, often cannot find a traditional Vietnamese dish they have only seen in a photo."),
  P("GuGuGaGa is an AI-integrated food ordering and delivery ecosystem that lets a restaurant chain run its own online sales channel. It consists of five sub-systems: a Node.js/Express backend on Firebase Firestore, a React administration portal, a Flutter customer app, a Flutter driver (shipper) app, and a Python/PyTorch AI service that recognises 30 Vietnamese dishes from a photo. Payments use dynamic VietQR codes reconciled automatically through Casso bank-balance webhooks, and a Gemini-based chatbot recommends dishes from the real menu."),
  P([t("Sourcing pathway: "), B("Pathway 1 – inherited from Specialized Project 1 (ĐACN1)."), t(" The product was developed from 24/08/2026 in ĐACN1. This report applies the software project management framework of the course (scope, schedule, cost, risk and EVM) to that product; the repository and governance artefacts were reorganised for this course on 09/11/2026.")]),
  P([t("Current status: "), B(`beta release v1.1.0-beta (15/11/2026)`), t(" — two Android APKs published on GitHub Releases and a demo server reachable over the Internet; see Appendix A.")]),
  H3("1.2. Aims and Objectives of the Project"),
  caption("Project summary"),
  table(["Item", "Description"], [
    ["Project Name", "GuGuGaGa – AI-integrated food ordering and delivery ecosystem"],
    ["Objectives", "1. Deliver five integrated sub-systems: Backend API, Admin Web, Customer App, Shipper App and AI Service.\n2. Automate bank-transfer reconciliation with VietQR + Casso (webhook processed within 1.5 s).\n3. Recognise 30 Vietnamese dishes from a photo with Top-1 accuracy ≥ 80% and Top-3 ≥ 92%.\n4. Let drivers accept orders without race conditions and navigate with Mapbox/OSRM.\n5. Finish the scope within 12 weeks (60 working days) with zero infrastructure cost (free tiers)."],
    ["Key Benefits", "Lower commission for restaurants, no manual statement checking, faster dish discovery for customers, and a single dashboard for orders, revenue and drivers."],
    ["Target Users", "Restaurant owners/administrators, customers ordering food, and delivery drivers."],
    ["Duration", "12 weeks: 24/08/2026 – 13/11/2026 (planned); beta released 15/11/2026; defence after 16/11/2026"],
  ], [1, 4], CW, { boldCol: 0 }),
  H3("1.3. Introduction of stakeholders"),
  caption("Stakeholders of the project"),
  table(["Stakeholder", "Short Description"], [
    ["Course Lecturer (Sponsor)", "Dr. Nguyen Thanh Tuan – approves the project charter, evaluates deliverables and the final defence."],
    ["Project Manager / Scrum Master", `${ROLE.HUY} – plans and tracks schedule, risks and quality; chairs the Change Control Board.`],
    ["Technical Lead / Architect", `${ROLE.TIEN} – system architecture, Firestore schema, CI/CD, code review.`],
    ["Development Team", `${ROLE.MINH} (Flutter & React front-end), ${ROLE.BAO} (Express backend & AI service).`],
    ["Restaurant Owner (Client)", "Defines business rules (menu, branches, delivery fee) and accepts the system in UAT."],
    ["End Users – Customers", "Browse the menu, scan dishes with the camera, order and pay by VietQR or COD."],
    ["End Users – Drivers", "Accept orders, navigate, deliver and collect COD."],
    ["Beta testers", "People who install the v1.1.0-beta APKs and report defects (Appendix A)."],
    ["Third-party Providers", "Firebase, Cloudinary, Casso/VietQR, Mapbox/OSRM, Google Gemini, Cloudflare – external services the system depends on."],
  ], [1, 2.4]),
  H3("1.4. Information needs of stakeholders"),
  caption("Information needs of stakeholders"),
  table(["Stakeholder", "Information Needs"], [
    ["Course Lecturer", "Charter, WBS, schedule (PERT/Gantt), risk register, EVM status, change requests, final report and demo."],
    ["Project Manager", "Task status per sprint, velocity, blockers, risk triggers, actual effort for EVM, CI results."],
    ["Technical Lead", "Architecture decisions, API contracts, pull requests, test and build results, security issues."],
    ["Development Team", "Assigned issues, acceptance criteria, API specification, design mock-ups, review feedback."],
    ["Restaurant Owner", "Feature progress, demo builds, UAT scenarios and results, user guide."],
    ["Beta testers", "Download link, installation steps, current server URL, test accounts, known limitations."],
    ["End Users", "How to order, pay and track orders (customers); how to accept, navigate and complete orders (drivers)."],
  ], [1, 2.4]),
  H3("1.5. Communication matrix"),
  caption("Communication matrix"),
  table(["Information", "From", "To", "Channel", "Frequency"], [
    ["Daily progress & blockers", "Team members", "PM", "Group chat (stand-up message)", "Daily"],
    ["Task assignment & status", "PM", "Team", "GitHub Issues / Project board", "Continuous"],
    ["Code changes & review", "Developer", "Tech Lead / peer", "GitHub Pull Request", "Per change"],
    ["Build & test results", "GitHub Actions", "Team", "CI checks on PR", "Per push / PR"],
    ["Sprint plan, review, retrospective", "PM", "Team", "Online meeting + minutes", "Start / end of sprint"],
    ["Change requests", "Any member", "CCB", "CR form (docs/06)", "When needed"],
    ["Beta build & server URL", "Tech Lead", "Beta testers", "GitHub Releases + chat", "Per release / server restart"],
    ["Progress report", "PM", "Lecturer", "Class meeting / report", "Per course schedule"],
    ["UAT results", "PM / QA", "Restaurant owner", "UAT session + sign-off form", "End of project"],
  ], [1.6, 1, 1, 1.5, 1]),
  H3("1.6. Meeting schedule for stakeholders"),
  caption("Meeting schedule"),
  table(["Meeting", "Participants", "Time", "Purpose"], [
    ["Kick-off", "Lecturer, whole team", "Week 1 (24/08)", "Approve charter, scope and roles"],
    ["Sprint Planning", "Whole team", "First day of each sprint", "Select backlog items, estimate story points"],
    ["Daily stand-up (async)", "Whole team", "Every working day, 21:00", "Done / next / blockers"],
    ["Sprint Review", "Team (+ restaurant owner when possible)", "Last day of each sprint", "Demo increment, collect feedback"],
    ["Sprint Retrospective", "Whole team", "After Sprint Review", "4Ls: Liked, Learned, Lacked, Longed for"],
    ["Change Control Board", "PM, Tech Lead, affected developers", "On demand", "Assess and approve change requests"],
    ["UAT & handover", "Restaurant owner, PM, Tech Lead", "Week 12", "Acceptance testing and sign-off"],
  ], [1.3, 1.6, 1.4, 2]),

  H2("II. Software Requirement Specification"),
  H3("2.1. Functional Requirement Specification"),
  caption("Functional requirements"),
  table(["ID", "Actor", "Function", "Description", "Priority"], [
    ["FR01", "All users", "Authentication", "Sign up / sign in with phone and password (JWT); Google sign-in for customers (native on Android); role-based access (CUSTOMER, DRIVER, ADMIN).", "Must"],
    ["FR02", "Customer", "Browse menu", "View branches, categories, dishes and combos; choose a branch from the home screen.", "Must"],
    ["FR03", "Customer", "Cart & checkout", "Add dishes/combos with quantity, cart isolated per branch, choose delivery address on map, compute total and delivery fee.", "Must"],
    ["FR04", "Customer", "Payment", "Pay by dynamic VietQR (Napas247) or COD; order is marked PAID automatically via Casso webhook or payment polling (CR-01).", "Must"],
    ["FR05", "Customer", "Order tracking & history", "See order status timeline and history; receive in-app notifications.", "Should"],
    ["FR06", "Customer", "AI dish scan", "Take/select a photo; AI service returns Top-3 dishes mapped to the menu.", "Could"],
    ["FR07", "Customer", "AI chatbot", "Gemini assistant (called through the backend) recommends dishes/combos from the real menu.", "Could"],
    ["FR08", "Customer", "Reviews & favourites", "Rate an order/driver (1–5 stars), save favourite dishes.", "Should"],
    ["FR09", "Driver", "Duty & order feed", "Toggle online/offline, see available orders, accept an order without conflicts.", "Must"],
    ["FR10", "Driver", "Navigation & AI check", "Route from branch to customer (Mapbox, OSRM fallback); AI scan of a payment receipt.", "Should"],
    ["FR11", "Driver", "Delivery & COD", "Update status to DELIVERED; confirm the collected COD amount before completing.", "Must"],
    ["FR12", "Admin", "Catalogue management", "CRUD branches, categories, dishes and combos with image upload (Cloudinary).", "Must"],
    ["FR13", "Admin", "Order dispatch", "View all orders, change status, assign a driver manually, cancel wrong orders.", "Must"],
    ["FR14", "Admin", "Dashboard", "Revenue by day/week/month/year, order and customer counts, recent orders (Recharts).", "Should"],
    ["FR15", "Admin", "User & driver management", "Manage customer accounts and driver accounts.", "Should"],
  ], [0.6, 0.9, 1.2, 3.4, 0.7], CW, { center: [0, 4], size: 21 }),
  H3("2.2. Non-Functional Requirement Specification"),
  caption("Non-functional requirements"),
  table(["ID", "Category", "Requirement", "Measure / Acceptance"], [
    ["NFR01", "Performance", "Payment reconciliation", "Casso webhook updates the order to PAID in ≤ 1.5 s"],
    ["NFR02", "Performance", "AI inference latency", "/predict ≤ 500 ms per image on CPU (p95), ≤ 100 ms on GPU"],
    ["NFR03", "Accuracy", "Dish recognition", "Top-1 ≥ 80%, Top-3 ≥ 92% on the test set; model file ≤ 15 MB"],
    ["NFR04", "Security", "Authentication & authorisation", "JWT on protected routes (401 without/invalid token), role check (403), passwords hashed with bcrypt"],
    ["NFR05", "Security", "Webhook integrity", "Requests without the correct Casso Secure-Token are rejected with 401; duplicate webhooks are idempotent"],
    ["NFR06", "Security", "Secrets", "No credentials committed; secret keys (Gemini, OpenCage, Cloudinary) only on the backend; the APK contains public tokens only"],
    ["NFR07", "Reliability", "Concurrency", "Two drivers accepting the same order: exactly one succeeds"],
    ["NFR08", "Reliability", "Third-party failure", "Payment polling when webhooks are delayed; Mapbox → OpenStreetMap/Nominatim → coordinates for maps and addresses"],
    ["NFR09", "Usability", "Mobile UX", "Vietnamese UI, main flows (order, pay) completed in ≤ 5 screens"],
    ["NFR10", "Maintainability", "Quality gate", "Every PR passes CI (backend tests, admin build, flutter analyze/test) and one peer review"],
    ["NFR11", "Cost", "Infrastructure", "Runs on free tiers (Firebase Spark, Cloudinary, Mapbox, Casso, Cloudflare Quick Tunnel)"],
    ["NFR12", "Operability", "Server address", "The server URL can be changed inside the apps without reinstalling"],
  ], [0.7, 1.1, 1.6, 3.2], CW, { center: [0], size: 21 }),
  H3("2.3. Environmental requirements"),
  caption("Environmental requirements"),
  table(["Environment", "Component", "Requirement"], [
    ["Development", "Backend / Admin", "Node.js 20+ LTS, npm; Vite + React + Tailwind CSS"],
    ["Development", "Mobile apps", "Flutter stable (Dart ≥ 3.3), Android SDK; Gradle 8.14, AGP 8.11, Kotlin 2.2 (required by current Flutter)"],
    ["Development", "AI service", "Python 3.10+, PyTorch, torchvision, Flask; GPU optional for training"],
    ["Development", "Local database", "Firebase Firestore Emulator (JDK 21) or a Firebase project with a service account"],
    ["Development", "Tools", "Git/GitHub (Issues, Projects, Actions, Releases), Postman/curl"],
    ["Demo / beta", "Server", "scripts/serve-demo.sh on a team machine: Firestore Emulator + backend + Cloudflare Quick Tunnel (public HTTPS URL)"],
    ["Deployment", "Backend & AI", "Cloud VM, home server or PaaS with HTTPS for the Casso webhook"],
    ["Deployment", "Database & media", "Firebase Firestore (Spark plan), Cloudinary (free)"],
    ["Deployment", "External APIs", "Casso API + webhook, VietQR, Mapbox (tiles, directions, geocoding) / OSRM / Nominatim, Google Gemini API, Firebase Auth (project guga-27d3f)"],
    ["Client", "Customer & driver apps", "Android 7.0+ (arm64) smartphone with camera, GPS and Internet"],
    ["Client", "Admin portal", "Modern browser (Chrome, Edge, Firefox) on desktop"],
  ], [1, 1.2, 3.2]),

  H2("III. Project personnel"),
  caption("Project personnel"),
  table(["No.", "Member", "Student ID", "Role", "Main responsibilities"], [
    ["1", ROLE.HUY, SID.HUY, "Project Manager, Scrum Master, QA Lead", "Planning, tracking, risk register, EVM, test matrix, UAT, documentation"],
    ["2", ROLE.TIEN, SID.TIEN, "Technical Lead, System Architect", "Architecture, Firestore schema, CI/CD, code review, release & demo server, backend quality"],
    ["3", ROLE.MINH, SID.MINH, "Front-end Engineer", "Customer and Shipper Flutter apps, Admin web UI"],
    ["4", ROLE.BAO, SID.BAO, "Backend & AI Engineer", "Express API, VietQR/Casso, order engine, MobileNetV2 training and Flask API"],
  ], [0.4, 1.4, 1, 1.5, 2.7], CW, { center: [0, 2] }),

  H2("IV. The software development model to be applied and explain the reason"),
  P([B("Chosen model: Scrum-based Agile with a Kanban board on GitHub Projects (hybrid Agile).")]),
  P("The work is organised in four sprints of 2–3 weeks. Each sprint starts with Sprint Planning, uses a short asynchronous daily stand-up, and ends with a Sprint Review (demo) and a Retrospective in the 4Ls format. The backlog is stored as GitHub Issues with story points, MoSCoW and priority labels; the board has five columns: Backlog → Ready → In Progress → In Review → Done."),
  P("Reasons for this choice:"),
  bullet([B("Uncertain third-party behaviour. "), t("Casso webhooks, Mapbox, Gemini and Firebase Auth are external services whose behaviour is only known after integration; short iterations let the team adapt (e.g. Change Request CR-01, and the fixes made after the beta test).")]),
  bullet([B("Independent sub-systems. "), t("Five sub-systems can be developed in parallel by a four-person team; sprints synchronise them through working increments.")]),
  bullet([B("Early, usable MVP. "), t("Must-have packages (63% of work packages) form an MVP that is demonstrated at the end of Sprint 2; Should/Could features are added only if time allows.")]),
  bullet([B("Small team, fixed deadline. "), t("Time-boxing with a fixed 12-week deadline and variable scope fits a student team better than a fixed-scope Waterfall plan.")]),
  bullet([B("Quality through automation and real devices. "), t("Each change goes through a pull request, peer review and CI; increments are also installed on real phones, because the beta showed that a green CI does not prove the app runs (Appendix A).")]),
];

// ================= PART 2 =================
const wbsRows = [
  ["1.1.1", "Repo, Git conventions & CI/CD pipeline", 40, "Must"], ["1.1.2", "Firebase (Auth, Firestore) & Cloudinary setup", 40, "Must"],
  ["1.2.1", "Backend: Authentication & authorisation", 60, "Must"], ["1.2.2", "Backend: Menu, category & branch management", 60, "Must"],
  ["1.2.3", "Backend: Cart & order lifecycle", 80, "Must"], ["1.2.4", "Backend: VietQR & Casso webhook reconciliation", 60, "Must"],
  ["1.2.5", "Backend: Notifications & reviews", 40, "Should"], ["1.3.1", "Customer app: Auth & profile", 40, "Must"],
  ["1.3.2", "Customer app: Home, menu discovery & search", 60, "Must"], ["1.3.3", "Customer app: Dish detail, cart & checkout", 60, "Must"],
  ["1.3.4", "Customer app: VietQR & COD payment", 40, "Must"], ["1.3.5", "Customer app: Order tracking & map", 60, "Should"],
  ["1.3.6", "Customer app: Camera AI scan & chatbot UI", 80, "Could"], ["1.4.1", "Shipper app: Login & duty toggle", 40, "Must"],
  ["1.4.2", "Shipper app: Order feed & accept", 60, "Must"], ["1.4.3", "Shipper app: Mapbox routing (OSRM fallback)", 60, "Should"],
  ["1.4.4", "Shipper app: Delivery confirmation & COD", 40, "Must"], ["1.5.1", "Admin: Dashboard & KPI charts", 60, "Should"],
  ["1.5.2", "Admin: Menu, category & branch management", 60, "Must"], ["1.5.3", "Admin: Order management & driver dispatch", 60, "Must"],
  ["1.5.4", "Admin: User & driver accounts", 40, "Should"], ["1.6.1", "AI: Dataset collection & preprocessing (30 dishes)", 60, "Could"],
  ["1.6.2", "AI: MobileNetV2 transfer learning", 80, "Could"], ["1.6.3", "AI: Flask inference API & ImageNet fallback", 40, "Could"],
  ["1.6.4", "AI: Gemini chatbot integration", 40, "Could"], ["1.7.1", "System E2E integration testing", 80, "Must"],
  ["1.7.2", "Production deployment & handover", 40, "Must"],
];
const actOf = { "1.1.1": "A", "1.1.2": "A", "1.2.1": "B", "1.2.2": "C", "1.2.3": "D", "1.2.4": "E", "1.3.1": "F", "1.3.2": "F", "1.3.3": "G", "1.3.4": "G",
  "1.4.1": "H", "1.4.2": "H", "1.4.4": "I", "1.5.2": "J", "1.5.3": "J", "1.6.1": "K", "1.6.2": "K", "1.6.3": "K", "1.7.1": "L", "1.7.2": "M" };
const p2 = [
  H1("PART 2. LIST OF WORKS AND IMPLEMENTATION TIME ESTIMATION"),
  H2("I. Work Breakdown Structure"),
  P("The WBS follows the 100% rule: it covers all work from project initiation to deployment. Level 1 is the whole product, Level 2 the seven deliverable areas and Level 3 the 27 leaf work packages. Each leaf package is sized at 1–2 weeks of work (40–80 person-hours)."),
  bullet([B("1.0 GuGuGaGa ecosystem")]),
  ...[["1.1 Management & infrastructure", "1.1.1 – 1.1.2"], ["1.2 Backend API & database", "1.2.1 – 1.2.5"], ["1.3 Customer mobile app", "1.3.1 – 1.3.6"],
    ["1.4 Shipper mobile app", "1.4.1 – 1.4.4"], ["1.5 Admin web portal", "1.5.1 – 1.5.4"], ["1.6 AI & chatbot service", "1.6.1 – 1.6.4"], ["1.7 QA, integration & deployment", "1.7.1 – 1.7.2"]]
    .map(([a, b]) => bullet([t(a + "  "), t(`(work packages ${b})`, { italics: true })], 1)),
  caption("Leaf work packages, effort and MoSCoW priority"),
  table(["WBS", "Work package", "Effort (h)", "MoSCoW", "PERT activity"],
    wbsRows.map(([c, n, h, m]) => [c, n, h, m, actOf[c] || "N"]), [0.7, 3.4, 0.8, 0.8, 0.8], CW, { center: [0, 2, 3, 4], size: 21 }),
  P([t("Total effort: "), B("27 packages, 1,480 person-hours."), t(" Must: 17 packages / 920 h (62.2% of effort, the MVP); Should: 5 / 260 h (17.6%); Could: 5 / 300 h (20.3%); Won't: 0 (voice assistant and international card payment are out of scope for v2).")]),
  H2("II. Work Evaluation And Time Estimate Table"),
  P("For scheduling, the leaf packages are grouped into 14 activities (A–N). Durations are estimated in working days with the three-point PERT formula: Te = (O + 4M + P) / 6 and variance σ² = ((P − O) / 6)². Activity N groups the Should/Could packages that are not on the original network."),
  caption("Activities, dependencies and three-point estimates"),
  table(["ID", "Activity", "WBS", "Predecessors", "O", "M", "P", "Te (days)", "σ²", "Effort (h)"],
    REV.order.map((n) => { const r = ro[n]; return [n, r.name, r.wbs, r.pred.join(", ") || "–", r.O, r.M, r.P, r.te, r.var, r.hours]; }),
    [0.4, 2.2, 1.3, 1, 0.4, 0.45, 0.4, 0.65, 0.5, 0.65], CW, { center: [0, 3, 4, 5, 6, 7, 8, 9], size: 19 }),
  P("Predecessors shown are those of the revised network (Part 3, Section II). Cost is computed at an assumed blended rate of 100,000 VND per person-hour, giving a Budget at Completion (BAC) of " + vnd(data.BAC) + " VND.", { spacing: { before: 120 } }),
];

// ================= PART 3 =================
const floatRows = REV.order.filter((n) => ro[n].slack > 0).map((n) => [n, ro[n].name, ro[n].ES, ro[n].EF, ro[n].LS, ro[n].LF, ro[n].slack, `${ro[n].start} – ${ro[n].end}`]);
const raci = [
  ["A", "Repo setup, CI/CD & Firebase", "A", "R", "C", "C"], ["B", "Backend Auth & RBAC", "A", "C", "I", "R"],
  ["C", "Backend Menu, Category & Branch", "A", "C", "I", "R"], ["D", "Backend Cart & Order lifecycle", "A", "C", "I", "R"],
  ["E", "Backend VietQR & Casso webhook", "A", "C", "I", "R"], ["F", "Customer App Auth & Home/Menu", "A", "C", "R", "I"],
  ["G", "Customer App Cart, Checkout & VietQR", "A", "C", "R", "C"], ["H", "Shipper App Auth & Order feed", "A", "R", "C", "C"],
  ["I", "Shipper App Delivery & COD", "A", "R", "C", "I"], ["J", "Admin Web Menu & Dispatch", "A", "C", "R", "C"],
  ["K", "AI Dataset, Training & Flask API", "A", "C", "I", "R"], ["N", "Should/Could feature set", "A", "C", "R", "R"],
  ["L", "System E2E integration testing", "A/R", "R", "R", "R"], ["M", "Production deployment & handover", "A", "R", "C", "C"],
];
const p3 = [
  H1("PART 3. PERT DIAGRAM"),
  H2("I. The PERT diagram"),
  P("Figure 1 shows the activity-on-node network as first planned. A forward pass gives the earliest start/finish (ES/EF) and a backward pass the latest start/finish (LS/LF); slack = LS − ES."),
  ...figure("pert_original.png", 620, 295, "Original PERT network (activity-on-node)"),
  caption("Forward/backward pass of the original network"),
  table(["ID", "Te", "Predecessors", "ES", "EF", "LS", "LF", "Slack", "Critical"],
    ORIG.order.map((n) => { const r = r1[n]; return [n, r.te, r.pred.join(", ") || "–", r.ES, r.EF, r.LS, r.LF, r.slack, ORIG.crit.includes(n) ? "Yes" : "No"]; }),
    [0.5, 0.6, 1.3, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7], CW, { center: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
  P([t("Critical path: "), B(ORIG.crit.join(" → ")), t(`. Expected duration T = ${ORIG.T} working days (${ORIG.T / 5} weeks), σ = √(Σσ²) = ${ORIG.sigma.toFixed(2)} days.`)], { spacing: { before: 120 } }),

  H2("II. The unreasonable issues of the PERT and propose changes (if any)"),
  H3("2.1. Identified Issues"),
  bullet([B("The plan does not fit the deadline. "), t(`The critical path takes ${ORIG.T} working days (${ORIG.T / 5} weeks) while the project is constrained to 12 weeks (60 working days). With σ = ${ORIG.sigma.toFixed(2)} days, Z = (60 − ${ORIG.T}) / ${ORIG.sigma.toFixed(2)} = ${ORIG.z.toFixed(2)}, so the probability of finishing on time is practically 0%.`)]),
  bullet([B("Critical path previously under-stated. "), t("An earlier draft listed A→B→D→E→G→I→L→M (67.5 days) and omitted activity C, although D depends on C. Including C gives 75 days. The project documents were corrected on 15/11/2026.")]),
  bullet([B("Unnecessary sequential dependency C after B. "), t("Menu/category/branch CRUD does not need the finished authentication module; it can be built against a stub middleware.")]),
  bullet([B("Front-end waits for the payment back-end. "), t("G (checkout & VietQR screen) is scheduled after E although it only needs the agreed API contract; the real integration can be verified in L.")]),
  bullet([B("Dangling activity. "), t("K (AI service) has no successor, so its integration into the system test is not planned; Should/Could packages (1.2.5, 1.3.5, 1.3.6, 1.4.3, 1.5.1, 1.5.4, 1.6.4) are not on the network at all.")]),
  bullet([B("Late, big-bang testing. "), t("All integration testing (L, 10 days) is left to the end instead of being partly done inside each sprint.")]),
  H3("2.2. Proposed Changes and Resource Leveling"),
  caption("Changes applied to the network"),
  table(["No.", "Change", "Effect"], [
    ["1", "C depends only on A (parallel with B, using a stub auth middleware)", "Saves 7.5 days on the critical path"],
    ["2", "G depends on D and F (API contract) instead of E; E becomes a predecessor of L", "E is no longer critical (12.5 days slack)"],
    ["3", "Continuous integration testing in every sprint (CI + PR review), reducing L to O/M/P = 5/7.5/10", "Saves 2.5 days"],
    ["4", "Add K → L so that the AI service is tested in the E2E test", "AI integration is planned (K has 15 days slack)"],
    ["5", "Add activity N (Should/Could features, 380 h, after D, before L)", "Full 100% scope is scheduled; N has 5 days slack"],
    ["6", `Resource leveling: ${ROLE.BAO} moves from backend to AI (K) and N while ${ROLE.TIEN} takes the shipper app (H, I); ${ROLE.MINH} focuses on F → G`, "No member is assigned to two critical activities at the same time"],
  ], [0.4, 3.6, 2], CW, { center: [0] }),
  H3("2.3. Expected Outcomes"),
  P(`After the changes the expected duration is ${REV.T} working days (${REV.T / 5} weeks), from 24/08/2026 to ${REV.end}. The new critical path is ${REV.crit.join(" → ")} with σ = ${REV.sigma.toFixed(2)} days; the probability of finishing within 60 days is about ${(REV.p * 100).toFixed(0)}%. Because a 50% probability is not comfortable, the days between ${REV.end} and the defence are kept as a management reserve, and Could-have packages in N are the first to be cut if the critical path slips. In practice that reserve was used for the beta test and its fixes (Appendix A).`),
  ...figure("pert_revised.png", 620, 295, "Revised PERT network"),

  H2("III. The Gantt (Critical Path), the effort and the duration to complete the entire work"),
  ...figure("gantt.png", 620, 310, "Gantt chart of the revised plan"),
  caption("Schedule of the revised plan"),
  table(["ID", "Activity", "Start", "Finish", "Te (days)", "Effort (h)", "Critical"],
    REV.order.map((n) => [n, ro[n].name, ro[n].start, ro[n].end, ro[n].te, ro[n].hours, REV.crit.includes(n) ? "Yes" : "No"]),
    [0.4, 2.8, 0.8, 0.8, 0.8, 0.8, 0.7], CW, { center: [0, 2, 3, 4, 5, 6], rowStyle: (r) => (r[6] === "Yes" ? { fill: "FBE4E1" } : {}) }),
  P([t("Total effort: "), B("1,480 person-hours"), t(" (≈ 370 h per member, ≈ 31 h/member/week). Duration: "), B(`${REV.T} working days = ${REV.T / 5} weeks`), t(` (24/08/2026 – ${REV.end}). Budget at completion: `), B(`${vnd(data.BAC)} VND`), t(".")], { spacing: { before: 120 } }),

  H2("IV. List of the tasks that can be floated/slacked and its float time"),
  caption("Non-critical activities and their float"),
  table(["ID", "Activity", "ES", "EF", "LS", "LF", "Float (days)", "Planned dates"], floatRows,
    [0.4, 2.6, 0.5, 0.5, 0.5, 0.5, 0.8, 1.2], CW, { center: [0, 2, 3, 4, 5, 6, 7] }),
  P("Activities with float can be delayed by up to their float without delaying the project. The largest buffers are K (AI service, 15 days) and E (VietQR & Casso, 12.5 days), which is useful because both depend on third parties (dataset quality, Casso webhook). Float of D and H is small (2.5 days); a delay longer than that makes them critical.", { spacing: { before: 120 } }),

  H2("V. Responsibility Matrix"),
  caption("RACI matrix (R = Responsible, A = Accountable, C = Consulted, I = Informed)"),
  table(["ID", "Activity", "Huy (PM/QA)", "Tiến (Tech Lead)", "Minh (Front-end)", "Bảo (Backend/AI)"], raci,
    [0.4, 2.6, 0.9, 0.9, 0.9, 0.9], CW, { center: [0, 2, 3, 4, 5] }),
  P("Every activity has exactly one Accountable person (the PM) and at least one Responsible member. The Tech Lead is consulted on all technical activities through pull-request reviews.", { spacing: { before: 120 } }),
];

// ================= PART 4 =================
const risks = [
  ["R01", "Casso webhook delayed or lost (customer paid but order stays UNPAID)", "Technical / third party", 3, 5],
  ["R02", "Race condition: two drivers accept the same order", "Technical / concurrency", 4, 4],
  ["R03", "AI model misclassifies dishes (lighting, angle, similar dishes)", "Technical / AI", 4, 3],
  ["R04", "Free-tier quota exceeded or missing API keys (Firestore, Mapbox, OpenCage)", "Cost / operations", 3, 3],
  ["R05", "Members unfamiliar with Flutter / PyTorch delay the schedule", "People / schedule", 3, 4],
  ["R06", "Secrets leaked (service account, JWT secret, API keys, personal tokens)", "Security", 2, 5],
  ["R07", "Critical path overruns the 12-week deadline", "Schedule", 4, 4],
  ["R08", "AI model does not reach Top-1 ≥ 80%", "Quality / AI", 3, 3],
  ["R09", "Integration defects found late (sub-systems built in parallel)", "Quality / integration", 3, 4],
  ["R10", "Requirement change from the restaurant owner late in the project", "Scope", 2, 3],
  ["R11", "Demo server runs on a personal machine (URL changes, data loss on hard stop)", "Operations", 3, 3],
  ["R12", "Google sign-in depends on the SHA-1 of the build machine", "Technical / configuration", 3, 2],
];
const lvl = (s) => (s >= 15 ? "High" : s >= 8 ? "Medium" : "Low");
const ranked = risks.map((r) => [...r, r[3] * r[4]]).sort((a, b) => b[5] - a[5]);
const p4 = [
  H1("PART 4. RISK MANAGEMENT PLAN"),
  H2("I. List of methods used for risk identification"),
  bullet([B("Brainstorming "), t("in Sprint Planning and Retrospectives with all four members.")]),
  bullet([B("Checklist analysis "), t("of common risks in mobile/web projects (security, third-party APIs, performance, team skills).")]),
  bullet([B("Assumption and constraint analysis "), t("of the charter (free tiers only, 12-week deadline, four members).")]),
  bullet([B("Dependency / schedule analysis "), t("of the PERT network (critical path, float).")]),
  bullet([B("Prototyping and technical spikes "), t("on Casso webhooks, Mapbox routing and MobileNetV2 before committing to the design.")]),
  bullet([B("Beta testing on real devices "), t("(15/11/2026), which revealed R11 and R12 and confirmed R04, R06 and R09.")]),
  H2("II. List of identified risks"),
  caption("Identified risks"),
  table(["ID", "Risk description", "Category"], risks.map((r) => [r[0], r[1], r[2]]), [0.5, 4, 1.5], CW, { center: [0] }),
  H2("III. Risk analysis and prioritization table"),
  P("Probability (P) and Impact (I) are rated from 1 (very low) to 5 (very high); Score = P × I. Levels: 1–7 Low, 8–14 Medium, 15–25 High."),
  caption("Risk analysis and prioritization"),
  table(["Rank", "ID", "Risk", "P", "I", "Score", "Level"],
    ranked.map((r, i) => [i + 1, r[0], r[1], r[3], r[4], r[5], lvl(r[5])]), [0.7, 0.6, 3.3, 0.4, 0.4, 0.7, 0.8], CW,
    { center: [0, 1, 3, 4, 5, 6], rowStyle: (r) => (r[6] === "High" ? { fill: "FBE4E1" } : r[6] === "Medium" ? { fill: "FFF2CC" } : { fill: "E2EFDA" }) }),
  H2("IV. Risk management table"),
  caption("Risk response plan"),
  table(["ID", "Strategy", "Preventive action (mitigation)", "Contingency / trigger", "Owner"], [
    ["R07", "Mitigate", "Revised network (Part 3), weekly SPI tracking, Could-have work first to be cut", "SPI < 0.9 → cut N scope, re-plan sprint", "Huy"],
    ["R02", "Avoid", "Firestore transaction with status check (optimistic locking) on accept", "Second driver receives “order already taken”", "Bảo"],
    ["R01", "Mitigate", "CR-01: /check-payment polling every 4–5 s + “I have paid” button; idempotent webhook with Secure-Token", "Webhook delay > 30 s → polling confirms; admin can verify manually", "Bảo"],
    ["R05", "Mitigate", "Pair programming (Tiến–Minh on Flutter), short tutorials, early spikes", "Task > 2 days late → re-assign or pair", "Huy"],
    ["R09", "Mitigate", "CI on every PR, API contract first, integration test each sprint, install builds on real phones", "Failing E2E → bug-fix sprint day, freeze new features", "Tiến"],
    ["R06", "Avoid", ".env + .gitignore, secrets only on the backend, inspect every APK, never share personal tokens", "Leak detected → revoke and rotate keys immediately", "Tiến"],
    ["R03", "Mitigate", "Data augmentation, Top-3 suggestions, ImageNet fallback mapper", "Low confidence → show Top-3 and let user choose", "Bảo"],
    ["R04", "Mitigate", "Cache Mapbox routes, debounce search; fallbacks Mapbox → OSM/Nominatim → coordinates", "Quota/key error → switch provider automatically", "Tiến"],
    ["R11", "Mitigate", "Server URL editable in the apps; save emulator data before stop and every 10 min; move to the team home server", "Hard stop → restore last export; announce new URL", "Tiến / Huy"],
    ["R08", "Accept / Mitigate", "Measure with evaluate.py each training round; more data for weak classes", "Below target → report honestly, keep Top-3 + fallback", "Bảo"],
    ["R10", "Mitigate", "Formal change control (CR form, CCB, impact analysis)", "Change approved only if critical path is not affected", "Huy"],
    ["R12", "Mitigate", "Document SHA-1 registration in README; build releases on the registered machine", "Google sign-in error code 10 → add the build machine's SHA-1", "Tiến"],
  ], [0.5, 0.9, 2.6, 2.1, 0.6], CW, { center: [0, 1, 4], size: 20 }),
  H2("V. Risks that materialised during the beta test (15/11/2026)"),
  caption("Risks that actually occurred and the response taken"),
  table(["ID", "What happened", "Response", "Status"], [
    ["R06", "A Gemini API key was hard-coded in the customer app source (public repository and APK); personal GitHub tokens were shared in chat", "Chatbot moved behind the backend (/api/ai/chat, 20 req/min/IP); key removed from the code; APK checked to contain public tokens only", "Old key and tokens must still be revoked (issue #45)"],
    ["R04", "No OpenCage key / Mapbox token in the app: address picker stuck on “loading”, grey maps", "Multi-level fallback Mapbox → OpenStreetMap/Nominatim → coordinates; public Mapbox token added", "Controlled"],
    ["R09", "Customer APK could not start (MainActivity missing); Google sign-in web-only; receipt scan rejected images", "Fixed and re-released the same day; 22/22 automated tests", "Controlled"],
    ["R11", "Demo server stopped before saving: test data between 19:04 and 20:02 was lost", "Script now exports data before stopping and every 10 minutes", "Monitoring (issue #48)"],
  ], [0.5, 2.4, 2.4, 1.2], CW, { center: [0], size: 20 }),
];

// ================= PART 5 =================
const order = REV.order;
const planRows = order.map((n) => [n, vnd(ro[n].hours * data.rate), ro[n].hours,
  ...data.per_act_week[n].map((h) => (h > 0 ? (h * data.rate / 1e6).toFixed(2) : ""))]);
planRows.push(["PV / week", vnd(data.BAC), 1480, ...data.pv_week.map((v) => mil(v))]);
planRows.push(["Cumulative PV", "", "", ...data.pv_cum.map((v) => mil(v))]);
const p5land = [
  H1("PART 5. PROJECT PROGRESS AND COST ASSESSMENT USING EVM APPROACH"),
  H2("I. Scheduled plan"),
  P(`The cost baseline is derived from the WBS effort and the revised Gantt chart: the effort of each activity is spread evenly over its working days, at an assumed blended rate of ${vnd(data.rate)} VND per person-hour. The total budget (BAC) is ${vnd(data.BAC)} VND over 12 weeks. Values per week are in million VND.`),
  caption("Planned value per activity and per week (million VND)"),
  table(["ID", "Cost (VND)", "Hours", ...Array.from({ length: 12 }, (_, i) => `W${i + 1}`)], planRows,
    [0.9, 1.2, 0.6, ...Array(12).fill(0.62)], CWL, { center: Array.from({ length: 15 }, (_, i) => i), size: 17, pad: 15,
      rowStyle: (r) => (String(r[0]).includes("PV") ? { bold: true, fill: "F2F2F2" } : {}) }),
];
const p5 = [
  H2("II. Analysis table of actual situation at the end of Week 6"),
  note("Note – assumed scenario.", "The team did not record actual person-hours per activity during Weeks 1–6. The values of “% complete” and “actual hours” below are therefore an assumed scenario used to demonstrate the EVM analysis; they are not measured data. PV is computed from the real baseline above."),
  P(`Status date: end of Week 6 (working day 30, ${W6.date}). Situation assumed: the backend core (A–D) and the customer app home/menu (F) are finished with some overrun of effort; VietQR/Casso (E) is half done because webhook delivery was unstable (risk R01); the AI service (K) is 60% done; checkout (G), shipper app (H) and admin (J) have just started.`),
  caption("Actual situation at the end of Week 6 (assumed scenario)"),
  table(["ID", "Activity", "BAC (VND)", "Planned %", "Actual %", "PV (VND)", "EV (VND)", "AC (VND)"],
    [...W6.rows.map((r) => [r.id, r.name, vnd(r.bac), r.plan_pct + "%", r.act_pct + "%", vnd(r.PV), vnd(r.EV), vnd(r.AC)]),
      ["", "Total", vnd(data.BAC), "", "", vnd(W6.PV), vnd(W6.EV), vnd(W6.AC)]],
    [0.4, 2.0, 1.1, 0.85, 0.75, 1.1, 1.1, 1.1], CW, { center: [0, 3, 4], size: 19, rowStyle: (r) => (r[1] === "Total" ? { bold: true, fill: "F2F2F2" } : {}) }),
  H2("III. Analyze the parameters"),
  P(`At the end of Week 6: PV = ${vnd(W6.PV)} VND, EV = ${vnd(W6.EV)} VND, AC = ${vnd(W6.AC)} VND, BAC = ${vnd(data.BAC)} VND, planned duration (SAC) = ${W6.SAC} weeks.`),
  H3("3.1. CV (Cost Variance)"),
  P(`CV = EV − AC = ${vnd(W6.EV)} − ${vnd(W6.AC)} = ${vnd(W6.CV)} VND. CV < 0: the work done so far cost more than budgeted (over budget).`),
  H3("3.2. SV (Schedule Variance)"),
  P(`SV = EV − PV = ${vnd(W6.EV)} − ${vnd(W6.PV)} = ${vnd(W6.SV)} VND. SV < 0: less work was completed than planned (behind schedule).`),
  H3("3.3. CPI (Cost Performance Index)"),
  P(`CPI = EV / AC = ${vnd(W6.EV)} / ${vnd(W6.AC)} = ${W6.CPI.toFixed(3)}. Each 1,000 VND spent produced only ${(W6.CPI * 1000).toFixed(0)} VND of planned value.`),
  H3("3.4. SPI (Schedule Performance Index)"),
  P(`SPI = EV / PV = ${vnd(W6.EV)} / ${vnd(W6.PV)} = ${W6.SPI.toFixed(3)}. The team is progressing at ${(W6.SPI * 100).toFixed(1)}% of the planned rate.`),
  H3("3.5. IEAC (Independent Estimate at Completion)"),
  P(`IEAC = BAC / CPI = ${vnd(data.BAC)} / ${W6.CPI.toFixed(3)} = ${vnd(W6.IEAC)} VND (assuming the current cost efficiency continues). Estimate to complete: ETC = IEAC − AC = ${vnd(W6.ETC)} VND.`),
  H3("3.6. VAC (Variance at Completion)"),
  P(`VAC = BAC − IEAC = ${vnd(data.BAC)} − ${vnd(W6.IEAC)} = ${vnd(W6.VAC)} VND. The project is forecast to finish about ${vnd(-W6.VAC)} VND (${(-W6.VAC / data.BAC * 100).toFixed(1)}%) over budget.`),
  H3("3.7. ISAC (Independent Schedule at Completion)"),
  P(`ISAC = SAC / SPI = ${W6.SAC} / ${W6.SPI.toFixed(3)} = ${W6.ISAC.toFixed(2)} weeks, i.e. about ${(W6.ISAC - W6.SAC).toFixed(1)} weeks later than planned if the current rate continues.`),
  caption("Summary of EVM parameters at the end of Week 6 (assumed scenario)"),
  table(["Parameter", "Formula", "Value", "Meaning"], [
    ["PV", "Planned", vnd(W6.PV), "Planned value to date"], ["EV", "Σ BAC × % complete", vnd(W6.EV), "Value of work done"], ["AC", "Actual cost", vnd(W6.AC), "Cost incurred"],
    ["CV", "EV − AC", vnd(W6.CV), W6.CV < 0 ? "Over budget" : "Under budget"], ["SV", "EV − PV", vnd(W6.SV), W6.SV < 0 ? "Behind schedule" : "Ahead of schedule"],
    ["CPI", "EV / AC", W6.CPI.toFixed(3), W6.CPI < 1 ? "Cost inefficient" : "Cost efficient"], ["SPI", "EV / PV", W6.SPI.toFixed(3), W6.SPI < 1 ? "Slower than plan" : "Faster than plan"],
    ["IEAC", "BAC / CPI", vnd(W6.IEAC), "Forecast total cost"], ["VAC", "BAC − IEAC", vnd(W6.VAC), "Forecast overrun"], ["ISAC", "SAC / SPI", W6.ISAC.toFixed(2) + " weeks", "Forecast duration"],
  ], [0.8, 1.4, 1.4, 1.6], CW, { center: [0, 1, 2] }),
  H2("IV. Project Status Description"),
  H3("4.1. Demonstration"),
  ...figure("scurve.png", 600, 306, "Cumulative PV, EV and AC up to Week 6 (EV and AC assumed)"),
  P("The EV curve lies below PV from Week 4 onwards (behind schedule) and AC lies above EV (over budget). The gap widens in Weeks 5–6, when E (VietQR & Casso) was slowed down by unstable webhooks and F needed more effort than estimated."),
  H3("4.2. Plotting CPI, SPI and evaluating the Status of Project at the end of Week 6"),
  ...figure("cpi_spi.png", 600, 267, "CPI and SPI trend, Weeks 1–6 (assumed scenario)"),
  P(`Both indices are below 1 at the end of Week 6 (CPI = ${W6.CPI.toFixed(2)}, SPI = ${W6.SPI.toFixed(2)}): the project is behind schedule and over budget. The downward trend from Week 3 indicates a systematic cause rather than a one-off event. The critical-path activities A, B, C and F are complete, so the schedule gap comes mainly from E (12.5 days float), G (critical, just started) and K (15 days float).`),
  H3("4.3. Prediction of Budget and Schedule for Project Completion"),
  bullet(`Budget: if the current efficiency continues, the project will cost about ${vnd(W6.IEAC)} VND instead of ${vnd(data.BAC)} VND (VAC = ${vnd(W6.VAC)} VND).`),
  bullet(`Schedule: at the current rate the project needs about ${W6.ISAC.toFixed(1)} weeks instead of 12, i.e. it would end after the defence date.`),
  P("Corrective actions:"),
  bullet([B("Protect the critical path: "), t(`move ${ROLE.BAO} from K (15 days float) to help with G and E for one week; K can absorb the delay.`)]),
  bullet([B("Apply CR-01 early: "), t("implement payment polling so that E no longer depends on webhook stability (risk R01).")]),
  bullet([B("Reduce scope in N: "), t("defer Could-have items (chatbot polish, receipt scan) if SPI is still < 0.95 at the end of Week 8.")]),
  bullet([B("Improve cost efficiency: "), t("pair programming on Flutter tasks and API-contract-first development to reduce rework.")]),
  bullet([B("Monitor weekly: "), t("recompute CPI/SPI at each Sprint Review; trigger re-planning when either index drops below 0.9.")]),
];

// ================= APPENDIX A =================
const appA = [
  H1("APPENDIX A. PROJECT STATUS UPDATE (15/11/2026)"),
  H2("I. Beta release v1.1.0-beta"),
  bullet([B("Deliverable: "), t("two Android APKs (Customer, Driver; Android 7.0+, arm64) and SHA-256 checksums on GitHub Releases (pre-release v1.1.0-beta).")]),
  bullet([B("Demo server: "), t("scripts/serve-demo.sh starts the Firestore Emulator, the backend and a Cloudflare Quick Tunnel; the apps let the tester enter the current server URL.")]),
  bullet([B("Build constraints solved: "), t("Gradle 8.14 / AGP 8.11 / Kotlin 2.2 required by the current Flutter; Gradle memory limited to 2 GB and arm64-only builds to avoid out-of-memory kills.")]),
  H2("II. Verification results"),
  caption("Verification performed on 15/11/2026"),
  table(["Check", "Result"], [
    ["Backend automated tests (npm test)", "22/22 pass — API (401/403, forged JWT, webhook token & idempotency, AI chat), Casso parsing, role check, image MIME detection"],
    ["CI (GitHub Actions)", "Backend tests, Admin build, flutter analyze + test for both apps"],
    ["End-to-end flow through the real API", "Customer login → cart → order → webhook PAID (wrong token rejected, duplicate ignored) → admin assigns driver → driver delivers → dashboard revenue updated"],
    ["APK inspection", "Version 1.1.0, MainActivity present, only the public Mapbox token inside, no secret keys"],
    ["Manual test on a real phone", "Maps (Da Nang), Google sign-in, ordering and AI receipt scan exercised by the team; full results: [TO BE COMPLETED – issue #49]"],
  ], [1.6, 4], CW, { size: 21 }),
  H2("III. Defects found on real devices"),
  caption("Defects found during the beta test and their fixes"),
  table(["No.", "Defect", "Root cause", "Fix"], [
    ["1", "Customer app does not start", "MainActivity.kt never committed", "Added MainActivity"],
    ["2", "Delivery address stuck on “loading”", "No OpenCage key, error not handled", "Mapbox → Nominatim → coordinates"],
    ["3", "Grey map", "No Mapbox token", "Public Mapbox token; OSM tiles as fallback"],
    ["4", "860 km delivery route", "Sample branch located in Ho Chi Minh City", "Sample branch moved to Da Nang"],
    ["5", "AI receipt scan: GEMINI_API_KEY missing", "Key not configured on the backend", "Key configured server-side"],
    ["6", "AI receipt scan: unsupported MIME type", "Upload sent without Content-Type", "Detect image type from magic bytes"],
    ["7", "Google sign-in error on Android", "signInWithPopup works on web only", "Native google_sign_in + Firebase project guga-27d3f + SHA-1"],
    ["8", "Dish images missing", "Sample data had image = null", "Matched 43 team images on Cloudinary to 28/30 dishes"],
    ["9", "“Nearby restaurants” not clickable", "Hard-coded fake list, no tap handler", "Real branches from the API; tap selects branch and opens menu"],
    ["10", "Invalid or expired token", "JWT secret changed after a restart", "Fixed secret in backend .env; auto-logout planned (issue #46)"],
  ], [0.4, 1.8, 2, 2.3], CW, { center: [0], size: 20 }),
  H2("IV. Open work"),
  caption("Open issues after the beta"),
  table(["Issue", "Work", "Owner"], [
    ["#45", "Revoke the leaked Gemini key and shared GitHub tokens", ROLE.TIEN],
    ["#46", "Automatic logout when the session expires (401)", ROLE.MINH],
    ["#47", "Host the PyTorch AI service so camera dish recognition works", ROLE.BAO],
    ["#48", "Move the demo server to the team home server", ROLE.HUY],
    ["#49", "Manual test on phones and record the results", ROLE.HUY],
    ["#50", "Sync main → develop, enable branch protection, fix the release tag", ROLE.TIEN],
    ["#38 / #39", "Mid-term EVM with real effort data; UAT with sign-off", ROLE.HUY],
  ], [0.8, 4, 1.4], CW, { center: [0] }),
  H2("V. Lessons learned from the beta"),
  bullet([B("Test on real devices. "), t("Green CI and static analysis did not reveal that the customer app could not start at all.")]),
  bullet([B("Never ship secrets in a mobile app. "), t("Everything inside an APK can be extracted; secret keys belong on the backend.")]),
  bullet([B("Operational scripts are part of the product. "), t("An unscripted shutdown lost one hour of test data; start/stop procedures must be automated and tested.")]),
  bullet([B("Process must be enforced by tooling. "), t("Pull requests were merged without review until branch protection is enabled (issue #50).")]),
];

// ================= DOCUMENT =================
const hd = (size, extra = {}) => ({ run: { font: FONT, size, bold: true, color: "000000" }, paragraph: { keepNext: true, ...extra } });
const footer = () => ({ default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ font: FONT, children: [PageNumber.CURRENT] })] })] }) });
const page = (land) => ({ size: { width: A4.w, height: A4.h, ...(land ? { orientation: PageOrientation.LANDSCAPE } : {}) }, margin: { top: M, bottom: M, left: M, right: M } });
const doc = new Document({
  creator: "GuGuGaGa team", title: "Major Assignment – Software Project Management – GuGuGaGa (v2)",
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: 26 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, ...hd(32, { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER, outlineLevel: 0 }) },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, ...hd(28, { spacing: { before: 240, after: 120 }, outlineLevel: 1 }) },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, ...hd(26, { spacing: { before: 200, after: 100 }, outlineLevel: 2 }) },
    ],
  },
  numbering: { config: [{ reference: "bul", levels: [0, 1].map((l) => ({ level: l, format: LevelFormat.BULLET, text: l ? "◦" : "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720 + l * 360, hanging: 360 } } } })) }] },
  sections: [
    { properties: { page: page(false) }, children: cover },
    { properties: { page: { ...page(false), pageNumbers: { start: 1 } } }, footers: footer(), children: [...front, ...p1, ...p2, ...p3, ...p4] },
    { properties: { page: page(true) }, footers: footer(), children: p5land },
    { properties: { page: page(false) }, footers: footer(), children: [...p5, ...appA] },
  ],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("written", OUT, "tables", tableNo, "figures", figNo); });
