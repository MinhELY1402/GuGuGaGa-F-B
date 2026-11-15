// Chuyển Markdown (tập con GFM: heading, đoạn, list, bảng, quote, **đậm**, *nghiêng*, `code`) sang .docx.
// Dùng: node md2docx.js <input.md> <output.docx>   (hoặc: npm run report)
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, LevelFormat, Footer, PageNumber,
} = require("docx");

const [, , input, output] = process.argv;
if (!input || !output) { console.error("Dùng: node md2docx.js <input.md> <output.docx>"); process.exit(1); }
const lines = fs.readFileSync(input, "utf8").split("\n");
const FONT = "Times New Roman";
const PAGE_W = 11906, MARGIN = 1134; // A4, lề 2 cm
const CONTENT_W = PAGE_W - 2 * MARGIN;

// Đổi LaTeX thông dụng sang ký hiệu Unicode dễ đọc trong Word
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "+": "⁺" };
function latex(t) {
  let prev;
  do {
    prev = t;
    t = t.replace(/\\(?:mathbf|text|mathrm|textbf|operatorname)\{([^{}]*)\}/g, "$1")
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1) / ($2)")
      .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
      .replace(/_\{([^{}]*)\}/g, "_$1");
  } while (t !== prev);
  return t
    .replace(/\\(?:left|right)/g, "")
    .replace(/\\rightarrow|\\to\b/g, "→").replace(/\\leftrightarrow/g, "↔").replace(/\\implies/g, "⇒")
    .replace(/\\approx/g, "≈").replace(/\\times/g, "×").replace(/\\cdot/g, "·")
    .replace(/\\ge(q)?\b/g, "≥").replace(/\\le(q)?\b/g, "≤").replace(/\\sum/g, "Σ").replace(/\\sigma/g, "σ")
    .replace(/\\q?quad/g, "   ").replace(/\\%/g, "%").replace(/\\[,;: ]/g, " ")
    .replace(/\^\{?([0-9+-]+)\}?/g, (_, d) => [...d].map((c) => SUP[c] || c).join(""))
    .replace(/\$\$?/g, "").replace(/\s{2,}/g, " ");
}
const plain = (t) => latex(t);
function inline(text, base = {}) {
  const runs = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) runs.push(new TextRun({ text: plain(text.slice(last, m.index)), font: FONT, ...base }));
    const tok = m[0];
    if (tok.startsWith("**")) runs.push(new TextRun({ text: plain(tok.slice(2, -2)), bold: true, font: FONT, ...base }));
    else if (tok.startsWith("`")) runs.push(new TextRun({ text: tok.slice(1, -1), ...base, font: "Consolas", size: (base.size || 24) - 4 }));
    else if (tok.startsWith("[")) { const mm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/); runs.push(new TextRun({ text: `${plain(mm[1])} (${mm[2]})`, font: FONT, ...base })); }
    else runs.push(new TextRun({ text: plain(tok.slice(1, -1)), italics: true, font: FONT, ...base }));
    last = m.index + tok.length;
  }
  if (last < text.length) runs.push(new TextRun({ text: plain(text.slice(last)), font: FONT, ...base }));
  return runs;
}

const border = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
function buildTable(rows) {
  const cells = rows.map((r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  const header = cells[0], body = cells.slice(2), n = header.length;
  const lens = header.map((_, i) => Math.max(...[header, ...body].map((r) => (r[i] || "").length), 4));
  const total = lens.reduce((a, b) => a + b, 0);
  let widths = lens.map((l) => Math.max(Math.round((l / total) * CONTENT_W), Math.round(CONTENT_W * 0.14)));
  const scale = CONTENT_W / widths.reduce((a, b) => a + b, 0);
  widths = widths.map((w) => Math.floor(w * scale));
  widths[n - 1] += CONTENT_W - widths.reduce((a, b) => a + b, 0);
  const mkRow = (r, head) => new TableRow({
    tableHeader: head,
    children: widths.map((w, i) => new TableCell({
      borders, width: { size: w, type: WidthType.DXA },
      shading: head ? { fill: "D9E2F3", type: ShadingType.CLEAR, color: "auto" } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: inline(r[i] || "", { size: 22, bold: head || undefined }) })],
    })),
  });
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths,
    rows: [mkRow(header, true), ...body.map((r) => mkRow(r, false))] });
}

