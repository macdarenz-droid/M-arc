#!/bin/bash
# rtfw.sh <page> <tag> "<bins>" <scenarios...>: the red team's rtfw.sh (prelude + fw.js model + page + scenario),
# outputs in c2-fix/out/<tag>. FW=<file> swaps the model file (default: the red team's c2-rt/fw.js).
E=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/rt-e
R=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt
O=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-fix/runs
M=${FW:-$R/fw.js}
P=$1; TAG=$2; BINS=$3; shift 3
mkdir -p $O/$TAG
for sc in "$@"; do
  n=$(basename $sc .js)
  for b in $BINS; do
    o=$O/$TAG/$n.$(basename $b)
    { cat $E/prelude.js $M; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $sc; printf '\nprint("FW elements", NEL, "watchers", NW, "mounts", NMOUNT, "fwerr", FWN, J(FWERR));\n'; } > $o.js
    timeout 900 $b $o.js > $o.out 2>&1; rc=$?
    echo "$TAG $n $(basename $b) exit $rc :: $(tail -c ${TAILC:-420} $o.out | tr '\n' ' ')"
  done
done
