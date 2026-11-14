#!/usr/bin/env bash
# Tạo label, milestone và issue cho giai đoạn QTDA (mini-sprint A/B/C).
# Yêu cầu: đăng nhập bằng tài khoản GitHub của chính bạn: `gh auth login -h github.com`
# Chạy:    bash tasks/create_qtda_issues.sh            (thật)
#          DRY_RUN=1 bash tasks/create_qtda_issues.sh  (chỉ in ra, không tạo)
# Đổi hạn milestone bằng biến môi trường DUE_A / DUE_B / DUE_C (YYYY-MM-DD).
set -euo pipefail

REPO="${REPO:-MinhELY1402/GuGuGaGa-F-B}"
DUE_A="${DUE_A:-2026-11-19}"
DUE_B="${DUE_B:-2026-11-24}"
DUE_C="${DUE_C:-2026-11-29}"

# Tài khoản GitHub của các thành viên
HUY="HuyVo117"; TIEN="JunCodera1"; MINH="MinhELY1402"; BAO="giabaoqh"

run() { if [[ "${DRY_RUN:-0}" == 1 ]]; then echo "[dry-run] $*" | head -c 160; echo; else "$@"; fi; }

# ---------- Labels ----------
label() { run gh label create "$1" -R "$REPO" --color "$2" --description "$3" --force >/dev/null; }
label "type: feature"   "1D76DB" "Tính năng mới"
label "type: bug"       "D73A4A" "Lỗi"
label "type: test"      "0E8A16" "Kiểm thử"
label "type: docs"      "0075CA" "Tài liệu / hồ sơ QLDA"
label "type: infra"     "5319E7" "CI/CD, hạ tầng, cấu hình repo"
label "type: security"  "B60205" "Bảo mật"
label "area: backend"   "C5DEF5" "Backend Node.js"
label "area: mobile"    "BFD4F2" "Flutter (khách hàng / tài xế)"
label "area: admin"     "D4C5F9" "Admin web React"
label "area: ai"        "F9D0C4" "AI Service"
label "area: pm"        "FEF2C0" "Quản lý dự án"
label "priority: high"  "B60205" "Ưu tiên cao"
label "priority: medium" "FBCA04" "Ưu tiên trung bình"
label "priority: low"   "0E8A16" "Ưu tiên thấp"
label "moscow: must"    "000000" "Must-have"
label "moscow: should"  "555555" "Should-have"
label "moscow: could"   "AAAAAA" "Could-have"
for sp in 1 2 3 5 8; do label "sp: $sp" "EDEDED" "Story point $sp"; done

# ---------- Milestones ----------
milestone() { # title due description
  if [[ "${DRY_RUN:-0}" == 1 ]]; then echo "[dry-run] milestone $1 ($2)"; return; fi
  if ! gh api "repos/$REPO/milestones?state=all&per_page=100" --jq '.[].title' | grep -qxF "$1"; then
    gh api "repos/$REPO/milestones" -f title="$1" -f due_on="${2}T23:59:59Z" -f description="$3" >/dev/null
  fi
}
milestone "QTDA-A" "$DUE_A" "Re-baseline hồ sơ, khôi phục backend, test + CI thật"
milestone "QTDA-B" "$DUE_B" "Đo AI, đo CR-01, EVM giữa kỳ, sửa warning Flutter"
milestone "QTDA-C" "$DUE_C" "UAT thật, Release, báo cáo & slide cuối"

# ---------- Issues ----------
issue() { # title milestone assignee labels(comma) body
  local args=(-R "$REPO" --title "$1" --milestone "$2" --assignee "$3" --body "$5")
  IFS=',' read -ra L <<< "$4"; for l in "${L[@]}"; do args+=(--label "$l"); done
  run gh issue create "${args[@]}"
}

