#!/usr/bin/env bash
# Captures 1600×1000 homepage screenshots for the Work page, on macOS.
# Uses the Google Chrome you already have — nothing to install.
#
#   bash scripts/capture-work.sh
#
# Writes public/assets/work/<slug>.jpg. Re-run any time a client site changes.
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/assets/work"
TMP="$(mktemp -d)"

if [[ ! -x "$CHROME" ]]; then
  echo "Google Chrome not found at: $CHROME" >&2
  exit 1
fi

capture() {
  local slug="$1" url="$2"
  echo "→ $slug  ($url)"
  # virtual-time-budget lets intro animations and lazy images finish first.
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1600,1000 --virtual-time-budget=9000 \
    --screenshot="$TMP/$slug.png" "$url" >/dev/null 2>&1
  sips -s format jpeg -s formatOptions 82 "$TMP/$slug.png" --out "$OUT/$slug.jpg" >/dev/null
  echo "  saved $(du -h "$OUT/$slug.jpg" | cut -f1)  public/assets/work/$slug.jpg"
}

capture classy-salon    "https://www.theclassysalon.com/"
capture namo-restro     "https://namorestroskit.com/"
capture maple-and-thyme "https://www.mapleandthyme.in/"
capture ttattatao      "https://www.ttattatao.com/"

rm -rf "$TMP"
echo "Done. Open the new .jpg files to check them before pushing."
