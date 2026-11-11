# M/ARC improvement audit

**Date:** 1 October 2026, Asia/Manila. **Version:** 37.1.0. **Latest main examined:** `d5ebc771b3194dc557d469e40945dfa2ddf1f8ab`. Initial rescan snapshot: `cd3c92152715dbe0877f730fa3cad491df35e28b`.

This is the separate second review requested after the first Codex audit: what the app currently does, where its logic breaks, and what to improve across its features. The original [codex-audit.md](https://github.com/macdarenz-droid/M-arc/blob/7596ee385fe622b8f4635146368505644960c352/codex-audit.md) and [draft PR #144](https://github.com/macdarenz-droid/M-arc/pull/144) are unchanged. This report does not replace that audit, implement fixes, or repeat its whole findings catalogue.

## Current state

At the start of this rescan, main's application code was unchanged from the original audit's `168e5ec6eb4f83c6cb3bfe9ad70897000ece2acd`; only seven documentation/rules files had changed. During the review, [PR #132](https://github.com/macdarenz-droid/M-arc/pull/132) merged as `d5ebc77`: Escobar citation-tag normalization/display, repair wording, a missing day unit in its brief, and accompanying tests/gate coverage. That delta was separately examined and its verification is recorded below. The calculation, mutation, identity and platform paths in this report remain unchanged across that delta. No source fix for the original 32 findings was identified on this reviewed main; deployment-only settings and work on other branches were not treated as fixes.

M/ARC already has a broad functioning feature set: five main screens, live workouts, multiple resistance modes, history and records, recovery/readiness, training plans, equipment-specific loads, an optional tool-using online coach, local notifications, watch/Health Connect integration, backups and sharing. The main improvement opportunity is **consistent behavior when those features interact**. The same workout can receive different answers depending on the screen, time window, gym reference, or mutation path that reads it. Cancellation and Undo also need to apply to the original operation rather than whatever state is current later.

This second pass traces complete state transitions and compares multiple consumers of the same data. It adds focused synthetic counterexamples and a feature improvement plan. P2 denotes material incorrect behavior; P3 denotes limited impact. Proposed enhancements are explicitly separated from defects. All reproductions use synthetic local state or mocked bridges, never paid coach calls or real health records. Source links below refer to the exact current-main snapshot.

## Feature map

| Feature | Current logic | Improvement target |
|---|---|---|
| Today and navigation | Selectors combine schedule, completed sessions, days off, readiness and ranked insights; tabs/panels have native Back support | Use a shared effective-day plan for the dashboard, coach, readiness, reminders and action tools. Taking a day off should change every consumer consistently. |
| Profile and onboarding | Most fields save immediately; onboarding weight remains local until Save; completeness controls automatic prompts | Separate draft editing, completion and dismissal. Keep an open editor mounted until the person explicitly finishes it. Preserve explicit choice for optional fields. |
| Goals | Goal changes affect rep ranges; rest and starter templates are separately offered | Keep this explicit behavior. Preview the affected targets and consistently record provenance; a goal change need not silently rewrite an existing programme. |
| Splits, templates and custom exercises | Splits hold exercise IDs/set counts; live sessions copy them; historical records retain names and measurements | Resolve by stable IDs. Restrict legacy name fallback to genuinely legacy records. Show precisely whether an edit affects today's session, the future template, or saved history. |
| Gyms and equipment | Gym profiles define units, steps/rungs and exercise overrides; sessions retain gym IDs | Keep live gym identity stable. Prevent or reconcile deletion of referenced gyms, and revalidate stale coach proposals against the existing target gym. |
| Live logging | Draft/committed sets, effort/kind, pause/resume, rest, skip, Done, substitution and Finish | Preserve committed work on changes; distinguish replacing future work from deleting completed work. Make all entry points use the same state transition rules. |
| Progression and retargeting | Mode-dependent targets use history, goal, readiness, recovery, deload, equipment and one-day changes | Derive one target with one complete context for preview, live, retargeting and Escobar. Enforce current planned set count, current session gym, actual available loads and retained session overrides. |
| Rest and heart guidance | Timed rest with effort minimums; optional HR threshold and fallback; native completion alerts | Use fresh readings from the current rest, exclude pauses consistently, and reconcile obsolete async alert requests. Preserve conservative timer floors. |
| History and retro entry | Edit/delete/Undo, timing correction and past-session insertion update saved history | Route every mutation through one repair/rebuild path. Keep metadata about edits and source timing; make Undo restore only the intended operation. |
| Recovery and readiness | Personalized heuristic recovery, sleep/check-in/HR/load readiness, fresh marks and historical calibration | Fix prior audit defects, then ensure model rebuild equals replay after every history mutation. Keep data quality and uncertainty visible; no new clinical validity is established by this scan. |
| Records, trends and volume | Mode-specific records and trends, effective muscle sets, planned-versus-logged summaries | Count the intended set kinds and modes consistently; keep prior-week counts, bands and labels bound to the same period. |
| Local coach | Ranked rule catalogue, pre/live/post notes, weekly review, snooze/helpful feedback | Each insight should reference explicit evidence, period, source quality and action applicability. Warm-up attendance is not evidence of completed working volume. |
| Online Escobar | Bounded tool loop, data-sharing gates, source facts, proposals requiring Apply, temporary Undo | Give tools the same selectors as the UI. Bind Apply/Undo to conversation, entity IDs and revisions; revalidate before mutation. Numeric verification alone does not establish sound reasoning or citations. |
| Health Connect | Optional aggregate reads, partial-read merge and automatic refresh after connection | Retain measurement identity/age, define sleep-day aggregation and invalidate reads after reset/restore. Validate real Android behavior separately. |
| Watch | BLE foreground service, scan/connect/forget, contact/freshness signals and workout capture | Make freshness age without packets; test interruption/background paths; bound the JS capture buffer and report quality consistently. |
| Reminders and feedback | Rest, training and backup schedules; notification permission state; haptics and keep-awake preference | Serialize or version side effects so the latest requested state wins. Reconcile saved preferences with native pending work after replacement/resume. |
| Backup and restore | JSON snapshot plus side stores, CSV export, rescue copies, reset and restore Undo | Validate the full accepted state before replacement; make replacement atomic from the app's perspective and invalidate old asynchronous work. Distinguish exported versus confirmed saved. |
| Share cards | Period/style/format/photo selection, local rendering, native or web share/download | Keep comparison periods and measurements consistent with History; verify cancellation and file persistence on supported devices. No new sharing destination is proposed. |
| Exercise guides | Registry-driven lazy guides; eight approved guides within a 153-exercise library | Expand only after each guide passes content/research review. Pending guides are incomplete coverage, not proof that their unseen instructions are wrong. |
| PWA and reliability | Cached app, background save flush, error reporting, five themes, keyboard-capable shared primitives | Fix prior HTTP-error fallback/accessibility gaps; use shared controls consistently, and profile real device workflows as well as pure functions. |


## Findings index

This pass records **21 detailed findings: 20 P2 and one P3**, plus the separately labeled P3 haptics integration issue IMP-E06 and other improvement proposals. These are additional or deeper findings; several share underlying causes with the first audit. Do not add their count mechanically to the first report's 32 as independent root causes. No application fixes were made.

| ID | Priority | Finding |
|---|---|---|
| [ENG-01](#eng-01) | P2 | Live adjustments can prescribe weights from another gym |
| [ENG-02](#eng-02) | P2 | Changing planned set counts can nullify red-readiness reductions |
| [ENG-03](#eng-03) | P2 | A weekly review can criticize last week using this week's volume |
| [ENG-04](#eng-04) | P2 | Warmup-only sessions count as completed training weeks |
| [ENG-05](#eng-05) | P2 | Inserting or retiming history leaves recovery calibration stale |
| [ENG-06](#eng-06) | P2 | Duration advice uses untrusted earlier timing as its baseline |
| [ENG-07](#eng-07) | P2 | Finishing a past workout compares its records against later workouts |
| [UI-R01](#ui-r01) | P2 | Substituting an exercise silently erases already logged work |
| [UI-R02](#ui-r02) | P2 | Same-name custom exercises share another exercise's history |
| [UI-R03](#ui-r03) | P2 | Taking a day off does not remove today's coaching conflict |
| [UI-R04](#ui-r04) | P2 | History corrections retain live timing provenance |
| [UI-R05](#ui-r05) | P2 | Completing the last profile field closes onboarding before Save |
| [UI-R06](#ui-r06) | P2 | Deleting the gym used by a live workout destroys its equipment context |
| [IMP-E01](#imp-e01) | P2 | Live coach targets disagree with the active workout's load adjustment |
| [IMP-E02](#imp-e02) | P2 | Undo toast can undo the same-numbered suggestion in another conversation |
| [IMP-E03](#imp-e03) | P2 | Profile Undo leaves false insights and can corrupt same-day weight history |
| [IMP-E04](#imp-e04) | P2 | A stale equipment suggestion can save into a deleted gym and affect another gym |
| [IMP-E05](#imp-e05) | P2 | Live coach reports running pause as training and frozen rest as expired |
| [IMP-N01](#imp-n01) | P2 | Older notification work can undo a newer cancellation |
| [IMP-N02](#imp-n02) | P2 | An in-flight health read restores data after Reset everything |
| [IMP-N03](#imp-n03) | P3 | A late browser wake lock survives switching it off |

## Verification

| Execution | Exact source snapshot | Result and boundary |
|---|---|---|
| Training-engine counterexamples | `cd3c92152715dbe0877f730fa3cad491df35e28b` | 7/7 proof groups reproduced the asserted behavior. The retro-insertion example compares pure replay outputs plus the traced writer; the timing-correction example also invokes the public mutation in the UI probes. |
| UI/state probes | `cd3c92152715dbe0877f730fa3cad491df35e28b` | 7/7 assertions passed in an independent rerun. They characterize five UI defects, the timing case in ENG-05, and one intentional close behavior excluded from findings. These are not seven new defects or fixes. |
| Native cancellation/reset probes | `cd3c92152715dbe0877f730fa3cad491df35e28b` | 5/5 assertions reproduced three notification races, the health-reset race and the web wake-lock race using controlled promises and mocked bridges. No hardware delivery/battery claim. |
| Existing platform regression tests | `cd3c92152715dbe0877f730fa3cad491df35e28b` | 30 passed across notifications (11), reminders (3), health bridge (12), and keep-awake (4), with unchanged repository tests. |
| Escobar integration probes | Initial `cd3c921`; rebuilt and rerun on `d5ebc771b3194dc557d469e40945dfa2ddf1f8ab` | All eight output/assertion rows reproduced five primary findings and the secondary haptics issue. No live/paid coach calls. |
| Latest citation/brief patch tests | `d5ebc771b3194dc557d469e40945dfa2ddf1f8ab` | 129 passed across four unchanged focused suites; details below. No custom configuration for this run. |

The initial probes are not represented as having run on the later commit. The intervening diff was inspected: it changed Escobar citation/presentation/brief behavior and its tests, mock, screenshot gate and decision notes. It did not change the training, UI mutation, platform or Escobar action/context paths behind the findings. The Escobar probes were rebuilt on the new head to verify that integration separately.

Passing a counterexample assertion means the defect was reproduced, not repaired. The companion `improvement-audit-evidence.zip` supplied with this review contains external probe sources/configurations and captured output, plus exact-source/run instructions. The archive is a separate chat deliverable; this repository change contains the report only. Existing full-suite/build/browser/research evidence remains in the first audit, with its original scope and date.

## Latest code changes

Reviewed exact head `d5ebc771b3194dc557d469e40945dfa2ddf1f8ab`, comparing `cd3c92152715dbe0877f730fa3cad491df35e28b..HEAD` (PR #132). This is a narrow review of the newly changed citation, verification, presentation, mock and brief paths. The review checked the new BUG-31/BUG-33 decisions in [docs/COACHING-DECISIONS.md:1203–1216](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/docs/COACHING-DECISIONS.md#L1203-L1216) against the implementation. No application edits or production/paid calls.

### What changed and was fixed

- Brief-form `[fN]` citations now become canonical citation markers only if **every** listed fact ID exists. An unknown ID leaves the entire tag unchanged for verification, as the new decision explicitly requires. This prevents known citation ID digits from being mistaken for invented numeric claims without exempting an invented adjacent value.
- The loop uses the normalized form for final-answer verification and rendered preambles, while preserving the original model content in stored conversation history. This agrees with the new preservation decision.
- Presentation strips canonical and brief-form tags from answers, preambles, revised drafts, show captions, pin proposal labels, pinned titles and the Unpin accessible label. Existing stored content benefits at render time; its old verification flags are deliberately not re-judged against a newer ledger.
- Streaming buffers incomplete brief-form tags, and repair instructions ask for a direct replacement answer without narration of the internal check. The new mock exercises split tags, a deliberate invented number, repair and the final grounded answer.
- The brief now says “last session 1 day ago” / “3 days ago” instead of omitting the unit; fact values and the always-sent `now` diff key remain intact.

Inspected [src/escobar/context/brief.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/context/brief.ts), `loop.ts`, `verify.ts`, `ui/present.ts`, affected rendering components, mock scenario and changed tests. No additional independently confirmed defect from this diff is added to the audit.

### Exact-head verification

Ran the repository's unchanged Vitest directly on Windows:

```text
node node_modules/vitest/vitest.mjs run tests/escobar/brief.test.ts tests/escobar/verify.test.ts tests/escobar/loop.test.ts tests/escobar/bug-31-cite-tags.test.ts

brief:             13 passed
verify:            67 passed
loop:              32 passed
bug-31-cite-tags:   17 passed
Total: 4 files, 129 tests passed; exit 0; duration 4.11 s
```

No test edit, weakened assertion, alias shim or custom test configuration was used. The changed rendering tests call components with their existing mocked hooks; this result does not replace browser screenshot validation or a real model test.

Rebuilt `work/rescan-escobar-probes.mjs` once from the new head with the existing external harness, then ran it once. All eight assertion/output rows still reproduce E01–E06. Exact commit and timestamp are stored with those rows in `work/rescan-escobar-probes-d5-output.jsonl`; the earlier cd3 results remain separate. This harness continues to use its documented `.ts`-before-`.tsx` resolution for intended logic imports in the Windows checkout; it is separate from the unchanged Vitest run above.

E03's manual-correction reproduction uses **Undo on the original proposal card**, because the manual weigh-in may replace the earlier toast. The immediate 80→82→Undo false-insight reproduction remains the simplest case.

### Remaining boundary

Numeric grounding still tests whether values occur somewhere in the conversation ledger (or other allowed number sources). It does not establish that a cited fact describes the same exercise, date, person or meaning as the sentence. A value can match an unrelated fact. This is a preexisting design limitation, not a new PR #132 regression; future improvement would bind claim values/units to the cited fact and its source context. Passing these checks does not prove every coach statement scientifically or semantically correct.

The worker policy still uses its earlier “restate” wording. The new decision explicitly defers that policy update to a separate owner-merged worker PR; this approved scope boundary is not counted as a new defect. No claims are made here about untested device behavior, live answer wording, the full suite or the browser gate.

## Training logic

<a id="eng-01"></a>

### ENG-01 — P2: live adjustments can prescribe weights from another gym

**Current:** `loadMenu` correctly prefers the current gym's known exercise/group profile and treats another gym's profile as a unit hint only ([src/brain/units.ts:126-161](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/units.ts#L126-L161)). This matches [docs/LOAD-AWARE-TARGETS.md:15-23](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/docs/LOAD-AWARE-TARGETS.md#L15-L23).

**Wrong:** Train still gets `profile` from old `resolveProfile` ([src/slices/workout/Train.tsx:587](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/Train.tsx#L587)), whose other-gym exercise profile ranks above this gym's group ([src/brain/units.ts:49-56](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/units.ts#L49-L56)). Although the opening target receives `equipMenu` at Train `:595-597`, live retargeting reconstructs `loadableValues(profile)` at `:681-683`, dropping the current menu and learned rungs. Warmups and some fallback snaps use that old profile too.

**Executed:** gym A's chest-press profile has 5 kg steps; gym B's known Machine profile has 4 kg steps. Previous B workout was 28 kg × 8, giving a 28 kg × 9 plan. First set today: 28 kg × 4, max. Train's live call returns **25 kg × 6**; passing the already-resolved B menu returns **24 kg × 7**. 25 kg is not on B's configured menu.

**Improve:** use `equipMenu.profile`, `.unit`, and `.rungsKg` as the shared equipment context for targets, live retarget, warmups, inputs, and plate display. Keep the old resolver only where its different semantics are explicitly wanted.

**Acceptance:** configure conflicting profiles in two gyms, switch to B, and log a failed first set. Every subsequent placeholder and coach line must use B's rungs. Repeat with a learned nondefault rung, add-ons, and different kg/lb units.

**Evidence/confidence:** high; `GYM_LIVE_MENU` in the focused results, exact live call at Train `:682`.

<a id="eng-02"></a>

### ENG-02 — P2: changing planned set counts can nullify red-readiness reductions

**Current:** the active session creates exactly the split/override's current rows ([src/slices/workout/session.ts:55-80](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L55-L80)). Red readiness promises one fewer set; docs `LOAD-AWARE-TARGETS.md:73` states the same policy.

**Wrong:** `suggestRaw` replaces today's passed `plannedSets` with the last session's set count ([src/brain/progression.ts:334](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/progression.ts#L334)). Red readiness subtracts from that old count (`:442-444`). Train only sets aside current rows with indices at/above the suggestion length ([src/slices/workout/Train.tsx:131-135](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/Train.tsx#L131-L135)), and maps existing rows rather than resizing the session (`:805`).

**Executed:** last session 6 sets; today's edited split 3 sets; red readiness. Suggestion returns 5 sets and “drop a set.” The three current row indices produce `[false,false,false]` for setting aside: **all three remain**. The same mismatch affects deload scaling (`progression.ts:411`), and large increases in planned count can cause excessive cuts.

**Improve:** define the current planned count as the volume being adjusted, separate from the historical count used as evidence. Apply reduction once to that count. Test overrides and manually added rows without discarding committed sets.

**Acceptance:** prior 6/current 3/red gives 2 usable working rows; prior 3/current 6/red gives 5. A current 3-set lighter week uses the documented factor on 3. Existing logged rows survive recomputation.

**Evidence/confidence:** high; API output `PLANNED_THREE_RED`, plus exact source mapping of row behavior. No browser tap sequence is claimed.

<a id="eng-03"></a>

### ENG-03 — P2: a weekly review can criticize last week using this week's volume

**Current:** review selects this week when completed, otherwise the completed prior week ([src/brain/coach/weeklyReview.ts:177-184](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/weeklyReview.ts#L177-L184)).

**Wrong:** review calls `muscleVolumeStatus` at the *next* week's start (`weeklyReview.ts:207`), but that helper's “over” test takes the maximum of both current and previous weeks ([src/brain/volume.ts:56-58](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/volume.ts#L56-L58)). Thus new sessions after the reviewed week change that prior week's verdict. The review then prints only the prior week's hard-set count.

**Executed:** prior week has 3 sessions, 2 bench sets each; current week has one session with 12 bench sets, insufficient for a 3-session review. The selected review week is September21. Output says **“Chest is over its usual range”** and **“Chest 6 … hard sets last week; chest range 6–10,”** followed by “Trim a set or two … next week.” Six is inside 6–10; the12 from the following week caused the warning.

**Reachable:** [src/slices/coach/Coach.tsx:238-241](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/coach/Coach.tsx#L238-L241) passes the complete session history into the review.

**Improve:** let volume evaluation accept the exact reviewed interval, or bound its input to the review end. Keep a current-week warning separate from the prior-week review. Avoid accidentally letting later sessions seed an earlier week's training level as well.

**Acceptance:** adding/removing a session after a reviewed week's end must not change its counts or over/under verdict. The fixture above must not flag the prior chest week as over.

**Evidence/confidence:** high; `REVIEW_WEEK_CONTAMINATION`.

<a id="eng-04"></a>

### ENG-04 — P2: warmup-only sessions count as completed training weeks

**Current:** warmups are intentionally excluded from working volume, records and training streaks. The app can save a session containing only warmups: finish keeps `hasEntry` sets, including warmups ([src/slices/workout/session.ts:525-531](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L525-L531)); the repository even has explicit warmup-only share tests ([tests/share-qa4.test.ts:112-121](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/tests/share-qa4.test.ts#L112-L121)).

**Wrong:** week completion counts every session record ([src/brain/weekly.ts:60-67](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/weekly.ts#L60-L67)), and review eligibility counts every session ([src/brain/coach/weeklyReview.ts:178](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/weeklyReview.ts#L178)). These disagree with the working-set filter in `trainingStreak` (`weekly.ts:125`). Similar unfiltered session counts also decide whether past weeks qualify for an “under-volume” judgment ([src/brain/volume.ts:48-49](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/volume.ts#L48-L49)).

**Executed:** three dates containing a single warmup each produce **workouts 3, working sets 0, “Strong week — You hit your planned sessions,” review eligible**, while streak is 0.

**Improve:** keep the saved warmup session, but share one explicit `hasWorkingSets` definition for training completion, review eligibility and training-week sufficiency. If warmup attendance deserves its own count, name it separately.

**Acceptance:** three warmup-only sessions must not satisfy three planned training sessions or enable volume judgments. A mixed session with at least one genuine working set counts once. Streak and completion use the same eligibility semantics.

**Evidence/confidence:** high; `WARMUP_COMPLETION` plus reachable save path.

<a id="eng-05"></a>

### ENG-05 — P2: inserting or retiming history leaves recovery calibration stale

**Current:** History Save/Delete correctly rebuilds recovery from the resulting ordered data ([src/slices/history/History.tsx:36-37,289](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/history/History.tsx#L36-L37); [src/slices/workout/session.ts:37-38](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L37-L38)). Replay permits a retro session to contribute prior context even though that retro record itself is not a calibration event ([src/brain/recovery.ts:558-594](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/recovery.ts#L558-L594)).

**Wrong:** `logPastSession` appends/reorders sessions but leaves `recoveryModel` untouched ([src/slices/workout/session.ts:626](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L626)). `resolveSessionTiming` changes day/start/end without rebuilding (`:582-605`). Thus identical visible histories can carry different persisted recovery models depending on the mutation path; even saving an unchanged unrelated history record can suddenly alter them.

**Executed replay plus source-traced writer:** two live bench sessions of 100 kg × 8 at max effort on September 20/26 replay to an empty/default model. Add a retro 120 kg × 8 max session on September 21 to the replay fixture. Replaying the resulting history yields chest `tauScale:1.1, observations:1`. Source inspection of `logPastSession` shows its insertion writer leaves the earlier model in place; this fixture does not directly invoke that writer. The separate timing proof below does invoke the public mutation. This is a consistency proof, not a claim that the physiological calibration policy is valid.

**Additional direct mutation proof:** prior bench 100 kg ×8 max ×3 on September 20; compressed finish 90 kg ×8 max ×3 on September 26 starts with chest tau 1.1/observation 1. Calling `resolveSessionTiming` to move that completed workout to September 29 at 17:00 (60 minutes, user source) leaves the stored 1.1/1, while a clean rebuild gives empty/default tau and observations because the comparison now crosses the 7-day window. Both dates are in the past. See `work/logic-rescan-ui-probe.test.ts` for that public-mutation test.

**Improve:** centralize session mutations and their derived-state invalidation. Recompute/replay after insertion and timing correction, with the same calibration eligibility policy used by finish and editing. Do not incrementally learn retro sessions twice.

**Acceptance:** finish, retro insertion, time correction, edit, delete and undo must all leave `recoveryModel` equal to a clean replay of current history. Include insertion between two existing sessions and retiming across the seven-day comparison boundary.

**Evidence/confidence:** high for the pure replay mismatch plus traced insertion writer (`RETRO_INSERT_REPLAY`), and the executed public timing-correction mutation. This consolidates the first audit's *unconfirmed secondary* timing question rather than repeating a primary finding.

<a id="eng-06"></a>

### ENG-06 — P2: duration advice uses untrusted earlier timing as its baseline

**Current:** post-session temporal insights are gated by the current session's `logging.timingTrusted` ([src/brain/coach/post.ts:209-215](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/post.ts#L209-L215)). Compressed and retro timing are deliberately not trusted ([src/brain/fidelity.ts:84-91,101-115](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/fidelity.ts#L84-L91)).

**Wrong:** `durationDriftInsight` takes the latest 5 same-split durations with no fidelity filter ([src/brain/coach/post.ts:139-142](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/post.ts#L139-L142)). Checking only today's trust does not make yesterday's compressed logging duration a training-duration observation.

**Executed:** five 1-minute compressed, untrusted prior sessions and one trusted 60-minute session generate **“your usual … about 1 min,” “Idle time … most common cause,”** and a superset recommendation. The baseline is the untrusted logging time the fidelity design was intended to exclude.

**Improve:** construct temporal baselines from trusted comparable sessions, require 5 eligible observations rather than 5 records, and avoid attributing duration change to idle time without measuring gaps or accounting for changed sets.

**Acceptance:** adding compressed/retro sessions must not change a trusted duration baseline or meet its minimum. With fewer than 5 eligible sessions, suppress the drift judgment; with 5, use their durations.

**Evidence/confidence:** high; `UNTRUSTED_DURATION_BASELINE`. The idle-time wording is also an improvement opportunity beyond the input-filter bug.

<a id="eng-07"></a>

### ENG-07 — P2: finishing a past workout compares its records against later workouts

**Current:** record detection expects only earlier history. Escobar's session reader supplies it correctly ([src/escobar/tools/read.ts:172-174](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/read.ts#L172-L174)).

**Wrong:** the shared Finish screen gives `postSessionInsights` every other session, regardless of date ([src/slices/workout/Train.tsx:1156-1157](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/Train.tsx#L1156-L1157)). “Log a past session” uses this Finish screen (`Train.tsx:152-153,1113-1114`). Later sessions can erase that workout's genuine record or contaminate its usual-duration comparison; the same workout then receives different answers from the finish UI and session reader.

**Executed:** September 10 bench 50 kg ×8, historical September 15 workout 55 kg ×8, September 20 workout 60 kg ×8 (two sets each). Finishing the historical workout with the UI's other-session filter yields no records. Chronological prior-only input yields its heaviest and estimated-strength records.

**Improve:** derive prior history once by actual training timestamp (with a stable tie policy) inside the debrief API, or enforce that contract in every caller. Use the saved session's intended goal context if historical advice is meant to remain stable.

**Acceptance:** backfill a personal-best workout between an earlier smaller and later larger lift. Finish, History records and Escobar session details agree on that workout's record. A later session cannot become evidence about what was usual before it.

**Evidence/confidence:** high; `PAST_DEBRIEF_FUTURE` plus two production caller contracts.

### Improvements and intentional policies, not newly demonstrated bugs

- **One plan context:** introduce a shared current-session context containing the selected split/override, gym menu, goal, readiness, muscle recovery, deload and planned rows. Make pre-brief, Train, Coach detail and Escobar consume it. ENG-01/02 show why independent reconstruction fails; the original audit already documents other context mismatches.
- **One period context:** give weekly/review functions explicit start/end and qualifying-session predicates. Current-week dashboards and completed-week reviews should use different named queries over the same counting primitives.
- **Goal changes:** `changeGoal` records and updates the goal; rest and templates remain explicit offers. This is intentional ([src/slices/profile/profile.ts:59-80](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/profile/profile.ts#L59-L80)), not a defect. Improve regression coverage of a goal change during an active session and historical debriefs, whose goal is currently read from present state. A past-session goal snapshot would require a deliberate data-model decision.
- **Lighter weeks:** current policy is reactive, at least 28 logged days, beginner restrictions, a 28-day lift-trigger cooldown, seven-day adjustments, and chain protection against repeated load cuts. These are explicit product decisions; this pass does not allege the numbers themselves are calculation defects. Saving only the latest deload makes long-term historical classification fragile; retaining periods would be an architectural improvement requiring a schema decision.
- **Plan evaluation:** rep ranges, duration estimates and weekly-set warnings are deterministic. The 45 s/set plus goal rest duration estimate is acknowledged in `docs/ADAPTIVE-COACH.md:C-7` as a personalization opportunity. Prefer measured trusted time per set, then user rest preference, then the current default. Keep estimated duration distinguishable from elapsed training time.
- **Load-menu ceiling:** `chooseRung` can suggest an extra set when there is no suitable next rung; it does not receive weekly volume or enforce the strength goal's 3–10 main-lift weekly-set condition mentioned in `LOAD-AWARE-TARGETS.md:38,85`. The app offers the textual action rather than automatically adding a row. Add a volume-budget check and a concrete alternative when already at the limit; classify as an incomplete policy, not an automatic unsafe set insertion.
- **Adherence and schedule changes:** the current schedule is projected backwards over 28 days. Without schedule history, changing Monday to Tuesday can rewrite past adherence. Preserve schedule-effective dates or label retrospective adherence as evaluated against the current schedule. This is a model limitation, not proof the existing day arithmetic is wrong.
- **Bodyweight:** fractions affect volume/display only; reps-only progression and unchanged PR behavior are explicit F13 boundaries. Do not claim they are accidental omissions. A future load-aware bodyweight/assisted model needs comparable resistance and exercise-specific geometry, not simply feeding assistance into weighted-lift e1RM.
- **Insights:** several captions still infer cause from descriptive data (effort drift without matched load, duration drift without idle attribution). Better evidence fields and precise predicates should precede stronger wording. The first audit already covers research-validation gaps; they are not recounted as new defects here.

### Coverage ledger

| Family/files | Current behavior reviewed | Result of this pass |
|---|---|---|
| [brain/progression.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/progression.ts), [brain/retarget.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/retarget.ts) | first target, reentry, deload, red/amber gates, double progression, off-plan restatement, rung selection, earn/lever, live set adaptation | ENG-01/02; shared-context and weekly-volume-budget improvements |
| [brain/units.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/units.ts), Train equipment callers | profile precedence, known/learned/assumed menus, logged rungs, snapping, plate combinations, gym-specific context | ENG-01; no new claim that plate DP or conversion arithmetic is wrong |
| [brain/deload.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/deload.ts), [slices/coach/coach.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/coach/coach.ts) | acceptance, seven-day window, chaining, return base, stall/drift/volume/readiness triggers, cooldown | documented policy and period-retention improvement; original SCI defects not repeated |
| [brain/plan.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/plan.ts), split management, `profile/profile.ts` | draft checks, schedule refs, muscle volume, consecutive days, session estimate, CRUD, goal/rest/template transitions | existing features mapped; duration personalization and context improvements |
| [brain/history.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/history.ts), `recovery.ts`, session mutation callers | ordering, plausibility hold/repeat, summaries, off-plan history, calibration inputs and replay, insert/retime/edit/delete | ENG-05; UI-R02/UI-R04 cover identity and provenance defects |
| [brain/weekly.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/weekly.ts), `volume.ts`, `exposure.ts`, `coach/weeklyReview.ts` | completion counts, streak, planned-session fallback, full-week threshold, per-muscle counts/status, reviewed interval, adherence | ENG-03/04; schedule-history improvement |
| [brain/coach/pre.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/pre.ts), `live.ts`, `post.ts`, Train and Escobar call sites | shared target brief, warmup ramp, live cues, record/effort/rest/duration/plan debrief, prior-history filters | ENG-01/06/07; no new source-wide test claim |
| [brain/bodyweight.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/bodyweight.ts), `trend.ts`, `effort.ts`, `effortBias.ts` | mode boundaries, weight resolver, total/repetition meaning, trend windows, break resets, effort evidence | explicit F13 limits and confounding improvements; original findings unchanged |
| [brain/onboarding.ts](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/onboarding.ts), `coach/cues.ts`, rules, dates and selectors | profile gating, deterministic cue selection, local day/week scheduling, rule consumers | family/callsite review; UI-R03/UI-R05 cover day-off and onboarding transitions |

### Focused evidence and limits

Artifacts outside the repository: `work/rescan-science-probe.ts`, its bundled `work/rescan-science-probe.mjs`, and **`work/rescan-science-results.txt`**. Command from repo: `node node_modules/esbuild/bin/esbuild ../rescan-science-probe.ts --bundle --platform=node --format=esm --tsconfig=tsconfig.json --outfile=../rescan-science-probe.mjs`, then `node ../rescan-science-probe.mjs`.

Result: **7/7 synthetic proof groups reproduced their asserted current defects**. These are counterexample assertions, not passing correctness tests. Fixes should invert them into acceptance tests. Data is synthetic; no account, wearable or real user health data was changed. App code was only read; no clinical efficacy claim follows from a source-code probe. This follow-up relies on verified repository policies and runtime math, and adds no new external biomedical claim needing independent literature validation. Full build/regression and device/browser results cannot be inferred from these focused proofs; see the review limits.

## Workflow logic

Five of the six UI findings have focused public-function probes plus handler evidence. History edit provenance is source-confirmed. Onboarding draft loss is a traced render-lifetime conclusion; the probe verifies the eligibility transition, not physical taps.

<a id="ui-r01"></a>

### UI-R01 — P2: Substituting an exercise silently erases already logged work

**Current behavior.** The live Options sheet offers Substitute even after sets were committed or the exercise was marked Done ([src/slices/workout/Train.tsx:884](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/Train.tsx#L884), `:921`). `substituteEntry` spreads the old entry, replaces its identity and exercise, and replaces **every set** with a blank draft ([src/slices/workout/session.ts:368](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L368)). It also retains `done` and `skipped`.

**Reproduction and evidence.** Start a bench session; log 60 kg × 8, commit it, mark the exercise Done, then choose Machine Chest Press as its substitute. The committed bench set disappears, the replacement has only empty sets, but its Done flag is still true. Finishing a one-exercise example calls the empty-session discard branch (`session.ts:531`), so history contains zero sessions. The audit probe reproduces exactly this state. A skipped exercise's replacement similarly remains skipped. There is no substitution Undo at `Train.tsx:921`; the nearby Remove action does offer one (`:895`).

**Why it matters.** A user switching equipment after a set loses performed work, and a blank replacement can appear completed. This is a separate route from the first audit's Skip finding.

**Improvement and acceptance.** Preserve the performed original sets when replacing the remaining work; alternatively present the precise destructive change and an Undo. Reset replacement `done/skipped` flags. A regression should prove committed original work remains in history after substitution, the replacement starts unfinished, and undo restores exact entry IDs, sets, notes and targets without affecting a later session.

<a id="ui-r02"></a>

### UI-R02 — P2: Same-name custom exercises share another exercise's history

**Current behavior.** Create and add accepts any nonempty name plus muscles ([src/slices/workout/ExercisePicker.tsx:19](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/ExercisePicker.tsx#L19), `:73`) and stores a new ID ([src/slices/workout/splits.ts:81](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/splits.ts#L81)). Exercise history matches either ID **or** a name resolved against the current catalogue ([src/brain/history.ts:123](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/history.ts#L123)). Exact-name resolution chooses the first custom exercise with that name ([src/core/exercises.ts:136](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/core/exercises.ts#L136)).

**Reproduction and evidence.** Create A named Chest Press with Machine equipment, then B named Chest Press with Dumbbells equipment. Log a session for B only. Querying A's history returns B's session and 20 kg top load even though the saved `exerciseId` is explicitly B; B's history also returns it. The executable probe confirms A=1 session where A should have zero. A custom name that duplicates a library name has the same class of risk. The Escobar creation path already rejects an existing exact name ([src/escobar/tools/actions.ts:333](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/actions.ts#L333)), but the manual picker does not.

**Why it matters.** The app can learn a starting target, records and recovery comparisons from a different implement or movement. Renaming or adding catalogue entries can alter how old known IDs are interpreted.

**Improvement and acceptance.** Treat valid exercise IDs as authoritative. Use name fallback only for truly unresolved legacy IDs, with explicit migration/disambiguation. Decide whether duplicate display names are allowed and enforce the same decision in picker and coach. Distinct known IDs must retain separate history even when their names normalize to the same string; legacy name-only records must still resolve predictably.

<a id="ui-r03"></a>

### UI-R03 — P2: Taking a day off does not remove today's coaching conflict

**Current behavior.** Today writes a day-off exception and correctly changes the card to Day off ([src/slices/today/Today.tsx:84](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/today/Today.tsx#L84), `:90`; [src/slices/today/dayOff.ts:6](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/today/dayOff.ts#L6)). Weekly target/streak code honors it. The scheduled split selector still reads the weekday schedule directly ([src/app/selectors.ts:20](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/app/selectors.ts#L20)), and Coach both derives readiness and runs `recovery.scheduled-conflict` from that raw schedule ([src/brain/coach/rules.ts:179](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/rules.ts#L179), `:230`), without excluding `daysOff`.

**Reproduction and evidence.** Schedule Push for Thursday, log six max-effort bench sets Wednesday, then tap Take today off on Thursday. Probe output with `daysOff=['2026-10-01']`: **“Push today, but chest is only 53% recovered”**, with the action **“Swap to another split today, or keep Push light and put the hard sets elsewhere.”** Today simultaneously says Push can wait and today counts as rest.

**Why it matters.** The user has already resolved the conflict by resting, but the app continues to rank and deliver instructions for a workout they explicitly took off. The scheduled-muscle input to readiness also remains present.

**Improvement and acceptance.** Introduce one date-aware effective schedule resolver that applies day-off exceptions; use it for actionable readiness/conflict and next-session copy. Keep the raw repeating schedule for editing and Undo. Taking today off must remove the pre-workout conflict and scheduled-muscle readiness input; Undo must restore them; next-session advice must skip known future exceptions.

<a id="ui-r04"></a>

### UI-R04 — P2: History corrections retain live timing provenance

**Current behavior.** `SessionEditor` clones the saved session and merges changes into sets ([src/slices/history/History.tsx:281](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/history/History.tsx#L281), `:283`), then filters empty rows and saves that object (`:285`, `:289`). It never marks a modified set `fidelity:'edited'`, records `editedAt`, or refreshes logging confidence. Prior `at`, `restSec`, heart metadata and the session's trusted-live flags remain.

**Evidence and reachability.** Open any trusted live workout in History, change its reps, effort, load or duration, and save. The handler performs only the field patch plus filtering/recovery rebuild. This contradicts the explicit existing classifier contract in [docs/COACHING-PLAN.md:809](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/docs/COACHING-PLAN.md#L809) and `:817`: History edits are classified again and get edited provenance; content remains usable but the set's timing does not. Downstream eligibility reads precisely these unchanged flags: per-set heart drift at [src/brain/coach/rules.ts:637](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/rules.ts#L637) and `:640`, and post-session timing advice at [src/brain/coach/post.ts:209](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/post.ts#L209)–`:215`. Escobar can request a historical workout's debrief through [src/escobar/tools/read.ts:174](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/read.ts#L174).

**Why it matters.** The stored data cannot distinguish an original live measurement from a later correction, and timing-dependent consumers keep accepting a corrected set as live. This finding concerns the app's declared provenance policy, not whether the corrected load or reps should count—they should.

**Improvement and acceptance.** Compare saved and edited content, mark changed kg/reps/effort/duration as edited, recompute the applicable session fidelity, and enforce the timing gate at per-set consumers as well as session consumers. Unchanged Save and an equivalent unit-display change should not downgrade provenance. An `editedAt` timestamp is called for by the design but absent from `LoggedSet`; adding it requires a deliberate schema decision. Corrected content must still feed volume/records while edited timing cannot enter live-only rest/heart analyses.

<a id="ui-r05"></a>

### UI-R05 — P2: Completing the last profile field closes onboarding before Save

**Current behavior.** App renders Onboarding only while a derived eligibility signal is true ([src/app/App.tsx:118](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/app/App.tsx#L118); [src/app/selectors.ts:75](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/app/selectors.ts#L75)). Height, age and sex save immediately ([src/slices/profile/Onboarding.tsx:75](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/profile/Onboarding.tsx#L75)–`:77`), whereas weight is local component state and only saves from the Save handler (`:63`–`:68`). Once the profile becomes complete, `shouldShowOnboarding` returns null when no prior review exists ([src/brain/onboarding.ts:60](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/onboarding.ts#L60)–`:62`).

**Reproduction and evidence.** Begin with a partial profile: weight 80 kg, height 180 cm, birth year 1995, sex missing. Open Add my details; type 81 kg in the weight field; select Female, the last missing detail. The sex mutation makes the eligibility trigger null and App unmounts the form before Save. The local 81 kg draft is discarded; saved weight stays 80 kg and `completeOnboarding` was not called. The probe confirms the final-field mutation makes the trigger null while `completedAt` remains unset; the local weight lifetime follows directly from the handler and render paths. This is different from the first audit's untouched Male default.

**Improvement and acceptance.** Latch an opened flow until explicit Save or close, and use one consistent draft/commit policy for its fields. Completing the last missing field must leave the form open, allow the remaining draft to save, and write completion/review metadata exactly once. Opening with any combination of 1–3 already present fields should follow the same behavior.

**Design choice, not an additional defect:** the form close action currently calls `completeOnboarding` even when nothing is supplied (`Onboarding.tsx:72`, `:24`; `profile.ts:88`), while intro Later records a dismissal. Because the form explicitly permits missing fields, suppression after voluntary completion may be intentional. Give cancellation and successful completion distinct semantics if reminders should return, but do not count that product choice as a seventh bug.

<a id="ui-r06"></a>

### UI-R06 — P2: Deleting the gym used by a live workout destroys its equipment context

**Current behavior.** Settings permits deleting any gym if more than one exists ([src/slices/settings/Gyms.tsx:46](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/settings/Gyms.tsx#L46)). `deleteGym` removes its units/equipment profiles and changes global active gym ([src/slices/workout/units.ts:115](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/units.ts#L115)), but leaves the live session's `gymId` unchanged. Train resolves profiles and load menus against that stored ID ([src/slices/workout/Train.tsx:587](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/Train.tsx#L587), `:591`–`:598`). Missing-gym fallback supplies another gym/default profile ([src/brain/units.ts:55](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/units.ts#L55)–`:58`). Finish persists the deleted ID ([src/slices/workout/session.ts:556](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L556)).

**Reproduction and evidence.** Keep the built-in kg gym, add an lb gym, set bench to lb there and start a workout. In Settings delete that in-use lb gym. The probe finds the live ID unchanged but absent from the gym list; resolving the displayed bench profile now returns kg. Finish saves the nonexistent gym ID. Historical entered kg values are retained; the defect is the changed live entry/menu context and missing provenance, not retroactive kg conversion.

**Improvement and acceptance.** Prevent deletion of an in-use gym until the workout ends, or explicitly preserve a snapshot/retired gym record until all session references are resolved. Decide separately how old history's gym labels and learned load menus remain interpretable. Deleting an unrelated gym must work; deleting the live gym must never silently change input units or load rungs, and a saved session must retain a resolvable context.

### Feature improvements that are not counted as defects

1. **Custom catalogue management.** Manual UI has creation plus selection; it has no edit/archive/delete management for a mistaken custom movement (`ExercisePicker.tsx:19`; `splits.ts:81`). Add a manager with stable IDs and archive semantics, and show how changing mode/muscles affects existing interpretations. Keep deleting a template entry distinct from deleting its exercise definition.
2. **Set-count changes as a reusable plan choice.** `changedFromPlan` compares ordered exercise IDs only (`session.ts:446`); `FinishChoice` offers Save for future only for that result (`Train.tsx:526`). A person changing only the number of sets cannot make that change reusable in the finish flow, although `templateFromSession` can store counts. Offer a clear per-session versus future choice for user set-count changes, excluding automatic red-readiness/deload/one-day adjustments. This is an extension to the present “You changed the exercises” promise, not evidence that all temporary extra sets should silently edit a split.
3. **Template-add feedback.** `addGoalTemplates` always toasts Templates added ([src/slices/profile/profile.ts:74](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/profile/profile.ts#L74)) even when all names already exist or the seven-split cap prevents new templates ([src/slices/workout/splits.ts:12](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/splits.ts#L12), `:21`). Report the number actually added and explain the zero-add state at the action, without changing existing templates.

### Coverage ledger and existing behavior worth preserving

| Function family | Current behavior traced | Rescan conclusion |
|---|---|---|
| Start / active-session persistence | `startSession`, immutable `patchActive`, session/gym IDs, planned one-day overrides, heartbeat start | One-active guard and stored draft design preserved; native capture addressed in the platform coverage |
| Pause / resume / restart | `pauseSession`, `resumeSession`, `elapsedSec`, `pausedSince`, `finishTiming` | Timer/rest pause bookkeeping reviewed; after restart unknown paused gap is intentionally delayed; no additional UI defect asserted |
| Commit / edit / add / warm-up / rest | Stable set IDs; clearing/retyping retains original commit; warm-up and rest-kind policies; copied draft values | Filled draft content is intentionally kept by `hasEntry` at finish; do not misreport it as an uncommitted-set bug |
| Done / skip / substitute / remove | Mark flags, conditional cards, completion counters, data saved by finish | UI-R01; original Skip finding not repeated |
| Undo identity | `insertSet`, `insertEntry`, `insertExerciseInSplit`, toast closures | Set/entry Undo checks session and object IDs; split Undo avoids same exercise ID. Original stale History swipe Undo already reported |
| Finish / discard / save template | No-content discard; note limits; one-day override consumed on finish and retained on discard; user changes vs temporary plan mapping | Set-count reuse is optional improvement; substitution data loss confirmed |
| Template CRUD / goal / schedule | Rename/remove/order/sets; delete clears weekday references; goal rest/templates are separate explicit actions | No silent goal-rest mutation found; template-add feedback improvement; UI-R03 day-off coherence |
| Custom catalogue | Create, search, exclude already planned IDs, ID/name lookup, history aggregation | UI-R02; future management improvement |
| Gym lifecycle | Create/switch/rename/default-unit/profile reset/delete, session anchoring and menu fallback | UI-R06; original active-gym write mismatch not repeated |
| History correction / delete | Draft save/filter, remove-empty-as-delete, recovery rebuild, series delete/Undo | UI-R04; original mode/distance editor gaps not repeated |
| Past entry / timing correction | `logPastSession`, `resolveSessionTiming`, training-vs-logging dates and ordering | Stale recovery invalidation reproduced and consolidated in ENG-05 as a **single combined finding**; original future-date acceptance not repeated |
| Share / CSV / summary | `cardData`, `workingTotals`, period dates, original entered units and metadata export | Warm-up totals and historical debriefs are covered by ENG-04/07; CSV escaping/security remains in the original audit; no new export safety claim here |
| Profile onboarding lifecycle | Live field mutations versus local weight draft, eligibility, completion/review, voluntary omissions | UI-R05; optional close/completion semantics separated from defect |

### Evidence record

`work/logic-rescan-ui-probe.test.ts` is an external audit-only Vitest file. `work/logic-rescan-ui-vitest.config.mts` inherits the repository Vite config and redirects only its include list plus the external Vitest module path. Reminders are mocked to avoid side effects; fixtures use isolated in-memory app state, fake time and synthetic workouts. They do not inspect user production data or use the live coach.

Executed in the repo using the bundled Node runtime:

```text
node node_modules/vitest/vitest.mjs run --config ../logic-rescan-ui-vitest.config.mts
Test Files: 1 passed (1)
Tests:      7 passed (7)
Duration:   1.17 s; test bodies 32 ms
```

The seven passing assertions characterize five UI findings, the timing-invalidation case assigned to ENG-05, and the optional form-close behavior explicitly excluded from defects. They are not seven additional bugs or successful fixes. Source remained unchanged. The timing probe proves `recoveryModel={tauScale:{chest:1.1},observations:{chest:1}}` persists although replay of corrected history yields empty maps: bench 100 kg × 8 max × 3 on Sep 20; compressed 90 kg × 8 max × 3 on Sep 26; correct the latter start to Sep 29 (both past dates). Past-session insertion and timing correction are one combined invalidation finding. The independent review rerun passed 7/7 in 1.23 s (31 ms test bodies); raw output is in `work/logic-rescan-ui-results.txt`.

Source/handler evidence supports the History and onboarding render-lifetime conclusions; no new browser rendering or real-device verification was performed for these findings. The Verification and Review limits sections state the overall scope.

## Online coach

The privacy policy intentionally allows old conversation prose to survive sharing changes, existing memories to remain available when new remembering is disabled, expired injury notes to remain reviewable, and quarantine to survive reset. These choices are not counted as new defects.

<a id="imp-e01"></a>

### IMP-E01 — P2: Live coach targets disagree with the active workout's load adjustment

**Current feature:** Apply a lighter/heavier change for today's workout. Starting the workout copies that change into each active entry, and Train uses the copied value throughout the workout.

**Wrong logic:** [src/escobar/tools/context.ts:99–111](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/context.ts#L99-L111) reads an exercise's factor from today's global override, ignoring the active entry. Its lookup neither checks the override's split nor preserves a previous day's factor. `todayOverrideOf` at line 115 drops yesterday's override. In contrast, [src/slices/workout/session.ts:55–65,78–83](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L55-L65) checks the split and copies the factor; [src/slices/workout/Train.tsx:598](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/Train.tsx#L598) uses the active entry factor.

**Reachable repro:** With a 100 kg normal bench target, apply a 0.8 factor to split A, start at 23:50, and ask Escobar for the next target at 00:10. Train still targets 80 kg; the real `get_next_target` returns 100 kg. A second repro requires no midnight: apply the bench change to A, then start split B containing bench. Train B correctly has no factor, but Escobar imports A's 0.8 factor. `get_live_session` autoregulation and `get_equipment` also use the shared incorrect context.

**Improvement:** Resolve the active exercise's stored factor first. For pre-workout queries, scope the override to the actual target split and obtain its effective exercise list through the same sequential planner as Train. Prefer a shared selector over a second implementation.

**Acceptance:** A live session across midnight returns the same target as Train. An override for another split changes neither that session's target nor autoregulation. Include swap-then-load and multiple load changes so planner ordering agrees.

**Evidence:** Probe rows `active_load_after_midnight` (`coachKg:100`, `trainKg:80`) and `active_load_wrong_split` (`trainFactor:null`, `coachFactor:0.8`). The first probe uses a real local midnight boundary.

<a id="imp-e02"></a>

### IMP-E02 — P2: Undo toast can undo the same-numbered suggestion in another conversation

**Current feature:** Each applied suggestion offers eight seconds of Undo; proposal IDs restart per conversation and inverses are keyed by conversation ID plus proposal ID.

**Wrong logic:** [src/escobar/apply.ts:271–285](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/apply.ts#L271-L285) takes the current conversation when Undo runs, while the toast callback captures only `proposalId`. IDs such as `p1` really repeat: [src/escobar/tools/executor.ts:183,199](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/executor.ts#L183) uses the conversation's proposal count. The correct inverse map key cannot help when the wrong conversation is supplied.

**Reachable repro:** In conversation B, apply p1 to disable Daily quote. In A, apply its p1 to disable automatic rest. Return to B and tap A's still-visible Undo toast within eight seconds. The probe restores Daily quote and marks B's p1 undone; automatic rest remains disabled. Expected: restore automatic rest from A, or explicitly make A's toast unavailable after the switch. Applying both within eight seconds makes the wrong-mutation case reproducible; with no B inverse, the same defect merely denies A's Undo.

**Improvement:** Bind both conversation ID and proposal ID in the callback. Persist the decision to that conversation without switching the visible conversation, or clear the toast when changing conversations.

**Acceptance:** Two chats with applied p1 suggestions cannot undo each other's settings. Also test a different currently visible chat with no inverse, expired inverse, conversation deletion, and a newer toast.

**Evidence:** `toast_wrong_conversation` executes the real `onProposal` and saved toast callback: actual `{showSpark:true,autoRest:false}`, expected `{showSpark:false,autoRest:true}`.

<a id="imp-e03"></a>

### IMP-E03 — P2: Profile Undo leaves false insights and can corrupt same-day weight history

**Current feature:** Escobar can log a weight with Apply and restore it with Undo; profile history drives the “Weight updated” insight.

**Wrong logic:** [src/escobar/apply.ts:152–174](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/apply.ts#L152-L174) restores the profile and weight log directly, leaving `profileHistory` untouched. A normal 80→82→Undo leaves current weight/log 80, but [src/brain/coach/rules.ts:441–468](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/coach/rules.ts#L441-L468) still emits “Weight updated to 82 kg” and “Saved to your weight log.” If a newer same-day weigh-in is entered before Undo, line 172 keeps that row and appends the older row for the same day, while line 170 unconditionally restores the older current weight. `logWeight` itself guarantees one row per day at [src/slices/profile/profile.ts:47–56](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/profile/profile.ts#L47-L56).

**Reachable repro:** Start at 80 kg with today's row 80; apply 82 and immediately Undo. Open the deterministic insight: it still says 82 was saved. Stronger correction case: apply 82, log 81 manually within the Undo window, then return to the original proposal card and tap its Undo. Use the card because manual weight logging can replace the earlier toast. Actual profile is 80 and today's rows are `[81,80]`; expected profile/log remain 81, or Undo is refused because the touched value changed. The direct mutation probe does not simulate physical taps, but uses the actual Apply, weight logging, Undo, and insight functions without time travel.

**Improvement:** Make the inverse conditional on the currently stored values still matching those written by that proposal. Preserve later edits and one-row-per-day uniqueness. Undo the matching history event, or append a truthful reversal and make the insight represent current state. Apply the same history policy to other profile fields.

**Acceptance:** Immediate Undo produces no insight claiming the undone value is current/saved. Same-day and next-day corrections remain current after Undo, without duplicate days or removal of unrelated history.

**Evidence:** `weight_undo_history` invokes the actual `profile.changed` rule and gets the false 82 kg insight. `weight_undo_after_correction` produces profile 80 with two rows for today (81 and 80).

<a id="imp-e04"></a>

### IMP-E04 — P2: A stale equipment suggestion can save into a deleted gym and affect another gym

**Current feature:** An equipment profile proposal previews a specific existing gym and checks for stale state when applied.

**Wrong logic:** Initial validation at [src/escobar/tools/actions.ts:251–255](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/actions.ts#L251-L255) checks gym existence. Its fingerprint at line 102 only includes profile maps, not gyms. Delete a gym that has no profiles: those maps remain unchanged. Apply passes the fingerprint, then [src/escobar/apply.ts:196–207](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/apply.ts#L196-L207) / [src/slices/workout/units.ts:77–81](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/units.ts#L77-L81) blindly write under the deleted ID and say “Equipment saved.” The orphan is not inert: [src/brain/units.ts:46–53](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/units.ts#L46-L53) uses the most recent exercise profile from any map as fallback for other gyms. On reload, [src/core/escobarState.ts:132–160](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/core/escobarState.ts#L132-L160) drops the orphan, so behavior changes again.

**Reachable repro:** Add a second gym with no saved profiles; ask for a bench equipment adjustment there; leave its proposal pending; delete that gym in Settings; return and Apply. A profile appears under the deleted gym, is selected for bench at the remaining gym, then disappears through normal reload normalization.

**Improvement:** Include referenced gym/exercise identity in staleness checks and revalidate references at Apply. Make `saveProfile` reject unknown gym IDs rather than allowing invalid persistent state. Report stale rather than success.

**Acceptance:** Deleting the proposal's gym before Apply produces no profile and no target change in another gym. A restart yields the same valid state. Cover delete/recreate and changed active gym separately; the latter alone need not invalidate a proposal explicitly targeting a still-existing gym.

**Evidence:** `equipment_deleted_gym` reports identical fingerprint, applied success, absent gym, orphan selected at remaining gym, and orphan removed by `normalizeUnits`.

<a id="imp-e05"></a>

### IMP-E05 — P2: Live coach reports running pause as training and frozen rest as expired

**Current feature:** Pause freezes the workout clock and rest countdown; committed sets are distinct from entered draft values.

**Wrong logic:** [src/escobar/tools/read.ts:416](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/read.ts#L416) subtracts accumulated past pauses but omits the currently running pause. Line 434 ignores `pausedRemainingSec`. The canonical workout helpers already implement both at [src/slices/workout/session.ts:92–97,435–438](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L92-L97). At line 432, `setsDone` counts populated draft sets through `isWorkingSet` while the returned set list includes only committed/timestamped sets, giving contradictory data.

**Reachable repro:** Start a workout, pause after ten minutes with 60 seconds left of rest, then ask Escobar ten minutes later. Train shows ten training minutes and 60 seconds remaining. The tool reports twenty minutes and zero seconds, despite `paused:true`. Enter weight/reps without committing: it reports one set done with an empty completed-set list.

**Improvement:** Reuse `elapsedSec` and `restRemainingSec`; count completed working sets through the same commitment predicate as Train. Keep paused state explicit so responses can distinguish elapsed wall time from training time if both are desired.

**Acceptance:** Paused, resumed and restored sessions agree with Train at the same clock instant. Draft, warmup and committed working sets yield consistent done counts and lists. No paid model call is needed to verify the input facts.

**Evidence:** `live_paused_state`: tool `{elapsedMin:20,restSecLeft:0,setsDone:1,sets:[]}` versus workout helpers `{elapsedMin:10,restSecLeft:60,committedSets:0}`.

### Enhancements and coverage

**Secondary confirmed integration defect — IMP-E06, P3:** Escobar's haptics proposal changes the saved switch but not the runtime switch. [src/escobar/apply.ts:188–195](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/apply.ts#L188-L195) only updates preferences, while the manual toggle at [src/slices/settings/Settings.tsx:192](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/settings/Settings.tsx#L192) also calls `setHapticsEnabled`. [src/native/haptics.ts:4–5,84–90](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/native/haptics.ts#L4-L5) reads a separate module flag. Apply “Haptic feedback off” while enabled: state/Settings says off, but the next haptic still invokes NativeUi. The probe `haptics_setting_runtime` uses a fake native plugin and records one call after the saved preference became false. Route both settings paths and Undo through a common preference mutation that synchronizes runtime behavior. Acceptance: coach Apply off prevents haptics immediately; Undo/on restores behavior without restart. This is a mocked integration result, not a physical vibration test.

| Area | Current behavior checked | Improvement or result |
|---|---|---|
| Proposal validation vs Apply | Builder validates input, then Apply relies on a kind-specific state fingerprint. Some appliers separately guard active workouts. | Centralize revalidation of affected references/constraints at Apply; concrete failure is E04. Other missing fingerprint inputs are review targets, not separately claimed defects here. |
| Target and live context | Coach reconstructs workout state and timing separately from Train. | Share pure selectors; E01/E05 show why tests must compare actual outputs across feature boundaries. |
| Apply and Undo | Targeted inverses, per-conversation map, eight-second window, protection of started/logged sessions. | Identity-bound callbacks and conditional inverses; E02/E03. Avoid treating an entire old snapshot as safe after later edits. |
| Memory consent/delete | `remember` checks current `memoryEnabled`; recall and existing brief notes remain available by design; delete-all changes stored memory; expired protected notes remain reviewable. | No additional confirmed defect in this focused pass. Optional UX improvement: distinguish preventing new remembering from removing stored notes. No claim that deleting a note redacts old conversation prose. |
| Retry, stop, reset, switching chats | Generation checks, abort paths, orphan closing, per-loop persistence ownership and reset epochs reviewed in `loop.ts`/`session.ts`. | E02 is the confirmed new identity escape. Do not repeat first-audit “disable during turn” finding. No live-model quality/latency verification was performed. |
| Conversation budget/window/summary | Count/byte pruning, active-conversation trimming, clean user-message boundaries, proposal index adjustment and rolling-summary reuse reviewed. | Stored history is best-effort under its documented caps. No separate confirmed new defect. Old rendered components recalculating from current data is a deliberate design, not counted. |
| Persistence/backup/reset | Revisited prior malformed import, cross-tab reset, photo/heart references and old-backup behavior against policy. | No new independent persistence defect added beyond the invalid equipment state in E04 and inconsistent weight state in E03. Prior findings remain in the first audit; quarantine preservation is intentional. |

### Reproduction and limits

Files outside the repo: `work/rescan-escobar-probes.ts`, `work/build-rescan-escobar-probes.mjs`, generated bundle, and `work/rescan-escobar-probes-output.jsonl`. Commands from `work/`: `node build-rescan-escobar-probes.mjs`, then `node rescan-escobar-probes.mjs`. The final run passed every assertion and emitted eight rows for five primary groups and one secondary integration defect. The bundle explicitly resolves `.ts` before `.tsx` because the Windows checkout has case-colliding `profile.ts`/`Profile.tsx` and `coach.ts`/`Coach.tsx`; this harness setting preserves the intended logic imports without changing the app.

These are reproducible source-level integration probes of real application functions with synthetic state and in-memory conversation storage. Browser navigation/tap timing, a physical watch, live coach response quality and device-specific behavior were not exercised by these probes. No entire-app correctness claim follows from this bounded rescan. No new external medical/security claim or provider behavior was needed for these findings; source and the app's own authoritative selectors supply the expected behavior.

## Platform logic

<a id="imp-n01"></a>

### IMP-N01 — P2: older notification work can undo a newer cancellation

**Current behavior:** rest alerts, training reminders and weekly backup reminders are scheduled through asynchronous native calls. The UI can change the desired state while a permission check or scheduling call is pending.

**Wrong behavior:** [src/native/notifications.ts:80-99](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/native/notifications.ts#L80-L99), `:133-173` and `:189-205` do not track which invocation is still current. Completing a newer cancellation does not prevent an older invocation from scheduling afterward. `resyncReminders` also applies whichever status returns last ([src/slices/settings/reminders.ts:15-24](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/settings/reminders.ts#L15-L24)). The Settings controls issue these calls without serializing them ([src/slices/settings/Settings.tsx:177-180,229](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/settings/Settings.tsx#L177-L180)); pause, Skip rest, Finish and discard call cancellation ([src/slices/workout/session.ts:154-156,429-432,575-576,636](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L154-L156)).

**Executed proof:** delay the old permission response, complete the newer cancel/off request, then resolve permission. Actual app functions leave rest alert 880001 pending; the training case returns Off and then queues 56 reminders; the backup case changes `backupReminderScheduled` from false back to true and leaves 880101 queued. This uses a mock native adapter and controlled promises, not actual Android delivery.

**Improvement:** maintain a desired-state revision per notification family and serialize native reconciliation. Check the revision after every asynchronous boundary and reconcile/cancel after an obsolete schedule completes; a pre-schedule check alone cannot handle a native schedule already in flight. The latest user action must win, including status text.

**Acceptance:** on→off, deadline A→B, pause→resume, and Finish interleavings, with delays injected into permission, cancel and schedule. After all promises settle, native pending IDs/deadlines and displayed status must match current app state. [Capacitor's API](https://capacitorjs.com/docs/apis/local-notifications) exposes separate asynchronous schedule/cancel calls; it does not make a sequence of app invocations one transaction.

<a id="imp-n02"></a>

### IMP-N02 — P2: an in-flight health read restores data after Reset everything

**Current behavior:** `syncAndStoreHealth` awaits the bridge and merges its result into whichever AppState exists when it returns, setting `health.connected:true` ([src/slices/settings/health.ts:13-30](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/settings/health.ts#L13-L30)). Reset creates fresh state with Health Connect disconnected ([src/slices/settings/Settings.tsx:76-85](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/settings/Settings.tsx#L76-L85)).

**Wrong behavior:** there is no reset/restore generation check. A read started before Reset can complete afterward and write health measurements into the freshly cleared state. The same boundary exists when a backup replaces state and explicitly disconnects Health Connect.

**Executed proof:** start a deferred real `syncAndStoreHealth` call, call the same `resetState(freshState())` used by Settings, then return synthetic resting HR 57, sleep 420 minutes and steps 3000 from the bridge. Immediately after Reset there are zero health days and connected=false; after the old read resolves there is one health day and connected=true. Clearing conversation/photo/heart side stores does not invalidate this callback. No real Health Connect data was read.

**Improvement:** advance a state-replacement generation on reset/restore and discard old health results before any write. Do not implicitly reconnect based on a stale successful response. Keep OS permissions separate from the app's connected setting; the finding does not assume Reset revokes Android permissions.

**Acceptance:** delayed successful/partial reads after Reset, Restore and Undo must not overwrite the replacement state. A new user-authorized Connect/Sync after replacement should still work.

<a id="imp-n03"></a>

### IMP-N03 — P3: a late browser wake lock survives switching it off

**Current behavior:** the web branch assigns a sentinel after `navigator.wakeLock.request()` resolves ([src/native/keepAwake.ts:16-23](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/native/keepAwake.ts#L16-L23)). Off releases only the sentinel already stored. App calls Off when the live session ends or the preference is disabled ([src/app/App.tsx:82-86](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/app/App.tsx#L82-L86)).

**Wrong behavior:** if Off runs while acquisition is pending, there is no sentinel to release. The old request can then resolve and be stored without checking `wantOn`. This can keep the visible browser screen awake after a workout ends, until the browser revokes it or a later release occurs. No claim is made about the separate Android window-flag path or measured battery drain.

**Executed proof:** defer the browser request, await `keepAwake(false)`, resolve the sentinel, then await the original request. Its release callback was invoked zero times.

**Improvement:** capture a request generation, release any sentinel granted after Off or superseded by a newer request, and avoid retaining multiple simultaneous sentinels. The [Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/WakeLock/request) explicitly returns its sentinel asynchronously.

**Acceptance:** pending On→Off and repeated visibility reacquisition must leave zero unreleased locks when the current intent is Off. Include rejection and browser-initiated release.

### Platform coverage

| Feature | Current implementation | Improvement and validation |
|---|---|---|
| Rest, training and backup notifications | Distinct notification IDs; training reminders for 56 days; permission-aware checks; exact permission is separate; day-off and completed days excluded | Fix IMP-N01; keep one reconciliation path for every initiating screen/coach action. Inspect actual pending schedules after rapid changes on Android. |
| Backup preference after Restore/Undo | State replacement calls `afterReplace`, which cancels rest and syncs training but does not call `syncBackupReminder` | Add backup-reminder reconciliation to replacement/resume. Currently the saved toggle can disagree with the previously queued backup reminder until boot or an explicit toggle. This is a source-traced secondary issue, not a separate executed primary finding. |
| Health Connect | Optional connection; background reads throttled to 10 minutes; partial reads retain earlier valid values; native API requires Android 14+ | Fix IMP-N02 and the first audit's sleep/source-age defects. Use distinct timestamps for distinct measurements; test revocation, zero totals, source correction, partial reads, midnight and reset while reading. Keep the supported Android version explicit. |
| BLE watch | Foreground Android connection, bounded native diagnostic buffer, reconnect attempts, permissions, explicit contact/freshness states | Fix first-audit freshness and pause-accounting issues. Verify silent connection, real foreground/background delivery, reconnect, process death and time changes on a device. Mock tests cannot establish those behaviors. |
| Web keep-awake | Browser sentinel acquired on demand and visibility return; default preference enabled | Fix IMP-N03. Keep this separate from Android's native flag. |
| Health-sharing text | Policy and tool gates allow session heart data to be sent with health sharing enabled; [src/escobar/tools/read.ts:175,383-406](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/escobar/tools/read.ts#L175) | [src/slices/settings/Watch.tsx:78](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/settings/Watch.tsx#L78) says no heart-rate value ever leaves the phone. Align that absolute sentence with the actual opt-in contract; this is a copy/contract improvement, not evidence of unauthorized transmission. |
| Files, photos and sharing | Shared file picker handles change/cancel; coach photos are resized; Android share cache replaces the previous card; share cancellation is distinguished | Test real picker cancellation, large/unsupported images and Android storage versions. Treat exported/chooser-opened and durably saved as different outcomes when reporting backup recency. No second device-level export success is claimed. |
| App resume and navigation | Clock refresh, timezone cache reset, native Back order, training-reminder refresh and background health sync | Reconcile all pending effects against current state after resume/replacement, rather than duplicating side-effect calls across handlers. Preserve existing Back/sheet tests. |

**Focused execution:** `node node_modules/vitest/vitest.mjs run --config ../rescan-native-vitest.config.mts` passed five synthetic proof tests. Sources and results are outside the application checkout in the companion evidence archive. An initial external mock-resolution problem was fixed in the probe configuration; application code and assertions were not changed.

## Improvement order

The first audit's four P1 findings remain first: paid-request quota admission, coach-off enforcement, assisted-performance calibration and chronic-short-sleep readiness. The sequence below addresses the wider consistency problems without requiring a wholesale rewrite.

| Order | Change | Completion evidence |
|---|---|---|
| 1 | **Centralize workout/history mutations.** Start, commit, substitute, finish, retro insert, edit, timing change, delete and Undo should update records and derived models through shared commands. Preserve immutable entity IDs and meaningful timing provenance. | For every mutation, compare saved/reloaded results with a full history replay. Committed work survives substitutions unless deletion was explicitly requested. Undo never overwrites an unrelated edit. |
| 2 | **Share the target context.** One selector should provide the effective day/split, live session gym, equipment menu, mode, current planned sets, readiness, deload and session-specific overrides to Train, previews, retargeting and Escobar. | A matrix over five exercise modes, red/amber/green, kg/lb gyms, midnight, different splits and deleted references gives the same applicable target on every surface. Every suggested load exists on the chosen equipment menu. |
| 3 | **Bind proposals and Undo.** Record target conversation/entity, before/after values and a revision or equivalent precondition. Revalidate when Apply/Undo runs. Undo restores a matching operation, rather than any globally current action. | Apply→switch chat→Undo changes only the original action. Intervening manual corrections survive or trigger an explicit conflict response. Deleted gym/split/exercise targets are rejected or deliberately remapped. |
| 4 | **Version asynchronous effects.** Health sync, notifications and wake locks need an operation/state generation and a single reconciliation owner. | Resolve old permission/read/schedule requests after Off, Reset, Restore, Finish and a newer request. No obsolete data, alert or lock remains after settlement. |
| 5 | **Give insights one evidence window.** Counts, bands, duration baselines, set kinds, source fidelity and explanatory wording must be evaluated from the same eligible observations. | Last-week summaries remain unchanged when adding current-week sessions. Warm-up-only logs do not become proof of hard training. Untimed/compressed records cannot set live duration baselines. |
| 6 | **Finish the editing contract.** Make fields either draft-until-save or clearly autosaved; do not mix these lifecycles invisibly. Keep history mode-specific and keyboard-operable. | The last missing onboarding field cannot close an editor with an unsaved weight. Cancel, Save, Back and app resume have defined, tested effects; keyboard users can reach the same outcomes. |
| 7 | **Validate uncertainty and performance.** Preserve the first audit's scientific limitations; measure old Android hardware with heart data and realistic multiyear history. Expand guide coverage after its own evidence review. | A documented device matrix covers input latency, startup, memory, long sessions, background interruption and battery. Formula/claim validation is recorded separately from arithmetic tests. |

## Feature improvements

These are proposals, not additional confirmed defects or claims that every app needs them:

- **Target explanation:** expose the few actual reasons for a changed target—such as current gym increment, lighter week or the last comparable set—using the same derived result as the recommendation. Avoid explanations generated from a second calculation.
- **Change preview:** before applying a plan/coach change, show exactly which session or template and which sets will change. Preserve already recorded work; make destructive alternatives explicit.
- **History provenance:** keep a clear distinction between actual training time, logging time, manual correction and sensor coverage. Retain usable load/repetition data while excluding unsupported timing conclusions.
- **Trustworthy activity labels:** separate attendance, warm-ups, working sets and hard sets. A single attendance count should not silently serve as proof of strength or hypertrophy stimulus.
- **Action history:** retain enough local metadata to explain an applied change and undo it safely. This can be scoped to operations already stored; any new categories of user data require the owner's separate data-design approval before implementation.
- **Data recovery feedback:** make export/restore verification and partial recovery outcomes precise. Continue preserving the documented unreadable-copy recovery option rather than treating it as an accidental privacy defect.
- **Health freshness:** use each observation's timestamp and source eligibility, with missing/old/partial values treated distinctly. A last-successful-sync timestamp is not necessarily a fresh timestamp for every retained value.
- **Guide coverage:** show a guide only when approved, as the current registry does; prioritize commonly used movements and verify each cue's evidence before expansion.

## Acceptance matrix

| Scenario family | Required invariant |
|---|---|
| Same exercise through multiple screens | Train, local Coach and Escobar agree when using the same day, session and evidence. |
| Exercise modes | Weighted, assisted, bodyweight, duration and conditioning retain their own progress measures through entry, history, trends, records and export. |
| Draft versus committed work | Editing a future plan never silently removes completed sets or substitutes one measurement's meaning for another. |
| Day and period boundaries | Midnight, timezone changes, days off, current week and prior week resolve consistently. |
| History mutations | Incremental model state equals a deterministic replay of eligible history after insert/edit/time-change/delete/Undo. |
| Equipment identity | Unit display and suggested load remain tied to the session's intended gym and actual equipment options. |
| Asynchronous completion | Off, Reset, replacement and cancellation remain effective after older operations finish. |
| Apply and Undo | Each operation affects only the intended conversation and entity, with intervening edits accounted for. |
| Missing/untrusted inputs | Absence is not silently converted into a confident score, diagnosis, training instruction or timing baseline. |
| Persistence | Accepted backups and completed mutations still satisfy these invariants after reload. |

## Review limits

This report examines current source and deterministic counterexamples across the whole feature set. It does not claim every possible input, button order, device, watch, network failure, model response or scientific claim has been dynamically verified. The original audit remains the source of its earlier build, dependency, research and browser evidence; those runs are not relabeled as fresh tests in this report.

This pass ran new local synthetic probes, existing platform tests, and focused verification of the citation patch that arrived during the review, as stated in the verification section. It did not rerun the whole browser gate, Android build, full regression suite or performance suite. Initial probes ran on `cd3c921`; the report distinguishes unchanged paths from later verification on `d5ebc77`. Actual phone behavior, production configuration, provider caps and paid-model outputs remain unverified. This audit changed no app source, tests, dependencies, signing material or deployment configuration.
