#!/bin/bash
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; D=$S/c2-final/rt3; R=$S/c2-rt
P112=$S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js
P120=${P120:-$D/head/intermediates/loader_out_lite/js/default/pages/index/index.js}
BINS=${BINS:-$D/jb/jerry64h512}
SC=${SC:-"$R/sc/w0.js $R/sc/w1.js"}
T=${T:-m}
[ -n "$NO112" ] || bash $D/run.sh $P112 ${T}112 "$BINS" $SC &
bash $D/run.sh $P120 ${T}120 "$BINS" $SC &
wait
