#!/bin/bash
# jrun.sh <build tag> <out tag> [scenario dir...]: run the rt-e prelude + page + each scenario in JerryScript
# (8 and 14 KB stacks); outputs in c2-build/jr/<tag>/<scenario>.<stack>.out
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad
E=$S/rt-e; BT=$1; D=$S/c2-build/jr/$2; mkdir -p $D
shift 2
DIRS="$@"; [ -z "$DIRS" ] && DIRS="$E $S/rt-f"
P=$S/c2-build/$BT/intermediates/loader_out_lite/js/default/pages/index/index.js
for dir in $DIRS; do
  for sc in $dir/s*.js $dir/f*.js $dir/p*.js; do
    [ -f "$sc" ] || continue
    n=$(basename $sc .js)
    case $n in s1|s10|s12|s13|s13_hang|p1|prelude|fixed-page) continue;; esac
    for k in 8 14; do
      o=$D/$n.$k
      { cat $E/prelude.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $sc; } > $o.js
      timeout 600 $E/jb/jerry$k $o.js > $o.out 2>&1; echo "[exit $?]" >> $o.out
    done
  done
done
echo done $D
