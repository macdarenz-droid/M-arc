#!/bin/bash
# both.sh <runner rt.sh|rtfw.sh> <bin> <scenario...>: the 1.1.2 and 1.2.0 pages in parallel
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt
RUN=$1; B=$2; shift 2
T=$(basename $RUN .sh)
bash $R/$RUN $S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js ${T}112 "$B" "$@" &
bash $R/$RUN $R/head/intermediates/loader_out_lite/js/default/pages/index/index.js ${T}120 "$B" "$@" &
wait
