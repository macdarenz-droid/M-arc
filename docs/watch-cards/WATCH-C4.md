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

## Decisions (watch): see "Watch design" below (written after the platform research)

## Scope (phone builder)
- **write_scope:** `src/core/models.ts` (the two kinds only), `src/slices/workout/commands.ts`, `src/native/watchLink.ts`, `tests/watch-link.test.ts`, `tests/workout/watch-commands.test.ts` (an add-only block), `tests/watch-contract.test.ts` (an add-only block), `docs/WATCH-WEAR-ENGINE-APPLICATION.md` (11.3 only).
- **reserved_paths:** `native/wear/**` (the watch builder's), `src/slices/workout/session.ts`, `Train.tsx`, the rest of `src/**`, `.github/**`.

## Acceptance (phone)
Each new test fails before and passes after.
- **P4:** `rest_add_15` and `rest_sub_15`: parsed and refused like `rest_add_30` (bad rest id, ended rest, wrong session, replay); +15 moves the end by 15 s; -15 with 60, 12, 5 and 3 s left gives 45, 5, 5 and 3 s; paused rests the same on their remaining time; the rest-done notification is rescheduled to the new end; receipts store the kind.
- **P5:** `fin` only after a finish (not a discard, not with an active session, not after 15 minutes); the lines and their order for a session with 0, 1 and 3 new bests (at most 2 shown); names shortened to 24 characters; lb profile; ASCII only; the snap at most 700 B with the longest names.
- **X4 (contract):** the phone's real snap after `finishSession` carries `fin` with the session id the watch had.
