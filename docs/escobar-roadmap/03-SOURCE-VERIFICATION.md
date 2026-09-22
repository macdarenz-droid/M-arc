# Source verification: Escobar specs

**Source baseline:** `c3f467571f958c54e6447c7182ebf15c007d5947`, branch `claude/phase-9-readiness-preference-ckw91g`. **Pass date:** 2026-09-21. This is a source-reference pass and documentation correction, not a claim that any proposed feature has been implemented. The original design/rankings and shipped intelligence-audit tiers remain intact.

## Method and result

Read the handoff, brief, scoreboard and existing spec template before authoring; read COACH_BRAIN.md and the actual owners before correcting references. Enumerated repo paths with `rg --files`, grepped referenced call/type/constant names against `src`, `tests` and `proxy/src`, then inspected definitions and consumers. A TypeScript AST declaration cross-check distinguished exports from file-local helpers. Line numbers below refer to the baseline only; resolve by symbol before editing. Legacy `/home/user/M-arc/` paths in specs 1–3 are now repo-relative. Every new signature is labelled NEW/proposed; it is not an existing import until its prerequisite lands.

The existing spec headers claimed an adversarial pass was clean although the handoff said it had never run. Those claims were replaced by the scoped source-verification statement. Source paths resolve; names absent at baseline are explicitly listed below as new work, local draft helpers or forbidden/non-goal names. No missing production helper is silently assumed to exist.

## Existing symbol owners used by specs 1–3

“Local” means the spec may modify/use it inside that file, not import it elsewhere. Imported library functions (Preact hooks/signals, Vitest, JavaScript Map/Set/Math/Array/Date) are dependencies/built-ins rather than repo exports.

