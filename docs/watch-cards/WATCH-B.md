# WATCH-B: Gate B, watch commands applied once

- **id:** WATCH-B (Gate B of `docs/WATCH-ARCHITECTURE.md`).
- **outcome:** one TypeScript entry point applies each watch command at most once. It answers only after the save succeeds. Old saves migrate without invented times.
- **base:** `ccr-061c7350-tjvpo6` @ `b08c06de`.
- **depends_on:** Gate A probe 2 (`native/wear/README.md`), and the owner's data approval (`docs/WATCH-WEAR-ENGINE-APPLICATION.md` 11.3).
- **read_first:** `src/slices/workout/session.ts`, `src/core/store.ts`, `src/core/models.ts`, `docs/qa/LIVE-QA.md` QA-W-2 and QA-W-6.

## Gate A facts that shape it
- JS runs only while M/ARC is open. In runs F and J, Java answered while the app was frozen. So the handler is synchronous, and a native ack never counts as a command result.
- Commands stay at or under 1000 B.
- The watch app closes about 25 s after its screen goes dark, so resends will happen.

## Audit (at `b08c06de`)
- Stable ids already exist: session (session.ts:83, kept at :565), entry (:80, :329; a new one on substitution :368), set (:47; store.ts:154-161). Reorder keeps them (:333-341). Gate B adds revisions only.
- `status` is typed (models.ts:87), but new sets never get one (session.ts:47). Write `draft` and `rev 0`.
- `addSet` copies draft values only (:271-279). Lock this with a test.
- The commit guard and `actionAt` (:216-218) sit inside a call with side effects (:201-241). Extract a pure core and run the effects after the save.
- `RestState` has no id (models.ts:202-209). `adjustRest` restarts a rest that has already ended (session.ts:423).
- `flushSave` returns nothing (store.ts:418), and finish ignores the save result (session.ts:591).
- There are no receipts. Finish and discard leave no record of the session (session.ts:581, :653; apply.ts:138).
- `isState` requires `version: 1` (store.ts:27-29), so the data version goes in a new field.

## Saved data (owner-approved rows 1 to 3 of 11.2; phone only, no heart rate, no device ID)
- `AppState.dataVersion`: absent means 0; this card writes 1.
- `AppState.commands`: `{ receipts, closed }`, where `closed` holds at most 50 `{ sessionId, finished | discarded, at }`.
- Receipt: `{ commandId, sessionId, kind, fp (FNV-1a hash), result, actionAt, receivedAt }`.
- `ActiveSession.rev`.
- `LoggedSet.rev`: every patch raises it; it is removed at finish.
- `LoggedSet.receivedAt`: watch sets only; `at` holds the watch action time.
- `RestState.id` and `rev`.

**Migration v0 to v1** (`src/core/dataVersion.ts`, called from `fill`):
- A set keeps its `status`. Without one it becomes `committed` if it has `at` and is filled, otherwise `draft`.
- Revisions start at 0, and a running rest gets an `id`.
- `commands` starts empty, and history is untouched.
- No time field is created or changed.
- Running it twice changes nothing. A save with `dataVersion > 1` is left alone. A broken `commands` is repaired.

## Command interface (`src/slices/workout/commands.ts`)
`handleWorkoutCommand(cmd: unknown, receivedAt = Date.now()): CommandResult`

Every command carries `v: 1`, `commandId` (8 to 64 characters of `[A-Za-z0-9_-]`), `sessionId`, `actionAt` and `kind`. The kinds are only those in the approved application:
- `complete_set { setId, expectedRev, load?: { value 0-1000, unit }, reps 1-100, effort? }`, saved through `enteredLoad` (units.ts:48), the same way as a typed set;
- `rest_add_30 { restId }`, `rest_skip { restId }`;
- `pause`, `resume`;
- `finish` (never saves the template).

Results, each with its `commandId`:
- `applied { sessionRev, replayed, finish?: saved | discarded }`;
- `rejected { reason, replayed }`;
- `not_saved { storage_failed }`.

## Exactly-once rules
1. An unknown version or kind gives `unsupported`. Bad types, ranges or size give `invalid`. Neither is stored.
2. Receipts are looked up by `commandId` alone, with `sessionId` inside `fp` (QA-W-2). The same `fp` returns the stored result without writing anything. A different `fp` gives `id_conflict`.
3. A closed id, or one already in history, gives `session_closed`. No active session gives `no_session`. Any other id gives `wrong_session`. A command never creates or reopens a session.
4. Target checks:
   - a missing set gives `target_missing`;
   - a committed set gives `already_committed`, checked before the revision (QA-W-6);
   - a revision mismatch gives `stale_revision`;
   - reordering and changes to other entries never cause a rejection;
   - a wrong rest id, or +30 s on a rest that has ended, gives `stale_rest`;
   - pause while paused, or resume while running, gives `invalid_state`.
