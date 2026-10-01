#!/bin/bash
# Usage: apk-watch.sh <sha>. Waits for the build-apk workflow run on <sha> to complete, then prints its conclusion,
# the conclusion of the signing/fingerprint step, and the artifacts (name, id). Exits after one report.
SHA=$1; R=https://api.github.com/repos/macdarenz-droid/M-arc
while true; do
  out=$(curl -s "$R/actions/runs?head_sha=$SHA&per_page=20" | python3 -c "
import json,sys
d=json.load(sys.stdin)
for r in d.get('workflow_runs',[]):
  if 'build-apk' in r['path']: print(r['id'], r['status'], r['conclusion'], r['html_url']); break
" 2>/dev/null)
  set -- $out
  if [ -n "$1" ] && [ "$2" = completed ]; then
    RID=$1
    steps=$(curl -s "$R/actions/runs/$RID/jobs?per_page=50" | python3 -c "
import json,sys
for j in json.load(sys.stdin).get('jobs',[]):
  for s in j.get('steps',[]):
    if 'ingerprint' in s['name'] or 'Sign' in s['name']: print(j['name'],'|',s['name'],'=',s['conclusion'])")
    arts=$(curl -s "$R/actions/runs/$RID/artifacts" | python3 -c "
import json,sys
print('; '.join(f\"{a['name']} id={a['id']} expired={a['expired']}\" for a in json.load(sys.stdin).get('artifacts',[])))")
    echo "APK run $RID $3 $4 | steps: $(echo $steps | tr '\n' ' ') | artifacts: $arts"
    exit 0
  fi
  sleep 60
done
