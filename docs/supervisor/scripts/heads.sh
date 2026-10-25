#!/bin/bash
# Prints "push <branch> <sha7>" when a watched branch head moves. Polls every 90 s.
# Usage: REPO=<clone path> bash heads.sh (run it with monitor.sh under one Monitor: (SINCE=<utc> bash monitor.sh & bash heads.sh & wait)). Edit BR to the live branches. It never exits on its own.
BR="claude/libht-research-lb9 claude/lib-16-lb6 claude/gate-flake-5 claude/lib-14-lb4 claude/lib-15-lb5 claude/lib-5v-variant-line claude/lib-zoom claude/lib-11-pilot-b claude/ht-11-delta claude/lib-12-hand-views claude/lib-7c-lb1-hands claude/lib-10-lb2 claude/lib-9-lb1 claude/lib-8-pilot-a claude/libht-research claude/sup-lib4-cards claude/sup-handover-1445 claude/howto-options main"
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
