#!/usr/bin/env bash
# PreToolUse(Bash) hook (WF-2, change 5): runs the Agent guard before any `git push`.
# Exit 2 blocks the push and its stderr reaches the agent; any other exit lets it through.
# The CI guard (.github/scripts/agent-guard.sh) stays the final check: this hook only sees
# pushes run as shell commands.
set -uo pipefail

cmd=$(jq -r '.tool_input.command // ""' 2>/dev/null) || exit 0
printf '%s' "$cmd" | grep -Eq '(^|[^[:alnum:]_-])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+push([[:space:]]|$)' || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
block() { echo "Push refused by .claude/hooks/guard-before-push.sh: $1" >&2; exit 2; }

# Protected targets and force-pushes (AGENTS.md "Never"; this hook also refuses a force-push
# on your own branch, which none of our flows need).
current=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')
reason=$(CMD="$cmd" CURRENT="$current" python3 - <<'PY'
import os, re, shlex
PROTECTED = {"main", "claude/escobar-v2-implementation-eidx64"}
cmd, current = os.environ["CMD"], os.environ["CURRENT"]
for seg in re.split(r"&&|\|\||[;|\n]", cmd):
    try:
        words = shlex.split(seg)
    except ValueError:
        words = seg.split()
    if "git" not in words:
        continue
    words = words[words.index("git") + 1:]
    while words and words[0].startswith("-"):  # git -C dir / -c k=v push
        words = words[2:] if words[0] in ("-C", "-c") else words[1:]
    if not words or words[0] != "push":
        continue
    args, positional = words[1:], []
    for a in args:
        if a == "--all":
            print("--all can push main; push your own branch by name"); raise SystemExit
        if a in ("-f", "--force", "--mirror") or a.startswith(("--force-with-lease", "--force-if-includes")) \
                or re.fullmatch(r"-[a-zA-Z]*f[a-zA-Z]*", a):
            print(f"force-push ({a}) is not allowed"); raise SystemExit
        if not a.startswith("-"):
            positional.append(a)
    refspecs = positional[1:] or [current]
    for r in refspecs:
        if r.startswith("+"):
            print(f"force-push refspec ({r}) is not allowed"); raise SystemExit
        dst = r.split(":", 1)[1] if ":" in r else r
        dst = current if dst == "HEAD" else dst
        dst = dst.removeprefix("refs/heads/")
        if dst in PROTECTED:
            print(f"pushing to {dst} is never allowed; open a pull request instead"); raise SystemExit
PY
)
[ -z "$reason" ] || block "$reason"

# The guard compares with origin/main. This checkout may be shallow, so fetch it first.
git fetch -q --no-tags origin +main:refs/remotes/origin/main 2>/dev/null
out=$(bash .github/scripts/agent-guard.sh 2>&1) || block "the Agent guard failed (read docs/AGENT-RULES.md):
$out"

# If there is no merge base, the guard's watch-file check silently compares nothing.
if ! git merge-base HEAD origin/main >/dev/null 2>&1; then
  note='Agent guard ran before this push, but its watch-file check was skipped: git merge-base HEAD origin/main failed (shallow or unrelated history). The CI guard still runs on the pushed commit.'
  jq -nc --arg c "$note" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:$c}}'
fi
exit 0