| Existing source | Verified declarations and baseline line |
|---|---|
| `src/core/models.ts` | `Exercise` @ 15, `ResistanceMode` @ 13, `Effort` @ 4, `LoggedSet` @ 30, `LoggedExercise` @ 38, `Session` @ 68, `Split` @ 89, `ActiveSession` @ 105, `RestState` @ 99, `AppState` @ 286, `ReadinessEntry` @ 61, `CoachState` @ 223, `freshState` @ 310, `emptyCoach` @ 282 |
| `src/core/store.ts` | `state` @ 54, `initStore` @ 61, `replaceState` @ 98, `update` @ 93, `flushSave` @ 103, `normalize` (local) @ 16, `persistSoon` (local) @ 87 |
| `src/core/exercises.ts` | `findExercise` @ 75, `startingLoadKg` @ 134 |
| `src/core/units.ts` | `formatLoad` @ 13 |
| `src/core/dates.ts` | `dayKey` @ 7, `daysBetween` @ 39, `formatClock` @ 55 |
| `src/data/goals.ts` | `GoalId` @ 2, `GOAL_BY_ID` @ 24 |
| `src/data/muscles.ts` | `MuscleId` @ 6, `muscleLabel` @ 64 |
| `src/brain/progression.ts` | `Suggestion` @ 21, `suggestNext` @ 59, `repRange` @ 41 |
| `src/brain/coach/context.ts` | `BrainContext` @ 8, `contextFromState` @ 29 |
| `src/brain/coach/contract.ts` | `Proposal` @ 146, `Finding` @ 87, `FindingsReport` @ 170, `FindingKind` @ 47, `ProposalKind` @ 60, `CONTRACT_VERSION` @ 16, `FINDING_KINDS` @ 22, `PROPOSAL_KINDS` @ 49, `PRINCIPLES_BY_FINDING` @ 182, `PRINCIPLES_BY_PROPOSAL` @ 209, `reportNumbers` @ 239 |
| `src/brain/coach/deload.ts` | `applyDeload` @ 13, `deloadActive` @ 7 |
| `src/brain/coach/cues.ts` | `equipmentGroup` @ 23 |
| `src/brain/coach/planners/shared.ts` | `UsageProfile` @ 37, `PickOptions` @ 61, `usageProfile` @ 46, `allExercises` @ 100, `scoreExercise` @ 74, `pickExercise` @ 88, `recentPainMuscles` @ 118 |
| `src/brain/coach/planners/today.ts` | `planToday` @ 25 |
| `src/brain/coach/detectors/notes.ts` | `detectNoteFlags` @ 18 |
| `src/brain/coach/detectors/recovery.ts` | `AdjustedRecovery` @ 16, `adjustedRecovery` @ 54, `readinessFactor` @ 35, `readinessAvg` (local) @ 25, `detectUnderRecovered` @ 79 |
| `src/brain/coach/detectors/readiness.ts` | `detectReadiness` @ 19, `avg` (local) @ 15 |
| `src/brain/coach/detectors/shared.ts` | `round1` @ 27, `round2` @ 28 |
| `src/brain/exposure.ts` | `isWorkingSet` @ 29 |
| `src/brain/coach/report.ts` | `buildReport` @ 44, `ACCEPT_COOLDOWN_DAYS` @ 23, `PROPOSAL_ORDER` (local) @ 27 |
| `src/brain/coach/words.ts` | `CATEGORY_OF` (local) @ 29, `KIND_WEIGHT` (local) @ 323, `wordsFor` (local) @ 119, `renderProposal` @ 391, `suggestionsFrom` @ 470, `num` (local) @ 92 |
| `src/brain/coach/explainer.ts` | `allowedNumbers` @ 130, `validateText` @ 156, `buildPayload` @ 87, `trimFindingsAndProposals` @ 63 |
| `src/ai/ask.ts` | `askAllowedNumbers` (local) @ 248, `sanitizePersonalAnswer` (local) @ 277 |
| `src/slices/workout/session.ts` | `active` @ 18, `patchActive` (local) @ 20, `REST_MIN` @ 16, `REST_MAX` @ 16, `REST_STEP` @ 16, `startSession` @ 25, `pauseSession` @ 50, `resumeSession` @ 55, `setSet` @ 64, `commitSet` @ 72, `addSet` @ 81, `removeSet` @ 85, `markDone` @ 89, `skipEntry` @ 94, `addExerciseToSession` @ 98, `removeEntry` @ 102, `startRest` @ 106, `adjustRest` @ 113, `stopRest` @ 122, `restRemainingSec` @ 127, `finishSession` @ 136, `discardSession` @ 174 |
| `src/slices/workout/Train.tsx` | `LiveSession` (local) @ 191, `EntryCard` (local) @ 248, `RestBanner` @ 360, `FinishScreen` (local) @ 318, `EFFORTS` (local) @ 30 |
| `src/slices/today/Today.tsx` | `Today` @ 25 |
| `src/slices/today/ReadinessCheckIn.tsx` | `ReadinessCheckIn` @ 25 |
| `src/slices/coach/Coach.tsx` | `KIND_LABEL` (local) @ 29 |
| `src/slices/coach/apply.ts` | `acceptProposal` @ 24, `dismissProposal` @ 111 |
| `src/slices/workout/splits.ts` | `createSplit` @ 11 |
| `src/app/selectors.ts` | `today` @ 16, `deload` @ 60, `unit` @ 29, `brainContext` @ 39, `recovery` @ 45, `scheduledSplit` @ 36, `todayPlan` @ 34, `sessionsToday` @ 62, `setTicking` @ 22, `nowMs` @ 20 |
| `src/app/toast.ts` | `showToast` @ 5 |
| `src/ui/primitives.tsx` | `Card` @ 55, `Button` @ 64, `Chip` @ 70, `Row` @ 89, `Sheet` @ 101 |
| `src/theme/themes.ts` | `THEMES` @ 58 |
| `src/native/notifications.ts` | `scheduleRestDone` @ 37, `cancelRestDone` @ 51 |
| `src/native/capacitor.ts` | `isNative` @ 2 |
| `src/native/haptics.ts` | `haptic` @ 20 |
| `proxy/src/handler.ts` | `validateGrounding` (local) @ 84 |
| `tests/helpers.ts` | `session` @ 4, `sets` @ 18 |
| `tests/coach-helpers.ts` | `ctx` @ 75, `TODAY` @ 8, `LAST_MONDAY` @ 9, `PUSH_ID` @ 52, `LEGS_ID` @ 52, `PUSH_EX` @ 54, `LEGS_EX` @ 56, `pplSplits` @ 58, `pplHistory` @ 66 |

