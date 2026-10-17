#!/bin/bash
# bjall2.sh: runners at 13 and 14 KB stack with 100 and 104 KB heaps (red team build flags), in c2-fix/jb
T=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-fix/tools
for s in 13 14; do for h in 100 104; do bash $T/bjp.sh $s $h & done; done
wait
