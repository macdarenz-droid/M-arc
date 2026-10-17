#!/bin/bash
# all.sh: the 38 allsc scenarios at 8 and 14 KB stacks, jrun, and R1 under the framework model, on the 611b09c8 page
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; O=$S/c2-final/rt3
P=$O/head/intermediates/loader_out_lite/js/default/pages/index/index.js
wc -c "$P"
echo "8:  $(bash $R/allsc.sh rt3a8 "$P" $S/rt-e/jb/jerry8)" > $O/allsc8.txt &
echo "14: $(bash $R/allsc.sh rt3a14 "$P" $S/rt-e/jb/jerry14)" > $O/allsc14.txt &
bash $S/c2-build/jrun.sh ../c2-final/rt3/head rt3 > $O/jrun.txt 2>&1 &
bash $R/rtfw.sh "$P" rt3r1 $R/jb/jerry20h512 $R/sc/r1.js > /dev/null &
wait
cat $O/allsc8.txt $O/allsc14.txt $O/jrun.txt
cat $R/out/rt3r1/r1.jerry20h512.out
grep -l 'ESC \["' $R/out/rt3a8/*.out $R/out/rt3a14/*.out | head