const children = [];
let i = 0, numInstance = 0;
while (i < lines.length) {
  const line = lines[i], t = line.trim();
  if (!t || t === "---") { i++; continue; }
  if (t.startsWith("```mermaid")) {
    // Sơ đồ mermaid không dựng được trong Word: thay bằng ghi chú dẫn tới hình trong báo cáo v2
    const kind = (lines[i + 1] || "").trim().split(/\s+/)[0];
    const ref = kind === "gantt" ? "Gantt chart (Figure 3)" : kind === "graph" && /LR/.test(lines[i + 1]) ? "PERT network (Figures 1–2)" : "WBS (Part 2)";
    i++; while (i < lines.length && !lines[i].trim().startsWith("```")) i++; i++;
    children.push(new Paragraph({ indent: { left: 360 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: "4472C4", space: 8 } },
      children: [new TextRun({ text: `[Sơ đồ — xem ${ref} trong docs/Major_Assignment_SPM_GuGuGaGa_v2.docx]`, italics: true, font: FONT, color: "4472C4" })] }));
    continue;
  }
  if (t.startsWith("```")) { i++; while (i < lines.length && !lines[i].trim().startsWith("```")) { children.push(new Paragraph({ children: [new TextRun({ text: lines[i], font: "Consolas", size: 18 })] })); i++; } i++; continue; }
  if (t.startsWith("|")) { const rows = []; while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(lines[i++]); children.push(buildTable(rows)); children.push(new Paragraph({ children: [] })); continue; }
  let m;
  if ((m = t.match(/^(#{1,4}) (.*)$/))) {
    const lvl = m[1].length, sub = lvl === 2 && i < 5;
    children.push(new Paragraph({
      heading: lvl === 1 ? HeadingLevel.TITLE : sub ? undefined : [null, null, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][lvl],
      alignment: lvl === 1 || sub ? AlignmentType.CENTER : undefined,
      children: [new TextRun({ text: plain(m[2]), bold: true, size: sub ? 28 : undefined, font: FONT })],
    }));
    i++; continue;
  }
  if (t.startsWith(">")) { children.push(new Paragraph({ indent: { left: 360 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: "4472C4", space: 8 } }, children: inline(t.replace(/^>\s?/, ""), { italics: true }) })); i++; continue; }
  if ((m = line.match(/^(\s*)[-*] (.*)$/))) { children.push(new Paragraph({ numbering: { reference: "bullets", level: Math.min(Math.floor(m[1].length / 2), 2) }, children: inline(m[2]) })); i++; continue; }
  if ((m = line.match(/^(\s*)\d+\. (.*)$/))) { if (i === 0 || !/^\s*\d+\. /.test(lines[i - 1])) numInstance++; children.push(new Paragraph({ numbering: { reference: "numbers", level: 0, instance: numInstance }, children: inline(m[2]) })); i++; continue; }
  while (i < lines.length && lines[i].trim() && !/^(#|\||>|\s*[-*] |\s*\d+\. |---|```)/.test(lines[i].trim())) { children.push(new Paragraph({ children: inline(lines[i].trim()) })); i++; }
}

const hd = (size) => ({ run: { font: FONT, size, bold: true, color: "1F3864" } });
const doc = new Document({
  creator: "GuGuGaGa", title: (lines.find((l) => l.startsWith("# ")) || "# GuGuGaGa").slice(2).trim(),
  styles: {
    default: { document: { run: { font: FONT, size: 24 }, paragraph: { spacing: { after: 100, line: 300 } } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { font: FONT, size: 32, bold: true, color: "1F3864" }, paragraph: { spacing: { before: 0, after: 120 }, alignment: AlignmentType.CENTER, keepNext: true } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, ...hd(28), paragraph: { spacing: { before: 360, after: 120 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, ...hd(26), paragraph: { spacing: { before: 240, after: 100 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, ...hd(24), paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: "bullets", levels: [0, 1, 2].map((l) => ({ level: l, format: LevelFormat.BULLET, text: ["•", "◦", "▪"][l], alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720 + l * 360, hanging: 360 } } } })) },
    { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ] },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 20 })] })] }) },
    children,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(output, b); console.log("written", output); });
