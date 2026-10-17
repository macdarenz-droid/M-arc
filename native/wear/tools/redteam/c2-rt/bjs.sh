#!/bin/bash
# bjs.sh <heapKB> <stack...>: runners jerry<stack>h<heap>
B=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt/bj.sh
H=$1; shift
for s in "$@"; do bash $B $s $H & done
wait
