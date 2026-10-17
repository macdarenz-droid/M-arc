id: BUG-40 · model: claude-sonnet-5 (every step is spelled out) · branch: claude/bug-40-records · base: origin/main 49a28534. Merge the latest origin/main with a merge commit before review. depends_on: none.

OUTCOME: History > Stats > Records counts every record the app has worked out, and one tap lists them all. Today the trophy chip counts only the 12 newest rows, so it always reads 12 or less, and older records look unsaved.

WHY (verified by investigator and skeptic):
- Records are never stored. src/brain/prs.ts:150-161 allRecords derives every record from the sessions, newest first, with no limit.
- src/slices/history/History.tsx:488 cuts that list with .slice(0, 12), and :569 shows records.length of the cut list.
- Nothing else lists older records: the coach tools return 5-20, and the share card covers one workout.
- The cap has been in since 1cc79431 (2026-09-18). Trains 15-21 did not touch it.
- His screens match: 12 rows from 18 Oct down to 7 Oct, and trophy 12. Today's '7 records' comes from the uncapped recordsInWeek: 4 (17 Oct) + 3 (18 Oct) + 0 (13 Oct).

CHANGE (exact; Stats() in History.tsx only; record rules in prs.ts unchanged):
1. Replace :488 with:
   const allRecs = useMemo(() => allRecords(s.sessions, s.customExercises, u), [s.sessions, s.customExercises, u]);
   const [allShown, setAllShown] = useState(false);
   const records = allShown ? allRecs : allRecs.slice(0, 12);
   The deps now name every input the callback reads.
2. :569 chip: change {records.length} to {allRecs.length}.
3. Inside the Records <Card>, after the list, add:
   {records.length < allRecs.length && <Button variant="quiet" size="sm" onClick={() => setAllShown(true)}>Show all</Button>}
NO NEW SAVED DATA.

WRITE_SCOPE:
- src/slices/history/History.tsx: the :488 line and the Records section (:569-575) only.
- tests/bug-40-records.test.ts (new).
- docs/COACHING-DECISIONS.md: append '## D-BUG40' at the end. Content: the chip shows the total; the first view is the 12 newest; Show all reveals the rest. Rejected: removing the cap (hundreds of rows on old phones) and showing only the best per exercise (changes what a record means).

