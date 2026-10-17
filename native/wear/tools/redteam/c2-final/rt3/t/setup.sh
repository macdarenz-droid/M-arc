#!/bin/bash
T=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3/t
R=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt
for f in rt.test.mjs fix.test.mjs; do
  sed 's#/home/user/M-arc/.claude/worktrees/wf_c9e8bfb9-540-2#/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2#' "$R/$f" > "$T/$f"
done
grep -c wf_4890 "$T/rt.test.mjs" "$T/fix.test.mjs"