Existing bands are all owned by `src/brain/coach/bands.ts`: RIR_BAND, COMPOUND_PATTERN, REST_STRENGTH_SEC, REST_SHORT_SEC, RECOVERY_FLAG_PCT, RECOVERY_SWAP_PCT, RECOVERY_VOLUME_FACTOR_MAX, READINESS_LOW_AVG, READINESS_RECOVERY_FACTOR_MAX, READINESS_PATTERN_MIN_LOW, READINESS_PATTERN_WINDOW_DAYS, FATIGUE_RECOVERY_FACTOR and DELOAD_LOAD_FACTOR. They were grepped directly. The readiness proposal constants and live rest/substitution constants below are additions, not existing exports.

## Explicitly new symbols: do not grep and substitute another API

| Spec | New owner | New symbols / changes |
|---|---|---|
| 1 | `src/brain/live.ts` | Substitute, SubstituteOptions, substitutes; local REP_PROGRESS_MODES/sameModeFamily and ranking predicates. Create once. |
| 1 | `src/brain/coach/bands.ts` | MAX_SUBSTITUTES, SUBSTITUTE_MIN_READY. |
| 1 | `src/slices/workout/session.ts` | replaceEntry, with optional expected-session/exercise guard. |
| 1 | `src/slices/workout/Train.tsx` | Local swap UI state/callbacks, including doSwap/openSwaps/fmtTarget/onBrowse; they are not imports. |
| 1 | `tests/live-substitutes.test.ts` | New tests/withMachine fixture, using existing test helpers. |
| 2 | `src/brain/live.ts` | RestInput, RestGrade (includes deltaSec), RestReasonKind, RestNext, restFor, nextAfterRest. Append to spec 1's module. |
| 2 | `src/brain/coach/bands.ts` | REST_EFFORT_MULT, REST_COMPOUND_MULT, REST_ROUND_SEC, REST_FLOOR_SEC, REST_CEIL_SEC, REST_MIN_REMAINING_SEC. REST_MIN/MAX are currently in session.ts and move here under new names. |
| 2 | `src/slices/workout/session.ts` | Exported regradeRest; local gradeFor/retimeRest/MIN_REMAINING_SEC. Existing startRest gains optional metadata/grade args. |
| 2 | `src/app/selectors.ts`, `Train.tsx` | restNext computed; local restNextLine/REST_REASON. |
| 2 | `tests/live-rest.test.ts` | New pure and lifecycle tests. afterEach comes from installed Vitest, not a repo helper. |
| 3 | `src/brain/readiness.ts` | ReadinessDimension/Centre/Baseline/Worst/Drift/Today/Verdict; READINESS_DIMENSIONS and READINESS_DIMENSION_LABEL; readinessAvg/Median/Mad/Baseline/LowLine/Drift/Verdict/Today. The old recovery.ts readinessAvg is private and is replaced there with the new import. |
| 3 | `src/brain/coach/detectors/recovery.ts` | ReadinessAdjustment/readinessAdjustment; additional counterfactual fields on existing AdjustedRecovery. |
| 3 | `src/brain/coach/verdict.ts` | ReadinessTone/Consequence/Card, readinessConsequence, readinessCard. |
| 3 | `src/slices/today/ReadinessVerdict.tsx` | New ReadinessVerdict component (alias same-named brain type when needed); local TONE_CLASS. |
| 3 | `src/brain/coach/bands.ts` | READINESS_BASELINE_WINDOW_DAYS/MIN_ENTRIES, MAD_FLOOR, Z_RED/AMBER/GREEN, DIM_DROP, GOOD_AVG, FLOOR_HARD_AVG, DRIFT_MIN_RUN, RECOVERY_FACTOR_AMBER (all with READINESS_ prefix). |
| 3 | `tests/readiness.test.ts` | New tests. Existing coach-readiness/words/fuzz/principles tests are modified in place. |

