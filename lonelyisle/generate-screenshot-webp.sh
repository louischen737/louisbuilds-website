#!/usr/bin/env bash
# Generate responsive WebP variants for index.html app-gallery screenshots.
# Source: screenshot{1..4}.jpg (or .png)
# Output per screenshot:
#   screenshotN.webp          — width 1242px
#   screenshotN-400w.webp     — height 400px
#   screenshotN-800w.webp     — height 800px

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

QUALITY=85
FULL_WIDTH=1242
SMALL_HEIGHTS=(400 800)

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Error: cwebp not found. Install with: brew install webp" >&2
  exit 1
fi

resolve_source() {
  local n="$1"
  if [[ -f "screenshot${n}.png" ]]; then
    echo "screenshot${n}.png"
  elif [[ -f "screenshot${n}.jpg" ]]; then
    echo "screenshot${n}.jpg"
  else
    return 1
  fi
}

echo "Generating LonelyIsle screenshot WebP variants (quality=$QUALITY)..."
echo

for n in 1 2 3 4; do
  source="$(resolve_source "$n" || true)"
  if [[ -z "$source" ]]; then
    echo "  ✗ screenshot${n}: no screenshot${n}.png or screenshot${n}.jpg found" >&2
    exit 1
  fi

  src_dims="$(sips -g pixelWidth -g pixelHeight "$source" 2>/dev/null | awk '/pixel/{print $2}' | tr '\n' 'x' | sed 's/x$//')"
  echo "screenshot${n} ← $source (${src_dims}px)"

  tmp="$(mktemp /tmp/lonelyisle-full-XXXXXX.png)"
  sips --resampleWidth "$FULL_WIDTH" "$source" --out "$tmp" >/dev/null
  cwebp -quiet -q "$QUALITY" "$tmp" -o "screenshot${n}.webp"
  rm -f "$tmp"
  dims="$(sips -g pixelWidth -g pixelHeight "screenshot${n}.webp" 2>/dev/null | awk '/pixel/{print $2}' | tr '\n' 'x' | sed 's/x$//')"
  size="$(du -h "screenshot${n}.webp" | cut -f1)"
  echo "  ✓ screenshot${n}.webp          ${dims}px  ($size)"

  for h in "${SMALL_HEIGHTS[@]}"; do
    out="screenshot${n}-${h}w.webp"
    tmp="$(mktemp /tmp/lonelyisle-${h}-XXXXXX.png)"
    sips --resampleHeight "$h" "$source" --out "$tmp" >/dev/null
    cwebp -quiet -q "$QUALITY" "$tmp" -o "$out"
    rm -f "$tmp"
    dims="$(sips -g pixelWidth -g pixelHeight "$out" 2>/dev/null | awk '/pixel/{print $2}' | tr '\n' 'x' | sed 's/x$//')"
    size="$(du -h "$out" | cut -f1)"
    echo "  ✓ $out  ${dims}px  ($size)"
  done
  echo
done

echo "Done."
