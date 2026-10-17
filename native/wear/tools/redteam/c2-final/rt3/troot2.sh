#!/bin/bash
# troot2.sh <variant>: link every other repo root entry into the mirror, then run the watch tests
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3
WT=/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2
M=$D/var/$1/root
for f in $(ls -A $WT); do [ "$f" = native ] || [ "$f" = .git ] || [ -e "$M/$f" ] || ln -s "$WT/$f" "$M/$f"; done
cd $M && node --test native/wear/test/*.test.mjs 2>&1 | grep -E "^not ok|^# (pass|fail)|^  error:|^  expected|^  actual" | head -40
