#!/bin/bash
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; O=$S/c2-final/rt3
P=$O/var/P/out/intermediates/loader_out_lite/js/default/pages/index/index.js
echo "P 8:  $(bash $R/allsc.sh rt3P8 "$P" $S/rt-e/jb/jerry8)" > $O/allscP8.txt &
echo "P 14: $(bash $R/allsc.sh rt3P14 "$P" $S/rt-e/jb/jerry14)" > $O/allscP14.txt &
bash $R/rtfw.sh "$P" rt3Pr1 $R/jb/jerry20h512 $R/sc/r1.js > /dev/null &
wait
cat $O/allscP8.txt $O/allscP14.txt | tr ' ' '\n' | grep -B1 '^[1-9]' | head
grep -c 'exit 0' $O/allscP8.txt; cat $O/allscP8.txt | grep -o 'exit 0' | wc -l; cat $O/allscP14.txt | grep -o 'exit 0' | wc -l
cat $R/out/rt3Pr1/r1.jerry20h512.out
