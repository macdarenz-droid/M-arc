#!/bin/bash
# M/ARC PR watcher: one line per new builder/reviewer comment or title change on active PRs.
last=${SINCE:-$(date -u -d '-2 minutes' +%Y-%m-%dT%H:%M:%SZ)}
prev=""
SKIP="1 3 36 88 92 94 95 96 97"
while true; do
  now=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  pulls=$(curl -s "https://api.github.com/repos/macdarenz-droid/M-arc/pulls?state=open&per_page=40" 2>/dev/null)
  nums=$(echo "$pulls" | python3 -c "
import json,sys
skip=set(map(int,'$SKIP'.split()))
try: d=json.load(sys.stdin)
except Exception: sys.exit()
for p in d:
  if isinstance(p,dict) and p['number'] not in skip: print(p['number'])
" 2>/dev/null)
  for n in $nums; do
    curl -s "https://api.github.com/repos/macdarenz-droid/M-arc/issues/$n/comments?since=$last&per_page=50" 2>/dev/null | python3 -c "
import json,sys
try: c=json.load(sys.stdin)
except Exception: sys.exit()
if not isinstance(c,list): sys.exit()
for x in c:
  b=x['body']
  if b.startswith('**Supervisor') or b.startswith('**Paused'): continue
  print('#$n comment:', b.split('\n')[0][:120], flush=True)
" || true
  done
  cur=$(echo "$pulls" | python3 -c "
import json,sys
try: d=json.load(sys.stdin)
except Exception: sys.exit()
for p in d:
  if isinstance(p,dict): print(p['number'], p['title'][:50])
" 2>/dev/null | sort)
  if [ -n "$prev" ] && [ -n "$cur" ]; then comm -13 <(echo "$prev") <(echo "$cur") | grep -v '\[fixing\]' | sed 's/^/title: /'; fi
  [ -n "$cur" ] && prev=$cur
  last=$now
  sleep 60
done
