# BUG-38: next split ignores the split actually done

**Status (2026-10-03 04:4x UTC):** design DONE (workflow wf_335c9c91-d12, Opus designer); the card is below and was accepted by the supervisor; a builder was started on it. UI-R03 (audit) is folded in. The audit confirmation also confirmed BUG-38 with its own test: docs/supervisor/verify/a3-tests/schedule/bug-38-next-after-swap.test.ts.

- **Owner report (Sat 3 Oct, phone):** he skipped SPLIT 2 (lower and core) and did SPLIT 3 instead. Today then said "Today's session is done. Recover well; SPLIT 3 is next on Sun." and "the muscles for SPLIT 3 on Sun are not fully recovered". His words: "whatever split i do, it should not blindly guess whats my nxt split specially when its done." Scope he set: "fix this only or found any other bugs related", plus confirm the audit findings (see `audit-3-confirm.md`).
- **Root cause (confirmed by the supervisor):** readiness gets `next` from `nextScheduledSplitFor` (`src/escobar/tools/context.ts:58`), which is `nextScheduled(state.schedule, day)`: a weekday lookup that never looks at the sessions actually done. It is shown at `src/brain/readiness.ts:247-248,327`. The coach rules (`src/brain/coach/rules.ts:245`) read a "next" split too.
- **Direction (supervisor, before the design pass):**
  - the weekdays decide when;
  - the next split is the one most overdue in plan order, never the one just done;
  - a single pure selector derived from the schedule and the sessions, with no new saved data, used by every consumer;
  - closely related: audit finding **UI-R03** (day-off intent is not shared: one date-aware effective-schedule selector).
- **Resume:**
  1. Re-run `docs/supervisor/workflows/next-split-design.js`. In the same session use `resumeFromRunId wf_335c9c91-d12`: the two investigators below are cached, and the designer was stopped before it finished.
  2. Fold in UI-R03 and anything the audit "schedule" group finds.
  3. Write the card, start one Opus builder, review it, merge it in a train, then send the APK.

## Card (designer output, accepted by the supervisor 10-03)

# BUG-38: next split follows the sessions done, not only the weekday (UI-R03 folded in)

```
id: BUG-38
model: claude-opus-5-5
base: main 000918ef
depends_on: none
build_prerequisites: none
merge_prerequisites: review passed; checks green on a head that contains the latest main; every lower-numbered item on the owner's checklist already merged (supervisor checks this)
shared-file owners: scripts/screenshot-gate.mjs is shared and add-only (this card adds one block named BUG-38); all other files in write_scope have no owner in AGENTS.md
```

## Outcome

The app picks today's split and the next split with one pure function. The function reads only data the app already saves: `schedule`, `splits`, `sessions` and `daysOff`. When the owner skips SPLIT 2 and trains SPLIT 3, the app never names SPLIT 3 as next, and it never scores readiness on the SPLIT 3 muscles he has just trained.

**Deliverable:** one PR. **Evidence:** the tests and gate probes under Acceptance; each one fails on 000918ef and passes on the PR head. **Finish condition:** the PR is merged in a train, the APK is sent, and the owner checks it on his phone (see Verification).

## Root cause

1. Both "today's split" and "next split" are weekday lookups that never read the sessions.
   - `nextScheduled` (src/core/dates.ts:95-103) walks the schedule forward from tomorrow.
   - Three copies turn its result into a split: src/app/selectors.ts:23-28, src/escobar/tools/context.ts:58-63 and src/brain/coach/rules.ts:169-174. rules.ts:242 calls it directly.
   - "Today" is `schedule[weekdayOf(today)]` at selectors.ts:20-21, context.ts:52-55 and rules.ts:180, :232 and :749.
2. Once any session is logged today, readiness switches its target muscles to that "next" split (src/brain/readiness.ts:180-183) and prints it (:247-248, :326-328).
   - On Saturday, with `schedule.sun` = SPLIT 3, it named and scored the split he had just trained. The amber score itself was measured on the wrong muscles (:243-250, :297, :306-309).
   - Nothing in the code remembers that SPLIT 2 was skipped.
3. The same lookups ignore a day off. `recovery.scheduled-conflict` (rules.ts:229-280) has no `daysOff` check, which is audit finding UI-R03.
   - These lookups also feed Escobar (context.ts:65-75, brief.ts:78-82, read.ts:124) and the reminder text (src/native/notifications.ts:146-152).

## The rule (decision D-BUG38)

Weekdays decide when you train. Your sessions decide which planned days are already covered. A split you skipped by training another split moves into the next day that an early session freed up.

```ts
// src/brain/splitPlan.ts (new), pure, no signals
export interface PlanSlot { split: Split; day: string; weekday: Weekday; movedFrom?: string }
export interface SplitPlan {
  today: (PlanSlot & { off: boolean }) | null; // before today's sessions are counted; kept on a day off
  doneEarly: { split: Split; on: string } | null; // today's own split was trained earlier and nothing moved in
  next: PlanSlot | null;                         // first planned day in (T, T+7]
  days: Array<{ day: string; splitId: string | null }>; // T..T+7, for reminders
}
export function splitPlan(i: { schedule; splits; sessions; daysOff; today: string; now: number }): SplitPlan
```

**Algorithm** (T = today):

- **planDay(s):** a session's plan day is T if it is in `trainedTodaySessions(sessions, T, now)` (the QA8-4 rule, dates.ts:84-86). Otherwise it is `s.day`.
- **Sessions used:** only those with a plan day from T-17 to T. Keep one session per (splitId, planDay), the one with the earliest `startedAt`, and order them by planDay, then `startedAt`. Sessions after T are ignored, so `readinessSeries` never sees future sessions.
- **own(d):** the split in `schedule[weekdayOf(d)]`, or null when:
  - that id is not in `splits`; or
  - d is before T and d is in `daysOff` (RG-19, models.ts:526).

  Today's own split is kept even on a day off, so the Today card can still show "Day off".

1. **On-day.** A session counts for its own day when own(planDay) is its split.
2. **Early or late.** Each session not yet counted, in order:
   - **Early:** let E be the first day in (D, D+3] where own(E) is not null. If own(E) is this session's split and E is not yet counted, the session counts for E.
   - **Late:** otherwise, take the latest day P in [D-3, D-1] where own(P) is this split and P is not yet counted. The session counts for P.
   - **Neither:** the session counts for no day.

   A day counts at most one session.
3. **Owed.** A split is owed only when it was **displaced**: own(d) has no session counting for it, and some other session has planDay = d.
   - It stays owed until a later session of that split is logged, or until its own weekday comes round again.
