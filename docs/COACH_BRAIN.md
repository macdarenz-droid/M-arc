# The coach brain

M/ARC's coaching intelligence is two layers with one contract between
them. Layer 1 runs on the phone, offline, and produces facts and suggested
actions as structured data. Layer 2 turns that data into plain, warm
English, offline from templates and, when the user opts in, through a
small hosted language model. Every claim either layer makes traces back to
a card in `docs/RESEARCH.md`.

```
 sessions[] (marc.state.v1)
        │
        ▼
 ┌──────────────────────── Layer 1: brain (pure TypeScript, on device) ────────────────────────┐
 │  detectors ──► findings      (facts: numbers, window, evidence, confidence, principle refs)  │
 │  planners  ──► proposals     (actions: schedule, today's plan, swaps, splits, load, deload)  │
 └────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                              │  FindingsReport (JSON, versioned)
                                              ▼
 ┌──────────────────────── Layer 2: coach (words) ──────────────────────────────────────────────┐
 │  templates (always, offline, instant)   │   remote explainer (opt-in, event-driven, cached)  │
 │  notifications / nudges (templates only)│   Claude Sonnet 5 behind a Cloudflare Worker        │
 └─────────────────────────────────────────┴────────────────────────────────────────────────────┘
                                              │
                                              ▼
                       Coach screen · Today card · Suggestions inbox · local notifications
```

## Why this shape

- **Layer 1 is statistics, not a trained model.** One user has a few
  hundred sessions and no labels. Deterministic statistics with evidence
  gates are more accurate here than anything learned, run in milliseconds,
  are unit-testable, and explain themselves. Nothing to download.
- **The language model only writes; it never decides.** Detection and
  planning stay deterministic so plans can be tested for correctness
  (every muscle covered, no muscle over the band, focus muscles hit twice)
  and so the app works fully offline. A model that designed plans would
  invent exercises and produce set counts that don't add up.
- **Only the report leaves the device.** Never raw sets, never identity.
  That keeps tokens tiny and privacy simple.
- **Suggest, never control.** Every proposal goes through an inbox the
  user accepts or dismisses. Accepting writes state through the normal
  `update()` path. Nothing changes on its own.

## What already existed

v37 shipped most of Layer 1 in `src/brain/`: role-weighted muscle
exposure, recovery windows by effort with personal widening,
recency-weighted trend regression, plateau detection over eight sessions,
double-progression load suggestions, push/pull and upper/lower balance,
effort drift, weekly summaries and records, with 39 tests. The one
structural problem was `coach/rules.ts`, which mixed fact detection and
English prose in the same objects. This work cuts that seam: rules emit
findings, and words are produced elsewhere.

## Layer 1: detectors

Each detector is a pure function over `Session[]` plus context, and emits
zero or more `Finding` objects. A finding carries a `kind`, a `subject`
(exercise, muscle, muscle group or split), `metrics` (numbers only),
a `window`, `evidence` (session ids and days), a `confidence`, a
`severity` and the `principles` it rests on. Detectors only speak when they
clear a minimum-evidence gate. Kinds and the principles they may cite are
enumerated in `src/brain/coach/contract.ts`.

