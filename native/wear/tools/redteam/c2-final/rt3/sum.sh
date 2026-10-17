#!/bin/bash
# sum.sh <tag-prefix> <bin name> <variant...>: one line per variant and scenario from out/<prefix><variant>/<sc>.<bin>.out
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3
X=$1; B=$2; shift 2
for v in "$@"; do for n in ${SCN:-w0 w1}; do
  f=$D/out/$X$v/$n.$B.out
  [ -f $f ] || continue
  a=$(grep -o 'max held [0-9]*\|peak [0-9]*' $f | head -2 | tr '\n' ' ')
  [ "$n" = w0 ] && a=$(grep -o 'after open [0-9]*\|peak [0-9]*' $f | head -2 | tr '\n' ' ')
  m=$(grep -o 'mounts [0-9]*\|fwerr [0-9]*' $f | tr '\n' ' ')
  k=$(grep -o 'STK peak [0-9]*\|"m":[0-9]*,"base":[0-9]*,"ifd":[0-9]\|ifNestMax [0-9]*\|elemDepthMax [0-9]*' $f | tr '\n' ' ')
  u=$(grep -c 'UNCAUGHT\|out of memory\|Maximum call' $f)
  e=$(grep -o "ESC \[[^]]*\]" $f | head -1)
  echo "$v $n | $a| $m| $k| errlines $u $e"
done; done
