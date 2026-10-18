#!/bin/bash
# Prints "push <branch> <sha7>" when a watched branch head moves. Polls every 90 s.
# Usage: REPO=<clone path> bash heads.sh (run it with monitor.sh under one Monitor: (SINCE=<utc> bash monitor.sh & bash heads.sh & wait)). Edit BR to the live branches. It never exits on its own.
BR="claude/gate-flake-4 claude/lib-4b-runner claude/lib-4c-library-ci claude/sup-lib4-ci claude/lib-5-shared-layers claude/lib-9-lb1 claude/lib-8-pilot-a claude/libht-research claude/libht-research-w2a claude/libht-research-w2b claude/libht-research-the8 claude/libht-verify-w2 claude/sup-lib4-cards claude/sup-handover-1445 main"
declare -A prev
while true; do
  out=$(git -C "${REPO:-/home/user/M-arc}" ls-remote origin $(for b in $BR; do echo refs/heads/$b; done) 2>/dev/null)
  while read -r sha ref; do
    b=${ref#refs/heads/}
    [ -z "$b" ] && continue
    if [ -n "${prev[$b]}" ] && [ "${prev[$b]}" != "$sha" ]; then echo "push $b ${sha:0:7}"; fi
    prev[$b]=$sha
  done <<< "$out"
  sleep 90
done
