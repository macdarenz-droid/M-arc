# BUG-41: Exercise progress line, label and trend come from one series

```
id: BUG-41
model: claude-opus-5-5
base: main 49a28534
depends_on: none
build_prerequisites: none
merge_prerequisites: review passed; every check green on a head that contains the latest main; every lower-numbered item on the owner's checklist already merged (the supervisor checks this)
shared-file owners: scripts/screenshot-gate.mjs is shared and add-only (this card adds one block named BUG-41); docs/COACHING-DECISIONS.md gets one new section appended; no other file in write_scope has an owner in AGENTS.md
```

## Outcome

On History > Stats > Exercise progress, the line, the metric label under it, and the Improving/Slipping/Steady/Early tile all come from one series. That series is one metric, drawn from the last 12 sessions. So the tile can never say "Improving" while the line falls, or "Slipping" while it rises. The line is drawn in the user's weight unit. Escobar's `trend` for the lift (which the card's Ask-about chip opens) uses the same series, so it agrees with the card.

- **Deliverable:** one PR.
- **Evidence:** the tests and gate probes under Acceptance. Each new one fails on 49a28534 and passes on the PR head.
- **Finish condition:** the PR is merged in a train, the APK is sent, and the owner checks it on his phone (see Verification).

## Owner report (2026-10-17, debug APK from main 49a2853)

"Chart quite confusing, says improving but chart showing down. Says slipping but chart rising."

- Rear Delt Fly: the line rises from 26 to 50.9, but the tile reads "Slipping · trend · some data".
- Dumbbell Lateral Raise: the line zig-zags between 6 and 10 and falls at the last point, but the tile reads "Improving · trend · plenty of data".

## Root cause (confirmed by an independent re-run)

1. **The line plots one thing.** It draws `progressValue` = `bestE1rm || topKg || bestReps` over `hist.slice(-12)` (History.tsx:544, progressTrend.ts:28).
2. **The tile judges another.** It judges `trend(hist.map(h => bestE1rm || volume))` over all history (progressTrend.ts:15).
3. **Each series mixes units from session to session.**
   - e1RM only counts sets of 10 reps or fewer (e1rm.ts:12-18, E1RM_MAX_REPS = 10).
   - A session done for 11-16 reps therefore has no e1RM. The tile then reads its volume (about 20-45 times bigger) and the line reads its top load.
   - Rear Delt: the tile series is 1170 1170 1170 858 1170 1248 858 48.5 50.9, which gives "down". The line is 26×6, 33, 48.5, 50.9.
   - Lateral: the tile series is 8.4×5 162 266 10 287 315 9.3 322, which gives "up". The line is 8.4×5 6 7 10 7 7 9.3 7. The 17 Oct value of 9.33 comes only from a tired 7×10 max set. The better 18 Oct session (7×15/15/16) has no e1RM, so it drops to its 7 kg top load.
4. **This breaks two existing rules.**
   - BR-04's own rule: e1RM is "never mixed with top load (a 12-rep light day has no e1RM)" (trend.ts:143; BUG-14 at COACHING-DECISIONS.md:434).
   - O4's "the same last 12 as the trend" (UI-POLISH-PLAN.md:687).
5. **The y labels** are the window's min and max, with one decimal and no unit (Sparkline.tsx:9,120-123). They are never converted to lb.
6. **The caption** "Estimated one-rep max" sits at the bottom of the card, and it is false for every top-load point.
7. **The same class of bug exists for assisted lifts** (checked on a prototype).
   - The tile judges `leastHelpKg` (AUD-8). The line plots `-topKg`, which is the most-assisted set.
   - Example: least help falls 20 to 6 kg while the back-off set rises 40 to 54 kg. The tile says "up" and the line falls from -40 to -54.
8. **Escobar mixes the same way.** `liftTrend`'s weighted path (trend.ts:65) is `bestE1rm || topKg` per session. On the lateral repro it returns "down", while the card would say "Improving".
9. **Introduced** by 1cc79431 (2026-09-18). It was kept by 46bd4203 (QA2-FC-1, owner default (a), FIX-GUIDE.md:117) and surfaced by 7168954f (I12 min/max labels).

## The rule (decision D-BUG41-1)

### Shared types (`src/brain/trend.ts`)

```ts
// src/brain/trend.ts (single source; slices import it)
export const LIFT_TREND_SESSIONS = 12; // liftTrend's existing slice(-12), named; O4's "same last 12". Not a new number.
export type ProgressMetric = 'e1rm' | 'top' | 'volume' | 'distance' | 'assist' | 'reps' | 'hold';
export interface ProgressSeries { metric: ProgressMetric; rows: ExerciseSessionSummary[]; values: number[]; trend: Trend }
export function progressSeries(history: ExerciseSessionSummary[], mode: ResistanceMode = 'weighted'): ProgressSeries;
export function liftTrend(history, mode = 'weighted'): Trend { return progressSeries(history, mode).trend; }
```

### How `progressSeries` picks

It works on `recent = history.slice(-LIFT_TREND_SESSIONS)`.

- **bodyweight:** metric 'reps'. The values are `bestReps`. The trend is exactly today's `liftTrend`.
- **duration:** metric 'hold'. The values are `bestDurationSec`. The trend is exactly today's `liftTrend`.
- **assisted:** today's `liftTrend` decision stays exactly as it is. Only the plotted values change, to follow that decision:
  - When the help trend (`leastHelpKg`, zeroOk) is up or down: metric 'assist'. The values are `-leastHelpKg`, with the inverted trend.
  - When reps is 'unknown' and help is 'flat': metric 'assist', with the help trend.
  - Otherwise: metric 'reps'. The values are `bestReps`, with the reps trend.
- **conditioning, when any recent session has `bestDistanceM > 0` (D-AUD11-4):** metric 'distance'. The rows are the sessions with a distance.
- **weighted, and conditioning with no distance:**
  1. If every recent session has `bestE1rm > 0`: 'e1rm'.
  2. Else, if any session has `topKg > 0`: 'top' (the rows with `topKg > 0`). When top load's direction is neither up nor down, and the volume series (the rows with `volume > 0`) is 'up', use 'volume' instead. This is BR-04's tie rule: volume decides only upward (trend.ts:143-151, :201).
  3. Else: 'reps' (`bestReps`).
- **For every metric except 'assist':** `values` holds only values above 0, and `trend` is exactly `trend(rows.map((h, i) => ({ day: h.day, value: values[i] })))`.

### What does not change

No threshold or constant changes:
- E1RM_MAX_REPS
- Epley+RIR
- `trend()`'s 4 points and its flat band under 1% a week
- confidence at 12 and 7 points (DATA_LABEL, AUD-20/SCI-11)

### Why not the alternatives

- **Not BR-04's E1RM_MIN_SESSIONS=4 pick.** It drops the latest session whenever that session is over 10 reps. On the lateral repro the line would end on 17 Oct with a dip from 10 to 9.3, and 18 Oct would be missing while the header shows 18 Oct.
- **No explanatory text.** It is rejected under the owner's copy rules.

## Pinned behaviour to keep (never edit these tests or blocks)

### Tests

- `tests/progress-trend.test.ts` (QA2-FC-1, UI-11, and the QA2-FC-1 follow-up):
  - bench 80+2.5i × 5 reads 'up';
  - 20 kg × 12-15 reps reads 'up' (top load is flat and volume rises, so volume decides);
  - `progressValue` keeps returning [20,40,60,80] for carries and a rising line for assisted;
  - the `progressHint(mode)` regexes still match.

  So `progressValue` stays exported and unchanged (the app stops using it), and `progressHint`'s second argument defaults to the mode's metric.
- `tests/trend.test.ts` (QA2-FC-4), `tests/aud-8.test.ts:69`, and `tests/bug18.test.ts:60` (`liftTrend` 'flat' with a held spike; all its sessions have an e1RM, so the result is unchanged).

### Gate blocks that read `[data-palace="history.exercise-stats"]` (lines are at main 49a28534)

| Block | Lines | What it checks | Seeds | Effect of this card |
|---|---|---|---|---|
| BUG-12 | ~613-700 | min/max labels never cover the end dot | 10 sets × 10 reps | all e1RM, unchanged |
| QA6-2 | ~765-812 | recent-session rows | | rows list untouched |
| I12 | ~866 | `.sparkline circle:last-of-type` | | unchanged |
| QA13-4 | ~943-995 | min/max labels within 3 px of the plotted extremes | 5-rep sets | unchanged |
| QA13-5 | ~1075 | card background | | unchanged |
| A6/QA14-1 | ~1165-1340 | scrub readout | 5-rep sets | unchanged |
| AUD-11 | ~4841-4879 | plank hold readout | | duration path unchanged |
| A2 dock | ~5887 | dock over the card | | unchanged |

No test or gate block pins "Improving", "Slipping", "Steady", "Early", "trend ·", "Estimated one-rep max", or the caption's position. No pinned block blocks this fix, so the card is `ready`.

## read_first

- AGENTS.md
- .claude/skills/builder/SKILL.md and gotchas.md
- .claude/rules/shared-files.md
- src/slices/history/History.tsx:494-566
- src/slices/history/progressTrend.ts
- src/brain/trend.ts:1-65, :136-151, :198-203
- src/brain/e1rm.ts:8-18
- src/brain/history.ts:38,66,85
- src/ui/Sparkline.tsx:9,96-99,120-123
- src/escobar/tools/read.ts:195-205 and show.ts:71-80 (read only)
- docs/COACHING-DECISIONS.md:434 (BUG-14), :1695 (D-AUD11-4), the AUD-20 section (~1972)
- docs/qa/FIX-GUIDE.md:117-131,186-190
- docs/REMEDIATION-PROGRESS.md:512
- docs/UI-POLISH-PLAN.md:675-690 (O4)
- the gate blocks listed above

## write_scope

- `src/brain/trend.ts`: add `LIFT_TREND_SESSIONS`, `ProgressMetric`, `ProgressSeries` and `progressSeries`. `liftTrend` delegates to it. Update its doc comment.
- `src/slices/history/progressTrend.ts`:
  - `progressTrend` = `progressSeries(...).trend`, re-exported for History;
  - `progressHint(mode, metric = MODE_METRIC[mode])`;
  - `progressValue` unchanged.
- `src/slices/history/History.tsx`, the Stats exercise card only:
  - `const series = progressSeries(hist, mode); const t = series.trend;`
  - The Sparkline gets `series.values` (through `kgToDisplay(v, u)` for 'e1rm', 'top', 'volume' and 'assist') and `dates={series.rows.map(h => h.day)}`. It renders only when `series.rows.length >= 2`. The tiles, bars and rows still render when `hist.length >= 2`.
  - The readout (`sparkIdx`, `sparkSession`), `effortSplit`, `effortUsesSets`, the "Most work" line and the selected-bar hint all index `series.rows` instead of `hist12`. Remove `hist12` if nothing else uses it.
  - The metric label `<p class="hint">{progressHint(mode, series.metric)}</p>` moves to directly after `<Sparkline>`. The bottom caption is removed, so the card has exactly one.
- `tests/bug-41-progress-trend.test.ts` (new).
- `scripts/screenshot-gate.mjs`: one new block named BUG-41, add-only.
- `docs/COACHING-DECISIONS.md`: append a section named "BUG-41: Exercise progress line and trend use one series (2026-10-17)".

### Hint text, per metric

| Metric | Hint |
|---|---|
| e1rm | Estimated one-rep max |
| top | Top load |
| volume | Volume |
| distance | Farthest distance |
| assist | Less assistance |
| reps | Best reps |
| hold | Longest hold |

## reserved_paths (never change)

- `src/escobar/**` (#193 edits read.ts)
- `src/ui/Sparkline.tsx`, `src/ui/EffortBars.tsx`, `src/ui/styles.css`
- `src/brain/history.ts`, `src/brain/e1rm.ts`
- `src/core/models.ts`, `src/core/store.ts`, migrations
- every existing test file, including `tests/progress-trend.test.ts`, `tests/trend.test.ts`, `tests/bug18.test.ts`, `tests/aud-8.test.ts`
- other tasks' gate blocks, and `tests/theme.test.ts`
- `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, `Settings.tsx`
- `package.json`, `package-lock.json`
- `.github/**`, `src/app/App.tsx`, `src/main.tsx`, `escobar-worker/**`

## Test data (the owner's rows and bar totals; unseen sessions reconstructed to give his bars, y labels and tiles)

Write `s(kg, reps, effort = 'ideal')`. "x3" means three identical sets. Each session is built with `session(day, [{ id, sets }])` from `tests/helpers`, then `exerciseHistory`.

### REAR_DELT (`lib_rear_delt_fly`)

| Day | Sets |
|---|---|
| 2026-08-23 | 26×15 x3 |
| 2026-08-30 | 26×15 x3 |
| 2026-09-06 | 26×15 x3 |
| 2026-09-23 | 26×11 x3 |
| 2026-09-28 | 26×15 x3 |
| 2026-10-04 | 26×16 x3 |
| 2026-10-06 | 33×12, 33×14 |
| 2026-10-11 | 35.5×9, 35.5×9, 35.5×9 max |
| 2026-10-18 | 35.5×10 easy, 35.5×10, 35.5×10 max |

### LATERAL (`lib_dumbbell_lateral_raise`)

| Day | Sets |
|---|---|
| 2026-09-23, 09-25, 09-27, 09-29, 10-01 | 6×10 x3 each |
| 2026-10-04 | 6×14, 6×13 |
| 2026-10-06 | 7×13, 7×13, 7×12 |
| 2026-10-09 | 7×12, 7×11, 7×10 easy |
| 2026-10-11 | 7×14, 7×14, 7×13 |
| 2026-10-13 | 7×15 x3 |
| 2026-10-17 | 7×15, 7×10 max |
| 2026-10-18 | 7×15 easy, 7×15, 7×16 max |

### Check on main first

On main these give:
- tiles 'down'/medium and 'up'/high;
- lines 26 … 50.9 and 8.4 … 9.3 7;
- volumes 1170 1170 1170 858 1170 1248 858 959 1065 and …162 266 231 287 315 175 322.

## Acceptance (each criterion maps to its evidence; new ones fail on 49a28534)

### BUG41-A1: Rear Delt

`progressSeries(REAR_DELT, 'weighted')`:
- metric is 'top';
- values are [26,26,26,26,26,26,33,35.5,35.5];
- trend is 'up' with confidence 'medium';
- `progressTrend` is not 'down'.

On main, `progressTrend` is 'down'.

### BUG41-A2: Lateral

- Metric is 'top'.
- The last row is 2026-10-18, and its value (7) is at least the previous value.
- Trend is 'up' with confidence 'high'.

On main the drawn line ends 9.33 then 7.

### BUG41-A3: one series, every mode

Fixtures:
- weighted, all ≤10 reps;
- weighted, mixed;
- weighted, all >10 reps;
- weighted, all 0 kg;
- conditioning with distance in every session, and in some sessions;
- conditioning with no distance;
- bodyweight;
- duration;
- assisted.

For each fixture except assisted, `series.trend` deep-equals `trend()` of exactly `rows`/`values`, and every value is above 0.

### BUG41-A4: assisted

- Least help falls 20 to 6 kg while the back-off rises 40 to 54 kg: metric 'assist', the values rise strictly, the trend is 'up'. On main the line falls.
- Least help is flat and reps rise: metric 'reps', the values are `bestReps`, the trend is 'up'.

### BUG41-A5: window

- A 15-session history: `series.rows` is the last 12, provided each of them has the metric.
- A 15-session history whose first 3 sessions differ: the trend ignores them.

### BUG41-A6: Escobar agrees

- `liftTrend(h, mode)` deep-equals `progressSeries(h, mode).trend` for every A3 fixture.
- `liftTrend(LATERAL, 'weighted').direction` is 'up'. On main it is 'down'.
- `liftTrend(REAR_DELT)` is 'up'.

### BUG41-A7: label names the plotted metric

- `progressHint(mode, metric)` returns each hint in the write_scope table.
- 'Estimated one-rep max' appears only for 'e1rm'.
- The existing `progressHint(mode)` regexes stay green.

### BUG41-A8: kept behaviour

`tests/progress-trend.test.ts`, `tests/trend.test.ts`, `tests/aud-8.test.ts` and `tests/bug18.test.ts` pass unchanged.

### BUG41-A9: known costs, pinned as decided behaviour (verified on the prototype; record them in D-BUG41-2)

- **C1:** 10 weekly 100×8 x3, then 105×3 x3, then 50×15 x3. Metric 'top', trend 'down'.
- **C2:** 11 weekly sessions of x3 at (100 + 2.5i)×5, then 60×12 x3. Metric 'volume', trend 'up'; the last value (2160) is the highest.
- **C3:** 8 weekly sessions of 20 kg × (15 - floor(i/2)) x3. Metric 'top', trend 'flat'. Main gives 'down'; this matches BR-04's 'plateaued'.

### BUG41-A10: failure path

- A conditioning lift with 3 sessions and a distance in only one has `series.rows.length` 1.
- The card draws no `svg.sparkline path`, raises no page error, and still shows the tiles, bars and rows.

Evidence: a unit test plus the gate (A11).

### BUG41-A11: gate block BUG-41, at 390 px, silent-black

Seed REAR_DELT and LATERAL (offsets from today, same order and gaps), plus the A10 conditioning lift.

- **Rear Delt:**
  - the tile reads 'Improving';
  - the element directly after `.sparkline-wrap` has the text 'Top load', and the card holds exactly one hint with the metric label;
  - the max y label is '35.5' and the readout contains '35.5 kg × 10';
  - the last path point is the highest plotted point.
- **Lateral:**
  - the tile reads 'Improving';
  - the last path point is the highest plotted point;
  - the number of line points equals the number of effort bars.
- **lb run (Rear Delt, `weightUnit: 'lb'`):** the max y label equals `kgToDisplay(35.5, 'lb')` formatted as Sparkline formats it (compute it; never hard-code a number).
- **A10 lift:** checked as A10 states.
- **Wrapper:** if, after merging origin/main, the gate wraps its blocks in `gate.runs('<ID>')` (GATE-SPLIT #194/#219, LIB-4a #232/#233/#237), wrap BUG-41 the same way and add the rows those rules require.

### BUG41-A12: decisions

`docs/COACHING-DECISIONS.md` gets three entries:
- **D-BUG41-1:** the rule above, why, and that it replaces QA2-FC-1's per-session mix while keeping its intent ("more reps at the same load reads Improving").
- **D-BUG41-2:** the known costs C1-C3 with their tests; why not E1RM_MIN_SESSIONS (the option B repro); that lighter-week sessions stay on the card while Escobar's evidence drops them (BUG-15).
- **D-BUG41-3:** what is not fixed here, for the supervisor to card:
  - the chart points of Escobar `show.ts:71` lift_trend still use `bestE1rm || topKg` per session;
  - the assisted y labels are negative numbers.

Evidence: reviewer reads.

## design_reference

- A prototype of the History/progressTrend half was run at 49a28534:
  - owner repro 3/3;
  - progress-trend 7/7;
  - full `npm test` 2900 pass.
- That prototype still plotted `-topKg` for assisted and kept the pick in the slice. This card moves the pick into `brain/trend.ts` and fixes the assisted values.
- Copy: hints are data labels of one to three words. No new explanatory text.

## connectivity

Pure computation, offline:
- no network;
- no new saved data;
- no new dependency;
- no change to `models.ts` or `store.ts`.

## verification

### Builder

- Prove each new test bites:
  - M1: revert `progressTrend` to `bestE1rm || volume` over all history. A1 and A6 go red.
  - M2: draw `progressValue` over `hist.slice(-12)` again. A11 goes red.
  - M3: use BR-04's ≥4 e1RM pick. A2 goes red.
  - M4: drop `kgToDisplay` on the line. The A11 lb run goes red.
  - M5: put `liftTrend`'s weighted path back to `bestE1rm || topKg`. A6 goes red.
  - M6: plot `-topKg` for assisted. A4 goes red.
  - M7: move the hint back to the bottom of the card. A11 goes red.
- Merge `origin/main`, then run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` on that exact head.

### Owner, on the debug APK

Device check, described in phone_check.

## risk_and_recovery

- **R1: Escobar's `trend` changes.** It changes for weighted lifts with mixed sessions, and for conditioning, which now keys off distance (read.ts:203, show.ts:79). This is intended.
  - If any Escobar or other existing test pins the old value, do not edit it. Stop and tell the supervisor, with the test name and the old and new values.
- **R2: #193 edits `src/escobar/tools/read.ts`.** There is no file overlap. The second of the two PRs to merge re-runs `tests/escobar` on the merged head.
- **R3: PR #3 and #1 file lists.** PR #3 (the watch agent's draft, base escobar-v2) and stale #1 list History.tsx, progressTrend.ts and brain/trend.ts as base drift. Agents never merge #3. Ignore both.
- **R4: the gate wrapper may change.** GATE-SPLIT or LIB-4a may land first and change the gate's block wrapper; follow A11's last bullet.
- **R5: the owner's earlier sessions are reconstructed.** If all of his window's sessions have a set of 10 reps or fewer, the card draws e1RM instead. The tile and the line still agree; the phone check confirms.
- **R6: trade-offs.** C1-C3 are accepted trade-offs and are recorded.
- **Recovery:** one PR with no data migration. Reverting it restores main's behaviour.
- **Stop rule:** after two failed tries of the same approach with no new evidence, stop and tell the supervisor.

## return

- PR URL and head commit;
- the HANDOFF block;
- each criterion ticked with its evidence;
- the M1-M7 mutation results;
- the gate run id on the merged head;
- "You will notice:" one line;
- open risks.