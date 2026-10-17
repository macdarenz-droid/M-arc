#!/bin/bash
# bjall.sh: the finer plain runners (8 KB stack) for the minimum-heap search
T=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-fix/tools
for h in 54 66 70 74; do bash $T/bjp.sh 8 $h & done
wait
