#!/bin/bash
# troot.sh <variant>: a mirror repo root with the variant's app source and the repo's watch tests; runs them
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3
WT=/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2
v=$1; M=$D/var/$v/root
rm -rf $M; mkdir -p $M/native/wear/app/entry/src
cp -r $WT/native/wear/test $M/native/wear/test
cp -r $D/var/$v/main $M/native/wear/app/entry/src/main
for f in $(ls $WT/native/wear | grep -v '^app$\|^test$'); do ln -s $WT/native/wear/$f $M/native/wear/$f; done
for f in $(ls $WT/native/wear/app | grep -v '^entry$'); do ln -s $WT/native/wear/app/$f $M/native/wear/app/$f; done
for f in $(ls $WT/native/wear/app/entry | grep -v '^src$'); do ln -s $WT/native/wear/app/entry/$f $M/native/wear/app/entry/$f; done
ln -s $WT/node_modules $M/node_modules
ln -s $WT/package.json $M/package.json
cd $M && node --test native/wear/test/*.test.mjs 2>&1 | grep -E "^not ok|^# (pass|fail)"
