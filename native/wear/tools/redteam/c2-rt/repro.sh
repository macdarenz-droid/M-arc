#!/bin/bash
# repro.sh: is the build output independent of the output folder? 1.2.0 (worktree) and 1.1.2 (23c90440), two folders each
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; SDK=$S/watchbuild/sdk
WT=/home/user/M-arc/.claude/worktrees/wf_c9e8bfb9-540-2
export NODE_OPTIONS=--openssl-legacy-provider
bash $WT/native/wear/build/build-lite-bin.sh $SDK $WT/native/wear/app/entry/src/main $R/rp/x120 debug > $R/rp-x120.log 2>&1 &
bash $WT/native/wear/build/build-lite-bin.sh $SDK $WT/native/wear/app/entry/src/main $R/rp/longer-folder-name-120 debug > $R/rp-l120.log 2>&1 &
bash $R/src112/native/wear/build/build-lite-bin.sh $SDK $R/src112/native/wear/app/entry/src/main $R/rp/x112 debug > $R/rp-x112.log 2>&1 &
bash $R/src112/native/wear/build/build-lite-bin.sh $SDK $R/src112/native/wear/app/entry/src/main $R/rp/longer-folder-name-112 debug > $R/rp-l112.log 2>&1 &
wait
for d in x120 longer-folder-name-120 x112 longer-folder-name-112; do
  echo "$d $(sha256sum $R/rp/$d/intermediates/loader_out_lite/js/default/pages/index/index.js | cut -c1-16) $(sha256sum $R/rp/$d/bin/entry-default-unsigned.bin | cut -c1-16)"
done
