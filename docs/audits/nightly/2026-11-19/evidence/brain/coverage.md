# Training engine coverage ledger

Commit: `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`. Reviewer scope: all 30 `src/brain` TypeScript files plus `src/slices/workout/session.ts` (31 files, 7,303 physical lines including comments/blank lines). `coverage.json` inventories exact Git blob entries and 1,117 TypeScript function/arrow/method nodes, including nested callbacks. That count is an inventory, **not** proof that every branch/function/button is correct or executed.

All assigned main files were read in context; the 11 changed files were additionally reviewed line by line against earlier partial snapshot `9ca7f077ce90d702d5998027f677373c297e1e8b`. That snapshot is a comparison lead, not a successfully completed audit baseline. Exact changed paths are in `coverage.json`. Reviewer instructions and AGENTS were read. This is research/QA output, not a formal fresh-model builder approval.

`S` means source review; `C` means callers/consumers traced; `P` means a focused synthetic probe ran. All remaining functions are statically reviewed, not independently tested exhaustively. Parent-run suite/browser/gate evidence belongs to the whole report and must retain its own outcome/limitations.

| File | Functions and behavior reviewed | Caller/flow trace and verification |
|---|---|---|
| `brain/balance.ts` | `trainingBalance`, category grouping, dominant side, distribution thresholds | Coach balance/focus insights; S/C |
| `brain/bodyweight.ts` | Current/historical body-weight resolution, log-before-day lookup, profile fallback | Volume/session totals and bodyweight resistance; S/C |
| `brain/deload.ts` | Lighter-week triggers, expiry, readiness/performance corroboration | Coach offer → proposal/active context; S/C; no autonomous action executed |
| `brain/e1rm.ts` | One-rep-max math, effort/RIR adjustment, validity/fidelity boundaries | History summaries → progression/recovery comparisons; S/C; measured 1RM validity not established |
| `brain/effort.ts` | Effort drift and repeated-exposure comparisons | Coach effort insight; S/C |
| `brain/effortBias.ts` | Bidirectional max/non-max pairing, deduplication, sample threshold, cap | `rules` effort-calibration insight; S/C/P B5 |
| `brain/energy.ts` | Profile completeness, BMR, Keytel rate, 5-second integration, missing coverage, pause cap, Health Connect source | Workout heart finish → session energy; S/C + primary-source check; device calorie validation absent |
| `brain/exposure.ts` | Working/failure sets, role weighting, effective sets, weekly exposure, cumulative levels and age seeding | History, weekly, volume, recovery; S/C, warm-up behavior P through consumers |
| `brain/fidelity.ts` | Set/session flags, load/rep outliers, recovery calibration eligibility, trusted history | Workout save/edit and history/progression comparisons; S/C; mode guard lead handed to Escobar reviewer |
| `brain/heart.ts` | HR max source/expiry, downsampling, contact handling, zones, summaries, HR recovery/rest, effort mismatch and drift | Capture → pre-set rest threshold; stored series → coach drift; S/C/P B4; physical wrist/BLE validation absent |
| `brain/history.ts` | History cache/reference behavior, canonical ID/name fallback, working/held/failure sets, summaries and activity | Shared inputs to progression/trend/recovery/coach; S/C/P B2; changed authoritative-ID logic inspected |
| `brain/onboarding.ts` | Initial goal/training context and starter-plan derivation | Onboarding choices → initial profile/split; S/C; full rendered onboarding delegated to UI reviewer |
| `brain/plan.ts` | Template extraction, lineage, completed/skipped entries and plan matching | Finish/save-template behavior; S/C; partial substitution future-template boundary explicitly retained |
| `brain/progression.ts` | New exercise, weighted/bodyweight/assisted/duration/conditioning paths; readiness/deload/reentry; equipment snapping/load menu; proposed counts | Train/live targets and coach suggestions; S/C/P timed carries and first-exposure exploration; precise equipment hardware unavailable |
| `brain/prs.ts` | Per-mode record candidates, qualifying history and weekly records | Finish/summary/history PR surfaces; S/C; all exercise-mode screens not separately exercised |
| `brain/readiness.ts` | Personal baselines, check-in z-scores, minimum inputs, sleep/RHR/HRV/recovery/load weighting, confidence/corroboration, day-after-session advice | Selector/coach daily readiness and history series; S/C/P B1; observational model accuracy unverified |
| `brain/recovery.ts` | Dose construction, novelty/effort/load/systemic effects, residual stacking, fresh/soreness overrides, ready/full solves, calibration/replay/prefix judging | Session finish/backlog/retime → model; Body/readiness/coach → recovery; S/C/P B3; historical future-dose helper risk explored |
| `brain/retarget.ts` | Load-rung selection, acceptance/earn, goal rep range, equivalent effort and rounding | Equipment-aware progression; S/C; no measured equipment profile correctness claim |
| `brain/splitPlan.ts` | Entire new walk: early sessions, displacement/debt, days off, overnight grace, future slots | Selectors, coach plan/readiness, reminder plan; S/C/P B1; no real notification delivery |
| `brain/substitute.ts` | Match scoring, equipment/movement/muscle constraints and alternatives | Workout substitute choices → session replacement; S/C; catalog clinical equivalence not validated |
| `brain/trend.ts` | Progress metric consistency, assisted inversion, weighted fallback, confidence, breaks and plateau windows | History progress chart/hint and coach progress; S/C/P B2 |
| `brain/units.ts` | Logged-load eligibility, gym/exercise menu fallback, profile source, rungs/jumps/snapping | MenuProfile → live/session targets; S/C; current ENG-01 source change checked |
| `brain/volume.ts` | Level bands, per-muscle offsets, under/over conditions and full-week qualification | Body and weekly review; S/C; numeric band validation remains research proposal |
| `brain/weekly.ts` | Working totals, weekly summary/planned days, forgiveness streak, last-session day and history | Selectors, History, share/review callers; S/C/P B1; stale/cumulative contract interactions reviewed |
| `brain/coach/cues.ts` | Exercise/pattern/equipment matching, deterministic rotation and fatigue/density priorities | Pre/live/post cue selection; S/C; full catalog source-by-source research not completed |
| `brain/coach/live.ts` | During-session signals, set comparison, rest guidance and bounded cue scheduling | Live workout coaching; S/C; device timing/background flow delegated |
| `brain/coach/post.ts` | Effort, load/volume, duration/density, trusted timing baseline and earlier-only historical context | Finish/backlog session insights; S/C; ENG-06/07 source checks |
| `brain/coach/pre.ts` | Pre-session plan and guidance inputs | Pre/live session entry; S/C |
| `brain/coach/rules.ts` | Every rule object plus shared derive/plan/cache, gating, feedback/ranking, historical readiness and deload offer | Insight UI and Escobar read paths; S/C/P B5/B4; privacy/action execution reviewed by Escobar owner |
| `brain/coach/weeklyReview.ts` | Review eligibility, volume/frequency/failure/weight/progression/adherence/rep mix and policy text | Weekly review insight list; S/C/P B1; current science limits in research.md |
| `slices/workout/session.ts` | Start/patch/commit/uncommit, entry add/remove/skip/substitute, rest/pause/resume, finish/discard, template changes, edit timing, backlog, rebuild persistence | State → active workout → saved log/model; S/C; critical commitSet→preSetBpmFor trace checked. No production state changed by probes. |

