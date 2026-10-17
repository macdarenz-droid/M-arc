#!/bin/bash
# bj.sh <stackKB> <heapKB>: JerryScript runner as rt-e/build.sh, output c2-rt/jb/jerry<stack>h<heap>
E=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/rt-e; J=$E/jsrc
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt/jb; mkdir -p $D
gcc -O1 -w -o $D/jerry$1h$2 -DJERRY_STACK_LIMIT=$1 -DJERRY_GLOBAL_HEAP_SIZE=$2 -DJERRY_MEM_STATS=1 -DJERRY_ES2015=0 -DJERRY_BUILTIN_REGEXP=1 -DJERRY_ERROR_MESSAGES=1 -DJERRY_LINE_INFO=1 -DJERRY_DEBUGGER=0 -DJERRY_NDEBUG -I$J/jerry-core/include $(find $J/jerry-core -type d | sed 's/^/-I/') -I$J/jerry-port/default/include $(find $J/jerry-core -name '*.c') $J/jerry-port/default/*.c $E/jb/main.c -lm 2>&1 | grep -i error | head -5
echo built $D/jerry$1h$2
