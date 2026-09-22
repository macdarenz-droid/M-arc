# Escobar implementation routing plan

**Baseline:** `c3f467571f958c54e6447c7182ebf15c007d5947`; branch `claude/phase-9-readiness-preference-ckw91g`. Specs 1–14 are the design contract. This file sequences implementation, not another feature ranking. No production code was implemented in this continuation.

## Routing rule and score

Follow root `MODEL_ROUTER.md` (owner-supplied registry dated 2026-09-20; copied unchanged). Score is **A/B/N/R/V**: ambiguity, breadth, novelty, blast radius, verification difficulty, each 0–2. Totals 0–2=T0, 3–4=T1, 5–6=T2, 7–8=T3, 9–10=T4. Fully specified work has A=0 even when important. Effort column is **Claude / GPT**. “Medium / Medium” on a T2 row means an important but specified state/contract task does not need high reasoning merely because the tier floor applies.

Anything touching persisted data integrity, grounding validation or a proxy payload contract is **minimum T2 and reviewed at T3**. This includes additive metrics and tests proving the boundary, although no new proxy field or route is requested. Tests that only render or count pure values can be T1. Data-preserving pure helper extraction in prs.ts is T1 only while its existing record semantics are unchanged. No actual feature work merits T0; repetitive completion notes do.

Choose one model column, not both executors. Sonnet High and Sol High are below their top settings in the supplied registry. If an executor needs its top effort, use Opus 5 Medium or GPT-6 Astra Medium instead of maxing a small model. T3 review uses Opus 5 High or Sol Extra High; Astra in Work is the alternative if that picker is unavailable. Do not dispatch T4 proactively. After an actual code/invariant failure at a tier, attach the failed test and current diff and move up one tier; a missing-file/context mistake can be corrected before treating it as a model failure. Two unresolved T3 attempts → split the work or T4 (Fable 5.1 Medium / GPT-6 Astra Medium), with the exact remaining question. Drop down again once resolved.

## Work items

Test items can be authored independently after their signatures freeze. They must run against the executor's final implementation before its feature commit. This is division of ownership, not permission to ship production code without tests.

