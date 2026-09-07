#!/bin/sh
# NEXORA — serve this folder over http:// and open the storefront.
cd "$(dirname "$0")" || exit 1
PORT=8080
URL="http://localhost:$PORT/NEXORA.dc.html"
echo "NEXORA → $URL   (Ctrl+C to stop)"
(sleep 1; (command -v open >/dev/null && open "$URL") || (command -v xdg-open >/dev/null && xdg-open "$URL")) >/dev/null 2>&1 &
if command -v python3 >/dev/null 2>&1; then exec python3 -m http.server "$PORT"; fi
if command -v python  >/dev/null 2>&1; then exec python  -m http.server "$PORT"; fi
if command -v npx     >/dev/null 2>&1; then exec npx --yes http-server -p "$PORT" .; fi
echo "Install Python 3 or Node, or use the VS Code Live Server extension."
exit 1
