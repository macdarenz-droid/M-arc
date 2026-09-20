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
- **The one deliberate exception: designing a split by conversation.**
  "The language model only writes; it never decides" above still holds for
  the report, findings and every proposal Layer 1 produces. `/ask` (see
  the 2026-09-20 decision log entries below — first as a separate
  `/build-split` route, then merged into `/ask` itself) is the one place a
  person can ask the model to design or adjust a split directly, because
  the alternative — the model quietly refusing while a person keeps
  asking a chat to do exactly that — was worse than a narrow, guarded
  exception. Guarded means: a closed exercise vocabulary the schema itself
  enforces (never an invented id), and nothing is ever written to a real
  split until the person taps an explicit accept button on that turn's
  proposal — the same "suggest, never control" posture as everything
  else, just reached through a conversation instead of a detector.

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
| `low_readiness` | A pattern of low morning check-ins (sleep, soreness, stress; trimmed Hooper-style, 1–5 each) | Today's check-in is low, and at least one more of the trailing week's was too |
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
   worth tracking and why one reading alone is not. **5b done:** the
   personal daily spark on Today (`brain/coach/words.ts`'s `dailySpark`,
   the `spark` selector) — a true line about this person's own training,
   picked from a `record` or `progressing` finding, rotating
   deterministically by day among the real candidates. Built local and
   free, not remote: the plan had said "reuse the `/explain` pattern" for
   this, but it reuses `words.ts`'s already-rendered, already-grounded
   text directly instead, since it needs to appear on every open of Today
   — a remote call there would either break the existing "never spend a
   call on screen refresh" rule or need caching stale enough to defeat the
   word "daily". Falls back to the standing quote (`data/sparks.ts`) when
   there is nothing genuinely worth celebrating yet. A separate weekly
   review was also planned here, but the Coach screen's existing
   `/explain` summary already does that job — weaving the week's findings
   into one paragraph — so building a second endpoint for the same thing
   would only duplicate it; revisit only if the two need to diverge.
6. Ask-the-coach: a grounded multi-turn Q&A route, `/ask`, entered from a
   "Ask a question" button beside "More from the coach" on the Coach
   screen. **Done.** The Worker and app now share one `GroundingPayload`
   shape (`proxy/src/types.ts`, `explainer.ts`'s exported interface) that
   `/explain` and `/ask` both extend, so the report/cards validation and
   trimming logic is written once. The Worker holds no session state:
   `src/ai/ask.ts`'s `buildAskPayload` resends the whole exchange so far
   (capped at 12 turns, each trimmed) on every call, and
   `proxy/src/promptAsk.ts`'s `askMessages` reconstructs it as a real
   Anthropic `messages` array — the report as a genuine first user turn, a
   synthetic "Understood." assistant turn, then the real history and the
   new question. The system prompt refuses diet, supplement and medical
   questions, says plainly when the report does not cover something, and
   is held to the same number-grounding check as `/explain`: any answer
   using a number not in the payload is dropped rather than shown
   half-trusted. `AskSheet` in `Coach.tsx` keeps the conversation as plain
   component state — closing the sheet forgets it, nothing is persisted —
   and shows `<Thinking />` while a reply is in flight.
7. Camera-based exercise identification, the first of the two
   highest-design-effort phases (vision accuracy is genuinely limited, so
   every result here must stay a suggestion with alternates, never a
   silent write). **7a done:** "Scan a photo" beside "Suggest equipment and
   muscles" on the custom-exercise form (`ExercisePicker.tsx`). Capture and
   compression are plain web APIs (`src/native/photo.ts`: a hidden file
   input with `capture="environment"`, downscaled to at most 900px on the
   long side via canvas, re-encoded as JPEG, quality stepped down until it
   is comfortably small) — no new Capacitor plugin or permission, since the
   WebView already honours `capture` on Android. A new route,
   `/identify-exercise` (`proxy/src/promptIdentify.ts`,
   `IdentifySchema` in `anthropic.ts`), sends the photo as a real Anthropic
   image content block, classified against the same closed muscle/pattern/
   mode vocabularies as `/tag-exercise`, plus a `visible` boolean the
   schema always returns: false means the photo did not clearly show a
   real exercise or piece of gym equipment, and the app shows a plain
   "could not tell" message rather than prefilling the form from a guess.
   The prompt explicitly forbids describing a person's body, face or
   appearance if one is in frame — only the equipment or movement itself.
   `MAX_IDENTIFY_BODY_BYTES` (1.5 MB) is far above every other route's
   cap, since a photo is inherently bigger than anything else this Worker
   accepts; nothing about that photo is ever stored, on either side.
   **7b done:** programme import from a photo — "Import" beside "+ Split"
   on Train (also offered from the empty-splits state), for a whole
   written plan rather than one exercise: a gym handout, a whiteboard, a
   printed program. A new route, `/import-programme`
   (`proxy/src/promptImport.ts`), reads one photo and returns up to 7 days
   of up to 12 exercises each, every exercise classified the same
   closed-vocabulary way as `/identify-exercise` in the same call — no
   second round trip per exercise. It never reports a weight or load, only
   sets: this app tracks load from what a person actually lifts, not from
   an old plan. A `readable` boolean carries the same honesty pattern as
   `visible` in 7a. `ImportProgrammeSheet`
   (`slices/workout/ImportProgramme.tsx`) is the review-before-commit UI
   7a's plan called for: each day's name is editable, each exercise can be
   tapped out before committing, low-confidence entries say so, and a
   day becomes a real split only on an explicit "Add" tap — never
   automatically. Each exercise is matched against the library and saved
   custom exercises with the app's own existing `findExercise` lookup
   before anything new is created, so a plan that names exercises already
   in the library links to them instead of duplicating them.
8. Readiness check-in and preference memory, the two smallest-surface,
   highest-leverage pieces left on the roadmap. **Done.**
   **Readiness:** a 10-second morning check-in on Today (`slices/today/
   ReadinessCheckIn.tsx`), three taps — sleep, soreness, stress, each 1
   (worst) to 5 (best) — the trimmed, three-item version of Hooper and
   Mackinnon's validated wellness questionnaire (P19,
   `subjective_readiness_monitoring`; the original also asks fatigue
   separately, folded here into the same three taps to keep it to ten
   seconds). One entry a day (`AppState.readiness[]`), skippable, offered
   again next app open if skipped. It feeds the brain two separate ways,
   matching P19's own caveat that a single reading says little alone:
   `detectors/recovery.ts`'s `readinessFactor` widens *today's* recovery
   windows immediately from a single check-in, the same mechanism as the
   existing volume factor (the wider of the two wins; they are never
   multiplied, and the combined result still never exceeds
   `RECOVERY_VOLUME_FACTOR_MAX`) — a low morning is real information about
   right now, whether or not it turns out to be a pattern. A new finding,
   `low_readiness`, only speaks up once at least two of the trailing
   week's check-ins, today included, came back low, since one rough
   morning is exactly the weak, on-its-own signal P19 warns against
   over-reading.
   **Preference memory:** short, plain-word facts the coach infers from
   how this person has actually responded to its own suggestions —
   `brain/coach/preferences.ts`'s `computePreferenceFacts`, reading
   `CoachState.dismissed`/`accepted` (a kind dismissed twice for the same
   subject, or accepted for two different subjects, is a real preference;
   one dismissal is not) plus whether a learned schedule and smart
   reminders are on. This is durable state a `FindingsReport` cannot hold:
   a suggestion dismissed twice drops out of both findings and proposals,
   so without a separate memory the remote coach would have no way to
   know it ever happened, and would risk re-suggesting the same thing in
   different words. Recomputed at most weekly (`shouldRefreshPreferences`,
   checked on app open and session finish, never on a render) and cached
   in `CoachState.preferenceFacts`, so including it in `/explain` and
   `/ask`'s payload (a new, optional `preferences: string[]` field on
   `GroundingPayload`, capped at 6 entries) costs nothing extra and never
   itself triggers a call. Shown in Settings' existing "Preview what is
   sent".
