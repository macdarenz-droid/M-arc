id: BUG-39 · model: claude-opus-5-5 · branch: claude/bug-39-streak · base: origin/main 49a28534. Merge the latest origin/main with a merge commit before review. depends_on: none (build_prerequisites: none; merge_prerequisites: owner checklist order only). No design note needed: rule D-BUG39 below is fixed.

OUTCOME: The flame streak on Today (selectors `streak`) and Escobar get_overview.streak count training days. They stay up as long as every finished week reaches its planned sessions, on whatever weekdays those sessions fall. One missed planned session never resets the streak to zero. On the owner's calendar it reads 9 on Thu 15 Oct (main: 0) and 11 on Sun 18 Oct (main: 2).

WHY (verified):
- src/brain/weekly.ts:124-138 trainingStreak stops at the first past scheduled weekday that has no session on that exact date (:134).
- The owner trains his planned count every week but moves the weekday. Weeks of 28 Sep, 5 Oct and 12 Oct had 4, 4 and 3 sessions, and Today showed 'Strong week · You hit your planned sessions'. One empty scheduled weekday was enough to zero the streak.
- This is audit DATES-F7 (docs/qa/logic-audit/dates.md:55-61, confirmed, never built). It goes against docs/COACHING-PLAN.md:217 and :647: never reset to zero for one miss; weeks on plan with one free miss per 4 weeks.
- The rule has been in since 1cc79431 (2026-09-18). Trains 15-21 did not touch it.
- NOT this card: making the streak ask splitPlan about done-early days. The skeptic showed that changes his number only if Fri 9 Oct was SPLIT 3, which nothing on his screens shows.

RULE D-BUG39 (decided from COACHING-PLAN :217/:647 and the owner's 'count the streak if I'm continuous since I started'):
- R1. The number stays a count of distinct days ≤ today with at least one working set (hasWorkingSets). The unit does not change: plan :217 keeps the schedule-aware streak as a number, and the owner reads it as days ('it was 9').
- R2. A week's target is plannedSessions({ schedule, daysOff, plannedDays: profile.plannedDays }, <that week's Monday>). This is the same target as Today's week grade (src/app/selectors.ts:50). If it is null (no weekday scheduled and no plannedDays), keep the current consecutive-day rule exactly as it is.
- R3. Walk the Mon-Sun weeks (weekStart) back from today's week.
  - Today's week and the week of the first working session are never judged. Their training days count, and the walk ends at the first-session week.
  - For every other week: done = number of sessions with working sets dated in that week (same as weekSummary.workouts); short = max(0, target − done).
  - short 0: count the week's training days and go on.
  - short 1: forgiven if no week within the 3 newer weeks was forgiven (w − lastForgiven ≥ 4); otherwise stop.
  - short ≥ 2: stop.
  - A week that stops the walk adds nothing.
  - Count weeks once with a Map, not a filter per week.
- R4. Days off lower the target (plannedThisWeek already does this). Past weeks are judged against the current schedule (known limit, same as D-BUG38). Splits are not read. NO NEW SAVED DATA.

WRITE_SCOPE:
- src/brain/weekly.ts: trainingStreak gains a 5th optional param `plannedDays?: number`. Move the misplaced streak doc comment (:78-82, above plannedThisWeek) onto trainingStreak and rewrite it to R1-R4.
- src/app/selectors.ts:51: pass state.value.profile.plannedDays.
- src/escobar/tools/read.ts:143: pass s.profile.plannedDays.
- tests/bug-39-streak.test.ts (new).
- The two re-pins in AC9, nothing else.
- docs/COACHING-DECISIONS.md: append '## D-BUG39' at the end.
- docs/qa/logic-audit/dates.md: update the DATES-F7 status ('streak part fixed by BUG-39; the weeks-on-plan report and 28-day rate stay open').

