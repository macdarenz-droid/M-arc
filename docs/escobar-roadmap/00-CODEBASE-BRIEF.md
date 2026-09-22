# M/ARC codebase brief — ground truth for coach work

Produced by 8 parallel agents that read the real source. This is the shared
reference every downstream design/spec agent used. Trust it over memory, but
verify any specific line before editing it.

# M/ARC Coach — Shared Reference Brief

Repo root `/home/user/M-arc`. Preact + TypeScript + Vite PWA wrapped by Capacitor (Android), v37.0.0, Node 22. No ESLint/Prettier — style is convention.

## 1. Architecture

Two layers, one contract. **Layer 1, `src/brain/`**: pure, synchronous, dependency-free statistics. Every function takes plain data (`Session[]`, a `YYYY-MM-DD` local day key, an epoch-ms `now`) and returns plain data. `brain/` never imports `ui/`, `slices/`, `native/` or `core/store`. **Layer 2**: words. `src/brain/coach/words.ts` (453 non-blank lines) renders findings/proposals into copy offline; an optional Cloudflare Worker (`proxy/`, Claude Sonnet 5) rephrases the same report. Governing rule (docs/COACH_BRAIN.md): *the language model only writes; it never decides.*

**Privacy boundary**: only the trimmed `FindingsReport` leaves the device. `validateGrounding()` in `proxy/src/handler.ts` hard-refuses payloads containing `profile`, `name`, `email`, `bodyWeightKg`, `heightCm`, `sessions`, or findings carrying `evidence`/`sessionIds`. The single sanctioned body number is `bmi` (derived on device, bounded 0–200).

**Offline-first**: remote is OFF by default (`emptyCoach().remoteExplainer === false`). Everything in §2–§3 is free, instant, offline.

**State**: one localStorage key `marc.state.v1` + `.backup`, `version: 1` (a literal type — never bump it). `update(fn)` in `src/core/store.ts` must return a new object; `flushSave()` for anything you'd hate to lose. All loads stored in **kg**; conversion only at the render edge (`core/units.ts`). Day keys are LOCAL strings compared with string ops; weeks start **Monday** (`weekStart()`).

## 2. The free on-device signal palette

`src/brain/index.ts` barrels everything except `stats.ts` (import from `@/brain/stats`).

- **`exposure.ts`** — the shared muscle vocabulary. `ROLE_WEIGHT {primary:1, secondary:0.55, stabilizer:0.25}`, `EFFORT_MULT {easy:0.9, ideal:1, max:1.1}`, `SET_WEIGHT {primary:1, secondary:0.5, stabilizer:0}` (emphasis vs weekly effective sets use *different* weights — picking wrong contradicts the Body screen). `isWorkingSet(s)` = `reps>0 || durationSec>0 || distanceM>0` — the single definition of "this set counts". `sessionEmphasis()`, `toPercents()` (sums to exactly 100), `weeklyMuscleSets(sessions, today, weeks)` (index 0 = current week), `trainingLevels()` (7 tiers, New→Master).
- **`history.ts`** — `exerciseHistory(sessions, exerciseId, custom)` → oldest-first `ExerciseSessionSummary[]`: `topKg, topReps, bestReps, bestDurationSec, bestDistanceM, volume, bestE1rm, effortCoverage, avgEffort, hasMax, allEasy`. `modeOf()`, `daysSinceLast()`.
- **`progression.ts`** — `suggestNext(sessions, exerciseId, goal, today, plannedSets, custom)` → `{mode, target, kg, reps, reason, confidence, sets[]}` across 10 modes (start, reentry, confirm_effort, reduce, increase, confirm, reps, hold, duration, plateau). `previousSet()`, `loadStep()`, `repRange()`.
- **`trend.ts`** — `trend(points: {day,value}[])` → `{direction, slopePerWeek (relative fraction), confidence, points}`, needs ≥4 points. `plateauStatus(history)` over the last 8 (needs ≥7).
- **`prs.ts`** — 6 kinds (`heaviest, strength, reps_at_load, best_reps, best_duration, best_distance`), `recordsFor`, `allRecords`, `recordsInWeek`, `isLiveRecord`.
- **`recovery.ts`** — `recoveryStatus()` for all 24 muscles (`pct, hoursLeft, windowHours, personalized`), `recoveryTier()`, `muscleTouches()` (the `Touch` type is not exported), `personalWiden()` (1.0–1.4, widen only).
- **`balance.ts`** `trainingBalance()` (at most one imbalance), **`effort.ts`** `effortDrift()`, **`weekly.ts`** `weekSummary / weeklyVolumeHistory / trainingStreak / daysSinceLastSession`, **`bodyfat.ts`** `navyBodyFat()`, **`stats.ts`** `buildAskStats(ctx)` → `{version:1, recovery[24], prs[≤20], weeklyVolume[8], deload|null}`.

