#!/bin/bash
# run4.sh <tag> <page> "<bins>" <scenarios...>: as run3.sh fw, plus c2-final rt3 fwm.js (peak native stack per mount) and its report
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c3-rt
TAG=$1; P=$2; BINS=$3; shift 3
mkdir -p $R/out/$TAG
for sc in "$@"; do
  n=$(basename $sc .js)
  for b in $BINS; do
    o=$R/out/$TAG/$n.$(basename $b)
    { cat $S/rt-e/prelude.js $S/c2-rt/fw.js $S/c2-final/rt3/fwm.js $R/c3pre.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $sc;
      printf '\nprint("FW elements", NEL, "watchers", NW, "mounts", NMOUNT, "fwerr", FWN, J(FWERR));\nprint(stkReport());\n'; } > $o.js
    timeout 900 $b $o.js > $o.out 2>&1; rc=$?
    echo "== $TAG $n $(basename $b) exit $rc"; cat $o.out | cut -c1-1500
  done
done
