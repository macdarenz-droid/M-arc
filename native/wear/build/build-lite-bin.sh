#!/usr/bin/env bash
# Route A: compile a FA-model lite-wearable JS module to an unsigned .bin without hvigor/DevEco.
# Usage: build-lite-bin.sh <sdk-root(with js/ and toolchains/)> <module-main-dir(entry/src/main)> <out-dir> <debug|release> [module-name]
set -euo pipefail
SDK="$1"; MAIN="$2"; OUT="$3"; MODE="${4:-debug}"; MOD="${5:-entry}"
# webpack resolves its output path from the ace-loader folder, so every path must be absolute
SDK="$(cd "$SDK" && pwd)"; MAIN="$(cd "$MAIN" && pwd)"; mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"
ACE="$SDK/js/build-tools/ace-loader"
HAPTOBIN="$SDK/js/build-tools/binary-tools/haptobin_tool.jar"
RESTOOL="$SDK/toolchains/restool"
HERE="$(cd "$(dirname "$0")" && pwd)"
CFG="$MAIN/config.json"
BUNDLE=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).app.bundleName)' "$CFG")
JSNAME=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).module.js[0].name)' "$CFG")
I="$OUT/intermediates"; rm -rf "$OUT"; mkdir -p "$I"
filt() { grep -v 'Picked up JAVA_TOOL_OPTIONS' || true; }

echo "== 1. JS manifest"; node "$HERE/gen-js-manifest.cjs" "$CFG" "$JSNAME" "$I/manifest/$JSNAME/manifest.json"
echo "== 2. lite_res (PNG/JPG copy for img2bin)"
mkdir -p "$I/lite_res"; (cd "$MAIN/resources" && find . -type f \( -iname '*.png' -o -iname '*.jpg' \) -exec cp --parents {} "$I/lite_res/" \;)
echo "== 3. ace-loader lite webpack ($MODE)"
# Compile a copy under a CommonJS package scope: webpack follows the nearest package.json, and M-arc's root one
# says "type": "module", which made it emit ES-module output that cannot load on the watch (black screen).
JSRC="$I/js_src"; mkdir -p "$JSRC"; cp -r "$MAIN/js/$JSNAME" "$JSRC/$JSNAME"; echo '{"type": "commonjs"}' > "$JSRC/package.json"
HAPMODE=false; [ "$MODE" = release ] && HAPMODE=true
aceManifestPath="$I/manifest/$JSNAME/manifest.json" iconPath="$I/lite_res" img2bin=true hapMode=$HAPMODE watchMode=false \
  node "$ACE/node_modules/webpack/bin/webpack.js" --config "$ACE/webpack.lite.config.js" \
  --env aceModuleRoot="$JSRC/$JSNAME" --env aceModuleBuild="$I/loader_out_lite/js/$JSNAME" \
  --env cachePath="$I/cache" --env buildMode="$MODE" --env deviceType=liteWearable
sleep 1  # img2bin and jerry-snapshot run async in webpack done-hooks
[ -f "$I/loader_out_lite/js/$JSNAME/app.js" ] || { echo "ERROR: compile failed, no app.js" >&2; exit 1; }
node "$HERE/check-lite-js.cjs" "$I/loader_out_lite/js/$JSNAME" || { echo "ERROR: the compiled JS would not load on the watch" >&2; exit 1; }
[ -d "$I/loader_out_lite/js/$JSNAME/_releaseMap" ] && mv "$I/loader_out_lite/js/$JSNAME/_releaseMap" "$I/releaseMap"
echo "== 4. restool"
mkdir -p "$I/res_in" "$I/res"; cp -r "$MAIN/resources" "$I/res_in/"
"$RESTOOL" -i "$I/res_in" -j "$CFG" -p "$BUNDLE" -o "$I/res" -r "$I/res/ResourceTable.h" -f | grep -E 'Error|success' || true
echo "== 5. lite_source"
L="$I/lite_source"; mkdir -p "$L/assets/$MOD"
cp "$I/res/config.json" "$L/config.json"
cp -r "$I/loader_out_lite/." "$L/assets/"
cp -r "$I/res/resources" "$L/assets/$MOD/"; cp -r "$I/lite_res/." "$L/assets/$MOD/resources/"
cp "$I/res/resources.index" "$L/assets/$MOD/resources.index"
find "$L/assets" -name '*.map' -delete   # source maps are not needed on the watch; the working community builds drop them
echo "== 6. haptobin"
mkdir -p "$OUT/bin"
java -jar "$HAPTOBIN" --project-path "$L" --bin-path "$OUT/bin/$MOD-default-unsigned.bin" 2>&1 | filt
echo "Unsigned: $OUT/bin/$MOD-default-unsigned.bin (sign-lite-bin.sh signs it and builds the HAP)"
