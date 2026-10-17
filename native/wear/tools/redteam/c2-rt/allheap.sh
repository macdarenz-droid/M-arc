#!/bin/bash
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt
for h in "$@"; do
  ( echo "v112 h$h: $(bash $R/allsc.sh a112h$h $S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js $R/jb/jerry8h$h)" ) &
  ( echo "v120 h$h: $(bash $R/allsc.sh a120h$h $R/head/intermediates/loader_out_lite/js/default/pages/index/index.js $R/jb/jerry8h$h)" ) &
done
wait
