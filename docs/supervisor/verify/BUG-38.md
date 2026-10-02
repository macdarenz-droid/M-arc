# BUG-38: next split ignores the split actually done

**Status: PAUSED by the owner, 2026-10-02 ~17:30 UTC ("Pause everything for now. But save ur progress").** Investigation done; design and fix not started.

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