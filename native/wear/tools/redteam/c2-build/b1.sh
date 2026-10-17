#!/bin/bash
# b1.sh: the B1 builds of the worktree's final sources: the repo script, Huawei's config as 1.1.2 used it,
# comments: false only, and two wrapper mutations that must stop the build
C=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-build
cd $C
P=intermediates/loader_out_lite/js/default/pages/index/index.js
for v in fin:native/wear/build/build-lite-bin.sh fin-orig:$C/build-orig.sh fin-nc:$C/build-nc.sh fin-bad:$C/build-bad.sh fin-two:$C/build-two.sh; do
  t=${v%%:*}; s=${v#*:}
  BUILD=$s bash $C/b.sh $t > $C/$t.b1 2>&1
  echo "== $t: $(grep 'build exit' $C/$t.b1) | page $(stat -c %s $C/$t/$P 2>/dev/null || echo none) B | $(grep -h -o 'expected exactly one babel rule, found [0-9]*' $C/$t.log | head -1)"
done
for t in fin-orig fin-nc; do echo "tokens $t vs fin: $(bash $C/tokeq.sh $t fin | head -1)"; done
bash $C/tokeq.sh fin-orig fin | tail -8
sha256sum $C/fin/bin/entry-default-unsigned.bin $C/fin/$P
stat -c '%s %n' $C/fin/bin/entry-default-unsigned.bin
