#!/bin/bash
# build.sh <stackKB> <heapKB>: jerry with stk() (max stack bytes seen at call checks)
D=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3; J=$D/jsrc
gcc -O1 -w -o $D/jb/jerry$1h$2 -DJERRY_STACK_LIMIT=$1 -DJERRY_GLOBAL_HEAP_SIZE=$2 -DJERRY_MEM_STATS=1 -DJERRY_ES2015=0 -DJERRY_BUILTIN_REGEXP=1 -DJERRY_ERROR_MESSAGES=1 -DJERRY_LINE_INFO=1 -DJERRY_DEBUGGER=0 -DJERRY_NDEBUG -I$J/jerry-core/include $(find $J/jerry-core -type d | sed 's/^/-I/') -I$J/jerry-port/default/include $(find $J/jerry-core -name '*.c') $J/jerry-port/default/*.c $D/jb/main.c -lm 2>&1 | grep -i error | head -5
