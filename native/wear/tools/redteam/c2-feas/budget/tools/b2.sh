#!/bin/bash
# b2.sh <name> <mode> <tag> [hap true|false] [nocomment 0|1]
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; W=$S/c2-feas/budget; OUT=$W/out-$1-$3
CFG=""; [ "$5" = 1 ] && CFG=$W/tools/nocomment.config.js
cd $W && XHAP=$4 XCFG=$CFG XACE=$OUT/intermediates/sdk/js/build-tools/ace-loader NODE_OPTIONS=--openssl-legacy-provider bash $W/tools/build-x.sh $S/watchbuild/sdk $W/$1/entry/src/main $OUT $2 2>&1 | grep -v -E '^folded|^==|restool|Unsigned'
node $W/tools/split.cjs $OUT/intermediates/loader_out_lite/js/default/pages/index/index.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("total",j.total,"pre",j.preamble,"tail",j.bootstrapTail);for(const m of j.modules)console.log(String(m.bytes).padStart(6),m.label)})'
ls -la $OUT/intermediates/loader_out_lite/js/default/pages/index/ | grep -E '\.(js|bc)$'
