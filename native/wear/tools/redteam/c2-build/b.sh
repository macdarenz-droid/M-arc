#!/bin/bash
# b.sh <tag> [mode]: build the C2 worktree's watch app into c2-build/<tag>, then check it and print sizes
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad
WT=/home/user/M-arc/.claude/worktrees/wf_b70d8ff4-f01-2
O=$S/c2-build/$1
cd $WT && NODE_OPTIONS=--openssl-legacy-provider bash ${BUILD:-native/wear/build/build-lite-bin.sh} $S/watchbuild/sdk native/wear/app/entry/src/main $O ${2:-debug} > $O.log 2>&1
echo "build exit $?"
grep -E "COMPILE|OK  |FAIL|ERROR|RESULT|rror" $O.log | grep -v '^folded'
node $WT/native/wear/build/check-lite-js.cjs $O/intermediates/loader_out_lite/js/default
ls -l $O/intermediates/loader_out_lite/js/default/pages/index/index.js $O/bin/*.bin 2>/dev/null
