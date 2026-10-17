#!/bin/bash
# run.sh <page index.js> <tag> "<bins>" <scenarios...>: prelude + fw.js + fwm.js + page + scenario; prints exit, fw counts and stack report
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; E=$S/rt-e; R=$S/c2-rt; D=$S/c2-final/rt3
P=$1; TAG=$2; BINS=$3; shift 3
mkdir -p $D/out/$TAG
for sc in "$@"; do
  n=$(basename $sc .js)
  for b in $BINS; do
    o=$D/out/$TAG/$n.$(basename $b)
    { cat $E/prelude.js $R/fw.js $D/fwm.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $sc; printf '\nprint("FW elements", NEL, "watchers", NW, "mounts", NMOUNT, "fwerr", FWN, J(FWERR));\nprint(stkReport());\n'; } > $o.js
    timeout 900 $b $o.js > $o.out 2>&1; rc=$?
    echo "$TAG $n $(basename $b) exit $rc :: $(tail -c 700 $o.out | tr '\n' ' ')"
  done
done
