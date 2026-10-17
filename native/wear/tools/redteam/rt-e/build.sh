#!/bin/bash
# build.sh <stackKB> <heapKB> [suffix]
D=$(cd $(dirname $0); pwd); J=$D/jsrc
gcc -O1 -w -o $D/jb/jerry$1$3 -DJERRY_STACK_LIMIT=$1 -DJERRY_GLOBAL_HEAP_SIZE=$2 -DJERRY_MEM_STATS=1 -DJERRY_ES2015=0 -DJERRY_BUILTIN_REGEXP=1 -DJERRY_ERROR_MESSAGES=1 -DJERRY_LINE_INFO=1 -DJERRY_DEBUGGER=0 -DJERRY_NDEBUG -I$J/jerry-core/include $(find $J/jerry-core -type d | sed 's/^/-I/') -I$J/jerry-port/default/include $(find $J/jerry-core -name '*.c') $J/jerry-port/default/*.c $D/jb/main.c -lm 2>&1 | grep -i error | head -5
