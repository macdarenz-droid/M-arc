#!/bin/bash
# b.sh <name> <mode>: build $W/<name>/entry/src/main into $W/out-<name>-<mode>, then split the page
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; W=$S/c2-feas/budget
cd $W && NODE_OPTIONS=--openssl-legacy-provider bash /home/user/M-arc/native/wear/build/build-lite-bin.sh $S/watchbuild/sdk $W/$1/entry/src/main $W/out-$1-$2 ${2:-debug} 2>&1 | grep -v -E '^folded|^==|restool|Unsigned' 
node $W/tools/split.cjs $W/out-$1-$2/intermediates/loader_out_lite/js/default/pages/index/index.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("total",j.total,"pre",j.preamble,"tail",j.bootstrapTail);for(const m of j.modules)console.log(String(m.bytes).padStart(6),m.label)})'
