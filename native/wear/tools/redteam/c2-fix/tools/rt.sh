#!/bin/bash
# rt.sh <page index.js> <tag> "<jerry binaries>" <scenario.js...>: the red team's rt.sh (prelude + page + scenario),
# outputs in c2-fix/out/<tag>
E=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/rt-e
O=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-fix/runs
P=$1; TAG=$2; BINS=$3; shift 3
mkdir -p $O/$TAG
for sc in "$@"; do
  n=$(basename $sc .js)
  for b in $BINS; do
    o=$O/$TAG/$n.$(basename $b)
    { cat $E/prelude.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $sc; } > $o.js
    timeout 900 $b $o.js > $o.out 2>&1; rc=$?
    echo "$TAG $n $(basename $b) exit $rc :: $(tail -c 400 $o.out | tr '\n' ' ')"
  done
done
