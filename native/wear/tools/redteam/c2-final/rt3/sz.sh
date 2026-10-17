#!/bin/bash
# sz.sh: the W4 source total (all files under js/) for head and the variants
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3
WT=/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2
echo "head $(find $WT/native/wear/app/entry/src/main/js -type f -exec cat {} + | wc -c)"
for v in P T PD L1; do echo "$v $(find $D/var/$v/main/js -type f -exec cat {} + | wc -c)"; done
