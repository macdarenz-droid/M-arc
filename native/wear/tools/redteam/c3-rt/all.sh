#!/bin/bash
# all.sh <tag>: the 38 rt-e/rt-f/C2 scenarios at 8 and 14 KB on c3-build/head, diffed against 1.2.0 (c3base8, c3base14),
# then the C3 scenarios s60 to s62 at 8 and 14 KB
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; T=$1
P=$S/c3-build/head/intermediates/loader_out_lite/js/default/pages/index/index.js
bash $R/allsc.sh ${T}8 $P $S/rt-e/jb/jerry8 &
bash $R/allsc.sh ${T}14 $P $S/rt-e/jb/jerry14 &
wait
for k in 8 14; do
  for f in $R/out/${T}$k/*.out; do n=$(basename $f); diff -q $f $R/out/c3base$k/$n > /dev/null || { echo "== $k $n"; diff $R/out/c3base$k/$n $f | head -4; }; done
done
cd $S/c3-rt && bash run3.sh ${T}c3 $P "$S/rt-e/jb/jerry8 $S/rt-e/jb/jerry14" -- s60_offline.js s61_adjust.js s62_hr.js
