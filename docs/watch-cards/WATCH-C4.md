# WATCH-C4: heartbeat, workout done, highlights, -15 s, Adjust by 1 kg with decimals, dimming

- **id:** WATCH-C4 (Gate C follow-up; the owner's six requests of 2026-10-18, after installing 1.3.0).
- **base:** `ccr-8cef8a15-l12swp` @ `dc11ba5` (watch 1.3.0, `WATCH-C3`).
- **depends_on:** WATCH-C3; research of 2026-10-18 (`native/wear/research/2026-10-18-c4-platform.md`); `docs/WATCH-WEAR-ENGINE-APPLICATION.md` 11.
- **outcome:** watch 1.4.0. The heart rate stands out with a beating heart. When the workout is finished on the phone, the watch plays a short done animation, then shows a few highlights of that workout. The Rest screen has -15 s and +15 s, like the phone's rest timer. Adjust changes kg by 1 (1, 2, 3, ...) and has a decimal field (15.5 kg). During a workout the screen dims to its lowest when idle and comes back on a tap or wrist raise.

## Owner requests (2026-10-18, verbatim in substance)
1. "Design a heartbeat emphasis."
2. "When done, put some animation ... when workout is done."
3. "Watch should display few achievements about that workout, chosen highlights."
4. "I can see +15 secs when resting timer, no -15." (The phone's rest timer has -15 and +15.)
5. "Adjusting kg doesn't adjust orderly 1, 2, 3, 4, 5, 6; instead skips (1, 6, 12, 18)." 5.5: "Include decimal point, there are weights like 15.5 kg."
6. "Dim the watch screen when tilted or during workout to the lowest; when raised to wake or the screen is tapped, back to normal brightness."

## Decisions (phone)
- **Rest -15 s and +15 s (request 4):** two new watch command kinds, `rest_add_15` and `rest_sub_15`, beside `rest_add_30` (kept for older watches). `rest_add_15` is `rest_add_30` with 15 s. `rest_sub_15` takes up to 15 s off a running rest and never below 5 s left: with L s left, it removes `min(15, max(0, L - 5))` s (L at most 5: applied, no change). Both refuse an ended or replaced rest as `stale_rest`, like `rest_add_30`. Paused rests move their remaining time the same way (`addRestStep` with a negative step).
- **Highlights (request 3):** the phone sends them; it alone knows the whole workout. When there is no active session and the newest closed session (`commands.closed`) was `finished` at most 15 minutes ago, the snap carries `fin: [sessionId, hl]`. `hl` holds up to 4 ASCII lines of at most 24 characters, in this order:
  1. up to 2 new bests: an exercise whose best estimated 1RM in this session (working sets, `summarizeSets`) beats its best in every earlier session (it needs at least one earlier session): `Best: <name> <w> <u> x <r>` with that best set, the name shortened to fit 24 characters;
  2. `<M> min, <S> sets` (the session's `durationSec` rounded to minutes, and its sets as the phone's finish screen counts them);
  3. `<V> <u> lifted` (kg times reps of the working sets, in the profile unit, rounded to a whole number);
  4. `<E> exercises`.
  The watch adds its own heart-rate peak and average (never sent). A discarded session sends no `fin`. The snap stays at most 700 B.
- **Owner decisions (recorded in the application doc 11.3):** the owner's requests of 2026-10-18 approve the phone sending the watch those highlight lines and the two rest steps. Name `fin`, `rest_add_15` and `rest_sub_15` in the next Wear Engine Modify, with `nx`, `rs`, `st` and the plan message.

## Watch design (after the platform research, `native/wear/research/2026-10-18-c4-platform.md`)
- **Heartbeat (request 1):** the header shows a small heart image (`common/h.png`, about 24 px, accent red) and the bpm next to it in place of "M/ARC" while a heart-rate sample is fresh (15 s, as now); the heart pulses with an opacity animation (`@keyframes hb {from {opacity: 1} to {opacity: 0.3}}`, infinite, ease-out) whose bound `animation-duration` is 60000 / bpm ms, with bpm rounded to steps of 5. The heart is mounted once (in the header, outside the screen branches) to avoid the engine's per-mount leak; without a fresh sample its `div if` hides it and the header reads "M/ARC" as before. The 602 text ("Allow Body sensors") stays on the Set and Rest line; the bpm moves to the header. In memory only, the link keeps the session's heart-rate peak and average for the highlights (never stored or sent; reset on a new session id).
- **Rest -15 s and +15 s (request 4):** the Rest screen has three pills: "-15 s", "+15 s" and "Skip" (the "+30 s" pill goes). They send `rest_sub_15` and `rest_add_15` (outbox codes `m` and `p`, 5 fields like `a`), or change a local rest locally by the same rule (+15 s; -15 s never below 5 s left). Offline, queued steps show on the countdown at once, applied in order with the phone's rule. Outbox entries of 1.3.0 (`a`, `rest_add_30`) still load and send.
- **Adjust by 1 kg with decimals (request 5):** Adjust has three fields: whole load, decimals and reps. Whole: +1 or -1 (1, 2, 3, ...), keeping the decimals; it never goes to 0 or below, nor above 1000. Decimals: a wheel of .00, .25, .50, .75 that wraps without changing the whole number (a value off the wheel, such as 61.24, moves to the next quarter up or down); a value of 0 is refused. Reps: 1 to 100 as now. Swipe left and right move between the fields (right: next, left: previous, wrapping); up and down or the pills step the field. The label names the field: "KG" or "LB", "DECIMALS", "REPS". `st` is no longer used by Adjust (the phone still sends it; the snap check stays).
- **Idle dimming (request 6):** the GT 6 screen is AMOLED, so black pixels are off. During a session, after 15 s with no tap or swipe on Set or Rest, the watch shows an idle screen: black, with only the rest countdown or the set line in dark grey (#3a3a40) and the header in the same grey (the heart switches to a dark image, `common/hd.png`, by its bound `src`, so it is not remounted). Any tap or swipe wakes it (a root `onclick` and the swipe handler call `touch()`), as do `onShow`, a rest with 10 s or less left, Rest done, Adjust, and a screen change from the phone (a new set or exercise). The system brightness is never changed: `setValue` may stay changed after the app exits or is killed, and undoing that safely needs the user's brightness stored, a new kind of stored data. Arm-down already turns the screen off (system). If the owner still wants the system brightness lowered, that is a later card with his approval.
- **Workout done and highlights (requests 2 and 3):** a snap with no session whose `fin[0]` equals the session id the watch last had starts Done once per session id. When the outbox is empty and no storage call or job is running, the page calls `router.replace({ uri: 'pages/hl/hl', params })` with `h1` to `h5`: the phone's lines, then the watch's "Peak N bpm, avg M" when it has samples. A discard (no `fin`) or an unknown id keeps "No workout" as in 1.3.0.
- **Highlights page `pages/hl/hl`:** a separate page (its own 48 KB budget, no `link.js` or `wearengine.js`). On load: an accent ring grows from 0 to 240 px (width and height, ease-out, fill forwards), "Workout done" rises into place (translateY), then the lines fade in one by one (opacity 0 to 1, delays 600 to 1400 ms, fill forwards; their base opacity is 0), and the watch gives two short vibrations about 250 ms apart. A tap anywhere returns to the index page (`router.replace`). It keeps nothing.
- **Version 1.4.0 (1004000)**; permissions unchanged (VIBRATE, READ_HEALTH_DATA); page imports unchanged plus `@system.router`.

## Scope (watch builders)
- **Watch builder (index):** `native/wear/app/entry/src/main/js/default/common/**` (link.js and the two PNGs), `pages/index/**`, `config.json`, `native/wear/test/link.test.mjs` (W4 spec changes only), `native/wear/test/c2.test.mjs` and `c3.test.mjs` (spec changes the card names), a new `native/wear/test/c4.test.mjs`.
- **Watch builder (highlights page):** `native/wear/app/entry/src/main/js/default/pages/hl/**` and a new `native/wear/test/c4hl.test.mjs`.
- **reserved_paths:** `wearengine.js`, `native/wear/build/**`, `native/wear/android/**`, everything the phone builder owns.

## Acceptance (watch)
Each new test fails before and passes after. Spec changes to existing tests, each at least as strict: W4's file list gains the highlights page and the two PNGs (the ASCII rule covers the text files); the version is 1.4.0; the page imports add `router`; index-side page sources (app.js, common, pages/index, wearengine.js) at most 49,000 B, the compiled index page at most 46,000 B and the compiled highlights page at most 6,000 B (`check-lite-js` enforces 48,000 per page). The Rest pills and lines (`+30 s` becomes `-15 s`, `+15 s`), the bpm moving from the Set and Rest lines to the header, and Adjust's +/- by field replace the C2 and C3 pins that assert the old values.
- **L6 Adjust:** 59, 60, 61, ... by 1 from any start; decimals .00/.25/.50/.75 wrap; 61.24 moves to 61.25 up and 61.00 down; 0 and 1000 bounds; lb; fields cycle both ways; the draft tied to id, rev and unit; Complete sends it; the outbox slot under 120 characters (999.75).
- **L7 Rest:** the pills; `rest_add_15` and `rest_sub_15` on the wire and in storage; a local rest +15 s and -15 s (floor 5 s); offline queued steps on the countdown (60 s: -15, -15, -15, -15 gives 5 s; then +15 gives 20 s); a 1.3.0 `a` entry in storage loads and sends `rest_add_30`.
- **L8 Heart:** the header heart and bpm with a fresh sample, "M/ARC" without; the duration for 60, 128 and 182 bpm (5-bpm steps); the heart element mounted once across screen changes; peak and average in memory, reset on a new session, in no message or storage.
- **L9 Idle:** idle after 15 s without a tap on Set and Rest only; every wake source; the idle lines; no brightness value call.
- **L10 Done:** the replace call with its params once the outbox is empty; not before; not for a discard, an unknown id or a second snap of the same id.
- **L11 Highlights page:** the params shown, the animation styles (names, durations, delays, fill forwards, base opacity 0), two short vibrations, a tap returns to index, no `link.js` or `wearengine.js` import, ES5 and ASCII.
- **B4:** the sizes above; the JerryScript scenarios at 8 and 14 KB stacks; the model's workout heap against 1.3.0's 104 and 107 KB.

## Device runs (owner: debug APK from this head, watch 1.4.0)
- **G1:** the heart pulses next to the bpm, faster as the heart rate rises.
- **G2:** Rest: -15 s and +15 s change the phone's rest too; Skip.
- **G3:** Adjust: kg 60, 61, 62 by +; decimals to 15.5; Complete; the phone saves it.
- **G4:** leave the watch 15 s on Rest: it goes dark grey; a tap brings it back; raise the wrist after the screen went off: does it come back bright or stay grey until a tap?
- **G5:** finish the workout on the phone: the done animation, two buzzes, the highlights; a tap returns.
- **G6:** a whole practice workout with no crash.

## Risks
JS heap (1.3.0's model peak 104 to 107 KB; the highlights page keeps its code off the index page); the per-mount animation leak (the heart mounted once); onShow on wrist raise is unknown (G4 tells; a tap always wakes); the GT 6's handling of a bound animation duration (G1; the fallback is image-animator).

## Scope (phone builder)
- **write_scope:** `src/core/models.ts` (the two kinds only), `src/slices/workout/commands.ts`, `src/native/watchLink.ts`, `tests/watch-link.test.ts`, `tests/workout/watch-commands.test.ts` (an add-only block), `tests/watch-contract.test.ts` (an add-only block), `docs/WATCH-WEAR-ENGINE-APPLICATION.md` (11.3 only).
- **reserved_paths:** `native/wear/**` (the watch builder's), `src/slices/workout/session.ts`, `Train.tsx`, the rest of `src/**`, `.github/**`.

## Acceptance (phone)
Each new test fails before and passes after.
- **P4:** `rest_add_15` and `rest_sub_15`: parsed and refused like `rest_add_30` (bad rest id, ended rest, wrong session, replay); +15 moves the end by 15 s; -15 with 60, 12, 5 and 3 s left gives 45, 5, 5 and 3 s; paused rests the same on their remaining time; the rest-done notification is rescheduled to the new end; receipts store the kind.
- **P5:** `fin` only after a finish (not a discard, not with an active session, not after 15 minutes); the lines and their order for a session with 0, 1 and 3 new bests (at most 2 shown); names shortened to 24 characters; lb profile; ASCII only; the snap at most 700 B with the longest names.
- **X4 (contract):** the phone's real snap after `finishSession` carries `fin` with the session id the watch had.

## Build rulings (2026-10-18)
- **Compiled index target 47,000 B (was 46,000 B):** the index builder's build compiles to 46,631 B with every requested feature; cutting a requested feature to save 631 B is not worth it, and 47,000 keeps 1.4 KB under `check-lite-js`'s hard 48,000 B. The highlights page is 5,868 B (target 6,000 B).
- **Heap:** the model's workouts need 113 KB (W1) and 115 KB (W1C3), about 8 KB more than 1.3.0 measured the same way. The GT 6's heap is unknown and 1.3.0 ran on the device, so the practice workout (G6) comes first and 1.3.0 is the recovery.
- **Highlights lines (L11, builder's change):** an opacity animation never changes an element's own opacity on lite, so lines at base opacity 0 would never show, and a delayed fade alone flashes each line during its delay. The lines are uncovered instead by a box that opens from height 0 (each line starts to show at 600, 800, 1000, 1200 and 1400 ms and stays). The page ignores taps in its first second, like the index page.
- **Heart placement (index builder):** the heart sits in an always-shown header row (inside the online header branch the stack model overflowed 14 KB on a reconnect), so it also shows next to "Phone not connected"; offline, the bpm stays on the Set and Rest line as in 1.3.0.
- **Idle screen:** one grey 52 px line (the countdown, or the set's target such as "60 kg x 8") and a grey header; a swipe on it wakes it and also acts as a normal swipe.
- **Adjust bounds:** at the top, +1 clamps to 1000; a step that would reach 0 or below is ignored.

## Review rulings (2026-10-18)
A fresh review of `38e4240`: fail, 1 high, 1 medium, 2 low, 2 nits. All fixed, each with a test that fails before (`c4.test.mjs` R17 and R18, the strict `if` model in `c3` and `c4`, the P5 pins):
- **High, the heart never drew:** the engine shows an `if` only for the boolean `true` (`jerry_get_boolean_value`), and `hd` was a string. The heart's `if` is now `hv` (a boolean). This also explains the 1.2.0 device run: the two lines that did not draw had `if` values that were a number (`off`) and a string (`t1`), not "a text with if". The test model now refuses a plain `if` binding that is not a boolean (R17 checks every `if` in every state).
- **Medium, Phone not connected never drew (since 1.3.0):** `off` is a number; the `if` is now `off==1`.
- **Low, a paused rest kept the screen bright:** the 10 s wake now fires once per rest and never for a paused rest (R18).
- **Low, B4 evidence:** the scenario runs and heap are recorded at the final head (Last red team below); the builder's phantom `f*` glob is noted in the red-team tools README.
- **Nit, names cut mid-word:** a best now reads `PR <name> ...` (the phone's own PR badge word), its name cut to whole words; with no whole word, the first word cut when 4 or more letters fit; else the best is left out.
- **Nit:** the stale 46,000 B comment in W4 now says 47,000 B.

## Red team rulings (2026-10-18)
The red team of `38e4240` (1 medium, 6 low; Done, the restart guard and the highlights page held). Fixed, each with a test that fails before (`c4.test.mjs` R19 to R22, `tests/workout/watch-commands.test.ts` "a watch load is checked against its own unit limit"):
- **Medium, loads over 1,000 lb (R19):** Adjust and the phone capped every unit at 1,000. Both now use the phone's own limit (`MAX_LOAD` in `src/core/parse.ts`: 1,000 kg, 2,200 lb).
- **Done never retried (R20):** if the engine drops the page switch, Done is tried again every 3 ticks while the index page lives; a new session's Done is not delayed by an earlier one. L10's "once" assertions now say what happens: a second fin starts nothing; the same Done repeats 3 ticks later while the page lives.
- **Heart rates outside 25 to 250 bpm (R21):** ignored (the header, the pulse and the peak keep the last good sample); a missing or failed sample still marks it stale. L8's pin `[1, '12000ms']` becomes `[25, '2400ms'], [250, '240ms']`.
- **onShow did not redraw (R22):** it paints at once, so a wrist raise does not leave the idle screen up to the next tick.
- **Known limit, offline -15 s and +15 s (F2):** the watch applies a queued step at its tap, the phone at its receipt (WATCH-ARCHITECTURE 6: a late step never restarts an ended rest), so an offline countdown can end earlier or later than the phone's. The phone's snap replaces the watch's countdown when it is back.
- **Known limit, the restart guard with slow storage (F3):** with storage writes over about 4 s, the closing page's clean mark can land after the reopened page's running mark, so one crash in the next 30 s is not counted; the next one is.
- **Accepted (F7):** each heart-rate gap over 15 s remounts the heart (about 150 to 200 B of native memory each; 5 in the model's workout with a 602 every 5 minutes).
- Index-side sources stay at most 49,000 B by dropping comments the README covers.
