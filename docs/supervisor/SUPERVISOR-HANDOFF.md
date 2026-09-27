# Supervisor handoff (M/ARC)

The one current handoff for whoever supervises next. Update it in place; don't make copies.
Written 2026-09-27 by the outgoing supervisor, session_01PjbZXTVmMJU2evEYqGPdNm.

## 0. Read first
- `AGENTS.md`: the owner's ULTIMATE RULE and "How work is delivered". The `.claude/owner-rules.md` hook prints the rules before every reply.
- Relay: `PROJECT_STATE.md` (the current picture), the dashboard items (C-1 to C-10, BUG-*) and `LOG.md`.
- The owner's plan limits: the weekly usage showed a warning on 09-27 (resets Fri 2 Oct 08:00 UTC), and the 5-hour session limit has stopped all agents twice. Keep agents lean: one focused reviewer per item, no big multi-agent runs unless the owner asks.

## 1. State (2026-09-27 05:20 UTC)
- **main = 5f282d7.** Owner checklist items 1-7 are merged, plus the hotfixes BUG-7/8/9 (PR #31) and BUG-10 (in PR #33). An APK was sent after each merge; the last one is artifact 10922892138, from run 36291308791.
- **Item 7.5, anonymous error reports** (spec `docs/ERROR-REPORTS.md`, owner-approved 2026-09-26). The owner PAUSED both builders on 2026-09-27 to save usage:
  - App: session_01R2d78rJZwSVy8dao6oakEM, branch `claude/marc-errors-app`, no PR yet.
  - Worker: session_0139jtydYpLkAjf7wsDPmUvS, branch `claude/marc-errors-worker`, **PR #34. The owner merges it, and merging deploys the Worker. Agents never merge it.**
  - The shared report contract is written in both task cards: `POST /errors`, `{v:1, reports:[…]}`, ≤20 reports, ≤8 KB, allowlisted fields.
  - To resume: nudge each session (`create_trigger` with `persistent_session_id` → `fire_trigger` → `delete_trigger`).
  - Review: ONE reviewer on a strong model for privacy, covering both PRs:
    - the scrubber is allowlist-first, consent is off by default, and nothing personal is sent or logged;
    - the app and Worker match the contract;
    - A1-A8 and W1-W8 each fail before and pass after.
  - Then merge the app PR and send the APK. Give the owner the Worker PR with plain deploy steps: set `ERRORS_SUMMARY_TOKEN`, run any migration, add the privacy-policy line.
- **Next, in the owner's order:**
  - 8: full QA analysis and 9: the 50-user simulation. These are findings only, on the final main, after 7.5.
  - Then a cross-check, a fix loop, 10 release readiness (`docs/RELEASE-READINESS.md`) and the final APK.
  - The store upload waits for the owner's real-phone test.
- **Queued for the fix loop:**
  - the BUG-8 wording for 3+ missing fields ("Add sex and height and weight…");
  - the R5.5 service-worker gate block crashed in a reviewer sandbox but passes in CI, so check it isn't fragile across environments;
  - the muscle panel's `bestEverHint` shows "0 reps" for distance-only exercises (pre-existing);
  - the Dock spinner's 400 ms minimum is bypassed on the Escobar load-failure path (Dock.tsx:24-38).

## 2. New feature: exercise library, form guide, warm-up (design only)
- Design: `docs/GUIDE-UPGRADE-ARCHITECTURE.md` on branch `claude/marc-regression-architecture-gegkbq` (67d7c06). It replaces FORM-GUIDE-ARCHITECTURE.md.
- Rendered demo for the owner's critique: the Design canvas https://claude.ai/artifact/HXZTVGUvFz7kqfzuBDrQmD (private to the owner), published 2026-09-27 ~05:45 UTC. It has 13 artboards in three rows:
  - the flow: Train, About sheet, Machine guide, Warm-up, Search, Create my own;
  - the 3 animated players;
  - Train in 4 other themes.
- Status and specs: `docs/design/form-guide-demo/` (README, SPEC, RIG, 3 PLAYER docs).
  - Chest press passes QA round 3.
  - Lateral raise passed round 2.
  - Lat pulldown is fixed; its spec changes D1-D3 are signed off (PLAYER §9 wins over SPEC 3.2). One low item is left: the far-elbow start and stop is a little sharp.
  - The final canvas review applied 11 of 13 fixes.
- To improve the demo after the owner's feedback, read the artboards from the canvas (`read` with `path: "project/<name>.dc.html"`), edit them, and republish only the changed files. The canvas's own SKILL.md has the rules.
- **The owner approved the demo design on 2026-09-27 ("I like it").** Build order, per the doc's status line (building starts after checklist items up to 7.5 merge): 7.5 merges → build the guide upgrade as the doc's Part 4 patch list (library → About sheet → form guide → machine guide → warm-up; one builder per patch, strict order, same merge/APK rules) → items 8/9 then run on the final build, which includes it → fix loop → 10. The owner asked for 3 animated exercises (Machine Chest Press, Lat Pulldown, Dumbbell Lateral Raise). If the design is approved, all library exercises get animated later, in slices, via the pattern files, overrides and coverage ratchet the doc describes.
- The render workflow script: `/root/.claude/projects/-home-user-M-arc/06790388-49f8-576d-a2f2-765dd355dff8/workflows/scripts/guide-upgrade-doc-and-render-split-wf_8bab1b6a-83a.js` (run wf_8bab1b6a-83a). Its source files are in that session's scratchpad `render-guide/`. A new session can't reach them, so improve the demo from the published canvas files (read them with the Artifact tool).

## 3. How merges work (keep exactly)
- **Merge an app PR only when all of these hold:**
  - its review passed;
  - CI is green on a head that contains the latest main;
  - it is next in checklist order (hotfixes may go first).
- **How to merge:** `merge_pull_request` with `merge_method: merge` and the full `expectedHeadSha`. Mark the PR ready first if it is a draft.
- **APK after every app merge:**
  1. Check that main's tree equals the tested head's tree: `git rev-parse origin/main^{tree}` vs `<head>^{tree}`.
  2. Take the MARC-DEBUG-APK artifact from that head's green run.
  3. Check that the android-gate step "Sign with the permanent key and verify the fingerprint" passed.
  4. Send the owner `https://github.com/macdarenz-droid/M-arc/actions/runs/<run>/artifacts/<id>`.
- **Builders:** `create_session` with model claude-sonnet-5, `outcome_branch claude/…`, tag `config:auto-create-pr:draft`, and a full task card (see earlier prompts in AGENTS.md "Builders"). Builders often get 403 on PR create or edit; the supervisor then opens the PR and writes its body. Archive the builder after its merge, and unsubscribe from the PR.
- **Review lessons:**
  - Check each PR body against its spec's acceptance list first; missing probes are common.
  - Every animation or gesture path needs at least one gate probe WITHOUT `reducedMotion`. BUG-9 slipped through because the gate ran under reduce.
  - Evidence counts only for the exact commit it ran on.
  - When main moves under a PR, check the merge with `git show --remerge-diff <merge>`.
- **Supervision:** react to PR events (`subscribe_pr_activity`). As a fallback, keep a self check-in with `send_later` about every 30 min. The old fallback trigger trig_01Skke48poTs2Xo5f8PV1oTF is bound to the old session and DISABLED; create your own.
- **Relay after real changes:** `update_item`, a `LOG.md` line, and `PROJECT_STATE.md` (the ULTIMATE RULE stays at the top). No URLs or secrets in Relay.

## 4. Never
- Commit keys or secrets.
- Touch the signing steps, `EXPECTED_SHA256` or the keystore, or rotate the key 05:66…F1:F5.
- Push to main.
- Merge PR #3 (the GPT watch branch) or the Worker PR #34.
- Deploy the Worker.
- Skip or loosen a test or gate check.
- Rewrite history on others' branches.
- Work around a permission denial.
- Change native/wear/**, src/native/wearEngine.ts, WatchLab.tsx or the watch agent's CI lines.
- New kinds of stored or sent data, spending and releases are the owner's call.
