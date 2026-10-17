#!/bin/bash
# measure.sh <page index.js> <tag> [heaps]: the red team's heap numbers for one compiled page
#  fw:    framework model (rtfw.sh), W0 and W1 on jerry20h96 and jerry16h96; s8 mounts on jerry20h512
#  plain: rt.sh, W0 and W1 on jerry8h<heap> for each heap; the smallest heap that finishes
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; T=$S/c2-fix/tools
P=$1; TAG=$2; HEAPS=${3:-"48 52 56 58 60 62 64 68 72 76 78 80 96"}
D=$S/c2-fix/m/$TAG; mkdir -p $D
bash $T/rtfw.sh $P fw_$TAG "$R/jb/jerry20h96 $R/jb/jerry16h96" $R/sc/w0.js $R/sc/w1.js > $D/fw.txt 2>/dev/null &
bash $T/rtfw.sh $P s8_$TAG "$R/jb/jerry20h512" $S/rt-e/s8.js > $D/s8.txt 2>/dev/null &
BINS=""; for h in $HEAPS; do BINS="$BINS $R/jb/jerry8h$h"; done
bash $T/rt.sh $P pl_$TAG "$BINS" $R/sc/w0.js $R/sc/w1.js > $D/plain.txt 2>/dev/null &
wait
cut -c1-400 $D/fw.txt
cut -c1-300 $D/s8.txt
for w in w0 w1; do
  min=""; for h in $HEAPS; do
    if grep -q "^pl_$TAG $w jerry8h$h exit 0 .*\(W0 alloc\|W1 closed\)" $D/plain.txt; then min=$h; break; fi
  done
  echo "plain $w min heap ${min:-none} KB :: $(grep "^pl_$TAG $w jerry8h${min:-96} " $D/plain.txt | cut -c1-260)"
done
