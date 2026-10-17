#!/bin/bash
# bjerry.sh <stackKB> <heapKB>: the c2-final rt3 jerry runner (same source and flags), built into c3-rt/jb
S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad; D=$S/c2-final/rt3; J=$D/jsrc; O=$S/c3-rt/jb
mkdir -p $O
gcc -O1 -w -o $O/jerry$1h$2 -DJERRY_STACK_LIMIT=$1 -DJERRY_GLOBAL_HEAP_SIZE=$2 -DJERRY_MEM_STATS=1 -DJERRY_ES2015=0 -DJERRY_BUILTIN_REGEXP=1 -DJERRY_ERROR_MESSAGES=1 -DJERRY_LINE_INFO=1 -DJERRY_DEBUGGER=0 -DJERRY_NDEBUG -I$J/jerry-core/include $(find $J/jerry-core -type d | sed 's/^/-I/') -I$J/jerry-port/default/include $(find $J/jerry-core -name '*.c') $J/jerry-port/default/*.c $D/jb/main.c -lm 2>&1 | grep -i error | head -5
ls -la $O/jerry$1h$2
