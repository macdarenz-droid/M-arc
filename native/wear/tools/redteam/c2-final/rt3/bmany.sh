#!/bin/bash
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3
for spec in "$@"; do bash $D/build.sh ${spec%x*} ${spec#*x} & done
wait
ls -la $D/jb/
