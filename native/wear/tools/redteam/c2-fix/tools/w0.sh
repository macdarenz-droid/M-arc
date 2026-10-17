#!/bin/bash
# w0.sh <page...>: fw-model run of SC (default W0) on jerry20h96 for each page, one line each
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; R=$S/c2-rt; T=$S/c2-fix/tools
for P in "$@"; do
  ( t=$(basename $P .js)_$(echo $P | md5sum | cut -c1-4); TAILC=${CUT:-420} bash $T/rtfw.sh $P q_$t "${BIN:-$R/jb/jerry20h96}" ${SC:-$R/sc/w0.js} | sed "s#^q_##" | cut -c1-${CUT:-260} ) &
done
wait