RESERVED_PATHS:
- src/core/models.ts, src/core/store.ts, migrations.
- src/brain/splitPlan.ts.
- src/brain/coach/weeklyReview.ts (adherenceRate has the same gap; not this card).
- src/slices/today/** and all UI copy.
- scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css.
- package*.json.
- #221's files: session.ts, store.ts, models.ts, commands.ts, Train.tsx.
- Watch-agent files.

READ_FIRST: src/brain/weekly.ts:78-138; selectors.ts:50-51; read.ts:124-145; tests/balance-weekly.test.ts:33-41; tests/r6-features.test.ts:32-45; COACHING-PLAN.md:217, :647; dates.md:55-61; D-BUG38 (COACHING-DECISIONS.md:2145).

ACCEPTANCE (tests/bug-39-streak.test.ts). Build sessions with helpers session() + sets(45,12) and set `day` explicitly. Schedules are {...emptySchedule(), ...}. All dates are 2026.
- AC1 (red on main). Owner sessions on 09-28, 09-30, 10-03, 10-04, 10-06, 10-07, 10-09, 10-11, 10-13, 10-17, 10-18. Run it under each of {wed}, {wed,sun}, {wed,sat} and {wed,sat,sun}, every weekday set that fits his screens.
  - Premise: weekSummary(s,'2026-10-18',[],plannedSessions({schedule,daysOff:[]},'2026-10-18')).grade.title is 'Strong week'.
  - trainingStreak(s,sch,'2026-10-15') = 9 and (…,'2026-10-18') = 11.
  - Main, verified at 49a28534 with TZ=Australia/Melbourne, gives 'expected +0 to be 9' and 'expected 2 to be 11' under all four schedules.
- AC2. Mon/Wed/Fri. Week of 7 Sep full, 14 Sep Mon+Wed, 21 Sep full, 28 Sep Mon+Wed. Today 10-05 → 5.
- AC3. Full weeks 10 Aug, 24 Aug, 31 Aug and 7 Sep; Mon+Wed weeks 17 Aug and 14 Sep; today 09-21 → 16. With the short week on 24 Aug instead of 17 Aug (17 Aug full) → 8.
- AC4. Sessions 09-07, 09, 11, 14, 16, 23. Today 09-23 → 6 (today's week is not judged). Today 09-28 → 0 (the 21 Sep week had 1 of 3).
- AC5. Sessions 09-07, 14, 16, 18, 23. Today 09-28 → 0; with daysOff ['2026-09-21'] → 5. With 16 Sep warm-up only (every set kind 'warmup'): today 09-21 → 3; today 09-28 with that day off → 1.
- AC6. No schedule. Sessions 09-01, 02, 04, 07, 09, 11, 14, 17, 19; today 09-21. plannedDays 3 → 9; plannedDays 4 → 3. No plan at all, today 09-20 → 1.
- AC7. Mon/Wed/Fri. Sessions 09-11, 14, 16, 18; today 09-21 → 4 (the first week is not judged).
- AC8 (wiring). freshState() with the AC6 sessions and profile.plannedDays 3, then replaceState and today.value='2026-09-21'. streak.value = 9, and getOverview({}, makeCtx(state, new Date(2026,8,21,12).getTime())).streak = 9.
- AC9 (re-pins by ruling D-BUG39, exact). tests/balance-weekly.test.ts:37: 'toBe(0); // Friday missed' becomes 'toBe(2); // one missed Friday is forgiven (D-BUG39)'. tests/r6-features.test.ts:37: toBe(1) becomes toBe(4). The missed Monday is in today's week; AC5's 0 vs 5 keeps that test's day-off intent. These stay unchanged and green: balance-weekly:36 and :38-40, r6-features:38, a3-eng-04-warmup-only:32.

MUTATIONS: each turned red in the supervisor's prototype. List the results in the PR.
- Drop the first-week exemption → AC5, AC7.
- `w − lastForgiven < 3` → AC3.
- Stop only at short ≥ 3 → AC4, AC5.
- Count sessions without working sets → AC5.
- Judge today's week → AC1 {wed,sat,sun}, AC2-AC8.
- Drop plannedDays at selectors.ts:51 → AC8.
- Ignore daysOff in the target → AC5.

PROTOTYPE: this rule as a ~30-line trainingStreak, the test above and the two re-pins. Results:
- 11/11 under Australia/Melbourne, UTC, America/Los_Angeles, Pacific/Kiritimati and Etc/GMT+12.
- Full npx vitest run: 215 files / 2906 tests green.
- typecheck clean.
- Patch, if your session can read it: /tmp/claude-0/-home-user/d421eb94-4cbc-5338-b4e9-9cfae1b5c8e9/scratchpad/bug-39-proto.patch

VERIFICATION:
- While building: npm run typecheck; the new file plus balance-weekly, r6-features, a3-eng-04-warmup-only, selectors, today-card and tests/escobar/*.
- On the merged head: npm run check, npm run test:tz, MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate, and the new file under TZ=Australia/Melbourne, Pacific/Kiritimati and Etc/GMT+12.

COLLISIONS (settled):
- No block in scripts/screenshot-gate.mjs or tests/theme.test.ts mentions streak or IconFlame.
- #221 (watch lane) shares no file.
- #193 (LIB-7 draft) touches selectors.ts and read.ts, but not :51 or :143.
- #1 has been stale since 2026-09-22.
- docs/COACHING-DECISIONS.md is appended by open PRs #237, #234, #233, #232, #219, #194, #193, #191 and #181. Append at the end and keep both sides on merge.
- BUG-40 runs in parallel and shares only that doc.

UI COPY: no text change. The chip is the flame and a number, hidden at 0 (Today.tsx:55).

RISK_AND_RECOVERY:
- The flame now drops only after a short week has ended, not the morning after a missed weekday. This is intended (R3).
- A new schedule re-judges old weeks. This is the existing limit.
- The count cannot get too generous: short ≥ 2 still stops at once, and a second short-by-one week within 4 weeks stops.
- Recovery: revert the PR. No saved data changes.

RETURN: draft PR with head commit, changed paths, AC→evidence, mutation results, 'You will notice:' line and the HANDOFF block.