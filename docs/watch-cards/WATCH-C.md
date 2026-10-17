# WATCH-C: Gate C, one set over Wear Engine

- **id:** WATCH-C (Gate C of `docs/WATCH-ARCHITECTURE.md`).
- **base:** `ccr-061c7350-tjvpo6` @ `9f8848fd`.
- **depends_on:** WATCH-B, Gate A probe 2, application 3 (`docs/WATCH-WEAR-ENGINE-APPLICATION.md` 3.2, 5 and 11).
- **outcome:** the GT 6 completes the suggested set and adds or skips rest. A link cut before or after the phone's save leaves exactly one set, with the right id and time. Pause, resume and finish from the watch are Gate D.

## Decisions
- **Debug APK only** (`MARC_WEAR_LAB=1`): the privacy policy has no watch section yet (11.1).
- **No undo:** application 3 does not list it among its commands (3.2, 5.1), and a new command that changes saved data needs a Modify (11.1). Sets are fixed on the phone. Ask for undo in Gate D's Modify.
- **Foreground only:** while M/ARC is hidden (`document.visibilityState`), the phone neither handles nor sends anything.
- **No watch identity:** the command id is `<boot>-<seq>`, where boot is 8 random base-36 characters made at each launch (11.2 row 5).
- **Java unchanged:** `Wire.requestId` accepts only `marc-a2`, so the lab's native ack never answers a workout message.
- **New lean watch app** `native/wear/app/`: same bundle and profile as the test app, version 1.1.0 (1001000), no permissions.
- **Watch wording from the approved application:** with no workout, "Start your workout in M/ARC on your phone"; with no phone reply, "Phone not connected" and "Open M/ARC on your phone"; "Pending" until the phone's receipt, then "Saved".

## Protocol (`t: "mw"`, `v: 1`, JSON of at most 1000 B)
Any other `v` shows "Update needed", and sending stops. Unknown `k` values and unknown fields are ignored.
- **hello** (watch, at most 120 B): `{t, v, k, app, boot, wt, q}`, where `wt` is the watch clock and `q` the pending count. Sent at start, on `onShow`, after 20 s of silence, and after failed sends (backoff 5 to 30 s).
- **snap** (phone, at most 700 B): `{t, v, k, pt, wt, srev, sid, ex, si, sn, set, rest, th}`.
  - `pt` is the phone clock, and `wt` is echoed back. `srev` is the session revision. `sid` is null when there is no session.
  - `ex` is the exercise name in ASCII, at most 24 characters. `si` and `sn` are the set's position and the set count.
  - `set` is `{id, rev, w, u, r, e, src}`, or null when no set is left or the exercise is timed.
  - `rest` is `{id, left, tot, p}`; `left` is the ms remaining and counts paused time correctly.
  - `th` is the theme, `[bg, text, accent]`.
- **cmd** (watch, at most 400 B): WATCH-B's command plus `t` and `k`, with keys in a fixed order. It always carries the load and effort the watch shows (carried from WATCH-B).
- **res** (phone, at most 200 B): `{t, v, k}` plus the `CommandResult`.
- **Clock:** offset = `pt − (wt + arrival) / 2`, taken from the hello/snap pair with the lowest round trip, and stored. `actionAt` = watch time + offset, fixed at the tap.

## Watch outbox (`common/link.js`, ES5, storage injected)
- **Persistence:** 8 slots, `mc_q0` to `mc_q7`, each holding the exact wire text. The index `mc_q` is written after the slot.
  - "Pending hh:mm:ss" shows only after both writes succeed.
  - If a write fails, the watch shows "Not saved" and sends nothing.
  - If the outbox is full, it shows "Queue full" and drops nothing.
  - Complete is locked while that set is pending.
- **Resend:** one command in flight, oldest first, the same bytes every time. Resend at 4, 8 and 16 s, then every 30 s, and also whenever a snap arrives.
- **Results:**
  - `applied` (a replay included): the entry is removed and "Saved" shows;
  - `rejected` with a receipt: the entry is removed and the reason shows ("Changed on phone", "Workout ended");
  - `not_saved`: retried;
  - a snap never shows Saved.
- **Restart:** the slots listed in the index are reloaded.
- **Screen:** keep-on is held while a session or a pending entry exists.

## Phone side (`src/native/watchLink.ts`, new)
- **`buildSnapshot`** picks, among entries that are not done or skipped and still have a set to log: the card open on the phone (an in-memory `openEntryId` set by Train.tsx, never saved); else the entry of the last logged set; else the first in display order (amended after device run D1, 2026-10-17). Within it, the first set that is neither committed nor skipped. An unset status counts as draft (carried from WATCH-B).
- **Storage:** `@system.storage` values must be under 128 bytes (OpenHarmony `@system.storage` reference), so each outbox slot is stored as chunks of at most 120 characters plus a header with the chunk count, length and checksum (watch 1.1.1, after device run D1).
  - Values, with `src` d, t or l: the draft's own load (in the entered unit), reps and effort; else `entryTarget(...).sets[j]` (Train.tsx:165); else `previousSet`.
- **Routing:** `mw` messages go to the link, and everything else to the lab.
  - A `cmd` goes to `handleWorkoutCommand(cmd, rxAt)`.
  - Its result goes back as `res`, whatever `by` says, followed by a fresh snap.
