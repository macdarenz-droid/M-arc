#!/bin/bash
# usage: run.sh <jerry-variant> <scenario.js>
D=$(dirname "$0"); mkdir -p $D/out; o=$D/out/$(basename $2 .js).$1.js
{ cat $D/prelude.js; printf 'function loadPage() { return '; cat $D/bundle.js; printf '\n}\n'; cat $2; } > $o
$D/jb/jerry$1 $o
