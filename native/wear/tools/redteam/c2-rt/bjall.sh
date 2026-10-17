#!/bin/bash
B=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt/bj.sh
for h in "$@"; do bash $B 8 $h & done
wait
ls /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt/jb
