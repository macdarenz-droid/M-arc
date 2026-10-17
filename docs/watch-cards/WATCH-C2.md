# WATCH-C2: the C2 watch screens and Up next

- **id:** WATCH-C2 (Gate C follow-up of `docs/WATCH-ARCHITECTURE.md`; design: the approved C2 page 3 of the Wear Engine application, and the owner's canvas "M/ARC Watch screens", 2026-10-17).
- **base:** `ccr-061c7350-tjvpo6` @ `19d90897`.
- **depends_on:** WATCH-C (protocol `mw` v1, outbox, watch 1.1.2), the owner's decisions of 2026-10-17 (`docs/WATCH-WEAR-ENGINE-APPLICATION.md` 11.3: last time, and the exercises left).
- **outcome:** watch 1.2.0 shows the C2 screens: Set, Up next, Rest, Phone not connected, Back in sync and No workout. The owner can pick the next exercise on the watch; picking stays on the watch, and only the approved commands go to the phone.

## Decisions
- **Later, not in this card:** the heart-rate page (needs the watch's Body sensors permission, a privacy section and a device check) and the Session page with Pause, Resume and Finish (Gate D). Calories are not shown: no source.
- **Fixed dark palette** from C2 (the watch face is AMOLED, and C2 is dark): background `#08090a`, text `#f7f8f8`, label `#a9aef0`, muted `#8a8f98`, pill `#232428`, accent `#5e6ad2`, warning `#f2b56b`. The snap's `th` is still read (view fields `bg`, `fg`, `ac` as today) but the screens do not use it.
- **No bold, one font** (HYQiHei-65S; lite has no font-weight): hierarchy comes from size, colour and letter-spacing. Pills are a `div` with `border-radius` = height/2 and a centred `text` (the GT 6-proven way). Every `text` has a fixed width and height. No `line-height`, `position`, `font-weight`, `align-self`, `flex-grow`, class binding, swiper `indicator` or non-ASCII text: "x" not ×, no ✓.
- **Paging by `onswipe`** on the root (proven on the GT 6), not a swiper: two pages. Page 0 is Rest while the phone's rest counts down (or is paused with time left), else Set; page 1 is Up next. A swipe up or down switches page. The page dots and the rest ring were dropped under the budget fallback (build of 2026-10-17).
- **Pick on the watch:** tapping a row in Up next makes that exercise the watch's current one and returns to page 0. The pick holds while the phone's shown exercise (`eid`) stays the same and the picked exercise still has an open set; it clears when `eid` or `sid` changes, or the row leaves the plan. Complete sends `complete_set` for the picked exercise's set, with its own `id` and `rev`. Nothing about the pick is sent or stored.
- **Rest appears only from the phone's rest** in a snap (so "Set N saved" is true), and only while it counts down: the phone keeps an ended rest, and Complete must stay reachable (red team, 1c6b2d81). The sent set stays on Set with "Pending hh:mm:ss" until the result.
- **Numbering:** "SET a OF b" counts the sets that are not skipped: a is the sets committed plus 1, b the sets not skipped, from the plan row of the exercise shown, picked or not (the snap's position when the plan has no row for it, or while the row's open set differs from the snap's set).
- **Offline:** with nothing pending, Set and Rest stay usable and the header shows "Phone not connected" in the warning colour; with something pending, the Phone not connected screen shows (the set is locked anyway).
- **Back in sync** shows for 3 ticks when the outbox empties after being offline with something pending, then returns by itself (no Continue tap). A refusal keeps its reason through the results still queued, offline, online or after a restart, and a batch with a refusal shows no Back in sync.
- **A hello after each applied result** (2 ticks later), so a watch clock step is corrected during a workout (red team of `d303bbce`, RT5).
- **Build:** babel `comments: false` and `compact: true` (without `compact` the page was 47,103 B; Huawei's release mode minifies too) through a wrapper around Huawei's webpack config in `build-lite-bin.sh`; it fails the build unless it finds exactly one babel rule. The executed code is token-identical (`c2-feas` budget research, 2026-10-17). Huawei's `wearengine.js` stays byte-identical.

## Protocol additions (`mw` v1; older watches ignore them)
- **snap** gains `eid` (the shown exercise's entry id, or null) and `lt` (last time for `set`: `{w, u, r}`, or null). Still at most 700 B.
- **plan** (phone, new, at most 1000 B, ASCII): `{t, v, k: "plan", sid, srev, sd, st, rows}`.
  - `sd`: sets committed in the session; `st`: sets in the session that are not skipped.
  - `rows`: up to 4 entries that are not done or skipped and still have a set to log, starting with the shown one and then in display order, wrapping round. Each is `{id, ex, d, n, set, lt}`: entry id, ASCII name (at most 24), sets committed, sets not skipped, its open set as in snap (`null` for anything but plain weight), and last time for that set.
  - Rows are dropped from the end until the JSON fits 1000 B.
  - Sent after the snap that answers a hello, and whenever its projection changes (with the snap's 300 ms limit). Never while hidden, held or stopped, and never without a session. A plan whose send failed goes again with the next sync (review, 1c6b2d81).
- The watch refuses a plan over 2,048 characters or with a field of the wrong type, as it does a snap.

## Screens (466 x 466; sizes are targets, the builder may move a few px)
- **Header** (all screens): "M/ARC" left and the watch clock "hh:mm" right, 18 px, a row of 200 px. Offline: "Phone not connected" in the warning colour instead.
- **Set:** exercise name 30 px, with ">" in the label colour (tap: Up next); "SET 2 OF 3" 16 px muted, letter-spacing 2 px; "Target" 18 px label; the value 52 px ("54 kg x 10", "12 reps", or "Log on phone"); "Last time 52 kg x 10" 18 px muted (only with `lt`); Easy, Ideal and Max pills 92 x 46 (the chosen one in the accent; tap again to clear); the Complete pill 260 x 62, "Complete set" in the accent, or dark with "Pending hh:mm:ss" while its set is pending or locked; one 18 px status line for "Changed on phone", "Workout ended", "Not saved", "Queue full" and "N pending".
- **Rest:** "REST" 16 px label; the countdown 100 px; one 18 px muted line ("Set 2 saved", or the status); "Next: Chest press" 22 px (tap: Up next) and "Set 3 of 3, 54 kg x 10" 18 px muted with "Change" in the label colour; "+30 s" (accent) and "Skip" (dark) pills 130 x 58. (The arc ring was dropped under the budget fallback.)
- **Up next:** "UP NEXT" 16 px label; "8 of 21 sets done" 18 px muted; up to 4 rows 316 x 52 (the current one in the accent): the name left and "d/n" right, 20 px.
- **Phone not connected:** the warning title; "N actions" and "Pending" 44 px (Pending in the label colour); "Rest mm:ss" muted (only with a rest); "Open M/ARC" and "on your phone" 22 px.
- **Back in sync:** "Phone connected"; "Saved" 56 px; "N actions" 20 px label; "Rest mm:ss" (only with a rest).
- **No workout:** "Start your workout" 30 px; "in M/ARC on your phone" 20 px muted. **Paused after restarts** and **Update needed** stay as in 1.1.2.

## Scope
- **write_scope:** `native/wear/app/**` (version 1.2.0, 1002000), `native/wear/test/**`, `native/wear/build/build-lite-bin.sh` (the babel wrapper only), `native/wear/README.md`, `src/native/watchLink.ts`, `tests/watch-link.test.ts`, `tests/watch-contract.test.ts`, this card.
- **reserved_paths:** everything else, notably `wearengine.js` (byte-identical), `WearEnginePlugin.java`, `src/core/**`, `src/slices/workout/**`, `.github/**`.

## Acceptance
Each new test fails before and passes after. Existing tests stay as they are, except these deliberate spec changes in `native/wear/test/link.test.mjs` W4, each at least as strict: the version pin (1.2.0), the page sources cap (42,000 B, from 34,000; the compiled page stays at most 46,000 B and `check-lite-js` enforces 48,000), and the markup pin of button labels (replaced by a pin of the new labels and handlers). In `native/wear/test/c2.test.mjs`, V1 Rest's ended rest (0:00) becomes the Set screen, and the paint-order test follows the final paint (screen, then its inner parts). In `tests/watch-contract.test.ts`, the clock block's hello counts cover only the start hellos (before the first command), because 1.2.0 also says hello after each applied set (integration, 2026-10-17).
- **P1** (phone, `tests/watch-link.test.ts`): snap `eid` and `lt`; plan rows (order from the shown one, wrap, cap 4, done and skipped left out, plain weight only for `set`, `lt` values, counts), at most 1000 B and ASCII with long names, sent after a hello answer and on change only, never while hidden or held.
- **V1** (watch): each screen's view fields from the snap, plan and outbox state, including the header clock, offline header, Pending label and status line (the dots were dropped).
- **V2** (watch): swipe paging, pick, the pick holding across a snap with the same `eid` and clearing on a new `eid`, `sid` or a row leaving; Complete on a picked row sends that set's `id`, `rev`, values and effort.
- **V3** (watch): Back in sync for 3 ticks and only after offline pending; Rest only from a snap's rest; a hello 2 ticks after each applied result.
- **V4** (watch): a bad plan (wrong types, over 2,048 characters, `toString` tricks) changes nothing.
- **X2** (contract, `tests/watch-contract.test.ts`): the watch's own `link.js` against `createLink`: pick a row from a real plan, Complete, and `handleWorkoutCommand` commits that set; the pick survives the next snap.
- **B1** (build): the compiled page at most 46,000 B with `check-lite-js` OK; the red team's JerryScript scenarios (rt-e) still pass on the new page, plus plan scenarios.

## Device runs (owner: debug APK from this head, watch 1.2.0)
- **E1:** every screen shows as on the canvas: sizes readable, pills round, no clipped text at the round edge, the clock right.
- **E2:** pick another exercise in Up next, Complete: the phone logs that exercise's set; the watch stays on it for the next set.
- **E3:** open another card on the phone: the watch follows it.
- **E4:** D1 and D8 of WATCH-C on 1.2.0.

## Other card fields
- **verification:** `npm run check`, `npm run test:tz`, `node --test 'native/wear/test/*.test.mjs'`, the watch build with `check-lite-js.cjs`, the rt-e JerryScript run, `verify-signed-bin.py`, hashes recorded.
- **risk_and_recovery:**
  - Lite rendering is unverified for the 100 px countdown, rounded `div`s, ellipsis and the arc ring (E1). Fallback: smaller sizes, square pills.
  - The page budget: measured at about 41.6 KB for four screens without comments; Up next adds about 2 KB. Fallback: drop the ring, then the dots.
  - A local pick against the phone's open card (handled by `eid`).
  - Huawei may ask about the plan message (11.3 note); the next Modify names it.
  - **JS heap and stack (red team, 1c6b2d81 and 611b09c8):** the GT 6's heap and stack sizes are unknown, and the red team's model of the lite framework is not calibrated to the watch. In that model a workout peaks at about 77 KB on 1.1.2 (which ran on the GT 6) and about 98 KB on 1.2.0; the fix round missed its target of 86 KB (shared text slots cut the page data from 37 keys to 21 and the 2 h remounts from 910 to 89, but not the peak). The final paint change builds each screen before its inner parts, as 1.1.2 did, so the model's workout now needs a 14 KB stack, against 13 KB for 1.1.2 (15 KB before). Running out is a fatal exit, and one later than 30 s into a run is not counted by the restart guard. Mitigation: E1 is a practice workout with Up next, picks, rests and an offline spell, before any real workout; it is the gate. Recovery: reinstall 1.1.2. Fallback build if E1 shows exits on screen changes: `show` instead of the nested `if`s plus a deferred paint (the review's FD variant, about 3 KB less in the model).
  - Recovery: reinstall watch 1.1.2.
- **return:** head commit; criterion, test and red-making change; the compiled size; hashes.

## Forecast (builder hours; device and review time not included)
Phone 3, watch 8, build and signing 2, review and red team 3: **16 h (range 11 to 24).** Assumes the screens fit the budget and lite draws them as the research says.