**Cost (measured, 400 sessions / 7,468 sets)**: per-exercise calls 0.3–0.4 ms (safe per render). `recoveryStatus` 13 ms, `trainingLevels` 9.5 ms, `muscleTouches` 7.8 ms → memoize. `allRecords`/`recordsInWeek`/`weekSummary` are **superlinear**: 2.8 ms @100 → 21 ms @400 → 116 ms @1000 — once per session-finish or per day, never per render.

**Shared memoization lives only in `src/app/selectors.ts`**: `today, nowMs/setTicking, nowMinute, unit, brainContext, askStats, recovery, week, streak, report, insights, spark, suggestions, todaySuggestion, deload, todayPlan, scheduledSplit, todayChanges, sessionsToday`. All `computed`, recomputed on any state change or the minute tick. New shared derived state goes here.

**Notable free-but-unused**: `avgEffort`, `WeekSummary.activeDays`, `Trend.slopePerWeek`, `Imbalance.weeks`, `plateauStatus` (never surfaced), `MuscleRecovery.personalized/windowHours` (Body sheet only), `MuscleMap` `roles` mode.

## 3. The Finding/Proposal contract

`src/brain/coach/contract.ts`, `CONTRACT_VERSION = 1`. **23 FINDING_KINDS**: volume_drop, volume_spike, weekly_sets_out_of_band, uncovered_muscle, plateau, decline, progressing, under_recovered, effort_missing, effort_drift_harder, effort_drift_easier, effort_mismatch, rep_range_mismatch, redundant_exercises, balance_imbalance, long_gap, habit_pattern, focus_behind, low_sleep_readiness, low_readiness, record, first_sessions, note_flag. **9 PROPOSAL_KINDS**: schedule, today_plan, exercise_swap, add_exercise, split_modify, split_new, load_next, rest_default, deload_week.

`Finding {id, kind, subject, metrics: Record<string, number|string|boolean>, window, confidence, severity 0-3, evidence, principles}` — **no prose, ever**. `Proposal` adds a `ProposalApply` discriminated union, `basedOn[]`, `dismissKey`. `finding(m)` (detectors/shared.ts) and `proposal(m)` (planners/shared.ts) are the *only* legal constructors — they derive `id` (`${kind}:${target}`) and `principles`.

`buildReport(ctx)` in `report.ts` computes `adjustedRecovery`, `learnHabits`, `usageProfile` (unguarded), then 19 detectors each in `safe(label, fn)`, drops `confidence==='low'` unless the kind is in `LOW_OK`, then runs planners in fixed order (planToday first, threaded into planLoad). Filters: `dismissed[key] < 2`, `ACCEPT_COOLDOWN_DAYS` (today_plan 1, schedule 14, swap/add/split_modify/split_new 28, load_next 0, rest_default 60, deload_week 42). Thresholds live in `bands.ts` — never inline a number.

**Adding a FindingKind** (all required or typecheck/CI fails): kind in `FINDING_KINDS` + `PRINCIPLES_BY_FINDING`; a card in `src/data/principles.json` listing the kind **back** (tests/principles.test.ts); a detector under `detectors/`, exported from `detectors/index.ts`, registered in `report.ts`'s `raw` array inside `safe()`; `CATEGORY_OF` + a `case` in `wordsFor` (words.ts); a test; a row in the COACH_BRAIN.md detector table + a dated decisions-log line. **Adding a ProposalKind** additionally needs: `ProposalApply` member, `PRINCIPLES_BY_PROPOSAL`, `ACCEPT_COOLDOWN_DAYS`, `PROPOSAL_ORDER`, a `renderProposal` case, a case in `acceptProposal` (`src/slices/coach/apply.ts`), `KIND_LABEL` in `Coach.tsx` and in `coach/preferences.ts`. **The proxy needs no change** — it validates `kind` as an opaque string; only a new top-level *payload field* requires editing `onlyKeys` + `proxy/src/types.ts`.

## 4. Surfaces and primitives

