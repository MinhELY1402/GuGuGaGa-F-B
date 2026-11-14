#!/usr/bin/env bash
# Tạo issue giai đoạn QTDA từ tasks/qtda_issues.tsv.
# Chạy bằng tài khoản GitHub của chính bạn: gh auth login trước khi chạy.
# Milestone QTDA-A/B/C phải được tạo trước trên GitHub.
set -euo pipefail
REPO="MinhELY1402/GuGuGaGa-F-B"
tail -n +2 "$(dirname "$0")/qtda_issues.tsv" | while IFS=$'\t' read -r title role milestone labels body; do
  label_args=()
  IFS=',' read -ra L <<< "$labels"
  for l in "${L[@]}"; do label_args+=(--label "$l"); done
  gh issue create -R "$REPO" --title "$title" --milestone "$milestone" "${label_args[@]}" \
    --body "$body"$'\n\n'"Người phụ trách dự kiến: $role"
done
