#!/bin/bash
# fixrun.sh: every scenario on the fixed page (8 and 14 KB stacks, default heap) and R1 under the framework model
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt
P=$R/fixed/intermediates/loader_out_lite/js/default/pages/index/index.js
wc -c $P
echo "8:  $(bash $R/allsc.sh fx8 $P $S/rt-e/jb/jerry8)" &
echo "14: $(bash $R/allsc.sh fx14 $P $S/rt-e/jb/jerry14)" &
wait
bash $R/rtfw.sh $P r1fix $R/jb/jerry20h512 $R/sc/r1.js > /dev/null
cat $R/out/r1fix/r1.jerry20h512.out
grep -l "ESC \[\"" $R/out/fx8/*.out $R/out/fx14/*.out | head
