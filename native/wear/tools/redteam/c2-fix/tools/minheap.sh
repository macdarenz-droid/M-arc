#!/bin/bash
# minheap.sh <page> <tag>: plain harness (rt.sh: prelude + page + scenario, 8 KB stack), W0 and W1 on every heap size
# from the red team's runners (48..96 KB) and c2-fix's finer ones (54, 66, 70, 74 KB); prints the smallest that finishes
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; T=$S/c2-fix/tools; F=$S/c2-fix/jb
P=$1; TAG=$2; D=$S/c2-fix/m/$TAG; mkdir -p $D
HS="48 52 54 56 58 60 62 64 66 68 70 72 74 76 78 80 96"
BINS=""; for h in $HS; do if [ -x $F/jerry8h$h ]; then BINS="$BINS $F/jerry8h$h"; else BINS="$BINS $R/jb/jerry8h$h"; fi; done
bash $T/rt.sh $P mh_$TAG "$BINS" $R/sc/w0.js $R/sc/w1.js > $D/minheap.txt 2>/dev/null
for w in w0 w1; do
  min=""; for h in $HS; do
    if grep -q "^mh_$TAG $w jerry8h$h exit 0 .*\(W0 alloc\|W1 closed\)" $D/minheap.txt; then min=$h; break; fi
  done
  echo "plain $w min heap ${min:-none} KB (fails at: $(for h in $HS; do grep -q "^mh_$TAG $w jerry8h$h exit 0 .*\(W0 alloc\|W1 closed\)" $D/minheap.txt || echo -n "$h "; done))"
done