5. One `commitNow` saves the change, the revisions and the receipt. Rejections from rule 4 get receipts too. At 500 receipts the answer is `limit_reached` and nothing is dropped. `startSession` removes receipts older than the last closed session.
6. The rest notification and haptic run only after the save.

**Times:** `at` is the earlier of `actionAt` and `receivedAt`. If `actionAt` is before the session start or more than 5 s in the future, `receivedAt` is used, and the future case adds the `future_time` flag. Pause and resume use the receive time.

**Storage errors:** `commitNow(fn): boolean` in store.ts cancels the pending debounced save, applies the change and saves. If the save fails, it restores the previous state and returns false. `flushSave` returns the same boolean. Phone behaviour does not change.

## Scope
- **write_scope:** `src/core/{models,store,dataVersion*}.ts`, `src/slices/workout/{session,commands*}.ts`, `tests/workout/watch-commands.test.ts*`, `tests/data-version.test.ts*`, and an add-only `WATCH-B` block in `tests/store.test.ts` (* = new file).
- **reserved_paths:** `src/app/App.tsx` and `src/main.tsx` (no wiring needed), `Train.tsx`, `src/native/**`, `native/**`, `src/brain/**`, `package*.json`, `.github/**`, gate and theme files, `docs/PRIVACY-POLICY.md`, and every existing test.

## Acceptance
B1 to B13 each fail before the change and pass after. The PR lists, for each, the code change that turns its test red.
- **B1:** new, added, warm-up and substitute sets get a unique id and rev 0, and all but added sets get `draft`. Added sets keep `status` unset, which counts as draft, because the existing test `tests/session.test.ts:117` requires it (B14; amended after review). `addSet` carries no timing, heart, flags, effort or kind.
- **B2:** `complete_set` saves the values, `at`, `receivedAt` and one receipt, read back from storage.
- **B3:** a resend after a lost acknowledgement gets the identical result with `replayed`: one set, one rest, no write.
- **B4:** a duplicate completion gives `already_committed`. A reused id with a different payload or session gives `id_conflict`.
- **B5:** after a reorder, the right set is committed.
- **B6:** after a substitution, the old target gives `target_missing`. After a phone edit, it gives `stale_revision`, and the phone value is kept.
- **B7:** on a save failure: `not_saved`, state unchanged, no receipt and no side effects. A retry applies once.
- **B8:** a finish replay leaves one history session and returns the same result. An empty session gives `discarded`. The split is unchanged.
- **B9:** a late command after finish, after discard, or after a newer session starts gives `session_closed`, and nothing changes.
- **B10:** +30 s moves the deadline by 30 s. A stale or ended rest gives `stale_rest`. Skip, pause and resume work. A resent `invalid_state` command stays rejected.
- **B11:** delayed sets that arrive together keep the fidelity of their action times. A future `actionAt` is clamped and flagged.
- **B12:** a bad version, kind or range is rejected and not stored. The 500-receipt cap holds.
- **B13:** migration fixture: states are derived, times are byte-identical, a second run changes nothing, and a `dataVersion 2` save is left alone.
- **B14:** regression: the existing progression, units, session and store tests pass without edits.

## Other card fields
- **design_reference:** WATCH-ARCHITECTURE sections 5, 6 and 9; the section 10 acceptance matrix rows 1 to 3, 9 and 11.
- **connectivity:** none.
- **verification:** on the merged head, `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`.
- **risk_and_recovery:**
  - The refactor could change phone behaviour; B14 catches this.
  - Downgrade: older builds keep unknown fields, because `fill` copies them through.
  - If a finish save fails, the retry overwrites its heart series.
  - Clock skew is only clamped here; estimating the offset is Gate C.
  - Recovery: revert the PR; v1 data stays readable.
  - From the review, carried to Gate C:
    - a watch Finish stores the heart series before the save, so a failed save followed by a phone Discard leaves an orphaned series;
    - a `not_saved` caused by full storage has already removed the daily backup and shown the save error, as the phone's own save does;
    - a `complete_set` without a load or effort clears what the phone had filled in; the Gate C protocol must say that the watch always sends the values it shows;
    - the Gate C snapshot must read an unset `status` as draft.
- **return:** the head commit; a table of criterion, test and red-making change; the check results; risks; and "You will notice: nothing visible".

## Forecast (builder hours; device time and Huawei review not included)
- **Gate B:** 12 h (range 9 to 16).
- **Gate C:** 20 to 40 h: wiring, the watch queue, and device runs that cut the link.
- **Gate D:** 100 to 200 h, after a Wear Engine Modify: native SQLite ownership, a foreground service, four screens, real workouts.
- **Gate E:** 30 to 80 h per approved metric.

Uncertainty grows from B to E. Gate C depends on the watch's Lite JS limits. Gates D and E depend on Huawei approvals.