| Kind | What it measures | Gate |
|---|---|---|
| `volume_drop`, `volume_spike` | Effective sets for a muscle group over the last 3 weeks against the trailing 8-week median | ≥ 6 weeks of data, ≥ 3 active weeks in baseline |
| `weekly_sets_out_of_band` | Weekly effective sets far outside a wide band | ≥ 3 consecutive weeks |
| `uncovered_muscle` | A major muscle under 2 effective sets a week for 4 complete weeks (secondary work counts half, so one compound's spill-over does not clear it) | ≥ 3 active weeks of 4 |
| `plateau`, `decline`, `progressing` | Existing trend and plateau logic, exposed as facts; a plateau also needs a flat tail of at least 1.5× this person's usual gap between improvements, never under 4 sessions | 7 of last 8 sessions |
| `under_recovered` | Recovery window by effort, scaled by volume vs. baseline, widened by history | Any |
| `effort_missing`, `effort_drift_*`, `effort_mismatch`, `rep_range_mismatch` | Effort coverage, drift, and fit to the goal's bands | Existing gates |
| `redundant_exercises` | Same primary muscle and pattern twice in one split | Any |
| `balance_imbalance` | Existing balance logic | Existing gates |
| `long_gap` | Days since last session | ≥ 7 days |
| `habit_pattern` | Per-weekday training probability and typical start time, recency-weighted over 10–12 weeks; a habitual day retires after three complete cold weeks | ≥ 6 weeks, probability ≥ 0.6 |
| `low_sleep_readiness` | Health Connect sleep below the user's own norm | Sleep data present |
| `record`, `first_sessions` | Records; baseline state with too little data | — |

## Layer 1: planners

Planners take findings plus state and emit `Proposal` objects. A proposal
carries a `kind`, an `apply` payload the app can write directly, the
finding ids it rests on, `principles`, `confidence` and a `dismissKey`.

- **`schedule`** from `habit_pattern`: "you usually train Wed and Thu
  around 6 pm". Accepting fills the existing `schedule` map and drives the
  existing reminder scheduler. An opt-in smart-reminders mode times the
  nudge from the learned start time, about an hour before.
- **`today_plan`**: scores every split for today from per-muscle recovery,
  the schedule, weekly sets vs. baseline and focus targets. Offers a swap
  or a modified version of the scheduled split, listing exercises to drop
  or replace and replacements from the same movement pattern.
- **`exercise_swap`** for a plateaued lift, from the same pattern, at most
  two per report with compound lifts first. When most lifts stall at once
  the problem is the programme, and swapping everything is bad coaching.
- **`add_exercise`** for an uncovered muscle or a balance gap, placed in
  the split with the most same-bucket work and never duplicating a
  muscle-and-pattern pair already in that split.
- **`split_modify`** for redundancy, balance or focus.
- **`split_new`**: a deterministic constraint solver. Inputs: goal, days per
  week (learned or chosen), focus muscles, equipment actually logged,
  exercises actually used. Structure by day count, fill by movement pattern
  so every major muscle is covered, weekly effective sets per muscle inside
  the band, focus muscles get extra sets over ≥ 2 days, ≥ 2 days between
  direct hits of the same muscle, prefer what the user already uses. The
  payload reports per-muscle weekly totals as facts.
- **`load_next`**: the existing progression suggestion, as a proposal.
- **`rest_default`**: two to three minutes on compounds for a strength goal.
- **`deload_week`**: only when several lifts decline together and effort at
  the same load rises. Never by calendar.

## The contract

`src/brain/coach/contract.ts` defines `FindingsReport`, `Finding`,
`Proposal` and the kind enumerations, plus `PRINCIPLES_BY_FINDING` and
`PRINCIPLES_BY_PROPOSAL`, which say which cards each kind may cite. A test
asserts every referenced principle exists and every kind has at least one.
The report is versioned. `dataQuality` says how much history there is and
whether the brain considers it insufficient.

## Layer 2: templates

`src/brain/coach/templates.ts` (Phase 2) maps each kind to a few sentence
variants in the app's existing voice: what we noticed, what it means, what
to do. Numbers are filled from `metrics`. Variants rotate deterministically
so the same finding does not read identically twice. Every notification
body comes from here, because nudges are scheduled ahead of time with no
network.

## Layer 2: remote explainer

Opt-in. Model: Claude Sonnet 5, configured as a string, with Opus 5 as
the documented upgrade if a route ever needs more. It receives the report, the user's goal and unit,
and only the principle cards the report's kinds may cite. The system prompt
forbids introducing any number not present in the report. A validator
rejects any reply containing a number absent from the report or the cards
and falls back to the template text.

Triggers: a session finishing with a changed findings set, the weekly
review, or the user opening a proposal or tapping "explain more". Never on
screen refresh. Replies are cached by a hash of the report content. The
key lives in a Cloudflare Worker with a per-device daily cap; the app never
holds it.

| Model | Per explanation | Per user per year at ~4 calls/week |
|---|---|---|
| Haiku 4.5 | ≈ $0.003 | ≈ $0.60 |
| Sonnet 5 (in use) | ≈ $0.006 | ≈ $1.30 |
| Opus 5 | ≈ $0.016 | ≈ $3.30 |

Estimates for ~1,900 input and ~250 output tokens before prompt caching,
at September 2026 list prices. Caching lowers the system-prompt portion by
about 90 percent once the prefix exceeds the model's minimum cacheable size.

## Nudges and platform limits

Android does not run the app's JavaScript in the background. The app
already schedules local notifications eight weeks ahead on every open. The
learned schedule plugs into that mechanism, rescheduled on each app open
and session finish; today's nudge is cancelled when a session is logged.
On the web PWA there is no background scheduling without a push server, so
the browser shows the nudge in-app on open only.

Rules, from `habit_formation_and_cues`: at most one nudge a day, none on a
day already trained, a habit day that goes cold three weeks running is
retired quietly, one tap turns nudges off, and copy never shames a broken
streak. Smart reminders stay off until the user accepts a learned schedule.

## Suggestions inbox

A list of open proposals with accept and dismiss. Accept applies the
payload through `update()`. Dismissing the same `dismissKey` twice
suppresses that proposal kind for that subject until the underlying
findings change materially. Dismissals are stored in state.

## Privacy

Layer 1 never leaves the device. The remote explainer receives the report
and principle cards only: exercise names, muscle names, numbers, dates. No
profile name, no body measurements, no raw sets. The user can read exactly
what would be sent before turning the remote explainer on.

## Backtesting

`scripts/backtest.ts` (Phase 4) replays detectors day by day over a history
and reports when each finding would have fired. On the user's own history
it checks that plateau findings precede real stalls and that
under-recovered findings precede weaker sessions. This is calibration on
one person, not proof, and the report says so. Synthetic histories cover
the cases a single history cannot.

## Phases

0. Research file, principle cards, this document, the contract. **Done.**
1. Detectors and planners in `src/brain/coach/` (`detectors/`, `planners/`,
   `report.ts`, `bands.ts`, `context.ts`), additive alongside the existing
   rules, 43 new tests. **Done.** A full report over two years of history
   (312 sessions) takes about 36 ms on a desktop CPU, so a few times that
   on a phone; it is meant to run on app open and session finish, not on
   every render. The old `coach/rules.ts` is retired in Phase 2 when the
   screens read from the report.
2. Template renderer (`words.ts`), Coach and Today screens reading from
   the report, the suggestions inbox with accept and dismiss
   (`slices/coach/apply.ts`), one-day plans that swap exercises for a
   single session, an accepted easier week that scales Train targets,
   learned-schedule nudges through the existing reminder scheduler, and
   the old `coach/rules.ts` retired. **Done.** Every insight and
   suggestion shows the research cards it rests on with their rating.
   Verified with the five-theme visual gate.
3. Cloudflare Worker proxy (`proxy/`), the app-side explainer
   (`brain/coach/explainer.ts`, `slices/coach/remote.ts`) with the number
   validator and a content-keyed cache, and the opt-in in Settings with a
   preview of exactly what is sent and a connection check. **Done.** The
   proxy validates shape and size, refuses anything personal, rate-limits
   per device (six a minute) and, with a KV namespace, caps per device and
   in total per day. It calls the model (Sonnet 5, see the decisions log)
   through the official SDK with a cached fixed system prompt and a JSON
   schema for the reply. Deploy
   steps are in `proxy/README.md`. A live test runs only when
   `ANTHROPIC_API_KEY` or `MARC_ANTHROPIC_KEY` is present in the
   environment; cloud sessions reserve the former name, so deploys from
   them use the latter (see `proxy/README.md`).
4. Backtest harness (`brain/coach/backtest.ts`, `npm run backtest`).
   Replays the report day by day over a history and reports first fires,
   noise, proposal churn, the recovery check and the habit check. On the
   synthetic thirty-week history with ten planted events (two plateaus,
   a chest volume drop, effort drift, two declines, the easier-week
   proposal, and a habit learned, retired and relearned) every event fires
   inside its window and nothing fires on the steady lifts; that run is a
   unit test and its report is `docs/BACKTEST.md`. **Done for synthetic.**
   The same command takes a real backup from Settings → Export backup,
   which is where the recovery check becomes meaningful.
5. Expanding remote AI beyond the coach explainer, one narrow feature at a
   time, each grounded the same way. Shared client machinery lives in
   `src/ai/` (`client.ts`: device id, endpoint, a `postJson` that never
   throws); each feature gets its own payload builder and reply validator
   there. The proxy gained a generic multi-route `createHandler` in
   `handler.ts` (CORS, rate limit and quota shared once, a route is a
   path, a body cap, a validator and a call), so `/tag-exercise` and
   `/notes` sit alongside `/explain` in one Worker, each with its own
   fixed system prompt (`promptTag.ts`, `promptNotes.ts`) and its own
   structured-output schema. **5a done:** custom-exercise auto-tag
   (`ExercisePicker.tsx`'s "Suggest" button fills equipment, mode and
   muscles from a name, honestly marked "low" confidence when the model
   itself is not sure, always editable before saving) and session notes
   (`Train.tsx`'s finish screen and `History.tsx`'s session editor; a note
   is tagged into flags — pain or discomfort, an equipment issue, fatigue,
   a schedule note, a form check, or good news — never a diagnosis, never
   a cause, never a severity). A new deterministic finding, `note_flag`,
   recalls a flag for up to a week so the coach can mention it without a
   second remote call; `docs/RESEARCH.md` P19 grounds why self-report is
   worth tracking and why one reading alone is not. Queued next: a
   personal daily spark and a weekly review (reuse the `/explain`
   pattern), then ask-the-coach (needs Sonnet 5 and multi-turn payload
   design), then camera-based exercise identification and programme
   import from a photo (the highest-design-effort phases, since vision
   accuracy is genuinely limited — every result there must stay a
   suggestion with alternates, never a silent write).

## Decisions log

| Date | Decision |
|---|---|
| 2026-09-19 | Detection layer is deterministic statistics extending `src/brain/`, not a trained model. |
| 2026-09-19 | Language model never designs plans; it explains deterministic output. |
| 2026-09-19 | Remote model: Claude Haiku 4.5, Sonnet 5 as upgrade path. Key held only in a Cloudflare Worker. |
| 2026-09-19 | Smart reminders default off until a learned schedule is accepted. |
| 2026-09-19 | Deloads are signal-driven, never calendar-driven (see `deload_evidence`). |
| 2026-09-19 | Citation verification via search-index records; re-verify against full text when the network allows. |
| 2026-09-19 | Detectors never shrink a recovery window; volume can only widen it, up to 1.5×. |
| 2026-09-19 | At most two exercise swaps per report; simultaneous plateaus are a programme signal. |
| 2026-09-19 | Today is excluded from habit denominators, since the session may still happen. |
| 2026-09-19 | One dismissal hides a suggestion for three days; a second suppresses it until the user resets coach memory in Settings. |
| 2026-09-19 | Accepted suggestions have per-kind cooldowns (an easier week: six weeks) so they do not re-propose themselves. |
| 2026-09-19 | Smart reminders turn on when a learned schedule is accepted and reminders are already enabled; never on their own. |
| 2026-09-19 | The remote explainer fires only on a tap, one call per report content, cached in the browser. Any line whose numbers are not in the report is dropped, and the app says how many were dropped. |
| 2026-09-19 | The proxy refuses payloads carrying sessions, profile fields or session ids, so a modified client cannot leak them through it. |
| 2026-09-19 | Backtest findings: a plateau needs a flat tail of 1.5× the person's usual gap between improvements (min 4 sessions); the volume baseline excludes weeks before the first session; a habitual day retires after three complete cold weeks; effort drift needs two of three newer sessions to move a level; records collapse to one finding per exercise per week; recovery no longer hides swap proposals. |
| 2026-09-19 | Exercise-name lookups are indexed once; a report on ninety sessions builds in about 50 ms instead of 5 s, and a test keeps it under 750 ms. |
| 2026-09-19 | Every remote-AI reply that classifies something (a muscle, a movement pattern, a note's kind) is checked against the app's own closed vocabulary on both sides: the proxy's structured-output schema rejects anything else, and the app re-validates independently rather than trusting the network. An unrecognised value is dropped, never shown as if it were real. |
| 2026-09-19 | A classification carries its own honest confidence ("high"/"low") from the model, never inferred by the app; "low" is surfaced to the person as a reason to double-check, not hidden. |
| 2026-09-19 | Session notes are tagged into a fixed set of flags (pain or discomfort, an equipment issue, fatigue, a schedule note, a form check, positive) and, for pain, at most one named muscle — never a diagnosis, a cause, or a severity. The `note_flag` finding only recalls what was tagged; the words layer states this limit in the copy itself. |
| 2026-09-19 | One shared AI connection (`src/ai/`, the existing "Coach online" toggle and URL) serves every remote feature, not one per feature, so there is one place to turn it off and one Worker to trust. |
| 2026-09-19 | New research claim added only with real citations found and checked the same way as the rest of `docs/RESEARCH.md` (P19, self-reported wellness monitoring): rated **moderate**, with the honest caveat that one reading alone is a weak signal. |
| 2026-09-19 | Every route moved from Haiku 4.5 to Sonnet 5, per user direction, evaluated on capability rather than cost: each route is a real judgment call (weaving several findings into one coherent paragraph; which muscles are truly secondary; pain versus ordinary fatigue), not pure pattern matching, and a closed-vocabulary schema only stops an invented answer, never a wrong one. No route was found to have a genuine capability reason to prefer Haiku; `DEFAULT_MODEL` in `proxy/src/anthropic.ts` is the single source of truth the health check reads from too, so the two can no longer drift apart. |
| 2026-09-19 | Found live: switching to Sonnet 5 without setting `output_config.effort` left it at its own default depth of thinking, unlike Haiku which never thinks at all — real requests exceeded the app's and the Worker's timeouts, burning real output tokens on calls that returned nothing. Every route now sets `effort: 'medium'` explicitly, with `max_tokens` and both the app-side and Worker-side timeouts raised to match. This is a reliability fix, not a cost cut: it also reduces spend, since a request that completes once costs less than one that thinks at length and still fails. |

## Non-goals

No injury prediction. No diet, calorie or supplement advice. No chat
interface in v1. No on-device language model in v1; the explainer
interface is pluggable if that changes.
