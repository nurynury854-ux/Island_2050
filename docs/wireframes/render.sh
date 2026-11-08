#!/bin/bash
# Turns index.html into one PNG per page (3200×1800, 16:9) for the slides.
# Run from anywhere:  bash docs/wireframes/render.sh
# Needs Google Chrome installed in /Applications.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$DIR/png"

render() {  # $1 = canvas id, $2 = output file name
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=1600,900 --virtual-time-budget=1500 \
    --screenshot="$DIR/png/$2.png" "file://$DIR/index.html?only=$1" 2>/dev/null
  echo "  png/$2.png"
}

render sitemap 00-sitemap
render home    01-home
render setup   02-setup
render game    03a-game
render turn    03b-game-turn
render results 04-results
render learn   05-learn
render sdgs    06-sdgs
render hall    07-hall
render about   08-about
