# Ordered workflow for Sonnet Medium

Read [01-ARCHITECTURE.md](01-ARCHITECTURE.md) as the contract and [03-REGRESSION-MATRIX.md](03-REGRESSION-MATRIX.md) as the required proof. New feature status starts at NOT STARTED. Do not reuse the completed older roadmap's checkmarks.

## The loop after every patch

1. **Orient.** Confirm the branch, current remote SHA, clean or understood worktree, prior patch gate, owners and relevant tests. Read only the current patch's source after the initial architecture read.
2. **Make failure observable.** For behavior/mutation changes, add focused tests for the specified boundary and failure cases. Demonstrate the regression fails for the intended reason before the fix where practical. Avoid tests that merely assert source strings or mirror implementation.
3. **Implement one patch.** Preserve unrelated behavior and all existing tests. Keep decisions pure and mutations at the established guarded boundaries. Do not bundle dependency upgrades, restyling or cleanup.
4. **Review.** Inspect the complete diff. Ask a separate reviewer to challenge data loss, stale state, timing, chronology, payload boundaries and UI interference; provide the contract and patch-specific test IDs. Reviewers do not edit shared owners concurrently. Fix findings and add regression coverage. Persistence, journal, grounding and action changes require independent review before advancement.
5. **Verify.** Run focused tests, then the full local gate below. Add relevant browser scenarios to the mandatory `npm run gate`, not an optional test nobody runs. Inspect the screenshots and console/network checks. Fix failures without asking the owner to request regression.
6. **Record and commit.** Update PROGRESS with changed behavior, decisions, exact commands, results, review findings and limitations. Commit only intended files with the patch's focused message. A partial patch stays IN PROGRESS.
7. **Push and watch.** Push to the working branch. Verify the remote SHA equals the pushed commit. Follow the `M/ARC gate` run whose `head_sha` equals that commit. Both source-gate and android-gate must succeed. Fix/retest/commit/push any failure before the next patch. Cancelled, queued, skipped or old green runs do not count.
8. **Continue.** Record that remote result at the next patch's start and begin the next unfinished patch without another prompt. If interrupted, leave a precise resume point. If the owner changes scope, reconcile it before dependent work.

Each numbered patch is a bounded unit; split an unexpectedly large one into named subpatches with the same gate and dependency order. Do not batch shared-file work across patches. Never weaken a gate, delete failing assertions, introduce new skips, relax grounding, or accept a fallback screenshot to make a run green.

Regression IDs describe the final combined product. At each patch, implement and run the portions whose behavior exists in that patch or a completed predecessor. Later-owned fields/flows remain explicitly NOT STARTED in the coverage ledger, not skipped tests or false passes. For example, P01 validates presence metadata; objective-specific D03 cases belong to P08. P10 requires every ID in full. Do not build a future feature early merely to satisfy a broad browser scenario reference.

## Full local gate

Use Node 22+ and the lockfiles. Run `npm ci` and `npm --prefix proxy ci` on initial setup or when a lockfile changes; existing verified installs can be reused otherwise.

```sh
npm run typecheck
npx tsc --noEmit -p proxy/tsconfig.json
npm test
npm --prefix proxy test
npm run build
npm run gate
git diff --check
```

Install the browser once with `npx playwright install chromium` (`--with-deps` on a suitable Linux runner). For an existing local Chrome, the gate supports `MARC_CHROMIUM` set to its actual executable. Keep the shared fixed fixture clock; do not rely on the host's current time. Add deterministic morning/midnight/timezone tests rather than changing all fixtures to today.

`npm run check` equals app typecheck/tests/build; `npm --prefix proxy run check` equals proxy typecheck/tests. Use either equivalent sequence and record what ran. The baseline had eight explicitly conditional live-model tests skipped without credentials; report them honestly, require no new skips, and test new network behavior with deterministic mocks. No API credential or Worker deployment is needed for this app-only scope.

## P00 — Establish the current baseline

**Read:** this package, current source and prior roadmap handoff. Confirm baseline commit `564df82` is an ancestor; if the branch advanced, inspect the additional commits and reconcile rather than resetting it.

**Do:** fetch, check Git status/branch, inventory available commands, run the full local gate, inspect exact-head CI. Record test counts and existing skips. Verify old regression tests from matrix O01–O12 remain. Baseline evidence from September 21 was 627 app tests, 87 passing proxy tests and eight existing skips; this is historical evidence, not permission to claim current tests passed.

**Exit:** a verified baseline or a focused repair with its own green gate. Do not build new features on a red branch. No empty “baseline verified” commit is needed.

## P01 — Pure presence selector, tone and dismissal policy

