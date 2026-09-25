# Live QA round 8: "already done today" and midnight bugs

The owner hit this on the phone on Sat 26 Sept. They finished SPLIT 2 - LOWER AND CORE just after midnight, so the session is dated Sat 26. Escobar's Today's brief still said "SPLIT 2 - LOWER AND CORE today, but hamstrings is only 18% recovered. Swap to another split today…". The 18% is caused by the session they just finished.

A low-cost sweep looked across the brief, the Today and Train tabs, reminders and Escobar. Each finding was re-checked by a skeptic. There were 8 confirmed findings; merged, they are 5 bugs. All references are at main 721e997.

Fix them in this order. Each fix gets a test that fails before and passes after, with the id in the commit message.

## High

**QA8-1 · The "scheduled split vs recovery" insight fires after that split is already done today.** This is the owner's bug.
- **Where:** src/brain/coach/rules.ts:130-148, rule `recovery.scheduled-conflict`. It feeds Escobar's brief `top_insights` (src/escobar/context/brief.ts:83/92) and the app's insights (src/app/selectors.ts:53).
- **Cause:** the rule reads `ctx.schedule[weekdayOf(ctx.today)]` and warns about that split's least-recovered muscle. It never checks whether that split was already trained today, so it re-reports the fatigue the finished session just caused. brief.ts:88 already knows "trained today" (`s.sessions.some(x => x.day === ctx.today)`), but the rule never uses it.
- **Fix:**
  1. In `run()`, return no warning when `ctx.sessions.some(s => s.day === ctx.today && s.splitId === split.id)`, or when the worst muscle was itself trained today (`worst.lastDay === ctx.today`).
  2. In that done-today case, emit one positive insight instead, with id `recovery.done-today:<splitId>` and priority just below the old rule.
     - Title: "Done today: {split name}".
     - Body: "Next: {next scheduled split} on {weekday}." Find the next scheduled split by walking `ctx.schedule` forward from tomorrow, at most 7 days. If nothing is scheduled, use "Rest and recover."
     - If the next split's primary muscles include a muscle that won't be ready (90%) by that day, add "{muscle} should be ready {window}", using readyInHours.
  3. A different, unscheduled workout done today that didn't train the scheduled split's muscles keeps the old warning.
- **Tests** (tests/coach…):
  - The owner's case, split done today with hamstrings at 18%: no `scheduled-conflict` insight, and the `done-today` insight names the next split and day.
  - A different split done today, with the scheduled one still pending: the warning still shows.
  - Nothing done today: the old behaviour is unchanged.

## Medium

**QA8-2 · Readiness gives "how to train today" advice after today's session is finished.**
- **Where:**
  - src/brain/readiness.ts:100-215: `readiness()`, the driver text "the muscles you would train today are not fully recovered" at :168, and the advice at :210.
  - src/brain/coach/rules.ts:86-92: `derive()` uses today's scheduled split as the target muscles.
  - Rule `readiness.today`, rules.ts:407-428.
  - The Today tab's ReadinessCard, src/slices/today/Today.tsx:172-190.
  - The brief's readiness line (brief.ts:81), and `readinessSummaryText` (readiness.ts:221).
- **Fix it once, inside readiness():**
  - Add a `trainedToday` input (`sessions.some(x => x.day === today)`, the same pattern as brief.ts:88 and Today.tsx's `sessionsToday`).
  - When it's true, the target muscles become the NEXT scheduled split's primary muscles (the same helper as QA8-1). The driver reads "the muscles for {next split} on {weekday} are not fully recovered".
  - The advice switches to recovery wording: "Today's session is done. Recover well; {next split} is next on {weekday}." Never "train lighter today".
  - The `readiness.today` rule keeps its colour band but uses that wording.
  - All callers (Today card, brief, summary text, derive()) pick it up. Don't patch each UI separately.
- **Tests:**
  - With a session today and a red band, no advice string contains "today" in the pre-workout sense, and the driver names the next split.
  - Without a session today, the output is byte-identical to main.

**QA8-3 · The training-day reminder can still fire after the workout is finished.**
- **Where:** src/slices/workout/session.ts:413-455. `finishSession()` never calls `resyncReminders()`. Compare the pattern at src/slices/today/dayOff.ts:8 and escobar/apply.ts:34.
- **Fix:** add `void resyncReminders();` right after `flushSave();` in `finishSession()`. There's no circular import: reminders.ts only imports store, notifications, readiness and selectors.
- **Test:** finishing a session calls resyncReminders once (spy), and a same-day reminder then isn't scheduled. Check `resyncReminders` itself skips today when `sessionsToday` is non-empty; if it doesn't, add that too, with a test.

## Low

**QA8-4 · A workout that starts before midnight and ends after it counts only on the start day.** After midnight, Today and Train show the day's split as still to do, even though the person just trained.
- **Where:** src/app/selectors.ts:57 `sessionsToday`, with the day set from `startedAt` (src/slices/workout/session.ts:434; src/brain/fidelity.ts:41-66).
- **Fix:** change only the "done today" check, not the stored day, history or records:
  - `sessionsToday` also includes a session whose `endedAt` falls on today, when it ended within the last 6 hours.
  - QA8-1 and QA8-2 use the same helper, e.g. `trainedToday(sessions, today, now)` in src/app/selectors.ts or src/core/dates.ts, one function for all three.
  - The stored `day` stays the start day, so there's no data change.
- **Test:** a session from Fri 23:30 to Sat 00:40, checked at Sat 05:30: `trainedToday` is true. Checked at Sat 18:00: false. Checked on Fri at 23:59: true.

## Rejected (not a bug)
- A worry that Escobar's get_plan/get_overview would describe today's split as still to do: the model already gets `trainedToday`, so no change.