| Work item | Tier · A/B/N/R/V=total | Claude agent | GPT agent | Effort | Why | Escalate if |
|---|---|---|---|---|---|---|---|
| F0 · Shared live.ts foundation: substitutes, restFor, nextAfterRest; bands; pure test cases from specs 1–2 | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Known helper composition; no store writes or wire fields | Imports need app/store state, or specs disagree on a target |
| 1A · Rack swap mutation, stale guard and guarded Undo; session.ts | T2 · 0/1/1/2/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | User set replacement and index races | Any typed set can be lost after confirmation or Undo |
| 1B · Rack swap sheet and Browse wiring; Train.tsx | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Exact three-state UI and copy supplied | A second sheet must stay open or picker identity is ambiguous |
| 1T · Swap data-preservation tests and live acceptance/Undo cases | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Independently prove mutation boundaries | Replacement affects another slot/session or discards new input |
| 2A · Rest ownership, grade/retime and pause-resume lifecycle; models/session | T2 · 0/1/1/2/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | Persisted timer metadata and event ownership | 600-second ceiling, pause or topology change fails |
| 2B · restNext selector and RestBanner copy/formatting | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Read-only, specified selector and UI | Row and banner target diverge or a one-second tick runs progression |
| 2T · Fake-clock rest lifecycle tests and visual cases | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Bounded timers and stale ownership are subtle | Any retime revives an expired rest or loses elapsed time |
| 3A · Personal readiness module, recovery counterfactual and detector integration | T2 · 0/2/1/1/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | One reasoning unit across baseline, recovery and cause attribution | Max-factor masking is mistaken for a readiness effect |
| 3B · Verdict words/component, Today Save-to-card wiring | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Copy and callbacks specified; reuse plan action | Card claims a change that acceptProposal cannot apply |
| 3T · Readiness math/counterfactual and grounded-metric regression tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Cross-engine numeric evidence, no validator changes | Future entries or rounded factors change the verdict |
| 10A · Plan types, capturePlan, start/add/replace/finish persistence, History stale-save guard | T2 · 0/2/0/2/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | Atomic snapshot lifecycle is one integrity unit | Original target cannot survive a swap, row deletion or import |
| 10AT · Snapshot/import/row-alignment and stale-editor tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Independent proof of historical meaning | Tests need to reconstruct targets from current history |
| 4A · effectiveSetTarget/isReducedTarget and autoregulate; live.ts | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Fully bounded pure policy using existing progression | Caution/deload or different-load evidence needs reinterpretation |
| 4B · Accept/dismiss overrides; session.ts and snapshot metadata | T2 · 0/1/1/2/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | Protect actual inputs and original plans | A stale key applies, or an existing actual is changed |
| 4C · EntryCard offer and shared target display in restNext | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Two buttons, no new navigation or algorithm | Offer appears on every keystroke or ignores captured targets |
| 4T · Autoregulation protected-draft, stale-key and resume tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Explicit mutation and retained originals | Weight-only drafts or accepted/dismissed state are lost |
| 5A · WarmupRamp pure helper and inline presentation | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Short deterministic ramp plus exact copy | A starter load or missing equipment limit becomes personal evidence |
| 5B · Session-wide explicit Hide flag and persistence | T2 · 0/1/0/2/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Small but persistent state; integrity override | Hide writes history or reappears after resume |
| 5T · Warm-up calculation, dismissal and no-extra-log tests | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Specified fixtures and negative assertions | Test reveals persistent-state corruption: stop and send to T2 |
| 6A · Skip evidence/planner plus report/kind/words/research registration | T2 · 0/2/0/2/1=5 | Sonnet 5 | GPT-5.6 Sol | High / High | New report metrics and shared proposal budget | Current templates are being asserted as historical plans |
| 6B · Guarded cut/swap acceptance in apply.ts | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Existing mutations need current split validation | Either alternative can affect the active workout or wrong split |
| 6C · Grouped mutually exclusive Coach alternatives | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Known buttons and existing sheets | Grouping duplicates controls or sends two acceptance writes |
| 6T · Confirmed/legacy skip, swap budget, apply and grounding tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Evidence quality and mutations are the risk | Mixed snapshots or overlapping swaps pass incorrectly |
| 7A · Closed-week brain/detector, scalar metrics and registration | T2 · 0/2/0/2/1=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Windowed facts enter existing grounding contract | Partial weeks or zeros give the wrong denominator |
| 7B · Narrow selector and Today WeekReview component | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Read-only comparison with defined degraded state | Typing a live set recomputes review or current-week counters change |
| 7T · Closed-window/median/muscle and metric-grounding tests | T2 · 0/1/0/2/1=4 | Sonnet 5 | GPT-5.6 Sol | High / High | Wire-facing scalar verification minimum T2 | A copy number has no metric or future log changes last week |
| 8A · Lift trajectory pure module and arithmetic tests | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Existing trend with exact conversion/expiry algorithm | Projection shifts with today or relative slope prints as kg/week |
| 8B · Existing progressing metrics and words integration | T2 · 0/1/0/2/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Additive grounded metrics; no validator edits | Formatted dates require widening allowedNumbers |
| 8C · History Stats projection line and expiry UI | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | One read-only surface and memo | New history fails to invalidate or forecast shows during deload |
| 8T · Progress-metric and date-grounding integration tests | T2 · 0/1/0/2/1=4 | Sonnet 5 | GPT-5.6 Sol | High / High | Protect date/privacy boundary | Someone proposes sending date components to admit prose |
| 9A · reopen.ts evidence comparison and pending typed-draft projection | T2 · 0/1/1/2/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | Local identity and once-only reopening semantics | Action equivalence or evidence-strength rule is unclear |
| 9B · Ledger/flags normalization, dismissal/acceptance and thread guards | T2 · 0/2/0/2/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | Persisted memory plus stale-action prevention | A dismissed item reopens twice or an evicted turn can apply |
| 9C · Unfinished list, saved-only AskSheet and guarded existing actions | T2 · 0/2/0/2/1=5 | Sonnet 5 | GPT-5.6 Sol | High / High | UI exposes old mutations offline; submit guards matter | Review fetches, deleted update creates, or Undo overwrites a later goal |
| 9T · Once-only reopen, stale draft, offline and wire-exclusion tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Data integrity and privacy assertions | Any local fingerprint/session reaches payloads |
| 10B · sessionDebrief, execution detector and metric/words registration | T2 · 0/2/0/2/1=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Comparisons must distinguish saved/accepted/unknown targets | Filtering rows changes which original target they pair with |
| 10C · Read-only Finish/History comparison component | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Presentational facts with explicit unknown state | UI re-runs suggestNext to invent an old plan |
| 10T · Debrief/tradeoff/execution grounding tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Prove arithmetic and attribution against original snapshot | Starter or edited rows become adherence findings |
| 11A · unratedSets/effortRepair/calibration and pure tests | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Counts and exact existing RIR bands | Missing values are guessed or effort mode is redesigned |
| 11B · Fingerprint-guarded saved-set effort mutation | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Writes real workout data, one field only | Any stale row or concurrent History draft can overwrite changes |
| 11C · Finish repair strip, row buttons, Done/Skip | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Specified ephemeral visibility and exact choices | Threshold crossing removes the strip mid-interaction |
| 11T · Single-field persistence, concurrency and no-side-effect tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Audit mutation scope and fresh finish lookup | Rating starts a timer or creates another saved session |
| 12A · prs helper extraction, prReach and differential pure tests | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Reuse recordsFor; existing semantics unchanged | Any mode produces different actual PR results |
| 12B · EntryCard cached history and PrReachHint | T1 · 0/1/1/1/1=4 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | One optional read-only badge | History is scanned per row/keystroke or reduced target is ignored |
| 12T · Live hint/actual-record precedence and kg/lb checks | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Short visible outcomes, no mutation | Possible record enters saved history: escalate to T2 integrity review |
| 13A · Closed training weeks, recentProbability, drift detector/planner and registration | T2 · 0/2/0/2/2=6 | Sonnet 5 | GPT-5.6 Sol | High / High | Multiple windows and scalar contract must stay distinct | Twelve-week model is treated as sixteen or same-day logs count twice |
| 13B · Fresh guarded schedule patch; apply.ts | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Changes schedule/reminders only on explicit acceptance | Occupied destination, deleted split or fallback first split applies |
| 13C · Drift copy and existing Coach sheet presentation | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Reuses current cards and exact windows | Copy claims historical missed commitments without saved schedule |
| 13T · Window/split-vote, stale acceptance and grounding tests | T2 · 0/1/0/2/2=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Calendar boundaries plus schedule integrity | Partial first/current week changes the proposed move |
| 14A · Near-miss helper/detector and metric/words registration | T2 · 0/2/0/2/1=5 | Sonnet 5 | GPT-5.6 Sol | High / High | Existing PR semantics with new scalar facts | Tie/one-below wording or strict 1% boundary is inconsistent |
| 14B · Finish NearMissNote and existing Coach insight | T1 · 0/1/0/1/1=3 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | One quiet read-only note | Near miss displaces a real PR or urges another set |
| 14T · Near-miss boundary, alias, expiry and grounding tests | T2 · 0/1/0/2/1=4 | Sonnet 5 | GPT-5.6 Sol | High / High | Exact numeric provenance without validator edits | Rounded current equals threshold or future session leaks into prior |
| R3 · Mandatory review of each integrity/grounding/contract unit before its feature commit | T3 · 1/2/1/2/2=8 | Opus 5 | GPT-5.6 Sol | High / Extra High | Independent cross-boundary and adversarial review | A supplied spec cannot resolve the failing invariant; stop for owner/model escalation |
| G · Per-feature app+proxy checks, build, five themes, live Playwright, commit/push/CI | T2 · 0/2/0/2/1=5 | Sonnet 5 | GPT-5.6 Sol | Medium / Medium | Release execution has T2 floor; failed gates block shipment | Any feature gate, required review or exact-commit CI remains red |
| D · Decision log, project state and compact NEXT handoff after each feature | T0 · 0/1/0/0/0=1 | Haiku 4.5 | GPT-5.6 Luna | Off / Low | Repetitive documentation of already verified facts | Writing requires deciding behavior or asserting unrun checks |

