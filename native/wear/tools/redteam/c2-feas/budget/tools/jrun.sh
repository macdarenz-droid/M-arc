#!/bin/bash
# jrun.sh <bundle.js> <tag>: run every rt-e scenario against the bundle in JerryScript (8 KB stack build), output in $W/jr/<tag>/
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/rt-e; W=$S/c2-feas/budget; D=$W/jr/$2; mkdir -p $D
for sc in $R/s*.js; do n=$(basename $sc .js); o=$D/$n.js
  { cat $R/prelude.js; printf 'function loadPage() { return '; cat $1; printf '\n}\n'; cat $sc; } > $o
  timeout 120 $R/jb/jerry8 $o > $D/$n.out 2>&1; echo "exit $?" >> $D/$n.out
done
