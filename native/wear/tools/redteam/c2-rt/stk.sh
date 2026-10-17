#!/bin/bash
# stk.sh <scenario...>: both pages under the framework model at stack limits 8 to 20 KB (heap 96 KB)
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt
BINS=""; for s in 8 9 10 11 12 13 14 16 20; do BINS="$BINS $R/jb/jerry${s}h96"; done
bash $R/rtfw.sh $S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js s112 "$BINS" "$@" &
bash $R/rtfw.sh $R/head/intermediates/loader_out_lite/js/default/pages/index/index.js s120 "$BINS" "$@" &
wait