## Supporting reads and contracts

- Entire `src/data/recovery.ts`, `src/data/goals.ts`, `src/data/volume.ts`; targeted `knowledge.json` research cards and exercise-library metadata used by synthetic IDs.
- `src/core/dates.ts`, targeted core models/store lifecycle definitions, app selectors, workout heart capture, core heart-series storage, History progress caller and progressTrend wrapper.
- Repository tests inspected as specifications/leads: `tests/a3-eng-04-warmup-only.test.ts`, relevant `readiness-adapt2.test.ts`, progression current-plan cut fixtures, substitution-retention fixtures, split-plan fixtures and shared test helpers. Reading a test is not executing it.
- Current `AGENTS.md`, reviewer skill and relevant known-gotcha/delivery context were read. No paid ultrareview, live AI call, deployment, user/owner data or production action was used.

## Executed probes

`run.cjs` bundles source into temporary Node artifacts with the checkout's installed esbuild. Both programs passed in three time zones (six executions total). The fixtures use only synthetic logs/profile values. Timestamp coherence was checked, including `logging.trainedAt`/`trainedEndAt`.

| Program | Assertions/controls | Outcome |
|---|---|---|
| `confirmed.ts` | Warm-up vs empty/mixed plan/completion/adherence; loaded/unloaded timed conditioning vs distance control; complete-prefix vs truncated systemic factor and recovery | B1/B2/B3 reproduced; all actual-output/control assertions passed in Manila/Melbourne/UTC |
| `insights.ts` | Earliest-only max chronology vs emitted explanation; sparse vs adjacent/insufficient HR windows; actual drift-rule insight | B4/B5 reproduced; all actual-output/control assertions passed in Manila/Melbourne/UTC |

Exploratory `probes.ts`, `targets.ts` and `systemic.ts` are retained locally as leads. Their earlier outputs are superseded by the coherent, portable `confirmed.ts`/`insights.ts` fixture set for published confirmed findings. Publish the portable sources/results, not large generated CJS bundles.

The parent reports exact-head GitHub M/ARC gate run `44212503979` passed 108 jobs, including core, timezone, visual, build and source checks. Those are separate CI observations; this reviewer did not independently execute the full CI workflow. The parent also completed a focused local regression: **13 files, 251 tests passed**, exit 0, covering backup/store/migrate/bodyfat/progression/recovery/heart/notifications/plan/fidelity/A3 data/A3 warm-up completion/Escobar apply. The full local run was stopped after Windows-specific failures and no further results. **No complete local-suite pass is claimed.** Refer to the root audit's focused-test log for exact command/output.

## Explicit limits

- Whole app browser/theme/accessibility and Android/PWA/offline/back navigation flows are covered by other reviewers and remain separate from these pure-source probes.
- BLE/wrist HR, Health Connect device accuracy, native timers while backgrounded, actual notification scheduling, real-world physiological predictions and large-history performance were not physically validated here.
- No live AI/provider requests, gym APIs, remote user data or destructive actions. No production edits or fixes to establish “after” success; the before/control comparisons are stated precisely.
- No exhaustive mathematical proof, path coverage or runtime execution of every AST function. Lack of a new finding in a file is not a correctness verdict.
- PR1 (`920114032f7d0350f9a0777ad8b55bd8c84d9c77`) is an unrelated alternative source history. Its readiness/principles/load planner received selected static review only; its full replaced engine and runtime remain **partial/unverified**. Main's probe results do not apply to it.
