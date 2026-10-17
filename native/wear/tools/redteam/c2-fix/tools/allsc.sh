#!/bin/bash
# allsc.sh <tag> <page> <bin>: the red team's allsc.sh (every rt-e, rt-f and builder C2 scenario on one binary;
# exit code per scenario), outputs in c2-fix/out/<tag>
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; E=$S/rt-e
TAG=$1; P=$2; B=$3; D=$S/c2-fix/runs/$TAG; mkdir -p $D
for sc in $E/s*.js $S/rt-f/f*.js $S/c2-build/rtc2/s30_plan.js $S/c2-build/rtmem/s50_mem.js; do
  n=$(basename $sc .js)
  case $n in s1|s10|s12|s13|s13_hang|p1|prelude|fixed-page) continue;; esac
  o=$D/$n
  { cat $E/prelude.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $sc; } > $o.js
  timeout 900 $B $o.js > $o.out 2>&1; echo "$n exit $?"
done | sort | tr '\n' ' '
echo