**Own:** NEW moment/copy modules and tests; optional `coach.presence` normalization; narrow selector adapter. Keep network and UI mounting out of this patch.

**Do:** implement deterministic priority/tie-breaking, stable observation/evidence identity, one-cue/null behavior, Steady/Direct templates, bounded durable dismissals and existing proposal-dismissal reuse. Cache history-derived facts separately from UI state. Add optional metadata with safe defaults and backup round-trip.

**Proof:** M01–M07, D01–D03 and PERF01. Tone equality asserts identical non-copy outputs. Dismissal selection is pure; two tabs share evidence identity.

**Exit:** pure contract and state lifecycle work offline; no old behavior changes from default normalization. Suggested commit: `feat(escobar): add shared coaching moment selection`.

## P02 — Quiet presence and local explanations across screens

**Own:** shared launcher/cue/panel plus Today, Train, History, Body, Coach and contextual Settings integration. Use the P01 selector.

**Do:** one reusable launcher in existing headers; reuse existing coaching slots instead of adding competing banners. Shared UI controller preserves selection/draft/scroll. Keep active set fields, rest banner and destructive confirmations in control. Details explain existing supported evidence using local templates. No global online Ask refactor yet.

**Proof:** B01–B05 and B12 for current presence surfaces; M03/M06; zero external requests on navigation/open/dismiss; all five themes and narrow screens. Instrument each new browser context for errors. Workout/objective flows B10/B11 remain for P07/P09.

**Exit:** every main surface offers a useful local Escobar entry, no duplicated cue or modal stacking, no focus/input loss. Suggested commit: `feat(escobar): add contextual presence across app screens`.

## P03 — One shared optional Ask conversation

**Own:** App/controller, Coach and AskSheet lifecycle; existing Ask payload/memory tests. Keep proxy contract unchanged.

**Do:** unify Ask host, context by IDs, visible editable prefill, fresh lookup on send, shared saved review and draft, no automatic submission. Add the in-handler remote-enabled guard. Clear/reset/restore invalidates request generations and reinitializes all transient controller state; stale success/error/finally cannot alter newer state. Preserve typed draft on ordinary close/navigation and make deliberate discard explicit.

**Proof:** A01–A10 and B06–B09; actual handler remote-off rejection, one request per send, payload allowlist and number grounding, late reply after clear, quota/timeout and saved review offline. Verify user text is not silently truncated by contextual prefill.

**Exit:** local presence is independent of network; old Coach conversation and actions still work. Suggested commit: `feat(escobar): share guarded contextual Ask across screens`.

## P04 — Optional intent contract and safe normalization

**Own:** models/store, capturePlan/startSession and NEW normalization/intent tests. Follow architecture section 5 exactly; no plan-fit label UI yet.

**Do:** independently version/validate assessment wrapper and bounded journal; capture new-session normal or already accepted deload intent before work. Show its purpose/cap in start/active UI. Leave old saved and resumed sessions unchanged. Validate links/indices/events; corruption drops assessment only. Test export/import and atomic persistence.

**Proof:** D01–D04/D06–D07 and I01–I06 for intent metadata. Cover every existing way to start/resume a session, current goal changes, deload boundaries and failed import metadata. Journal/projection integration D05 belongs to P05; classifier I07 belongs to P06.

**Exit:** no lost logs, no backfilled intent and no invented normal-day cap. Suggested commit: `feat(escobar): capture supported session intent safely`.

## P05 — Prospective accepted changes and evidence integrity

**Own:** workout/session mutation paths, shared target resolution, History/sessionEdit, normalization fixtures. One owner edits these sequentially.

**Do:** append agreement events and update acceptedTargets/overrides atomically after existing stale guards. Preserve overrides on append. Adopt only explicitly accepted additional targets. Record added/replaced/removed entry relationships. Track structural deletion and cleared-work invalidation so deleted evidence never becomes success. Maintain valid actualSetIndices through finish. Preserve Undo semantics.

**Proof:** J01–J12, D05 and D04 lifecycle replay, plus O01–O07/O10. Test same-count edits, partial drafts, ordinary retyping versus clear-then-retire, added rows, append/reload/finish, replacement/Undo chains, add-below, skip versus remove and History deleting the final row. Independent review of all mutation paths is mandatory.

**Exit:** journal, original plan, effective targets and actual logs agree across UI/reload/export/debrief; stale actions leave every part unchanged. Suggested commit: `fix(escobar): preserve prospective workout agreements`.

## P06 — Deterministic fair plan-fit projection

**Own:** NEW planFit module and focused tests; minimal existing debrief adapters. No new brain scoring weights or remote fields.

