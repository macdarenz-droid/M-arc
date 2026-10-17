#!/bin/bash
# run1.sh <page> <bin> <scenario> [tag]: prelude + fwc (counting fw model) + page + scenario; prints the tail
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; E=$S/rt-e; T=$S/c2-fix/tools
P=$1; B=$2; SC=$3; TAG=${4:-x}
o=$S/c2-fix/run/$(basename $SC .js).$(basename $B).$TAG
{ echo "var MC = {}, ML = [];"; cat $E/prelude.js $T/fwl.js; printf 'function loadPage() { return '; cat $P; printf '\n}\n'; cat $SC; printf '\nprint("FW elements", NEL, "watchers", NW, "mounts", NMOUNT, "fwerr", FWN, J(FWERR)); print("MC", J(MC)); print("ML", ML.join(" "));\n'; } > $o.js
timeout 900 $B $o.js > $o.out 2>&1
echo "exit $?"
tail -c ${TAILN:-1500} $o.out
