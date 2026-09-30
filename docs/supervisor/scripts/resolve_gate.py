import sys,re
p='scripts/screenshot-gate.mjs'
s=open(p).read()
while '<<<<<<< HEAD\n' in s:
    a=s.index('<<<<<<< HEAD\n'); b=s.index('=======\n',a); c=s.index('>>>>>>> origin/main\n',b)
    head=s[a+len('<<<<<<< HEAD\n'):b]; theirs=s[b+len('=======\n'):c]
    rest=s[c+len('>>>>>>> origin/main\n'):]
    # shared closer: lines of rest up to and including the first line that is exactly "}"
    lines=rest.split('\n'); closer=[]
    for ln in lines:
        closer.append(ln)
        if ln=='}': break
    closer='\n'.join(closer)+'\n'
    s=s[:a]+head+closer+'\n'+theirs+rest
open(p,'w').write(s)