`REST_REGRADE_WINDOW_SEC` and `medianRestSec` are deliberately absent: spec 2 says **not** to implement the two-path retimer or measured-rest learning. `rankExercises` is not an existing export and is not needed; use scoreExercise. `PRINCIPLES_BY_` and `READINESS_` in prose are prefixes, not symbols. Spec-local examples such as memory/seed/withMachine, setSwap/setConfirmSwap, clamp and JSX callbacks are locally declared by the implementing agent, not missing production functions.

## Corrections incorporated into specs 1–3

| Spec | Source finding | Binding correction |
|---|---|---|
| 1 | Active entries are index-based; no replaceEntry exists yet. Undo can outlive its session/slot. | Define guarded replacement, recheck current target/confirmation on tap and block Undo after new input/session changes. Spec 10 later adds stable plan identity. |
| 1 | scoreExercise is already exported; substitutes can be composed without a ranking refactor. | Keep direct live.ts imports and reuse the existing scorer. Starter loads are labelled as starters, not personal history; already-saved note flags remain usable offline, and narrow sessions-array memoization does not invalidate on active-input changes. |
| 2 | Spec 1 prohibited a barrel export while spec 2 requested one. | No `src/brain/index.ts` change; direct imports everywhere. |
| 2 | Rest total/remaining differ; resumeSession reconstructs the rest object; topology is index-based. | Preserve metadata on resume, preserve elapsed during retime, bind ownership to session/exercise and clear ownership on structural changes. |
| 2 | An extension cannot preserve both elapsed time and a monotonically increasing completion fraction. A five-second floor can conflict with the 600-second cap. | State truthful fraction behavior and cap the remaining floor near the ceiling; never revive an expired timer. |
| 2 | Existing startRest clamps without integer rounding; next-set target is not the typed current weight. | Declare integer normalization as new, and compare the banner with the computed next placeholder rather than a hardcoded 72.5 kg fixture. |
| 2 | Displayed adjustment was derived in JSX. | RestGrade.deltaSec owns the number; manual/late overrides hide the grade reason when not honored. |
| 3 | Today writes on Save, not on the third dimension tap. | Verdict replaces check-in only after explicit Save. |
| 3 | Existing linear readiness factor at average 2 is 1.1, not 1.3. | Correct old-behavior claims and fixtures without changing the chosen new baseline/MAD design. |
| 3 | A today_plan that switches splits ignores its modifications during acceptance. Rounded returned factors cannot reconstruct the counterfactual. | Attribute only applicable modifications; compute the unrounded no-readiness counterfactual inside adjustedRecovery. |
| 3 | Baseline gate is ten **prior** days; future and duplicate rows can pollute an imported history. | Eight entries including today leave seven prior entries and a deficit of three; normalize valid canonical day observations for computation only. |
| 3 | Relative improvement can coexist with an absolute-low override; a proposal has not applied yet. | Do not say “better”/“already adjusted” when it is not; use neutral/suggested wording and one muscle's own percentages. |
| 3 | CSS has danger-text, not negative-text; core JSX return type needs a type import. | Use verified styles and explicitly import JSX; distinguish component/type names. |

The preceding checks concern executable references and internal consistency. No new readiness threshold tuning, feature rescoring or replacement design pass occurred. Deferred tuning questions in the original specs are expressly nonblocking; implementation uses the stated defaults.

## Cross-spec references reconciled while writing 4–14

