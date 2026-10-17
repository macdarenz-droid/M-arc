# WATCH-C3: logging while the phone is away, Rest done, kg and reps, heart rate

- **id:** WATCH-C3 (Gate C follow-up; the owner's requests after the 1.2.0 workout, 2026-10-17).
- **base:** `ccr-061c7350-tjvpo6` @ `a3c90026` (watch 1.2.0, `WATCH-C2`).
- **depends_on:** WATCH-C and WATCH-C2; research of 2026-10-17 (the lite platform, the phone's load steps and rest end); `docs/WATCH-WEAR-ENGINE-APPLICATION.md` 11 ("Taps, swipes and value adjustment stay local; only confirmed commands are sent"; heart rate shown on the watch only needs no Modify).
- **outcome:** watch 1.3.0. With M/ARC closed on the phone, the owner keeps logging the next sets of the exercise (up to the outbox's 8 actions), and they save with their tap times when M/ARC opens. A rest that runs out shows "Rest done" with OK and a vibration. kg and reps change without a keyboard. The watch shows its own heart rate. The two lines the GT 6 did not draw in 1.2.0 show.

## Decisions
- **No `if` on a `text`** (1.2.0 device run: such a line that turns true later was not drawn on the GT 6). Every conditional line is a bound text whose content is '' when hidden; screens stay `div`s with `if`. A markup test refuses `<text ... if=`, `elif` or `else` on a `text`.
- **Local advance from the phone's list, never invented ids:** the snap carries the next open sets of the shown exercise (`nx`). The watch's set for an exercise is the first of `set`, then `nx` (a pick: its plan row's `set`), that is neither pending in the outbox nor saved. So after a Complete the next set is ready at once, online or not; online the phone's snap confirms it. With nothing left to log, the Phone not connected screen shows as in 1.2.0.
- **Local rest:** after a Complete, if no rest from the phone arrives within 2 ticks, the watch runs its own rest of `rs` seconds (the phone's own rule: its default rest when auto rest is on). A snap with a rest replaces it. The phone already starts a late set's rest from its action time (`commitStep(..., latestOnly)`), so nothing changes there.
- **Rest done:** when a countdown (the phone's or the local one) reaches 0 by itself, "Rest done" shows with an OK pill and the next set, and the watch vibrates once (long). OK is local: it returns to Set and sends nothing (the phone keeps its ended rest until its own OK or the next set). Skip during a countdown still sends `rest_skip`. Known limit: with the arm down the GT 6 turns the screen off and closes the app about 25 s later, so a rest that ends then shows nothing.
- **kg and reps:** a tap on the target value opens Adjust: the field (KG or REPS), the value at 100 px, "-" and "+" pills, Done. Swipe up and down are + and - one step there, left and right switch the field; paging is off while Adjust is open. Steps: reps 1 (1 to 100); load by the set's `st`, else 2.5 kg or 5 lb, clamped above 0 and at most 1000, rounded to 2 decimals. The draft is memory only, tied to the set's id and rev, and Complete sends it. No crown, picker-view, slider or long-press (crown support on the GT 6 is unverified: a later probe).
- **Heart rate on the watch only:** `@system.sensor` heart rate while a session is shown; "128 bpm" on Set (its free line) and Rest; nothing stored or sent. On error 602 the line reads "Allow Body sensors" (the path is Settings, Permission manager, M/ARC Watch, Body sensors). Unsubscribed in `onDestroy`.
- **Permissions:** `ohos.permission.VIBRATE` and `ohos.permission.READ_HEALTH_DATA` (as the KIT app that ran on the GT 6). The vibrator and sensor calls are page-side `io` hooks, like `keep()`; `link.js` still makes no module calls.
- **Later, not here:** dimming during rest (`setValue` is unverified and may leave the system brightness changed), the crown, the Session and Heart pages, a phone ping that reopens the app (needs a Modify).

## Protocol additions (`mw` v1; older watches ignore them)
- **`st`** on a set (in `snap.set`, `nx` and plan rows): the load step in `u`, from the phone's loadable values; left out when unknown or when `u` is not the profile's unit.
- **snap `nx`:** up to 3 open sets after `set` in the shown entry, each `[id, rev, w, r, n]` in `set.u` (values by the snapSet rules; `n` the set's number, added after the red team); dropped from the end to keep the snap at most 700 B.
- **snap `rs`:** seconds of the rest the phone starts after a live set (`restDefaultSec` when auto rest is on, else 0).
- Phone defence: a watch load is rounded to 0.01 before it is saved.

## Scope
- **write_scope:** `native/wear/app/**` (1.3.0, 1003000), `native/wear/test/**`, `native/wear/README.md`, `src/native/watchLink.ts`, `src/slices/workout/commands.ts` (the 0.01 rounding only), `tests/watch-link.test.ts`, `tests/watch-contract.test.ts`, `tests/workout/watch-commands.test.ts` (an add-only block), this card.
- **reserved_paths:** everything else, notably `wearengine.js`, `WearEnginePlugin.java`, `src/core/**`, the rest of `src/slices/workout/**`, `.github/**`.

## Acceptance
Each new test fails before and passes after. Existing tests stay, except these spec changes in `native/wear/test/link.test.mjs` W4, each at least as strict: version 1.3.0; `reqPermissions` exactly VIBRATE and READ_HEALTH_DATA; the page imports exactly storage, brightness, vibrator and sensor; page sources at most 46,000 B (the compiled page at most 46,000 B; `check-lite-js` enforces 48,000). In `tests/watch-link.test.ts`, C1's exact pins of a snap set gain `st`, `nx` and `rs`.
- **P3** (phone): `st` for kg and lb barbells, machines, kg dumbbells at 8 and 20, a learned step, and none for lb on a kg profile; `nx` order and cap with the 700 B limit; `rs`; plan rows with `st` at most 1000 B; the 0.01 rounding (`102.50000000000001`).
- **L1** (watch): local advance through `set` and `nx`, online and offline, up to 8 queued; the Phone not connected screen only with nothing left; a pick advances only through its row.
- **L2:** local rest after a Complete with no phone rest, replaced by the phone's; Rest done at 0 with OK local and one vibration per rest; Skip still sends `rest_skip`.
- **L3:** Adjust: steps, clamps, rounding, field switch, swipes off paging, draft tied to id and rev, Complete sends the draft; the outbox slot stays under 120 characters (102.5, 999.75).
- **L4:** heart rate: the line, the 602 text, unsubscribe on destroy, nothing in any message or storage.
- **L5:** no `if` on a `text`; the Phone not connected title and "Pending" are in the drawn lines.
- **X3** (contract): the watch's own `link.js` logs 3 sets offline from a real snap's `nx`; the phone applies them in order with their action times when it comes back.
- **B3:** compiled page at most 46,000 B, `check-lite-js` OK, the JerryScript scenarios at 8 and 14 KB, the framework model's workout (report the peak against 1.2.0's 98 KB).

## Device runs (owner: debug APK from this head, watch 1.3.0)
- **F1:** close M/ARC on the phone; log 3 sets on the watch with rests; open M/ARC: 3 sets saved, each at its tap time.
- **F2:** let a rest run out with the screen on: "Rest done", a vibration, OK back to Set.
- **F3:** change kg and reps on the watch, Complete: the phone saves those values.
- **F4:** allow Body sensors; the bpm line shows and updates about every 5 s.
- **F5:** Phone not connected shows its title and "Pending".
- **F6:** a whole workout with no crash.

## Other card fields
- **verification:** `npm run check`, `npm run test:tz`, `node --test 'native/wear/test/*.test.mjs'`, the watch build and `check-lite-js`, the JerryScript scenarios and the framework model, `verify-signed-bin.py`, hashes.
- **risk_and_recovery:** JS heap (1.2.0's model peak 98 KB; this adds about 4 to 6 KB; the GT 6's heap is unknown; 1.2.0 survived the owner's first gym run); a permission-bearing build over a no-permission one is untested on the GT 6 (1.1.0 over the permission-bearing 1.0.4 worked); heart rate's battery cost is unmeasured; Huawei may ask about `nx`, `rs` and `st` (name them in the next Modify as part of target and rest timer). Recovery: watch 1.2.0.
- **return:** head commit; criterion, test and red change; sizes; heap figures; hashes.

## Forecast (builder hours; device and review time not included)
Phone 3, watch 10, integration 1, review and red team 4: **18 h (range 12 to 28).**

## Review rulings (2026-10-17, second watch-lane session)
A fresh review of `3d1515d2`: pass with findings. The builder's changes to existing watch tests (Rest done before Set in four C2 tests, the 1.3.0 pins, the W4 handler pin, the Rest line list) are accepted: each is at least as strict. Fixed, each with a test that fails before (`c3.test.mjs`):
- **R1 (medium):** a double tap on Complete logged two sets. The page ignores a second Complete tap within 1 s; the link is unchanged, so its tests that tap twice on purpose stand.
- **R2 (low):** a set the phone reopened stayed locked. The lock is on the set id at the rev sent.
- **R3 (low):** the watch ran a rest the phone never starts (a warm-up, a late set). Online, the Complete's result, then a snap with no new rest, ends the local rest. This refines "Local rest" above: offline, or with the snap lost, the local rest runs as before.
- **R4 (nit):** the lock list's cap of 16 is now tested.
- Accepted as a known limit: the next sets reuse the shown set's load step (`nx` has no room for one). Recorded: the README C3 section; the watch-lane docs commits outside `write_scope` (research, red-team tools, the handover) carry no app or test code.
- Page sources stay at most 46,000 B by shortening comments (they are not in the compiled page).

## Red team rulings (2026-10-17, second watch-lane session)
The red team of `3d1515d2` (1 high, 1 medium, 6 low; no crash, loop, stack regression or bad storage write). F1 (double tap, high) and F2 (a rest the phone never starts, medium) are R1 and R3 above. Fixed, each with a test that fails before (`c3.test.mjs` R5 to R9, `tests/watch-link.test.ts` P3 rows):
- **R5 (F3):** offline, a queued +30 s on the phone's rest shows on the countdown at once, so it is not tapped again; a rest command refused as `stale_rest` (its rest ended) is silent, so a saved batch ends Saved, not Changed on phone. `c2.test.mjs` V1's pin moves with it (the offline countdown with the +30 s).
- **R6 (F5):** the Adjust draft is tied to the unit too, so a set the phone now shows in lb never sends a kg value as lb.
- **R7 (F6):** a phone rest that replaces a local rest that already rang does not ring again, nor show Rest done again after its OK.
- **R8 (F7):** `nx` gains each set's number, so sets done on the phone in between keep the watch's numbering; a bad number refuses the snap.
- **R9 (F8):** each keep-on unsubscribes the heart rate before it subscribes, so there is one subscription however often the app shows (L4's exact call list gains the first unsubscribe).
- **No change (F4):** an Adjust value comes back when the same set (same id and rev) is shown again: the draft is tied to the set's id and rev by design.
- **Heap (B3), at the final head:** the framework model needs 104 KB for workout W1 and 107 KB for W1C3 with the phone's 5-element `nx` (before the fixes 103 and 106 KB; 1.2.0: 96 and 98 KB), so 8 to 9 KB more than 1.2.0, not the card's 4 to 6 KB. The deepest stack is 13,728 B (1.2.0: 14,240 B). The 37 JerryScript scenarios run clean at 8 and 14 KB stacks. The GT 6's heap is unknown; 1.2.0 survived a real workout. A practice workout comes first, and 1.2.0 is the recovery.
- Page sources stay at most 46,000 B by removing comments that restate the code.

## Last red team rulings (2026-10-17)
The last red team of the fixes (`ce998f0`; 1 medium, 4 low, 1 nit; no crash, loop, stack regression or bad storage write). Fixed, each with a test that fails before (`c3.test.mjs` R10 to R16):
- **R10 (medium):** the tap guard covers every tap that changes the screen: a Complete, +30 s or Skip within 1 s of a Complete, Done, OK or Skip is ignored (Done sits 53 of its 62 px over Complete); two +30 s in a row both count.
- **R11:** Set N saved uses the next set's number, not its place in `nx`.
- **R12:** R7's carry-over applies only after the Complete's result, so a phone rest for a later set (logged on the phone) still rings and shows Rest done. R7's test now delivers the result before that set's rest, as the phone does.
- **R13:** online, a +30 s waits for the phone (as in 1.2.0), so a snap with it applied never counts it twice; the surviving-mutations C2 test is back to its original pin.
- **R14:** a batch ending in a silent `stale_rest` refusal ends on Back in sync and counts it, as an all-applied batch does.
- **R15:** only a `stale_rest` refusal is silent; any other refusal of a rest command keeps its text (Update needed).
- **R16:** a next set's number must be a whole number after `si` and at most `sn`; `null` refuses the snap.
- Unproven, no change: if the device's `unsubscribeHeartRate` always throws, subscriptions still pile up as before the fix.
