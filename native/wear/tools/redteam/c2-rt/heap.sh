#!/bin/bash
# heap.sh: W0 and W1 on the 1.1.2 page and the 1.2.0 page with heaps of 48 to 96 KB (8 KB stack)
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt
BINS=""; for h in ${HEAPS:-48 52 56 60 64 68 72 80 96}; do BINS="$BINS $R/jb/jerry8h$h"; done
bash $R/rt.sh $S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js v112 "$BINS" "$@" &
bash $R/rt.sh $R/head/intermediates/loader_out_lite/js/default/pages/index/index.js v120 "$BINS" "$@" &
wait
