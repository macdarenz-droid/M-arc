#!/bin/bash
# bvar.sh <variant...>: build each variant copy under var/<name>/main to var/<name>/out
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; D=$S/c2-final/rt3
B=/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2/native/wear/build/build-lite-bin.sh
export NODE_OPTIONS=--openssl-legacy-provider
for v in "$@"; do bash $B $S/watchbuild/sdk $D/var/$v/main $D/var/$v/out debug > $D/var/$v/build.log 2>&1 & done
wait
for v in "$@"; do echo "$v $(tail -1 $D/var/$v/build.log | cut -c1-60) $(wc -c < $D/var/$v/out/intermediates/loader_out_lite/js/default/pages/index/index.js) B page; src $(cat $D/var/$v/main/js/default/pages/index/index.* $D/var/$v/main/js/default/common/link.js | wc -c)"; done
