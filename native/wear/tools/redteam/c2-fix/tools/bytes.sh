#!/bin/bash
# bytes.sh <dir> <base-bytes>: parse-only heap ("BEFORE") of every page in <dir>, minus from base, largest first
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; E=$S/rt-e; R=$S/c2-rt
D=$1; B=$2; O=$S/c2-fix/runs/bytes; mkdir -p $O
for P in $D/*.js; do
  ( n=$(basename $P .js); { cat $E/prelude.js $R/fw.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; echo 'print("BEFORE", mem(true).alloc);'; } > $O/$n.run.js
    v=$($R/jb/jerry20h96 $O/$n.run.js | grep -o 'BEFORE [0-9]*' | cut -d' ' -f2); echo "$n $((B - v))" ) &
done | sort -k2 -n -r | tr '\n' ' '
echo
