#!/bin/bash
# official.sh: the task's watch build command, verbatim, from the worktree; then check-lite-js on its output
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad
WT=/home/user/M-arc/.claude/worktrees/wf_20c6ab7f-3aa-1
cd $WT
NODE_OPTIONS=--openssl-legacy-provider bash native/wear/build/build-lite-bin.sh $S/watchbuild/sdk native/wear/app/entry/src/main $S/c2-fix/out debug > $S/c2-fix/official.log 2>&1
echo "build rc $?"
tail -15 $S/c2-fix/official.log
node native/wear/build/check-lite-js.cjs $S/c2-fix/out/intermediates/loader_out_lite/js/default; echo "check-lite-js rc $?"
wc -c $S/c2-fix/out/intermediates/loader_out_lite/js/default/pages/index/index.js
ls -la $S/c2-fix/out/bin 2>/dev/null
sha256sum $S/c2-fix/out/intermediates/loader_out_lite/js/default/pages/index/index.js $S/c2-fix/out/bin/* 2>/dev/null