RESERVED_PATHS:
- src/brain/prs.ts, history.ts, fidelity.ts.
- src/core/models.ts, src/core/store.ts, migrations.
- src/escobar/**.
- scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css.
- package*.json.
- #221's files: Train.tsx, session.ts, store.ts, models.ts, commands.ts.
- Watch-agent files.
- Every other line of History.tsx. BUG-41 (trend chart) edits Stats() lines 23, 497, 514-515, 544 and 562.

READ_FIRST: History.tsx:484-576; prs.ts:100-170; tests/workout/a3-ui-r04-edit-provenance.test.ts (the hook harness); scripts/screenshot-gate.mjs:405-416 and :1872-1875.

TEST HARNESS:
- Copy a3-ui-r04's vi.mock('preact/hooks'): useState slots with the cursor reset per render, useMemo runs f(), useEffect is a no-op, useRef returns {current}.
- Mock '@/escobar/palace/focus' so usePalaceFocus is a no-op.
- beforeEach: slots cleared, today.value='2026-10-18', historySeg.value='stats', replaceState({...freshState(), sessions}).
- Render History(), find the vnode whose type is named 'Stats', call it, and take the node with props.palace==='history.records'. Rows are the nodes with props.trailing.

FIXTURE: session(day, [...], split), each exercise sets(kg, reps, 'ideal', 3). Ids: lib_shoulder_press, lib_seated_cable_row, lib_dumbbell_lateral_raise, lib_seated_calf_raise, lib_incline_machine_press, lib_hammer_curl, lib_rear_delt_fly, lib_dumbbell_biceps_curl.
- 09-28 split_1: press 44×10, row 45×12, lateral 6×14
- 09-30 split_2: press 44×10, calf 40×15
- 10-03 split_3: incline 27.5×8, row 47.5×12, hammer 10×12
- 10-04 split_4: rear delt 32×10, curl 10×12, lateral 6×15
- 10-06 split_1: press 46×10, row 49.5×12, lateral 7×14
- 10-07 split_2: press 46×12, calf 45×15
- 10-09 split_3: incline 27.5×8, row 49.5×12, hammer 10×12
- 10-11 split_4: rear delt 35.5×9, curl 12×13, lateral 7×14
- 10-13 split_1: press 46×12, row 49.5×12, lateral 7×14
- 10-17 split_3: incline 30×7, row 49.5×13, hammer 12×14
- 10-18 split_4: rear delt 35.5×10, curl 12×15, lateral 7×16

ACCEPTANCE:
- AC1 (premise, green on main):
  - allRecords gives 18 records.
  - 3, 4 and 6 Oct each have more than 0; 9 and 13 Oct have 0.
  - The 12th newest record is on 2026-10-07.
  - recordsInWeek(…,'2026-10-18') = 7, and 17 Oct has 4.
- AC2 (red on main):
  - The chip number is 18. Main: 'expected 12 to be 18'.
  - Before any tap: 12 rows and one 'Show all' button.
  - After calling its onClick and rendering again: the rows equal every allRecords record, as `${exerciseName}${PR_LABEL[kind]} · ${detail} | ${formatDay(day)}`, none missing, and 'Show all' is gone.
  - Main leaves out 6 records, among them 'Shoulder PressHeaviest load · 46 kg × 10 | Tue, Oct 6' and 'Seated Cable RowHeaviest load · 47.5 kg × 12 | Sat, Oct 3'.
- AC3: with the first 6 fixture sessions (09-28 to 10-07; 8 records, verified), the chip shows 8, there is no 'Show all' button, and 8 rows are listed.
- AC4 (gate): the History trophy stroke check (screenshot-gate.mjs:411-416) passes; it measures the first svg in the section, which is still the trophy. Look at the history.records spotlight screenshots (:1872-1875) in every theme for the button's spacing.

MUTATIONS (list the results in the PR):
- Chip back to records.length → AC2.
- onClick a no-op → AC2.
- Button always rendered → AC3.
- slice(0, 12) kept after Show all → AC2.

PROTOTYPE: the same 3 edits with the investigator's test passed 2/2; full npm test 215 files / 2899 tests; typecheck clean. Source, if readable: /tmp/claude-0/-home-user/d421eb94-4cbc-5338-b4e9-9cfae1b5c8e9/scratchpad/wt-bug-prs/tests/bug-prs-records-card.test.ts

VERIFICATION:
- While building: npm run typecheck; the new file plus prs, history-setlabel, copy-1, copy-2-headings, workout/a3-ui-r04-edit-provenance, a3-ui-r02-same-name-ids, escobar/palace and theme.
- On the merged head: npm run check, npm run test:tz and MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate.

COLLISIONS (settled):
- No open PR touches History.tsx or prs.ts (REST files check, 2026-10-17).
- BUG-41 (trend chart, not yet a PR) edits other lines of Stats(). Whichever merges second merges main and keeps both.
- #221 calls the live PR pill in Train.tsx, which is untouched.
- COACHING-DECISIONS.md: append at the end and keep both sides.
- Gate blocks :411-416 and :1872-1875 read history.records but pin nothing this changes.
- BUG-39 runs in parallel and shares only that doc.

UI COPY: the only new text is the control label 'Show all'. A label that names a control is allowed. No explaining line is added, and the 'Records' heading stays.

RISK_AND_RECOVERY:
- A long list renders only on tap; the default view stays 12 rows, which matters on old Android.
- btn-sm (34px) is used across src/slices; the 44px gate covers only the live workout screen.
- If his true total is exactly 12, nothing changes on his phone.
- Recovery: revert the PR. No saved data changes.

RETURN: draft PR with head commit, changed paths, AC→evidence, mutation results, 'You will notice:' line and the HANDOFF block.