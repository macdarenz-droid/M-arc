# Training engine audit — 19 November 2026

Scope: current-main training engine, recovery/readiness, progression, summaries/insights, goals, schedule adaptation and session lifecycle. Pinned main: `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`. This is research and QA, not a production patch or a formal builder approval. Five confirmed findings: **four P2, one P3**. No P0/P1 established in this assigned scope. Static review and focused synthetic executions are distinguished below; no physical sensor, native-device or live-provider result is claimed.

Evidence: `confirmed.ts`, `insights.ts`, `run.cjs` and their `*-manila.json`, `*-melbourne.json`, `*-utc.json` results. Both programs' assertions passed in Asia/Manila, Australia/Melbourne and UTC against the pinned commit. Assertions deliberately capture current defects plus controls; green execution means the defect was reproduced, not that the app is fixed. Run `node path/to/brain/run.cjs path/to/pinned/checkout` with the checkout's existing dependencies. The runner writes only evidence JSON beside itself and temporary bundles outside the app. No production source was edited.

## B1 — P2: warm-up-only sessions still complete the plan and training-day advice

- **Locations:** [splitPlan.ts:49](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/splitPlan.ts#L49), [dates.ts:84](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/core/dates.ts#L84), [weeklyReview.ts:93](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/coach/weeklyReview.ts#L93), [weekly.ts:192](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/weekly.ts#L192).
- **Conditions/reproduction:** schedule Upper on Thursday and Lower on Friday. Save Wednesday Upper with only one warm-up (20 kg × 8). Evaluate Thursday's plan. Separately save the warm-up on Thursday and evaluate trainedToday/readiness. For adherence, save only Thursday warm-ups for four weeks.
- **Expected:** saved warm-up history remains available, but a session without a working set does not satisfy a training slot or drive completed-workout advice. This is the explicit [ENG-04 contract](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/tests/a3-eng-04-warmup-only.test.ts#L1).
- **Actual:** Wednesday's warm-up consumes Thursday Upper (`today:null`, `doneEarly:Upper`) and the plan advances to Friday Lower. Same-day warm-up yields `trainedTodayCount:1` and readiness advises that today's session is done. Weekly summary reports **0 workouts**, while weekly history reports **1 session**. Four warm-up-only Thursdays yield **100% adherence**. Empty-history control retains Thursday Upper; a mixed warm-up + working session counts once.
- **Impact:** the user can lose the intended workout recommendation, receive premature recovery advice and see contradictory completion/adherence figures. The planner's output also feeds reminders, but actual notification delivery was not exercised in this probe.
- **Additional static consumer:** the UI reviewer traced period share-card counts to [cardData.ts:190](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/slices/share/cardData.ts#L190), which counts all in-range sessions while its set totals ignore warm-ups. This is the same root cause; it was not a separate rendered-share probe.
- **Evidence/confidence:** `confirmed-*.json/warmup`; high. Source flow: selectors' `sessionsToday` → daily UI; `splitPlan` → coach/readiness planning; `adherenceRate` → weekly insight. Related history-calendar counting belongs to this same root cause, not a separate defect.
- **Builder recommendation:** centralize the completed-training predicate and apply it to every completion consumer (`hasWorkingSets` already exists). Preserve original logs. Cover warm-up-only, empty, mixed, timed/distance working sets, overnight grace periods, early/displaced slots, adherence, history and reminders in one behavioral contract.
- **Prior status:** **partially resolved, residual confirmed**. Current ENG-04 fixes summary/streak/review/volume completion, but not these remaining paths. The newly introduced planner uses the unfiltered session list. Do not mark ENG-04 globally resolved.

## B2 — P2: timed conditioning progress is lost or reported flat

- **Locations:** [trend.ts:83](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/trend.ts#L83), [History.tsx:500](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/slices/history/History.tsx#L500), contrasted with [progression.ts:416](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/progression.ts#L416).
- **Conditions/reproduction:** log four farmer's carries at 24 kg for 30, 40, 50 and 60 seconds, without distance/reps. Repeat with unloaded battle ropes. Ask `progressSeries` for conditioning mode.
- **Expected:** the progress chart/trend represents the relevant time measurement for these time-based logs, consistently with the next-session target. A mode policy must define how to handle mixed distance/time history without mixing units.
- **Actual:** carries produce `metric:top`, values `[24,24,24,24]`, **flat**, while `suggestNext` asks for **65 seconds**. Ropes produce `metric:reps` with **zero points**. A distance-only control produces `[30,40,50,60]` and an upward trend.
- **Impact:** users following the app's time-progression advice can see no progress or an empty chart; shared trend consumers inherit the wrong metric. The probe establishes the pure chart input, not a rendered-browser screenshot.
- **Evidence/confidence:** `confirmed-*.json/timedConditioning`; high.
- **Builder recommendation:** include the time-based conditioning branch in the shared progress metric decision and use that policy across target/chart/trend consumers. Test loaded/unloaded/custom timed conditioning, distance-only and mixed-field history, ordinary weighted lifts and rep-based conditioning.
- **Prior status:** **residual/newly confirmed** around BUG-41's shared progress series. The current refactor fixes chart/trend disagreement for covered metrics; it does not add a duration fallback for conditioning. Do not treat all conditioning progress as verified.

## B3 — P2: recovery discards history needed by its own return-to-training adaptation

- **Locations:** [recovery.ts:134](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/recovery.ts#L134), [recovery.ts:239](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/recovery.ts#L239), [recovery.ts:254](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/recovery.ts#L254).
- **Conditions/reproduction:** three identical one-hour bench sessions per trained week; trained weeks `[0,3,4,5,6,7]` relative to the audit day, with two missed weeks between the current week and older training. This is the existing ADAPT-2 B-9 return-week scenario, extended through actual muscle-dose calculation.
- **Expected:** the complete preceding history makes an ordinary return week load ratio **1** and systemic factor **1**, as the [ADAPT-2 R7 test](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/tests/readiness-adapt2.test.ts#L128) specifies. Dose calculation must receive the same required history; prefix causality should still prevent future sessions influencing an earlier dose.
- **Actual:** `sessionMuscleDoses` retains only 30 days before passing history into `systemicFactor`, despite the latter's eight-week usual-training baseline. With insufficient old trained weeks, the ratio becomes **2**, factor **1.25**, and last chest tau **31.952 h** instead of **25.562 h**. Twenty-five hours after that session, current recovery is **65%, 36.6 h to ready**, while the controlled full-prefix calculation gives **71%, 25.8 h**. Displayed current systemic factor remains **1**. The counterfactual changes only each dose's truncated-history multiplier; it is audit evidence, not a shipped fix or ground truth about physiology.
- **Impact:** return-to-normal training receives an unintended extra recovery penalty and later ready times, contradicting the adaptation's own contract and the whole-body signal.
- **Evidence/confidence:** `confirmed-*.json/recoveryPrefix`; high. Reproduced consistently in all three time zones with coherent local-day timestamps.
- **Builder recommendation:** retain the full required eight-week prefix or precompute equivalent time-indexed load summaries. Keep the future-session exclusion and performance safeguards. Add integration tests comparing full-prefix versus optimized dose generation for breaks, genuine spikes, short history and multiple sessions on the same day. The existing test only checks the standalone factor and misses the caller's truncation.
- **Prior status:** **newly confirmed integration defect** in unchanged high-risk logic; standalone ADAPT-2 protection exists but is not carried through actual recovery generation.

## B4 — P2: disconnected heart samples become a fictitious 15-second pre-set window

- **Locations:** [heart.ts:264](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/heart.ts#L264), [heart.ts:313](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/heart.ts#L313), [rules.ts:665](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/coach/rules.ts#L665), [workout/heart.ts:76](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/slices/workout/heart.ts#L76).
- **Conditions/reproduction:** a 20-minute live session with six sets. Each 200-second interval has just three samples at +10, +90 and +190 seconds. First three intervals read 80 bpm, last three 100 bpm. There is no adjacent 5-second triple anywhere.
- **Expected:** no pre-set 15-second median is available from these discontinuous samples. The insufficient-signal fallback should apply; no medium-confidence drift alert should be derived from a nonexistent window.
- **Actual:** `preSetBpmFromWindow` strips time before computing sliding three-value medians. All six sparse intervals count as known pre-set HR, resulting in **25% drift** and a **medium-confidence alert** interpreting heat/water/rest. Two-sample input correctly returns null; properly adjacent three-sample controls return the expected drift. `downsampleToBuckets`/capture preserve missing buckets rather than synthesizing them; `preSetBpmFor` also feeds heart-guided rest through `commitSet`.
- **Impact:** disconnected/paused/low-coverage signals can influence rest thresholds and generate a physiological interpretation beyond the available signal. No physical watch dropout was performed; this is a confirmed accepted-input logic defect with synthetic evidence and traced capture/call paths.
- **Evidence/confidence:** `insights-*.json/heart`; high for calculation/insight, unverified device incidence.
- **Builder recommendation:** retain timestamps and require adjacent valid buckets when finding pre-set windows; return null when none qualify. Apply the same quality/continuity policy to live rest and post-session drift. Add disconnect/reconnect, pauses, out-of-order/duplicate import, insufficient and normal-signal tests.
- **Prior status:** **residual/newly confirmed**. SCI-07 already checks adjacency for observed max and post-set ready timing, but not this pre-set median path.

## B5 — P3: effort calibration invents the order of the user's sets

- **Locations:** [effortBias.ts:42](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/effortBias.ts#L42), [rules.ts:566](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/coach/rules.ts#L566).
- **Conditions/reproduction:** 50 kg bench: 12 reps rated max on November 10, then six reps rated ideal on November 11, 12 and 13. There is exactly one max set, and it is earliest.
- **Expected:** evidence text accurately describes the compared records, without asserting an order the observation did not retain.
- **Actual:** the generated insight states the ideal set came first and a **later max set** beat it by six reps. `rirObservations` accepts both temporal directions, but the wording always assumes one. Three matched pairs all reuse the same old max set.
- **Impact:** the coach presents a false personal-history explanation, reducing trust in an otherwise advisory calibration. D11 keeps this bias out of e1RM, so this finding does not claim changed loads or strength estimates.
- **Evidence/confidence:** `insights-*.json/effort`; high.
- **Builder recommendation:** retain both observation dates/provenance and select accurate direction-neutral or chronological copy. Test max-before and max-after, mixed examples and stale/outlier pairs. Treat independent sessions and shared-reference pairs distinctly when assigning evidence strength.
- **Prior status:** **newly confirmed** in unchanged insight logic. No specific earlier tracked fix verified for this copy issue.

## Risks and improvements — not additional confirmed bugs

1. **Scientific precision and validation.** Recovery percentages, tau values, exact volume bands, readiness weights/thresholds, deload triggers and fixed failure-share caps are application policies. The checked literature supports broad training principles, not these numerical calibrations or personalized ready timestamps. Validate against longitudinal outcome data with out-of-sample evaluation, retain model versions, and distinguish signal amount from validated predictive accuracy. Detailed sources and limits are in `research.md`.
2. **Adaptation to intent.** Separate desired body-weight direction from the training goal. Current `lean` defaults to a weight-loss band, even though its visible purpose also covers general muscle/definition/strength. A user seeking maintenance/recomposition should not need to choose an unrelated training goal. This is a product improvement, not a proven violation of the present specification.
3. **First-exposure set policy.** A never-logged exercise returns a starter prescription before the ordinary red-day/deload set reductions. Synthetic exploration produced three planned starter sets on both a red day and lighter week, with `holdLoad:true`. A conservative starter can be deliberate; specify whether first exposures must also obey the current day's set budget, then test the chosen contract. No separate bug count without that decision.
4. **Historical recovery contract.** `recoveryAt` uses the list's last dose even when it is later than the query time. A synthetic historical query keeps percentage similar but can report future `lastTrainedAt` and inflate hours-left. The existing readiness-series caller primarily needs percentage. Broader user-visible misuse was not established in this pass; either constrain/document the helper or filter future doses consistently before new historical consumers use it.
5. **Performance.** The dose engine's cache/window optimization should be tested for numerical equivalence, not only runtime. `rirObservations` compares session pairs within a 14-day window; dense imported history and per-exercise insight recomputation merit a representative large-history benchmark. No measured performance regression is claimed here.

## Prior findings disposition

Previous audit documents and code task IDs were leads, not proof. Current source establishes these narrowly scoped dispositions:

| Prior area | Present disposition | Evidence/limit |
|---|---|---|
| ENG-04 warm-up completion | Partially resolved; B1 remains | Summary/mixed controls executed; planner, readiness and adherence contradicted |
| BUG-41 chart/trend consistency | Shared series present; B2 remains | Time/distance conditioning controls executed |
| ADAPT-2 B-9 return-week factor | Standalone protection present; B3 remains | Full-prefix vs optimized actual dose probe |
| SCI-07 heart continuity | Observed-max/ready-time checks present; B4 remains | Sparse pre-set/drift insight probe |
| ENG-01 gym menu profile | Implementation present, static traced | Cross-gym hardware/UI outcome not independently established here |
| ENG-02 current-plan set cuts | Existing-history reduction code updated | New-exposure policy gap retained as improvement, not declared resolved |
| ENG-03 future-week volume | Explicit end-of-week filter present | Source review; parent suite provides separate check evidence |
| ENG-05 retime/backlog recovery | Both paths call rebuildRecoveryModel | Source/caller review; no physical import/device test here |
| ENG-06 duration baseline trust | Baseline filters timingTrusted | Source review; do not extend to all edited-session fields |
| ENG-07 backlog prior context | Filters to strictly earlier start times | Source review; no claim about concurrent equal timestamps beyond current code |
| UI-R01 substitution | Committed sets retained, remaining rows inserted | Code and focused repository tests reviewed; future-template choice after partial substitution remains a boundary to exercise |
| Older issues outside this scope | Unverified by this reviewer | Other reviewers/whole report must supply their own evidence |

## Unmerged PR #1

Separately inspected ref `refs/audit-nov19/1`, head `920114032f7d0350f9a0777ad8b55bd8c84d9c77`. It has no merge base with the pinned current main and uses a different engine architecture. Selected static reads covered `src/brain/readiness.ts`, `coach/principles.ts`, and `coach/planners/load.ts`. They show robust per-person median/MAD readiness baselines, evidence-card metadata with verification levels, and proposal-based load planning. These are architectural observations, not verified current-app behavior. Its planner also checks any same-day session before proposing load; warm-up treatment would need its own branch contract and reproduction.

The full alternative branch's 81-file brain replacement was **not completely reviewed or executed** by this reviewer. Do not reuse main's results as validation of that branch or count it as a fully covered implementation PR. No actionable PR1-only bug is asserted from these limited reads.