## Build order and hard dependencies

1. **F0 first, once.** Create live.ts with spec 1 substitutes and spec 2 restFor/nextAfterRest, their bands and pure cases. Direct imports only; no barrel export. Do not add rankExercises: scoreExercise already exists. Features 4/5 append to this file later. Candidate 15 is outside this delivery.
2. **Rack swap:** 1A → 1B → 1T → R3/G/D. **Then rest:** 2A → 2B → 2T → R3/G/D. These deliberately serialize session.ts, Train.tsx and timer ownership. They can ship without the later plan snapshot.
3. **Morning verdict:** 3A → 3B → 3T → R3/G/D. Its pure new readiness file can be drafted in a separate worktree during step 2; integrate bands/selectors only after the rest commit. All later recovery-dependent surfaces consume this result.
4. **Feature 10, capture unit:** 10A + 10AT → R3/G/D. This is an independently useful prerequisite, committed as `feat(coach): capture original workout targets`. Capture data, preserve/display those targets and guard edits now; no new debrief UI is required in this commit. It is the only justified split feature commit: waiting for all of feature 10 would block three higher-ranked features. Data created now enables confirmed skip evidence only after sufficient new sessions.
5. **Live adjustment:** 4A → 4B → 4C → 4T → R3/G/D. Requires F0, 2B and 10A. **Warm-up:** 5A → 5B → 5T → R3/G/D; requires 4A/4C and 10A. Live UI and mutation integration stay sequential.
6. **Chronic skip:** 6A → 6B → 6C → 6T → R3/G/D. Requires F0, 3A and 10A. Existing logs get the explicitly labelled legacy comparison; no backfill. Do not wait months to ship the legacy surface or fabricate confirmed plans.
7. **Closed week / trajectory:** 7A → 7B → 7T, then 8A → 8B → 8C → 8T, each followed by R3/G/D. Their pure new files can be drafted earlier; shared report/words/bands integration is serialized. They have no live-feature dependency. 7B follows 3B because both own Today; 8C precedes 10C because both own History.
8. **Unfinished items:** 9A → 9B → 9C → 9T → R3/G/D. After 6B/6C so apply.ts and Coach grouping are stable. Consumes shipped typed chat memory, adds only once-only reopen metadata and saved-draft discovery.
9. **Finish surfaces:** 10B → 10C → 10T → R3/G/D, then 11A → 11B → 11C → 11T → R3/G/D. 10B needs 10A; 11 needs the fresh FinishScreen session and stale-editor guard from 10A/10C. Finish ordering is receipt → optional repair strip → plan/actual → optional near-miss → existing muscle/note/Done flow.
10. **Record reach:** 12A → 12B → 12T → R3/G/D. Requires 4's effective targets; 12A may be drafted earlier, after F0, since prs.ts is independent of live.ts. **Consistency:** 13A → 13B → 13C → 13T → R3/G/D, after 9B's memory hooks; own schedule guard must compose with reopening/expiry guards. **Near miss:** 14A → 14B → 14T → R3/G/D, after 12A (shared PR helpers) and 10C/11C (finish surface).

