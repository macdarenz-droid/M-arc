#!/bin/bash
# mstk.sh: (a) instrumented, heap 512 KB, stacks 12-15 KB: overflow counts only; (b) plain fw.js model, heap 96 KB, stacks 13-16 KB
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; D=$S/c2-final/rt3; R=$S/c2-rt
J=$D/jb
T=L bash $D/mvar.sh "$J/jerry12h512 $J/jerry13h512 $J/jerry14h512 $J/jerry15h512" v112 head P PD > /dev/null &
for v in v112 head P PD; do
  P=$D/var/$v/out/intermediates/loader_out_lite/js/default/pages/index/index.js
  [ "$v" = head ] && P=$D/head/intermediates/loader_out_lite/js/default/pages/index/index.js
  [ "$v" = v112 ] && P=$S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js
  bash $R/rtfw.sh $P rt3plain$v "$J/jerry13h96 $J/jerry14h96 $J/jerry15h96 $J/jerry16h96" $R/sc/w1.js > $D/out/plain$v.txt &
done
wait
cat $D/out/plain*.txt | sed 's/ :: .*\(peak [0-9]*\).*\(mounts [0-9]*\) \(fwerr [0-9]*\).*/ \1 \2 \3/' | cut -c1-160