4. **Walk.** Go through the days from T-14 to T+7. At each day d:
   - Remove owed items whose own weekday is d, or that a session after their missed day has paid.
   - If own(d) was counted by a session **before** d (done early), the day goes to the **oldest** owed split. Skip any split whose own weekday is d+1, so no split is placed the day before its own day.
     - With no owed split, the day is "done early".
     - An item placed on a future day, or on today when no session has been logged today, is not placed again.
   - Otherwise the day keeps own(d).
5. **Outputs.**
   - `today` = the result for T, with `off` = whether T is in `daysOff`.
   - `doneEarly` is set when today's own split was counted early and nothing moved in.
   - `next` = the first day in (T, T+7] that has a split.
   - `days` = the results for T..T+7.

**Why this rule and not the others:**
- **Calendar only (current main):** names the split just done. This is the bug.
- **Full rotation** (always the most overdue split on the next training day): one miss pushes every split off its weekday for good. With three rest days a week, nothing brings the week back in line.
  - That contradicts the recorded meaning of the schedule: "Which split on which weekday. Reminders and streaks follow it." (src/escobar/palace/registry.ts:91).
  - It also breaks the spacing the owner chose.
- **"Earliest unfilled slot" matching:** if last Sunday's SPLIT 3 was missed, Saturday's SPLIT 3 would count as last week's make-up, and the app would again say "SPLIT 3 is next on Sun". His history cannot be checked from here.
- **"Any slot within 3 days":** the extra Legs sessions on Sun and Mon in tests/recovery-bug17.test.ts:78-85 would take Wednesday's Legs slot, and that test would fail.
- **Owing every missed slot:** a plan set up mid-week would create debts that never existed, because nothing records when the schedule was set.

"Most overdue" survives as rule 4: the oldest owed split goes first.

**Edge cases:**

| # | Case | Result |
|---|---|---|
| 1 | Owner: Sat plan SPLIT 2, did SPLIT 3; Sun plan SPLIT 3 | SPLIT 3 counts early for Sun, SPLIT 2 is owed and moves to Sun. Next is SPLIT 2 on Sun. Sunday's card shows SPLIT 2 under "Moved from Sat", and Sunday's reminder names SPLIT 2. |
| 2 | Split done early on a rest day | The next planned day of that split is done early. Next skips it. That day shows "Done Thu" and gets no reminder. |
| 3 | Two splits in one day | Each counts for one slot. The card already shows "A + B done" (Today.tsx:72). |
| 4 | Rest day after, or nothing in 7 days | `next` is null, and the advice ends "Recover well." (readiness.ts:327). |
| 5 | A split that is on no weekday | It counts for no slot. Today's split is owed and waits for a freed day. |
| 6 | Same split twice a week | One session covers one slot. Legs today and Legs tomorrow keeps tomorrow as next. A on Tue when Tue was B: A covers Thu early, so B moves to Thu. |
| 7 | Past session logged later | It counts on its own day straight away. For a past day, later sessions are ignored. |
| 8 | Week boundary | The window rolls across days, not calendar weeks. A Sun-to-Mon swap works. |
| 9 | Split renamed or deleted | Matching uses splitId, never the name. A deleted split's sessions count for nothing. Past days use the current schedule; that limit is accepted. |
| 10 | No schedule | `today`, `next` and `doneEarly` are all null. No rotation is invented. |
| 11 | Day off | Today's day off keeps its split with `off` (needed by the R6 gate block). A past day off has no slot and owes nothing. |
| 12 | Session across midnight | Inside 6 hours it counts as today (QA8-4). After 6 hours its stored day applies. That switch at the 6-hour mark is a known limit, and a test pins both sides. |

## Consumers (all on the one function)

- **selectors.ts:**
  - Add field computeds for `schedule`, `splits` and `daysOff`.
  - Add `todayPlan = computed(splitPlan(...fields, today, minuteNow))`. It must never read `state.value` as a whole.
  - `scheduledSplit` becomes today's split when it is not a day off, otherwise undefined (UI-R03).
  - The readiness `next` comes from `todayPlan.next`.
  - Delete `scheduledSplitId` and the old resolver.
- **rules.ts:**
  - `derive()` builds the plan once and adds it to `Derived`.
  - `readinessSeries` builds a plan per day D, with now = D 23:59:59.
  - Delete `nextScheduledSplitOf`.
  - Rewrite `recovery.scheduled-conflict`:
    - **Day off:** return nothing.
    - **Any session today:** if today has neither a split nor `doneEarly`, return nothing. Otherwise:
      - `worst` is the least-recovered, not-ready muscle among the primary muscles of the splits done today, taken from `ctx.splits` by splitId. If a split no longer exists, use the exercises that session logged.
      - Output the done-today insight with id `recovery.done-today:<first done splitId>`.
      - The `Next:` line and its warning use `plan.next`.
      - It never warns about today's own plan. This revises QA8-1 point 3.
    - **No session today:** today's split, or nothing. Warn as now. **Leave the warning lines (:269-279) byte-identical**, because AUD-20 follow-up (2) owns the "Below 60%" literal.
- **escobar/tools/context.ts:**
  - Memo `splitPlanOf(ctx)`.
  - `scheduledSplitFor` reads today's split from the plan, and is undefined on a day off.
  - Delete `nextScheduledSplitFor`.
  - `readinessToday` uses `plan.next`.
- **brief.ts and read.ts:** the brief and `get_overview` read the plan (wording under UI copy).
- **reminders.ts and notifications.ts:**
  - `resyncReminders` passes `planned: Map<day, splitId|null>` built from `days`.
  - `syncTrainingReminders` takes it as an optional field in its last options object.
  - For a day in the map, use the mapped split, or no reminder when it is null. Otherwise use `schedule[weekdayOf(day)]`, as now.
- **Today.tsx and the new src/slices/today/cardState.ts:**
  - `sessionCardState({ live, doneCount, plan })` returns `{ status: 'live'|'done'|'ready'|'off'|'early'|'rest', eyebrow, split? }`.
  - Today.tsx renders from it. The 'early' state is: the eyebrow, the split name as h2, and a "Choose a workout" button that goes to Train.
  - The 'done' card is unchanged. It is already honest because it reads the sessions (Today.tsx:72).
- **Train tab default chip:** not changed. It never uses the schedule; it defaults to `s.splits[0]` (Train.tsx:296).
- **readiness.ts:** not changed. Only its inputs change, so readiness.test.ts:124-145 stays valid.

## UI copy (AGENTS.md: no explaining, headings 1-3 words)

New user-facing strings, the only ones allowed:
- Today card eyebrow, moved split: `Moved from {Ddd}`, e.g. "Moved from Sat".
- Today card eyebrow, split already done early: `Done {Ddd}`, e.g. "Done Thu".
- Coach done-today line when two or more splits were done today: `{A} + {B} are done for today.` With one split it stays the existing "{A} is done for today."

