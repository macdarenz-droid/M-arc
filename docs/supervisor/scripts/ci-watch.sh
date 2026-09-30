#!/bin/bash
# Waits until guard, source-gate and visual-gate-tz all exist and every run is complete.
# Usage: ci-watch.sh label:sha ... ; prints one line per sha when all its check runs complete, exits when all done.
declare -A done
while true; do
  left=0
  for a in "$@"; do
    l=${a%%:*}; s=${a#*:}
    [ -n "${done[$s]}" ] && continue
    left=1
    r=$(curl -s "https://api.github.com/repos/macdarenz-droid/M-arc/commits/$s/check-runs?per_page=50" | python3 -c "
import json,sys
try: d=json.load(sys.stdin)
except Exception: sys.exit()
runs=d.get('check_runs',[])
req={'guard','source-gate','visual-gate-tz'}
if not req <= {x['name'] for x in runs} or any(x['status']!='completed' for x in runs): sys.exit()
print(' '.join(f\"{x['name']}={x['conclusion']}\" for x in runs))" 2>/dev/null)
    if [ -n "$r" ]; then echo "CI $l ${s:0:7}: $r"; done[$s]=1; fi
  done
  [ $left = 0 ] && exit 0
  sleep 90
done