- Shared live.ts is created once. Features 4/5 append; spec 12 consumes the same effective target resolver. No new brain-to-store import.
- Feature 10 owns optional plan types, stable entry IDs and immutable original targets. It captures before current work enters history; absent/invalid legacy metadata yields unknown, never backfill. Captured allowIncrease preserves original progression caution. Structural removal invalidates per-row comparison instead of mispairing rows.
- RestNext gains an optional effective-target vector only when spec 4 lands; the original spec 2 call stays valid. Row, banner, warm-up and PR hint must agree on target values.
- Existing Coach sheets are **InsightSheet and SuggestionSheet**; Insight/Suggestion are words-layer types. There is no ProposalSheet component. The actual stylesheet is `src/ui/styles.css`.
- There is no MAX_SETS export in workout/splits.ts and no existing tests/store.test.ts. Spec 10 declares metadata-only bounds and creates tests/store-plan.test.ts.
- History/trend/prs helpers were read before naming the new APIs: trend.slopePerWeek is relative, repsAtLoadMap is currently private, and recorded PRs remain recordsFor's responsibility.
- Feature 9 uses the scoreboard's planned `src/brain/coach/reopen.ts`, keeps one lifetime evidence-based reappearance per dismissKey, and uses actionPrev to recognize applied goal actions. No chat timestamps/IDs or second action envelope are assumed.
- Habit code is `src/brain/coach/detectors/habit.ts`. Its twelve-week model does not equal two eight-week windows. Feature 13 computes the latter separately.
- All new kinds use the existing opaque-kind/scalar-metrics wire envelope. No changes to proxy/src/types.ts, handler.ts, raw-body privacy rules or grounding tolerance are authorized.

## Path inventory for specs 1–3

All existing repo-root paths named in those specs were checked. The following list separates intentional new files/globs from absent references; short paths such as `bands.ts` resolve relative to the fully qualified owner identified in the same paragraph.

Existing: `docs/ARCHITECTURE.md`, `docs/COACH_BRAIN.md`, `proxy/src/handler.ts`, `proxy/src/types.ts`, `scripts/screenshot-gate.mjs`, `src/app/selectors.ts`, `src/brain/coach/backtest.ts`, `src/brain/coach/bands.ts`, `src/brain/coach/context.ts`, `src/brain/coach/contract.ts`, `src/brain/coach/detectors/notes.ts`, `src/brain/coach/detectors/readiness.ts`, `src/brain/coach/detectors/recovery.ts`, `src/brain/coach/explainer.ts`, `src/brain/coach/planners/shared.ts`, `src/brain/coach/preferences.ts`, `src/brain/coach/words.ts`, `src/brain/index.ts`, `src/brain/stats.ts`, `src/core/migrate.ts`, `src/core/models.ts`, `src/core/store.ts`, `src/data/muscles.ts`, `src/data/principles.json`, `src/slices/coach/apply.ts`, `src/slices/coach/preferences.ts`, `src/slices/today/Today.tsx`, `src/slices/workout/Train.tsx`, `src/slices/workout/session.ts`, `src/ui/primitives.tsx`, `tests/ask-scenarios.test.ts`, `tests/coach-apply.test.ts`, `tests/coach-fuzz.test.ts`, `tests/coach-readiness.test.ts`, `tests/coach-words.test.ts`, `tests/principles.test.ts`, `tests/splits.test.ts`.

Intentionally NEW or test glob: `src/brain/coach/verdict.ts`, `src/brain/live.ts`, `src/brain/readiness.ts`, `src/slices/today/ReadinessVerdict.tsx`, `tests/**/*.test.ts`, `tests/live-rest.test.ts`, `tests/live-substitutes.test.ts`, `tests/readiness.test.ts`.

## Validation of this documentation commit

App typecheck, all 374 app tests (30 files), proxy typecheck, 87 proxy tests (three files; eight tests in one existing skipped file), and production build passed on the unchanged application source. `git diff --check` and the documentation path/section/routing-score checks are run before commit. This validates the baseline and the documents; future feature behavior is not claimed as tested.

Local five-theme/live-browser verification is blocked: no Chromium executable is installed and Playwright's Chromium download was denied by the environment's network proxy. No browser gate is claimed as passed locally. The existing branch CI runs the five-theme visual/migration gate and Android gate on push; report the exact commit's eventual status to the owner. Future implementation agents must run the specific feature scenarios in addition to that generic gate.