Reused unchanged: "Scheduled today", "Choose a workout", "Done today: {names}" (joined with " + "), "Next: {split} on {Ddd}.", "Rest and recover.", "Today's session is done. Recover well; {split} is next on {Ddd}.", "{split} is ready when you are."

For Escobar only (not shown in the app):
- brief: `scheduled {name} (splitId {id}), moved from {weekday}`
- brief: `day off, {name} planned (splitId {id})`
- brief: `{name} done early on {weekday}`
- `get_overview.scheduled` gets an optional `movedFrom: Weekday`

These are worked out from the schedule and sessions Escobar already reads, so no new kind of data is sent.

## read_first

- .claude/skills/builder/SKILL.md and gotchas.md
- docs/supervisor/verify/BUG-38.md (both investigator reports)
- docs/qa/LIVE-QA-8.md:11-43 (QA8-1 to QA8-4)
- src/core/dates.ts:79-103; src/brain/readiness.ts:141-183, 241-250, 326-336; src/brain/coach/rules.ts:168-195, 229-280, 736-767; src/app/selectors.ts:18-74; src/escobar/tools/context.ts:32-76
- **Pins that must stay green unchanged:**
  - tests/recovery-bug17.test.ts:65-85
  - tests/coach.test.ts:260-273
  - tests/readiness.test.ts:117-145
  - tests/dates.test.ts:83-92
  - tests/escobar/read.test.ts:39-44 (Pull scheduled; sixMonthsState sessions are all on their own day)
- **Gate block R6** (scripts/screenshot-gate.mjs:1346-1368): it schedules one split on every day and needs "Take today off", then "Day off". The design keeps today's slot on a day off, so it passes. Do not edit that block.
- **HANDOVER.md:909, AUD-20 follow-up (2):** leave rules.ts:269-279 byte-identical.

## write_scope

- **New:** src/brain/splitPlan.ts, src/slices/today/cardState.ts
- **Changed source:** src/app/selectors.ts, src/brain/coach/rules.ts, src/escobar/tools/context.ts, src/escobar/context/brief.ts, src/escobar/tools/read.ts, src/slices/today/Today.tsx, src/slices/settings/reminders.ts, src/native/notifications.ts
- **New tests:** tests/split-plan.test.ts, tests/today-card.test.ts
- **Changed tests:** tests/coach.test.ts, tests/reminders.test.ts, tests/session.test.ts, tests/escobar/read.test.ts, tests/escobar/brief.test.ts
- **Gate:** scripts/screenshot-gate.mjs, one add-only block named `BUG-38`
- **Docs:**
  - docs/COACHING-DECISIONS.md: a new entry "## D-BUG38: next split follows the sessions done (BUG-38 builder, date)" containing the rule above.
  - docs/qa/LIVE-QA-8.md:20 and :23: a one-line note "Revised by D-BUG38".

## reserved_paths

- **No saved-data change:** src/core/models.ts, src/core/store.ts and migrations
- **Not needed:** src/brain/readiness.ts. If a change there turns out to be needed, stop and tell the supervisor.
- **Out of scope:** src/slices/workout/Train.tsx, src/ui/styles.css (use existing classes only)
- **Shared, owned by others:** tests/theme.test.ts; every other task's gate block; native/wear/**, src/native/wearEngine.ts, src/slices/settings/WatchLab.tsx and Settings.tsx; escobar-worker/**; .github/**; package.json and package-lock.json; src/app/App.tsx and src/main.tsx

## Acceptance

Owner fixture "OWN":
- **Splits:**
  - S1 'SPLIT 1 - UPPER BODY' (lib_barbell_bench_press)
  - S2 'SPLIT 2 - LOWER AND CORE' (lib_seated_leg_curl)
  - S3 'SPLIT 3' (lib_lat_pulldown)
  - S4 'SPLIT 4 - CONDITIONING' (lib_standing_calf_raise)
- **Schedule:** {tue S1, thu S4, sat S2, sun S3}. Only Sat and Sun come from the owner's report; the other days are stand-ins.
- **Sessions:** S1 2026-09-29, S4 2026-10-01, and S3 on Sat 2026-10-03 from 17:00 to 18:00 local.
- **Now:** Sat 19:00 local. Build it with local wall-clock dates, as in tests/reminders.test.ts:30, so `npm run test:tz` passes.
- **OWN-bare:** the same, with only the Saturday session.

"Red on main" means the test fails when run on 000918ef for the reason given. A new-API test that is red only because the module is missing must have a behavioural partner marked (b).

