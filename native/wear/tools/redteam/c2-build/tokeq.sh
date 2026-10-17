#!/bin/bash
# tokeq.sh <tagA> <tagB>: token compare two compiled pages
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad
P=intermediates/loader_out_lite/js/default/pages/index/index.js
ACE=$S/watchbuild/sdk/js/build-tools/ace-loader node $S/c2-feas/budget/tools/tokeq.cjs $S/c2-build/$1/$P $S/c2-build/$2/$P
node $S/c2-feas/budget/tools/split.cjs $S/c2-build/$2/$P | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("total",j.total,"pre",j.preamble,"tail",j.bootstrapTail);for(const m of j.modules)console.log(String(m.bytes).padStart(6),m.label)})'