9. Ask-the-coach, opened up. **Done.** Phase 6 shipped `/ask` as
   report-only Q&A that refused anything the report did not cover,
   including ordinary exercise-science and nutrition questions with
   nothing personal in them at all ("what is biceps", "how much creatine
   do people usually take") — found live: a real person asking those got
   "outside what the coach does" or a silently dropped answer, because
   the number-grounding check (built for personal claims) was also
   rejecting general facts that simply were not report numbers. The
   report and cards are for one specific thing a model has no other way
   to know — this person's own logged training — not a substitute for
   the model's own, considerably broader, general knowledge of anatomy,
   exercise science and nutrition. `/ask`'s schema now returns a
   `scope`, `"personal"` or `"general"`, alongside the answer.
   `"personal"` keeps every existing rule: grounded only in the report
   and cards, every number checked, refuses what the data does not cover.
   `"general"` is answered fully from the model's own knowledge and is
   never checked against the report, since it is not a claim about this
   person and there is nothing in the payload to check it against. The
   one line that does not move for either scope: no diagnosing a
   condition, no individualized medication or supplement dose tailored to
   a stated health condition, age or body weight — those get the general,
   non-personal picture plus one sentence pointing at a doctor or
   pharmacist, not a refusal of the whole topic and not a personal
   prescription either. `AskSheet` shows a small "General knowledge, not
   from your data" label on a general-scope reply, the same
   evidence-honesty instinct as everywhere else in the coach. A hand-built
   "knowledge database" of anatomy and nutrition facts was considered and
   rejected: Sonnet 5 already knows this material more completely and
   accurately than a file written for one night could, and building one
   anyway would have meant guessing at content instead of researching it
   — the opposite of what grounding is for. The proxy also gained
   per-route model overrides (`MODEL_EXPLAIN`, `MODEL_TAG_EXERCISE`,
   `MODEL_NOTES`, `MODEL_ASK`, `MODEL_IDENTIFY_EXERCISE`,
   `MODEL_IMPORT_PROGRAMME`, each falling back to `MODEL` then
   `DEFAULT_MODEL`, reported per-route at `/health`), so a route can be
   tuned to a different model later, once a real live comparison justifies
   it, without a code change — no route was reassigned this round: the
   existing routes were deliberately moved to Sonnet 5 with documented
   reasoning (see the decisions log), and reversing that without the
   means to verify quality live would be a guess, not research.
   `/ask` also gained the Anthropic web search tool, scoped to that route
   only and capped at 3 searches a question, for the minority of general
   questions that actually need a current or specific fact checked rather
   than recited from memory — see the decisions log for why it stays
   off by default judgement rather than always-on.

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
| 2026-09-19 | Any place waiting on the online coach shows a themed spinner (colour from the theme's own `--accent`, no per-theme code) with a rotating gym-flavoured phrase, in place of a bare "Asking…" — same restraint as the coach's own words, no exclamation marks. Respects prefers-reduced-motion. |
| 2026-09-19 | The daily spark on Today is built locally from findings already rendered by `words.ts`, not a remote call: a screen element shown on every open cannot honestly follow the existing "never spend a call on screen refresh" rule any other way. The weekly-review idea from the Phase 5 plan was dropped as redundant, since the Coach screen's `/explain` summary already synthesizes the week — a lesson to re-check a queued idea against what has since shipped before building it. |
| 2026-09-19 | `/ask`'s Worker is stateless: rather than store a conversation server-side, the app resends the whole exchange (capped at 12 turns) on every call and the Worker replays it as real alternating messages. Simpler than session storage, and it means the Worker never holds anything longer than one request. |
| 2026-09-19 | Ask-the-coach's conversation lives only in the sheet's own component state, not in `AppState` or localStorage: closing the sheet is the same as ending the conversation. Nothing about the exchange needs to survive a screen change, and not persisting it keeps the payload the Worker sees exactly what the person can see on screen. |
| 2026-09-19 | `/explain` and `/ask` were refactored onto one shared `GroundingPayload` (goal, unit, today, dataQuality, findings, proposals, cards) on both sides, so the "no sessions, no name, no body data" boundary and the findings/proposals/cards trimming are enforced in one place rather than copied per route. |
| 2026-09-19 | Photo capture and compression (`src/native/photo.ts`) use plain web APIs (`<input type="file" capture>`, canvas, `toBlob`) rather than `@capacitor/camera`: the Capacitor WebView already honours `capture` on Android, one code path serves the APK and the PWA, and no new native permission has to be declared for one narrow feature. |
| 2026-09-19 | `/identify-exercise`'s schema always returns a `visible` boolean rather than letting the model signal "nothing here" by leaving other fields blank or vague: an explicit false is impossible to misread as a real, if low-confidence, answer, and the app refuses to prefill the form at all when it is false. |
| 2026-09-19 | The identify-exercise prompt explicitly forbids describing a person's body, face, clothing or anything identifying if one appears in the photo — only the exercise or equipment context. A photo carries more incidentally about a person than typed text ever could, so this route needed a rule none of the text-only routes did. |
| 2026-09-19 | `/import-programme` classifies every exercise in the same vision call that reads the page, instead of one `/tag-exercise`-style call per exercise afterward: a plan with a dozen exercises would otherwise cost a dozen extra round trips and likely trip the six-a-minute rate limit on its own. |
| 2026-09-19 | `/import-programme` never reports a weight or load, only sets — a number copied from an old written plan would silently compete with the coach's own progression targets, which come from what the person has actually lifted, not from what a plan once said. |
| 2026-09-19 | Import review runs every extracted exercise through the app's existing `findExercise` (exact/alias/singular/substring match) before creating anything: a plan naming an exercise already in the library or already saved as custom links to it instead of creating a near-duplicate. |
| 2026-09-19 | A day is only ever turned into a real split on its own explicit "Add" tap, never for the whole imported plan at once: reviewing and committing one day at a time matches "never a silent write" more literally than a single "import everything" action would. |
| 2026-09-19 | The morning check-in is trimmed to three items (sleep, soreness, stress) rather than Hooper's original four (which also asks fatigue separately): a fourth tap works against the ten-second target, and fatigue overlaps enough with the other three, day to day, that the loss is small. |
| 2026-09-19 | A single low check-in widens today's recovery windows immediately (it is real information about right now), but only speaks up as a Finding once a pattern of at least two low check-ins in the trailing week appears — P19 is explicit that one reading alone correlates weakly with anything, so a finding built on one would be citing its own evidence card past what that card supports. |
| 2026-09-19 | Readiness and volume widen a recovery window by taking whichever factor is larger, not by multiplying them: two moderate signals compounding into an extreme window would overstate what either one alone supports, and the combined result is still capped by the existing RECOVERY_VOLUME_FACTOR_MAX. |
| 2026-09-19 | Preference memory reads only `CoachState.dismissed`/`accepted`, not the current report: a habit or a finding already reappears in every report on its own, so restating it as a "preference" would just duplicate what the payload already carries. What a report cannot carry is a suggestion the person has already declined, since a proposal dismissed twice is filtered out of the report entirely — that is the one thing worth a separate memory. |
| 2026-09-19 | Preference facts are recomputed at most once a week and cached, never derived inline while building a payload: the same "no remote call, and no meaningful extra work, on a screen refresh" rule that shaped the daily spark in Phase 5b applies here too, even though this computation is local and free — it still has no business running on every render. |
| 2026-09-19 | `preferences` on `GroundingPayload` is optional rather than required: it lets an older or hand-built payload (existing tests, a script) stay valid without every caller having to thread through an empty array. The app itself always sends a real array, empty or not. |
| 2026-09-20 | Found live: on a heavy training day `under_recovered` can fire once per muscle (up to 24), which alone filled the whole `LIMITS.findings` budget ahead of every lower-severity kind, including `record` — so a day with four separate PRs sent only one of them to `/explain` and `/ask`, and "why do you think I have more PRs today" could only ever be answered from that one survivor. `trimFindingsAndProposals` now caps any single kind at `MAX_FINDINGS_PER_KIND` (6) while filling the overall budget, the same diversity guarantee `words.ts`'s `shortlist()` already gave the local Coach screen. A kind that legitimately dominates a day (a full-body session) still gets a representative sample; it just can no longer crowd out every other kind entirely. |
| 2026-09-20 | `/ask` splits "personal" from "general" instead of trusting a person to always ask one at a time: a single question can genuinely mix both ("why is my chest still recovering, and what does that muscle actually do"), and a model deciding per-answer is simpler and more accurate than the app trying to classify the question text itself beforehand. |
| 2026-09-20 | The number-grounding check now runs only on a "personal"-scope answer. It was built to stop an invented claim about this person's own data, and it was already doing exactly that job correctly; the bug was applying it to general knowledge too, where there is no report number to check a real fact against in the first place. Scoping the check to where it means something fixed the false rejections without weakening it anywhere it was already working. |
| 2026-09-20 | Considered and rejected: a hand-curated knowledge base of anatomy, exercise-science and nutrition facts to answer general questions from, mirroring `principles.json`. Rejected because Sonnet 5's own training already covers this material more completely and accurately than a file written in one sitting could, and because building one anyway would mean guessing at content rather than researching it — precisely backwards for an app whose whole design principle is grounding claims in real evidence. The right use of a curated database stays what it already was: grounding facts about *this person's own data*, which no model has any other way to know. |
| 2026-09-20 | The safety line that does not move regardless of how broad `/ask` gets: no diagnosing a condition, no individualized medication or supplement dose tailored to a stated health condition, age or body weight. A general, non-personal version of the same topic (what a class of supplement generally does, typical ranges studied) stays fully answerable — the line is "tailored to this person's unstated medical specifics", not "the topic is off-limits". |
| 2026-09-20 | Proxy gained a per-route model override (`MODEL_EXPLAIN`, `MODEL_TAG_EXERCISE`, `MODEL_NOTES`, `MODEL_ASK`, `MODEL_IDENTIFY_EXERCISE`, `MODEL_IMPORT_PROGRAMME`), each falling back to `MODEL` then `DEFAULT_MODEL`, and reported per-route at `/health`. No route was reassigned: the existing routes were moved to Sonnet 5 deliberately, with documented capability reasoning, and this sandbox has no live API key to verify a downgrade's quality — reversing that decision without evidence would be a guess, which is exactly what grounding this app's own decisions is supposed to avoid. The override exists so a future session with live-testing ability can tune a route without a code change. |
| 2026-09-20 | `/ask` gained the Anthropic web search tool (`web_search_20260209`), scoped to that route only — `/explain` summarizes the person's own already-computed report and never needs an outside fact. Capped at 3 searches per question and left to the model's own judgement of when a search actually changes the answer (current guidelines, a specific claim worth checking) rather than always-on: most questions this route gets are stable knowledge (anatomy, established exercise science) that Sonnet 5 already answers reliably, and searching those would only add roughly a cent and real latency for no better an answer. Web search does not make "general" scope exempt from being wrong — a bad or misread source is still possible — so it changes what can go wrong, not whether anything can; the existing personal/general split and its number-grounding check are unaffected either way. |
| 2026-09-20 | Injury avoidance is deterministic, not a chat request: a person asking "build me a split that avoids my shoulder" still gets no invented programme from `/ask` — the same "the language model never designs plans" rule as everything else. Instead, `recentPainMuscles` (a set derived from recent `note_flag`/`pain_or_discomfort` findings) is now read by `planAdditions` and `buildSplits`/`planSplitNew`: neither ever proposes *new* direct work on a muscle flagged painful in the last week. Deliberately narrow: it never removes or modifies an exercise already sitting in an existing split (whether to keep training around it is the person's call), it does not reach into `planSwaps` (a swap replaces a stalled lift, it does not add volume), and it only screens out that muscle's own slots — a flagged shoulder does not turn into a smaller or cancelled week, the day still trains everything else, per the actual ask ("still being productive"). |
| 2026-09-20 | Found live: a "how do I see my recovery" or "can I add a split mid-workout" question fell into the "not a general assistant" redirect, since the model has no idea what screens this specific app actually has — it isn't training data, and guessing one would risk describing a button that doesn't exist. `/ask`'s prompt now carries a small fixed "app map" (the real bottom tabs and what lives on each, verified against `src/slices/*` and `src/app/router.ts`, not recalled) as a third knowledge source alongside the report and general knowledge; app-usage questions are answered only from it, tagged "general", and the model is told plainly to say a feature doesn't exist rather than invent a path to it. This needs a human (or a future session) to keep it in sync by hand whenever navigation actually changes — there's no automatic check that the map still matches the UI. |
| 2026-09-20 | Ran a full prompt audit (system prompts, tool config, request-construction code in `proxy/src/`) against Sonnet 5's documented current behavior, looking for dated patterns written for older models: pressure-caps language, thinking/prefill/sampling fossils, forced tool use, prohibition clusters with no stated reason. Found none — every prompt already reads at "current model" register (plain statements, reasons attached, no `MUST`/`CRITICAL`/`NEVER` shouting; a grep for all-caps pressure words across every prompt file returned zero), the request code already uses `output_config.effort` and structured outputs with no `budget_tokens`, prefill, or forced `tool_choice` anywhere, and every "never" in `/ask`'s prompt carries a real, already-documented reason rather than floating free. The two hard word caps (explain items ≤55 words, ask answers ≤120-160) are the one pattern the audit's own tables would flag by default (Group 1f) — left in place here as a deliberate product choice for a "premium, simple" chat UI, not re-tested, since the failure a cap prevents (an answer too long for a short card or chat bubble) is a real layout constraint the audit's generic advice doesn't have visibility into. Recorded here so a future audit doesn't redo this scan from scratch; re-run it whenever the target model changes. |
| 2026-09-20 | `/ask`'s web search tool gained `allowed_domains` (`ASK_WEB_SEARCH_ALLOWED_DOMAINS` in `proxy/src/anthropic.ts`): nih.gov, cdc.gov, health.gov, who.int, mayoclinic.org, examine.com, acsm.org, nsca.com, and two sports-medicine journals. Before this, a search could pull from anything that ranked, including a low-quality blog, for exactly the kind of nutrition or training claim the rest of the app is careful to ground in real evidence (`docs/RESEARCH.md`, `principles.json`). Restricting to research and public-health bodies holds web search to the same evidence bar `/ask`'s own prompt already asks the model to hold itself to. |
| 2026-09-20 | A session note tagged "fatigue" (`src/ai/notes.ts`'s existing vocabulary — this needed no new AI-side work, only reading a signal already captured) now widens that session's own recovery window, the same mechanism as a low morning check-in: a new `fatigueFactor` in `detectUnderRecovered`'s metrics, combined with the existing volume and readiness factors by taking whichever is largest, still capped by `RECOVERY_VOLUME_FACTOR_MAX`. Scoped to the muscle the flag named, or every muscle trained that session if it named none (a whole-session note like "felt gassed today" isn't about one muscle). Sized the same as `READINESS_RECOVERY_FACTOR_MAX` rather than stacking a third, larger cap on top — subjective_readiness_monitoring's "one reading alone is a weak signal" caveat applies exactly as much to a post-session note as a pre-session check-in. Before this, a `fatigue` flag was recorded and shown in the coach's own words but had no effect on anything, the same gap `pain_or_discomfort` had before tonight's injury-avoidance work — this closes the equivalent gap for the recovery estimate itself. |
| 2026-09-20 | Found while re-checking `detectNoteFlags` for the fatigue-recovery work above: it kept only the newest `MAX_NOTE_FLAGS` (3) distinct flags overall, sorted purely by day. A pain flag five days old could be silently dropped from the report by three unrelated, more recent flags (an equipment issue, a schedule note, a form check) — the exact bug class the `MAX_FINDINGS_PER_KIND` fix caught earlier tonight, but worse here: `recentPainMuscles()` (planners/shared.ts) reads this same report, so a dropped pain flag would also silently disable tonight's injury avoidance without anything failing loudly. `detectNoteFlags` now always keeps the most recent `pain_or_discomfort` flag(s) in the trailing week before filling remaining slots with whatever else is newest — a safety signal no longer competes on recency alone against an equipment complaint. |
| 2026-09-20 | The injury-avoidance work earlier tonight covered `planAdditions` and `buildSplits`/`planSplitNew` (building a new split or adding volume) but missed the planner that answers "what should today's session actually be" — `planToday` swapped an exercise only when its muscle read under `RECOVERY_SWAP_PCT` by the volume/time recovery model, which knows nothing about a pain flag: a muscle can read 100% recovered by the numbers while still being the thing a note just said hurts. `planToday` now also swaps out a lift whose primary muscle is in `recentPainMuscles(findings)`, tagging the change `reason: 'note_flag'` (an existing `FindingKind`, not a new value) rather than `'under_recovered'` so the two stay distinguishable; its substitute-picking is also filtered so a replacement can't land back on an avoided muscle, since `pickExercise`'s own readiness gate — reading only the volume/time model — would not have caught that either. `words.ts`'s `today_plan` copy previously always said "still recovering" for any swap; a pain-only swap now gets its own honest sentence ("flagged it as sore recently") instead of a blank "  is still recovering" from an empty muscle list. This is the piece that most directly answers the original ask: a hurt shoulder now gets routed around in the actual live recommendation for today, not just in future split-building. |
| 2026-09-20 | `CoachState.explainerUrl` now defaults to `DEFAULT_PROXY_URL`, the real deployed Worker, instead of an empty string every fresh install, data reset or new device had to have pasted back in by hand before "Online coach" would do anything (`remoteEnabled` in `src/slices/coach/remote.ts` requires both the toggle and a non-empty URL). This is deliberately not a generic template concern: it's a personal app with one Cloudflare deployment, so there is nothing for the person to actually choose — the field stays editable in Settings only for the day a redeploy moves to a different URL. The toggle alone now turns on every remote feature, matching what "Online coach" already claimed to be. |
| 2026-09-20 | Found live, first real use against the redeployed Worker: an `/ask` answer occasionally ended with a stray quote-then-brace (`..."}`) — the model closing the JSON object it's implicitly composing, leaking into the string content itself even under structured outputs. Same structural risk exists for `/explain`'s `summary`/items, since both are prose generated inside a JSON schema. Fixed two ways: the prompt now explicitly forbids raw JSON/markdown artifacts in the prose fields (`prompt.ts`, `promptAsk.ts`), and `stripFormattingLeak()` in `proxy/src/anthropic.ts` trims a trailing run of `"`, `'`, `}`, `]` from every prose field regardless, as a safety net — narrow on purpose, since this app's coach voice never legitimately ends a sentence in one of those characters. |
| 2026-09-20 | `/ask` may now use a blank-line paragraph break or a `"- "`-prefixed line list when an answer is genuinely a set of distinct items, instead of always being forced into one dense paragraph — `.ask-bubble`'s CSS already had `white-space: pre-wrap`, so no rendering code needed to change; the fix was purely giving the model permission in the prompt. |
| 2026-09-20 | The shared `Thinking` indicator (`src/ui/primitives.tsx`, used everywhere the app waits on the online coach) swapped its generic rotating-ring spinner for a small cycling gym-equipment icon (dumbbell, kettlebell, plate — `IconKettlebell`/`IconPlate` added to `src/ui/icons.tsx`), the same idea as a CLI spinner cycling glyph shapes but on-brand instead of generic. Under `prefers-reduced-motion` the icon holds its first shape rather than cycling (checked in JS via `matchMedia`, since this swap is driven by a `setInterval`, not a CSS `@keyframes` the existing media-query rule could disable) — the phrase text still rotates regardless, matching how the rest of the app treats a text change as distinct from motion. `.ask-bubble`'s font size also went from 14px to 15.5px (line-height 1.4→1.5) for readability, per direct feedback that chat replies felt small. |
| 2026-09-20 | `/ask`'s "- " bullet convention (added earlier tonight) now renders as a real `<ul>`/`<li>` list client-side instead of relying on `white-space: pre-wrap` to fake it with visible dashes, with `**term**` parsed into `<strong>` for the "emphasize a key term, sparingly" ask. Schema gained a `category` field (`nutrition`/`body`/`training`/`app`/`general`) purely to pick a small decorative bullet icon per answer (an apple, the body icon, a dumbbell, the gear icon, or a neutral info dot) — never shown as text, never used for grounding, and re-validated app-side the same way `scope` already is (an unrecognised or missing value falls back to `general` rather than trusting the network). Token cost of both additions is negligible: an enum field costs a handful of tokens, and `**`/`- ` markup costs about the same few characters as the plain dashes already in use — the icons themselves are pure client-side rendering, zero extra tokens. Explicit design choice: no separate heading/header syntax — a bolded term already reads as one inline, and a real block-level heading is more structure than a short chat bubble needs. |
| 2026-09-20 | Found live, first real device test of the bullet list: a bold term long enough to wrap to two lines pushed the rest of that bullet's text into a visibly misaligned second column, far to the right with a large gap. Cause: `.ask-list li` is `display: flex`, and the bullet's inline content (`renderAskInline`'s returned array of a `<strong>` plus plain-text nodes) was spread directly as the `<li>`'s children — flex treats every direct child as its own flex item, so the bold term and the text after it became two separate rigid columns instead of one wrapping block of prose. Fixed by wrapping `renderAskInline`'s output in a single `<span>`, so the `<li>` has exactly two flex items (the icon, then one text span) and everything inside that span flows and wraps as ordinary text. Verified live against the exact reported wording ("Hip flexors — at the front of the hip, lift the knee up.") before shipping. |
| 2026-09-20 | Every assistant reply in Ask now shows a small persona mark — a name ("Escobar") and an animated cigarette icon (`IconCigarette` in `icons.tsx`; three independently-timed smoke wisps plus a softly pulsing ember, keyframes in `styles.css` as `.persona-*`) — a personal, cosmetic touch, not a feature. This replaces the old per-answer "General knowledge, not from your data" disclaimer text; by explicit request it's the same for every answer, not just general-scope ones. The disclaimer's actual job — stopping an invented number in a *personal*-scope answer from reaching the screen — was never the visible text itself, it was `validateText`/`allowedNumbers` in `explainer.ts`, which `requestAskAnswer` still runs exactly as before; only the on-screen label changed. Animation respects `prefers-reduced-motion` (frozen to a static, still-visible frame) via the same CSS media-query rule the rest of the app's motion goes through, verified frame-by-frame (opacity/transform sampled over time, not just eyeballed) before shipping. |
| 2026-09-20 | Coach tab's "From the coach, online" card is now the persona's main entry point: `card-quiet` → `card-accent` (the same gradient-emphasis treatment `Train`'s stats card already uses) for visibility, the eyebrow leads with a static (non-animated) `IconCigarette` and "Escobar, online", and "Ask Escobar a question" is now the primary-styled, full CTA button instead of a small quiet one — "More from the coach" stays but demotes to secondary. Declined to also add the smoking animation here: it's a screen you sit on, not a chat you just opened, and constant motion on a persistent card reads as noisy rather than a deliberate "you're now talking to the coach" moment — animation stays reserved for inside the Ask sheet. Fixed a real layout bug caught before shipping: the button row was a non-wrapping `.row`, so "More from the coach" clipped off the card's right edge once the primary button grew wider; switched to the existing `.wrap` utility class so it drops to its own line on narrow screens instead. |
| 2026-09-20 | Declined: rendering an actual likeness of Pablo Escobar (a real, specific, historical individual) as the coach's avatar, even for this private single-user app. The name and a cigarette icon are an abstract joke; a generated face is depicting a real person's identity, which stays declined regardless of how private the surface is. Offered a genuinely fictional "cartel boss" caricature (sunglasses, mustache — a broad meme trope with no specific real likeness) as the alternative if a face is still wanted. |
| 2026-09-20 | Added a second persona mark, `IconMafia` in `icons.tsx`: a solid-fill, faceless wide-brim-hat silhouette (no eyes, nose, or any identifiable feature — a generic trope icon, same category as the declined-face entry above, not a real person). Modelled on a reference stock silhouette the user supplied; recreated as an original `currentColor` SVG path (evenodd hole for the open collar, a small separate triangle layered back in for the tie) rather than embedding the reference image, so it inherits the app's accent colour and theme like every other icon. The two marks now split by surface, per explicit request: the Coach tab's "From the coach, online" card eyebrow uses the static `IconMafia`, while the Ask sheet's chat bubbles keep the animated `IconCigarette` (smoke wisps + ember) — `IconCigarette` and its `.persona-*` CSS were kept for that reason rather than removed. |
| 2026-09-20 | Full QA pass: a new 50-persona fuzz simulation (`tests/coach-fuzz.test.ts`) runs the whole deterministic pipeline (`buildReport` → `insightsFrom`/`suggestionsFrom`) over varied synthetic histories — brand-new/veteran, injury-prone, zero-effort-logging, extreme weights/reps, future-dated sessions, duration-only logging, everything-dismissed — checking for crashes, non-finite numbers and literal "NaN"/"undefined" leaking into on-screen copy (all clean; the brain's own `safe()` wrapping in `report.ts` already carries most of that weight). Two review passes across the UI and the AI/proxy integration then found and fixed real bugs: (1) `Coach.tsx`'s `GOALS.find(...)!` could crash the whole app on a corrupted/hand-edited backup's `goal` field — fixed at both the symptom (`?? GOALS[0]!`, matching `Train.tsx`'s existing safe pattern) and the root cause (`normalize()` in `core/store.ts` now validates `goal` with `isGoalId` on every load and restore); (2) `Train.tsx`'s expanded-entry index went stale after removing a *different* entry from a live session, silently showing the wrong exercise's sets as expanded — fixed by adjusting the index in the same call that removes the entry; (3) `explainer.ts`'s `allowedNumbers` — the core anti-hallucination check — split every finding window's and `today`'s YYYY-MM-DD date into separate year/month/day numbers and allowed all of them, which let a fabricated small number (a rep count, a set count — exactly the range coaching answers use most) pass as "grounded" purely because some window happened to start or end on a matching day-of-month; removed entirely, since the prompt already forbids the model from inventing a date in the first place; (4) `extractNumbers` mis-parsed a comma thousands-separator as a decimal point ("1,500" → 1.5), now disambiguated by digit count (a thousands group is always exactly three digits) while keeping the existing European-decimal-comma handling for other cases; (5) `stripFormattingLeak` could eat a legitimate trailing quoted term or unit mark ("...45\"") that happened to end a sentence — narrowed to require an actual `}`/`]` in the trailing run, which a real leak always has and real prose never does; (6) `/explain`'s payload validator was missing the `onlyKeys` check every sibling route already had, so an unfiltered extra field from a modified client could ride along into the prompt sent to Claude — added, matching `/ask`/`/tag-exercise`/etc. Also fixed, found independently while reading the Ask rendering code: a trailing blank line in an answer left a stray empty `<p>` whose CSS margin added visible dead space at the bottom of a chat bubble. Separately, several primary tap targets (suggestion/insight/training-goal/schedule cards, the Today suggestions banner, session cards) used the `Card`/`Row` primitives' `onClick` with no keyboard access at all — `Card` and `Row` now add `role="button"`, `tabIndex`, and an Enter/Space handler when `onClick` is present, with each call site given a concise `aria-label` (the fix's first pass let a button's accessible name default to its entire multi-line text content, which is both bad for screen readers and — caught by the visual gate's own Playwright locators — collided with substring name-matching on unrelated buttons; the gate script itself also had this latent fragility, unrelated to the app bug, and now scopes bottom-tab-bar lookups to the `nav` landmark). All fixes verified live (Playwright, not just unit tests) plus the full suite: typecheck, 268 app tests + 42 proxy tests, build, 5-theme visual gate. |
| 2026-09-20 | Found live: a real personal-scope question ("check my data improvement, give feedback") got its whole answer dropped by the grounding check. Rule 3 already told the model to say plainly when the report doesn't cover something, but not the more specific trap this hit — computing a *new* number (a percentage change, an average) from real figures it can see, which reads to `validateText` exactly like an invented one, since that computed number was never itself a field in the report. `promptAsk.ts` rule 3 now says so explicitly: describe a change in words ("noticeably more than before") rather than doing the arithmetic and stating a number, unless the exact resulting number already exists as its own field. Proxy-only; needs a redeploy to take effect. |
| 2026-09-20 | Added `/build-split`: build or adjust one split by conversation, from a new "Escobar" entry point on the Train tab, separate from the general "Ask the coach" chat. Requested directly: describe what to change (target muscles, exclusions, current lift/goal) and get a concrete proposal back, not just an explanation of an existing deterministic proposal. This is the one deliberate exception to "the language model never designs plans" (see the bullet above in "Why this shape") — weighed two shapes for it: (a) the model collects preferences and hands them to the existing deterministic split-builder, or (b) the model drafts the split directly in chat, with an explicit accept step before anything is written. Chose (b), by explicit request, with the guard that makes it safe anyway: **(1) a closed exercise vocabulary.** `proxy/src/vocab.ts` gained `EXERCISE_CATALOG`/`EXERCISE_IDS`, a full copy of the real 123-exercise library (id, name, primary muscles) generated from `src/data/exercises.json` and checked against it by `proxy/test/vocab.test.ts`, the same drift-check pattern `MUSCLE_IDS`/`PATTERNS` already used at a smaller scale. The split-builder schema's `exerciseId` is a zod enum over exactly these ids — the model cannot return one that doesn't exist, structurally, not just by convention. **(2) Client-side re-validation regardless.** `src/ai/splitBuilder.ts`'s `knownExercises()` re-checks every id against `findExercise` (catalog or the person's own custom exercises) before a draft is ever shown as something the person could apply, the same "known ids only, silently drop the rest" idiom `tagExercise.ts`'s `knownMuscles` already established; a draft left with nothing real after that filtering is not shown as actionable at all. **(3) Nothing is written until an explicit accept.** The conversation only ever proposes; `applySplitDraft` (new, in `splits.ts`) is called solely by tapping the action button under a proposal, mirroring `acceptProposal`'s existing "suggest, never control" posture — closing the chat or ignoring a proposal changes nothing. **(4) No report, no findings.** `BuildSplitPayload` deliberately isn't `GroundingPayload`-shaped; designing a split is a judgment call about real exercises and set/rep schemes, not a claim about the person's history, so there is nothing here for `/ask`/`/explain`'s number-grounding check to apply to — the exercise/muscle vocabularies are the safety net instead. The general "Ask the coach" chat's own decline-to-build-plans behavior (rule 6, `promptAsk.ts`) is unchanged; `/build-split` is reached only through its own Train-tab entry point, not by asking the general chat differently. Shared the markdown-lite rendering, the typed-out placeholder, and the input row between this and Coach's Ask sheet by extracting them into `src/ui/chatRender.tsx` (`renderChatBody`, `useTypewriterPlaceholder`, `ChatInputRow`, and the `COACH_NAME` constant, all previously private to `Coach.tsx`) rather than keeping two copies of the same behavior in sync by hand. |
| 2026-09-20 | Asked directly whether the coach can advise on reps or the next weight to lift — found this genuinely didn't work: `load_next` (the exact real recommendation `suggestNext`/`planLoad` already compute per exercise) is deliberately excluded from `trimFindingsAndProposals`, because it's redundant with what Train already shows live, per exercise — but that exclusion also meant nothing in `/ask`'s payload could ground "what should I lift today for bench," so a real, already-computed, already-displayed number had no way to reach the chat. `/explain` still has no use for it (unchanged, still excluded there — a weekly summary paragraph isn't the place for a per-exercise number Train already shows). `src/ai/ask.ts`'s `buildAskPayload` now adds `load_next` proposals back in locally, capped at 8 (matching `planLoad`'s own per-session bound) and the combined list re-capped at `LIMITS.proposals` so the proxy's own hard cap on proposal count is never at risk of being exceeded. `promptAsk.ts`'s description of the report now explains what a `load_next` proposal means, so the model reaches for it confidently instead of not recognizing the shape. Proxy-only; needs a redeploy. |
| 2026-09-20 | Found live: the split-builder ("Could not reach the proxy") failed from the Netlify web build even right after a successful redeploy. Not a deploy problem — the Worker's CORS check (`corsHeaders`/`originAllowed`, `proxy/src/handler.ts`) never allowed the Netlify site's origin, since `ALLOWED_ORIGINS` in `wrangler.toml` was empty; the browser silently drops a cross-origin response with no `Access-Control-Allow-Origin` header, which `postJson`'s catch block can't tell apart from a genuine network failure. Added the Netlify origin to `ALLOWED_ORIGINS`. Proxy-only; needs a redeploy — `wrangler.toml` vars are baked in at deploy time, not read live. |
| 2026-09-20 | Tried pasting two full splits (Push and Pull, each with a full exercise list) into the split-builder in one message, and asked for two buttons back — found the schema only ever supported one `splitDraft` per reply, so describing several splits at once meant only one could ever become actionable. Changed `splitDraft: SplitDraftSchema.nullable()` to `splitDrafts: z.array(SplitDraftSchema).max(4)` throughout (`proxy/src/anthropic.ts`, `types.ts`, `index.ts`, `promptSplitBuilder.ts` rule 2) — most turns still return exactly one entry, but a message describing several splits gets one entry per split in the same reply instead of the model picking just one arbitrarily or spreading them across turns. `src/ai/splitBuilder.ts`'s `parseDraft` already validated one draft at a time against the real catalog and the payload's own known split ids; kept that exact per-draft validation and mapped it over the array, so one invalid draft in the middle (an unrecognized exercise, a stale splitId) is dropped without discarding the others — not all-or-nothing. `SplitBuilderSheet` now renders one independent action button per draft in a turn, each with its own "Applied." state once tapped. Verified live: two drafts in one reply rendered as two buttons, applied independently, both landed as real splits in state. Proxy-only; needs a redeploy. |
| 2026-09-20 | Merged `/build-split` into `/ask`, and unified the two chat entry points, on explicit request: "mix the 2 escobar coach... both can do same features." Two separate routes/prompts/schemas for essentially one conversation was drift risk, not a real boundary — and a client-side heuristic to decide which route to call for a given message would have been the opposite of the "make more intelligent" ask. Now there is exactly one route, one prompt (`promptAsk.ts`), one schema (`AskSchema`), carrying the exercise catalog, rep-range table and `splitDrafts` support that `/build-split` used to own alone; `proxy/src/promptSplitBuilder.ts`, `types.ts`'s `BuildSplitPayload`/`BuildSplitReply`, `handler.ts`'s `validateBuildSplitPayload`, and `src/ai/splitBuilder.ts`/`src/slices/workout/SplitBuilder.tsx` are all deleted, not deprecated. This is a real capability upgrade beyond just satisfying the request: the standalone `/build-split` deliberately received no report or findings ("No report, no findings" was an explicit design point at the time — see the entry above), so it could never say "since you flagged shoulder pain recently, I kept overhead work light here"; merged into `/ask`, which already carries the full grounding payload, split-building now uses real findings, goal and existing splits when relevant, and inherits `/ask`'s web-search tool too. `promptAsk.ts` rule 6 is rewritten to recognize real-world phrasing broadly — named split styles (push/pull/legs, upper/lower, full body, a "bro split", specialization days), equipment constraints, injury-avoidance phrasing, day-count limits, stated experience level, several splits described at once — rather than requiring a particular wording. The three safety guarantees from the original `/build-split` entry are unchanged, just relocated: (1) the closed exercise-catalog zod enum, (2) client-side re-validation via `findExercise`/`knownExercises` (now in `src/ai/ask.ts`), (3) nothing written until an explicit accept-button tap (`applySplitDraft`, unchanged). UI: `Coach.tsx`'s old private `AskSheet` and `SplitBuilder.tsx`'s `SplitBuilderSheet` are replaced by one shared `src/slices/coach/AskSheet.tsx`, opened identically from Coach's "Ask a question" button and Train's "Escobar" button. Applying a splitDraft now always calls `go('train')` (`@/app/router`) before marking it applied, so proposing and creating a split from outside Train (the Coach tab) lands the person on Train to see it — a no-op when already there. The general chat's old rule 6 ("you don't build plans in chat... decline") no longer exists; asking it to build a split now does. Proxy-only for the route/prompt/schema; app-side for the merge into `src/ai/ask.ts` and the shared sheet — both need a redeploy and a fresh build respectively. |
| 2026-09-20 | Found live, right after the merge above shipped: "Build 5 days full body split for me" 502'd ("The coach could not answer right now."). Root cause: `promptAsk.ts` never said what a day count in a split request actually means, so the model read "5 days" as a request for 5 separate splitDrafts (one per day) rather than one split trained 5 times a week (the app already handles training frequency separately, through its own weekly schedule — see `Schedule` in `Coach.tsx`). Generating 5 full split objects (each with its own name/focus/exercise list) plus prose describing all of them blew well past `max_tokens: 3500`, so the reply got cut off mid-JSON; `requireParsed` (`proxy/src/anthropic.ts`) throws a 502 on exactly that (`stop_reason` not `refusal` but `parsed_output` empty/incomplete), which is indistinguishable to the person from any other "could not answer" failure. Fixed three ways: (1) `promptAsk.ts` rule 6 now says explicitly that a day count means training frequency, not split count — "a 5-day full body split" is exactly one splitDraft, and only a request that actually names different day types (push/pull/legs, a bro split) gets one entry per day; (2) raised `MAX_SPLIT_DRAFTS` from 4 to 6 so a genuine 5- or 6-day bro split (a real case the day-count fix doesn't collapse to one entry) still fits, rather than silently truncating a legitimate multi-split answer; (3) raised `max_tokens` from 3500 to 5000 as a safety margin, since even a correctly one-splitDraft reply for a 10-exercise split plus prose was cutting it closer than intended. Proxy-only; needs a redeploy. |
| 2026-09-20 | Added a real "how has my training gone" visual, requested directly ("create a visual or image for my performance data in the last 3 months"). Explained why an actually-generated image was the wrong shape for this (Claude has no image-generation capability, and even if it did, a picture can't carry real numbers the way a rendered chart of real data can) and built a chart instead: `weeklyVolumeHistory` (new, `src/brain/weekly.ts`) returns one `{ start, end, sets, volumeKg }` entry per week, oldest first, over the last N weeks — `weekSummary` only ever looked at the current week, so this is genuinely new, not a reshape of existing data. Extracted the shared per-range aggregation (`volumeInRange`) so both functions compute volume the same way instead of drifting. History → Stats gained a "Volume trend" section: 12 weekly bars (single series, one hue, no legend needed) built as real `<button>` elements so each week is a first-class tap/keyboard target — tapping one updates a caption above the chart with that week's exact date range, total, and set count, defaulting to the current week. A week with nothing logged is a real zero bar, not skipped, so a gap in training is visible rather than silently smoothed over. Followed the dataviz skill's procedure: single-series bar chart (magnitude over time, discrete weekly buckets), one hue (`var(--accent)`, matching the app's existing `Sparkline`/`.bar` components), <=22px bar width with a 2px gap and 4px rounded tops per the mark spec, no legend (one series), the mark itself as the full-height tap target rather than a separate hover layer (touch-first app). Verified live with a seeded 9-week history including a deliberate gap week: chart renders correctly, tapping an empty week correctly shows "0 kg · 0 sets" for that week, zero console errors. |
| 2026-09-20 | Found live, right after the day-count fix above shipped: "Create a good 5 days split for me full body" no longer 502'd, but got silently dropped anyway ("The coach's answer used a number that is not in your data"). Root cause: `promptAsk.ts` rule 1 already documents that a splitDraft's own exercises and set counts are "a design choice, not a claim about this person's history" and are never checked against the report — but `src/ai/ask.ts`'s `requestAskAnswer` never actually implemented that exemption for "answer" itself, only for the splitDraft's own fields. Describing a fresh split necessarily cites its own rep/set numbers (the rep-range table), which are never going to be "in the report" by definition, so a "personal"-scoped answer next to a real splitDraft was being rejected every time, discarding a valid draft along with it. Fixed by skipping the personal-scope number check on "answer" whenever the reply actually contains at least one valid splitDraft (computed the drafts first, then only run `validateText` when `drafts.length === 0`) — matching the exemption the prompt already documented as existing. A personal-scope answer with no splitDraft is still checked exactly as before; only a genuine split-building reply is exempt. App-only; needs a fresh build/Netlify deploy, no proxy redeploy. |
| 2026-09-20 | Broadened `/ask`'s topic scope from training-adjacent to general health, on explicit request: "broaden our coach reasoning like u [Claude]... answer almost all questions related to health, general, gym, muscles... not to the max." Previously rule 2's in-scope list was itself a narrow enumeration (training, the body, exercise, recovery, "sleep as it relates to training", nutrition, the app) — sleep in general, stress and mental wellbeing, and any body system besides muscles (heart, lungs, digestion, hormones, immune system, nervous system) were technically out of scope, forcing a redirect on a completely reasonable health question a coach should just answer. Rewrote rule 2 to scope in health broadly — any body system, general nutrition and diet, sleep in general, stress/mood/motivation/habit-building, and ordinary everyday health questions (what a symptom or health term means, first-aid basics, aging, common minor ailments) — while keeping the boundary against genuinely unrelated topics (weather, news, trivia, coding, finance, legal) exactly as tight as before. Deliberately did not go "to the max": this is still a health-and-fitness coach, not a general-purpose assistant, and the boundary is topic (health-and-body vs. unrelated), not "does this look complicated." The safety rules stay exactly as strict, not looser for the wider surface — rule 4 generalized from "individualized medication or supplement dosage" to "individualized medical guidance" (a dosage, whether a symptom needs a doctor, how a condition should be managed) specifically so a broader set of medical-adjacent questions still gets the same never-diagnose, general-picture-then-refer-to-a-professional treatment, not a loosened one. Extended the web-search allowlist (`ASK_WEB_SEARCH_ALLOWED_DOMAINS`) with `medlineplus.gov` (NIH's consumer health encyclopedia), `sleepfoundation.org` and `apa.org` (stress/mental wellbeing) to match — still research and public-health bodies only, same evidence bar as before. Proxy-only; needs a redeploy. |
| 2026-09-20 | Follow-up to the scope broadening above, on explicit request: "if I eat something like this scenarios. Broaden food related questions to health." A hypothetical food-consequence question ("what happens if I eat a lot of sugar every day", "is it bad to eat right before bed") was already technically inside rule 2's broadened nutrition scope, but nothing said so explicitly, and a question shaped like that reads slightly medical ("what happens if...") in a way that risked the model treating it more cautiously than an ordinary general-knowledge question just because it names a food or a habit. Added an explicit clause to rule 2's nutrition bullet naming this exact shape ("any 'if I eat/drink X' scenario... answer what it generally does to the body... not as a special or riskier category just because it names a food") and extended rule 4's non-individualized example list with two food-scenario examples, paired with the individualized contrast that still applies when a real condition is named ("what happens if someone eats a lot of sugar" is general; "I have diabetes, exactly how much sugar can I personally have" is still the individualized case, general picture plus a professional referral). No behavior actually changes for the medical-guidance boundary — this makes explicit, for the model, a case rule 2 already covered in principle but didn't call out, the same way the day-count clause under rule 6 made explicit something rule 6 already implied. Proxy-only; needs a redeploy. |

## Non-goals

No injury prediction or diagnosis, anywhere. No individualized medical
guidance — a dosage, whether a symptom needs a doctor, how a condition
should be managed — tailored to a health condition, medication, age or
body weight; general, non-personal information on those topics is in
scope and deliberately broad (see Phase 9, and the 2026-09-20 scope
broadening in the decision log above). No on-device language model in
v1; the explainer interface is pluggable if that changes.

General diet/calorie/supplement advice and open-ended chat were both
non-goals through Phase 8; Phase 9 narrowed the first to only the
individualized cases above and dropped the second entirely — see below.
