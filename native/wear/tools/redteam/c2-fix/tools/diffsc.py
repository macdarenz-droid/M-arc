#!/usr/bin/env python3
"""diffsc.py <dirA> <dirB>: for each scenario output present in both, print the '|'-separated parts that differ."""
import os, sys
a, b = sys.argv[1], sys.argv[2]
same = 0
for n in sorted(os.listdir(b)):
    if not n.endswith('.out') or not os.path.exists(os.path.join(a, n)): continue
    x = open(os.path.join(a, n)).read().replace('\n', ' | ').split('|')
    y = open(os.path.join(b, n)).read().replace('\n', ' | ').split('|')
    if x == y: same += 1; continue
    print('==', n)
    for i in range(max(len(x), len(y))):
        p = x[i].strip() if i < len(x) else '-'
        q = y[i].strip() if i < len(y) else '-'
        if p != q: print('   A:', p[:220]); print('   B:', q[:220])
print('identical:', same)