issue "[QTDA-A] Khôi phục router user/admin bị thiếu, tách app.js" "QTDA-A" "$TIEN" \
"type: bug,area: backend,priority: high,moscow: must,sp: 3" \
"## Bối cảnh
\`Backend/src/server.js\` import \`routes/user.route.js\` và \`routes/admin.route.js\` nhưng hai file này không có trong repo, nên backend không khởi động được.

## Việc cần làm
- [ ] Dựng lại \`user.route.js\` (auth, carts, orders, notifications, webhook Casso)
- [ ] Dựng lại \`admin.route.js\` (auth, CRUD, dashboard, upload), bảo vệ bằng \`protectRoute\` + \`checkRole(\"ADMIN\")\`
- [ ] Tách \`src/app.js\` khỏi \`server.js\`, thêm \`GET /health\`

## Tiêu chí nghiệm thu
- Server khởi động; \`GET /health\` → 200
- Route cần đăng nhập trả 401 khi thiếu token
- Đường dẫn khớp với Admin web và 2 app Flutter

**WBS:** 1.2.1, 1.2.3 · **Ước lượng:** 4h"

issue "[QTDA-A] Thay test giả bằng test thật và cho CI chạy test" "QTDA-A" "$TIEN" \
"type: test,type: infra,area: backend,priority: high,moscow: must,sp: 5" \
"## Bối cảnh
Test cũ chỉ kiểm tra hằng số; job CI backend chỉ chạy \`console.log\`.

## Việc cần làm
- [ ] API test bằng supertest (401/403, JWT giả, webhook)
- [ ] Unit test đối soát Casso và \`checkRole\`
- [ ] Script \`npm test\`
- [ ] CI: backend \`npm test\`, Admin \`npm run build\`, Flutter \`analyze\` + \`test\` cho 2 app

## Tiêu chí nghiệm thu
- \`npm test\` pass trên máy và trên Actions
- PR vào \`develop\` bị chặn nếu CI đỏ

**WBS:** 1.1.1, 1.7.1 · **Ước lượng:** 6h"

issue "[QTDA-A] Webhook Casso: kiểm tra Secure-Token và idempotency" "QTDA-A" "$BAO" \
"type: security,area: backend,priority: high,moscow: must,sp: 2" \
"## Bối cảnh
Tiêu chí nghiệm thu WBS 1.2.4 yêu cầu webhook sai token trả 401; code hiện chưa kiểm tra.

## Việc cần làm
- [ ] Đọc \`CASSO_SECURE_TOKEN\` từ env, so khớp header \`Secure-Token\`
- [ ] Tách logic đối soát sang \`src/utils/casso.js\`
- [ ] Test: sai token → 401; webhook gửi lại không cập nhật lần 2

## Tiêu chí nghiệm thu
- Các test trên pass trong CI
- \`.env.example\` có biến mới

**WBS:** 1.2.4 · **Ước lượng:** 2h"

issue "[QTDA-A] Bật branch protection và dựng Project board" "QTDA-A" "$TIEN" \
"type: infra,area: pm,priority: high,moscow: must,sp: 1" \
"## Việc cần làm
- [ ] Bảo vệ \`main\` và \`develop\`: bắt buộc PR, 1 approval, CI xanh, cấm force-push
- [ ] GitHub Project: Backlog / Ready / In Progress / In Review / Done
- [ ] Gắn toàn bộ issue QTDA vào board

## Tiêu chí nghiệm thu
- Push thẳng vào \`develop\` bị từ chối
- Board hiển thị đủ issue theo milestone

**Ước lượng:** 1h"

issue "[QTDA-A] Re-baseline hồ sơ QLDA theo Pathway 1" "QTDA-A" "$HUY" \
"type: docs,area: pm,priority: high,moscow: must,sp: 5" \
"## Việc cần làm
- [ ] \`docs/00_Project_History.md\` (ĐACN1 → repo QTDA)
- [ ] \`docs/02_Project_Management_Plan.md\`
- [ ] Sửa Charter, MoSCoW (17 Must / 920h), slide
- [ ] Bỏ các tuyên bố không có căn cứ (velocity, UAT 16/16, chữ ký)
- [ ] Cập nhật Risk Register (R07–R10)

## Tiêu chí nghiệm thu
- Charter, WBS, Gantt và slide dùng chung một dòng thời gian
- Mọi con số đều có nguồn

**Ước lượng:** 6h"

issue "[QTDA-A] Gom bằng chứng Đồ án chuyên ngành 1" "QTDA-A" "$MINH" \
"type: docs,area: pm,priority: high,moscow: must,sp: 2" \
"## Việc cần làm
- [ ] Đề cương / báo cáo / slide ĐACN1 của GuGuGaGa, tên GVHD
- [ ] Link repo hoặc thư mục code gốc
- [ ] Ảnh nhóm chat, lịch họp có ngày
- [ ] Log hoặc tin nhắn về sự cố webhook Casso (căn cứ cho CR-01)

## Tiêu chí nghiệm thu
- Các mục \`[CẦN BỔ SUNG]\` trong \`docs/00_Project_History.md\` có link bằng chứng

**Ước lượng:** 3h"

issue "[QTDA-A] Sprint Planning + Review + Retro cho QTDA-A" "QTDA-A" "$HUY" \
"type: docs,area: pm,priority: medium,moscow: must,sp: 1" \
"## Việc cần làm
- [ ] Biên bản Planning (issue chọn, story point, phân công)
- [ ] Review: demo, ảnh chụp
- [ ] Retro theo 4Ls, ghi vào \`docs/05_Sprint_Retrospectives.md\`

**Ước lượng:** 2h"

issue "[QTDA-B] Đo accuracy và latency của model AI" "QTDA-B" "$BAO" \
"type: test,area: ai,priority: high,moscow: could,sp: 5" \
"## Việc cần làm
- [ ] Chạy \`python AI_Service/evaluate.py --data-dir <dataset>\` trên test set
- [ ] Commit \`models/eval_report.json\`
- [ ] Đính kèm \`food_classifier.pth\` vào Release hoặc Drive
- [ ] Ghi kết quả vào báo cáo; nếu chưa đạt ngưỡng thì cập nhật R08

## Tiêu chí nghiệm thu (WBS 1.6.2)
- Có số đo thật cho Top-1 (≥ 80%), Top-3 (≥ 92%), kích thước (≤ 15MB), latency CPU p95 (≤ 500ms)

**Ước lượng:** 6h"

issue "[QTDA-B] Đo hiệu quả CR-01 (thời gian xác nhận thanh toán)" "QTDA-B" "$BAO" \
"type: test,area: backend,priority: medium,moscow: must,sp: 3" \
"## Việc cần làm
- [ ] Đo thời gian webhook → PAID (mục tiêu ≤ 1,5s)
- [ ] Đo thời gian polling → PAID
- [ ] Ghi số liệu vào \`docs/06_Scope_Change_Control_Record.md\`

**Ước lượng:** 3h"

issue "[QTDA-B] Sửa warning Flutter và lỗi asset .env" "QTDA-B" "$MINH" \
"type: bug,area: mobile,priority: low,moscow: should,sp: 2" \
"## Bối cảnh
\`flutter analyze\`: app khách hàng có 27 info/warning, app tài xế có 21 (\`withOpacity\` deprecated, asset \`.env\` không tồn tại, tham số không dùng).

## Tiêu chí nghiệm thu
- Không còn warning; giảm info đáng kể
- Có \`.env.example\` cho 2 app

**Ước lượng:** 3h"

issue "[QTDA-B] Viết widget test cho app khách hàng" "QTDA-B" "$MINH" \
"type: test,area: mobile,priority: medium,moscow: should,sp: 3" \
"## Việc cần làm
- [ ] Tạo thư mục \`gugugaga/test/\`
- [ ] Test màn hình đăng nhập và giỏ hàng (tính tổng tiền + phí ship)

## Tiêu chí nghiệm thu
- \`flutter test\` pass trong CI

**Ước lượng:** 4h"

issue "[QTDA-B] EVM giữa kỳ + biên bản Sprint QTDA-B" "QTDA-B" "$HUY" \
"type: docs,area: pm,priority: medium,moscow: must,sp: 2" \
"## Việc cần làm
- [ ] Tính PV / EV / AC / SPI / CPI (định nghĩa ở \`docs/02\` §3)
- [ ] Burndown QTDA-A, QTDA-B
- [ ] Biên bản Planning / Review / Retro

**Ước lượng:** 3h"

issue "[QTDA-C] Tổ chức UAT thật và lập biên bản" "QTDA-C" "$HUY" \
"type: test,area: pm,priority: high,moscow: must,sp: 3" \
"## Việc cần làm
- [ ] Chạy 7 kịch bản trong \`docs/07_Stakeholder_Acceptance_Signoff.md\`
- [ ] Ghi rõ người tham gia (khách thật hay nội bộ)
- [ ] Ghi kết quả PASS/FAIL thật, ảnh/video, biên bản có chữ ký thật

**Ước lượng:** 4h"

issue "[QTDA-C] Build APK và tạo GitHub Release v1.1.0" "QTDA-C" "$MINH" \
"type: infra,area: mobile,priority: high,moscow: must,sp: 3" \
"## Việc cần làm
- [ ] Build APK cho app khách hàng và app tài xế
- [ ] Tạo Release v1.1.0 kèm APK, model, changelog

**Ước lượng:** 3h"

issue "[QTDA-C] Triển khai backend lên môi trường demo" "QTDA-C" "$TIEN" \
"type: infra,area: backend,priority: medium,moscow: must,sp: 3" \
"## Việc cần làm
- [ ] Deploy backend (Render / Railway / VPS), cấu hình biến môi trường
- [ ] Đăng ký URL webhook Casso
- [ ] Health check \`/health\`

**WBS:** 1.7.2 · **Ước lượng:** 4h"

issue "[QTDA-C] Hoàn thiện báo cáo tổng kết, slide và đóng dự án" "QTDA-C" "$HUY" \
"type: docs,area: pm,priority: high,moscow: must,sp: 5" \
"## Việc cần làm
- [ ] Điền mọi mục \`[CẦN BỔ SUNG]\` trong \`docs/01\` và \`docs/08\` bằng số đo thật
- [ ] Bảng đóng góp lấy từ GitHub Insights
- [ ] Xuất lại file Word; Retro cuối kỳ; Lessons Learned

**Ước lượng:** 5h"

echo "Hoàn tất."
