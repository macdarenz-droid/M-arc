#!/bin/bash
# sum2.sh <tag-prefix> <variant...>: per variant, scenario and stack: exit, fwerr, overflow lines, applied
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3
X=$1; shift
for v in "$@"; do for n in w0 w1; do
  line="$v $n:"
  for k in 12 13 14 15 16; do
    f=$D/out/$X$v/$n.jerry${k}h96.out
    [ -f $f ] || continue
    rc=$(grep -o "^$X$v $n jerry${k}h96 exit [0-9]*" $D/out/$X$v.txt | grep -o '[0-9]*$')
    fe=$(grep -o 'fwerr [0-9]*' $f | grep -o '[0-9]*$')
    ap=$(grep -o 'phone applied [0-9]*' $f | grep -o '[0-9]*$')
    es=$(grep -o 'ESC \[[^]]\{0,60\}' $f | head -1 | cut -c6-40)
    line="$line | ${k}K exit ${rc:-?} fwerr ${fe:-?} app ${ap:--} $es"
  done
  echo "$line"
done; done
