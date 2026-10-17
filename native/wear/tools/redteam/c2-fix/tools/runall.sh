#!/bin/bash
# runall.sh: every JerryScript runner on the final page (c2-fix/out) and its observation variant (c2-fix/obsb: paint
# copies every view key, so the scenarios' PAGE.l1/st/can reads still see them); results in c2-fix/m/final/
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; T=$S/c2-fix/tools; R=$S/c2-rt; E=$S/rt-e
P=$S/c2-fix/out/intermediates/loader_out_lite/js/default/pages/index/index.js
O=$S/c2-fix/obsb/intermediates/loader_out_lite/js/default/pages/index/index.js
D=$S/c2-fix/m/final; rm -rf $D; mkdir -p $D
DIRS="$E $S/rt-f $S/c2-build/rtc2 $S/c2-build/rtmem"
( bash $T/allsc.sh f8 $P $E/jb/jerry8 > $D/allsc8.txt ) &
( bash $T/allsc.sh f14 $P $E/jb/jerry14 > $D/allsc14.txt ) &
( bash $T/allsc.sh o8 $O $E/jb/jerry8 > $D/allsc8obs.txt ) &
( bash $T/allsc.sh o14 $O $E/jb/jerry14 > $D/allsc14obs.txt ) &
( bash $S/c2-build/jrun.sh ../c2-fix/out c2final $DIRS > $D/jrun.txt ) &
( bash $S/c2-build/jrun.sh ../c2-fix/obsb c2finalobs $DIRS > $D/jrunobs.txt ) &
( bash $T/measure.sh $P final > $D/measure.txt; bash $T/minheap.sh $P final > $D/minheap.txt ) &
( bash $T/stk.sh > $D/stk.txt ) &
( TAILC=900 bash $T/rtfw.sh $P r1final $R/jb/jerry20h512 $R/sc/r1.js > $D/r1.txt ) &
wait
echo done
