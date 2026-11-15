#!/usr/bin/env bash
# Bật server demo GuGuGaGa trên máy này cho người khác chạy thử APK:
#   Firestore Emulator (dữ liệu lưu ở .demo-data/) + Backend (cổng 5000) + Cloudflare Quick Tunnel.
# Chạy:  bash scripts/serve-demo.sh        (Ctrl+C để tắt, dữ liệu được lưu lại)
# Hoặc chạy nền:  systemd-run --user --unit=gugugaga-demo --property=KillSignal=SIGINT \
#                  --working-directory="$PWD" --setenv=PATH="$HOME/.local/bin:$PATH" bash scripts/serve-demo.sh
# Cần:   Node 20+, JDK 21+, cloudflared (https://github.com/cloudflare/cloudflared/releases)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$ROOT/.demo-data"
LOGS="$DATA/logs"
EMU_PORT="${EMU_PORT:-8085}"
API_PORT="${API_PORT:-5000}"
PROJECT_ID="demo-gugugaga"
mkdir -p "$DATA/firestore" "$LOGS"

# ---- Đã có server demo đang chạy? (vd. systemd service gugugaga-demo) ----
if curl -sf "http://localhost:$API_PORT/health" >/dev/null 2>&1 || ss -ltn 2>/dev/null | grep -q ":$EMU_PORT "; then
  echo "ℹ️  Server demo đã đang chạy (cổng $API_PORT/$EMU_PORT đang được dùng)."
  [[ -s "$DATA/current-url.txt" ]] && echo "   URL công khai: $(cat "$DATA/current-url.txt")"
  echo "   Nếu đang chạy bằng service: systemctl --user status|stop gugugaga-demo"
  exit 0
fi

# ---- JDK 21+ cho Firestore Emulator ----
if [[ -z "${JAVA_HOME:-}" ]]; then
  for j in /usr/lib/jvm/java-2[1-9]-openjdk /usr/lib/jvm/java-*-openjdk; do
    [[ -x "$j/bin/java" ]] && "$j/bin/java" -version 2>&1 | grep -qE 'version "(2[1-9]|[3-9][0-9])' && { export JAVA_HOME="$j"; break; }
  done
fi
[[ -n "${JAVA_HOME:-}" ]] && export PATH="$JAVA_HOME/bin:$PATH"
command -v cloudflared >/dev/null || { echo "❌ Chưa cài cloudflared"; exit 1; }

# ---- File cấu hình emulator (không cần tài khoản Firebase) ----
cat > "$DATA/firebase.json" <<EOF
{ "emulators": { "firestore": { "host": "127.0.0.1", "port": $EMU_PORT }, "ui": { "enabled": false } } }
EOF

PIDS=()
cleanup() {
  echo; echo "⏹  Đang tắt (dữ liệu emulator được lưu vào .demo-data/firestore)..."
  for ((i=${#PIDS[@]}-1; i>=0; i--)); do kill -INT "${PIDS[$i]}" 2>/dev/null || true; done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# ---- 1. Firestore Emulator ----
echo "▶️  Firestore Emulator (cổng $EMU_PORT)..."
IMPORT_ARGS=()
[[ -f "$DATA/firestore/firebase-export-metadata.json" ]] && IMPORT_ARGS=(--import "$DATA/firestore")
(cd "$DATA" && npx -y firebase-tools@13 emulators:start --only firestore --project "$PROJECT_ID" \
   "${IMPORT_ARGS[@]}" --export-on-exit "$DATA/firestore" > "$LOGS/emulator.log" 2>&1) &
PIDS+=($!)
until grep -q "All emulators ready" "$LOGS/emulator.log" 2>/dev/null; do
  grep -q "Error:" "$LOGS/emulator.log" 2>/dev/null && { cat "$LOGS/emulator.log"; exit 1; }
  sleep 1
done
export FIRESTORE_EMULATOR_HOST="127.0.0.1:$EMU_PORT" FIREBASE_PROJECT_ID="$PROJECT_ID"

# ---- 2. Seed dữ liệu mẫu khi chưa có bản lưu ----
if [[ ${#IMPORT_ARGS[@]} -eq 0 ]]; then
  echo "🌱 Chưa có dữ liệu lưu, nạp dữ liệu mẫu..."
  (cd "$ROOT/Backend" && node seed-firestore.js > "$LOGS/seed.log" 2>&1)
fi

# Lưu dữ liệu emulator định kỳ (phòng khi máy tắt đột ngột, không kịp export-on-exit)
( while sleep 600; do
    (cd "$DATA" && npx -y firebase-tools@13 emulators:export "$DATA/firestore" --force \
       --project "$PROJECT_ID" >> "$LOGS/export.log" 2>&1) || true
  done ) &
PIDS+=($!)

# ---- 3. Backend ----
[[ -d "$ROOT/Backend/node_modules" ]] || (cd "$ROOT/Backend" && npm ci)
echo "▶️  Backend (cổng $API_PORT)..."
(cd "$ROOT/Backend" && PORT="$API_PORT" JWT_SECRET="${JWT_SECRET:-gugugaga-demo-secret}" \
   node src/server.js > "$LOGS/backend.log" 2>&1) &
PIDS+=($!)
until curl -sf "http://localhost:$API_PORT/health" >/dev/null; do sleep 1; done

# ---- 4. Cloudflare Quick Tunnel ----
echo "▶️  Cloudflare Quick Tunnel..."
cloudflared tunnel --no-autoupdate --url "http://localhost:$API_PORT" > "$LOGS/tunnel.log" 2>&1 &
PIDS+=($!)
URL=""
for _ in $(seq 1 60); do
  URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOGS/tunnel.log" | head -1 || true)
  [[ -n "$URL" ]] && break; sleep 1
done
[[ -z "$URL" ]] && { echo "❌ Không lấy được URL tunnel"; cat "$LOGS/tunnel.log"; exit 1; }
echo "$URL" > "$DATA/current-url.txt"

cat <<EOF

✅ Server demo đang chạy
   URL công khai : $URL
   Kiểm tra      : $URL/health

👉 Gửi URL trên cho người chạy thử. Trong app: mở app → nếu báo không kết nối
   được thì dán URL vào hộp thoại; hoặc nhấn giữ chữ "GuGuGaGa" ở màn hình đăng nhập.
   Tài khoản mẫu (mật khẩu 123456): khách 0912345671 · tài xế 0911111111 · admin 0900000000

   Log: .demo-data/logs/   ·   Ctrl+C để tắt
EOF
wait