Every numbered feature gets a focused commit and full gate, with the explicitly split 10A capture prerequisite and F0 foundation as focused prerequisite commits. Feature rank remains unchanged: build order differs where truthful data or shared file ownership requires it. No bundling all fourteen features into one branch-sized commit.

## Parallel-safe boundaries and file locks

Parallel means separate worktrees/branches with fixed signatures and a single designated integrator. It does not mean two agents edit one checkout concurrently. Do not spawn or dispatch agents unless the owner starts those assignments. Before cherry-pick/merge, rebase on the current verified branch and re-run that feature's gates.

| File or surface | Owners, in integration order | Rule |
|---|---|---|
| `src/brain/live.ts` | F0 → 4A → 5A | Exclusive writer; append, never overwrite. Spec 12 reads the shared resolver. |
| `src/brain/coach/bands.ts` | F0 → 3A → 4A → 5A → 6A → 7A → 8A → 12A → 13A | Reserve named constants in feature patches; integrator applies one patch at a time. |
| `src/core/models.ts`, `src/core/store.ts` | 2A (models) → 10A → 5B (models) → 9B | Exclusive schema/normalization writer. No unrelated version bump. |
| `src/slices/workout/session.ts` | 1A → 2A → 10A → 4B → 5B → 11B | Exclusive mutation owner; R3 per unit. Spec 1 replacement must join plan identity after 10A. |
| `src/slices/workout/Train.tsx` | 1B → 2B → 10A → 4C → 5A → 10C → 11C → 12B → 14B | Exclusive integration; new standalone presentational files may be drafted in parallel. |
| `src/app/selectors.ts` | 2B → 3B → 4C → 7B | Preserve initialization order and avoid clock-driven heavy recomputation. |
| `src/slices/today/Today.tsx` | 3B → 7B | Exclusive mounting/wiring; independent ReadinessVerdict/WeekReview components may be drafted from frozen props. |
| `src/slices/history/History.tsx` | 10A (save guard) → 8C → 10C | Do not lose fresh-session comparison guard when adding UI. |
| contract/report/words, detector/planner barrels, `src/data/principles.json` | 3A/B (existing recovery/words) → 6A → 7A → 8B → 9A/B → 10B → 13A/C → 14A | One integration lane even when detector source files differ. Metrics/tests get R3 review. |
| `src/slices/coach/apply.ts`, `Coach.tsx` | 6B/C → 9B/C → 13B/C | Compose guards, shared snooze/dismiss behavior and one-success-write semantics. |
| `src/brain/debrief.ts` | 10A → 10B → 11A | Create once. Capture and presentation are different exports in the same module. |
| `src/brain/prs.ts` | 12A; read-only by 14A | Do the extraction once; differential tests protect existing PR semantics. |
| `src/brain/weekly.ts` | 13A | 7A only imports existing weekly helpers; no writer conflict. |
| Existing words/report/principles/fuzz/grounding test files | Feature test owners in integration order | Separate new test files are parallel-safe; amendments to the same existing test file serialize. |
| `docs/COACH_BRAIN.md`, root `PROJECT_STATE.md`, branch tip/CI | D/G integrator | Collect notes per task; one writer appends final verified facts. Never fabricate green CI. |

