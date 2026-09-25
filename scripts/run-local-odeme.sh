#!/usr/bin/env bash
# Lokal ödeme testi — isg_pusulasi-api docker compose (isgatlasi) + Vite
set -euo pipefail
API="$(cd "$(dirname "$0")/../../isg_pusulasi-api" && pwd)"
WEB="$(cd "$(dirname "$0")/.." && pwd)"

echo "== isgatlasi (isg_pusulasi-api) =="
docker rm -f isg-pusulasi-pg >/dev/null 2>&1 || true
cd "$API"
docker compose up --build -d
for i in $(seq 1 40); do
  curl -sf http://127.0.0.1:8081/health >/dev/null && break
  sleep 1
done
curl -sf http://127.0.0.1:8081/health; echo

echo "== Vite :5710 =="
if ! curl -sf -o /dev/null http://127.0.0.1:5710/basvuru.html; then
  cd "$WEB"
  nohup npm run dev -- --host 127.0.0.1 --port 5710 >/tmp/tanitim-vite.log 2>&1 &
  sleep 2
fi
curl -sf -o /dev/null http://127.0.0.1:5710/basvuru.html

echo ""
echo "Hazır: http://127.0.0.1:5710/basvuru.html?paket=pro"
