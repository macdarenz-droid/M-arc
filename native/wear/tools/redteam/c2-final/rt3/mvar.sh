#!/bin/bash
# mvar.sh <bins> <variant...>: W0, W1 (and R1) per variant page with the stack report
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; D=$S/c2-final/rt3; R=$S/c2-rt
BINS=$1; shift
SC=${SC:-"$R/sc/w0.js $R/sc/w1.js"}
for v in "$@"; do
  P=$D/var/$v/out/intermediates/loader_out_lite/js/default/pages/index/index.js
  [ "$v" = head ] && P=$D/head/intermediates/loader_out_lite/js/default/pages/index/index.js
  [ "$v" = v112 ] && P=$S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js
  bash $D/run.sh $P ${T:-x}$v "$BINS" $SC > $D/out/${T:-x}$v.txt &
done
wait
for v in "$@"; do grep -o '^.*exit [0-9]*\|W[01] [a-z ]*[0-9]*\|max held [0-9]*\|peak [0-9]*\|mounts [0-9]*\|fwerr [0-9]*\|STK peak [0-9]*\|"m":[0-9]*,"base":[0-9]*,"ifd":[0-9]' $D/out/${T:-x}$v.txt | tr '\n' ' ' | sed 's/x'$v' /\n/g'; echo; done