After F0, safe independent **drafts** include 3A's new readiness.ts, 7A's new review modules, 8A's trajectory.ts, 9A's reopen.ts and 12A's prs.ts work; each can have its distinct new tests authored in parallel. Shared registration edits are held for the integration lane. The new component files from 7B, 9C, 10C, 11C, 12B and 14B can also be drafted against fixed props without editing their parent screens. Do not merge test files importing a not-yet-created module until that dependency lands. Within a feature the brain result must be fixed before UI wiring; mutation and UI tests then verify the real integrated lifecycle.

## Gates, review evidence and completion

R3 reviews every item with R=2, every persisted-state edit (including 5B), and all grounding/metric contract work even if its numeric score could be lower. Review the **diff and named failing-boundary tests**, not the entire repo again. Check exact write scope, missing/legacy metadata, stale event guards, optional-plan privacy, numbers with provenance, and offline requests. The reviewer must not fix a failure by loosening the validator or inferring a missing historical plan. A review-driven implementation fix reruns the relevant tests and full required feature gate.

For each feature, G runs in order: app and proxy typecheck → both full suites → build → five-theme screenshot gate → live Playwright scenarios named in that spec (actual feature, not only generic navigation) → inspect evidence → D's dated decision log → commit → push → exact-head CI green. See spec acceptance sections for commands. Use the installed Chromium path; `/opt/pw-browsers/chromium` is the previous machine's path, not an invariant. Proxy tests with existing explicit skips must be reported as skips, never counted as passing. Do not deploy the Worker as part of these app-only features. Prior audit deployment remains a separate existing operational item.

No new model call, streaming agent, proactive notification subsystem, automatic data mutation, raw body upload, injury prediction or medical guidance is part of these work items. Existing optional report explanation is not a dependency. Appearance/expiry of a fact never persists “seen” state. Only specified explicit actions write choices or logs.

## Ready-to-paste implementation handoff

Project: M/ARC, Preact + TypeScript; branch `claude/phase-9-readiness-preference-ckw91g`.
Task: F0 only. Create shared `src/brain/live.ts` with substitutes, restFor and nextAfterRest, the named bands and pure tests in specs 1–2. No UI or session mutations yet. Read `PROJECT_STATE.md`, this plan, `03-SOURCE-VERIFICATION.md`, specs 1–2, then the referenced source before editing. The eleven later specs are complete; do not redesign them. Helpers are pure, direct-imported, and return grounded numbers; no store/selectors/native/network imports or barrel export. Existing scoreExercise is exported; do not implement rankExercises. Preserve model-independent offline behavior and all existing tests. Run the repo quality gate and document actual results; commit/push and check that exact commit's CI. Later session integration is T2 with T3 review. Follow MODEL_ROUTER.md and end with NEXT.