| ID | Criterion | Evidence (test name, fixture) | Red on main because | Mutation (must turn it red) |
|---|---|---|---|---|
| AC1 | Owner case in the planner | split-plan.test "BUG-38 owner: Sat SPLIT 3 done, SPLIT 2 skipped → next SPLIT 2 on Sun, moved from Sat, never SPLIT 3" (OWN and OWN-bare) | new module | M1: drop the early step (rule 2) |
| AC2 | (b) Owner case in the coach | coach.test "BUG-38 owner: 'Done today: SPLIT 3', 'Next: SPLIT 2 - LOWER AND CORE on Sun.', no scheduled-conflict, no text containing 'SPLIT 3 is next'" (OWN) | main gives no done-today insight (SPLIT 2's hamstrings are untrained) | M2: rules.ts derive/conflict reads `next` from the calendar |
| AC3 | (b) Owner case in readiness on Today and Escobar | split-plan.test "BUG-38 owner: todayReadiness.postSessionAdvice === \"Today's session is done. Recover well; SPLIT 2 - LOWER AND CORE is next on Sun.\"" (OWN plus today's check-in, via replaceState and setSystemTime; assert not null first); escobar/read.test "BUG-38: readinessToday gives the same sentence" | main says "SPLIT 3 is next on Sun" | M3: context.ts `next` back to `nextScheduled` |
| AC4 | (b) Readiness history | split-plan.test "BUG-38: readinessSeries on Sun scores Sat with SPLIT 2 next, even after S2 was done Sun" (OWN plus S2 on Sun 10-04, index 1) | main says SPLIT 3 | M4: planner keeps sessions after T |
| AC5 | Sunday display | today-card.test "BUG-38 owner Sunday: ready, 'Moved from Sat', SPLIT 2"; gate block BUG-38 probe 1, seeded relative to today: yesterday = A, today = B, B session yesterday; expects "Moved from {Ddd}", A as h2, "Start {A}" | gate shows "Scheduled today / B" | M5: eyebrow always "Scheduled today" |
| AC6 | Done-early day | split-plan.test "C done Thu → Fri doneEarly {C, Thu}; next on Thu is not C"; today-card.test "early: 'Done Thu'"; gate probe 2 | gate shows "Scheduled today / C" | M6: map doneEarly to 'rest' |
| AC7 | Repeated split stays valid | split-plan.test "Legs today and tomorrow, Legs done today → next Legs tomorrow"; recovery-bug17.test.ts:65-85 unchanged and green | n/a (guard) | M7: early may take any slot within 3 days (bug17 :78-85 turns red) |
| AC8 | No owed debt that never existed | split-plan.test "plan set mid-week, no sessions → nothing moved; a session on a rest day owes nothing" | new module | M8: owe every missed past slot |
| AC9 | Most overdue first, no day-before placement | split-plan.test "two displaced splits → the oldest fills the freed day" (Mon A, Tue B, Thu C, Fri D; C Mon, D Tue, C Wed); "a split is never placed the day before its own day" (Mon Z, Tue Y, Wed Z; Y on Mon → next Z on Wed) | new module | M9a: newest owed first; M9b: remove the guard |
| AC10 | Late make-up; paid debts | split-plan.test "A missed Mon, done Tue → next Wed B"; "S2 owed, S2 done Wed with S4 also done Wed → Thu done early, next S2 Sat with no movedFrom" | new module | M10a: drop the late step; M10b: drop the paid-debt removal |
| AC11 | Midnight (QA8-4) | split-plan.test "QA8-1 fixture: at 01:00 today = own S2; at 07:00 doneEarly {S2, Fri}" | new module | M11: use `s.day` for today's sessions |
| AC12 | Day off (UI-R03) | coach.test "BUG-38/UI-R03: no scheduled-conflict on a day off" (red on main); today-card.test "off keeps the split"; R6 gate block green | main warns on a day off | M12a: apply daysOff to today; M12b: drop the day-off check in the rule |
| AC13 | After any session today, no warning about today's plan | coach.test revisions (exact edits below); new "SPLIT 2 trained Fri counts as Sat's, done early: no warning Sat" (old fixture) | main warns | M13: restore "a different split keeps the warning" |
| AC14 | Reminders | reminders.test "BUG-38: Sunday's reminder says 'SPLIT 2 - LOWER AND CORE is ready when you are.'" (OWN, time 20:00); "a day done early gets no reminder" | main says "SPLIT 3 is ready…" | M14: ignore the `planned` map |
| AC15 | Readiness does not recompute on live-set edits | session.test "BUG-38: with a schedule, typing into a live set keeps todayReadiness identity" (assert not null first) | `nextScheduledSplit` reads all of `state.value` | M15: the plan computed reads `state.value` |
| AC16 | Escobar stays honest | read.test "OWN Sunday: overview.scheduled is SPLIT 2 with movedFrom 'sat'"; brief.test "brief contains 'moved from sat'"; brief.test "day off line" | main gives SPLIT 3 / no day-off text | M16: `scheduledSplitFor` back to the weekday lookup |
| AC17 | One source of truth | split-plan.test "source scan": `nextScheduled(` appears only in src/core/dates.ts; `nextScheduledSplitOf`, `nextScheduledSplitFor` and `scheduledSplitId` are gone from src; `schedule[weekdayOf(` appears only in weekly.ts, rules.ts (once, the week-start helper at :148), notifications.ts (once) and splitPlan.ts | the copies exist | M17: add back one `nextScheduled(` call in rules.ts |
| AC18 | Remaining edges | split-plan.test: no schedule; unscheduled split; renamed split (same id, new name) and deleted split; two splits in a day; Sun-to-Mon swap; past session logged later (S2 logged for Sat → next Tue S1) | new module | M18: match on splitName instead of splitId |
| AC19 | No regression | `npm run check`, `npm run test:tz` and the gate on the merged head | n/a | n/a |

**Exact edits to pinned tests** (record in D-BUG38; no other test expectation may change; if one does, stop and tell the supervisor with the diff):
- **coach.test.ts:275-282**
  - Rename it to "BUG-38: after any session today the coach names what was done and never warns about today's plan".
  - In its fixture, change `priorHamSession`'s splitId from `'split_lower'` to `'split_push'`, so SPLIT 2 is still pending.
  - Expect no `scheduled-conflict`, and a `recovery.done-today:split_chest` insight with title "Done today: Push" and means containing "Next: Upper on Mon".
- **coach.test.ts:284 onward** ("nothing done today, byte-identical")
  - Change only `priorHamSession`'s splitId to `'split_push'`. Every assertion stays as it is.
  - The old fixture (SPLIT 2 trained Friday) now means "done early", and the new AC13 test pins it.

## design_reference

D-BUG38 above; LIVE-QA-8 QA8-1 to QA8-4; RG-19 (models.ts:526); the investigator reports in docs/supervisor/verify/BUG-38.md.

**Design check-in:** push splitPlan.ts and tests/split-plan.test.ts first, then post a short design note on the PR covering rules 1-5 as built and the test list. Wire the consumers only after the supervisor's next tick.

## connectivity

Offline only. No calls to the live coach, AI or Worker, and no network.

## verification

- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run test:tz`
- `npm run build`
- `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`
- Red-on-main proof: run the AC2, AC3, AC4, AC5, AC6, AC12, AC13, AC14, AC15, AC16 and AC17 tests and probes on 000918ef and paste the failing lines.
- **Device check by the owner on the APK:**
  1. On a planned day, train a different split. Readiness should name the skipped split as next.
  2. Next day: the Today card shows "Moved from {day}", and the reminder names that split.

## risk_and_recovery

- **Results change in tests that use a schedule** (28 test files set one). Mitigation: only the listed edits are allowed; anything else means stop and escalate.
- **A split moved next to one that shares muscles** (SPLIT 3 then SPLIT 2). Readiness and the warning measure SPLIT 2's real muscles; the app never forces a swap.
- **The 6-hour midnight switch.** Pinned by AC11 and recorded.
- **Past days are matched against the current schedule** after a mid-week edit. Same limit as streak and adherence; recorded.
- **Speed.** The planner runs once per `readinessSeries` day. Pre-filter sessions to [T-17, T]; tests/perf/budgets.test.ts must stay green.
- **Snoozes on done-today insights.** The id is now keyed by the split done, so an old snooze may not match. The insight lasts one day; accepted.
- **Undo.** Revert the PR. No data shape changes.

## Out of scope

- The Train tab default chip (Train.tsx:296 uses `splits[0]`, not the schedule)
- Weekly counts, streak and adherence (weekly.ts, weeklyReview.ts)
- The Coach weekly grid (Coach.tsx:174-186)
- Rotation or cascade modes, and any saved field
- UI-R05 (onboarding draft)
- Watch code

## return

- Draft PR URL and head sha
- Table: AC to test name to red-on-main output to green output
- Mutation table (M1 to M18, each seen red, then restored)
- Changed paths checked against write_scope
- `You will notice:` After you train a different split than planned, the app shows the skipped split next and moves it into the freed day.
- The HANDOFF block

---

**For the owner:**

1. The app picks "next" from the weekday plan alone and never checks what you actually trained. After SPLIT 3 on Saturday it said SPLIT 3 was next on Sunday and judged your readiness on muscles you had just worked.
2. With the fix it reads your sessions. A split you already did counts as done, and a split you skipped by training something else moves into the day that frees up. Your weekly plan stays as you set it, and nothing new is saved.
3. Example: Saturday was SPLIT 2 LOWER AND CORE and you did SPLIT 3. Today will say "SPLIT 2 - LOWER AND CORE is next on Sun". On Sunday the card shows SPLIT 2 marked "Moved from Sat", and the reminder names SPLIT 2.
4. After that your normal week carries on. Your report only confirms Sat = SPLIT 2 and Sun = SPLIT 3; the other days in the tests are examples.

## Investigator reports (Opus, on main 000918e)


=== agent a99203279ea084e36 ===
Main at 000918e. The current checkout (9f71c313) has no `src/` or `tests/` diff against it, so every line number below holds for both. Nothing was edited.

## A. How a finished session is tied to a split, and how "done today" is decided

**The link to a split**
- `Session.splitId` and `Session.splitName` (models.ts:171-172) come from `ActiveSession.splitId` (models.ts:214).
- `startSession(split)` sets it to whatever split the user started (session.ts:83).
- `finishSession` copies it across (session.ts:566-568):
  - `splitId: a.splitId`
  - `splitName: split?.name ?? 'Workout'`, a snapshot of the name at finish time
  - `day: dayKey(logging.trainedAt)`
- `logPastSession` does the same (session.ts:636-638). `resolveSessionTiming` can move `day` later (session.ts:614).

**The plan**
- `AppState.schedule: Record<Weekday, string|null>` (models.ts:495) holds one split id per weekday.
- There is no order, no rotation, and no field that says which planned slot a session filled.
- Nothing remembers a skipped split. I searched `src` for rotation, missed or next-split logic and found none.

**"Done today"**
- `trainedTodaySessions` (dates.ts:84-86) counts a session when either:
  - `s.day === today`, or
  - `dayKey(s.endedAt) === today` and it ended within the last 6 hours.
- `trainedToday` (dates.ts:88-90) is the same check as a yes/no.
- It never looks at the split, so any session marks the whole day done.
- The selector `sessionsToday` (selectors.ts:72) wraps it.

## B. Where "next" and "today's split" come from

- **`nextScheduled(schedule, today)`** (dates.ts:93-103) walks forward from tomorrow, up to 7 days, and returns the first weekday with a split. Its only inputs are the schedule and the date; sessions are never read.
- **Three copies resolve it to a Split:**
  - `nextScheduledSplit` (selectors.ts:23-28)
  - `nextScheduledSplitFor` (escobar/tools/context.ts:58-63)
  - `nextScheduledSplitOf` (brain/coach/rules.ts:169-174)
- **Raw `nextScheduled` is also called directly** at rules.ts:242.
- **"Today's split" is the weekday lookup**, `schedule[weekdayOf(today)]`, found at:
  - selectors.ts:20-21 (`scheduledSplitId`, `scheduledSplit`)
  - context.ts:52-56 (`scheduledSplitFor`)
  - rules.ts:180, 232 and 749, written inline
- Neither "next" nor "today's split" checks what was actually trained.
- **Selector side issue:** `nextScheduledSplit` subscribes to the whole `state.value` and returns a new object each time (selectors.ts:23-28). With a schedule set, each live-set edit therefore re-runs `todayReadiness`. The memo test at session.test.ts:321-331 misses this because its fixture has no schedule, so readiness and "next" are both null. That is from reading the code; I did not run it.

## C. Every consumer, and what it shows in the owner's case

The owner's case is Saturday 2026-10-03 after doing SPLIT 3. The on-screen text "SPLIT 3 is next on Sun" can only come from `schedule.sun` = SPLIT 3 (dates.ts:95-101 and readiness.ts:327). What Saturday itself is scheduled as cannot be checked: it may be SPLIT 2 or a rest day, so several rows give both cases.

**1. Readiness core** (brain/readiness.ts)
- Inputs `scheduledSplit` and `next` (:141-143).
- `isDoneToday = trainedToday(...)` (:180). Then `activeSplit = isDoneToday ? next?.split : scheduledSplit` (:182), and the target muscles come from that split (:183).
- Driver text (:246-249): "the muscles for {next} on {day} are not fully recovered".
- `postSessionAdvice` (:326-328): "Today's session is done. Recover well; {next} is next on {day}."
- Owner's case: the target muscles become SPLIT 3's, which he just trained, so recovery reads under 0.6. That adds the driver and also counts recovery as "low" (:297).
- Because load is also low, `lowCount` is 2 or more, so the load part is not lifted to green (:306-309).
- So the score itself ("Amber 60", `loadAdvice` no_increase at :321) is measured on the wrong muscles, not just worded wrongly. The exact percentages need his data.
- `readinessSummaryText` (:334-336) repeats the advice text.

**2. Today screen, readiness card** (Today.tsx:178-198)
- Drivers on :194, advice on :186.
- This is exactly the owner's screenshot text.

**3. Today screen, session card** (Today.tsx:42-44, 67-75)
- Status is `'done'` whenever `sessionsToday` is non-empty.
- It shows "{session.splitName} done" and "N sets logged".
- Owner's case: "SPLIT 3 … done, 21 sets logged". This is correct, because it reads the session, not the schedule.
- The other states read `scheduledSplit`:
  - "Scheduled today {split} / Start {split}" (:77-86)
  - "Day off … Train anyway" (:88-93)

**4. Today screen, Coach card** (Today.tsx:134-145)
- Shows the top-priority insight (rules.ts:718-724 sorts by priority).
- The amber readiness insight has priority 380, so "next on Sun" may show twice. Whether it was on top for him depends on his other insights and cannot be checked.

**5. Coach rule `readiness.today`** (rules.ts:560-590)
- `derive()` (rules.ts:176-195) passes `next: nextScheduledSplitOf(...)` at :185.
- Amber (:581-584) gives the title "Readiness: amber", the drivers as text, and `postSessionAdvice` as the action. Red is handled the same way at :570-576.
- Owner's case: the same wrong SPLIT 3 text appears on the Coach tab.

**6. Coach rule `recovery.scheduled-conflict`** (rules.ts:229-280)
- It takes today's scheduled split (:232). If a primary muscle of that split is not ready (:236), it shows "Done today: {scheduled split}" plus "Next: {nextScheduled} on {day}" (:241-266). That happens only if:
  - a session today has the *scheduled* `splitId`, or
  - the worst muscle was trained today.
- Otherwise it warns "{split} today, but X is only N% recovered … Swap to another split today" (:270-278).
- Owner's case if Saturday = SPLIT 2:
  - Leg and core muscles all ready: no insight.
  - One not ready and not hit by SPLIT 3: he is still told "SPLIT 2 … today, but … Swap to another split today", after he has trained.
  - SPLIT 3 hit a SPLIT 2 primary muscle today: the card says "Done today: SPLIT 2 LOWER AND CORE" (wrong split) with "Next: SPLIT 3 on Sun".
- Owner's case if Saturday is a rest day: nothing (:233).
- I cannot check which applies, because SPLIT 3's exercises are unknown.

**7. Readiness history** (`readinessSeries`, rules.ts:740-757)
- Every past training day is scored against that day's next scheduled split (:753).
- This feeds:
  - `deloadOffer`, which offers a lighter week after 3 red days in the last 5 (rules.ts:759-765, deload.ts:42, 84)
  - Escobar `get_readiness` history (read.ts:273-274)
  - the `readiness_history` card (show.ts:122-126)
- So a wrong "next" can add red days and trigger a lighter-week offer. How much it does so cannot be checked.

**8. Load targets**
- `todayReadiness` is used by:
  - the Train preview and live targets (Train.tsx:151)
  - Coach `insightTarget` (Coach.tsx:146)
  - Escobar `progressionCtxFor` (context.ts:104)
- Owner's case: any session started later that day gets `no_increase`.
- `insightTarget` also uses the scheduled split's planned sets (Coach.tsx:140-141).

**9. Train tab** (Train.tsx:294-300, 343, 370)
- The default chip is `s.splits[0]`, not the schedule.
- The "Start {split}" button follows that chip.
- Owner's case: the first split in his list, probably SPLIT 1. This does not use the schedule at all.

**10. History tab** (History.tsx:70, 155-162)
- "Start {scheduledSplit}" appears only when there are no sessions, so the owner never sees it.

**11. Weekly stats** (selectors.ts:54; weekly.ts:53-76, 87-93, 111-114)
- Workouts this week are counted against the number of scheduled days not taken off.
- "Strong week" / "You hit your planned sessions" appears once that count is met, whatever splits were trained. SPLIT 3 twice counts as 2, and a skipped SPLIT 2 is never noticed.
- Shown on Today "Current week" (Today.tsx:108-115).

**12. Streak** (weekly.ts:124-139)
- Any trained day counts, and the split is ignored.

**13. Adherence** (weeklyReview.ts:92-105, used at :323-345)
- A scheduled day counts as done if any session happened that day. Training SPLIT 3 on a SPLIT 2 day counts as done.

**14. Reminders**
- `resyncReminders` (slices/settings/reminders.ts:15-24) adds today to `completed` if `sessionsToday` is non-empty, so today's reminder is dropped.
- `syncTrainingReminders` (native/notifications.ts:144-153) builds the body "{schedule[weekday] split} is ready when you are."
- Owner's case: Sunday's reminder says "SPLIT 3 … is ready when you are." the day after he did SPLIT 3.
- Today's body is only replaced by the readiness summary when today is not completed (:153), so it has no effect here.

**15. Escobar context** (escobar/tools/context.ts:65-75)
- `readinessToday` uses `scheduledSplitFor` and `nextScheduledSplitFor`, so it gives the same wrong result as the Today screen.

**16. Escobar `get_overview`** (read.ts:122-142)
- Returns `scheduled` (Saturday's split: SPLIT 2 or null) next to `trainedToday: ['SPLIT 3…']` and the readiness band and score.
- Escobar sees both and gets no reconciled answer.

**17. Escobar `get_readiness` and `readiness_gauge`** (read.ts:266-285, show.ts:118-121)
- The SPLIT 3 driver is not a health driver, so `redactDrivers` (context.ts:87-89) passes it to Escobar.

**18. Escobar brief** (escobar/context/brief.ts:78-92)
- Builds "scheduled {Saturday split} (splitId …)" or "rest day", then the readiness advice including "(Today's session is done. Recover well; SPLIT 3 is next on Sun.)", then "done today: SPLIT 3".

**19. Escobar `propose_today`** (actions.ts:183-184, schema.ts:161)
- Refuses another split when `explicit === false`, with the message "today's scheduled split is {scheduled}".
- After a session it matters little.

**20. Coach weekly schedule card** (Coach.tsx:174-186)
- Static coloured dots per weekday. It never marks anything done.

**21. Watch bridge**
- `src/native/watch.ts` has no split or schedule reads. `src/native/wearEngine.ts` and `native/wear` do not exist at this commit. Not affected.

**Sunday (the next day), from the same code**
- The Today card reads "Scheduled today SPLIT 3 / Start SPLIT 3" (Today.tsx:77-86).
- Readiness: "the muscles you would train today are not fully recovered" (readiness.ts:249).
- The coach may say "SPLIT 3 today, but X is only N% recovered … Swap to another split today" (rules.ts:273-277).
- The reminder says "SPLIT 3 … is ready when you are."
- Nothing points to the skipped SPLIT 2.

## D. Tests that pin current behaviour

**Would need to change** (each pins "next = the next weekday in the plan, whatever was done", or today's plan after a different split was trained):
- **readiness.test.ts:124-132:** a bench session today, with `next: Upper` (also bench), must say "the muscles for Upper on Mon …" and "Upper is next on Mon". This changes if `readiness()` learns what was trained. If only the caller picks a different `next`, the test still passes.
- **coach.test.ts:276-282:** "a different, unscheduled split done today keeps the old warning". This is exactly the owner's Saturday if it was SPLIT 2. It comes from an earlier spec decision, docs/qa/LIVE-QA-8.md:20 (QA8-1 point 3), so the revision must be recorded there too.
- **recovery-bug17.test.ts:84-90:** the same split (Legs) is scheduled today and tomorrow, and the note must warn about tomorrow's Legs. A fix that simply skips "the split just done" when picking next would break this legitimate repeated-split case.
- **recovery-bug17.test.ts:65-75:** Legs done today, Legs again in 2 days, with "Done today: legs" expected. Same risk as the line above.

**Probably unaffected** (they pin which sessions count as done today, not the next split):
- dates.test.ts:83-92 (`nextScheduled` alone)
- readiness.test.ts:134-145 (byte-identical output when nothing was done today; the summary text)
- coach.test.ts:259-273 (the owner's QA8-1 case: SPLIT 2 done, "Next: Upper on Mon")
- escobar/brief.test.ts:85-110 and escobar/read.test.ts:342-361

**Weak guard:**
- session.test.ts:321-331 (the readiness memo test) passes trivially, as noted in B. A new "next" selector should read the fields it needs (schedule, splits, sessions) and get a test that has a schedule.

**Not covered:** no gate probes cover the Today card, readiness advice or "next" text in `scripts/screenshot-gate.mjs`. Reminder tests never assert the reminder body.

## E. Notes for the fix

- **One place, not three.** The resolver is copied three times (B) and called raw at rules.ts:242. A fix should create one shared helper that also reads sessions, and change all four places.
- **"Done today" ignores the split** (dates.ts:84-86). That is why readiness flips to "done" mode while the coach rule still thinks the scheduled split is pending. The two need one shared definition.
- **Repeated splits are legitimate.** The plan can schedule the same split on consecutive days (recovery-bug17 tests), so "just done" cannot simply mean "skip this split id".
- **Saved data.** Remembering a skipped split or a planned order would add new kinds of saved data, which the owner must approve. Working it out from the existing `sessions[].splitId` and `day` together with `schedule` needs no change to stored data.

=== agent a9b927259f3caec1a ===
The plan is stored as fixed weekdays. No decision anywhere says it is an ordered rotation. The app never checks whether the split it names as "next" has already been done since that split's last slot. The fix can be pure derivation from data the app already saves, with no new saved data.

All refs are at main 000918e. The worktree head 9f71c313 differs from main only in `docs/supervisor/HANDOVER.md`, so every line below holds for main.

## (1) Fixed weekdays or ordered rotation?
**Fixed weekdays, by the model and by every decision found.**
- **Model:** `schedule: Record<Weekday, string | null>` (src/core/models.ts:495, emptySchedule :534-536). `Split` has no order or sequence field (models.ts:192-200). The only "order" is the position in the `splits` array (models.ts:494).
- **Feature text:** "Which split on which weekday. Reminders and streaks follow it." (src/escobar/palace/registry.ts:91).
- **Editor:** one select per weekday (src/slices/coach/Coach.tsx:203-207). "Quick arrange" lays the split list, in list order, onto fixed day sets and wraps round: `sched[d] = s.splits[i % s.splits.length]` (Coach.tsx:193-198). This is the only place where list order works like a rotation, and only when arranging.
- **Escobar:** `propose_schedule` is "a split id or null (rest) for each day" (src/escobar/tools/schema.ts:159). `plan_week` is a "7-day grid: split per day" (docs/ESCOBAR-ARCHITECTURE.md:142).
- **QA8 decisions:**
  - QA8-1: "Find the next scheduled split by walking `ctx.schedule` forward from tomorrow, at most 7 days." (docs/qa/LIVE-QA-8.md:18)
  - QA8-2: "the target muscles become the NEXT scheduled split's primary muscles (the same helper as QA8-1)" (LIVE-QA-8.md:37).
  - Implemented as a calendar-only walk in src/core/dates.ts:94-102.
  - QA8-1 also decided "A different, unscheduled workout done today that didn't train the scheduled split's muscles keeps the old warning." (LIVE-QA-8.md:20)
- **Gap in QA8:** QA8 assumed the split done today is the scheduled one. Its tests never cover "a different split done today":
  - tests/readiness.test.ts:124-132 passes `next` in directly.
  - tests/dates.test.ts:83-92 uses only the schedule.
- **No rotation decision exists.** I searched docs/COACHING-DECISIONS.md, COACHING-PLAN.md, ADAPTIVE-COACH.md, ESCOBAR-ARCHITECTURE.md and docs/qa for rotation, swap, skip and reorder. The nearest is F3.1, which only tells the user to "suggest a reorder, a swap to another split, or an easy session" (COACHING-PLAN.md:194). The app never records or works out that swap.
- **Precedent:** streak and adherence count any session on a scheduled day, whatever its split (src/brain/weekly.ts:124-138). So for adherence, the schedule already means "training days".
- **Owner intent:** the owner's numbering (SPLIT 1-4) and his complaint suggest he expects the app to follow what he actually trained. Whether he wants a strict rotation (after SPLIT 3 comes SPLIT 4) is not verifiable.
- **His schedule:** what follows is inference. Sun = SPLIT 3 is implied by "SPLIT 3 is next on Sun", because `nextScheduled` walks from tomorrow (dates.ts:96-100). Sat = SPLIT 2 fits LIVE-QA-8.md:3, where the brief said "SPLIT 2 - LOWER AND CORE today" on Sat 26 Sept. His current schedule is not verifiable from the repo.

## (2) Existing "swap" concepts
None records which split replaced which. The session alone records which split was done.
- **Escobar's exercise swap:** `TodayChange {kind:'swap', from, to}` (models.ts:421-427), held in `escobar.todayOverride` (models.ts:429-434, :458). `swappedFromToday` (src/slices/workout/Train.tsx:170-175) reads it only when `day === today` and `splitId === split.id`. It swaps an exercise inside one split (D-AUD10-7, COACHING-DECISIONS.md:1672-1674).
- **The person's own exercise substitute:** `ActiveSession.entries[].plannedId` (models.ts:219, QA3-8b), used by D-LT6 (COACHING-DECISIONS.md:877). Also exercise-level only.
- **Split-level, partly:** `TodayOverride.splitId` can name a split that is not scheduled. Its schema text is "Today's scheduled split, or the one they will train." (schema.ts:161). Its guard is actions.ts:181-184; `explicit` is not in the schema, so a different split always passes. Limits:
  - it needs at least one exercise change (actions.ts:185);
  - it is valid only for its day (src/escobar/tools/context.ts:115);
  - it is cleared when that split's session finishes (src/slices/workout/session.ts:583);
  - it never stores the split it displaced.
- **`propose_schedule`:** rewrites the whole week permanently (actions.ts:163-176). It is not a one-off swap.
- **What was actually done:**
  - `Session.splitId`, `splitName` and `day` (models.ts:169-176);
  - `day` comes from the training time, not the logging time (session.ts:568 live, :638 past log);
  - a time edit can move it (session.ts:611-614).
  - So "replaced which" is derivable: `schedule[weekdayOf(day)]` against the `Session.splitId` on that day.

## Where "next" and "today's split" come from (all calendar-only)
The fix needs one shared helper that replaces all of these:
- **`nextScheduled`** (dates.ts:95). Its consumers:
  - selectors.ts:23-28, which feeds the Today readiness card;
  - context.ts:58-63 → `readinessToday` (context.ts:72), which feeds Escobar's brief at brief.ts:81 (the brief also shows "done today" at brief.ts:88-89);
  - rules.ts:169-174 → `derive()` (rules.ts:185) and `readinessSeries` (rules.ts:753);
  - rules.ts:242, the done-today insight body.
- **Today's split, read straight from `schedule[weekday]`:**
  - selectors.ts:20-21, used by Today.tsx:28, :44, Coach.tsx:140 and History.tsx:70;
  - context.ts:52-55, used by read.ts:124 and brief.ts:78;
  - the `recovery.scheduled-conflict` rule (rules.ts:232);
  - reminders: `syncTrainingReminders` gets the raw schedule (src/slices/settings/reminders.ts:23). Sunday's body would be "SPLIT 3 is ready when you are." (src/native/notifications.ts:146-152).
- **A second bug in the owner's case:**
  - If SPLIT 2's least-recovered muscle was trained today (a shared muscle), the insight title is "Done today: SPLIT 2 …". It uses the scheduled split's name (rules.ts:242-265) even though SPLIT 3 was done.
  - Otherwise the "SPLIT 2 today, but X is only N% recovered" warning still shows after he has trained (rules.ts:266-271, by QA8-1's decision).
  - Which of these fired for the owner is not verifiable.
- **Already correct:** the "done" card names what was actually done, `done.map(d => d.splitName)` (src/slices/today/Today.tsx:72).

## Proposed derivation rule (to make the edge cases precise)
Over a rolling window from 7 days back to 7 days ahead, never the Mon-Sun week (`weekStart` is Monday, dates.ts:67-72):
1. Each scheduled slot (a day plus `schedule[weekday]`) that is not in `daysOff` is a slot.
2. Match sessions to slots one-to-one, by `splitId`. Each session fills the earliest unfilled slot of the same split. Use the QA8-4 rule (dates.ts:84-86) for "today".
3. "Next" is the earliest upcoming slot that is still unfilled.
4. A split missed today (its slot was today, it has no session, and today is not a day off) is "owed".

**One product choice, recommended:**
- **(a) Swap (recommended):** the owed split takes the first upcoming slot that a session already filled. The person did this swap themselves, and it keeps a week's muscles covered.
- **(b) Skip:** that filled slot simply reads as rest.
- In either case, never carry an owed split into a slot that would put it on back-to-back days with its own next slot.

## (3) Edge cases and expected results
1. **Skip one split and do the next (the owner's case):** Sat has SPLIT 2 scheduled; he did SPLIT 3, which is scheduled Sun.
   - The card says "SPLIT 3 done" (already correct).
   - Readiness, insights, the brief and Sunday's reminder never say "SPLIT 3 is next on Sun", and never use SPLIT 3's muscles as the next target.
   - With (a), "SPLIT 2 is next on Sun", and Sunday's Today screen and reminder show SPLIT 2.
   - With (b), the next is the first unfilled slot after Sunday.
   - Today's insight must not be titled "Done today: SPLIT 2" and must not warn "SPLIT 2 today".
2. **Do a split early:** on a rest day he does Friday's split X.
   - The X slot is filled, so "next" skips it.
   - On Friday, Today must not show X as "ready".
   - `scheduled-conflict` must not warn "X today, but … recovered" (that recovery drop came from the early session).
   - Friday's reminder does not name X. With (b) it does not fire.
3. **Two splits in one day:** both slots are filled. "Next" skips both, the card shows "A + B done" (Today.tsx:72), and the post-session target muscles are the next unfilled slot's.
4. **Rest day after:** already handled. "Next" walks past days with no split (dates.ts:96-100). With nothing unfilled in 7 days, `next` is null and the advice ends at "Recover well." (readiness.ts:326-328), never naming a done split.
5. **A split not on any weekday:** it fills no slot, so "next" is the regular one. Today's scheduled split stays owed: rule (a) applies only if a later slot is filled; otherwise it waits for its own day. No text claims the done split is "next".
6. **Same split twice a week:** for example Mon A / Thu A, or Quick arrange wrapping round (Coach.tsx:197).
   - One session fills one slot, never two.
   - A done on its slot leaves Thu's A as next.
   - A done on Tue (instead of B) fills Thu's slot. With (a), B moves to Thu only if B's own next slot is not the day after.
   - A late make-up of Monday's A fills Monday's slot, not Thursday's.
7. **A past session logged later** ("Log a past session", session.ts:627-650): it counts on its training day, and the result updates straight away (everything is computed from `state.sessions`).
   - Logging yesterday's missed split removes it from "owed".
   - It never counts as "done today" (dates.ts:84-86).
   - A future start is refused (D-AUD10-2, COACHING-DECISIONS.md:1658).
   - `readinessSeries` evaluates past days with all sessions (rules.ts:740-756), so for a past day the helper must use only sessions on or before that day.
8. **Week boundary (Sun/Mon):** matching is by rolling window, not calendar week. A Saturday or Sunday swap carries across Monday. An owed split expires when its own next slot arrives, so it is never owed twice.
9. **A split edited or deleted:**
   - Match by `splitId`, never by name: rename changes only `Split.name` (src/slices/workout/splits.ts:28-30) while the session keeps the old `splitName`.
   - Delete clears that split's schedule days (splits.ts:32-37), and load does the same (src/core/store.ts:90-91). Its sessions then fill no slot.
   - If the split is missing, "next" is dropped (context.ts:61, rules.ts:172).
   - Changing the schedule mid-week: only the current schedule is saved, so past sessions are matched against today's schedule. That is a known limit.
10. **No schedule at all:** no "next" text and no invented rotation, so advice ends at "Recover well." (readiness.ts:327). Target muscles stay empty (COACHING-DECISIONS.md:210, readiness.ts:148-150).
11. **Extra: day off.** "Take today off" applies only to today (Today.tsx:84, :92). It counts as unscheduled (models.ts:526), so it creates no owed split and no swap.
12. **Extra: midnight.** A 23:30-00:40 session counts as today for 6 hours through `trainedTodaySessions` (dates.ts:80-86). The helper must use the same rule.

## (4) Constraint
- AGENTS.md:53 and :72: new kinds of saved data need the owner's approval first (`models.ts`, `store.ts`, migrations).
- **The fix can be pure derivation from existing saved data:**
  - `schedule` (models.ts:495);
  - `sessions[].splitId`, `day`, `endedAt` (models.ts:169-176);
  - `daysOff` (models.ts:527);
  - `splits` (models.ts:494).
- The precedent for working a value out instead of saving a new field is D-LT6 (COACHING-DECISIONS.md:877).
- The only thing derivation cannot know is the person's intent in rule (a) versus (b). That is a copy and behaviour choice, not a data change.
- Existing tests stay valid: the QA8-2 readiness tests pass `next` in directly (tests/readiness.test.ts:124-144), and `nextScheduled`'s calendar contract can be kept as the base walk (tests/dates.test.ts:83-92).