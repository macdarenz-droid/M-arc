export const meta = {
  name: 'ci-watch-floor',
  description: 'Add-only CI fixes promised on #221: javap API floor over capacitor.plugins.json, guard Rule 3 case for the watch ccr-* branches; build, test locally, adversarial review, fix',
  phases: [{ title: 'Build' }, { title: 'Review' }, { title: 'Fix' }],
}
const A = args
const SPEC = `Repo clone: ${A.repo}. Make a git worktree at ${A.wt} on a NEW branch ${A.branch} from origin/main @ ${A.main} (git fetch -q origin first; git worktree add -b ${A.branch} ${A.wt} ${A.main}). Work only there. Commit locally; NEVER push (the supervisor pushes). Rules: AGENTS.md (.github/** is the supervisor's: add checks only, never loosen, never touch signing steps, EXPECTED_SHA256 or keystore lines; no package.json change).

Change 1, .github/workflows/build-apk.yml step "OLD-ANDROID-1 native API floor" (android-gate job): today it runs javap only on MainActivity plus classes named in registerPlugin(X.class) in the generated MainActivity. Capacitor also loads every plugin listed in android/app/src/main/assets/capacitor.plugins.json (a JSON list of {"pkg", "classpath"}), and reflects on their declared members at launch, so a member type newer than minSdk 26 crashes old Android. The watch lane's prepare_android.py (branch origin/ccr-8cef8a15-l12swp, native/wear/android/prepare_android.py: PLUGIN_CLASS com.mrcdrnzz.dailytracker.wear.WearEnginePlugin, appended to capacitor.plugins.json, its .java copied into the app module) adds a plugin only through that JSON, so the step never checks it. Make the step ALSO check every classpath in capacitor.plugins.json, add-only: every class checked today is still checked with the same rule and the same messages; the HealthConnectNativePlugin outer-class check is unchanged. Find each class file where Gradle compiles it: the app module (android/app/build/intermediates/javac/**) or the plugin's own module (Capacitor npm plugins build in node_modules/<pkg>/android/build/; check capacitor.settings.gradle semantics and the real AGP output layout, javac and kotlin-classes). Look up by the entry's pkg, never a full recursive glob over node_modules. A classpath whose compiled class is not found fails the step (fail-closed), naming it. Dedupe a class listed in both places. Print the checked list as today. The JSON must parse and be a non-empty list, else fail.
Change 2, .github/scripts/agent-guard.sh Rule 3: add one case arm, before the claude/* arm, for exactly the watch lane's branches ${A.watchBranches} (exact names, not a ccr-* wildcard: other ccr-* branches exist and are not the watch lane). It applies the same two checks as the codex/* arm (same titles, messages and fixes). Nothing else in the file changes. Then add one line to docs/AGENT-RULES.md where it lists the watch companion's branch, naming these branches as the watch lane's too (read the file; keep its style).
Local proof (put every command and its output in your return):
- Extract the floor's python into a temp script and run it against a fake tree in a temp dir with REAL compiled classes (javac is at /usr/bin/javac; compile tiny Java classes with no Android deps into the expected layout; stub api-versions.xml with >=1000 class entries plus one fake class with since 30 used in a member signature; stub variables.gradle and ANDROID_HOME). Cases, each with exit code and output: (a) the current main layout (MainActivity registerPlugin classes plus npm plugins in node_modules/<pkg>/android/build) green and lists every JSON classpath; (b) a JSON-only plugin in the app module (like WearEnginePlugin) whose method names the since-30 type: red naming it (on main's old step this same tree is green: show that too, the before/after); (c) a JSON classpath with no compiled class: red; (d) capacitor.plugins.json missing or not a list: red; (e) a class in both registerPlugin and the JSON is checked once.
- Guard: run .github/scripts/agent-guard.sh in throwaway clones or worktrees with GUARD_BRANCH set: one of the watch branch names with a change under src/brain/ -> the codex error; the same name with only native/wear/ changes -> passes Rule 3; a claude/x branch unchanged in behaviour (a native/wear change still errors); codex/gt6-gate-a-watch-lab unchanged; another ccr-* name not in the list: no Rule 3 arm (as on main). Use the jq/bash the CI runner has.
- bash -n on the guard; python -m py_compile on the extracted floor; YAML parses (python yaml or a node yaml parser if present; otherwise say so).
Commit message: "CI: API floor covers capacitor.plugins.json; guard Rule 3 for the watch lane's ccr-* branches (add-only)" with a short body, then a blank line and:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01SNCyDETVkqVxtLoQxn2Ue9`

const build = await agent(`${SPEC}

Do it. Return: the commit sha, git diff --stat, the full diff, and every local proof with its output.`, { label: 'build', phase: 'Build' })

const review = await agent(`You are a fresh adversarial reviewer. Another agent built a change in the worktree ${A.wt} (branch ${A.branch}, one commit on origin/main @ ${A.main}). Read-only: never edit, commit or push.
The spec it had:
${SPEC}

Review the diff (git -C ${A.wt} diff ${A.main}..HEAD) against the spec. Try to break it: anything loosened or any existing check, message or class dropped (compare old vs new step line by line); the class-file lookup missing real AGP layouts (javac/<variant>/compileDebugJavaWithJavac/classes, javac/debug/classes, tmp/kotlin-classes/debug) or matching a wrong class; a pkg path with a scope (@capacitor/x) mishandled; set -euo pipefail or heredoc indentation breaking in YAML (the python heredoc is inside a run: | block; check indentation and the terminator); the guard arm not reached or shadowing another; a ccr-* wildcard; any signing, EXPECTED_SHA256 or keystore line touched. Re-run the builder's local proofs yourself and at least two new cases of your own. Return findings as JSON with severity, file:line, problem with evidence, and exact fix.`, {
  label: 'review', phase: 'Review',
  schema: { type: 'object', properties: { verdict: { type: 'string' }, findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string' }, where: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'where', 'problem', 'fix'] } } }, required: ['verdict', 'findings'] },
})
const real = (review?.findings || []).filter(f => !/^low$/i.test(f.severity) || true)
if (!real.length) return { build, review, fix: 'none' }
const fix = await agent(`${SPEC}

The change is built in ${A.wt} (branch ${A.branch}). A reviewer reported:
${JSON.stringify(review.findings, null, 1)}
Verify each finding yourself. Fix every confirmed one in a NEW local commit (same trailer lines; never amend; never push). Re-run all local proofs plus the reviewer's cases. Return: per finding applied/rejected with reason, the new sha, and the proof outputs.`, { label: 'fix', phase: 'Fix' })
return { build, review, fix }