Five tabs (`src/app/router.ts`: today | train | history | body | coach), `App.tsx` renders the tab, a global `<RestBanner/>`, the fixed nav, the Settings `Sheet` (`settingsOpen` signal, opened only from Today's gear) and a single-slot `<Toast>`.

- **Today** (`slices/today/Today.tsx`): topbar + streak chip, `ReadinessCheckIn` (3 × 1–5 Segmented), a `card-accent` hero in one of four states (live / done / ready / rest — `ready`/`rest` inline `todaySuggestion` with accept + "Why"), deload banner, "This week" (grid-3 Stats + 4 hardcoded grade strings), Recovery (compact MuscleMap + top-4), Coach section (`insights.value[0]`, read-only, + "N suggestions waiting"), Daily spark.
- **Coach** (`slices/coach/Coach.tsx`): deload banner, "Escobar, online" card (cached summary + Ask + "More from the coach"), Suggestions (accept / "Not now" / sheet), Insights (`shortlist(insights, 6, 2)`; `+N more` is a **dead label**), goal picker, Schedule editor, rotating `pickCue`, "How the coach thinks". `InsightSheet` shows the `.chain` (Noticed/Means/Do next), the `suggestNext` target, last 5 sessions, Evidence cards.
- **Train** — see §5. **History**: Segmented Log/Stats — month calendar, last 30 `SessionCard`s, `SessionEditor` (per-set edit + 280-char note + delete/Undo); Stats — week card with per-muscle bars vs last week, 12-week `WeeklyVolumeChart`, per-exercise `Sparkline` + trend, Records. **Body**: Segmented recovery/week/levels over `MuscleMap` + `MapLegend`, `MuscleDetail` sheet, `BodyFat`. **Settings**: theme, training, reminders, feedback, profile, health, the single "Coach online" toggle, data/backup/resets.

**Primitives** (`src/ui/primitives.tsx` — there is nothing else): `Thinking, Card, Button, Chip, Segmented, Toggle, Stat, Row, Bar, Ring, Sheet, Toast, Empty, Section, Field`. Plus `MuscleMap` (recovery/emphasis/roles), `Sparkline`, `renderChatBody`/`ChatInputRow` (`ui/chatRender.tsx`, `COACH_NAME = 'Escobar'`), ~35 icons. Classes: `.view .topbar .stack .row-between .grid-3 .card-accent .card-press .insight .suggestion .chain .banner .hint .num .set-grid .pr-badge`. Colors come only from theme tokens (`--accent, --positive, --warning, --negative, --info, --text-3`) — five themes.

## 5. Live logging (`src/slices/workout/Train.tsx`, 381 lines; `session.ts`, 197)

`Train()` switches on module signal `lastFinish` → `FinishScreen`, else `state.active` → `LiveSession`, else `Splits`. `startSession(split, changes)` maps `SplitExercise` to entries of **empty set objects** and applies accepted `CoachChange[]`.

`EntryCard` recomputes `applyDeload(suggestNext(...), deload.value, today.value)` **every render, unmemoized**. Per set row: `previousSet`, `next.sets[Math.min(j, len-1)]`, `isLiveRecord`. **Targets are HTML `placeholder` only** (Train.tsx:284–285) — `value` is strictly what the user typed. Only the reps and duration inputs carry `onBlur={() => commitSet(index, j)}`; **the kg input and the effort buttons never commit**. `commitSet` returns false unless `isWorkingSet`, else starts `startRest(restDefaultSec)` when `autoRest`, and fires `haptic.light()`. `addSet` copies the previous set's kg/reps but clears `effort`. `finishSession(saveTemplate)` drops skipped entries and non-working sets, sets `day` from the **finish** time, `flushSave()`, then `FinishScreen`: 3 stats, `MuscleMap` emphasis + top-5 chips, note field whose blur fires `/notes`.

Gaps: no in-session coach surface; no per-set timestamp, no rest-actually-taken, no per-set note, no RPE number, no warmup flag, no skip record, no distance input; `ActiveSession` has no field for a shown/dismissed hint; EntryCards are keyed `${exerciseId}-${i}` so local state resets on removal.

## 6. AI plumbing

`proxy/` = Worker "marc-coach", six POST routes via one `createHandler` + `GET /health`: `/explain`, `/tag-exercise`, `/notes`, `/ask`, `/identify-exercise`, `/import-programme`. All `claude-sonnet-5`; `EFFORT='medium'` except `ASK_EFFORT='high'`. `/ask` streams (`messages.stream().finalMessage()`), the rest use `messages.parse()` + `zodOutputFormat`. Proxy SDK timeouts: explain 55s, tag 40s, notes 40s, identify 45s, import 55s, ask 120s, all `maxRetries: 1`. Client timeouts (`postJson`, default 20s): explain 45s, ask 70s, notes/tag 35s, identify 40s, import 55s. `postJson` never throws.

Body caps: explain 24 KiB, tag 1 KiB, notes 2 KiB, ask 40 KiB, vision 1.5 MB. Payload limits: findings 24 (max 6/kind), proposals 16, cards 18, explain 12, preferences 6, question 300 chars, history 12 × 700.

**Ceilings**: live limit is the Cloudflare `[[ratelimits]]` RATE binding — **6 requests / 60 s per device, across all routes**. The daily quota (`MAX_DAILY_PER_DEVICE = 12`, `MAX_DAILY_TOTAL = 2000`) is **inert**: the `[[kv_namespaces]] QUOTA` block is commented out, so `checkQuota` returns ok immediately. If bound, the counter increments *before* the model call (a 502 still burns it) and is shared across all routes.

**Caching**: the only response cache is `/explain`'s — `explanationKey(payload)` double-FNV1a into localStorage `marc.coach.explanations`, 24 entries. Prompt caching marks only the system prefix `ephemeral` (5-min TTL): `/ask` ~11.4k tokens caches; explain (~590), notes (~550), tag (~780) are below the ~1024-token minimum and their markers are silent no-ops. `usage` and `remaining` are returned by every route and **read nowhere** in `src/`.

**Free vs paid**: everything in §2–§3 plus all of `words.ts` is free. A call is spent only on `/explain`, `/ask`, `/notes`, `/tag-exercise`, `/identify-exercise`, `/import-programme`. There is **no background call path, no scheduler, no batching, no streaming to the client, no idempotency key**, and no post-session payload shape (`sessions` is blocklisted).

## 7. Already proactive — do not re-propose

Readiness check-in; the `today_plan` suggestion inline on Today with accept + Why; deload proposal, banner and `applyDeload` rescaling of every target; the Suggestions inbox with accept/dismiss/snooze; Insights on Coach + top insight on Today; `dailySpark` (fires only for `record`/`progressing`); **next-weight/reps suggestion as placeholder text plus a one-line `reason`** in the split list and every live EntryCard; `Last: 60 kg × 8 · ideal`; the live PR badge; rest timer + `RestBanner` + rest-done notification (id 880001); smart training-day reminders (`resyncReminders`, ids 730000–819999, 56 days ahead, skipping trained days, `nudgeTime` = learned start − 60 min, floor 05:00); session-note flags via `/notes` feeding pain-aware planning; `computePreferenceFacts` (weekly).

Weak/dead: `low_sleep_readiness` needs `health.lastSync === today` and effectively never fires; `low_readiness` needs 2 low check-ins in 7 days; `load_next` proposals are computed then dropped everywhere; `expiresOn` is written and never read; severity 3 is never emitted; the post-session moment is analytically empty; no week-close trigger.

## 8. Hard constraints

**Grounding**: `allowedNumbers()`/`validateText()` (`brain/coach/explainer.ts`) reject any sentence with a number not in the payload. `/ask` adds `askAllowedNumbers()` (numbers the person typed in the question or *user* turns only) and drops per-sentence via `sanitizePersonalAnswer()`, reporting `trimmed`. **No arithmetic on report numbers** — a figure must be its own field (why `StatsPr.value` exists beside `detail`). **Privacy**: §1 blocklist; every new payload field needs `onlyKeys` + a validator on both sides, optional with a safe fallback (proxy and app deploy separately). **Nothing changes until tapped**: `src/slices/coach/apply.ts` is the only mutation point; the model must phrase changes as still-pending. Dismiss = snooze 3 days; two dismissals suppress permanently. **Non-goals**: no injury prediction or diagnosis, no individualized medical guidance, no on-device LLM, deloads signal-driven never calendar-driven, recovery windows widen only (factors combined by max, cap 1.5), ≤2 swaps per report, volume is never a record. **Evidence gates are the design** — return `unknown`/null rather than lower one. **Quality bar**: `npm run check` (tsc --noEmit + 30 vitest files / 374 tests + build), `npm --prefix proxy run check` (87 tests), `npm run gate` (Playwright, 5 themes, fails on any console error), `npm run backtest`. tsconfig is `strict` + `noUncheckedIndexedAccess`. Tests are node-environment, `tests/**/*.test.ts` only — **no component tests**; build fixtures from `tests/helpers.ts` and `tests/coach-helpers.ts` (`ctx()`, `TODAY='2026-09-19'`). Every substantive change appends a dated row to the COACH_BRAIN.md decisions log ending in the deploy consequence.
