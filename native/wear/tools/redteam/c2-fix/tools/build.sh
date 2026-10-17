#!/bin/bash
# build.sh <src-main-dir> <out-tag>: the watch build into c2-fix/<out-tag>; prints rc and page size
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad
WT=/home/user/M-arc/.claude/worktrees/wf_20c6ab7f-3aa-1
export NODE_OPTIONS=--openssl-legacy-provider
bash $WT/native/wear/build/build-lite-bin.sh $S/watchbuild/sdk $1 $S/c2-fix/$2 debug > $S/c2-fix/$2.log 2>&1
echo "rc $?"
grep -i "error\|check-lite\|OK" $S/c2-fix/$2.log | tail -4
wc -c $S/c2-fix/$2/intermediates/loader_out_lite/js/default/pages/index/index.js
