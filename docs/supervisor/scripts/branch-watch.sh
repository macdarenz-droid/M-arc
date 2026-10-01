#!/bin/bash
# One line per new push to the watched research/drawing branches.
declare -A last
while true; do
  for b in claude/lib-8-pilot-a claude/lib-8-hinge-rows claude/lib-8-legs-core claude/lib-8-arms-machines claude/lib-25-poly-primitive claude/lib-26-flat-palm claude/howto-options claude/libht-research claude/esc-nc-no-contacts claude/esc-nc-w-prompt claude/play-1-in-app-policy; do
    sha=$(curl -s "https://api.github.com/repos/macdarenz-droid/M-arc/branches/$b" | python3 -c "import json,sys
try: print(json.load(sys.stdin)['commit']['sha'][:7])
except Exception: pass" 2>/dev/null)
    [ -n "$sha" ] || sha=none
    if [ -z "${last[$b]}" ]; then last[$b]=$sha; continue; fi
    if [ "${last[$b]}" != "$sha" ] && [ "$sha" != none ]; then
      echo "push $b $sha"
      last[$b]=$sha
    fi
  done
  sleep 90
done
