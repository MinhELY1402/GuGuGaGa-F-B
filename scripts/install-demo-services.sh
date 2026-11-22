#!/usr/bin/env bash
# Cài server demo thành service systemd (user) chạy lâu dài, tự bật khi đăng nhập máy:
#   gugugaga-emulator (Firestore Emulator, dữ liệu lưu ở .demo-data/firestore)
#   gugugaga-backend  (Backend, cổng 5000)
#   gugugaga-export.timer (lưu dữ liệu emulator mỗi 5 phút)
# và bật Tailscale Funnel để có link công khai CỐ ĐỊNH (https://<máy>.<tailnet>.ts.net).
# Cần: Node 20+, JDK 21+, tailscale đã đăng nhập (sudo tailscale up) và Funnel được phép bật.
# Chạy:  bash scripts/install-demo-services.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$ROOT/.demo-data"
UNITS="$HOME/.config/systemd/user"
API_PORT="${API_PORT:-5000}"
EMU_PORT="${EMU_PORT:-8085}"
mkdir -p "$UNITS" "$DATA/firestore" "$DATA/logs"

JAVA_HOME_DIR="${JAVA_HOME:-}"
if [[ -z "$JAVA_HOME_DIR" ]]; then
  for j in /usr/lib/jvm/java-2[1-9]-openjdk /usr/lib/jvm/java-*-openjdk; do
    [[ -x "$j/bin/java" ]] && { JAVA_HOME_DIR="$j"; break; }
  done
fi
[[ -n "$JAVA_HOME_DIR" ]] || { echo "❌ Không tìm thấy JDK 21+"; exit 1; }
NODE="$(command -v node)"; NPX="$(command -v npx)"

# Dừng các unit tạm (systemd-run) cũ cùng tên nếu có; dừng emulator sẽ tự lưu dữ liệu
for u in gugugaga-backend gugugaga-emulator gugugaga-tunnel gugugaga-tunnel-watchdog.timer; do
  systemctl --user stop "$u" 2>/dev/null || true
done

IMPORT=""; [[ -f "$DATA/firestore/firebase-export-metadata.json" ]] && IMPORT="--import $DATA/firestore"
cat > "$UNITS/gugugaga-emulator.service" <<UNIT
[Unit]
Description=GuGuGaGa Firestore Emulator (demo)

[Service]
WorkingDirectory=$DATA
Environment=JAVA_HOME=$JAVA_HOME_DIR
Environment=PATH=$JAVA_HOME_DIR/bin:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/bin/bash -c 'exec $NPX -y firebase-tools@13 emulators:start --only firestore --project demo-gugugaga $IMPORT --export-on-exit $DATA/firestore >> $DATA/logs/emulator.log 2>&1'
# Lưu dữ liệu CHỦ ĐỘNG trước khi dừng (export-on-exit không đáng tin khi emulator đang tắt)
ExecStop=-/bin/bash -c 'cd $DATA && timeout 100 $NPX -y firebase-tools@13 emulators:export $DATA/firestore --force --project demo-gugugaga >> $DATA/logs/export.log 2>&1'
KillSignal=SIGINT
TimeoutStopSec=150
Restart=on-failure

[Install]
WantedBy=default.target
UNIT

# Lưu định kỳ mỗi 5 phút (phòng mất điện / máy treo)
cat > "$UNITS/gugugaga-export.service" <<UNIT
[Unit]
Description=GuGuGaGa: lưu dữ liệu Firestore Emulator

[Service]
Type=oneshot
WorkingDirectory=$DATA
Environment=JAVA_HOME=$JAVA_HOME_DIR
Environment=PATH=$JAVA_HOME_DIR/bin:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/bin/bash -c 'ss -ltn | grep -q ":$EMU_PORT " && timeout 100 $NPX -y firebase-tools@13 emulators:export $DATA/firestore --force --project demo-gugugaga >> $DATA/logs/export.log 2>&1 || true'
UNIT
cat > "$UNITS/gugugaga-export.timer" <<UNIT
[Unit]
Description=GuGuGaGa: lưu dữ liệu định kỳ

[Timer]
OnBootSec=5min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
UNIT

cat > "$UNITS/gugugaga-backend.service" <<UNIT
[Unit]
Description=GuGuGaGa Backend (demo)
After=gugugaga-emulator.service
Wants=gugugaga-emulator.service

[Service]
WorkingDirectory=$ROOT/Backend
Environment=FIRESTORE_EMULATOR_HOST=127.0.0.1:$EMU_PORT
Environment=FIREBASE_PROJECT_ID=demo-gugugaga
Environment=PORT=$API_PORT
TimeoutStartSec=180
ExecStartPre=/bin/bash -c 'until ss -ltn | grep -q ":$EMU_PORT "; do sleep 1; done'
ExecStart=$NODE src/server.js
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
UNIT

systemctl --user daemon-reload
systemctl --user enable --now gugugaga-emulator.service gugugaga-backend.service gugugaga-export.timer

# Link công khai cố định qua Tailscale Funnel (cấu hình được tailscaled nhớ qua các lần khởi động)
if command -v tailscale >/dev/null && tailscale status >/dev/null 2>&1; then
  tailscale funnel --bg "$API_PORT" >/dev/null 2>&1 || true
  URL="$(tailscale funnel status 2>/dev/null | grep -oE 'https://[a-z0-9.-]+\.ts\.net' | head -1 || true)"
  [[ -n "$URL" ]] && echo "$URL" > "$DATA/current-url.txt"
  echo "🌐 Link công khai cố định: ${URL:-<chưa bật Funnel>}"
else
  echo "⚠️  Tailscale chưa chạy/đăng nhập: chưa có link công khai (sudo tailscale up)"
fi
echo "✅ Đã cài service. Xem trạng thái: systemctl --user status gugugaga-backend gugugaga-emulator"
echo "ℹ️  Muốn tự chạy cả khi chưa đăng nhập máy: sudo loginctl enable-linger \$USER"