**Do:** build named expected slots, apply valid journal, retain uncertainty, compare supported modes, enforce exact label ordering and keep existing PR outputs independent. Return counts/reasons for local copy. Reject empty-plan success and cap breaches inferred from invalidated data.

**Proof:** F01–F16 and I07; chronological existing tests remain intact. Use table-driven edge cases and deterministic malformed/import fixtures. Compare equivalent kg/lb UI paths, not display-unit-rounded targets.

**Exit:** expected outcomes in the regression matrix pass without using debrief.plannedSets as an adherence denominator. Suggested commit: `feat(escobar): assess workout fit against saved agreements`.

## P07 — Purpose-aware debrief and consistent coaching copy

**Own:** finish/History debrief UI, Train purpose cue, Coach/Today local selection and templates.

**Do:** separate Achievement, Plan fit and evidence detail. Expand original target, accepted change and actual work with provenance. Keep real records visible. Provide uncertainty/coverage next to the verdict. Honor accepted changes consistently across Train/History/Coach. Surface normal without a cap honestly; a missed target is not a rating of the user.

**Proof:** B05/B10/B12 and F01–F16 rendered outcomes; Steady/Direct show the same facts. Test a PR plus cap breach, accepted easier target, missing effort, starter replacement, old session and deleted evidence. Objective scenario B11 remains for P09. No new remote metrics needed.

**Exit:** user can understand the verdict and inspect why; five themes, long labels, kg/lb and narrow layouts remain usable. Suggested commit: `feat(escobar): explain achievements and plan fit separately`.

## P08 — Optional personal objective agreement

**Own:** optional objective model/normalizer, Coach editor and local summary; objective tests. Reuse existing GoalId and catalogue values.

**Do:** implement architecture section 7's bounded fields, explicit Save/cancel/revision, optional chosen review date and up to three evidence measures. Keep stated availability/equipment separate from automatically enforced schedule rules. Detect missing exercise references without deleting the whole objective.

**Proof:** G01–G05, D01–D03, A07. Test save/cancel/update/reload/import, invalid fields, Unicode/long statements, unknown exercise, changing old goal after an objective and no automatic programme mutation.

**Exit:** objective is optional, understandable, local and reversible; existing users need no setup migration. Suggested commit: `feat(escobar): add a local personal objective agreement`.

## P09 — Objective review and evidence across surfaces

**Own:** pure review projection, existing weekly/trajectory adapters, Coach review and Today/Body selected cues.

**Do:** show actual measure sources/windows/limits, unknown when insufficient data, due-review cue without background notifications, current objective revision. Use existing review/apply/Undo for supported changes; otherwise navigate to an editor. Do not infer body shape, physique percentage, muscle growth or a plan from prose.

**Proof:** G06–G10, B11/B12, A07, M01–M07, PERF01–PERF02; changed/deleted evidence invalidates open review, goal Undo cannot overwrite newer choices, body measurements remain local.

**Exit:** one coherent direction across the app, with no duplicate review banners or invented success measurement. Suggested commit: `feat(escobar): connect personal objectives to evidence reviews`.

## P10 — Final integrated review and delivery

No new product scope. Run the complete matrix against the combined branch, including legacy import → workout → accepted adjustment → finish → History edit → objective review → reload/backup restore. Use an independent reviewer who did not author the changes; address every correctness/data/privacy finding. If unavailable, record the fresh self-review as such and keep independent review outstanding rather than claiming it happened.

Run the full local gate on the final product tree. Inspect new surfaces in all themes and phone widths; inspect request logs and generated screenshots. Review the complete baseline-to-head diff for unintentional proxy/CI/dependency/data changes. Update docs/source map and progress without rewriting the old completed roadmap. Put integration fixes in focused commits, each with its applicable rechecks and exact-commit gate.

The final delivery commit must pass both jobs of `M/ARC gate`. Verify its head SHA, downloadable `MARC-DEBUG-APK`, contained APK and SHA256 file, screenshot evidence and matching packaged source verification. If possible, download the artifact, verify its checksum, and provide the APK directly. Do not substitute an older artifact or the signed-release workflow. If installation on a phone was not tested, say that once.

Keep CI evidence for a commit in the next patch's record or the final delivery report: a commit cannot contain its own SHA/result before it exists. Do not create an endless series of “record green CI” commits. If you do make any last commit, its own remote gate must also pass before delivery.

**Final report:** plain-language feature list; exact branch/SHA; test and review results with known existing skips; workflow and screenshot links; APK/checksum; material limits. “All done” is forbidden while any required proof remains pending. The owner should not need a second regression request.
