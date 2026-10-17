#!/bin/bash
# run5.sh <page> <bin> <scenario>: as run4.sh with fwm3.js, and prints the JS stack (Error.stack) of the worst mount
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c3-rt
o=$R/out/run5.$$.js
{ cat $S/rt-e/prelude.js $S/c2-rt/fw.js $R/fwm3.js $R/c3pre.js; printf 'function loadPage() { return '; cat $1; printf '\n}\n'; cat $3;
  printf '\nprint("WORST", J(MS), WST);\n'; } > $o
timeout 900 $2 $o 2>&1 | grep -v "^W1" | cut -c1-3000; rm -f $o
