# Watch lane handover

Last update: 2026-10-17, by the second watch lane session. Read with `AGENTS.md`, `docs/WATCH-ARCHITECTURE.md`, the cards in this folder and `native/wear/README.md` (every device record).

## Current task
Branch `ccr-8cef8a15-l12swp` (the second session's designated branch; it starts from `ccr-061c7350-tjvpo6` @ `567a27e5`). Draft PR #221 still points at the old branch; its HANDOFF names this one.
1. **WATCH-C3 (watch 1.3.0) is done up to the device run.** Phone `f583f397`, watch `aa632927`, X3 `3d1515d2`; a fresh review and a red team ran on `3d1515d2`; fixes `cdbdd783` (R1 to R4) and `ce998f04` (R5 to R9); a last red team of the fixes; its fixes `0dd78bc5` (R10 to R16). Every finding is fixed with a test that fails before and a mutation that turns it red, or ruled (rulings at the end of `WATCH-C3.md`). On `0dd78bc5`: `npm run check` 3053/3053, `npm run test:tz` 3053/3053, watch tests 121/121; page sources 45,909 B (cap 46,000), compiled page 43,724 B, `check-lite-js` OK; 37 JerryScript scenarios clean at 8 and 14 KB stacks; the model's workouts need 104 KB (W1) and 107 KB (W1C3) of heap (1.2.0: 96 and 98 KB).
2. **Signed and sent:** 1.3.0 signed with the owner's debug files, `verify-signed-bin.py` and `verify-app` pass, hashes in README "watch 1.3.0". Sent privately with `native/wear/tools/owner-steps.md` (F1 to F6, a practice workout first) and the debug APK from M/ARC gate run 2144 (`66d979db`, artifact MARC-DEBUG-APK). Pushing to the branch cancels a running gate run (run 2142 was), so push nothing while one builds an APK the owner needs.
3. **Owner's 1.3.0 run (2026-10-18, Melbourne):** installed and used; his feedback became card **WATCH-C4** (six requests: heartbeat, done animation, highlights, -15 s, Adjust by 1 kg with decimals, dimming). F1 to F6 results not reported yet.
4. **WATCH-C4 in progress (loop running while the owner sleeps):** card `docs/watch-cards/WATCH-C4.md` (design and rulings), research `native/wear/research/2026-10-18-c4-platform.md`. Built: phone `40b1607`, highlights page `bab3314`, watch index `d78bd6a`. A fresh review failed it (the heart's `if` was a string, the offline header's a number: the engine draws an `if` only for the boolean true) and a red team found 1 medium and 6 low: fixes `7bb26e0` and `0ae1b2f`, each with a failing-first test. On `0ae1b2f`: check 3069/3069, test:tz 3069/3069, watch tests 157/157; compiled index 46,750 B (target 47,000), highlights page 5,866 B. Next: the last red team of the fixes (running), then sign 1.4.0 and send with G1 to G6 and the debug APK of the head's gate run (push nothing while it builds).

## Where things stand
- **Gates:** A done (Q1–Q6). B done (`WATCH-B.md`). C in progress: `WATCH-C.md` (protocol, outbox), `WATCH-C2.md` (C2 screens, Up next, watch 1.2.0), `WATCH-C3.md` (watch 1.3.0, sent).
- **On the owner's devices:** watch 1.2.0 and the debug APK from run 2113 until he installs 1.3.0 and the new APK. 1.2.0 is the recovery.
- **Waiting on the owner:** the 1.3.0 practice workout (F1 to F6); whether Settings > Down button offers M/ARC Watch.
- **Signing files:** in this session's scratch folder only. A new session needs them again, unless the owner adds `MARC_WATCH_SIGNING_ZIP_B64` to the environment (see Building and signing).

## Owner decisions (all recorded in `docs/WATCH-WEAR-ENGINE-APPLICATION.md` 11.3)
- 2026-10-16: phone sends exercise, target, set count, rest timer, theme; watch commands saved like phone sets.
- 2026-10-17: phone may also send last time's values and the exercises left with their next targets (Up next).
- Not approved without a Wear Engine Modify: heart rate saved on the phone, background answering (Gate D), undo, a phone ping that reopens the watch app. Name `nx`, `rs`, `st` and the plan message in that Modify.
- Before any release: a watch section in `docs/PRIVACY-POLICY.md` (heart rate on the watch included).

## Device facts that bite (details in README)
- Storage values must be under 128 bytes; never write an empty value (1.1.1's crash loop reset the watch). Keep the 1.1.2 storage hardening and restart guard.
- The GT 6 closes the app about 25 s after its screen goes dark; lowering the arm turns the screen off even with keep-on. No setting or API brings the app back on wrist raise.
- An `if` draws only for the boolean `true` (JerryScript's `jerry_get_boolean_value`): a number or a string counts as false. That, not "a text with if", is why two 1.2.0 lines did not draw. Keep `if` values boolean (`sc==1`, `!x`, boolean fields); the tests' page model refuses anything else.
- Huawei's own workout blocks other apps. Heart rate needs Body sensors allowed in watch Settings (error 602 until then).
- The GT 6 JS heap size is unknown; each build uses more (model, a workout: 1.1.2 77 KB, 1.2.0 96 to 98 KB, 1.3.0 104 to 107 KB).
- The phone's JS can see messages seconds late after a native freeze; the hello answer's `pt` is the receipt midpoint because of this.

## Building and signing (nothing secret goes in the repo)
- Build: README "Build without DevEco Studio" (public OpenHarmony 7.0 SDK), then `native/wear/build/build-lite-bin.sh <sdk> native/wear/app/entry/src/main <out> debug` with `NODE_OPTIONS=--openssl-legacy-provider`, then `check-lite-js.cjs`.
- Sign: `native/wear/build/sign-lite-bin.sh` with the owner's debug keystore, certificate and GT 6 profile (`marc_watch_debug.p12`, its password file, `.cer`, `_gt6.p7b`). They are secrets and stay out of this public repo (AGENTS.md: never commit keys). The owner holds them (sent privately on 2026-10-17: `marc_watch_debug.p12`, `marc_watch_debug-password.txt`, `marc_watch_debug.cer`, `marc_watch_debug_gt6.p7b`, plus `cert1.pem`, the root for `verify-signed-bin.py`, and the `.csr`) and gives them to the next session once; they are the only thing to ask for. Put them in that session's scratch folder, never in the repo. Read the password from its file into a variable; never print it. The password file is labelled: the key alias is on the `Key alias:` line; the password is the token after the last `: ` on the `Keystore password =` line (that line carries a label of its own first; the whole line fails with "Init keystore failed"). **Before asking the owner:** if the environment variable `MARC_WATCH_SIGNING_ZIP_B64` is set (the owner may add it in the cloud environment's settings), decode it into the scratch folder (`printf %s "$MARC_WATCH_SIGNING_ZIP_B64" | base64 -d > <scratch>/signing/s.zip`, then unzip there) and use that; never echo the variable. Verify with `verify-signed-bin.py`.
- Signed builds carry the owner's name and the watch UDID: never commit, attach to a PR or publish; send privately.
- The JerryScript red-team harness and the lite-framework heap model are in `native/wear/tools/redteam/` (see its README); the research and review outputs are in `native/wear/research/`; the C2 design is `docs/watch-cards/c2-watch-ux.png`; the owner's current test steps are `native/wear/tools/owner-steps.md` (one file, updated per build).

## Next after C3
Record Gate C (D1–D8 on the latest build), then plan Gate D (needs the Modify), the crown probe, dimming during rest (device check; may leave the system brightness changed), the Session and Heart pages.