- **Snaps:** sent on hello and whenever the projection changes (ignoring `pt` and `left`), at most one per 300 ms.
- **Lab:** its Connect button starts the link (no App.tsx or main.tsx change). It adds counters and a **Hold results** switch (memory only, off by default) that applies commands but sends nothing.

## Scope
- **write_scope:** `native/wear/**` (except `android/WearEnginePlugin.java`), `src/native/wearEngine.ts`, `src/native/watchLink.ts`*, `src/slices/settings/WatchLab.tsx`, `tests/watch-link.test.ts`*, `tests/watch-contract.test.ts`*, and the Gate C line of WATCH-ARCHITECTURE (* = new; watchLink.ts joins the watch lane's files).
- **reserved_paths:** everything else, notably `native/wear/android/WearEnginePlugin.java`, `src/core/**`, `src/slices/workout/**`, `src/app/App.tsx`, `src/main.tsx` and `.github/**`.

## Acceptance
Each test fails before and passes after; existing tests are not edited; the PR names the change that turns each one red. Test files: C in `tests/watch-link.test.ts`, W in `native/wear/test/link.test.mjs`, X in `tests/watch-contract.test.ts`.
- **C1:** snapshot selection handles reorder, substitution, unset status and timed exercises; the output is at most 700 B and ASCII; hello's `wt` is echoed; one snap per change; nothing is sent while hidden.
- **C2:** a cmd gets exactly the handler's result, also when `by` is `"native"`. A duplicate gives one stored set and `replayed`. A cmd arriving while hidden is not handled, and its resend applies once. Hold applies and sends nothing.
- **C3:** a source check that `Wire.requestId` refuses other tags and nothing calls `setNativeAck`.
- **W1:** command bytes are fixed and at most 400 B; ids are valid for the phone and unique across boots; the shown load and effort are sent; `actionAt` is unchanged across resends.
- **W2:** Pending only after both writes; a failed write sends nothing; a full outbox drops nothing; a restart restores identical bytes.
- **W3:** send, resend, result and offset rules; a snap never shows Saved; a version mismatch; the offline countdown; the Complete lock; keep-on; the no-workout and no-phone wording.
- **W4:** ES5, ASCII, `wearengine.js` unchanged, PHONE_FP, no permissions, page sources at most 34,000 B (32,000 until 2026-10-17, raised by the coordinator for the required safety fixes after the 1.1.1 device crash; the compiled page stays at most 46,000 B, and `check-lite-js` enforces 48,000).
- **X1:** the watch's `link.js` builds a command from `buildSnapshot`; `handleWorkoutCommand` applies it and then returns the replay.

## Device runs (owner: PR-head debug APK, watch 1.1.0, auto rest on, lab Connect)
- **D1:** 10 Completes, each Saved within 3 s with matching values. +30 s and Skip move the phone's rest.
- **D2, cut before the save:** phone Bluetooth off; tap Complete and note the Pending time; reopen the watch app (it shows "1 pending"); wait 60 s; Bluetooth on; Connect.
- **D3, cut after the save:**
  1. Hold on; tap Complete. The lab shows `applied`; the watch shows Pending.
  2. Bluetooth off; Hold off; wait 30 s.
  3. Bluetooth on; Connect. The lab shows `replayed`.
- **D4:** as D3, but swipe M/ARC away instead of turning Bluetooth off; reopen it; Connect.
- **D5:** Bluetooth off; Complete set 2; edit its weight on the phone; Bluetooth on. The watch shows "Changed on phone", and the phone keeps its value.
- **D6:** with M/ARC in the background, the watch stays Pending for 60 s, then shows Saved within 5 s of reopening M/ARC.
- **D7:** left untouched for 3 min, the watch app stays open.

**What proves one set (D2 to D6):**
- the phone shows one completed set, and the next set is still a draft;
- the lab shows one `applied` that is not a replay, with that commandId and the setId from the snap;
- the set's `at` is the Pending time ±2 s, not the reconnect time, with no `future_time` flag.

## Other card fields
- **verification:** `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, `node --test 'native/wear/test/*.test.mjs'`; the watch build, `check-lite-js.cjs` (aim at most 44,000 B), `verify-signed-bin.py`, hashes recorded; the release and Play absence checks in CI stay green.
- **risk_and_recovery:**
  - How long a value `@system.storage` accepts is unverified; D2 shows it. Fallback: 128-character chunks (+3 h).
  - Page over 48 kB: drop the effort control.
  - A wrong clock offset: Gate B's clamp limits the damage.
  - From set 2 on, the watch target may differ from Train's live retarget; the watch sends what it shows.
  - Carried from WATCH-B: orphaned heart series (the watch sends no Finish yet); a `not_saved` from full storage (the phone shows its error, the watch retries).
  - Recovery: revert; reinstall watch 1.0.4.
- **return:** head commit; criterion, test and red-change table; check results; hashes; "You will notice: the watch logs a set (debug APK)".

## Forecast (builder hours; device and review time not included)
Phone 8, watch 10, build and signing 3, contract test, docs and review 4, device support 4: **29 h (range 22 to 40).** Assumes storage takes 400-character values, the first build fits, Connect recovers the link, and one fix round is enough.
