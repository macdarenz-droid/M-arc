#!/bin/bash
# stk.sh: the red team's stk.sh (W0 and W1 under the framework model at stack limits 8 to 20 KB, heap 96 KB) for
# 1.1.2, 1c6b2d81 and the fix page; one line per run: exit, fwerr count, peak
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; T=$S/c2-fix/tools
BINS=""; for s in 8 9 10 11 12 13 14 16 20; do BINS="$BINS $R/jb/jerry${s}h96"; done
P112=$S/c2-build/base/intermediates/loader_out_lite/js/default/pages/index/index.js
PBASE=$S/c2-fix/base/intermediates/loader_out_lite/js/default/pages/index/index.js
PNEW=$S/c2-fix/out/intermediates/loader_out_lite/js/default/pages/index/index.js
bash $T/rtfw.sh $P112 stk112 "$BINS" $R/sc/w0.js $R/sc/w1.js > $S/c2-fix/m/stk112.txt &
bash $T/rtfw.sh $PBASE stkbase "$BINS" $R/sc/w0.js $R/sc/w1.js > $S/c2-fix/m/stkbase.txt &
bash $T/rtfw.sh $PNEW stkfix "$BINS" $R/sc/w0.js $R/sc/w1.js > $S/c2-fix/m/stkfix.txt &
wait
for t in 112 base fix; do
  echo "== $t"
  sed -E 's/^(\S+ \S+ \S+ exit [0-9]+) :: .*(peak [0-9]+).*fwerr ([0-9]+).*/\1 \2 fwerr \3/; s/^(\S+ \S+ \S+ exit [0-9]+) :: .*fwerr ([0-9]+).*/\1 fwerr \2/' $S/c2-fix/m/stk$t.txt
done
