# Escobar, Worker and error reporting audit

Main commit: `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`. Review date: 2026-11-19. This lane found **one P2 and three P3 confirmed defects**, plus two separately labelled improvement/risk items. Findings are current-main findings, not open-PR claims. No production file was changed and no live model, Worker or reporting endpoint was called.

## E-N19-01 — P2: Undo of a newly added gym deletes the gym used by a live workout

- Exact source: [Escobar gym inverse, apply.ts:225–230](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/apply.ts#L225-L230); compare the protected [deleteGym mutation:115–125](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/slices/workout/units.ts#L115-L125).
- Trigger: ask Escobar to add a gym whose default unit is lb; Apply it; start a workout at that gym; within the eight-second Undo window use the original suggestion's Undo. The probe executes the same proposal builder, Apply, `startSession` and inverse synchronously, so there is no artificial elapsed-time bypass in the modelled sequence. Physical navigation timing was not measured.
- Expected: once a session uses the created gym, reject Undo or preserve its equipment context until it is safe to remove. The ordinary `deleteGym` path already refuses this exact deletion.
- Actual: the inverse filters the gym directly and restores `activeGymId`, leaving `active.gymId` pointing to the removed entity. The recorded probe shows `undo: undone`, `liveGymExists: false`, `beforeUnit: lb`, `afterUnit: kg`. An explicit normal `deleteGym` call immediately before Undo correctly did nothing.
- Impact: live set input/equipment fallback silently changes unit context and later history can retain a nonexistent gym reference. Already saved canonical kg is not claimed to be retroactively converted.
- Evidence: `probes.ts`, case `new_gym_undo_in_live_session`, output in `probes-output.jsonl`; assertions passed. High confidence; actual app source executed with synthetic local state, no browser/device reproduction.
- Recommendation: centralize inverse removal with the same in-use guard as normal deletion; return `UndoUnavailable` when the live session uses this gym. Preserve related equipment rows and the original active-gym reference only when still valid. Add a regression for Apply gym → start session → Undo, plus unrelated-gym Undo and later edit cases.
- Prior status: related to original improvement UI-R06. Its normal Settings/mutation path has a protection now; this separate Escobar inverse bypass remains. Do not report UI-R06's original button flow as still broken based on this result.

## E-N19-02 — P3: Session lookup supplies false load warnings for assisted exercises

- Exact source: [getSession, read.ts:183–184](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/tools/read.ts#L183-L184), [flagsForSet, fidelity.ts:195–204](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/fidelity.ts#L195-L204). Compare the documented [mode-aware checkLoad exclusion:131–139](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/brain/fidelity.ts#L131-L139).
- Trigger: an assisted pull-up session with 20 kg assistance, followed by 40 kg assistance. Ask Escobar to inspect the later session (`get_session`).
- Expected: interpret kg as helping weight; do not apply the resistance-load jump rule that the brain explicitly excludes for assisted/bodyweight work.
- Actual: `getSession` recalculates flags with `flagsForSet` and no exercise-mode parameter, so every 40 kg row gains `implausible_load`; the mode-aware `isImplausibleSet(..., checkLoad=false)` returns false for the same row. This is confirmed model input, not a claim that a live model necessarily produces a particular answer.
- Impact: correct easing of an exercise can be presented to Escobar as suspect logging, encouraging unnecessary corrections or lowering trust in a legitimate session.
- Evidence: `assistance_wrong_flags` in the source probe and JSONL; exact library ID `lib_assisted_pull_up`; assertions passed. High confidence.
- Recommendation: share the mode-aware fidelity decision used by training/history. Pass resistance mode and suitable heavy-main metadata rather than unconditionally checking load. Verify assistance increases/decreases, bodyweight added loads, weighted lifts and real unit mistakes separately.
- Prior status: new confirmed adapter inconsistency in this audit; not claimed as a newly introduced commit regression. The brain reviewer independently raised this lead; it is counted once here.

## E-N19-03 — P3: A failed plan evaluation displays a successful check

- Exact source: [PlanBoard.tsx:69–71](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/ui/PlanBoard.tsx#L69-L71) and [verdict at :94–96](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/ui/PlanBoard.tsx#L94-L96). `currentTurn` preserves `isError` at :31–33, but the verdict ignores it. [EscobarSheet.tsx:131](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/ui/EscobarSheet.tsx#L131) displays this board while a plan turn is busy.
- Trigger: during plan generation, `evaluate_plan` receives an invalid draft, returns an error, and Escobar starts the next model step to repair it. The synthetic call `{draft:{splits:[]}}` produces the real executor error `draft needs splits and schedule`.
- Expected: distinguish pending, failed, blocked and successful evaluation states; an error must not attest to volume or recovery safety.
- Actual: error results have no `data.issues`, so `issues` becomes empty; the board renders “Weekly volume and recovery check out.” This is the busy plan board, not a claim that a saved programme bypasses the separate Apply validation.
- Impact: misleading reassurance while an unvalidated plan is being repaired; particularly confusing if the repair later stalls or changes the plan.
- Evidence: `ui-leaf-probes.ts` invokes the actual executor and pure `PlanBoard` renderer with its stored tool result. `plan_error_false_pass` passes; a blocking-issue control correctly displays “Adjusting.” High confidence. The VNode tree was inspected offline; no mounted browser or live model output is claimed.
- Recommendation: require a non-error result with a valid evaluation shape before showing success. Render error/retrying state separately and bind a verdict to the current draft. Add failed, pending, blocked, successful and revised-draft controls.
- Prior status: newly confirmed in this audit; introduction commit and regression status not established.

## E-N19-04 — P3: Assisted exercise volume cards label repetitions as kilogram volume

- Exact source: [show.ts:70–72](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/tools/show.ts#L70-L72) computes assisted volume as repetitions and [:89](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/tools/show.ts#L89) correctly returns `unit: reps`; [components/index.tsx:22](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/ui/components/index.tsx#L22) instead hardcodes every volume label as `kg volume`.
- Trigger: request an assisted pull-up volume trend, producing `show(lift_trend, {exerciseId:'lib_assisted_pull_up', metric:'volume'})`.
- Expected: use the authoritative summary unit and identify the metric as repetitions for assisted work.
- Actual: synthetic three-set sessions of 8 and 10 reps produce summary `best:30`, `unit:reps`, but the card says “First 24 Last 30 Best 30 kg volume.”
- Impact: incorrect dimension and disagreement between the numeric data supplied to Escobar and the card shown to the user.
- Evidence: `assisted_volume_wrong_unit` in `ui-leaf-probes-output.jsonl`; current `summarize` and unchanged `LiftTrend` VNode renderer executed. A build-time test-only export exposes the otherwise private pure renderer; no rendering logic or production file was modified. High confidence, not a browser screenshot.
- Recommendation: use `s.unit` and metric-aware display labels from the same summary contract. Test assisted volume, weighted tonnage, top set and e1RM independently; avoid guessing units from `metric` alone.
- Prior status: newly confirmed adapter/renderer mismatch; not claimed to have been introduced since the previous audit.

## Reassessment of prior Escobar issues

The same fresh source probe re-executed the principal reproductions; these are **resolved for the tested scenarios**, not guarantees over all edge cases:

| Prior item | Current evidence |
|---|---|
| IMP-E01 live override drift | `progressionCtxFor` uses the live entry factor after midnight and does not inherit another split's override. |
| IMP-E02 cross-conversation Undo | Applying B/p1 then A/p1 and using A's toast while B is visible restores A's autoRest only; B's showSpark and visible conversation stay unchanged. |
| IMP-E03 weight Undo | A later manual 81 kg correction survives the inverse of an 82 kg proposal, with one daily log row; immediate Undo removes the false 82 kg profile insight. |
| IMP-E04 deleted-gym equipment proposal | Deleted target gym changes the fingerprint; Apply is stale and creates no orphan profile. |
| IMP-E05 paused live read | 20 elapsed wall-clock minutes with a 10-minute ongoing pause reports 10 training minutes and 60 paused rest seconds. R11 intentionally counts typed working rows as done; count and returned rows both equal one. The old assertion demanding committed-only count is obsolete under that explicit contract. |
| IMP-E06 haptics | Applying haptics off immediately prevents a fake native haptic call. No physical vibration claim. |
| SEC-01 coach off | Current source checks enabled before every request/retry and state subscription stops the active turn. Root's app suite supplies broader current test evidence; this lane did not perform a live cancellation call. |
| SEC-03 concurrent quota | Current Durable Object admission reserves before upstream, serializes reservation reads/writes, fails closed on DO exception/timeout and releases unbilled holds. Current mocked Worker suite passes, including AUD-3 cases. Actual deployed binding/configuration is unverified. |
| SEC-02 conversation replay | Still a documented privacy design tradeoff: earlier assistant/user prose can replay after a sharing switch is disabled. `docs/PRIVACY-POLICY.md:30` discloses this. Not counted as a new defect. |

## Risks and improvements, not additional confirmed bug counts

**Unsent photo retention (source-traced risk, medium confidence).** [Composer.tsx:58](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/ui/Composer.tsx#L58) writes a selected attachment to the image store immediately; [Remove photo at :69](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/ui/Composer.tsx#L69) only removes its component state reference. [images.ts:30–36](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/images.ts#L30-L36) retains memory/IndexedDB bytes, while conversation pruning discovers references only from saved conversations. An attachment removed before sending never had such a reference. Add explicit draft ownership/deletion and test remove/cancel/unmount/picker completion races in a real browser IndexedDB harness. This lane did not run the photo picker or inspect a live IndexedDB database, so this is not represented as an executed storage reproduction.

**Reasoning/grounding remains numeric, not semantic (confirmed design limitation).** The current [checkGrounding at verify.ts:138](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/escobar/verify.ts#L138) accepts “Your bench press is 100 kg” when its only fact is chest recovery 100%. The synthetic case passes `ok:true`. Bind factual claims to cited source, entity, date/window, unit and uncertainty; use task-specific evaluation cases for contradictions, outdated context and tool failure. This is a previously documented limitation, not a new regression or proof that all generated reasoning is unreliable.

## Verification and limitations

- Worker TypeScript check: exit 0. Worker Vitest: **9 files, 163 tests passed**, 3.78 s, `--maxWorkers=2`, current checkout. Tests use scripted providers and fake D1/DO infrastructure; no paid provider calls.
- Reused installed Worker dependencies by a local junction only after matching Worker lockfile SHA-256 `90b538db721476106ec4a5b8fe209dafacfd09d232ff417835e208cc34b3dd54`. Root app dependencies likewise supplied by the root reviewer. No dependency manifests or lockfiles changed.
- Fresh offline probes: exit 0, 8 JSON result records. Source bundled with esbuild in a scratch directory, `import.meta.env.MODE="test"`; aliases resolve current checkout. One preliminary expectation for IMP-E05 was corrected after reading the explicit R11 typed-row contract; final evidence is the successful run. No app tests were weakened or edited.
- Extension probes: exit 0, 2 additional JSON records in `ui-leaf-probes-output.jsonl`. These inspect pure VNode trees and do not mount DOM, run hooks or exercise a browser. The first invocation completed assertions but remained alive on imported app clocks; it was stopped and the standalone harness was given a final process exit. The final run completed successfully. No passed Worker or root regression suite was rerun for this extension.
- Publication portability: probe imports now use `@/` and `@tests/`, with an explicit checkout CLI argument and esbuild resolved through that checkout's package. Both probes were copied into a separate fixture with the final repository documentation layout, built from outside the checkout and executed once. All ten records match the retained original outputs byte-for-byte; both runs exited 0. `README.md` and `portability-verification.json` document commands and matching hashes. This rerun verified packaging; it added no production coverage claims.
- Exploratory `exercise_card`/`get_next_target` menu comparison in the probe found no disagreement in its sampled machine fixtures. It is not evidence of a defect or comprehensive target parity.
- This lane did not browser-exercise every Escobar control, physically test notifications/haptics, call the live Worker, inspect server bindings/secrets/logs, or conduct fresh paid-model reasoning evaluation. Provider retention/model behavior was not independently reverified online in this lane. No scientific efficacy claim rests on this lane.
- `coverage.json` now records full-file source review for every assigned production source module, including the unchanged session/tool/permission/error paths and grouped small UI/data modules. It contains per-file review notes and named function/control locations, plus flow-level evidence and concrete runtime gaps. Worker tests/support, the dependency lock and generated schemas are labelled separately; their execution or structure checks do not imply every transitive dependency or generated line was independently audited. It is a coverage ledger, not a claim of exhaustive proof. Shared stylesheet/theme and external screen integration coverage belongs to the root UI reviewer.
