#!/usr/bin/env bash
# Xuất toàn bộ tài liệu Markdown sang Word vào docs/word/  (chạy từ thư mục gốc repo)
set -euo pipefail
cd "$(dirname "$0")"
[[ -d node_modules ]] || npm install --no-audit --no-fund >/dev/null
OUT=../../docs/word; mkdir -p "$OUT"
while IFS='|' read -r src name; do
  node md2docx.js "../../$src" "$OUT/$name.docx" 2>/dev/null
done <<'LIST'
Project-Charter.md|00a_Dieu_le_du_an_Project_Charter
docs/00_Project_History.md|00b_Lich_su_du_an
docs/01_Final_Technical_Report.md|01_Bao_cao_tong_ket
docs/02_Project_Management_Plan.md|02_Ke_hoach_quan_ly_du_an
WBS_Project_Management.md|03a_WBS_MoSCoW_RACI_PERT_Gantt
docs/03_WBS_and_WBS_Dictionary.md|03b_WBS_va_Tu_dien_WBS
docs/04_Risk_Register_Evolution.md|04_So_dang_ky_rui_ro
docs/05_Sprint_Retrospectives.md|05_Bien_ban_Sprint_Retrospective
docs/06_Scope_Change_Control_Record.md|06_Kiem_soat_thay_doi_CR-01
docs/07_Stakeholder_Acceptance_Signoff.md|07_Bien_ban_nghiem_thu_UAT
LIST
