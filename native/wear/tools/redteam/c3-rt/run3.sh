#!/bin/bash
# run3.sh <tag> <page> "<bins>" [fw] -- <scenarios...>: rt-e prelude (+ c2-rt fw.js) + c3pre.js + page + scenario, per runner
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c3-rt
TAG=$1; P=$2; BINS=$3; FW=""; shift 3
[ "$1" = fw ] && FW=$S/c2-rt/fw.js && shift
[ "$1" = -- ] && shift
mkdir -p $R/out/$TAG
for sc in "$@"; do
  n=$(basename $sc .js)
  for b in $BINS; do
    o=$R/out/$TAG/$n.$(basename $b)
    { cat $S/rt-e/prelude.js $FW $R/c3pre.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $sc;
      [ -n "$FW" ] && printf '\nprint("FW elements", NEL, "watchers", NW, "mounts", NMOUNT, "fwerr", FWN, J(FWERR));\n'; } > $o.js
    timeout 900 $b $o.js > $o.out 2>&1; rc=$?
    echo "== $TAG $n $(basename $b) exit $rc"; cat $o.out | cut -c1-900
  done
done
