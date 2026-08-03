#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
SRC="icon.png"
sips -z 16 16 "$SRC" --out favicon-16x16.png >/dev/null
sips -z 32 32 "$SRC" --out favicon-32x32.png >/dev/null
sips -z 32 32 "$SRC" --out favicon.png >/dev/null
sips -z 180 180 "$SRC" --out apple-touch-icon.png >/dev/null
echo "Generated favicon-16x16.png, favicon-32x32.png, favicon.png, apple-touch-icon.png from $SRC"
