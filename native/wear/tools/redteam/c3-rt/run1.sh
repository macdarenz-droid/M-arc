#!/bin/bash
# run1.sh <page> <scenario> <bin> [fw]: prelude (+ fw.js model when the 4th arg is fw) + page + scenario on one runner
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad
o=$S/c3-rt/tmp.$$.js
FW=""; [ "$4" = fw ] && FW=$S/c2-rt/fw.js
{ cat $S/rt-e/prelude.js $FW; printf 'function loadPage() { return '; cat $1; printf '\n}\n'; cat $2;
  [ "$4" = fw ] && printf '\nprint("FW elements", NEL, "watchers", NW, "mounts", NMOUNT, "fwerr", FWN, J(FWERR));\n'; } > $o
timeout 900 $3 $o; echo "exit $?"; rm -f $o
